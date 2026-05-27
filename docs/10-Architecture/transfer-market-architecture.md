---
title: Transfer Market Architecture
status: current
tags: [architecture, transfers, contracts, ddd, state-machine, determinism]
created: 2026-05-17
updated: 2026-05-17
type: architecture
binding: false
related:
  - [[bounded-context-map]]
  - [[state-machines/transfer]]
  - [[09-Decisions/ADR-0019-modular-monolith-ddd]]
  - [[09-Decisions/ADR-0011-server-authoritative-multiplayer]]
  - [[09-Decisions/ADR-0013-transactional-outbox]]
  - [[../60-Research/transfer-market-simulation]]
  - [[../50-Game-Design/transfer-market-and-contracts]]
---

# Transfer Market Architecture

The Transfer bounded context owns transfer offers, negotiation cases, market
valuation, clause pricing and transfer-window state. It consumes public read
models from Club Management, Squad & Player, League Orchestration and
Notification, but it does not read their internal tables.

## 1. Context Ownership

| Concern | Owning context | Notes |
|---|---|---|
| Offer / negotiation lifecycle | Transfer | State machine in [[state-machines/transfer]]. |
| Market valuation bands | Transfer | Uses Squad & Player read models; stores valuation snapshots. |
| Player contract data | Squad & Player | Transfer references public contract projections. |
| Club finances / budgets | Club Management | Transfer uses finance read models for buyer / seller affordability. |
| Window calendar and registration | League Orchestration | Transfer asks League to validate windows and registration rules. |
| Narrative / inbox projection | Notification | Transfer emits events; Notification renders user-facing messages. |
| Abuse / audit | Audit & Security | Transfer emits command and event trail via outbox. |

## 2. Public Services

Inside `src/domain/transfer/`, keep domain services framework-agnostic:

```text
src/domain/transfer/
  commands.ts
  events.ts
  queries.ts
  state-machine.ts
  policies.ts
  repository.ts
  valuation/
    market-valuation-service.ts
    clause-pricer.ts
  planning/
    club-transfer-planner.ts
    opportunity-generator.ts
  negotiation/
    negotiation-engine.ts
    player-terms-policy.ts
  index.ts
```

Public exports stay contract-only through `index.ts` per ADR-0010.

## 3. Services

| Service | Responsibility |
|---|---|
| `MarketValuationService` | Builds `referenceValue`, asking bands and floor values. |
| `ClubTransferPlanner` | Builds AI buy / sell / loan / protected-core plans per window. |
| `TransferOpportunityGenerator` | Creates reasons for market activity from contracts, morale, finance, injuries and market regimes. |
| `NegotiationEngine` | Advances cases, validates offers, counters, deadlines and acceptance. |
| `ClausePricer` | Converts clause packages into cash-equivalent values. |
| `TransferApprovalPolicy` | Checks registration windows, squad rules, budgets, FFP and board overrides. |
| `PlayerTermsPolicy` | Evaluates player / agent acceptance with `TransferRng`. |

## 4. Persistence Shape

Core strongly-typed tables in the Transfer context (typed Drizzle columns +
`NOT NULL` + `CHECK`, per the governance split in
[[09-Decisions/ADR-0027-postgres-data-model]] §4):

```text
transfer_market_snapshot
transfer_opportunity
transfer_negotiation_case
transfer_offer
transfer_clause
transfer_window_regime
transfer_training_reward_rule
player_agent_profile
```

`transfer_market_snapshot` stores deterministic valuation bands and market
regime data for a date / window. It is a snapshot, not a global truth.

`transfer_negotiation_case` owns the offer chain:

```text
transfer_negotiation_case {
  id,
  player,
  seller_club,
  buyer_club?,
  state,
  opportunity_reason,
  seller_reservation_cash_equivalent,
  buyer_max_cash_equivalent?,
  player_terms_state,
  deadline,
  competing_bid_count,
  relationship_temperature,
  media_leak_risk,
  history
}
```

`transfer_offer` stores one concrete package and links to clauses:

```text
transfer_offer {
  id,
  case,
  from_club,
  to_club,
  base_fee,
  installments,
  bonuses,
  clause_package,
  cash_equivalent,
  gross_fee,
  estimated_deductions,
  estimated_net_seller_proceeds,
  response_deadline,
  state,
  parent_offer?
}
```

Clause packages are first-class data, not ad hoc fields:

```text
contract_clause_package {
  base_fee,
  installments,
  bonuses,
  sell_on_pct?,
  profit_share_pct?,
  buy_back?,
  matching_right?,
  loan_back?,
  loan?,
  release_clause?,
  agent_fee?,
  loyalty_bonus?,
  training_rewards_estimate?
}
```

`player_agent_profile` is intentionally small at MVP:

```text
player_agent_profile {
  id,
  name_seed,
  fee_preference,
  leak_tendency,
  negotiation_patience,
  risk_appetite,
  relationship_temperature
}
```

It behaves as a transaction modifier now, but the stable ID and traits keep the
door open for a deeper relationship system.

## 5. Events

Transfer emits domain events through ADR-0013 outbox:

- `TransferMarketSnapshotCreated`
- `TransferOpportunityCreated`
- `TransferNegotiationOpened`
- `TransferOfferSubmitted`
- `TransferOfferCountered`
- `TransferOfferAcceptedByClub`
- `TransferPlayerTermsAccepted`
- `TransferPlayerTermsRejected`
- `TransferOfferRejected`
- `TransferOfferExpired`
- `TransferNegotiationEscalated`
- `TransferCompleted`
- `TransferCollapsed`
- `TransferAbuseFlagged`
- `TransferTrainingRewardBooked`

Narrative and Notification subscribe to these events and decide whether to
surface an inbox card, rumour, press question or newspaper item.

## 6. Determinism

RNG streams:

| Stream | Use |
|---|---|
| `WorldAiMgmtRng` | AI club planning, market regimes, buyer / seller target selection. |
| `TransferRng` | Player / agent acceptance variance, contract-demand variance, leak risk. |
| `NewsRng` / `PresentationRng` | Pure presentation variants only; forbidden from simulation decisions. |

All money and probabilities are integers:

- money in cents;
- percentages in basis points;
- valuation bands in integer cents;
- probability weights in basis points.

## 7. Multiplayer Authority

Per ADR-0011, async multiplayer transfer effects are server-authoritative:

- clients can draft offers locally;
- submitted offers are commands;
- server validates current state, deadline, budget, clause legality and player
  eligibility;
- conflicts hard-reject with `rejected_with_reason`;
- the server owns deadlines, counters, expiry and final registration.

Singleplayer and hotseat use the same domain services locally.

## 8. Tiered World Simulation

Transfer architecture must support reduced materialisation:

- Tier 0/1: persist negotiation cases and offer chains.
- Tier 2: persist opportunities and materialise only meaningful bids / sales.
- Tier 3: persist aggregate transfer-flow summaries plus headline transfers.

This keeps the world believable without violating D9 budgets.

## 9. Expert Information Contract

Expert UI can show clear numeric values, but each value carries a source and
confidence:

```text
valuation_read_model {
  value_low,
  value_midpoint,
  value_high,
  confidence_bp,
  source: own_data | scout_report | analyst_model | market_snapshot | offer_terms,
  known_at,
  stale_after
}
```

Rules:

- own-club contract and offer terms are exact;
- external valuations are estimates until scouting / data knowledge reaches the
  configured threshold;
- confidence narrows with scout quality, analyst quality, regional knowledge,
  direct match exposure and repeated reports;
- UI must never label an inferred hidden value as exact.
## Related

- [[bounded-context-map]]
- [[state-machines/transfer]]
- [[09-Decisions/ADR-0019-modular-monolith-ddd]]
- [[09-Decisions/ADR-0011-server-authoritative-multiplayer]]
- [[09-Decisions/ADR-0013-transactional-outbox]]
- [[../60-Research/transfer-market-simulation]]
- [[../50-Game-Design/transfer-market-and-contracts]]
