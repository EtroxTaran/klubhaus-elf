---
title: ADR-0053 Staff Operations Context
status: accepted
tags: [adr, architecture, ddd, staff, backroom, lifecycle, fmx-26, fmx-36, accepted]
created: 2026-05-28
updated: 2026-06-12
type: adr
binding: true
supersedes:
superseded_by:
related:
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0050-club-economy-accounting-ledger]]
  - [[ADR-0051-manager-and-legacy-context]]
  - [[ADR-0052-people-persona-and-skills-context]]
  - [[../../50-Game-Design/squad-and-club-structure]]
  - [[../../50-Game-Design/training-load-and-medicine]]
  - [[../../50-Game-Design/scouting-and-recruitment]]
  - [[../../50-Game-Design/GD-0005-training]]
  - [[../../50-Game-Design/GD-0007-youth]]
  - [[../../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]]
  - [[../../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]]
  - [[../../60-Research/player-staff-development-decision-model-2026-05-28]]
  - [[../../60-Research/staff-backroom-bounded-context-2026-05-28]]
  - [[../../60-Research/raw-perplexity/raw-staff-backroom-2026-05-28]]
---

# ADR-0053: Staff Operations Context

## Status

accepted

## Date

2026-05-28 (proposed) · 2026-05-28 (FMX-36 accepted by Nico, Option B)

## Ratification

Nico accepted Option B on 2026-05-28 after reviewing the FMX-26 dossier
(PR [#87](https://github.com/EtroxTaran/football-manager-x/pull/87)).
The §Recommendation below names Option B; the synthesis at
[[../../60-Research/staff-backroom-bounded-context-2026-05-28]] documents
the three converging arguments (DDD canonical split criteria, real-world
Sporting Director precedent, ops → ledger pattern textbook).

Application:

- Status flipped `proposed` → `accepted`; `binding: false` → `true`.
- The §Map patch proposal that lived in this ADR was applied to
  [[../bounded-context-map]] in the same PR (FMX-36). Staff Operations
  is now the **thirteenth bounded context** in the live map.
- The §Map patch proposal section is removed from this ADR as a result -
  its content lives in the map. Future amendments to the map go through
  normal ADR supersession ([[../../90-Meta/vault-governance]]).

## Context

FMX-26 closes the staff-ownership gap left by ADR-0052 People, Persona
and Skills (draft). ADR-0052 owns staff identity, persona substrate and
skill/perk target profile - but explicitly excludes the operational
layer:

- Staff hire/fire/contract lifecycle.
- Wage events emitted into the Club Management ledger (ADR-0050).
- Role assignment (Sport Director, Chief Scout, Set-Piece Coach, etc.).
- Pipeline-coverage as quality-multiplier domain
  ([[../../50-Game-Design/squad-and-club-structure]] §2: "the game shows
  pipeline coverage explicitly so the player can see where they are
  bottlenecked").
- Specialisations as effect modifiers (coach Attacking vs Defensive on
  Training; medical/fitness on injury rates).

After ADR-0051 ratification on 2026-05-28 (FMX-25 + FMX-35), the
bounded-context map has twelve contexts. None of them owns staff
operations. Club Management's listed scope is "Finance ledger,
accounting projections, budgets, infrastructure, sponsors, board, fans,
insolvency state" - staff are not in that list.

The
[[../../60-Research/staff-backroom-bounded-context-2026-05-28]]
synthesis evaluates three options for the ownership question.

## Options considered

### Option A - Sub-aggregate inside Club Management

Add `StaffOperations` as a sub-aggregate inside Club Management. Hire,
contract, wage and role assignment live alongside finance ledger,
accounting projections, sponsors, board, fans, insolvency state and
infrastructure.

- **Coupling:** wage-posting stays local (no cross-context event
  required for wage entries).
- **Test isolation:** weak - the same context owns finance FSM and
  staff FSM, which complicates tests for either.
- **Service extractability:** weak - extraction would require carving
  the sub-aggregate out later (which is the proposal of Option B but
  done after the fact).
- **Data sovereignty:** weak - mixed ubiquitous language (finance:
  ledger, budget, cost-centre; staff: contract, role, slot, pipeline)
  inside one schema invites meaning drift.
- **Trade-off:** the alternative options either require cross-context
  wage events (Option B, cheap via ADR-0050's pattern) or distribute the
  staff model across consumers without a home for cross-cutting roles
  (Option C, expensive).

### Option B - New "Staff Operations" bounded context (13th)

Carve a dedicated context owning hire/fire/contract lifecycle, role
assignment, pipeline coverage and wage-event emission. Consumes
ADR-0052 People queries for actor identity; emits domain events
consumed by Training (coach effects), Transfer (chief-scout / data-
analyst effects), Squad & Player (medical effects), Match (set-piece
coach), Club Management (wage ledger entries) and Notification
(staff-related inbox events).

- **Coupling:** clean. People publishes identity facts; Staff
  Operations hangs operations on top; downstream contexts consume via
  published events.
- **Test isolation:** strong. Staff Operations owns its own storage
  (per-save schema per ADR-0027); deterministic event fixtures drive
  tests.
- **Service extractability:** matches ADR-0019 §5 - extraction is a
  deployment change because all contracts are JSON-serialisable.
- **Data sovereignty:** explicit. `save_<uuidv7hex>` schema for staff
  contracts and role assignments; no platform-scope cross-save state
  (staff is save-local; cross-save legacy seeds flow through ADR-0051
  Manager & Legacy on save creation only).
- **Trade-off:** adds one bounded context to the map (13th). The
  marginal cost is justified by the five-of-six DDD split criteria
  firing (synthesis F4) and by the real-world structural precedent
  (synthesis F5).

### Option C - Distributed across consumers

Training owns coaches (hire, contract, assignment). Transfer owns
scouts. Squad & Player owns medical. Club Management owns wages. Each
consumer context manages its own staff slot.

- **Coupling:** locality is good (Training owns coach effect AND coach
  hire) but cross-cutting roles have no home: Sport Director is squad-
  wide strategic; Data Analyst affects Match + Tactics + Scouting; Head
  of Youth affects Squad + Training + Transfer.
- **Test isolation:** OK per context, but pipeline-coverage spans
  multiple contexts - no single home.
- **Wage-event coordination:** four+ contexts each emit
  `StaffWagePosted` events; Club Management subscribes to all four.
  More moving parts than Option B.
- **Trade-off:** locality argument is real but does not address the
  cross-cutting roles or the pipeline-coverage read model.

## Recommendation

**Option B (Staff Operations as own bounded context).** Three converging
arguments:

1. **DDD canonical criteria fire (synthesis F4).** Five of six split
   criteria (own ubiquitous language, own lifecycle/state machine, own
   storage boundary, multiple consumers, cross-cutting role) fire
   affirmative; the counterargument criterion (co-change with another
   aggregate) does not apply. Multiple authorities (Fowler/Evans canonical
   page, Vaughn Vernon, MS Learn, Context Mapper SummerSoC paper)
   converge on this pattern when this many criteria align.

2. **Real-world structural precedent (synthesis F5).** Default European
   top-league structure 2024-2026: CEO/MD → Sporting Director (football
   ops) → Head Coach. Sporting Director owns staff hiring (with board
   sign-off on seniors), squad planning, contract policy, club-wide
   game-model that survives individual coaches. The Sage academic study
   on coach turnover explicitly notes clubs decouple infrastructure
   staff from coach tenure to avoid cascade churn. Option B mirrors
   this; Options A and C fight it.

3. **Ops → ledger pattern is textbook (synthesis F2).** ADR-0050
   already requires "Other contexts never write finance tables directly.
   They emit or request domain facts through public commands/events."
   Staff Operations emitting `StaffWagePosted` to Club Management is the
   canonical Customer-Supplier + Anti-Corruption Layer + eventually
   consistent pattern (Perplexity DDD authority). No ADR-0050 amendment
   required.

### Named risks

- **Map growth.** Adds the 13th context. ADR-0052 (People, draft) would
  bring a 14th if ratified. The map grows; modular-monolith stays one
  process. Mitigation: ADR-0019 §5 keeps extraction a deployment
  change, not a refactor.
- **Coordination with ADR-0052.** People supplies actor identity via
  query; Staff Operations references staff by `ActorId`. Discipline
  required to not duplicate persona/skill data. Mitigation: explicit
  query boundary - Staff Operations never stores persona traits.
- **GD-0020 staff-skill activation post-MVP.** Staff skills as gameplay
  effects are explicitly deferred by FMX-23. This ADR plans the
  structural ownership; effect activation comes in a later beat. Not
  blocking.

Status stays `proposed` / `binding: false` until Nico ratifies.

## Decision

Propose a dedicated **Staff Operations** bounded context.

If ratified, Staff Operations owns:

- Staff contract lifecycle: `StaffContract` aggregate with FSM
  (Offered → Signed → Active → Expiring → Expired / Terminated /
  Renewed).
- Role assignment: `StaffRoleAssignment` aggregate (slot model: Sport
  Director, Chief Scout, Set-Piece Coach, Head of Youth, etc.; free-
  role overflow for ad-hoc specialists).
- Pipeline-coverage read model spanning the six default pipelines
  (Recruitment, Development, Training, Medical, Tactics, Match-Day),
  per
  [[../../50-Game-Design/squad-and-club-structure]] §2.
- Wage schedule: weekly cost projection per active contract; wage
  events emitted to Club Management's ledger (ADR-0050).
- Staff specialisation as effect modifier metadata (coach Attacking vs
  Defensive; medical / fitness specialisations); concrete gameplay
  effects remain in the consuming contexts (Training, Squad, Transfer,
  Match).

Staff Operations does **not** own:

- Staff identity, persona substrate or OCEAN labels (owned by ADR-0052
  People).
- Staff skill/perk profile or `PersonaContextCard` (owned by ADR-0052
  People).
- Player contracts, wages or transfers (owned by Squad & Player and
  Transfer respectively).
- Wage ledger entries themselves (owned by Club Management per
  ADR-0050; Staff Operations emits the events, Club Management posts
  the ledger).
- Cross-save manager identity, legacy or prestige (owned by ADR-0051
  Manager & Legacy).
- AI manager behaviour for the simulation's bot clubs (owned by
  League / Club / Transfer per bounded-context-map §7).

## Public contract direction

Draft commands:

- `OfferStaffContract`
- `SignStaffContract`
- `RenewStaffContract`
- `TerminateStaffContract`
- `AssignStaffRole`
- `ReassignStaffRole`
- `UpdateStaffSpecialisation`

Draft events:

- `StaffContractOffered`
- `StaffContractSigned`
- `StaffContractRenewed`
- `StaffContractExpiring`
- `StaffContractExpired`
- `StaffContractTerminated`
- `StaffRoleAssigned`
- `StaffRoleReassigned`
- `StaffWagePosted` (consumed by Club Management ledger; posted weekly as the
  aggregated `StaffWageBlockPosted` counterpart event per
  [[ADR-0105-wage-and-transfer-fee-posting-contracts]], FMX-144)
- `PipelineCoverageRecalculated`
- `StaffSpecialisationUpdated`

Draft read models:

- `StaffRoster` - active contracts plus role assignments per club.
- `RoleAssignmentBoard` - all configured slots with assigned actors and
  free slots.
- `PipelineCoverageSnapshot` - six-pipeline coverage view plus quality
  multipliers for the UI bottleneck visualiser.
- `WageScheduleProjection` - weekly + monthly + annual projected wage
  cost per club, broken down by role.

Draft consumed facts:

- `ActorRegistered`, `StaffSkillProfileSnapshot` from People (ADR-0052
  draft).
- `EconomyWeekAdvanced` from Club Management (weekly tick).
- `RogueliteRunEnded` from League Orchestration (run end - hooks for
  Manager & Legacy cross-run reset on new save creation per ADR-0051).
- `TrainingPlanSubmitted`, `MatchKickedOff` (read-only signals for
  pipeline-coverage recalculation triggers; no state mutation).

## Determinism and storage rules

- Staff Operations owns per-save tables only (`save_<uuidv7hex>` schema
  per ADR-0027). No platform-scope cross-save state.
- New save creation may receive a legacy-configured staff seed as an
  explicit generation parameter when ADR-0051 Manager & Legacy supplies
  one (post-MVP); the seed is copied into the save snapshot at
  creation and never re-read during a running save.
- Cross-context inputs arrive through public events / queries only.
  Staff Operations does not join across context tables.
- Wage facts are emitted as `StaffWagePosted` domain events through
  ADR-0028 transactional outbox; Club Management consumes via ACL and
  posts to its ledger. No shared transactions.
- Pipeline-coverage read model is denormalised inside Staff Operations
  using only its own storage plus published events from People
  (skill-profile snapshots) and the consuming contexts' published
  effect-readiness signals (read-only).

## Rationale

Staff are a first-class gameplay system (synthesis F3): ten sporting
roles, pipeline coverage as scarcity lever, Trainer-Cap = 5, youth-
scout wage→quality coupling. Hiding them inside Club Management's
finance container (Option A) buries a pillar inside an accounting box.
Distributing them across Training, Transfer, Squad and Club Management
(Option C) leaves cross-cutting roles (Sport Director, Data Analyst,
Head of Youth) homeless and breaks the cross-pipeline coverage view.

DDD authorities and the real-world Sporting Director precedent
converge: when an operational concern has its own ubiquitous language,
lifecycle, storage, multiple consumers and cross-cutting role, it
deserves its own bounded context. The marginal cost (one extra context
in the modular monolith, with extraction as a deployment change) is
small compared with the coupling debt the alternatives accumulate.

## Consequences

Positive:

- Clear owner for staff hire/fire/contract/wages/role/pipeline-coverage
  without polluting Club Management or distributing across consumers.
- Contracts-first path: commands, events, read models, consumed facts
  all named at draft precision.
- Wage-event pattern follows ADR-0050's rule unchanged.
- Mirrors real-world Sporting Director structure - playtesters
  recognise the model.
- Pipeline-coverage UI requirement (squad-and-club-structure §2) has a
  named owner.

Negative:

- Adds one bounded context to the map (13th, post-Manager & Legacy
  ratification).
- Requires event consumption across Training, Transfer, Squad & Player,
  Match, Club Management and Notification. Coordination grows.
- Staff-skill effect activation (GD-0020 post-MVP) needs follow-up
  ADRs / GDDRs naming which consuming contexts apply which effects. FMX-38 now
  tracks the MVP option gate in
  [[../../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]]:
  target-only, narrow pipeline modifiers or full staff skill-card gameplay.
- Pipeline-coverage read-model schema is provisional until playtest.

## Supersedes

None

## Related Docs

- [[../../60-Research/staff-backroom-bounded-context-2026-05-28]] -
  FMX-26 ratification synthesis (this ADR's decision basis).
- [[../../60-Research/raw-perplexity/raw-staff-backroom-2026-05-28]] -
  FMX-26 raw research (genre, DDD, real-world surveys).
- [[../../50-Game-Design/squad-and-club-structure]] - 10 sporting roles
  + pipeline-coverage GDDR (binding source for the gameplay layer).
- [[../../50-Game-Design/training-load-and-medicine]] - coach
  specialisation + medical effects.
- [[../../50-Game-Design/scouting-and-recruitment]] - Chief Scout role.
- [[../../50-Game-Design/GD-0005-training]] - Trainer-Cap = 5 scarcity
  lever.
- [[../../50-Game-Design/GD-0007-youth]] - Head-of-Youth + youth-scout
  wage→quality coupling.
- [[../../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]]
  - Staff target model; staff-skill effect activation post-MVP.
- [[../../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]]
  - Factor matrices and staff-skill MVP option gate.
- [[../../60-Research/player-staff-development-decision-model-2026-05-28]]
  - FMX-38 research synthesis for player/staff decision influence.
- [[ADR-0019-modular-monolith-ddd]] - modular monolith ground rules.
- [[ADR-0027-postgres-data-model]] - per-save schema convention.
- [[ADR-0028-postgres-transactional-outbox]] - event delivery
  mechanism.
- [[ADR-0050-club-economy-accounting-ledger]] - wage-ledger boundary
  Staff Operations emits into.
- [[ADR-0051-manager-and-legacy-context]] - cross-save legacy
  configuration may supply staff seed on new save creation (post-MVP).
- [[ADR-0052-people-persona-and-skills-context]] - actor identity +
  persona + skill profile (upstream).
