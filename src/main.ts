require('dotenv').config()
import fs from 'fs'
import { resolve } from 'path'

import { getInformationsReddit } from './prompt-interaction'
import { generateVideo } from './video-generator'
import { generateVoiceFiles } from './voice-processor'
import { 
  getTitlePost,
  getAnswersInThePost
} from './webscraper'

const startSystem = async () => {
  //Remove old files
  /* const folderImagesTemp = resolve(__dirname, '..', 'assets', 'temp')
  if (!fs.existsSync(folderImagesTemp)) {
    fs.mkdirSync(folderImagesTemp)
  } else {
    fs.rmSync(folderImagesTemp, { recursive: true, force: true })
    fs.mkdirSync(folderImagesTemp)
  }

  const {
    linkPostReddit,
    quantitiesResponse
  } = await getInformationsReddit()

  const { pathImageTitle, titlePost } = await getTitlePost(linkPostReddit)
  const answersInThePost = await getAnswersInThePost(linkPostReddit, quantitiesResponse)

  let phares = [titlePost]
  phares = phares.concat(
    answersInThePost.map(a => a.answer)
  )

  const pathVoiceFiles = await generateVoiceFiles(phares) */

  const pathImages = [
    resolve(__dirname, '..', 'assets', 'temp', 'image0.png'),
    resolve(__dirname, '..', 'assets', 'temp', 'image1.png'),
    resolve(__dirname, '..', 'assets', 'temp', 'image2.png'),
    resolve(__dirname, '..', 'assets', 'temp', 'image3.png'),
    resolve(__dirname, '..', 'assets', 'temp', 'image4.png'),
    resolve(__dirname, '..', 'assets', 'temp', 'image5.png'),
    resolve(__dirname, '..', 'assets', 'temp', 'image6.png'),
  ]

  const pathVoiceFiles = [
    resolve(__dirname, '..', 'assets', 'temp', 'audio0.mp3'),
    resolve(__dirname, '..', 'assets', 'temp', 'audio1.mp3'),
    resolve(__dirname, '..', 'assets', 'temp', 'audio2.mp3'),
    resolve(__dirname, '..', 'assets', 'temp', 'audio3.mp3'),
    resolve(__dirname, '..', 'assets', 'temp', 'audio4.mp3'),
    resolve(__dirname, '..', 'assets', 'temp', 'audio5.mp3'),
    resolve(__dirname, '..', 'assets', 'temp', 'audio6.mp3'),
  ]
  const pathVideoGenerated = await generateVideo(pathImages, pathVoiceFiles)
}

startSystem()

