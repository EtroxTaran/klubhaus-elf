import { describe, expect, it } from 'vitest'
import {
  ballEntityId,
  type EngineEventSlice,
  entityId,
  getFrameAtSecond,
  isRenderableProfile,
  type Lineups,
  lerpPoint,
  normalizePoint,
  PITCH_HEIGHT_MM,
  PITCH_WIDTH_MM,
  parseEntityId,
  toMatchEventKind,
} from './index'

describe('normalizePoint (ADR-0026 §2)', () => {
  it('maps the four pitch corners to [0,1]² corners', () => {
    expect(normalizePoint({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 })
    expect(normalizePoint({ x: PITCH_WIDTH_MM, y: 0 })).toEqual({ x: 1, y: 0 })
    expect(normalizePoint({ x: 0, y: PITCH_HEIGHT_MM })).toEqual({ x: 0, y: 1 })
    expect(normalizePoint({ x: PITCH_WIDTH_MM, y: PITCH_HEIGHT_MM })).toEqual({ x: 1, y: 1 })
  })

  it('maps the pitch centre to (0.5, 0.5)', () => {
    expect(normalizePoint({ x: PITCH_WIDTH_MM / 2, y: PITCH_HEIGHT_MM / 2 })).toEqual({
      x: 0.5,
      y: 0.5,
    })
  })

  it('clamps out-of-range values into [0,1]', () => {
    expect(normalizePoint({ x: -1000, y: 999_999 })).toEqual({ x: 0, y: 1 })
  })
})

describe('lerpPoint (ADR-0026 §7)', () => {
  it('returns a at tNorm=0 and b at tNorm=1', () => {
    const a = { x: 100, y: 200 }
    const b = { x: 500, y: 700 }
    expect(lerpPoint(a, b, 0)).toEqual(a)
    expect(lerpPoint(a, b, 1)).toEqual(b)
  })

  it('interpolates the midpoint and rounds to integer mm', () => {
    expect(lerpPoint({ x: 0, y: 0 }, { x: 100, y: 101 }, 0.5)).toEqual({ x: 50, y: 51 })
  })

  it('clamps tNorm outside [0,1]', () => {
    const a = { x: 0, y: 0 }
    const b = { x: 100, y: 100 }
    expect(lerpPoint(a, b, -1)).toEqual(a)
    expect(lerpPoint(a, b, 2)).toEqual(b)
  })
})

describe('toMatchEventKind (ADR-0026 §3 — total mapping)', () => {
  it('maps direct counterparts', () => {
    expect(toMatchEventKind('goal')).toBe('goal')
    expect(toMatchEventKind('shot')).toBe('shot')
    expect(toMatchEventKind('save')).toBe('save')
    expect(toMatchEventKind('card')).toBe('card')
    expect(toMatchEventKind('substitution')).toBe('sub')
  })

  it('maps kickoff and whistle to whistle', () => {
    expect(toMatchEventKind('kickoff')).toBe('whistle')
    expect(toMatchEventKind('whistle')).toBe('whistle')
  })

  it('returns null for non-highlight events', () => {
    for (const t of [
      'pass',
      'carry',
      'duel',
      'foul',
      'offside',
      'interception',
      'clearance',
      'set_piece',
      'injury',
      'tactical_change',
      'misc',
    ] as const) {
      expect(toMatchEventKind(t)).toBeNull()
    }
  })
})

describe('entityId / parseEntityId (ADR-0026 §6)', () => {
  it('round-trips home/away ids', () => {
    expect(parseEntityId(entityId('home', 7))).toEqual({ kind: 'home', playerId: 7 })
    expect(parseEntityId(entityId('away', 11))).toEqual({ kind: 'away', playerId: 11 })
  })

  it('recognises the ball id', () => {
    expect(parseEntityId(ballEntityId)).toEqual({ kind: 'ball' })
  })

  it('rejects malformed ids', () => {
    expect(parseEntityId('')).toBeNull()
    expect(parseEntityId('home')).toBeNull()
    expect(parseEntityId('home-')).toBeNull()
    expect(parseEntityId('home-abc')).toBeNull()
    expect(parseEntityId('purple-7')).toBeNull()
  })
})

describe('isRenderableProfile (ADR-0026 §9)', () => {
  it('only competitive-full and interactive-standard render', () => {
    expect(isRenderableProfile('competitive-full')).toBe(true)
    expect(isRenderableProfile('interactive-standard')).toBe(true)
    expect(isRenderableProfile('background-detailed')).toBe(false)
    expect(isRenderableProfile('background-fast')).toBe(false)
  })
})

describe('getFrameAtSecond (ADR-0026 §4 derived not persisted)', () => {
  const lineups: Lineups = {
    home: new Map([[7, { shirt: 7 }]]),
    away: new Map([[3, { shirt: 3 }]]),
  }

  it('emits an entity per lineup player + the ball at t=0 with default pitch-centre positions', () => {
    const frame = getFrameAtSecond([], 0, lineups)
    expect(frame.clock).toBe(0)
    expect(frame.entities.length).toBe(3)
    const ids = frame.entities.map((e) => e.id).sort()
    expect(ids).toEqual([ballEntityId, entityId('away', 3), entityId('home', 7)].sort())
    expect(frame.events).toEqual([])
  })

  it('interpolates a player position mid-event', () => {
    const ev: EngineEventSlice = {
      sim_clock_s: 10,
      duration_s: 10,
      event_type: 'carry',
      team_id: 'home',
      player_ids: [7],
      start_pos: { x: 0, y: 0 },
      end_pos: { x: PITCH_WIDTH_MM, y: PITCH_HEIGHT_MM },
    }
    const frame = getFrameAtSecond([ev], 15, lineups)
    const home7 = frame.entities.find((e) => e.id === entityId('home', 7))
    expect(home7?.pos.x).toBeCloseTo(0.5, 5)
    expect(home7?.pos.y).toBeCloseTo(0.5, 5)
    // 'carry' is not a highlight kind.
    expect(frame.events).toEqual([])
  })

  it('emits highlight events on the exact frame second', () => {
    const goal: EngineEventSlice = {
      sim_clock_s: 30,
      duration_s: 1,
      event_type: 'goal',
      team_id: 'home',
      player_ids: [7],
      start_pos: null,
      end_pos: null,
    }
    const frame = getFrameAtSecond([goal], 30, lineups)
    expect(frame.events).toEqual([{ kind: 'goal', atSecond: 30, entityId: entityId('home', 7) }])
  })

  it('only includes events at the queried second (not earlier or later)', () => {
    const goal: EngineEventSlice = {
      sim_clock_s: 30,
      duration_s: 1,
      event_type: 'goal',
      team_id: 'home',
      player_ids: [7],
      start_pos: null,
      end_pos: null,
    }
    expect(getFrameAtSecond([goal], 29, lineups).events).toEqual([])
    expect(getFrameAtSecond([goal], 31, lineups).events).toEqual([])
  })
})
