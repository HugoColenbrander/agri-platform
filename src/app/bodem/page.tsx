'use client'
import { useState } from 'react'

export default function BodemPage() {
  const [data, setData] = useState({ ph: '', fosfor: '', kalium: '', magnesium: '', kalk: '', stikstof: '', organisch: '', zuurgraad: '' })
  const [resultaat, setResultaat] = useState<any>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const body: any = {}
    for (const [k, v] of Object.entries(data)) { if (v) body[k] = parseFloat(v) }
    const res = await fetch('/api/bodem', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) { const json = await res.json(); setResultaat(json.resultaat) }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-green-400">Bodem Analyse</h1>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700">
        {Object.keys(data).map(key => (
          <input key={key} className="p-2 rounded bg-slate-900 border border-slate-700 capitalize" placeholder={key} type="number" step="0.01"
            value={(data as any)[key]} onChange={e => setData({ ...data, [key]: e.target.value })} />
        ))}
        <button className="md:col-span-2 bg-green-600 hover:bg-green-500 text-white font-semibold py-2 rounded">Analyseer</button>
      </form>

      {resultaat && (
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-2">
          <h2 className="font-semibold text-green-400">Resultaat</h2>
          {Object.entries(resultaat).filter(([k]) => k !== 'aanbeveling').map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm"><span className="capitalize text-slate-400">{k}</span><span>{String(v)}</span></div>
          ))}
          <div className="pt-2 border-t border-slate-700 text-sm"><strong>Aanbeveling:</strong> {resultaat.aanbeveling}</div>
        </div>
      )}
    </div>
  )
}
