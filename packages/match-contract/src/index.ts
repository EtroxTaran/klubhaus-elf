// @soccer-manager/match-contract — engine ↔ renderer seam (ADR-0026).
//
// Leaf composite package: zero runtime deps, no DOM/RNG/time access. Consumed
// by both @soccer-manager/match-engine (planned) and apps/web. The single
// place that defines `MatchFrame`, the engine→renderer event kind mapping,
// the mm↔normalised coordinate conversion, the entity-id scheme, and the
// frame builder.

export { lerpPoint, normalizePoint } from './coords'
export type { ParsedEntityId } from './entity'
export { ballEntityId, entityId, parseEntityId } from './entity'
export { toMatchEventKind } from './events'
export { getFrameAtSecond, MatchWorldStateTracker } from './frame'
export { isRenderableProfile } from './profile'
export type {
  EngineEventSlice,
  EngineEventType,
  Lineups,
  MatchEntity,
  MatchEntityKind,
  MatchEvent,
  MatchEventKind,
  MatchFrame,
  MatchQualityProfile,
  PitchPointMm,
  Vec2,
} from './types'
export {
  MATCH_CONTRACT_VERSION,
  PITCH_HEIGHT_MM,
  PITCH_WIDTH_MM,
} from './types'
