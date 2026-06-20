---
title: "Insolvency event-to-ledger posting contract (FMX-146)"
status: current
tags: [research, synthesis, club-economy, accounting-ledger, insolvency, game-design, ddd, fmx-146]
context: club-management-economy
created: 2026-06-12
updated: 2026-06-12
type: research
binding: false
linear: FMX-146
related:
  - [[raw-perplexity/raw-insolvency-ledger-real-world-2026-06-12]]
  - [[raw-perplexity/raw-insolvency-ledger-ddd-accounting-2026-06-12]]
  - [[raw-perplexity/raw-insolvency-ledger-games-2026-06-12]]
  - [[../10-Architecture/09-Decisions/ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0079-dynasty-board-ownership-and-bankruptcy]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../10-Architecture/09-Decisions/ADR-0095-balanced-transfer-ledger-posting-invariant]]
  - [[../10-Architecture/09-Decisions/ADR-0105-wage-and-transfer-fee-posting-contracts]]
  - [[../50-Game-Design/GD-0030-dynasty-board-and-ownership]]
  - [[../50-Game-Design/GD-0008-finance-economy]]
---

# Insolvency event-to-ledger posting contract (FMX-146)

## Scope

FMX-146 closes the ADR-0101 D4 seam: the project needs one shared insolvency stage contract and a named event-to-ledger posting mapping that does not duplicate the Club Economy ledger state machine.

Nico approved the recommended line by asking Codex to implement the proposed FMX-146 plan on
2026-06-12. The binding wording is applied in the affected ADR/GDDR notes in the same PR; this
note preserves the research chain and rationale.

## Current constraints

- [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger|ADR-0050]] keeps Club Management as the sole finance ledger writer.
- [[../10-Architecture/09-Decisions/ADR-0095-balanced-transfer-ledger-posting-invariant|ADR-0095]] requires balanced double-entry ledger postings, typed account categories, immutable reversals and account-rule versioning.
- [[../10-Architecture/09-Decisions/ADR-0105-wage-and-transfer-fee-posting-contracts|ADR-0105]] already owns wage-block and registration disposal/write-off posting families.
- FMX-149 resolved amount-band collapse before ledger posting on current `main`; insolvency postings should reuse that rule rather than define a second estimation policy.
- Concrete chart-of-accounts handles are still deferred to FMX-150. FMX-146 should define the event contract and account-category shape, not final account codes.

## Evidence synthesis

Real-world football insolvency and game references point to a two-layer model:

- **Stage and policy layer:** administration, embargoes, wage caps, points deductions and forced-sale authority are regulatory/game-state facts.
- **Economic posting layer:** cash, liabilities, equity, income/expense and registration assets move only when a settlement, support injection, disposal or write-off actually happens.

DDD/event-sourced ledger research supports the same boundary:

- keep one canonical business lifecycle;
- translate approved economic events into immutable balanced journal entries;
- use idempotency keys from origin event ids and posting-rule versions;
- reverse entries mechanically instead of editing posted journals;
- collapse estimates before posting unless an explicit accrual/reserve flow is introduced.

## Decision line applied

Apply this as the FMX-146 decision:

1. Use ADR-0079/GD-0030 as the canonical insolvency stage enum: `stable`, `stressed`, `cash_flow_crisis`, `under_embargo`, `administration`, `rescued`, with `liquidated` reserved.
2. Treat older finance severity labels (`healthy`, `watch`, `overdraft`, `freeze`, `arrears`, `licence_review`, `recovery`, `run_end`) as read-model/UI aliases, not a second ledger FSM.
3. Keep `AdministrationEntered`, embargoes, points deductions, wage caps and fire-sale opening as state/policy events with no immediate ledger posting.
4. Route wage-cap effects through future `PlayerWageBlockPosted` / `StaffWageBlockPosted` limits from ADR-0105. Do not rewrite or reduce already-posted wage expenses.
5. Route fire-sale completions through ADR-0105 registration disposal/write-off postings. Do not add a new insolvency-only transfer ledger family.
6. Add one insolvency-specific posting contract for creditor settlement/write-off: `InsolvencyCreditorWriteOffPosted`.
7. For `InsolvencyCreditorWriteOffPosted`, debit/reduce the liability and use a typed contra category chosen by creditor/instrument substance:
   - `income.debt_restructuring_gain` for external creditor haircuts/CVA-like settlements;
   - `equity.owner_contribution` for owner or related-party forgiveness.
8. Defer concrete account codes to FMX-150, but require `originEventId`, `insolvencyCaseId`, `postingRuleVersion`, `moneyBandCollapsePolicyRef` when a band is collapsed, and a deterministic idempotency key.

## Source quality note

A live Perplexity refresh on 2026-06-12 returned mostly generic Football Manager support/community
results and explicitly could not validate the legal/accounting parts of this contract from that
source set. The decision therefore uses Perplexity as a raw exploratory layer only and rests on
the verified source pass captured in the raw notes: EFL/Lex Sportiva football insolvency analysis,
DFL/Bundesliga licensing references, Formance/Modern Treasury/TigerBeetle ledger material and
Sports Interactive/OOTP community/game-precedent evidence.

## Proposed shared enum

| Stage | Meaning | Ledger posture |
|---|---|---|
| `stable` | No active insolvency pressure | no insolvency posting |
| `stressed` | Warning/budget stress | no insolvency posting |
| `cash_flow_crisis` | Liquidity failure, arrears or missed obligations | no automatic posting; ordinary payables/wage events continue through normal contracts |
| `under_embargo` | Registration/budget controls active | no automatic posting; constrains future squad/contract operations |
| `administration` | Administrator or equivalent crisis control active | no automatic posting; may trigger future wage-cap policy, forced-sale policy and creditor-settlement posting |
| `rescued` | Rescue/restructuring complete, legacy effects remain | may follow `InsolvencyCreditorWriteOffPosted` and/or owner support postings |
| `liquidated` | Reserved terminal outcome | post-MVP; no MVP posting contract |

## Alias mapping for legacy finance labels

| Legacy label | Canonical stage |
|---|---|
| `healthy` | `stable` |
| `watch` | `stressed` |
| `overdraft` | `stressed` or `cash_flow_crisis` depending on arrears trigger |
| `freeze` | `under_embargo` |
| `arrears` | `cash_flow_crisis` |
| `licence_review` | `under_embargo` |
| `recovery` | `rescued` |
| `run_end` | reserved terminal/manager-control outcome, not an MVP ledger stage |

## Proposed event-to-posting table

| Origin event | Posting? | Contract |
|---|---|---|
| `InsolvencyStageChanged` | no | state/policy fact only |
| `AdministrationEntered` | no | may set points deduction, embargo scope, wage-cap policy and administrator authority |
| `InsolvencyWageCapPolicySet` | no immediate posting | constrains future ADR-0105 wage blocks |
| `AdministratorFireSaleOpened` | no | creates forced-sale authority and valuation pressure only |
| `RegistrationDisposalSettled` with `insolvencyCaseId` | yes | ADR-0105 transfer/registration disposal posting, provenance marks fire sale |
| `RegistrationWriteOffPosted` with `insolvencyCaseId` | yes | ADR-0105 write-off posting, provenance marks insolvency |
| `ClubRescued` with creditor haircut | yes | `InsolvencyCreditorWriteOffPosted` |
| `OwnerSupportGranted` | yes if modeled as cash/debt/equity support | existing owner-support/financing path, not an insolvency-only write-off |
| `ClubLiquidated` | reserved | no MVP posting contract |

## Proposed `InsolvencyCreditorWriteOffPosted` shape

Minimum contract fields:

- `clubId`
- `insolvencyCaseId`
- `originEventId`
- `creditorClass`
- `settlementRef`
- `amountMinor`
- `currency`
- `collapsePolicyRef` when derived from a MoneyBand
- `postingRuleVersion`
- `contraClassification`: `debt_restructuring_gain` or `owner_equity_contribution`
- `idempotencyKey`

Balance rule:

- liability reduction line equals `amountMinor`;
- contra line has the opposite sign and an account category consistent with `contraClassification`;
- total signed amount across lines is zero, preserving ADR-0095 LI-1.

Suggested deterministic idempotency pattern:

`insolvency-creditor-writeoff:{clubId}:{insolvencyCaseId}:{originEventId}:{creditorClass}:{postingRuleVersion}`

## Decision record

Nico approved implementation of the proposed plan on 2026-06-12. The accepted vault edits apply this
decision line to ADR-0101, ADR-0079, ADR-0050, ADR-0105, GD-0030, GD-0008 and the implementation
ledger note. Remaining account-code granularity stays with FMX-150.
