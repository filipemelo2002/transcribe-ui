import { SubtitleService } from "@/services/subtitle.service";
import { TranscribeAIService } from "@/services/transcribe-ai.service";
import { ChangeEvent, useRef, useState } from "react";

export function useDashboard({
  transcribeService,
  subtitleService
}: {
  transcribeService: TranscribeAIService,
  subtitleService: SubtitleService
}) {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState<Blob | null>(null);
  const [processing, setProcessing] = useState(false);
  const inputElement = useRef<HTMLInputElement>(null)

  const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const resetForm = () => {
    setFile(null)
    setCaption(null)
    if (inputElement.current) {
      inputElement.current.value = ''
    }
  }
  const onProcessFile = async () => {
    if (file) {
      setProcessing(true);
      try {
        const segments = await transcribeService.transcribe(file)
        setCaption(subtitleService.processVttFile(segments))
      } catch (exception) {
        console.error(exception)
      } finally {
        setProcessing(false)
      }
    }
  };
  
  return {
    file,
    onChangeFile,
    onProcessFile,
    processing,
    caption,
    inputElement,
    showPreview: file && !processing,
    resetForm
  }
}