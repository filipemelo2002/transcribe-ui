import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubtitleService } from "@/services/subtitle.service";
import { Segment, TranscribeAIService } from "@/services/transcribe-ai.service";
import { AudioLines, Loader, Trash } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";

const subtitleService = new SubtitleService()

export const Dashboard = () => {
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [segments, setSegments] = useState<Segment[]>(JSON.parse(localStorage.getItem('transcribe-ai') || '[]'));
  const [processing, setProcessing] = useState(false);
  const inputElement = useRef<HTMLInputElement>(null)

  const onChangeAudio = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setMediaFile(event.target.files[0]);
    }
  };

  const resetForm = () => {
    setMediaFile(null)
    if (inputElement.current) {
      inputElement.current.value = ''
    }
  }
  const onProcess = async () => {
    if (mediaFile) {
      setProcessing(true);
      try {
        const service = new TranscribeAIService()
        const segments = await service.transcribe(mediaFile)
        localStorage.setItem('transcribe-ai', JSON.stringify(segments))
        setSegments(segments)
        console.log(segments)
      } catch (exception) {
        console.error(exception)
      } finally {
        setProcessing(false)
      }
    }
  };
  return (
    <div className="flex w-full min-h-screen bg-background text-foreground font-sans items-center justify-center">
      {
        mediaFile && (
          <video id="video" controls preload="metadata">
            <source src={URL.createObjectURL(mediaFile)} type="video/mp4" />
            <track
              kind="subtitles"
              label="English"
              srcLang="en"
              default
              src={URL.createObjectURL(subtitleService.processVttFile(segments))} />
          </video>
        )
      }
      
      <div className="mt-auto mb-auto ml-auto mr-auto">
        <Card className="max-w-[350px]">
          <CardHeader>
            <CardTitle>Transcribe.ai</CardTitle>
            <CardDescription>Transcribe videos in one-click.</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <Label htmlFor="audio">Video file</Label>
              <div className="flex gap-2">
                <Input id="audio" type="file" onChange={onChangeAudio} ref={inputElement}/>
                {mediaFile && (
                  <Button
                    variant="outline"
                    type="button"
                    className="hover:text-red-500"
                    disabled={processing}
                    onClick={resetForm}
                  >
                    <Trash />
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onProcess} disabled={processing}>
              {processing && <Loader className="animate-spin" />}
              {!processing && <AudioLines />}
              Process
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
