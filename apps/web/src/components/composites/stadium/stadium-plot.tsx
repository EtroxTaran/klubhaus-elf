export interface PlotAmenity {
  label: string
  ok: boolean
}

export interface StadiumPlotProps {
  amenities: PlotAmenity[]
  className?: string
  label?: string
}

const PXX = 132
const PYY = 78
const PW = 96
const PH = 64
const T = 14

const STANDS = [
  { id: 'N', x: PXX - 6, y: PYY - T - 2, w: PW + 12, h: T, roof: true, label: 'NORD' },
  { id: 'S', x: PXX - 6, y: PYY + PH + 2, w: PW + 12, h: T, roof: false, label: 'SÜD' },
  { id: 'O', x: PXX + PW + 2, y: PYY - 6, w: T, h: PH + 12, roof: true, label: 'OST' },
  { id: 'W', x: PXX - T - 2, y: PYY - 6, w: T, h: PH + 12, roof: true, label: 'WEST' },
]

const LIGHTS = [
  [PXX - T - 8, PYY - T - 8],
  [PXX + PW + T + 8, PYY - T - 8],
  [PXX - T - 8, PYY + PH + T + 8],
  [PXX + PW + T + 8, PYY + PH + T + 8],
]

/** Top-down ground plan: pitch, four named stands, floodlights, amenities. */
export function StadiumPlot({ amenities, className, label }: StadiumPlotProps) {
  return (
    <svg viewBox="0 0 360 220" className={className} role="img" aria-label={label ?? 'Stadionplan'}>
      <rect
        x="2"
        y="2"
        width="356"
        height="216"
        rx="10"
        fill="var(--c-bg-ink)"
        stroke="var(--c-rule)"
      />
      <rect
        x={PXX - T - 12}
        y={PYY - T - 12}
        width={PW + T * 2 + 24}
        height={PH + T * 2 + 24}
        rx="6"
        fill="var(--c-card)"
        stroke="var(--c-rule)"
        strokeWidth="0.8"
      />
      {STANDS.map((s) => (
        <g key={s.id}>
          {s.roof && (
            <rect
              x={s.x - 1.5}
              y={s.y - 1.5}
              width={s.w + 3}
              height={s.h + 3}
              rx="2"
              fill="none"
              stroke="var(--c-ink)"
              strokeWidth="0.8"
              strokeDasharray="1.5 1.5"
              opacity="0.55"
            />
          )}
          <rect
            x={s.x}
            y={s.y}
            width={s.w}
            height={s.h}
            rx="1.5"
            fill={s.roof ? 'var(--c-ink)' : 'var(--c-ink-mute)'}
          />
          <text
            x={s.x + s.w / 2}
            y={s.y + s.h / 2 + 2}
            textAnchor="middle"
            fontSize="6"
            fontWeight="800"
            fill="var(--c-bg)"
          >
            {s.label}
          </text>
        </g>
      ))}
      <rect
        x={PXX}
        y={PYY}
        width={PW}
        height={PH}
        fill="var(--c-ok)"
        opacity="0.6"
        stroke="var(--c-ink)"
        strokeWidth="0.6"
      />
      <line
        x1={PXX + PW / 2}
        y1={PYY}
        x2={PXX + PW / 2}
        y2={PYY + PH}
        stroke="#fff"
        strokeWidth="0.6"
        opacity="0.7"
      />
      <circle
        cx={PXX + PW / 2}
        cy={PYY + PH / 2}
        r="7"
        fill="none"
        stroke="#fff"
        strokeWidth="0.6"
        opacity="0.7"
      />
      {LIGHTS.map(([x, y]) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r="3.2"
          fill="var(--c-warn)"
          stroke="var(--c-ink)"
          strokeWidth="0.7"
        />
      ))}
      {amenities.map((a, i) => {
        const col = i % 4
        const row = i < 4 ? 0 : 1
        const x = 14 + col * 86
        const y = row === 0 ? 16 : 176
        return (
          <g key={a.label}>
            <rect
              x={x}
              y={y}
              width={72}
              height={24}
              rx="3"
              fill={a.ok ? 'var(--c-card)' : 'transparent'}
              stroke={a.ok ? 'var(--c-ink)' : 'var(--c-rule)'}
              strokeWidth="0.8"
              strokeDasharray={a.ok ? undefined : '2 2'}
            />
            <text
              x={x + 36}
              y={y + 14}
              textAnchor="middle"
              fontSize="6.5"
              fontWeight={a.ok ? 700 : 600}
              fill={a.ok ? 'var(--c-ink)' : 'var(--c-ink-soft)'}
            >
              {a.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
