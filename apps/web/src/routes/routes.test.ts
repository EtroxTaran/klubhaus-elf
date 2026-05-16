import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./*.tsx', { eager: true }) as Record<string, { Route?: unknown }>

describe('route modules', () => {
  it('every Phase-1 route file exports a Route', () => {
    const entries = Object.entries(modules).filter(([path]) => !path.includes('__root'))
    expect(entries.length).toBeGreaterThanOrEqual(8)
    for (const [, mod] of entries) {
      expect(mod.Route).toBeDefined()
    }
  })
})
