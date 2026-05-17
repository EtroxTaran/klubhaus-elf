import { cn } from '@/lib/utils'

export interface XgPoint {
  min: number
  a: number
  b: number
}

const W = 100
const H = 26

export function xgPath(points: XgPoint[], key: 'a' | 'b'): string {
  if (points.length === 0) return ''
  const maxMin = Math.max(...points.map((p) => p.min)) || 1
  const maxVal = Math.max(1, ...points.map((p) => Math.max(p.a, p.b)))
  return points
    .map((p, i) => {
      const x = (p.min / maxMin) * W
      const y = H - (p[key] / maxVal) * H
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

export interface LiveXgStripProps {
  points: XgPoint[]
  aLabel: string
  bLabel: string
  className?: string
}

/** Live xG line for the match header: accent (home) vs muted (away). */
export function LiveXgStrip({ points, aLabel, bLabel, className }: LiveXgStripProps) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={cn('block h-7 w-full', className)}
      role="img"
      aria-label={`xG-Verlauf ${bLabel} gegen ${aLabel}`}
    >
      <line
        x1={W / 2}
        y1="0"
        x2={W / 2}
        y2={H}
        stroke="var(--c-rule)"
        strokeWidth="0.5"
        strokeDasharray="2 2"
      />
      <path d={xgPath(points, 'a')} fill="none" stroke="var(--c-ink-mute)" strokeWidth="1" />
      <path d={xgPath(points, 'b')} fill="none" stroke="var(--c-accent)" strokeWidth="1.4" />
    </svg>
  )
}
