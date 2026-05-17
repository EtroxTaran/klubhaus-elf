---
title: Feature - Training, Medicine and Availability
status: draft
tags: [feature, training, medicine, injuries, availability]
created: 2026-05-17
updated: 2026-05-17
type: feature
binding: false
related: [[README]], [[../50-Game-Design/training-load-and-medicine]], [[../50-Game-Design/squad-and-club-structure]], [[../60-Research/systemic-events-player-development-venue-ops]], [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
---

# Feature - Training, Medicine and Availability

## Goal

Make training intensity, recovery and medical quality meaningful by linking
them to fatigue, readiness, injury risk and development.

## User stories

- As a manager I can raise intensity before an important run and see the
  availability risk.
- As a manager I can rest a player because staff warn me about recurrence.
- As a manager I can invest in medical and sport-science quality to reduce
  downtime and re-injury risk.

## In scope (MVP)

- Training block grid and intensity/readiness output.
- Multifactor injury risk profile with visible staff bands.
- Training injuries and return-from-injury events.
- Rehab quality and medical-centre duration modifiers.
- Deterministic `InjuryRng` usage for long-term injury draws.

## Out of scope (MVP)

- Real GPS metric simulation.
- Exact ACWR threshold UI.
- Wellness/sleep tracking beyond flavour cards.

## Acceptance

- Injuries are deterministic for the same inputs + seed.
- Risk explanations reference visible causes such as load, history, pitch,
  role demand or early return.
- Injury occurrence and severity are separate draws.
- Match injuries remain sourced from Match and persisted by Squad & Player.

## Dependencies

- [[../50-Game-Design/training-load-and-medicine]]
- [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
- [[../60-Research/determinism-and-replay]]
