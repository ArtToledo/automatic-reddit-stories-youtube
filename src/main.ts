import { getInformationsReddit } from './prompt-interaction'

const startSystem = async () => {
  const {
    linkPostReddit,
    quantitiesResponse
  } = await getInformationsReddit()
}

startSystem()
