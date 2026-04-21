import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const bronnen = await prisma.openDataBron.findMany({ where: { actief: true }, orderBy: { naam: 'asc' } })
    return NextResponse.json(bronnen)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
