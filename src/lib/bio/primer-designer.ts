export interface Primer {
  sequence: string
  tm: number
  gc: number
  length: number
  warnings: string[]
}

function calcTm(seq: string): number {
  const s = seq.toUpperCase()
  const gc = (s.match(/[GC]/g) || []).length
  const at = s.length - gc
  return 2 * at + 4 * gc
}

function calcGC(seq: string): number {
  const s = seq.toUpperCase()
  return s.length ? (s.match(/[GC]/g) || []).length / s.length : 0
}

export function designPrimers(dna: string, targetLength = 20): { forward: Primer; reverse: Primer } {
  const seq = dna.toUpperCase()
  const fwdSeq = seq.slice(0, targetLength)
  const revTemplate = seq.slice(-targetLength)
  const revSeq = revTemplate.split('').reverse().map(b => ({A:'T',T:'A',C:'G',G:'C'}[b] || b)).join('')

  const forward: Primer = { sequence: fwdSeq, tm: calcTm(fwdSeq), gc: calcGC(fwdSeq), length: fwdSeq.length, warnings: [] }
  const reverse: Primer = { sequence: revSeq, tm: calcTm(revSeq), gc: calcGC(revSeq), length: revSeq.length, warnings: [] }

  if (forward.tm < 50 || forward.tm > 65) forward.warnings.push('Tm buiten optimaal bereik (50-65C)')
  if (forward.gc < 0.4 || forward.gc > 0.6) forward.warnings.push('GC% buiten 40-60%')
  if (reverse.tm < 50 || reverse.tm > 65) reverse.warnings.push('Tm buiten optimaal bereik (50-65C)')
  if (reverse.gc < 0.4 || reverse.gc > 0.6) reverse.warnings.push('GC% buiten 40-60%')

  return { forward, reverse }
}
