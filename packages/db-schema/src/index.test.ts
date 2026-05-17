import { describe, expect, it } from 'vitest'
import { recordIdSchema } from './index'

describe('recordIdSchema', () => {
  it('accepts SurrealDB record ids', () => {
    expect(recordIdSchema.parse('player:01HX')).toBe('player:01HX')
  })

  it('accepts underscore tables and hyphenated ids', () => {
    expect(recordIdSchema.parse('match_event:abc-123_XYZ')).toBe('match_event:abc-123_XYZ')
  })

  it('rejects ids with leading garbage (start anchor)', () => {
    expect(recordIdSchema.safeParse(' player:01HX').success).toBe(false)
    expect(recordIdSchema.safeParse('1player:01HX').success).toBe(false)
  })

  it('rejects ids with trailing garbage (end anchor)', () => {
    expect(recordIdSchema.safeParse('player:01HX ').success).toBe(false)
    expect(recordIdSchema.safeParse('player:01HX:extra').success).toBe(false)
  })

  it('rejects ids missing the table or id segment', () => {
    expect(recordIdSchema.safeParse('player:').success).toBe(false)
    expect(recordIdSchema.safeParse(':01HX').success).toBe(false)
    expect(recordIdSchema.safeParse('player01HX').success).toBe(false)
  })
})
