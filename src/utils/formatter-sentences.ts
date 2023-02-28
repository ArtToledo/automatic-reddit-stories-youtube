const formatSentenceToComplete = (phrases: string[]): string[] => {
  let phrasesFormatteds = []
  const transcripts = {
    ft: 'foto',
    nn: 'não',
    n: 'não',
    hj: 'hoje',
    ss: 'sim',
    s: 'sim',
    tlgd: 'tá ligado',
    mds: 'meu deus',
    mt: 'muito',
    sla: 'sei lá',
    aq: 'aqui',
    qq: 'qualquer',
    fds: 'final de semana',
    tbm: 'também',
    dsclp: 'desculpa',
    mlk: 'muleque',
    qm: 'quem',
    pq: 'porque',
    obg: 'obrigado',
    tmj: 'tamo junto',
    hr: 'hora',
    hrs: 'horas',
    sec: 'segundo',
    nmrl: 'namoral',
    vcs: 'vocês',
    vdd: 'verdade'
  }

  for (const phrase of phrases) {
    const words = phrase.split(' ')
    let wordsFormatted = []
    
    for (const word of words) {
      const newWord = transcripts[word] || word
      wordsFormatted.push(newWord)
    }
    
    const newPhrase = wordsFormatted.join(' ')
    phrasesFormatteds.push(newPhrase)
  }

  return phrasesFormatteds
}

export {
  formatSentenceToComplete
}
