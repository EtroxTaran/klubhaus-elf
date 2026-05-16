import { cn } from '@/lib/utils'

const W = 120
const H = 32

/** Maps a data series to evenly-spaced points within the viewBox. */
export function sparkPoints(data: number[], w = W, h = H): Array<{ x: number; y: number }> {
  if (data.length === 0) return []
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const step = data.length === 1 ? 0 : w / (data.length - 1)
  return data.map((v, i) => ({
    x: data.length === 1 ? w / 2 : i * step,
    y: h - ((v - min) / span) * h,
  }))
}

export interface SparklineProps {
  data: number[]
  className?: string
  label?: string
}

/** Inline accent sparkline with a 12% area fill; last point emphasised. */
export function Sparkline({ data, className, label }: SparklineProps) {
  const pts = sparkPoints(data)
  if (pts.length === 0) {
    return (
      <svg
        className={cn('block', className)}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={label ?? 'Keine Daten'}
        data-empty
      />
    )
  }
  const line = pts.map((p) => `${p.x},${p.y}`).join(' ')
  const last = pts[pts.length - 1] as { x: number; y: number }
  const area = `0,${H} ${line} ${last.x},${H}`
  return (
    <svg
      className={cn('block', className)}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={label ?? 'Verlauf'}
    >
      <polygon points={area} fill="var(--c-accent)" fillOpacity="0.12" />
      <polyline
        points={line}
        fill="none"
        stroke="var(--c-accent)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last.x} cy={last.y} r="2.4" fill="var(--c-accent)" />
    </svg>
  )
}
