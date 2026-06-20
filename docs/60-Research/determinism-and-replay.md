---
title: Determinism, RNG and Replay - Locked Decisions
status: current
tags: [research, determinism, rng, replay, match-engine, save-format]
context: match
created: 2026-05-16
updated: 2026-05-17
type: research
binding: true
related: [[../95-Archive/gap-reports/research-wave-2-gaps]], [[../95-Archive/gap-reports/wave-3-gap-analysis]], [[match-engine-runtime-strategy]], [[../10-Architecture/09-Decisions/ADR-0003-match-engine]], [[../10-Architecture/09-Decisions/ADR-0005-save-format]], [[../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
---

# Determinism, RNG and Replay - Locked Decisions

This note resolves Wave 3 gap **D8** (R2-08: Determinism, RNG, replay
and save-determinism contract). It locks the foundational rules every
simulation-touching code path must obey so that:

- A match always produces the same events given
  `(seed, lineups, tactics, engineVersion)` regardless of browser, save
  reload, or year of save.
- World drift (AI managers, transfers, retirements, board events) uses
  its own RNG stream so adding new randomness elsewhere never perturbs
  match replays.
- Replays work both as audit (anti-cheat) and as live spectator feeds
  for watch-parties (per
  [[../10-Architecture/09-Decisions/ADR-0015-spectator-snapshot-streaming]]).
- Saves are byte-deterministic across save/load cycles.

These rules are **binding** for every module under `domain/`, `engine/`
and `packages/match-engine`. Compliance is enforced by lint + tests.

## 1. PRNG choice

### 1.1 Algorithm: PCG32 (32-bit JS implementation)

| Property | Value |
|---|---|
| Algorithm | PCG XSH RR 32 |
| Internal state | 64 bits (stored as two `Uint32`) |
| Output | 32-bit unsigned int per draw |
| Period | ~2^64 |
| Statistical quality | Passes TestU01 BigCrush |
| JS implementation | Pure 32-bit arithmetic (`Math.imul`, `>>> 0`) — no BigInt |
| Spec stability | ECMAScript guarantees `Math.imul` + 32-bit ops across all engines |

**Why not xoroshiro128+ or splitmix64 as primary**: requires 64-bit
integer arithmetic. JS gives us BigInt (slow on mid-range Android) or
hi/lo emulation (fragile). PCG32 is the JS-native 2026 sweet spot.

**Why not sfc32**: solid fallback, but PCG32 has better statistical
pedigree and equally simple JS implementation.

**Why not `Math.random`**: spec-underspecified; non-deterministic
across engines and versions; not seedable.

### 1.2 Library: `pure-rand`

Source: [npm pure-rand](https://www.npmjs.com/package/pure-rand), used
internally by `fast-check` (which we will use in [[../95-Archive/gap-reports/wave-3-gap-analysis]]
E11 test strategy for property-based tests).

- TS-first, functional, well-typed.
- ~5 KB minified.
- Stateless API (returns `[value, newRng]`) makes determinism testing
  trivial.
- Provides `mersenne`, `xorshift128plus`, `xoroshiro128plus`,
  `congruential`. We standardise on its `congruential32` (PCG-like)
  and pin the major version.

Alternative if pure-rand becomes problematic: roll our own 30-line
PCG32 in `packages/rng`. Implementation is small enough to audit and
test.

### 1.3 Serialisation

PRNG state is part of every save. Schema:

```ts
type RngState = {
  stateLo: number  // u32
  stateHi: number  // u32
  incLo: number    // u32
  incHi: number    // u32
}
```

All values are JSON-safe (≤ `Number.MAX_SAFE_INTEGER`). Stored inside
the encrypted save envelope (AES-GCM 256 per
[[../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]).

## 2. RNG stream isolation

### 2.1 Strategy

Multiple independent PCG32 instances, each seeded from a master seed
via a deterministic hash. **No** jump-ahead; **no** hash-per-draw.

```ts
// Seed derivation
function deriveStreamSeed(masterSeed: u32, label: string): u32 {
  return xxhash32(label, masterSeed) >>> 0
}

// Per-stream instantiation
const worldRng    = pcg32(deriveStreamSeed(masterSeed, 'world'))
const matchCore   = pcg32(deriveStreamSeed(masterSeed,
                          `match-core:${matchId}`))
const matchAi     = pcg32(deriveStreamSeed(masterSeed,
                          `match-ai:${matchId}`))
```

Hash choice: `xxhash32` from `@node-rs/xxhash` (or pure-JS fallback in
`xxhash-wasm` / `xxhashjs`). Non-cryptographic, deterministic,
spec-stable across browsers.

### 2.2 Named streams (locked set: 9)

| # | Stream | Scope | Persistence |
|---|---|---|---|
| 1 | `WorldRng` | World drift, league restructure, board events, randomness not bound to a specific subsystem | World save |
| 2 | `WorldAiMgmtRng` | Out-of-match AI manager decisions (transfers targets, tactic strategy, contract policy) | World save |
| 3 | `MatchCoreRng(matchId)` | In-match physical events: passes, shots, duels, deflections, referee decisions | Per-match record (until match completed) |
| 4 | `MatchAiRng(matchId)` | In-match AI tactical decisions: subs, formation tweaks, aggression changes | Per-match record |
| 5 | `WeatherRng` | Match-day weather, pitch conditions; isolated so weather refactors don't affect physical events | World save |
| 6 | `InjuryRng` | Long-term injury risk computation, fitness drops; separate so medical-model refactors don't break match replays | World save |
| 7 | `TransferRng` | Player-side acceptance / refusal randomness, contract demand variance, agent behaviour | World save |
| 8 | `NewsRng` / `PresentationRng` | Commentary text variants, headline picks, fun-facts. **Forbidden** from influencing simulation logic | Non-persistent OR derived from `(matchId, eventIndex)` via hash |
| **9** | **`GeneratorRng`** (added 2026-05-17 by gap D2) | One-time world-genesis randomness: countries, leagues, clubs, stadiums, crests, players, names, locations. Sub-labels: `generator:country:<id>`, `generator:league:<country>:<tier>`, `generator:club:<id>`, `generator:club:<id>:crest`, `generator:club:<id>:stadium`, `generator:club:<id>:staff`, `generator:player:<clubId>:<slotIndex>`, `generator:player:<playerId>:attributes`, `generator:player:<playerId>:hidden`, `generator:player:<playerId>:name`, `generator:player:<playerId>:nationality`. **Lazy-expansion-safe**: Tier C compact-profile players regenerate full attributes deterministically via the same sub-label on demand. See [[data-generators]] §12. | World save (master seed only; sub-seeds re-derived each gen) |

### 2.3 Adding new streams later

Adding a new stream (e.g. `BoardMoraleRng`) does NOT affect any
existing stream because seed derivation is by label, not by sequence
position. This is the key property that future-proofs the simulation:
new randomness consumers can be added without invalidating existing
replays. **This property was exercised on 2026-05-17 when gap D2
added `GeneratorRng` as stream #9 without breaking any existing
replay.**

### 2.4 Cross-stream rule

**A stream MUST NOT draw from another stream's RNG**. If subsystem A
needs a value that "feels related" to subsystem B, both must derive
independently from the master seed (e.g. `MatchCoreRng` and
`MatchAiRng` both share `matchId` in their label - they correlate via
deterministic seeding, not via shared state).

## 3. Replay format

### 3.1 Canonical truth for every match

Every match record persists at minimum:

```ts
type MatchReplayInputs = {
  matchId: string                // ULID
  engineVersion: string          // semantic version, pinned
  coreSeed: u32                  // for MatchCoreRng
  aiSeed: u32                    // for MatchAiRng
  qualityProfile: 'competitive-full' | 'interactive-standard' | 'background-detailed' | 'background-fast'
  weatherSeedSlice: u32          // derived once at kickoff
  kickOffSimTime: number         // simClock at kickoff
  homeLineup: Lineup             // frozen at lineup_lock
  awayLineup: Lineup
  homeTactic: TacticConfig
  awayTactic: TacticConfig
  matchType: 'human_vs_human' | 'human_vs_ai' | 'ai_vs_ai'
}
```

This is sufficient to fully resimulate the match in a Web Worker
deterministically.

### 3.2 Event log policy

Locked per Q&A (2026-05-16):

| Match type | Event log policy |
|---|---|
| Human ↔ Human | **Full event log** stored: every pass, duel, dribble, shot, rebound, foul, throw-in, corner, free kick, offside, injury, sub, card, goal, half-time, full-time. Stored under the match record. |
| Human ↔ AI | **Full event log** (same as above). Treated as human-involving. |
| AI ↔ AI | **No event log by default**. Only seed + inputs + summary. On-demand re-sim per [[../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]] §AI vs AI policy. |

### 3.3 Storage projection

- Human match full event log: ~5-20 KB per match (compressed JSON).
- 22-team async MP league with 22 humans × 30 matches/season × ~10 KB
  = ~6.6 MB / league / season.
- 50 such leagues × 5 years = ~1.6 GB. Trivial on Hetzner.

### 3.4 Mid-match join (watch-party / replay viewer)

Spectator joining a live match mid-stream:

- **Live human match** (full event log being streamed): server replays
  the existing event log up to the current minute, then continues
  streaming new events as the engine produces them. Cost: O(events
  already produced) network bytes; CPU on server negligible.
- **AI vs AI watched after the fact**: server re-simulates the match
  from `(seed, lineups, tactics, engineVersion)` in a Worker (~50 ms),
  emits the resulting event log, then streams to the spectator. The
  event log is optionally persisted from then on (caching).

### 3.5 No periodic snapshots

We do **not** persist intermediate match state snapshots. Resim from
kickoff is cheap (50 ms / match) and snapshot complexity (versioning,
state schema, picking snapshot points) is not justified.

### 3.6 Engine version evolution

- Every match stores `engineVersion`.
- We do NOT migrate old seeds to new engine logic. Old replays load
  the corresponding engine module via dynamic import (`engine-v3/`,
  `engine-v4/`, etc.) — or via WASM module per version when we drop a
  major release that breaks determinism.
- Event log schemas are independently versioned (`eventLogVersion`).
  We MAY regenerate event logs from seed+inputs via the old engine
  module if a schema change requires it.

## 4. Numeric representation (locked)

Per Q&A (2026-05-16): **Integers / basis-points** in all
domain / engine code. Floating-point is allowed only inside the
match-engine's internal geometry / time-interpolation routines where
its use is unavoidable.

| Domain | Representation | Range |
|---|---|---|
| Money (cash, transfer fees, wages, sponsor payments) | Integer cents (`number` up to 2^53) | ±90 trillion € |
| Probabilities (chances, attribute-derived odds) | Basis points: integer 0-10000 | 0.00 % - 100.00 % |
| Player attributes | Integer 0-100 (or 1-10 for Quick UI tier) | n/a |
| Time (simClock) | Integer seconds | unbounded |
| Match clock | Integer seconds within match | 0-5400 |
| Coordinates (x, y on pitch) | Integer millimetres on a 105 000 × 68 000 grid | n/a |
| Velocities | Integer mm/s | n/a |
| Atmosphere, morale, form | Integer 0-100 | n/a |

Comparisons against thresholds always use integer comparisons; no
`abs(x - 0.5) < epsilon` patterns in simulation logic. Branches like
"chance of X" are computed as
`rng.nextInt(10000) < chanceBasisPoints`.

## 5. Save-determinism rules (locked)

Twelve binding rules. Lint-enforced where possible; reviewed in PR
otherwise.

| # | Rule | Lint / test |
|---|---|---|
| 1 | All randomness in `domain/`, `engine/`, `packages/match-engine` uses explicit PCG32 instances. `Math.random` is forbidden. | Lint rule blocks `Math.random` in these paths. |
| 2 | No `Date.now()`, `performance.now()`, `new Date()` in simulation. Use `simClock` integer seconds. | Lint rule blocks `Date` references in these paths. |
| 3 | No transcendental `Math` functions (`sin`, `cos`, `tan`, `log`, `pow`) in deterministic decision logic. Precomputed tables or rational-approximation utilities only. | Lint rule blocks raw imports of these in domain/engine code; provides `safeMath` wrapper. |
| 4 | Set / Map iteration order MUST NOT influence simulation outcomes. When order matters, convert to array + `.sort()` with total-order comparator. | Code review + test rule: every match-event-producing function has a determinism test. |
| 5 | All sorts use a strict total-order comparator with a deterministic tie-breaker (entity ID). | Lint rule flags `.sort()` calls without a comparator in domain/engine code. |
| 6 | No object-identity or engine-hash-code branching. No `Map<object, ...>` keyed by mutable objects in simulation. | Code review. |
| 7 | Simulation in Workers is driven by explicit `postMessage` commands. No `setTimeout` / `setInterval` / `requestAnimationFrame` inside sim logic. | Lint rule blocks these in worker paths. |
| 8 | Saves persist all mutable state needed to resume deterministically: world entities, league tables, player states, every RNG stream, simClock. No "derived from cache" shortcuts. | Save/load round-trip test on every release. |
| 9 | All branches involving probabilities use integer comparisons against basis points, not float-threshold compares. | Code review + lint rule warning. |
| 10 | External inputs (user tactic change, network message) are timestamped with `simClock` or discrete match minute and queued for processing in deterministic order. | State-machine contract. |
| 11 | `engineVersion` and `eventLogVersion` are incremented on every breaking change. Saves embed both; old saves load old engine modules. | CI rule blocks merges if engine internals changed without version bump. |
| 12 | Cross-browser determinism CI gate: Chromium-only at MVP (Playwright default); WebKit + Firefox added in Phase-2 hardening. Golden-replay regression tests for ≥ 10 representative matches. | CI required check. |

## 6. CI determinism gate (locked: Chromium-only at MVP)

Per Q&A (2026-05-16): Chromium-only at MVP. Catches ≥ 95 % of
determinism bugs at 1/3 the CI cost. WebKit + Firefox added in a
Phase-2 hardening pass (Wave 3 gap D9 R2-09 performance budgets
work).

Test types:

1. **Per-event property tests** (Vitest + fast-check): every
   match-event function produces the same output given the same RNG
   state.
2. **Golden replay regression**: ≥ 10 canned matches with frozen
   `(seed, lineups, tactics)` produce byte-identical event logs across
   runs.
3. **Save round-trip determinism**: encode → decode → encode produces
   byte-identical save.
4. **PRNG cross-implementation test** (post-MVP): a reference Python
   PCG32 produces the same first-N outputs as our JS implementation.

## 7. Cross-runtime parity gate

MVP has one TypeScript implementation. If a post-MVP Rust or WASM Match
Worker is introduced per [[match-engine-runtime-strategy]], determinism
expands from "same JS code path" to "same versioned engine semantics".

Additional gate before a polyglot worker becomes authoritative:

- PRNG reference vectors match for every named RNG stream and sub-label.
- 10 canonical golden replays byte-match where the `engineVersion` claims
  semantic parity.
- If byte parity is intentionally broken, the new worker must ship under a new
  `engineVersion`; old saves and audit replays continue to load the old TS
  engine module.
- Statistical envelopes over 1k-5k matches stay inside the accepted D1 bands.
- Event ordering, sort tie-breakers, integer comparisons and coordinate
  rounding are specified at the DTO boundary, not left to runtime defaults.
- CI runs both implementations against the same frozen fixture corpus before
  multiplayer authority can switch.

## 8. Cross-references and propagation

The following Wave 3 gaps inherit constraints from this note:

- **A3** (ADR-0003 Match Engine depth rewrite) — PCG32, 5+ named
  streams, full-event-log for human matches, integer-only branching.
- **A5** (ADR-0005 Save Format depth rewrite) — RNG state schema,
  encryption (already locked by B2), save-determinism rules 1-8.
- **A2** (ADR-0002 Offline-first depth rewrite) — offline replay must
  be deterministic; engine version must be available locally.
- **E11** (Test strategy implementation guide) — fast-check, golden
  replays, Chromium CI gate.
- **I8** (Match-engine zone granularity + tick rate) — choose grid +
  tick that play well with integer-mm coordinates.

## 9. Sources

- Perplexity research, 2026-05-16 (gap D8). Calls cited:
  - PRNG comparison + 2026 JS library landscape.
  - RNG stream isolation patterns.
  - Replay format trade-offs for Web Worker simulation.
  - Save-determinism 12-rule consolidation drawn from Glenn Fiedler's
    deterministic lockstep work, GafferOnGames, Unity DOTS
    determinism, WebRTC / WebGL determinism discussions, V8 /
    SpiderMonkey / JavaScriptCore behaviour 2023-2025.
- O'Neill, M. E. (2014). *PCG: A family of simple fast space-efficient
  statistically good algorithms for random number generation*.
- Vigna, S. *xoroshiro+ / xoshiro family*. xoshiro / xoroshiro
  generators.
- npm `pure-rand` documentation, used internally by `fast-check`.
- Wave 3 gap D8 Q&A with Nico (2026-05-16): selected PCG32,
  `pure-rand`, 8 named streams, full event log for human matches,
  integers / basis-points, Chromium-only CI gate.
