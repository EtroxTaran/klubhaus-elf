---
title: Handoff - FMX-45 Cup Competition Revenue
status: wrapped
tags: [meta, execution, handoff, economy, cup, competition, revenue, fmx-45]
created: 2026-05-28
updated: 2026-05-28
type: handoff
binding: false
related:
  - [[../../60-Research/cup-and-competition-revenue-profiles-2026-05-28]]
  - [[../../60-Research/raw-perplexity/raw-cup-competition-revenue-profiles-2026-05-28]]
  - [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../../30-Implementation/club-economy-commercial-contracts]]
  - [[../../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
---

# Handoff: FMX-45 Cup Competition Revenue (2026-05-28)

## Linear

- Issue: FMX-45

## Done this session

- Ran FMX-45 research planning for domestic and continental cup revenue,
  including England, Germany, Spain, Italy, France, UEFA-style continental
  distribution and expected-value / elimination-shock patterns.
- Added
  [[../../60-Research/cup-and-competition-revenue-profiles-2026-05-28]]
  as the synthesis and preserved the raw prompt/source log in
  [[../../60-Research/raw-perplexity/raw-cup-competition-revenue-profiles-2026-05-28]].
- Refined draft GD-0022 with cup-specific revenue profiles, layered EV
  visibility and explicit settlement scenarios.
- Expanded
  [[../../30-Implementation/club-economy-commercial-contracts]] with the
  `CompetitionRevenueProfile` field surface, cup settlement event vocabulary
  and read-model/test expectations.
- Updated draft ADR-0050 and ADR-0058 to name cup receivable/cash/forecast
  events while keeping Club Management as the settlement owner.
- Updated economy, regulations, MVP feature, research/map/index and Current
  State notes.

## Open / next step

- Final calibration values per profile family remain a later balance decision.
- Retry extraction of the official Lega Serie A PDF before Italy-specific
  constants are frozen.
- Decide whether Quick-mode board budgets may spend any fraction of cup EV.
- Decide replay support for first playable versus profile-data-only.
- Resolve season-ticket cup priority / material-right accounting in the FMX-43
  follow-up, not in FMX-45.

## Blockers

- None for the documentation beat.
- ADR-0050, ADR-0058 and GD-0022 remain `draft`; FMX-45 does not ratify them.

## Changed vault paths

- `docs/60-Research/cup-and-competition-revenue-profiles-2026-05-28.md`
- `docs/60-Research/raw-perplexity/raw-cup-competition-revenue-profiles-2026-05-28.md`
- `docs/60-Research/raw-perplexity/README.md`
- `docs/60-Research/00-summary.md`
- `docs/50-Game-Design/GD-0022-economy-commercial-impact-and-contracts.md`
- `docs/50-Game-Design/economy-system.md`
- `docs/50-Game-Design/regulations-and-compliance.md`
- `docs/50-Game-Design/README.md`
- `docs/20-Features/feature-club-economy-mvp-pillar.md`
- `docs/30-Implementation/club-economy-commercial-contracts.md`
- `docs/10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger.md`
- `docs/10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary.md`
- `docs/00-Index/Current-State.md`
- `docs/00-Index/Research-Map.md`
- `docs/00-Index/Game-Design-Map.md`
- `docs/00-Index/Decision-Log.md`
- `docs/40-Execution/session-handoffs/README.md`
