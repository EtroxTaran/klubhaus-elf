import type { StadiumType } from '@/types/stadium'
import { stadiumTypeStands } from './stadium-geometry'

const PX = 46
const PY = 30
const PW = 68
const PH = 36

export interface StadiumTypePlanProps {
  type: StadiumType
  className?: string
}

/** Top-down mini silhouette for one stadium archetype. */
export function StadiumTypePlan({ type, className }: StadiumTypePlanProps) {
  const stands = stadiumTypeStands(type.id)
  const isArena = type.id === 'arena'
  return (
    <svg
      viewBox="0 0 160 96"
      className={className}
      role="img"
      aria-label={`Stadiontyp ${type.name}`}
      data-type={type.id}
    >
      <rect x="2" y="2" width="156" height="92" rx="8" fill="var(--c-bg)" stroke="var(--c-rule)" />
      <rect
        x={PX}
        y={PY}
        width={PW}
        height={PH}
        fill="var(--c-ok)"
        opacity="0.55"
        stroke="var(--c-ink)"
        strokeWidth="0.5"
      />
      <line
        x1={PX + PW / 2}
        y1={PY}
        x2={PX + PW / 2}
        y2={PY + PH}
        stroke="#fff"
        strokeWidth="0.5"
        opacity="0.7"
      />
      {stands.map((s) =>
        isArena ? (
          <rect
            key={`${s.x}-${s.y}`}
            x={s.x}
            y={s.y}
            width={s.w}
            height={s.h}
            rx="6"
            fill="none"
            stroke="var(--c-ink)"
            strokeWidth="5"
          />
        ) : (
          <rect
            key={`${s.x}-${s.y}`}
            x={s.x}
            y={s.y}
            width={s.w}
            height={s.h}
            fill="var(--c-ink)"
          />
        ),
      )}
      {[
        [PX - 12, PY - 12],
        [PX + PW + 12, PY - 12],
        [PX - 12, PY + PH + 12],
        [PX + PW + 12, PY + PH + 12],
      ].map(([x, y]) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r="2.2"
          fill="var(--c-warn)"
          stroke="var(--c-ink)"
          strokeWidth="0.5"
        />
      ))}
    </svg>
  )
}
