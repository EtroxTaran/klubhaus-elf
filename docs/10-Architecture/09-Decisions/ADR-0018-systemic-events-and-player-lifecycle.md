---
title: ADR-0018 Systemic Events and Player Lifecycle Architecture
status: accepted
tags: [adr, architecture, events, player-development, injuries, narrative, venue]
context: [squad-player, match]
created: 2026-05-17
updated: 2026-06-14
accepted_at: 2026-05-17
type: adr
binding: true
related: [[../../60-Research/systemic-events-player-development-venue-ops]], [[ADR-0019-modular-monolith-ddd]], [[ADR-0028-postgres-transactional-outbox]], [[ADR-0077-environment-and-climate-context-weather-and-pitch]], [[../../60-Research/determinism-and-replay]], [[../../60-Research/narrative-content-pipeline]], [[../bounded-context-map]]
---

# ADR-0018: Systemic Events and Player Lifecycle Architecture

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read "Accepted
> (2026-05-17, systemic events / player lifecycle documentation pass).". Body status reconciled to
> the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

## Context

The game needs long-running systems that are related but not identical:

- player development and potential progression;
- mentoring, personality influence and squad social dynamics;
- training load, fatigue, readiness and injury risk;
- match injuries and availability changes;
- non-matchday world events, club operations and venue bookings;
- narrative rendering for inbox, newspaper, press and flavour text.

The rejected shape is "one random event system" that owns all of this. That
would bypass DDD boundaries, hide causality, make tuning hard and conflict
with deterministic replay. The accepted architecture already has its bounded
contexts (canonical catalog in [[../bounded-context-map]]), domain events
through the transactional outbox and deterministic RNG streams.

## Decision

Adopt **domain-owned systemic policies coordinated by deterministic event
orchestration**.

`WorldEventDirector` is an orchestration policy, not a new bounded context
and not a second simulation source of truth. It decides which domain event
families should be evaluated at a league/week/day/match boundary, then
delegates the actual rule evaluation to the owning context.

## 1. Context ownership

| Concern | Owner | Contract |
|---|---|---|
| Weekly development progression | Training computes development signals; Squad & Player persists player state | `TrainingWeekProcessed`, `PlayerDevelopmentDeltaApplied` |
| Mentoring | Squad & Player owns groups and social state; Training contributes attendance/context | `MentoringGroupAssigned`, `MentoringInfluenceApplied`, `MentoringConflictRaised` |
| Long-term injury risk | Training computes load/readiness; Squad & Player owns injury profile and persisted injury records | `InjuryRiskUpdated`, `TrainingInjuryOccurred`, `PlayerReturnedFromInjury` |
| Match injuries | Match emits match injury facts using match RNG; Squad & Player persists availability impact | `MatchInjuryOccurred`, `PlayerAvailabilityChanged` |
| Match-day operational events | Stadium Operations owns venue/stadium event timeline and facility-side incidents; Match and League provide fixture context; Audience & Atmosphere and CommercialPortfolio own fan/commercial inputs | `MatchdayEventTriggered`, `SanctionRiskRaised`, `FanIncidentLogged`, `MatchdayCommercialSettlementPosted` |
| Venue operations | Stadium Operations owns venue calendar, infrastructure, facility condition and pitch-condition state; Environment & Climate supplies weather facts and pitch-weather derivation rules | `VenueEventBooked`, `VenueEventCompleted`, `PitchConditionChanged`, `MatchWeatherResolved` |
| Narrative rendering | Notification/read projection layer consumes structured events and compiled catalogues | `NarrativeEventQueued`, message projection IDs |

No context may read another context's internal tables to compute these
decisions. Cross-context facts travel through commands, queries and domain
events as required by ADR-0019.

## 2. World Event Director

The director runs only at explicit simulation boundaries:

- save/world creation for initial seeded facts;
- day tick for active-club operational checks;
- week tick for training, development, injuries, mentoring and venue ops;
- match pre/live/post phases for match-day events;
- season rollover for structural and late-game events.

The director may:

- ask contexts for public read models;
- enqueue commands to owning contexts;
- apply priority/frequency/cooldown caps;
- emit orchestration/audit events.

The director must not:

- mutate another context's state directly;
- own player, venue, injury or narrative persistence;
- draw from the wrong RNG stream;
- generate narrative text;
- depend on runtime network calls.

## 3. Determinism and RNG

Systemic events follow [[../../60-Research/determinism-and-replay]]:

| Randomness source | Stream |
|---|---|
| Long-term injury risk, recurrence, illness | `InjuryRng` |
| Match physical injury events | `MatchCoreRng(matchId)` |
| World/structural events | `WorldRng` or `WorldAiMgmtRng` when AI-management owned |
| Venue event demand/revenue variance | `WorldRng` with `venue:<clubId>:<week>` sub-label |
| Narrative variants only | `NewsRng` / `PresentationRng` or `generator:narrative:*`, forbidden from simulation logic |

Adding future sub-labels is allowed. Drawing from another subsystem's RNG is
forbidden.

## 4. Narrative boundary

Narrative is a rendering/projection concern:

1. domain context emits a structured fact;
2. transactional outbox records the fact;
3. Notification/narrative projection selects eligible template family,
   variant and channel deterministically;
4. UI renders compiled ICU text.

Runtime LLM generation is not approved. Build-time LLM authoring assistance
remains governed by [[../../60-Research/narrative-content-pipeline]]. Any
future runtime AI proposal needs a separate research/ADR pass and must never
create simulation facts.

## 5. Player schema boundary

ADR-0007 / [[../../60-Research/data-generators]] remain authoritative for
player attributes:

- 16 visible outfield attributes;
- 4 GK-only attributes;
- 8 hidden meta attributes.

Player lifecycle systems may derive labels such as ambition, leadership,
resilience, temperament and learning speed from the locked schema plus
context. They may not introduce a second hidden-value schema without a new
ADR.

Potential is stored as deterministic underlying potential. Player-facing
scouting and coaching expose uncertainty ranges.

## 6. Venue boundary

Venue operations are part of Stadium Operations. Club Management consumes
ledger-facing settlement facts and remains the sole finance-ledger writer per
ADR-0050. Venue operations include:

- non-matchday event calendar;
- setup and teardown windows;
- revenue/cost source facts consumed by CommercialPortfolio and Club Management;
- pitch wear and match-prep conflicts;
- security/compliance hooks;
- sponsor and fan-segment effects supplied by CommercialPortfolio and Audience
  & Atmosphere facts;

The game simulates venue operations weekly or by event boundary. It does not
simulate individual visitor/catering shifts.

## 7. Consequences

Positive:

- preserves service-ready bounded contexts;
- keeps randomness explainable and replay-safe;
- allows deep active-club simulation and cheaper background simulation;
- keeps narrative text deterministic and localizable;
- gives stadium/arena operations football consequences instead of a detached
  tycoon minigame.

Costs:

- more event schemas and contracts are needed up front;
- UI must explain causes, not only outcomes;
- statistical balance needs long-run simulations once implementation starts.

## 8. Compliance

Implementation must provide:

- Zod/TS contracts for systemic commands and events;
- deterministic golden tests for week ticks, injuries and venue events;
- statistical envelope tests for injury and event frequency;
- narrative projection tests ensuring text never creates new facts;
- no `Math.random`, `Date.now` or runtime LLM dependencies in simulation
  paths.

## 9. Supersession

This ADR does not supersede ADR-0019, ADR-0013, D8 or D15. It specializes
them for player lifecycle and systemic events.
