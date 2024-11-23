import { Film } from "lucide-react";
import { Button } from "../ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../ui/card";
import { Checkbox } from "../ui/checkbox";

export const CaptionsForm = () => {
  return (
    <div>
      <CardHeader>
        <CardDescription>Caption settings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="items-top flex space-x-2">
          <Checkbox id="showSpeaker" />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="showSpeaker"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Speaker in Caption
            </label>
            <p className="text-sm text-muted-foreground">
              This will add the speaker's id between brackets: [SPEAKER]
              sentences go here
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
        <Button variant="outline">
          <Film />
          Download media
        </Button>
      </CardFooter>
    </div>
  );
};
