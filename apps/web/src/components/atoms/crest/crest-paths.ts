import type { CrestCharge, CrestShape } from '@/types/club'

/** Shield outline on a 100×120 viewBox. Deterministic per shape. */
export function shieldPath(shape: CrestShape): string {
  switch (shape) {
    case 'iberian':
      return 'M10 8 H90 V60 C90 92 60 110 50 116 C40 110 10 92 10 60 Z'
    case 'gonfalon':
      return 'M10 8 H90 V90 L70 78 L50 96 L30 78 L10 90 Z'
    case 'roundel':
      return 'M50 6 a50 50 0 1 0 0.001 0 Z'
    default:
      return 'M10 8 H90 V52 C90 86 70 106 50 116 C30 106 10 86 10 52 Z'
  }
}

export type Overlay =
  | { kind: 'rect'; x: number; y: number; w: number; h: number }
  | { kind: 'circle'; cx: number; cy: number; r: number }

/** Second-tincture division, deterministic per shape. */
export function overlayFor(shape: CrestShape): Overlay {
  switch (shape) {
    case 'gonfalon':
      return { kind: 'rect', x: 0, y: 60, w: 100, h: 60 }
    case 'iberian':
      return { kind: 'rect', x: 50, y: 0, w: 50, h: 120 }
    case 'roundel':
      return { kind: 'circle', cx: 50, cy: 60, r: 32 }
    default:
      return { kind: 'rect', x: 0, y: 0, w: 100, h: 44 }
  }
}

export const CHARGES = [
  'lion',
  'eagle',
  'ship',
  'wave',
  'tower',
  'sword',
  'cog',
  'cross',
  'star',
  'ball',
] as const satisfies readonly CrestCharge[]
