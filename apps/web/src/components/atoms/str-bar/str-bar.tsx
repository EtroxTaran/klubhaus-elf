import { cn } from '@/lib/utils'

export interface StrBarProps {
  /** Strength 1–10. */
  n: number
  max?: number
  className?: string
}

/** 1–10 strength: numeric value (never colour-only) + glyph bar. */
export function StrBar({ n, max = 10, className }: StrBarProps) {
  return (
    <div
      className={cn('flex items-center gap-1', className)}
      role="img"
      aria-label={`Stärke ${n} von ${max}`}
    >
      <span className="mr-1 font-mono text-xs font-semibold tabular-nums text-ink">{n}</span>
      <div className="flex w-[72px] gap-[2px]">
        {Array.from({ length: max }).map((_, i) => (
          <div key={i} className={cn('h-1.5 flex-1 rounded-[1px]', i < n ? 'bg-ink' : 'bg-rule')} />
        ))}
      </div>
    </div>
  )
}
