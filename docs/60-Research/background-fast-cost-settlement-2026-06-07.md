---
title: Background-fast Matchday Cost-Settlement Pipeline (FMX-92)
status: current
tags: [research, economy, matchday-costs, settlement, background-fast, quality-profile, determinism, ddd, event-sourcing, fmx-92]
created: 2026-06-07
updated: 2026-06-07
type: research
binding: false
linear: FMX-92
related:
  - [[raw-perplexity/raw-matchday-cost-settlement-realworld-2026-06-07]]
  - [[raw-perplexity/raw-matchday-cost-settlement-games-2026-06-07]]
  - [[raw-perplexity/raw-matchday-cost-settlement-ddd-determinism-2026-06-07]]
  - [[../10-Architecture/09-Decisions/ADR-0086-background-fast-matchday-cost-settlement]]
  - [[matchday-operating-costs-and-risk-cost-settlement-2026-05-29]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0061-club-management-sub-aggregate-audit]]
  - [[../10-Architecture/09-Decisions/ADR-0070-fixture-commercial-revenue-profile-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
  - [[../50-Game-Design/match-engine]]
  - [[domain-model-audit-and-backlog-2026-06-02]]
---

# Background-fast Matchday Cost-Settlement Pipeline (FMX-92)

FMX-92 closes domain-audit gap **G21** and is the **last open child of E6 / FMX-62** (Economy
Settlement Pipelines & Read-Models — siblings FMX-94/FMX-95 are Done). The match-engine
quality-profile model (`match-engine.md` §6.2) says `background-fast` produces "economy effects",
but **no contract specifies how a non-interactive, no-event-log fixture turns into matchday
operating costs on the ledger**. FMX-46 designed the rich foreground forecast-then-settle
lifecycle (**12 cost families / 19 per-cost settlement events**) that assumes the
Matchday-Event-Engine resolution path `background-fast` explicitly skips. At world scale
(hundreds–thousands of fixtures per matchday) replaying that event storm is prohibitively chatty
and bloats the event store; silently dropping the costs breaks economy realism and FMX-52 soak
calibration. This note grounds the pipeline + the four decisions in three Perplexity passes
(real-world cost structure, prior-art games, DDD/event-sourcing) plus the vault's binding economy
contracts.

## What is already decided (constraints, not re-opened)

- **ADR-0050** (accepted/binding) — **Club Management is the sole finance-ledger writer**; other
  contexts emit fact events consumed via Customer-Supplier + ACL; "other contexts never write
  finance tables directly."
- **ADR-0058** (accepted/binding) — **CommercialPortfolio** owns the per-fixture settlement Saga,
  `MatchdayOperatingCostProfile`, the matchday operating-cost settlement Saga, the IFRS 15 accrual
  schedule; it emits settlement events; Club Management posts. Risk tiers are **data contracts**
  (`routine`, `guarded`, `elevated`, `highRisk`, `restricted`, `closedDoor`).
- **ADR-0061** (accepted/binding) — `FixtureSettlement` aggregate + `MatchdayCommercialSettlementPosted`
  consumed by the Club Management ledger.
- **ADR-0070** (accepted/binding, FMX-78) — already sketched `MatchdayOperatingCostSummary`
  (owned/produced by CommercialPortfolio), keyed by the League-published `operatingCostAttachmentKey`,
  carrying `riskCostBand`, `estimatedOperatingCostBand: MoneyBand`, `settlementReadiness`. P7/P8:
  CommercialPortfolio consumes via ACL into consumer-owned projections; Club Management remains sole
  ledger writer. **FMX-92 formalizes the pipeline and extends this sketch; it does not redefine the key.**
- **ADR-0018 / determinism-and-replay** (binding) — the **locked-9 RNG streams**; venue
  revenue/demand variance already uses **`WorldRng:venue:<clubId>:<week>`**; new sub-labels are
  allowed, new top-level streams are not.
- **`match-engine.md` §6.2** — `background-fast` = "Result, injuries, form, table, reputation and
  economy effects only"; "hundreds of fixtures must be assigned quality profiles; they must never
  all default to `competitive-full`." `background-detailed` stores a seed + summary and **can
  re-sim on demand**.

**The precise gap:** the deterministic, low-overhead path that turns one background-fast fixture
into **one** aggregated `MatchdayOperatingCostSummary` fact, settled by CommercialPortfolio and
posted by Club Management — financially equivalent to the foreground path, without the 19-event
fan-out — plus the `background-detailed` re-sim cross-over rule.

## Evidence summary

### Real-world cost structure — [[raw-perplexity/raw-matchday-cost-settlement-realworld-2026-06-07]]
A fixture's day-of operating cost collapses cleanly to **`base(competitionTier) +
perAttendee×attendanceBand + riskUplift(riskTier)` + weather/condition shocks** — a defensible
approximation for simulation. Crowd-facing families (stewarding, temp catering/retail, cleaning,
some medical) are **attendance-sensitive**; policing/Special Police Services, extra security and
some compliance are **risk-tier-sensitive** and behave as **step functions**, not smooth lines;
officials, base utilities, base insurance/compliance and pitch recovery are **mostly fixed per
fixture**. **Behind-closed-doors** (`closedDoor`) collapses crowd-facing families toward zero while
officials/utilities/pitch/compliance still post. Public fixture-level £-benchmarks are scarce; the
literature confirms the *structure and drivers*, not standardized per-league numbers (→ FMX-52).

### Prior art (games) — [[raw-perplexity/raw-matchday-cost-settlement-games-2026-06-07]]
FM, EA FC/FIFA Manager, OOTP, FHM and EHM all use **one coarse, deterministic financial
abstraction for every fixture** (attendance × price + lump-sum/base cost scaled by
attendance/competition), identical for watched and unwatched matches — **never a per-cost event
stream**; finances attach to the final match object, not the event log. They keep season-scale
finances believable by calibrating attendance/wage models (not matchday micro-costs) and lean on
seasonal/non-match costs. The genre's **two-tier-fidelity** best practices: same invariants/shared
parameters, different solvers; stochastic consistency; **no per-event logs in the low tier** (only
aggregate match facts) to avoid save-bloat; tiers differ by *how*, not *what*. Documented pitfalls:
**economy drift** between tiers (compounds over seasons), competitive-balance drift if low-tier
distributions differ, save-bloat, and player-perceived unfairness. On **on-demand upgrade**, the
near-universal pattern is **freeze the aggregate (score, attendance, profit) and treat the upgrade
as representational** — no public sim merges a re-simulated result into the live timeline.

### DDD / event-sourcing / determinism — [[raw-perplexity/raw-matchday-cost-settlement-ddd-determinism-2026-06-07]]
A background-fast settlement is a **different model of reality**, not a compressed stream: emit one
**coarse-grained domain/settlement event** (`MatchdayOperatingCostSettled`) — its own *business
fact* ("the club agrees to treat this fixture as costing X"). This is the right call at world scale
(throughput + store compaction) provided you keep the cheap inputs (fixture, bands, seed) so detail
can be regenerated on upgrade. **Determinism default = pure function, no RNG** for anything that
hits the ledger *unless variance is a designed feature*; if it is, the **seed + draws must be
persisted as fixture input state** so replays stay bit-identical. Reconciliation in an append-only
sole-writer ledger: **reversal + repost** is the audit-correct accounting pattern; delta-adjust is
a lighter alternative; **supersede-by-version is "dangerous in a ledger"** (raw sums overstate
totals; consumers must all honour version rules). **Idempotency keys are per-operation, not
per-final-state**: a detailed upgrade is a new operation with a new key whose handler corrects the
prior posting without double-posting. (Sources incl. Fowler EventSourcing/Accounting patterns, MS
Azure event-sourcing.)

## Decisions (Nico, live, 2026-06-07)

| # | Question | Choice | Summary |
|---|---|---|---|
| **D1** | Cost model | **A** | **Coarse parametric function** `base(competitionTier) + perAttendee×attendanceBand + riskUplift(riskTier)`, output as the **collapsed fixed cost-family vector** (the 12 FMX-46 families as aggregate fields). Risk = step uplift. Real-world-defensible, matches FM/OOTP, reuses ADR-0070 `attendanceBand`/`riskCostBand`. Magnitudes → FMX-52 behind `costProfileVersion`. |
| **D2** | Settlement path | **A** | **Lightweight stateless settlement path** — CommercialPortfolio computes + emits **one** summary settlement event per background-fast fixture, **no per-fixture FixtureSettlement saga instance** (saga reserved for foreground/background-detailed). Ownership unchanged: CommercialPortfolio settles, **Club Management is sole ledger writer** (ADR-0050/0058). |
| **D3** | Re-sim reconcile | **A** | **Reversal + compensating repost.** Posted summary is immutable & canonical; a later background-detailed re-sim with a different total emits a **reversal of the old + a fresh posting of the new**, under a **distinct upgrade idempotency key** — append-only, audit-correct. Never mutate, never supersede-by-version. |
| **D4** | Determinism | **C** | **Seeded cost variance now** (Nico override of the pure-function default). Settlement draws **bounded variance from the existing `WorldRng:venue:<clubId>:<week>` sub-label** (ADR-0018 stream #1 `WorldRng`; **no new top-level `*Rng`**), versioned `…:opcost:v1`. Replay-safe: **seed + draw indices persisted in the summary provenance**. Variance band → FMX-52. |

These ground **ADR-0086** (architecture contract), authored `proposed` per never-self-accept. No
new GD (this is an architecture/contract concern); no bounded-context-map change (a contract among
existing Match, CommercialPortfolio, Club Management contexts).

## Open issue-questions — resolved

- *Fixed per-profile cost vector vs coarse function of attendance + risk?* — **Coarse parametric
  function** (D1); a flat fixed vector would settle a 5,000 and a 50,000 crowd identically.
- *CommercialPortfolio saga vs lightweight direct settlement at world scale?* — **Lightweight
  stateless** (D2); a stateful saga per world fixture is the very state/event storm FMX-92 exists
  to avoid (the saga is for long-running multi-step coordination, not a single synchronous step).
- *Re-sim supersede vs delta-adjust?* — **Reversal + repost** (D3); supersede-by-version is unsafe
  in an append-only ledger, delta-adjust is the lighter fallback.
- *Which RNG sub-label governs determinism?* — **`WorldRng:venue:<clubId>:<week>:opcost:v1`** (D4),
  extending the existing venue revenue/demand-variance sub-label family; no new top-level stream.

## Honest limitations / deferred

- **All magnitudes are calibration debt → FMX-52**, behind `costProfileVersion`: `base()` by
  competition tier, `perAttendee` rates, `riskUplift()` step sizes per tier, the variance band
  width, and the per-family split ratios for the collapsed vector.
- **Public £-benchmarks are scarce** — real-world evidence is structural (drivers, fixed/linear/step
  shape), not standardized per-league numbers; the parametric *shape* is grounded, the *numbers* are
  FMX-52's job, ideally fitted to large background-detailed/foreground AI-vs-AI batches (the genre's
  drift-avoidance method).
- **Economy-drift risk between background-fast and the detailed/foreground path** is real; D1's
  shared-parameter coarse function + FMX-52 calibration-to-distribution is the mitigation, validated
  in the soak runbook.
- **D4 variance vs determinism:** legitimate only because the seed + draw indices are persisted as
  fixture settlement input state (ADR-0086 mandates this in `provenance`), keeping replays
  bit-identical and reversal+repost reproducible.
- The detailed-resim **cost recomputation** (incident-driven families via the Matchday Event Engine)
  remains the foreground/`background-detailed` path's concern (FMX-46); FMX-92 owns only the
  reconciliation contract for when it supersedes a background-fast summary.
