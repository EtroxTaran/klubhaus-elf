---
title: ADR-0026 Match Frame Contract
status: draft
tags: [adr, architecture, match-engine, match-view, contract, determinism]
created: 2026-05-19
updated: 2026-05-27
accepted_at: 2026-05-19
type: adr
binding: true
supersedes:
superseded_by:
related: [[ADR-0003-match-engine]], [[ADR-0049-swappable-spatial-event-match-engine]], [[ADR-0024-match-renderer-abstraction]], [[ADR-0041-presentation-renderer-strategy]], [[ADR-0004-data-model]], [[ADR-0022-animation-game-feel]], [[ADR-0021-revised-tech-stack]], [[../../60-Research/determinism-and-replay]], [[../../60-Research/match-engine-simulation-model]], [[../../60-Research/swappable-spatial-event-match-engine-2026-05-27]]
---

# ADR-0026: Match Frame Contract

## Status

accepted

## Date

2026-05-19

## Context

FMX-10 update, 2026-05-27: this ADR remains the 2D presentation seam, but its
engine-side producer is now the runtime-neutral event/spatial log from ADR-0049
rather than a concrete TypeScript `packages/match-engine` package. `MatchFrame`
is still a derived projection; canonical match authority stays in the engine
event log and spatial samples.

[[ADR-0003-match-engine]] originally locked a deterministic, Web-Worker,
**event-emitting**
match engine: integer-millimetre coordinates on a 105000×68000 grid, ~17 event
types, batched `postMessage`, **no persisted intermediate snapshots** —
resim-from-kickoff is the replay model
([[../../60-Research/determinism-and-replay]] §3.5).

[[ADR-0024-match-renderer-abstraction]] locks a renderer-agnostic
`MatchRenderer` interface (Canvas 2D first; GSAP tweens *state values*, not draw
calls) and refers to "typed frame snapshots emitted by the engine". ADR-0041
later removes PixiJS as a planned renderer migration.

The scaffolded `apps/web/src/lib/match-renderer.ts` assumed a different shape
than the engine actually emits: normalised `[0,1]` coordinates, 6 event kinds
including the inferred-only `"chance"`, and a `MatchFrame` treated as
engine-produced. Left unreconciled this produces rework in two of the largest
packages. `packages/match-engine` is still a `'planned'` stub, so the contract
can be defined cleanly **now**, before either side implements against a wrong
assumption.

This ADR is the single 2D frame contract both the engine boundary and ADR-0024
reference. It does not re-decide the engine model or the renderer abstraction;
it pins the projection seam.

## Decision

Ten rules. They resolve every known fork decisively.

### 1. The contract is a shared, dependency-light leaf package

A new composite package **`packages/match-contract`** holds the only types and
pure utilities shared across the engine ↔ renderer seam. It depends on nothing
but TypeScript (mirrors `packages/db-schema`'s posture). It is consumed via the
existing path mapping `@soccer-manager/match-contract` (→
`packages/match-contract/src`). It is referenced from the root `tsconfig.json`
project list and imported by the selected engine adapter and `apps/web`.

Rationale: a contract owned by the engine package would force `apps/web` to
depend on a full engine bundle to see one type; a contract owned by
`apps/web` would violate [[ADR-0003-match-engine]]'s "engine is framework-
agnostic, callers go through the public interface". A neutral leaf package is
the only option that keeps both ADR-0003's import rule and ADR-0024's
decoupling intact.

### 2. Coordinate space — engine is canonical, contract owns the single conversion

The engine emits and persists **integer millimetres** on a fixed 105000×68000
pitch ([[ADR-0003-match-engine]] §5,
[[../../60-Research/determinism-and-replay]] §4). This is the canonical,
determinism-bearing representation and does not change.

`MatchEntity.pos` consumed by the renderer is **normalised `[0,1]`**. The single
allowed conversion is the pure function `normalizePoint()` in
`packages/match-contract`. The engine never emits normalised coordinates; the
renderer never sees millimetres. Conversion happens exactly once, in the frame
builder (rule 4). `apps/web/src/lib/match-renderer.ts`'s normalised assumption
is **ratified, not changed**.

### 3. Event taxonomy — total many-to-few mapping; `"chance"` is replaced

The ~17 engine `event_type` values map to renderer kinds by the single pure
function `toMatchEventKind()` in the contract package. The renderer kind set is
redefined to **`goal | shot | save | card | sub | whistle`**.

`"chance"` is **removed**. It had no precise engine definition and would have
required heuristic inference (forbidden — non-deterministic seam logic).
`"save"` is added because the engine emits a first-class `save` event and it
is the visually distinct counterpart of `shot`/`goal`.

The mapping is total and pinned (engine_event_type → kind):

| Engine `event_type` | renderer `kind` |
|---|---|
| `goal` | `goal` |
| `shot` | `shot` |
| `save` | `save` |
| `card` | `card` |
| `substitution` | `sub` |
| `kickoff`, `whistle` | `whistle` |
| `pass`, `carry`, `duel`, `foul`, `offside`, `interception`, `clearance`, `set_piece`, `injury`, `tactical_change`, `misc` | *(no kind — not surfaced as a highlight)* |

Events with no kind are still present in the engine log and still drive entity
positions via the frame builder; they are simply not emitted as `MatchEvent`
highlights. Adding a new engine `event_type` is a compile-time break in
`toMatchEventKind()` (exhaustive switch), which is intentional governance.

### 4. `MatchFrame` is derived on demand, never persisted

The engine emits **events only** ([[ADR-0003-match-engine]] §9). `MatchFrame`
is a *view* computed from `(eventLog, t, lineups)` by a pure builder in the
contract package. It is **never** stored, **never** sent over `postMessage`,
**never** part of the save envelope.

This reconciles [[ADR-0024-match-renderer-abstraction]]'s "typed frame
snapshots" wording with [[../../60-Research/determinism-and-replay]] §3.4/§3.5
"no periodic snapshots": ADR-0024 is amended (see Governance) so "snapshot"
means "an ephemeral, derived, in-memory frame", not a persisted artifact.
Resim-from-kickoff (~50 ms) remains the only replay model; the frame builder
is a pure projection over the already-resimmed event log.

A stateful helper `MatchWorldStateTracker` folds the event log forward and
answers `getFrameAtSecond(eventLog, t, lineups)`. Forward-only folding from
kickoff is O(events) and cheap; no reverse seeking, no snapshot cache at MVP.

### 5. Batching and frame cadence are fully decoupled

The engine batches events (per virtual minute or every 20 events,
[[ADR-0003-match-engine]] §9). The renderer draws at up to 60 fps. **These
never meet directly.** The caller (`apps/web` match-view controller, out of
this ADR's scope) consumes batches, feeds them to a `MatchWorldStateTracker`,
and samples `getFrameAtSecond(t)` at its own animation cadence. The contract
package owns the tracker; it owns neither the Worker bridge nor the render
loop.

### 6. Entity ID scheme + substitutions

`MatchEntity.id` is one of:

- `"ball"`
- `"home-{playerId}"`
- `"away-{playerId}"`

where `{playerId}` is the integer engine player id. Helpers `entityId()`,
`parseEntityId()`, `ballEntityId` live in the contract package.

Substitutions: the off player's entity disappears from subsequent frames and
the on player's entity appears; ids are stable and **never reused** within a
match, so GSAP tweens never cross-identify players.

### 7. Interpolation ownership is locked

The engine emits discrete `(start_pos, end_pos, sim_clock_s, duration_s)` only.
It performs **no interpolation**. The caller computes intermediate positions
(linear by default) and hands per-frame state to the renderer; GSAP tweens
*state values*, never draw calls ([[ADR-0022-animation-game-feel]],
[[ADR-0024-match-renderer-abstraction]]). The contract package exposes the
pure `lerpPoint()` used by the frame builder; the renderer never interpolates
and never reads the event log.

### 8. `MatchFrame` is immutable; interventions deferred

`MatchFrame`, `MatchEntity`, `MatchEvent` are deeply `readonly`. The MVP seam
is strictly one-directional: engine → log → builder → frame → renderer.
Interactive interventions (substitutions / tactical changes issued mid-watch)
are a Phase 2 concern handled upstream of the engine (new inputs → resim),
never by mutating a frame. Stated here so no implementer designs a writable
frame.

### 9. Quality-profile render scope

Only `competitive-full` and `interactive-standard` produce renderable frames at
MVP. `background-detailed` and `background-fast` are summary-only / no-spatial
([[ADR-0049-swappable-spatial-event-match-engine]] carries the replacement
quality-profile boundary). The contract exposes
`isRenderableProfile(profile)`; the `apps/web` renderer factory
`getMatchRenderer(profile)` returns `null` for non-renderable profiles. The
factory itself lives in `apps/web` (renderer construction is app-side); the
contract only owns the predicate.

### 10. Versioning

The contract package carries a `MATCH_CONTRACT_VERSION` string. It is **not**
the engine version and does **not** enter determinism derivation (it produces
no persisted bytes). It exists only so a stored event log re-projected by a
newer builder can assert builder/log shape compatibility in tests.

## Verification

A **golden-replay → deterministic-frame-sequence** test in
`packages/match-engine/test/golden/`:

1. Run an existing golden replay → byte-identical event log
   ([[ADR-0003-match-engine]] existing guarantee).
2. Feed the log through `MatchWorldStateTracker`, sampling `getFrameAtSecond`
   at 1 Hz from kickoff to FT.
3. Serialise the frame sequence; assert byte-equality against a committed
   fixture.

This proves the seam is itself deterministic: same seeds → same log → same
frame sequence. CI runs it alongside the existing 10 golden replays. A second
pure-unit suite in `packages/match-contract/test/` covers `normalizePoint`
(corners + centre), `toMatchEventKind` exhaustiveness, `entityId` /
`parseEntityId` round-trip, and `lerpPoint` endpoints.

## Consequences

Positive:

- The two largest packages build against one pinned contract; no rework.
- Determinism is preserved end-to-end and provable by golden frames.
- Canvas 2D renderer internals and engine internals stay independently mutable.

Negative:

- One more composite package + root project reference.
- Adding an engine event type is a deliberate compile-time break at the
  mapping (accepted as governance, not friction).

## Human-decision forks (flagged, not silently decided)

- **HF-1 (rule 3):** removing `"chance"` and adding `"save"`. Alternative: keep
  `"chance"` defined as "shot event with outcome ∈ {off_target, blocked,
  saved}". Recommendation stands (no inference at the seam), but this is a
  match-view UX call that can be revisited without breaking the contract.
- **HF-2 (rule 7):** linear interpolation as the MVP default. Curved/eased
  off-ball motion is a game-feel choice ([[ADR-0022-animation-game-feel]]
  territory) that can be layered in the caller later without changing the
  contract.

## Supersedes

None.

## Related Docs

- [[ADR-0003-match-engine]] · [[ADR-0024-match-renderer-abstraction]] ·
  [[ADR-0022-animation-game-feel]] · [[ADR-0021-revised-tech-stack]]
- [[../../60-Research/determinism-and-replay]] ·
  [[../../60-Research/match-engine-simulation-model]]
