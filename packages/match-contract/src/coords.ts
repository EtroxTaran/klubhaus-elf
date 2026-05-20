// Coordinate utilities (ADR-0026 §2, §7).

import { PITCH_HEIGHT_MM, PITCH_WIDTH_MM, type PitchPointMm, type Vec2 } from './types'

function clamp01(v: number): number {
  if (v < 0) return 0
  if (v > 1) return 1
  return v
}

/**
 * Engine integer-mm → renderer normalised [0,1]. The single allowed
 * conversion across the seam; engines must NOT emit normalised values and
 * renderers must NOT see millimetres.
 */
export function normalizePoint(p: PitchPointMm): Vec2 {
  return {
    x: clamp01(p.x / PITCH_WIDTH_MM),
    y: clamp01(p.y / PITCH_HEIGHT_MM),
  }
}

/**
 * Integer-mm linear interpolation. `tNorm` in [0,1]; result is rounded to
 * integer mm to stay faithful to the engine grid (ADR-0026 §7).
 */
export function lerpPoint(a: PitchPointMm, b: PitchPointMm, tNorm: number): PitchPointMm {
  const t = clamp01(tNorm)
  return {
    x: Math.round(a.x + (b.x - a.x) * t),
    y: Math.round(a.y + (b.y - a.y) * t),
  }
}
