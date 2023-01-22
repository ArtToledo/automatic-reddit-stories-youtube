import Jimp from 'jimp'
import fs from 'fs'
import { resolve } from 'path'

import { DefinitionInformationsGenerateImageTitle } from './interfaces'

const generateImageTitle = async (title: string): Promise<string> => {
  const {
    font,
    positionX,
    positionY,
    imagePath,
    breakTextFrom
  } = definePositionTitleAndFontSize(title)
  const fontJimp = await Jimp.loadFont(resolve(__dirname, 'fonts', font))
  const image = await Jimp.read(imagePath)

  deleteFolderTemp()

  image.print(fontJimp, positionX, positionY, title, breakTextFrom)
  const pathSaveImage = resolve(__dirname, '..', 'images', 'temp', 'tile.png')
  await image.writeAsync(pathSaveImage)

  return pathSaveImage
}

const generateImagesAnswers = async (answers: string[]): Promise<string[]> => {
  let pathOfGeneratedImages = []
  for (const answer of answers) {
    const {
      font,
      positionX,
      positionY,
      imagePath,
      breakTextFrom
    } = definePositionTitleAndFontSize(answer)

    const fontJimp = await Jimp.loadFont(resolve(__dirname, 'fonts', font))
    const image = await Jimp.read(imagePath)

    image.print(fontJimp, positionX, positionY, answer, breakTextFrom)
    const pathSaveImage = resolve(__dirname, '..', 'images', 'temp', `answer${pathOfGeneratedImages.length}.png`)
    
    await image.writeAsync(pathSaveImage)
    pathOfGeneratedImages.push(pathSaveImage)
  }

  return pathOfGeneratedImages
}

const definePositionTitleAndFontSize = (title: string): DefinitionInformationsGenerateImageTitle => {
  const lengthTitle = title.length
  const positionX = 114
  let font = 'arial-42.fnt'
  let imagePath = resolve(__dirname, '..', 'images', 'overlay-smaller.png')
  let positionY = null
  let breakTextFrom = 820
  
  if (lengthTitle <= 35) positionY = 920

  if (lengthTitle > 35 && lengthTitle <= 67) positionY = 900

  if (lengthTitle > 67) positionY = 870

  if (lengthTitle > 102 && lengthTitle <= 136) positionY = 840

  if (lengthTitle > 136 && lengthTitle <= 173) {
    positionY = 800
    imagePath = resolve(__dirname, '..', 'images', 'overlay-medium.png')
  }

  if (lengthTitle > 173 && lengthTitle <= 199) {
    positionY = 760
    imagePath = resolve(__dirname, '..', 'images', 'overlay-medium.png')
  }

  if (lengthTitle > 200 && lengthTitle <= 225) {
    positionY = 740
    imagePath = resolve(__dirname, '..', 'images', 'overlay-medium.png')
  }

  if (lengthTitle > 225 && lengthTitle <= 258) {
    positionY = 720
    font = 'arial-38.fnt'
    imagePath = resolve(__dirname, '..', 'images', 'overlay-big.png')
  }

  if (lengthTitle > 258 && lengthTitle <= 285) {
    positionY = 700
    font = 'arial-38.fnt'
    imagePath = resolve(__dirname, '..', 'images', 'overlay-big.png')
  }

  if (lengthTitle > 285 && lengthTitle <= 319) {
    positionY = 760
    font = 'arial-36.fnt'
    imagePath = resolve(__dirname, '..', 'images', 'overlay-big.png')
    breakTextFrom = 840
  }

  if (lengthTitle > 319 && lengthTitle <= 365) {
    positionY = 750
    font = 'arial-36.fnt'
    imagePath = resolve(__dirname, '..', 'images', 'overlay-big.png')
    breakTextFrom = 840
  }

  if (lengthTitle > 365 && lengthTitle <= 412) {
    positionY = 740
    font = 'arial-36.fnt'
    imagePath = resolve(__dirname, '..', 'images', 'overlay-big.png')
    breakTextFrom = 840
  }

  if (lengthTitle > 413) {
    positionY = 730
    font = 'arial-36.fnt'
    imagePath = resolve(__dirname, '..', 'images', 'overlay-big.png')
    breakTextFrom = 840
  }

  return { 
    font, 
    positionY, 
    positionX, 
    imagePath, 
    breakTextFrom 
  }
}

const deleteFolderTemp = () => {
  fs.rmSync(resolve(__dirname, '..', 'images', 'temp'), { recursive: true, force: true })
}

export {
  generateImageTitle,
  generateImagesAnswers
}
