---
title: Feature - Training, Medicine and Availability
status: draft
tags: [feature, training, medicine, injuries, availability]
context: [training, squad-player]
created: 2026-05-17
updated: 2026-05-28
type: feature
binding: false
related: [[README]], [[../50-Game-Design/training-load-and-medicine]], [[../50-Game-Design/squad-and-club-structure]], [[../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]], [[../60-Research/systemic-events-player-development-venue-ops]], [[../60-Research/player-staff-development-decision-model-2026-05-28]], [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
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

## MVP foundation scope

For the Roguelite first playable, training/medicine is limited to the basic
training signal and readiness impact needed for the first-week loop.

- Training block grid and intensity/readiness output.
- Multifactor injury risk profile with visible staff bands.
- Training injuries and return-from-injury events.
- Rehab quality and medical-centre duration modifiers.
- Deterministic `InjuryRng` usage for long-term injury draws.
- Staff pipeline-quality hooks consumed from Staff Operations only through the
  GD-0021 factor matrix. Staff-skill profile effects remain gated until Nico
  chooses a staff-skill MVP option.

## Out of first playable scope

- Real GPS metric simulation.
- Exact ACWR threshold UI.
- Wellness/sleep tracking beyond flavour cards.

## Acceptance

- Injuries are deterministic for the same inputs + seed.
- Risk explanations reference visible causes such as load, history, pitch,
  role demand or early return.
- Injury occurrence and severity are separate draws.
- Match injuries remain sourced from Match and persisted by Squad & Player.
- Training/medical staff effects can be explained through pipeline coverage,
  not hidden global buffs.

## Dependencies

- [[../50-Game-Design/training-load-and-medicine]]
- [[../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]]
- [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
- [[../60-Research/determinism-and-replay]]
