---
title: Feature - Sponsorship Portfolio
status: draft
tags: [feature, sponsors, finance]
context: commercial-portfolio
created: 2026-05-16
updated: 2026-05-18
type: feature
binding: false
related: [[README]], [[../50-Game-Design/sponsorship-portfolio]], [[../50-Game-Design/economy-system]], [[../50-Game-Design/fan-ecology]]
---

# Feature - Sponsorship Portfolio

## Goal

Replace the "one sponsor contract" pattern with an asset-level inventory:
shirt front, sleeve, naming rights, stand, fan zone, app. Sponsors bring
money AND side conditions.

## User stories

- As a manager I can sell individual stadium / kit / digital assets to
  different sponsors.
- As a manager I can accept side conditions (family image, alcohol
  policy, exclusivity).
- As a manager I see how my sponsor portfolio reacts to fan-segment
  conflicts and club identity changes.

## MVP foundation scope

For the Roguelite first playable, sponsorship is scoped to clear run-economy
signals and simple choices. Full portfolio depth can follow after MVP.

- 6-tier sponsor taxonomy (Main / Secondary / Infrastructure / Match-day /
  Digital / Local).
- Asset inventory per club.
- Side condition tracking + violation events.
- Offer lifecycle state machine (Available / Negotiating / Active /
  Renewing / Terminated).
- Per-asset valuation formula.

## Out of first playable scope

- Sponsor activation campaigns (Phase 2).
- Multi-year auction events.
- Real-time market negotiation between clubs (sponsors are AI-modelled).

## UI tiers

- Quick: "Sponsors income: X / year" badge + offer cards.
- Standard: tier overview + offer review.
- Expert: full asset grid + side-condition register.

## Acceptance

- Asset values respond correctly to KPI changes.
- Side-condition violations trigger renegotiation / termination.
- Sponsor lifecycle replays correctly through save/load.

## Dependencies

- [[../50-Game-Design/sponsorship-portfolio]]
- [[../50-Game-Design/fan-ecology]]
