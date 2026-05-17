---
title: Game Design Hub
status: current
tags: [game-design, index]
created: 2026-05-15
updated: 2026-05-17
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

## Authority and decision records

Implement gameplay only from `approved` game-design records. This folder now has
two complementary record shapes:

- system and mode notes such as [[core-loop]], [[match-engine]], and
  [[transfer-market-and-contracts]];
- GDDRs (`GD-0001`...`GD-0016`), which preserve the decision-record chain from
  research into ADRs.

When an approved GDDR and an approved system note disagree, stop and supersede
one explicitly before implementation. `draft` records are planning context only.

| GDDR | System | Status | Feeds ADR |
|---|---|---|---|
| [[GD-0001-core-loop]] | Core career loop & weekly rhythm | approved | ADR-0003, ADR-0008 |
| [[GD-0002-match-engine]] | Match engine & simulation model | draft (Wave 2 gated) | ADR-0003, ADR-0005 |
| [[GD-0003-squad-players]] | Squad, players & attributes | approved | ADR-0004, ADR-0003 |
| [[GD-0004-tactics]] | Tactics & formations | approved | ADR-0003, ADR-0008 |
| [[GD-0005-training]] | Training & development | approved | ADR-0003 |
| [[GD-0006-transfers]] | Transfers & scouting | approved | ADR-0004 |
| [[GD-0007-youth]] | Youth academy | approved | ADR-0004, ADR-0007 |
| [[GD-0008-finance-economy]] | Finance, economy & stadium | approved | ADR-0004 |
| [[GD-0009-league-structure]] | League & competition structure | approved | ADR-0007, ADR-0004 |
| [[GD-0010-ai-world]] | AI managers & world simulation | draft (Wave 2 gated) | ADR-0003, ADR-0009 |
| [[GD-0011-career-progression]] | Career progression, board & objectives | approved | ADR-0003 |
| [[GD-0012-onboarding]] | Onboarding & new game | approved | ADR-0008, ADR-0006 |
| [[GD-0013-narrative-inbox]] | Narrative, inbox & events | approved | ADR-0006, ADR-0003 |
| [[GD-0014-save-career-model]] | Save & career model | approved | ADR-0002, ADR-0005 |
| [[GD-0015-ip-clean-data]] | IP-clean data generation | approved | ADR-0007 |
| [[GD-0016-mobile-ux-loop]] | Mobile UX gameplay loop | approved | ADR-0008, ADR-0010 |

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
- [[transfer-market-and-contracts]] - AI club selling, valuation bands, clause packages, player terms and tiered market simulation.
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
- [[../60-Research/player-strength-presentation]] - Impact Lens player-strength model; no global OVR.

## Status legend

- `approved` - binding. Implementation must follow.
- `draft` - design in progress; safe to plan from but expect changes.
- `superseded` - historical only; never implement from.

When status changes, also update [[../00-Index/Current-State]] and
[[../00-Index/Game-Design-Map]].
