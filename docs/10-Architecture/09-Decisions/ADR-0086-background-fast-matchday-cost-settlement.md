---
title: ADR-0086 Background-fast Matchday Cost-Settlement Pipeline
status: accepted
tags: [adr, architecture, ddd, economy, matchday-costs, settlement, background-fast, quality-profile, commercial-portfolio, club-management, ledger, determinism, event-sourcing, fmx-92]
context: [club-management-economy, commercial-portfolio]
created: 2026-06-07
updated: 2026-06-12
type: adr
binding: true
supersedes:
superseded_by:
related:
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0050-club-economy-accounting-ledger]]
  - [[ADR-0058-club-economy-commercial-impact-boundary]]
  - [[ADR-0061-club-management-sub-aggregate-audit]]
  - [[ADR-0070-fixture-commercial-revenue-profile-contract]]
  - [[../bounded-context-map]]
  - [[../../50-Game-Design/match-engine]]
  - [[../../50-Game-Design/GD-0002-match-engine]]
  - [[../../60-Research/background-fast-cost-settlement-2026-06-07]]
  - [[../../60-Research/matchday-operating-costs-and-risk-cost-settlement-2026-05-29]]
  - [[../../60-Research/raw-perplexity/raw-matchday-cost-settlement-realworld-2026-06-07]]
  - [[../../60-Research/raw-perplexity/raw-matchday-cost-settlement-games-2026-06-07]]
  - [[../../60-Research/raw-perplexity/raw-matchday-cost-settlement-ddd-determinism-2026-06-07]]
  - [[../../60-Research/domain-model-audit-and-backlog-2026-06-02]]
---

# ADR-0086: Background-fast Matchday Cost-Settlement Pipeline

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `proposed`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **History (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143):**
> **`proposed` / `binding: false`.** Authored after Nico chose the FMX-92 decisions live
> (2026-06-07). Closes domain-audit gap **G21** and **the last open child of E6 / FMX-62**.
> It does **not** flip any context to accepted, does **not** implement schemas, and does
> **not** edit `bounded-context-map.md` (no map change is required — see below). It **extends
> the ADR-0070 `MatchdayOperatingCostSummary` sketch**; it does not re-open ADR-0050/0058/0061/0070.

> **FMX-135 status cleanup (2026-06-12):** Nico confirmed the FMX-143
> ratification intent during the FMX-135 pass. This ADR remains `accepted` and is
> now `binding: true`; the pre-ratification banner above stays historical context.

## Date

- Proposed: 2026-06-07 (FMX-92)

## Context

The match-engine quality-profile model (`match-engine.md` §6.2) defines four profiles
(`competitive-full`, `interactive-standard`, `background-detailed`, `background-fast`).
`background-fast` produces "Result, injuries, form, table, reputation and **economy effects
only**" and is the rest-world / long-term-simulation path; "hundreds of fixtures must be assigned
quality profiles; they must never all default to `competitive-full`." **No contract specifies how a
non-interactive, no-event-log fixture turns into matchday operating costs on the ledger** (gap
**G21**).

FMX-46 ([[../../60-Research/matchday-operating-costs-and-risk-cost-settlement-2026-05-29]])
designed the **foreground** forecast-then-settle lifecycle: **12 cost families** settled through
**~19 per-cost settlement events** (`MatchdayStewardingCostPosted`, `MatchdaySecurityCostPosted`,
`MatchdayPoliceContributionPosted`, `MatchdayMedicalEmergencyCostPosted`,
`MatchdayCleaningWasteCostPosted`, `MatchdayEnergyCostPosted`, `MatchdayTemporaryStaffCostPosted`,
`MatchdayOfficialsCostPosted`, `PitchRecoveryCostPosted`, `MatchdayInsuranceComplianceCostAllocated`,
`MatchdayDamageReserveAdjusted`, `MatchdaySanctionFinePosted`, …), driven by the **Matchday Event
Engine** resolution path that `background-fast` explicitly **skips**. Multiplying that event storm
across an entire simulated world per matchday is prohibitively chatty and bloats the event store;
silently dropping the costs breaks economy realism and FMX-52 soak calibration. Deterministic
background settlement is also a replay/save-integrity requirement.

The economy boundary is already settled and **binding**:

- **ADR-0050** — **Club Management is the sole finance-ledger writer**; other contexts emit fact
  events consumed via Customer-Supplier + ACL ("other contexts never write finance tables directly").
- **ADR-0058** — **CommercialPortfolio** owns the per-fixture settlement Saga, the
  `MatchdayOperatingCostProfile`, the matchday operating-cost settlement Saga and the IFRS 15
  accrual schedule; it emits settlement events; Club Management posts. Risk tiers are **data
  contracts** (`routine`, `guarded`, `elevated`, `highRisk`, `restricted`, `closedDoor`).
- **ADR-0061** — `FixtureSettlement` aggregate + `MatchdayCommercialSettlementPosted` (consumed by
  the ledger).
- **ADR-0070** (FMX-78) — already **sketched `MatchdayOperatingCostSummary`** as the
  CommercialPortfolio-owned/produced background settlement envelope, keyed by the League-published
  `operatingCostAttachmentKey`, carrying `riskCostBand`, `estimatedOperatingCostBand: MoneyBand`,
  `settlementReadiness`; invariants P7/P8 (ACL consumer-owned projections; Club Management sole
  ledger writer). FMX-92 **formalizes the pipeline and extends this sketch**; it does not redefine
  the key.
- **ADR-0018 / determinism-and-replay** — the locked-9 RNG streams; venue revenue/demand variance
  already uses **`WorldRng:venue:<clubId>:<week>`**; new sub-labels are allowed, new top-level
  streams are not.

Grounded in [[../../60-Research/background-fast-cost-settlement-2026-06-07]] (three Perplexity
passes: real-world cost structure, prior-art games, DDD/event-sourcing).

Scope:

- The background-fast → ledger settlement **pipeline** and ownership.
- The **coarse parametric cost model** collapsing the 12 FMX-46 families into one fixed vector.
- The **lightweight stateless settlement path** (no per-fixture saga at world scale).
- The **`background-detailed` re-sim reconciliation** rule (no double-post, replay-safe).
- The **determinism / RNG** contract for background settlement.

Out of scope:

- Foreground (`competitive-full` / `interactive-standard`) per-event settlement (FMX-46, unchanged).
- The detailed-resim **cost recomputation** itself (incident-driven families via the Matchday Event
  Engine) — FMX-92 owns only the *reconciliation* contract for its result.
- Mitigation UI surfaces (background fixtures are non-interactive).
- All numeric magnitudes (→ FMX-52 calibration behind `costProfileVersion`).

## Decision options

### D1 — Background-fast cost model

| Option | Description | Trade-off |
|---|---|---|
| **A. Coarse parametric function** | `cost = base(competitionTier) + perAttendee×attendanceBand + riskUplift(riskTier)`, output as a collapsed fixed cost-family vector. | **Chosen (Nico).** Real-world-defensible (risk = step uplift); matches FM/OOTP; reuses ADR-0070 `attendanceBand`/`riskCostBand`; magnitudes → FMX-52. |
| B. Fixed per-profile vector | One canonical cost vector per `(competitionTier × riskTier)` profile; ignores attendance. | Simplest/cheapest but a 5,000 and 50,000 crowd settle identically — loses attendance realism. |
| C. Full attendance+risk+weather function | Add weather/time shocks. | More realistic but background-fast has no weather resolution; inputs would be synthetic — added cost for little gain at this tier. |

### D2 — Settlement path at world scale

| Option | Description | Trade-off |
|---|---|---|
| **A. Lightweight stateless path** | CommercialPortfolio computes + emits **one** summary settlement event directly; no per-fixture saga instance. | **Chosen.** A saga is for long-running multi-step coordination; background-fast settlement is single-step/synchronous. Still CommercialPortfolio-owned → Club Management posts (ADR-0050/0058 preserved). Avoids the per-fixture saga state/event storm. |
| B. Full FixtureSettlement Saga | Reuse the foreground per-fixture saga. | Maximum one-code-path consistency, but spins up + persists a saga instance per world fixture — the very state/event storm FMX-92 exists to avoid. |

### D3 — Background-detailed re-sim reconciliation

| Option | Description | Trade-off |
|---|---|---|
| **A. Reversal + compensating repost** | Posted summary immutable & canonical; upgrade emits a reversal of the old total + a fresh posting of the new, under a distinct upgrade idempotency key. | **Chosen.** Append-only, audit-correct (classic accounting reversal); balance = `sum(amount)` (no version filtering); self-contained idempotent events. |
| B. Freeze / representational only | Summary total stays frozen; a re-sim only adds event detail, never re-settles money. | The games-industry default; zero reconciliation/double-post risk, but detailed incident costs never reach the ledger. |
| C. Delta-adjust posting | Post only `C1 − C0` as one adjustment entry. | Fewer events than reversal, but believed-cost-at-each-point is implicit and chains of upgrades get error-prone. |
| D. Supersede-by-version | Emit increasing-version summaries; ledger ignores all but latest. | **Rejected.** "Dangerous in a ledger": raw sums overstate totals; every consumer must honour version rules — invites double-counting. |

### D4 — Determinism / RNG

| Option | Description | Trade-off |
|---|---|---|
| A. Pure function, no RNG | Cost = deterministic fn of inputs; no `*Rng` declared. | The DDD best-practice default (no randomness on ledger-bound values unless variance is designed); byte-identical replays. |
| B. Pure now, reserve `WorldRng:venue` sub-label | Pure for MVP; reserve the seam for later variance. | Conservative; defers the variance feature. |
| **C. Seeded cost variance now** | Bounded variance drawn from the existing `WorldRng:venue:<clubId>:<week>` sub-label (no new top-level stream), versioned `…:opcost:v1`; seed + draw indices persisted in provenance. | **Chosen (Nico override).** Adds designed cost realism immediately; replay-safe **iff** the seed/draws are persisted as fixture input state (this ADR mandates it). Variance band → FMX-52. |

## Decision

**D1 = A, D2 = A, D3 = A, D4 = C** (Nico, live, 2026-06-07).

A `background-fast` fixture's matchday operating cost is settled by a **CommercialPortfolio
lightweight stateless path** that computes a **coarse parametric cost vector** (collapsing the 12
FMX-46 cost families) with **bounded seeded variance**, emits **exactly one**
`MatchdayOperatingCostSummary` settlement event (zero per-cost domain events), which **Club
Management** posts to the ledger via the ADR-0050 ACL. If the fixture is later upgraded via
`background-detailed` on-demand re-sim with a different total, the difference is reconciled by
**reversal + compensating repost** under a distinct upgrade idempotency key. Determinism is
guaranteed by drawing variance from the existing `WorldRng:venue:<clubId>:<week>:opcost:v1`
sub-label with the **seed + draw indices persisted in the summary provenance**.

## Public contract direction

### Pipeline

```
background-fast match path  (no per-cost events)
        │  emits one fact: BackgroundFixtureEconomyResult (result/injuries/form/reputation + cost inputs)
        ▼
CommercialPortfolio — lightweight stateless settlement (D2)
        │  cost = base(competitionTier) + perAttendee·attendanceBand + riskUplift(riskTier)   (D1)
        │        + bounded variance ~ WorldRng:venue:<clubId>:<week>:opcost:v1               (D4)
        │  → collapsed 12-family cost vector; attaches via operatingCostAttachmentKey (ADR-0070)
        ▼  emits ONE  MatchdayOperatingCostSummary  (settlement event, via ADR-0028 outbox)
Club Management — sole ledger writer (ADR-0050 ACL)
        │  LedgerEntryBooked (operating expense), idempotency key ("FixtureCostBooked", fixtureId)
        ▼
   [ later: background-detailed re-sim → C1 ≠ C0 ]                                            (D3)
        │  MatchdayOperatingCostUpgraded { fixtureId, c0, c1 }, key ("FixtureCostUpgrade", fixtureId)
        ▼  Club Management: LedgerEntryReversal(C0) + LedgerEntryBooked(C1)  — no double-post
```

### `MatchdayOperatingCostSummary` (extends the ADR-0070 sketch)

Self-contained settlement fact, owned/produced by CommercialPortfolio (Zod sketch — illustrative,
not implementation):

```ts
MatchdayOperatingCostSummary = {
  // identity / attachment (ADR-0070 — unchanged keys)
  operatingCostAttachmentKey: string,        // League-published per-fixture join key (NOT a cross-context join)
  fixtureId: FixtureId,
  fixtureCommercialProfileVersion: int,
  costProfileVersion: int,                   // FMX-52 calibration version of base()/perAttendee/riskUplift/variance band
  // coarse inputs (D1)
  competitionTier: CompetitionTier,
  attendanceBand: AttendanceBand,            // ADR-0070 / FMX-46
  awayFanBand: AwayFanBand,
  riskCostBand: 'routine' | 'guarded' | 'elevated' | 'highRisk' | 'restricted' | 'closedDoor',
  // collapsed cost vector — the 12 FMX-46 families as fixed aggregate fields (MoneyBand or fixed-point money)
  costFamilies: {
    stewarding, privateSecurity, policingContribution, medicalEmergency, cleaningWaste,
    energyUtilities, temporaryStaff, officialsMatchOps, pitchRecovery, insuranceCompliance,
    damageReserve, sanctionClosure
  },
  estimatedOperatingCostTotal: Money,        // = Σ costFamilies (fixed-point)
  estimatedOperatingCostBand: MoneyBand,     // ADR-0070
  settlementReadiness: 'estimated' | 'confirmed' | 'posted',  // ADR-0070
  settlementKind: 'backgroundFast',
  settlementVersion: int,                    // 0 = cheap background-fast; ≥1 = detailed-resim upgrade
  // determinism provenance (D4) — makes replay byte-identical and reversal+repost reproducible
  provenance: {
    rngSubLabel: 'WorldRng:venue:<clubId>:<week>:opcost:v1',
    rngSeed: uint64,                         // resolved seed for that sub-label
    rngDrawIndices: int[],                   // ordered draw positions consumed by the variance term
    modelVersion: 'costProfileVersion'
  },
  idempotencyKey: string                     // ("FixtureCostBooked", fixtureId) for the cheap posting
}
```

The **same fixed cost-family field set** is used by the foreground path (FMX-46), so the background
vector is a strict aggregate of the same taxonomy — no orphan fields, no new family.

### Draft events (via ADR-0028 transactional outbox)

- `MatchdayOperatingCostSummary` (a.k.a. `MatchdayOperatingCostSettled`) — the single coarse
  settlement fact for a background-fast fixture (CommercialPortfolio → Club Management). **Replaces
  the entire 19-event foreground storm for this profile.**
- `MatchdayOperatingCostUpgraded` { `fixtureId`, `c0`, `c1`, `fromSettlementVersion`,
  `toSettlementVersion` } — emitted only when a `background-detailed` re-sim supersedes a posted
  background-fast summary (D3).
- Club Management ledger postings (existing vocabulary, ADR-0050/0061): `LedgerEntryBooked`,
  `LedgerEntryReversal` (on upgrade) — Club Management remains the **only** emitter of these.

### Consumed facts (events / read models only — no cross-context joins)

- The League-published `FixtureCommercialProfile.operatingCostAttachmentKey` +
  `CompetitionRevenueProfile` (ADR-0070), already stored as CommercialPortfolio consumer-owned
  projections.
- The background-fast match path's economy-result fact (result/attendance band/risk band/cost
  inputs) — the only Match→Commercial input; no event log.
- League/Calendar deterministic clock facts for the matchweek (`<week>` in the RNG sub-label).

## Determinism, storage and RNG rules

- Settlement is a **pure function of persisted inputs + one seeded variance draw**:
  `cost = base(competitionTier) + perAttendee·attendanceBand + riskUplift(riskTier) + variance`,
  where `variance` is a **bounded** draw from `WorldRng:venue:<clubId>:<week>:opcost:v1`
  (ADR-0018 stream #1 `WorldRng` — **no new top-level `*Rng` is declared**; this extends the
  existing venue revenue/demand-variance sub-label family to venue *operating cost*).
- The **resolved seed + ordered draw indices are persisted in `provenance`**, so: (a) the same
  `worldSeed` + inputs reproduce a byte-identical summary on replay; (b) reversal+repost on upgrade
  is reproducible; (c) re-delivery is safe.
- Variance is **bounded and zero-mean-ish by design** so it does not bias season-scale totals
  (drift mitigation); the band width is **FMX-52** calibration.
- Background-fast settlement emits **exactly one** summary fact and **zero** per-cost domain events;
  the cheap inputs are retained so a later `background-detailed` re-sim can regenerate detail.
- Settlement and ledger postings publish via the **ADR-0028 outbox** after the producing
  transaction commits; consumers are **idempotent** (keys per §contract) and replay-safe.
- All magnitudes (`base()`, `perAttendee`, `riskUplift()` step sizes, the per-family split ratios of
  the collapsed vector, the variance band) are **FMX-52 calibration** behind `costProfileVersion`.

## Invariants

| # | Invariant |
|---|---|
| BF1 | A background-fast fixture emits **exactly one** `MatchdayOperatingCostSummary` settlement fact and **zero** per-cost domain events (no FMX-46 19-event storm). |
| BF2 | **Club Management is the sole finance-ledger writer** (ADR-0050); CommercialPortfolio emits the settlement event; no other context writes the ledger. |
| BF3 | CommercialPortfolio owns the settlement compute and emission (ADR-0058); background-fast uses a **lightweight stateless path** — no per-fixture `FixtureSettlement` saga instance. |
| BF4 | The summary is **self-contained**: consumers settle/post without any cross-context join; `operatingCostAttachmentKey` is a CommercialPortfolio-internal projection key (ADR-0070 P7), not a runtime join. |
| BF5 | The summary's `costFamilies` cover **all 12 FMX-46 cost families** as aggregate fields; the vector is a strict aggregate of the same taxonomy the foreground path itemises (no new/orphan family). |
| BF6 | Settlement is **deterministic and replay-safe**: identical inputs + `worldSeed` produce a byte-identical summary and identical ledger postings; the seed + draw indices are persisted in `provenance`. |
| BF7 | The variance draw uses **`WorldRng:venue:<clubId>:<week>:opcost:v1`** (ADR-0018 stream #1); **no new top-level `*Rng` stream** is introduced. |
| BF8 | A posted background-fast summary is **immutable & canonical**; a `background-detailed` re-sim with a different total reconciles via **reversal + compensating repost** under a **distinct upgrade idempotency key** — never mutate, never supersede-by-version. |
| BF9 | Idempotency is **per operation** (cheap booking vs detailed upgrade have distinct keys); re-delivery of either never double-posts. |
| BF10 | All numeric magnitudes are **FMX-52 calibration** behind `costProfileVersion`; no money constant is locked in this ADR. |
| BF11 | IP-safe examples only — no real club / competition / venue names in schemas or worked examples (ADR-0007 / GD-0015). |

## Bounded-context-map impact

**None.** This is a contract between the **existing** Match (background-fast path), CommercialPortfolio
(settlement owner) and Club Management (sole ledger writer) contexts, all already on the ratified
map; the CommercialPortfolio↔Club Management Customer-Supplier + ACL relationship already exists
(ADR-0050/0058). The ratified context count (19) is unchanged and **no `bounded-context-map.md`
edit is made**. (Additive one-line `Related` pointers to ADR-0086 may be added to ADR-0070/0058 on
ratification; their decisions are unchanged.)

## Consequences

Positive:

- One deterministic, low-overhead settlement path for the rest-world economy; **one fact per
  fixture instead of a 19-event storm** — meets the match-engine performance budget and keeps the
  event store/save compact at world scale.
- Financially equivalent to the foreground path (same cost-family taxonomy, calibrated to the same
  distributions) while keeping ADR-0050/0058/0061/0070 invariants intact.
- Audit-correct, append-only reconciliation for the `background-detailed` upgrade (reversal+repost),
  with no double-posting and byte-identical replay.
- Reuses the existing RNG sub-label family — no new locked stream to version.
- **Closes E6 / FMX-62** (last open child) and gap G21.

Negative / constraints:

- Economy-drift risk between background-fast and the detailed/foreground path is real; relies on
  FMX-52 calibrating the coarse function to the detailed distributions (validated in the soak
  runbook) — a calibration burden, not a contract gap.
- D4's seeded variance adds a determinism obligation (persist seed + draws) and a calibrated band;
  with no persisted provenance it would break replay — BF6/BF7 make this mandatory.
- A second ledger path (reversal+repost) exists for the upgrade case; consumers must implement the
  per-operation idempotency keys correctly.

## Ratification / follow-up

Accepted and binding. Authored `proposed` after Nico chose the FMX-92 planning defaults live
(2026-06-07): **D1 = A**
(coarse parametric function), **D2 = A** (lightweight stateless path), **D3 = A** (reversal +
repost), **D4 = C** (seeded cost variance now — Nico override of the pure-function default).

Remaining follow-up items before implementation:

- all numeric magnitudes → **FMX-52** behind `costProfileVersion` (base/perAttendee/riskUplift,
  per-family split ratios, variance band); calibrate to background-detailed/foreground distributions;
- additive `Related` pointers to ADR-0070 / ADR-0058 (apply on ratify; decisions unchanged);
- coordinate the `background-detailed` re-sim **cost recomputation** (incident-driven families) with
  the FMX-46 foreground pipeline so the upgrade's C1 is itself deterministic before reversal+repost.

## Supersedes

None.

## Related Docs

- [[../../60-Research/background-fast-cost-settlement-2026-06-07]]
- [[../../60-Research/raw-perplexity/raw-matchday-cost-settlement-realworld-2026-06-07]]
- [[../../60-Research/raw-perplexity/raw-matchday-cost-settlement-games-2026-06-07]]
- [[../../60-Research/raw-perplexity/raw-matchday-cost-settlement-ddd-determinism-2026-06-07]]
- [[../../60-Research/matchday-operating-costs-and-risk-cost-settlement-2026-05-29]]
- [[ADR-0050-club-economy-accounting-ledger]]
- [[ADR-0058-club-economy-commercial-impact-boundary]]
- [[ADR-0061-club-management-sub-aggregate-audit]]
- [[ADR-0070-fixture-commercial-revenue-profile-contract]]
- [[ADR-0018-systemic-events-and-player-lifecycle]]
- [[../../50-Game-Design/match-engine]]
