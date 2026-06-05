---
title: ADR-0082 Manager Style-Signal & Run-Analysis Contract (MVP hooks)
status: proposed
tags: [adr, architecture, manager, legacy, roguelite, meta, signals, run-analysis, determinism, fmx-93]
created: 2026-06-05
updated: 2026-06-05
type: adr
binding: false
supersedes:
superseded_by:
related:
  - [[ADR-0051-manager-and-legacy-context]]
  - [[ADR-0074-tactical-identity-fingerprint-aggregation]]
  - [[ADR-0055-tactics-context]]
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0071-ai-world-simulation-context-and-drift-contract]]
  - [[ADR-0079-dynasty-board-ownership-and-bankruptcy]]
  - [[../bounded-context-map]]
  - [[../../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]]
  - [[../../60-Research/manager-archetype-mvp-hooks-and-perk-prestige-2026-06-05]]
  - [[../../60-Research/raw-perplexity/raw-roguelite-metaprogression-taxonomy-2026-06-05]]
  - [[../../60-Research/raw-perplexity/raw-manager-identity-offpitch-games-2026-06-05]]
  - [[../../60-Research/raw-perplexity/raw-confidence-surfacing-and-start-perk-balance-2026-06-05]]
  - [[../../60-Research/tactical-identity-fingerprint-2026-06-03]]
  - [[../../60-Research/manager-archetype-roguelite-2026-05-27]]
---

# ADR-0082: Manager Style-Signal & Run-Analysis Contract (MVP hooks)

## Status

proposed

> **`proposed` / `binding: false`.** Decisions D1–D4 were put to Nico live on 2026-06-05 (ask-first
> gate) and chosen below; authored `proposed` per the never-self-accept rule — Nico ratifies (merge).
> This ADR **does not re-open** the accepted [[ADR-0051-manager-and-legacy-context]] (ownership,
> context boundary, determinism rule) or [[ADR-0074-tactical-identity-fingerprint-aggregation]] (the
> tactical signal algorithm); it **consumes** both and adds the missing **non-tactical signal schema,
> the assembled `RunAnalysisSnapshot` contract, the player-facing confidence surface, the
> start-finance perk policy and the `PostRunReflection` MVP shape**. It is the resolution of gap **G3**
> (FMX-93) and the architectural half of the GD-0019 confirming revision. It **names no archetypes**.
> ADR-0051 gains a one-line additive "Related" pointer (no rewrite).

## Date

- Proposed: 2026-06-05 (FMX-93; D1–D4 chosen live by Nico)

## Context

[[../../50-Game-Design/GD-0019-manager-archetype-roguelite-progression|GD-0019]] (draft) fixes the
roguelite progression direction as **"MVP ships hooks, not the full meta system"**: capture run-end
facts → derive provisional `ManagerStyleSignals` → show a `PostRunReflection` → store for Manager &
Legacy. It deliberately **defers** the archetype taxonomy, perk caps and prestige ladder to post-MVP
playtest clustering (Gap **G3**), and previously left "exact signal schema and confidence model" open.

Two binding/prior decisions already cover part of the surface:

- [[ADR-0051-manager-and-legacy-context]] (accepted/binding) **owns** run-analysis snapshots, style
  signals, archetype candidates, legacy and prestige; lists draft commands/events/read-models
  (`RecordRunAnalysisSnapshot`, `ManagerStyleSignalsUpdated`, `PostRunReflection`, …) and the
  **determinism rule**: *a running save must never read mutable cross-save meta after creation;
  cross-save config is copied into the save snapshot at creation* (GD-0019's "D8" shorthand). It does
  **not** join across context tables — it stores analysis snapshots, not alternate truth.
- [[ADR-0074-tactical-identity-fingerprint-aggregation]] (proposed, FMX-68) pins the **tactical**
  signal end-to-end: five sub-signals (possession, pressing, risk, adaptation, set-piece), EWMA(h=15),
  empirical-Bayes confidence, a Tactics-owned `TacticalIdentityFingerprint` projection read **once at
  `RogueliteRunEnded`** into Manager & Legacy's `RunAnalysisSnapshot`. **Raw signals + confidence
  only — no archetype names.**

What is still undefined — and what FMX-93 pins — is: (a) the **five non-tactical** signal categories
GD-0019 names (youth, transfer, finance, club-building, resilience) as a concrete coarse-signal schema
with confidence; (b) the **assembled `RunAnalysisSnapshot`** envelope with per-domain source-fact
attribution; (c) how confidence is **surfaced to the player**; (d) the **start-finance perk policy**
(a GD-0019 Open item); (e) whether `PostRunReflection` is MVP-mandatory. Grounded in
[[../../60-Research/manager-archetype-mvp-hooks-and-perk-prestige-2026-06-05]] (+ three raw captures:
roguelite meta-progression/taxonomy, manager identity in games + real world, confidence-UX + start-perk
balance).

**Scope (this ADR):** the five non-tactical `CoarseStyleSignal` definitions + lightweight confidence;
the `ManagerStyleSignals` aggregate (tactical fingerprint + the five coarse signals); the
`RunAnalysisSnapshot` envelope + owning-domain→fact map; the 3-band player-facing confidence surface +
tier disclosure; the start-finance perk policy; the minimal `PostRunReflection`; determinism
invariants. **Out of scope:** archetype names/taxonomy & clustering (G3 — deferred), the tactical
algorithm (ADR-0074), perk catalogue / perk caps / prestige-ladder shape (post-MVP, Nico-gated),
calibration baselines (FMX-52), full retrospective/Expert analytics UI.

## Decision options

### D1 — MVP scope boundary

| Option | Description | Trade-off |
|---|---|---|
| **A. Confirm hooks-only, defer taxonomy** | MVP = run-end facts + provisional `ManagerStyleSignals` + `PostRunReflection`; archetype names, perk caps, prestige ladder stay post-MVP & Nico-gated. Note: post-MVP taxonomy is **authored then clustering-validated**, not pure data-mining. | **Chosen by Nico.** Matches GD-0019 "Decided/strong"; research-best-practice for a first-playable; protects E5 consumers from hard-coding a taxonomy. |
| B. Hooks-only + provisional V1 taxonomy sketch | Also author a non-binding candidate archetype list now. | Overfits the first design guess — the GD-0019 change-policy anti-pattern. |
| C. Expand MVP to include perks | Pull perk/prestige selection into first playable. | Contradicts GD-0019 + the prestige-counterweight principle; bloats the first playable. |

### D2 — Non-tactical signal & confidence model

| Option | Description | Trade-off |
|---|---|---|
| **A. Coarse signals + banded surface** | Five non-tactical categories as normalised coarse signals with a *lightweight sample-based* confidence flag; player sees 3 bands (Provisional / Emerging / Established); numerics only in the Expert UI tier. | **Chosen by Nico.** Fits season-level counts/rates; FM scout-range / NN-g uncertainty-UX best practice; cheap and explainable. |
| B. Uniform empirical-Bayes for all six dimensions | Apply ADR-0074's full empirical-Bayes+familiarity model to every category. | Heavier; per-match behavioural variance/familiarity is meaningless for season-level counts like academy promotions. |
| C. Raw counts only, no confidence | Store raw facts for the five categories, no confidence in MVP. | Reflection can't express "we're not sure yet"; degrades the payoff. |

### D3 — Start-finance perk policy

| Option | Description | Trade-off |
|---|---|---|
| **A. None in MVP; future = prestige-gated + capped** | No soft perk affects starting finance in MVP; any future one requires prestige unlock + hard cap + challenge counterweight + a fresh Nico decision. | **Chosen by Nico.** Resolves the GD-0019 Open item; research confirms starting-economy boosts collapse early tension and snowball. |
| B. Allow one small capped perk now | Permit a single hard-capped starting-finance boost behind a prestige gate. | More meta payoff, more balance risk at MVP. |
| C. Leave fully open | Keep it unresolved. | Blocks downstream balance/prestige planning. |

### D4 — Post-run reflection scope

| Option | Description | Trade-off |
|---|---|---|
| **A. Minimal but real** | MVP-mandatory `PostRunReflection`: short text of the 2–3 strongest signals + run outcome. | **Chosen by Nico.** Delivers GD-0019's "the manager learned something real" payoff; low cost. |
| B. Stub behind captured facts | Capture facts, no player-facing reflection in MVP. | First playable has no visible roguelite payoff. |
| C. Full retrospective screen | Build a richer multi-tab retrospective now. | More scope than hooks-only intends. |

### Ownership note (confirmed, not contested)

`RunAnalysisSnapshot` **assembly is owned by Manager & Legacy** (ADR-0051 already owns "run analysis
snapshots"; ADR-0074 already has it reading the fingerprint once at run-end). No separate roguelite
process-manager is introduced for MVP.

## Decision (chosen — Nico 2026-06-05)

**D1 = A, D2 = A, D3 = A, D4 = A.** Manager & Legacy owns `RunAnalysisSnapshot` assembly.

### 1. Non-tactical coarse signals (each → `value ∈ [0,1]`, season-level)

Five categories from GD-0019, each a **coarse, normalised** signal derived from already-published
domain facts at run-end (no cross-context joins; sources own the truth). Each combines a small fixed
set of sub-measures by a weighted average, normalised to [0,1] by a clipped-linear transform against
provisional baselines (calibration = FMX-52). Definitions are grounded in real-world/game analyst
vocabulary (see [[../../60-Research/raw-perplexity/raw-manager-identity-offpitch-games-2026-06-05]]).

| Signal (`dimension`) | Coarse measure (run-aggregated) | Owning source domain(s) → fact |
|---|---|---|
| **youth** | academy-promotion rate + U21 minutes share + youth player-growth delta | Squad & Player / Training → youth-promotion + player-growth summaries; Youth Academy `ProductivityCounter` (when present) |
| **transfer** | net-spend posture + resale-profit ratio + scouting reliance + wage discipline | Transfer → transfer profit/wage/scouting summaries |
| **finance** | cash-runway health + crisis-stage depth + budget-breach count + recovery actions | Club Management → economy snapshots + `InsolvencyStageChanged` |
| **clubBuilding** | investment emphasis across stadium / campus / fan / sponsor | Stadium Operations / Audience & Atmosphere (`FanPipelineQualityUpdated`) / CommercialPortfolio (`CommercialKpiBoard`) |
| **resilience** | crisis recoveries + promotion attempts + run length + end reason | League Orchestration `RogueliteRunEnded` + Club Management crisis facts |

These are **coarse style signals, not classes**. No archetype name is assigned (G3 deferral).

### 2. Lightweight confidence (per non-tactical signal)

Confidence is a **sample-based** scalar mapped to a 3-band label — deliberately lighter than ADR-0074's
empirical-Bayes (these are season-level counts, not noisy per-match series):

```
n          = number of contributing run-periods/events for the signal
w_coarse   = n / (n + k_band)              # confidence ∈ [0,1]; k_band provisional (FMX-52)
band       = 'provisional'  if w_coarse < t1       # default t1 = 0.33
           | 'emerging'     if t1 ≤ w_coarse < t2  # default t2 = 0.66
           | 'established'  otherwise
```

`k_band`, `t1`, `t2` are **provisional calibration constants (FMX-52)**, versioned behind
`signalModelVersion`. The tactical signal keeps ADR-0074's empirical-Bayes `confidence` (mapped to the
same three bands for a consistent surface).

### 3. Player-facing confidence surface (progressive disclosure)

| UI tier | What is shown |
|---|---|
| Quick / Standard | The 3-band label only (**Provisional / Emerging / Established**) + the coarse value as a qualitative phrase. No raw numbers. |
| Expert | The numeric `value`, `confidence` (and tactical `estimate`/`sampleSize` from ADR-0074), plus the band. |

(FM scout-range / knowledge-bar pattern; NN-g uncertainty-UX guidance — see
[[../../60-Research/raw-perplexity/raw-confidence-surfacing-and-start-perk-balance-2026-06-05]].)

### 4. Contract appendix (TS/Zod-describable; no cross-context joins)

```ts
type SignalConfidenceBand = 'provisional' | 'emerging' | 'established';

// One coarse non-tactical style signal (raw, run-aggregated) + its confidence. NO archetype name.
CoarseStyleSignal = {
  dimension: 'youth' | 'transfer' | 'finance' | 'clubBuilding' | 'resilience',
  value: number,                  // 0..1, normalised coarse measure
  sampleSize: number,             // n contributing run-periods/events
  confidence: number,             // w_coarse, 0..1 (Expert tier only)
  confidenceBand: SignalConfidenceBand,
  provisional: boolean            // confidenceBand === 'provisional'
};

// The full provisional style-signal set assembled at run-end. Tactical signals are CONSUMED from
// ADR-0074's TacticalIdentityFingerprint (read once); non-tactical are the five above.
ManagerStyleSignals = {
  saveId: SaveId,
  runId: RunId,
  tactical: StyleSignal[],        // exactly the five ADR-0074 dimensions (consumed, not recomputed)
  nonTactical: CoarseStyleSignal[], // exactly the five dimensions above
  signalModelVersion: 'style-signals-v1'
  // NOTE: NO archetype field. Names are derived later (G3 / post-MVP playtest clustering).
};

// Manager & Legacy assembles this at RogueliteRunEnded from published facts only (no table joins).
RunAnalysisSnapshot = {
  saveId: SaveId,
  runId: RunId,
  endedAtSeq: number,             // monotonic run-end marker (determinism/version key)
  outcome: { endReason: string, finalSeason: number, /* outcome summary fields */ },
  styleSignals: ManagerStyleSignals,
  sourceFacts: RunSourceFactRef[], // owning-domain → fact attribution (per §1 table); event/read-model refs only
  snapshotVersion: 'run-analysis-v1'
};

// MVP-mandatory minimal reflection (read model). Text-only; outcome + top 2-3 signals.
PostRunReflection = {
  saveId: SaveId,
  runId: RunId,
  outcomeLine: string,            // e.g. "Relegated in season 4 after a cash-runway collapse."
  signalLines: string[],          // 2-3 phrases, e.g. "Leaned toward youth development and conservative finance."
  note: string                    // "These signals are saved for future Manager & Legacy progression."
};
```

Manager & Legacy emits `RunAnalysisRecorded` / `ManagerStyleSignalsUpdated` and exposes
`PostRunReflection` (ADR-0051 draft contracts). It performs **no cross-context joins** and never
re-reads mutable cross-save meta after legacy config is generated for the next save (ADR-0051).

### 5. Start-finance perk policy (ratified balance invariant)

**No soft perk affects starting finance in MVP.** Any future starting-finance perk requires *all* of:
(a) a **prestige unlock** gate, (b) a **hard cap**, (c) an explicit **challenge counterweight**, and
(d) a **fresh Nico decision** (GDDR/ADR). Direct start-money, prebuilt infrastructure and strong
starting squads are **not safe defaults** (GD-0019; research confirms they collapse early tension and
snowball).

## Invariants

| # | Invariant |
|---|---|
| **M1** | `ManagerStyleSignals` carries **raw signals + confidence only**; it names **no archetype** (G3 / FMX-93 deferral). |
| **M2** | `RunAnalysisSnapshot` is assembled by Manager & Legacy from **published events/read-models only** — no cross-context table joins; sources remain authoritative (no alternate truth). |
| **M3** | Tactical signals are **consumed** from ADR-0074's `TacticalIdentityFingerprint` (read once at `RogueliteRunEnded`), never recomputed here. |
| **M4** | A running save **never reads mutable cross-save meta** after creation; cross-save legacy/prestige config is copied into the save snapshot at creation only (ADR-0051 §Determinism). |
| **M5** | Snapshot assembly is a **pure deterministic projection** of committed facts ordered by `endedAtSeq`; it **declares no `*Rng` sub-label** (ADR-0018 §3) — it reads already-resolved facts. |
| **M6** | Each non-tactical signal lists a **named owning source domain + event/read-model** (§1); no signal stores authoritative data duplicating a source context. |
| **M7** | **No soft perk affects starting finance in MVP**; any future one is prestige-gated + hard-capped + counterweighted + a fresh Nico decision (§5). |
| **M8** | `PostRunReflection` is **MVP-mandatory** and **text-only** (outcome + top 2–3 signal phrases); it asserts no perk unlock. |
| **M9** | Calibration constants (`k_band`, `t1`, `t2`, coarse-signal baselines/weights) are versioned (`signalModelVersion`) and tunable via FMX-52 without changing the contract shape. |
| **M10** | Archetype names, perk caps, prestige-ladder shape and any start-finance cap are **post-MVP, Nico-gated**; downstream consumers (E5 archetype-resistance, E5-2/E6-3 prestige/HoF) reference **signals**, not a taxonomy. |

## Consequences

**Positive:** closes G3 by pinning the MVP boundary as a contract, so no epic hard-codes a taxonomy;
gives the five non-tactical categories concrete, fact-derivable coarse-signal definitions with a cheap
explainable confidence; reuses ADR-0074 for the tactical axis without duplication; the start-finance
perk policy and prestige-counterweight are now ratified balance invariants; `PostRunReflection`
delivers the GD-0019 payoff at minimal cost; cross-save determinism stays exactly ADR-0051's rule.

**Negative / constraints:** the five non-tactical coarse-signal baselines/weights and the band
thresholds (`k_band`, `t1`, `t2`) are provisional pending FMX-52 playtest tuning; some categories
(e.g. `clubBuilding`) depend on facts owned by contexts still `proposed` (Stadium Operations / Audience
& Atmosphere / CommercialPortfolio) — those inputs are **reserved hooks** until those ADRs ratify; the
archetype taxonomy, perk catalogue and prestige ladder remain explicitly deferred (G3, post-MVP).

## Amendment to ADR-0051 (additive cross-reference only)

[[ADR-0051-manager-and-legacy-context]] gains a one-line "Related Docs" pointer to this ADR (the
non-tactical signal + run-analysis contract that fills its draft `ManagerStyleSignals` /
`RunAnalysisSnapshot` / `PostRunReflection` surface). ADR-0051's decision, ownership, contract
direction and determinism rules are **unchanged** — no rewrite (vault-governance: never silently
rewrite an accepted ADR).

## Supersedes

None

## HITL gate

`proposed` / `binding: false`. D1–D4 chosen live by Nico 2026-06-05. Residual tuning (`k_band`, band
thresholds, coarse-signal normalisation baselines/weights, exact reflection copy) is **calibration
debt routed to FMX-52** and does not block ratification of the contract shape. Archetype taxonomy,
perk catalogue/caps, prestige-ladder shape and any future start-finance perk cap remain **post-MVP,
Nico-gated** decisions. Awaiting Nico ratify + merge; the ADR-0051 additive pointer applies in the
same PR.

## Related Docs

- [[../../60-Research/manager-archetype-mvp-hooks-and-perk-prestige-2026-06-05]] — FMX-93 synthesis (decision basis).
- [[../../60-Research/raw-perplexity/raw-roguelite-metaprogression-taxonomy-2026-06-05]] — meta-progression & taxonomy deferral.
- [[../../60-Research/raw-perplexity/raw-manager-identity-offpitch-games-2026-06-05]] — manager identity in games + real-world vocabulary.
- [[../../60-Research/raw-perplexity/raw-confidence-surfacing-and-start-perk-balance-2026-06-05]] — confidence-UX + start-perk balance.
- [[ADR-0051-manager-and-legacy-context]] — **owner/consumer**; this ADR fills its draft signal/snapshot/reflection surface.
- [[ADR-0074-tactical-identity-fingerprint-aggregation]] — the **tactical** signal (consumed here, not re-opened).
- [[ADR-0018-systemic-events-and-player-lifecycle]] — §3 RNG/determinism discipline (this projection declares no `*Rng`).
- [[../../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]] — the GDDR this ADR's contract serves; FMX-93 confirming revision.
- [[ADR-0071-ai-world-simulation-context-and-drift-contract]] · [[ADR-0079-dynasty-board-ownership-and-bankruptcy]] — E5 consumers: reference signals, not a taxonomy (M10).
