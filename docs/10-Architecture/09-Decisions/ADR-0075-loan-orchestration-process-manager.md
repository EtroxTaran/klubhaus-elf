---
title: ADR-0075 Loan-Orchestration Process Manager
status: proposed
tags: [adr, architecture, ddd, transfer, loan, squad, match, regulations, club-management, youth, fmx-85]
created: 2026-06-04
updated: 2026-06-04
type: adr
binding: false
supersedes:
superseded_by:
related:
  - [[ADR-0052-people-persona-and-skills-context]]
  - [[ADR-0056-regulations-compliance-context]]
  - [[ADR-0050-club-economy-accounting-ledger]]
  - [[ADR-0060-youth-academy-context]]
  - [[ADR-0073-player-contract-lifecycle-fsm]]
  - [[ADR-0014-state-machines]]
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[../state-machines/loan-orchestration]]
  - [[../state-machines/transfer]]
  - [[../state-machines/youth-academy]]
  - [[../bounded-context-map]]
  - [[../../50-Game-Design/GD-0006-transfers]]
  - [[../../50-Game-Design/transfer-market-and-contracts]]
  - [[../../50-Game-Design/regulations-and-compliance]]
  - [[../../60-Research/loan-orchestration-process-manager-2026-06-04]]
  - [[../../60-Research/raw-perplexity/raw-loan-orchestration-2026-06-04]]
---

# ADR-0075: Loan-Orchestration Process Manager

## Status

proposed

> **`proposed` / `binding: false`.** FMX-85 (E3-1) closes audit gap **G15** by recording
> Nico's selected landing for player loans: a **Transfer-led Loan-Orchestration Process
> Manager (saga)** coordinating Transfer, Squad & Player, Match, Regulations and Club
> Management, and consuming `YouthLoaned`. This ADR adds **no new bounded context** and locks
> **no numeric constants** (loan-quality weights, minutes thresholds, penalty sizes and exact
> domestic loan caps are calibration/Regulations data). A 1-row bounded-context-map
> clarification is proposed in §Map patch proposal but is **not** applied until ratification.

## Date

- Proposed: 2026-06-04

## Context

Loans are an unowned cross-context process (gap **G15**, severity high). Three lanes touch a
loan and none coordinates it:

- **Transfer** owns the deal (ADR-0052 "Transfer/Contracts owns agent/deal facts"), but the
  [[../state-machines/transfer]] FSM is strictly permanent club-to-club (`identified → … →
  completed/collapsed`, `seller_club_id` non-null) with no loan-agreement lifecycle.
- **Squad & Player** owns player availability/registration/injury state (ADR-0052 §43) but has
  no representation of "currently out on loan / due back".
- **Match** owns match simulation and results (ADR-0052 §46), making it the **authoritative
  source of minutes played** — but nothing consumes those minutes against a loan promise.

[[../state-machines/youth-academy]] §6 already emits **`YouthLoaned`** as an explicit
"future-scope loan-orchestration Process Manager entry point", and the `published_loaned`
`CohortMember` state has no real downstream until this PM exists.

A loan is a **long-running, multi-context process**, not a single aggregate — exactly the
Vernon process-manager / saga pattern already used by the Youth Academy cohort coordinator.
Per the binding communication rules, contexts interact only via **commands + queries/read-models
+ domain events** (JSON/Zod), with **no cross-context table joins**, and **Club Management is the
sole finance-ledger writer** (so loan-fee / wage-contribution settlement flows via
Customer-Supplier + ACL, never a direct ledger write). Regulations & Compliance (ADR-0056,
accepted) owns the transfer-window FSM, registration and work-permit verdicts, so the loan PM
must **query** Regulations rather than re-derive eligibility.

Research is filed in [[../../60-Research/loan-orchestration-process-manager-2026-06-04]] (raw
verbatim capture: [[../../60-Research/raw-perplexity/raw-loan-orchestration-2026-06-04]]). It
grounds the design in (a) FIFA RSTP Art. 10 (loan caps 6/6 simultaneous + 3 between the same two
clubs, U-21/club-trained exemptions, window-to-window min / 1-year max duration, sub-loan
prohibition, parent-contract reinstatement on early termination, minutes guarantees that are
contractual-only and never override selection) and (b) genre precedent (FM's full clause kit +
mechanically-tracked playing-time promise + implicit loan-quality; EA-FC's simpler loan-to-buy;
OOTP's development-as-separate-from-contract analogue).

## Decision options (PM host)

| Option | Description | Trade-off |
|---|---|---|
| **A. Transfer-led saga** | Transfer hosts the Loan-Orchestration PM; it issues commands to Squad & Player / Match / Regulations / Club Management and reacts to their facts. | **Chosen.** Transfer already owns deal facts; a loan *is* a temporary deal negotiated like a transfer (FM/EA-FC precedent). Adds no bounded context. `YouthLoaned` already points Transfer-ward. Mirrors the Youth cohort PM pattern. |
| B. Squad & Player-led | The availability owner hosts the saga. | Rejected. Overloads Squad & Player with negotiation/deal-coordination it does not own; splits deal truth away from Transfer; weaker DDD fit. |
| C. Standalone "Loan Lifecycle" context | A dedicated 20th/21st bounded context for loans. | Rejected for this beat as premature map growth for a single saga. Kept as a **future extraction seam** if loan/staff/commercial contract complexity becomes a shared CLM platform (mirrors ADR-0073's Contracts-context note). |

## Decision (chosen — Nico 2026-06-04)

Nico selected the four planning defaults live (2026-06-04): **D1 = Transfer-led saga**,
**D2 = Option + obligation-to-buy**, **D3 = cumulative-ratio → recall right**,
**D4 = Loan-quality is a Transfer read-model**.

### Ownership

**Transfer hosts the `LoanOrchestrationProcessManager`** (a saga). It owns the
**`LoanAgreement`** aggregate (the deal + clauses + loan lifecycle state) and the derived
**`LoanQuality`** read-model. It owns **no** foreign aggregate — it coordinates via commands,
queries and events.

- **Squad & Player** owns player availability/registration while loaned. On loan start it
  records the player as *out on loan / unavailable to parent, available to loanee*; on
  recall/termination/expiry it restores parent availability. It also owns the parent
  **contract reinstatement** consequence when a loan ends early (RSTP: original contract
  resumes) — driven by an event from the PM, not a direct write.
- **Match** is the authoritative **minutes** source. It emits per-fixture minutes facts the PM
  consumes for the playing-time monitor and the loan-quality signal. The PM never re-derives
  minutes.
- **Regulations & Compliance** owns eligibility verdicts the PM **queries**:
  `CurrentTransferWindow`, `RegistrationEligibilityVerdict`, `WorkPermitVerdict`, and the
  **loan-cap verdict** (simultaneous 6/6, 3-between-same-clubs, U-21/club-trained exemptions per
  RSTP Art. 10; exact **domestic** numbers are Regulations data). The PM passes player
  age/club-trained flags into the query and never embeds the caps itself.
- **Club Management** is the sole ledger writer. The PM emits **financial intents** (loan fee,
  wage-contribution schedule, breach penalty, obligation-buy fee) consumed through Club
  Management's ACL.
- **Youth Academy** is an upstream producer: its `YouthLoaned` event is a **PM entry point**
  alongside a user/AI `ProposeLoan`.
- **Training** consumes `LoanQualityAssessed` for development deltas (numeric model deferred to
  GD-0021); **Squad & Player** consumes it for value/morale. The PM computes the *signal*, not
  the development *delta*.

### Loan-agreement lifecycle states

Authoritative Transfer (`LoanAgreement`) states:

| State | Meaning |
|---|---|
| `proposed` | A loan offer exists (user/AI `ProposeLoan`, or materialised from `YouthLoaned`); terms drafted. |
| `negotiating` | Club and player/agent terms being resolved (counter-offers within round limit). |
| `agreed_pending_start` | All parties agreed; start date / window not yet reached. |
| `active` | Player registered at the loanee club; clauses in force; playing-time monitor running. |
| `recalled` | Parent exercised a valid recall right; early-termination consequences applied. |
| `terminated_early` | Loan ended before term by mutual agreement / administrative cause. |
| `completed` | Loan reached its end date; clause evaluation pending. |
| `converted_permanent` | Option exercised or obligation conditions met → hand-off to the permanent transfer-completion path. |
| `returned` | No buy clause fired; player reverts to the parent club. |

`recalled`, `terminated_early`, `converted_permanent` and `returned` are terminal for the loan.
The detailed state-machine note (FSMs + trigger/event tables + the playing-time monitor
sub-process) is [[../state-machines/loan-orchestration]].

### D2 — Buy-clause depth (Option + obligation-to-buy)

MVP ships both buy clauses. A loan may carry:

- an **option-to-buy** (loanee's *right* to buy at a pre-agreed fee by a deadline), and/or
- an **obligation-to-buy**, including a **conditional** obligation (e.g. appearances reached /
  relegation avoided) that, when its conditions evaluate true at loan end, **auto-fires a
  permanent transfer**.

Consequence: the saga **couples to the permanent transfer-completion path** and needs a
**minimal, deterministic conditions evaluator** (a pure function over logged facts — appearances
from Match, league outcome from League Orchestration). `converted_permanent` hands the deal to
the existing club-to-club completion flow; the loan PM does not duplicate fee/registration
settlement. Wage-contribution split and loan fee are in the MVP baseline regardless of buy depth.

### D3 — Minutes / playing-time guarantee (cumulative-ratio → recall right)

A loan may carry a `playingTimeAgreement` (a squad-role band → expected-minutes target). A
**playing-time monitor** sub-process runs over `active`:

- **Input:** Match per-fixture minutes facts (authoritative).
- **Computation:** a rolling **actual-vs-role-expected minutes ratio** (deterministic; excludes
  spells where the player is unavailable through injury/suspension/international duty).
- **States:** `on_track → warning → breached`.
- **Consequence on `breached`:** the **parent gains a recall right** and an optional **penalty
  fee** intent is emitted. The guarantee **never forces selection** — matching both RSTP
  (the clause is contractual, it does not override the coach) and FM's PlayingTimeMonitor.

### D4 — Loan-quality signal (Transfer read-model)

The PM derives a deterministic **`LoanQuality`** read-model from facts it already coordinates and
emits **`LoanQualityAssessed`**:

```text
LoanQuality = w1·minutesRatio + w2·roleSatisfaction + w3·leagueFactor + w4·performance
```

`minutesRatio` and `performance` come from Match facts; `leagueFactor` from the loanee
competition tier; `roleSatisfaction` from the playing-time monitor. **Weights `w1..w4` and all
bands are FMX-52 calibration inputs — not locked here.** Training consumes the signal for
development deltas (numeric model = GD-0021); Squad & Player for value/morale. Keeping the signal
in the PM (which owns the loan facts) and the *delta* in Training avoids the cross-context join
the no-join rule forbids.

## Public contract direction

Draft Transfer / PM commands:

- `ProposeLoan`
- `CounterLoanOffer`
- `AcceptLoan`
- `StartLoan`
- `RecordLoanMatchMinutes` (applied from consumed Match facts)
- `EvaluatePlayingTime`
- `RecallLoanee`
- `TerminateLoanEarly`
- `CompleteLoan`
- `ExerciseOptionToBuy`
- `EvaluateObligationToBuy`

Draft queries (Regulations, read-only):

- `CurrentTransferWindow(competition, date)`
- `RegistrationEligibilityVerdict(playerId, loaneeClubId, loanStartDate)`
- `WorkPermitVerdict(playerId, loaneeClubId, date)`
- `LoanCapVerdict(parentClubId, loaneeClubId, season, playerAge, clubTrainedFlag)` — global 6/6,
  same-two-clubs ≤3, U-21/club-trained exemptions; **domestic numbers are Regulations data**.

Draft events emitted:

- `LoanProposed`
- `LoanAgreed`
- `LoanStarted`
- `LoanPlayingTimeBreached`
- `LoanRecalled`
- `LoanTerminatedEarly`
- `LoanCompleted`
- `LoanConvertedToPermanent` (hand-off to the permanent transfer-completion path)
- `LoanReturned`
- `LoanQualityAssessed`

Draft events consumed:

- `YouthLoaned` (Youth Academy — PM entry point)
- Match per-fixture minutes facts (authoritative minutes)
- `SeasonAdvanced` / window-open ticks (League Orchestration, via Regulations window queries)

Availability and reinstatement payloads are self-contained (no consumer joins back):

```text
LoanStarted =
  eventId
  loanAgreementId
  playerId
  parentClubId
  loaneeClubId
  startDate
  endDate
  wageSplit { totalMinor, paidByLoaneeMinor, paidByParentMinor }
  recallPolicy { recallableFrom?, mutualOnly }
  playingTimeAgreement? { roleBand, expectedMinutesTarget }
  buyClause? { kind: option|obligation, feeMinor, conditions? }
  noPlayVsParent
```

Finance is intents, not ledger writes:

```text
LoanFinancialIntent =
  loanAgreementId
  payerClubId
  payeeClubId
  kind: loan_fee | wage_contribution | breach_penalty | obligation_buy_fee
  amountMinor
  schedule?              # instalments / per-appearance
  effectiveDate
```

Club Management consumes the intent through its ACL and posts ledger entries.

## Invariants

| # | Invariant |
|---|---|
| **LO1** | Exactly one Transfer `LoanAgreement` lifecycle state is authoritative for a given loan. |
| **LO2** | The PM mutates no foreign aggregate; every cross-context effect is a command/query/event (no cross-context join). |
| **LO3** | The permanent club-to-club transfer FSM is unchanged; `converted_permanent` hands off to it rather than duplicating it. |
| **LO4** | Match is the sole authoritative minutes source; the PM never re-derives minutes. |
| **LO5** | Registration / work-permit / **loan-cap** eligibility are Regulations verdicts, never embedded in Transfer. |
| **LO6** | A minutes-guarantee breach yields a recall *right* + optional penalty; it never forces team selection. |
| **LO7** | Loan-quality is a deterministic pure function of logged facts + a fixed weights table — **no RNG**. |
| **LO8** | Finance flows to Club Management as intents through the ACL; no other context writes ledger rows. |
| **LO9** | A sub-loan (loanee → third club while the loan is active) is a rejected transition; A→C requires terminating A→B first. |
| **LO10** | Loan duration is window-to-window minimum and ≤ 1 year; renewal requires an explicit player-consent event. |
| **LO11** | On `recalled` / `terminated_early` the PM emits the parent-contract reinstatement fact; Squad & Player restores availability. |

## Determinism, persistence and tests

### Determinism (ADR-0018 §3)

- **No new RNG.** Loan-quality and the conditions evaluator are pure functions; minutes are
  deterministic from Match. AI counter-party negotiation **reuses Transfer's existing negotiation
  RNG sub-label** — the loan PM introduces no new `*Rng`.
- Clock-driven transitions (window open/close, loan end, monitor recompute) are deterministic
  functions of save date + rule-set snapshot, consistent with the youth-academy and
  player-contract-lifecycle notes.

### Persistence (ADR-0027)

Intra-Transfer tables in the per-save schema; cross-context references as opaque branded UUIDv7
columns (no cross-context `references()`); integer-cents money; embedded lists as `jsonb`.

```text
loan_agreement {                            # strongly-typed (typed cols + CHECK)
  id: uuid (UUIDv7, PK),
  player_id: uuid (PlayerId, opaque branded ref),
  parent_club_id: uuid (ClubId, opaque branded ref),
  loanee_club_id: uuid (ClubId, opaque branded ref),
  state: text + CHECK IN (loan_states),
  origin: text + CHECK IN ('proposed','youth_loaned'),
  start_date: timestamptz?, end_date: timestamptz?,
  wage_total_minor: bigint, wage_paid_by_loanee_minor: bigint, wage_paid_by_parent_minor: bigint,
  loan_fee_minor: bigint,
  recall_policy: jsonb, playing_time_agreement: jsonb?,
  buy_clause: jsonb?,                        # {kind, feeMinor, conditions?}
  no_play_vs_parent: boolean,
  season_year: integer,
  history: jsonb (array of events)
}

loan_playing_time_monitor {                 # strongly-typed
  loan_agreement_id: uuid (intra-context FK to loan_agreement, PK),
  rolling_actual_minutes: integer,
  rolling_expected_minutes: integer,
  monitor_state: text + CHECK IN ('on_track','warning','breached'),
  last_recomputed_fixture_id: uuid (opaque branded ref)?,
  last_recomputed_at: timestamptz
}
```

Outbox per ADR-0028 for all emitted events and financial intents.

### Test strategy

- **FSM property tests:** every `LoanAgreement` state has ≥1 path to a terminal; no transition
  outside the matrix; no orphan states.
- **Golden determinism:** same save snapshot + same Match minutes facts → identical monitor
  states + identical `LoanQuality` + identical clause-evaluation outcome.
- **Saga compensation / retry:** `StartLoan` registration failure, `converted_permanent` hand-off
  failure, financial-intent outbox failure (ADR-0028 retry).
- **Boundary tests:** sub-loan rejected (LO9); loan-cap exceeded rejected via Regulations verdict
  (LO5); duration window-to-window + ≤1yr enforced (LO10); breach yields recall right not forced
  selection (LO6); reinstatement fact emitted on early end (LO11).
- **Contract tests:** Club Management ACL consumes `LoanFinancialIntent`; Regulations
  `LoanCapVerdict`/window queries match the agreed shape; Match minutes facts match; Youth
  `YouthLoaned` materialises a `proposed` loan.

## Map patch proposal (not applied — ratify-gated)

No new bounded context. On ratification, the [[../bounded-context-map]] §1 **Transfer** row gains
a clause: *"hosts the Loan-Orchestration Process Manager (saga) coordinating Squad & Player /
Match / Regulations / Club Management; owns the `LoanAgreement` aggregate and derived `LoanQuality`
read-model"*, and §3 finance-ownership prose notes that loan settlement flows to Club Management
via Customer-Supplier + ACL (consistent with the existing sole-writer rule). The map file is
**not** edited until Nico ratifies (per [[../../90-Meta/vault-governance]]).

## Consequences

Positive:

- One coordinating artifact for loans; the three lanes (deal / availability / minutes) stop
  growing ad-hoc loan logic and contradictory truth.
- The Youth Academy `published_loaned` path gets a real downstream (`YouthLoaned` → PM).
- Buy clauses, minutes guarantees and loan-quality are believable (FM-grade) yet determinism-safe
  and calibration-deferred.
- No new bounded context; Transfer stays the deal owner; finance/eligibility stay in their owners.

Negative / constraints:

- Transfer gains a saga + a second aggregate (`LoanAgreement`) and a read-model on top of
  permanent-transfer negotiation; implementers must not fold it into the club-to-club FSM.
- The conditional obligation-to-buy couples the loan PM to the transfer-completion path + a
  conditions evaluator earlier than a minimal loan model would.
- Regulations must carry domestic loan-cap parameters before implementation.

## HITL gate

Authored as `proposed` after Nico selected the FMX-85 planning defaults live (2026-06-04):

- D1 host = **Transfer-led saga**.
- D2 buy depth = **option + obligation-to-buy** (incl. conditional auto-conversion).
- D3 minutes guarantee = **cumulative-ratio → recall right** (never forces selection).
- D4 loan-quality = **Transfer read-model**.

Remaining ratification / follow-up items before implementation:

- numeric loan-quality weights, minutes-ratio thresholds and penalty magnitudes → **FMX-52** calibration;
- exact **domestic** RSTP loan-cap parameters + the obligation-condition catalog depth → **Regulations** data follow-up;
- whether a future **Contracts/CLM** bounded context absorbs loan + staff + commercial contracts once those land (kept as an extraction seam, mirroring ADR-0073);
- the 1-row bounded-context-map clarification (apply on ratify).

## Related

- [[../../60-Research/loan-orchestration-process-manager-2026-06-04]]
- [[../../60-Research/raw-perplexity/raw-loan-orchestration-2026-06-04]]
- [[../state-machines/loan-orchestration]]
- [[../state-machines/transfer]]
- [[../state-machines/youth-academy]]
- [[ADR-0073-player-contract-lifecycle-fsm]]
- [[ADR-0056-regulations-compliance-context]]
- [[ADR-0050-club-economy-accounting-ledger]]
