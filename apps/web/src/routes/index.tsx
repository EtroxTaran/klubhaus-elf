import { createFileRoute } from '@tanstack/react-router'
import { Trophy } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { initI18n } from '../i18n/init'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  void initI18n()
  const { t } = useTranslation('home')

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-50">
      <section className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="rounded-3xl border border-emerald-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-emerald-950/30">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-200">
            <Trophy aria-hidden="true" size={16} />
            {t('badge')}
          </div>

          <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">{t('title')}</h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">{t('intro')}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {['offline', 'simulation', 'career'].map((key) => (
              <article
                className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4"
                key={key}
              >
                <h2 className="font-bold text-emerald-200">{t(`cards.${key}.title`)}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{t(`cards.${key}.body`)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
