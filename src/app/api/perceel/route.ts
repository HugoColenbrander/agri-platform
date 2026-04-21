import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const percelen = await prisma.perceel.findMany({
    include: {
      bedrijf: {
        select: {
          naam: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return NextResponse.json(percelen)
}

export async function POST(request: Request) {
  const data = await request.json()
  const perceel = await prisma.perceel.create({
    data: {
      naam: data.naam,
      bedrijfId: data.bedrijfId,
      kadastraleGemeente: data.kadastraleGemeente,
      sectie: data.sectie,
      nummer: data.nummer,
      oppervlakte: data.oppervlakte ? parseFloat(data.oppervlakte) : null,
      lat: data.lat ? parseFloat(data.lat) : null,
      lng: data.lng ? parseFloat(data.lng) : null,
    }
  })
  return NextResponse.json(perceel)
}
