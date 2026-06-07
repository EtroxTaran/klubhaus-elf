---
title: ADR-0060 Youth Academy Context
status: proposed
tags: [adr, architecture, ddd, youth, academy, lifecycle, fmx-29, proposed]
created: 2026-05-28
updated: 2026-06-07
type: adr
binding: false
supersedes:
superseded_by:
related:
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0050-club-economy-accounting-ledger]]
  - [[ADR-0051-manager-and-legacy-context]]
  - [[ADR-0052-people-persona-and-skills-context]]
  - [[ADR-0053-staff-operations-context]]
  - [[ADR-0055-tactics-context]]
  - [[ADR-0056-regulations-compliance-context]]
  - [[ADR-0057-rivalry-system-context]]
  - [[ADR-0059-community-overlay-pipeline-context]]
  - [[../bounded-context-map]]
  - [[../../50-Game-Design/GD-0007-youth]]
  - [[../../50-Game-Design/youth-academy-and-development]]
  - [[../../50-Game-Design/squad-and-club-structure]]
  - [[../../50-Game-Design/training-load-and-medicine]]
  - [[../../50-Game-Design/scouting-and-recruitment]]
  - [[../../50-Game-Design/GD-0015-ip-clean-data]]
  - [[../../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]]
  - [[../../60-Research/youth-academy-bounded-context-2026-05-28]]
  - [[../../60-Research/youth-academy-context-decision-2026-06-07]]
  - [[../../60-Research/raw-perplexity/raw-youth-academy-2026-05-28]]
  - [[../../00-Index/Open-Decisions-Dossier]]
---

# ADR-0060: Youth Academy Context

## Status

proposed

## Date

2026-05-28

## Context

FMX-29 closes the youth-academy ownership gap in the 16-context map
(post-FMX-40 ratification 2026-05-28).

GD-0007 (`binding: true`, 2026-05-17) is approved and specifies the
academy pipeline (Scout → Intake → U-16 → U-18 → U-21 → Senior) with
annual cadence + promotion gate (age ≥17 + two youth weeks + post-
season transfer window) + per-season investment slider + Head-of-
Youth opinion model + intake event (3-12 players, promote / release
choice). `youth-academy-and-development.md` (`binding: true`,
2026-05-28) details the per-cohort dev pipeline, intake-quality
multipliers and loan system. `squad-and-club-structure.md` §1 + §4
specifies the role inventory (Head of Youth + U-team Coaches) and
U-19 + U-21 squad caps per league tier.

ADR-0053 Staff Operations (accepted 2026-05-28) owns the **roles**
(Head of Youth + U-team coaches as `StaffRoleAssignment` aggregates)
but **explicitly not the academy lifecycle**. ADR-0018 Systemic Events
(accepted 2026-05-17) maps weekly development progression to Training
(signals) + Squad & Player (persistence), and explicitly does **not**
carve out academy intake, cohort generation, promotion-gate
enforcement, investment-slider posting or home-grown share signalling.

The unowned operational concerns are:

- Annual **intake-event FSM** (preparation → intake-event → review →
  promotion-window → archive).
- **Cohort lifecycle** (scouted → invited → intake-event → review-
  decided → promoted / loaned / released).
- **Per-season investment slider** (Junior Coaching / Youth
  Recruitment / Youth Facilities) and **investment-cost posting** to
  Club Management ledger per ADR-0050.
- **Productivity score** (EPPP-analogue: rolling academy-graduate
  professional-appearance tally).
- **Home-grown share** rolling counter (UEFA HGP-analogue: trained
  3+ years between 15-21 at club).
- **Intake event UI** (Development-Centre-style aggregate area with
  HoY opinion, prospect cards, promote / release choices).

The
[[../../60-Research/youth-academy-bounded-context-2026-05-28]]
synthesis evaluates four options for the ownership question. Six-of-
six DDD split criteria fire (equal to FMX-33 wave high). Real-world
EPPP + DFB-NLZ + UEFA HGP precedent and genre precedent (FM, EA FC,
OOTP, FIFA Manager, Anstoss) both converge on structural separation.

## Options considered

### Option A - Sub-aggregate inside Squad & Player

Add `YouthAcademy` as a sub-aggregate inside Squad & Player. Intake
event, cohort lifecycle, investment slider, productivity score and
home-grown share live alongside player base data, fitness, morale,
contracts and injuries.

- **Coupling:** intake-on-creation is local (new academy members are
  player records).
- **Test isolation:** weak - the same context owns Squad continuous
  lifecycle + academy annual cycle; FSMs collide.
- **Service extractability:** weak - extraction requires carving the
  sub-aggregate out later.
- **Data sovereignty:** weak - mixed ubiquitous language (Squad:
  player-record / attributes / contracts; Academy: intake / cohort /
  EPPP-category / scholarship gate) inside one schema invites meaning
  drift.
- **Cross-cutting signals.** Squad owner forces Regulations + Manager
  & Legacy + Club Management + Fan Ecology to query Squad for non-
  Squad concerns (home-grown share + productivity score + investment
  expense + pipeline-quality signal). Same anti-pattern as FMX-26
  "Staff in Club Management" or FMX-33 "Community Overlay in Offline
  Sync".
- **Trade-off:** the alternative options either require explicit
  Customer-Supplier contracts (Option C, cheap via Vernon canonical
  pattern) or place academy inside Training / Staff Operations
  (Option B / D) — neither matches Squad's ubiquitous language any
  better.

### Option B - Sub-aggregate inside Training

Add `YouthAcademy` as a sub-aggregate inside Training. Intake event,
cohort lifecycle and investment slider live alongside training plan,
load, development signals and tactical familiarity.

- **Coupling:** weekly dev signals already feed Training; adding
  academy here means Training owns both the per-player tick **and**
  the per-cohort annual cycle.
- **Test isolation:** weak - Training's weekly tick FSM collides with
  academy annual cycle FSM.
- **Service extractability:** weak - extracting Training-with-academy
  later requires two-aggregate split.
- **Cadence mismatch.** Training's tick is weekly; academy's tick is
  **annual** (intake + post-season). Hiding annual cycle inside
  Training pollutes Training's tests + breaks Vernon's
  "long-running-process aggregate must have its own time granularity"
  principle.
- **Staff Operations conflict.** Training already consumes Staff
  Operations effect readiness for coach effects (per ADR-0053). Adding
  academy here forces Training to consume + publish two scarcity
  systems (Trainer-Cap = 5 vs academy quality multipliers).
- **Trade-off:** weak; this is the worst-fit owner because the cadence
  mismatch is acute.

### Option C - New "Youth Academy" bounded context (17th or 18th)

Carve a dedicated context owning the annual intake calendar, cohort
generation, intake event, promotion-gate enforcement, per-season
investment slider, productivity score and home-grown share counter.
Consumes Staff Operations effect readiness (HoY + U-team-coaches),
Scouting regional coverage, League Orchestration transfer windows and
Save-creation snapshots. Emits cohort-published snapshot to Squad &
Player (new player records), investment-expense events to Club
Management ledger, productivity / pipeline-quality signals to Manager
& Legacy + Regulations, intake-event copy to Notification.

- **Coupling:** clean. Snapshot pattern on cohort → Squad & Player;
  Customer-Supplier pattern with Club Management ledger; Reference
  pattern for live Staff Operations + Scouting queries.
- **Test isolation:** strong. Own per-save schema per ADR-0027;
  deterministic event fixtures drive tests.
- **Service extractability:** matches ADR-0019 §5 - extraction is a
  deployment change.
- **Data sovereignty:** explicit. `save_<uuidv7hex>` schema for
  cohort tables + intake events + promotion decisions + investment
  levels + productivity metrics + home-grown share rolling counter.
- **DDD pattern.** Vernon canonical long-running-process + Process
  Manager / Saga + Snapshot pattern. Textbook precedents: university
  admissions cohort, clinical-trial subject cohort, apprenticeship
  lifecycle (all own-BC per F3 synthesis).
- **Real-world precedent.** Premier League EPPP Categories 1-4 + DFB-
  NLZ + UEFA HGP + Academy Director reporting to Sporting Director =
  separate audited organisational unit.
- **Genre precedent.** All five major football management sims (FM,
  EA FC CM, OOTP, FIFA Manager, Anstoss) treat academy as
  structurally separate persistent area.
- **Trade-off:** adds one bounded context to the map. The marginal
  cost is justified by six-of-six DDD criteria firing (strongest in
  the wave) + real-world structural precedent + genre precedent.

### Option D - Sub-aggregate inside Staff Operations

Add `YouthAcademy` as a sub-aggregate inside Staff Operations. HoY +
U-team-coach roles + academy lifecycle + intake event + investment
slider all owned by Staff Operations.

- **Coupling:** HoY + U-team-coach effect readiness is local
  (already inside Staff Operations).
- **Test isolation:** weak - Staff Operations' staff-contract-
  lifecycle FSM collides with academy annual cycle FSM.
- **Ubiquitous-language mismatch.** Staff Operations' language is
  hire / fire / contract / wage / role-assignment / pipeline-coverage.
  Intake event + cohort + promotion-gate + investment-slider + EPPP-
  category are foreign concepts.
- **Real-world precedent fights this.** Per F5: Academy Director +
  Head of Academy = own organisational unit reporting to Sporting
  Director — distinct from Staff Operations' staff-contract-lifecycle
  scope. Staff Operations is the **HR-ops** layer; Youth Academy is
  the **academy-ops** layer.
- **ADR-0053 §Decision conflict.** Per ADR-0053, "Staff Operations
  does not own player contracts, wages or transfers" — youth players
  (academy members) are players, putting them outside Staff
  Operations' scope by ratified ADR.
- **Trade-off:** weak; ratified ADR-0053 §Decision rules this out.

## Decision questions (open — awaiting Nico, 2026-06-07)

Re-grounded in [[../../60-Research/youth-academy-context-decision-2026-06-07]]
(DDD cadence/lifecycle heuristics; EPPP/NLZ/UEFA-HGP structure; FM/OOTP/EHM youth modelling).

- **D1 — Owner.** **C. Own bounded context (kept coarse-grained) ← recommended** · A. Squad
  sub-aggregate · B. Training sub-aggregate · D. Staff Operations sub-aggregate (ruled out by
  ratified ADR-0053). Cadence mismatch (annual vs weekly), lifecycle independence and language
  distinctness all fire; over-splitting risk is handled by keeping *one* context with internal
  aggregates.
- **D2 — Home-grown / registration eligibility boundary.** **A. Rules-centric ← recommended:**
  Regulations owns the eligibility *interpretation* (`SquadRegistrationCheck`/`IsHomeGrownForCompetition`);
  Youth Academy owns the *training-history facts* and exposes `HomeGrownShareCounter` as a **derived
  projection** (no standalone "is home-grown" truth stored in Academy). · B. Academy-centric: Academy
  stores the home-grown boolean (simpler queries, but rule changes leak and meaning drifts).

**Recommendation: D1 = C, D2 = A.** Own context per the strongest-in-wave split signals + real-world
(EPPP/NLZ separate audited unit) + genre precedent; and keep eligibility *interpretation* in
Regulations with Academy as the fact/history owner — a one-line clarification of the existing
`HomeGrownShareRecalculated` → Regulations-ACL contract, not a redesign. Full rationale below.

## Recommendation

**Option C (Youth Academy as own bounded context, 17th or 18th
depending on ADR-0059 ratification order).** Three converging
arguments:

1. **DDD canonical criteria fire strongest in wave (synthesis F4).**
   Six-of-six split criteria fire affirmatively: own ubiquitous
   language (intake / cohort / promotion-gate / EPPP-category), own
   FSM (annual cadence with sub-FSMs for AcademySeason + YouthCohort +
   AcademyInvestmentLevel), own storage (cohort tables + intake events
   + promotion decisions + investment levels + productivity / home-
   grown counters), multiple consumers (Squad & Player + Training +
   Club Management + Manager & Legacy + Notification + Regulations +
   Staff Operations bidirectional + Fan Ecology), cross-cutting role
   (home-grown share is regulatory + board + fan + roguelite signal),
   low co-change (annual academy cycle decoupled from weekly Training
   / continuous Squad / per-fixture Match). Vernon's canonical long-
   running-process + Process Manager / Saga + Snapshot pattern is the
   direct DDD analogue. Real-world DDD textbook precedents (university
   admissions, clinical-trial cohort, apprenticeship) all separate
   cohort lifecycle.

2. **Real-world structural + regulatory precedent (synthesis F5).**
   Premier League EPPP Categories 1-4 (productivity + facilities +
   coaching + education + welfare + leadership + management audit
   dimensions) + DFB-NLZ licensing + UEFA HGP rule (25-player List A
   with 8 home-grown of which 4 club-trained 15-21) + Academy Director
   reporting to Sporting Director all treat academy as separate audited
   organisational unit with own budget, own KPIs, own multi-year audit
   cycle, own director. La Masia + De Toekomst + City Football Academy
   + Hohenbuschei + Liefering all structurally separate. Modelling
   Youth Academy as sub-aggregate of Squad / Training / Staff
   Operations fights this real-world structural precedent.

3. **Genre precedent (synthesis F2).** All five major football
   management sims (FM 23-26, EA FC CM 24-26, OOTP 24-26, FIFA Manager
   legacy, Anstoss series) treat the academy as structurally separate
   persistent area with distinct UI + staff + budget + lifecycle.
   Single-player-entity + multi-team-membership pattern is universal;
   academy distinction lives in team assignment + contract type +
   lifecycle, not in player schema. Modelling Youth Academy as sub-
   aggregate of Squad surprises playtesters who expect the FM-
   Development-Centre / EA-FC-Youth-Academy-screen / OOTP-Minor-League-
   System / FIFA-Manager-Youth-Center shape.

### Named risks

- **Map growth.** Adds the 17th or 18th context (sequencing depends on
  ADR-0059 Community Overlay Pipeline ratification order). Modular
  monolith stays one process per ADR-0019. Mitigation: ADR-0019 §5
  keeps extraction a deployment change, not a refactor.
- **Coordination with Staff Operations + Training + Squad & Player +
  Club Management + Manager & Legacy + Regulations.** Six consumers +
  two suppliers. Mitigation: explicit Customer-Supplier contracts via
  published events; Snapshot pattern on cohort → Squad & Player keeps
  coupling loose.
- **Loan environment is multi-BC Process Manager.** Loan factors
  (league quality, play-style match, promised role, coach quality,
  guaranteed minutes, medical standards) span Youth Academy + Transfer
  + Squad & Player + Match. FMX-29 names the surface; loan-
  orchestration ADR is a follow-up beat after MVP stability.
- **Cross-save legacy + community-overlay seeds.** Academy reputation,
  EPPP-analogue starting category and productivity history flow
  through ADR-0051 Manager & Legacy at save creation only. Cross-save
  pack overrides (regional yield tweaks, archetype name pools) flow
  through ADR-0059 Community Overlay Pipeline (proposed) at save
  creation only; Youth Academy BC owns semantic validation per Vernon
  (same pattern as Regulations + Rivalry).
- **EPPP-analogue rule terminology.** `risk:legal` discipline applies
  per GD-0015 + ADR-0007: no real EPPP / NLZ / UEFA naming inside
  gameplay-facing surfaces; abstract category-tier model encodes the
  pattern without infringement. Same hardline as Regulations
  (ADR-0056) and Community Overlay Pipeline (ADR-0059 proposed).
- **EPPP-analogue category-audit cycle is future scope.** FMX-29 owns
  the productivity score read model; the multi-year audit-cycle
  Process Manager (audit-window FSM, downgrade-trigger policy,
  central-funding bonus posting) is a follow-up beat.

Status stays `proposed` / `binding: false` until Nico ratifies.

## Decision

Propose a dedicated **Youth Academy** bounded context.

If ratified, Youth Academy owns:

- **`AcademySeason` aggregate** (per-club, per-year): season FSM
  (planning → intake-active → review → promotion-window → archived),
  intake-window timing (per nation per ADR-0056 transfer-window
  context), post-season promotion-window timing, investment-level
  snapshot copied at season start, productivity-window snapshot.
- **`YouthCohort` aggregate** (per-club, per-intake-year): cohort FSM
  (scouted → invited → intake-event → review-decided → promoted /
  loaned / released), `CohortMember` subaggregate per prospect
  (per-prospect HoY opinion, attribute ranges, archetype label,
  promotion / loan / release decision).
- **`AcademyInvestmentLevel` aggregate** (per-club): per-season slider
  value (Junior Coaching / Youth Recruitment / Youth Facilities,
  per GD-0007 §Decided / strong), facilities tier, scout regional
  coverage handle. Slider-change FSM (pending-budget → approved →
  effective → superseded).
- **`ProductivityCounter` projection** (per-club): rolling productivity
  score per audit window. EPPP-analogue category signal.
- **`HomeGrownShareCounter` projection** (per-club, per-save-scope
  competition): rolling home-grown share counter. UEFA HGP-analogue.
- **Process Manager / Saga** for annual academy cycle: intake-calendar
  trigger → HoY opinion request from Staff Operations → cohort-
  generation via `IntakeRng(saveId, clubId, year)` sub-label of
  `WorldRng` per ADR-0018 §3 → player creation Snapshot to Squad &
  Player → wage / investment-cost events to Club Management ledger →
  archive at season end.

Youth Academy does **not** own:

- Player base data, attributes, contracts, injuries, fitness, morale,
  match-minutes (owned by Squad & Player).
- Weekly per-player development calculation (owned by Training per
  ADR-0018 §1).
- Head of Youth + U-team-coach hire / fire / contract / wage / role-
  assignment (owned by Staff Operations per ADR-0053).
- Scout assignments / regional coverage source (owned by Scouting /
  Transfer; Youth Academy consumes regional-coverage snapshot via
  query).
- Wage ledger entries (owned by Club Management per ADR-0050; Youth
  Academy emits investment-cost events, Club Management posts the
  ledger).
- Transfer window FSM (owned by Regulations & Compliance per
  ADR-0056; Youth Academy reads `CurrentTransferWindow` for
  promotion-window opening).
- Cross-save manager identity, legacy or prestige (owned by Manager &
  Legacy per ADR-0051; Youth Academy emits pipeline-quality signals
  consumed by Manager & Legacy archetype hooks).
- AI manager behaviour for simulation bot clubs (owned by League /
  Club / Transfer per bounded-context-map §7).
- Pack-manifest validation for community-authored regional yield
  overrides (owned by Community Overlay Pipeline per ADR-0059
  proposed; Youth Academy owns semantic validation when ADR-0059
  ratifies).

## Public contract direction

Draft commands:

- `ScheduleYouthIntake` - opens an `AcademySeason` for the upcoming
  intake date.
- `GenerateYouthCohort` - triggers Process Manager to draw cohort
  from `IntakeRng`, request HoY opinion, populate cohort members.
- `DecidePromoteCohortMember` - promote prospect to senior squad
  (publishes Snapshot to Squad & Player).
- `DecideLoanCohortMember` - loan prospect out (entry point to
  future-scope loan-orchestration Process Manager).
- `DecideReleaseCohortMember` - release prospect.
- `SetAcademyInvestmentLevel` - update slider per season.
- `OpenAcademyPromotionWindow` - opens post-season promotion window
  (gated by `CurrentTransferWindow` from Regulations).
- `CloseAcademyPromotionWindow` - closes promotion window.
- `ArchiveAcademySeason` - season-end archive.

Draft events:

- `YouthIntakeScheduled`
- `YouthCohortGenerated`
- `YouthIntakeEventTriggered`
- `YouthCohortPublished` *(Snapshot; consumed by Squad & Player)*
- `YouthPromoted`
- `YouthLoaned`
- `YouthReleased`
- `AcademyInvestmentChanged`
- `AcademyInvestmentExpensePosted` *(consumed by Club Management ledger
  per ADR-0050)*
- `HomeGrownShareRecalculated` *(consumed by Regulations Anticorruption
  Layer per ADR-0056 Tax-catalog pattern)*
- `YouthPipelineQualityUpdated` *(consumed by Manager & Legacy GD-0019
  archetype hook aggregation)*
- `AcademySeasonArchived`

Draft read models:

- `AcademyCohortBoard` - intake-event UI (HoY opinion, prospect cards,
  promote / release choice).
- `AcademySeasonOverview` - Development-Centre-style aggregate area
  showing all in-flight cohorts + investment level + productivity
  snapshot.
- `AcademyInvestmentDashboard` - per-season slider state + facilities
  tier + scout regional coverage.
- `ProductivitySnapshot` - rolling productivity score for audit
  visualisation.
- `HomeGrownShareSnapshot` - per-competition home-grown share for
  squad-registration UI.
- `YouthCohortHistory` - long-tail cohort archive per club.

Draft consumed facts:

- `StaffEffectReadinessUpdated` from Staff Operations *(HoY + U-team-
  coach effect readiness per ADR-0053)*.
- `ScoutRegionalCoverageUpdated` from Scouting / Transfer.
- `CurrentTransferWindow` from Regulations & Compliance per ADR-0056
  *(promotion-window gating)*.
- `SaveSnapshotInitialised` from Save creation per ADR-0027 + ADR-0051
  *(cross-save legacy + community-overlay seeds at save creation
  only)*.
- `EconomyWeekAdvanced` from Club Management *(weekly tick for
  investment-cost computation)*.
- `RegionalYieldOverridePack` from Community Overlay Pipeline per
  ADR-0059 *(pack overrides at save creation only; Youth Academy owns
  semantic validation; only relevant if ADR-0059 ratifies)*.

## Determinism and storage rules

- Youth Academy owns per-save tables only (`save_<uuidv7hex>` schema
  per ADR-0027). No platform-scope cross-save state.
- New save creation may receive legacy-configured academy seed
  (academy reputation, EPPP-analogue starting category, productivity
  history) as explicit generation parameter when ADR-0051 Manager &
  Legacy supplies one (post-MVP); the seed is copied into the save
  snapshot at creation and never re-read during a running save.
- Community-overlay pack data (regional yield tweaks, archetype name
  pools) is copied into the save snapshot at creation per ADR-0059
  (proposed); Youth Academy BC owns schema + semantic validation
  per Vernon canonical pattern (same as Regulations + Rivalry).
- Cross-context inputs arrive through public events / queries only.
  Youth Academy does not join across context tables.
- All cohort generation draws use `IntakeRng(saveId, clubId, year)`
  sub-label of `WorldRng` per ADR-0018 §3. No cross-RNG draws. No
  `Math.random` or `Date.now` in simulation paths.
- Domain events emitted through ADR-0028 transactional outbox; Squad &
  Player + Club Management + Regulations + Manager & Legacy +
  Notification + Fan Ecology consume via ACL.
- Snapshot to Squad & Player: `YouthCohortPublished` carries
  composition + per-prospect attribute ranges + HoY opinion + archetype
  label + decision; Squad & Player materialises player records from
  snapshot. Subsequent academy edits do not retro-affect senior
  records.

## Rationale

Youth academy is a first-class gameplay system: annual intake event,
multi-year cohort lifecycle, multi-input quality model (HoY + scout
coverage + investment + facilities + DNA philosophy), promotion-gate
enforcement, post-season transfer-window dependency, cross-cutting
signals (productivity audit + home-grown share regulatory + pipeline-
quality roguelite + investment expense ledger).

Hiding it inside Squad & Player (Option A) buries the annual-cohort
FSM inside Squad's continuous lifecycle and forces cross-cutting
signals to leak. Hiding it inside Training (Option B) puts an annual
FSM inside a weekly-tick container — Vernon's cadence-mismatch anti-
pattern. Hiding it inside Staff Operations (Option D) violates
ratified ADR-0053 §Decision (no player ownership) and fights real-
world Academy-Director-separate-from-Staff-Operations precedent.

DDD authorities (Evans Blue Book + Vernon IDDD + Fowler bliki +
Context Mapper + MS Learn) and real-world football operations
(Premier League EPPP + DFB-NLZ + UEFA HGP + Academy Director
organisational reporting) and genre precedent (FM + EA FC + OOTP +
FIFA Manager + Anstoss) all converge: when an operational concern has
its own ubiquitous language, annual lifecycle FSM, storage, multiple
consumers and cross-cutting signals, it deserves its own bounded
context. The marginal cost (one extra context in the modular monolith,
extraction = deployment change) is small compared with the coupling
debt the alternatives accumulate.

## Consequences

Positive:

- Clear owner for intake-event FSM + cohort lifecycle + investment
  slider + productivity / home-grown counters without polluting Squad
  & Player, Training or Staff Operations.
- Contracts-first path: commands, events, read models, consumed facts
  all named at draft precision.
- Snapshot pattern on `YouthCohortPublished` keeps Squad & Player
  loosely coupled (canonical Reference + Snapshot pattern from FMX-28
  Tactics).
- Investment-expense pattern follows ADR-0050's rule unchanged
  (Customer-Supplier with Club Management ledger).
- Home-grown share + productivity score have a named home; Regulations
  + Manager & Legacy + Club Management consume via ACL per Vernon
  Tax-catalog pattern.
- Mirrors real-world Academy-Director structure - playtesters
  recognise the model (EPPP + DFB-NLZ + La Masia analogues without
  IP-infringing terminology).
- Intake event UI (Development-Centre-style aggregate area) has a
  clear contract surface.

Negative:

- Adds one bounded context to the map (17th if FMX-29 lands before
  ADR-0059 ratification; 18th otherwise).
- Requires event consumption across Squad & Player, Training, Club
  Management, Manager & Legacy, Notification, Regulations,
  Fan Ecology and bi-directional integration with Staff Operations +
  Scouting. Coordination grows.
- Loan-orchestration Process Manager + EPPP-analogue category-audit
  cycle + reserve-team B-team-in-real-league pattern are follow-up
  beats, not MVP scope. ADR-0060 names the surfaces but defers the
  multi-BC orchestration ADRs.
- Cohort-history retention policy across 20+ in-game seasons is open
  question; ties to Manager & Legacy archive (Future-scope §10).

## Map patch proposal

Order-tolerant proposal that applies when this ADR is accepted.
Sequencing: if ADR-0059 (Community Overlay Pipeline) is ratified
first, Youth Academy is the 18th bounded context; if FMX-29 lands
first, it is the 17th. Both apply-PRs are independent and can land in
either order; the apply-PR for whichever lands second renumbers the
prose accordingly.

### §1 table - new row

````diff
 | **Rivalry System** | RivalryEdge graph ... | RivalryScore / IsDerbyFixture ... |
+| **Youth Academy** | `AcademySeason` aggregate (annual FSM: planning → intake-active → review → promotion-window → archived), `YouthCohort` aggregate (per-cohort FSM + per-prospect HoY opinion + promote/loan/release decision), `AcademyInvestmentLevel` aggregate (per-season slider + facilities tier), `ProductivityCounter` projection (rolling EPPP-analogue audit score), `HomeGrownShareCounter` projection (rolling UEFA-HGP-analogue counter), annual Process Manager / Saga orchestrating intake-calendar trigger → HoY opinion → cohort generation → Squad snapshot → ledger posting | `AcademyCohortBoard` / `AcademySeasonOverview` / `AcademyInvestmentDashboard` / `ProductivitySnapshot` / `HomeGrownShareSnapshot` / `YouthCohortHistory` queries; `YouthCohortPublished` Snapshot event to Squad & Player; `AcademyInvestmentExpensePosted` to Club Management ledger; `HomeGrownShareRecalculated` + `YouthPipelineQualityUpdated` signals to Regulations + Manager & Legacy + Fan Ecology + Notification consumers |
 | **Offline Sync** | MVP: cache/draft status ... | Draft/cache status now; sync status later |
````

### §1 prose - new paragraph (insert above Offline Sync paragraph)

````diff
+Youth Academy was proposed 2026-05-28 via ADR-0060 Youth Academy
+Context (FMX-29 dossier + forthcoming apply-PR). It owns the annual
+academy lifecycle:
+`AcademySeason` (planning → intake-active → review → promotion-window
+→ archived FSM), `YouthCohort` (per-cohort scouted → invited →
+intake-event → review-decided → promoted / loaned / released FSM
+with per-prospect HoY opinion and promote / loan / release decision),
+`AcademyInvestmentLevel` (per-season Junior Coaching / Youth
+Recruitment / Youth Facilities slider per GD-0007), `ProductivityCounter`
+(rolling EPPP-analogue audit score), `HomeGrownShareCounter` (rolling
+UEFA-HGP-analogue counter per save-scope competition). Squad & Player
+consumes `YouthCohortPublished` as a Snapshot (canonical Reference +
+Snapshot pattern - subsequent academy edits do not retro-affect senior
+records). Club Management consumes `AcademyInvestmentExpensePosted` to
+post ledger entries per ADR-0050. Regulations & Compliance consumes
+`HomeGrownShareRecalculated` for `SquadRegistrationCheck` Anticorruption
+Layer per ADR-0056 Tax-catalog pattern. Manager & Legacy consumes
+`YouthPipelineQualityUpdated` for GD-0019 archetype hook aggregation.
+Notification renders `YouthIntakeEventTriggered` per ADR-0043. Staff
+Operations supplies `StaffEffectReadinessUpdated` (Head of Youth +
+U-team-coach effect readiness per ADR-0053) consumed live by Youth
+Academy for intake-quality + dev-multiplier computation. Scouting /
+Transfer supplies `ScoutRegionalCoverageUpdated` consumed live for
+cohort-quality computation. League Orchestration supplies
+`CurrentTransferWindow` (consumed via Regulations ACL per ADR-0056) for
+post-season promotion-window gating. Cross-save academy reputation +
+productivity history flow through ADR-0051 Manager & Legacy at save
+creation only. Cross-save community pack overrides (regional yield
+tweaks, archetype name pools) flow through ADR-0059 Community Overlay
+Pipeline (proposed) at save creation only; Youth Academy BC owns
+semantic validation per Vernon (same pattern as Regulations + Rivalry).
+`risk:legal` hardline applies to the entire Youth Academy BC per
+GD-0015 IP-clean data + ADR-0007 naming schema: no real EPPP / NLZ /
+UEFA naming inside gameplay-facing surfaces.
````

### §2 high-level Mermaid - new node + edges

````diff
     Reg["Regulations & Compliance"]
     Rival["Rivalry System"]
+    Youth["Youth Academy"]
     Offline["Offline Sync"]
     Audit["Audit & Security"]
````

````diff
     Rival --> Reg
+    Identity --> Youth
+    League --> Youth
+    Club --> Youth
+    Squad --> Youth
+    Staff --> Youth
+    Reg --> Youth
+    Youth --> Squad
+    Youth --> Club
+    Youth --> ML
+    Youth --> Reg
+    Youth --> Notif
     Training --> Squad
````

### §4 source mapping - new folder

````diff
   rivalry/
+  youth-academy/
   sync/
   audit/
````

### §5 prose - extraction order (no change required; Youth Academy is
not expected to be early-extracted)

No diff. The §5 ordered list remains the same; Youth Academy joins the
"likely co-located unless a real scaling signal forces a split" group.

## Supersedes

None.

## Related Docs

- [[../../60-Research/youth-academy-bounded-context-2026-05-28]] -
  FMX-29 ownership synthesis (this ADR's decision basis).
- [[../../60-Research/youth-academy-context-decision-2026-06-07]] -
  2026-06-07 external re-grounding + home-grown boundary sharpening.
- [[../../00-Index/Open-Decisions-Dossier]] - consolidated open-decision Q&A.
- [[../../60-Research/raw-perplexity/raw-youth-academy-2026-05-28]] -
  FMX-29 raw research (genre, DDD, real-world surveys).
- [[../../50-Game-Design/GD-0007-youth]] - binding youth GDDR.
- [[../../50-Game-Design/youth-academy-and-development]] - binding
  academy + development gameplay note.
- [[../../50-Game-Design/squad-and-club-structure]] §1 + §4 - role
  inventory + U-19 / U-21 caps per league tier.
- [[../../50-Game-Design/training-load-and-medicine]] - weekly
  development signals (consumed via Training).
- [[../../50-Game-Design/scouting-and-recruitment]] - scout assignments
  + regional coverage (consumed via Scouting query).
- [[../../50-Game-Design/GD-0015-ip-clean-data]] - IP-clean hardline.
- [[../../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]] -
  pipeline-quality archetype hook.
- [[ADR-0018-systemic-events-and-player-lifecycle]] - WorldEventDirector
  + RNG sub-label discipline (`IntakeRng(saveId, clubId, year)`).
- [[ADR-0019-modular-monolith-ddd]] - modular monolith ground rules.
- [[ADR-0027-postgres-data-model]] - per-save schema convention.
- [[ADR-0028-postgres-transactional-outbox]] - event delivery.
- [[ADR-0050-club-economy-accounting-ledger]] - investment-expense ledger.
- [[ADR-0051-manager-and-legacy-context]] - cross-save legacy seeds.
- [[ADR-0053-staff-operations-context]] - HoY + U-team-coach role
  ownership; FMX-29 consumes via reference.
- [[ADR-0055-tactics-context]] - reference + snapshot pattern precedent.
- [[ADR-0056-regulations-compliance-context]] - transfer-window FSM +
  home-grown share Anticorruption Layer.
- [[ADR-0057-rivalry-system-context]] - scoring-context pattern
  precedent.
- [[ADR-0059-community-overlay-pipeline-context]] - pack-manifest
  validation upstream (proposed); Youth Academy BC owns semantic
  validation per Vernon when ADR-0059 ratifies.
- [[../bounded-context-map]] - target of §Map patch proposal.
- [[../state-machines/youth-academy]] - FSM diagram + transitions
  (this ADR introduces the new state-machine note).
- [[../../30-Implementation/domain-research-workflow]] - six-phase
  workflow that produced this ADR.
