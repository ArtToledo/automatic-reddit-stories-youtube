import { resolve } from 'path'

const { getAudioDurationInSeconds } = require('get-audio-duration')
const { getVideoDurationInSeconds } = require('get-video-duration')
const { spawn } = require('child_process')
const process = require('process')

const generateVideo = async (
  pathImages: string[],
  pathVoiceFiles: string[]
): Promise<string> => {
  const pathVideoTemplate = getVideoTemplateRandom()
  const durationVideoTemplate = await getVideoDurationInSecondsPromise(pathVideoTemplate)
  
  let durationTotalAudiosInSeconds = 0
  for (const pathVoiceFile of pathVoiceFiles) {
    const durationInSeconds = await getAudioDurationInSecondsPromise(pathVoiceFile)
    durationTotalAudiosInSeconds += durationInSeconds
  }

  const randomRangeCutVideoTemplateInSeconds = generateRandomRange(
    durationTotalAudiosInSeconds,
    durationVideoTemplate
  )

  const pathVideoTemplateBashType = pathVideoTemplate.replace(/\\/g, '/')
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

const cmd = async (...command) => {
  let p = spawn(command[0], command.slice(1));
  
  return new Promise((resolveFunc) => {
    p.stdout.on('data', (x) => {
      process.stdout.write(x.toString())
    })
    p.stderr.on('data', (x) => {
      process.stderr.write(x.toString())
    })
    p.on('exit', (code) => {
      resolveFunc(code)
    })
  })
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
