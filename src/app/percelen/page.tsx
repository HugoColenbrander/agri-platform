'use client'

import { useEffect, useState } from 'react'

interface Bedrijf {
  id: string
  naam: string
}

interface Perceel {
  id: string
  naam: string
  oppervlakte: number | null
  kadastraleGemeente: string | null
  sectie: string | null
  nummer: string | null
  lat: number | null
  lng: number | null
  createdAt: string
  bedrijf: {
    naam: string
  }
}

export default function PercelenPage() {
  const [percelen, setPercelen] = useState<Perceel[]>([])
  const [bedrijven, setBedrijven] = useState<Bedrijf[]>([])
  const [form, setForm] = useState({
    naam: '',
    bedrijfId: '',
    kadastraleGemeente: '',
    sectie: '',
    nummer: '',
    oppervlakte: '',
    lat: '',
    lng: '',
  })

  useEffect(() => {
    fetch('/api/perceel')
      .then(res => res.json())
      .then(setPercelen)
      
    fetch('/api/bedrijf')
      .then(res => res.json())
      .then(setBedrijven)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/perceel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const newPerceel = await res.json()
    setPercelen([newPerceel, ...percelen])
    setForm({
      naam: '',
      bedrijfId: '',
      kadastraleGemeente: '',
      sectie: '',
      nummer: '',
      oppervlakte: '',
      lat: '',
      lng: '',
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Percelen</h1>

      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h2 className="text-lg font-semibold mb-4">Nieuw Perceel Toevoegen</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="text-sm text-slate-400 mb-1">Naam*</label>
            <input
              required
              type="text"
              value={form.naam}
              onChange={e => setForm({...form, naam: e.target.value})}
              className="bg-slate-900 border border-slate-700 rounded p-2 text-white"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-slate-400 mb-1">Bedrijf*</label>
            <select
              required
              value={form.bedrijfId}
              onChange={e => setForm({...form, bedrijfId: e.target.value})}
              className="bg-slate-900 border border-slate-700 rounded p-2 text-white"
            >
              <option value="">Selecteer bedrijf</option>
              {bedrijven.map(b => (
                <option key={b.id} value={b.id}>{b.naam}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-slate-400 mb-1">Kadastrale Gemeente</label>
            <input
              type="text"
              value={form.kadastraleGemeente}
              onChange={e => setForm({...form, kadastraleGemeente: e.target.value})}
              className="bg-slate-900 border border-slate-700 rounded p-2 text-white"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-slate-400 mb-1">Sectie</label>
            <input
              type="text"
              value={form.sectie}
              onChange={e => setForm({...form, sectie: e.target.value})}
              className="bg-slate-900 border border-slate-700 rounded p-2 text-white"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-slate-400 mb-1">Nummer</label>
            <input
              type="text"
              value={form.nummer}
              onChange={e => setForm({...form, nummer: e.target.value})}
              className="bg-slate-900 border border-slate-700 rounded p-2 text-white"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-slate-400 mb-1">Oppervlakte (ha)</label>
            <input
              type="number"
              step="0.01"
              value={form.oppervlakte}
              onChange={e => setForm({...form, oppervlakte: e.target.value})}
              className="bg-slate-900 border border-slate-700 rounded p-2 text-white"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-slate-400 mb-1">Latitude</label>
            <input
              type="number"
              step="0.000001"
              value={form.lat}
              onChange={e => setForm({...form, lat: e.target.value})}
              className="bg-slate-900 border border-slate-700 rounded p-2 text-white"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-slate-400 mb-1">Longitude</label>
            <input
              type="number"
              step="0.000001"
              value={form.lng}
              onChange={e => setForm({...form, lng: e.target.value})}
              className="bg-slate-900 border border-slate-700 rounded p-2 text-white"
            />
          </div>
          <div className="flex items-end">
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full">
              Toevoegen
            </button>
          </div>
        </form>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-700">
            <tr>
              <th className="p-4">Naam</th>
              <th className="p-4">Bedrijf</th>
              <th className="p-4">Kadastrale info</th>
              <th className="p-4">Oppervlakte (ha)</th>
              <th className="p-4">Coördinaten</th>
              <th className="p-4">Datum</th>
            </tr>
          </thead>
          <tbody>
            {percelen.map(p => (
              <tr key={p.id} className="border-t border-slate-700 hover:bg-slate-700/50">
                <td className="p-4">
                  <a href={`/percelen/${p.id}`} className="text-green-400 hover:underline">{p.naam}</a>
                </td>
                <td className="p-4">{p.bedrijf.naam}</td>
                <td className="p-4">
                  {p.kadastraleGemeente ? `${p.kadastraleGemeente} ${p.sectie || ''} ${p.nummer || ''}` : '-'}
                </td>
                <td className="p-4">{p.oppervlakte ?? '-'}</td>
                <td className="p-4">{p.lat && p.lng ? `${p.lat}, ${p.lng}` : '-'}</td>
                <td className="p-4">{new Date(p.createdAt).toLocaleDateString('nl-NL')}</td>
              </tr>
            ))}
            {percelen.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-slate-400">Geen percelen gevonden.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
