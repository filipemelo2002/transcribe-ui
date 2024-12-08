import  {FFmpeg} from '@ffmpeg/ffmpeg'
import {fetchFile, } from '@ffmpeg/util'

export class VideoService {
  constructor(private ffmpeg: FFmpeg) {
  }

  async processVideo({
    media,
    subtitle
  }: {
    media: File,
    subtitle: Blob
  }) {
    await this.ffmpeg.writeFile("tmp/Arial", await fetchFile(new URL('../assets/Arial.ttf', import.meta.url).href))
    await this.ffmpeg.writeFile("video.mp4", await fetchFile(media))
    await this.ffmpeg.writeFile("subtitle.ass", await fetchFile(subtitle))
    await this.ffmpeg.exec(["-i", "video.mp4", "-vf", "ass=subtitle.ass:fontsdir=/tmp", "-c:a","copy", "output.mp4"])
    const fileData = await this.ffmpeg.readFile("output.mp4")
    const data = new Uint8Array(fileData as ArrayBuffer);
    return new Blob([data.buffer], {type: 'video/mp4'})
  }
}