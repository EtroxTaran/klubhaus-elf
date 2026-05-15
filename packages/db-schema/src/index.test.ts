import { describe, expect, it } from 'vitest'
import { recordIdSchema } from './index'

describe('recordIdSchema', () => {
  it('accepts SurrealDB record ids', () => {
    expect(recordIdSchema.parse('player:01HX')).toBe('player:01HX')
  })
})
