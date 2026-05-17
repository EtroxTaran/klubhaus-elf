export interface GlyphProps {
  size?: number
  className?: string
}

const stroke = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  role: 'img' as const,
}

export function GlyphRoof({ size = 22, className }: GlyphProps) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 26 18" className={className} {...stroke}>
      <title>Dach komplett</title>
      <path d="M3 11 L13 3 L23 11" />
      <path d="M5 11 L5 15 M21 11 L21 15" />
      <line x1="2" y1="15" x2="24" y2="15" />
    </svg>
  )
}

export function GlyphRoofOpen({ size = 22, className }: GlyphProps) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 26 18" className={className} {...stroke}>
      <title>Ohne Dach</title>
      <path d="M3 11 L13 3 L23 11" strokeDasharray="2 2" />
      <line x1="2" y1="15" x2="24" y2="15" />
    </svg>
  )
}

export function GlyphRoofPartial({ size = 22, className }: GlyphProps) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 26 18" className={className} {...stroke}>
      <title>Dach teilweise</title>
      <path d="M13 3 L23 11" strokeDasharray="2 2" />
      <path d="M3 11 L13 3" />
      <line x1="2" y1="15" x2="24" y2="15" />
    </svg>
  )
}

export function GlyphSeat({ size = 22, className }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" className={className} {...stroke}>
      <title>Sitzplätze</title>
      <path d="M6 4 L6 13 L16 13" />
      <path d="M16 13 L16 18" />
      <path d="M6 13 L4 18" />
    </svg>
  )
}

export function GlyphStand({ size = 22, className }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 22"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={0.8}
      strokeLinejoin="round"
      className={className}
      role="img"
    >
      <title>Stehplätze</title>
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="12" cy="5" r="2.4" />
      <circle cx="18" cy="6" r="2.2" />
      <path d="M2 19 Q2 11 6 11 Q9 11 9 14 Q9 11 12 11 Q15 11 15 14 Q15 11 18 11 Q22 11 22 19 Z" />
    </svg>
  )
}

export function GlyphFloodlight({ size = 22, className }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" className={className} {...stroke}>
      <title>Flutlicht</title>
      <path d="M11 20 L11 11" />
      <path d="M7 11 L15 11 L17 5 L5 5 Z" fill="currentColor" fillOpacity="0.18" />
      <line x1="3" y1="9" x2="7" y2="11" />
      <line x1="19" y1="9" x2="15" y2="11" />
      <line x1="11" y1="2" x2="11" y2="4" />
    </svg>
  )
}

export function GlyphHeating({ size = 22, className }: GlyphProps) {
  return (
    <svg width={size} height={size * 0.55} viewBox="0 0 28 16" className={className} {...stroke}>
      <title>Rasenheizung</title>
      <path d="M2 5 Q5 1 8 5 T14 5 T20 5 T26 5" />
      <path d="M2 12 Q5 8 8 12 T14 12 T20 12 T26 12" />
    </svg>
  )
}

export function GlyphVIP({ size = 22, className }: GlyphProps) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 22 16" className={className} {...stroke}>
      <title>VIP-Logen</title>
      <rect x="2" y="4" width="18" height="9" rx="1" />
      <line x1="6" y1="4" x2="6" y2="13" />
      <line x1="11" y1="4" x2="11" y2="13" />
      <line x1="16" y1="4" x2="16" y2="13" />
      <path d="M2 4 L4 1 L18 1 L20 4" fill="currentColor" fillOpacity="0.15" />
    </svg>
  )
}
