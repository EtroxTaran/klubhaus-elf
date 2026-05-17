import { cn } from '@/lib/utils'
import { MiniPitch } from '../mini-pitch/mini-pitch'

export type MatchEventKind = 'goal' | 'chance' | 'card' | 'sub' | 'set' | 'whistle'

interface Meta {
  text: string
  letter: string
}

export function eventMeta(kind: MatchEventKind): Meta {
  switch (kind) {
    case 'goal':
      return { text: 'text-accent', letter: '⚽' }
    case 'chance':
      return { text: 'text-warn', letter: '⟶' }
    case 'card':
      return { text: 'text-warn', letter: '▮' }
    case 'sub':
      return { text: 'text-ink-mute', letter: '⇅' }
    case 'whistle':
      return { text: 'text-ink-soft', letter: '❘' }
    default:
      return { text: 'text-ink-mute', letter: '⌖' }
  }
}

export interface MatchEventProps {
  min: string
  kind: MatchEventKind
  title: string
  sub: string
  score?: string
}

/** One match-feed row: minute, glyph, newspaper headline + sub. */
export function MatchEvent({ min, kind, title, sub, score }: MatchEventProps) {
  const meta = eventMeta(kind)
  const isGoal = kind === 'goal'
  return (
    <div data-kind={kind} className="flex gap-2.5 border-b border-rule py-2.5">
      <div className="w-11 shrink-0 text-right">
        <div className="font-mono text-[13px] font-bold tabular-nums text-ink-mute">{min}</div>
        {score && <div className="mt-0.5 font-mono text-[10px] font-bold text-accent">{score}</div>}
      </div>
      <div className="flex w-[22px] shrink-0 justify-center pt-0.5">
        {kind === 'set' ? (
          <span className="text-ink-mute">
            <MiniPitch size={20} />
          </span>
        ) : (
          <span
            className={cn(
              'inline-block h-[22px] w-[22px] rounded-md text-center text-[11px] font-extrabold leading-[22px]',
              meta.text,
            )}
          >
            {meta.letter}
          </span>
        )}
      </div>
      <div className="flex-1">
        <span
          className={cn(
            'block font-display leading-tight',
            isGoal ? 'text-[17px] font-extrabold text-accent' : 'text-sm font-bold text-ink',
          )}
        >
          {title}
        </span>
        <div className={cn('mt-px font-display text-xs text-ink-mute', !isGoal && 'italic')}>
          {sub}
        </div>
      </div>
    </div>
  )
}
