import { Link } from '@tanstack/react-router'
import { ArrowRight, ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Portrait } from '@/components/atoms/portrait/portrait'
import { ScreenShell } from '@/components/layout/screen-shell'
import { cn } from '@/lib/utils'
import { PRESS_CONFERENCE, type PressStakeholder } from '../fixtures'

function deltaTone(d: number): 'up' | 'down' | 'neutral' {
  return d > 0 ? 'up' : d < 0 ? 'down' : 'neutral'
}

function OutcomeChip({ who, d }: { who: string; d: number }) {
  const tone = deltaTone(d)
  const sign = d > 0 ? '▲' : d < 0 ? '▼' : '='
  const cls =
    tone === 'up'
      ? 'bg-ok/15 text-ok'
      : tone === 'down'
        ? 'bg-danger/15 text-danger'
        : 'bg-ink-mute/15 text-ink-mute'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[10.5px] font-extrabold',
        cls,
      )}
    >
      {who} <span className="tracking-widest">{sign.repeat(Math.max(1, Math.abs(d)))}</span>
    </span>
  )
}

function ReactionRow({ who, d, verb }: { who: string; d: number; verb: string }) {
  const tone = deltaTone(d)
  const colour = tone === 'up' ? 'bg-ok' : tone === 'down' ? 'bg-danger' : 'bg-ink-mute'
  const text = tone === 'up' ? 'text-ok' : tone === 'down' ? 'text-danger' : 'text-ink-mute'
  const label = d > 0 ? `+ ${d}` : d < 0 ? `${d}` : '±0'
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-10 text-[11.5px] font-bold text-ink">{who}</span>
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-bg-ink">
        <span className="absolute inset-y-0 left-1/2 w-px bg-ink-soft/50" />
        <div
          className={cn('absolute inset-y-0', colour)}
          style={{
            left: d >= 0 ? '50%' : `${50 + d * 10}%`,
            width: `${Math.abs(d) * 10}%`,
          }}
        />
      </div>
      <span className={cn('w-10 text-right font-mono text-[10.5px] font-extrabold', text)}>
        {label}
      </span>
      <span className="w-[88px] font-display text-[10px] italic text-ink-mute">{verb}</span>
    </div>
  )
}

/** Screen #36 — branching pre-match press conference. */
export function Pressekonferenz() {
  const { t } = useTranslation(['pressekonferenz', 'common'])
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const total = PRESS_CONFERENCE.length
  const q = PRESS_CONFERENCE[idx]
  if (!q) return null

  const next = () => {
    setPicked(null)
    setIdx((i) => (i < total - 1 ? i + 1 : 0))
  }
  const whoLabel = (w: PressStakeholder) => t(`pressekonferenz:who.${w}`)

  return (
    <ScreenShell label={t('pressekonferenz:eyebrow')}>
      <div className="relative flex flex-1 flex-col">
        <header className="px-4 pb-2 pt-1">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              aria-label={t('pressekonferenz:back')}
              className="grid h-9 w-9 place-items-center rounded-[10px] border border-rule bg-card text-ink"
            >
              <ChevronLeft size={18} />
            </Link>
            <div className="text-center">
              <div className="text-[10px] font-bold uppercase tracking-wide text-ink-mute">
                {t('pressekonferenz:eyebrow')}
              </div>
              <span className="font-display text-base font-bold text-ink">
                {t('pressekonferenz:title')}
              </span>
            </div>
            <span className="min-w-9 text-right font-mono text-[10px] font-bold text-ink-mute">
              {idx + 1}/{total}
            </span>
          </div>
          <div
            className="mt-2 flex gap-[5px]"
            role="progressbar"
            aria-label={t('pressekonferenz:progressAria')}
            aria-valuenow={idx + 1}
            aria-valuemin={1}
            aria-valuemax={total}
          >
            {PRESS_CONFERENCE.map((_, i) => (
              <span
                key={i}
                className={cn('h-1 flex-1 rounded-full', i <= idx ? 'bg-accent' : 'bg-rule')}
              />
            ))}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 pb-28 pt-3">
          <div className="mb-3.5 rounded-[14px] border border-rule bg-card p-4">
            <div className="flex items-start gap-2.5">
              <Portrait name={q.who} size={36} />
              <div className="flex-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[11px] font-extrabold text-ink">{q.who}</span>
                  <span className="text-[10px] font-semibold text-ink-soft">{q.whoTag}</span>
                </div>
                <span className="mt-1 block font-display text-[17px] font-bold leading-snug text-ink">
                  „{q.q}"
                </span>
              </div>
            </div>
          </div>

          {picked === null ? (
            <>
              <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-mute">
                {t('pressekonferenz:answerLabel')}
              </div>
              {q.answers.map((a, i) => (
                <button
                  type="button"
                  key={a.text}
                  onClick={() => setPicked(i)}
                  className="mb-2 block w-full rounded-[14px] border border-rule bg-card p-3.5 text-left"
                >
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <span className="text-[9.5px] font-extrabold uppercase tracking-wide text-accent">
                      {t(`pressekonferenz:tones.${a.tone}`)}
                    </span>
                    <span className="text-[10px] text-ink-soft">
                      {t('pressekonferenz:predicted')}
                    </span>
                  </div>
                  <span className="block font-display text-sm font-bold leading-snug text-ink">
                    „{a.text}"
                  </span>
                  <div className="mt-2 flex flex-wrap gap-[5px]">
                    {a.predict.map((p) => (
                      <OutcomeChip key={p.who} who={whoLabel(p.who)} d={p.d} />
                    ))}
                  </div>
                </button>
              ))}
            </>
          ) : (
            <>
              <div className="mb-3.5 rounded-[14px] border border-accent bg-accent-soft p-3.5">
                <div className="mb-1 text-[9.5px] font-extrabold uppercase tracking-wide text-accent">
                  {t('pressekonferenz:youSaid')} ·{' '}
                  {t(`pressekonferenz:tones.${q.answers[picked]?.tone}`)}
                </div>
                <span className="block font-display text-base font-bold leading-snug text-ink">
                  „{q.answers[picked]?.text}"
                </span>
              </div>
              <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-mute">
                {t('pressekonferenz:reaction')}
              </div>
              <div className="mb-3.5 rounded-[14px] border border-rule bg-card p-4">
                <div className="flex flex-col gap-2">
                  {q.answers[picked]?.predict.map((p) => (
                    <ReactionRow
                      key={p.who}
                      who={whoLabel(p.who)}
                      d={p.d}
                      verb={t(`pressekonferenz:verbs.${deltaTone(p.d)}`)}
                    />
                  ))}
                </div>
                <div className="mt-2.5 rounded-lg bg-bg-ink p-2.5 font-display text-xs italic text-ink-mute">
                  {t(`pressekonferenz:critics.${q.answers[picked]?.tone}`)}
                </div>
              </div>
            </>
          )}
        </div>

        {picked !== null && (
          <div className="absolute inset-x-0 bottom-0 border-t border-rule bg-bg px-4 pb-5 pt-2.5">
            <button
              type="button"
              onClick={next}
              className="inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] bg-ink text-sm font-extrabold text-bg"
            >
              {idx < total - 1 ? t('pressekonferenz:next') : t('pressekonferenz:finish')}
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </ScreenShell>
  )
}
