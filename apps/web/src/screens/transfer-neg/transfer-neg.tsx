import { Link } from '@tanstack/react-router'
import { ChevronLeft, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Portrait } from '@/components/atoms/portrait/portrait'
import { PosPill } from '@/components/atoms/pos-pill/pos-pill'
import { StrBar } from '@/components/atoms/str-bar/str-bar'
import { Talent } from '@/components/atoms/talent/talent'
import { ScreenShell } from '@/components/layout/screen-shell'
import { cn } from '@/lib/utils'
import { eurK, TRANSFER_NEG } from '../fixtures'

function OfferChip({ k, v, dark }: { k: string; v: string; dark: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-baseline gap-1 rounded-full px-2 py-[3px] font-mono text-[10.5px] font-extrabold not-italic',
        dark ? 'bg-white/10 text-white' : 'bg-bg-ink text-ink',
      )}
    >
      <span className="font-semibold opacity-70">{k}</span> {v}
    </span>
  )
}

function Lever({
  label,
  value,
  min,
  max,
  step,
  onChange,
  last,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (n: number) => void
  last?: boolean
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className={cn('py-[7px]', last ? null : 'border-b border-rule')}>
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-bold text-ink">{label}</span>
        <span className="font-mono text-xs font-extrabold text-accent">{eurK(value)}</span>
      </div>
      <div className="relative mt-1 h-6">
        <div className="absolute inset-x-0 top-2.5 h-1 rounded-full bg-bg-ink" />
        <div
          className="absolute left-0 top-2.5 h-1 rounded-full bg-accent"
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute top-[3px] h-[18px] w-[18px] rounded-full border-2 border-accent bg-card"
          style={{ left: `calc(${pct}% - 9px)` }}
        />
        <input
          type="range"
          aria-label={label}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </div>
    </div>
  )
}

/** Screen #38 — transfer counter-offer loop. */
export function TransferNeg() {
  const { t } = useTranslation(['transferNeg', 'common'])
  const { target, log, stress } = TRANSFER_NEG
  const [fee, setFee] = useState(2_500_000)
  const [bonus, setBonus] = useState(400_000)
  const [clause, setClause] = useState(7_000_000)

  const stressTone = stress >= 70 ? 'nearBreak' : stress >= 40 ? 'tense' : 'calm'
  const stressColour =
    stressTone === 'nearBreak' ? 'bg-danger' : stressTone === 'tense' ? 'bg-warn' : 'bg-ok'
  const stressText =
    stressTone === 'nearBreak' ? 'text-danger' : stressTone === 'tense' ? 'text-warn' : 'text-ok'
  const total = fee + bonus

  return (
    <ScreenShell label={t('transferNeg:eyebrow')}>
      <div className="relative flex flex-1 flex-col">
        <header className="px-4 pb-2 pt-1">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              aria-label={t('transferNeg:back')}
              className="grid h-9 w-9 place-items-center rounded-[10px] border border-rule bg-card text-ink"
            >
              <ChevronLeft size={18} />
            </Link>
            <div className="text-center">
              <div className="text-[10px] font-bold uppercase tracking-wide text-ink-mute">
                {t('transferNeg:eyebrow')}
              </div>
              <span className="font-display text-base font-bold text-ink">{target.name}</span>
            </div>
            <span
              aria-hidden
              className="grid h-9 w-9 place-items-center rounded-[10px] border border-rule bg-card text-ink"
            >
              <MoreHorizontal size={16} />
            </span>
          </div>
        </header>

        <div className="px-4 pb-2">
          <div className="flex items-center gap-2.5 rounded-xl border border-rule bg-card px-3.5 py-2.5">
            <Portrait name={target.name} size={42} variant="player" />
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <PosPill pos={target.pos} />
                <span className="text-[13px] font-bold text-ink">{target.name}</span>
                <span className="font-mono text-[10px] text-ink-soft">{target.nat}</span>
              </div>
              <div className="mt-0.5 text-[11px] text-ink-mute">
                {target.age} J. · {target.club}
              </div>
            </div>
            <div>
              <StrBar n={target.str} />
              <div className="mt-1 flex justify-end">
                <Talent n={target.tal} />
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pb-2">
          <div className="rounded-[10px] border border-rule bg-bg-ink px-3 py-2">
            <div className="flex items-baseline justify-between">
              <span className="text-[10.5px] font-bold uppercase tracking-wide text-ink-mute">
                {t('transferNeg:stressTitle')} · {t(`transferNeg:stress.${stressTone}`)}
              </span>
              <span className={cn('font-mono text-xs font-extrabold', stressText)}>{stress} %</span>
            </div>
            <div className="mt-1.5 h-[5px] overflow-hidden rounded-full bg-bg">
              <div className={cn('h-full', stressColour)} style={{ width: `${stress}%` }} />
            </div>
            <div className="mt-1.5 font-display text-[10.5px] italic text-ink-soft">
              {t('transferNeg:stressHint')}
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-4">
          <div className="mx-1 mb-2 mt-1 text-[10.5px] font-bold uppercase tracking-wide text-ink-mute">
            {t('transferNeg:historyTitle')}
          </div>
          {log.map((m) => {
            const us = m.side === 'us'
            return (
              <div
                key={`${m.who}-${m.when}`}
                className={cn(
                  'mb-2 flex max-w-[88%] flex-col',
                  us ? 'items-end self-end' : 'items-start self-start',
                )}
              >
                <div className="mb-0.5 font-mono text-[9.5px] text-ink-soft">
                  {m.who} · {m.when}
                </div>
                <div
                  className={cn(
                    'px-3 py-2.5 font-display text-[13px] italic leading-snug',
                    us
                      ? 'rounded-[14px_14px_4px_14px] bg-ink text-bg'
                      : 'rounded-[14px_14px_14px_4px] border border-rule bg-card text-ink',
                  )}
                >
                  {m.msg}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <OfferChip k={t('transferNeg:offer.fee')} v={eurK(m.offer.fee)} dark={us} />
                    {m.offer.bonus > 0 && (
                      <OfferChip
                        k={t('transferNeg:offer.bonus')}
                        v={eurK(m.offer.bonus)}
                        dark={us}
                      />
                    )}
                    {m.offer.clause && (
                      <OfferChip
                        k={t('transferNeg:offer.clause')}
                        v={eurK(m.offer.clause)}
                        dark={us}
                      />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="border-t border-rule bg-card px-4 pb-5 pt-2.5">
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className="text-[10.5px] font-bold uppercase tracking-wide text-ink-mute">
              {t('transferNeg:counterTitle')}
            </span>
            <span className="font-mono text-[10.5px] text-ink-soft">
              {t('transferNeg:sum')} · {eurK(total)}
            </span>
          </div>
          <Lever
            label={t('transferNeg:levers.fee')}
            value={fee}
            min={1_000_000}
            max={4_000_000}
            step={100_000}
            onChange={setFee}
          />
          <Lever
            label={t('transferNeg:levers.bonus')}
            value={bonus}
            min={0}
            max={800_000}
            step={50_000}
            onChange={setBonus}
          />
          <Lever
            label={t('transferNeg:levers.clause')}
            value={clause}
            min={0}
            max={12_000_000}
            step={500_000}
            onChange={setClause}
            last
          />
          <div className="mt-2.5 flex gap-2">
            <button
              type="button"
              className="h-[46px] flex-1 rounded-xl border border-rule bg-bg text-[12.5px] font-bold text-danger"
            >
              {t('transferNeg:giveUp')}
            </button>
            <button
              type="button"
              className="h-[46px] flex-[2] rounded-xl bg-ink text-[13.5px] font-extrabold text-bg"
            >
              {t('transferNeg:send')} · {eurK(total)}
            </button>
          </div>
        </div>
      </div>
    </ScreenShell>
  )
}
