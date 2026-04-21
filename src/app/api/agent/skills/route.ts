import { NextResponse } from 'next/server'
import { SKILLS } from '@/lib/agent/skills'

export async function GET() {
  return NextResponse.json({ skills: SKILLS })
}
