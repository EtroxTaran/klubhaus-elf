---
title: Feature - Club Economy MVP Pillar
status: draft
tags: [feature, mvp, economy, finance, accounting, club-management, fmx-13]
created: 2026-05-27
updated: 2026-05-27
type: feature
binding: false
linear: FMX-13
related:
  - [[README]]
  - [[../00-Index/MVP-Scope]]
  - [[../50-Game-Design/GD-0008-finance-economy]]
  - [[../50-Game-Design/economy-system]]
  - [[../60-Research/club-economy-blueprint-2026-05-27]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
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
- Minimum revenue streams: ticketing, season-ticket upfront cash, basic sponsor
  income, matchday catering, small merchandise, prize/bonus payments.
- Minimum costs: player/staff wages, stadium operations, travel, debt service,
  transfer instalments, maintenance and federation/league levy.
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
- Manual accounting journal editing.
- Visitor-level stadium operations simulation.
- All country-specific lower-tier rules beyond the documented profile hooks.

## Acceptance

- Weekly economy can be advanced deterministically for the same save state and
  seed.
- A post-match or post-week screen explains each material cash movement.
- Negative cash does not instantly end the run; the staged crisis flow is
  visible and recoverable until its final stage.
- Transfer offers and contracts can create future liabilities, not only
  immediate cash movement.
- Expert UI can distinguish liquidity, accounting result and compliance risk.
- No real club, sponsor or player names are emitted into playable content.

## Dependencies

- [[../50-Game-Design/GD-0008-finance-economy]]
- [[../50-Game-Design/economy-system]]
- [[../60-Research/club-economy-blueprint-2026-05-27]]
- [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
