---
title: ADR-0096 Match-engine cross-runtime determinism & numeric-surface contract
status: accepted
tags: [adr, architecture, match-engine, determinism, rng, fixed-point, wasm, rust, runtime, offline-first, fmx-106, fmx-135]
context: match
created: 2026-06-08
updated: 2026-06-12
type: adr
binding: true
supersedes: ADR-0049-swappable-spatial-event-match-engine
superseded_by:
related:
  - [[ADR-0049-swappable-spatial-event-match-engine]]
  - [[ADR-0003-match-engine]]
  - [[ADR-0026-match-frame-contract]]
  - [[ADR-0067-set-piece-variant-selection-determinism]]
  - [[ADR-0002-offline-first]]
  - [[ADR-0011-server-authoritative-multiplayer]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0030-llm-out-of-authoritative-state]]
  - [[ADR-0044-cicd-and-merge-policy]]
  - [[ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[../../60-Research/determinism-and-replay]]
  - [[../../60-Research/match-engine-runtime-strategy]]
  - [[../../60-Research/swappable-spatial-event-match-engine-2026-05-27]]
  - [[../../60-Research/match-engine-contract-ratification-2026-06-12]]
  - [[../../40-Execution/fmx-135-match-engine-contract-decision-queue-2026-06-12]]
  - [[../../50-Game-Design/GD-0002-match-engine]]
  - [[../../00-Index/Open-Decisions-Dossier]]
---

# ADR-0096: Match-engine cross-runtime determinism & numeric-surface contract

## Status

accepted

> Adopted `accepted` 2026-06-08 — authored and ratified in the same sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `draft`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **History (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143):**
> **`draft` / `binding: false`.** Authored 2026-06-08 (FMX-106 open-decisions sweep). This ADR
> **finalises [[ADR-0049-swappable-spatial-event-match-engine]]** (which is itself still `draft`)
> on the one axis it left soft — cross-runtime numeric determinism — and **carries
> [[ADR-0003-match-engine]] forward explicitly**, closing the carry-forward and RNG-stream-count
> gaps that ADR-0049 left dangling. It supersedes both as the planning target for the determinism
> contract; it does **not** edit either file (ratify gate). The runtime-stance question
> (Rust-native+WASM-replay vs single-WASM-everywhere vs TS-first MVP) was the load-bearing
> decision and was presented as options for Nico. Historical only; the FMX-135 binding ratification
> below resolves this fork.

> **FMX-135 binding ratification (2026-06-12):** Nico approved the recommended
> D1-D5 path via the live FMX-135 decision pass. New research:
> [[../../60-Research/match-engine-contract-ratification-2026-06-12]]; decision
> packet:
> [[../../40-Execution/fmx-135-match-engine-contract-decision-queue-2026-06-12]].
> Outcome: mandatory integer/fixed-point replay surface; authoritative runtime
> **B = single Rust/WASM module everywhere**; D2-A profile precedence; D3-A
> carry-forward + 9 RNG streams; D4 governance below; D5 status cleanup applied.

## Date

2026-06-08

## Context

[[ADR-0049-swappable-spatial-event-match-engine]] promises "byte-stable replay across runtimes"
from a **Rust-native-authoritative + Rust→WASM browser-replay** split (its §Decision rules 2 and 4).
But its determinism section only *softly* requires fixed point — "The engine uses fixed-point or
explicitly quantized numeric surfaces **where cross-runtime equality matters**" — and leaves "where
it matters" undefined. For an **offline-first, verify-locally** product (ADR-0002; cloud sync narrow
per ADR-0090) this is load-bearing: the client must be able to re-derive and verify the same canonical
event log the server committed, **across two different runtimes**.

External best practice says native↔WASM float equality is **not guaranteed**, for four independent
reasons (grounding below): FMA contraction (native may fuse `a*b+c`; core WASM has no FMA op),
**libm/transcendental** divergence (native `std` float ops route to a platform libm of varying
accuracy; WASM links a different libm), **expression reordering / extended precision** (x87 80-bit
temporaries, reassociation), and **denormal/subnormal + NaN-payload** freedom (the WASM spec fixes the
numeric *class* but not NaN payload bits, and engines may flush subnormals differently). The standard
remedies are exactly two: **(A) keep the deterministic core in integer / fixed-point** arithmetic, or
**(B) make a single WASM module the only execution target** (server-side via wasmtime + same module in
the browser). "Author in Rust native, replay in WASM, and trust the floats to match" is **not** on the
list of safe options — yet that is effectively ADR-0049's default path.

Three further gaps that ADR-0049 opened and did not close:

1. **Byte-exact-vs-statistical precedence gap.** [[ADR-0026-match-frame-contract]] and
   [[ADR-0067-set-piece-variant-selection-determinism]] (both `binding`) pin **byte-identical
   golden-replay** as the guarantee. ADR-0049 relaxes this — "Statistical regression tests protect
   balance where exact event equality is intentionally versioned" — **without a rule** for *when* byte
   parity is required vs when a statistical envelope suffices. The four quality profiles
   (`competitive-full` / `interactive-standard` / `background-detailed` / `background-fast`, from
   ADR-0003 §2 and [[../../60-Research/determinism-and-replay]] §3.1) make this a *per-profile* question
   that nobody answers today.
2. **RNG stream-count drift.** [[ADR-0003-match-engine]] §Context says "**8** named RNG streams"; the
   canonical [[../../60-Research/determinism-and-replay]] §2.2 locks **9** (stream #9 `GeneratorRng`
   added 2026-05-17 by gap D2). ADR-0049 inherits the engine's determinism rules without restating the
   count, so the stale "8" can propagate.
3. **Undefined ADR-0003 carry-forward set.** ADR-0003 says "Keep this ADR … for rules that are
   explicitly carried forward by ADR-0049" — but ADR-0049 never enumerates *which* rules. The
   integer-only branching, the 12 save-determinism rules, the namespaced-routine-ID convention and the
   engine-versioned-replay model are all live, but their carry-forward is implicit, not pinned.

This ADR closes all three, pins the determinism precedence rule and records the FMX-135 runtime
decision.

## Grounding

- **WebAssembly core spec, numerics** — FP ops are IEEE-754 round-to-nearest-ties-even, "non-stop"
  (no traps), and NaN **payload bits are deliberately left unspecified** (only the NaN *class* is
  fixed); core MVP has **no FMA** instruction. <https://webassembly.github.io/spec/core/exec/numerics.html>
- **wasmtime `Config`** — exposes determinism-adjacent toggles (fuel, stack) but **no "strong FP
  determinism" mode**: same wasmtime version + same CPU + same module is deterministic, but that does
  not extend to native↔WASM bit-equality. <https://docs.wasmtime.dev/api/wasmtime/struct.Config.html>
- **Rust deterministic-FP practice** — `std` float ops route to the platform libm (variable accuracy);
  the recommended fix is a **pure-Rust `libm`** consistently, plus avoiding x87 extended precision and
  fast-math. Even then this only aligns *native↔native*, not native↔WASM.
  <https://users.rust-lang.org/t/subtle-floating-point-differences-between-c-library-and-its-rust-re-write/82355>
- **Rapier (Rust physics) determinism notes** — cross-platform float determinism is hard; strict replay
  is constrained to integer/fixed-point or a fully controlled stack. (Perplexity synthesis, 2026-06-08.)
- Consolidated: native↔WASM FP equality fails on **FMA, libm, reordering/extended-precision,
  subnormal/NaN-payload**; the two robust remedies are **integer/fixed-point** or **single-WASM-target**.

## Options considered

### D1 — Numeric surface + runtime stance (the load-bearing decision)

- **A.** Make the **integer / fixed-point numeric surface MANDATORY** for all replay-bearing
  computation and keep a Rust-native authoritative runtime plus Rust→WASM replay. This preserves
  native throughput, but remains the highest proof burden because native-vs-WASM parity must be
  continuously proven. **Not chosen as the authoritative runtime in FMX-135.**
- **B (CHOSEN).** **Single-runtime — author the engine once in Rust→WASM and run the SAME WASM module
  server-side (wasmtime) and client-side.** Strongest bit-identical / offline-verify story (remedy (B));
  removes the native↔WASM divergence class structurally even for any residual float use. Cost:
  server-side WASM hosting on the Dokploy host ([[ADR-0044-cicd-and-merge-policy]]) and lower native peak
  throughput vs a native Rust worker.
- **C.** **Keep TypeScript authoritative for MVP, Rust as a profiled future swap behind the port.**
  Lowest ship risk; one runtime, one libm, no cross-runtime divergence at MVP; defers the whole
  cross-runtime determinism question until benchmark evidence exists. Cost: the Rust-native scaling
  headroom that ADR-0049 wanted stays a future migration, behind the same port.

> **Note (A and B are not exclusive on the *surface* question).** A mandatory integer/fixed-point
> surface (the A half) is the safe default under *every* runtime stance and should be adopted regardless;
> the genuine fork is **which runtime is authoritative** — Rust-native+WASM-replay (A's runtime half) vs
> single-WASM-everywhere (B) vs TS-first (C).

### D2 — Determinism precedence rule (resolves the byte-vs-statistical gap)

- **A (CHOSEN).** **Per-quality-profile precedence:** byte-identical event-log golden replay is
  **mandatory** for `competitive-full` and `interactive-standard` (human-involving, audit/anti-cheat,
  watch-party); `background-detailed` keeps byte parity where cheap but a statistical envelope is the
  binding gate; **`background-fast` is statistical-envelope-only** (outcome-first generation, ADR-0049
  §Spatial-Event Semantics) and is **never** used as a byte-exact replay source. This makes ADR-0026/0067
  byte-exactness the rule for the profiles they actually govern and scopes ADR-0049's relaxation to
  `background-fast` only.
- **B.** Byte-exact for all four profiles (maximal, but defeats the cost purpose of `background-fast`).
- **C.** Statistical-only for all (cheapest, but breaks ADR-0026/0067's binding golden-replay guarantee
  and the anti-cheat/watch-party verify-locally story).

### D3 — ADR-0003 carry-forward + RNG-stream restatement (housekeeping, low-controversy)

- **A (CHOSEN).** Add an **explicit ADR-0003 carry-forward appendix** (the rules that survive
  verbatim) and **restate the canonical 9 RNG streams** (correcting the stale "8"), pointing at
  [[../../60-Research/determinism-and-replay]] §2.2 as the single source.
- **B.** Leave carry-forward implicit (status quo — the gap this ADR exists to close).

## Decision

Nico decision (FMX-135, 2026-06-12): **D1 = B** for authoritative runtime, with the
mandatory integer/fixed-point replay surface from D1-A; **D2 = A** per-profile
precedence; **D3 = A** carry-forward appendix + 9-stream restatement; **D4** spike
governance as below; **D5** status/binding cleanup applied.

### D1-A — Mandatory integer / fixed-point replay surface

Promote ADR-0049's soft clause to a binding contract: **every value that a committed event, summary
statistic, RNG branch or replay decision depends on is computed in integers / fixed-point** (basis
points 0–10000 for probabilities, integer millimetres on the 105 000 × 68 000 grid for coordinates,
integer mm/s for velocities, integer cents for money — exactly the table already locked in
[[../../60-Research/determinism-and-replay]] §4). Floating point is permitted **only** downstream of the
committed event log — in the `MatchFrame` projection and render interpolation (ADR-0026), which are not
replay-bearing. This is the single change that makes *any* later runtime (Rust-native, Rust→WASM, or TS)
equality-safe, so it preserves future options without accepting hidden numeric divergence.

### D1-B — Single-WASM authoritative runtime

The authoritative Match engine is one Rust-authored WebAssembly module:

- Server executes the same module via Wasmtime.
- Browser replay/sandbox executes the same module via the WebAssembly API.
- Native Rust builds may exist for local diagnostics or performance comparison, but are **not**
  authoritative unless a future ADR explicitly reopens the runtime decision.
- Implementation must re-check the latest stable Wasmtime, Rust toolchain and supporting packages at
  implementation time, then pin exact versions. The 2026-06-12 research observed Wasmtime `45.0.1`,
  Rust `libm` `0.2.16` and `pure-rand` `8.4.0` as current registry versions.
- Host imports are deterministic-only; no clocks, system RNG, nondeterministic filesystem/state or
  platform math enter replay-bearing logic.
- Relaxed SIMD is disabled or forced deterministic. NaNs are treated as engine bugs; no NaN payloads
  carry state. If interruption is required, fuel-based deterministic interruption is the replay-safe
  option; epoch/wall-clock interruption is operational only and cannot affect committed state.

### D2-A — Per-profile determinism precedence (the single cluster-wide rule)

| Quality profile | Replay guarantee (binding gate) | Source of authority |
|---|---|---|
| `competitive-full` | **Byte-identical** event-log golden replay | ADR-0026 / ADR-0067 byte-exactness |
| `interactive-standard` | **Byte-identical** event-log golden replay | ADR-0026 / ADR-0067 byte-exactness |
| `background-detailed` | Byte parity where cheap; **statistical envelope** is the binding gate | ADR-0049 relaxation, bounded |
| `background-fast` | **Statistical envelope only**; never a byte-exact replay source | ADR-0049 outcome-first path |

This is the rule the whole match cluster reads when ADR-0026/0067 (byte-exact) and ADR-0049
(statistical) appear to conflict: **profile decides**. Anti-cheat, audit and watch-party replays
(ADR-0011, ADR-0090) run only against byte-exact profiles.

### D3-A — ADR-0003 carry-forward appendix + 9 RNG streams

Rules carried forward verbatim from [[ADR-0003-match-engine]] (now under the ADR-0049/0096 planning
target, not re-decided): integer-only probability branching against basis points (§3, §Compliance); the
**12 save-determinism rules** and the `Math.random`/`Date.now`/`setTimeout` lint bans
([[../../60-Research/determinism-and-replay]] §5); the namespaced-routine-ID convention and
no-rename rule (§8); semantic-`engineVersion` per-version vendored replay modules (§10); the
framework-agnostic engine boundary. **RNG streams: the canonical count is 9, not 8** — `WorldRng`,
`WorldAiMgmtRng`, `MatchCoreRng`, `MatchAiRng`, `WeatherRng`, `InjuryRng`, `TransferRng`,
`NewsRng/PresentationRng`, `GeneratorRng` ([[../../60-Research/determinism-and-replay]] §2.2). Any doc
quoting "8 named streams" (ADR-0003 §Context) is superseded by this restatement.

### Spike governance

The ADR-0049 open-ended Rust-native runtime spike is closed by FMX-135. The remaining spike is a
single-WASM parity/readiness spike:

- **Owner:** the next Match-engine implementation agent under Nico review.
- **Deadline:** before the first implementation PR that introduces authoritative Match runtime code.
- **Exit criteria:** same fixtures, seeds and input snapshots produce identical event-log hashes for
  byte-exact profiles in Wasmtime and supported browser engines; no replay-bearing float escape hatches;
  no nondeterministic host imports; deterministic interruption policy documented.
- **Fallback:** if the single-WASM path is blocked, return to Nico with a new A/B/C decision. A TS-first
  authoritative MVP fallback is **not** automatically authorized by this ADR.

## Consequences

Positive:

- Removes the **native↔WASM float-divergence class** as a correctness risk — offline verify-locally
  becomes *sound* rather than hoped-for.
- Gives the match cluster a **single determinism precedence rule** (D2-A), ending the silent ADR-0026/0067
  vs ADR-0049 conflict.
- Closes the carry-forward and RNG-count gaps; the "8 vs 9" drift can no longer propagate.
- Keeps the Rust-native headroom open: the integer surface makes the runtime choice *cheaper and safer*,
  not foreclosed.

Negative / cost:

- Mandatory fixed-point **constrains engine-math authoring** (no convenient float geometry in the
  replay-bearing core; geometry must be quantised — already the ADR-0003 §3 stance, now made strict).
- Single-WASM hosting adds Wasmtime operational surface and may cap native peak throughput compared
  with a native Rust worker. The D4 readiness spike must prove the cost is acceptable before the first
  authoritative Match runtime implementation PR.

## Risks

- **Single-WASM viability risk.** The selected runtime needs Wasmtime/browser parity evidence before
  implementation. Mitigation: D4 requires a pre-implementation parity/readiness spike and returns to
  Nico if it fails.
- **Fixed-point authoring friction.** Forcing quantised math may tempt float "escape hatches" in the
  core. Mitigation: the ADR-0003 lint bans (float-threshold branching, transcendentals) extend to all
  replay-bearing code, enforced in CI.
- **Profile mislabelling.** A match run under the wrong profile could claim byte-exactness it cannot
  honour. Mitigation: `qualityProfile` is part of the `ReplayRecord` / `MatchReplayInputs` and the
  golden-replay gate keys off it.

## Open questions

None for FMX-135. If the D4 single-WASM spike fails, reopen a new HITL runtime decision instead of
silently falling back to TS-first or Rust-native authority.

## Supersedes

- [[ADR-0049-swappable-spatial-event-match-engine]] — **finalised** on the cross-runtime determinism
  axis: ADR-0049's soft "fixed-point where it matters" is replaced by the mandatory replay-bearing
  integer surface (D1-A), the single-WASM authority decision (D1-B) and the per-profile precedence rule
  (D2-A). ADR-0049's swappable port, spatial-event model and LLM boundary are carried forward; its
  open-ended Rust-native runtime spike is replaced by FMX-135 D4 governance. ADR-0049 is not edited.
- [[ADR-0003-match-engine]] — **carried forward** via the D3-A appendix (carry-forward rule set made
  explicit; 9-stream count restated, correcting "8"). ADR-0003 is not edited.

## Map patch proposal (proposed-not-applied)

None. This ADR fixes the **determinism contract internal to the Match context**; it changes no
bounded-context boundary and adds no row to [[ADR-0089-bounded-context-portfolio-reconciliation]]'s
catalog or to `bounded-context-map.md`.

## Related Docs

- [[ADR-0049-swappable-spatial-event-match-engine]] — superseded on the determinism axis; swappable port
  + spike + spatial model carried forward.
- [[ADR-0003-match-engine]] — carried forward via the D3-A appendix; source of the integer-branching and
  routine-ID rules.
- [[ADR-0026-match-frame-contract]] / [[ADR-0067-set-piece-variant-selection-determinism]] — the
  `binding` byte-exact golden-replay guarantees that D2-A scopes per profile.
- [[../../60-Research/determinism-and-replay]] — the canonical numeric table (§4), 12 save-determinism
  rules (§5), 9 RNG streams (§2.2), cross-runtime parity gate (§7) this ADR pins.
- [[../../60-Research/match-engine-runtime-strategy]] / [[../../60-Research/swappable-spatial-event-match-engine-2026-05-27]]
  — runtime-strategy grounding behind the superseded D1 fork.
- [[ADR-0002-offline-first]] / [[ADR-0090-offline-sync-scope-and-conflict-strategy]] — the verify-locally
  / narrow-sync product context that makes cross-runtime byte-parity load-bearing.
- [[../../50-Game-Design/GD-0002-match-engine]] — game-design source for the match engine.
- [[../../00-Index/Open-Decisions-Dossier]] — consolidated open-decision Q&A (FMX-106 entry).
