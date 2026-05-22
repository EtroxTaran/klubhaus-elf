---
title: Transfer Market Implementation Plan
status: current
tags: [implementation, transfers, contracts, ai, testing]
created: 2026-05-17
updated: 2026-05-17
type: implementation
binding: false
related: [[../60-Research/transfer-market-simulation]], [[../10-Architecture/transfer-market-architecture]], [[../50-Game-Design/transfer-market-and-contracts]], [[../20-Features/feature-transfer-market-ai-and-contracts]]
---

# Transfer Market Implementation Plan

This note stages implementation of the transfer-market blueprint without
overbuilding the full system in one pass.

## Phase 0 - Schema and Contracts

- Add transfer context contracts: commands, events, queries and Zod schemas.
- Add typed Drizzle `pgTable`s (typed columns + `CHECK`) for negotiation
  cases, offers, clauses, opportunities and market snapshots, provisioned in
  the per-save schema
  ([[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]] §1, §4).
- Add clause-package schema for every MVP clause family, including sell-on,
  profit share, buy-back, matching right, loans, options, obligations, release
  clauses, agent fees, loyalty bonuses and training rewards.
- Add lightweight `player_agent_profile` records as transaction modifiers with
  stable IDs.
- Add integer money / basis-point helpers shared by simulation packages.
- Add deterministic fixture seeds for valuation snapshots.

Exit criteria: contracts compile, schema generation is clean, and basic command
validation rejects malformed offers.

## Phase 1 - Valuation and Floors

- Implement `MarketValuationService`.
- Store `ValuationBand` snapshots with model version.
- Implement `panicSaleFloor`, protection floor and contract floor.
- Add confidence/source metadata so Expert UI can show clear values without
  false certainty.
- Add tests for elite player, expiring-contract player, distressed-sale player
  and low-tier prospect.

Exit criteria: no high-quality contracted player can be valued below floor in
property tests.

## Phase 2 - AI Planning

- Implement `ClubTransferPlanner`.
- Replace D4's simple selling formula with `sellPressure` versus
  `protectionScore`.
- Generate buy / sell / loan / protected-core plans per transfer window.
- Add deterministic plans for canonical save seeds.

Exit criteria: AI plans are stable across reloads and fit the 7 ms / club
weekly budget target.

## Phase 3 - Negotiation Engine

- Implement `NegotiationEngine` and `ClausePricer`.
- Compare full clause-family offers by cash-equivalent value.
- Add club acceptance, counter-offer, expiry and escalation transitions.
- Add player terms gate with `TransferRng`.
- Add training-reward booking into the fee waterfall.

Exit criteria: state machine has no undefined transitions and golden traces
cover accept, reject, counter, expiry, hijack and player refusal.

## Phase 4 - UI and Narrative Hooks

- Add read models for transfer feed labels and negotiation hints.
- Wire events into Notification / D15 narrative families.
- Add Quick / Standard / Expert surfaces incrementally.

Exit criteria: every transfer decision shown to the user includes at least one
human-readable reason.

## Phase 5 - Tiered World Simulation

- Add Transfer Scope presets: Focused, Standard, Deep and Custom Expert.
- Add Tier 2 aggregate opportunity generation.
- Add Tier 3 headline transfer flow.
- Add storage and perf assertions for Small / Medium / Large worlds.

Exit criteria: Large world transfer processing stays within D9 budgets on the
standard device profile.

## Test Strategy

- Unit tests for valuation curves, floors and clause pricing.
- Property tests for no token-fee protected players and no negative
  cash-equivalent packages.
- Golden deterministic tests for canonical seeds and transfer windows.
- State-machine tests for all negotiation states.
- Perf tests for weekly AI transfer planning.
- Integration tests for outbox events and narrative projections.
