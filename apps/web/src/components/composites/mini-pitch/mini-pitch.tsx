export interface MiniPitchProps {
  size?: number
  className?: string
}

/** Compact pitch glyph used for set-piece rows in the match feed. */
export function MiniPitch({ size = 22, className }: MiniPitchProps) {
  return (
    <svg
      width={size}
      height={size * 0.65}
      viewBox="0 0 100 65"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      className={className}
      role="img"
    >
      <title>Standardsituation</title>
      <rect x="2" y="2" width="96" height="61" rx="2" />
      <line x1="50" y1="2" x2="50" y2="63" />
      <circle cx="50" cy="32" r="8" />
      <rect x="2" y="18" width="14" height="29" />
      <rect x="84" y="18" width="14" height="29" />
    </svg>
  )
}
