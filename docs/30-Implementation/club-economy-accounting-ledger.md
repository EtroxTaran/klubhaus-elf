---
title: Club Economy Accounting Ledger - Draft Contracts
status: draft
tags: [implementation, economy, accounting, club-management, contracts, fmx-13]
created: 2026-05-27
updated: 2026-05-27
type: implementation
binding: false
linear: FMX-13
related:
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../50-Game-Design/GD-0008-finance-economy]]
  - [[../50-Game-Design/economy-system]]
  - [[../20-Features/feature-club-economy-mvp-pillar]]
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
- sponsor contracts and side conditions;
- stadium/campus economic effects;
- country economy profile application;
- insolvency crisis state.

Other contexts interact through public contracts only. No context may insert
ledger rows directly or query Club-owned finance tables.

## Ledger entry shape

Minimum draft fields:

| Field | Meaning |
|---|---|
| `ledgerEntryId` | UUIDv7 entry identity. |
| `clubId` | Club aggregate. |
| `saveId` | Per-save scope. |
| `weekId` | League week / accounting period. |
| `sourceContext` | Club, Match, Transfer, League, Squad, Training or System. |
| `sourceEventId` | Domain event that caused the entry. |
| `accountCode` | Chart-of-accounts code from the country/profile pack. |
| `entryKind` | cash, accrual, liability, receivable, amortisation or reserve. |
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
| Match | Home match completed, attendance, risk/sanction result, matchday cost. |
| Transfer | Contract committed, instalment due, sell-on due, wage subsidy, agent fee. |
| Squad & Player | Wage contract active, bonus triggered, contract ended. |
| Training | Camp booked, academy operating cost, medicine facility effect. |
| Notification | Reads finance events only; it does not create finance facts. |

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

## Staged insolvency state

Draft states:

| State | Meaning |
|---|---|
| `healthy` | Runway and ratios inside thresholds. |
| `watch` | Forecast breach within configured horizon. |
| `overdraft` | Cash below zero but credit line still available. |
| `freeze` | Board freezes discretionary spending. |
| `arrears` | Wages, debt or supplier obligations missed. |
| `licence_review` | League/board review pending. |
| `run_end` | Licence lost, forced dissolution or control loss. |

The state machine is deterministic and data-driven by country/profile thresholds.

## Balance evidence needed before ratification

- 50-season soak per country profile and world seed class.
- Median runway, wage ratio, debt ratio and insolvency-stage frequency.
- Promotion/relegation shock tests.
- Transfer-instalment and wage-inflation long-save tests.
- First-run tutorial test: player can explain why cash changed this week.

## Related

- [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
- [[../50-Game-Design/GD-0008-finance-economy]]
- [[../50-Game-Design/economy-system]]
- [[../20-Features/feature-club-economy-mvp-pillar]]
