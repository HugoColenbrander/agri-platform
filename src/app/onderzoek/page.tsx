'use client'
import { useState } from 'react'

export default function OnderzoekPage() {
  const [type, setType] = useState('bodem')
  const [csv, setCsv] = useState('')
  const [loading, setLoading] = useState(false)

  async function exportData() {
    setLoading(true)
    const res = await fetch('/api/data/export', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type }) })
    if (res.ok) { const json = await res.json(); setCsv(json.csv || '') }
    setLoading(false)
  }

  function download() {
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${type}-export.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-green-400">Onderzoekersportal</h1>
      <p className="text-slate-400 text-sm">Exporteer anonieme data voor onderzoek.</p>

      <div className="flex gap-2">
        <select className="p-2 rounded bg-slate-900 border border-slate-700" value={type} onChange={e => setType(e.target.value)}>
          <option value="bodem">Bodemdata</option>
          <option value="subsidies">Subsidiedata</option>
        </select>
        <button onClick={exportData} disabled={loading} className="bg-green-600 hover:bg-green-500 text-white px-4 rounded disabled:opacity-50">{loading ? 'Laden...' : 'Exporteer'}</button>
        {csv && <button onClick={download} className="bg-slate-700 hover:bg-slate-600 text-white px-4 rounded">Download CSV</button>}
      </div>

      {csv && <pre className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-xs overflow-auto h-64">{csv}</pre>}

      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-2">
        <h2 className="font-semibold text-green-400">API Endpoints</h2>
        <div className="text-sm font-mono text-slate-400 space-y-1">
          <div>GET /api/bedrijf</div>
          <div>GET /api/bodem</div>
          <div>GET /api/open-data</div>
          <div>POST /api/data/export</div>
          <div>GET /api/agent/skills</div>
        </div>
      </div>
    </div>
  )
}
