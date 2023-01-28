export interface AnswersFoundPuppeteer {
  answer: string
  clipInformations: ClipInformation
}

interface ClipInformation {
  x: number
  y: number
  width: number
  height: number
}
