export interface FastaEntry {
  id: string
  description?: string
  sequence: string
}

export function parseFasta(text: string): FastaEntry[] {
  const entries: FastaEntry[] = []
  const lines = text.split(/\r?\n/)
  let current: FastaEntry | null = null
  for (const line of lines) {
    if (line.startsWith('>')) {
      if (current) entries.push(current)
      const header = line.slice(1).trim()
      const [id, ...desc] = header.split(/\s+/)
      current = { id, description: desc.join(' '), sequence: '' }
    } else if (current && line.trim()) {
      current.sequence += line.trim()
    }
  }
  if (current) entries.push(current)
  return entries
}
