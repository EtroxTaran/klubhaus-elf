import { useId } from 'react'
import type { CrestSpec, JerseyPattern } from '@/types/club'
import { Crest } from '../crest/crest'
import { BODY, COLLAR, CUFF_L, CUFF_R, inkOn, jerseyPattern } from './jersey-paths'

export interface JerseyProps {
  pattern?: JerseyPattern
  /** Primary tincture (hex). */
  a?: string
  /** Secondary tincture (hex). */
  b?: string
  /** Render collar + cuffs in the secondary tincture. */
  sleeveAccent?: boolean
  /** Optional chest crest (front only). */
  crest?: CrestSpec | null
  number?: string
  name?: string
  /** Show the back (name + number) instead of the front (crest + sponsor). */
  showBack?: boolean
  size?: number
  label?: string
}

/**
 * Procedural club jersey. Deterministic from
 * (pattern, a, b, sleeveAccent, crest, number, showBack).
 */
export function Jersey({
  pattern = 'stripes',
  a = '#0e3a5f',
  b = '#c8a45a',
  sleeveAccent = true,
  crest = null,
  number = '9',
  name = 'BRODY',
  showBack = false,
  size = 200,
  label,
}: JerseyProps) {
  const clipId = useId()
  const shadeId = `${clipId}-sh`
  const ink = inkOn(a)
  const accent = sleeveAccent ? b : a
  const fill = (which: 'a' | 'b') => (which === 'a' ? a : b)

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-pattern={pattern}
      data-side={showBack ? 'back' : 'front'}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={BODY} />
        </clipPath>
        <linearGradient id={shadeId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".18" />
        </linearGradient>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        {jerseyPattern(pattern).map((s, i) =>
          s.kind === 'rect' ? (
            // biome-ignore lint/suspicious/noArrayIndexKey: jersey pattern is a stable positional list
            <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} fill={fill(s.fill)} />
          ) : (
            // biome-ignore lint/suspicious/noArrayIndexKey: jersey pattern is a stable positional list
            <polygon key={i} points={s.points} fill={fill(s.fill)} />
          ),
        )}
        <rect x="0" y="0" width="120" height="120" fill={`url(#${shadeId})`} />
      </g>

      {sleeveAccent && (
        <g>
          <path d={CUFF_L} fill={accent} opacity=".95" />
          <path d={CUFF_R} fill={accent} opacity=".95" />
        </g>
      )}
      <path d={COLLAR} fill={accent} />
      <path d={BODY} fill="none" stroke="#11100e" strokeWidth="1.4" strokeLinejoin="round" />

      {showBack ? (
        <g>
          <text
            x="60"
            y="50"
            textAnchor="middle"
            fontSize="9"
            fontWeight="800"
            fill={ink}
            letterSpacing="1"
          >
            {name.toUpperCase()}
          </text>
          <text x="60" y="86" textAnchor="middle" fontSize="34" fontWeight="800" fill={ink}>
            {number}
          </text>
        </g>
      ) : (
        <g>
          {crest && (
            <g transform="translate(38, 44) scale(0.22)">
              <Crest {...crest} size={100} />
            </g>
          )}
          <rect x="44" y="78" width="32" height="6" rx="1" fill={ink} opacity=".14" />
          <text
            x="60"
            y="83"
            textAnchor="middle"
            fontSize="4.5"
            fontWeight="700"
            fill={ink}
            opacity=".5"
          >
            SPONSOR
          </text>
        </g>
      )}
    </svg>
  )
}
