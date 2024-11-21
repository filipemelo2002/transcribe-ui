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
import { Skeleton } from "@/components/ui/skeleton";
import { SubtitleService } from "@/services/subtitle.service";
import { TranscribeAIService } from "@/services/transcribe-ai.service";
import { AudioLines, Loader, Trash } from "lucide-react";
import { useDashboard } from "./dashboard.state";

const subtitleService = new SubtitleService()
const transcribeService = new TranscribeAIService()

export const Dashboard = () => {
  const {
    file,
    caption,
    showPreview,
    processing,
    onProcessFile,
    resetForm,
    inputElement,
    onChangeFile
  } = useDashboard({
    transcribeService,
    subtitleService
  })
  return (
    <div className="flex w-full min-h-screen bg-background text-foreground font-sans items-center justify-center gap-3 flex-wrap-reverse">
      {
        (showPreview) && (
          <div className="aspect-video max-w-[474px] w-11/12">
            <video id="video" controls preload="metadata" className="w-full h-full">
              <source src={URL.createObjectURL(file as File)} type="video/mp4" />
              {
                caption && (
                  <track
                    kind="subtitles"
                    label="English"
                    srcLang="en"
                    default
                    src={URL.createObjectURL(caption)} />
                )
              }
            </video>
          </div>
        )
      } 
      {
        processing && (
          <Skeleton className="w-[474px] h-[266px]" />
        )
      }
        <Card className="max-w-[350px]">
          <CardHeader>
            <CardTitle>Transcribe.ai</CardTitle>
            <CardDescription>Transcribe videos in one-click.</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <Label htmlFor="audio">Video file</Label>
              <div className="flex gap-2">
                <Input id="audio" type="file" onChange={onChangeFile} ref={inputElement}/>
                {file && (
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
            <Button variant="outline" onClick={onProcessFile} disabled={processing}>
              {processing && <Loader className="animate-spin" />}
              {!processing && <AudioLines />}
              Process
            </Button>
          </CardFooter>
        </Card>
    </div>
  );
};
