---
title: Game Design Hub
status: current
tags: [game-design, index]
created: 2026-05-15
updated: 2026-05-16
type: index
binding: false
related: [[../00-Index/Game-Design-Map]], [[../00-Index/Current-State]]
---

# Game Design Hub

Working game-design notes for soccer-manager. Treat this folder as the GDD:
one note per system + mode + emergent system. Notes are `draft` unless the
status field says otherwise; `approved` notes are binding for implementation.

Research input for every note lives in [[../60-Research/]]; raw research
transcripts in [[../60-Research/raw-perplexity/README]].

## Core loop

- [[core-loop]] - season arc, weekly heartbeat, day ticks.
- [[club-dna-and-governance]] - 7 DNA parameters + board+fans split confidence.
- [[system-interplay]] - the 5 master feedback loops.

## Economy and infrastructure

- [[economy-system]] - cash-flow, budget pots, KPIs.
- [[sponsorship-portfolio]] - 4-tier sponsor inventory at asset level.
- [[stadium-and-campus]] - stadium tiers + Anstoss-style attractions + club campus.

## Fans and brand

- [[fan-ecology]] - 6 supporter segments + atmosphere engine.

## Sporting core

- [[squad-and-club-structure]] - sporting org roles + squad design dimensions.
- [[scouting-and-recruitment]] - recruitment funnel + scout attributes + market dynamics.
- [[youth-academy-and-development]] - CA/PA range, age curves, loan rules.
- [[training-load-and-medicine]] - training blocks, load model, medical pipeline.

## Tactics and match

- [[tactics-system]] - Position+Role+Duty+Instructions+Traits model, tactical familiarity.
- [[set-pieces]] - corners, FKs, penalties, throw-ins as a sub-system.
- [[match-engine]] - 2D event-based engine spec.

## Modes

- [[mode-create-a-club-roguelite]] - permadeath + soft carries.
- [[mode-manage-a-club-career]] - Anstoss-2 "real manager career" + split confidence.
- [[singleplayer-baseline]] - the full reference experience.
- [[async-multiplayer-private-group]] - 2 cadence rule sets + transfer escalation.
- [[watch-party-and-conference]] - synchronous emotional spikes.
- [[transfer-negotiations-p2p]] - human-to-human transfers with deadlines + escalation.

## Environment and emergent systems

- [[regulations-and-compliance]] - promotion-gated stadium / ops requirements.
- [[rivalry-system]] - emergent rivalry score with 5 sub-scores.
- [[matchday-event-engine]] - rule-based events with trigger / probability / effect / prevention.
- [[community-editor-and-datasets]] - override pack model with manifests.

## UX

- [[progressive-disclosure-ui]] - 3-tier UX (Quick / Standard / Expert).

## Status legend

- `approved` - binding. Implementation must follow.
- `draft` - design in progress; safe to plan from but expect changes.
- `superseded` - historical only; never implement from.

When status changes, also update [[../00-Index/Current-State]] and
[[../00-Index/Game-Design-Map]].
