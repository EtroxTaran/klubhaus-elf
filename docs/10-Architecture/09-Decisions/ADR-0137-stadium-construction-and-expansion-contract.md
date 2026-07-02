---
title: ADR-0137 Stadium Construction and Expansion Contract
status: draft
tags: [adr, architecture, ddd, stadium-operations, club-management, construction, expansion, financing, dual-mode, fmx-212]
context: [stadium-operations, club-management-economy]
created: 2026-07-02
updated: 2026-07-02
type: adr
binding: false
linear: FMX-212
supersedes:
superseded_by:
related:
  - [[../../60-Research/stadium-construction-expansion-models-2026-07-02]]
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

### 1. Construction-project FSM

Aggregate `ConstructionProject` (per-club, per-project), owned by Stadium
Operations:

```text
Proposed → Committed → SitePrep → UnderConstruction(stage 1..n)
        → Commissioning → Completed
```

with `Paused` and `Cancelled` exits. Per-stage facts declare the capacity
restriction and matchday-cost deltas in force while that stage runs.

The FSM is advanced by **`SeasonAdvanced` / `EconomyWeekAdvanced` ticks with
deterministic clocks, not by player commands** — the same rule as the
facility-decay saga ([[../modules/stadium-operations]] §Owns), deliberately
avoiding an `AdvanceMatchdayTimeline`-style underspecified who-advances edge
(that command's per-edge actor/clock gap is a documented open item of the
existing contract). No `Date.now`; determinism rules of ADR-0061 §Determinism
apply unchanged.

### 2. Commands

- `CommissionConstructionProject(projectSpec{type: standUpgrade |
  seatMixConversion | moduleBuild | renovation | foundationRebuild, target,
  scope, urgencyFactor}, financingPlanRef?)`
- `PauseConstructionProject`
- `ResumeConstructionProject`
- `CancelConstructionProject`

`urgencyFactor` carries the crash-build lever already drafted in
[[../../50-Game-Design/stadium-and-campus]] §6/§10 (promotion compliance).
A commission carrying a `financingPlanRef` only enters `Committed` once Club
Management confirms the facility drawdown — Customer-Supplier with ACL on
both sides; Stadium Operations never evaluates creditworthiness and Club
Management never mutates project state.

### 3. Events

- `ConstructionProjectCommissioned`
- `ConstructionProjectStageReached`
- `ConstructionCapacityRestrictionChanged` — consumed by CommercialPortfolio
  (ticketing/season-ticket inventory) and Audience & Atmosphere (utilisation);
  see §5 disruption model.
- `ConstructionProjectCompleted`
- `ConstructionProjectCancelled`
- `FacilityAssetCommissioned` — consumed by the Club Management ledger via
  ACL, the ADR-0050 pattern; the construction sibling of
  `StadiumCommercialSnapshotPublished`.

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
  §stadium fork.
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
  financing plan; accept/decline/defer. The accepted card compiles
  deterministically into a real `CommissionConstructionProject`. This *is*
  Option A's experience, delivered as Option B's compile-down.
- **Standard:** project templates on the tile map, seat-mix presets, 2–3
  financing presets — still template-driven, still the same command.
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
players are never surprised. A seeded-variance extension (delay/incident
events via the existing `StadiumRng` sub-label, ADR-0018 §3) can arrive later
**without contract changes** — option c of the fork, deferred.

### 7. Ledger and financing (Club Management via ACL, double-entry)

Per [[ADR-0050-club-economy-accounting-ledger]] /
[[ADR-0061-club-management-sub-aggregate-audit]] — Stadium Operations posts
nothing itself; Club Management posts on consumed facts:

- **Commission/stages:** stage payments as scheduled obligations per stage
  (double-entry: cash/payables ↔ construction-in-progress asset).
- **Completion:** CIP capitalises to a facility asset
  (`FacilityAssetCommissioned`); maintenance base and the ageing-decay curve
  re-base per [[../../50-Game-Design/stadium-and-campus]] §6.
- **Cancellation:** CIP write-off (sunk-cost posting).
- **Crash-build:** `urgencyFactor` posts the premium cost drafted in the GD
  build-economics formulas.
- **Financing (★ NEW-construction-financing):** first playable reuses the
  FMX-49 `FinancingFacility` layer **unchanged** (bank loan / board support /
  restructuring fund construction like anything else,
  [[../../50-Game-Design/GD-0008-finance-economy]] §FMX-49,
  [[../../60-Research/club-financing-tools-2026-06-01]]). First post-MVP
  financing expansion: stadium-flavoured instruments — **Fananleihe** fan
  bond (strong German-identity fit, real ~€5–25m scale, doubles as an
  Audience & Atmosphere mood lever) and **naming-rights advance**
  (CommercialPortfolio contract fact + Club Management liquidity action, the
  FMX-49 sponsor-advance hybrid pattern). **Rejected and recorded:** a
  dedicated project-finance vehicle with covenant semantics — incompatible
  with GD-0008's "playable IFRS-lite" posture. Naming-rights/seat-licence
  cash always arrives as CommercialPortfolio contract events, never as
  Stadium postings.

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
   first playable; (b) Fananleihe + naming-rights advance as the first
   post-MVP expansion; (c) project-finance vehicle rejected as
   IFRS-lite-incompatible.
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

## Supersedes

None. This ADR **extends** the ADR-0061 Stadium Operations contract surface
(ratified Option C context) with the construction/expansion slice it lacked;
it amends nothing already defined there.

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
