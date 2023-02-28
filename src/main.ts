require('dotenv').config()
import fs from 'fs'
import { resolve } from 'path'
import { resizeImages } from './image-processor'

import { getInformationsReddit } from './prompt-interaction'
import { formatSentenceToComplete } from './utils'
import { generateVideo } from './video-generator'
import { generateVoiceFiles } from './voice-processor'
import { 
  getTitlePost,
  getAnswersInThePost
} from './webscraper'

const startSystem = async () => {
  //Remove old files
  const folderImagesTemp = resolve(__dirname, '..', 'assets', 'temp')
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

  let pathsImages = [
    pathImageTitle
  ]
  pathsImages.concat(
    answersInThePost.map(answer => answer.pathImage)
  )

  await resizeImages(pathsImages)

  let phrases = [titlePost]
  phrases = phrases.concat(
    answersInThePost.map(a => a.answer)
  )

  const formattedPhrases = formatSentenceToComplete(phrases)
  const pathVoiceFiles = await generateVoiceFiles(formattedPhrases)
  const pathVideoGenerated = await generateVideo(pathVoiceFiles)
}

startSystem()

