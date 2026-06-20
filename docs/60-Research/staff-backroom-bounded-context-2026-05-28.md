---
title: Staff & Backroom Bounded Context - Ownership Synthesis 2026-05-28
status: draft
tags: [research, staff, backroom, lifecycle, bounded-context, fmx-26]
context: staff-operations
created: 2026-05-28
updated: 2026-05-28
type: research
binding: false
linear: FMX-26
sourceType: external
related:
  - [[raw-perplexity/raw-staff-backroom-2026-05-28]]
  - [[eos-player-staff-skills-and-personas-2026-05-28]]
  - [[../50-Game-Design/squad-and-club-structure]]
  - [[../50-Game-Design/training-load-and-medicine]]
  - [[../50-Game-Design/scouting-and-recruitment]]
  - [[../50-Game-Design/GD-0005-training]]
  - [[../50-Game-Design/GD-0007-youth]]
  - [[../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
  - [[../10-Architecture/bounded-context-map]]
---

# Staff & Backroom Bounded Context - Ownership Synthesis 2026-05-28

## Question

Given that ADR-0052 People owns staff identity, persona and skill profiles
(draft) and ADR-0050 Club Economy owns the wage ledger (draft), **who owns
the staff operations** - hire/fire/contract lifecycle, role assignment,
pipeline-coverage tracking and wage-event emission?

Three options must be evaluated:

- A: Sub-aggregate inside Club Management.
- B: New "Staff Operations" bounded context (13th).
- C: Distributed across Training (coaches), Transfer (scouts), Squad
  (medical), Club Management (wages).

## Status

This is a sourced ownership dossier for FMX-26. It does not change the
bounded-context map. The recommendation feeds a new draft ADR-0053
(`status: proposed`, `binding: false`) that Nico ratifies separately.

`raw research -> this synthesis -> ADR-0053 §Options + §Recommendation -> Nico decision`

## Summary

**Recommendation: Option B (Staff Operations as own bounded context,
ADR-0053 proposed).** Five of six DDD split criteria fire; the
counterargument criterion (co-change with another context) does not
apply. Real-world clubs structure sporting operations as a distinct
organisational unit decoupled from coach tenure, mirroring the same
carve. Wage-event emission to Club Management's ledger follows the
canonical DDD ops → finance pattern (Customer-Supplier + ACL +
eventually consistent). ADR-0052 (People) supplies actor identity via
query; the new context owns operations.

## Findings

### Finding F1: ADR-0052 explicitly excludes staff operations

- **Source:**
  [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  §"does not own" list + §Public contract direction.
- **Confidence:** High (direct quotation).
- **Finding:** ADR-0052's non-responsibility list explicitly excludes
  "club finances, board decisions or fan segment facts". GD-0020 (its
  paired GDDR) adds: "Staff skills apply through the owning domain.
  People may own the staff persona and relationship profile, but
  Training, Squad, Transfer/Scouting and Medical rules apply their own
  gameplay effects."
- **Impact on FMX-26:** People owns staff *identity + persona + skill
  profile*. Hire/fire/contract, wage events, role assignment and
  pipeline-coverage are explicitly unmapped. The residual question is
  real, not redundant with ADR-0052.

### Finding F2: ADR-0050 wage-event pattern fits ops → finance integration

- **Source:**
  [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  + Perplexity Query 2 (DDD authority).
- **Confidence:** High.
- **Finding:** ADR-0050 requires "Other contexts never write finance
  tables directly. They emit or request domain facts through public
  commands/events." That defines the exact pattern: a Staff Operations
  context would emit `StaffWagePosted`, `StaffContractSigned`,
  `StaffTerminated` events; Club Management consumes them and posts
  ledger entries. Perplexity DDD authority (Vaughn Vernon, Eric Evans,
  Microsoft Learn, Context Mapper) names this Customer-Supplier +
  Anti-Corruption Layer + eventually consistent projections.
- **Impact on FMX-26:** Wage-boundary is solvable cleanly with an ACL in
  Club Management consuming Staff Operations events. No shared DB, no
  cross-context joins, no ADR-0050 amendments required. Direct precedent
  in the DDD literature.

### Finding F3: Game design treats staff as a core scarcity lever, not a finance line item

- **Source:** [[../50-Game-Design/squad-and-club-structure]] §1-2;
  [[../50-Game-Design/training-load-and-medicine]] §coach
  specialisations; [[../50-Game-Design/GD-0005-training]] (Trainer-Cap =
  5); [[../50-Game-Design/GD-0007-youth]] (Youth-Scouts as upgradable
  slot, wage→quality).
- **Confidence:** High (three independent binding-or-draft GDDRs).
- **Finding:** squad-and-club-structure §1 lists ten sporting roles
  (Manager, Sport Director, Chief Scout, Data Analyst, Head of Youth,
  U-team Coaches, Fitness Coach, Medical, Set-Piece Coach, GK Coach).
  §2 says: "Each role is part of a pipeline. Isolated buffs underdeliver
  - strong chief scout without analyst → many names, poor comparability;
  strong medical without fitness coach → shorter rehab, no peak-load
  prevention; strong head of youth without U-team coaches → great
  intake, poor progression. The game shows pipeline coverage explicitly
  so the player can see where they are bottlenecked." GD-0005 imposes
  Trainer-Cap = 5 as a scarcity lever. GD-0007 ties youth-scout quality
  to wage.
- **Impact on FMX-26:** Staff is a **first-class gameplay system** with
  its own quality model (pipeline coverage), scarcity (caps), and
  cross-cutting effects (a Set-Piece Coach affects Match; a Head of
  Youth affects Squad and Training). Folding staff into Club Management
  (Option A) would bury a gameplay pillar inside a finance container.
  Distributing across consumer contexts (Option C) leaves
  pipeline-coverage homeless.

### Finding F4: DDD canonical split criteria fire for Staff Operations

- **Source:** [[raw-perplexity/raw-staff-backroom-2026-05-28]] Query 2;
  Martin Fowler bounded-context page; Vaughn Vernon DDD literature;
  Microsoft Learn microservices domain analysis; Context Mapper
  SummerSoC 2020 paper.
- **Confidence:** High.
- **Finding:** Six canonical split criteria:
  1. **Own ubiquitous language** - "Coach", "Contract", "Role", "Slot",
     "Pipeline" mean specific things in staff ops that differ from
     finance, training or scouting terminology. ✓
  2. **Own lifecycle / state machine** - Hired → Offered → Active →
     Renewing → Terminated has its own FSM unrelated to weekly ledger
     ticks or match-day cycles. ✓
  3. **Own storage boundary** - Staff contracts, role assignments,
     wage schedules need independent schema evolution from finance
     ledger or squad records. ✓
  4. **Multiple consumers / cross-cutting role** - Training reads coach
     effects; Transfer reads chief-scout effects; Squad reads medical
     effects; Club Management consumes wage events; Match reads
     set-piece-coach effects. ✓
  5. **Distinct teams / cadence** - in larger orgs HR/staffing has its
     own owners; in FMX one team owns all, but the *architectural*
     coupling argument applies. ✓
  6. **Co-change counterargument** - does Staff lifecycle always change
     with another aggregate's transaction? No. Staff hire is independent
     of a transfer offer, a training plan, a match line-up. ✗ (split is
     justified)
- **Impact on FMX-26:** Five of six criteria fire affirmative; the
  one counterargument criterion does not apply. The DDD literature
  strongly supports a separate bounded context when this many criteria
  align.

### Finding F5: Real-world Sporting Director model decouples staff operations from coach tenure

- **Source:** [[raw-perplexity/raw-staff-backroom-2026-05-28]] Query 3;
  FIFA Diploma in Club Management; avecsport.com club roles guide;
  Sage-published academic study on coach turnover.
- **Confidence:** High.
- **Finding:** Default European top-league structure in 2024-2026:
  CEO/MD → Sporting Director (football ops) → Head Coach. Sporting
  Director owns:
  - Squad planning + transfer strategy + contract negotiation.
  - Staff hiring in the football department (with board sign-off on
    senior hires).
  - Approval/veto on first-team backroom additions proposed by coach.
  - Club-wide game model surviving individual coaches.
  - FFP/PSR compliance with CFO.
  Head Coach owns training, tactics, matchday and daily squad
  management.
  Clubs explicitly **decouple infrastructure staff (Sporting Director,
  Head of Recruitment, Head of Performance, Head of Analysis) from coach
  tenure** because coach changes cascade staff churn (Sage academic
  finding). Modern backroom: 25-40+ specialists per first-team setup.
- **Impact on FMX-26:** Real-world structure mirrors Option B exactly.
  A distinct Staff Operations container that survives manager / coach
  changes is the documented industry pattern. Option A (Club Management
  absorbs) and Option C (distributed by consumer) both fight this
  reality.

### Finding F6: Salary regulation is player-centric; staff stays as soft budget

- **Source:** [[raw-perplexity/raw-staff-backroom-2026-05-28]] Query 3
  (FFP/PSR/UEFA squad cost ratio findings).
- **Confidence:** High.
- **Finding:** No major league regulates backroom staff wages separately
  from player wages. Premier League PSR + 2025-26 UEFA-style squad cost
  ratio cap **player wages + transfers + agents**; backroom-staff wages
  are operating expenses but not separately capped. La Liga cost control
  focuses on registered players + technical staff vs revenue. MLS team
  salary budget explicitly excludes coaches/technical staff.
- **Impact on FMX-26:** Future-scope salary-cap GDDR work can model
  hard caps on player squad cost + soft budget for staff. Not a
  ratification blocker. Confirms that Staff Operations and Club
  Management interact via cost projection / budget envelope queries,
  not hard regulatory constraints inside the staff context itself.

## Inputs For Decisions

If Option B is accepted, the following items encode in ADR-0053:

- **Context owner:** Staff Operations as 13th bounded context (12 today
  after FMX-25/FMX-35 ratification of Manager & Legacy).
- **Owned aggregates:**
  - StaffContract (offered → signed → active → expiring → expired /
    terminated / renewed FSM).
  - StaffRoleAssignment (slot model: Sport Director, Chief Scout, Set-
    Piece Coach, etc.; free-role overflow for ad-hoc specialists).
  - PipelineCoverage read-model (six default pipelines: Recruitment,
    Development, Training, Medical, Tactics, Match-Day).
  - WageSchedule (weekly cost projection per active contract).
- **Public contract:**
  - Commands: `OfferStaffContract`, `SignStaffContract`,
    `TerminateStaffContract`, `RenewStaffContract`, `AssignStaffRole`,
    `ReassignStaffRole`, `UpdateStaffSpecialisation`.
  - Events: `StaffContractOffered`, `StaffContractSigned`,
    `StaffContractRenewed`, `StaffContractExpired`,
    `StaffContractTerminated`, `StaffRoleAssigned`,
    `StaffRoleReassigned`, `StaffWagePosted`,
    `PipelineCoverageRecalculated`.
  - Queries (read models): `StaffRoster`, `RoleAssignmentBoard`,
    `PipelineCoverageSnapshot`, `WageScheduleProjection`.
- **Consumed facts:**
  - `ActorRegistered`, `StaffSkillProfileSnapshot` from People (ADR-0052
    draft, identity + skill profile).
  - `EconomyWeekAdvanced` from Club Management (weekly tick for wage
    posting).
  - `RogueliteRunEnded` from League Orchestration (cross-run reset on
    new save creation per ADR-0051 determinism rule).
- **Storage scope:** per-save schema (`save_<uuidv7hex>`) per ADR-0027.
  No platform-scope cross-save state (staff are save-local).
- **Determinism:** staff state is per-save. New save creation may copy a
  legacy-configured staff seed if FMX-25 Manager & Legacy supplies one
  (post-MVP); no cross-save mutation during a run.
- **Map patch proposal:** insert "Staff Operations" as 13th row in §1
  table; add `Staff` node + edges in §2 Mermaid (consumes from People,
  League, Club Management; publishes to Training, Transfer, Squad,
  Match, Club Management); add `staff-operations/` folder in §4 source
  mapping.

## Future-scope notes (classified future-scope)

Not ratification blockers; resolve in follow-up GDDR/ADR work:

1. **Staff-Skill effect activation** - per GD-0020 explicitly post-MVP
   deferred. FMX-26 plans the structural ownership; activation of
   skill-based gameplay effects is a separate beat after FMX-23
   ratification.
2. **Salary-cap mathematics** - wage caps between players and staff;
   ADR-0050 ledger handles posting; cap allocation across player/staff
   pools is a future-scope GDDR.
3. **Sport-Director-approval workflow** - real-world dual-key pattern
   (coach proposes, director approves) is a potential sub-module.
   Default for MVP: direct hire by player. Post-MVP feature toggle.
4. **Contract-renewal negotiation** - parallel to player contract
   renewals; sub-module or separate beat. Default for MVP: deterministic
   accept/reject with simple wage demand.
5. **Pipeline-coverage read-model schema** - the six-pipeline default
   (Recruitment / Development / Training / Medical / Tactics / Match-Day)
   is a starting point; exact fields validated by playtest.
6. **Coach-turnover staff cascade** - real-world finding (Sage academic
   study) that head-coach changes trigger staff churn. Could be modelled
   as a per-coach attachment slot + auto-termination clause. Future-scope.

## Why not Option A (Club Management absorbs)?

Option A keeps staff lifecycle as a `StaffOperations` sub-aggregate inside
Club Management. Argument for: wage-posting stays local.

Arguments against (load-bearing):

- Club Management is already large: finance ledger, accounting
  projections, budgets, infrastructure, sponsors, board, fans,
  insolvency. Adding staff Hire/Fire + role assignment + pipeline
  coverage adds a sixth or seventh sub-aggregate cluster.
- Ubiquitous language conflict (Finding F4 criterion 1): finance speaks
  ledger, budget, cost-centre, revenue, insolvency; staff ops speaks
  contract, role, slot, specialisation, pipeline. Both inside one
  context creates the exact meaning-drift problem Evans warns about.
- Real-world structure (Finding F5) explicitly **separates Sporting
  Director from CFO** for organisational reasons that translate to the
  architecture: different decision authority, different time horizons,
  different change cadence.
- GD-0020 (FMX-23) explicitly puts staff skills "through the owning
  domain" - implying multiple downstream consumers each translate
  staff facts in their own language. Club Management is *one* such
  consumer (wages), not the canonical owner.

## Why not Option C (distributed across consumers)?

Option C lets each gameplay context own its staff slot: Training owns
coaches, Transfer owns scouts, Squad owns medical, Club Management owns
wages. Argument for: locality - the same context owns both the effect
(coach training boost) and the resource (coach hire).

Arguments against:

- **Cross-cutting roles have no home.** Sport Director is squad-wide
  strategic (transfer policy + contract policy + staff hiring); Data
  Analyst affects Match + Tactics + Scouting; Head of Youth affects
  Squad + Training + Transfer. Distributing leaves these with no
  obvious owner.
- **Wage-event coordination explodes.** Four+ contexts each emit
  `StaffWagePosted`; Club Management subscribes to all four. The DDD
  argument for a single upstream ops context (Finding F4 + F2) is
  stronger than the locality argument.
- **Pipeline-coverage read-model is homeless.** Pipeline-coverage spans
  all role pipelines simultaneously (Recruitment, Development,
  Training, Medical, Tactics, Match-Day). Distributing means each
  context owns one pipeline slice; no single context owns the
  cross-pipeline coverage view that the GDDR (squad-and-club-structure
  §2) explicitly requires.
- **Staff persona / identity coupling.** ADR-0052 (People) owns staff
  identity. Each distributed gameplay context would have to consume
  the same People queries separately, duplicating coupling.

## What the ratification PR includes

Per the FMX-26 plan and
[[../30-Implementation/domain-research-workflow]] Phase 5:

- This synthesis note.
- The raw research at
  [[raw-perplexity/raw-staff-backroom-2026-05-28]].
- A new draft ADR-0053 with three options, §Recommendation = Option B,
  Public-contract sketch, determinism + storage rules, §Map patch
  proposal as fenced diff.
- Decision-Log row for ADR-0053 (`proposed`).
- Current-State FMX-26 anchor block.
- Session handoff naming the ratify-ask: *"Accept Option B (recommended),
  choose A / C, or Defer?"*

The bounded-context map is **not** modified by this PR. The §Map patch
applies only on Nico's acceptance.

## Related vault

- [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - upstream identity owner.
- [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - downstream wage consumer.
- [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]] -
  modular-monolith ground rules.
- [[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]] -
  per-save schema convention.
- [[../50-Game-Design/squad-and-club-structure]] §1-2 - 10 sporting
  roles + pipeline coverage GDDR.
- [[../50-Game-Design/training-load-and-medicine]] - coach
  specialisations + medical effects.
- [[../50-Game-Design/scouting-and-recruitment]] - Chief Scout role.
- [[../50-Game-Design/GD-0005-training]] - Trainer-Cap scarcity.
- [[../50-Game-Design/GD-0007-youth]] - Head-of-Youth + scout wage→
  quality coupling.
- [[../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]] -
  Staff target model and post-MVP deferral.
- [[../30-Implementation/domain-research-workflow]] - the workflow this
  dossier follows.
