---
title: Handoff FMX-154 Hidden-Attribute Reveal Contract
status: open
tags: [meta, execution, handoff, fmx-154, hidden-attributes, scouting, people]
created: 2026-06-14
updated: 2026-06-14
type: handoff
binding: false
linear: FMX-154
related:
  - [[../../60-Research/hidden-attribute-reveal-owner-reconciliation-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-hidden-attribute-reveal-owner-reconciliation-2026-06-14]]
  - [[../../50-Game-Design/GD-0027-hidden-attribute-substrate-mapping]]
  - [[../../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]]
---

# Handoff: FMX-154 hidden-attribute reveal contract (2026-06-14)

## Goals

- Reconcile stale `draft` / `awaiting ratify` wording around GD-0027 and GD-0021.
- Preserve the research and decision chain for hidden persona-label ownership.
- Keep the accepted contract narrow: People derives, Scouting gates, Squad/UI presents.

## Completed

- Claimed FMX-154 and set Linear to `In Progress`.
- Captured the Perplexity research and source-quality note.
- Added the FMX-154 synthesis note with Nico's two selected decisions.
- Updated GD-0027, GD-0021, Decision Log, Current-State, Research Map and game-design indexes.

## Open Tasks

- Run vault validation and publish the PR.
- Move Linear to the review state after PR creation.

## Decisions Made

- GD-0027 remains `accepted`; stale draft/approved wording was historical only.
- Hidden-persona-label truth stays with People / Persona & Skills.
- Scouting owns only confidence/reveal state via `HiddenFlagRevealLedger`.
- Squad & Player / UI presents banded read models and never owns the label truth.

## Blockers

- None. Staff-skill MVP activation in GD-0021 remains a separate open gate.

## Durable Notes Updated

- `docs/60-Research/raw-perplexity/raw-hidden-attribute-reveal-owner-reconciliation-2026-06-14.md`
- `docs/60-Research/hidden-attribute-reveal-owner-reconciliation-2026-06-14.md`
- `docs/50-Game-Design/GD-0027-hidden-attribute-substrate-mapping.md`
- `docs/50-Game-Design/GD-0021-player-staff-development-and-decision-influence.md`
- front-door/index notes for research, game design and decisions

## Promotion Needed

- None. This is a reconciliation cleanup of already accepted records, not a new
  decision queue.

