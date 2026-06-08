---
title: ADR re-audit — Cluster C3 (Match Engine / Simulation / Presentation)
status: draft
tags: [research, audit, match-engine, determinism, renderer, frame-contract, babylon, spectator, in-match-control, cluster-c3]
created: 2026-06-08
updated: 2026-06-08
type: research
binding: false
related:
  - [[../10-Architecture/09-Decisions/ADR-0003-match-engine]]
  - [[../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]]
  - [[../10-Architecture/09-Decisions/ADR-0067-set-piece-variant-selection-determinism]]
  - [[../10-Architecture/09-Decisions/ADR-0024-match-renderer-abstraction]]
  - [[../10-Architecture/09-Decisions/ADR-0026-match-frame-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0029-3d-presentation-layer]]
  - [[../10-Architecture/09-Decisions/ADR-0041-presentation-renderer-strategy]]
  - [[../10-Architecture/09-Decisions/ADR-0047-babylon-3d-presentation-engine]]
  - [[../10-Architecture/09-Decisions/ADR-0015-spectator-snapshot-streaming]]
  - [[../10-Architecture/09-Decisions/ADR-0072-in-match-control-seam]]
  - [[../10-Architecture/09-Decisions/ADR-0087-live-match-intervention-buffer-and-pause-vote]]
  - [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  - [[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]]
  - [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
  - [[../10-Architecture/state-machines/match]]
  - [[determinism-and-replay]]
  - [[match-engine-simulation-model]]
  - [[match-engine-runtime-strategy]]
  - [[swappable-spatial-event-match-engine-2026-05-27]]
---

# ADR re-audit — Cluster C3 (Match Engine / Simulation / Presentation)

Read-only audit of the 11 cluster-C3 ADRs (match engine & determinism, renderer
abstraction, frame contract, 3D/Babylon, spectator streaming, in-match control)
against the current vault, the binding ground-truth (offline-first PWA ADR-0002,
LLM out of authoritative state ADR-0030, narrow cloud-sync ADR-0090) and current
external best practice. **Propose only — Nico ratifies. Nothing here is accepted.**

External lookups this pass (targeted, weakest decisions only):
- Cross-runtime deterministic simulation (Rust-native vs Rust→WASM byte-equality)
  — Perplexity 2026-06-08 (sources: s2.dev DST, polarsignals DST-Rust,
  wasmtime deterministic-execution docs, "non-determinism in rust-wasm build").
- Latest stable renderer versions — npm 2026-06-08: **Babylon.js `@babylonjs/core`
  9.11.0**, **Three.js 0.184.0**.

---

## 1. Per-ADR verdicts

### ADR-0003 — Match Engine Architecture · verdict: **silently-superseded (partly stale)**

`superseded_by: ADR-0049` in frontmatter and an in-file "no longer the proposed
planning target" banner; Decision-Log row 33 agrees. So supersession is *not*
silent in the strict sense — it is declared. The problem is **content that is still
treated as live** by downstream ADRs even though the parent is superseded:

- **RNG-count drift (ubiquitous-language).** §1 says "**8 named RNG streams**"
  (line 55). The grounding research [[determinism-and-replay]] §2.2 says
  "**Named streams (locked set: 9)**", and every newer ADR (0008, 0018, 0086,
  0087, 0088) cites "**locked-9**". ADR-0003 is the doc implementers reach for as
  "the engine architecture", so the stale "8" is an active hazard.
- **Substrate drift.** §5 pins `match_event` in a "per-save **Postgres** schema"
  with typed Drizzle rows — but ADR-0049 made MVP match authority a
  runtime-neutral **server-side** engine emitting an event/spatial log, and
  ADR-0090 + the offline-first frame mean the local store is Dexie/IndexedDB, not
  Postgres-on-device. ADR-0003's storage section is now only half-true.
- **Live-only carry-forward is ambiguous.** The banner says "keep this ADR for
  rules explicitly carried forward by ADR-0049", but never enumerates *which*
  rules. ADR-0067 still cites ADR-0003 as a live source (`related`), so the
  carry-forward set is load-bearing yet undefined.

**Confidence:** high. **Recommendation:** do **not** edit ADR-0003. The carry-forward
ambiguity + RNG-count drift are best resolved when ADR-0049 is ratified: that
superseding ADR should contain an explicit "**rules carried forward from
ADR-0003**" appendix (the public-API determinism guarantee, the integer-bp
branching rule, the worker-forbidden-API rule, the engine-version pinning rule)
and restate **9** streams. Until then, treat ADR-0003 §1/§5 as historical.

### ADR-0049 — Swappable Spatial-Event Match Engine · verdict: **weak (open spike, unbounded determinism risk)**

The *boundary* design is sound and future-open (a versioned `MatchEnginePort`,
`MatchInput`/`MatchEventLog`/`SpatialSample`/`ReplayRecord`, "no consumer imports
engine internals"). This is the right shape and correctly decouples renderer/LLM/
persistence from the engine. Three issues weaken it:

1. **"Rust-native authoritative, Rust/WASM browser replay/sandbox" is the highest
   determinism risk in the cluster and is under-specified.** §"Offline and Realtime
   Boundaries" + §"Determinism" promise byte-stable replay across "TypeScript,
   Rust native and any future WASM build" but only say "fixed-point or explicitly
   quantized numeric surfaces **where cross-runtime equality matters**". External
   best practice (Perplexity 2026-06-08; wasmtime deterministic-exec docs;
   polarsignals DST-Rust) is blunt: native↔WASM float equality is **not**
   guaranteed (compiler reordering, FMA/fused ops, libm differences,
   denormals, non-associativity), and teams who need bit-identical replay across
   environments **either go fixed-point/integer-only OR run one runtime (WASM)
   everywhere**. A "Rust-native server + Rust→WASM browser replay" split is
   realistic *only* if the numeric surface is integer/fixed-point end-to-end — which
   ADR-0049 leaves as a soft "where it matters", not a hard rule. For an
   **offline-first** product whose *whole point* is that the client can re-derive
   and verify match facts, this is a load-bearing gap.
2. **Two determinism regimes coexist without a precedence rule.** ADR-0003/0026/0067
   are an *integer-bp, byte-identical event log, resim-from-kickoff* world. ADR-0049
   introduces "statistical regression tests protect balance **where exact event
   equality is intentionally versioned**" and "outcome-first generation for
   background-fast". When does byte-equality apply vs statistical-envelope-only?
   The accepted ADR-0026 Verification ("same seeds → same log → same frame
   sequence") assumes byte-equality unconditionally; ADR-0049 quietly relaxes it
   for some profiles. The seam between "exact" and "versioned/statistical" is the
   thing that needs pinning before any spike.
3. **Spike has no decision deadline / owner / fallback-if-inconclusive.** "Default
   after the spike: Rust native… unless TypeScript clearly wins" is a good gate,
   but there is no recorded who/when, and no statement of what MVP ships *if the
   spike is inconclusive* — risky for a no-code-yet project where the engine is on
   the critical path.

**Confidence:** high on the determinism gap; medium on the rest.
**Recommendation (fix as a superseding/clarifying ADR, 2-3 options for Nico):**
- **(A, recommended) Pin "integer/fixed-point numeric surface is mandatory for all
  replay-bearing computation" as a hard invariant, and keep the Rust-native-default
  spike** — fixed-point removes the native↔WASM divergence class, making the
  authoritative/replay split safe. Add a precedence rule: byte-identical event log
  for `competitive-full`/`interactive-standard`; statistical-envelope-only is
  permitted *only* for `background-fast` and must stay distribution-compatible.
- **(B) Single-runtime: author the engine in Rust→WASM and run the SAME WASM module
  server-side (wasmtime) and client-side.** Strongest bit-identical-replay story
  (one binary, one numeric behaviour), best fit for offline-first verify-locally;
  cost is server-side WASM hosting + slightly lower native peak throughput.
- **(C) Keep TypeScript as the authoritative MVP runtime, treat Rust as a profiled
  future swap behind the same port.** Lowest risk to ship, defers the cross-runtime
  determinism problem until there is real benchmark evidence; loses early Rust
  headroom. (Note: Memory — Nico's standing lean toward bounded seeded variance is
  about *gameplay* RNG, not numeric runtime equality; it does not resolve this.)

### ADR-0067 — Set-piece variant selection determinism · verdict: **sound**

`accepted`/`binding: true`, ratified Nico 2026-06-02 (D1–D3 = A). Selection is a
pure function; `(priority DESC, variantId ASC)` total order; `defaultVariantId`
fallback makes selection total; `deadBallIndex` **derived** by folding the event
log (no persisted counter — consistent with ADR-0026 rule 4 resim-from-kickoff);
`seeded-mix` draws only from `MatchCoreRng(matchId)` sub-label
`setpiece:<side>:<type>:<deadBallIndex>` (ADR-0018 §3 isolation). 8 checkable
invariants (S1–S8) + golden-replay verification. The one self-noted constraint
(sub-label semantics must be **versioned** so a future change to "what counts as a
dead-ball of a type" doesn't silently shift old `seeded-mix` replays) is correctly
flagged. **Issue:** it is `accepted` while its parents ADR-0026/ADR-0003 are still
`draft` in the current reopened-phase — see cross-ADR issue X1. **Confidence:**
high. **Recommendation:** keep as-is; carry the "versioned dead-ball semantics"
constraint forward into whatever ADR finalises the engine numeric surface
(ADR-0049 successor).

### ADR-0024 — Match Renderer Abstraction · verdict: **sound (with one resolved-but-unpinned UX fork)**

`binding: true`, accepted 2026-05-19, cleanly amended three times without in-place
rewrites (ADR-0026 frame-snapshot wording, ADR-0041 PixiJS-removal, ADR-0072
control-seam + main-thread Canvas-2D). The renderer-agnostic `MatchRenderer` over
ephemeral `MatchFrame` is the correct future-open seam; "GSAP tweens *state values*,
not draw calls" is a clean invariant. **Issue:** the ADR text still describes the
*draw* seam only; the *control* seam now lives in ADR-0072 and the chain
ADR-0024→0072→0087 is only navigable via the cross-link banner, not a single
contract list — fine for now but a discoverability cost. **Confidence:** high.
**Recommendation:** no change; ensure the eventual "current"-promotion of ADR-0072
adds the control-seam note in-PR as ADR-0072 already specifies.

### ADR-0026 — Match Frame Contract · verdict: **sound**

`binding: true`. The strongest ADR in the cluster: ten rules that decisively
resolve every engine↔renderer fork (neutral leaf `packages/match-contract`;
engine = canonical integer-mm, single `normalizePoint()` conversion; total
`toMatchEventKind()` with `"chance"` removed/`"save"` added and an exhaustive
compile-time switch; `MatchFrame` derived-never-persisted; batching/frame-cadence
decoupled; locked interpolation ownership; immutable frames; quality-profile render
scope; non-determinism-bearing version string). Human-decision forks HF-1/HF-2 are
**flagged, not silently decided** — exemplary. The 2026-05-27 context note correctly
re-points the producer to ADR-0049's runtime-neutral log. **One latent coupling:**
rule 9 names the four quality profiles (`competitive-full`, `interactive-standard`,
`background-detailed`, `background-fast`) — these must stay in lockstep with
ADR-0049's profile set and `match.md` (`competitive_full | … | background_fast`).
They currently agree (verified) but live in three places — see X3. **Confidence:**
high. **Recommendation:** keep; treat the profile enum as a shared vocabulary owned
by one source (engine port) to prevent future drift.

### ADR-0029 — 3D Presentation Layer · verdict: **stale-at-the-edges (correctly amended, but framework prose is now wrong if read alone)**

`binding: true`. The core decision — "no 3D" is scoped to *live match render only*;
a presentation-only 3D layer (stadium/campus, cutscenes, backdrops) is permitted
behind a hard `SceneDescriptor`/`CapabilityGate` boundary with mandatory 2D
fallback + iOS context-loss recovery — is sound and well-bounded for an offline-first
PWA. **Issue:** §2 still adopts "**Three.js + React Three Fiber**" as canonical; that
is superseded by ADR-0047 (Babylon), flagged only by a banner. A reader who lands on
§2/§Rationale (which argues *for* R3F over Babylon on bundle size) without the banner
gets the inverted conclusion. This is the classic "amend-by-banner leaves the body
self-contradictory" hazard. **Confidence:** high. **Recommendation:** do not edit;
when the presentation ADRs are promoted out of `draft`, fold ADR-0029 §2/§Rationale
+ ADR-0041 + ADR-0047 into **one consolidated presentation-renderer ADR** so the
body matches the decision (see proposedDecisions).

### ADR-0041 — Two-Renderer Presentation Strategy · verdict: **sound (but now a two-hop indirection)**

`binding: true`. The "exactly two renderer technologies" guardrail (Canvas-2D for
match/2D, one optional 3D stack; no PixiJS/PlayCanvas; no engine portfolio) is a
genuinely good anti-churn decision and the guardrails are crisp. **Issue:** its own
Decision body names Three.js/R3F as "the only planned optional 3D stack", then is
amended to Babylon by ADR-0047 — so both ADR-0029 and ADR-0041 now say R3F in body
and Babylon in banner. The guardrail "no Babylon without a superseding ADR" was
*satisfied* by ADR-0047, which is correct process, but leaves two ADRs whose prose
contradicts the live decision. **Confidence:** high. **Recommendation:** consolidate
(same proposed ADR as ADR-0029); no in-place edit.

### ADR-0047 — Babylon.js as 3D / Isometric Presentation Engine · verdict: **sound (version current; one process caveat)**

`binding: false`, `draft`, `amends ADR-0029 §2 + ADR-0041`. The decision is minimal
and correct: swap the engine *behind the unchanged seam*, contract/fallback/budgets
reused, match render stays Canvas-2D. Engine choice is **not stale**: ADR-0029 cites
"Babylon.js 9.0"; latest stable is **`@babylonjs/core` 9.11.0** (npm 2026-06-08), so
the major is current. **Issues:** (1) the larger Babylon bundle vs the R3F bundle
budgets that ADR-0029 §5 codified (≤200 KB initial / ≤700 KB session, ~168 KB R3F
base) are flagged but **not re-validated** — the budget numbers in ADR-0029 were
computed for R3F and are now nominal. (2) It is a *decision* recorded from Nico's own
tests ("Nico's tests confirmed the fit") with no in-vault measurement artifact —
acceptable for a no-code phase but the perf re-validation is real debt. **Confidence:**
medium. **Recommendation:** keep; when promoted, pin a Babylon-specific lazy-load +
Floor-tier-2D-fallback bundle budget (re-derive from `performance-budgets`), and
record the device on which Nico's fit-test ran.

### ADR-0015 — Spectator Snapshot Streaming · verdict: **stale (vocabulary + status drift; predates the frame-contract world)**

`proposed`/`binding: false`, last substantive content 2026-05-16, banner-patched
2026-05-19. Two real problems:

1. **Status drift.** The file says `Status: Proposed`; the **Decision-Log row 132**
   files it as "**Post-MVP social layer / keep behind watch-party gate**" — a
   different lifecycle label. A reader can't tell if it's an open proposal or a
   parked-post-MVP decision.
2. **Vocabulary predates ADR-0026.** It is built on "**snapshot per virtual minute
   plus per-event frames**", "**snapshot + event log persisted to the match
   record**", and a spectator service that reads "**snapshots**". But ADR-0026
   (binding) + [[determinism-and-replay]] §3 made **resim-from-kickoff the only
   replay model with NO persisted snapshots**, and `MatchFrame` is
   derived-never-persisted. ADR-0015's "persist snapshots" implementation section
   now contradicts the binding determinism contract. The 2026-05-19 banner patches
   *transport* (SSE/Centrifugo) and *frames* (typed ADR-0024 frames) but does **not**
   reconcile the "persist a snapshot stream" model with "no persisted snapshots".
   Notably [[determinism-and-replay]] §"Spectator joining mid-match" already
   describes the *correct* model (server replays the committed **event log** from
   kickoff, streams new events) — which is what ADR-0015 should say.
3. **Offline-first framing absent.** It assumes a server spectator service + Redis
   pub/sub as the model; given ADR-0090's narrow cloud-sync scope, the watch-party/
   spectator feature's local-first vs server-required boundary is undefined here.

**Confidence:** high. **Recommendation:** supersede with a new draft ADR that
re-expresses spectator/watch-party streaming in **event-log terms** (no persisted
snapshots; spectator service consumes the committed event/spatial log + replay
cursor per ADR-0049's "replay cursors", delay applied at delivery), aligns status
with the Decision-Log lifecycle, and states the offline-first boundary
(spectating/watch-party is an online-only social feature within ADR-0090's scope).
ADR-0087 already *depends* on a coherent spectator model (`related: ADR-0015`), so
this cleanup also de-risks G24's pause-vote streaming.

### ADR-0072 — In-Match Control Seam & Intervention Determinism · verdict: **sound**

`proposed`/`binding: false`, D1–D4 chosen live by Nico (A/A/A/A). The control-seam
contract is clean and replay-safe: typed `InterventionCommand` over the ADR-0008
Comlink control-plane (separate from the high-freq event stream); execution point
computed **purely from sim state** (light → next tick, heavy → next semantic
boundary); tactics = immutable `TacticSnapshot` swapped atomically; pause =
operational FSM flag outside the seeded stream; speed = ticks-per-wall-second with
fixed Δt. 9 invariants (C1–C9). The **deferred-measurement** honesty (no renderer
exists to measure; the Canvas-2D perf protocol is ratified, on-device numbers are a
tracked follow-up) is exactly the right posture for the no-code phase. **Minor:** it
amends ADR-0024/0041 via notes only (correct), and explicitly hands the buffer FSM +
pause-vote to ADR-0087 — clean scoping. **Confidence:** high. **Recommendation:**
keep; promote together with ADR-0087.

### ADR-0087 — Live-match Intervention Buffer + Pause-Vote · verdict: **sound**

`proposed`/`binding: false`, D1–D4 = A/A/A/A. Correctly **extends** (not re-opens)
ADR-0072. Clean DDD split: Match owns a deterministic `InterventionBufferPolicy`
value object (per-point + per-type caps, total order `(boundaryIndex, commandId)`,
typed replay-safe `InterventionRejected`); Watch Party owns the deliberate
pause-vote **process manager/saga** (hybrid veto/quorum, per-manager/half budget,
cooldown, max-duration, mandatory auto-resume); they coordinate **event-only** via
`PauseMatch`/`ResumeMatch` ↔ `MatchPaused`/`MatchResumed` through an ACL. The
"saga holds all wall-clock and is *deliberately not* bit-reproducible; only Match is"
distinction (PV1/PV7, IB1/IB5) is the right determinism boundary and is well argued.
14 invariants (IB1–IB7, PV1–PV7). Pause "Design 1" (suspend sim, acceptance point
doesn't move) is correctly chosen over presentation-only pause. **Issues:** (1) it
cites "**ADR-0018 / determinism-and-replay — locked-9 RNG streams**" — correct, which
*re-confirms* ADR-0003's "8" is the stale outlier (X2). (2) It `related`-links
ADR-0015 (spectator streaming) whose model is stale (see ADR-0015) — its pause/resume
streaming assumes a coherent spectator feed that ADR-0015 doesn't currently provide
in event-log terms. **Confidence:** high. **Recommendation:** keep; sequence its
ratification *after* (or with) an ADR-0015 cleanup so the watch-party streaming
substrate it leans on is coherent.

---

## 2. Cross-ADR issues (within C3)

- **X1 — accepted-on-draft layering.** ADR-0067 is `accepted`/`binding` while its
  parents ADR-0026 and ADR-0003 are `draft` in the reopened-phase, and ADR-0026's
  own appendix says the set-piece amendment is "accepted". Mixed lifecycle labels in
  one dependency chain make "what is actually binding right now" ambiguous. Not a
  contradiction in content — a governance/status-coherence gap. Resolve at the
  cluster promotion gate (promote the engine/frame/set-piece chain together).
- **X2 — RNG stream-count drift (ubiquitous language).** ADR-0003 §1 = "**8** named
  RNG streams"; [[determinism-and-replay]] §2.2 + ADR-0008/0018/0086/0087/0088 =
  "**locked-9**". The canonical number is 9 (research doc shows `GeneratorRng` added
  as stream #9). ADR-0003 is the stale outlier and the most-read engine doc. Fix via
  the ADR-0049-successor carry-forward appendix (restate 9), never by editing 0003.
- **X3 — quality-profile enum lives in three places.** ADR-0026 rule 9, ADR-0049
  spatial-semantics, and `match.md` each name the four profiles
  (`competitive-full`/`interactive-standard`/`background-detailed`/`background-fast`,
  with `match.md` using snake_case in the CHECK constraint). They currently agree,
  but no single doc owns the vocabulary → drift risk as profiles evolve (cf. FMX-92
  background-fast work). Recommend the engine port (`EngineCapabilities`) be the
  single source and others reference it.
- **X4 — presentation-renderer prose vs decision (R3F→Babylon).** ADR-0029 §2 and
  ADR-0041 Decision both still *say* Three.js/R3F in the body while ADR-0047 made
  Babylon the live choice via banner-amendment. Three binding/draft ADRs whose
  bodies disagree with the ratified engine = a consolidation candidate, not three
  more banners.
- **X5 — spectator/watch-party streaming substrate is stale under three live
  consumers.** ADR-0015's "persist snapshot stream" predates ADR-0026's
  no-persisted-snapshots rule, yet ADR-0087 (pause-vote streaming), the watch-party
  state machine, and ADR-0049's "replay cursors" all assume a coherent spectator
  feed. The mismatch is currently masked because nothing is implemented; it becomes a
  real contradiction the moment watch-party is built.
- **X6 — determinism precedence rule is unstated cluster-wide.** ADR-0026/0067 assume
  unconditional byte-equality; ADR-0049 introduces "statistical-envelope where event
  equality is intentionally versioned" + "outcome-first for background-fast". No ADR
  states *which* regime applies *per quality profile*. This is the single missing
  invariant that ties the whole engine/frame/determinism cluster together.

---

## 3. Confidence summary

| ADR | Verdict | Confidence |
|---|---|---|
| 0003 | silently-superseded / stale content | high |
| 0049 | weak (determinism gap + open spike) | high |
| 0067 | sound | high |
| 0024 | sound | high |
| 0026 | sound | high |
| 0029 | stale-at-edges (R3F prose) | high |
| 0041 | sound (two-hop indirection) | high |
| 0047 | sound (version current; budget debt) | medium |
| 0015 | stale (snapshot model + status drift) | high |
| 0072 | sound | high |
| 0087 | sound | high |

## 4. Sources

- [[determinism-and-replay]] §2.2 (locked-9 streams), §3 (resim-from-kickoff, no
  persisted snapshots), §"spectator joining mid-match" (event-log replay model).
- [[match-engine-simulation-model]], [[match-engine-runtime-strategy]],
  [[swappable-spatial-event-match-engine-2026-05-27]].
- [[../10-Architecture/state-machines/match]] (quality_profile CHECK; intervention
  boundaries).
- [[../00-Index/Decision-Log]] rows 33/34/47/49/52/54/56/75/80/95/132.
- Perplexity 2026-06-08 — cross-runtime deterministic simulation (Rust native vs
  Rust→WASM): float non-determinism (compiler reordering, FMA, libm, denormals,
  non-associativity); fixed-point/integer is the accepted equality guarantee;
  single-WASM-everywhere is the lower-risk bit-identical-replay design. Sources:
  s2.dev/blog/dst, polarsignals DST-Rust, docs.wasmtime.dev deterministic-wasm,
  dev.to "non-determinism in rust-wasm build".
- npm 2026-06-08 — `@babylonjs/core` 9.11.0 (latest stable); `three` 0.184.0.
