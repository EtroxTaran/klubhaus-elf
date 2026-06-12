---
title: Club Economy Accounting Ledger - Draft Contracts
status: draft
tags: [implementation, economy, accounting, club-management, commercial, contracts, financing, debt, fmx-13, fmx-41, fmx-49]
created: 2026-05-27
updated: 2026-06-12
type: implementation
binding: false
linear: FMX-13
related:
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../10-Architecture/09-Decisions/ADR-0079-dynasty-board-ownership-and-bankruptcy]]
  - [[../10-Architecture/09-Decisions/ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0105-wage-and-transfer-fee-posting-contracts]]
  - [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - [[../50-Game-Design/GD-0008-finance-economy]]
  - [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../50-Game-Design/economy-system]]
  - [[../60-Research/club-economy-impact-map-and-commercial-contracts-2026-05-28]]
  - [[../60-Research/club-financing-tools-2026-06-01]]
  - [[../60-Research/insolvency-ledger-posting-contract-2026-06-12]]
  - [[../20-Features/feature-club-economy-mvp-pillar]]
  - [[club-economy-commercial-contracts]]
  - [[../10-Architecture/bounded-context-map]]
---

# Club Economy Accounting Ledger - Draft Contracts

## Purpose

Define the implementation surface implied by FMX-13 before code exists. This is
a draft contract note; it must not be treated as an accepted implementation spec
until ADR-0050 and the finance GDDR are ratified.

## Ownership

Club Management owns:

- finance ledger;
- accounting projections;
- budgets and board finance policy;
- in-world financing facilities and actions;
- country economy profile application;
- insolvency crisis state.

Other bounded contexts own causal facts and interact through public contracts
only:

- CommercialPortfolio owns commercial contracts, ticketing/campaign policy,
  commercial settlement, receivable schedules, commercial advance eligibility,
  contract-liability and fair-value facts;
- Stadium Operations owns stadium/venue capacity, throughput, facility and
  operating facts;
- Audience & Atmosphere owns fan demand, mood, ticketing trust, atmosphere and
  supporter-risk facts;
- Regulations & Compliance owns the rule catalog, licence gates and
  jurisdictional finance-control profiles;
- Transfer owns player-transfer payment schedules and market outcomes.

No context may insert ledger rows directly or query Club-owned finance tables.

## Ledger entry shape

Minimum draft fields:

| Field | Meaning |
|---|---|
| `ledgerEntryId` | UUIDv7 entry identity. |
| `clubId` | Club aggregate. |
| `saveId` | Per-save scope. |
| `weekId` | League week / accounting period. |
| `sourceContext` | Club, CommercialPortfolio, Stadium Operations, Match, Transfer, League, Squad, Training, Regulations or System. |
| `sourceEventId` | Domain event that caused the entry. |
| `accountCode` | Chart-of-accounts code from the country/profile pack. |
| `entryKind` | cash, accrual, liability, receivable, amortisation, reserve or equity. |
| `amountMinor` | Integer minor-unit amount; signed. |
| `currencyProfile` | Country/profile currency symbol and minor-unit rules. |
| `recognitionDate` | When the accounting effect belongs. |
| `cashDate` | When cash moves, if any. |
| `metadata` | Typed JSON payload for source-specific details. |

## Economy week flow

1. League Orchestration opens an economy week.
2. Club Management collects due scheduled items: wages, debt service,
   maintenance, instalments, sponsor payments, levies and recurring revenue.
3. Source events posted during the week add event-based entries: matchday,
   transfers, cup/bonus payments, facility commitments, fines.
4. Club Management updates projections and evaluates thresholds.
5. Threshold breaches emit events for board pressure, inbox and crisis UI.

## Cross-context inputs

| Source context | Input facts |
|---|---|
| League | Week advanced, season boundary, promotion/relegation, prize schedule. |
| Match | Home match completed, attendance, risk/sanction result, matchday cost, final matchday settlement inputs. |
| Transfer | Contract committed, instalment due, sell-on due, wage subsidy, agent fee. |
| Squad & Player | Wage contract active, bonus triggered, contract ended. |
| Training | Camp booked, academy operating cost, medicine facility effect. |
| Audience & Atmosphere | Demand forecast, season-ticket renewal, spend propensity, fan-event effects, mood and trust signals. |
| Rivalry System | Derby/top-match commercial signal and risk band. |
| Stadium Operations | Stadium capacity, throughput, ownership model, facility cost and venue-operating facts. |
| CommercialPortfolio | Commercial settlement events, contract cash/recognition schedules, receivable schedules, sponsor/media advance eligibility, commercial contract-liability facts, commercial fair-value facts and Investor entitlement-policy approvals. |
| Regulations & Compliance | Competition revenue profile, licence checks, commercial constraints, finance-control thresholds and overdue-payable/debt-control profiles. |
| Platform / payment boundary | Singleplayer Investor payment and entitlement facts. |
| Notification | Reads finance events only; it does not create finance facts. |

FMX-41 adds detailed commercial contracts in
[[club-economy-commercial-contracts]]. FMX-49 adds in-world financing tools.
The ledger remains the accounting truth: CommercialPortfolio emits settlement
and eligibility facts, while Club Management owns financing facilities because
they alter liquidity, debt service, covenants, board pressure and insolvency.

## Financing contracts (FMX-49)

`FinancingFacility` is the Club-owned register entry for all in-world liquidity
tools. Sponsor/media advances and receivable factoring use CommercialPortfolio
facts for contract eligibility and fair-value evidence, but the liquidity action
and ledger posting stay in Club Management.

| Field | Meaning |
|---|---|
| `facilityId` | UUIDv7 identity. |
| `clubId` | Club aggregate. |
| `facilityKind` | overdraft, creditLine, bankLoan, sponsorAdvance, mediaAdvance, receivableFactoring, restructuring, shareholderLoan, ownerGrant or emergencySaleMandate. |
| `lifecycleState` | offered, active, drawn, amortising, covenantBreach, restructured, repaid, expired or cancelled. |
| `counterpartyKind` | bank, sponsor, mediaDistributor, factor, board, shareholder or internalMandate. |
| `approvedLimitMinor` | Maximum committed funding. |
| `outstandingPrincipalMinor` | Principal currently owed; zero for non-debt grants and emergency-sale mandates. |
| `undrawnLimitMinor` | Remaining drawable amount for overdraft/credit-line style facilities. |
| `interestBandBps` | Profile-driven interest band, not final balance constant. |
| `feeMinor` | Arrangement, factoring discount or restructuring fee. |
| `maturityWeekId` | Contract maturity or review week. |
| `repaymentSchedule` | Weekly/monthly/seasonal repayment, bullet or amortising schedule. |
| `drawdownPolicy` | Manual draw, automatic overdraft, board-approved or emergency-only. |
| `securedAgainst` | None, commercialReceivable, mediaReceivable, transferReceivable, stadiumAsset or boardGuarantee. |
| `recoursePolicy` | Full recourse, limited recourse or true-sale style receivable sale. |
| `covenantProfile` | Liquidity, wage/debt ratio, overdue-payable or licence-gate covenant. |
| `classification` | Debt, working-capital, contract-advance, receivable-sale, owner-support or sale-mandate. |
| `regulatoryTreatment` | Country/profile rule treatment and competition overlay. |
| `accountingPolicy` | Liability, contract liability, derecognised receivable, retained-risk receivable, equity/reserve or disclosure-only. |
| `provenance` | Source facts, research note, profile version and approval trace. |

Additional Club-owned finance surfaces:

| Surface | Purpose |
|---|---|
| `CashflowRunwayForecast` | 4/13/52-week forecast with starting cash, committed inflows/outflows, debt service, undrawn facilities, covenant/licence warnings and scenario tier. |
| `OverduePayablesAging` | Ageing by wages, tax, transfer, commercial, supplier and debt buckets; drives licence/compliance triggers. |
| `DebtServiceSchedule` | Principal, interest, fees, maturity and restructuring/payment-holiday effects. |
| `CovenantStatusBoard` | Profile-specific finance-control and lender covenant status. |
| `EmergencySaleMandate` | Board-mandated cash target, asset pool, sale window, sporting-cost warning and mandate state. |
| `FinancingOptionBoard` | Quick/Standard/Expert financing choices with cost, runway, compliance and fan/board-risk trade-offs. |

Draft commands:

- `RequestFinancingOption`
- `OpenFinancingFacility`
- `DrawFinancingFacility`
- `AcceptSponsorAdvance`
- `FactorReceivable`
- `RequestDebtRestructuring`
- `AcceptOwnerSupport`
- `IssueEmergencySaleMandate`

Draft events:

- `FinancingFacilityOpened`
- `FinancingDrawdownPosted`
- `FinancingInterestAccrued`
- `FinancingRepaymentScheduled`
- `FinancingRepaymentPosted`
- `FinancingCovenantBreached`
- `SponsorAdvanceAccepted`
- `MediaAdvanceAccepted` (future hook unless Nico promotes media advances)
- `ReceivableFactored`
- `DebtRestructuringAgreed`
- `PaymentHolidayGranted`
- `OwnerSupportGranted`
- `EmergencySaleMandateIssued`
- `OverduePayableAged`
- `FinancialHealthStateChanged`

## Read models

| Read model | Consumer |
|---|---|
| `ClubEconomySnapshot` | Home dashboard, Quick tier. |
| `WeeklyCashflowStatement` | Finance screen, Standard tier. |
| `AccountingStatement` | Expert tier. |
| `LiabilitySchedule` | Transfer and finance planning. |
| `BudgetEnvelope` | Transfer, squad and board UI. |
| `InsolvencyCrisisState` | Roguelite economy-crisis UI. |
| `LeagueEconomyProfile` | Setup, balancing and country profile inspector. |
| `CommercialForecastSnapshot` | Quick/Standard commercial dashboard. |
| `CommercialContractPortfolio` | Sponsorship, catering and merchandise contract board. |
| `MatchdayCommercialSettlement` | Per-fixture ticket/catering/merch/security breakdown. |
| `InvestorGrantAudit` | Singleplayer entitlement and ledger provenance. |
| `FinancingFacilityRegister` | Active facilities, limits, principal, fees, maturity and security. |
| `CashflowRunwayForecast` | Quick/Standard/Expert runway, warning and scenario surface. |
| `OverduePayablesAging` | Ageing buckets for wages, tax, transfer, supplier, commercial and debt obligations. |
| `FinancingOptionBoard` | Available liquidity actions and their cost/risk trade-offs. |
| `DebtServiceSchedule` | Principal, interest, fees, maturities and restructuring effects. |
| `CovenantStatusBoard` | Lender, board and regulation-triggered finance-control state. |

## Staged insolvency state

FMX-146 replaces the old finance-only draft labels with the shared ADR-0079 /
ADR-0101 `InsolvencyCaseStage` enum. Club Management still owns the ledger-facing
view, but it does not own a separate insolvency FSM.

| State | Meaning |
|---|---|
| `stable` | Solvent; no active distress. |
| `stressed` | Warning/budget stress: runway or ratios deteriorating. |
| `cash_flow_crisis` | Liquidity failure, late payments or arrears risk. |
| `under_embargo` | Registration/budget controls active. |
| `administration` | Administrator or equivalent crisis-control state: points deduction, embargo, wage-cap policy and fire-sale authority. |
| `rescued` | Rescue/restructuring complete; restrictions or reputation effects may remain. |
| `liquidated` | Reserved post-MVP terminal hook; not an MVP ledger stage. |

The state machine is deterministic and data-driven by country/profile thresholds.

Legacy labels map as read-model/UI aliases only: `healthy → stable`, `watch →
stressed`, `overdraft → stressed | cash_flow_crisis` depending on arrears,
`freeze → under_embargo`, `arrears → cash_flow_crisis`, `licence_review →
under_embargo`, `recovery → rescued`, and `run_end → reserved control-loss/run
outcome`.

FMX-146 ledger mapping: `InsolvencyStageChanged`, `AdministrationEntered`,
points deductions, embargoes, `InsolvencyWageCapPolicySet` and
`AdministratorFireSaleOpened` do not post ledger entries by themselves. Wage-cap
policy constrains future ADR-0105 wage blocks; completed fire sales reuse ADR-0105
registration disposal/write-off postings; creditor haircut/forgiveness uses
ADR-0050 `InsolvencyCreditorWriteOffPosted`.

## Balance evidence needed before ratification

- 50-season soak per country profile and world seed class.
- Median runway, wage ratio, debt ratio and insolvency-stage frequency.
- Promotion/relegation shock tests.
- Transfer-instalment and wage-inflation long-save tests.
- First-run tutorial test: player can explain why cash changed this week.
- Commercial sensitivity tests for season-ticket share, top-match surcharge,
  catering/merch contract models, cup progression and fan-service campaigns.
- Investor grant idempotency and SP-only isolation tests.
- Financing tests for overdraft drawdown, bank-loan repayment, sponsor advance
  cash-vs-recognition, receivable factoring derecognition/retained-risk branch,
  restructuring/payment-holiday recovery and owner-support Investor separation.
- Country/profile compliance tests for overdue payables, covenant breaches,
  transfer/registration restrictions, wage/transfer budget caps, points/sporting
  sanctions, licence denial and competition exclusion.

## Related

- [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
- [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
- [[../60-Research/club-financing-tools-2026-06-01]]
- [[../50-Game-Design/GD-0008-finance-economy]]
- [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
- [[../50-Game-Design/economy-system]]
- [[../20-Features/feature-club-economy-mvp-pillar]]
- [[club-economy-commercial-contracts]]
