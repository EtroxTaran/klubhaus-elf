import { cn } from '@/lib/utils'
import { type Formation, formationPoints } from './formation-map'

export interface FormationPitchProps {
  formation?: Formation
  className?: string
  label?: string
}

/** Vertical pitch with 11 player nodes. Scales to container width. */
export function FormationPitch({ formation = '4-3-3', className, label }: FormationPitchProps) {
  const pts = formationPoints(formation)
  return (
    <svg
      viewBox="0 0 100 140"
      className={cn('block w-full max-w-[240px]', className)}
      role="img"
      aria-label={label ?? `Formation ${formation}`}
      data-formation={formation}
    >
      <rect
        x="2"
        y="2"
        width="96"
        height="136"
        rx="3"
        fill="var(--c-ok)"
        fillOpacity="0.45"
        stroke="var(--c-ink)"
        strokeWidth="0.5"
      />
      <line x1="2" y1="70" x2="98" y2="70" stroke="#fff" strokeWidth="0.5" opacity="0.55" />
      <circle cx="50" cy="70" r="10" fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.55" />
      <rect
        x="30"
        y="2"
        width="40"
        height="14"
        fill="none"
        stroke="#fff"
        strokeWidth="0.5"
        opacity="0.55"
      />
      <rect
        x="30"
        y="124"
        width="40"
        height="14"
        fill="none"
        stroke="#fff"
        strokeWidth="0.5"
        opacity="0.55"
      />
      {pts.map((p) => (
        <circle
          key={`${p.x}-${p.y}`}
          cx={p.x}
          cy={p.y}
          r="4.5"
          fill="var(--c-card)"
          stroke="var(--c-ink)"
          strokeWidth="0.7"
        />
      ))}
    </svg>
  )
}
