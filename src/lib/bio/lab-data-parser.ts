export interface ParsedLabRow {
  parameter: string
  waarde: number
  eenheid: string
  datum?: string
}

export function parseLabCSV(csv: string): ParsedLabRow[] {
  const lines = csv.split(/\r?\n/).filter(l => l.trim())
  if (!lines.length) return []
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  const rows: ParsedLabRow[] = []
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim())
    const param = cols[headers.indexOf('parameter')] || cols[0]
    const waarde = parseFloat(cols[headers.indexOf('waarde')] || cols[1])
    const eenheid = cols[headers.indexOf('eenheid')] || cols[2] || ''
    const datum = cols[headers.indexOf('datum')] || cols[3]
    if (param && !isNaN(waarde)) rows.push({ parameter: param, waarde, eenheid, datum })
  }
  return rows
}

export function parseLabText(text: string): ParsedLabRow[] {
  const rows: ParsedLabRow[] = []
  const regex = /([A-Za-z\s]+):?\s*(\d+(?:[.,]\d+)?)\s*(\w*%?)/gi
  let m: RegExpExecArray | null
  while ((m = regex.exec(text)) !== null) {
    rows.push({ parameter: m[1].trim(), waarde: parseFloat(m[2].replace(',', '.')), eenheid: m[3] })
  }
  return rows
}
