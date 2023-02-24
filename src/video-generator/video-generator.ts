import { resolve } from 'path'
import { cmd } from 'src/cmd'

const { getAudioDurationInSeconds } = require('get-audio-duration')
const { getVideoDurationInSeconds } = require('get-video-duration')
const process = require('process')

import { formatterPathToBashFfmpeg } from 'src/utils'
import { AudioWithTime, ImageAudioRatio } from './interfaces'

const generateVideo = async (
  pathVoiceFiles: string[]
): Promise<string> => {
  const pathVideoTemplate = getVideoTemplateRandom()
  const durationVideoTemplate = await getVideoDurationInSecondsPromise(pathVideoTemplate)
  
  let durationTotalAudiosInSeconds = 1
  let imageAudioRatio: ImageAudioRatio[] = []
  for (const [index, pathVoiceFile] of pathVoiceFiles.entries()) {
    const durationInSeconds = await getAudioDurationInSecondsPromise(pathVoiceFile)
    durationTotalAudiosInSeconds += durationInSeconds

    const pathImageAudio = resolve(__dirname, '..', '..', 'assets', 'temp', `image_resized_${index}.png`)
    imageAudioRatio.push({
      durationAudioInSeconds: durationInSeconds,
      pathAudio: formatterPathToBashFfmpeg(pathVoiceFile),
      pathImage: formatterPathToBashFfmpeg(pathImageAudio),
    })
  }

  const randomRangeCutVideoTemplateInSeconds = generateRandomRange(
    durationTotalAudiosInSeconds,
    durationVideoTemplate
  )

  const pathVideoTemplateBashType = formatterPathToBashFfmpeg(pathVideoTemplate)

  //Generate video with the correct duration according to the audios
  const pathOutputVideoWithoutImageAndVoice = formatterPathToBashFfmpeg(
    resolve(
      __dirname, '..', '..', 'assets', 'temp', 'output-without-audio-and-image.mp4'
    )
  )
  const commandGeneratedVideoBase = `ffmpeg -y -i ${pathVideoTemplateBashType} -ss ${randomRangeCutVideoTemplateInSeconds.initial} -t ${durationTotalAudiosInSeconds} -c:v copy -c:a copy ${pathOutputVideoWithoutImageAndVoice}`
  
  await cmd('bash', '-c', commandGeneratedVideoBase)

  //Generate video with selected images and audios
  const pathVideoCompleted = await generateVideoCompleted(
    pathOutputVideoWithoutImageAndVoice,
    imageAudioRatio
  )

  return pathVideoCompleted
}

const getAudioDurationInSecondsPromise = async (pathVoiceFile: string): Promise<number> => {
  return new Promise(resolve => {
    getAudioDurationInSeconds(pathVoiceFile).then((duration) => {
      resolve(duration)
    })
  })
}

const getVideoDurationInSecondsPromise = async (pathVideoFile: string): Promise<number> => {
  return new Promise(resolve => {
    getVideoDurationInSeconds(pathVideoFile).then((duration) => {
      resolve(duration)
    })
  })
}

const generateRandomRange = (durationRange: number, durationTotalVideoTemplate: number) => {
  let initial = Math.floor(Math.random() * durationTotalVideoTemplate)
  let final = initial + durationRange
  
  if (final > durationTotalVideoTemplate) final = durationTotalVideoTemplate
  return {
    initial, 
    final
  }
}

const getVideoTemplateRandom = () => {
  const numMin = 0
  const numMax = Number(process.env.QUANTITY_VIDEOS_TEMPLATE)
  const numRandom = getRandomNumber(numMin, numMax)
  const nameVideoTemplate = `video_template_${numRandom}.mp4`

  return resolve(process.env.PATH_TEMPLATE_VIDEO, nameVideoTemplate)
}

const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const generateVideoCompleted = async (
  pathVideoTemplate: string,
  imagesAudiosRatio: ImageAudioRatio[]
): Promise<string> => {  
  let commandsAddImageInput = ''
  let commandsAddImageFilterComplex = ''
  let commandAddImageMap = `-map "[v${imagesAudiosRatio.length}]"`
  
  let controlAudios = 0
  let audiosWithTime: AudioWithTime[] = []

  for (let [index, part] of imagesAudiosRatio.entries()) {
    commandsAddImageInput = commandsAddImageInput.concat(` -i "${part.pathImage}"`)
    
    //Make filterComplex
    const firstImage = index === 0
    const lastImage = index != 0 && ((index + 1) === imagesAudiosRatio.length)
    const audioWithTime = { pathAudio: part.pathAudio } as AudioWithTime
    
    if (firstImage && !lastImage) {
      commandsAddImageFilterComplex = commandsAddImageFilterComplex.concat(`"[0][1]overlay=(W-w)/2:(H-h)/2:enable='between(t,0.03,${part.durationAudioInSeconds})'[v1];`)
      audioWithTime.startTimeInSeconds = 0.03
    }
    
    if (!firstImage && !lastImage) {
      commandsAddImageFilterComplex = commandsAddImageFilterComplex.concat(`[v${index}][${index + 1}]overlay=(W-w)/2:(H-h)/2:enable='between(t,${controlAudios},${controlAudios + part.durationAudioInSeconds})'[v${index + 1}];`)
      audioWithTime.startTimeInSeconds = controlAudios
    }
    
    if (lastImage) {
      commandsAddImageFilterComplex = commandsAddImageFilterComplex.concat(`[v${index}][${index + 1}]overlay=(W-w)/2:(H-h)/2:enable='gt(t,${controlAudios})'[v${index + 1}]"`)
      audioWithTime.startTimeInSeconds = controlAudios
    }
    
    audiosWithTime.push(audioWithTime)
    controlAudios += (part.durationAudioInSeconds + 0.1)
  }

  const pathFileGenerated = `${process.env.PATH_OUTPUT_VIDEO}/video-without-audio.mp4`
  const pathFileGeneratedCompleted = `${process.env.PATH_OUTPUT_VIDEO}/video-reddit.mp4`
  const commandGeneratedVideoBase = `ffmpeg -y -i "${pathVideoTemplate}" ${commandsAddImageInput} -filter_complex ${commandsAddImageFilterComplex} ${commandAddImageMap} -map 0:a:0? "${pathFileGenerated}"`
  
  setTimeout(async () => {
    await cmd('bash', '-c', commandGeneratedVideoBase)

    setTimeout(async () => {
      let commandInputs = ''
      let commandFilterComplex = ''
      let amixAudios = ''

      for (const [index, audio] of audiosWithTime.entries()) {
        commandInputs = commandInputs.concat(`-i "${audio.pathAudio}" `)
        
        //Make filterComplex
        const firstAudio = index === 0
        const lastAudio = index != 0 && ((index + 1) === audiosWithTime.length)
        const numberAudio = index + 1
        
        if (firstAudio && !lastAudio) {
          commandFilterComplex = commandFilterComplex.concat(`"[${numberAudio}:a]adelay=${audio.startTimeInSeconds * 1000}|0|0:all=1[a${numberAudio}];`)
          amixAudios = amixAudios.concat(`[a${numberAudio}]`)
        } else {
          commandFilterComplex = commandFilterComplex.concat(`[${numberAudio}:a]adelay=${audio.startTimeInSeconds * 1000}|0|0:all=1[a${numberAudio}];`)
          amixAudios = amixAudios.concat(`[a${numberAudio}]`)
        }
      }

      const commandFilterComplexCompleted = `${commandFilterComplex}${amixAudios}amix=inputs=${audiosWithTime.length}[amixout]"`
      const commandGeneratedVideoCompleted = `ffmpeg -y -i "${pathFileGenerated}" ${commandInputs} -filter_complex ${commandFilterComplexCompleted}   -map 0:v:0 -map "[amixout]" -c:v copy -c:a aac -b:a 192k "${pathFileGeneratedCompleted}"`

      await cmd('bash', '-c', commandGeneratedVideoCompleted)
    }, 10000)
  }, 10000)

  return pathFileGeneratedCompleted
}

export {
  generateVideo
}
