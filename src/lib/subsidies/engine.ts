import { SubsidieCheckInput, SubsidieCheckResultaat } from './types'

export function checkSubsidies(input: SubsidieCheckInput): SubsidieCheckResultaat[] {
  const resultaten: SubsidieCheckResultaat[] = []

  // GLB Basis
  const geschiktBasis = input.hectares >= 1 && input.sancties !== false
  resultaten.push({
    code: 'GLB-BASIS',
    naam: 'GLB Basisinkomen',
    geschikt: geschiktBasis,
    reden: geschiktBasis
      ? 'Voldoet aan minimale hectare-eis en heeft geen sancties.'
      : 'Minimale hectare-eis niet gehaald of sancties van toepassing.',
    geschatBedrag: geschiktBasis ? input.hectares * 250 : undefined,
  })

  // GLB Eco
  const geschiktEco = input.hectares >= 1 && input.ecologisch === true
  resultaten.push({
    code: 'GLB-ECO',
    naam: 'GLB Eco-schemes',
    geschikt: geschiktEco,
    reden: geschiktEco
      ? 'Ecologische bedrijfsvoering voldoet aan eisen.'
      : 'Geen ecologische bedrijfsvoering geregistreerd.',
    geschatBedrag: geschiktEco ? input.hectares * 180 : undefined,
  })

  // SANER
  const geschiktSaner = input.veehouderij === true && input.sanering === true
  resultaten.push({
    code: 'SANER',
    naam: 'SANER-regeling',
    geschikt: geschiktSaner,
    reden: geschiktSaner
      ? 'Sanering van veehouderij voldoet aan regeling.'
      : 'Alleen voor sanerende veehouderijen.',
    geschatBedrag: geschiktSaner ? 150000 : undefined,
  })

  // Jong
  const geschiktJong = (input.leeftijd ?? 99) < 40 && input.startend === true && input.hectares >= 1
  resultaten.push({
    code: 'JONG',
    naam: 'Jonge Landbouwers',
    geschikt: geschiktJong,
    reden: geschiktJong
      ? 'Startende boer onder 40 jaar voldoet aan eisen.'
      : 'Niet startend of ouder dan 40 jaar.',
    geschatBedrag: geschiktJong ? 50000 : undefined,
  })

  return resultaten
}
