// Event-kind mapping (ADR-0026 §3).

import type { EngineEventType, MatchEventKind } from './types'

/**
 * Total many-to-few mapping from engine `event_type` to renderer kind.
 * Returns `null` for events that are NOT surfaced as highlights (they still
 * affect entity positions via the frame builder).
 *
 * Exhaustive switch: adding a new engine event type breaks this at compile
 * time — intentional governance (ADR-0026 §3).
 */
export function toMatchEventKind(t: EngineEventType): MatchEventKind | null {
  switch (t) {
    case 'goal':
      return 'goal'
    case 'shot':
      return 'shot'
    case 'save':
      return 'save'
    case 'card':
      return 'card'
    case 'substitution':
      return 'sub'
    case 'kickoff':
    case 'whistle':
      return 'whistle'
    case 'pass':
    case 'carry':
    case 'duel':
    case 'foul':
    case 'offside':
    case 'interception':
    case 'clearance':
    case 'set_piece':
    case 'injury':
    case 'tactical_change':
    case 'misc':
      return null
    default: {
      // Compile-time exhaustiveness guard.
      const _exhaustive: never = t
      return _exhaustive
    }
  }
}
