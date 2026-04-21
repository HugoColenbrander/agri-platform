import { NextResponse } from 'next/server'
import { findSites } from '@/lib/bio/restriction-enzymes'

export async function POST(req: Request) {
  try {
    const { dna } = await req.json()
    const sites = findSites(dna || '')
    return NextResponse.json({ sites })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
