---
title: League↔Regulations fixture/competition eligibility hand-off (FMX-74)
status: current
tags: [research, league, regulations, compliance, eligibility, handoff, contracts, determinism, gap-g1, fmx-74, risk-legal]
created: 2026-06-03
updated: 2026-06-03
type: research
binding: false
linear: FMX-74
sourceType: external
related:
  - [[raw-perplexity/raw-league-regulations-eligibility-handoff-2026-06-03]]
  - [[../10-Architecture/09-Decisions/ADR-0069-league-regulations-eligibility-handoff]]
  - [[../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]]
  - [[../10-Architecture/09-Decisions/ADR-0066-competition-registry-sub-aggregate]]
  - [[../10-Architecture/09-Decisions/ADR-0068-fixture-scheduling-contract]]
  - [[../10-Architecture/bounded-context-map]]
  - [[regulations-compliance-bounded-context-2026-05-28]]
  - [[../50-Game-Design/GD-0009-league-structure]]
  - [[../50-Game-Design/regulations-and-compliance]]
---

# League↔Regulations fixture/competition eligibility hand-off (FMX-74)

## Question

ADR-0056 makes **Regulations & Compliance** the sole owner of the versioned rule
catalog, the transfer-window FSM and the `EffectiveRuleSet` snapshot, exposed via
Open Host Service + Published Language; ADR-0066/0068 gave League Orchestration a
schedulable competition registry + fixtures. But **how does a scheduled competition
invoke the rules** — which Regulations queries fire, at which lifecycle points, with
what failure semantics — *without a cross-context join*, and how is the verdict
replay-safe against the immutable per-save snapshot? (gap **G1** remediation, the
League side of the eligibility contract; `risk:legal`-adjacent.)

## Summary

Decision-ready and **ratified live by Nico (2026-06-03)**:

- **The hand-off covers three of the five real-world gates** at *scheduling/lifecycle*
  time: club **admission**, **promotion compliance**, and **squad-registration**
  awareness. Matchday eligibility (suspensions/cup-tie/cut-off) stays **Match**-owned
  (ADR-0056 `MatchLineupLocking`); transfer eligibility stays **Transfer**-owned.
- **Orchestration shape (D1=A):** the scheduling-time gate is a **stateless
  Eligibility Policy (domain service) inside League Orchestration** — it reads the
  `EffectiveRuleSet` snapshot, fans out synchronous Regulations queries, and returns a
  composite verdict. It is **not** a Saga (no durable cross-time state, no
  compensation — calling it a Saga would be an overreach per Vernon). The genuinely
  stateful **promotion-compliance** check folds into ADR-0066's already-ratified
  **Pyramid-rollover Process Manager**.
- **MVP-mandatory checks (D2=B):** MVP mandates **(a)** resolving + reading the
  save-creation `EffectiveRuleSet` snapshot + the hand-off contract, AND **(b)
  `SquadRegistrationCheck`** (a single league still enforces a 25-man /
  homegrown-style registration at season start). `LicenceTierCompliance`,
  FFP-at-competition and promotion-compliance are **named reserved hooks**, inert at
  single-tier MVP. Squad & Player is the registration-fact source (queried, never
  joined).
- **Failure semantics (D3=A): severity-tagged.** Mandatory breach **hard-blocks** the
  scheduling/registration command (no `FixturesPublished`; replay-safe rejection);
  advisory breach **warns-and-proceeds** with an advisory event; conditional cases
  enter a **quarantine/provisional** state (maps to the GDDR crash-build /
  special-permit / ground-share / refuse chain).
- **Promotion gate (D4=A):** promotion/relegation **routes through Regulations
  `LicenceTierCompliance`** (called by the Pyramid-rollover PM before confirming
  promotion), per ADR-0056's stated boundary + real-world ground-grading. Reserved
  hook at MVP (single tier → no promotion data).
- **Determinism:** every verdict is a **pure function of (command input, aggregate
  state, `ruleSetVersion`)** over the immutable snapshot → replay-safe by
  recomputation; persist a verdict only with `ruleSetVersion` + input hash. No live
  read of the mutable global catalog (ADR-0056 + ADR-0051 rule).

## Inputs (vault, binding/relevant)

- **ADR-0056** (accepted, `risk:legal`): Regulations owns the catalog + window FSM +
  `EffectiveRuleSet`; exposes `EligibilityForTransfer` / `SquadRegistrationCheck` /
  `LicenceTierCompliance` / `FfpRatioCheck` / `CurrentTransferWindow` /
  `EffectiveRuleSet` read models. **Explicitly** (lines 310-312): "promotion compliance
  orchestration — League Orchestration owns the promotion decision; Regulations is
  queried for licence-tier + facility + finance thresholds." Eligibility chains run as
  a Process Manager/Saga **in the consuming BC**; each consumer enforces via ACL; rule
  stays Regulations-owned. Snapshot copied at save creation, immutable thereafter.
- **ADR-0066** (accepted): `LeagueCompetitionSeason` edition (`status:
  registering→active→completed`), `PyramidConfiguration`, and a **Pyramid-rollover
  Process Manager** for cross-tier movement at season rollover (the stateful home for
  the promotion gate). Participants are `ClubId` references.
- **ADR-0068** (accepted): `ScheduleCompetition` / `GenerateFixtures` /
  `FixturesPublished` / `NextFixture` / `CompetitionStatus`; names **Regulations via
  FMX-74** as a `FixturesPublished` consumer; generation is idempotent + immutable.
- **bounded-context-map.md**: L96-101 "League/Competition supplies
  `FixtureCommercialProfile` + `CompetitionRevenueProfile` + `SeasonAdvanced`;
  Regulations supplies `EffectiveRuleSet`"; L164-170 the eligibility-chain
  Process-Manager-in-consumer rule + binding no-join communication rule.
- **GD-0009** (binding): Aug–May calendar; promotion/relegation pyramid; single-tier
  league-only **MVP** (cups + continental post-MVP) → promotion/licence gates have
  *schema but no data* at MVP.
- **GD regulations-and-compliance.md**: the `LicenceTierCompliance` remediation chain
  (crash-build / special-permit / ground-share / refuse) → the quarantine ladder.

## Findings

### F1 — Real-world separates 5 gates by *timing*; the hand-off owns gates 1–3
Club admission/licensing + promotion compliance fire **pre-season, before the draw**;
squad registration fires **around season start + mid-season windows**; matchday
eligibility fires **per fixture**. (Q1.) → League↔Regulations at scheduling/lifecycle
time concerns admission, promotion compliance, and squad-registration windows; the
per-fixture gate is already Match-owned, transfers Transfer-owned. This cleanly bounds
FMX-74's surface and avoids overlapping ADR-0056's `MatchLineupLocking`.

### F2 — Promotion is genuinely gated on infrastructure/finance in the real world
Clubs are denied promotion on ground-grading (English non-League → EFL; Scottish
lower-tier champions → SPFL) and refused higher-tier licences on finance (DFL).
(Q1.) → A promotion-compliance check is *realistic*, not invented; confirms D4 and
ADR-0056's boundary. At single-tier MVP it is a reserved hook (no promotion data).

### F3 — The canonical sim model is a *competition-rule layer*; unregistered ≠ save-block
FM models registration as real competition rules (max squad size, homegrown,
registration windows); unregistered players are *unavailable for that competition*,
not a save-ending block; good UX = hard-block only fundamentals, warn the rest, auto-
handle routine registration. (Q2.) → Supports D2 (squad registration is a real MVP
system even for one league) and D3 (severity-tagged, not uniformly hard-blocking) and
argues for auto-handle defaults + time-boxed warnings in the eventual UX (out of scope
here, noted for FMX-99/100).

### F4 — A synchronous fan-out-and-decide flow is a *domain service/policy*, not a Saga
Vernon: a Saga/Process Manager is for durable cross-time state + compensation; a flow
that fetches a snapshot, queries read models and returns a verdict is a **domain
service/policy**. "Eligibility check as a Saga" is an overreach with no compensating
actions. (Q3 + Vernon IDDD; *the Q3 Sonar citations were unusable — see raw caveat*.)
→ D1: model the scheduling-time gate as an Eligibility **Policy** in League; reserve
"Saga"/Process-Manager only for the stateful promotion-rollover (which ADR-0066
already defines). This **refines the issue's "Saga" wording** on correctness grounds.

### F5 — Severity belongs in the ubiquitous language, per check
Literature prescribes no single global semantic: mandatory rule → guard that prevents
the transition (hard-block); important-but-not-fatal → advisory event (warn);
needs-review → explicit pending/provisional state (quarantine). Each interacts with
replay differently (block is trivially replay-safe; warn needs idempotent advisories;
quarantine needs an explicit state + idempotent re-processing). (Q3.) → D3's
severity-tagged model; the GDDR remediation chain is the quarantine ladder.

### F6 — Replay-safe verdicts = pure function of versioned inputs
Make the verdict a pure function of (input, aggregate state, `ruleSetVersion`) over
the immutable snapshot; prefer recomputation on replay; cache/persist only with
`ruleSetVersion` + input hash. (Q3 + ADR-0056/ADR-0051.) → No new RNG; no live catalog
read; deterministic and auditable. Aligns with the determinism contract.

### F7 — No cross-context join at any step
Every check is a **query** against Regulations' OHS (`EffectiveRuleSet`,
`SquadRegistrationCheck`, `CurrentTransferWindow`, reserved `LicenceTierCompliance`)
and against Squad & Player for registration facts; the policy aggregates verdicts in
League. The binding no-join rule (map L164-170) is satisfied by construction.

### F8 — G25 interaction is real but out of scope to *resolve*
Regulatory windows (registration deadlines) and match-week deadlines
(watch-party `broadcast_at`, G25) interact at the registration-window check. FMX-74
**reserves a hook** (the registration-window trigger reads the regulatory window as
source-of-truth for *eligibility*; the deadline-source contradiction G25 is resolved
elsewhere) — acknowledged, not silently ignored (acceptance criterion).

## Options matrix (ratified by Nico 2026-06-03)

| Decision | Options | Ratified |
|---|---|---|
| **D1 orchestration shape** | A. stateless Eligibility Policy (domain service) in League + reuse Pyramid-rollover PM for promotion · B. standalone new Saga (issue wording) · C. policy now + named Saga seam | **A** |
| **D2 MVP-mandatory checks** | A. minimal (snapshot wiring + contract only) · B. **+ `SquadRegistrationCheck` mandatory** · C. full set (squad + licence-tier + promotion + FFP) | **B** |
| **D3 failure semantics** | A. **severity-tagged** (block mandatory / warn advisory / quarantine conditional) · B. always hard-block · C. warn-only at MVP | **A** |
| **D4 promotion gate** | A. **yes — via Regulations `LicenceTierCompliance`**, run by Pyramid-rollover PM (reserved at MVP) · B. pure League tier-model, no Regulations | **A** |

## Inputs For Decisions

- **ADR input (ADR-0069):** the hand-off contract (queries × lifecycle trigger
  points), the Eligibility Policy definition + composite-verdict shape + severity
  model, the promotion-compliance hook on the Pyramid-rollover PM, determinism rule,
  invariants, sequence diagram, G25 reserved hook, `risk:legal` note. No edit to
  ADR-0056 (cross-ref only).
- **Game-design input:** registration UX (auto-handle defaults, time-boxed warnings,
  unregistered-as-unavailable) belongs to the UX wave (FMX-99/100), not here — noted.

## Future-scope notes (classified future-scope)

- **Licence-tier facilities + FFP-at-competition checks** (reserved hooks; activate
  when promotion/continental data + Club Management facility/finance facts exist).
- **Promotion-compliance enforcement** (inert until pyramid depth >1 ships data).
- **G25 deadline-source contradiction** full resolution (separate issue; FMX-74 only
  reserves the eligibility-window hook).
- **Continental/cup admission** (UEFA-analogue coefficient/licence entry) when cups
  arrive (R2-06).
