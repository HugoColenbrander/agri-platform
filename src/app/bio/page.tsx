'use client'
import { useState } from 'react'

export default function BioPage() {
  const [tool, setTool] = useState('blast')
  const [input, setInput] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  async function run() {
    setLoading(true)
    let body: any = {}
    let url = ''
    if (tool === 'blast') { url = '/api/bio/blast'; body = { query: input, subjects: ['ATGCGTACGTTAGCTAGCTAGCTAGCTAGC', 'GGGCCCAAATTTGGGCCCAAATTT'] } }
    else if (tool === 'alignment') { url = '/api/bio/alignment'; body = { seqA: input.split('\n')[0] || '', seqB: input.split('\n')[1] || '' } }
    else if (tool === 'translate') { url = '/api/bio/translate'; body = { dna: input } }
    else if (tool === 'restriction') { url = '/api/bio/restriction'; body = { dna: input } }
    else if (tool === 'primer') { url = '/api/bio/primer'; body = { dna: input } }
    else if (tool === 'phylo') { url = '/api/bio/phylo'; body = { sequences: input.split('\n').filter(l => l).map((l, i) => ({ name: `seq${i}`, seq: l })) } }
    else if (tool === 'soil') { url = '/api/bio/soil-health'; body = JSON.parse(input || '{}') }
    else if (tool === 'lab') { url = '/api/bio/lab-import'; body = { text: input, format: 'text' } }

    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) { const json = await res.json(); setResult(json) }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-green-400">Bio-informatica</h1>
      <div className="flex flex-wrap gap-2">
        {['blast', 'alignment', 'translate', 'restriction', 'primer', 'phylo', 'soil', 'lab'].map(t => (
          <button key={t} onClick={() => { setTool(t); setResult(null) }} className={`px-3 py-1 rounded text-sm ${tool === t ? 'bg-green-600 text-white' : 'bg-slate-800 border border-slate-700'}`}>{t}</button>
        ))}
      </div>
      <textarea className="w-full p-3 rounded bg-slate-900 border border-slate-700 h-40 font-mono text-sm" value={input} onChange={e => setInput(e.target.value)} placeholder={`Voer ${tool} data in...`} />
      <button onClick={run} disabled={loading} className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded disabled:opacity-50">{loading ? 'Bezig...' : 'Uitvoeren'}</button>
      {result && <pre className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-xs overflow-auto">{JSON.stringify(result, null, 2)}</pre>}
    </div>
  )
}
