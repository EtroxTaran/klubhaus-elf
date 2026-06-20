---
title: Club Management module
status: draft
tags: [architecture, module, club-management, economy, finance, accounting, board, insolvency]
context: club-management-economy
created: 2026-06-20
updated: 2026-06-20
type: module
binding: false
related: [[../05-Building-Blocks]], [[../bounded-context-map]], [[../09-Decisions/ADR-0050-club-economy-accounting-ledger]], [[../09-Decisions/ADR-0061-club-management-sub-aggregate-audit]], [[../09-Decisions/ADR-0079-dynasty-board-ownership-and-bankruptcy]], [[../09-Decisions/ADR-0105-wage-and-transfer-fee-posting-contracts]], [[../09-Decisions/ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract]], [[../09-Decisions/ADR-0106-chart-of-accounts-and-category-catalog]]
---

# Club Management Boundary

## Purpose

Sole writer of the per-club accounting ledger: posts append-only finance facts
(balanced double-entry per ADR-0095) and derives all accounting projections,
budget envelopes, board pressure and insolvency-stage state from that ledger
plus Club-owned policy tables.

## Owns

- **Finance ledger** — append-only domain facts; sole writer. No other context
  writes finance tables (ADR-0050).
- **Accounting projections** — cashflow, P&L, balance-sheet-like summaries,
  amortisation schedules, liabilities, budget pots and compliance ratios are all
  derived from the ledger, never stored as primary truth.
- **Budget envelopes** and budget policy.
- **Board pressure** and the ledger-facing view of the shared
  `InsolvencyCaseStage` (ADR-0050 amended by ADR-0101).
- **In-world financing facilities** — drawdowns, debt service, covenant status,
  overdue-payables ageing, owner support, emergency-sale mandates (FMX-49).
- **Chart of accounts + category catalog** — `chartOfAccountsVersion`,
  `categoryCatalogVersion`, additive-only no-renumbering (ADR-0106).
- **`StadiumOperations` named Aggregate** (ADR-0061 Option B) — matchday FSM
  (`MatchdayTimeline`), `FacilityCondition` decay sub-FSM, `VenueEventCalendar`,
  `SeatClassInventory`, `HospitalityInventory`. (Revenue accounting and ticketing
  settlement are NOT here — owned by CommercialPortfolio.)
- **Board & Ownership sub-aggregate set** (ADR-0079, no new BC) —
  `BoardRelationship` (deterministic expectation ladder + confidence + 2-phase
  sacking), `OwnerProfile` + `OwnershipTransition` (takeover FSM),
  `InsolvencyCase` (bankruptcy/administration FSM).

## Public contract

Faithful to the ADR-0050 / ADR-0061 / ADR-0079 / ADR-0105 contract lists (drafts).

### Commands

- Ledger / economy: `PostFinanceLedgerEntry`, `AdvanceClubEconomyWeek`,
  `SetBudgetPolicy`.
- Financing: `RequestFinancingOption`, `OpenFinancingFacility`,
  `DrawFinancingFacility`, `AcceptSponsorAdvance`, `FactorReceivable`,
  `RequestDebtRestructuring`, `AcceptOwnerSupport`, `IssueEmergencySaleMandate`,
  `AcceptSponsorContract`, `ScheduleFacilityProject`, `RequestCrisisAction`.
- StadiumOperations (ADR-0061): `ScheduleMatchdayTimeline`,
  `AdvanceMatchdayTimeline`, `TriggerMatchdayEvent`, `BookVenueEvent`,
  `CompleteVenueEvent`, `ScheduleMaintenanceProject`, `CompleteMaintenanceProject`,
  `RebalanceSeatClassInventory`, `RecordPitchCondition`,
  `RegisterFacilityComplianceCheck`.
- Board & Ownership (ADR-0079, commands/queries): `EvaluateBoardSeason`,
  `OpenBoardConfidenceMeeting`, `ResolveOwnershipTransition`, `RunInsolvencyAudit`.

### Domain events

- Ledger core: `FinanceLedgerEntryPosted`, `EconomyWeekAdvanced`,
  `BudgetThresholdBreached`, `LeagueLicenceFinancialCheckFailed`,
  `FinancialHealthStateChanged`.
- Wage / transfer posting (ADR-0105): `PlayerWageBlockPosted`,
  `StaffWageBlockPosted`, `ContractSigningCostPosted`, `TransferFeeCapitalised`,
  `TransferInstalmentSettled`, `RegistrationAmortisationPosted`,
  `RegistrationDisposalSettled`, `RegistrationWriteOffPosted`,
  `RegistrationAmortisationRescheduled` (non-posting).
- Financing (FMX-49): `FinancingFacilityOpened`, `FinancingDrawdownPosted`,
  `FinancingInterestAccrued`, `FinancingRepaymentScheduled`,
  `FinancingRepaymentPosted`, `FinancingCovenantBreached`, `SponsorAdvanceAccepted`,
  `MediaAdvanceAccepted`, `ReceivableFactored`, `DebtRestructuringAgreed`,
  `PaymentHolidayGranted`, `OwnerSupportGranted`, `EmergencySaleMandateIssued`,
  `OverduePayableAged`.
- Cup / competition (FMX-45): `CompetitionPrizeReceivableRecorded`,
  `CompetitionPrizeCashReceived`, `CupGateShareSettled`, `CupMediaFacilityFeeSettled`,
  `CupTravelCostPosted`, `CupSecurityCostPosted`, `CupSponsorBonusTriggered`,
  `CupMerchandiseSpikePosted`, `CupNeutralVenueAllocationSettled`, `CupForecastUpdated`,
  `CupEliminationForecastShockRecorded`.
- Matchday OPEX (FMX-46): `MatchdayOperatingCostForecasted`,
  `MatchdayStewardingCostPosted`, `MatchdaySecurityCostPosted`,
  `MatchdayPoliceContributionPosted`, `MatchdayMedicalEmergencyCostPosted`,
  `MatchdayCleaningWasteCostPosted`, `MatchdayEnergyCostPosted`,
  `MatchdayTemporaryStaffCostPosted`, `MatchdayOfficialsCostPosted`,
  `PitchRecoveryCostPosted`, `MatchdayInsuranceComplianceCostAllocated`,
  `MatchdayDamageReserveAdjusted`, `MatchdaySanctionFinePosted`,
  `SectorClosureRevenueImpactRecorded`, `GhostMatchSettlementRecorded`,
  `AwayFanRestrictionApplied`, `AlcoholRestrictionApplied`, `RiskTierReclassified`,
  `MitigationActionSettled`.
- Catering / merchandise (FMX-47, posted on CommercialPortfolio settlement facts):
  `MatchdayCateringSettled`, `CateringStockoutRecorded`, `CateringWastePosted`,
  `MerchandiseStockPlanCommitted`, `MerchandiseSalesSettled`,
  `MerchandiseMarkdownApplied`, `MerchandiseStockWrittenDown`,
  `MerchandiseReturnsSettled`, `CommercialRoyaltyTrueUpRecognised`,
  `CommercialGuaranteeShortfallRecognised`.
- Fan-service (FMX-48): `FanEventCampaignScheduled`, `FanEventCampaignCostCommitted`,
  `FanEventSponsorContributionRecognised`, `FanEventCampaignCancelled`,
  `FanEventMakeGoodGranted`, `FanEventCampaignSettled`, `FanEventLowUptakeRecorded`,
  `FanEventSegmentEffectPublished` (public fan-effect fact, not a ledger entry),
  `AwayTravelSubsidySettled`, `ChoreoSupportSettled`, `BeverageRewardCampaignSettled`,
  `CommunityTicketBlockSettled`, `FanEventCooldownApplied`.
- Commercial settlement posting (consumed-then-posted): `MatchdayCommercialSettlementPosted`,
  `InvestorCashGrantPosted`, `InvestorEntitlementCashReversed` (FMX-50).
- Insolvency posting (FMX-146): `InsolvencyStageChanged`,
  `InsolvencyCreditorWriteOffPosted`.
- StadiumOperations (ADR-0061): `MatchdayTimelineScheduled`, `MatchdayTimelineAdvanced`,
  `MatchdayEventTriggered`, `VenueEventBooked`, `VenueEventCompleted`,
  `MaintenanceProjectScheduled`, `MaintenanceProjectCompleted`,
  `SeatClassInventoryRebalanced`, `PitchConditionChanged`, `FacilityComplianceChecked`,
  `StadiumCommercialSnapshotPublished`.
- Board & Ownership (ADR-0079): `BoardExpectationSet`, `BoardConfidenceChanged`,
  `BoardOverrideObjectiveSet`, `ManagerSacked`, `OwnerProfileAssigned`,
  `OwnershipTransitionTriggered`, `OwnershipTransitionResolved`,
  `OwnerExpectationResetApplied`, `AdministrationEntered`, `InsolvencyWageCapPolicySet`,
  `AdministratorFireSaleOpened`, `ClubRescued`, `ManagerAbandonedClub`. Reserved
  (post-MVP, named only): `ClubLiquidated`, `PhoenixClubFounded`, `CvaProposed`,
  `CvaAccepted`. (Note: `AdministrationEntered`, points deductions, embargoes, wage
  caps and `AdministratorFireSaleOpened` are state/policy facts, not ledger postings.)

### Read models / queries

- Finance (ADR-0050): `ClubEconomySnapshot`, `WeeklyCashflowStatement`,
  `AccountingStatement`, `LiabilitySchedule`, `BudgetEnvelope`,
  `InsolvencyCrisisState`, `LeagueEconomyProfile`, `CommercialForecastSnapshot`,
  `CommercialContractPortfolio`, `MatchdayCommercialSettlement`,
  `MatchdayOperatingCostSettlement`, `CupRunRevenueForecast`, `CateringOperationsBoard`,
  `MerchandiseInventoryBoard`, `FanEventCampaignBoard`, `FinancingFacilityRegister`,
  `CashflowRunwayForecast`, `OverduePayablesAging`, `FinancingOptionBoard`,
  `DebtServiceSchedule`, `CovenantStatusBoard`.
- StadiumOperations (ADR-0061): `StadiumCommercialSnapshot`, `StadiumCapacitySnapshot`,
  `MatchdayTimelineBoard`, `FacilityComplianceSnapshot`, `VenueEventCalendarBoard`,
  `PitchQualitySnapshot`, `HospitalityInventorySnapshot`.
- Board & Ownership (ADR-0079): `BoardRelationshipBoard`, `OwnerProfileSnapshot`,
  `InsolvencyCaseStatus`.

## Storage ownership

- All state lives in Club Management's slice of the per-save PostgreSQL schema
  `save_<uuidv7hex>` (ADR-0027); Drizzle is the source of truth for tables.
- No shared tables, no cross-context FKs, no query-builder/raw-SQL joins to
  tables owned by another context (ADR-0121). Other contexts never write finance
  tables; they emit/request facts through public commands/events.
- Domain events leave via the ADR-0028 transactional outbox.
- `InsolvencyCaseStage` is a shared enum owned by ADR-0079/GD-0030; Club
  Management owns only the ledger-facing postings and the ledger view of it.

## Consumers / Producers

**Consumes facts from** (via Customer-Supplier + ACL; posts the resulting ledger
entries — only Club Management writes finance):

- **CommercialPortfolio** — `MatchdayCommercialSettlementPosted`,
  `CommercialContractActivated`, `InvestorCashGrantPosted`, `DeferredRevenueRecognised`,
  `RefundLiabilityRecognised` (and catering/merch/fan-event settlement facts).
- **Staff Operations** — wage events (`StaffWagePosted` + `ContractFinancialIntent`
  ACLs feeding `StaffWageBlockPosted`).
- **Transfer** — transfer-fee / instalment / amortisation facts (incl.
  `LoanFinancialIntent`) feeding the ADR-0105 Transfer→Ledger ACL.
- **Stadium Operations** facility-cost + matchday OPEX facts; **Match**, **League
  Orchestration** competition/result facts; **Regulations & Compliance**
  `EffectiveRuleSet` / licence checks; **AI World Simulation**
  `GiantCollapseTriggered` / `RisingRivalTriggered` (ownership-transition triggers).

**Produces facts consumed by:**

- **CommercialPortfolio** + **Stadium Operations** — `EconomyWeekAdvanced` (cost
  calculation triggers).
- **Manager & Legacy** — economy summary + `ManagerSacked` / `BoardConfidenceChanged`
  / run-end outcomes (run analysis only).
- **Rivalry System** — `ClubFoundedInLocation` / `ClubRelocatedToLocation`.
- **Regulations & Compliance** — financial-health / licence-check facts.
- Notification renders deterministic projections from these facts.

## Invariants

- **Sole ledger writer.** No other context writes finance tables or recalculates
  accounting state; they emit/request facts through public contracts (ADR-0050).
- **Projections are derived.** Cashflow, P&L, balance-sheet, amortisation,
  liabilities, budgets and compliance ratios are projections of the ledger plus
  Club-owned policy tables, never alternate primary truth.
- **Balanced postings.** Ledger entries are balanced ≥2-line double-entry per the
  ADR-0095 LI-1..LI-9 invariant (single-signed `amountMinor` shape superseded).
- **Append-only.** Ledger entries are append-only domain facts.
- **Money type.** Values are integer minor units; ratios use basis points.
- **Authoritative tick is weekly.**
- **No cross-context storage coupling** (ADR-0121): no shared tables, FKs or joins
  across context boundaries.
- **Determinism.** State transitions use deterministic clocks (no `Date.now`);
  stochastic Board & Ownership / insolvency draws use `WorldAiMgmtRng` sub-labels,
  facility decay uses `StadiumRng`, board-ambition escalation declares no RNG
  (ADR-0079, ADR-0061, ADR-0018).
- **Country economy rules are data profiles**, not branches scattered across
  handlers.
- **Real-money Investor grants are not financing facilities** — SP-only
  payment/entitlement events with clean cash and no debt/board/compliance semantics.
- **Chart-of-accounts is additive-only** — no renumbering; versioned via
  `chartOfAccountsVersion` / `categoryCatalogVersion` (ADR-0106).

## Open items

- **Concrete table/schema names** are not pinned by ADR-0050/0027/0121 beyond
  "Club Management's slice of `save_<uuidv7hex>`, Drizzle-owned"; the physical
  ledger/projection table set (e.g. ledger-entry table, posting-line table,
  projection tables) is unspecified in the verified sources.
- **Idempotency-key grammar** is specified only for
  `InsolvencyCreditorWriteOffPosted` (ADR-0050) and the ADR-0079 RNG sub-labels;
  keys for the other posting events are not enumerated in the sources read.
- **Posting/rule version field** (`postingRuleVersion`) is referenced in the
  insolvency idempotency key but its lifecycle/owner is not fully defined in
  ADR-0050.
- ADR-0050/0061 contract lists are explicitly **"draft"**; exact payload shapes
  for the ledger/StadiumOperations commands and events are not transcribed here
  because the sources do not define them.
