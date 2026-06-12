---
title: "Raw - sports management game insolvency references (FMX-146)"
status: raw
tags: [research, raw, perplexity, game-design, sports-management, insolvency, fmx-146]
created: 2026-06-12
updated: 2026-06-12
type: research
binding: false
linear: FMX-146
related:
  - [[../insolvency-ledger-posting-contract-2026-06-12]]
  - [[../../50-Game-Design/GD-0030-dynasty-board-and-ownership]]
  - [[../../50-Game-Design/GD-0008-finance-economy]]
---

# Raw - sports management game insolvency references (FMX-146)

## Research prompt

Perplexity was asked for comparable sports management game handling of financial distress, administration, forced sales, ownership rescue, budget restrictions and player/board consequences. The prompt emphasized Football Manager, OOTP and adjacent management/simulation lessons.

## Key findings

- Football Manager is the closest genre reference:
  - administration creates visible crisis drama;
  - point deductions and transfer restrictions are legible consequences;
  - administrators/boards can force player sales;
  - takeovers and debt restructuring are abstracted rather than legalistic;
  - the player mostly experiences consequences through budget, squad control, morale and board pressure.
- OOTP and other sports sims usually model owner budgets, cash, payroll pressure and market expectations more than formal insolvency law. They are useful for owner-governance and budget-pressure modeling, not for football-specific administration rules.
- Good game treatment favors:
  - readable financial health/stress indicators;
  - clear operational constraints;
  - board/administrator interventions;
  - forced-sale risk;
  - player morale and reputation impact;
  - rescue/recovery arcs;
  - enough abstraction that the player understands consequences without reading legal detail.
- The fun comes from constraints and choices, not from detailed insolvency procedure. The model should create crisis pressure, credible consequences and recovery stories while keeping ledger truth deterministic and boring.

## FMX-specific extraction

| Game-facing pattern | FMX implication |
|---|---|
| Visible stage escalation | Keep the shared insolvency stage enum player-readable through board/ownership UI |
| Transfer restriction | Model as squad/registration policy, not ledger posting |
| Wage cap | Model as future budget/run-rate control, not a retrospective wage rewrite |
| Forced player sales | Use existing transfer/registration disposal posting when the sale completes |
| Takeover/rescue | Model owner profile, trust/reputation effects and creditor settlement separately |
| Debt abstraction | Keep concrete chart-of-accounts codes deferred to FMX-150; expose game terms in UI |
| Recovery story | `rescued` should remain a meaningful non-terminal stage with legacy credit/reputation effects |

## Source trail

- Perplexity refresh (2026-06-12) was insufficient for validation: it returned mostly generic
  Football Manager support/community URLs and did not establish the full insolvency/ledger model.
  The following game-precedent references are therefore treated as genre evidence, not authority.
- Sports Interactive Community, "Close to administration (advice needed)" — player accounts of
  Football Manager administration, administrator control, transfer embargo, forced-listing of
  valuable players, CVA/debt reduction and EFL-style 12-point consequences:
  <https://community.sports-interactive.com/forums/topic/600371-close-to-administration-advice-needed/>
- OOTP Developments forum finance discussion — useful as owner-budget/projection precedent rather
  than football-law precedent:
  <https://forums.ootpdevelopments.com/showthread.php?t=262826>
- FM Base administration/bankruptcy discussions were reviewed as older community precedent for
  administration, embargo and fire-sale expectations; they are not canonical authority.

## Notes for synthesis

The game-design evidence supports the same technical conclusion as the accounting research: state and policy are player-facing; ledger postings should happen only when cash, liabilities or registration assets actually change.
