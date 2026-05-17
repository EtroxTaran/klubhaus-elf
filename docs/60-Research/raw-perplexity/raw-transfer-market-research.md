---
title: Raw Transfer Market Research Prompt
status: raw
tags: [research, raw, perplexity, transfers]
created: 2026-05-17
updated: 2026-05-17
type: raw-research
binding: false
related: [[../transfer-market-simulation]]
---

# Raw Transfer Market Research Prompt

This note preserves the substantive input from Nico's attached Perplexity
research file from 2026-05-17. It is not implementation authority; the promoted
synthesis is [[../transfer-market-simulation]].

## Source Question

How do we create an active transfer market where other clubs make decisions:

- which players they place on the transfer market;
- which players they want to sell;
- how much a player is worth;
- how market-value calculations work;
- how rare real-life patterns happen, such as a top team selling a star due to
  poor squad mood, pressure, contract risk or similar context;
- how negotiations with sell-on percentages, buy-back options, loans, loan
  options and player-side demands can work without unrealistic outcomes like a
  top player sold for one euro?

## Main Research Proposal

The answer recommended a multi-layer transfer system rather than one market
value formula:

- `PlayerMarketProfile`
- `ClubTransferStrategy`
- `TransferOpportunity`
- `NegotiationCase`
- `ContractClausePackage`

It argued that market value should be a reference, while price emerges from
negotiation, club pressure, player / agent goals, contract state, market timing
and clauses.

## Key Mechanics Proposed

- AI clubs list players through `Sell Pressure Score` versus `Protection Score`.
- Top-club star sales require multiple stacked triggers: unhappy player,
  contract risk, major bid, prepared successor or financial pressure.
- Market value should be an interval, not a single number.
- Offers should be converted into cash-equivalent values so clauses can be
  compared with money.
- Clauses should be generic package types, not one-off hacks.
- UI should expose transfer feed labels, context labels and negotiation hints.
- Transfer events should escalate through rumours, agent pressure, player unrest
  and possible transfer requests.
- Simulation depth should follow world tiers so the PWA does not fully simulate
  every club in every league.

## Cited Source Types

The attached file cited:

- existing project docs / prior research;
- CIES / football transfer-value research;
- European Commission transfer-market study;
- FIFA Clearing House / RSTP material;
- LawInSport guide on training compensation and solidarity payments;
- examples of buy-back and sell-on clause discussions.

## Promotion

Promoted into:

- [[../transfer-market-simulation]]
- [[../../50-Game-Design/transfer-market-and-contracts]]
- [[../../10-Architecture/transfer-market-architecture]]
- [[../../20-Features/feature-transfer-market-ai-and-contracts]]
