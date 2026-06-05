---
title: Features
status: current
tags: [feature, index]
created: 2026-05-15
updated: 2026-06-05
type: index
binding: false
related: [[../00-Index/Feature-Map]], [[../00-Index/MVP-Scope]], [[../50-Game-Design/README]], [[../00-Index/Documentation-V1]], [[../60-Research/dialogue-intent-taxonomy-effect-matrix-2026-06-05]], [[../60-Research/statistics-analytics-read-model-owner-2026-06-05]], [[feature-statistics-analytics-hub-mvp]]
---

# Features

Each feature spec note is a focused, implementable slice. It links to:

- its parent game-design note or GDDR in [[../50-Game-Design/README]],
- the relevant ADR(s),
- the relevant research synthesis note(s),
- the Linear issue (when one exists).

Specs are `draft` until tied to an implementation beat. Promotion to
`approved` happens after Nico + the implementing agent agree on scope.
[[../00-Index/Documentation-V1]] classifies the remaining
stubs as future-scope planning, not open documentation gaps.

## Active MVP feature

- [[feature-roguelite-mvp-first-playable]] — approved first playable scope,
  amended with FMX-16 manager-archetype run-analysis hooks.
- [[feature-transfer-market-ai-and-contracts]] - approved transfer-market foundation and explanation layer.
- [[feature-club-economy-mvp-pillar]] - draft FMX-13 economy MVP pillar:
  weekly ledger, full accounting, commercial contracts and staged insolvency.
- [[feature-ai-narration-mvp-pillar]] - draft FMX-3 AI narration MVP pillar:
  Full Dialogue, All Active actor context, Narrative context framework,
  Playtest First, template fallback, Runtime-LLM gates and FMX-88 fallback
  manifest/no-export constraints, with FMX-87 finite dialogue intents and
  effect-owner matrix planning.
- [[feature-eos-player-skills-and-people-context]] - draft FMX-23 feature
  slice for player skills/perks, People context, persona context cards and
  GD-0021 decision-influence hooks.
- [[feature-statistics-analytics-hub-mvp]] - draft FMX-94 MVP Analytics Hub:
  Key Findings, Last Match, Team/Player Analysis, standings/leaders, form,
  comparison, maps/heatmaps and Manager & Legacy handoff snapshots.

Older feature stubs may contain historical "In scope (MVP)" headings. The
canonical MVP scope is [[../00-Index/MVP-Scope]]; use it before interpreting
those headings.

## Feature stubs (future-scope planning)

- [[feature-async-week-loop]] — post-MVP server-driven week cycle with two cadence rule sets.
- [[feature-stadium-builder]] — Anstoss-style on-grounds attractions + capacity tiers.
- [[feature-club-economy-mvp-pillar]] — Club Economy MVP pillar, including
  FMX-41 commercial impact hooks.
- [[feature-venue-operations]] — Non-matchday arena calendar with pitch, sponsor and fan trade-offs.
- [[feature-player-lifecycle]] — Weekly player development, PA uncertainty,
  mentoring and GD-0021 development-factor explanations.
- [[feature-training-medicine]] — Training load, readiness, multifactor injury
  risk, rehab and staff-pipeline quality hooks.
- [[feature-eos-player-skills-and-people-context]] — Player skills/perks plus
  People/persona context planning.
- [[feature-ai-narration-mvp-pillar]] — AI narration MVP pillar.
- [[feature-statistics-analytics-hub-mvp]] - MVP Analytics Hub and statistics.
- [[feature-systemic-event-director]] — Deterministic event orchestration across owning domains.
- [[feature-sponsorship-portfolio]] — Asset-level sponsor inventory + side conditions.
- [[feature-fan-ecology-ui]] — 6-segment supporter dashboard.
- [[feature-tactics-progressive-disclosure]] — Quick / Standard / Expert tactical UI.
- [[feature-watch-party]] — post-MVP scheduled spectator broadcasts with delay.
- [[feature-rivalry-system]] — Emergent five-sub-score rivalry graph.
- [[feature-matchday-event-engine]] — Rule-based events at match-days.
- [[feature-community-editor]] — post-MVP override-pack editor + importer.
- [[feature-p2p-transfer-negotiation]] — post-MVP human-to-human transfers with escalation.
