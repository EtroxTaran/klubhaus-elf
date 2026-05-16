import { Link } from '@tanstack/react-router'
import { ChevronLeft, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Crest } from '@/components/atoms/crest/crest'
import { LiveXgStrip } from '@/components/composites/live-xg-strip/live-xg-strip'
import { MatchEvent } from '@/components/composites/match-event/match-event'
import { ScreenShell } from '@/components/layout/screen-shell'
import { clubByName } from '@/theme/club-registry'
import { FEED, XG } from '../fixtures'
import { Halbzeit } from '../halbzeit/halbzeit'

const NBC = clubByName('Northbridge City')
const FCH = clubByName('FC Hafenstadt')
const TABS = ['report', 'ticker', 'lineup'] as const

export interface SpielProps {
  halftimeOpen?: boolean
}

export function Spiel({ halftimeOpen = false }: SpielProps) {
  const { t } = useTranslation(['spiel', 'common'])
  return (
    <ScreenShell label={t('common:appName')}>
      <div className="relative flex flex-1 flex-col">
        <header className="border-b border-rule bg-card px-3.5 pb-2.5 pt-2">
          <div className="flex items-center justify-between">
            <Link
              to="/anpfiff"
              aria-label={t('common:back')}
              className="grid h-9 w-9 place-items-center rounded-md border border-rule bg-bg-ink text-ink"
            >
              <ChevronLeft size={18} />
            </Link>
            <div className="text-center text-[10px] font-bold uppercase tracking-wide text-ink-mute">
              {t('spiel:competition')}
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-md border border-rule bg-bg-ink text-ink">
              <Settings size={16} />
            </span>
          </div>
          <div className="mt-1.5 flex items-center justify-center gap-3.5">
            <div className="flex items-center gap-2">
              <Crest {...NBC.crest} size={28} label={NBC.name} />
              <span className="font-display text-sm font-bold text-ink">Northbridge</span>
            </div>
            <span className="font-display text-[42px] font-extrabold leading-none tracking-tighter text-ink">
              1<span className="text-ink-soft">:</span>
              <span className="text-accent">2</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-bold text-ink">Hafenstadt</span>
              <Crest {...FCH.crest} size={28} label={FCH.name} />
            </div>
          </div>
          <div className="mt-1.5 flex items-center justify-center gap-2.5">
            <span className="font-mono text-[11px] font-bold text-accent">{t('spiel:live')}</span>
            <span className="text-[11px] text-ink-mute">{t('spiel:spectators')}</span>
          </div>
          <LiveXgStrip points={XG} aLabel="NBC" bLabel="FCH" className="mt-1.5" />
          <div className="mt-2 flex gap-0.5 rounded-lg bg-bg-ink p-[3px]">
            {TABS.map((tab, i) => (
              <span
                key={tab}
                className={`flex-1 rounded-md py-1.5 text-center text-[11px] font-bold ${
                  i === 0 ? 'bg-card text-ink shadow-paper' : 'text-ink-mute'
                }`}
              >
                {t(`spiel:tabs.${tab}`)}
              </span>
            ))}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-3.5 pb-24 pt-2">
          {FEED.map((e) => (
            <MatchEvent
              key={`${e.min}-${e.t}`}
              min={e.min}
              kind={e.kind}
              title={e.t}
              sub={e.s}
              {...(e.score ? { score: e.score } : {})}
            />
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-gradient-to-t from-bg via-bg to-transparent p-3.5 pb-6">
          <Link
            to="/spiel"
            search={{ halbzeit: 1 }}
            className="flex h-12 flex-1 items-center justify-center rounded-xl border border-rule bg-card text-[13px] font-bold text-ink"
          >
            {t('spiel:pause')}
          </Link>
          <button
            type="button"
            className="flex h-12 flex-[2] items-center justify-center gap-1.5 rounded-xl bg-ink text-sm font-extrabold text-bg"
          >
            {t('spiel:speed')} ❯❯{' '}
            <span className="text-[11px] font-semibold opacity-60">{t('spiel:speedFactor')}</span>
          </button>
        </div>

        {halftimeOpen && <Halbzeit />}
      </div>
    </ScreenShell>
  )
}
