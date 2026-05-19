---
title: Feature - AI Transfer Market and Contracts
status: approved
tags: [feature, transfers, contracts, ai, scouting, economy]
created: 2026-05-17
updated: 2026-05-18
type: feature
binding: true
related: [[README]], [[../50-Game-Design/transfer-market-and-contracts]], [[../60-Research/transfer-market-simulation]], [[../10-Architecture/transfer-market-architecture]], [[../10-Architecture/state-machines/transfer]]
---

# Feature - AI Transfer Market and Contracts

## Goal

Create a believable transfer market where AI clubs buy, sell, loan and
negotiate from squad strategy, finances, player pressure and market context.

## User Stories

- As a manager, I can understand why a player is available, expensive or blocked.
- As a manager, I can negotiate using fee structure and clauses, not just one
  number.
- As a manager, I can receive bids that reflect AI club needs and market heat.
- As a manager, I can see player / agent terms matter after club agreement.
- As a manager, I can experience rare but believable shock sales and forced
  sales without nonsensical token-fee outcomes.

## MVP foundation scope

For the Roguelite first playable, this is a foundation and explanation layer.
Full market depth can phase in after the first loop is playable.

- Knowledge-gated valuation values: clear numbers in Expert when confidence is
  high, wider bands when scouting / data knowledge is incomplete.
- AI `ClubTransferStrategy` per transfer window.
- `sellPressure` versus `protectionScore` selling model.
- Full clause-family offer packages: base fee, instalments, bonuses, sell-on,
  profit share, buy-back, matching right, loans, option / obligation,
  release clause, agent fee, loyalty bonus and training rewards.
- Cash-equivalent offer comparison.
- Player-side acceptance gate.
- Simple MVP agent profile as a transaction modifier with future-ready identity.
- Transfer window regimes and deadline pressure.
- Transfer Scope presets for tiered world simulation.
- Inbox / feed / negotiation UI hooks for explanations.

## Out of first playable scope

- Full agent relationship game across multiple seasons.
- Full legal replication of every domestic transfer regulation.
- Runtime ML valuation.
- Cross-group transfers.
- False certainty for unknown external players; Expert shows clear numbers only
  to the current knowledge limit.

## Acceptance Criteria

- AI clubs do not sell protected best-XI players below floor values.
- Distressed clubs can sell below normal ask, but only within documented floors.
- At least five transfer archetypes can be generated deterministically from
  fixtures, squad state, contracts and finance.
- Offer comparison correctly accounts for delayed cash, bonuses, sell-on,
  buy-back / matching rights, loan options / obligations, agent fees and
  training rewards.
- Player acceptance can block a club-agreed deal.
- Tier 2/3 simulation does not persist full negotiation chains.
- Transfer events emit through the outbox and can feed D15 narrative arcs.
- Expert UI shows gross fee, net proceeds, cash-equivalent value, confidence and
  source breakdown.
- Transfer Scope presets map to D9 world-size budgets and warn before expensive
  Custom settings.

## Dependencies

- [[../10-Architecture/transfer-market-architecture]]
- [[../10-Architecture/state-machines/transfer]]
- [[../60-Research/ai-manager-behaviour]]
- [[../60-Research/determinism-and-replay]]
- [[../60-Research/performance-budgets]]
- [[../50-Game-Design/scouting-and-recruitment]]
- [[../50-Game-Design/economy-system]]
