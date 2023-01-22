import { getInformationsReddit } from './prompt-interaction'
import { 
  getTitlePost,
  getAnswersInThePost
} from './webscraper'

const startSystem = async () => {
  const {
    linkPostReddit,
    quantitiesResponse
  } = await getInformationsReddit()

  const titlePost = await getTitlePost(linkPostReddit)
  const answersInThePost = await getAnswersInThePost(linkPostReddit, quantitiesResponse)
}

startSystem()
