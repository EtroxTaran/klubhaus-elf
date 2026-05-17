import { Link } from '@tanstack/react-router'
import { TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LevyChip } from '@/components/atoms/levy-chip/levy-chip'
import { ScreenShell } from '@/components/layout/screen-shell'
import { eur, FIN } from '../fixtures'

const TABS = ['operations', 'investment', 'history'] as const
const LEVERS = [
  { key: 'leverTicket', value: 62, hint: '14 € / Karte' },
  { key: 'leverSponsor', value: 48, hint: '1,8 Mio. € / Saison' },
  { key: 'leverYouth', value: 71, hint: '180.000 € / Monat' },
] as const

function Bar({
  label,
  value,
  pct,
  positive,
}: {
  label: string
  value: number
  pct: number
  positive: boolean
}) {
  return (
    <div className="flex items-center gap-2 border-b border-rule py-[7px] last:border-0">
      <span className="flex-1 text-[12.5px] font-medium text-ink">{label}</span>
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-bg-ink">
        <div
          className={`h-full ${positive ? 'bg-ok' : 'bg-danger'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className={`min-w-[90px] text-right font-mono text-xs font-bold tabular-nums ${
          positive ? 'text-ok' : 'text-danger'
        }`}
      >
        {positive ? '+' : '–'} {eur(Math.abs(value))}
      </span>
    </div>
  )
}

export function Finanzen() {
  const { t } = useTranslation(['finanzen', 'common'])
  return (
    <ScreenShell label={t('finanzen:title')}>
      <header className="px-4 pb-2.5 pt-1">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-mute">
              {t('finanzen:period')}
            </div>
            <Link
              to="/"
              aria-label={t('common:back')}
              className="block font-display text-[26px] font-bold leading-none text-ink"
            >
              {t('finanzen:title')}
            </Link>
          </div>
          <LevyChip label={t('finanzen:levyValue')} />
        </div>
      </header>

      <div className="px-4 pb-3">
        <div className="rounded-xl border border-rule bg-card px-3.5 py-3">
          <div className="flex justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wide text-ink-mute">
                {t('finanzen:balance')}
              </div>
              <span className="mt-0.5 block font-mono text-2xl font-extrabold tabular-nums text-ink">
                {eur(FIN.cash)}
              </span>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-wide text-ink-mute">
                {t('finanzen:monthly')}
              </div>
              <div className="mt-0.5 inline-flex items-center gap-1 font-mono text-lg font-extrabold text-ok">
                <TrendingUp size={16} />
                {t('finanzen:monthlyValue')}
              </div>
            </div>
          </div>
          <div className="mt-2.5 flex gap-1.5">
            {TABS.map((tab, i) => (
              <span
                key={tab}
                className={`rounded-md px-2.5 py-1.5 text-[11px] font-bold ${
                  i === 0 ? 'border border-rule bg-bg-ink text-ink' : 'text-ink-mute'
                }`}
              >
                {t(`finanzen:tabs.${tab}`)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-5">
        <div className="my-1.5 px-0.5 text-[11px] font-bold uppercase tracking-wide text-ink-mute">
          {t('finanzen:income')}
        </div>
        <div className="rounded-xl border border-rule bg-card px-3.5">
          {FIN.ops.map((x) => (
            <Bar
              key={x.k}
              label={x.k}
              value={x.v}
              positive
              pct={Math.round((x.v / FIN.monthlyRev) * 100)}
            />
          ))}
        </div>

        <div className="mb-1.5 mt-3.5 px-0.5 text-[11px] font-bold uppercase tracking-wide text-ink-mute">
          {t('finanzen:expenses')}
        </div>
        <div className="rounded-xl border border-rule bg-card px-3.5">
          {FIN.expenses.map((x) => (
            <Bar
              key={x.k}
              label={x.k}
              value={x.v}
              positive={false}
              pct={Math.round((Math.abs(x.v) / FIN.monthlyExp) * 100)}
            />
          ))}
        </div>

        <div className="mb-1.5 mt-3.5 px-0.5 text-[11px] font-bold uppercase tracking-wide text-ink-mute">
          {t('finanzen:levers')}
        </div>
        <div className="rounded-xl border border-rule bg-card p-3.5">
          {LEVERS.map((l) => (
            <div key={l.key} className="border-b border-rule py-2 last:border-0">
              <div className="flex items-baseline justify-between">
                <span className="text-[12.5px] font-bold text-ink">{t(`finanzen:${l.key}`)}</span>
                <span className="font-mono text-[11px] text-ink-mute">{l.hint}</span>
              </div>
              <div className="relative mt-2 h-1 rounded-full bg-bg-ink">
                <div
                  className="absolute left-0 top-0 h-1 rounded-full bg-accent"
                  style={{ width: `${l.value}%` }}
                />
                <div
                  className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-accent bg-card"
                  style={{ left: `calc(${l.value}% - 8px)` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScreenShell>
  )
}
