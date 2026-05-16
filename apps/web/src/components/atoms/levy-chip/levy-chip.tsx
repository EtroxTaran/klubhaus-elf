import { cn } from '@/lib/utils'

export interface LevyChipProps {
  /** Pre-formatted levy label, e.g. "Verbandsabgabe · 300.000 €". */
  label: string
  className?: string
}

/** Always-visible federation levy chip — the recurring friction reminder. */
export function LevyChip({ label, className }: LevyChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-bold tracking-[0.3px] text-accent',
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
      {label}
    </span>
  )
}
