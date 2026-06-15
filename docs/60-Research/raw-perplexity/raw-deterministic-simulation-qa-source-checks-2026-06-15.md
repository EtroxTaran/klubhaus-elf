---
title: Raw Source Checks - Deterministic Simulation QA Harness
status: raw
tags: [research, raw, source-checks, determinism, replay, wasm, fast-check, playwright, factorio, football-manager, statsbomb, fmx-196]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-196
related:
  - [[raw-deterministic-simulation-qa-harness-2026-06-15]]
  - [[../deterministic-simulation-qa-harness-2026-06-15]]
  - [[../../40-Quality/deterministic-simulation-qa-harness]]
  - [[../../10-Architecture/09-Decisions/ADR-0120-deterministic-simulation-qa-and-save-forward-matrix]]
  - [[../../40-Execution/fmx-196-deterministic-simulation-qa-decision-queue-2026-06-15]]
---

# Raw Source Checks - Deterministic Simulation QA Harness

## Capture metadata

- Captured: 2026-06-15
- Tools: Firecrawl web search/scrape, Context7 official docs queries.
- Purpose: Verify or reject Perplexity first-pass claims for FMX-196.
- Status: raw notes, not binding implementation guidance.

## Gaffer On Games - deterministic lockstep

- Source: <https://gafferongames.com/post/deterministic_lockstep/>
- Observation: Deterministic lockstep sends simulation inputs rather than full
  object state.
- Observation: Determinism requires the same initial conditions and same inputs
  to produce exactly the same result; checksum comparison is presented as a way
  to detect divergence.
- Observation: Floating-point behavior can diverge across compilers, operating
  systems, architectures and debug/release settings.
- FMX implication: A replay artifact should preserve initial logical state,
  command/input log, engine/rules/content version and state hashes. It should
  not rely on broad native-vs-WASM floating-point equality, aligning with
  accepted ADR-0096.

## Official Factorio Wiki - desynchronization

- Source: <https://wiki.factorio.com/Desynchronization>
- Observation: The wiki defines desync as disagreement of game state between
  server and client.
- Observation: Factorio multiplayer uses deterministic lockstep and requires
  all clients to simulate every tick identically.
- Observation: A desync report contains the player's and server's copy of the
  save game/map state plus a log file, and can be large because it carries more
  data than normal saves.
- Observation: Factorio's heavy mode can save/load every tick to detect state
  changes between save and load.
- FMX implication: On replay hash mismatch, FMX should emit enough evidence to
  compare divergent states, not just print a failed seed. Sparse QA snapshots
  and logs belong in failure/debug artifacts, not necessarily in every
  production replay.

## fast-check official docs - replaying failures

- Source: <https://fast-check.dev/docs/tutorials/quick-start/read-test-reports>
- Context7 query: `/websites/fast-check_dev`
- Observation: fast-check failure reports include seed/path data and support
  rerunning the failure by providing `seed`, `path` and `endOnFailure`.
- Observation: fast-check can configure global seeds for replaying failures.
- FMX implication: Any generated scenario or property failure that finds a
  simulation bug should be promoted to a stable fixture by saving the seed,
  path/counterexample and version hash.

## Playwright official docs - traces

- Source: <https://playwright.dev/docs/trace-viewer>
- Source: <https://playwright.dev/docs/best-practices>
- Context7 query: `/websites/playwright_dev`
- Observation: Playwright can record browser context traces with screenshots
  and snapshots and save them to a zip archive.
- Observation: Playwright recommends trace viewer for CI failure debugging and
  warns that always-on traces are performance-heavy.
- FMX implication: Browser/UI traces are a failure/debug artifact for harness
  tooling and UI-level flows. They should not bloat every deterministic replay.

## WebAssembly spec - numeric determinism boundaries

- Source: <https://webassembly.github.io/spec/core/exec/numerics.html>
- Observation: WebAssembly numeric execution defines floating-point behavior,
  but NaN payload/sign behavior can still allow multiple possible NaN bit
  results for some operations.
- Observation: The broader WebAssembly spec and discussions distinguish defined
  behavior from fully bit-deterministic NaN payload behavior.
- FMX implication: FMX should keep replay-bearing logic on ADR-0096's
  integer/fixed-point surface and treat NaN as an engine bug. The QA matrix
  should test the same WASM module in Wasmtime and supported browsers, not
  reopen a native-Rust authoritative path.

## Football Manager official save compatibility FAQ

- Source: <https://www.footballmanager.com/help/savegamefaq>
- Observation: The FM26 FAQ documents save-game compatibility from selected
  prior titles/platforms to FM26.
- Observation: It explicitly states FM26 progress is not backwards compatible
  to older versions.
- Observation: It says all future FM26 updates apply to transferred save files,
  while some old-save limits remain, such as older-version leagues being the
  only leagues available to add.
- FMX implication: Public management-sim precedent supports a forward save
  migration/import concept with clear version/platform limits. It does not
  prove anything about FM internal deterministic match replay.

## StatsBomb Open Data - football calibration source

- Source: <https://github.com/statsbomb/open-data>
- Observation: StatsBomb publishes selected event and lineup data as JSON for
  public research and football analytics.
- Observation: Data is organized by competitions, matches, events and lineups.
- FMX implication: FMX can calibrate or sanity-check football realism envelopes
  against public football event data without hard-coding one current league
  season as eternal truth. Any exact numeric bands still require a separate
  calibration decision.

## Coherence docs - input prediction and rollback

- Source: <https://docs.coherence.io/0.7.4/authority/input-prediction-and-rollback>
- Observation: Rollback-style deterministic networking keeps historical states,
  restores a valid state when prediction differs and re-simulates forward with
  corrected inputs.
- Observation: The docs list determinism pitfalls: variable update timing,
  asynchronous/system-time inputs, nondeterministic physics, unsynchronized RNG,
  non-symmetrical processing and floating-point differences.
- Observation: Debugging can use per-frame hashes and dumps to identify
  divergence points.
- FMX implication: Snapshot/checkpoint language is useful for QA diagnostics
  and divergence bisection. FMX does not need rollback netcode for matches, but
  the state-hash and snapshot pattern is directly useful for harness failures.

## Source-check conclusion

- Source-checked game precedent supports input-log replay, exact hashes,
  deterministic RNG control, desync dumps and failure-only diagnostic traces.
- Public sources do not justify claims about Football Manager's internal QA
  harness or exact match-engine determinism. The synthesis should cite FM only
  for public save compatibility behavior.
- The safest FMX recommendation is a tiered artifact policy:
  production/player reports store compact inputs/seeds/version/hashes; QA
  divergence artifacts add sparse snapshots and traces; full trace remains
  targeted and exceptional.
