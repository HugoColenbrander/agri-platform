import { NextResponse } from 'next/server'
import { designPrimers } from '@/lib/bio/primer-designer'

export async function POST(req: Request) {
  try {
    const { dna, targetLength } = await req.json()
    const result = designPrimers(dna || '', targetLength || 20)
    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
