---
title: Handoff FMX-16 Manager Archetype Roguelite
status: wrapped
tags: [meta, execution, handoff, fmx-16]
created: 2026-05-27
updated: 2026-05-27
type: handoff
binding: false
related:
  - [[../../60-Research/manager-archetype-roguelite-2026-05-27]]
  - [[../../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]]
  - [[../../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
---

# Handoff: FMX-16 Manager Archetype Roguelite (2026-05-27)

## Linear

- Issue: FMX-16

## Done this session

- Created the FMX-16 Linear issue in Backlog with `type:game-design`,
  `area:squad-club` and `needs:nico-decision`.
- Promoted the manager-archetype roguelite raw report into a sourced research
  synthesis.
- Added draft GD-0019 for manager-archetype roguelite progression.
- Added draft ADR-0051 for the proposed Manager & Legacy bounded context.
- Updated the Roguelite MVP feature/mode docs with MVP hooks only.
- Updated indexes, maps and Current State for discoverability.

## Open / next step

- Nico decision needed before ratification: approve, revise or reject the
  Manager & Legacy context proposal.
- Playtests must validate taxonomy and tuning before final archetype families,
  thresholds or perk values are locked.
- A future implementation beat should define concrete Zod schemas only after
  GD-0019 and ADR-0051 are accepted.

## Blockers

- No implementation authority yet: GD-0019 and ADR-0051 are draft.

## Changed vault paths

- `docs/60-Research/manager-archetype-roguelite-2026-05-27.md`
- `docs/50-Game-Design/GD-0019-manager-archetype-roguelite-progression.md`
- `docs/10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context.md`
- `docs/50-Game-Design/mode-create-a-club-roguelite.md`
- `docs/20-Features/feature-roguelite-mvp-first-playable.md`
- `docs/00-Index/*` maps and Current State
- `docs/40-Execution/session-handoffs/README.md`

## Needs promotion

- GD-0019 can move to `approved` only after Nico approves the design.
- ADR-0051 can move to `accepted` only after Nico approves the context boundary.
