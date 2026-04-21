export interface AIAdviceInput {
  crop?: string
  soil?: string
  issue?: string
  location?: string
}

export interface AIAdviceResult {
  advice: string
  source: 'api' | 'local'
}

export async function getAIAdvice(input: AIAdviceInput): Promise<AIAdviceResult> {
  const key = process.env.MINIMAX_API_KEY
  if (!key) {
    return { advice: generateLocalAdvice(input), source: 'local' }
  }

  try {
    const res = await fetch('https://api.minimaxi.chat/v1/text/chatcompletion_v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: 'MiniMax-M2.7',
        messages: [
          { role: 'system', content: 'Je bent een Nederlandse agrarisch adviseur. Geef kort, praktisch advies.' },
          { role: 'user', content: formatPrompt(input) }
        ]
      })
    })
    if (!res.ok) throw new Error(`API ${res.status}`)
    const data = await res.json()
    const advice = data.choices?.[0]?.message?.content || generateLocalAdvice(input)
    return { advice, source: 'api' }
  } catch {
    return { advice: generateLocalAdvice(input), source: 'local' }
  }
}

function formatPrompt(input: AIAdviceInput): string {
  return `Geef agrarisch advies voor: gewas=${input.crop || 'onbekend'}, bodem=${input.soil || 'onbekend'}, probleem=${input.issue || 'geen'}, locatie=${input.location || 'Nederland'}.`
}

function generateLocalAdvice(input: AIAdviceInput): string {
  const tips: string[] = []
  if (input.issue?.toLowerCase().includes('droogte')) tips.push('Overweeg druppelirrigatie of mulchen om vocht te behouden.')
  if (input.issue?.toLowerCase().includes('ziekte')) tips.push('Controleer pathogenen met een bodemanalyse en overweeg resistente rassen.')
  if (input.crop?.toLowerCase().includes('graan')) tips.push('Monitor Fusarium risico bij vochtig weer.')
  if (input.soil?.toLowerCase().includes('zuur')) tips.push('Kalk toevoegen om pH te verhogen.')
  if (!tips.length) tips.push('Houd de bodemvruchtbaarheid in de gaten en pas bemesting aan op gewasbehoefte.')
  return tips.join(' ')
}
