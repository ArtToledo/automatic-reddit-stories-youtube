require('dotenv').config()
import fs from 'fs'
import { resolve } from 'path'

import { getInformationsReddit } from './prompt-interaction'
import { 
  getTitlePost,
  getAnswersInThePost
} from './webscraper'

const startSystem = async () => {
  //Remove old files
  const folderImagesTemp = resolve(__dirname, '..', 'assets', 'temp')
  !fs.existsSync(folderImagesTemp)
    ? fs.mkdirSync(folderImagesTemp)
    : fs.rmSync(folderImagesTemp, { recursive: true, force: true })

  const {
    linkPostReddit,
    quantitiesResponse
  } = await getInformationsReddit()

  const { pathImageTitle, titlePost } = await getTitlePost(linkPostReddit)
  const answersInThePost = await getAnswersInThePost(linkPostReddit, quantitiesResponse)
}

startSystem()

