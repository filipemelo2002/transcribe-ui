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
import { AudioLines, Loader, Trash } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";

export const Dashboard = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const inputElement = useRef<HTMLInputElement>(null)

  const onChangeAudio = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAudioFile(event.target.files[0]);
    }
  };

  const resetForm = () => {
    setAudioFile(null)
    if (inputElement.current) {
      inputElement.current.value = ''
    }
  }
  const onProcess = () => {
    if (audioFile) {
      setProcessing(true);
      console.log(URL.createObjectURL(audioFile));
    }
  };
  return (
    <div className="flex w-full min-h-screen bg-background text-foreground font-sans items-center justify-center">
      <div className="mt-auto mb-auto ml-auto mr-auto">
        <Card className="max-w-[350px]">
          <CardHeader>
            <CardTitle>Transcribe.ai</CardTitle>
            <CardDescription>Transcribe audio in one-click.</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <Label htmlFor="audio">Audio file</Label>
              <div className="flex gap-2">
                <Input id="audio" type="file" onChange={onChangeAudio} ref={inputElement}/>
                {audioFile && (
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
