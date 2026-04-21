'use client';

import React, { useState, useEffect, use } from 'react';

interface BodemAnalyse {
  id: string;
  ph: number | null;
  fosfor: number | null;
  kalium: number | null;
  stikstof: number | null;
  organisch: number | null;
  aanbeveling: string | null;
  createdAt: string;
}

interface SubsidieItem {
  id: string;
  status: string;
  ingediendOp: string;
  bedrag: number | null;
  subsidie: {
    naam: string;
    code: string;
    beschrijving: string;
  };
}

interface DocumentItem {
  id: string;
  naam: string;
  type: string;
  url: string;
  createdAt: string;
}

interface Bedrijf {
  id: string;
  naam: string;
  kvk: string;
  eigenaar: string;
  email: string;
  telefoon: string | null;
  adres: string | null;
  postcode: string | null;
  plaats: string | null;
  hectares: number | null;
  sector: string | null;
  bodemAnalyses: BodemAnalyse[];
  subsidies: SubsidieItem[];
  documents: DocumentItem[];
}

type TabKey = 'bodemanalyses' | 'subsidies' | 'documenten';

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

function formatCurrency(amount: number | null): string {
  if (amount === null) return '\u2014';
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

function StatusBadge({ status }: { status: string }) {
  const upper = status.toUpperCase();
  let colorClass = 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
  if (upper === 'GOEDGEKEURD') {
    colorClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  } else if (upper === 'AFGEWEZEN') {
    colorClass = 'bg-red-500/20 text-red-300 border-red-500/30';
  }
  return (
    <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${colorClass}`}>
      {status}
    </span>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-600 border-t-emerald-400 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Bedrijf laden...</p>
      </div>
    </div>
  );
}

export default function BedrijfDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [bedrijf, setBedrijf] = useState<Bedrijf | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('bodemanalyses');

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function fetchBedrijf() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/bedrijf/${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error('Bedrijf niet gevonden.');
          throw new Error(`Fout bij ophalen: ${res.status}`);
        }
        const data: Bedrijf = await res.json();
        if (!cancelled) {
          setBedrijf(data);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Er is een onbekende fout opgetreden.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchBedrijf();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-8 text-center">
          <p className="text-red-300 text-lg font-medium mb-2">Fout</p>
          <p className="text-red-400 mb-6">{error}</p>
          <a
            href="/bedrijven"
            className="inline-block px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            &larr; Terug naar bedrijven
          </a>
        </div>
      </div>
    );
  }

  if (!bedrijf) return null;

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: 'bodemanalyses', label: 'Bodemanalyses', count: bedrijf.bodemAnalyses?.length ?? 0 },
    { key: 'subsidies', label: 'Subsidies', count: bedrijf.subsidies?.length ?? 0 },
    { key: 'documenten', label: 'Documenten', count: bedrijf.documents?.length ?? 0 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back link */}
      <a
        href="/bedrijven"
        className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm"
      >
        &larr; Terug naar bedrijven
      </a>

      {/* Company Header Card */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{bedrijf.naam}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-block px-2.5 py-0.5 text-xs font-mono font-semibold bg-slate-700 text-slate-300 rounded border border-slate-600">
                KVK {bedrijf.kvk}
              </span>
              {bedrijf.sector && (
                <span className="inline-block px-2.5 py-0.5 text-xs font-semibold bg-emerald-900/40 text-emerald-300 rounded border border-emerald-700/40">
                  {bedrijf.sector}
                </span>
              )}
            </div>
          </div>
          {bedrijf.hectares !== null && (
            <div className="text-right">
              <p className="text-3xl font-bold text-white">{bedrijf.hectares}</p>
              <p className="text-xs text-slate-400 uppercase tracking-wide">Hectares</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 text-sm">
          <div>
            <span className="text-slate-500">Eigenaar</span>
            <p className="text-slate-200 font-medium">{bedrijf.eigenaar}</p>
          </div>
          <div>
            <span className="text-slate-500">E-mail</span>
            <p className="text-slate-200 font-medium">{bedrijf.email}</p>
          </div>
          {bedrijf.telefoon && (
            <div>
              <span className="text-slate-500">Telefoon</span>
              <p className="text-slate-200 font-medium">{bedrijf.telefoon}</p>
            </div>
          )}
          {(bedrijf.adres || bedrijf.postcode || bedrijf.plaats) && (
            <div className="sm:col-span-2 lg:col-span-3">
              <span className="text-slate-500">Adres</span>
              <p className="text-slate-200 font-medium">
                {[bedrijf.adres, bedrijf.postcode, bedrijf.plaats].filter(Boolean).join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div>
        <div className="flex border-b border-slate-700 gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
              <span
                className={`ml-1.5 px-1.5 py-0.5 text-xs rounded ${
                  activeTab === tab.key
                    ? 'bg-emerald-400/15 text-emerald-300'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6">
          {/* Bodemanalyses Tab */}
          {activeTab === 'bodemanalyses' && (
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              {bedrijf.bodemAnalyses && bedrijf.bodemAnalyses.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left px-4 py-3 text-slate-400 font-medium">pH</th>
                        <th className="text-left px-4 py-3 text-slate-400 font-medium">Fosfor</th>
                        <th className="text-left px-4 py-3 text-slate-400 font-medium">Kalium</th>
                        <th className="text-left px-4 py-3 text-slate-400 font-medium">Stikstof</th>
                        <th className="text-left px-4 py-3 text-slate-400 font-medium">Organisch</th>
                        <th className="text-left px-4 py-3 text-slate-400 font-medium">Aanbeveling</th>
                        <th className="text-left px-4 py-3 text-slate-400 font-medium">Datum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bedrijf.bodemAnalyses.map((a) => (
                        <tr key={a.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                          <td className="px-4 py-3 text-slate-200">{a.ph ?? '\u2014'}</td>
                          <td className="px-4 py-3 text-slate-200">{a.fosfor ?? '\u2014'}</td>
                          <td className="px-4 py-3 text-slate-200">{a.kalium ?? '\u2014'}</td>
                          <td className="px-4 py-3 text-slate-200">{a.stikstof ?? '\u2014'}</td>
                          <td className="px-4 py-3 text-slate-200">{a.organisch ?? '\u2014'}</td>
                          <td className="px-4 py-3 text-slate-200 max-w-[250px] truncate">{a.aanbeveling ?? '\u2014'}</td>
                          <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{formatDate(a.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-slate-400 text-sm">Geen bodemanalyses beschikbaar voor dit bedrijf.</p>
                </div>
              )}
            </div>
          )}

          {/* Subsidies Tab */}
          {activeTab === 'subsidies' && (
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              {bedrijf.subsidies && bedrijf.subsidies.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left px-4 py-3 text-slate-400 font-medium">Subsidie</th>
                        <th className="text-left px-4 py-3 text-slate-400 font-medium">Status</th>
                        <th className="text-left px-4 py-3 text-slate-400 font-medium">Ingediend</th>
                        <th className="text-right px-4 py-3 text-slate-400 font-medium">Bedrag</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bedrijf.subsidies.map((s) => (
                        <tr key={s.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                          <td className="px-4 py-3">
                            <p className="text-slate-200 font-medium">{s.subsidie.naam}</p>
                            <p className="text-slate-500 text-xs font-mono">{s.subsidie.code}</p>
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={s.status} />
                          </td>
                          <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{formatDate(s.ingediendOp)}</td>
                          <td className="px-4 py-3 text-right text-slate-200 font-medium whitespace-nowrap">
                            {formatCurrency(s.bedrag)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-slate-400 text-sm">Geen subsidies gevonden voor dit bedrijf.</p>
                </div>
              )}
            </div>
          )}

          {/* Documenten Tab */}
          {activeTab === 'documenten' && (
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              {bedrijf.documents && bedrijf.documents.length > 0 ? (
                <ul className="divide-y divide-slate-700/50">
                  {bedrijf.documents.map((doc) => (
                    <li key={doc.id} className="hover:bg-slate-700/30 transition-colors">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-4 py-3.5"
                      >
                        <div className="min-w-0 flex-1 mr-4">
                          <p className="text-slate-200 font-medium truncate">{doc.naam}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">{doc.type}</span>
                            <span className="text-slate-700">&middot;</span>
                            <span className="text-xs text-slate-500">{formatDate(doc.createdAt)}</span>
                          </div>
                        </div>
                        <span className="text-emerald-400 text-sm font-medium whitespace-nowrap hover:underline">
                          Openen &rarr;
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-slate-400 text-sm">Geen documenten beschikbaar voor dit bedrijf.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
