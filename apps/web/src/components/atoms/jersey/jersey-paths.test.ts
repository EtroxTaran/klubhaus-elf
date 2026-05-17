import { describe, expect, it } from 'vitest'
import type { JerseyPattern } from '@/types/club'
import { inkOn, JERSEY_PATTERNS, jerseyPattern } from './jersey-paths'

describe('jerseyPattern', () => {
  it.each(JERSEY_PATTERNS)('produces a non-empty deterministic shape list for %s', (pattern) => {
    const shapes = jerseyPattern(pattern)
    expect(shapes.length).toBeGreaterThan(0)
    for (const s of shapes) {
      expect(s.fill === 'a' || s.fill === 'b').toBe(true)
    }
    expect(jerseyPattern(pattern)).toEqual(shapes)
  })

  it('uses both tinctures for every non-solid pattern', () => {
    for (const p of JERSEY_PATTERNS) {
      if (p === 'solid') continue
      const fills = new Set(jerseyPattern(p).map((s) => s.fill))
      expect(fills.has('a')).toBe(true)
      expect(fills.has('b')).toBe(true)
    }
  })

  it('falls back to a single primary panel for an unknown pattern', () => {
    expect(jerseyPattern('weird' as JerseyPattern)).toEqual([
      { kind: 'rect', x: 0, y: 0, w: 120, h: 120, fill: 'a' },
    ])
  })

  it('splits left/right for the split pattern', () => {
    const shapes = jerseyPattern('split')
    expect(shapes).toHaveLength(2)
    expect(shapes[0]).toMatchObject({ fill: 'a' })
    expect(shapes[1]).toMatchObject({ fill: 'b' })
  })
})

describe('inkOn', () => {
  it('returns light ink on a dark fill and dark ink on a light fill', () => {
    expect(inkOn('#0e3a5f')).toBe('#fbf6ea')
    expect(inkOn('#f0e8d8')).toBe('#11100e')
  })
})
