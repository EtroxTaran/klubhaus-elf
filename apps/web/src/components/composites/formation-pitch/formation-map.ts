export const FORMATIONS = ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '5-3-2'] as const
export type Formation = (typeof FORMATIONS)[number]

const ROWS: Record<Formation, number[][]> = {
  '4-3-3': [[50], [20, 40, 60, 80], [28, 50, 72], [20, 50, 80]],
  '4-4-2': [[50], [20, 40, 60, 80], [20, 40, 60, 80], [35, 65]],
  '4-2-3-1': [[50], [20, 40, 60, 80], [35, 65], [20, 50, 80], [50]],
  '3-5-2': [[50], [30, 50, 70], [15, 30, 50, 70, 85], [35, 65]],
  '5-3-2': [[50], [15, 32, 50, 68, 85], [28, 50, 72], [35, 65]],
}

export function formationRows(formation: Formation): number[][] {
  return ROWS[formation] ?? ROWS['4-3-3']
}

export interface PitchPoint {
  x: number
  y: number
}

/** 11 node coordinates on a 100×140 vertical pitch (keeper at the back). */
export function formationPoints(formation: Formation): PitchPoint[] {
  const rows = formationRows(formation)
  const out: PitchPoint[] = []
  rows.forEach((row, ri) => {
    const y = 132 - ri * (124 / (rows.length - 1))
    for (const x of row) out.push({ x, y })
  })
  return out
}
