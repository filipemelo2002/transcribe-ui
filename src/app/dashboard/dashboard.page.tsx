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
import { AudioLines, Film, Loader, Trash } from "lucide-react";
import { useDashboard } from "./dashboard.state";
import { Checkbox } from "@/components/ui/checkbox";

const subtitleService = new SubtitleService();
const transcribeService = new TranscribeAIService();

export const Dashboard = () => {
  const {
    file,
    caption,
    showPreview,
    processing,
    onProcessFile,
    resetForm,
    inputElement,
    onChangeFile,
  } = useDashboard({
    transcribeService,
    subtitleService,
  });

  const containerMaxWidth = (showPreview || processing) ? 'max-w-[1140px]' : 'max-w-[350px]';

  return (
    <div className="flex flex-col w-full min-h-screen bg-background text-foreground font-sans items-center justify-center">
      <div className={`flex flex-col w-full ${containerMaxWidth} gap-3 p-3`}>
        <div className="flex gap-3 lg:flex-nowrap md:flex-wrap-reverse items-center justify-center w-full">
          {showPreview && (
            <div className="aspect-video w-full">
              <video
                id="video"
                controls
                preload="metadata"
                className="w-full h-full"
              >
                <source
                  src={URL.createObjectURL(file as File)}
                  type="video/mp4"
                />
                {caption && (
                  <track
                    kind="subtitles"
                    label="English"
                    srcLang="en"
                    default
                    src={URL.createObjectURL(caption)}
                  />
                )}
              </video>
            </div>
          )}
          {processing && <Skeleton className=" aspect-video w-full" />}
          <Card className="w-full self-stretch">
            <CardHeader>
              <CardTitle>Transcribe.ai</CardTitle>
              <CardDescription>Transcribe videos in one-click.</CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <Label htmlFor="audio">Video file</Label>
                <div className="flex gap-2">
                  <Input
                    id="audio"
                    type="file"
                    onChange={onChangeFile}
                    ref={inputElement}
                  />
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
              <Button
                variant="outline"
                onClick={onProcessFile}
                disabled={processing}
              >
                {processing && <Loader className="animate-spin" />}
                {!processing && <AudioLines />}
                Process
              </Button>
            </CardFooter>
          </Card>
        </div>
        {
          caption && (
            <div>
              <CardHeader>
                <CardDescription>Caption settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="items-top flex space-x-2">
                  <Checkbox id="showSpeaker"/>
                  <div className="grid gap-1.5 leading-none">
                    <label htmlFor="showSpeaker" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Speaker in Caption
                    </label>  
                    <p className="text-sm text-muted-foreground">
                      This will add the speaker's id between brackets: [SPEAKER] sentences go here
                    </p>
                  </div>
                </div>
                <div className="items-top flex space-x-2 mt-4">
                  <Checkbox id="wordedCaption" />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="wordedCaption"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Worded Captions
                    </label>
                    <p className="text-sm text-muted-foreground">
                      This will result in captions with smaller sentences
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={onProcessFile}
                  disabled={processing}
                >
                  {processing && <Loader className="animate-spin" />}
                  {!processing && <Film />}
                  Download media
                </Button>
              </CardFooter>
            </div>
          )
        }
      </div>
    </div>
  );
};
