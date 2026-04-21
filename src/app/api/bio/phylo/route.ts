import { NextResponse } from 'next/server'
import { upgma } from '@/lib/bio/phylogenetics'

export async function POST(req: Request) {
  try {
    const { sequences } = await req.json()
    const tree = upgma(sequences || [])
    return NextResponse.json({ tree })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
