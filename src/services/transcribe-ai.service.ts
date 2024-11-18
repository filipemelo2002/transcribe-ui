export interface Transcription {
  end: number
  start: number
  word: string
}

export interface Segment {
  start: string
  end: string
  speaker_id: string
  transcriptions: Transcription[]
}


export class TranscribeAIService {

  async transcribe(file: File) {
    const formBody = new FormData()

    formBody.append('file', file)
    const response = await fetch('http://localhost:8000/transcribe', {
      method: 'POST',
      headers: {
        'accept': 'application/json'
      },
      body: formBody
    })

    const data: Segment[] = await response.json()

    return data
  }
}