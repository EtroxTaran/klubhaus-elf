import type { JerseyPattern } from '@/types/club'

/** Shirt body outline (raglan sleeves) on a 120×120 viewBox. */
export const BODY =
  'M30 22 L14 18 L8 20 L4 38 L24 44 L30 38 L30 112 L90 112 L90 38 L96 44 L116 38 L112 20 L106 18 L90 22 Q60 30 30 22 Z'
/** Left cuff region (accent fill). */
export const CUFF_L = 'M4 38 L24 44 L22 50 L4 46 Z'
/** Right cuff region (accent fill). */
export const CUFF_R = 'M116 38 L96 44 L98 50 L116 46 Z'
/** Collar wedge. */
export const COLLAR = 'M44 22 Q60 30 76 22 L72 28 Q60 33 48 28 Z'

export const JERSEY_PATTERNS = [
  'solid',
  'stripes',
  'hoops',
  'sash',
  'split',
  'chevron',
] as const satisfies readonly JerseyPattern[]

export type JerseyShape =
  | { kind: 'rect'; x: number; y: number; w: number; h: number; fill: 'a' | 'b' }
  | { kind: 'poly'; points: string; fill: 'a' | 'b' }

/**
 * Deterministic pattern decomposition: an ordered list of shapes clipped to
 * the shirt body. `fill` is resolved to the primary/secondary tincture by the
 * renderer so the geometry stays colour-agnostic and branch-testable.
 */
export function jerseyPattern(pattern: JerseyPattern): JerseyShape[] {
  const base: JerseyShape = { kind: 'rect', x: 0, y: 0, w: 120, h: 120, fill: 'a' }
  switch (pattern) {
    case 'stripes':
      return [
        base,
        ...[1, 3, 5].map(
          (i): JerseyShape => ({ kind: 'rect', x: i * 20 - 2, y: 0, w: 14, h: 120, fill: 'b' }),
        ),
      ]
    case 'hoops':
      return [
        base,
        ...[0, 1, 2, 3].map(
          (i): JerseyShape => ({ kind: 'rect', x: 0, y: 28 + i * 18, w: 120, h: 9, fill: 'b' }),
        ),
      ]
    case 'sash':
      return [base, { kind: 'poly', points: '0,72 0,52 120,12 120,32', fill: 'b' }]
    case 'split':
      return [
        { kind: 'rect', x: 0, y: 0, w: 60, h: 120, fill: 'a' },
        { kind: 'rect', x: 60, y: 0, w: 60, h: 120, fill: 'b' },
      ]
    case 'chevron':
      return [base, { kind: 'poly', points: '0,30 60,60 120,30 120,52 60,82 0,52', fill: 'b' }]
    default:
      return [base]
  }
}

/** Readable ink against a fill — luminance threshold, deterministic. */
export function inkOn(hex: string): string {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return lum > 0.55 ? '#11100e' : '#fbf6ea'
}
