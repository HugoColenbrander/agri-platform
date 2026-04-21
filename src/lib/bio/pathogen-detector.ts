const PATHOGENS: Record<string, { sequence: string; name: string; crop: string }> = {
  FUS_GRAM: { sequence: 'ATGCGTACGTTAGCTAGCTAGCTAGCTAGC', name: 'Fusarium graminearum', crop: 'Graan' },
  PHY_INF:  { sequence: 'ATGCGTACGTTAGCTAGCTAGCTAGCTAGT', name: 'Phytophthora infestans', crop: 'Aardappel' },
  BOT_CIN:  { sequence: 'ATGCGTACGTTAGCTAGCTAGCTAGCTAGA', name: 'Botrytis cinerea', crop: 'Druif/Tomaat' },
  RAL_SOL:  { sequence: 'ATGCGTACGTTAGCTAGCTAGCTAGCTAGG', name: 'Ralstonia solanacearum', crop: 'Aardappel' },
  XAN_CAM:  { sequence: 'ATGCGTACGTTAGCTAGCTAGCTAGCTAGC', name: 'Xanthomonas campestris', crop: 'Kool' },
  CLA_MICH: { sequence: 'ATGCGTACGTTAGCTAGCTAGCTAGCTAGT', name: 'Clavibacter michiganensis', crop: 'Tomaat' },
}

export function detectPathogens(dna: string): { name: string; crop: string; match: boolean }[] {
  return Object.values(PATHOGENS).map(p => ({
    name: p.name,
    crop: p.crop,
    match: dna.toUpperCase().includes(p.sequence.toUpperCase()),
  }))
}
