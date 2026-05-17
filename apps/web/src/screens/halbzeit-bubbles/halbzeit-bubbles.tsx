import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Portrait } from '@/components/atoms/portrait/portrait'
import { PosPill } from '@/components/atoms/pos-pill/pos-pill'
import { ScreenShell } from '@/components/layout/screen-shell'
import { cn } from '@/lib/utils'
import { HALFTIME_TALK, type VoiceMood } from '../fixtures'

function moodClasses(mood: VoiceMood): { dot: string; glyph: string } {
  if (mood === 'energie') return { dot: 'bg-ok', glyph: '!' }
  if (mood === 'frust') return { dot: 'bg-warn', glyph: '?' }
  return { dot: 'bg-danger', glyph: '~' }
}

/** Screen #37 — half-time dressing-room speech bubbles. */
export function HalbzeitBubbles() {
  const { t } = useTranslation(['halbzeitBubbles', 'common'])
  const { voices } = HALFTIME_TALK
  const [picks, setPicks] = useState<Array<number | null>>(() => voices.map(() => null))

  return (
    <ScreenShell label={t('halbzeitBubbles:screenLabel')}>
      <div className="relative flex flex-1 flex-col bg-bg">
        <div className="px-4 py-[18px] opacity-50">
          <span className="block text-[11px] font-bold uppercase tracking-wide text-ink-mute">
            {HALFTIME_TALK.clock}
          </span>
          <span className="mt-0.5 block font-display text-[28px] font-extrabold leading-tight text-ink">
            {HALFTIME_TALK.scoreLine}
          </span>
          <div className="mt-1 font-display text-xs italic text-ink-mute">
            {HALFTIME_TALK.statLine}
          </div>
        </div>
        <div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]" />

        <div className="absolute inset-x-0 bottom-0 top-24 flex flex-col overflow-hidden rounded-t-[24px] bg-card px-4 pb-24 pt-2.5 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.25)]">
          <div className="mx-auto mb-2 mt-1 h-1 w-[42px] rounded-full bg-rule" />
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wide text-ink-mute">
                {t('halbzeitBubbles:eyebrow')}
              </div>
              <span className="block font-display text-[22px] font-bold leading-tight text-ink">
                {t('halbzeitBubbles:title')}
              </span>
            </div>
            <span className="rounded-full bg-accent-soft px-2 py-1 text-[11px] font-extrabold text-accent">
              {HALFTIME_TALK.pause}
            </span>
          </div>
          <div className="mt-1 font-display text-xs italic text-ink-mute">
            {t('halbzeitBubbles:subtitle')}
          </div>

          <div className="mt-3.5 flex-1 overflow-y-auto pr-0.5">
            {voices.map((v, vi) => {
              const mood = moodClasses(v.mood)
              return (
                <div key={v.name} className="mb-3.5">
                  <div className="flex items-start gap-2">
                    <div className="relative basis-[38px]">
                      <Portrait name={v.name} size={38} variant="player" />
                      <span
                        className={cn(
                          'absolute -bottom-0.5 -right-0.5 grid h-[18px] w-[18px] place-items-center rounded-full border-2 border-card text-[11px] font-extrabold text-white',
                          mood.dot,
                        )}
                      >
                        {mood.glyph}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs font-extrabold text-ink">{v.name}</span>
                        <PosPill pos={v.pos} />
                        <span className="font-mono text-[10.5px] font-bold text-ok">
                          {v.form.toString().replace('.', ',')}
                        </span>
                      </div>
                      <div className="relative mt-1.5 rounded-[4px_14px_14px_14px] bg-bg-ink px-3 py-2.5">
                        <span
                          className="absolute -left-[7px] top-0 h-0 w-0"
                          style={{
                            borderTop: '8px solid var(--c-bg-ink)',
                            borderLeft: '8px solid transparent',
                          }}
                        />
                        <span className="font-display text-[13.5px] italic leading-snug text-ink">
                          {v.line}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-[5px]">
                        {v.reactions.map((r, ri) => {
                          const chosen = picks[vi] === ri
                          const primary = picks[vi] === null && ri === 0
                          return (
                            <button
                              type="button"
                              key={r.l}
                              onClick={() =>
                                setPicks((prev) => prev.map((p, idx) => (idx === vi ? ri : p)))
                              }
                              aria-pressed={chosen}
                              className={cn(
                                'min-w-0 flex-1 rounded-[9px] border px-2 py-[7px] text-left',
                                chosen || primary ? 'border-ink bg-card' : 'border-rule bg-bg',
                                chosen && 'ring-1 ring-accent',
                              )}
                            >
                              <div className="text-[11.5px] font-extrabold leading-tight text-ink">
                                {r.l}
                              </div>
                              <div className="mt-0.5 text-[9.5px] text-ink-mute">{r.e}</div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-bg px-4 pb-6 pt-2.5">
          <button
            type="button"
            className="h-[50px] flex-1 rounded-[14px] border border-rule bg-card text-[13px] font-bold text-ink"
          >
            {t('halbzeitBubbles:moreTactics')}
          </button>
          <button
            type="button"
            className="h-[50px] flex-[2] rounded-[14px] bg-accent text-sm font-extrabold text-white"
          >
            {t('halbzeitBubbles:kickoff')}
          </button>
        </div>
      </div>
    </ScreenShell>
  )
}
