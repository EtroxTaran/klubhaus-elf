---
title: ADR-0012 Async Multiplayer Cadence Models (Fixed + Dynamic)
status: accepted
tags: [adr, architecture, async, multiplayer, cadence]
created: 2026-05-16
updated: 2026-06-11
type: adr
binding: false
related: [[../../60-Research/async-multiplayer-research]], [[../../50-Game-Design/async-multiplayer-private-group]], [[../state-machines/league-week]], [[ADR-0021-revised-tech-stack]]
---

# ADR-0012: Async Multiplayer Cadence Models (Fixed + Dynamic)

> **STACK-REVISION IMPACT 2026-05-19 ([[ADR-0021-revised-tech-stack]] + ADR-0023/0024/0025).**
> Informational only — status (`proposed`) and decision are **unchanged**; do not
> implement. On promotion the substrate amendment below applies: *cadence/season-
> boundary logic is substrate-neutral; cadence-state persistence → PostgreSQL
> per [[ADR-0021-revised-tech-stack]].*
> Disposition: **keep parked** (owner directive 2026-05-19; gate is owner
> review, currently paused — not the stack).

## Status

accepted

> Originally proposed 2026-05-16; ratified `accepted` 2026-06-08 in the joint ratification wave
> ([[ADR-0093-joint-ratification-wave-async-coordination-foundation|ADR-0093]], with ADR-0088;
> [[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read "Proposed
> (2026-05-16). Needs Nico's review before acceptance.". Body status reconciled to the frontmatter
> SSOT (ADR-0092) on 2026-06-11 (FMX-143).

## Context

Nico explicitly requested two valid async time models: the original
fixed match-day cadence and an alternative dynamic cadence where the
match-day opens when a configurable quorum of managers marks their week
complete. The research
([[../../60-Research/async-multiplayer-research]]) confirms both are
sound and proposes them as **selectable group settings on top of one
shared core**.

## Decision

The async multiplayer system supports **two cadence rule sets**:

- **Fixed Cadence**: match-day triggers on a real-world calendar time
  (configurable per group).
- **Dynamic Cadence**: match-day triggers when ≥ `quorum %` of managers
  have run `CompleteWeek`, plus a configurable countdown.

Both share the same `LeagueWeek` state machine
([[../state-machines/league-week]]); only the trigger for
`quorum_reached` differs.

**Switching rules**:

- Admin may switch the rule set **only at season boundary**.
- Cadence parameters (quorum %, countdown, max week length) may be
  changed only between weeks - never mid-cycle.

Default: Fixed Cadence (lower complexity, friendlier onboarding).

## Consequences

### Positive

- One state machine implementation; switching cadences is one trigger
  swap.
- Groups can pick the model that matches their lifestyle.
- Watch parties stack on top of either model.

### Negative

- Two trigger paths to test.
- Dynamic mode is more notification-intensive (per
  [[../../60-Research/async-multiplayer-research]] §9).
- Admin season-boundary discipline must be enforced in UI.

### Future

- A third hybrid model (e.g. weekly fixed but dynamic within the week)
  is *not* in scope and would re-introduce complexity. Stay with two
  rule sets.

## Implementation

- Group rule set persisted on the league entity with a snapshot per
  season.
- Trigger A (Fixed): scheduled cron-style timer.
- Trigger B (Dynamic): event listener on `CompleteWeek` events checking
  quorum.
- Safety net: max-week-length always armed, regardless of model.

## Compliance

- Mid-week switches MUST be rejected by command validator.
- Cadence parameter changes inside a week MUST be rejected.
- Both modes MUST emit the same domain events (`WeekQuorumReached`,
  `MatchdayOpened`, etc.).

## Watch-party deadline reconciliation (draft — FMX-102)

> **Draft amendment (FMX-102 / proposed [[ADR-0088-async-escalation-fsm-and-watch-party-deadline-source-of-truth]]).**
> Clarifies how a scheduled watch party interacts with the "no mid-cycle mutation" rule above (gap
> G25). Not binding until ratified.

A scheduled watch party does **not** violate the no-mid-cycle-mutation rule. When a watch party is
scheduled, League Orchestration adopts its `broadcast_at` as the matchday timing **anchor**
(`league-week.md §3.1`) and derives the lock deadlines from it. Precedence is **resolved at schedule
time, before the week opens**; the anchor is **immutable once `MatchdayOpened` is emitted**, and any
late reschedule for that fixture is rejected at the domain boundary. Because the deadline is fixed
*before* the cycle opens (not changed during it), the Compliance rules above hold unchanged — this is
an additive clarification, **not** an exception. `MatchdayOpened` still fires for the fixture (it now
carries the resolved anchor + derived locks), satisfying "both modes emit the same domain events."

## Sources

- [[../../60-Research/async-multiplayer-research]] §1-§4
- [[../../60-Research/raw-perplexity/raw-async-multiplayer]]
- gamedeveloper.com asynchronicity in game design
- wayline.io async multiplayer
