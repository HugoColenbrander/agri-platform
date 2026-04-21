import { NextResponse } from 'next/server'
import { checkSubsidies } from '@/lib/subsidies/engine'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const resultaten = checkSubsidies(body)
    return NextResponse.json(resultaten)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
