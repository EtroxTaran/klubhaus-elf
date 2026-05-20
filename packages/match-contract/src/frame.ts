// Frame builder (ADR-0026 §4–§7).
//
// MatchFrame is DERIVED on demand from the event log; never persisted. The
// engine emits events with (start_pos, end_pos, duration_s); this builder
// linearly interpolates positions for any frame time t and emits the events
// whose `sim_clock_s` lands on that second.

import { lerpPoint, normalizePoint } from './coords'
import { ballEntityId, entityId } from './entity'
import { toMatchEventKind } from './events'
import type {
  EngineEventSlice,
  Lineups,
  MatchEntity,
  MatchEvent,
  MatchFrame,
  PitchPointMm,
} from './types'

/** Pitch centre, in integer mm — default position before an entity has moved. */
const PITCH_CENTRE_MM: PitchPointMm = { x: 52_500, y: 34_000 }

/**
 * Resolve the entity id for an event's primary actor (player_ids[0]) given
 * the team side. Returns `null` for events with no primary actor (e.g.
 * whistles).
 */
function primaryEntityIdOf(ev: EngineEventSlice): string | null {
  if (ev.team_id === null) return null
  const playerId = ev.player_ids[0]
  if (playerId === undefined) return null
  return entityId(ev.team_id, playerId)
}

/**
 * Stateful tracker that folds an event log forward and answers frame queries.
 * Pure given (events seen so far, lineups); no time/RNG/DOM access.
 *
 * MVP semantics:
 * - Positions: each entity's last known PitchPointMm; if its most recent event
 *   has start/end_pos and the query time lands inside [sim_clock_s, +duration_s],
 *   linearly interpolate.
 * - Events: those whose `sim_clock_s === t` AND map to a non-null kind.
 *
 * Forward-only fold from kickoff is O(events); no reverse seeking, no cache.
 */
export class MatchWorldStateTracker {
  private readonly lastEventByEntity = new Map<string, EngineEventSlice>()
  private readonly lineups: Lineups

  constructor(lineups: Lineups) {
    this.lineups = lineups
  }

  /**
   * Build the frame at integer second `t` from the full event log.
   * Re-folds from scratch — callers can hold one tracker and call repeatedly;
   * folding is cheap (~120-180 events / match).
   */
  getFrameAtSecond(eventLog: readonly EngineEventSlice[], t: number): MatchFrame {
    this.lastEventByEntity.clear()

    for (const ev of eventLog) {
      if (ev.sim_clock_s > t) break
      const id = primaryEntityIdOf(ev)
      if (id !== null) this.lastEventByEntity.set(id, ev)
      // The ball also tracks the same primary-actor events for now (MVP).
      if (ev.start_pos !== null || ev.end_pos !== null) {
        this.lastEventByEntity.set(ballEntityId, ev)
      }
    }

    const entities: MatchEntity[] = []

    // Home + away players from the lineup set.
    for (const [playerId] of this.lineups.home) {
      entities.push(buildEntity('home', playerId, this.lastEventByEntity, t))
    }
    for (const [playerId] of this.lineups.away) {
      entities.push(buildEntity('away', playerId, this.lastEventByEntity, t))
    }
    // Ball.
    entities.push(buildBallEntity(this.lastEventByEntity, t))

    // Events on this exact frame second (highlights only).
    const events: MatchEvent[] = []
    for (const ev of eventLog) {
      if (ev.sim_clock_s > t) break
      if (ev.sim_clock_s !== t) continue
      const kind = toMatchEventKind(ev.event_type)
      if (kind === null) continue
      const id = primaryEntityIdOf(ev)
      events.push(id === null ? { kind, atSecond: t } : { kind, atSecond: t, entityId: id })
    }

    return { clock: t, entities, events }
  }
}

function positionFromEvent(ev: EngineEventSlice | undefined, t: number): PitchPointMm {
  if (ev === undefined) return PITCH_CENTRE_MM
  const { start_pos, end_pos, sim_clock_s, duration_s } = ev
  if (start_pos === null && end_pos === null) return PITCH_CENTRE_MM
  if (start_pos === null) return end_pos as PitchPointMm
  if (end_pos === null) return start_pos
  const elapsed = t - sim_clock_s
  if (duration_s <= 0 || elapsed >= duration_s) return end_pos
  if (elapsed <= 0) return start_pos
  return lerpPoint(start_pos, end_pos, elapsed / duration_s)
}

function buildEntity(
  side: 'home' | 'away',
  playerId: number,
  lastByEntity: Map<string, EngineEventSlice>,
  t: number,
): MatchEntity {
  const id = entityId(side, playerId)
  return {
    id,
    kind: side,
    pos: normalizePoint(positionFromEvent(lastByEntity.get(id), t)),
  }
}

function buildBallEntity(lastByEntity: Map<string, EngineEventSlice>, t: number): MatchEntity {
  return {
    id: ballEntityId,
    kind: 'ball',
    pos: normalizePoint(positionFromEvent(lastByEntity.get(ballEntityId), t)),
  }
}

/** One-shot convenience wrapper around `MatchWorldStateTracker`. */
export function getFrameAtSecond(
  eventLog: readonly EngineEventSlice[],
  t: number,
  lineups: Lineups,
): MatchFrame {
  return new MatchWorldStateTracker(lineups).getFrameAtSecond(eventLog, t)
}
