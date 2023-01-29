const textToSpeech = require('@google-cloud/text-to-speech')
import { promisify } from 'util'
import { writeFile } from 'fs'
import { resolve } from 'path'

const generateVoiceFiles = async (phrases: string[]): Promise<string[]> => {
  const client = new textToSpeech.TextToSpeechClient()
  let pathVoiceFiles = []

  for (const [index, phrase] of phrases.entries()) {
    const request = {
      input: { text: phrase },
      voice: {
        languageCode: 'pt-BR',
        name: 'pt-BR-Wavenet-B',
        ssmlGender: 'MALE'
      },
      audioConfig: { 
        audioEncoding: 'MP3', 
        pitch: -6,
        speakingRate: 1.4
      }
    }

    const [response] = await client.synthesizeSpeech(request)
  
    const writeFilePromise = promisify(writeFile)
    const path = resolve(__dirname, '..', '..', 'assets', 'temp', `audio${index}.mp3`)
    pathVoiceFiles.push(path)

    await writeFilePromise(path, response.audioContent, 'binary')
  }

  return pathVoiceFiles
}

export {
  generateVoiceFiles
}
