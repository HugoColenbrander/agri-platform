import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.subsidie.deleteMany()
  await prisma.openDataBron.deleteMany()

  const subsidies = await prisma.subsidie.createMany({
    data: [
      {
        code: 'GLB-BASIS',
        naam: 'GLB Basisinkomen',
        beschrijving: 'Basisinkomenstitel van het Gemeenschappelijk Landbouwbeleid.',
        regels: JSON.stringify({
          minHectares: 1,
          actiefBedrijf: true,
          geenSancties: true
        }),
        bedragMin: 200,
        bedragMax: 800,
        actief: true
      },
      {
        code: 'GLB-ECO',
        naam: 'GLB Eco-schemes',
        beschrijving: 'Ecologische regelingen binnen GLB voor duurzame landbouw.',
        regels: JSON.stringify({
          minHectares: 1,
          ecologisch: true,
          actiefBedrijf: true
        }),
        bedragMin: 100,
        bedragMax: 500,
        actief: true
      },
      {
        code: 'SANER',
        naam: 'SANER-regeling',
        beschrijving: 'Saneringsregeling voor veehouderijen.',
        regels: JSON.stringify({
          veehouderij: true,
          sanering: true
        }),
        bedragMin: 50000,
        bedragMax: 500000,
        actief: true
      },
      {
        code: 'JONG',
        naam: 'Jonge Landbouwers',
        beschrijving: 'Subsidie voor startende boeren onder de 40 jaar.',
        regels: JSON.stringify({
          maxLeeftijd: 40,
          startend: true,
          minHectares: 1
        }),
        bedragMin: 10000,
        bedragMax: 100000,
        actief: true
      }
    ]
  })

  const openData = await prisma.openDataBron.createMany({
    data: [
      { naam: 'Bodemkaart Nederland', beschrijving: 'Nationaal bodeminformatiesysteem.', url: 'https://www.wur.nl/nl/bodemkaart.htm', type: 'REST', categorie: 'Bodem', actief: true },
      { naam: 'KNMI Seismologie', beschrijving: 'Seismische data van het KNMI.', url: 'https://data.knmi.nl/', type: 'REST', categorie: 'Klimaat', actief: true },
      { naam: 'RVO Subsidies', beschrijving: 'Open data over Nederlandse subsidies.', url: 'https://opendata.rvo.nl/', type: 'REST', categorie: 'Subsidies', actief: true },
      { naam: 'CBS Landbouw', beschrijving: 'Statistische data over landbouw.', url: 'https://opendata.cbs.nl/', type: 'REST', categorie: 'Statistiek', actief: true },
      { naam: 'PDOK BAG', beschrijving: 'Basisregistratie adressen en gebouwen.', url: 'https://www.pdok.nl/introductie/-/article/bag', type: 'REST', categorie: 'Geo', actief: true },
      { naam: 'Natura2000', beschrijving: 'Beschermde natuurgebieden in NL.', url: 'https://www.pdok.nl/introductie/-/article/natura2000', type: 'REST', categorie: 'Geo', actief: true },
      { naam: 'Waterschappen', beschrijving: 'Waterbeheergebieden Nederland.', url: 'https://www.pdok.nl/introductie/-/article/waterschappen', type: 'REST', categorie: 'Geo', actief: true },
      { naam: 'Geonovum Inspire', beschrijving: 'Europees ruimtelijke data portaal.', url: 'https://www.nationaalgeoregister.nl/', type: 'REST', categorie: 'Geo', actief: true },
      { naam: 'Rijkswaterstaat Wegverkeer', beschrijving: 'Verkeersdata RWS.', url: 'https://opendata.rijkswaterstaat.nl/', type: 'REST', categorie: 'Transport', actief: true },
      { naam: 'NDFF Flora en Fauna', beschrijving: 'Nederlands soorten databank.', url: 'https://www.ndff.nl/', type: 'REST', categorie: 'Bio', actief: true }
    ]
  })

  console.log(`Seeded ${subsidies.count} subsidies and ${openData.count} open data sources.`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
