---
title: Youth Academy Lifecycle Bounded-Context Ownership Synthesis (FMX-29)
status: draft
tags: [research, synthesis, youth, academy, lifecycle, bounded-context, ddd, fmx-29]
context: youth-academy
created: 2026-05-28
updated: 2026-05-28
type: research-synthesis
binding: false
linear: FMX-29
related:
  - [[raw-perplexity/raw-youth-academy-2026-05-28]]
  - [[../10-Architecture/09-Decisions/ADR-0060-youth-academy-context]]
  - [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
  - [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
  - [[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]]
  - [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
  - [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]]
  - [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]]
  - [[../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../50-Game-Design/GD-0007-youth]]
  - [[../50-Game-Design/youth-academy-and-development]]
  - [[../50-Game-Design/squad-and-club-structure]]
  - [[../50-Game-Design/training-load-and-medicine]]
  - [[../50-Game-Design/scouting-and-recruitment]]
  - [[../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]]
  - [[../30-Implementation/domain-research-workflow]]
---

# Youth Academy Lifecycle Bounded-Context Ownership Synthesis (FMX-29)

> Six-phase domain-research-workflow synthesis (Phase 3) for FMX-29.
> Phase 1 vault grounding + Phase 2 three Perplexity queries archived
> at [[raw-perplexity/raw-youth-academy-2026-05-28]]. This note is the
> decision-ready brief feeding [[../10-Architecture/09-Decisions/ADR-0060-youth-academy-context]].

## Question

Who owns the **Youth Academy lifecycle**: annual intake calendar,
cohort generation, U-16 → U-18 → U-21 → senior progression FSM,
promotion gates (age ≥17 + two youth weeks + post-season window),
per-season investment slider, Head-of-Youth opinion model and intake
event (3-12 prospects, promote/release choice) — abgegrenzt von
Squad & Player (player records), Training (weekly development signals),
Staff Operations (HoY + U-team-coach quality multipliers) und Club
Management (investment budget posting)?

## Summary

The 16-context map (post-FMX-40 ratification 2026-05-28) names **no
owner** for the youth academy lifecycle. GD-0007 (`binding: true`) and
`youth-academy-and-development.md` (`binding: true`) specify the
pipeline + intake event + promotion gate + investment slider as
gameplay-binding requirements. ADR-0053 Staff Operations (accepted)
owns the **roles** (Head of Youth + U-team coaches) but not the
academy lifecycle itself; ADR-0018 Systemic Events (accepted) splits
weekly development across Training (signals) + Squad & Player
(persistence) but explicitly does not carve out academy as a separate
concern. The **intake event FSM**, **cohort lifecycle**, **investment
ledger**, **home-grown share signal** and **promotion-gate
enforcement** have no named home.

Six-of-six DDD split criteria fire (equal to the FMX-33 wave high;
stronger than FMX-26 / 28 / 30 / 34 where five-of-six fired). Vernon's
canonical long-running-process + Process Manager / Saga pattern is the
direct DDD analogue. Genre precedent (all five major football sims)
and real-world organisational precedent (EPPP Categories 1-4, DFB-NLZ,
UEFA HGP, Academy Director reporting to Sporting Director) both
converge on **structural separation**.

**Recommendation: Option C — Youth Academy as own bounded context.**
Pattern matches FMX-26 Staff Operations and FMX-28 Tactics
(operational concern with own lifecycle + multi-context consumers +
real-world organisational precedent). Sequencing: if ADR-0059
(Community Overlay Pipeline) is ratified first, Youth Academy is the
**18th** bounded context; if FMX-29 lands first, it is the **17th**.
Map patch in ADR-0060 is order-tolerant.

## Findings

### F1 - Vault binding state (Phase 1 grounding)

**Source:** [[../50-Game-Design/GD-0007-youth]] · [[../50-Game-Design/youth-academy-and-development]] · [[../50-Game-Design/squad-and-club-structure]] · [[../10-Architecture/bounded-context-map]] · [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]] · [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]].

**Confidence:** high.

GD-0007 (`binding: true`, 2026-05-17) is approved. **Decided / strong**:

- separate youth screen,
- scout missions (~42 days),
- scout quality tied to staff salary,
- youth-investment slider,
- promotion gate (player ≥17, two youth weeks),
- continent-targeted youth scouting,
- "wonderkid" / "golden generation" archetypes,
- rating *range* on scouting reports,
- upgradeable youth scout staff slot,
- youth promotions occur in **post-season transfer window**.

`youth-academy-and-development.md` (`binding: true`, 2026-05-28)
specifies the pipeline diagram Scout → Intake → U-16 → U-18 → U-21 →
Senior with loan-out arc + sell arc; intake quality depends on Head
of Youth + youth scout regional coverage + investment level + DNA
philosophy + academy infrastructure; annual scripted intake event
(3-12 players, HoY opinion, promote / release choice).

`squad-and-club-structure.md` §1 lists Head of Youth + U-team Coaches
as roles owned by Staff Operations (ADR-0053). §4 specifies U-19 + U-21
squad caps per league tier (Top tier: 10/10, Pro mid: 8/10, Pro entry:
8/8, Lower semi-pro: 6/6, Amateur: 4/4).

**Gap.** The bounded-context-map (`binding: true`, 16 contexts after
FMX-40) names no Youth Academy owner. The map paragraph for Staff
Operations (ADR-0053) explicitly covers HoY + U-team coaches as
**Role Assignments** with quality multipliers — but not the academy
itself. ADR-0018 §1 maps "Weekly development progression" to Training
(signals) + Squad & Player (persistence), and "Long-term injury risk"
to Training + Squad. ADR-0018 §1 does **not** mention academy intake,
cohort generation, promotion-gate enforcement, investment-slider
posting or home-grown share signalling. The intake event UI + intake
FSM + cohort aggregate + investment ledger + home-grown share signal
all have no named home.

**Inference:** the academy lifecycle is an unowned operational concern
in the current 16-context map. Same pattern as Staff Operations before
FMX-26/ADR-0053 (HoY existed in GDDRs but had no BC owner).

### F2 - Genre precedent (Perplexity Query 1)

**Source:** [[raw-perplexity/raw-youth-academy-2026-05-28]] §Query 1
(Sports Interactive blog, FM Editor community docs, EA SPORTS FC
patch notes, OOTP manual, FIFA Manager legacy guides, Anstoss
community archives).

**Confidence:** medium-high.

Every major football management sim (FM 23-26, EA FC CM 24-26, OOTP
24-26, FIFA Manager legacy, Anstoss) treats the academy as a
**structurally separate persistent area** in the UI + data model:

- FM 23-26: distinct U-18 / U-21 / U-23 squad entities + Development
  Centre aggregate area. Annual intake (March in Europe, per-nation
  `Youth Intake Date` editor field). HoYD attributes drive intake
  quality (Judging Player Potential → regen PA; Working With
  Youngsters → dev rate; personality biases archetype mix). Club-
  level ratings: Youth Recruitment + Junior Coaching + Youth
  Facilities. Youth contract type distinct from professional contract.
- EA FC CM 24-26: separate Youth Academy screen, rolling youth
  scouting, prospects surface monthly.
- OOTP 24-26: Minor League System + International Complex as separate
  team entities. Annual amateur draft + IFA pool. Scouting Director +
  Player Development budget sliders.
- FIFA Manager legacy: separate Youth Center with budget slider +
  Youth Coach quality.
- Anstoss: Nachwuchsabteilung with Nachwuchsförderung slider.

**Convergence.** Single-player-entity + multi-team-membership pattern
is universal. Academy distinction lives in **team assignment + contract
type + lifecycle**, not in player schema. Multi-input staff/budget
quality model is genre-standard. Annual cadence + separate budget +
separate staff slot is consistent across all five sims.

**Implication for FMX-29.** Treating Youth Academy as a separate
bounded context aligns with the player-mental-model: every sim player
already expects a "youth area" with its own UI + staff + budget +
calendar. Hiding it inside Squad & Player or Training would surprise
players and obscure the multi-input quality model.

### F3 - DDD authority and pattern (Perplexity Query 2)

**Source:** [[raw-perplexity/raw-youth-academy-2026-05-28]] §Query 2
(Vaughn Vernon *Implementing Domain-Driven Design*, Eric Evans Blue
Book, Martin Fowler bliki, Context Mapper SummerSoC papers, Microsoft
Learn DDD guidance, Schimak / Rücker process-manager literature).

**Confidence:** high.

**Vernon's canonical pattern for slow-tick cohort aggregates with
long-running lifecycle**: model as **Process Manager / Saga** in
application layer + **aggregates** representing stateful participants.
Coarse time granularity (weeks, months, years); stateful progression;
cross-context coordination via Process Manager rather than letting
external contexts directly drive internal FSM.

**Evans / Fowler criteria for splitting** into own bounded context:

1. Distinct ubiquitous language.
2. Distinct FSM and invariants.
3. Separate data lifecycle / storage / retention.
4. Multiple consumers / cross-cutting role.
5. Low co-change with neighbours.
6. Organisational / team alignment.

When most criteria fire → own bounded context, not sub-aggregate.

**Real-world DDD analogues** classified by Perplexity:

| Analogue | Classification | Reason |
|---|---|---|
| University admissions cohort | **Textbook own-BC** | Annual cadence; distinct language (application / offers / waitlist); multiple downstream consumers (Enrollment, Billing, Reporting) |
| Clinical trial cohort | **Canonical DDD example** | Protocol-specific language; regulatory audit; strict FSM; multiple consumers (EDC, Safety, Reporting) |
| Apprenticeship lifecycle | **Strong own-BC candidate** | Annual/multi-year cadence; certification; regulatory bodies |
| HR talent pipeline | **Borderline** | Depends on org view |

**Process Manager / Saga vs Aggregate FSM**:

- Aggregate FSM = local invariants + state transitions inside one
  context.
- Process Manager / Saga = cross-BC orchestration, time-triggered
  transitions, retries, compensation.
- Pattern: small aggregate FSM for local invariants + Process Manager
  in cohort BC for cross-BC coordination.

**Reference vs Snapshot pattern** for downstream consumption:

- **Reference**: downstream stores `cohortId` + queries cohort BC for
  details. Runtime coupling; live coordination.
- **Snapshot**: cohort generation event publishes composition;
  downstream materialises own aggregates from snapshot. Loose
  coupling; temporal decoupling. **Sports roster from annual cohort
  typically uses Snapshot at draft / selection time** — literal genre
  parallel to FMX domain.

### F4 - DDD split criteria firing for Youth Academy

**Source:** F1 + F3 applied to Youth Academy concretely.

**Confidence:** high.

Six-of-six criteria fire (equal to FMX-33 wave high, stronger than
FMX-26 / 28 / 30 / 34 five-of-six):

1. **Own ubiquitous language ✓** — intake calendar, cohort, intake
   event, promotion gate, HoY opinion, regional yield, productivity
   score, EPPP category, scholarship gate, registration window.
   Distinct from Squad's player-record language (CA / PA / attributes /
   contracts) and Training's load/block language (block type /
   intensity / fatigue / readiness).
2. **Own FSM ✓** — annual academy cycle with sub-FSMs:
   - `AcademySeason`: planning → intake-active → review → promotion-
     window → archived;
   - `YouthCohort`: scouted → invited → intake-event → review-decided →
     promoted / loaned / released;
   - `AcademyInvestmentLevel`: pending-budget → approved → effective →
     superseded.
   Annual cadence is distinct from Squad's continuous lifecycle, Match's
   per-fixture FSM, Training's weekly FSM, Transfer's per-window FSM.
3. **Own storage ✓** — cohort tables (cohort_year, cohort_member),
   intake events, promotion decisions, investment levels, productivity
   metrics, regional-coverage snapshots, home-grown share rolling
   counter. No useful JOIN with Squad's player table; per-save schema
   per ADR-0027.
4. **Multiple consumers ✓** — Squad & Player (Snapshot pattern on
   cohort generation → new player records), Training (new player IDs
   feed weekly dev calc), Club Management (investment-cost ledger
   posting via ADR-0050), Manager & Legacy (pipeline-quality + youth-
   yield signal aggregation per GD-0019 archetype hook), Notification
   (intake event copy + cohort review reminders), Regulations &
   Compliance (home-grown share eligibility check + EPPP-analogue
   category audit), Staff Operations (HoY + U-team-coach effect
   readiness consumed via reverse query).
5. **Cross-cutting role ✓** — home-grown share is a regulatory signal
   (Regulations) **and** a board-pressure signal (Club Management)
   **and** a fan-attachment signal (Fan Ecology) **and** a roguelite
   signal (Manager & Legacy). Productivity score is a regulatory audit
   signal **and** a financial-bonus signal **and** a prestige signal.
   Pipeline coverage from Staff Operations interacts with academy
   quality. No single existing context can host the cross-cutting
   surface without leaking outside its language.
6. **Low co-change with neighbours ✓** — academy cadence is **annual**
   (intake event + post-season promotion window); Squad's tick is
   continuous; Training's tick is weekly; Match's tick is per-fixture.
   Academy rule changes are decoupled from Squad/Training/Match
   evolution.

**Organisational alignment ✓** (bonus criterion per F5): real-world
Academy Director reports to Sporting Director, organisationally
separate from first-team operations. Vernon's bonus criterion fires.

**Inference:** all canonical Evans / Fowler / Vernon criteria fire
affirmatively. Same firing pattern as FMX-33 Community Overlay Pipeline
(six-of-six). Pattern is the **strongest** in the wave for an
operational ownership concern (FMX-26 / 28 / 30 / 34 each fired
five-of-six).

### F5 - Real-world football academy structure (Perplexity Query 3)

**Source:** [[raw-perplexity/raw-youth-academy-2026-05-28]] §Query 3
(Premier League EPPP page, DFB-NLZ Lizenzhandbuch, UEFA Club Licensing,
academic football-business journals, club annual reports).

**Confidence:** medium-high.

European top-tier academies 2024-2026 converge on a similar
**structurally separate organisational unit**:

- **EPPP Categories 1-4** (Premier League, England 2012-present):
  three phases (Foundation U-9-U-11, Youth Development U-12-U-16,
  Professional Development U-17-U-23). Audited on productivity +
  facilities + coaching + education & welfare + leadership +
  management + KPIs. Multi-year audit cycle. Recruitment-radius
  rules + Cat-4-no-pre-17 rule encode regulatory boundaries on
  intake.
- **DFB-NLZ** (Germany): mandatory licensed NLZ for Bundesliga + 2.
  Bundesliga. Categories 1-3 with infrastructure + staffing +
  education + curriculum minimums. League funding via DFL/DFB
  distributions + youth-development bonuses tied to German-trained
  minutes.
- **UEFA Home-Grown Player rule**: 25-player List A cap; 8 must be
  home-grown (4 club-trained 15-21 + 4 association-trained).
  Shrinking cap for <8 HGPs. Creates **economic shadow cost** for
  non-HGPs + HGP transfer premium → academy investment is
  economically rational under UEFA participation.
- **Organisational structure**: Sporting Director above. **Academy
  Director / Head of Academy** owns full programme U-9-U-23: budget,
  staffing, philosophy, compliance. Reports to Sporting Director,
  **not** Head Coach. First-team Head Coach has input on game-model
  alignment + loan-pathway but no line-management authority over
  academy staff. Phase Heads (Foundation / Youth Development /
  Professional Development) + age-group coaches + Head of Academy
  Recruitment + Head of Academy S&S Medicine + Head of Education +
  Player Care + Performance Analysts.
- **Exemplar academies**: La Masia (Barcelona, residential, Juego
  de Posición, Juvenil A + Barcelona B), De Toekomst (Ajax, Jong
  Ajax in Eerste Divisie as profit centre), City Football Academy
  (Manchester City, CFA complex, EPPP Cat 1 max), Hohenbuschei (BVB,
  NLZ + BVB II in 3. Liga), Liefering (RB Salzburg pipeline as
  Austrian 2nd-tier team).
- **Annual intake calendar**: U-9 first formal entry. U-16 → U-18
  scholarship gate is the **big attrition event**. U-18 → U-21
  Development squad / B team gate. Multiple European clubs run
  **reserve teams in real leagues** (BVB II, Barcelona B, Liefering).
- **Governance changes 2024-2026**: FA EPPP review (compensation +
  games programme + welfare); Brexit + GBE post-2021 reshapes
  English academies toward domestic recruitment; FIFA Article 19
  tightening on minor transfers; NCAA NIL modestly competes with EU
  pipeline.

**Implication for FMX-29.** Real-world football operations
**already** treat academy as a separate audited organisational unit
with its own director, budget, KPIs and licensing cycle. Modelling it
as a sub-aggregate of Squad & Player or Training would fight this
real-world structural precedent — the same anti-pattern called out in
FMX-26 (forcing Staff Operations into Club Management's finance
container) and FMX-33 (forcing Community Overlay Pipeline into Offline
Sync).

### F6 - Cross-context integration pattern (synthesis)

**Source:** F3 Vernon Process Manager + Reference/Snapshot patterns
applied to FMX context map.

**Confidence:** high.

The Youth Academy BC integrates with the existing 16 contexts via
canonical patterns:

| Integration | Pattern | Direction | Mechanism |
|---|---|---|---|
| Cohort generation → Squad & Player | **Snapshot** | Youth Academy → Squad & Player | `YouthCohortPublished` event with composition; Squad & Player materialises player records from snapshot. Subsequent academy edits do not retro-affect senior records. |
| Investment-cost posting → Club Management | Customer-Supplier + ACL | Youth Academy → Club Management | `AcademyInvestmentExpensePosted` event consumed by ADR-0050 ledger. No shared transactions. |
| HoY + U-team-coach effect readiness ← Staff Operations | Reference | Staff Operations → Youth Academy | Youth Academy queries `StaffEffectReadiness` for HoY + U-team-coach slots; intake quality + dev multipliers read live. |
| Scout regional coverage ← Scouting / Transfer | Reference | Scouting → Youth Academy | Youth Academy queries regional-coverage snapshot for cohort-quality computation. |
| Productivity score → Manager & Legacy | Published Language | Youth Academy → Manager & Legacy | `YouthPipelineQualityUpdated` consumed by GD-0019 archetype hook aggregation. |
| Home-grown share counter → Regulations & Compliance | Published Language | Youth Academy → Regulations | `HomeGrownShareRecalculated` consumed by `SquadRegistrationCheck` Anticorruption Layer per ADR-0056 Tax-catalog pattern. |
| Promotion-window opening ← League Orchestration | Reference | League → Youth Academy | Youth Academy reads `CurrentTransferWindow` status; promotion gate opens only during post-season window per GD-0007 §Decided / strong. |
| Intake event copy → Notification | Customer-Supplier | Youth Academy → Notification | `YouthIntakeEventTriggered` consumed by Notification per ADR-0043. |
| Process Manager: annual cycle | **Saga** inside Youth Academy BC | — | Orchestrates intake-calendar trigger → HoY opinion request → cohort-generation request → Squad & Player snapshot publication → Club Management ledger posting. Compensation handled per Vernon canonical pattern. |

This is the same Process-Manager + Snapshot pattern used in:

- FMX-26 ADR-0053 Staff Operations (wage events → Club Management
  ledger via Customer-Supplier).
- FMX-28 ADR-0055 Tactics (TacticSnapshot → Match at lineup_locked).
- FMX-30 ADR-0056 Regulations (EffectiveRuleSet snapshot at save
  creation; multi-context eligibility chains as Process Manager).
- FMX-33 ADR-0059 Community Overlay Pipeline (overlay snapshot at
  save creation; Process Manager for multi-BC validation delegation).

## Inputs for decisions

If Option C (own context) is accepted, ADR-0060 will encode:

- **Owner.** Youth Academy bounded context (17th or 18th depending on
  ADR-0059 ratification order).
- **Aggregates.**
  - `AcademySeason` (per-club, per-year): season FSM, intake-window
    timing, post-season promotion-window timing, investment-level
    snapshot.
  - `YouthCohort` (per-club, per-intake-year): cohort FSM, member
    list (cohort_member subaggregate per player), HoY opinion per
    member, promote / loan / release decision per member.
  - `AcademyInvestmentLevel` (per-club): per-season slider value,
    facilities tier, scout regional coverage.
  - `ProductivityCounter` (per-club): rolling productivity score per
    audit window (EPPP-analogue category signal).
  - `HomeGrownShareCounter` (per-club): rolling home-grown share per
    save-scope competition (per UEFA HGP analogue rule).
- **Public contract direction.**
  - Commands: `ScheduleYouthIntake`, `GenerateYouthCohort`,
    `DecidePromoteCohortMember`, `DecideLoanCohortMember`,
    `DecideReleaseCohortMember`, `SetAcademyInvestmentLevel`,
    `OpenAcademyPromotionWindow`, `CloseAcademyPromotionWindow`,
    `ArchiveAcademySeason`.
  - Events: `YouthIntakeScheduled`, `YouthCohortGenerated`,
    `YouthIntakeEventTriggered`, `YouthCohortPublished`,
    `YouthPromoted`, `YouthLoaned`, `YouthReleased`,
    `AcademyInvestmentChanged`, `AcademyInvestmentExpensePosted`,
    `HomeGrownShareRecalculated`, `YouthPipelineQualityUpdated`,
    `AcademySeasonArchived`.
  - Read models: `AcademyCohortBoard` (intake-event UI),
    `AcademySeasonOverview` (Development-Centre-style aggregate),
    `AcademyInvestmentDashboard`, `ProductivitySnapshot`,
    `HomeGrownShareSnapshot`, `YouthCohortHistory`.
  - Consumed facts: `StaffEffectReadinessUpdated` (HoY + U-team-coach
    quality from Staff Operations), `ScoutRegionalCoverageUpdated`
    (Scouting / Transfer), `CurrentTransferWindow` (League
    Orchestration), `SaveSnapshotInitialised` (Save creation per
    ADR-0027 + ADR-0051), `EconomyWeekAdvanced` (Club Management).
- **Determinism + storage rules.**
  - Per-save schema only (`save_<uuidv7hex>` per ADR-0027); no
    platform-scope cross-save state inside the BC.
  - Cross-save legacy seeds (academy reputation, EPPP-analogue
    starting category, productivity history) flow through ADR-0051
    Manager & Legacy at **save creation only**.
  - Cross-save pack overrides (community editor: regional yield
    tweaks, archetype name pools) flow through ADR-0059 Community
    Overlay Pipeline (proposed) at **save creation only**; Youth
    Academy BC owns schema + semantic validation per Vernon (same
    pattern as Regulations + Rivalry).
  - All cohort generation uses `IntakeRng(saveId, clubId, year)` sub-
    label of `WorldRng` per ADR-0018 §3. No cross-RNG draws.
  - All state transitions use deterministic clocks (per ADR-0027 +
    ADR-0051); no `Date.now`.
- **Map patch proposal** (order-tolerant; applies on Nico Accept):
  - §1 sixteen → seventeen bounded contexts table row.
  - §2 high-level Mermaid: `YouthAcademy` node + edges to / from
    Squad, Training, Club, Staff, Manager & Legacy, Regulations,
    Notification, League, Scouting/Transfer.
  - §4 source mapping: `src/domain/youth-academy/` folder.
  - §5 Customer-Supplier relationships explicit.

## Why not Option A (sub-aggregate inside Squad & Player)?

- Squad's ubiquitous language is player-record + attribute + contract;
  intake-event + cohort + EPPP-category-audit + post-season-promotion-
  window are foreign concepts.
- Annual cadence does not match Squad's continuous lifecycle. Hiding
  an annual cohort FSM inside Squad pollutes Squad's tests.
- Productivity score + home-grown share + investment expense are
  cross-cutting signals; Squad as owner privileges one consumer (its
  own player records) and forces Regulations + Manager & Legacy +
  Club Management + Fan Ecology to query Squad for non-Squad
  concerns. Same anti-pattern as FMX-26 (Staff in Club Management) or
  FMX-33 (Community Overlay in Offline Sync).

## Why not Option B (sub-aggregate inside Training)?

- Training's ubiquitous language is weekly load + block + intensity +
  fatigue; intake event + cohort review + investment slider + EPPP
  category are foreign.
- Weekly cadence does not match annual cohort cadence. Hiding annual
  cycle inside Training pollutes Training's tests.
- Training already consumes Staff Operations effect readiness for
  coach effects; making Training also consume + publish academy
  signals would conflate two scarcity systems (Trainer-Cap = 5 vs
  academy quality multipliers).
- Per ADR-0018 §1, Training computes development signals **per
  player**; academy operates **per cohort**. Different aggregate
  shape.

## Why not Option D (sub-aggregate inside Staff Operations)?

This is a non-obvious option since Staff Operations owns HoY +
U-team-coaches. But:

- Staff Operations' ubiquitous language is hire / fire / contract /
  wage / role-assignment / pipeline-coverage; intake event + cohort +
  promotion-gate + investment-slider are foreign.
- Real-world structural precedent (F5) places **Academy Director +
  Head of Academy = own organisational unit** reporting to Sporting
  Director — distinct from Staff Operations' staff-contract-lifecycle
  scope. Staff Operations is the **HR ops** layer; Youth Academy is
  the **academy operations** layer. Both share Sporting Director as
  upstream but have different downstream consumers and KPIs.
- Per ADR-0053 §Decision, Staff Operations owns `StaffContract` +
  `StaffRoleAssignment` + `PipelineCoverage` + `WageSchedule` —
  intentionally **not** academy aggregates. ADR-0053's §Decision says
  "Staff Operations does not own player contracts, wages or
  transfers" — and youth players (academy members) are players,
  putting them outside Staff Operations' scope.

## Future-scope notes (classified future-scope)

These items are referenced by the synthesis but are not Option
ratification blockers; they belong to subsequent beats:

1. **Loan environment Process Manager** — `youth-academy-and-development.md`
   §6 defines loan factors (league quality, play-style match, promised
   role, coach quality, guaranteed minutes, medical standards). Loan
   orchestration is a multi-BC Process Manager (Youth Academy +
   Transfer + Squad & Player + Match). FMX-29 names the surface;
   loan-orchestration ADR is a follow-up beat.
2. **EPPP-analogue category audit cycle** — real-world EPPP Cat 1-4
   with multi-year audit. FMX-29 owns the productivity score; the
   audit-cycle Process Manager (audit-window FSM, downgrade-trigger
   policy, central-funding bonus posting) is a follow-up beat.
3. **Reserve-team B-team-in-real-league** — Liefering / Barcelona B /
   BVB II / Jong Ajax pattern. Possible bridge between U-21 and
   senior. League Orchestration owns competition entry; Youth Academy
   owns the bridge-cohort lifecycle. Follow-up beat after MVP
   stability proven.
4. **Brexit + GBE + FIFA Article 19 regulatory shifts** — Regulations
   & Compliance (ADR-0056) owns the rule set; Youth Academy consumes
   `EligibilityForYouthSignature` query per ACL. Follow-up beat after
   Regulations BC stabilises.
5. **NIL / NCAA college-pipeline analogue** — out of MVP scope.
6. **Wonderkid emergent tagging** — per GD-0007 §Open Wave 2.
   Emergent from PA-range overlap; UI annotation. FMX-29 owns the
   read model channel; the tagging policy is gameplay-tuning.
7. **Intake regional yield community overrides** — covered by
   ADR-0059 Community Overlay Pipeline (proposed). Youth Academy
   BC owns schema + semantic validation per Vernon when ADR-0059
   ratifies.
8. **Per-region "youth nations" dynamic drift** — per GD-0007 §Open
   Wave 2 R2-06. Future world-event policy inside Youth Academy or
   via WorldEventDirector per ADR-0018. Follow-up beat.
9. **Manager-archetype "youth-pipeline-yield" signal weight** —
   GD-0019 archetype-roguelite progression names Tactical-Identity
   and similar signals; "youth-yield" is a candidate signal. FMX-29
   owns the signal channel; weight calibration is post-MVP.
10. **Cohort-history retention policy** — long-tail academy data over
    20+ in-game seasons. Squad/Manager & Legacy archive may apply.
    Follow-up beat tied to GD-0019 prestige cycle.

## Recommendation

**Option C — Youth Academy as own bounded context (17th if FMX-29
lands before ADR-0059 ratification, 18th otherwise).**

Three converging arguments:

1. **F4 DDD criteria fire strongest in wave.** Six-of-six split
   criteria fire affirmatively (equal to FMX-33 wave high; stronger
   than FMX-26 / 28 / 30 / 34). Vernon's canonical long-running-
   process + Process Manager / Saga + Snapshot pattern is the direct
   DDD analogue. Real-world DDD textbook examples (university
   admissions, clinical-trial cohort, apprenticeship) all separate
   cohort lifecycle from operational neighbours.

2. **F5 real-world organisational + regulatory precedent.** Premier
   League EPPP Categories 1-4 + DFB-NLZ licensing + UEFA HGP rule +
   Academy Director reporting to Sporting Director **all** treat
   academy as separate audited organisational unit with own budget,
   own KPIs, own multi-year audit cycle, own director. La Masia,
   De Toekomst, City Football Academy, Hohenbuschei, Liefering all
   structurally separate. The genre and the real world agree.

3. **F2 genre precedent.** All five major football management sims
   (FM, EA FC CM, OOTP, FIFA Manager, Anstoss) treat the academy as
   structurally separate persistent area with distinct UI + staff +
   lifecycle. Single-player-entity + multi-team-membership pattern is
   universal; the academy distinction lives in team assignment +
   contract type + lifecycle, not in player schema. Modelling Youth
   Academy as a sub-aggregate of Squad would surprise playtesters who
   expect the FM-Development-Centre / EA-FC-Youth-Academy-screen
   shape.

Named risks (mitigations in §Map-patch + ADR-0060 §Determinism + Open-
question section):

- **Map growth.** Adds the 17th or 18th bounded context (sequencing
  depends on ADR-0059). The modular monolith stays one process per
  ADR-0019. Service extraction remains a deployment change.
  Mitigation accepted in wave-2 plan; same pattern as Manager & Legacy
  / Staff Operations / Tactics / Regulations / Rivalry / Community
  Overlay Pipeline.
- **Coordination with Staff Operations + Training + Squad & Player +
  Club Management + Manager & Legacy + Regulations.** Six consumers
  + two suppliers. Discipline required. Mitigation: explicit Customer-
  Supplier contracts per §F6; Snapshot pattern on cohort → Squad &
  Player keeps coupling loose.
- **Loan environment is multi-BC Process Manager.** Future-scope per
  §Future 1. ADR-0060 names the surface; loan-orchestration ADR is a
  follow-up beat. Not a ratification blocker.
- **Cross-save legacy + community-overlay seeds.** Per ADR-0051 +
  ADR-0059 (proposed). Youth Academy BC owns semantic validation;
  schema validation flows through Community Overlay Pipeline if
  ADR-0059 ratifies.
- **EPPP-analogue rule terminology.** `risk:legal` discipline applies
  per GD-0015 + ADR-0007: no real EPPP / NLZ / UEFA naming inside
  the BC's gameplay-facing language; abstract category-tier model
  encodes the pattern without infringement.

Status stays `proposed` / `binding: false` until Nico ratifies.

## Cross-references

- Phase 1 grounding inputs: [[../50-Game-Design/GD-0007-youth]] · [[../50-Game-Design/youth-academy-and-development]] · [[../50-Game-Design/squad-and-club-structure]] · [[../50-Game-Design/training-load-and-medicine]] · [[../50-Game-Design/scouting-and-recruitment]] · [[../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]] · [[../10-Architecture/bounded-context-map]] · [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]] · [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]] · [[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]] · [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]] · [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]] · [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]] · [[../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]].
- Phase 2 raw research: [[raw-perplexity/raw-youth-academy-2026-05-28]].
- Phase 4 draft ADR: [[../10-Architecture/09-Decisions/ADR-0060-youth-academy-context]].
- Workflow: [[../30-Implementation/domain-research-workflow]].
