---
title: GD-0002 Match Engine & Simulation Model
status: draft
tags: [game-design, gddr, match-engine, spatial-event]
created: 2026-05-17
updated: 2026-06-02
type: game-design
binding: false
related: [[README]], [[match-engine]], [[GD-0004-tactics]], [[GD-0010-ai-world]], [[../60-Research/swappable-spatial-event-match-engine-2026-05-27]], [[../60-Research/anstoss-series-deep-dive]], [[../95-Archive/gap-reports/research-wave-2-gaps]], [[../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]], [[../10-Architecture/09-Decisions/ADR-0003-match-engine]], [[../10-Architecture/modules/match-engine]]
---

# GD-0002: Match Engine & Simulation Model

## Status

draft

## Date

2026-05-17

## Player experience goal

A match that feels consequential, tactically legible and reproducible: readable
as a 30-second text feed, a 2D top-down match, a live ticker or a replay, all
from the same committed event/spatial truth.

## Decided / strong

- Engine model = **server-authoritative spatial-event**, not outcome-first and
  not full 22-agent continuous simulation at MVP.
- Engine implementation is **replaceable** behind the ADR-0049 port. TypeScript
  is allowed as a reference/spike adapter; Rust native is the default
  production candidate if the TS-vs-Rust spike shows no clear disadvantage.
- Event log + spatial samples are the single source for 2D Canvas, ticker,
  replay, reports and LLM commentary inputs.
- Star players must be visible through action selection, involvement and
  outcome quality, not only ratings.
- Local match runs are non-binding in the hybrid-online MVP unless a later
  ADR/GDDR grants selective offline authority.
- Day-ticks in a 7-day cycle **plus a match-tick** (anstoss-series-deep-dive
  §7 rec. 1).
- Presentation tiers: **highlights + 2D ticker for MVP; defer 3D** (post-MVP,
  perf-flagged); three tiers, not four (anstoss-series-deep-dive §5 takeaway 2,
  §7 rec. 3).
- **Halftime is a 30-second modal** (formation, mentality, one-tap sub; deeper
  under "More") (anstoss-series-deep-dive §5 takeaway 5, §7 rec. 4).
- **Pre-match comparison view** (own vs opponent stat strips) manufactures
  stakes cheaply (club-boss-analysis takeaway 3).
- Offline manager-week remains A -> C: drafts and command-first contracts now;
  local-authoritative match resolution only after future approval.

## Open / spike gates

- TS-vs-Rust contract spike: same input fixtures, seeds, event log and spatial
  samples.
- Numeric representation: fixed-point vs quantized floats.
- Minimum spatial sample density per quality profile.
- Statistical envelopes for tactics, star-player involvement, xG, pressing,
  cards, injuries and background-fast compatibility.
- Exact disconnect timers and pause budgets must stay aligned with the
  architecture state machines.

## Rationale

Spatial-event is the smallest model that can make tactical decisions, star
players and the 2D view feel causally connected. A swappable engine boundary
prevents early runtime choices from trapping future scale or realism work.

## Consequences

Positive:

- Reproducible matches; testable in isolation; offline-safe.
- 2D, ticker, replay and reports remain consistent.
- Runtime can move from prototype to Rust service without changing gameplay
  consumers.

Negative / constraints:

- Requires contract work before engine implementation.
- Requires statistical validation, not only unit tests.
- Runtime-LLM ticker remains cosmetic and cannot influence gameplay.

## Set-piece variant selection determinism (accepted, FMX-70)

> **Status: accepted** (ratified Nico 2026-06-02) — pins the previously-undefined `set-pieces.md` §7
> `variant = …select(context)` seam (audit gap G9). Canonical spec + invariants +
> open questions: [[../10-Architecture/09-Decisions/ADR-0067-set-piece-variant-selection-determinism]];
> determinism-contract amendment in
> [[../10-Architecture/09-Decisions/ADR-0026-match-frame-contract]];
> `TacticSnapshot` fields in
> [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]].

When multiple authored set-piece variants satisfy their triggers at a dead-ball,
the engine selects one by a **pure function** of the frozen `TacticSnapshot`, the
dead-ball context, a derived `deadBallIndex`, and (only in `seeded-mix` mode) a
seeded draw — never hidden state. Algorithm: filter eligible variants by trigger
→ sort `(priority DESC, variantId ASC)` → `priority` mode picks the top;
`seeded-mix` mode picks a seeded index over the eligible set.

**Worked example — offensive corner, `deadBallIndex = 3`, two eligible variants:**

```text
Snapshot module 'offensive-corner':
  selectionMode = 'priority'              # the casual default
  variants (after trigger filter, both eligible at this dead-ball):
    { variantId: "far-post",  priority: 80 }
    { variantId: "short",     priority: 80 }   # tie on priority
  ordered by (priority DESC, variantId ASC) → ["far-post", "short"]
  → priority mode selects ordered[0] = "far-post"   # tie broken by variantId

Same module, but selectionMode = 'seeded-mix':
  seed = splitmix64(matchSeed ^ H("SETPIECE_VARIANT") ^ HOME ^ OFF_CORNER ^ 3)
  i    = Rng(seed).uniformInt(0, 1)        # over ["far-post", "short"]
  → selects ordered[i]   # reproducible on every replay from (matchSeed, side, type, deadBallIndex)
```

`deadBallIndex` (= prior offensive corners for this side since kickoff) is
recovered by folding the event log forward during resim — no stored counter. The
result is identical on every replay of the same seed, so a corner that scores in
one viewing scores in every replay.

## Supersedes

None

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]]
- [[../10-Architecture/09-Decisions/ADR-0003-match-engine]] (historical planning target)
- [[../10-Architecture/09-Decisions/ADR-0005-save-format]] (replay/determinism)
- [[../10-Architecture/09-Decisions/ADR-0067-set-piece-variant-selection-determinism]] (proposed — set-piece selection determinism, G9)

## Related

- Research: [[../60-Research/swappable-spatial-event-match-engine-2026-05-27]] ·
  [[../60-Research/anstoss-series-deep-dive]] · [[../95-Archive/gap-reports/research-wave-2-gaps]]
- Module: [[../10-Architecture/modules/match-engine]]
- [[README]] — hub · siblings: [[GD-0001-core-loop]] · [[GD-0004-tactics]] · [[GD-0010-ai-world]]
