import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

const POS_COLOR: Record<string, string> = {
  TW: '#a3680f',
  IV: '#3f6a2f',
  AV: '#3f6a2f',
  DM: '#1f6f9a',
  ZM: '#1f6f9a',
  OM: '#7a3a8a',
  FL: '#7a3a8a',
  ST: 'var(--c-accent)',
}

/** Semantic colour for a playing position; falls back to ink. */
export function posColor(pos: string): string {
  return POS_COLOR[pos] ?? 'var(--c-ink)'
}

export interface PosPillProps {
  pos: string
  className?: string
}

/** Position badge with a semantic tint (mono, 11px). */
export function PosPill({ pos, className }: PosPillProps) {
  const color = posColor(pos)
  const style = {
    color,
    backgroundColor: `color-mix(in oklab, ${color} 12%, transparent)`,
    borderColor: `color-mix(in oklab, ${color} 22%, transparent)`,
  } satisfies CSSProperties
  return (
    <span
      data-pos={pos}
      style={style}
      className={cn(
        'inline-flex h-[22px] min-w-[30px] items-center justify-center rounded-md border px-2 font-mono text-[11px] font-bold tracking-wide',
        className,
      )}
    >
      {pos}
    </span>
  )
}
