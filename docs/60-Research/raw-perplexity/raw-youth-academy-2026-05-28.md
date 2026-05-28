---
title: Raw - Youth Academy Lifecycle Ownership Research (FMX-29)
status: raw
tags: [research, raw, perplexity, youth, academy, lifecycle, bounded-context, fmx-29]
created: 2026-05-28
updated: 2026-05-28
type: raw-research
binding: false
linear: FMX-29
sourceType: perplexity
related:
  - [[../youth-academy-bounded-context-2026-05-28]]
---

# Raw - Youth Academy Lifecycle Ownership Research (FMX-29)

> Three Perplexity queries run during FMX-29 to support the youth-academy
> lifecycle ownership recommendation. Raw input; not implementation
> authority. Synthesis at
> [[../youth-academy-bounded-context-2026-05-28]].

## Why these queries

The 16-context map (post-FMX-40) has no Youth Academy owner. GD-0007
(`binding: true`) and `youth-academy-and-development.md` (`binding:
true`) jointly specify the academy pipeline (Scout → Intake → U-16 →
U-18 → U-21 → Senior) with annual cadence + promotion gate
(age ≥17 + two youth weeks + post-season transfer window) + per-season
investment slider + Head-of-Youth opinion model + intake event (3-12
players, promote/release choice). ADR-0053 Staff Operations (accepted)
owns Head-of-Youth + U-team-coach roles as quality multipliers.
ADR-0018 Systemic Events (accepted) splits weekly development
computation across Training (signals) + Squad & Player (persistence).
The **intake event FSM**, **cohort lifecycle**, **investment ledger**,
**home-grown share signal** and **promotion-gate enforcement** have no
named owner.

Three queries target the ownership decision:

1. **Genre precedent** - how do FM, EA FC Career Mode, OOTP, FIFA
   Manager and Anstoss model the academy lifecycle (intake calendar,
   promotion gates, staff multipliers, investment slider, UI shape)?
2. **DDD authority** - when does a cohort lifecycle with annual cadence
   and multi-context inputs warrant its own bounded context? Vernon
   long-running-process + Process Manager / Saga pattern; Evans/Fowler
   strategic-design criteria; real-world DDD analogues (admissions,
   clinical trials, HR talent pipeline, apprenticeship); Snapshot vs
   Reference pattern.
3. **Real-world** - canonical structure of European top-tier academies
   2024-2026: Premier League EPPP Categories 1-4, DFB-NLZ licensing,
   UEFA Home-Grown Player rule, Academy Director organisational
   reporting line, U-9 → U-23 progression, La Masia / De Toekomst /
   Manchester City CFA / Hohenbuschei / Liefering pipeline models,
   Brexit + GBE + FIFA Article 19 governance shifts.

## Query 1 - Genre precedent

**Prompt:** Football management simulation games — how is the youth
academy lifecycle modelled in Football Manager 2023-2026, EA Sports FC
Career Mode 2024-2026, OOTP 24-26, FIFA Manager, and Anstoss series?
Intake calendar / annual cadence; promotion gates U-18/U-19/U-21 →
senior; HoY + U-team-coach quality multipliers; per-season investment;
UI shape (separate area vs squad sub-view); FM .fmf editor data model
distinction between academy and senior records.

**Confidence:** medium-high (FM is well documented; EA FC patch notes
+ OOTP manual + FIFA Manager legacy guides are partial; Anstoss is
community-reconstructed).

**Findings (raw, not synthesised):**

- **FM 2023-2026**: single annual youth intake per club, nation-
  specific date (March in most European nations), defined in editor as
  per-nation `Youth Intake Date`. No mid-season top-up. Distinct U-18
  / U-21 / U-23 squad entities with their own Squad/Tactics/Training
  views plus an aggregate **Development Centre** screen showing all
  youth squads + Top Prospects + Youth Candidates pre-intake preview.
  Promotion gate is **not** age-locked; players move squad-to-squad
  freely via Development Centre. Youth contracts apply until ~17-18;
  inbox prompts to offer pro terms at 18. **HoYD attributes drive
  intake quality**: Judging Player Potential (PA of regens), Working
  With Youngsters (dev rate), personality/tactical preference biases
  archetype mix. Club-level ratings: Youth Recruitment (range +
  ceiling of PA), Junior Coaching (CA at intake), Youth Facilities
  (post-intake dev). All upgraded via board requests, persistent. In
  .fmf data model: **players are single entity type**; academy vs
  senior distinction lives in **team assignment** + **contract type**
  (youth vs professional) + **competition eligibility** at nation
  level. Academy itself is not an object type — it emerges from
  multiple youth-team entities per club + nation youth-generation
  rules + club youth ratings. Persistent separate area.
- **EA FC Career Mode 2024-2026**: rolling youth scouting (no fixed
  intake date), scouts sent 3-9 months per country, prospects surface
  monthly in scouting reports. Separate Youth Academy screen. Promotion
  is age-gated (16+) but no waiting-period; instant promote. No HoYD-
  equivalent staff role; Dynamic Potential adjusts based on manager
  rating. No persistent Junior Coaching / Youth Recruitment slider —
  only scout hire cost. Persistent separate area.
- **OOTP 24-26**: equivalent is amateur draft + international FA pools.
  League-configurable. Minor League System + International Complex as
  separate team entities. Roster movements continuous, gated by minor-
  league age limits + option years. Scouting Director + Player
  Development + Scouting budget sliders adjust annually. Persistent
  separate organisational area (multiple sub-teams).
- **FIFA Manager legacy**: per-season youth intake from Youth Center,
  quality scales with Youth Center level + Youth Coach + youth
  development budget slider. Promotion menu-driven from youth center.
  Persistent separate area.
- **Anstoss series**: per-season Nachwuchs intake from
  Nachwuchsabteilung, quality scales with Nachwuchsförderung budget.
  Promotion when age threshold met (typically 18) + senior squad slot
  open. Persistent separate area.

**Convergence**: every major football management sim treats the
academy as a **structurally separate persistent area** — distinct UI,
distinct staff, distinct lifecycle. The single-player-entity + multi-
team-membership pattern is universal; the academy distinction lives
in **team assignment + contract type + lifecycle**, not in a separate
player schema. FM's HoYD + Youth Recruitment + Junior Coaching +
Facilities multi-input quality model is genre-standard. Annual cadence
+ separate budget slider + separate staff slot pattern is consistent
across all 5 sims.

## Query 2 - DDD authority

**Prompt:** Domain-Driven Design — when does a lifecycle pipeline with
annual cadence + cohort generation + multi-context inputs warrant its
own bounded context vs sub-aggregate? Vernon's long-running-process +
Process Manager / Saga pattern; Evans/Fowler strategic-design criteria;
real-world DDD analogues for cohort-pipeline contexts (university
admissions, clinical trial cohort, HR talent pipeline, apprenticeship);
Process Manager vs aggregate FSM; Reference vs Snapshot pattern;
Vernon's explicit criteria for factoring out a lifecycle BC.

**Confidence:** high (Vernon IDDD + Evans Blue Book + Fowler + Context
Mapper SummerSoC + Schimak/Rücker process-manager literature
converge).

**Findings (raw, not synthesised):**

- **Vernon's long-running-process pattern** (IDDD): model long-running
  business processes as **process manager / saga** + aggregates
  representing stateful participants. Coarse time granularity (weeks,
  months, years); stateful progression; cross-context coordination
  via Process Manager.
- **Evans / Fowler criteria for splitting** into own bounded context:
  1. Distinct ubiquitous language.
  2. Distinct FSM and invariants.
  3. Separate data lifecycle / storage / retention.
  4. Multiple consumers / cross-cutting role.
  5. Low co-change with neighbours.
  6. Organisational / team alignment.
  When most criteria fire → own bounded context, not sub-aggregate.
- **University admissions cohort BC**: **textbook own-BC**. Annual
  cadence, distinct language (application, evaluation, offers,
  acceptance, waitlist, deferrals), separate FSM, multiple downstream
  consumers (Enrollment, Billing, Reporting). Typically split into
  Admissions BC + Student Records BC + Curriculum / Progression BC.
- **Clinical trial cohort BC**: **canonical DDD example**. Strict
  ubiquitous language (protocol, inclusion/exclusion, randomization,
  arms, visit schedule, endpoints), regulatory audit requirements
  distinct from clinical care or billing, strict FSM by protocol,
  multiple consumers (EDC, Safety, Reporting, Site Management).
  Typically split into Protocol/Trial Design BC + Subject/Cohort
  Management BC + EDC BC + Pharmacovigilance BC.
- **Apprenticeship lifecycle BC**: **strong own-BC candidate**.
  Annual/multi-year cadence, regulatory/credentialing flavour
  (external bodies), capacity-planning / compliance-reporting / cohort
  unit. Distinct from Payroll + Project Assignment.
- **HR talent pipeline**: **borderline**. Depends on organisation. If
  treated as strategic capability with own language + analytics →
  own BC. If simple onboarding + perf → sub-aggregate inside People/HR.
- **Process Manager / Saga vs Aggregate FSM**:
  - Aggregate FSM = local invariants + state transitions inside one
    context.
  - Process Manager / Saga = cross-BC orchestration, time-triggered
    transitions, retries, compensation.
  - Use both: small aggregate FSM for local invariants + Process
    Manager in cohort BC for cross-BC coordination.
- **Reference vs Snapshot pattern** for downstream consumption:
  - **Reference**: downstream stores stable ref (cohortId) + queries
    cohort BC for details. Live coordination, runtime coupling.
  - **Snapshot**: cohort generation event publishes composition;
    downstream materialises own aggregates from snapshot. Loose
    coupling, temporal decoupling. **Sports roster from annual cohort
    typically uses Snapshot at draft/selection time** (literal genre
    parallel to FMX domain).
- **Vernon explicit criteria** for factoring out a lifecycle BC:
  1. Long-running process with own lifecycle and FSM not aligned with
     existing contexts' time scales.
  2. Coordination of multiple aggregates and/or contexts otherwise
     creating oversized aggregates or dependency webs.
  3. Different change rate / evolution frequency than neighbours.
  4. Core or supporting domain logic reused/consumed by multiple BCs.
  5. Specific non-functional aspects (auditing, compliance, retention)
     differing from neighbours.
  6. Separate ownership by team/organisation.

Recommended pattern when all fire: own BC + aggregates + Process
Manager + events with snapshot to fast-tick downstream consumers.

## Query 3 - Real-world football academy operations

**Prompt:** Real-world football academy operations 2023-2026 -
canonical structure of European top-tier academies. Premier League
EPPP Categories 1-4 licensing (coaching hours, facilities, education,
productivity, intake quotas, recruitment radii, audit cycle); DFB-NLZ
licensing system; UEFA Home-Grown Player rule (8/25, 4 club-trained,
15-21) and economic incentives; Academy Director organisational
reporting line to Sporting Director vs Head Coach; annual intake
calendar U-9 to U-23 progression cadence; licensing audits at La
Masia, De Toekomst, City Football Academy, Hohenbuschei/BVB,
Liefering/RB Salzburg; governance changes 2024-2026 (FA EPPP review,
Brexit GBE, FIFA Article 19, NCAA NIL).

**Confidence:** medium-high (structures + rules well-supported via
Premier League EPPP page + DFB-NLZ Lizenzhandbuch + UEFA licensing +
academic football-business journals; some numeric cut-offs reconstructed
from coach-education materials rather than full primary docs).

**Findings (raw, not synthesised):**

- **EPPP Categories 1-4**: three development phases (Foundation U-9-
  U-11, Youth Development U-12-U-16, Professional Development U-17-
  U-23). Audited on productivity + facilities + coaching + education
  & welfare + leadership & management + KPIs. Cat 1 = elite, full-
  time multi-disciplinary staff, in-house education provision,
  state-of-the-art facilities; Cat 4 = U-17-U-23 only, no younger
  programme. Recruitment radii: U-9-U-11 within 1 hour travel; U-12-
  U-16 within 90 min; over-16 unrestricted. Cat 4 cannot recruit
  below U-17. Productivity scores tied to professional appearances
  drive compensation tariffs + audit category. Multi-year audit
  cycle (~3-4 years).
- **DFB-NLZ system**: mandatory licensed NLZ for Bundesliga + 2.
  Bundesliga. Categories ~1-3. Minimum requirements on infrastructure
  (pitches, indoor hall, gym, medical), staffing (Academy Director +
  Phase Heads + GK coaches + analysis + sports science + medical +
  education), education & welfare, coaching hours & curriculum.
  League funding via DFL/DFB central distributions + youth-development
  performance bonuses tied to German-trained-player minutes.
- **UEFA Home-Grown Player rule**: 25-player List A cap; up to 4 must
  be club-trained (3+ years between 15-21 at club); up to 4 additional
  association-trained. <8 HGPs → squad cap shrinks. Creates economic
  shadow cost for non-HGPs + HGP transfer premium + makes internal
  academy development cheaper than buying HGP-eligible externally.
  Compliance risk for shallow academies.
- **Academy organisational structure**: Sporting Director / Technical
  Director above. **Academy Director / Head of Academy** owns full
  programme U-9-U-23: budget, staffing, philosophy, compliance.
  Reports to Sporting Director, **not** Head Coach. Phase Heads
  (Foundation / Youth Development / Professional Development), each
  with age-group coaches. Support departments: Head of Academy
  Recruitment + Head of Academy S&S Medicine + Head of Education &
  Player Care + Performance Analysts. First-team Head Coach has
  input on game-model alignment + loan-pathway, no line-management
  authority over academy staff.
- **Annual intake calendar**: U-9 first formal academy entry. U-9-
  U-11 Foundation. U-12-U-16 Development. **U-16 → U-18 scholarship
  gate** (big attrition event). U-18 scholar competing in U-18 league
  + FA Youth Cup. U-19 UEFA Youth League if club qualifies. U-21 →
  Development squad / B team. Multiple European clubs run **reserve
  teams in real leagues**: BVB II in 3. Liga, Barcelona B, Salzburg/
  Liefering, etc.
- **Exemplar academies**: La Masia (FC Barcelona, residential, Juego
  de Posición, Juvenil A + Barcelona B), De Toekomst (Ajax, Jong Ajax
  in Eerste Divisie, profit centre via player sales), City Football
  Academy (Manchester City, CFA complex, EPPP Cat 1 max, post-Brexit
  domestic-shifted), Hohenbuschei (BVB, NLZ + BVB II in 3. Liga, fast-
  track integration), Liefering (RB Salzburg pipeline as Austrian 2nd
  div team).
- **Governance changes 2024-2026**:
  - **FA EPPP review**: ongoing review of compensation tariffs +
    games programme + welfare/education. Iterative changes.
  - **Brexit + GBE**: post-2021 English clubs cannot freely sign EU
    16-18 youth (FIFA Article 19 minors rule); GBE points threshold
    for non-UK seniors. Shift to **domestic-academy reliance +
    delayed foreign signing at 19-21+**.
  - **FIFA Article 19 tightening**: stricter TMS enforcement on
    minor-transfer exemptions + penalties.
  - **NCAA NIL**: US college soccer players can earn from
    endorsements; MLS Next Pro + academies compete with college
    pipeline. Modest impact on EU recruitment; reduces 16-18 US
    talent moving to Europe.

## Convergence summary (for synthesis)

| Source | Conclusion | Confidence |
|---|---|---|
| Genre (Q1) | Every major football sim treats academy as structurally separate persistent area | medium-high |
| DDD (Q2) | Annual cohort lifecycle = textbook own-BC when 5-6 criteria fire (admissions + clinical-trial textbook precedents) | high |
| Real-world (Q3) | EPPP + NLZ + UEFA HGP create explicit organisational + regulatory separation: Academy Director reports to Sporting Director, multi-year audit cycle, separate budget, separate KPIs | medium-high |

All three sources converge: youth academy lifecycle is a strong
candidate for own bounded context (Option C in the FMX-29 ADR draft).
