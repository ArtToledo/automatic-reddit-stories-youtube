const prompt = require('prompt-sync')()

import { ResponseInformationsReddit } from './interfaces'

const getInformationsReddit = async (): Promise<ResponseInformationsReddit> => {
  const linkPostReddit = await prompt('What is the link to the post on reddit? ')
  const quantitiesResponse = await prompt('How many response quantities to take? ')

  return {
    linkPostReddit,
    quantitiesResponse: Number(quantitiesResponse)
  }
}

export {
  getInformationsReddit
}
