import Jimp from 'jimp'
import { resolve } from 'path'

const generateImageTitle = async (title: string): Promise<string> => {
  const pathImageTitle = resolve(__dirname, '..', 'images', 'overlay-title.png')
  const image = await Jimp.read(pathImageTitle)

  const breakTextFrom =  700
  const {
    font,
    positionX,
    positionY
  } = definePositionTitleAndFontSize(title)
  const fontJimp = await Jimp.loadFont(resolve(__dirname, 'fonts', font))

  image.print(fontJimp, positionX, positionY, title, breakTextFrom)
  await image.writeAsync(resolve(__dirname, 'teste.png'));

  return ''
}

const definePositionTitleAndFontSize = (title: string) => {
  const lengthTitle = title.length
  const positionX = 120
  let font = null
  let positionY = null
  
  if (lengthTitle <= 35) {
    font = 'arial-42.fnt'
    positionY = 920
  }

  if (lengthTitle > 35 && lengthTitle <= 67) {
    font = 'arial-42.fnt'
    positionY = 900
  }

  if (lengthTitle > 67) {
    font = 'arial-42.fnt'
    positionY = 870
  }

  return { font, positionY, positionX }
}

export {
  generateImageTitle
}
