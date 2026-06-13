---
title: "Raw - football club accounting families (FMX-150)"
status: raw
tags: [research, raw, perplexity, football, accounting, ledger, chart-of-accounts, transfers, wages, fmx-150]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-150
related:
  - [[../chart-of-accounts-and-category-catalog-2026-06-13]]
  - [[../../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../../10-Architecture/09-Decisions/ADR-0105-wage-and-transfer-fee-posting-contracts]]
  - [[../../10-Architecture/09-Decisions/ADR-0106-chart-of-accounts-and-category-catalog]]
---

# Raw - football club accounting families (FMX-150)

## Research prompt

Perplexity was asked which real-world football club accounting categories must be represented so
FMX's chart of accounts feels believable without becoming an ERP. The prompt asked specifically for
player registrations and amortisation, transfer receivables/payables, wages/social taxes, matchday
and commercial revenue, merchandise/catering, debt, tax, owner funding and insolvency write-offs.

## Key findings

- Football clubs normally present player registrations as intangible assets and amortise them over
  the player's contract term. Disposal gains/losses are shown as a separate player-registration
  result line rather than hidden in ordinary operating revenue.
- Transfer instalments create amounts receivable from / payable to other clubs. A game ledger needs
  transfer receivable and transfer payable accounts even if Standard UI only exposes "transfer debt".
- Staff costs are a major club P&L line. Player wages and non-player/staff wages should be separately
  readable because they drive different player decisions and FMX already separated them in ADR-0105.
- Common football revenue families are matchday, broadcasting/distribution/prize money, sponsorship,
  other commercial, merchandising/catering and player trading.
- Common cost families are wages/social charges, amortisation/impairment of registrations, matchday
  operations, retail/food cost of sales, administrative/other operating costs, finance costs and tax.
- Debt and liquidity need distinct liability accounts: trade payables, wages/tax/social payables,
  transfer payables, deferred revenue, financing debt and owner loans/support.
- Insolvency and debt restructuring should reduce liabilities against either debt-restructuring
  income or owner/equity contribution depending on creditor class, matching the FMX-146 decision.

## Source trail

- Perplexity research pass, 2026-06-13: football club accounting categories for a manager-game
  chart of accounts.
- IFRS/GAAP football-club accounting discussion and player-registration accounting:
  <https://www.ifrs-gaap.com/>
- Existing FMX source trail in
  [[../wage-and-transfer-fee-posting-contracts-2026-06-11]] for IAS 38 / IAS 19 practice and
  Manchester United / Juventus / Borussia Dortmund annual-report patterns.
- Existing FMX source trail in
  [[../insolvency-ledger-posting-contract-2026-06-12]] for football insolvency / creditor treatment.

## Notes for synthesis

FMX should not copy any single club's statutory statement layout. The useful real-world lesson is the
family split: player registrations and transfer balances are special football lines; ordinary
commercial, matchday, debt, wage and tax categories can stay coarse and game-readable.
