import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const bedrijven = await prisma.bedrijf.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(bedrijven)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const bedrijf = await prisma.bedrijf.create({ data: body })
    return NextResponse.json(bedrijf, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
