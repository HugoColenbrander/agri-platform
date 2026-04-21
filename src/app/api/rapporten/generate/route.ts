import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function escapeCsv(value: unknown): string {
  const str = value instanceof Date ? value.toISOString() : String(value ?? '')
  if (str.includes(';') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function buildCsv(headers: string[], records: any[]): string {
  const lines = [headers.join(';')]
  for (const r of records) {
    lines.push(headers.map(h => escapeCsv(r[h])).join(';'))
  }
  return lines.join('\n')
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { type, model, filters } = body as {
    type: 'csv' | 'pdf'
    model: 'bedrijven' | 'bodemAnalyses' | 'subsidies'
    filters?: { bedrijfId?: string; fromDate?: string; toDate?: string }
  }

  const where: any = {}

  if (filters?.bedrijfId) {
    where.bedrijfId = filters.bedrijfId
  }

  if (filters?.fromDate || filters?.toDate) {
    where.createdAt = {}
    if (filters.fromDate) where.createdAt.gte = new Date(filters.fromDate)
    if (filters.toDate) where.createdAt.lte = new Date(filters.toDate)
  }

  let csv: string | undefined
  let html: string | undefined
  let filename: string

  if (model === 'bedrijven') {
    const records = await prisma.bedrijf.findMany({ where })
    const headers = ['naam', 'kvk', 'eigenaar', 'email', 'telefoon', 'adres', 'plaats', 'hectares', 'sector', 'createdAt']
    filename = `bedrijven_export.${type === 'pdf' ? 'html' : 'csv'}`

    if (type === 'csv') {
      csv = buildCsv(headers, records)
    } else {
      html = `<html><head><meta charset="utf-8"><title>Bedrijven Rapport</title></head><body style="font-family:sans-serif"><h1>Bedrijven Rapport</h1><table border="1" cellpadding="6" cellspacing="0"><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${records.map((r: any) => `<tr>${headers.map(h => `<td>${r[h] ?? ''}</td>`).join('')}</tr>`).join('')}</tbody></table></body></html>`
    }
  } else if (model === 'bodemAnalyses') {
    const records = await prisma.bodemAnalyse.findMany({ where })
    const headers = ['id', 'bedrijfId', 'ph', 'fosfor', 'kalium', 'stikstof', 'organisch', 'aanbeveling', 'createdAt']
    filename = `bodemAnalyses_export.${type === 'pdf' ? 'html' : 'csv'}`

    if (type === 'csv') {
      csv = buildCsv(headers, records)
    } else {
      html = `<html><head><meta charset="utf-8"><title>Bodemanalyses Rapport</title></head><body style="font-family:sans-serif"><h1>Bodemanalyses Rapport</h1><table border="1" cellpadding="6" cellspacing="0"><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${records.map((r: any) => `<tr>${headers.map(h => `<td>${r[h] ?? ''}</td>`).join('')}</tr>`).join('')}</tbody></table></body></html>`
    }
  } else if (model === 'subsidies') {
    const records = await prisma.subsidieAanvraag.findMany({ where })
    const headers = ['id', 'bedrijfId', 'subsidieId', 'status', 'indiendOp', 'bedrag', 'beoordeling']
    filename = `subsidies_export.${type === 'pdf' ? 'html' : 'csv'}`

    if (type === 'csv') {
      csv = buildCsv(headers, records)
    } else {
      html = `<html><head><meta charset="utf-8"><title>Subsidies Rapport</title></head><body style="font-family:sans-serif"><h1>Subsidies Rapport</h1><table border="1" cellpadding="6" cellspacing="0"><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${records.map((r: any) => `<tr>${headers.map(h => `<td>${r[h] ?? ''}</td>`).join('')}</tr>`).join('')}</tbody></table></body></html>`
    }
  } else {
    return NextResponse.json({ error: 'Ongeldig model' }, { status: 400 })
  }

  return NextResponse.json({ csv, html, filename })
}
