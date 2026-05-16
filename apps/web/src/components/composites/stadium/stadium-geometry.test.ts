import { describe, expect, it } from 'vitest'
import type { StadiumTypeId, Stand } from '@/types/stadium'
import { stadiumTypeStands, standSideGeometry } from './stadium-geometry'

const stand: Stand = {
  id: 'N',
  name: 'Nordtribüne',
  cap: 8200,
  seats: 5400,
  standing: 2680,
  vip: 120,
  roof: 'full',
  rows: 24,
  blocks: 8,
  upgrade: 'x',
  upgradeCost: 'y',
}

describe('standSideGeometry', () => {
  it('caps the visual row count and derives the standing share', () => {
    const g = standSideGeometry(stand)
    expect(g.rows).toBe(12)
    expect(g.standingRows).toBeGreaterThan(0)
    expect(g.standingRows).toBeLessThanOrEqual(g.rows)
    expect(g.roof).toBe('full')
  })

  it('reports no standing rows for an all-seater', () => {
    const g = standSideGeometry({ ...stand, standing: 0, seats: 8080 })
    expect(g.standingRows).toBe(0)
  })

  it.each<Stand['roof']>(['full', 'partial', 'open'])('passes through the %s roof', (roof) => {
    expect(standSideGeometry({ ...stand, roof }).roof).toBe(roof)
  })
})

describe('stadiumTypeStands', () => {
  it.each<[StadiumTypeId, number]>([
    ['dorf', 1],
    ['garten', 2],
    ['standard', 4],
    ['huf', 3],
    ['arena', 1],
  ])('returns the stand rects for %s', (id, count) => {
    expect(stadiumTypeStands(id)).toHaveLength(count)
  })

  it('falls back to the standard layout for an unknown type', () => {
    expect(stadiumTypeStands('mystery' as StadiumTypeId)).toEqual(stadiumTypeStands('standard'))
  })
})
