---
title: Handoff FMX-13 Club Economy Blueprint
status: wrapped
tags: [meta, execution, handoff, fmx-13, economy]
created: 2026-05-27
updated: 2026-05-27
type: handoff
binding: false
linear: FMX-13
related:
  - [[../../60-Research/club-economy-blueprint-2026-05-27]]
  - [[../../50-Game-Design/GD-0008-finance-economy]]
  - [[../../50-Game-Design/economy-system]]
  - [[../../20-Features/feature-club-economy-mvp-pillar]]
  - [[../../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
---

# Handoff: FMX-13 Club Economy Blueprint (2026-05-27)

## Linear

- Issue: FMX-13
- Branch: `codex/fmx-13-club-economy-blueprint`

## Completed

- Created the Linear issue and linked a plan under `.cursor/plans/`.
- Promoted the raw club-economy report into a sourced research synthesis.
- Reworked the finance/economy GDDR and economy system note around weekly
  ledger, full accounting, staged insolvency and country profiles.
- Added a draft MVP feature spec for the Club Economy pillar.
- Added a draft ADR and implementation-contract note for Club Management's
  accounting ledger.
- Updated related gameplay notes, MVP scope, architecture maps, feature maps,
  research maps and Current-State.

## Open Tasks

- Nico must decide whether to ratify the draft GDDR/ADR path.
- Balance constants remain intentionally open until soak simulations exist.
- Investor rescue remains SP-only future-scope and needs monetisation/legal
  review before any implementation planning.

## Blockers

- None for documentation draft anchoring.
- Implementation remains blocked by the project phase and by draft status of
  the relevant GDDR/ADR.

## Changed vault paths

- `docs/60-Research/club-economy-blueprint-2026-05-27.md`
- `docs/50-Game-Design/GD-0008-finance-economy.md`
- `docs/50-Game-Design/economy-system.md`
- `docs/20-Features/feature-club-economy-mvp-pillar.md`
- `docs/10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger.md`
- `docs/30-Implementation/club-economy-accounting-ledger.md`
- Index and map updates across `docs/00-Index/`, `docs/50-Game-Design/README.md`,
  `docs/20-Features/README.md`, `docs/60-Research/00-summary.md` and
  `docs/10-Architecture/README.md`.

## Needs promotion

- [[../../50-Game-Design/GD-0008-finance-economy]] from `draft` to `approved`
  only after Nico ratifies.
- [[../../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  from `draft` to `accepted` only after Nico ratifies.
- [[../../20-Features/feature-club-economy-mvp-pillar]] from `draft` to
  `approved` only when the implementation beat is ready.
