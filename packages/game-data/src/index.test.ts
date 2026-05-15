import { describe, expect, it } from 'vitest'
import { gameDataStatus } from './index'

describe('game-data bootstrap', () => {
  it('does not ship real club data during bootstrap', () => {
    expect(gameDataStatus).toBe('planned')
  })
})
