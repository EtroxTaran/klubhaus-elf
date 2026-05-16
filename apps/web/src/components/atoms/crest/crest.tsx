import { useId } from 'react'
import type { CrestCharge, CrestShape } from '@/types/club'
import { overlayFor, shieldPath } from './crest-paths'

function Charge({ kind, color }: { kind: CrestCharge; color: string }) {
  switch (kind) {
    case 'lion':
      return (
        <g fill={color} stroke={color} strokeWidth="2" strokeLinejoin="round">
          <path d="M22 70 Q24 50 38 46 L42 38 L48 44 L56 38 L60 46 Q76 50 78 70 L72 72 Q72 60 60 58 L56 70 L54 60 L46 60 L44 70 L40 58 Q28 60 28 72 Z" />
          <circle cx="42" cy="40" r="1.5" fill="#fff" stroke="none" />
          <circle cx="58" cy="40" r="1.5" fill="#fff" stroke="none" />
        </g>
      )
    case 'eagle':
      return (
        <g fill={color} stroke={color} strokeWidth="2" strokeLinejoin="round">
          <path d="M50 30 L40 38 L18 36 L36 50 L24 64 L42 60 L40 78 L50 70 L60 78 L58 60 L76 64 L64 50 L82 36 L60 38 Z" />
        </g>
      )
    case 'ship':
      return (
        <g fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 70 H84 L78 80 H22 Z" fill={color} />
          <path d="M50 70 V30" />
          <path d="M50 32 L72 52 L50 52 Z" fill={color} />
          <path d="M50 36 L30 52 L50 52 Z" fill={color} />
        </g>
      )
    case 'wave':
      return (
        <g fill="none" stroke={color} strokeWidth="4" strokeLinecap="round">
          <path d="M14 46 Q26 36 38 46 T62 46 T86 46" />
          <path d="M14 60 Q26 50 38 60 T62 60 T86 60" />
          <path d="M14 74 Q26 64 38 74 T62 74 T86 74" />
        </g>
      )
    case 'tower':
      return (
        <g fill={color} stroke={color} strokeWidth="2" strokeLinejoin="round">
          <path d="M28 36 H36 V42 H44 V36 H52 V42 H60 V36 H68 V42 H72 V52 H24 V42 H28 Z" />
          <rect x="28" y="52" width="40" height="32" />
          <rect x="42" y="62" width="12" height="22" fill="#fff" />
        </g>
      )
    case 'sword':
      return (
        <g stroke={color} strokeWidth="3" strokeLinecap="round" fill={color}>
          <path d="M50 18 L56 76 H44 Z" />
          <rect x="34" y="74" width="32" height="5" />
          <rect x="47" y="76" width="6" height="14" />
        </g>
      )
    case 'cog':
      return (
        <g fill={color} stroke={color} strokeWidth="2">
          <path d="M50 20 L54 28 L62 26 L62 34 L70 36 L66 44 L70 52 L62 54 L62 62 L54 60 L50 68 L46 60 L38 62 L38 54 L30 52 L34 44 L30 36 L38 34 L38 26 L46 28 Z" />
          <circle cx="50" cy="44" r="6" fill="#fff" stroke={color} />
        </g>
      )
    case 'cross':
      return (
        <g fill={color}>
          <rect x="44" y="22" width="12" height="56" />
          <rect x="22" y="44" width="56" height="12" />
        </g>
      )
    case 'star':
      return (
        <g fill={color}>
          <polygon points="50,22 58,42 80,44 62,58 68,80 50,68 32,80 38,58 20,44 42,42" />
        </g>
      )
    default:
      return (
        <g fill={color} stroke={color} strokeWidth="2">
          <circle cx="50" cy="50" r="22" fill="#fff" stroke={color} />
          <polygon points="50,38 60,46 56,58 44,58 40,46" fill={color} />
        </g>
      )
  }
}

export interface CrestProps {
  shape: CrestShape
  /** Primary tincture (hex). */
  a: string
  /** Secondary tincture (hex). */
  b: string
  charge: CrestCharge
  motto?: string
  size?: number
  label?: string
}

/** Procedural club crest. Deterministic from (shape, a, b, charge). */
export function Crest({ shape, a, b, charge, motto, size = 88, label }: CrestProps) {
  const clipId = useId()
  const d = shieldPath(shape)
  const overlay = overlayFor(shape)
  const chargeColor = shape === 'gonfalon' ? a : b === '#fff' ? a : '#11100e'

  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 100 120"
      role="img"
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-shape={shape}
      data-charge={charge}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={d} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect x="0" y="0" width="100" height="120" fill={a} />
        {overlay.kind === 'rect' ? (
          <rect x={overlay.x} y={overlay.y} width={overlay.w} height={overlay.h} fill={b} />
        ) : (
          <circle cx={overlay.cx} cy={overlay.cy} r={overlay.r} fill={b} />
        )}
      </g>
      <g transform={`translate(0,${shape === 'roundel' ? 10 : 6})`}>
        <Charge kind={charge} color={chargeColor} />
      </g>
      <path d={d} fill="none" stroke="#11100e" strokeWidth="2" />
      {motto && (
        <g>
          <path
            d="M12 108 Q50 118 88 108 L84 116 Q50 122 16 116 Z"
            fill="#e8ddc5"
            stroke="#11100e"
            strokeWidth="1"
          />
          <text x="50" y="116" textAnchor="middle" fontSize="6" fontStyle="italic" fill="#11100e">
            {motto}
          </text>
        </g>
      )}
    </svg>
  )
}
