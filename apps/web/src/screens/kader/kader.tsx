import { Link } from '@tanstack/react-router'
import { ChevronDown, Filter, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PlayerCard } from '@/components/composites/player-card/player-card'
import { ScreenShell } from '@/components/layout/screen-shell'
import { SQUAD } from '../fixtures'

const SORTS = ['strength', 'age', 'contract', 'talent', 'position'] as const

export function Kader() {
  const { t } = useTranslation(['kader', 'common'])
  const starters = SQUAD.filter((p) => !p.bench)
  const bench = SQUAD.filter((p) => p.bench)
  return (
    <ScreenShell label={t('kader:title')}>
      <header className="px-4 pb-2.5 pt-1">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-mute">
              {t('kader:eyebrow', { count: SQUAD.length })}
            </div>
            <span className="block font-display text-[26px] font-bold leading-none text-ink">
              {t('kader:title')}
            </span>
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              aria-label={t('kader:searchAria')}
              className="grid h-9 w-9 place-items-center rounded-md border border-rule bg-card text-ink"
            >
              <Search size={16} />
            </button>
            <Link
              to="/"
              aria-label={t('common:back')}
              className="grid h-9 w-9 place-items-center rounded-md border border-rule bg-card text-ink"
            >
              <Filter size={16} aria-label={t('kader:filterAria')} />
            </Link>
          </div>
        </div>
        <div className="mt-2.5 flex gap-1.5 overflow-x-auto">
          {SORTS.map((s, i) => (
            <span
              key={s}
              className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[11px] font-semibold ${
                i === 0 ? 'border-ink bg-ink text-bg' : 'border-rule text-ink-mute'
              }`}
            >
              {t(`kader:sort.${s}`)}
              {i === 0 && <ChevronDown size={12} />}
            </span>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-3 pb-5 pt-1">
        {starters.map((p) => (
          <PlayerCard key={p.shirt} player={p} />
        ))}
        <div className="px-1 py-3 text-[11px] font-bold uppercase tracking-wide text-ink-soft">
          {t('kader:bench')}
        </div>
        {bench.map((p) => (
          <PlayerCard key={p.shirt} player={p} />
        ))}
      </div>
    </ScreenShell>
  )
}
