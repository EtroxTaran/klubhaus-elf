import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface StatStripProps {
  label: string
  a: ReactNode
  b: ReactNode
  /** Which side to highlight as the stronger value. */
  accentSide?: 'a' | 'b'
  hint?: string
  /** Render the values in the mono numeric face. */
  mono?: boolean
  className?: string
}

/** Opposed-value comparison row with an optional highlighted winner side. */
export function StatStrip({
  label,
  a,
  b,
  accentSide,
  hint,
  mono = true,
  className,
}: StatStripProps) {
  return (
    <div className={cn('border-b border-rule py-2.5', className)}>
      <div className="flex items-center justify-between gap-2">
        <div
          className={cn(
            'min-w-16 text-sm font-bold',
            mono && 'font-mono',
            accentSide === 'a' ? 'text-accent' : 'text-ink',
          )}
        >
          {a}
        </div>
        <div className="text-[10px] font-bold uppercase tracking-[0.6px] text-ink-soft">
          {label}
        </div>
        <div
          className={cn(
            'flex min-w-16 justify-end text-sm font-bold',
            mono && 'font-mono',
            accentSide === 'b' ? 'text-accent' : 'text-ink',
          )}
        >
          {b}
        </div>
      </div>
      {hint && (
        <div className="mt-0.5 text-center font-display text-[10px] italic text-ink-soft">
          {hint}
        </div>
      )}
    </div>
  )
}
