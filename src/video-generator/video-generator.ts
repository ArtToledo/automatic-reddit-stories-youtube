import { resolve } from 'path'
import { cmd } from 'src/cmd'
import { formatterPathToBashFfmpeg } from 'src/utils'

const { getAudioDurationInSeconds } = require('get-audio-duration')
const { getVideoDurationInSeconds } = require('get-video-duration')
const process = require('process')

const generateVideo = async (
  pathImages: string[],
  pathVoiceFiles: string[]
): Promise<string> => {
  const pathVideoTemplate = getVideoTemplateRandom()
  const durationVideoTemplate = await getVideoDurationInSecondsPromise(pathVideoTemplate)
  
  let durationTotalAudiosInSeconds = 1
  for (const pathVoiceFile of pathVoiceFiles) {
    const durationInSeconds = await getAudioDurationInSecondsPromise(pathVoiceFile)
    durationTotalAudiosInSeconds += durationInSeconds
  }

  const randomRangeCutVideoTemplateInSeconds = generateRandomRange(
    durationTotalAudiosInSeconds,
    durationVideoTemplate
  )

  const pathVideoTemplateBashType = formatterPathToBashFfmpeg(pathVideoTemplate)
  const pathOutputVideoWithoutImageAndVoice = `${process.env.PATH_OUTPUT_VIDEO}/output.mp4`
  const commandGeneratedVideoBase = `ffmpeg -i ${pathVideoTemplateBashType} -ss ${randomRangeCutVideoTemplateInSeconds.initial} -t ${durationTotalAudiosInSeconds} -c:v copy -c:a copy ${pathOutputVideoWithoutImageAndVoice}`
  
  await cmd('bash', '-c', commandGeneratedVideoBase)
  return ''
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

export {
  generateVideo
}

/* 

ffmpeg -i C:/Users/arthu/Documents/bot-reddit/template.mp4 -i "C:/Users/arthu/Desktop/ProjetosPessoais/automatic-reddit-stories-youtube/assets/temp/image_resized_0.png" -i "C:/Users/arthu/Desktop/ProjetosPessoais/automatic-reddit-stories-youtube/assets/temp/image_resized_1.png" -i "C:/Users/arthu/Desktop/ProjetosPessoais/automatic-reddit-stories-youtube/assets/temp/image_resized_2.png" -filter_complex "[0][1]overlay=(W-w)/2:(H-h)/2:enable='between(t,0,1)'[v1];[v1][2]overlay=(W-w)/2:(H-h)/2:enable='between(t,2,7)'[v2];[v2][3]overlay=(W-w)/2:(H-h)/2:enable='gt(t,8.36)'[v3]" -map "[v3]" -map 0:a:0? C:/Users/arthu/Documents/bot-reddit/out.mp4

//TODO: DA PARA COLOCAR TEMPO POR SEGUNDOS, ENTAO ADICIONAR 10 MILESEGUNDOS ENTRE AUDIO E IMAGEM PARA FICAR ADEQUADO

*/
