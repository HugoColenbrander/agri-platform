import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { analyseerBodem } from '@/lib/bodem/analyzer'

export async function GET() {
  try {
    const analyses = await prisma.bodemAnalyse.findMany({ include: { bedrijf: true }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json(analyses)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const resultaat = analyseerBodem(body)
    const analyse = await prisma.bodemAnalyse.create({
      data: { ...body, aanbeveling: resultaat.aanbeveling }
    })
    return NextResponse.json({ analyse, resultaat }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
