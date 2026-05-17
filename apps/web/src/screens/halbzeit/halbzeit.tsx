import { Link } from '@tanstack/react-router'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FormationPitch } from '@/components/composites/formation-pitch/formation-pitch'

const FORMATIONS = ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '5-3-2'] as const
const MENTALITIES = ['hold', 'balanced', 'push'] as const

/** Half-time bottom sheet shown over the match feed. */
export function Halbzeit() {
  const { t } = useTranslation('halbzeit')
  return (
    <div className="absolute inset-0 z-20">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]" aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('title')}
        className="absolute inset-x-0 bottom-0 top-28 flex flex-col rounded-t-2xl bg-card p-4 shadow-lift"
      >
        <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-rule" />
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-ink-mute">
              {t('eyebrow')}
            </div>
            <span className="block font-display text-[22px] font-bold leading-tight text-ink">
              {t('title')}
            </span>
          </div>
          <span className="text-[11px] font-bold text-accent">{t('pause')}</span>
        </div>

        <div className="mt-3.5">
          <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-mute">
            {t('formation')}
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {FORMATIONS.map((f, i) => (
              <div
                key={f}
                className={`min-w-16 shrink-0 rounded-lg border px-2.5 py-2 text-center font-mono text-xs font-bold ${
                  i === 0 ? 'border-ink bg-ink text-bg' : 'border-rule bg-bg text-ink'
                }`}
              >
                {f}
                {i === 0 && (
                  <div className="mt-0.5 font-sans text-[9px] font-semibold opacity-70">
                    {t('current')}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-2.5 flex justify-center">
            <div className="w-[200px]">
              <FormationPitch formation="4-3-3" />
            </div>
          </div>
        </div>

        <div className="mt-2">
          <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-mute">
            {t('mentality')}
          </div>
          <div className="flex gap-1.5">
            {MENTALITIES.map((m, i) => (
              <button
                key={m}
                type="button"
                className={`h-11 flex-1 rounded-xl border text-[13px] font-bold ${
                  i === 1 ? 'border-ink bg-ink text-bg' : 'border-rule bg-bg text-ink'
                }`}
              >
                {t(`mentalities.${m}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2.5 rounded-xl border border-dashed border-rule bg-bg-ink px-3 py-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wide text-ink-mute">
              {t('suggestedSub')}
            </span>
            <span className="text-[10px] font-bold text-accent">{t('coachRecommends')}</span>
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-[13px]">
            <span className="font-bold text-ink">Holtmann</span>
            <ArrowRight size={16} className="text-ink-soft" />
            <span className="font-bold text-accent">Velten</span>
            <span className="flex-1" />
            <span className="text-[11px] text-ink-mute">{t('subNote')}</span>
          </div>
        </div>

        <div className="flex-1" />

        <button
          type="button"
          className="my-2 flex h-8 items-center justify-center gap-1 text-xs font-semibold text-ink-mute"
        >
          {t('moreTactics')} <ChevronDown size={14} />
        </button>
        <div className="flex gap-2">
          <Link
            to="/spiel"
            className="flex h-13 flex-1 items-center justify-center rounded-xl border border-rule bg-bg text-sm font-bold text-ink"
          >
            {t('keep')}
          </Link>
          <Link
            to="/spiel"
            className="flex h-13 flex-[2] items-center justify-center rounded-xl bg-accent text-[15px] font-extrabold text-white"
          >
            {t('apply')}
          </Link>
        </div>
      </div>
    </div>
  )
}
