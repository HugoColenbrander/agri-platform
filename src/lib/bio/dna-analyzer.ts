export function gcContent(seq: string): number {
  const s = seq.toUpperCase()
  const gc = (s.match(/[GC]/g) || []).length
  return s.length ? gc / s.length : 0
}

export function baseCounts(seq: string): Record<string, number> {
  const s = seq.toUpperCase()
  return { A: (s.match(/A/g) || []).length, C: (s.match(/C/g) || []).length, G: (s.match(/G/g) || []).length, T: (s.match(/T/g) || []).length }
}

export function findORFs(seq: string, minLength = 100): { start: number; end: number; strand: string; protein: string }[] {
  const orfs: { start: number; end: number; strand: string; protein: string }[] = []
  const startCodon = 'ATG'
  const stopCodons = ['TAA', 'TAG', 'TGA']
  const codonTable: Record<string, string> = {
    TTT:'F',TTC:'F',TTA:'L',TTG:'L',CTT:'L',CTC:'L',CTA:'L',CTG:'L',ATT:'I',ATC:'I',ATA:'I',ATG:'M',
    GTT:'V',GTC:'V',GTA:'V',GTG:'V',TCT:'S',TCC:'S',TCA:'S',TCG:'S',CCT:'P',CCC:'P',CCA:'P',CCG:'P',
    ACT:'T',ACC:'T',ACA:'T',ACG:'T',GCT:'A',GCC:'A',GCA:'A',GCG:'A',TAT:'Y',TAC:'Y',TAA:'*',TAG:'*',
    CAT:'H',CAC:'H',CAA:'Q',CAG:'Q',AAT:'N',AAC:'N',AAA:'K',AAG:'K',GAT:'D',GAC:'D',GAA:'E',GAG:'E',
    TGT:'C',TGC:'C',TGA:'*',TGG:'W',CGT:'R',CGC:'R',CGA:'R',CGG:'R',AGT:'S',AGC:'S',AGA:'R',AGG:'R',
    GGT:'G',GGC:'G',GGA:'G',GGG:'G',
  }
  function translate(dna: string): string {
    let prot = ''
    for (let i = 0; i + 3 <= dna.length; i += 3) {
      prot += codonTable[dna.slice(i, i + 3).toUpperCase()] || '?'
    }
    return prot
  }
  for (let frame = 0; frame < 3; frame++) {
    for (let i = frame; i + 3 <= seq.length; i += 3) {
      const codon = seq.slice(i, i + 3).toUpperCase()
      if (codon === startCodon) {
        for (let j = i + 3; j + 3 <= seq.length; j += 3) {
          const c = seq.slice(j, j + 3).toUpperCase()
          if (stopCodons.includes(c)) {
            const len = j + 3 - i
            if (len >= minLength) {
              orfs.push({ start: i, end: j + 3, strand: '+', protein: translate(seq.slice(i, j + 3)) })
            }
            break
          }
        }
      }
    }
  }
  return orfs
}
