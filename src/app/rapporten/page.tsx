'use client'
import { useState } from 'react'

export default function RapportenPage() {
  const [type, setType] = useState<'csv'>('csv')
  const [model, setModel] = useState<'bedrijven' | 'bodemAnalyses' | 'subsidies'>('bedrijven')
  const [bedrijfId, setBedrijfId] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [downloadFilename, setDownloadFilename] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setDownloadUrl(null)

    try {
      const res = await fetch('/api/rapporten/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          model,
          filters: {
            ...(bedrijfId ? { bedrijfId } : {}),
            ...(fromDate ? { fromDate } : {}),
            ...(toDate ? { toDate } : {}),
          },
        }),
      })

      if (!res.ok) {
        throw new Error('Rapport genereren mislukt')
      }

      const data = await res.json()

      if (data.csv) {
        const blob = new Blob([data.csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        setDownloadUrl(url)
        setDownloadFilename(data.filename)
      }

      if (data.html) {
        const blob = new Blob([data.html], { type: 'text/html;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        setDownloadUrl(url)
        setDownloadFilename(data.filename)
      }
    } catch (err: any) {
      setError(err.message || 'Er is een fout opgetreden')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-green-400">Rapporten Genereren</h1>

      <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4 max-w-xl">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Type</label>
          <select
            value={type}
            onChange={e => setType(e.target.value as 'csv')}
            className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
          >
            <option value="csv">CSV</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">Model</label>
          <select
            value={model}
            onChange={e => setModel(e.target.value as 'bedrijven' | 'bodemAnalyses' | 'subsidies')}
            className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
          >
            <option value="bedrijven">Bedrijven</option>
            <option value="bodemAnalyses">Bodemanalyses</option>
            <option value="subsidies">Subsidies</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">Bedrijf ID <span className="text-slate-500">(optioneel)</span></label>
          <input
            type="text"
            value={bedrijfId}
            onChange={e => setBedrijfId(e.target.value)}
            placeholder="bijv. clx..."
            className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Van datum <span className="text-slate-500">(optioneel)</span></label>
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Tot datum <span className="text-slate-500">(optioneel)</span></label>
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-500 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-semibold py-2 rounded transition-colors"
        >
          {loading ? 'Genereren...' : 'Genereer Rapport'}
        </button>
      </form>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-400 p-3 rounded-xl">
          {error}
        </div>
      )}

      {downloadUrl && (
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <p className="text-sm text-slate-400 mb-2">Rapport is klaar:</p>
          <a
            href={downloadUrl}
            download={downloadFilename}
            className="inline-block bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            Download {downloadFilename}
          </a>
        </div>
      )}
    </div>
  )
}
