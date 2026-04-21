'use client'
import { useState } from 'react'

export default function SubsidiesPage() {
  const [input, setInput] = useState({ hectares: '', leeftijd: '', ecologisch: false, veehouderij: false, sanering: false, startend: false, sancties: false })
  const [resultaten, setResultaten] = useState<any[]>([])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const body = { ...input, hectares: parseFloat(input.hectares) || 0, leeftijd: parseInt(input.leeftijd) || 99 }
    const res = await fetch('/api/subsidies/check', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) { const json = await res.json(); setResultaten(json) }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-green-400">Subsidiechecker</h1>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700">
        <input className="p-2 rounded bg-slate-900 border border-slate-700" placeholder="Hectares" type="number" value={input.hectares} onChange={e => setInput({ ...input, hectares: e.target.value })} />
        <input className="p-2 rounded bg-slate-900 border border-slate-700" placeholder="Leeftijd" type="number" value={input.leeftijd} onChange={e => setInput({ ...input, leeftijd: e.target.value })} />
        {(['ecologisch', 'veehouderij', 'sanering', 'startend', 'sancties'] as const).map(key => (
          <label key={key} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={(input as any)[key]} onChange={e => setInput({ ...input, [key]: e.target.checked })} />
            <span className="capitalize">{key}</span>
          </label>
        ))}
        <button className="md:col-span-2 bg-green-600 hover:bg-green-500 text-white font-semibold py-2 rounded">Check</button>
      </form>

      <div className="space-y-2">
        {resultaten.map((r: any) => (
          <div key={r.code} className={`p-4 rounded-xl border ${r.geschikt ? 'border-green-500 bg-green-900/20' : 'border-slate-700 bg-slate-800'}`}>
            <div className="font-semibold">{r.naam}</div>
            <div className="text-sm text-slate-400">{r.reden}</div>
            {r.geschatBedrag && <div className="text-green-400 font-mono text-sm">€{r.geschatBedrag.toLocaleString()}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
