---
title: Feature - Player-to-Player Transfer Negotiation
status: draft
tags: [feature, transfers, multiplayer, escalation]
created: 2026-05-16
updated: 2026-05-17
type: feature
binding: false
related: [[README]], [[feature-transfer-market-ai-and-contracts]], [[../50-Game-Design/transfer-market-and-contracts]], [[../50-Game-Design/transfer-negotiations-p2p]], [[../10-Architecture/state-machines/transfer]]
---

# Feature - Player-to-Player Transfer Negotiation

## Goal

Enable human-to-human transfer offers in private async groups with
deadlines, counter-offers and a staged escalation chain that makes
non-response costly but never instantly catastrophic.

## User stories

- As a manager I submit an offer with fee structure + clauses + response
  deadline.
- As the receiver I accept / reject / counter before the deadline.
- As both sides we negotiate over multiple counter-rounds.
- As a manager I see the target player's reaction (favourite, neutral,
  refuse) which can override club agreement.
- As a manager I see consequence escalation if I keep ignoring strong
  interest.

## In scope (MVP)

- Transfer state machine (pending / countered / accepted / rejected /
  expired / escalated).
- Multi-round counter-offer with deadlines.
- Player-side acceptance gating.
- Escalation chain (interest registered → player unrest → transfer
  request → training-mood slip).
- Hijack rule (third human bidder).
- Anti-griefing (≤ 3 outstanding offers per manager, lowball filter,
  griefingScore log).

## Out of scope (MVP)

- Free-agent auction mode (Phase 2).
- Cross-group transfers (out of scope permanently).
- AI-driven counter-offers from human-controlled clubs (humans only).

## UI tiers

- Quick: inbox card with Accept / Reject / Counter / Defer.
- Standard: side panel with counter-offer wizard.
- Expert: clause editor, agent pressure meter, full history.

## Acceptance

- Deadlines fire reliably under timezone changes.
- Escalation chain progresses correctly given documented triggers.
- Anti-griefing limits are enforced.
- Outbox events fire for every state transition.

## Dependencies

- [[feature-transfer-market-ai-and-contracts]]
- [[../50-Game-Design/transfer-market-and-contracts]]
- [[../10-Architecture/state-machines/transfer]]
- [[../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]]
- [[../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
