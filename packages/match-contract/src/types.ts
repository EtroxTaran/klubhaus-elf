// Shared types for the engine ↔ renderer seam — see ADR-0026.
//
// Owned by this leaf package so neither @soccer-manager/match-engine nor
// apps/web own the contract; the engine + renderer both import it. No DOM,
// no RNG, no time, no runtime deps.

export const MATCH_CONTRACT_VERSION = '1.0.0'

/** Standard pitch dimensions, in integer millimetres (ADR-0003 §5). */
export const PITCH_WIDTH_MM = 105_000
export const PITCH_HEIGHT_MM = 68_000

/**
 * Canonical engine point: integer millimetres on the 105000×68000 grid.
 * This is what the engine emits and persists; never normalise on the engine
 * side (ADR-0026 §2).
 */
export interface PitchPointMm {
  readonly x: number
  readonly y: number
}

/** Normalised [0,1] point — what the renderer consumes after conversion. */
export interface Vec2 {
  readonly x: number
  readonly y: number
}

export type MatchEntityKind = 'home' | 'away' | 'ball'

export interface MatchEntity {
  /** `"ball" | "home-{playerId}" | "away-{playerId}"` — see ADR-0026 §6. */
  readonly id: string
  readonly kind: MatchEntityKind
  /** Normalised pitch coordinates in [0,1]. */
  readonly pos: Vec2
}

/**
 * Renderer event kinds — total many-to-few mapping from engine event_type via
 * `toMatchEventKind()` (ADR-0026 §3). `"chance"` removed; `"save"` added.
 */
export type MatchEventKind = 'goal' | 'shot' | 'save' | 'card' | 'sub' | 'whistle'

export interface MatchEvent {
  readonly kind: MatchEventKind
  /** Integer match second, aligned with the engine simClock. */
  readonly atSecond: number
  readonly entityId?: string
}

/**
 * One immutable frame the renderer draws. **Derived**, never persisted
 * (ADR-0026 §4). Built by `MatchWorldStateTracker`/`getFrameAtSecond`.
 */
export interface MatchFrame {
  readonly clock: number
  readonly entities: readonly MatchEntity[]
  readonly events: readonly MatchEvent[]
}

/**
 * The four match quality profiles (ADR-0003). Only the first two render at
 * MVP — see `isRenderableProfile`.
 */
export type MatchQualityProfile =
  | 'competitive-full'
  | 'interactive-standard'
  | 'background-detailed'
  | 'background-fast'

/**
 * Minimal structural slice of the engine's event the contract reads. The full
 * `MatchEventCore` lives in @soccer-manager/match-engine (planned). We declare
 * the slice locally so the contract package has no dependency on the engine
 * — preserves the leaf-package property (ADR-0026 §1).
 */
export type EngineEventType =
  | 'kickoff'
  | 'pass'
  | 'carry'
  | 'duel'
  | 'shot'
  | 'save'
  | 'goal'
  | 'foul'
  | 'card'
  | 'offside'
  | 'interception'
  | 'clearance'
  | 'set_piece'
  | 'substitution'
  | 'injury'
  | 'tactical_change'
  | 'whistle'
  | 'misc'

export interface EngineEventSlice {
  readonly sim_clock_s: number
  readonly duration_s: number
  readonly event_type: EngineEventType
  readonly team_id: 'home' | 'away' | null
  readonly player_ids: readonly number[]
  readonly start_pos: PitchPointMm | null
  readonly end_pos: PitchPointMm | null
}

/** Lineups indexed by engine player id, one map per side. */
export interface Lineups {
  readonly home: ReadonlyMap<number, { readonly shirt?: number; readonly role?: string }>
  readonly away: ReadonlyMap<number, { readonly shirt?: number; readonly role?: string }>
}
