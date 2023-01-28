import puppeteer from 'puppeteer'
import { resolve } from 'path'

import { 
  AnswerInThePost, 
  AnswersFoundPuppeteer, 
  InformationsTitleInterface 
} from './interfaces'

const getTitlePost = async (linkPost: string): Promise<InformationsTitleInterface> => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto(linkPost, { waitUntil: 'networkidle2' })
  await page.waitForSelector('[data-adclicklocation="title"]')

  const titlePost = await page.evaluate(el => el.innerHTML, await page.$('[data-adclicklocation="title"] h1'))
  const divTitle = await page.$('[data-test-id="post-content"]')
  const pathImageTitle = resolve(__dirname, '..', '..', 'assets', 'temp', 'image0.png')
  
  await divTitle.screenshot({ path: pathImageTitle })
  await browser.close()
  
  return {
    pathImageTitle,
    titlePost
  }
}

const getAnswersInThePost = async (linkPost: string, quantitiesResponse: number): Promise<AnswerInThePost[]> => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto(linkPost, { waitUntil: 'networkidle2' })
  await page.waitForSelector('._3tw__eCCe7j-epNCKGXUKk')

  const postAnswers = await page.evaluate((quantitiesResponse) => {
    //@ts-ignore
    const parentElements = document.querySelectorAll('._3tw__eCCe7j-epNCKGXUKk')
    let answersFound = []

    for (const element of parentElements) {
      const elementoContemUmaResposta = element.childNodes[0].getInnerHTML() === 'nível 1'
  
      if (elementoContemUmaResposta) {
        const quantityTagsAnswer = element.childNodes[2].childNodes[0].childNodes.length
        let answer = ''

        for (let x = 0; x < quantityTagsAnswer; x++) {
          answer === ''
            ? answer = answer.concat(element.childNodes[2].childNodes[0].childNodes[x].innerHTML)
            : answer = answer.concat(` ${element.childNodes[2].childNodes[0].childNodes[x].innerHTML}`)
        }

        const {x, y, width, height} = element.getBoundingClientRect()
        const clipInformations = {
          x,
          y,
          width,
          height
        }

        answersFound.push({ answer, clipInformations })
        if (answersFound.length === quantitiesResponse) break
      }
    }

    return JSON.stringify(answersFound)
  }, quantitiesResponse)

  const answersInformations: AnswersFoundPuppeteer[] = JSON.parse(postAnswers)

  let answersInThePost: AnswerInThePost[] = []
  for (const [index, value] of answersInformations.entries()) {
    const pathImage = resolve(__dirname, '..', '..', 'assets', 'temp', `image${index + 1}.png`)
    const {
      x,
      y,
      width,
      height
    } = value.clipInformations

    await page.screenshot({
      path: pathImage,
      clip: {
        x,
        y,
        width,
        height
      }
    })

    answersInThePost.push({
      pathImage,
      answer: value.answer
    })
  }

  await browser.close()
  return answersInThePost
}

export {
  getTitlePost,
  getAnswersInThePost
}
