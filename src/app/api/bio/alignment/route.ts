import { NextResponse } from 'next/server'
import { needlemanWunsch } from '@/lib/bio/alignment'

export async function POST(req: Request) {
  try {
    const { seqA, seqB } = await req.json()
    const result = needlemanWunsch(seqA || '', seqB || '')
    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
