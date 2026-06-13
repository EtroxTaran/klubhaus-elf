---
title: FMX-135 Match-engine contract decision queue
status: current
tags: [execution, decision-queue, match-engine, determinism, adr, decided, fmx-135]
created: 2026-06-12
updated: 2026-06-12
type: decision-queue
binding: false
linear: FMX-135
related:
  - [[../60-Research/match-engine-contract-ratification-2026-06-12]]
  - [[../10-Architecture/09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]
  - [[../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]]
  - [[../10-Architecture/09-Decisions/ADR-0003-match-engine]]
  - [[decision-queue-2026-06-08]]
---

# FMX-135 Match-engine contract decision queue

This is the HITL decision record for FMX-135. It refines the ADR-0096 line from
[[decision-queue-2026-06-08]] and the new research
[[../60-Research/match-engine-contract-ratification-2026-06-12]].

Nico approved the recommended path live on 2026-06-12 ("go on"). The options
below are preserved for traceability; the selected outcomes are authoritative
only where promoted into [[../10-Architecture/09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]
and the affected ADR frontmatter.

## D1 - authoritative runtime fork

The fixed-point/integer replay surface is recommended under every option. The
fork is only the authoritative runtime:

| Option | Meaning | Best when | Risk |
|---|---|---|---|
| A | Rust-native authoritative engine + Rust-to-WASM replay/sandbox | Native throughput and Rust ops control matter most | Needs strict parity spike and ongoing native-vs-WASM golden traces |
| B | One Rust/WASM module everywhere; server via Wasmtime | Strongest replay proof and simplest cross-runtime story matter most | Wasmtime hosting and possible native-throughput trade-off |
| C | TypeScript-first MVP behind `MatchEnginePort` | Spike is inconclusive or design iteration must win temporarily | Deferred migration and easy accidental JS nondeterminism |

**Decision:** B. Author the engine once in Rust/WASM and run the same module
server-side via Wasmtime and client-side via the WebAssembly API. Keep the
mandatory integer/fixed-point replay surface from A; do not authorize C as an
implicit fallback.

## D2 - quality-profile replay precedence

| Option | Meaning | Recommendation |
|---|---|---|
| A | `competitive-full` and `interactive-standard` = byte-identical; `background-detailed` = summary/statistical gate with byte parity where cheap; `background-fast` = statistical only | Recommended |
| B | Byte-identical for all profiles | Too expensive; defeats `background-fast` |
| C | Statistical-only for all profiles | Reject; breaks replay/anti-cheat/watch trust |

**Decision:** A.

## D3 - ADR-0003 carry-forward and RNG streams

| Option | Meaning | Recommendation |
|---|---|---|
| A | ADR-0096 carries forward ADR-0003's live deterministic rules and restates the canonical 9 RNG streams | Recommended |
| B | Leave carry-forward implicit and keep the stale "8 streams" drift in history | Reject |

**Decision:** A.

## D4 - spike governance

Selected D4 governance:

- **Owner:** the next Match-engine implementation agent under Nico review.
- **Deadline:** before the first implementation PR that introduces authoritative
  Match runtime code.
- **Exit criteria:** same fixtures/seeds/input snapshots produce identical
  event-log hashes for the byte-exact profiles in Wasmtime and supported
  browser engines; no replay-bearing float escape hatches; no nondeterministic
  host imports; deterministic interruption policy documented.
- **Inconclusive fallback:** return to Nico with a new A/B/C decision. A
  TypeScript-first fallback is not automatically authorized.

**Decision:** selected as above.

## D5 - six-ADR status/binding cleanup

Linear FMX-135 listed these as inconsistent at claim time: ADR-0096, ADR-0072,
ADR-0077, ADR-0078, ADR-0086 and ADR-0087.

| Option | Meaning | Recommendation |
|---|---|---|
| A | Demote all six to `proposed` / `binding: false` until re-ratified | Clean but may undo FMX-143 ratification intent |
| B | Ratify all six as `accepted` / `binding: true` | Correct after D1-D4 are answered |
| C | Split: ADR-0096 remains non-binding until D1-D4 are answered; the other five become `binding: true` if Nico confirms they were meant as binding in FMX-143 | Pre-decision safeguard |

**Decision:** B after D1-D4 were answered. ADR-0096, ADR-0072, ADR-0077,
ADR-0078, ADR-0086 and ADR-0087 are `accepted` / `binding: true`.

## Decision record

- 2026-06-12: research and decision packet prepared.
- 2026-06-12: Nico approved the recommended D1-D5 path live ("go on").
- Decisions: D1=B single Rust/WASM module everywhere; D2=A profile precedence;
  D3=A ADR-0003 carry-forward + 9 RNG streams; D4 single-WASM readiness spike;
  D5 all six named ADRs `accepted` / `binding: true`.
