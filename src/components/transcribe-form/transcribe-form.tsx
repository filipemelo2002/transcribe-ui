import { Label } from "@radix-ui/react-label";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AudioLines, Loader, Trash } from "lucide-react";
import { ChangeEvent } from "react";

export interface TranscribeFormProps {
  onChangeFile: (event: ChangeEvent<HTMLInputElement>) => void;
  inputElement: React.RefObject<HTMLInputElement>;
  file: File | null;
  processing: boolean;
  onProcessFile: () => void;
  resetForm: () => void;
}
export const TranscribeForm = ({
  file,
  inputElement,
  onChangeFile,
  onProcessFile,
  processing,
  resetForm,
}: TranscribeFormProps) => {
  return (
    <div className="w-full self-stretch">
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
        <Button variant="outline" onClick={onProcessFile} disabled={processing}>
          {processing && <Loader className="animate-spin" />}
          {!processing && <AudioLines />}
          Process
        </Button>
      </CardFooter>
    </div>
  );
};
