---
title: ADR-0012 Async Multiplayer Cadence Models (Fixed + Dynamic)
status: proposed
tags: [adr, architecture, async, multiplayer, cadence]
created: 2026-05-16
updated: 2026-05-16
type: adr
binding: false
related: [[../../60-Research/async-multiplayer-research]], [[../../50-Game-Design/async-multiplayer-private-group]], [[../state-machines/league-week]]
---

# ADR-0012: Async Multiplayer Cadence Models (Fixed + Dynamic)

## Status

Proposed (2026-05-16). Needs Nico's review before acceptance.

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

## Sources

- [[../../60-Research/async-multiplayer-research]] §1-§4
- [[../../60-Research/raw-perplexity/raw-async-multiplayer]]
- gamedeveloper.com asynchronicity in game design
- wayline.io async multiplayer
