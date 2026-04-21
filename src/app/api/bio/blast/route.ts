import { NextResponse } from 'next/server'
import { localBlast } from '@/lib/bio/blast-local'

export async function POST(req: Request) {
  try {
    const { query, subjects } = await req.json()
    const hits = localBlast(query, subjects || [])
    return NextResponse.json({ hits })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
