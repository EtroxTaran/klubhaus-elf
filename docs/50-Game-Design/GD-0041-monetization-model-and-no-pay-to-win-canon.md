---
title: GD-0041 Monetization Model and No-Pay-to-Win Canon
status: draft
tags: [game-design, gddr, monetization, no-p2w, pricing, cosmetics, supporter, fmx-191]
created: 2026-06-13
updated: 2026-06-13
type: gddr
binding: false
addresses: [PM-2026-05-20-04-F-01]
related:
  - [[../60-Research/monetization-model-and-no-p2w-canon-2026-06-13]]
  - [[../60-Research/raw-perplexity/raw-monetization-model-market-precedents-2026-06-13]]
  - [[../60-Research/raw-perplexity/raw-no-pay-to-win-guardrails-2026-06-13]]
  - [[../40-Execution/fmx-191-monetization-decision-queue-2026-06-13]]
  - [[../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
  - [[../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]]
  - [[GD-0022-economy-commercial-impact-and-contracts]]
---

# GD-0041: Monetization Model and No-Pay-to-Win Canon

## Status

draft

> **Decision gate.** This GDDR is a non-binding FMX-191 proposal until Nico approves
> the D1-D5 packet in
> [[../40-Execution/fmx-191-monetization-decision-queue-2026-06-13]]. It is written in
> "if ratified" language and must not be treated as implementation authority yet.

## Context

The monetization pre-mortem requires an approved monetization GDDR and pricing/IAP
ADR before soft launch. Without this, FMX risks bolting on a battle pass or paid
economy later and losing trust. Research in
[[../60-Research/monetization-model-and-no-p2w-canon-2026-06-13]] points toward a
Hattrick-style supporter/cosmetic model rather than paid progression.

FMX already has one monetized gameplay-adjacent concept:
[[../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary|ADR-0063]]
Investor cash. This GDDR does not reopen that payment boundary. It proposes the
game-design rule that keeps it isolated from shared competition.

FMX-190 follows this model-level canon with draft
[[../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant|ADR-0108]]:
the proposed project-wide enforcement invariant for no-P2W, shared saves,
rankings, async groups, watch-party state, official comparisons, exports and
future multiplayer. ADR-0108 is also non-binding until Nico approves its D1-D5
packet.

## Proposed decision if ratified

FMX's monetization promise is:

> You cannot buy wins. Competitive power is earned only through play.

The launch model is proposed as:

- **Free core access** so the PWA/mobile-first game can acquire players without a
  premium barrier.
- **Deterministic cosmetic purchases** for club identity and presentation.
- **Optional Supporter Club membership** for non-power club-history, social,
  customization and convenience features.
- **No ads in MVP.**
- **No paid random rewards in the FMX-191 canon.**
- **A later cosmetic-only Club Season Card** only after content cadence and legal/store
  review exist.

## Allowed entitlement classes

| Class | Examples | Rule |
|---|---|---|
| Cosmetic club identity | Kits, badge variants, profile frames, cosmetic trophies, UI themes, stadium skins, supporter banners | Must not affect match readability, outcomes, economy, hidden information or competitive grouping. |
| Supporter Club QoL/history | Longer club-history views, replay archive, cosmetic preset slots, profile/social curation | Must be non-authoritative and must not reveal hidden state, automate decisions or improve competitive opportunity volume. |
| Account services | Manager/club rename, cosmetic reset, non-ranked account service | Must have no rank, reward, fixture, economy, squad or matchmaking effect. |
| Singleplayer Investor cash | ADR-0063 clean SP entitlement cash | Must remain isolated to singleplayer saves; FMX-189 forbids SP/hotseat/imported-save use as MP seed state and therefore no Investor payload can export into shared rankings, async groups, watch-party states or future multiplayer. |

## Forbidden entitlement classes

FMX must not sell:

- player, staff, tactic, morale, stamina, injury-recovery, training or match-result boosts;
- transfer budget, wage budget, fixture/schedule relief, draw rerolls, board-confidence
  changes or fan-pressure changes in shared contexts;
- paid scouting certainty, hidden-attribute reveals, tactical analysis advantage or
  model outputs that help competitive decisions;
- speed-ups, time-gate skips or paid extra attempts that change competitive progression;
- paid random rewards with competitive output;
- tradeable paid items or currencies convertible into competitive resources.

## Singleplayer boundary

Singleplayer-only paid value is allowed only when all of these hold:

1. the save is marked non-shared/non-ranked before the entitlement can apply;
2. the entitlement cannot cross into async private groups, rankings, watch-party state,
   exports, screenshots used as official comparisons or future server-authoritative MP;
3. the UI labels the save as using singleplayer paid assistance where relevant;
4. later MP/fairness work can test the boundary mechanically.

## Communication principle

Player-facing monetization copy should be plain:

- "No Pay-to-Win: all competitive power is earned through play."
- "Cosmetics and Supporter features never improve results."
- "Singleplayer Investor saves are not competitive/shared saves."

This is product truth, not just marketing. If any future SKU weakens the statement,
the SKU fails this GDDR unless Nico explicitly supersedes the canon.

## Out of scope

- Concrete prices, SKU ids, tax, refund, withdrawal, PSP/MoR, Apple/Google purchase
  integration and age-gate implementation.
- CI/test enforcement implementation; FMX-190 now provides the proposed
  draft ADR-0108 contract, but no code gate exists until the app/toolchain
  returns and Nico accepts the decision packet.
- Product analytics vendor and consent implementation.

## Open Nico decisions

Approve or change the D1-D5 packet in
[[../40-Execution/fmx-191-monetization-decision-queue-2026-06-13]]. Recommended packet:
**A/A/A/A/A**.
