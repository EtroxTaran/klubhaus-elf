---
title: "Raw - chart of accounts for a game ledger (FMX-150)"
status: raw
tags: [research, raw, perplexity, ledger, chart-of-accounts, accounting, game-economy, fmx-150]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-150
related:
  - [[../chart-of-accounts-and-category-catalog-2026-06-13]]
  - [[../../10-Architecture/09-Decisions/ADR-0095-balanced-transfer-ledger-posting-invariant]]
  - [[../../10-Architecture/09-Decisions/ADR-0106-chart-of-accounts-and-category-catalog]]
---

# Raw - chart of accounts for a game ledger (FMX-150)

## Research prompt

Perplexity was asked for a concrete small fixed chart of accounts for an offline deterministic
football-manager game ledger after [[../../10-Architecture/09-Decisions/ADR-0095-balanced-transfer-ledger-posting-invariant|ADR-0095]]
approved a two-level design: a small typed account set plus versioned posting `categoryCode`
metadata. The prompt named the existing FMX posting families: matchday costs, catering,
merchandise, sponsorship, cup settlement, financing, fan-event settlement, investor cash grants,
wages, transfers/amortisation and insolvency write-offs.

## Key findings

- A general ledger chart should stay stable and classify accounts by the standard account families:
  asset, liability, equity, income/revenue and expense.
- Product or embedded ledgers should avoid mirroring every business sub-detail as a separate
  account. Keep accounts to economic roles and place fine business reasons in dimensions/categories.
- For FMX, the concrete chart should be larger than a cash-only MVP but smaller than a full ERP:
  roughly 35-45 account codes is enough to support a balance sheet, P&L, receivable/payable
  separation, transfer-amortisation pressure and readable Expert accounting.
- The chart should include control accounts for cash, receivables, inventory, player registrations,
  payables, wages payable, transfer payables, deferred revenue, financing debt and equity.
- Revenue accounts should separate the families a football manager player expects to scan:
  matchday, sponsorship/commercial, merchandise, catering, broadcast/prize, transfer disposal gain,
  loan wage recharge, debt restructuring gain and investor/entitlement cash grants.
- Expense accounts should separate the families that drive gameplay trade-offs: player/staff wages,
  contract costs, registration amortisation/losses/write-offs, matchday operations,
  commercial/retail COGS/waste, fan-event campaigns, financing interest, tax and other operations.
- The raw answer suggested numeric account ranges as a common accounting convention, but FMX already
  uses semantic provisional handles in [[../../10-Architecture/09-Decisions/ADR-0105-wage-and-transfer-fee-posting-contracts|ADR-0105]]
  (`expense.player_wages`, `asset.player_registrations`, etc.). The synthesis therefore treats
  semantic dotted codes as the recommended FMX direction and keeps numeric ranges as an option.

## Source trail

- Perplexity research pass, 2026-06-13: small fixed chart of accounts for a product/game ledger.
- NetMBA, Chart of Accounts overview: <https://www.netmba.com/accounting/fin/accounts/chart/>
- AccountingCoach, Chart of Accounts: <https://www.accountingcoach.com/chart-of-accounts/explanation>
- Germanna Community College, accounting account classifications PDF: <https://germanna.edu/>
- Aptora, account types and chart-of-accounts explanation: <https://www.aptora.com/>

## Notes for synthesis

The research supports a stable medium chart, not a detailed per-cost chart. The main Klubhaus Elf-specific
decision is code style: semantic dotted codes align with the existing ADR vocabulary and are safer
for human-readable docs; numeric ranges align with classic accounting but add an extra translation
layer for a game-facing system.
