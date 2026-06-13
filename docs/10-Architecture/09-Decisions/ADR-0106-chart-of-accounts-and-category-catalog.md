---
title: ADR-0106 Chart of Accounts and Category Catalog
status: accepted
tags: [adr, architecture, economy, accounting, ledger, chart-of-accounts, category-code, club-management, fmx-150, accepted]
created: 2026-06-13
updated: 2026-06-13
type: adr
binding: true
amends: [[ADR-0050-club-economy-accounting-ledger]]
supersedes:
superseded_by:
related:
  - [[ADR-0050-club-economy-accounting-ledger]]
  - [[ADR-0095-balanced-transfer-ledger-posting-invariant]]
  - [[ADR-0105-wage-and-transfer-fee-posting-contracts]]
  - [[ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract]]
  - [[ADR-0058-club-economy-commercial-impact-boundary]]
  - [[../../50-Game-Design/GD-0008-finance-economy]]
  - [[../../60-Research/chart-of-accounts-and-category-catalog-2026-06-13]]
  - [[../../60-Research/raw-perplexity/raw-chart-of-accounts-game-ledger-2026-06-13]]
  - [[../../60-Research/raw-perplexity/raw-football-club-accounting-families-2026-06-13]]
  - [[../../60-Research/raw-perplexity/raw-sports-management-finance-ui-2026-06-13]]
  - [[../../60-Research/raw-perplexity/raw-chart-of-accounts-versioning-2026-06-13]]
---

# ADR-0106: Chart of Accounts and Category Catalog

## Status

accepted

> **Decided live 2026-06-13 (FMX-150).** Nico approved D1-D3 as recommended:
> semantic dotted account codes, a 40-account medium chart plus versioned
> `categoryCode` catalog, and Expert accounting as statements plus account/category
> drilldown and audit drawer. This ADR is binding and amends the finance ledger
> chain by replacing the provisional account handles in ADR-0105 and ADR-0101 with
> the catalog below.

## Date

- Drafted: 2026-06-13 (FMX-150)
- D1-D3 confirmed + binding: 2026-06-13 (FMX-150)

## Context

[[ADR-0095-balanced-transfer-ledger-posting-invariant|ADR-0095]] is accepted and binding:
every `FinanceLedgerEntryPosted` is a balanced double-entry posting with typed
`accountCode` lines, integer minor units and deterministic replay. It also decided the
granularity principle: a small fixed chart of accounts plus a separate versioned
`categoryCode` posting-metadata catalog.

Before FMX-150, the concrete chart was still missing:

- [[ADR-0105-wage-and-transfer-fee-posting-contracts|ADR-0105]] names wage, transfer,
  amortisation, disposal and loan posting events but marks its account handles provisional.
- [[ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract|ADR-0101]]
  names `InsolvencyCreditorWriteOffPosted`; before FMX-150 it left concrete external-writeoff vs
  owner-forgiveness accounts undefined.
- [[ADR-0050-club-economy-accounting-ledger|ADR-0050]] lists the broader finance posting
  families: matchday costs, catering/merchandise settlement, commercial contracts, fan-event
  campaigns, cup settlement, financing, investor grants and insolvency.

The chart must keep the player-facing economy readable while preserving auditability and
future replay. It must not turn the game ledger into a full ERP.

## Options considered

### D1 - Account-code style

| Option | Shape | Assessment |
|---|---|---|
| **A. Semantic dotted codes** | `asset.cash_operating`, `expense.player_wages` | **Recommended.** Matches existing ADR-0105 provisional handles, reads well in docs/tests/save fixtures and avoids translating numeric ranges during design review. |
| B. Numeric ranges | `1000`, `2100`, `5000` | Familiar accounting convention, but lower readability for game-domain contracts and requires a name catalog in every discussion. |
| C. Hybrid | Semantic code plus numeric display/order field | Useful later for UI ordering, but not needed as the identifier rule. |

### D2 - Chart size

| Option | Shape | Assessment |
|---|---|---|
| **A. Medium chart + category catalog** | 40 stable account codes plus versioned `categoryCode` | **Recommended.** Covers all known ADR-0050/0105/0101 posting families once while keeping detailed football/game reasons in categories. |
| B. Coarse chart | 20-25 accounts | Too shallow for Expert accounting, transfer/amortisation and financing/insolvency signals. |
| C. Fine chart | 55-70 accounts | Duplicates category metadata and makes later catalog evolution harder. |

### D3 - Expert accounting surface

| Option | Shape | Assessment |
|---|---|---|
| **A. Statements plus drilldown/audit drawer** | Expert exposes statements, balance sheet/cash-flow style views, category/account drilldowns and posting provenance | **Recommended.** Matches sports-management precedent: players manage budgets and categories; journal detail exists for audit but is not the default screen. |
| B. Full journal first | Expert opens on double-entry postings | Useful for internal QA/admin, but too accounting-software-like for a football manager UI. |
| C. Statements only | No journal/provenance drilldown | Clean, but too weak for audit, balancing and economy tuning. |

## Decision

Nico approved the recommended packet live on 2026-06-13:

- **D1 = A:** account identifiers are semantic dotted codes.
- **D2 = A:** `chartOfAccountsVersion = 1` contains the 40 account codes below; detailed football
  semantics live in a separate versioned `categoryCode` catalog.
- **D3 = A:** Quick / Standard / Expert accounting all derive from the same ledger/read models;
  Expert is statements plus category/account drilldown and an audit/provenance drawer, not a
  journal-first player UI.

## `chartOfAccountsVersion = 1`

| Type | Account code | Purpose |
|---|---|---|
| asset | `asset.cash_operating` | Cash and bank balance available to the club |
| asset | `asset.receivable_trade` | Ticketing, sponsor, commercial and other trade receivables |
| asset | `asset.receivable_transfer` | Amounts due from football clubs for transfers/loans |
| asset | `asset.receivable_competition` | Competition, broadcast, prize and cup receivables |
| asset | `asset.inventory_merchandise` | Merchandise stock before sale/write-down |
| asset | `asset.inventory_catering` | Catering stock before sale/waste |
| asset | `asset.player_registrations` | Capitalised player-registration cost per ADR-0105 |
| asset | `asset.player_registrations_accum_amortisation` | Contra asset for registration amortisation |
| liability | `liability.trade_payables` | Supplier/commercial/payables not covered by specific liability accounts |
| liability | `liability.contract_costs_payable` | Signing-bonus, agent-fee and contract-cost payables |
| liability | `liability.wages_payable` | Player/staff wage accruals and unpaid wage liabilities |
| liability | `liability.tax_social_payable` | Payroll tax, social charges and tax liabilities |
| liability | `liability.transfer_payables` | Amounts due to football clubs for transfers/loans |
| liability | `liability.deferred_revenue` | Sponsor advances, season-ticket/deferred commercial revenue and make-good liabilities |
| liability | `liability.financing_debt` | Overdrafts, bank loans, owner loans and restructured debt principal |
| equity | `equity.owner_contribution` | Owner support, related-party forgiveness and equity-like support |
| equity | `equity.retained_earnings` | Prior-season accumulated result |
| equity | `equity.current_season_result` | Current-season close-out / retained-result bridge |
| income | `income.matchday` | Ticketing, gate share, hospitality and matchday revenue |
| income | `income.broadcast_prize` | Broadcast distributions, prize money and competition media income |
| income | `income.sponsorship_commercial` | Sponsorship, commercial contract and sponsor contribution income |
| income | `income.merchandise` | Merchandise sales income |
| income | `income.catering` | Catering sales income |
| income | `income.registration_disposal_gains` | Profit on disposal of player registrations |
| income | `income.loan_wage_recharge` | Wage recharge income from loan agreements |
| income | `income.transfer_loan_fees` | Loan-fee and transfer/breach-penalty income not classified as disposal gain |
| income | `income.debt_restructuring_gain` | External creditor haircut / debt forgiveness gain |
| income | `income.investor_cash_grants` | Clean singleplayer Investor entitlement cash grants |
| expense | `expense.player_wages` | Player wage cost |
| expense | `expense.staff_wages` | Staff and non-player wage cost |
| expense | `expense.contract_costs` | Signing bonuses, agent fees and contract costs expensed under ADR-0105 D6 |
| expense | `expense.loan_wage_contribution` | Loan wage contribution expense |
| expense | `expense.registration_amortisation` | Periodic amortisation of player registrations |
| expense | `expense.registration_disposal_losses_writeoffs` | Disposal losses, impairment and write-off of registrations |
| expense | `expense.matchday_operations` | Matchday operations, safety, travel, security, pitch and sanction costs |
| expense | `expense.commercial_cogs` | Catering/merchandise cost of goods sold and stock consumption |
| expense | `expense.commercial_operations` | Commercial labour, waste, markdown, royalty/MAG and contract shortfall costs |
| expense | `expense.fan_event_campaigns` | Fan-service campaign costs, refunds and make-goods |
| expense | `expense.financing_interest` | Interest, factoring discount and financing fees |
| expense | `expense.other_operations` | Tax, admin and miscellaneous operating expenses not requiring a dedicated account |

## `categoryCatalogVersion = 1`

The category catalog is a separate versioned dimension on postings. It drives P&L detail,
economy tuning, dashboards and Expert drilldown. It does not define balance-sheet identity.

Minimum family prefixes:

- `matchday.*`
- `catering.*`
- `merchandise.*`
- `commercial.*`
- `cup.*`
- `financing.*`
- `wage.*`
- `transfer.*`
- `insolvency.*`
- `fan_event.*`
- `investor.*`

Concrete leaf codes are listed in
[[../../60-Research/chart-of-accounts-and-category-catalog-2026-06-13|the FMX-150 synthesis]].

## Posting-family mapping

The following account families are canonical:

- Matchday revenue -> `income.matchday`; matchday operating/security/travel/sanction costs ->
  `expense.matchday_operations`.
- Catering revenue -> `income.catering`; merchandise revenue -> `income.merchandise`;
  stock/COGS/waste/markdown/write-down -> `expense.commercial_cogs` or
  `expense.commercial_operations` with inventory accounts as the asset side.
- Sponsorship/commercial income -> `income.sponsorship_commercial`; commercial make-goods and
  guarantee shortfalls -> `expense.commercial_operations`; advances/deferred obligations ->
  `liability.deferred_revenue`.
- Fan-event campaign costs/refunds/make-goods -> `expense.fan_event_campaigns`; sponsor
  contributions -> `income.sponsorship_commercial`.
- Cup/competition receivables -> `asset.receivable_competition`; prize/media income ->
  `income.broadcast_prize`; cup travel/security -> `expense.matchday_operations`.
- Financing drawdowns/principal -> `liability.financing_debt`; interest/factoring fees ->
  `expense.financing_interest`; owner equity support -> `equity.owner_contribution`.
- ADR-0105 wage/transfer postings use the exact accounts in the catalog:
  `expense.player_wages`, `expense.staff_wages`, `liability.wages_payable`,
  `expense.contract_costs`, `liability.contract_costs_payable`,
  `asset.player_registrations`, `asset.player_registrations_accum_amortisation`,
  `liability.transfer_payables`, `asset.receivable_transfer`,
  `expense.registration_amortisation`, `income.registration_disposal_gains`,
  `expense.registration_disposal_losses_writeoffs`, `expense.loan_wage_contribution`,
  `income.loan_wage_recharge` and `income.transfer_loan_fees`.
- ADR-0101 insolvency creditor write-offs debit the liability account being extinguished and credit
  `income.debt_restructuring_gain` for external creditor haircuts or `equity.owner_contribution`
  for owner/related-party forgiveness.
- Investor entitlement cash grants post to `income.investor_cash_grants` with `investor.*`
  categories and no financing/debt semantics.

The full one-row-per-family acceptance map is preserved in the synthesis note to keep this ADR
readable.

## Versioning invariants

| # | Invariant |
|---|---|
| CAA-1 | `chartOfAccountsVersion` and `categoryCatalogVersion` are explicit catalog versions used by posting policy and replay. |
| CAA-2 | Account codes are stable identifiers. Existing codes are never renumbered, reused or silently reinterpreted. |
| CAA-3 | Chart evolution is additive. Retiring an account marks it inactive from a version; it is not deleted. |
| CAA-4 | Category evolution is separately versioned. Splits/merges create a new category catalog version plus reporting mappings, not ledger rewrites. |
| CAA-5 | Old saves replay under the chart/category versions captured by their postings or posting-policy provenance. |
| CAA-6 | Display labels, ordering and reporting roll-ups may change through versioned reporting trees without changing posted account/category codes. |
| CAA-7 | Quick, Standard and Expert accounting read models derive from the same ledger; UI depth changes projection grouping, not authoritative state. |

## Consequences

Positive:

- Every known ADR-0050 / ADR-0105 / ADR-0101 posting family has a concrete typed account home.
- The chart stays game-readable and proportional while preserving double-entry auditability.
- Category evolution can add football-specific detail without rewriting saves or exploding accounts.
- Quick / Standard / Expert finance modes can share the same authoritative ledger.

Costs / constraints:

- Reporting must group by both `accountCode` and `categoryCode`; account-only P&L is intentionally
  too coarse for Expert.
- Future account additions require catalog governance and replay tests.
- Account-code display names must be localized separately; the semantic code is an identifier, not
  copy text.

## Related docs

- [[../../60-Research/chart-of-accounts-and-category-catalog-2026-06-13]]
- [[ADR-0095-balanced-transfer-ledger-posting-invariant]]
- [[ADR-0050-club-economy-accounting-ledger]]
- [[ADR-0105-wage-and-transfer-fee-posting-contracts]]
- [[ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract]]
