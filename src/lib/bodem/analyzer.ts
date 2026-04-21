export interface BodemResultaat {
  ph: string
  fosfor: string
  kalium: string
  magnesium: string
  kalk: string
  stikstof: string
  organisch: string
  zuurgraad: string
  aanbeveling: string
}

export function analyseerBodem(data: {
  ph?: number | null
  fosfor?: number | null
  kalium?: number | null
  magnesium?: number | null
  kalk?: number | null
  stikstof?: number | null
  organisch?: number | null
  zuurgraad?: number | null
}): BodemResultaat {
  const result: BodemResultaat = {
    ph: 'Geen data',
    fosfor: 'Geen data',
    kalium: 'Geen data',
    magnesium: 'Geen data',
    kalk: 'Geen data',
    stikstof: 'Geen data',
    organisch: 'Geen data',
    zuurgraad: 'Geen data',
    aanbeveling: '',
  }

  const advies: string[] = []

  if (data.ph != null) {
    if (data.ph < 5.5) { result.ph = 'Te zuur'; advies.push('Kalk toevoegen om pH te verhogen.'); }
    else if (data.ph > 7.5) { result.ph = 'Te basisch'; advies.push('Zwavel of organische stof toevoegen.'); }
    else { result.ph = 'Goed'; }
  }

  if (data.fosfor != null) {
    if (data.fosfor < 10) { result.fosfor = 'Tekort'; advies.push('Fosfor bemesting toepassen.'); }
    else if (data.fosfor > 50) { result.fosfor = 'Overschot'; advies.push('Verminder fosfor bemesting.'); }
    else { result.fosfor = 'Goed'; }
  }

  if (data.kalium != null) {
    if (data.kalium < 80) { result.kalium = 'Tekort'; advies.push('Kalium bemesting toepassen.'); }
    else if (data.kalium > 250) { result.kalium = 'Overschot'; advies.push('Verminder kalium bemesting.'); }
    else { result.kalium = 'Goed'; }
  }

  if (data.magnesium != null) {
    if (data.magnesium < 20) { result.magnesium = 'Tekort'; advies.push('Magnesium bemesting toepassen.'); }
    else { result.magnesium = 'Goed'; }
  }

  if (data.kalk != null) {
    if (data.kalk < 2) { result.kalk = 'Tekort'; advies.push('Kalk toevoegen.'); }
    else { result.kalk = 'Goed'; }
  }

  if (data.stikstof != null) {
    if (data.stikstof < 30) { result.stikstof = 'Tekort'; advies.push('Stikstof bemesting toepassen.'); }
    else if (data.stikstof > 150) { result.stikstof = 'Overschot'; advies.push('Verminder stikstof bemesting, risico uitspoeling.'); }
    else { result.stikstof = 'Goed'; }
  }

  if (data.organisch != null) {
    if (data.organisch < 3) { result.organisch = 'Te laag'; advies.push('Organische stof toevoegen (compost, groenbemesting).'); }
    else { result.organisch = 'Goed'; }
  }

  if (data.zuurgraad != null) {
    result.zuurgraad = data.zuurgraad < 5.5 ? 'Zuur' : data.zuurgraad > 7.5 ? 'Basisch' : 'Neutraal'
  }

  result.aanbeveling = advies.length ? advies.join(' ') : 'Alle waardes zijn in orde.'
  return result
}
