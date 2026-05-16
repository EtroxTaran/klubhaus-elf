import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type InboxTone = 'board' | 'media' | 'sponsor' | 'scout' | 'fan'

interface ToneMeta {
  glyph: string
  badge: string
}

/** Glyph + colour per sender type (never colour-only — WCAG). */
export function toneMeta(tone: InboxTone): ToneMeta {
  switch (tone) {
    case 'board':
      return { glyph: '§', badge: 'bg-accent-soft text-accent' }
    case 'media':
      return { glyph: '¶', badge: 'bg-bg-ink text-ink' }
    case 'sponsor':
      return { glyph: '€', badge: 'bg-bg-ink text-warn' }
    case 'scout':
      return { glyph: '◎', badge: 'bg-bg-ink text-ok' }
    default:
      return { glyph: '♪', badge: 'bg-bg-ink text-ink-mute' }
  }
}

export interface InboxCardProps {
  tone: InboxTone
  /** Localised sender-type label, e.g. "Vorstand". */
  senderLabel: string
  from: string
  title: string
  body: string
  time: string
  /** Action row (pill buttons). */
  children: ReactNode
}

/** Twitter-style inbox card for board / media / sponsor / scout / fan events. */
export function InboxCard({
  tone,
  senderLabel,
  from,
  title,
  body,
  time,
  children,
}: InboxCardProps) {
  const meta = toneMeta(tone)
  return (
    <article data-tone={tone} className="mb-2.5 rounded-lg border border-rule bg-card p-3">
      <div className="flex items-start gap-2.5">
        <div
          className={cn(
            'grid h-9 w-9 shrink-0 place-items-center rounded-md font-display text-base font-extrabold',
            meta.badge,
          )}
          aria-hidden
        >
          {meta.glyph}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.3px] text-ink-mute">
              {senderLabel} · {from}
            </span>
            <span className="whitespace-nowrap text-[10px] text-ink-soft">{time}</span>
          </div>
          <span className="mt-0.5 block font-display text-[17px] font-bold leading-snug text-ink">
            {title}
          </span>
          <p className="mt-1 text-[13px] leading-snug text-ink-mute">{body}</p>
        </div>
      </div>
      <div className="mt-2.5 flex gap-1.5">{children}</div>
    </article>
  )
}
