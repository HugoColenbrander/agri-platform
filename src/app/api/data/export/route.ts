import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { type, filters } = await req.json()
    let rows: unknown[] = []
    if (type === 'bodem') {
      rows = await prisma.bodemAnalyse.findMany({
        select: { ph: true, fosfor: true, kalium: true, magnesium: true, createdAt: true },
        where: filters || {},
        take: 10000
      })
    } else if (type === 'subsidies') {
      rows = await prisma.subsidieAanvraag.findMany({
        select: { status: true, bedrag: true, ingediendOp: true },
        where: filters || {},
        take: 10000
      })
    }
    const csv = [Object.keys(rows[0] || {}).join(','), ...rows.map((r: Record<string, unknown>) => Object.values(r).join(','))].join('\n')
    return NextResponse.json({ rowCount: rows.length, csv })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
