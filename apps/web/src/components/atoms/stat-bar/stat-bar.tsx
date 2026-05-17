import { cn } from '@/lib/utils'

export type StatBarMode = 'pct' | 'count' | 'xg'

export interface StatBarProps {
  label: string
  a: number
  b: number
  /** pct = values are percentages; count/xg = normalised share of a+b. */
  mode?: StatBarMode
  /** Drop the bottom hairline (last row in a group). */
  last?: boolean
  className?: string
}

function format(value: number, mode: StatBarMode): string {
  return mode === 'xg' ? value.toString().replace('.', ',') : String(value)
}

/** Opposed live match stat: two values + a centre-split bar; winner in accent. */
export function StatBar({ label, a, b, mode = 'pct', last, className }: StatBarProps) {
  let aw: number
  let bw: number
  if (mode === 'pct') {
    aw = a
    bw = b
  } else {
    const total = a + b || 1
    aw = (a / total) * 100
    bw = (b / total) * 100
  }
  return (
    <div data-mode={mode} className={cn('py-2', last ? null : 'border-b border-rule', className)}>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span
          className={cn(
            'w-10 text-right font-mono text-[13px] font-extrabold tabular-nums',
            a > b ? 'text-accent' : 'text-ink',
          )}
        >
          {format(a, mode)}
        </span>
        <span className="flex-1 text-center text-[10.5px] font-bold uppercase tracking-wide text-ink-mute">
          {label}
        </span>
        <span
          className={cn(
            'w-10 font-mono text-[13px] font-extrabold tabular-nums',
            b > a ? 'text-accent' : 'text-ink',
          )}
        >
          {format(b, mode)}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <div className="flex h-[5px] flex-1 justify-end overflow-hidden rounded-full bg-bg-ink">
          <div
            style={{ width: `${aw}%` }}
            className={cn('h-full rounded-full', a >= b ? 'bg-accent' : 'bg-ink-mute')}
          />
        </div>
        <div className="flex h-[5px] flex-1 overflow-hidden rounded-full bg-bg-ink">
          <div
            style={{ width: `${bw}%` }}
            className={cn('h-full rounded-full', b > a ? 'bg-accent' : 'bg-ink-mute')}
          />
        </div>
      </div>
    </div>
  )
}
