import { NextResponse } from 'next/server'
import { transcribe, translate, codonUsage } from '@/lib/bio/codon-analysis'

export async function POST(req: Request) {
  try {
    const { dna } = await req.json()
    const rna = transcribe(dna || '')
    const protein = translate(rna)
    const usage = codonUsage(dna || '')
    return NextResponse.json({ rna, protein, codonUsage: usage })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
