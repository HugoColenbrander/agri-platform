import { NextResponse } from 'next/server'
import { getAIAdvice } from '@/lib/ai/minimax'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = await getAIAdvice(body)
    return NextResponse.json({ result })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
