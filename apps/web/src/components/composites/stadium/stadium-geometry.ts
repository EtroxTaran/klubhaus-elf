import type { RoofKind, StadiumTypeId, Stand } from '@/types/stadium'

export interface SideGeometry {
  W: number
  H: number
  pitchY: number
  rows: number
  stepW: number
  stepH: number
  baseX: number
  standingRows: number
  roof: RoofKind
}

/** Side cross-section geometry for one stand (12-row visual cap). */
export function standSideGeometry(stand: Stand): SideGeometry {
  const W = 240
  const H = 120
  const pitchY = 108
  const rows = Math.min(stand.rows, 12)
  const stepW = 14
  const stepH = (pitchY - 22) / rows
  const baseX = 14
  const standingRows = Math.round(rows * (stand.standing / stand.cap))
  return { W, H, pitchY, rows, stepW, stepH, baseX, standingRows, roof: stand.roof }
}

export interface StandRect {
  x: number
  y: number
  w: number
  h: number
  /** Open end (drawn dashed, not a real stand). */
  open?: boolean
}

// Mini-plan pitch box on a 160×96 viewBox.
const PX = 46
const PY = 30
const PW = 68
const PH = 36

const STANDARD: StandRect[] = [
  { x: PX - 4, y: PY - 8, w: PW + 8, h: 6 },
  { x: PX - 4, y: PY + PH + 2, w: PW + 8, h: 6 },
  { x: PX - 8, y: PY - 4, w: 6, h: PH + 8 },
  { x: PX + PW + 2, y: PY - 4, w: 6, h: PH + 8 },
]

/** Stand rectangles to draw for a stadium archetype. */
export function stadiumTypeStands(id: StadiumTypeId): StandRect[] {
  switch (id) {
    case 'dorf':
      return [{ x: PX - 4, y: PY - 8, w: PW + 8, h: 6 }]
    case 'garten':
      return [
        { x: PX - 4, y: PY - 8, w: PW + 8, h: 6 },
        { x: PX - 4, y: PY + PH + 2, w: PW + 8, h: 6 },
      ]
    case 'huf':
      return [
        { x: PX - 4, y: PY - 8, w: PW + 8, h: 6 },
        { x: PX - 8, y: PY - 4, w: 6, h: PH + 8 },
        { x: PX + PW + 2, y: PY - 4, w: 6, h: PH + 8 },
      ]
    case 'arena':
      return [{ x: PX - 9, y: PY - 9, w: PW + 18, h: PH + 18 }]
    default:
      return STANDARD
  }
}
