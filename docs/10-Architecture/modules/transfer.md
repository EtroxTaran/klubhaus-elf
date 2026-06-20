---
title: Transfer module
status: draft
tags: [architecture, module, transfer, recruitment]
context: transfer
created: 2026-06-20
updated: 2026-06-20
type: module
binding: false
related: [[../05-Building-Blocks]], [[../bounded-context-map]], [[../transfer-market-architecture]], [[../state-machines/transfer]], [[../09-Decisions/ADR-0095-balanced-transfer-ledger-posting-invariant]], [[../09-Decisions/ADR-0088-async-escalation-fsm-and-watch-party-deadline-source-of-truth]], [[../09-Decisions/ADR-0027-postgres-data-model]], [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
---

# Transfer Boundary

## Purpose

Owns transfer offers, negotiation cases, market valuation, clause pricing and
escalation pressure for club-to-club moves. It produces deterministic valuation
bands, pressure signals and completed-deal facts from public read models of
other contexts, without reading their internal tables.

## Owns

- Negotiation-case lifecycle aggregate (the offer / counter-offer chain and the
  player-terms gate; FSM in [[../state-machines/transfer]]).
- Transfer offers and first-class clause packages.
- Market valuation bands + market-regime snapshots (snapshots, not global truth).
- `EscalationPressure` value object (per `(playerId, sellerClubId, bidderClubId)`;
  pressure accumulator + hysteresis stages — draft ADR-0088).
- Player/agent acceptance modelling and `player_agent_profile`.
- Transfer-process cases that change contract lifecycle without owning it:
  `RenewalNegotiationCase`, `PreContractCase`, `FreeAgentSigningCase` (FMX-81).
- `TransferRng` / `WorldAiMgmtRng`-driven variance (seeds persisted in provenance).

## Public contract

Per [[../transfer-market-architecture]] and [[../state-machines/transfer]];
exposed outputs in the [[../bounded-context-map]] Transfer row are *transfer
state, valuation bands, pressure signals, completed deals*.

Commands (sources name these explicitly):

- `SendTransferOffer` (BCM §3 example).

Queries / read models:

- `valuation_read_model` — `value_low` / `value_midpoint` / `value_high` /
  `confidence_bp` / `source` / `known_at` / `stale_after` (Expert Information
  Contract; own-club + offer terms exact, external values estimated).

Domain events (via the ADR-0013/0028 outbox):

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
- `TransferNegotiationEscalated` (retained; now carries `stage` — draft ADR-0088)
- `TransferCompleted`
- `TransferCollapsed`
- `TransferAbuseFlagged`
- `TransferTrainingRewardBooked`

Staged-escalation events (draft — FMX-102 / ADR-0088; not binding until ratified):

- `TransferEscalationStageChanged` (canonical derived projection)
- `TransferInterestRegistered` (S2) / `PlayerTransferRequestSubmitted` (S3) /
  `TransferStandoffEscalated` (S4, signal-only per ADR-0030) /
  `SupporterUnrestTriggered` (S5)
- `TransferEscalationDeescalated`

## Storage ownership

Owns its own per-save tables (`save_<…>` schema) under
[[../09-Decisions/ADR-0027-postgres-data-model]]; no shared tables and no
cross-context JOINs per [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]].
Tables: `transfer_market_snapshot`, `transfer_opportunity`,
`transfer_negotiation_case`, `transfer_offer`, `transfer_clause`,
`transfer_window_regime`, `transfer_training_reward_rule`, `player_agent_profile`.
Cross-context refs (`player_id`, `*_club_id`) are opaque branded UUIDv7 columns
with no cross-context `references()`; intra-context refs (`case_id`,
`parent_offer_id`, clause ids) use intra-context FKs. Money is integer cents,
percentages basis points.

## Consumers / Producers

Consumes (public read models / facts only):

- Squad & Player — public contract projections + player state for valuation.
- Club Management — finance read models for buyer/seller affordability.
- League Orchestration — transfer-window calendar + registration validation.
- Regulations & Compliance — `EligibilityForTransfer` / `CurrentTransferWindow`
  verdicts; signing eligibility chains run as a Saga inside Transfer (ADR-0056).
- Tactics — `RoleProfileForPosition`.
- Notification — renders user-facing inbox/rumour copy from Transfer events.

Produces facts consumed by:

- Club Management — completed-deal facts that drive ledger posting; Club
  Management (not Transfer) posts `TransferFeeCapitalised` /
  `TransferInstalmentSettled` / `RegistrationAmortisationPosted` etc. via
  Customer-Supplier + ACL (ADR-0095, ADR-0105). Transfer never writes finance tables.
- Rivalry System — `TransferCompleted` (transfer-tension sub-score, ADR-0057).
- Manager & Legacy — transfer facts for run analysis.
- Audit & Security — command/event trail via outbox; abuse flags.
- Notification — inbox/rumour/press surfaces.

## Invariants

- Communicates only via commands + queries + domain events; never reads another
  context's tables, never JOINs across boundaries (BCM §3, ADR-0121).
- Only Club Management posts ledger entries; Transfer emits money-affecting facts
  only (ADR-0050 / ADR-0095 / ADR-0105).
- Server-authoritative (ADR-0011): clients draft offers locally; submitted offers
  are commands re-validated server-side; conflicts hard-reject
  (`rejected_with_reason`); server owns deadlines, counters, expiry, registration.
- The negotiation FSM is strictly club-to-club; `seller_club_id` stays non-null —
  free agents are not modelled by nulling it (FMX-81). Free-agent / pre-contract /
  renewal moves use their dedicated case types.
- Contract-lifecycle truth is owned by Squad & Player; registration / work-permit
  gates are Regulations verdicts. Transfer owns only the process cases.
- Deterministic + replay-safe: variance comes from `TransferRng` /
  `WorldAiMgmtRng` with seed + draw indices persisted in provenance; no new RNG
  streams. Escalation variance lives inside the structural gates and can never
  skip a stage (ADR-0088 ES1–ES5, draft).
- All money in integer cents, probabilities/percentages in basis points.
- UI must never label an inferred hidden value as exact (Expert Information Contract).

## Open items

- No standalone **context-definition ADR** exists for Transfer (it is an
  Original-11 context defined by the [[../bounded-context-map]] row +
  [[../transfer-market-architecture]] + [[../state-machines/transfer]]), unlike
  the FMX-132 Sporting-Core proposals. Authority therefore spans those docs plus
  ADR-0095 (balanced posting invariant). Confirm whether a dedicated Transfer
  context-definition ADR is wanted.
- The full **command** surface is under-specified in the sources. Only
  `SendTransferOffer` is named verbatim (BCM §3); counter / accept / reject /
  open-negotiation / draft-offer commands are implied by the FSM transitions and
  events but not enumerated as a command list. Do not treat the event list as the
  command list.
- The staged-escalation FSM and its events (`TransferEscalationStageChanged`,
  `TransferInterestRegistered`, `PlayerTransferRequestSubmitted`,
  `TransferStandoffEscalated`, `SupporterUnrestTriggered`,
  `TransferEscalationDeescalated`) are **draft** under ADR-0088 (FMX-102) and not
  binding until ratified.
- `RenewalNegotiationCase` / `PreContractCase` / `FreeAgentSigningCase` are named
  in the FMX-81 seam but their command/event/query surface is not yet specified.
