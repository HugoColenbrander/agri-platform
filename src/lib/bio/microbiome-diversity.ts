export function shannonIndex(counts: number[]): number {
  const total = counts.reduce((a, b) => a + b, 0)
  if (!total) return 0
  let h = 0
  for (const c of counts) {
    if (c > 0) { const p = c / total; h -= p * Math.log(p) }
  }
  return h
}

export function simpsonIndex(counts: number[]): number {
  const total = counts.reduce((a, b) => a + b, 0)
  if (!total) return 0
  let s = 0
  for (const c of counts) { s += (c / total) ** 2 }
  return 1 - s
}

export function chao1(counts: number[]): number {
  const sObs = counts.filter(c => c > 0).length
  const f1 = counts.filter(c => c === 1).length
  const f2 = counts.filter(c => c === 2).length
  if (!f2) return sObs
  return sObs + (f1 * (f1 - 1)) / (2 * (f2 + 1))
}
