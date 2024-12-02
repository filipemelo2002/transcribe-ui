import { Check, Film, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { SubtitleSettings } from "@/services/subtitle.service";
import { useState } from "react";
import { Input } from "../ui/input";
import { ColorPicker } from "../ui/color-picker";

interface SpeakersTableProps {
  items: { id: string; name?: string; captionColor?: string }[];
  onChangeSpeakerCaptionSettings: (settings: {
    id: string;
    name?: string;
    captionColor?: string;
  }) => void;
  disableColorPicker: boolean;
}
const SpeakersTable = ({
  items,
  onChangeSpeakerCaptionSettings,
  disableColorPicker,
}: SpeakersTableProps) => {
  const [editting, setEditting] = useState<string | null>(null);

  const toggleEditting = (value: string) =>
    setEditting(editting === value ? null : value);

  return (
    <Table className="lg:max-w-[450px] text-xs ml-4">
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Caption Color</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-bold">{item.id}</TableCell>
            <TableCell className="flex justify-between text-sm items-center gap-1">
              {editting !== item.id && (
                <>
                  <span className="italic font-medium leading-none peer-disabled:cursor-not-allowed opacity-70">
                    {item.name || "blank"}
                  </span>
                </>
              )}

              {editting === item.id && (
                <>
                  <Input
                    type="text"
                    value={item.name}
                    onChange={(event) => {
                      onChangeSpeakerCaptionSettings({
                        ...item,
                        name: event.target.value,
                      });
                    }}
                  />
                </>
              )}
            </TableCell>
            <TableCell>
              <ColorPicker
                disabled={disableColorPicker}
                value={item.captionColor || "#FFFFFF"}
                onChange={(value) =>
                  onChangeSpeakerCaptionSettings({
                    ...item,
                    captionColor: value,
                  })
                }
              />
            </TableCell>
            <TableCell>
              <Button variant="ghost" onClick={() => toggleEditting(item.id)}>
                {editting !== item.id ? <Pencil /> : <Check />}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export interface CaptionsFormInterface {
  subtitleSettings: SubtitleSettings;
  onChangeSubtitleSettings: (val: SubtitleSettings) => void;
}

export const CaptionsForm = ({
  subtitleSettings,
  onChangeSubtitleSettings,
}: CaptionsFormInterface) => {
  return (
    <div>
      <CardHeader>
        <CardDescription>Caption settings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="items-top flex space-x-2">
          <Checkbox
            id="wordedCaption"
            defaultChecked={subtitleSettings.wordedCaptions}
            onCheckedChange={(value) => {
              if (typeof value === "boolean") {
                onChangeSubtitleSettings({
                  ...subtitleSettings,
                  wordedCaptions: value,
                });
                return;
              }
              onChangeSubtitleSettings({
                ...subtitleSettings,
                wordedCaptions: false,
              });
            }}
          />
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
          <Checkbox
            id="multiColorCaption"
            defaultChecked={subtitleSettings.multiColorCaptions}
            onCheckedChange={(value) => {
              if (typeof value === "boolean") {
                onChangeSubtitleSettings({
                  ...subtitleSettings,
                  multiColorCaptions: value,
                });
                return;
              }
              onChangeSubtitleSettings({
                ...subtitleSettings,
                multiColorCaptions: false,
              });
            }}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="multiColorCaption"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Multi-color Captions
            </label>
            <p className="text-sm text-muted-foreground">
              You can the individual caption color for each Speaker
            </p>
          </div>
        </div>
        <div className="items-top mt-4 flex space-x-2">
          <Checkbox
            id="showSpeaker"
            defaultChecked={subtitleSettings.speakerInCaptions}
            onCheckedChange={(value) => {
              if (typeof value === "boolean") {
                onChangeSubtitleSettings({
                  ...subtitleSettings,
                  speakerInCaptions: value,
                });
                return;
              }
              onChangeSubtitleSettings({
                ...subtitleSettings,
                speakerInCaptions: false,
              });
            }}
          />
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
          <SpeakersTable
            items={Object.keys(subtitleSettings.speakerIdMap).map((key) => ({
              id: key,
              name: subtitleSettings.speakerIdMap[key].name,
              captionColor: subtitleSettings.speakerIdMap[key].captionColor,
            }))}
            onChangeSpeakerCaptionSettings={(value) => {
              onChangeSubtitleSettings({
                ...subtitleSettings,
                speakerIdMap: {
                  ...subtitleSettings.speakerIdMap,
                  [value.id]: value,
                },
              });
            }}
            disableColorPicker={!subtitleSettings.multiColorCaptions}
          />
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
