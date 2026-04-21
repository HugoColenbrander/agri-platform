export interface SoilRiskResult {
  score: number
  level: 'Laag' | 'Matig' | 'Hoog' | 'Kritiek'
  pathogens: string[]
  advice: string[]
}

export function assessSoilHealth(microbiome: Record<string, number | null | undefined>): SoilRiskResult {
  let score = 100
  const pathogens: string[] = []
  const advice: string[] = []

  const badBugs = ['fusarium', 'pythium', 'phytophthora', 'rhizoctonia', 'sclerotinia', 'verticillium']
  for (const bug of badBugs) {
    const val = microbiome[bug]
    if (val != null && val > 50) {
      score -= 15
      pathogens.push(bug)
      advice.push(`Verhoogde ${bug} gedetecteerd: overweeg resistente rassen of biologische bestrijding.`)
    }
  }

  if (microbiome.bacterieDiversiteit != null && microbiome.bacterieDiversiteit < 3) {
    score -= 10
    advice.push('Lage bacteriele diversiteit: voeg compost of groenbemesting toe.')
  }
  if (microbiome.mycorrhiza != null && microbiome.mycorrhiza < 10) {
    score -= 10
    advice.push('Lage mycorrhiza: overweeg mycorrhiza-inoculatie.')
  }

  const level: SoilRiskResult['level'] = score >= 80 ? 'Laag' : score >= 60 ? 'Matig' : score >= 40 ? 'Hoog' : 'Kritiek'
  if (!advice.length) advice.push('Bodemmicrobioom ziet er gezond uit.')

  return { score: Math.max(0, score), level, pathogens, advice }
}
