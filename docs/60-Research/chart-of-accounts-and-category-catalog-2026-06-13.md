---
title: "Chart of accounts and category catalog (FMX-150)"
status: current
tags: [research, synthesis, ledger, chart-of-accounts, category-code, accounting, economy, fmx-150]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-150
related:
  - [[raw-perplexity/raw-chart-of-accounts-game-ledger-2026-06-13]]
  - [[raw-perplexity/raw-football-club-accounting-families-2026-06-13]]
  - [[raw-perplexity/raw-sports-management-finance-ui-2026-06-13]]
  - [[raw-perplexity/raw-chart-of-accounts-versioning-2026-06-13]]
  - [[../10-Architecture/09-Decisions/ADR-0095-balanced-transfer-ledger-posting-invariant]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../10-Architecture/09-Decisions/ADR-0105-wage-and-transfer-fee-posting-contracts]]
  - [[../10-Architecture/09-Decisions/ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0106-chart-of-accounts-and-category-catalog]]
---

# Chart of accounts and category catalog (FMX-150)

## Scope

FMX-150 closes the concrete account-code gap left intentionally open by
[[../10-Architecture/09-Decisions/ADR-0095-balanced-transfer-ledger-posting-invariant|ADR-0095]]
LI-9 and by provisional account handles in
[[../10-Architecture/09-Decisions/ADR-0105-wage-and-transfer-fee-posting-contracts|ADR-0105]]
and [[../10-Architecture/09-Decisions/ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract|ADR-0101]].

This note preserves the research chain and the Nico-approved decision packet. The binding decision
home is [[../10-Architecture/09-Decisions/ADR-0106-chart-of-accounts-and-category-catalog|ADR-0106]].

## Current constraints

- ADR-0095 is accepted/binding: every ledger posting has at least two typed lines, sums to zero,
  uses integer minor units and carries an `accountCode` from a versioned chart of accounts.
- ADR-0095 already decided the two-level principle: a small fixed typed account set plus versioned
  `categoryCode` metadata for detailed business reasons. FMX-150 must not reopen double-entry or the
  two-level principle.
- ADR-0050 keeps Club Management as the sole ledger writer. Other contexts emit facts; they do not
  write finance tables.
- ADR-0105 names wage and transfer/amortisation posting events; ADR-0106 now replaces their
  provisional account handles with canonical account codes.
- ADR-0101 / FMX-146 names `InsolvencyCreditorWriteOffPosted`; ADR-0106 now supplies the concrete
  external-writeoff and owner-forgiveness accounts.
- The UI must keep Quick / Standard / Expert accounting readable from the same read models.

## Evidence synthesis

Perplexity research plus existing FMX source trails converge on one practical shape:

- Real accounting and football-club statements need the standard account families and special
  football lines for player registrations, transfer receivables/payables, wages, amortisation,
  disposal gains/losses and debt/restructuring.
- Sports-management games expose finance as budgets, category totals, projections and warnings,
  not as a journal-first workflow.
- Embedded/product ledgers should keep account codes stable and use metadata dimensions for
  product/game semantics.
- Append-only ledger catalogs should be additive: add codes, mark inactive, never reuse or renumber,
  and pin old saves to their original catalog version.

## Decision - Nico 2026-06-13

Nico approved the recommended FMX-150 packet:

1. **D1 = A:** semantic dotted account codes.
2. **D2 = A:** the 40-account medium chart below plus versioned `categoryCode` catalog.
3. **D3 = A:** Expert accounting as statements plus account/category drilldown and an audit drawer.

## Option record

### D1 - Account-code style

| Option | Shape | Pros | Cons | Recommendation |
|---|---|---|---|---|
| A. Semantic dotted codes | `asset.cash_operating`, `expense.player_wages` | Matches existing ADR-0105 handles; self-documenting in docs, tests and save fixtures; no extra lookup needed for humans | Less familiar to accountants than numeric ranges | **Recommended** |
| B. Numeric ranges | `1000`, `2100`, `5000` | Familiar classic CoA convention; easy ordering | Requires a separate name map in every design discussion; less game-readable | Acceptable if Nico wants accounting-style presentation |
| C. Hybrid | Stable semantic code plus numeric display order | Best display flexibility | More catalog fields; more governance overhead | Later display option, not necessary for v1 |

### D2 - Account catalog size

| Option | Shape | Pros | Cons | Recommendation |
|---|---|---|---|---|
| A. Medium fixed chart plus category catalog | 40 accounts below; detailed reasons in `categoryCode` | Covers all known posting families once; keeps balance sheet readable; follows ADR-0095's two-level decision | Requires category reporting queries | **Recommended** |
| B. Coarse chart | 20-25 accounts | Very simple for implementation and players | Hides transfer/retail/financing signals too aggressively; Expert mode becomes category-only | Too weak for FMX economy depth |
| C. Fine chart | 55-70 accounts | Accountant-like line detail | Duplicates category metadata; hard to version; worse for players | Over-modeled for a game ledger |

### D3 - Expert accounting surface

| Option | Shape | Pros | Cons | Recommendation |
|---|---|---|---|---|
| A. Statements plus drilldown/audit drawer | Expert shows statements, balance sheet/cash-flow style views, category/account drilldowns and provenance | Feels like a football manager, keeps audit available, aligns with genre precedent | Journal exists but is not the first surface | **Recommended** |
| B. Full journal first | Expert opens directly on double-entry journals | Maximum audit transparency | Feels like accounting software; steep learning curve | Good developer/admin view, not player default |
| C. Statements only | Expert hides journal detail entirely | Cleanest UI | Weak audit/debug value; less useful for economy tuning | Too shallow for FMX Expert mode |

## Proposed account catalog v1

`chartOfAccountsVersion = 1` contains these 40 account codes. Codes are
semantic identifiers, not display labels.

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

## Proposed category-catalog v1

`categoryCode` is the player-facing and tuning-facing dimension. It is versioned separately from the
account chart. The account stays coarse; the category records the exact business reason.

Minimum v1 category families:

- `matchday.*`: stewarding, private security, police contribution, medical, cleaning/waste, energy,
  temporary staff, officials, pitch recovery, insurance/compliance, damage reserve, sanction fine,
  sector closure, ghost match, away restriction, alcohol restriction, mitigation action.
- `catering.*`: revenue, COGS, labour, waste, stockout, refund.
- `merchandise.*`: revenue, COGS, markdown, write-down, returns, spike.
- `commercial.*`: sponsorship, royalty true-up, minimum guarantee shortfall, sponsor advance,
  make-good, fair-value adjustment.
- `cup.*`: prize receivable, prize cash, gate share, media facility fee, travel, security,
  sponsor bonus, neutral venue allocation.
- `financing.*`: drawdown, principal repayment, interest, covenant fee, sponsor advance, factoring,
  payment holiday, restructuring, owner support.
- `wage.*`: player wage, staff wage, tax/social, loan wage contribution, loan wage recharge.
- `transfer.*`: fee capitalisation, instalment payable, instalment receivable, loan fee,
  breach penalty, amortisation, disposal gain, disposal loss, write-off.
- `insolvency.*`: external creditor write-off, owner/related-party forgiveness, fire-sale disposal,
  administrator cost, wage-cap policy reference.
- `fan_event.*`: campaign cost, sponsor contribution, cancellation refund, make-good, away travel
  subsidy, choreo support, beverage reward, community ticket block.
- `investor.*`: entitlement cash grant, reversal/chargeback.

## Posting-family account map

This map is the FMX-150 acceptance checklist: every known posting family lands on an
account exactly once; detailed sub-family semantics live in `categoryCode`.

| Posting family | Debit side | Credit side | Category detail |
|---|---|---|---|
| Matchday revenue / gate share / hospitality | `asset.cash_operating` or `asset.receivable_trade` | `income.matchday` | `matchday.*`, `cup.gate_share` |
| Matchday operating costs | `expense.matchday_operations` | `asset.cash_operating` or `liability.trade_payables` | `matchday.stewarding`, `matchday.police_contribution`, etc. |
| Sector closures / ghost-match revenue impact | `expense.matchday_operations` or reduced `income.matchday` via reversal | `asset.cash_operating` / `asset.receivable_trade` reversal | `matchday.sector_closure`, `matchday.ghost_match` |
| Catering sales | `asset.cash_operating` or `asset.receivable_trade` | `income.catering` | `catering.revenue` |
| Catering COGS / waste / stockout | `expense.commercial_cogs` or `expense.commercial_operations` | `asset.inventory_catering`, `asset.cash_operating` or `liability.trade_payables` | `catering.cogs`, `catering.waste`, `catering.stockout`, `catering.labour` |
| Merchandise sales | `asset.cash_operating` or `asset.receivable_trade` | `income.merchandise` | `merchandise.revenue`, `merchandise.spike` |
| Merchandise COGS / markdown / write-down / returns | `expense.commercial_cogs` or `expense.commercial_operations` | `asset.inventory_merchandise`, `asset.cash_operating` or `liability.trade_payables` | `merchandise.cogs`, `merchandise.markdown`, `merchandise.write_down`, `merchandise.returns` |
| Sponsorship and commercial settlements | `asset.cash_operating`, `asset.receivable_trade` or `liability.deferred_revenue` | `income.sponsorship_commercial` | `commercial.sponsorship`, `commercial.royalty_true_up`, `commercial.guarantee_release` |
| Commercial guarantee shortfall / make-good | `expense.commercial_operations` | `asset.cash_operating`, `liability.trade_payables` or `liability.deferred_revenue` | `commercial.minimum_guarantee_shortfall`, `commercial.make_good` |
| Fan-event campaign costs/refunds/make-goods | `expense.fan_event_campaigns` | `asset.cash_operating`, `liability.trade_payables` or `liability.deferred_revenue` | `fan_event.*` |
| Fan-event sponsor contribution | `asset.cash_operating` or `asset.receivable_trade` | `income.sponsorship_commercial` | `fan_event.sponsor_contribution` |
| Competition prize receivable | `asset.receivable_competition` | `income.broadcast_prize` | `cup.prize_receivable` |
| Competition prize cash receipt | `asset.cash_operating` | `asset.receivable_competition` | `cup.prize_cash` |
| Cup media / sponsor / merchandise spike | `asset.cash_operating` or receivable account | `income.broadcast_prize`, `income.sponsorship_commercial` or `income.merchandise` | `cup.media_facility_fee`, `cup.sponsor_bonus`, `cup.merchandise_spike` |
| Cup travel/security/neutral venue costs | `expense.matchday_operations` | `asset.cash_operating` or `liability.trade_payables` | `cup.travel`, `cup.security`, `cup.neutral_venue` |
| Financing drawdown | `asset.cash_operating` | `liability.financing_debt` | `financing.drawdown` |
| Financing principal repayment | `liability.financing_debt` | `asset.cash_operating` | `financing.principal_repayment` |
| Financing interest / factoring discount / fees | `expense.financing_interest` | `asset.cash_operating` or `liability.trade_payables` | `financing.interest`, `financing.factoring`, `financing.covenant_fee` |
| Sponsor advance | `asset.cash_operating` | `liability.deferred_revenue` | `financing.sponsor_advance` |
| Owner support as equity | `asset.cash_operating` | `equity.owner_contribution` | `financing.owner_support_equity` |
| Owner support as loan | `asset.cash_operating` | `liability.financing_debt` | `financing.owner_support_loan` |
| Player wage block | `expense.player_wages` | `liability.wages_payable`, then `asset.cash_operating` on payment | `wage.player` |
| Staff wage block | `expense.staff_wages` | `liability.wages_payable`, then `asset.cash_operating` on payment | `wage.staff` |
| Payroll tax/social accrual | `expense.other_operations` | `liability.tax_social_payable` | `wage.tax_social` |
| Contract signing costs | `expense.contract_costs` | `liability.contract_costs_payable` or `asset.cash_operating` | `transfer.signing_bonus`, `transfer.agent_fee` |
| Transfer fee capitalised | `asset.player_registrations` | `liability.transfer_payables` | `transfer.fee_capitalisation` |
| Transfer instalment paid | `liability.transfer_payables` | `asset.cash_operating` | `transfer.instalment_payable` |
| Transfer instalment received | `asset.cash_operating` | `asset.receivable_transfer` | `transfer.instalment_receivable` |
| Registration amortisation | `expense.registration_amortisation` | `asset.player_registrations_accum_amortisation` | `transfer.amortisation` |
| Registration disposal gain | `asset.receivable_transfer` or `asset.cash_operating`; derecognise NBV through registration accounts | `income.registration_disposal_gains` | `transfer.disposal_gain` |
| Registration disposal loss / write-off | `expense.registration_disposal_losses_writeoffs` | `asset.player_registrations` / `asset.player_registrations_accum_amortisation` | `transfer.disposal_loss`, `transfer.write_off` |
| Loan wage contribution | `expense.loan_wage_contribution` | `asset.cash_operating` or `liability.trade_payables` | `wage.loan_contribution` |
| Loan wage recharge | `asset.cash_operating` or `asset.receivable_transfer` | `income.loan_wage_recharge` | `wage.loan_recharge` |
| Loan fee / breach penalty | payer: `expense.contract_costs` or `expense.other_operations`; payee: `income.transfer_loan_fees` | cash/receivable/payable | `transfer.loan_fee`, `transfer.breach_penalty` |
| External creditor write-off | `liability.financing_debt`, `liability.trade_payables`, `liability.transfer_payables` or `liability.wages_payable` | `income.debt_restructuring_gain` | `insolvency.external_creditor_writeoff` |
| Owner/related-party forgiveness | `liability.financing_debt` | `equity.owner_contribution` | `insolvency.owner_forgiveness_equity` |
| Investor cash grant | `asset.cash_operating` | `income.investor_cash_grants` | `investor.entitlement_cash_grant` |
| Investor reversal / chargeback | `income.investor_cash_grants` or `liability.trade_payables` | `asset.cash_operating` | `investor.reversal` |

## Versioning and replay rules

Accepted ADR-0106 rules:

- `chartOfAccountsVersion` and `categoryCatalogVersion` are explicit catalog versions.
- A posting pins the versions used by the posting policy, either on each line or on the posting
  envelope/provenance.
- Account codes are stable identifiers. They are never renumbered, reused or silently reinterpreted.
- Retiring an account means `inactiveFromVersion`, not deletion. Historical saves keep using it.
- Category codes are also stable within their catalog version. Category splits/merges create a new
  catalog version plus reporting mappings, not ledger rewrites.
- Display labels, ordering and reporting roll-ups may evolve through versioned reporting trees.
- Old saves replay with the original chart/category versions and can be displayed through compatibility
  maps if a later UI wants a newer tree.

## Decision recorded

[[../10-Architecture/09-Decisions/ADR-0106-chart-of-accounts-and-category-catalog|ADR-0106]]
is accepted/binding with D1-D3 = A/A/A. The accepted finance ADR references were updated to use the
canonical account codes and to point to ADR-0106 for future catalog governance.
