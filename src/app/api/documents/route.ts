import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const docs = await prisma.document.findMany({ include: { bedrijf: true }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json(docs)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const doc = await prisma.document.create({ data: body })
    return NextResponse.json(doc, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
