---
title: MoneyBand → amountMinor Collapse Rule (FMX-149)
status: current
tags: [research, economy, accounting, ledger, money-band, collapse, determinism, replay, rng, ias37, fmx-149]
created: 2026-06-12
updated: 2026-06-12
type: research
binding: false
linear: FMX-149
related:
  - [[raw-perplexity/raw-band-collapse-event-sourcing-2026-06-12]]
  - [[raw-perplexity/raw-band-collapse-accounting-standards-2026-06-12]]
  - [[raw-perplexity/raw-band-collapse-sim-games-2026-06-12]]
  - [[../10-Architecture/09-Decisions/ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0086-background-fast-matchday-cost-settlement]]
  - [[../10-Architecture/09-Decisions/ADR-0095-balanced-transfer-ledger-posting-invariant]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
  - [[determinism-and-replay]]
  - [[background-fast-cost-settlement-2026-06-07]]
---

# MoneyBand → amountMinor Collapse Rule (FMX-149)

FMX-149 closes the **only fully-open axis** of
[[../10-Architecture/09-Decisions/ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract|ADR-0101]]
(D2): settlement envelopes carry banded estimates (`estimatedOperatingCostBand`, `riskCostBand`,
`creditorWriteoffBand`, …) while the ledger posts exactly one integer `amountMinor`
([[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger|ADR-0050]]). Where a
band is the *sole* source of a posting/forecast/accrual there is no named deterministic
`collapse(MoneyBand, ctx) → amountMinor` function — two replays could legitimately pick different
representatives and break the byte-identical-replay guarantee
([[../10-Architecture/09-Decisions/ADR-0086-background-fast-matchday-cost-settlement|ADR-0086]]
BF6/BF10, [[determinism-and-replay]]).

Three Perplexity strands ground this note:
[[raw-perplexity/raw-band-collapse-event-sourcing-2026-06-12]] (event-sourcing collapse-policy +
versioning patterns, bias math, seeded-draw replay safety),
[[raw-perplexity/raw-band-collapse-accounting-standards-2026-06-12]] (IAS 37 / ASC 450 range
recognition, prudence, football contingencies) and
[[raw-perplexity/raw-band-collapse-sim-games-2026-06-12]] (FM / Hattrick / Anstoss banded-display
vs exact-booking practice).

## What is already decided (constraints, not re-opened)

- **ADR-0101 D2 invariant frame (accepted):** the band stays classification/analytics/UI metadata
  only; where an exact `Money` exists in the envelope (`estimatedOperatingCostTotal`) the ledger
  posts **that** value and collapse is **not** invoked; collapse applies only where a band is the
  *sole* source; the policy is versioned — old events replay under the old rule. Only the **rule
  itself** is open (midpoint vs floor/representative vs seeded-within-band).
- **ADR-0086 (accepted)** — D4=C seeded cost variance (Nico override 2026-06-07); BF6 replay
  byte-identity with seed + draw indices persisted in `provenance`
  (`rngSubLabel`/`rngSeed`/`rngDrawIndices`/`modelVersion`); BF7 sub-label
  `WorldRng:venue:<clubId>:<week>:opcost:v1`, **no new top-level stream**; BF10 all magnitudes
  behind `costProfileVersion` (FMX-52).
- **ADR-0018 (accepted)** — locked top-level RNG streams; new **sub-labels** on existing streams
  are allowed, new top-level streams are not.
- **ADR-0095 D1=A (accepted/binding, FMX-145)** — balanced double-entry: a collapsed amount that
  enters a posting feeds ≥2 legs with Σ=0; the balance invariant applies **after** collapse (one
  collapse per business amount, then both legs reference the same collapsed value — never two
  independent collapses per leg).

## Research question 1 — what does event-sourcing practice say?

There is no named "range-collapse" pattern, but the assembled best practice is unambiguous
([[raw-perplexity/raw-band-collapse-event-sourcing-2026-06-12]]):

- Keep the band in the envelope; post one **policy-derived** amount tagged with the policy
  version. The mapping must be a **pure function of persisted inputs** (band, policy version,
  seed/draw indices if stochastic).
- Version via data, not time: the writer stamps the policy version at event-creation; projections
  switch on the stamped version, never on timestamps. Old events replay under the old rule —
  exactly ADR-0101's existing versioning invariant.
- **Bias math (uniform-within-band):** floor understates by half the band width per posting and
  drifts **linearly** (−n·w/2 over n postings — a full season of weekly band-sourced accruals
  visibly distorts FMX-52 calibration); midpoint is the unbiased zero-variance choice; a seeded
  uniform within-band draw is **unbiased in expectation** with bounded designed variance.
- A seeded draw is **replay-safe and audit-acceptable** iff algorithm + seed + draw indices are
  persisted and integer-mapped (no floating point) — precisely the ADR-0086 provenance machinery.

## Research question 2 — what does real-world accounting do?

([[raw-perplexity/raw-band-collapse-accounting-standards-2026-06-12]])

- **IAS 37:** range with all outcomes equally likely → **midpoint**; large populations →
  expected value. Estimates must stay **neutral** — the 2018 Conceptual Framework explicitly
  rules out systematic bias as "prudence".
- **ASC 450 (US GAAP):** no better estimate → **minimum of the range** — a deliberate,
  standard-mandated conservatism that IFRS rejects.
- Football clubs apply IAS 37/38 under UEFA licensing; contingent add-ons are provisioned at
  best estimate when probable, sell-on income only when virtually certain.
- Real-world accounting **never randomizes booked numbers** — but it is booking *obligations*,
  not simulating *outcomes*. The game's collapse sits on the simulation side: it decides what the
  world *actually did*, not what a club *estimates* — which is why game practice (below) diverges
  legitimately from IAS 37 here.

## Research question 3 — what do management sims do?

([[raw-perplexity/raw-band-collapse-sim-games-2026-06-12]])

- Universal pattern: **exact internal values, banded display**. The band is an
  information-asymmetry overlay (width = staff/scouting quality); the booking is always exact.
- Exact values = deterministic base formula × **bounded seeded variance** (`base × (1+ε)`); the
  Hattrick decoding study (2024) confirms a highly deterministic core with small bounded
  randomness; FM saves carry PRNG state — identical state + actions ⇒ identical finances.
- Design rationale: bounded variance keeps perceived uncertainty satisfying while the engine
  stays rigid and replayable — the exact posture ADR-0086 D4=C already adopted for opcost.

## Synthesis — option evaluation for the collapse rule

| Option | Replay | Bias over season | Variance / game feel | Realism grounding | Cost |
|---|---|---|---|---|---|
| **O1 midpoint** `floor((low+high)/2)` | trivially byte-identical, no RNG | unbiased | none — band midpoint always lands, predictable | IAS 37 midpoint (estimate posture) | lowest |
| **O2 floor (low bound)** | trivially byte-identical | **−n·w/2 systematic understatement** — distorts FMX-52 calibration | none | ASC 450 minimum (US-GAAP posture) | low, but bias must be compensated in calibration |
| **O3 seeded-within-band** uniform integer draw on existing sub-label | byte-identical **iff** seed + draw indices persisted (ADR-0086 provenance, already specified) | unbiased in expectation | bounded designed variance — matches sim-game practice & ADR-0086 D4=C | Hattrick/FM/Anstoss practice; IAS-37-neutral in expectation | provenance discipline + per-context sub-label mapping |
| **O4 hybrid** midpoint for forecasts/accruals, seeded for actual settlements | as O1+O3 | unbiased | variance only where the world "happens" | IAS 37 for estimates + sim practice for outcomes — cleanest conceptual split | two code paths, purpose flag in ctx |

- **O2 is the only research-rejected option** (systematic linear drift; even US GAAP applies it
  only as a recognition floor, not a simulation rule).
- O1 and O3 are both fully replay-safe; the fork is pure **design posture** — exactly the
  determinism-vs-seeded-variance axis where the project's standing preference (ADR-0086 D4=C
  override, FMX-92/FMX-102) is **bounded seeded variance via an existing stream**.
- O4 is the textbook-precise split but adds a second code path; the simplest-proportional
  posture (FMX-144 precedent) argues for one rule unless the split carries real gameplay value.

## Sub-decisions the rule must pin (regardless of option)

1. **MoneyBand canonical type** — today `MoneyBand` is used (ADR-0070/0086/0095/0101) but nowhere
   typed. Minimal pin: `{ lowMinor: int, highMinor: int }`, closed interval, `low ≤ high`, same
   currency/minor-unit discipline as `Money` (ADR-0050 LI-7). Display bands derive from it; the
   collapse consumes it.
2. **Integer determinism details** — midpoint = `floor((lowMinor + highMinor) / 2)` (integer
   division, pinned); seeded = uniform **integer** draw on the closed interval, integer-mapped
   (no float), exactly one draw per business amount (then balanced legs share it, ADR-0095 LI-1).
3. **Version governance** — collapse policy lives behind **`costProfileVersion`** (one version
   governs band-collapse + cost-model magnitudes, ADR-0086 BF10 / FMX-52) vs a separate
   `bandCollapseVersion`. Event-sourcing practice only requires *a* stamped version; one shared
   key is the simplest-proportional choice and matches the issue's framing.
4. **Sub-label mapping (only if seeded/hybrid)** — opcost bands already own
   `WorldRng:venue:<clubId>:<week>:opcost:v1` (BF7). Non-venue bands (e.g. ADR-0079
   `creditorWriteoffBand`, `valuationDiscountBand`) need their own documented **sub-label on an
   existing stream** (ADR-0018: sub-labels allowed, streams locked), e.g.
   `WorldRng:club:<clubId>:<seasonWeek>:insolvency:v1` — the concrete insolvency label lands with
   FMX-146; ADR-0101 D2 pins the *principle* (every band-context that collapses via draw has
   exactly one documented sub-label + provenance).

## Recommendation

**Lead options (co-equal): O3 seeded-within-band and O1 midpoint.** O3 aligns with the project's
standing seeded-variance preference, sim-game practice and the already-built ADR-0086 provenance
machinery; O1 is the zero-cost IAS-37 posture if D2 should stay maximally simple. O4 is the
defensible middle if forecasts and actuals should feel different. O2 floor is rejected
(systematic drift). Decision is Nico's (HITL, FMX-149).
