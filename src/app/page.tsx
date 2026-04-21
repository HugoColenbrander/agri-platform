async function getDashboardStats() {
  const res = await fetch('http://localhost:3000/api/dashboard/stats', {
    cache: 'no-store',
  })
  if (!res.ok) return null
  return res.json()
}

export default async function HomePage() {
  let stats: {
    totalBedrijven: number
    totalBodemAnalyses: number
    totalSubsidies: number
    totalDocuments: number
    recentAnalyses: {
      id: string
      createdAt: string
      bedrijf: { naam: string } | null
    }[]
  } | null = null

  try {
    stats = await getDashboardStats()
  } catch {
    stats = null
  }

  return (
    <div className="space-y-8">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-green-400 mb-4">AgriPlatform</h1>
        <p className="text-slate-300 max-w-xl mx-auto">
          Slimme tools voor boeren en onderzoekers. Bodemanalyse, subsidiechecks, bio-informatica en AI advies — alles op één plek.
        </p>
      </section>

      {stats ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
              <p className="text-green-400 text-2xl font-bold">{stats.totalBedrijven}</p>
              <p className="text-slate-400 text-sm">Bedrijven</p>
            </div>
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
              <p className="text-green-400 text-2xl font-bold">{stats.totalBodemAnalyses}</p>
              <p className="text-slate-400 text-sm">Bodemanalyses</p>
            </div>
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
              <p className="text-green-400 text-2xl font-bold">{stats.totalSubsidies}</p>
              <p className="text-slate-400 text-sm">Subsidies</p>
            </div>
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
              <p className="text-green-400 text-2xl font-bold">{stats.totalDocuments}</p>
              <p className="text-slate-400 text-sm">Documenten</p>
            </div>
          </div>

          {stats.recentAnalyses.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Recente Analyses</h2>
              <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-700/50 text-slate-400">
                    <tr>
                      <th className="px-4 py-3 font-medium">Bedrijf</th>
                      <th className="px-4 py-3 font-medium">Datum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {stats.recentAnalyses.map((analyse: any) => (
                      <tr key={analyse.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-4 py-3">{analyse.bedrijf?.naam ?? '—'}</td>
                        <td className="px-4 py-3 text-slate-300">
                          {new Date(analyse.createdAt).toLocaleDateString('nl-NL')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-xl border border-red-800/50 bg-red-900/20 p-4 text-red-400">
          Dashboard data niet beschikbaar
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="/bodem" className="p-6 rounded-xl bg-slate-800 hover:bg-slate-700 transition border border-slate-700">
          <h2 className="text-xl font-semibold text-green-400 mb-2">Bodem Analyse</h2>
          <p className="text-sm text-slate-400">Chemische en microbiologische bodemanalyse met aanbevelingen.</p>
        </a>
        <a href="/subsidies" className="p-6 rounded-xl bg-slate-800 hover:bg-slate-700 transition border border-slate-700">
          <h2 className="text-xl font-semibold text-green-400 mb-2">Subsidiechecker</h2>
          <p className="text-sm text-slate-400">Check welke subsidies je kunt aanvragen.</p>
        </a>
        <a href="/bio" className="p-6 rounded-xl bg-slate-800 hover:bg-slate-700 transition border border-slate-700">
          <h2 className="text-xl font-semibold text-green-400 mb-2">Bio-informatica</h2>
          <p className="text-sm text-slate-400">DNA analyse, BLAST, primers, fylogenetiek en meer.</p>
        </a>
        <a href="/agent" className="p-6 rounded-xl bg-slate-800 hover:bg-slate-700 transition border border-slate-700">
          <h2 className="text-xl font-semibold text-green-400 mb-2">AI Agent</h2>
          <p className="text-sm text-slate-400">Chat met de Agri AI voor advies en analyses.</p>
        </a>
        <a href="/onderzoek" className="p-6 rounded-xl bg-slate-800 hover:bg-slate-700 transition border border-slate-700">
          <h2 className="text-xl font-semibold text-green-400 mb-2">Onderzoekersportal</h2>
          <p className="text-sm text-slate-400">Anonieme data export en API toegang.</p>
        </a>
        <a href="/bedrijven" className="p-6 rounded-xl bg-slate-800 hover:bg-slate-700 transition border border-slate-700">
          <h2 className="text-xl font-semibold text-green-400 mb-2">Bedrijven</h2>
          <p className="text-sm text-slate-400">Registreer en beheer agrarische bedrijven.</p>
        </a>
      </div>
    </div>
  )
}
