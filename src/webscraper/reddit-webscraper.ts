import puppeteer from 'puppeteer'

const getTitlePost = async (linkPost: string): Promise<string> => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto(linkPost)
  await page.waitForSelector('[data-adclicklocation="title"]');

  const titlePost = await page.evaluate(el => el.innerHTML, await page.$('[data-adclicklocation="title"] h1'))

  return titlePost
}

const getAnswersInThePost = async (linkPost: string, quantitiesResponse: number): Promise<string[]> => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto(linkPost)
  await page.waitForSelector('._3tw__eCCe7j-epNCKGXUKk');

  const postAnswers = await page.evaluate((quantitiesResponse) => {
    //@ts-ignore
    const parentElements = document.querySelectorAll('._3tw__eCCe7j-epNCKGXUKk')
    let answersFound = []

    for (const element of parentElements) {
      const elementoContemUmaResposta = element.childNodes[0].getInnerHTML() === 'nível 1'
  
      if (elementoContemUmaResposta) {
        answersFound.push(element.childNodes[2].childNodes[0].childNodes[0].innerHTML)
      }
    }

    return answersFound.slice(0, quantitiesResponse)
  }, quantitiesResponse)

  return postAnswers
}

export {
  getTitlePost,
  getAnswersInThePost
}
