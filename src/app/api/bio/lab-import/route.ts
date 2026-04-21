import { NextResponse } from 'next/server'
import { parseLabCSV, parseLabText } from '@/lib/bio/lab-data-parser'

export async function POST(req: Request) {
  try {
    const { text, format } = await req.json()
    const rows = format === 'csv' ? parseLabCSV(text || '') : parseLabText(text || '')
    return NextResponse.json({ rows })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
