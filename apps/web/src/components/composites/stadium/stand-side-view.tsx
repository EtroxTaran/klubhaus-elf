import type { Stand } from '@/types/stadium'
import { standSideGeometry } from './stadium-geometry'

export interface StandSideViewProps {
  stand: Stand
  className?: string
}

/** Side cross-section: terrace stairs, standing/seat/VIP markers, roof tier. */
export function StandSideView({ stand, className }: StandSideViewProps) {
  const g = standSideGeometry(stand)
  let d = `M${g.baseX} ${g.pitchY} `
  for (let i = 0; i < g.rows; i++) {
    const x = g.baseX + i * g.stepW
    const y = g.pitchY - i * g.stepH
    d += `L${x} ${y} L${x + g.stepW} ${y} `
  }
  d += `L${g.baseX + g.rows * g.stepW} ${g.pitchY} Z`

  const yTop = g.pitchY - g.rows * g.stepH - 6
  const wTop = g.rows * g.stepW

  return (
    <svg
      viewBox={`0 0 ${g.W} ${g.H}`}
      className={className}
      role="img"
      aria-label={`${stand.name} Seitenansicht`}
      data-roof={g.roof}
    >
      <rect x="0" y="0" width={g.W} height={g.H} fill="var(--c-bg)" />
      <rect
        x="0"
        y={g.pitchY}
        width={g.W}
        height={g.H - g.pitchY}
        fill="var(--c-ok)"
        opacity="0.55"
      />
      <line x1="0" y1={g.pitchY} x2={g.W} y2={g.pitchY} stroke="var(--c-ink)" strokeWidth="0.6" />
      <path d={d} fill="var(--c-card)" stroke="var(--c-ink)" strokeWidth="0.7" />
      {Array.from({ length: g.rows }).map((_, i) => {
        const x = g.baseX + i * g.stepW
        const y = g.pitchY - i * g.stepH
        const isVip = stand.vip > 0 && i === g.rows - 1
        const isStanding = i < g.standingRows
        if (isVip) {
          return (
            <rect
              key={i}
              x={x + 1}
              y={y - g.stepH + 2}
              width={g.stepW - 2}
              height={g.stepH - 3}
              fill="var(--c-warn)"
              fillOpacity="0.25"
              stroke="var(--c-warn)"
              strokeWidth="0.5"
            />
          )
        }
        return (
          <line
            key={i}
            x1={x + 2}
            y1={y - 2}
            x2={x + g.stepW - 2}
            y2={y - 2}
            stroke={isStanding ? 'var(--c-ink-mute)' : 'var(--c-ink-soft)'}
            strokeWidth={isStanding ? 1.4 : 0.9}
            strokeDasharray={isStanding ? undefined : '1.5 1.5'}
          />
        )
      })}
      {g.roof !== 'open' &&
        (g.roof === 'full' ? (
          <path
            d={`M${g.baseX - 4} ${yTop + 6} L${g.baseX + wTop + 4} ${yTop + 2} L${g.baseX + wTop + 4} ${yTop - 2} L${g.baseX - 4} ${yTop + 2} Z`}
            fill="var(--c-ink)"
          />
        ) : (
          <path
            d={`M${g.baseX + wTop * 0.4} ${yTop + 5} L${g.baseX + wTop + 4} ${yTop + 2} L${g.baseX + wTop + 4} ${yTop - 2} L${g.baseX + wTop * 0.4} ${yTop + 1} Z`}
            fill="var(--c-ink)"
          />
        ))}
    </svg>
  )
}
