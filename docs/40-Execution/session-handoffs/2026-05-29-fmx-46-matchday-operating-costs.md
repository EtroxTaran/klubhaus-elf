---
title: Handoff - FMX-46 Matchday Operating Costs
status: wrapped
tags: [meta, execution, handoff, economy, matchday, operations, risk, fmx-46]
created: 2026-05-29
updated: 2026-05-29
type: handoff
binding: false
related:
  - [[../../60-Research/matchday-operating-costs-and-risk-cost-settlement-2026-05-29]]
  - [[../../60-Research/raw-perplexity/raw-matchday-operating-costs-risk-settlement-2026-05-29]]
  - [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../../30-Implementation/club-economy-commercial-contracts]]
  - [[../../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
---

# Handoff: FMX-46 Matchday Operating Costs (2026-05-29)

## Linear

- Issue: FMX-46

## Done this session

- Synced local `main` to `origin/main` before work and based FMX-46 on the
  accepted FMX-32 boundary outcome.
- Added
  [[../../60-Research/matchday-operating-costs-and-risk-cost-settlement-2026-05-29]]
  as the FMX-46 synthesis and preserved the prompt/source log in
  [[../../60-Research/raw-perplexity/raw-matchday-operating-costs-risk-settlement-2026-05-29]].
- Defined `MatchdayOperatingCostProfile` with risk tiers from `routine` to
  `closedDoor` and settlement families for stewarding, private security,
  policing contribution, medical, cleaning/waste, energy, temporary staff,
  officials, pitch recovery, insurance/compliance allocation, damage reserve,
  sanctions, sector closures, away-fan restrictions, alcohol restrictions and
  ghost matches.
- Updated GD-0022, Economy System, Regulations, Matchday Event Engine,
  Rivalry, Stadium/Campus and Audience & Atmosphere to consume the profile.
- Updated ADR-0050 and ADR-0058 so CommercialPortfolio owns the operating-cost
  profile/settlement and Club Management remains the sole ledger writer.
- Updated the Club Economy MVP feature, commercial-contract implementation
  note, Decision Log, maps, research summary, raw-source index, Current State
  and handoff index.

## Open / next step

- Nico still needs to approve final profile values and cost ranges per country,
  league tier, stadium tier and risk tier.
- Decide whether high-risk mitigation defaults are player-selected only,
  auto-recommended, or auto-applied inside a bounded safety floor.
- Decide how much policing-cost control is playable in countries where real
  law makes club liability partial, disputed or unavailable.
- Decide whether severe incident chains can happen in MVP, and if yes their
  maximum frequency, warnings and recovery affordances.

## Blockers

- None for the documentation beat.
- Final gameplay constants and incident-frequency tuning are intentionally not
  frozen in FMX-46.

## Changed vault paths

- `docs/60-Research/matchday-operating-costs-and-risk-cost-settlement-2026-05-29.md`
- `docs/60-Research/raw-perplexity/raw-matchday-operating-costs-risk-settlement-2026-05-29.md`
- `docs/60-Research/raw-perplexity/README.md`
- `docs/60-Research/00-summary.md`
- `docs/50-Game-Design/GD-0022-economy-commercial-impact-and-contracts.md`
- `docs/50-Game-Design/economy-system.md`
- `docs/50-Game-Design/regulations-and-compliance.md`
- `docs/50-Game-Design/matchday-event-engine.md`
- `docs/50-Game-Design/rivalry-system.md`
- `docs/50-Game-Design/stadium-and-campus.md`
- `docs/50-Game-Design/audience-and-atmosphere.md`
- `docs/50-Game-Design/README.md`
- `docs/20-Features/feature-club-economy-mvp-pillar.md`
- `docs/30-Implementation/club-economy-commercial-contracts.md`
- `docs/10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger.md`
- `docs/10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary.md`
- `docs/00-Index/Architecture-Map.md`
- `docs/00-Index/Current-State.md`
- `docs/00-Index/Decision-Log.md`
- `docs/00-Index/Feature-Map.md`
- `docs/00-Index/Game-Design-Map.md`
- `docs/00-Index/Implementation-Map.md`
- `docs/00-Index/Research-Map.md`
- `docs/40-Execution/session-handoffs/README.md`

## Needs promotion

- Promote GD-0022 and the relevant economy ADR amendments only after Nico
  approves the remaining calibration and risk-frequency decisions.
