const ENZYMES: Record<string, string> = {
  EcoRI: 'GAATTC', BamHI: 'GGATCC', HindIII: 'AAGCTT',
  XhoI: 'CTCGAG', PstI: 'CTGCAG', KpnI: 'GGTACC',
  SacI: 'GAGCTC', SmaI: 'CCCGGG', SalI: 'GTCGAC',
  XbaI: 'TCTAGA', SpeI: 'ACTAGT', NheI: 'GCTAGC',
}

export function findSites(dna: string): { enzyme: string; site: string; positions: number[] }[] {
  const s = dna.toUpperCase()
  return Object.entries(ENZYMES).map(([enzyme, site]) => {
    const positions: number[] = []
    let idx = s.indexOf(site)
    while (idx !== -1) { positions.push(idx); idx = s.indexOf(site, idx + 1) }
    return { enzyme, site, positions }
  }).filter(r => r.positions.length > 0)
}
