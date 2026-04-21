'use client'
import { useState, useEffect } from 'react'

export default function AgentPage() {
  const [skills, setSkills] = useState<any[]>([])
  const [messages, setMessages] = useState<{role: string; content: string}[]>([{role: 'system', content: 'Welkom bij de Agri AI Agent! Typ je vraag.'}])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/agent/skills').then(r => r.json()).then(d => setSkills(d.skills || [])).catch(() => {})
  }, [])

  async function send() {
    if (!input.trim()) return
    const userMsg = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ crop: 'algemeen', issue: input }) })
    let reply = 'Sorry, kon geen advies genereren.'
    if (res.ok) { const json = await res.json(); reply = json.advice }
    setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-green-400">Agri AI Agent</h1>
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 h-96 overflow-y-auto space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`text-sm ${m.role === 'user' ? 'text-right' : ''}`}>
            <span className={`inline-block px-3 py-2 rounded-lg ${m.role === 'user' ? 'bg-green-600' : 'bg-slate-700'}`}>{m.content}</span>
          </div>
        ))}
        {loading && <div className="text-slate-400 text-sm">AI denkt...</div>}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 p-2 rounded bg-slate-900 border border-slate-700" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Stel een vraag..." />
        <button onClick={send} className="bg-green-600 hover:bg-green-500 text-white px-4 rounded">Verstuur</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {skills.map((s: any) => (
          <div key={s.name} className="bg-slate-800 p-2 rounded border border-slate-700 text-xs">
            <div className="font-semibold text-green-400">{s.name}</div>
            <div className="text-slate-400">{s.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
