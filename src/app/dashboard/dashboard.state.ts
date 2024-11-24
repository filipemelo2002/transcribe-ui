import { SubtitleService, SubtitleSettings } from "@/services/subtitle.service";
import { Segment, TranscribeAIService } from "@/services/transcribe-ai.service";
import { ChangeEvent, useRef, useState } from "react";

const SUBTITLE_SETTINGS_INITIAL_STATE: SubtitleSettings = {
  speakerIdMap: {},
  speakerInCaptions: false,
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
  const [segments, setSegments] = useState<Segment[]>([])
  const [processing, setProcessing] = useState(false);
  const [subtitleSettings, setSubtitleSettings] = useState<SubtitleSettings>(SUBTITLE_SETTINGS_INITIAL_STATE)
  const inputElement = useRef<HTMLInputElement>(null)

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
      try {
        const response = await transcribeService.transcribe(file)
        setSubtitleSettings({
          ...subtitleSettings,
          speakerIdMap: getUniqueSpeakerIds(response).reduce((obj, id) => ({...obj, [id]: ''}), {})
        })
        setCaption(subtitleService.processVttFile(response))
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
    onChangeSubtitleSettings
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