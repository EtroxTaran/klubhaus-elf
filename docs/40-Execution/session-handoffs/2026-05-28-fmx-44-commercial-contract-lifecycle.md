---
title: Handoff - FMX-44 Commercial Contract Lifecycle
status: wrapped
tags: [meta, execution, handoff, economy, commercial, contracts, fmx-44]
created: 2026-05-28
updated: 2026-05-28
type: handoff
binding: false
related:
  - [[../../60-Research/commercial-contract-lifecycle-and-breach-model-2026-05-28]]
  - [[../../60-Research/raw-perplexity/raw-commercial-contract-lifecycle-2026-05-28]]
  - [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - [[../../30-Implementation/club-economy-commercial-contracts]]
---

# Handoff: FMX-44 Commercial Contract Lifecycle (2026-05-28)

## Linear

- Issue: FMX-44

## Done this session

- Ran follow-up Perplexity research on sports sponsorship structures, stadium
  catering/concession/retail/hospitality/supplier contracts and CLM lifecycle
  best practices; preserved a raw research log.
- Added
  [[../../60-Research/commercial-contract-lifecycle-and-breach-model-2026-05-28]]
  as the FMX-44 synthesis.
- Refined draft GD-0022 with shared commercial lifecycle, all six contract
  families, curable/material/critical breach handling, exclusivity conflicts,
  renewal rights, cash-vs-recognition rules and Quick / Standard / Expert
  surfaces.
- Expanded draft
  [[../../30-Implementation/club-economy-commercial-contracts]] with the
  `CommercialContract` field surface, lifecycle states, breach severities,
  family schedules, event vocabulary and test scenarios.
- Updated draft ADR-0058 to make Option C acceptance-ready without ratifying
  it: Club Management owns commercial contract lifecycle/breach and the ledger;
  other domains provide facts.
- Updated economy, sponsorship, stadium/campus and MVP economy pillar notes,
  plus Current State, Research Map, Game Design Map, Game Design Hub and
  Decision Log.

## Open / next step

- Nico decision: accept ADR-0058 Option C after FMX-44, or reopen the
  Commercial Operations bounded-context option.
- Decide default stable/balanced/upside presets per contract family.
- Decide Quick-mode conflict handling: hard block versus accept-with-warning.
- Decide whether controversial sponsor categories ship in first playable or
  remain deferred behind legal/reputation review.
- Decide whether minimum guarantees, true-ups and clawbacks are Standard-visible
  or Expert-only.
- Decide whether auto-renewals require explicit player confirmation.

## Blockers

- None for the documentation beat.
- ADR-0058 remains `draft`; it is prepared for Nico review but not ratified.

## Changed vault paths

- `docs/60-Research/commercial-contract-lifecycle-and-breach-model-2026-05-28.md`
- `docs/60-Research/raw-perplexity/raw-commercial-contract-lifecycle-2026-05-28.md`
- `docs/60-Research/raw-perplexity/README.md`
- `docs/60-Research/00-summary.md`
- `docs/50-Game-Design/GD-0022-economy-commercial-impact-and-contracts.md`
- `docs/50-Game-Design/economy-system.md`
- `docs/50-Game-Design/sponsorship-portfolio.md`
- `docs/50-Game-Design/stadium-and-campus.md`
- `docs/50-Game-Design/README.md`
- `docs/20-Features/feature-club-economy-mvp-pillar.md`
- `docs/30-Implementation/club-economy-commercial-contracts.md`
- `docs/10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary.md`
- `docs/00-Index/Current-State.md`
- `docs/00-Index/Research-Map.md`
- `docs/00-Index/Game-Design-Map.md`
- `docs/00-Index/Decision-Log.md`
- `docs/40-Execution/session-handoffs/README.md`

## Needs promotion

- ADR-0058 owner decision.
- GD-0022 owner approval after ADR boundary decision.
