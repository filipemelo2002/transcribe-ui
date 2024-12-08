import { SubtitleService, SubtitleSettings } from "@/services/subtitle.service";
import { Segment, TranscribeAIService } from "@/services/transcribe-ai.service";
import { VideoService } from "@/services/video.service";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { ChangeEvent, useRef, useState } from "react";

const SUBTITLE_SETTINGS_INITIAL_STATE: SubtitleSettings = {
  speakerIdMap: {},
  speakerInCaptions: false,
  multiColorCaptions: false,
  wordedCaptions: true
}
export function useDashboard({
  transcribeService,
  subtitleService
}: {
  transcribeService: TranscribeAIService,
  subtitleService: SubtitleService
}) {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState<Blob | null>(null);
  const [assCaption, setAssCaption] = useState<Blob | null>(null);
  const [segments, setSegments] = useState<Segment[]>([])
  const [processing, setProcessing] = useState(false);
  const [subtitleSettings, setSubtitleSettings] = useState<SubtitleSettings>(SUBTITLE_SETTINGS_INITIAL_STATE)
  const inputElement = useRef<HTMLInputElement>(null)
  const {ffmpeg, ffmpegAvailable, loadFFmpeg} = useFFMpeg()

  const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const resetForm = () => {
    setFile(null)
    setCaption(null)
    setSubtitleSettings(SUBTITLE_SETTINGS_INITIAL_STATE)
    if (inputElement.current) {
      inputElement.current.value = ''
    }
  }
  const onProcessFile = async () => {
    if (file) {
      setProcessing(true);
      await loadFFmpeg()
      try {
        const response = await transcribeService.transcribe(file)
        setSubtitleSettings({
          ...subtitleSettings,
          speakerIdMap: getUniqueSpeakerIds(response).reduce((obj, id) => ({...obj, [id]: ''}), {})
        })
        setCaption(subtitleService.processVttFile(response, subtitleSettings))
        setAssCaption(subtitleService.processAssFile(response))
        setSegments(response)
      } catch (exception) {
        console.error(exception)
      } finally {
        setProcessing(false)
      }
    }
  };

  const onChangeSubtitleSettings = (settings: SubtitleSettings) => {
    setSubtitleSettings(settings)
    setCaption(subtitleService.processVttFile(segments, settings))
  }

  const onDownloadMedia = async () => {
    if (ffmpegAvailable && file && assCaption) {
      const videoService = new VideoService(ffmpeg)
      const videoFile = await videoService.processVideo({media: file, subtitle: assCaption})
      saveFile(videoFile)
    }
  }

  console.log({ffmpegAvailable, file, assCaption, ffmpeg})
  return {
    file,
    onChangeFile,
    onProcessFile,
    processing,
    caption,
    inputElement,
    showPreview: file && !processing,
    resetForm,
    subtitleSettings,
    onChangeSubtitleSettings,
    onDownloadMedia,
    disableDownloadMedia: !ffmpegAvailable || !file || !assCaption
  }
}


function getUniqueSpeakerIds (segments: Segment[]) {
  const ids = new Set<string>()

  for (const segment of segments) {
    if (ids.has(segment.speaker_id)) {
      continue
    }
    ids.add(segment.speaker_id)
  }
  return Array.from(ids)
}

export function useFFMpeg() {
  const [loaded, setLoaded] = useState(false)
  const ffmpegRef = useRef<FFmpeg>(new FFmpeg())
  
  const load = async () => {
    if (loaded) return
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("log", ({ message }) => {
      console.log(message)
    });

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    console.log("finished")
    setLoaded(true)
  };

  return {
    ffmpeg: ffmpegRef.current,
    ffmpegAvailable: loaded,
    loadFFmpeg: load
  }
}

function saveFile (blob: Blob) {
  const a = document.createElement('a');
  a.download = 'video-final.mp4';
  a.href = URL.createObjectURL(blob);
  a.addEventListener('click', () => {
    setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
  });
  a.click();
};