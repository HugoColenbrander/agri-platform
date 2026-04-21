export interface Skill {
  name: string
  description: string
  endpoint?: string
}

export const SKILLS: Skill[] = [
  { name: 'subsidiecheck', description: 'Check welke subsidies beschikbaar zijn.', endpoint: '/api/tools/subsidiecheck' },
  { name: 'bodemadvies', description: 'Analyseer bodemdata.', endpoint: '/api/tools/bodemadvies' },
  { name: 'ai_advies', description: 'Vraag AI advies.', endpoint: '/api/tools/ai' },
  { name: 'bio_blast', description: 'Voer een lokale BLAST uit.', endpoint: '/api/bio/blast' },
  { name: 'bio_alignment', description: 'Sequentie alignment.', endpoint: '/api/bio/alignment' },
  { name: 'bio_translate', description: 'DNA naar eiwit.', endpoint: '/api/bio/translate' },
  { name: 'bio_restriction', description: 'Zoek restrictieplaatsen.', endpoint: '/api/bio/restriction' },
  { name: 'bio_primer', description: 'Ontwerp PCR primers.', endpoint: '/api/bio/primer' },
  { name: 'bio_phylo', description: 'Bouw een fylogenetische boom.', endpoint: '/api/bio/phylo' },
  { name: 'bio_soil_health', description: 'Beoordeel bodemgezondheid.', endpoint: '/api/bio/soil-health' },
  { name: 'bio_lab_import', description: 'Importeer labdata.', endpoint: '/api/bio/lab-import' },
  { name: 'document_upload', description: 'Upload een document.', endpoint: '/api/documents/upload' },
  { name: 'data_export', description: 'Exporteer anonieme data.', endpoint: '/api/data/export' },
  { name: 'open_data', description: 'Bekijk open data bronnen.', endpoint: '/api/open-data' },
]
