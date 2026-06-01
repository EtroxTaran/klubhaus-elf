---
title: FMX-49 Club Financing Tools Separate from Investor Handoff
status: wrapped
tags: [meta, execution, handoff, economy, financing, debt, fmx-49]
created: 2026-06-01
updated: 2026-06-01
type: handoff
binding: false
related:
  - [[../../60-Research/club-financing-tools-2026-06-01]]
  - [[../../60-Research/raw-perplexity/raw-club-financing-tools-2026-06-01]]
  - [[../../50-Game-Design/GD-0008-finance-economy]]
  - [[../../50-Game-Design/economy-system]]
  - [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../../30-Implementation/club-economy-accounting-ledger]]
  - [[../../30-Implementation/club-economy-commercial-contracts]]
---

# Handoff: FMX-49 Club Financing Tools Separate from Investor (2026-06-01)

## Linear

- Issue: FMX-49

## Done this session

- Created the FMX-49 raw and synthesis research notes for in-world club
  financing tools separate from Investor.
- Defined Club Management ownership for `FinancingFacility`,
  `CashflowRunwayForecast`, `OverduePayablesAging`, `DebtServiceSchedule`,
  `CovenantStatusBoard`, `FinancingOptionBoard`, financing commands/events and
  emergency-sale mandates.
- Defined the first-playable tool set: overdraft/credit line, bank loan, sponsor
  advance, receivable factoring, restructuring/payment holiday, owner support
  and emergency-sale mandate.
- Updated CommercialPortfolio boundaries for commercial receivable schedules,
  advance eligibility, contract liabilities and fair-value facts.
- Updated economy GDDR/system notes, ADR-0050, implementation contracts,
  research indexes and Current State.

## Open / next step

- Nico decision needed on exact runway/covenant/arrears thresholds by Top-5
  country profile.
- Nico decision needed on whether media advances become active first-playable or
  remain hook-only.
- Nico decision needed on board guarantees, emergency-sale mandate hardness and
  supplier-arrears depth.
- Later balance work must convert profile ranges into tested calibration data.

## Blockers

- No implementation blocker; this is docs-vault planning only.
- Financing thresholds and active depth are not approved gameplay until Nico
  ratifies the draft direction.

## Changed vault paths

- `docs/60-Research/raw-perplexity/raw-club-financing-tools-2026-06-01.md`
- `docs/60-Research/club-financing-tools-2026-06-01.md`
- `docs/60-Research/raw-perplexity/README.md`
- `docs/60-Research/00-summary.md`
- `docs/50-Game-Design/GD-0008-finance-economy.md`
- `docs/50-Game-Design/economy-system.md`
- `docs/50-Game-Design/GD-0022-economy-commercial-impact-and-contracts.md`
- `docs/50-Game-Design/regulations-and-compliance.md`
- `docs/50-Game-Design/README.md`
- `docs/20-Features/feature-club-economy-mvp-pillar.md`
- `docs/10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger.md`
- `docs/30-Implementation/club-economy-accounting-ledger.md`
- `docs/30-Implementation/club-economy-commercial-contracts.md`
- `docs/00-Index/Current-State.md`
- `docs/00-Index/Decision-Log.md`

## Needs promotion

- If Nico ratifies FMX-49, promote the selected financing thresholds, active
  media-advance scope, board-support rules and emergency-sale mandate hardness
  into GD-0008 / economy-system / ADR-0050 as approved or accepted updates.
