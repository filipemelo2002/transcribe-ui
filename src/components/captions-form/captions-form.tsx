import { Film, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { SubtitleSettings } from "@/services/subtitle.service";

const SpeakersTable = () => {
  return (
    <Table className="lg:max-w-[300px] text-xs ml-4">
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-bold">SPEAKER_00</TableCell>
          <TableCell className="flex justify-between text-sm items-center">
            <span>Filipe</span><Button variant="ghost"><Pencil /></Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export interface CaptionsFormInterface {
  subtitleSettings: SubtitleSettings
  onChangeSubtitleSettings: (val: SubtitleSettings) => void 
}

export const CaptionsForm = ({subtitleSettings, onChangeSubtitleSettings}: CaptionsFormInterface) => {
  return (
    <div>
      <CardHeader>
        <CardDescription>Caption settings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="items-top flex space-x-2">
          <Checkbox id="wordedCaption" defaultChecked={subtitleSettings.wordedCaptions} onCheckedChange={(value) => { 
            if (typeof value === 'boolean') {
              onChangeSubtitleSettings({
                ...subtitleSettings,
                wordedCaptions: value
              })
              return
            }
            onChangeSubtitleSettings({
              ...subtitleSettings,
              wordedCaptions: false
            })
          }}/>
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
        <div className="items-top mt-4 flex space-x-2">
          <Checkbox id="showSpeaker" defaultChecked={subtitleSettings.speakerInCaptions} onCheckedChange={(value) => { 
            if (typeof value === 'boolean') {
              onChangeSubtitleSettings({
                ...subtitleSettings,
                speakerInCaptions: value
              })
              return
            }
            onChangeSubtitleSettings({
              ...subtitleSettings,
              speakerInCaptions: false
            })
          }}/>
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
        <div className="mt-3">
          <SpeakersTable />
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
