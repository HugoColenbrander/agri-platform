export type Intent = 'subsidie' | 'bodem' | 'ai_advies' | 'bio' | 'document' | 'data' | 'onbekend'

export function detectIntent(text: string): Intent {
  const t = text.toLowerCase()
  if (/subsidie|aanvraag|glb|saner|euro/.test(t)) return 'subsidie'
  if (/bodem|grond|ph|kalium|fosfor|analyse/.test(t)) return 'bodem'
  if (/advies|tip|wat moet ik|help/.test(t)) return 'ai_advies'
  if (/dna|blast|sequentie|orf|primer|bio/.test(t)) return 'bio'
  if (/document|upload|pdf|csv/.test(t)) return 'document'
  if (/data|export|onderzoek|csv|api/.test(t)) return 'data'
  return 'onbekend'
}
