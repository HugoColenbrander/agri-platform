import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const perceel = await prisma.perceel.findUnique({
    where: { id },
    include: {
      bedrijf: true
    }
  })

  if (!perceel) {
    return NextResponse.json(
      { error: 'Perceel niet gevonden' },
      { status: 404 }
    )
  }

  return NextResponse.json(perceel)
}
