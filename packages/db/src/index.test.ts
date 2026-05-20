import { describe, expect, it } from 'vitest'
import { clubInsertSchema, clubSelectSchema } from './index'

describe('clubInsertSchema (drizzle-zod mirror)', () => {
  it('accepts a valid new club (id/createdAt optional via defaults)', () => {
    expect(clubInsertSchema.safeParse({ name: 'FC Example', city: 'Berlin' }).success).toBe(true)
  })

  it('rejects a club missing required name', () => {
    expect(clubInsertSchema.safeParse({ city: 'Berlin' }).success).toBe(false)
  })

  it('rejects a non-string city', () => {
    expect(clubInsertSchema.safeParse({ name: 'FC Example', city: 42 }).success).toBe(false)
  })
})

describe('clubSelectSchema (drizzle-zod mirror)', () => {
  it('accepts a fully materialised row', () => {
    expect(
      clubSelectSchema.safeParse({
        id: '00000000-0000-0000-0000-000000000000',
        name: 'FC Example',
        city: 'Berlin',
        createdAt: new Date(),
      }).success,
    ).toBe(true)
  })
})
