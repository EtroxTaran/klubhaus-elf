---
title: Loan-orchestration Process Manager — synthesis (FMX-85)
status: current
tags: [research, transfer, loan, squad, match, regulations, club-management, youth, fmx-85]
context: transfer
created: 2026-06-04
updated: 2026-06-04
type: research
related:
  - [[raw-perplexity/raw-loan-orchestration-2026-06-04]]
  - [[../10-Architecture/09-Decisions/ADR-0075-loan-orchestration-process-manager]]
  - [[../10-Architecture/state-machines/loan-orchestration]]
  - [[../10-Architecture/state-machines/transfer]]
  - [[../10-Architecture/state-machines/youth-academy]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../10-Architecture/09-Decisions/ADR-0060-youth-academy-context]]
  - [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
  - [[../50-Game-Design/GD-0006-transfers]]
  - [[../50-Game-Design/transfer-market-and-contracts]]
  - [[../50-Game-Design/regulations-and-compliance]]
---

# Loan-orchestration Process Manager — synthesis (FMX-85)

Synthesis for FMX-85 (E3-1, epic [[../00-Index/Current-State|FMX-59 Player & Squad Lifecycle
FSMs]]). Grounds proposed [[../10-Architecture/09-Decisions/ADR-0075-loan-orchestration-process-manager]]
and draft [[../10-Architecture/state-machines/loan-orchestration]]. Raw capture (verbatim, two
Perplexity prompts): [[raw-perplexity/raw-loan-orchestration-2026-06-04]].

Closes audit gap **G15** (loan deals are an unowned cross-context process). Three lanes touch a
loan with no coordinator: **Transfer** (the deal), **Squad & Player** (availability/registration
while loaned), **Match** (minutes). The existing [[../10-Architecture/state-machines/transfer]]
FSM is strictly permanent club-to-club; [[../10-Architecture/state-machines/youth-academy]] §6
already emits `YouthLoaned` as a "future-scope loan-orchestration Process Manager entry point".

## 1. Why a Process Manager (saga), not an aggregate

A loan is a **long-running, multi-context process** — the textbook Vernon process-manager / saga
pattern already used by the Youth Academy cohort coordinator. It coordinates three+ owners that
each keep their own truth, communicating only via **commands + queries/read-models + domain
events** (no cross-context joins; Club Management is the sole ledger writer). It is therefore
hosted by one context but **owns no foreign aggregate** — it issues commands and reacts to facts.

## 2. Real-world rules (FIFA RSTP Art. 10, fully phased in 2024/25)

Load-bearing facts that shape the contract and its determinism (see raw §Prompt 1):

| Rule | Value | Modelling consequence |
|---|---|---|
| Simultaneous loans OUT / IN | **6 / 6** (8→7→6 phase-in) | A **Regulations** eligibility check, queried by the PM (not re-derived) |
| Loans between the **same two clubs** / season | **3** | Same Regulations cap check, per ordered club-pair |
| Exemptions | players **≤21** OR **club-trained** | Caps count only `age>21 AND not club-trained`; PM passes player flags into the query |
| Min duration | **window-to-window** | Validity gate at creation |
| Max duration | **1 year** (renewable w/ player consent) | Validity gate; renewal = explicit consent event |
| Sub-loan | **prohibited** | A→C requires terminate A–B first → **rejected state** |
| Premature termination | **parent contract auto-reinstates** from reintegration | `terminated_early`/`recalled` → emit reinstatement fact to Squad & Player |
| Minutes guarantee | **contractual only — never overrides selection** | Breach → penalty / recall *right*, **not** forced minutes |
| Wage split / loan fee / option vs obligation-to-buy | standard clauses | Loanee employs player; home may subsidise wages; settle via ACL to Club Management |

> **Domestic** cap numbers diverge by association (FIFA requires consistency, not identity) and
> are a **Regulations data follow-up**, not locked here.

## 3. Game precedent (FSM + quality)

- **FM (FM24)** is the richest precedent and the closest design target: length options, 10%-step
  **wage-contribution** slider, **loan fee** (monthly / per-appearance / unused), **recall** flag,
  **option- and obligation-to-buy** (incl. conditional), and a **mechanically-tracked squad-role /
  playing-time promise** → under-use makes the player unhappy → complaint to parent → recall. A
  **Development/Loan List** is just a flag. Loan "quality" is implicit:
  `minutes × competition-level × training × performance`.
- **EA FC Career** is the simple end: loan-to-buy + wage split, **no** playing-time promise; loan
  quality ≈ OVR delta.
- **OOTP options/minors** is the development-loan analogue: model **development separately from the
  legal contract** (assignment level vs ability, playing-time fraction, training).
- **Anstoss/older**: coarse, "end of season", flat fee, no role promise.

Convergent shape: a saga FSM `proposed → … → active → {recalled | terminated_early | completed}`
with a **separate playing-time monitor** and a **deterministic loan-quality score**.

## 4. Locked decisions (Nico, live, 2026-06-04)

| # | Question | Decision | Rationale (research-grounded) |
|---|---|---|---|
| **D1** | PM host context | **Transfer-led saga** | Transfer owns deal facts (ADR-0052); `YouthLoaned` already points Transfer-ward; no new bounded context; matches FM/EA-FC (loan negotiated like a transfer) + Vernon PM (same as Youth cohort PM) |
| **D2** | Loan-to-buy clause depth | **Option + obligation-to-buy** | Both ship at MVP incl. **conditional** obligation that auto-fires a permanent transfer at loan end. FM-grade realism; couples the saga to the transfer-completion path + a minimal conditions evaluator |
| **D3** | Minutes-guarantee enforcement | **Cumulative-ratio → recall right** | Match is authoritative minutes source; PM tracks rolling actual-vs-role-expected; sustained breach grants parent a recall right + optional penalty, **never forces selection** (mirrors RSTP + FM PlayingTimeMonitor) |
| **D4** | Loan-quality owner | **Transfer read-model** | PM derives a deterministic `LoanQuality` from facts it already coordinates; Training consumes for dev deltas (numeric model → GD-0021); Squad & Player for value/morale. Saga stays self-contained |

## 5. Recommended contract surface (detail in ADR-0075 + FSM note)

- **Loan-agreement FSM:** `proposed → negotiating → agreed_pending_start → active →
  {recalled | terminated_early | completed}`; `completed` → clause evaluation →
  `converted_permanent` (hand-off to transfer-completion) **or** `returned`. Entry points: Transfer
  `ProposeLoan` **and** consumed `YouthLoaned`.
- **Playing-time monitor** over `active`: `on_track → warning → breached`, fed by Match per-match
  minutes facts; `breached` → recall right + optional penalty fact.
- **Loan-quality** = deterministic pure function `Q = w1·minutesRatio + w2·roleSatisfaction +
  w3·leagueFactor + w4·performance`; emitted as `LoanQualityAssessed`. **Weights → FMX-52.**
- **Finance** via Customer-Supplier + ACL to Club Management (loan fee, wage-contribution schedule,
  penalty, obligation-buy fee) — never a direct ledger write.
- **Determinism (ADR-0018 §3):** no new RNG — quality is pure; minutes deterministic from Match;
  AI counter-party negotiation reuses Transfer's existing negotiation RNG sub-label.

## 6. Open items routed forward (not locked here)

- Numeric loan-quality weights, minutes-ratio thresholds, penalty magnitudes → **FMX-52** calibration.
- Exact **domestic** RSTP cap parameters + obligation-condition catalog depth → **Regulations** data follow-up.
- ADR-0075 ratification + the 1-row bounded-context-map clarification → **Nico** gate.
