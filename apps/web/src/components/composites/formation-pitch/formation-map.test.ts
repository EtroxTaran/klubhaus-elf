import { describe, expect, it } from 'vitest'
import { FORMATIONS, type Formation, formationPoints, formationRows } from './formation-map'

describe('formationRows', () => {
  it.each(FORMATIONS)('returns goalkeeper + outfield rows for %s', (f) => {
    const rows = formationRows(f)
    expect(rows[0]).toEqual([50])
    const total = rows.reduce((n, r) => n + r.length, 0)
    expect(total).toBe(11)
  })

  it('falls back to 4-3-3 for an unknown formation', () => {
    expect(formationRows('9-9-9' as Formation)).toEqual(formationRows('4-3-3'))
  })
})

describe('formationPoints', () => {
  it('places eleven nodes with the keeper at the back', () => {
    const pts = formationPoints('4-4-2')
    expect(pts).toHaveLength(11)
    const keeper = pts.at(0)
    const lastNode = pts.at(-1)
    expect(keeper?.x).toBe(50)
    expect(keeper?.y ?? 0).toBeGreaterThan(lastNode?.y ?? 0)
  })
})
