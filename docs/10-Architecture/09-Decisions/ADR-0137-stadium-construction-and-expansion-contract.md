---
title: ADR-0137 Stadium Construction and Expansion Contract
status: draft
tags: [adr, architecture, ddd, stadium-operations, club-management, construction, expansion, financing, dual-mode, fmx-212, fmx-216]
context: [stadium-operations, club-management-economy]
created: 2026-07-02
updated: 2026-07-02
type: adr
binding: false
linear: [FMX-212, FMX-216]
supersedes:
superseded_by:
related:
  - [[../../60-Research/stadium-construction-expansion-models-2026-07-02]]
  - [[../../60-Research/raw-perplexity/raw-stadium-expansion-model-decision-2026-07-02|Raw capture — Stadium expansion model pressure-test (FMX-216)]]
  - [[../../60-Research/management-delegation-and-easy-mode-surfaces-2026-07-02]]
  - [[../../60-Research/off-pitch-parity-measurement-economy-loop-2026-07-02]]
  - [[../../60-Research/tier-parity-measurement-calibration-2026-07-01]]
  - [[../../60-Research/club-financing-tools-2026-06-01]]
  - [[../modules/stadium-operations]]
  - [[ADR-0135-tier-parity-and-assist-strength-calibration-contract]]
  - [[ADR-0136-delegation-to-staff-contract]]
  - [[ADR-0138-mode-state-placement-and-integrity]]
  - [[../../50-Game-Design/GD-0046-two-worlds-mode-model]]
  - [[ADR-0061-club-management-sub-aggregate-audit]]
  - [[ADR-0050-club-economy-accounting-ledger]]
  - [[ADR-0041-presentation-renderer-strategy]]
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[../../50-Game-Design/GD-0008-finance-economy]]
  - [[../../50-Game-Design/stadium-and-campus]]
  - [[../../50-Game-Design/progressive-disclosure-ui]]
  - [[../../20-Features/feature-stadium-builder]]
---

# ADR-0137: Stadium Construction and Expansion Contract

## Status

draft

Proposed for ratification by Nico. Phase rule: all ADRs are
`status: draft` / `binding: false`; nothing below carries implementation
authority until ratified. The ★-marked positions in
[§ Open forks](#open-forks-carried-with--recommendations) are
**recommendations, not decisions**.

## Date

2026-07-02

## Context

The binding Stadium Operations contract direction
([[ADR-0061-club-management-sub-aggregate-audit]] §Public contract direction,
transcribed in [[../modules/stadium-operations]]) covers the matchday
timeline, maintenance, venue events, pitch condition, compliance checks and
seat-class rebalancing — but contains **no command that adds capacity, builds
a module or rebuilds a stand**. The draft design layer presumes all of these:
capacity tiers, ≥ 8 attraction modules, a construction queue, ageing and
crash-build for promotion compliance
([[../../50-Game-Design/stadium-and-campus]] §2/§4/§6,
[[../../20-Features/feature-stadium-builder]] §MVP scope), and
`StadiumCommercialSnapshot` already promises "available capacity after
construction". The gap is confirmed verbatim by
[[../../60-Research/stadium-construction-expansion-models-2026-07-02]]
(Finding 1). This ADR closes it with a single construction/expansion contract.

Ratified frame this ADR encodes (not re-opened here):

- **D1 (2026-07-01):** three tiers internally (Quick/Standard/Expert), branded
  as two worlds (Easy = Quick+Standard, Pro = Expert).
- **D2 (2026-07-01):** mode/tier switchable anytime, everywhere — the stadium
  surface must never trap state in one tier.
- **D3 (2026-07-02):** bounded pro edge via a floor+cap envelope on a
  floor-normalized parity ratio; exact numbers explicitly open until the sim
  harness exists; the pro edge is confined to adaptation decision classes and
  Easy is never a dominated strategy.
- **D4 (2026-07-01):** the two-worlds split sweeps every decision-bearing
  management area — stadium construction included.
- **Easy tactic surface (2026-07-02):** native coarse dials/presets compiling
  deterministically into the same contract Pro writes; delegation is reserved
  for non-tactic areas. This ADR applies the identical compile-down pattern to
  the stadium area.

Boundary constraints carried over unchanged: Stadium Operations owns
physical/venue facts and lifecycles; Club Management is the sole ledger writer
([[ADR-0050-club-economy-accounting-ledger]]) and owns financing facilities
(FMX-49, [[../../50-Game-Design/GD-0008-finance-economy]] §FMX-49 amendment);
CommercialPortfolio owns naming-rights/sponsor contracts and ticketing
settlement ([[ADR-0061-club-management-sub-aggregate-audit]]). And the
standing design guard from [[../../50-Game-Design/stadium-and-campus]]:
venue operations have football, commercial and ledger consequences, but they
are **not a detached tycoon minigame** — every construction output must land
in the already-contracted snapshots that Match, CommercialPortfolio,
Audience & Atmosphere and Regulations consume.

Sibling FMX-212 Stage-2 records referenced below:
[[../../50-Game-Design/GD-0046-two-worlds-mode-model|GD-0046]] (the
two-worlds cover recording the D1–D4 / Easy-surface directions this ADR
encodes),
[[ADR-0135-tier-parity-and-assist-strength-calibration-contract|ADR-0135]]
(parity envelope & measurement harness, grounding
[[../../60-Research/tier-parity-measurement-calibration-2026-07-01]] and
[[../../60-Research/off-pitch-parity-measurement-economy-loop-2026-07-02]]),
[[ADR-0136-delegation-to-staff-contract|ADR-0136]] (delegation model &
consent ladder, grounding
[[../../60-Research/management-delegation-and-easy-mode-surfaces-2026-07-02]])
and [[ADR-0138-mode-state-placement-and-integrity|ADR-0138]] (mode-state
placement & integrity — the per-unit mode snapshot any labeling of
stadium-area autopilot use would read).

## Options Considered

All three options come from
[[../../60-Research/stadium-construction-expansion-models-2026-07-02]]
§Inputs For Decisions, including their full contract deltas.

### Option A — Simple upgrade path (MVP floor)

One linear capacity-tier ladder (the five tiers of
[[../../50-Game-Design/stadium-and-campus]] §2) plus a curated module list
with fixed cost/duration per step. No per-stand granularity; seat mix changes
only as a side effect of tier templates.

- **Contract delta:** commands `CommissionFacilityUpgrade(upgradeId,
  financingPlanRef?)`, `CancelFacilityUpgrade`; events
  `FacilityUpgradeCommissioned`, `FacilityUpgradeCompleted`,
  `StadiumCapacityTierChanged`; read model `UpgradeCatalogBoard`. Completion
  reuses `SeatClassInventoryRebalanced` + snapshot republish.
- **Ledger flow:** on commission — scheduled stage-payment cash obligations +
  capitalised construction-in-progress asset; on completion — CIP → facility
  asset, maintenance base raised (per the build-economics formulas in
  [[../../50-Game-Design/stadium-and-campus]] §6 /
  [[../../50-Game-Design/GD-0008-finance-economy]]). Financing optional as a
  single `FinancingFacility` drawdown reference.
- **Assessment:** smallest delta and fastest to first playable, but it
  reproduces Football Manager's criticised board-request passivity one level
  up (research Finding 4), never creates the D3-relevant expert decision
  classes, and a later move to a project model would break the command
  surface (`upgradeId` ladder → project spec).

### Option B — Construction-project FSM (tiered expansion)

Discrete, chunky projects — per-stand upgrade/rebuild, seat-mix conversion,
module build, renovation, foundation/new-stadium rebuild — each running a
deterministic construction FSM with duration, staged payments and temporary
capacity restrictions. Granularity: 4 stands + curated module slots
([[../../50-Game-Design/stadium-and-campus]] §9.1 prefers slot-based over
free placement), not plots.

- **Contract delta:** the full surface specified in [§ Decision](#decision)
  below.
- **Assessment:** delivers the three Anstoss fun-carriers — visible growth,
  legible per-element economics, per-stand identity — with the tycoon-lesson
  safeguards (few, chunky, interacting decisions; no FIFA-Manager toilet
  counts) and the construction-time pain the genre expects and We Are
  Football was criticised for missing (research Findings 2, 3, 5). Creates
  exactly the bounded adaptation-class decisions D3 confines the pro edge to.
  Largest near-term contract delta; FSM, restriction facts and the financing
  handshake must be specified before code.

### Option C — Plot-based Expert builder (post-MVP layer)

The "SimCity grid, plot pricing, blueprint optimisation" Expert surface from
[[../../50-Game-Design/progressive-disclosure-ui]] §3 /
[[../../50-Game-Design/stadium-and-campus]] §9.

- **Contract delta if layered correctly: near zero.** The builder is a
  planning/presentation layer whose blueprints compile into Option-B
  `CommissionConstructionProject` payloads (`projectSpec` gains an optional
  `plotAllocation` block; one additional command pair
  `ReserveGroundsPlot`/`ReleaseGroundsPlot` if plot scarcity is modelled).
  Any 2.5D/3D viewer stays read-model-only per
  [[ADR-0041-presentation-renderer-strategy]].
- **Assessment:** preserves the long-term club-architect fantasy as an
  Expert-world reward without forking the simulation, but free placement
  carries the documented busywork/balance traps (research Finding 5) and has
  zero MVP value. D3 guard: plot layout must be *expressive*, not *stronger*
  — blueprint compilation must not reach effect ranges unreachable from
  Standard templates.

## Decision

Proposed for ratification (★ of the stadium-expansion fork; see
[§ Open forks](#open-forks-carried-with--recommendations)):

**Ratify Option B's contract surface now as the single construction contract
for Stadium Operations. Option A ships as Option B's Quick-tier compile-down
(the stadium area's "coarse dial"). Option C stays a post-MVP planning layer
that compiles into Option B's commands.** One contract, three disclosure
depths, one simulation truth — the exact pattern already ratified for the
easy tactic surface. This closes the contract gap once and avoids an A→B
breaking change later.

The FMX-216 pressure-test does **not** re-open this fork — the B-now shape is
recommended unchanged — but ratification is recommended **with the Tier-1
contract corrections below baked in first** (they close a duplicate front door
against ADR-0050, add the single mandatory `PendingCommitment` solvency gate,
pin one progress clock, and replace §7's unpostable prose with a balanced
posting family). Everything here remains a **recommendation, not a decision**;
Nico ratifies.

### 1. Construction-project FSM

Aggregate `ConstructionProject` (per-club, per-project), owned by Stadium
Operations:

```text
Proposed → PendingCommitment → Committed → UnderConstruction(stage 0..n)
        → Commissioning → Completed
   PendingCommitment → Proposed        (CommitmentDeclined)
   {PendingCommitment | UnderConstruction | Commissioning} → Paused → (Resume)
   {any pre-Completed state}          → Cancelled
```

with `Paused` and `Cancelled` exits. Per-stage facts declare the capacity
restriction and matchday-cost deltas in force while that stage runs.

`PendingCommitment` is the single mandatory solvency/financing gate between
`Proposed` and `Committed` — see §2 (it is the ONE new state this pressure-test
adds; the set is otherwise held minimal, research Finding C). `SitePrep` is
**folded into `UnderConstruction` stage 0**; "SitePrep" survives only as a
read-model milestone label, not a distinct tick rule. `Completed` is the single
FSM-terminal state and doubles as the capitalisation trigger (§7); defects
liability / retention is a post-`Completed` attribute, not a state.

**Progress clock (single).** Forward progress is advanced by
**`EconomyWeekAdvanced` ticks only** — the sole progress clock. `SeasonAdvanced`
is demoted to a season-scoped re-derivation trigger (compliance windows,
catalogue re-pricing), never a progress edge. At the `Committed` edge the FSM
computes an **absolute `stageBoundaries[]` schedule deterministically**; each
weekly tick tests **boundary-crossing** against that schedule (NOT
accumulate-elapsed-per-tick). Byte-stability requires idempotent
boundary-crossing, not merely a `Date.now`-free clock — an accumulate-per-tick
counter is replay-fragile if any tick is re-applied. No `Date.now`; determinism
rules of ADR-0061 §Determinism apply unchanged. This keeps the tick-advanced
shape of the facility-decay saga ([[../modules/stadium-operations]] §Owns) and
still dodges the underspecified `AdvanceMatchdayTimeline` who-advances edge.

**Guard transitions are orthogonal to the clock.** `Pause`/`Resume`/`Cancel`,
and **auto-`Pause` on a consumed insolvency fact** (ADR-0101
`cash_flow_crisis` / administration, §7), are **event-driven guard
transitions**, not progress ticks. Within a single `EconomyWeekAdvanced` tick,
**guard/crisis transitions are processed BEFORE progress advance**, so a club
cannot accrue a stage payable on the same tick it goes insolvent-Paused.

### 2. Commands

`CommissionConstructionProject` is the **sole construction front door for
venue facilities** — this ADR scopes ADR-0050's `ScheduleFacilityProject`
away from venue facilities (see Supersedes and fork 7) so one aggregate in one
context drives the venue construction lifecycle (no dual-write).

- `CommissionConstructionProject(projectSpec{type: standUpgrade |
  seatMixConversion | moduleBuild | renovation | foundationRebuild, target,
  scope, urgencyFactor}, financingPlanRef?)`
- `PauseConstructionProject`
- `ResumeConstructionProject`
- `CancelConstructionProject`

`urgencyFactor` carries the crash-build lever already drafted in
[[../../50-Game-Design/stadium-and-campus]] §6/§10 (promotion compliance).

**`type: renovation` boundary (IAS-16 predicate).** A `renovation` that is an
enhancement or replacement of a component (capitalisable — it changes future
economic benefit) runs **this** construction FSM; a `renovation` that is mere
restoration to prior condition (day-to-day upkeep, expensed) is **not** a
construction project and belongs to the existing 2-state
`ScheduleMaintenanceProject` lifecycle ([[../modules/stadium-operations]]).
The enum keeps `renovation` only under this predicate; anything failing the
capitalise test is routed to maintenance, not commissioned here.

**`moduleBuild` identity/mood effects are first-class.** A `moduleBuild`
project carries **identity / mood / atmosphere effect outputs** as a
structured `moduleBuild` result (consumed by Audience & Atmosphere and
CommercialPortfolio), not a flattened capacity/€ delta. The named identity
catalogue lives in [[../../50-Game-Design/stadium-and-campus]] §4 (referenced,
not enumerated here) so the contract stays a contract.

**Commitment handshake (mandatory for EVERY commission).** Confirmation is
mandatory whether or not a `financingPlanRef` is present. A commission enters
`PendingCommitment` on issue and only reaches `Committed` on confirmation:

- **Financed** (`financingPlanRef` present): Club Management confirms the
  facility drawdown — Customer-Supplier with ACL on both sides; Stadium
  Operations never evaluates creditworthiness and Club Management never mutates
  project state.
- **Self-funded** (no ref): Club Management confirms the multi-season stage
  schedule is solvent against `CashflowRunwayForecast`. This closes the
  ungated-self-funded run-ender and the commission→take-capacity→cancel
  exploit.
- **Decline:** a failed check routes `PendingCommitment → Proposed`
  (`ConstructionCommitmentDeclined`) and emits a fact the wizard surfaces
  (§5), so a broke club's Quick commission never dead-ends silently.

**Guard command source-states + ledger effects:**

- `PauseConstructionProject` — legal from `PendingCommitment`,
  `UnderConstruction`, `Commissioning`; suspends progress, **persists the
  active capacity restriction** and a resume pointer; stops scheduling further
  stage payables.
- `ResumeConstructionProject` — legal only from `Paused`; restores progress
  from the persisted pointer.
- `CancelConstructionProject` — legal from any pre-`Completed` state; triggers
  the write-off posting (§7). **Cancel-from-`Commissioning` is an open
  sub-fork** (force-complete-and-capitalise vs sunk-cost write-off — fork 9).

Planning / `EffectiveRuleSet` compliance is a guard on the **`→ Committed`
edge** (a commission that violates the effective rule set is declined at the
commitment gate, not mid-build).

### 3. Events

- `ConstructionProjectCommissioned` — enters `Proposed` / `PendingCommitment`;
  schedules **nothing** on the ledger.
- `ConstructionProjectCommitted` — **NEW**; financing/solvency confirmed. This
  is the first ledger-scheduling edge (the absolute `stageBoundaries[]` are
  computed here, §1).
- `ConstructionCommitmentDeclined` — **NEW**; the `PendingCommitment → Proposed`
  edge, carrying a surfaced reason (§5).
- `ConstructionProjectStageReached`
- `ConstructionCapacityRestrictionChanged` — consumed by CommercialPortfolio
  (ticketing/season-ticket inventory) and Audience & Atmosphere (utilisation);
  see §5 disruption model.
- `ConstructionProjectPaused` / `ConstructionProjectResumed` — **NEW**; consumed
  by CommercialPortfolio (season-ticket inventory) and Audience & Atmosphere,
  because a frozen rebuild keeps seats offline for the duration.
- `ConstructionProjectCompleted`
- `ConstructionProjectCancelled`
- `FacilityAssetCommissioned` — consumed by the Club Management ledger via
  ACL, the ADR-0050 pattern; the construction sibling of
  `StadiumCommercialSnapshotPublished`.

The Stadium-lifecycle vs Club-Management-posting boundary holds: the **lifecycle
events** above live here; the **balanced posting events** (§7) belong to
ADR-0050 and are added there via apply-pass. `StadiumRng` draw keys must now
include `projectId` — `StadiumRng(saveId, clubId, week, projectId)` — so the
deferred seeded-variance seam (§6) cannot collide draws across concurrent
projects.

### 4. Read models and consumed facts

- **New read model:** `ConstructionProjectBoard` — project queue, stages,
  active restrictions, payback projection.
- **Canonical next-best-upgrades query:** a deterministic query over the
  curated project/template catalogue that returns **1–3 ranked project
  cards** (project + timing + one pre-selected financing plan + previewed
  restriction). This query is a **contract property, not a UI feature**: it
  is simultaneously the Quick wizard's data source, the enumeration surface
  the parity harness optimizes over (§6), and the proposal source for any
  delegated facilities role (§7). Required by both
  [[../../60-Research/management-delegation-and-easy-mode-surfaces-2026-07-02]]
  §stadium input and
  [[../../60-Research/off-pitch-parity-measurement-economy-loop-2026-07-02]]
  §stadium fork. **Cadence is "quiet by default":** the query surfaces cards at
  meaningful moments (cash surplus, promotion/compliance deadline, decay past
  threshold), not on every `EconomyWeek` — construction is a rare, chunky
  decision, not weekly nag.
- **Stage obligations are first-class liabilities.** Committed stage payments
  appear in `LiabilitySchedule` and `CashflowRunwayForecast`, and a
  construction-capital bucket in `OverduePayablesAging`, so an in-flight build
  is visible to the solvency surfaces that gate new commissions (§2) and to the
  crisis machinery (§7).
- **Existing snapshots:** `StadiumCapacitySnapshot` /
  `StadiumCommercialSnapshot` derive their already-promised "available
  capacity after construction" from real `ConstructionProject` state instead
  of a placeholder.
- **Consumed facts:** `EffectiveRuleSet` (promotion/crash-build compliance,
  all-seater conversion rules), `SeasonAdvanced`, `EconomyWeekAdvanced`, plus
  the financing-approval fact from Club Management described in §2.

### 5. Tier surfaces (the load-bearing dual-mode part)

Identical to the ratified easy-tactic compile pattern — every tier writes the
**same `CommissionConstructionProject` command**:

- **Quick:** the build wizard over **3–5 curated project templates** (final
  count/aggressiveness mapping is an open fork). It renders the canonical
  next-best-upgrades query as 1–3 ranked project cards with one pre-selected
  financing plan; accept/decline/defer. **The card previews payoff AND growth,
  not only the restriction** — capacity delta, revenue delta, identity/mood
  delta and a before/after visual sit alongside the restriction-pain preview
  (§6), so the wizard sells the upside symmetrically to the pain. On a
  `ConstructionCommitmentDeclined` (§2) it surfaces a legible reason instead of
  a silent failure. The accepted card compiles deterministically into a real
  `CommissionConstructionProject`. This *is* Option A's experience, delivered as
  Option B's compile-down.
- **Standard (the Anstoss sweet spot).** Standard is the "watch-it-grow /
  arrange-your-identity-buildings" heart of the Easy world (Easy = Quick +
  Standard), not a thin preset pass: explicit growth affordances (phase a
  stand, watch capacity climb) and identity-arrangement affordances (place and
  compose identity/mood modules on the tile map, §2), seat-mix presets and 2–3
  financing presets — all still the same one command.
- **Expert:** composes phased multi-stand programmes, seat-mix ratios inside
  the compliance envelope, financing mixes, and pause/resume/cancel calls.

D2 consequence: because all tiers write one command against one aggregate,
switching tier mid-project migrates **nothing** — a project commissioned from
the Quick wizard is pausable from Expert and vice versa.

### 6. Construction disruption (★ NEW-construction-disruption, option b)

Projects impose a **deterministic per-stage capacity restriction**, published
as `ConstructionCapacityRestrictionChanged`. The restriction is what makes
construction a *decision* rather than a purchase (research Finding 3: real
clubs and Anstoss both priced construction pain; WAF's instant builds were a
criticised genre miss). Guard for the Easy world: the Quick wizard card
**must preview the restriction** before commit (IP-clean example:
"SV Blaukessel, Nordkurve rebuild: −4,000 seats for 30 weeks") so Easy
players are never surprised. This restriction **persists while `Paused`** — a
half-demolished stand keeps its seats offline until the project resumes and
completes, so pausing is a real cost, not a free hold. The payoff-preview
requirement (§5, capacity + revenue + identity/mood delta) **mirrors** this
restriction-preview requirement: the Quick card shows both faces of the
decision, symmetrically. A seeded-variance extension (delay/incident events via
the per-project `StadiumRng` key, §3, ADR-0018 §3) can arrive later **without
contract changes** — option c of the fork, deferred.

### 7. Ledger and financing (Club Management via ACL, double-entry)

Per [[ADR-0050-club-economy-accounting-ledger]] /
[[ADR-0061-club-management-sub-aggregate-audit]] — Stadium Operations posts
nothing itself; Club Management posts on consumed facts. §7's earlier prose is
replaced by a **named, balanced, ADR-0106-coded posting family** (ADR-0095
requires balanced ≥2-line postings with ADR-0106 account codes; prose is
literally unpostable, and ADR-0050 currently carries no facility-capital
posting event — only `RegistrationAmortisationPosted`). This family is added to
ADR-0050 via apply-pass, mirroring `TransferFeeCapitalised` /
`RegistrationAmortisationPosted`:

- **`ConstructionInProgressAccrued`** — posted on `ConstructionProjectStageReached`
  (work performed): `Dr asset.ppe.construction_in_progress /
  Cr liability.construction_payable`. **Retention** is booked as a *separate*
  payable, releasable at defects-liability end (post-`Completed`), not netted
  into the main payable.
- **`FacilityAssetCommissioned`** — the CIP → PPE **reclass at
  available-for-use**, fired on `Commissioning → Completed`:
  `Dr asset.ppe.facilities / Cr asset.ppe.construction_in_progress`. `Completed`
  is the single capitalisation trigger (§1). Maintenance base and the
  ageing-decay curve re-base per [[../../50-Game-Design/stadium-and-campus]] §6.
- **`ConstructionAssetWrittenOff`** — on cancel:
  `Dr expense.impairment.sunk_construction / Cr asset.ppe.construction_in_progress`.
- **Cost boundary:** capitalise only **directly-attributable** cost; admin and
  abnormal cost is expensed as incurred.
- **Crash-build:** `urgencyFactor` posts the premium cost drafted in the GD
  build-economics formulas (directly attributable → capitalised).

**Depreciation (open sub-fork 8 — name the treatment).** ★ default:
**facilities held at cost; ageing modelled as maintenance OPEX; no book
depreciation at MVP**, with a post-MVP `FacilityDepreciationPosted` (periodic
non-cash) seam. The alternative — a real depreciation line now — is a genuine
FFP-fidelity call (P&L is read by licence checks; no-depreciation inflates
going-concern), so the treatment is **named, not left implicit**.

**Construction-period interest (IAS-23, IFRS-lite divergence).** Interest on
construction financing is **expensed immediately**, NOT capitalised into CIP.
This is a deliberate simplification of IAS-23's capitalise-borrowing-cost rule,
consistent with GD-0008's playable IFRS-lite posture; stated so the divergence
is honest.

**Financing (open fork 2, reframed onto FMX-49 subtypes).** First playable
reuses the FMX-49 `FinancingFacility` layer **unchanged** (bank loan / board
support / restructuring fund construction like anything else,
[[../../50-Game-Design/GD-0008-finance-economy]] §FMX-49,
[[../../60-Research/club-financing-tools-2026-06-01]]). Post-MVP expansion:

- **Fananleihe** = an FMX-49 `FinancingFacility` **archetype** (not a new
  vehicle) — strong German-identity fit, doubles as an Audience & Atmosphere
  mood lever; realistic issue band **~€5–50m** (see appendix outliers).
- **Naming-rights advance** = `SponsorAdvanceAccepted` (existing FMX-49
  sponsor-advance pattern) **plus** a CommercialPortfolio **IFRS-15
  deferred-income liability** that unwinds over the contract term (cash in +
  liability up; it is never free cash). Naming-rights / seat-licence cash always
  arrives as CommercialPortfolio contract events, never as Stadium postings.
- **Scope choice recorded (not a realism claim):** a ring-fenced stadium SPV /
  project-finance vehicle is **out of scope** because we reuse FMX-49 facilities
  rather than add a new financing context — **NOT** because covenants are
  "incompatible with IFRS-lite" (they are not: FMX-49 already models
  `FinancingCovenantBreached`). Adding an SPV is a bounded-context scope
  decision for Nico, not a fidelity blocker.

**Auto-`Pause` on crisis.** A club that enters ADR-0101 `cash_flow_crisis` /
administration **force-`Pause`s** its active projects (§1 guard transition,
processed before progress advance) so it stops drawing further stage payments.
A large mid-build cancellation may trigger CIP impairment and treats the
contractor as a creditor (ADR-0101 interaction — see Consequences).

### 8. Parity and D3 properties (contract-level, per ADR-0135)

Stadium construction scenarios join the parity harness defined by
[[ADR-0135-tier-parity-and-assist-strength-calibration-contract|ADR-0135]]
(grounded in [[../../60-Research/tier-parity-measurement-calibration-2026-07-01]]
and [[../../60-Research/off-pitch-parity-measurement-economy-loop-2026-07-02]]):

- **Finite canonical decision enumeration is a contract property.** The
  project/template catalogue × timing × financing-instrument space stays
  enumerable, and the canonical next-best-upgrades query (§4) is its
  enumeration surface. This is what keeps the stadium parity cell
  **optimum-relative** (a fixed-budget optimizer anchor is feasible here,
  unlike transfers/scouting — off-pitch research Finding 8 and per-area
  matrix); a model change that breaks enumerability silently downgrades the
  D3 claim in this area and therefore requires a superseding ADR.
- **No Expert-exclusive buildings, and no strictly-better seat-mix
  reachability from Expert-only inputs.** The pro edge lives in adaptation
  decision classes only: timing against promotion-compliance windows,
  pausing/re-phasing under cash stress, financing-mix reaction to rate or
  covenant events — never in degrading the wizard's static picks.
- **The Quick wizard is the parity floor for this area:** its recommended
  projects must be near-frontier inside the D3 envelope, measurable against
  the harness anchors. Exact envelope numbers stay open per D3 until the sim
  harness exists.
- **Dominance watch:** hospitality's outsized revenue share (5–15% of
  capacity carrying ~40–60% of matchday revenue, research Finding 7) is the
  single most dominance-prone lever; Expert-only hospitality granularity is
  capped or mirrored by a wizard preset.
- **Identity/mood effect channel is parity-safe.** The new first-class
  identity/mood/atmosphere outputs of `moduleBuild` (§2) are capped and mirrored
  exactly like hospitality: no Expert-exclusive identity effect **strength** —
  Expert may compose more expressively, but cannot reach an identity/mood
  effect magnitude unreachable from Standard's identity-arrangement presets.

### 9. Delegation interplay (per ADR-0136)

Stadium is a non-tactic area, so the ratified line "delegation reserved for
non-tactic areas" applies, with the shape governed by the (open) delegation
fork of [[ADR-0136-delegation-to-staff-contract|ADR-0136]]. This contract constrains the interplay only as follows:
whatever consent ladder lands, the delegated facilities role **proposes
`CommissionConstructionProject` via the same canonical query** (§4) — it
issues real contract commands, never a parallel build path — with
Quick-tier defaulting to "delegate proposes, player confirms" (consistent
with the Auto-Coach proposes-never-overwrites guarantee) and any full-auto
setting confined to an explicit player-set budget envelope
([[../../60-Research/management-delegation-and-easy-mode-surfaces-2026-07-02]]
§stadium input; recommendation, not a decision — the ladder itself is
ADR-0136's fork).

## Rationale

- **Genre evidence converges on Option B's shape.** Anstoss 3's stadium
  builder — the vault's flagship differentiator reference — earned its
  longevity through visible growth, legible per-element economics and
  identity buildings, not free-form placement depth; FM's board-request model
  is the documented anti-pattern; WAF was criticised precisely for missing
  build time; tycoon design analyses locate busywork in non-interacting
  parameter counts (research Findings 2–5). Option B keeps decisions few,
  chunky and interacting.
- **One contract, three disclosure depths.** Shipping Option A as B's Quick
  compile-down mirrors the ratified easy-tactic pattern, gives the Easy world
  a genuinely coarse surface (Anstoss solved easy stadium with surface
  design, not delegation — delegation research Finding 7), and leaves no
  second simulation path to balance. Deferring C as a compile-to-B layer
  preserves the Expert fantasy without forking the sim, gated on the first
  stadium prototype proving the depth is fun (the same gate
  [[../../50-Game-Design/stadium-and-campus]] §11 applies to manual venue
  booking).
- **The tick-advanced deterministic FSM** matches the existing facility-decay
  saga, keeps replay/determinism guarantees intact, and dodges the
  known `AdvanceMatchdayTimeline` underspecification pattern.
- **Boundary fidelity.** Every flow lands in existing ownership: ledger
  postings in Club Management (ADR-0050), financing in FMX-49 facilities,
  naming-rights in CommercialPortfolio, rules in `EffectiveRuleSet`. "Not a
  detached tycoon minigame" is enforced structurally because construction
  outputs only reach the game through the already-consumed snapshots.
- **D3/D4 fit.** The contract is written so the parity properties (§8) are
  checkable by harness, not by hope: enumerable decision space,
  optimizer-anchored parity cell, adaptation-only pro edge, wizard-as-floor.

## Consequences

Positive:

- The confirmed contract gap closes once, with no A→B breaking change ever
  needed; `StadiumCommercialSnapshot`'s "available capacity after
  construction" promise becomes backed by real state.
- All three tiers and any delegated agent write one command surface; D2
  tier-switching migrates nothing.
- The stadium parity cell keeps optimum-relative claim strength (the
  strongest honest D3 wording available off-pitch).
- Financing, disruption and the Expert builder each have a pre-planned
  extension seam that requires no contract change (post-MVP instruments;
  seeded-variance incidents via `StadiumRng`; `plotAllocation` +
  `ReserveGroundsPlot`/`ReleaseGroundsPlot`).

Negative / follow-ups:

- Largest near-term contract delta of the near-term options: FSM stage
  semantics, restriction facts, the financing-approval handshake and the
  curated template catalogue must all be specified before code.
- New cross-context choreography: Club Management (drawdown confirmation +
  ledger ACL), CommercialPortfolio and Audience & Atmosphere
  (restriction consumption), Regulations (crash-build windows).
- On acceptance, [[../modules/stadium-operations]], the bounded-context map
  row and the state-machine note need an apply-pass to transcribe this
  surface (index/module updates are a later stage; this ADR modifies no
  existing note).
- **ADR-0050 apply-pass required:** add the construction posting family
  (`ConstructionInProgressAccrued`, `FacilityAssetCommissioned`,
  `ConstructionAssetWrittenOff`, optional `FacilityDepreciationPosted`) and the
  `PendingCommitment → Committed` choreography (solvency/drawdown confirmation)
  to ADR-0050. This ADR no longer "amends nothing" (see Supersedes).
- **Thin-Expert-at-MVP risk (fork 10):** with Option C deferred, the Expert
  stadium surface at MVP risks reading as "Standard plus more dialogs and
  accounting" over the same toys. Recommend at least one *expressive-not-stronger*
  Expert-MVP affordance (name-your-stand / phased mega-project visualisation /
  curated identity-module composition); named as a risk + open sub-fork, not a
  UI spec here.
- **Auto-`Pause`-on-crisis cross-context interaction (ADR-0101):** a
  force-paused or cancelled mid-build turns the contractor into a creditor and
  may require CIP impairment on a large cancellation — new choreography between
  Stadium Operations, Club Management and the ADR-0101 crisis machinery.
- Demand-model fidelity is the risk on the optimizer-anchor claim
  (off-pitch research, per-area matrix) — the parity cell's claim strength is
  conditional and owned by the ADR-0135 harness work.
- The curated template catalogue and the calibration bands below need
  economy-runbook soak evidence before any number is final (GD-0008 "ranges
  and formulas beat final constants").

## Open forks (carried with ★ recommendations)

Each ★ is the research corpus's recommendation, **not a decision**; Nico
ratifies.

1. **Stadium expansion model (this ADR's primary fork).** ★ Option B contract
   surface now; Option A as B's Quick compile-down; Option C post-MVP
   compile-to-B layer (the §Decision proposal).
2. **NEW-construction-financing.** ★ (a) FMX-49 facilities unchanged for
   first playable; (b) Fananleihe (FMX-49 `FinancingFacility` archetype,
   ~€5–50m) + naming-rights advance (`SponsorAdvanceAccepted` + IFRS-15
   deferred-income liability) as the first post-MVP expansion; (c) a ring-fenced
   stadium SPV / project-finance vehicle left **out of scope as a bounded-context
   choice** (reuse FMX-49 rather than add a financing context) — **not** an
   IFRS-lite realism blocker (FMX-49 already models `FinancingCovenantBreached`).
3. **NEW-construction-disruption.** ★ (b) deterministic per-stage capacity
   restriction at MVP, previewed on the Quick wizard card; (c) seeded-variance
   incidents later via `StadiumRng`, no contract change.
4. **Quick-wizard preset count / aggressiveness mapping.** 3–5 curated
   templates is the working shape; final count and how template
   aggressiveness maps across tiers is open (shared fork with the tactic
   preset-count question).
5. **Delegation model shape + consent ladder (ADR-0136's fork).** Stadium
   input: ★ proposal-based delegation at Quick ("delegate proposes, player
   confirms"), full-auto only inside an explicit budget envelope.
6. **Parity band numbers for the stadium cell.** Open per D3 until the sim
   harness exists; ★ the cell is declared `anchorClass: optimizer`
   (conditional on demand-model fidelity) per the off-pitch research's
   declared-anchor-class recommendation.
7. **`ScheduleFacilityProject` disposition (NEW).** Full retire vs
   scope-to-non-venue-facilities (training / youth / medical keep a lighter
   path, venue construction goes through this FSM). ★ **scope-to-non-venue** as
   default — whether non-venue builds should eventually share this FSM is
   Nico's bounded-context call.
8. **Facility depreciation treatment (NEW).** Name-the-simplification
   (facilities held at cost; ageing = maintenance OPEX; no book depreciation at
   MVP) vs add a real `FacilityDepreciationPosted` line now. ★
   **name-the-simplification + post-MVP seam.** Genuine FFP-fidelity-vs-scope
   call (P&L is read by licence checks); evidence cannot settle it.
9. **Cancel-from-`Commissioning` ledger semantics (NEW).** A project cancelled
   while in `Commissioning` is essentially available-for-use imminent —
   force-complete-and-capitalise vs sunk-cost write-off. Undecided; affects
   whether the asset ever reaches PPE.
10. **Expert-MVP expressive affordance (NEW).** Require ≥1
    expressive-not-stronger Expert-MVP affordance (name-your-stand / phased
    mega-project visualisation / curated identity-module composition) in MVP
    scope, or accept thin-Expert-at-MVP and rely on deferred Option C? Adds
    scope — Nico's call.

## Supersedes

This ADR **scopes** [[ADR-0050-club-economy-accounting-ledger]]'s
`ScheduleFacilityProject` / `FacilityProjectCommitted` away from **venue
facilities** (`CommissionConstructionProject` is the sole venue construction
front door, §2), and **adds the construction posting family** (§7) to ADR-0050
via apply-pass — it no longer "amends nothing." The precise disposition of
`ScheduleFacilityProject` (full retire vs scope to non-venue facilities) is
open fork 7. It otherwise **extends** the ADR-0061 Stadium Operations contract
surface (ratified Option C context) with the construction/expansion slice it
lacked.

## Related Docs

- [[../../60-Research/stadium-construction-expansion-models-2026-07-02]] —
  evidence base (options, contract deltas, calibration bands)
- [[../../60-Research/management-delegation-and-easy-mode-surfaces-2026-07-02]]
  — easy-surface + delegation inputs
- [[../../60-Research/off-pitch-parity-measurement-economy-loop-2026-07-02]] —
  parity feasibility matrix, enumerability requirement
- [[../modules/stadium-operations]] — current contract this ADR extends
- Same FMX-212 wave:
  [[../../50-Game-Design/GD-0046-two-worlds-mode-model|GD-0046]] (two-worlds
  cover) ·
  [[ADR-0135-tier-parity-and-assist-strength-calibration-contract|ADR-0135]]
  (parity envelope, §8) ·
  [[ADR-0136-delegation-to-staff-contract|ADR-0136]] (delegation interplay,
  §9) ·
  [[ADR-0138-mode-state-placement-and-integrity|ADR-0138]] (mode-state
  placement & integrity)
- [[ADR-0061-club-management-sub-aggregate-audit]] ·
  [[ADR-0050-club-economy-accounting-ledger]] ·
  [[../../50-Game-Design/GD-0008-finance-economy]] ·
  [[../../50-Game-Design/stadium-and-campus]] ·
  [[../../20-Features/feature-stadium-builder]]

## Appendix — real-world calibration bands (reference-relative)

Anchors from
[[../../60-Research/stadium-construction-expansion-models-2026-07-02]]
(Findings 6–7). These are **believability envelopes for the template
catalogue, not final constants** — every number is reference-relative and
subject to economy-runbook soak evidence and Nico's sign-off (GD-0008
posture). Confidence per the research note: high for named projects, medium
for aggregated bands.

| Project class | Capacity step | Duration band | Cost band |
|---|---|---|---|
| Minor (corner infill, rail seating, module) | +1–3k | ~0.5–1 season | — |
| End-stand project | +3–7k | ~1.5–2 seasons | ~€2–4k / added seat (simple GA) |
| Major side stand | +5–10k | ~2–3 seasons | ~€3–6k / seat (with boxes), €6–10k (hospitality "super stand") |
| Foundation / new-stadium rebuild | +10–30k | ~3–5 seasons | ~€4–15k / seat by market |

Mix ratios: hospitality typically 5–15% of capacity carrying ~40–60% of
matchday revenue (premium seats yield ~5–10× a standard ticket); safe
standing packs ~1.6× seated density (Dortmund Südtribüne domestic-vs-UEFA
configuration); traditional German grounds run ~20–35% standing (top flight)
to 30–50% (second tier) — league/UEFA standing↔seating conversion arrives via
`EffectiveRuleSet`. Real-project anchors: Liverpool Main Stand +8,500 seats
in ~20–21 months; Anfield Road Stand +7,000–7,800 in ~24–30 months; Tottenham
Hotspur Stadium and the Bernabéu rebuild ~3–5 years, played through at
reduced/altered capacity — the precedent for §6's restriction model.

**Fananleihe / fan-financing anchors (§7).** Realistic issue band **~€5–50m**,
wider than the earlier ~€5–25m draft. Named outliers: FC St. Pauli's Millerntor
cooperative fan-financing ~€27–29m, Schalke 04's fan bond ~€50m — the upper end
is a cooperative/large-issue case, not the median. These are reference-relative
believability anchors for the FMX-49 `FinancingFacility` Fananleihe archetype,
not final constants.
