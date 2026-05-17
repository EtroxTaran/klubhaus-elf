import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TalentProps {
  /** Talent tier 1–4. */
  n: number
  max?: number
  className?: string
}

/** 4-tier talent. Accent stars filled, rule stars empty. */
export function Talent({ n, max = 4, className }: TalentProps) {
  return (
    <span
      className={cn('inline-flex gap-px', className)}
      role="img"
      aria-label={`Talent ${n} von ${max}`}
    >
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={11}
          className={i < n ? 'fill-accent text-accent' : 'text-rule'}
          aria-hidden
        />
      ))}
    </span>
  )
}
