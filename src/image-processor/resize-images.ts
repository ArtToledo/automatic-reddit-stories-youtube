import { resolve } from 'path'

import { cmd } from 'src/cmd'
import { formatterPathToBashFfmpeg } from 'src/utils'

const resizeImages = async (pathsImages: string[]): Promise<string[]> => {
  let newPathsImages = []
  
  for (const [index, pathImage] of pathsImages.entries()) {
    const newPath = resolve(__dirname, '..', '..', 'assets', 'temp', `image_resized_${index}.png`)
    newPathsImages.push(newPath)
  }

  //TODO: Refactor setTimeout
  setTimeout(async () => {
    const pathImageInputBashType = formatterPathToBashFfmpeg(
      resolve(__dirname, '..', '..', 'assets', 'temp', 'image%01d.png')
    )
    const pathImageResizedOutputBashType = formatterPathToBashFfmpeg(
      resolve(__dirname, '..', '..', 'assets', 'temp', 'image_resized_%01d.png')
    )

    const commandGeneratedVideoBase = `ffmpeg -start_number 0 -y -i "${pathImageInputBashType}" -vf scale="iw*2.1:ih*2.1" -start_number 0 "${pathImageResizedOutputBashType}"`
    await cmd('bash', '-c', commandGeneratedVideoBase)
  }, 5000)

  return newPathsImages
}

export {
  resizeImages
}
