---
title: "Raw - sports-management finance UI precedent (FMX-150)"
status: raw
tags: [research, raw, perplexity, finance-ui, sports-management, progressive-disclosure, quick-standard-expert, fmx-150]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-150
related:
  - [[../chart-of-accounts-and-category-catalog-2026-06-13]]
  - [[../../50-Game-Design/GD-0008-finance-economy]]
  - [[../../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../../10-Architecture/09-Decisions/ADR-0106-chart-of-accounts-and-category-catalog]]
---

# Raw - sports-management finance UI precedent (FMX-150)

## Research prompt

Perplexity was asked how comparable sports-management games expose finance depth and which accounting
details they hide. The prompt compared Football Manager, OOTP, Hattrick and Anstoss-style games and
asked how Quick / Standard / Expert accounting surfaces can come from one underlying double-entry
ledger.

## Key findings

- Sports-management games rarely expose accounting journals as the primary UI. They expose cash,
  balance, profit/loss, transfer budget, wage budget, revenue/expense categories, projections and
  budget warnings.
- Football Manager-style surfaces make transfer debt, wage budget, amortisation-like transfer
  commitments and broad income/expense categories visible, but do not ask players to post journals.
- OOTP-style sports management exposes budget, owner expectations, projected profit/loss and
  category-level finance boards; again the journal is hidden.
- Hattrick/Anstoss-style finance focuses on category totals, weekly rhythm and understandable
  consequences rather than statutory reporting.
- The best FMX shape is one authoritative double-entry ledger underneath, with progressive
  disclosure:
  - Quick: 3-5 KPIs and warnings (cash runway, weekly burn, wage headroom, transfer debt,
    board/compliance risk).
  - Standard: income/expense board, wage and transfer budgets, category trend and projections.
  - Expert: statements, balance sheet/cash-flow style views, account/category drilldown and an
    audit drawer for posting provenance.
- A full journal-first Expert mode is possible, but would make the deepest mode feel like accounting
  software rather than a football-management game. Journal detail should be available as drilldown.

## Source trail

- Perplexity research pass, 2026-06-13: sports-management finance presentation and progressive
  disclosure for accounting depth.
- Existing FMX Wave-2 progressive-disclosure synthesis:
  [[../progressive-disclosure-research]].
- Existing FMX competitor research:
  [[../competitor-matrix]] and [[../feature-library-synthesis]].

## Notes for synthesis

The research supports deriving all three UI tiers from the same ledger/read models. `accountCode`
should serve audit and statements; `categoryCode` should serve player-facing P&L line detail.
The open decision is how much audit detail Expert exposes by default.
