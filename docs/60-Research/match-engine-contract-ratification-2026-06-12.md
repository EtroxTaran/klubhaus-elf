---
title: Match-engine contract ratification research (FMX-135)
status: current
tags: [research, match-engine, determinism, replay, quality-profile, wasm, wasmtime, rust, typescript, fixed-point, fmx-135]
context: match
created: 2026-06-12
updated: 2026-06-12
type: research
binding: false
linear: FMX-135
related:
  - [[raw-perplexity/raw-match-engine-runtime-fork-2026-06-12]]
  - [[raw-perplexity/raw-match-engine-replay-quality-profiles-2026-06-12]]
  - [[../40-Execution/fmx-135-match-engine-contract-decision-queue-2026-06-12]]
  - [[../10-Architecture/09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]
  - [[../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]]
  - [[../10-Architecture/09-Decisions/ADR-0003-match-engine]]
  - [[../10-Architecture/09-Decisions/ADR-0026-match-frame-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0067-set-piece-variant-selection-determinism]]
  - [[determinism-and-replay]]
  - [[match-engine-runtime-strategy]]
---

# Match-engine contract ratification research (FMX-135)

FMX-135 existed because the Match context has the largest replay, anti-cheat and
offline-verification burden, while its supersession chain still read
inconsistently at claim time: ADR-0003 -> ADR-0049 -> ADR-0096, with ADR-0096
frontmatter `status: accepted` but `binding: false` and history text that still
said the runtime fork awaited Nico. This note refreshes the research and feeds
the decision record: [[../40-Execution/fmx-135-match-engine-contract-decision-queue-2026-06-12]].

This note is research input; the binding decision is promoted in
[[../10-Architecture/09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]].

## Decision outcome (FMX-135, 2026-06-12)

Nico approved the recommended D1-D5 path live on 2026-06-12 ("go on"):

- **D1 = B:** one Rust-authored WASM module everywhere; server via Wasmtime,
  browser via the WebAssembly API. The mandatory integer/fixed-point
  replay-bearing numeric surface still applies.
- **D2 = A:** `competitive-full` and `interactive-standard` require
  byte-identical event-log replay; `background-detailed` uses a summary /
  statistical binding gate with byte parity where cheap; `background-fast` is
  statistical-only.
- **D3 = A:** ADR-0096 carries forward ADR-0003's live deterministic rules and
  restates the canonical 9 RNG streams.
- **D4:** the next Match-engine implementation agent owns a single-WASM
  parity/readiness spike under Nico review before the first authoritative Match
  runtime implementation PR. If the spike fails, return to Nico; no automatic
  TypeScript-first fallback.
- **D5:** ADR-0096, ADR-0072, ADR-0077, ADR-0078, ADR-0086 and ADR-0087 are
  `accepted` / `binding: true`.

## Source base

- Perplexity raw captures:
  [[raw-perplexity/raw-match-engine-runtime-fork-2026-06-12]],
  [[raw-perplexity/raw-match-engine-replay-quality-profiles-2026-06-12]].
- Primary/current runtime checks:
  - Wasmtime deterministic execution docs:
    <https://github.com/bytecodealliance/wasmtime/blob/main/docs/examples-deterministic-wasm-execution.md>
  - Wasmtime interruption docs:
    <https://github.com/bytecodealliance/wasmtime/blob/main/docs/examples-interrupting-wasm.md>
  - Wasmtime crate registry: latest stable observed on 2026-06-12 is
    `45.0.1`; Context7 resolved `/bytecodealliance/wasmtime` but its version
    list lagged at `v38.0.4`, so registry/release evidence wins for version
    currency.
  - Rust `libm`: latest crates.io version observed on 2026-06-12 is `0.2.16`;
    official README says it provides Rust implementations of the C math library
    and fallback float math for `core`.
  - `pure-rand`: latest npm version observed on 2026-06-12 is `8.4.0`; README
    describes pure PRNG use, deterministic seeded sequences and jumpable streams.
  - OOTP manual: Play-by-Play Mode distinguishes selected played/watched games
    from auto-play, supporting the product precedent for higher-fidelity
    human-viewed simulations and lower-fidelity fast simulation.

## Runtime fork analysis

### Option A - Rust-native authority plus Rust-to-WASM replay

This preserves ADR-0049/ADR-0096's original Rust-native-default spike posture.
It is viable only if replay-bearing math is integer/fixed-point and cross-build
golden traces are mandatory. Native float equality against WASM is not a safe
assumption because FMA contraction, platform math libraries, compiler
reordering, extended precision, subnormal handling and NaN payload behavior can
diverge. If A is chosen, the spike must prove native-vs-WASM parity under the
integer surface and reject float escape hatches.

Best use: choose A if server-native throughput and Rust-native operational
control are more valuable than the simplicity of one runtime, and if the spike
gets an owner/deadline/fallback.

### Option B - one Rust/WASM module everywhere

Wasmtime's own deterministic-execution docs say WebAssembly is mostly
deterministic but requires deterministic imports, NaN canonicalization policy,
relaxed-SIMD policy, deterministic memory/table growth handling and fuel-based
interruption if interruption can affect execution. Running the same module in
browser and server removes the native-vs-WASM divergence class structurally.
This is the strongest long-term replay posture, assuming host imports are
locked down and optional nondeterministic Wasm proposals are disabled or made
deterministic.

Best use: choose B if the project wants the cleanest proof story for
cross-runtime replay and is willing to accept Wasmtime hosting and possible
native-throughput trade-offs.

### Option C - TypeScript-first MVP behind `MatchEnginePort`

This has the shortest iteration path for design but should be treated as a
fallback/prototype, not a final determinism architecture. If chosen, the
authoritative runtime must be pinned, the core must use fixed-point integers,
and the engine must not call `Math.random`, `Date`, timers or floating `Math.*`
in replay-bearing code. The port boundary must stay narrow enough that a
Rust/WASM implementation can replace it without changing consumers.

Best use: choose C only if the spike is inconclusive or if immediate design
iteration beats long-term runtime certainty.

## Quality-profile replay analysis

The existing FMX profile split is sound if it is explicit:

| Profile | Binding guarantee | Product reason |
|---|---|---|
| `competitive-full` | Byte-identical event-log/golden replay | Multiplayer, anti-cheat, broadcast/watch-party, contested results |
| `interactive-standard` | Byte-identical event-log/golden replay | User watched matches, highlights, bug reports and replay trust |
| `background-detailed` | Summary/statistical envelope is binding; byte parity where cheap | Active but unwatched leagues need inspectable outputs without full event-log cost |
| `background-fast` | Statistical-envelope only; never a byte-exact replay source | Fast universe/season simulation optimizes macro realism and throughput |

This resolves the apparent ADR-0026/ADR-0067 byte-exactness vs ADR-0049
statistical-relaxation tension: byte-exact applies to human-involving profiles;
statistical envelope is a deliberate lower-fidelity profile, not a substitute
for replays users can inspect.

## Status and binding seam (pre-decision analysis, now resolved)

At claim time FMX-135 named six ADRs with frontmatter `status: accepted` but `binding: false`:
ADR-0096, ADR-0072, ADR-0077, ADR-0078, ADR-0086 and ADR-0087. That is not a
runtime-only problem; it is a ratification-semantics problem. The safest
pre-decision resolution was a split decision:

- ADR-0096 should not become binding until Nico chooses D1 runtime authority,
  D2 profile precedence, D3 carry-forward/9-stream correction and spike
  governance.
- The other five should either be explicitly ratified to `accepted` /
  `binding: true`, or demoted to `proposed` / `binding: false`, depending on
  whether their FMX-143 ratification history was intended to be binding.
- Do not keep `accepted` + `binding: false` silently unless the vault formally
  defines clause-level or provisional acceptance semantics. Today it reads as a
  false green light.

FMX-135 resolved this seam on 2026-06-12: all six named ADRs are now
`accepted` / `binding: true`.

## Recommendation put to Nico (accepted)

1. **Numeric surface:** ratify mandatory integer/fixed-point for every
   replay-bearing value, regardless of runtime. This preserves seeded variance:
   randomness stays in explicit seeded streams and persisted draw provenance,
   not in floating-point nondeterminism.
2. **Runtime authority:** choose **B** if replay proof is the top priority;
   choose **A** if native server throughput is the priority and a timeboxed
   parity spike is accepted; keep **C** only as the explicit fallback.
3. **Quality profiles:** ratify D2-A: byte-identical for `competitive-full` and
   `interactive-standard`, statistical envelope for `background-fast`, and a
   hybrid summary guarantee for `background-detailed`.
4. **Carry-forward:** ratify D3-A: ADR-0096 carries forward ADR-0003's live
   rules and restates the canonical 9 RNG streams.
5. **Status cleanup:** resolve the six `accepted`/`binding:false` ADRs in one
   pass. After D1-D4 were answered, all six became `accepted` / `binding: true`.
