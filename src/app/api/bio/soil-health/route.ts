import { NextResponse } from 'next/server'
import { assessSoilHealth } from '@/lib/bio/soil-microbiome-risk'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = assessSoilHealth(body)
    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
