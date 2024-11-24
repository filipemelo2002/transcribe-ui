import { Segment } from "./transcribe-ai.service";


export interface SubtitleSettings {
  wordedCaptions: boolean
  speakerInCaptions: boolean
  speakerIdMap: {
    [key: string]: string | undefined
  }
}
export class SubtitleService {
  processVttFile(segments: Segment[], settings?: SubtitleSettings) {
    let body = `WEBVTT\n`;
    
    let cuesCount = 1

    for (const segment of segments) {
      const speakerId = segment.speaker_id;
      
      for (const transcription of segment.transcriptions) {

        const startStr = this.secondsToString(transcription.start)
        const endStr = this.secondsToString(transcription.end)

        let prefix = ''

        if  (settings?.speakerInCaptions) {
          const name = settings.speakerIdMap[speakerId] || speakerId
          prefix = `[${name}] `
        }

        body += "\n\n"
        body += `${cuesCount}\n`
        body += `${startStr} --> ${endStr} align:center\n`
        body += `<v ${speakerId}>${prefix + transcription.word.trim()}</v>`
        cuesCount++
      }
    }
    console.log(body)
    return new Blob([body], { type: "text/plain" });
  }

  private secondsToString(value: number) {
    const hours = value / 3600;

    const minutes = (hours - Math.trunc(hours)) * 60;

    const seconds = (minutes - Math.trunc(minutes)) * 60;

    const miliseconds = seconds - Math.trunc(seconds);

    return `${String(Math.trunc(hours)).padStart(2, "0")}:${String(
      Math.trunc(minutes)
    ).padStart(2, "0")}:${String(Math.trunc(seconds)).padStart(
      2,
      "0"
    )}.${String(miliseconds.toFixed(3)).replace("0.", "")}`;
  }
}
