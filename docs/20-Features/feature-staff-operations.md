---
title: Feature - Staff Operations
status: draft
tags: [feature, staff-operations, staff, backroom]
context: staff-operations
created: 2026-06-20
updated: 2026-06-20
type: feature
binding: false
related: [[README]], [[../00-Index/MVP-Scope]], [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]], [[../10-Architecture/state-machines/staff-operations]], [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]], [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]], [[../10-Architecture/09-Decisions/ADR-0105-wage-and-transfer-fee-posting-contracts]], [[feature-training-medicine]], [[feature-club-economy-mvp-pillar]], [[feature-eos-player-skills-and-people-context]], [[../50-Game-Design/squad-and-club-structure]], [[../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]]
---

# Feature - Staff Operations

## Goal

Give the managing player a clear surface to **build and run their backroom**:
offer and sign staff, assign them to sporting-role slots, see where their
pipeline coverage is thin, and watch staff wages flow into the club ledger -
all on top of the [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]]
bounded context and the [[../10-Architecture/state-machines/staff-operations]]
`StaffContract` / `StaffRoleAssignment` lifecycle.

This spec is the **player-facing flow slice**. It does not own staff identity,
persona or skill profiles (that is [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]),
the ledger itself ([[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]),
or the concrete consumer effect formulas (Training, Squad & Player, Transfer,
Match). Effect magnitudes are deferred; acceptance below is **behavioural**, not
numeric.

## User stories

- As a manager I can **offer a contract** to an available staff actor and see
  the proposed terms before I commit.
- As a manager I can **sign** an offered staff member, and once their term
  starts they appear on my active staff roster.
- As a manager I can **renew** a staff member whose contract is approaching its
  end, or let it expire.
- As a manager I can **terminate** a staff contract early.
- As a manager I can **assign a staff member to a sporting-role slot** (Sport
  Director, Chief Scout, Set-Piece Coach, Head of Youth, etc.) and **reassign**
  the slot to a different actor later.
- As a manager I can **view my pipeline coverage** across the six default
  pipelines (Recruitment, Development, Training, Medical, Tactics, Match-Day) and
  see, in plain language, where I am bottlenecked.
- As a manager I can **set / update a staff member's specialisation** (e.g. an
  attacking vs defensive coaching emphasis, a medical / fitness emphasis) and
  understand which area of play it is meant to influence.
- As a manager I can **see my weekly staff wage bill** and confirm that signing,
  renewing or terminating staff changes what is posted to the club ledger.
- As a manager I receive **inbox notifications** for staff events (a contract is
  expiring, a contract has expired, a renewal is agreed).

## Post-MVP scope

Staff-skill gameplay depth and the cross-save legacy staff seed are post-MVP per
[[../00-Index/MVP-Scope]] and ADR-0053.

- Full staff **skill-card gameplay** (ADR-0053 §Named risks): MVP activates
  staff skills only as the narrow pipeline modifiers accepted in
  [[../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]];
  the full card surface is later.
- **Legacy-configured staff seed** on new-save creation (ADR-0053 §Determinism
  and storage rules / [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]),
  copied into the save at creation only.
- Concrete consumer **effect magnitudes / modifier bands** for each
  specialisation and role (owned by Training, Squad & Player, Transfer, Match).

## Out of release

- Staff **identity, persona substrate, OCEAN labels and skill/perk profiles**
  (owned by [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]];
  Staff Operations references actors by `ActorId` only).
- The **wage ledger entries themselves** (owned by Club Management per
  [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]];
  Staff Operations emits the wage events, Club Management posts the ledger).
- **Player** contracts, wages and transfers (Squad & Player / Transfer).
- **AI-club** backroom decision-making (League / Club / Transfer per the
  bounded-context map).

## Acceptance

Behavioural Given/When/Then criteria. Lifecycle states and event names are taken
from [[../10-Architecture/state-machines/staff-operations]] and ADR-0053
§Public contract direction; thresholds the ADR does not pin are surfaced under
[[#Open decisions]] and are deliberately **not** asserted here.

1. **Offer a contract.** Given an available staff actor and a manager with the
   authority to offer, When the manager submits `OfferStaffContract` with valid
   terms, Then a `StaffContract` enters `offered`, a `StaffContractOffered` event
   is emitted, and the proposed terms are visible to the manager.

2. **Sign an offer.** Given a `StaffContract` in `offered`, When the manager
   submits `SignStaffContract`, Then the contract enters `signed` and a
   `StaffContractSigned` event is emitted.

3. **Contract becomes active.** Given a `StaffContract` in `signed` whose start
   condition is met on a weekly world tick (`EconomyWeekAdvanced`), When the tick
   is processed, Then the contract enters `active` and the staff member appears
   on the manager's active `StaffRoster`.

4. **Active wage posting.** Given a `StaffContract` in `active`, When a weekly
   tick is processed, Then a staff wage fact is emitted toward the Club
   Management ledger (`StaffWagePosted`, delivered weekly via the aggregated
   `StaffWageBlockPosted` per
   [[../10-Architecture/09-Decisions/ADR-0105-wage-and-transfer-fee-posting-contracts]]),
   and the manager's wage-schedule view reflects this contract's weekly cost.

5. **Wage bill reflects roster changes.** Given a manager viewing their weekly
   staff wage bill, When a contract moves into or out of `active` (sign that
   starts, terminate, or expire), Then the projected weekly staff wage total
   changes accordingly on the next recalculation.

6. **Renew an expiring contract.** Given a `StaffContract` in `expiring`, When
   the manager submits `RenewStaffContract`, Then the contract enters `renewed`,
   a `StaffContractRenewed` event is emitted, and the contract returns to
   `active` when its new term begins.

7. **Let a contract expire.** Given a `StaffContract` in `expiring` that is not
   renewed before term end, When term end is reached, Then the contract enters
   the terminal `expired` state and a `StaffContractExpired` event is emitted.

8. **Terminate early.** Given a `StaffContract` in `active`, When the manager
   submits `TerminateStaffContract`, Then the contract enters the terminal
   `terminated` state and a `StaffContractTerminated` event is emitted.

9. **Assign a role slot.** Given a configured sporting-role slot in `vacant` and
   a staff member on an `active` contract, When the manager submits
   `AssignStaffRole`, Then the slot becomes `filled`, a `StaffRoleAssigned`
   event is emitted, and the assignment shows on the role-assignment board.

10. **Reassign a role slot.** Given a `filled` role slot, When the manager
    submits `ReassignStaffRole` with a different eligible actor, Then the slot's
    occupant changes and a `StaffRoleReassigned` event is emitted.

11. **Pipeline coverage is visible.** Given a manager with staff assigned, When
    they open the pipeline-coverage view, Then they see coverage across the six
    default pipelines (Recruitment, Development, Training, Medical, Tactics,
    Match-Day) with a plain-language indication of where they are bottlenecked,
    sourced from the `PipelineCoverageSnapshot` read model.

12. **Coverage recalculates on staffing change.** Given a current
    pipeline-coverage view, When a role assignment changes or a relevant contract
    starts or ends, Then a `PipelineCoverageRecalculated` event is emitted and
    the coverage view updates.

13. **Update specialisation.** Given a staff member on an `active` contract, When
    the manager submits `UpdateStaffSpecialisation`, Then a
    `StaffSpecialisationUpdated` event is emitted and the UI shows which area of
    play (e.g. attacking vs defensive coaching, medical / fitness) the
    specialisation is meant to influence. (Concrete effect magnitude is deferred
    to the consuming context - see [[#Open decisions]].)

14. **Staff inbox notifications.** Given a manager, When a `StaffContractExpiring`,
    `StaffContractExpired` or `StaffContractRenewed` event occurs for one of their
    staff, Then a corresponding staff inbox notification is raised.

15. **Save-local isolation.** Given two distinct saves, When staff are signed and
    assigned in one save, Then no staff contract, role assignment or wage fact
    from that save is observable in the other (per-save `save_<uuidv7hex>` schema,
    ADR-0053 §Determinism and storage rules).

## Open decisions

These are named-but-not-quantified by ADR-0053 / the state machine. They are
**not** asserted in Acceptance and must be decided before the corresponding flow
is finalised. Items 1-9 mirror the
[[../10-Architecture/state-machines/staff-operations]] §Open decisions; items
10-13 are player-facing surface questions this spec raises.

1. **`active → expiring` window** - how far before term end the `expiring`
   transition fires is undefined.
2. **`expiring → expired` vs `expiring → renewed` branch guard** - the
   deadline / negotiation-window rule selecting the path is undefined.
3. **`renewed` re-entry semantics** - whether `renewed` continues or starts a
   fresh `active` term is not pinned.
4. **`TerminateStaffContract` source-state guard** - which states termination is
   legal from (e.g. from `signed` or `expiring`) is undefined; only the
   `active → terminated` edge is asserted in Acceptance.
5. **Negative offer path** - no reject / offer-expiry event is defined, so an
   unsuccessful `offered` contract has no terminal; the offer-decline flow is
   undecided.
6. **Role-assignment FSM granularity** - exact slot states, guards and the
   slot-release (`filled → vacant`) rule on contract end are inferred, not pinned.
7. **Trainer-Cap = 5 and six-pipeline eligibility guards** - whether
   `AssignStaffRole` enforces the trainer cap or per-slot eligibility is
   undefined (referenced as scarcity levers in ADR-0053 §Rationale and
   [[../50-Game-Design/squad-and-club-structure]]).
8. **Wage-schedule sub-FSM** - whether weekly wage posting needs its own machine
   or stays a side-effect of `active` is open.
9. **Seeded `*Rng` stream** - no Staff Operations RNG stream is declared; any
   bounded seeded variance in a staff outcome needs its own decision packet.
10. **Specialisation effect magnitudes / modifier bands** - the concrete numeric
    effect of each specialisation and role is owned by the consuming contexts
    (Training, Squad & Player, Transfer, Match) and is deferred.
11. **Pipeline-coverage bands / multiplier values** - the exact coverage tiers,
    bottleneck thresholds and quality-multiplier numbers behind the read model
    are provisional until playtest (ADR-0053 §Consequences).
12. **Offer-terms surface** - which contract terms (wage, length, role intent,
    bonuses) the offer UI exposes, and which are negotiable, is not specified.
13. **Authority / board sign-off on senior hires** - ADR-0053 cites the
    real-world Sporting-Director precedent where senior hires need board
    sign-off; whether the MVP flow gates any hire on board approval is undecided.

## Dependencies

- [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]] - the
  accepted bounded context this slice surfaces.
- [[../10-Architecture/state-machines/staff-operations]] - the contract /
  role-assignment lifecycle the flows drive.
- [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]] -
  the ledger boundary staff wages are posted into.
- [[../10-Architecture/09-Decisions/ADR-0105-wage-and-transfer-fee-posting-contracts]] -
  the weekly aggregated wage-block posting contract.
- [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]] -
  upstream actor identity / skill profile referenced by `ActorId`.
- [[../50-Game-Design/squad-and-club-structure]] - sporting roles, pipeline
  coverage and Trainer-Cap source.
- [[../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]] -
  accepted narrow staff-skill pipeline-modifier activation.
- [[feature-training-medicine]], [[feature-club-economy-mvp-pillar]],
  [[feature-eos-player-skills-and-people-context]] - sibling feature slices that
  consume or border this surface.
