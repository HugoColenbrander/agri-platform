import { NextResponse } from 'next/server'
import { analyseerBodem } from '@/lib/bodem/analyzer'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const resultaat = analyseerBodem(body)
    return NextResponse.json({ resultaat })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
