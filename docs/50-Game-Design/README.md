---
title: Game Design Hub
status: current
tags: [game-design, index]
created: 2026-05-15
updated: 2026-05-28
type: index
binding: false
related: [[../00-Index/Game-Design-Map]], [[../00-Index/Current-State]], [[../00-Index/Documentation-V1]]
---

# Game Design Hub

> **2026-05-27 — All game-design decisions reopened.** Every GDDR and system
> note previously `approved` was reset to `status: draft` for re-evaluation.
> **Nothing here is currently binding;** records will be re-approved
> individually after review. The Status column and "approved" wording below
> reflect the pre-reopen state and are being revisited.

Working game-design notes for soccer-manager. Treat this folder as the GDD:
one note per system + mode + emergent system. Notes are `draft` unless the
status field says otherwise; `approved` notes are binding for implementation.
[[../00-Index/Documentation-V1]] classifies non-approved notes
as future-scope or historical planning unless they are promoted in
[[../00-Index/Current-State]].

Research input for every note lives in [[../60-Research/00-summary]]; raw
research transcripts in [[../60-Research/raw-perplexity/README]].

## Authority and decision records

Implement gameplay only from `approved` game-design records. This folder has two
complementary record shapes:

- **GDDRs** (`GD-0001`...`GD-0020`) — the decision-record chain from research into
  ADRs (the *what was decided and why*);
- **system and mode notes** such as [[core-loop]], [[match-engine]], and
  [[transfer-market-and-contracts]] — the detailed system specs (the *how it
  works in depth*).

### Which document is binding (precedence)

A junior should never have to guess. Apply this order:

1. **Status wins first.** An `approved` record is binding; a `draft`/`superseded`
   record is never implementation authority — even on the same topic. So if a
   GDDR is `draft` but its system note is `approved` (or vice-versa), the
   **`approved` one is binding** regardless of shape.
2. **If both are `approved`**, the **GDDR is the decision of record** and the
   **system note is the detailed spec**; read both, and they must agree. A
   conflict between two `approved` records is a **stop condition** — escalate and
   supersede one explicitly before implementing; do not average them.
3. The authoritative list of what is currently approved/binding lives in
   [[../00-Index/Game-Design-Map]].

**Known overlapping topics (read this so you are not surprised):**

| Topic | Binding document | Do NOT implement from |
|---|---|---|
| Match engine & simulation | [[match-engine]] (`approved`) | [[GD-0002-match-engine]] (`draft`, Wave-2 gated) |
| Core career loop | [[GD-0001-core-loop]] (`approved`) | [[core-loop]] (`draft` context note) |
| AI managers & world | — (none binding yet) | [[GD-0010-ai-world]] (`draft`, Wave-2 gated) |

For every other topic both records are `approved` and complementary (GDDR =
decision, system note = spec). `draft` records are planning context only; as of
2026-05-22 the MVP gameplay surface is fully covered by the approved/current
notes in [[../00-Index/Game-Design-Map]], so remaining `draft` labels are not
active work.

| GDDR | System | Status | Feeds ADR |
|---|---|---|---|
| [[GD-0001-core-loop]] | Core career loop & weekly rhythm | draft | ADR-0003, ADR-0008 |
| [[GD-0002-match-engine]] | Match engine & simulation model | draft (Wave 2 gated) | ADR-0003, ADR-0005 |
| [[GD-0003-squad-players]] | Squad, players & attributes | draft | ADR-0027, ADR-0003 |
| [[GD-0004-tactics]] | Tactics & formations | draft | ADR-0003, ADR-0008 |
| [[GD-0005-training]] | Training & development | draft | ADR-0003 |
| [[GD-0006-transfers]] | Transfers & scouting | draft | ADR-0027 |
| [[GD-0007-youth]] | Youth academy | draft | ADR-0027, ADR-0007 |
| [[GD-0008-finance-economy]] | Finance, economy & stadium; FMX-13 weekly ledger / full-accounting draft | draft | ADR-0027, ADR-0050 |
| [[GD-0009-league-structure]] | League & competition structure | draft | ADR-0007, ADR-0027 |
| [[GD-0010-ai-world]] | AI managers & world simulation | draft (Wave 2 gated) | ADR-0003, ADR-0009 |
| [[GD-0011-career-progression]] | Career progression, board & objectives | draft | ADR-0003 |
| [[GD-0012-onboarding]] | Onboarding & new game | draft | ADR-0008, ADR-0006 |
| [[GD-0013-narrative-inbox]] | Narrative, inbox & events | draft | ADR-0006, ADR-0003 |
| [[GD-0014-save-career-model]] | Save & career model | draft | ADR-0020, ADR-0005 |
| [[GD-0015-ip-clean-data]] | IP-clean data generation | draft | ADR-0007 |
| [[GD-0016-mobile-ux-loop]] | Mobile UX gameplay loop | draft | ADR-0008, ADR-0010 |
| [[GD-0017-mvp-scope-and-mode-sequencing]] | MVP scope & mode sequencing | draft | ADR-0020 |
| [[GD-0018-ai-narrative-personas-and-dialogue]] | AI narrative personas, Full Dialogue, All Active actor context, Narrative context and Playtest First evaluation | draft | ADR-0030, ADR-0054 |
| [[GD-0019-manager-archetype-roguelite-progression]] | Manager archetype roguelite progression; FMX-16 hooks, playtest-tunable taxonomy and prestige counterweight | draft | ADR-0051 |
| [[GD-0020-eos-player-skills-personas-and-people]] | EOS player skills/perks, staff target skills, personas and People-context planning | draft | ADR-0052 |

## Core loop

- [[core-loop]] - season arc, weekly heartbeat, day ticks.
- [[club-dna-and-governance]] - 7 DNA parameters + board+fans split confidence.
- [[system-interplay]] - the 5 master feedback loops.

## Economy and infrastructure

- [[economy-system]] - cash-flow, budget pots, KPIs.
- [[sponsorship-portfolio]] - 4-tier sponsor inventory at asset level.
- [[stadium-and-campus]] - stadium tiers + Anstoss-style attractions + club campus.
- [[../20-Features/feature-club-economy-mvp-pillar]] - draft MVP economy pillar for weekly ledger, full accounting and staged insolvency.

## Fans and brand

- [[fan-ecology]] - 6 supporter segments + atmosphere engine.

## Sporting core

- [[squad-and-club-structure]] - sporting org roles + squad design dimensions.
- [[scouting-and-recruitment]] - recruitment funnel + scout attributes + market dynamics.
- [[transfer-market-and-contracts]] - AI club selling, valuation bands, clause packages, player terms and tiered market simulation.
- [[youth-academy-and-development]] - CA/PA range, age curves, loan rules.
- [[training-load-and-medicine]] - training blocks, load model, medical pipeline.
- [[GD-0020-eos-player-skills-personas-and-people]] - draft EOS player
  skills/perks, staff target skills and persona/relationship model.

## Tactics and match

- [[tactics-system]] - Position+Role+Duty+Instructions+Traits model, tactical familiarity.
- [[set-pieces]] - corners, FKs, penalties, throw-ins as a sub-system.
- [[match-engine]] - 2D event-based engine spec.

## Modes

- [[mode-create-a-club-roguelite]] - MVP first playable; permadeath + soft carries.
- [[GD-0019-manager-archetype-roguelite-progression]] - draft Manager & Legacy
  progression hooks for Create-a-Club Roguelite.
- [[mode-manage-a-club-career]] - Anstoss-2 "real manager career" + split confidence; visible as "comes later" in MVP.
- [[singleplayer-baseline]] - the full reference experience.
- [[async-multiplayer-private-group]] - 2 cadence rule sets + transfer escalation.
- [[watch-party-and-conference]] - synchronous emotional spikes.
- [[transfer-negotiations-p2p]] - human-to-human transfers with deadlines + escalation.

## Environment and emergent systems

- [[regulations-and-compliance]] - promotion-gated stadium / ops requirements.
- [[rivalry-system]] - emergent rivalry score with 5 sub-scores.
- [[matchday-event-engine]] - rule-based events with trigger / probability / effect / prevention.
- [[community-editor-and-datasets]] - override pack model with manifests.

## Narrative and AI

- [[GD-0013-narrative-inbox]] - inbox-as-feed, narrative events and press/newspaper baseline.
- [[GD-0018-ai-narrative-personas-and-dialogue]] - draft persona, Full
  Dialogue, Narrative context and Playtest First evaluation layer.
- [[GD-0020-eos-player-skills-personas-and-people]] - draft People/persona
  context cards and relationship constellations that feed dialogue.

## UX

- [[progressive-disclosure-ui]] - 3-tier UX (Quick / Standard / Expert).
- [[../60-Research/player-strength-presentation]] - Impact Lens player-strength model; no global OVR.
- [[GD-0017-mvp-scope-and-mode-sequencing]] - binding MVP mode sequencing.

## Status legend

- `approved` - binding. Implementation must follow.
- `draft` - future-scope or historical planning; not implementation authority
  and not active work unless re-opened by [[../00-Index/Documentation-V1]].
- `superseded` - historical only; never implement from.

When status changes, also update [[../00-Index/Current-State]] and
[[../00-Index/Game-Design-Map]].
