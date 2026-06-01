---
title: Feature - Club Economy MVP Pillar
status: draft
tags: [feature, mvp, economy, finance, accounting, financing, debt, commercial, contract-lifecycle, breach, club-management, season-tickets, cup, competition, matchday, operations, fan-service, fmx-13, fmx-41, fmx-43, fmx-44, fmx-45, fmx-46, fmx-48, fmx-49]
created: 2026-05-27
updated: 2026-06-01
type: feature
binding: false
linear: FMX-13
related:
  - [[README]]
  - [[../00-Index/MVP-Scope]]
  - [[../50-Game-Design/GD-0008-finance-economy]]
  - [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../50-Game-Design/economy-system]]
  - [[../60-Research/club-economy-blueprint-2026-05-27]]
  - [[../60-Research/club-economy-impact-map-and-commercial-contracts-2026-05-28]]
  - [[../60-Research/season-ticket-lifecycle-and-accounting-2026-05-28]]
  - [[../60-Research/commercial-contract-lifecycle-and-breach-model-2026-05-28]]
  - [[../60-Research/cup-and-competition-revenue-profiles-2026-05-28]]
  - [[../60-Research/matchday-operating-costs-and-risk-cost-settlement-2026-05-29]]
  - [[../60-Research/fan-service-campaign-catalog-and-effects-2026-06-01]]
  - [[../60-Research/club-financing-tools-2026-06-01]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - [[../30-Implementation/club-economy-commercial-contracts]]
---

# Feature - Club Economy MVP Pillar

## Goal

Make club finance a playable MVP pillar: the player must understand why the
club can or cannot survive the next weeks, and every sporting shortcut has a
visible economic consequence.

## User stories

- As a new manager I can see my weekly runway before committing to wages,
  travel, stadium cost or transfer obligations.
- As a manager I can read why my club's cash changed this week.
- As a manager I can recover from an early finance crisis before the run ends.
- As an Expert player I can inspect the accounting basis behind the simple
  warning: cash, P&L, liabilities, amortisation and compliance ratios.

## MVP foundation scope

- Starting balance sheet and opening cash state for a generated club.
- Weekly ledger tick with deterministic entries.
- Minimum revenue streams: ticketing, season-ticket campaign cash with deferred
  revenue recognition, basic sponsor income, matchday catering, small
  merchandise, prize/bonus payments and cup/competition receivables.
- Minimum commercial policy: season-ticket lifecycle preset, single-ticket
  price band, top-match surcharge preset, one commercial contract register,
  stable/balanced/upside presets for the first catering, merchandise and
  sponsorship contract models, conflict warnings, breach warnings and one
  fan-service campaign choice from a profile-gated catalog.
- Minimum fan-service campaign policy: at least one Quick recommendation from
  away travel, family/community, choreo/dialogue, beverage reward or digital
  challenge candidates, with visible cost, sponsor support, segment effect band,
  risk badge, cooldown and settlement timing.
- Minimum competition-revenue policy: IP-clean domestic cup presets,
  continental profile hook, hard cash versus receivable versus future EV,
  elimination-shock forecast update and neutral/away/home settlement variants.
- Minimum costs: player/staff wages, stadium operations, matchday operating
  costs, travel, debt service, transfer instalments, maintenance and
  federation/league levy.
- Minimum financing tools: overdraft/credit line, bank/facility loan, sponsor
  advance, receivables factoring, restructuring/payment holiday, emergency sale
  mandate and fictional non-IAP board support as equity-like rescue grant or
  shareholder loan.
- Minimum finance-risk surfaces: 13-week runway forecast, financing facility
  register, overdue-payables ageing and Top-5 profile licence/sanction hooks.
- Minimum matchday operating-cost policy: per-fixture risk tier, stewarding,
  private security, policing contribution, medical, cleaning, energy,
  temporary staff, officials, pitch recovery, damage reserve and sanction
  settlement, with mitigation presets before high-risk fixtures.
- Staged insolvency crisis: warning -> overdraft/freeze -> arrears -> licence
  consequence -> run end.
- Country profile selection for Germany, England, France, Italy, Spain and
  abstract fallback; final tuning remains draft.
- Progressive UI:
  - Quick: runway badge and one to three action cards.
  - Standard: KPI dashboard, weekly ledger summary, forecast.
  - Expert: accounting statements, amortisation, liabilities and compliance.

## Out of first playable scope

- Final global balance constants.
- Full payment-provider / IAP implementation.
- Investor activation before platform/legal review.
- Manual accounting journal editing.
- Visitor-level stadium operations simulation.
- All country-specific lower-tier rules beyond the documented profile hooks.

## Acceptance

- Weekly economy can be advanced deterministically for the same save state and
  seed.
- A post-match or post-week screen explains each material cash movement.
- Negative cash does not instantly end the run; the staged crisis flow is
  visible and recoverable until its final stage.
- Overdraft, sponsor advance, loan repayment, restructuring and factoring each
  have visible ledger and runway consequences.
- Investor cash remains separate from in-world financing and never creates debt,
  owner-control, fan/sponsor effects or multiplayer impact.
- Transfer offers and contracts can create future liabilities, not only
  immediate cash movement.
- Expert UI can distinguish liquidity, accounting result and compliance risk.
- Commercial UI can show Quick totals and Expert assumptions for away travel,
  season-ticket cash/deferred accounting, catering/merch contracts, cup
  settlement, matchday operating-risk costs and fan events.
- Fan-service UI can show campaign cost, sponsor contribution, target segment,
  expected mood/atmosphere/demand effect, legal/risk gate and cooldown at
  Quick/Standard/Expert depth.
- High-risk, restricted and closed-door fixtures show forecast cost, revenue
  impact and mitigation options before settlement, unless the cost is triggered
  by a post-match incident.
- Cup UI can distinguish secured income, earned receivables and expected future
  round upside, and early elimination removes forecast upside without creating
  a hidden cash penalty.
- Commercial UI can show contract lifecycle state, renewal window, exclusivity
  conflict and breach severity at Quick/Standard/Expert depth without changing
  the underlying settlement.
- If Investor is activated later, it posts clean singleplayer cash without
  debt, owner-control, fan, sponsor or multiplayer side effects.
- No real club, sponsor or player names are emitted into playable content.

## Dependencies

- [[../50-Game-Design/GD-0008-finance-economy]]
- [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
- [[../50-Game-Design/economy-system]]
- [[../60-Research/club-economy-blueprint-2026-05-27]]
- [[../60-Research/club-economy-impact-map-and-commercial-contracts-2026-05-28]]
- [[../60-Research/season-ticket-lifecycle-and-accounting-2026-05-28]]
- [[../60-Research/commercial-contract-lifecycle-and-breach-model-2026-05-28]]
- [[../60-Research/cup-and-competition-revenue-profiles-2026-05-28]]
- [[../60-Research/matchday-operating-costs-and-risk-cost-settlement-2026-05-29]]
- [[../60-Research/fan-service-campaign-catalog-and-effects-2026-06-01]]
- [[../60-Research/club-financing-tools-2026-06-01]]
- [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
- [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
- [[../30-Implementation/club-economy-commercial-contracts]]
