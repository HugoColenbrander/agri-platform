const DNAtoRNA: Record<string, string> = { A: 'U', T: 'A', C: 'G', G: 'C' }

const codonTable: Record<string, string> = {
  UUU:'F',UUC:'F',UUA:'L',UUG:'L',CUU:'L',CUC:'L',CUA:'L',CUG:'L',AUU:'I',AUC:'I',AUA:'I',AUG:'M',
  GUU:'V',GUC:'V',GUA:'V',GUG:'V',UCU:'S',UCC:'S',UCA:'S',UCG:'S',CCU:'P',CCC:'P',CCA:'P',CCG:'P',
  ACU:'T',ACC:'T',ACA:'T',ACG:'T',GCU:'A',GCC:'A',GCA:'A',GCG:'A',UAU:'Y',UAC:'Y',UAA:'*',UAG:'*',
  CAU:'H',CAC:'H',CAA:'Q',CAG:'Q',AAU:'N',AAC:'N',AAA:'K',AAG:'K',GAU:'D',GAC:'D',GAA:'E',GAG:'E',
  UGU:'C',UGC:'C',UGA:'*',UGG:'W',CGU:'R',CGC:'R',CGA:'R',CGG:'R',AGU:'S',AGC:'S',AGA:'R',AGG:'R',
  GGU:'G',GGC:'G',GGA:'G',GGG:'G',
}

export function transcribe(dna: string): string {
  return dna.toUpperCase().replace(/./g, b => DNAtoRNA[b] || b).replace(/T/g, 'U')
}

export function translate(rna: string): string {
  let protein = ''
  for (let i = 0; i + 3 <= rna.length; i += 3) {
    protein += codonTable[rna.slice(i, i + 3).toUpperCase()] || '?'
  }
  return protein.replace(/\*$/, '')
}

export function codonUsage(dna: string): Record<string, number> {
  const rna = transcribe(dna)
  const usage: Record<string, number> = {}
  for (let i = 0; i + 3 <= rna.length; i += 3) {
    const c = rna.slice(i, i + 3)
    usage[c] = (usage[c] || 0) + 1
  }
  return usage
}
