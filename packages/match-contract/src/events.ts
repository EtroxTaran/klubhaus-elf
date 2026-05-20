// Event-kind mapping (ADR-0026 §3).

import type { EngineEventType, MatchEventKind } from './types'

/**
 * Total many-to-few mapping from engine `event_type` to renderer kind.
 * Returns `null` for events that are NOT surfaced as highlights (they still
 * affect entity positions via the frame builder).
 *
 * Exhaustiveness is enforced at compile time by the union return type: adding
 * a new variant to `EngineEventType` without a case here makes TypeScript
 * reject the function (no ending return) — no runtime `default` arm needed
 * (which would also be uncoverable by tests).
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
  }
}
