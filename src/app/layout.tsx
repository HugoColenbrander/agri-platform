import './globals.css'

export const metadata = {
  title: 'AgriPlatform',
  description: 'Slimme agrarische tools voor boeren en onderzoekers',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="bg-slate-900 text-white min-h-screen">
        <nav className="border-b border-slate-800 p-4">
          <div className="max-w-6xl mx-auto flex gap-4 items-center">
            <a href="/" className="font-bold text-green-400 text-lg">AgriPlatform</a>
            <a href="/bedrijven" className="text-sm hover:text-green-400">Bedrijven</a>
            <a href="/bodem" className="text-sm hover:text-green-400">Bodem</a>
            <a href="/subsidies" className="text-sm hover:text-green-400">Subsidies</a>
            <a href="/percelen" className="text-sm hover:text-green-400">Percelen</a>
            <a href="/bio" className="text-sm hover:text-green-400">Bio</a>
            <a href="/agent" className="text-sm hover:text-green-400">AI Agent</a>
            <a href="/rapporten" className="text-sm hover:text-green-400">Rapporten</a>
            <a href="/onderzoek" className="text-sm hover:text-green-400">Onderzoek</a>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto p-4">{children}</main>
      </body>
    </html>
  )
}
