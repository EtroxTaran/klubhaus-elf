---
title: ADR-0003 Match Engine Architecture
status: accepted
tags: [adr, match-engine, simulation, web-worker, deterministic]
created: 2026-05-15
updated: 2026-05-16
accepted_at: 2026-05-16
type: adr
binding: true
related: [[ADR-0004-data-model]], [[ADR-0005-save-format]], [[ADR-0011-server-authoritative-multiplayer]], [[ADR-0013-transactional-outbox]], [[ADR-0016-community-dataset-overrides]], [[../state-machines/match]], [[../../60-Research/match-engine-simulation-model]], [[../../60-Research/determinism-and-replay]], [[../../50-Game-Design/match-engine]], [[../../50-Game-Design/tactics-system]]
---

# ADR-0003: Match Engine Architecture

## Status

Accepted (2026-05-16, gap A3 of [[../../60-Research/wave-3-gap-analysis]]).

## Context

The match engine is the heart of the product. It runs ~150 deterministic
events per match in ≤ 50 ms on mid-range Android hardware, inside a Web
Worker, and produces both:

- A streaming event log (for human-vs-human and human-vs-AI matches) that
  drives 2D top-down visualisation, three-tier commentary, post-match
  analytics, and watch-party replays (per
  [[../09-Decisions/ADR-0015-spectator-snapshot-streaming]]).
- Server-side simulation results for async multiplayer with on-demand
  re-simulation for AI-vs-AI matches (per ADR-0011 §AI vs AI policy).

Wave-1 ADR-0003 was a 10-line stub. The Wave-3 foundation gaps have now
locked all upstream design:

- **D1 ([[../../60-Research/match-engine-simulation-model]])** —
  hybrid Markov + attribute-roll model; per-event tick; event schema;
  formation interaction; test pyramid; performance budget.
- **D8 ([[../../60-Research/determinism-and-replay]])** — PCG32 via
  `pure-rand`; 8 named RNG streams; integer-only branching; 12
  save-determinism rules; engine-version pinning.
- **A4 (ADR-0004)** — SCHEMAFULL match row + SCHEMALESS match_event
  rows; integer-mm coordinates; record-link to lineups + tactics.
- **B2 (ADR-0011)** — server-authoritative for MP; AI-vs-AI seed-only
  storage with on-demand re-sim; engine_version + match_type stored on
  every match.
- **A2 (ADR-0002)** — engine modules vendored per version inside the
  PWA bundle for offline replay.
- **ADR-0016** — community-dataset override-pack pattern.

Gap A3 Q&A (2026-05-16) settled the final three open questions:
formation-zone-weights authoring, set-piece routine architecture,
routine-ID naming convention.

## Decision

The match engine has nine decision rules. All concrete simulation
mechanics are in [[../../60-Research/match-engine-simulation-model]];
this ADR pins the architecture-level rules.

### 1. Package + module layout

The match engine lives in its own package:

```text
packages/match-engine/
  src/
    engine.ts                       # simulate(input) entry point
    worker.ts                       # Web Worker bridge
    macro/
      markov.ts                     # transition selection
      states.ts                     # MacroState types
    micro/
      contests.ts                   # attribute-roll calculators
      passing.ts
      shooting.ts
      duels.ts
      keeper.ts
    formation/
      influence.ts                  # zone-influence computation
      patterns.ts                   # named zone-weight patterns
      formations.ts                 # the formationZoneWeights map
    events/
      types.ts                      # schema (per D1 §3)
      builders.ts                   # event factories
    set-pieces/
      routines.ts                   # canonical routine library
    pre-match/
      setup.ts                      # PreMatchSetup computation
    data/
      formations/                   # TS literal canonical data
      set-piece-routines/           # TS literal canonical data
    rng/
      streams.ts                    # MatchCoreRng / MatchAiRng wrappers
  test/
    unit/
    integration/
    golden/                         # 10 canonical golden replays
    statistical/                    # envelope tests
    perf/                           # CI perf gate
```

The package is **framework-agnostic**: no React, no DOM, no
`fetch`. It depends only on `pure-rand` (PCG32, per D8), `xxhash-wasm`
(seed derivation, per D8), and `zod` (event-schema validation when
running outside hot paths).

### 2. Public API

```ts
// packages/match-engine/src/index.ts

export interface MatchInputs {
  engine_version: string
  seeds: { coreSeed: number; aiSeed: number }
  quality_profile:
    | 'competitive-full'
    | 'interactive-standard'
    | 'background-detailed'
    | 'background-fast'
  home_lineup: Lineup
  away_lineup: Lineup
  home_tactic: TacticConfig
  away_tactic: TacticConfig
  weather: WeatherInputs
  referee_profile: RefereeProfile
  emit_full_event_log: boolean   // true for human-involving matches,
                                  // false for AI-vs-AI default per ADR-0011
}

export interface MatchResult {
  events: MatchEventCore[]       // empty when emit_full_event_log = false
  summary: MatchSummary
  rng_final_state: RngStateSnapshot
}

export interface MatchEngine {
  simulate(input: MatchInputs): Promise<MatchResult>
  simulateStreaming(input: MatchInputs): AsyncIterable<MatchEventCore>
  replay(input: MatchInputs): AsyncIterable<MatchEventCore>
}
```

All four operations are deterministic given the same `(engine_version,
seeds, quality_profile, lineups, tactics, weather, referee_profile)`. The
contract is the same in singleplayer (runs on the client Worker) and
multiplayer (runs on the server Match Worker per ADR-0011).

### 3. Simulation model — hybrid Markov + attribute rolls

Locked from [[../../60-Research/match-engine-simulation-model]] §1:

- **Macro layer**: possession-level Markov chain over
  `{teamInPossession, zoneId, phase, pressureLevel}`. Picks the next
  event type and target zone.
- **Micro layer**: 1-3 integer attribute contests per event resolve
  success/failure and numeric outcomes (shot xG, pass success, foul
  severity).
- **Numeric model**: all probabilities in basis points (0-10000); all
  branches are integer comparisons (`roll < successBp`). Floats only
  inside engine internals where coordinate geometry demands them.

### 4. Tick + time model

Per [[../../60-Research/match-engine-simulation-model]] §2:

- `simClock` is **integer seconds**.
- Each event consumes integer `duration_s` sampled from the per-type
  range table.
- No fixed per-second or per-minute loop. UI derives minute summaries
  via `floor(sim_clock_s / 60)`.
- Durations are clamped at period boundaries (HT, FT, ET halves) so
  events never overshoot whistles.

### 5. Event schema

Per [[../../60-Research/match-engine-simulation-model]] §3:

- Required core: `id`, `match_id`, `engine_version`, `sim_clock_s`,
  `duration_s`, `period`, `event_type`, `outcome`, `team_id`,
  `player_ids`, `start_pos`, `end_pos`, `start_zone_id`, `end_zone_id`.
- Optional `phase`.
- Optional delta-encoded `tactical_context` snapshot.
- Optional typed `payload` per event_type (PassPayload, ShotPayload,
  DuelPayload, FoulPayload, CardPayload, SetPiecePayload, SubPayload,
  TacticalChangePayload, InjuryPayload, MiscPayload).
- Optional `rng_trace` for debug builds only.

Storage: `match_event` lives in the per-save SurrealDB DB as a
SCHEMALESS table (per A4 §2). For AI-vs-AI matches the table is empty
by default; events are re-generated on demand (per ADR-0011).

### 6. Formation zone weights — TS literal canonical + JSON community overrides

Per A3 Q&A:

The canonical `formationZoneWeights[formation][role]` map is authored
as **TypeScript literals** in
`packages/match-engine/src/data/formations/`:

```ts
// types.ts
export type FormationId = '4-3-3' | '3-5-2' | '5-3-2' | '4-4-2' | '4-2-3-1' | ...
export type RoleId = 'CB' | 'BBM' | 'IF' | 'IWB' | 'AP' | ...
export type ZoneIndex = 0 | 1 | ... | 17   // 18-zone grid (3 × 6, per D1 §4)
export type ZoneWeights = readonly [number, number, /* ...18 entries... */]

export type FormationZoneWeights = {
  readonly [F in FormationId]: {
    readonly [R in RoleId]?: ZoneWeights
  }
}

// patterns.ts — DRY shared patterns
export const CENTRAL_CB: ZoneWeights = [/* ... */] as const
export const WIDE_WINGER: ZoneWeights = [/* ... */] as const
export const INVERTED_FULLBACK: ZoneWeights = [/* ... */] as const
// ...

// formations.ts — canonical map
import { CENTRAL_CB, WIDE_WINGER, ... } from './patterns'
export const formationZoneWeights: FormationZoneWeights = {
  '4-3-3': { CB: CENTRAL_CB, IF: WIDE_WINGER, ... },
  '3-5-2': { CB: CENTRAL_CB, ... },
  // ...
} satisfies FormationZoneWeights
```

Authoring ergonomics:

- Strong types: rename a `RoleId` and the compiler flags every site.
- DRY via named pattern constants; ~13 500 entries fits cleanly with
  pattern reuse.
- Internal authoring tool (post-MVP) will visualise the 3 × 6 grid per
  role/formation and emit TS patches.

Community overrides (per ADR-0016):

- Override packs may include a `formations` JSON section validated
  against a Zod schema (`zoneWeightsSchema = z.array(z.number()).length(18)`).
- Pack overrides are applied at engine init by `applyFormationOverrides`,
  cloning the base map.
- The active dataset-pack ID + version are part of the match's
  `engine_version` derivation so replays re-hydrate the same formation
  weights.

YAML and JSON are **NOT** used as canonical authoring formats; they
are distribution formats for community packs only.

### 7. Set-piece routines — hybrid delivered incrementally

Per A3 Q&A:

The engine maintains a canonical routine library, plus a per-club
editor in Phase 2.

#### 7.1 Canonical routine library (MVP)

TypeScript literals in
`packages/match-engine/src/data/set-piece-routines/`:

```ts
export type RoutineCategory =
  | 'corner_offensive' | 'corner_defensive'
  | 'fk_direct' | 'fk_indirect'
  | 'throw_long' | 'penalty' | 'second_ball'

export interface SetPieceRoutine {
  id: RoutineId                        // namespaced slug (see §8)
  category: RoutineCategory
  version: number                      // routine-schema version
  taker_selection: TakerSelection
  target_zone: ZoneIndex
  runner_movements: RunnerMovement[]
  blocker_movements: BlockerMovement[]
  preconditions?: RoutinePrecondition[]
}

export const SET_PIECE_ROUTINES: readonly SetPieceRoutine[] = [
  {
    id: 'corner/near_post_run',
    category: 'corner_offensive',
    version: 1,
    /* ... */
  },
  /* ~15-25 canonical routines */
] as const
```

Stable IDs: a routine ID never changes meaning. Semantic changes
require a new ID (e.g. `corner/near_post_run_v2`) and the old one is
kept for replay compatibility.

Tactics editor at MVP exposes the library as dropdowns at all three UI
tiers ([[../../50-Game-Design/progressive-disclosure-ui]]). No
in-game routine authoring at MVP.

#### 7.2 Per-club editor (Phase 2)

When the Expert-tier authoring layer ships:

- Per-club routines stored in the per-save SurrealDB DB under
  `club_set_piece_routine` (SCHEMAFULL, per A4 §2):

  ```text
  club_set_piece_routine {
    id: record(club_set_piece_routine),
    club: record(club),
    user_slug: string,              // user-chosen, e.g. 'overload_far_post'
    base_routine: record(set_piece_routine)?,  // optional inheritance
    definition: object,              // SetPieceRoutine structure
    revision: int,
    created_at: datetime,
    locked_for_replays: bool         // true once used in any match
  }
  ```

- Replay safety: when a club uses a custom routine, the engine writes
  the **full routine definition** into the match record (not just the
  ID). Later user edits or deletions don't affect past replays.

- Community packs (ADR-0016) add **library-grade** routines using the
  same namespacing convention. Replays referencing pack routines also
  embed the full definition.

### 8. Routine + formation ID naming convention

Per A3 Q&A — namespaced slug pattern:

| Scope | Pattern | Example |
|---|---|---|
| Canonical engine routines | `category/name` | `corner/near_post_run` |
| Canonical engine routines (versioned variant) | `category/name_vN` | `corner/near_post_run_v2` |
| Community pack routines | `mod.<pack_id>.category/name` | `mod.classic_anstoss.corner/short_corner` |
| Per-club custom routines | `club:<saveScopedClubId>.<userSlug>` | `club:01J....overload_far_post` |
| Formation IDs | `<n>-<n>-<n>` (or `<n>-<n>-<n>-<n>`) | `4-3-3`, `4-2-3-1`, `3-5-2` |
| Role IDs | Short uppercase abbreviation | `CB`, `IWB`, `BBM`, `AP`, `IF`, `TM` |

Rules:

- Every routine MUST have a stable ID; renames are forbidden.
- Stripping a routine from the canonical library requires keeping a
  compatibility stub for replays.
- Mod packs MUST namespace under `mod.<pack_id>.*` to prevent
  collisions.
- Per-club routine IDs are scoped to their save DB; cross-save
  references are impossible by construction.

### 9. Worker bridge + performance contract

Per [[../../60-Research/match-engine-simulation-model]] §6:

- Web Worker entry point: `packages/match-engine/src/worker.ts`.
- Communication: `postMessage` with **discriminated-union** message
  types (no comlink in MVP — keeps bundle smaller, full control over
  abort/cancel semantics).
- Streaming events are sent in **batches**: per virtual minute OR every
  20 events, whichever first. Final batch flushed at full-time.
- Cancellation: `MatchInputs` accepts an `abortSignal` for streaming
  modes (UI navigates away → match aborts).
- Worker MUST NOT call `setTimeout`, `requestAnimationFrame`,
  `Date.now()`, `Math.random()` (per D8 rule 7).

Performance:

- Target: ≤ 50 ms per full match on a 2022 mid-range Android.
- Soft alert: 30-40 ms (CI alerts before regression hits the cap).
- AI-vs-AI batch: ≤ 30 ms (no narrative output, no event log).
- CI perf gate enforces the cap (per E11 test strategy).

### 10. Engine versioning

Locked from D8 + A5:

- `engineVersion` is **semantic version** (e.g. `2.3.0`) embedded in:
  - Every `match` record at creation.
  - Every save envelope (per A5 §8).
  - The `formationZoneWeights` + `SET_PIECE_ROUTINES` lookup chain
    (the canonical data lives in the engine bundle so it inherits the
    same version).
- Engine modules are vendored per version inside the PWA bundle (per
  A2). Loading a save from engine v2.3.0 in a build that runs engine
  v3.0.0 dynamic-imports the v2 engine module for replay; new matches
  use v3.
- Determinism guarantee: same `(engine_version, seeds, lineups,
  tactics, weather, referee_profile)` → byte-identical event log.

## Consequences

### Positive

- Match engine is fully isolated in `packages/match-engine/` — testable
  without browser/server infrastructure.
- Same simulation code path runs client-side (singleplayer Worker)
  and server-side (multiplayer Match Worker per ADR-0011).
- TS literal canonical data gives compile-time safety; new
  formations/routines break the build until handled.
- Community packs extend formations + routines without forking the
  engine, via the override-pack pipeline (ADR-0016).
- Per-event tick keeps log + storage costs low while preserving
  tactical fidelity.
- Hybrid Markov + attribute model preserves emergent tactical
  matchups without hand-coding formation-vs-formation matrices.

### Negative

- The match-engine package becomes one of the largest in the repo
  (~80-100 KB minified bundle for formations + routines + engine
  logic). Worth it: zero runtime parsing cost.
- Every change to canonical formation data or routine library bumps
  `engineVersion`. Old saves stick on old engine modules until the
  user manually triggers a season-end engine upgrade (planned UX
  flow for Phase 2).
- Per-club routine editor (Phase 2) introduces replay-embedding
  complexity: every match using a custom routine grows by the routine
  definition size (~1-3 KB per routine × ~5 set-pieces per match in
  the heaviest case → 5-15 KB extra per match).

### Future

- **Phase 2**: per-club routine editor + community pack routine
  authoring tool.
- **Phase 3**: detailed referee profiles influencing foul/card
  thresholds; weather effects on durations + injury probability;
  tactical familiarity full integration; in-house visual formation
  authoring tool that emits TS patches.
- **Service extraction**: when MP traffic grows, the server-side Match
  Worker becomes its own process per ADR-0019 §Future. The package
  contract stays the same.

## Design source

Implements game-design decisions from [[../../50-Game-Design/GD-0002-match-engine]], [[../../50-Game-Design/GD-0001-core-loop]], [[../../50-Game-Design/GD-0004-tactics]], and the current match/tactics system notes in [[../../50-Game-Design/README]].

## Compliance

The following rules apply to all code in `packages/match-engine/`
and any module that imports from it:

- The engine MUST be framework-agnostic (no React, no DOM, no
  `fetch`).
- All randomness MUST come from `MatchCoreRng` or `MatchAiRng`
  (per D8 §2). `Math.random` is forbidden.
- All time MUST come from `simClock` (per D8 §5 rule 2).
- All probability branches MUST use integer comparisons against basis
  points (per D8 §4).
- Cross-context callers (Match context outside the engine) MUST go
  through the public `MatchEngine` interface; importing internals is
  forbidden.
- The engine bundle MUST stay deterministic across browsers (Chromium
  CI gate per D8 §6).
- Canonical formation + routine data MUST be authored as TS literals;
  JSON + YAML are reserved for community-pack distribution.
- Routine IDs MUST follow the namespaced-slug convention (§8) and
  MUST NOT be reused for semantically different routines.

CI enforcement:

- Lint rule blocks `Math.random`, `Date.now`, `setTimeout`,
  `requestAnimationFrame` in `packages/match-engine/src/`.
- Lint rule blocks float-threshold branching (`if (x < 0.5)` patterns
  on probability values).
- Lint rule blocks imports from `packages/match-engine/src/**` outside
  the package's `index.ts` re-exports.
- Test rule: every public function in `engine.ts` has a determinism
  test (replay with same seeds yields identical output).
- Test rule: 10 canonical golden replays must byte-match committed
  fixtures.
- Test rule: CI perf gate fails if avg simulation > 50 ms per match
  in the heavy scenario; warns if > 35 ms.

## Sources

- [[../../60-Research/match-engine-simulation-model]] (gap D1, 2026-05-16)
  — full sim model, event schema, formation interaction, test pyramid,
  Worker bridge, performance budget.
- [[../../60-Research/determinism-and-replay]] (gap D8) — PCG32, RNG
  streams, integer-only branching, 12 save-determinism rules,
  engine-version pinning.
- [[ADR-0004-data-model]] (gap A4) — SCHEMAFULL match + SCHEMALESS
  match_event; integer-mm coordinates; per-save DB isolation.
- [[ADR-0011-server-authoritative-multiplayer]] (gap B2) — server-side
  simulation; AI-vs-AI seed-only with on-demand re-sim.
- [[ADR-0005-save-format]] (gap A5) — save envelope carries
  `engineVersion`.
- [[ADR-0002-offline-first]] (gap A2) — engine modules vendored per
  version in the PWA bundle.
- [[ADR-0016-community-dataset-overrides]] (gap B7) — JSON-based
  community pack overrides.
- Perplexity research, 2026-05-16 (gap A3): formation authoring +
  set-piece routines + ID naming.
- Wave 3 gap A3 Q&A with Nico (2026-05-16): all three recommendations
  accepted as-is.
