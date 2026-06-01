---
title: Handoff FMX-47 Catering and Merchandise Operations Depth
status: wrapped
tags: [meta, execution, handoff, economy, catering, merchandise, operations, inventory, fmx-47]
created: 2026-06-01
updated: 2026-06-01
type: handoff
binding: false
related:
  - [[../../60-Research/catering-and-merchandise-operations-2026-06-01]]
  - [[../../60-Research/raw-perplexity/raw-catering-and-merchandise-operations-2026-06-01]]
  - [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../../50-Game-Design/economy-system]]
  - [[../../50-Game-Design/stadium-and-campus]]
  - [[../../30-Implementation/club-economy-commercial-contracts]]
  - [[../../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
---

# Handoff: FMX-47 Catering and Merchandise Operations Depth (2026-06-01)

## Linear

- Issue: FMX-47 — Research catering and merchandise operations depth
  (`type:research`, `type:game-design`, `needs:nico-decision`, Medium).
- Branch: `claude/fmx-47-catering-merchandise-operations` (off `main`).
- Sibling/parallel: FMX-53 (Top-5 country profiles) is on its own unmerged
  branch; FMX-47's alcohol-policy + per-country default hooks reference it but
  add no wikilink to its notes.

## Done this session

- Ran 5 grounded Perplexity passes (stadium catering/concession models &
  economics; football merchandise/retail models & demand; IFRS 15 / IAS 2
  recognition; service-quality + alcohol + SLA/breach; supplier exclusivity /
  pouring rights). Sources preserved.
- New research synthesis
  [[../../60-Research/catering-and-merchandise-operations-2026-06-01]] and raw
  transcript
  [[../../60-Research/raw-perplexity/raw-catering-and-merchandise-operations-2026-06-01]].
- Refined drafts: GD-0022, economy-system (revenue taxonomy + impact graph +
  FMX-47 paragraph), stadium-and-campus (throughput-as-Stadium-fact paragraph),
  club-economy-commercial-contracts (catering/merch operations subsection:
  `operatingModel`, cost/inventory fields, settlement events).
- ADR-0050: named the catering/merch ledger events + two operations read models.
  ADR-0058: added the FMX-47 catering/merchandise operations amendment
  (no boundary change).
- Indexes: Current-State banner, 60-Research/00-summary section,
  raw-perplexity/README row, Research-Map entry.

## Key proposed direction (all calibration ranges, IP-clean)

- One `operatingModel` dial per family decides risk allocation (catering:
  in-house / concession lease / management fee / revenue-share / MAG-plus-share;
  merchandise: own-store-and-e-commerce / licensed-partner / kit-supplier-
  guarantee / pure-licensing).
- Catering revenue = `attendance × per-capita`, capped by service capacity and
  stockouts; ledger separates revenue / COGS / labour / waste / royalty-MAG
  true-up / guarantee shortfall.
- Merchandise = stock plan vs demand forecast (launch/icon/cup spikes), then
  markdown, write-down-to-NRV, returns.
- Service quality → Audience & Atmosphere; alcohol policy = revenue↔safety dial;
  supplier exclusivity reuses the FMX-44 exclusivity graph; cash-vs-recognition
  per IFRS 15. Ownership stays in CommercialPortfolio; Club Management sole
  ledger writer; Stadium supplies throughput; A&A supplies demand/mood.

## Open / next step

- Nico decisions (see synthesis §Open questions): operational depth ceiling
  (full sim vs abstracted bands), per-country default operating model,
  alcohol-policy modelling depth, service-penalty hardness, campaign-drop
  scheduling, Quick-mode abstraction.
- Downstream economy beats still in Todo: FMX-48 (fan-service campaigns),
  FMX-49 (financing tools), FMX-50 (Investor compliance), FMX-51 (AI club
  economy), FMX-52 (calibration & soak-test).

## Blockers

- None. Research/planning only; nothing implemented. All ADR/GDDR numbers remain
  ranges pending Nico calibration. ADR-0050/0058 stay accepted/binding (events &
  amendment added, no decision reversed).

## Changed vault paths

- `docs/60-Research/catering-and-merchandise-operations-2026-06-01.md` (new)
- `docs/60-Research/raw-perplexity/raw-catering-and-merchandise-operations-2026-06-01.md` (new)
- `docs/40-Execution/session-handoffs/2026-06-01-fmx-47-catering-merchandise-operations.md` (new)
- `docs/50-Game-Design/GD-0022-economy-commercial-impact-and-contracts.md` (refined)
- `docs/50-Game-Design/economy-system.md` (refined)
- `docs/50-Game-Design/stadium-and-campus.md` (refined)
- `docs/30-Implementation/club-economy-commercial-contracts.md` (refined)
- `docs/10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger.md` (events + read models)
- `docs/10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary.md` (FMX-47 amendment)
- `docs/00-Index/Current-State.md` (banner)
- `docs/00-Index/Research-Map.md` (entry)
- `docs/60-Research/00-summary.md` (section)
- `docs/60-Research/raw-perplexity/README.md` (row)
