---
title: FMX-42 Fan Demand and Price Elasticity Handoff
status: current
tags: [execution, handoff, fmx-42, fans, ticketing, economy]
created: 2026-05-28
updated: 2026-05-28
type: handoff
binding: false
linear: FMX-42
related:
  - [[../../60-Research/fan-demand-price-elasticity-2026-05-28]]
  - [[../../60-Research/club-economy-impact-map-and-commercial-contracts-2026-05-28]]
  - [[../../50-Game-Design/fan-ecology]]
  - [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../../50-Game-Design/economy-system]]
  - [[../../30-Implementation/club-economy-commercial-contracts]]
---

# FMX-42 Fan Demand and Price Elasticity Handoff

## Goals

- Pick the first economy research ticket after FMX-41 and go deep on supporter
  demand, price elasticity, top-match surcharges and ticketing trust.
- Keep the output realistic but fair as a game: grounded research, tunable
  ranges and Quick / Standard / Expert surfaces.
- Anchor the result into the vault, not only a chat summary.

## Completed

- Created [[../../60-Research/fan-demand-price-elasticity-2026-05-28]] with
  sourced research synthesis and model options.
- Recommended Option C: segment-specific latent demand plus capacity allocation
  and trust guardrails.
- Refined [[../../50-Game-Design/fan-ecology]] with `attendance_floor`,
  `price_sensitivity`, `ticketing_trust`, latent demand and fixture
  attractiveness.
- Refined [[../../30-Implementation/club-economy-commercial-contracts]] with
  a richer `FanDemandForecast`, `TicketingPolicy` and fixture profile surface.
- Refined [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  and [[../../50-Game-Design/economy-system]] so FMX-42 is visible in the
  commercial-economy loop.
- Updated [[../../60-Research/00-summary]], [[../../00-Index/Research-Map]],
  [[../../00-Index/Game-Design-Map]], [[../../50-Game-Design/README]] and
  [[../../00-Index/Current-State]].

## Open Tasks

- Nico decision: MVP ticketing should use category pricing plus bounded
  surcharges, or allow full dynamic pricing.
- Nico decision: Germany-style fan-first guardrails should be hard country
  rules or tunable profile defaults.
- Nico decision: `ticketingTrustState` should be shown as a Quick-mode badge or
  only surfaced through warning cards.
- Calibration work remains open: no final elasticity constants or balance
  numbers are locked.

## Decisions Made

- No binding gameplay decision was made. All touched gameplay/contract notes
  remain `status: draft`.
- Draft recommendation: model fan demand as latent demand by segment before
  stadium capacity and ticket policy allocation.
- Draft recommendation: treat aggressive/opaque pricing as a long-term
  trust-renewal risk even if the current fixture sells out.

## Blockers

- None for the research/vault anchoring beat.
- Implementation remains blocked by the project phase and Nico approval of the
  relevant draft GDDR/ADR path.

## Durable Notes Updated

- [[../../60-Research/fan-demand-price-elasticity-2026-05-28]]
- [[../../50-Game-Design/fan-ecology]]
- [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
- [[../../50-Game-Design/economy-system]]
- [[../../30-Implementation/club-economy-commercial-contracts]]
- [[../../60-Research/00-summary]]
- [[../../00-Index/Research-Map]]
- [[../../00-Index/Game-Design-Map]]
- [[../../50-Game-Design/README]]
- [[../../00-Index/Current-State]]

## Promotion Needed

- Promote FMX-42 only after Nico chooses the pricing-policy and trust-visibility
  options.
- Follow-on tickets should break out season-ticket mechanics, catering,
  merchandise, cup revenue and fan-service campaigns as separate research
  beats.
