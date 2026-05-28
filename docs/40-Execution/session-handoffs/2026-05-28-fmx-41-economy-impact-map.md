---
title: Handoff - FMX-41 Economy Impact Map and Commercial Contracts
status: wrapped
tags: [meta, execution, handoff, fmx-41]
created: 2026-05-28
updated: 2026-05-28
type: handoff
binding: false
related:
  - [[../../60-Research/club-economy-impact-map-and-commercial-contracts-2026-05-28]]
  - [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../../50-Game-Design/GD-0008-finance-economy]]
  - [[../../50-Game-Design/economy-system]]
  - [[../../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - [[../../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../../30-Implementation/club-economy-commercial-contracts]]
  - [[../../20-Features/feature-club-economy-mvp-pillar]]
---

# Handoff: FMX-41 Economy Impact Map and Commercial Contracts (2026-05-28)

## Linear

- Issue: FMX-41

## Done this session

- Updated local `main` to `origin/main` and created branch
  `codex/fmx-41-economy-impact-map`.
- Created Linear issue FMX-41 and moved it to In Progress.
- Added research synthesis
  [[../../60-Research/club-economy-impact-map-and-commercial-contracts-2026-05-28]]
  covering direct financial-success domains, Top-5 country research anchors,
  ticketing/season-ticket trade-offs, catering, merchandise, sponsorship, cup
  games, fan-service campaigns and Investor clean singleplayer cash.
- Added draft GDDR
  [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]].
- Added draft ADR
  [[../../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  recommending Club Management commercial sub-aggregate as the MVP boundary.
- Added implementation draft
  [[../../30-Implementation/club-economy-commercial-contracts]] with contract
  sketches for `FanDemandForecast`, `FixtureCommercialProfile`,
  `StadiumCommercialSnapshot`, `TicketingPolicy`, `CommercialContract`,
  `CompetitionRevenueProfile`, `FanEventCampaign` and
  `InvestorEntitlementGrant`.
- Updated the existing economy, fan, sponsorship, stadium, regulations,
  feature, map and Current-State notes so the new commercial layer is reachable
  from front-door docs.

## Open / next step

- Nico decides whether ADR-0058 Option C should be accepted: commercial policy
  and contracts stay inside Club Management for MVP.
- Nico decides whether Investor clean cash activates in the first playable SP
  or waits for platform/legal review.
- Follow-up calibration needs profile ranges for Germany, England, Spain,
  Italy and France; this beat documents the research anchors, not final
  constants.
- Future implementation beat should turn the draft contract names into actual
  schemas only after GDDR/ADR approval.

## Blockers

- No commercial economy implementation should start from these draft notes until
  Nico approves the relevant GDDR/ADR path.
- Investor activation requires platform billing, consumer-law and disclosure
  review.

## Changed vault paths

- `docs/60-Research/club-economy-impact-map-and-commercial-contracts-2026-05-28.md`
- `docs/50-Game-Design/GD-0022-economy-commercial-impact-and-contracts.md`
- `docs/10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary.md`
- `docs/30-Implementation/club-economy-commercial-contracts.md`
- `docs/50-Game-Design/GD-0008-finance-economy.md`
- `docs/50-Game-Design/economy-system.md`
- `docs/50-Game-Design/fan-ecology.md`
- `docs/50-Game-Design/sponsorship-portfolio.md`
- `docs/50-Game-Design/stadium-and-campus.md`
- `docs/50-Game-Design/regulations-and-compliance.md`
- `docs/20-Features/feature-club-economy-mvp-pillar.md`
- `docs/00-Index/*` maps and current-state entries.

## Needs promotion

- GD-0022 can become approved only after Nico accepts the commercial impact
  design.
- ADR-0058 can become accepted only after Nico accepts the Club Management
  commercial sub-aggregate boundary.
- Commercial contract fields remain planning names until an implementation
  issue turns them into validated schemas.
