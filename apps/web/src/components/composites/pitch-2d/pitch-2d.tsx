import { Jersey } from '@/components/atoms/jersey/jersey'
import { cn } from '@/lib/utils'
import type { PitchToken } from '@/screens/fixtures'
import type { JerseyPattern } from '@/types/club'

export interface PitchSide {
  /** Primary tincture (hex). */
  a: string
  /** Secondary tincture (hex). */
  b: string
  pattern: JerseyPattern
  sleeveAccent: boolean
  players: PitchToken[]
}

export interface Pitch2DProps {
  /** Defends the left goal. */
  away: PitchSide
  /** Defends the right goal. */
  home: PitchSide
  northLabel: string
  southLabel: string
  className?: string
  label?: string
}

const TOKEN = 22

function Token({ p, side }: { p: PitchToken; side: PitchSide }) {
  // GK wears the contrast kit (secondary becomes the body colour).
  const a = p.gk ? side.b : side.a
  const b = p.gk ? side.a : side.b
  const pattern: JerseyPattern = p.gk ? 'solid' : side.pattern
  return (
    <>
      {p.highlight && (
        <circle
          cx={p.x}
          cy={p.y}
          r={TOKEN / 2 + 2.5}
          fill="none"
          stroke="var(--c-accent)"
          strokeWidth="1.6"
        />
      )}
      <foreignObject
        x={p.x - TOKEN / 2}
        y={p.y - TOKEN / 2}
        width={TOKEN}
        height={TOKEN}
        style={{ overflow: 'visible' }}
      >
        <div style={{ width: TOKEN, height: TOKEN }}>
          <Jersey
            pattern={pattern}
            a={a}
            b={b}
            sleeveAccent={side.sleeveAccent}
            number={p.n}
            name=""
            showBack
            size={TOKEN}
          />
        </div>
      </foreignObject>
    </>
  )
}

/** Top-down 2D match pitch with both line-ups, ball track and shot marker. */
export function Pitch2D({ away, home, northLabel, southLabel, className, label }: Pitch2DProps) {
  return (
    <svg
      viewBox="0 0 360 220"
      className={cn('block w-full rounded-[10px]', className)}
      role="img"
      aria-label={label}
    >
      <rect x="0" y="0" width="360" height="220" fill="var(--c-ok)" />
      {Array.from({ length: 10 }).map((_, i) => (
        <rect
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed pitch-stripe count never reorders
          key={i}
          x="0"
          y={i * 22}
          width="360"
          height="11"
          fill="#fff"
          opacity={i % 2 ? 0.07 : 0}
        />
      ))}
      <g fill="none" stroke="#fff" strokeWidth="1.2" opacity="0.8">
        <rect x="10" y="10" width="340" height="200" rx="2" />
        <line x1="180" y1="10" x2="180" y2="210" />
        <circle cx="180" cy="110" r="26" />
        <rect x="10" y="62" width="46" height="96" />
        <rect x="10" y="84" width="20" height="52" />
        <rect x="304" y="62" width="46" height="96" />
        <rect x="330" y="84" width="20" height="52" />
      </g>
      <g>
        {away.players.map((p) => (
          <Token key={`a-${p.n}`} p={p} side={away} />
        ))}
        {home.players.map((p) => (
          <Token key={`h-${p.n}`} p={p} side={home} />
        ))}
      </g>
      {/* Ball track + shot marker (last action). */}
      <path
        d="M210 80 Q160 80 60 105"
        fill="none"
        stroke="var(--c-accent)"
        strokeWidth="1.6"
        strokeDasharray="3 2"
        opacity="0.8"
      />
      <circle cx="50" cy="106" r="3.5" fill="#fff" stroke="var(--c-ink)" strokeWidth="0.8" />
      <polygon
        points="200,60 201.5,63.5 205,65 201.5,66.5 200,70 198.5,66.5 195,65 198.5,63.5"
        fill="var(--c-accent)"
      />
      <text x="10" y="218" fontSize="8" fontWeight="700" fill="#fff" opacity="0.7">
        {northLabel}
      </text>
      <text
        x="346"
        y="218"
        textAnchor="end"
        fontSize="8"
        fontWeight="700"
        fill="#fff"
        opacity="0.7"
      >
        {southLabel}
      </text>
    </svg>
  )
}
