'use client'
import { useState, useEffect } from 'react'

export default function BedrijvenPage() {
  const [bedrijven, setBedrijven] = useState<any[]>([])
  const [form, setForm] = useState({ naam: '', kvk: '', eigenaar: '', email: '', hectares: '' })

  useEffect(() => {
    fetch('/api/bedrijf').then(r => r.json()).then(setBedrijven).catch(() => {})
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/bedrijf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, hectares: parseFloat(form.hectares) || 0 })
    })
    if (res.ok) {
      const nieuw = await res.json()
      setBedrijven([nieuw, ...bedrijven])
      setForm({ naam: '', kvk: '', eigenaar: '', email: '', hectares: '' })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-green-400">Bedrijven</h1>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700">
        <input className="p-2 rounded bg-slate-900 border border-slate-700" placeholder="Naam" value={form.naam} onChange={e => setForm({ ...form, naam: e.target.value })} required />
        <input className="p-2 rounded bg-slate-900 border border-slate-700" placeholder="KVK nummer" value={form.kvk} onChange={e => setForm({ ...form, kvk: e.target.value })} required />
        <input className="p-2 rounded bg-slate-900 border border-slate-700" placeholder="Eigenaar" value={form.eigenaar} onChange={e => setForm({ ...form, eigenaar: e.target.value })} required />
        <input className="p-2 rounded bg-slate-900 border border-slate-700" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input className="p-2 rounded bg-slate-900 border border-slate-700" placeholder="Hectares" type="number" value={form.hectares} onChange={e => setForm({ ...form, hectares: e.target.value })} />
        <button className="md:col-span-2 bg-green-600 hover:bg-green-500 text-white font-semibold py-2 rounded">Registreer</button>
      </form>

      <div className="space-y-2">
        {bedrijven.map((b: any) => (
          <a
            key={b.id}
            href={`/bedrijven/${b.id}`}
            className="block bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between hover:border-green-500 transition-colors"
          >
            <div>
              <div className="font-semibold text-green-400">{b.naam}</div>
              <div className="text-sm text-slate-400">KVK: {b.kvk} | {b.eigenaar}</div>
            </div>
            <div className="text-sm text-slate-400">{b.hectares} ha</div>
          </a>
        ))}
      </div>
    </div>
  )
}
