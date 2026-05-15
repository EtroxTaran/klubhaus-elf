import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

const cards = [
  {
    body: 'Karrieren werden lokal in IndexedDB vorbereitet; Cloud-Sync bleibt optional.',
    title: 'Offline-first',
  },
  {
    body: 'Die Match-Engine wird seed-basiert, testbar und frei von React-Abhängigkeiten.',
    title: 'Deterministisch',
  },
  {
    body: 'Mobile-first Bedienung für Saisonrhythmus, Kaderplanung und Vereinsentwicklung.',
    title: 'Karriere-Fokus',
  },
] as const

function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-50">
      <section className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="rounded-3xl border border-emerald-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-emerald-950/30">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-200">
            <span aria-hidden="true">SM</span>
            Phase 0 Bootstrap
          </div>

          <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
            Dein Fußballverein, offline spielbar und bereit für lange Karrieren.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            soccer-manager legt die technische Basis für Liga, Pokal, Stadion, Finanzen, Transfers,
            Jugend und eine deterministische Match-Simulation.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {cards.map((card) => (
              <article
                className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4"
                key={card.title}
              >
                <h2 className="font-bold text-emerald-200">{card.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
