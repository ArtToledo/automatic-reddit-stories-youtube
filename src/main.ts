require('dotenv').config()
import fs from 'fs'
import { resolve } from 'path'

import { getInformationsReddit } from './prompt-interaction'
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

  let phares = [titlePost]
  phares = phares.concat(
    answersInThePost.map(a => a.answer)
  )

  console.log(phares)
  await generateVoiceFiles(phares)
}

startSystem()

