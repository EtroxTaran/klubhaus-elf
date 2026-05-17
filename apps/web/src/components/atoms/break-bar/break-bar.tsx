import { cn } from '@/lib/utils'

export interface BreakRow {
  label: string
  /** Share in percent (0–100). */
  value: number
  /** Segment colour (hex or CSS var). */
  color: string
}

export interface BreakBarProps {
  rows: BreakRow[]
  className?: string
}

/** Stacked 100% bar + a 2-column legend. */
export function BreakBar({ rows, className }: BreakBarProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex h-2 overflow-hidden rounded-full bg-bg-ink">
        {rows.map((r) => (
          <div
            key={r.label}
            style={{ width: `${r.value}%`, backgroundColor: r.color }}
            aria-hidden
          />
        ))}
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center gap-1.5 text-[11px] text-ink-mute">
            <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: r.color }} aria-hidden />
            <span className="flex-1">{r.label}</span>
            <span className="font-mono tabular-nums">{r.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
