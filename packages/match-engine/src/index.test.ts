import { describe, expect, it } from 'vitest'
import { matchEngineStatus } from './index'

describe('match-engine bootstrap', () => {
  it('exposes the planned bootstrap status', () => {
    expect(matchEngineStatus).toBe('planned')
  })
})
