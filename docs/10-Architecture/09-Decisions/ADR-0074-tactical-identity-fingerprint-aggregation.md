---
title: ADR-0074 Tactical-Identity Fingerprint Aggregation Algorithm
status: accepted
tags: [adr, architecture, tactics, meta, match, fingerprint, ewma, bayes, determinism, fmx-68]
created: 2026-06-03
updated: 2026-06-11
type: adr
binding: false
supersedes:
superseded_by:
related:
  - [[ADR-0055-tactics-context]]
  - [[ADR-0051-manager-and-legacy-context]]
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0072-in-match-control-seam]]
  - [[ADR-0067-set-piece-variant-selection-determinism]]
  - [[ADR-0049-swappable-spatial-event-match-engine]]
  - [[ADR-0026-match-frame-contract]]
  - [[ADR-0027-postgres-data-model]]
  - [[../state-machines/match]]
  - [[../../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]]
  - [[../../50-Game-Design/GD-0025-in-match-controls]]
  - [[../../50-Game-Design/tactics-system]]
  - [[../../50-Game-Design/match-engine]]
  - [[../../60-Research/tactical-identity-fingerprint-2026-06-03]]
  - [[../../60-Research/raw-perplexity/raw-tactical-fingerprint-signals-2026-06-03]]
  - [[../../60-Research/raw-perplexity/raw-tactical-fingerprint-aggregation-2026-06-03]]
  - [[../../60-Research/raw-perplexity/raw-tactical-fingerprint-confidence-2026-06-03]]
  - [[../../60-Research/raw-perplexity/raw-tactical-fingerprint-games-2026-06-03]]
  - [[../../60-Research/domain-model-audit-and-backlog-2026-06-02]]
---

# ADR-0074: Tactical-Identity Fingerprint Aggregation Algorithm

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `proposed`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **History (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143):**
> **`proposed` / `binding: false`.** Decisions D1–D4 were put to Nico live on
> 2026-06-03 (ask-first gate) and chosen below; authored `proposed` per the
> never-self-accept rule — Nico ratifies (merge). This ADR **extends**
> [[ADR-0055-tactics-context]] (accepted/binding) with the missing *aggregation
> algorithm* for the `TacticalIdentityFingerprint` it already owns; it does **not**
> re-open ownership, the carrier names, or ADR-0055's determinism rules. It is the
> resolution of gap **G10** (FMX-68) and **blocks FMX-93** (archetype taxonomy, G3).

## Date

- Proposed: 2026-06-03 (FMX-68; D1–D4 chosen live by Nico)

## Context

ADR-0055 (Tactics, accepted/binding) already **owns** a `TacticalIdentityFingerprint`
projection and a `TacticalStyleSignalEmitted` event, "aggregating style signals
(possession, pressing, risk, adaptation, set-piece use) for Manager & Legacy
consumption" and states "style-signal aggregation runs as a deterministic projection
from published match events plus the locked `TacticSnapshot` … consumed by Manager &
Legacy at run-end … never re-read after the legacy configuration is generated for the
next save." ADR-0051 (Manager & Legacy, accepted) consumes it into a
`RunAnalysisSnapshot` and forbids reading mutable cross-save meta after creation.
[[../../50-Game-Design/GD-0019-manager-archetype-roguelite-progression|GD-0019]] names
the five signal categories but explicitly leaves **"exact signal schema and confidence
model"** open and forbids locking an archetype taxonomy (G3, post-MVP playtest).

What is undefined — and what FMX-68 must pin — is the **algorithm**: how each of the
five signals is measured from match facts and normalised, how per-match values
aggregate over a window with decay, and how a confidence value is derived for small
and large samples. The whole thing must be a deterministic projection so replays
reproduce identical fingerprints (ADR-0018 §3; ADR-0072 — tactics are immutable
`TacticSnapshot`s, and shouts are **not** tactical signals, GD-0025).

Grounded in [[../../60-Research/tactical-identity-fingerprint-2026-06-03]] (+ four raw
captures: real-world signal metrics, EWMA/decay, empirical-Bayes confidence, comparable
games — FM/EA FC/OOTP/EHM/NBA & motorsport sims).

**Scope (this ADR):** five signal definitions + normalisation, aggregation window +
decay, confidence model, the Tactics→Manager & Legacy consumption contract, determinism,
a worked example. **Out of scope:** archetype names/taxonomy & clustering (G3 / FMX-93),
perk/prestige balance, fingerprint UI, opposition-AI scouting, baseline calibration
(FMX-52). The spec emits **raw signals + confidence only — it names no archetypes.**

## Decision options

### D1 — Aggregation window & decay

| Option | Description | Trade-off |
|---|---|---|
| **A. EWMA, half-life ≈ 15 matches** | Per-signal exponentially-weighted moving average `ŝ_t = α·x_t + (1-α)·ŝ_{t-1}`, `α = 1 - 0.5^(1/15)`. | **Chosen by Nico.** Deterministic from an ordered match log; recency-weighted yet stable; h=15 sits between "form" (3–8) and "true talent" (15–40) — reacts within a half-season, remembers prior seasons. |
| B. EWMA + two-component | Add a fast h≈5 "form" EWMA alongside. | More expressive but doubles state/UI for little MVP gain; addable later non-breakingly. |
| C. Rolling SMA over last N | Average of last N matches. | Hard-cutoff discontinuity, equal weights, unstable early-season. |
| D. Per-season average | One average per season. | No in-season recency; hard seasonal boundary; poor cross-season dynasty fit. |

### D2 — Confidence model

| Option | Description | Trade-off |
|---|---|---|
| **A. Empirical-Bayes + familiarity** | `k_eff = k₀·clamp(s/s_ref)·(1/f)`, `f = 1-α_fam(1-F)`, `w = n/(n+k_eff)`; confidence = w; shrink to league prior μ₀. | **Chosen by Nico.** Combines sample size, behavioural variance AND tactical familiarity F (already tracked by Tactics); deterministic, explainable; subsumes B as a special case. |
| B. Sample-count `n/(n+k)` | Confidence purely from match count. | Simple but ignores variability — chaotic and metronomic managers score identically. |
| C. Variance-based (SE) | `confidence = exp(-SE²/σ_ref²)`. | Uses size+noise but no regression to a prior; σ_ref hand-tuned. |

### D3 — Carrier & cadence (Manager & Legacy consumption)

| Option | Description | Trade-off |
|---|---|---|
| **A. Per-match projection, read at run-end** | Tactics maintains the `TacticalIdentityFingerprint` projection (updated each match); Manager & Legacy takes ONE authoritative read at `RogueliteRunEnded` into the `RunAnalysisSnapshot`. | **Chosen by Nico.** Matches ADR-0051's snapshot-at-run-end / never-re-read rule exactly; `TacticalStyleSignalEmitted` becomes optional/UI-only. |
| B. Per-match emitted event | Manager & Legacy folds per-match events itself. | More traffic; pushes aggregation into the consumer, duplicating the projection. |
| C. Both, run-end authoritative | Keep event (future live UI/scouting) + projection; run-end snapshot is source of truth. | Most flexible, most surface to specify for MVP. |

### D4 — Deliverable home

| Option | Description | Trade-off |
|---|---|---|
| **A. New ADR-0074 extending ADR-0055** | Author here (proposed); add a one-line additive "Related" pointer in ADR-0055. | **Chosen by Nico.** Keeps the accepted ADR-0055 intact, follows numbering discipline, independently supersedable. |
| B. Inline appendix in ADR-0055 | Add the algorithm inside ADR-0055. | Single file, but mutates an accepted/binding ADR; harder to version. |

## Decision (chosen — Nico 2026-06-03)

**D1 = A, D2 = A, D3 = A, D4 = A.**

### 1. Per-match signal definitions (each → `x_t ∈ [0,1]`)

All signals are pure functions of the committed match event log (already ordered and
seeded at `lineup_locked`) plus the locked `TacticSnapshot`. Each is normalised to
[0,1] by a **clipped linear transform** against provisional league baselines
(calibration is FMX-52). Within-signal sub-metrics combine as a fixed weighted average.
`clip(z) = min(max(z,0),1)`.

| Signal | Primary measure (per match) | Normalisation | Secondary (weight) |
|---|---|---|---|
| **possession** | action-based possession% `= passes_self/(passes_self+passes_opp)` | `clip((poss%−35)/(65−35))` | field-tilt `att3_self/(att3_self+att3_opp)`, `clip((ft−0.35)/0.30)` — blend 0.7/0.3 |
| **pressing** | PPDA `= oppPasses_pressZone / ownDefActions_pressZone` (opp half) | inverted `clip((18−PPDA)/(18−6))` | high-turnovers/90 in opp half, `clip(ht/8)` — blend 0.6/0.4 |
| **risk** | directness = vertical gain per pass (m toward goal) | `clip((vg−3)/(9−3))` | long-ball share `clip((lb−0.05)/0.20)`; shot-risk `clip((0.14−xGperShot)/0.07)` — blend 0.5/0.25/0.25 |
| **adaptation** | unforced in-match tactic/formation/mentality changes per match (from the ADR-0072 `InterventionCommand` log, excluding injury/red-card-forced) | `clip(changes/4)` | game-state responsiveness ΔPPDA(behind−level) sign+magnitude `clip((−Δ)/3)` — blend 0.6/0.4 |
| **set-piece** | set-piece xG share `= xG_setPiece/xG_total` (xG-based, not goals) | `clip((spShare−0.15)/(0.40−0.15))` | set-piece xG per match `clip(spxg/0.6)` — blend 0.7/0.3 |

Notes: shouts and operational pause/speed (ADR-0072) are excluded — they are not
tactical signals. `adaptation` is the weakest-defined axis (no canonical real-world
metric; ~20–30 matches to stabilise) and therefore carries a larger prior strength
(below) so its confidence rises slowly. Where xG is unavailable in an early prototype,
set-piece/risk sub-metrics fall back to shot-count proxies (documented per build).

### 2. Aggregation (per signal, EWMA, half-life 15)

```
α = 1 − 0.5^(1/H),   H = 15            # ⇒ α ≈ 0.04516
ŝ_1 = x_1                              # init from first match (or documented club/legacy prior)
ŝ_t = α·x_t + (1−α)·ŝ_{t−1}            # t ≥ 2; ordered by match
```

`ŝ_t` is the **recency-weighted identity value** for that signal. Deterministic and
reproducible from the ordered match list; initial-value influence decays `(1−α)^t`
(negligible after ~2 seasons). The first `2H ≈ 30` matches are flagged `provisional`.
On a manager change the default is to **carry** `ŝ` (visible gradual transition); a save
may instead **re-init** at the new manager's first match for "under this manager"
identity — the choice is recorded per save (deterministic either way).

### 3. Confidence (per signal, empirical-Bayes shrinkage)

Computed from the per-match normalised values `x_1..x_n` (stored cheaply — five floats
per match — so sample mean/sd are exact and deterministic; an EWMA-of-squared-deviation
is an allowed equivalent single-pass form).

```
x̄ = mean(x_1..x_n)                              # also available as ŝ (recency-weighted)
s  = sample sd(x_1..x_n)
v  = clamp(s / s_ref, 0.5, 2.0)                  # behavioural-variance inflation
f  = 1 − α_fam·(1 − F)                           # F ∈ [0,1] tactical familiarity (Tactics §10), α_fam = 0.5
k_eff = k₀ · v · (1/f)
w  = n / (n + k_eff)                             # CONFIDENCE ∈ [0,1]
θ̂  = w·ŝ + (1 − w)·μ₀                            # shrunk point estimate (uses EWMA ŝ as the data term)
```

Confidence rises with matches, falls with behavioural noise and with low familiarity;
the point estimate `θ̂` is pulled toward the league prior μ₀ when confidence is low.

**Provisional calibration constants (playtest-tunable — FMX-52, not ratified here):**
`H = 15`, `μ₀ = 0.5` per signal (or league-derived), `k₀ = 10` (⇒ confidence ≈ 0.5 at
n=10; `adaptation` uses `k₀ = 20`), `s_ref = 0.2`, `α_fam = 0.5`, variance clamp
[0.5, 2.0].

### 4. Consumption contract (TS/Zod-describable; no cross-context joins)

```ts
// One coarse style signal (raw, recency-weighted) + its confidence. NO archetype name.
StyleSignal = {
  dimension: 'possession' | 'pressing' | 'risk' | 'adaptation' | 'setPiece',
  value: number,        // ŝ — EWMA identity value, 0..1
  estimate: number,     // θ̂ — confidence-shrunk point estimate, 0..1
  confidence: number,   // w, 0..1
  sampleSize: number,   // n matches contributing
  provisional: boolean  // n < 2H
}

// Tactics-owned read-model projection (ADR-0055). Updated each match; authoritative
// read taken once by Manager & Legacy at run-end (ADR-0051) — never re-read after.
TacticalIdentityFingerprint = {
  saveId: SaveId,
  runId: RunId,
  asOfMatchSeq: number,        // monotonic; determinism/version key
  signals: StyleSignal[],      // exactly the five dimensions above
  algorithmVersion: 'fingerprint-v1'
}

// Optional per-match event (D3: projection is authoritative; event is UI/scouting-only).
TacticalStyleSignalEmitted = {
  saveId: SaveId, runId: RunId, matchSeq: number, signals: StyleSignal[]
}
```

Manager & Legacy reads `TacticalIdentityFingerprint` at `RogueliteRunEnded` into its
`RunAnalysisSnapshot.ManagerStyleSignals` (GD-0019 hook). It performs **no cross-context
joins** and never re-reads after legacy config is generated for the next save (ADR-0051).

## Invariants

| # | Invariant |
|---|---|
| **C1** | The fingerprint is a pure deterministic projection of the ordered committed match event log + the locked `TacticSnapshot`(s); same inputs → identical signals. |
| **C2** | It declares **no `*Rng` sub-label** (ADR-0018 §3): it draws from no RNG, only reads already-resolved facts. Float accumulation order = match order (fixed). |
| **C3** | Shouts, pause and speed (ADR-0072) never contribute to any signal; tactics are read from immutable snapshots, not live edits. |
| **C4** | The spec emits **raw signals + confidence only**; it names no archetypes (G3 / FMX-93 deferral). |
| **C5** | Per-signal EWMA uses `H=15`; confidence uses empirical-Bayes shrinkage with familiarity; both pure functions of the per-match signal sequence. |
| **C6** | Manager & Legacy consumes the projection once at run-end, read-only, no cross-context joins, never re-read after (ADR-0051). |
| **C7** | Calibration constants (`H, μ₀, k₀, s_ref, α_fam`, normalisation bounds, weights) are versioned (`algorithmVersion`) and tunable via FMX-52 without changing the contract shape. |

## Worked example (pressing signal, n = 4)

Per-match PPDA → normalised `x_t = clip((18−PPDA)/12)`:

| match | PPDA | x_t |
|---|---|---|
| 1 | 8.0 | 0.833 |
| 2 | 9.0 | 0.750 |
| 3 | 7.5 | 0.875 |
| 4 | 12.0 | 0.500 |

EWMA (`α ≈ 0.04516`, `ŝ_1 = 0.833`): ŝ_2 = 0.829, ŝ_3 = 0.831, **ŝ_4 ≈ 0.816** (clearly
high-press). Confidence: `x̄ = 0.7395`, `s ≈ 0.168`, `v = 0.168/0.2 = 0.84`, familiarity
`F = 0.8 → f = 0.90`, `k_eff = 10·0.84·(1/0.90) ≈ 9.33`, **`w = 4/13.33 ≈ 0.30`**.
Shrunk estimate `θ̂ = 0.30·0.816 + 0.70·0.5 ≈ 0.595`. → Reported: pressing **value 0.82**,
**estimate 0.60**, **confidence 0.30**, `provisional: true` (n < 30). Re-running the same
ordered facts yields identical numbers (determinism self-check). By n≈40 with steady
behaviour, confidence rises to ≈0.8 and the estimate converges on the EWMA value (per
[[../../60-Research/raw-perplexity/raw-tactical-fingerprint-confidence-2026-06-03]]).

## Consequences

**Positive:** closes G10 with a deterministic, replay-safe, explainable algorithm on
clean inputs; gives FMX-93/G3 a stable signal substrate without pre-committing a
taxonomy; reuses Tactics' existing familiarity bar; every value is re-derivable from
match facts (debuggable, "why this value?" ready); confidence is first-class so sparse
saves degrade gracefully toward league average; calibration is isolated behind
`algorithmVersion` for FMX-52.

**Negative / constraints:** the `adaptation` axis has no canonical real-world metric —
proxied from the intervention log + game-state response, lowest confidence, flagged as
calibration debt; all baselines/weights (μ₀, s_ref, k₀, normalisation bounds) are
provisional pending FMX-52 playtest tuning; fingerprint UI, opposition-AI scouting and
archetype clustering are explicitly deferred; in early prototypes lacking xG, set-piece/
risk sub-metrics use shot-count fallbacks (documented per build).

## Amendment to ADR-0055 (additive cross-reference only)

[[ADR-0055-tactics-context]] gains a one-line "Related Docs" pointer to this ADR (the
algorithm extension). ADR-0055's decision, ownership, carrier names and determinism
rules are **unchanged** — no rewrite (vault-governance: never silently rewrite an
accepted ADR).

## Supersedes

None

## HITL gate

`proposed` / `binding: false`. D1–D4 chosen live by Nico 2026-06-03. Residual tuning
(exact μ₀/s_ref/k₀ per signal, normalisation bounds, signal weights, carry-vs-reinit on
manager change, whether to ship the optional two-component fast EWMA) is **calibration
debt routed to FMX-52** and does not block ratification of the algorithm shape. Awaiting
Nico ratify + merge; the ADR-0055 additive pointer applies in the same PR.

## Related Docs

- [[../../60-Research/tactical-identity-fingerprint-2026-06-03]] — FMX-68 synthesis (decision basis).
- [[../../60-Research/raw-perplexity/raw-tactical-fingerprint-signals-2026-06-03]] — signal metrics (real football analytics).
- [[../../60-Research/raw-perplexity/raw-tactical-fingerprint-aggregation-2026-06-03]] — EWMA / decay / half-life.
- [[../../60-Research/raw-perplexity/raw-tactical-fingerprint-confidence-2026-06-03]] — empirical-Bayes confidence model.
- [[../../60-Research/raw-perplexity/raw-tactical-fingerprint-games-2026-06-03]] — comparable games (FM/EA FC/OOTP/EHM/NBA/motorsport).
- [[ADR-0055-tactics-context]] — fingerprint **owner**; this ADR supplies its algorithm.
- [[ADR-0051-manager-and-legacy-context]] — **consumer**; run-end snapshot, never-re-read rule.
- [[ADR-0018-systemic-events-and-player-lifecycle]] — §3 RNG/determinism discipline.
- [[ADR-0072-in-match-control-seam]] — immutable `TacticSnapshot`; shouts ≠ signals; intervention-command log feeds the adaptation axis.
- [[../../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]] — signal categories; defers schema (this ADR) + taxonomy (G3).
- [[../state-machines/match]] — match event log + lock-time snapshot the signals read.
