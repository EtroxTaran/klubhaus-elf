import { describe, expect, it } from 'vitest'
import type { CrestCharge, CrestShape } from '@/types/club'
import { CHARGES, overlayFor, shieldPath } from './crest-paths'

const SHAPES: CrestShape[] = ['heater', 'iberian', 'gonfalon', 'roundel']

describe('shieldPath', () => {
  it.each(SHAPES)('returns a path for shape %s', (shape) => {
    const d = shieldPath(shape)
    expect(d).toMatch(/^M/)
    expect(d.length).toBeGreaterThan(10)
  })

  it('falls back to the heater path for an unknown shape', () => {
    expect(shieldPath('weird' as CrestShape)).toBe(shieldPath('heater'))
  })
})

describe('overlayFor', () => {
  it.each(SHAPES)('produces a deterministic overlay descriptor for %s', (shape) => {
    const o = overlayFor(shape)
    expect(o.kind).toBeTruthy()
  })

  it('uses a fess overlay for heater and pale for iberian', () => {
    expect(overlayFor('heater').kind).toBe('rect')
    expect(overlayFor('roundel').kind).toBe('circle')
  })
})

describe('CHARGES', () => {
  it('enumerates all ten heraldic charges', () => {
    const expected: CrestCharge[] = [
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
    ]
    expect([...CHARGES].sort()).toEqual([...expected].sort())
  })
})
