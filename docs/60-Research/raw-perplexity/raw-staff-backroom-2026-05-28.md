---
title: Raw - Staff & Backroom Ownership Research (FMX-26)
status: raw
tags: [research, raw, perplexity, staff, backroom, lifecycle, bounded-context, fmx-26]
created: 2026-05-28
updated: 2026-05-28
type: raw-research
binding: false
linear: FMX-26
sourceType: perplexity
related:
  - [[../staff-backroom-bounded-context-2026-05-28]]
  - [[../eos-player-staff-skills-and-personas-2026-05-28]]
---

# Raw - Staff & Backroom Ownership Research (FMX-26)

> Three Perplexity queries run during FMX-26 to support the staff-lifecycle
> ownership recommendation. ADR-0052 (People, Persona & Skills) already
> owns staff identity/persona/skill profile - this beat answers who owns
> the *operations*: hire/fire/contract, role assignment, pipeline coverage,
> wage event emission. Raw input, not implementation authority. Synthesis
> in [[../staff-backroom-bounded-context-2026-05-28]] reconciles with the
> vault.

## Why these queries

ADR-0052's explicit non-responsibilities list excludes staff lifecycle,
wage events, role assignment, pipeline-coverage tracking and
specialisation effects. The current 12-context bounded-context map has no
home for these. The three queries target the architectural decision
directly:

1. **Genre precedent** - is staff a finance sub-system or a separate
   operational domain in comparable sims?
2. **DDD authority** - what are the canonical split criteria, and what is
   the standard pattern for ops-context emitting events into a
   finance/ledger context?
3. **Real-world grounding** - how do actual 2024-2026 clubs structure
   sporting-director vs head-coach authority, staff hiring approvals and
   backroom-staff wage regulation?

## Query 1 - Football management sim staff lifecycle

### Prompt

How do football management simulations model the backroom-staff lifecycle
(hire, fire, contract, wage, role assignment) for non-playing staff
(coaches, sport directors, chief scouts, analysts, fitness, medical,
set-piece, GK, head of youth, U-team coaches)? Compare FM, EA FC Career
24/25/26, Out of the Park, FIFA Manager and Anstoss. Sub-questions: (1)
finance sub-system or separate operational domain? (2) role slots vs
free-role? (3) pipeline-coverage multipliers? (4) coach specialisations
tied to training? (5) developer-source citations.

### Output summary

- **Perplexity confidence is low for this query.** Available sources do
  not include developer code-level breakdowns for the named titles. The
  strongest direct evidence is for Football Manager via a YouTube
  high-level description; EA FC, OOTP, FIFA Manager and Anstoss have **no
  primary documentation** in the result set.
- **Football Manager** (defensible inference, not documented): staff is
  modelled as **part of the club operational management layer rather than
  pure finance**. Hiring, firing, contracts and wages are managed through
  staff pages with named role slots. Pipeline-coverage and adjacency
  multipliers are not explicitly documented; only inferable from
  behaviour.
- **EA FC Career, OOTP, FIFA Manager, Anstoss**: no documented evidence
  in the result set. Perplexity recommends a second-pass source-hunt
  through manuals, devlogs, patch notes and developer forum posts.
- **Operational vs finance**: for FM, "the most defensible inference is
  that staff management is a separate operational domain with financial
  consequences, because staff are managed as discrete club personnel
  rather than as a pure budget line, but this inference is not directly
  documented in the provided sources."
- **Role-slot architecture**: FM uses "named role slots and staff roles
  rather than fully free-form assignment, but the supplied results do not
  explicitly document that implementation."

### Citations Perplexity returned

- [1] blog.bincom.net - simulation-based coaching education (real-world,
  not game)
- [2] YouTube - FM general-management description
- [3] YouTube - real-football coaching/scouting roles
- [4] higherechelon.com - virtual sports training consulting
- [5] ablogaboutfootball.substack.com - FM vs real life
- [6] avenakodumasinad.ee - Football Coach 2 analysis

### Confidence

**Medium-low.** Perplexity flagged source weakness explicitly. Genre
inference (staff as operational domain) is consistent with what FMX
already designs in `squad-and-club-structure.md`, so the conclusion holds
on its own merits; the citations just don't add force.

## Query 2 - DDD pattern for operational sub-aggregate vs bounded context

### Prompt

In DDD, when does an operational sub-aggregate warrant its own bounded
context vs sub-aggregate of an existing context? Cite Evans, Vernon,
Alagarsamy or other authorities. What is the standard pattern for an
operational context emitting cost/wage events into a finance/ledger
context without violating isolation (domain events, ACL, eventually
consistent projections)? For staff/personnel referenced by multiple
gameplay subsystems, what is the canonical context-mapping pattern? Real
or open-source examples of HR/staff as own context vs sub-module.

### Output summary

- **Six canonical split criteria** (Evans + Vernon + practitioners,
  consolidated):
  1. **Own ubiquitous language & meaning drift** - same term has
     different meaning in different parts (e.g., "Coach" in HR vs
     gameplay).
  2. **Own lifecycle / state machine** - hiring → active → suspended →
     terminated differs from gameplay state machines.
  3. **Own storage boundary & data ownership** - "each bounded context
     owns its data store" (one context = one schema/database).
  4. **Different consumers / cross-cutting role** - if the same model is
     consumed by HR + Training + Transfers + Finance with different views
     and invariants, it's a separate upstream context.
  5. **Organisational boundaries & independent teams** - separate teams
     own separate contexts.
  6. **Co-change & shared invariants (counterargument)** - if two pieces
     always change together and share invariants, **don't split**.
- **Ops → finance integration pattern (canonical)**:
  1. **Domain events as first-class integration** - operational context
     emits `EmployeeHired`, `StaffAssignedToTeam`, `ContractSigned`,
     `WageRateChanged`.
  2. **Customer-Supplier + Published Language** - event schema is the
     contract.
  3. **Anti-Corruption Layer in Finance** - listens to operational events
     and translates to Finance commands (`CreateWageObligation`,
     `UpdateCostAllocation`).
  4. **Eventual consistency** - no shared transactions, no shared DB.
- **Staff/personnel canonical mapping**:
  - **HR/Staff as own upstream context** owns `StaffMember`,
    `EmploymentContract`, `BaseRole`.
  - Each downstream context (Training, Transfers, Finance) references
    staff by `StaffId` and defines its own language (HeadCoach,
    AssistantCoach, FitnessCoach in Training; Scout, RegionAssignment in
    Transfers; WageCost, BudgetLineItem in Finance).
  - **Customer-Supplier + ACL, avoid Shared Kernel** - cross-cutting
    models with multiple downstream consumers belong in their own context.
- **When to keep as sub-module instead**: small systems with single team,
  unified language, high co-change between staff and other concerns.
  Recommended split when system grows, HR/Staff gets own owners and
  integrations.
- **Example code patterns**: `StaffMember` aggregate root in HR context
  emits domain events; Training context creates `CoachAssignment` from
  `StaffMemberHired`; Finance context has an ACL handler that translates
  HR events into wage obligations.

### Citations Perplexity returned

- [1] software-architecture-guild.com - bounded contexts
- [2] oneuptime.com - DDD boundaries when splitting monolith on GCP
- [4] martinfowler.com/bliki/BoundedContext.html - Fowler/Evans canonical
- [5] YouTube - DDD context boundaries
- [6] learn.microsoft.com - Azure microservices domain analysis
- [8] contextmapper.org SummerSoC 2020 PDF - domain-driven service design

### Confidence

**High.** Multiple DDD authorities cited (Fowler/Evans canonical Martin
Fowler page, Microsoft Learn, Context Mapper SummerSoC paper). The split
criteria are consistent across authoritative sources. The ops → finance
pattern (events + ACL + eventual consistency) is textbook DDD.

## Query 3 - Real-world 2024-2026 football club structure

### Prompt

Real-world organisational structure of professional football clubs
2024-2026 for hiring and managing backroom staff: (1) Sport
Director / Director of Football model (who uses it, what they own,
decision split with head coach); (2) dual-key approvals for hiring; (3)
salary cap allocation between players and staff (Premier League,
Bundesliga, La Liga, MLS, FFP/PSR); (4) modern backroom composition,
specialisations and contract terms; (5) recent 2023-2026 sources.

### Output summary

- **Sporting Director model is default in top European leagues** in
  2024-2026. Default structure: CEO/MD → Sporting Director (football
  ops) → Head Coach. Sub-titles vary (sporting director, director of
  football, technical director, GM) but the **functional split is
  consistent**.
- **What Sporting Director owns:**
  - Squad planning, transfer strategy, target identification, fee
    negotiation, sell-on/bonus structures.
  - Player contract negotiation, wage structure, extension policy.
  - **Staff hiring in the football department** - including head coach
    (with board sign-off), scouting/analysis/medical/performance/academy
    staff; approval/veto on first-team backroom additions proposed by
    coach.
  - Club-wide game model / playing philosophy that outlives individual
    coaches.
  - FFP/PSR compliance with CFO.
- **What head coach owns**: training, tactics, matchday, daily squad
  management, input on recruitment (profile needs, target ranking).
- **Dual-key approval patterns observed:**
  - "Coach proposes; director/board approves" - coach recommends
    assistants and key specialists; sporting director / CEO must approve
    role within headcount and budget, candidate's fit with club policy;
    board signs off senior hires.
  - "Director picks structure; coach fills some roles" - director defines
    role slots; coach selects within subset; key infrastructure roles
    (Head of Medical, Performance, Analysis) stay under director control.
  - Mitigation against coach-turnover staff cascades: **clubs cap
    "attached staff"** that move with coach; protect performance, medical
    and data departments by keeping under director control.
- **Salary cap allocation between players and staff:**
  - **No major league caps backroom staff separately** from player wages.
  - Premier League: no hard cap; PSR (Profit & Sustainability) + 2025-26
    UEFA-style squad cost ratio cap on player wages + transfers + agents.
  - Bundesliga / La Liga: subject to UEFA Financial Sustainability
    Regulations; squad cost ratio defined around players and head coach,
    not all staff.
  - La Liga "cost control" focuses on registered players + technical
    staff salaries vs revenue.
  - MLS: team salary budget covers senior-roster player wages;
    **coaches/technical staff explicitly outside the cap**.
  - Backroom staff wages are operating expenses, not separately
    regulated.
- **Modern backroom composition** (top-flight 2024-2026):
  - 25-40+ non-playing football staff around the first team alone.
  - Coaching: head coach, 1-3 assistants, attacking/defensive/set-piece
    specialists, GK coach, individual development.
  - Performance/medical: club doctor, physios, sports scientists,
    rehab, nutrition, psychologists / mental-performance coaches,
    sleep/recovery, player liaison.
  - Analysis/scouting/data: head of recruitment / chief scout, scouts,
    head of performance analysis, match/training analysts, data
    scientists/engineers, opposition + set-piece analysts.
  - Academy: academy director, age-group coaches, analysts, physios,
    loans/pathway manager.
  - Admin: team operations manager, football secretary.
- **Specialisations commonplace by mid-2020s**: set-piece coach,
  multiple analysts, integrated data analytics, mental-performance
  coach, nutrition + sleep/recovery, formalised player care.
- **Contract patterns:**
  - Length: inner-circle (assistants, set-piece, GK) often aligned with
    head coach term (2-3 years matching). Structural roles (sporting
    director, head of recruitment, academy director, head of
    performance, head of analysis) longer-term (3-5 years), designed to
    outlive individual coaches.
  - Termination: automatic termination + compensation if head coach is
    sacked is common; club options to retain; buy-out clauses lower than
    player transfers but exist.
  - Performance clauses: team-success bonuses (league position,
    promotion, cup, European qualification).
  - Release clauses: senior staff may have release clauses for
    higher-level clubs or if head coach leaves; non-compete /
    gardening-leave provisions to protect data + proprietary systems.
- **Academic finding**: head-coach turnover triggers cascade changes
  across backroom staff and player squad, impacting performance and
  stability (Sage journals study).

### Citations Perplexity returned

- [1] avecsport.com - complete guide to football club roles
- [3] journals.sagepub.com - coach turnover impact study
- [4] organimi.com - soccer organisational structure
- [6] inside.fifa.com - FIFA Diploma in Club Management

### Confidence

**High.** Cited FIFA Diploma in Club Management (authoritative),
Sage-published academic research, modern club role guides. The Sporting
Director pattern is well-documented and consistent across sources.

## Combined implications for FMX-26 recommendation

1. **DDD answer is decisive (Query 2 high confidence):** Staff has its
   own ubiquitous language, own lifecycle, own storage boundary,
   multiple consumers (Training, Transfer, Squad, Club Management) and
   cross-cutting role. Five of the six split criteria fire. Only the
   counterargument criterion (co-change with another context) does not
   apply - staff lifecycle is independent of, e.g., the weekly economy
   loop or the match simulation.

2. **Real-world structure (Query 3 high confidence) supports the same
   carve:** Sporting Director is a distinct organisational role from
   head coach, from finance director, from squad/transfer roles. Modern
   clubs explicitly **decouple infrastructure staff from coach tenure**
   - matches the DDD argument that staff operations need their own
   container so they survive coach changes.

3. **Genre precedent (Query 1 low confidence) is consistent but not
   load-bearing:** FM appears to treat staff as a separate operational
   layer, which is consistent with Option B (own context). The
   confidence is too low to lean on this independently, but it doesn't
   contradict.

4. **Ops → finance pattern (Query 2 high confidence) is textbook:**
   Domain events from Staff Operations → Customer-Supplier event
   contract → ACL in Club Management → ledger entries. Eventually
   consistent, no shared DB, no cross-context joins. Matches ADR-0050's
   "other contexts emit events, Club Management posts ledger" rule
   exactly.

5. **Salary regulation finding (Query 3) shapes future-scope but not
   ratification:** No major league regulates backroom staff wages
   separately from players. FMX's salary-cap GDDR work (post-MVP) can
   model this realistically: hard caps on player squad cost, soft
   budget for staff. **Not a FMX-26 blocker.**

The combined evidence reinforces **Option B (Staff Operations as own
bounded context, ADR-0053 proposed)** as the recommendation. No finding
contradicts; the strongest cite (DDD, Query 2) actively supports it.
