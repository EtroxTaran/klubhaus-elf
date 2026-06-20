---
title: GD-0002 Match Engine & Simulation Model
status: accepted
tags: [game-design, gddr, match-engine, spatial-event, accepted]
context: match
created: 2026-05-17
updated: 2026-06-19
type: game-design
binding: true
related: [[README]], [[match-engine]], [[GD-0004-tactics]], [[GD-0010-ai-world]], [[../60-Research/swappable-spatial-event-match-engine-2026-05-27]], [[../60-Research/anstoss-series-deep-dive]], [[../95-Archive/gap-reports/research-wave-2-gaps]], [[../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]], [[../10-Architecture/09-Decisions/ADR-0003-match-engine]], [[../10-Architecture/modules/match-engine]]
---

# GD-0002: Match Engine & Simulation Model

> **RATIFIED on 2026-06-19.** Nico approved the linked FMX decision
> queue via `APPROVE ALL RECOMMENDED`; this game-design record is now
> binding according to its approved scope.


## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `draft`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

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

> **FMX-133 proposed closure packet (2026-06-13, accepted by Nico 2026-06-19).**
> [[GD-0042-match-engine-core-model-and-calibration]] prepares the remaining
> match-model and calibration decisions as a non-binding D1-D6 packet. The
> ADR-0096 runtime/numeric closures below are already accepted; the GD-0042
> model/calibration closures remain gated until Nico approves them. If approved,
> GD-0042 supersedes the relevant open gates without changing this GDDR's
> original spatial-event direction.

- TS-vs-Rust contract spike: **closed architecturally by
  [[../10-Architecture/09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface|ADR-0096]]**
  (single Rust-authored WASM module everywhere); no longer a GD-0002 gameplay
  fork.
- Numeric representation: **closed by ADR-0096** as mandatory integer/fixed-point
  replay-bearing math. FMX-133 must not reopen fixed-point vs quantized-float.
- Minimum spatial sample density per quality profile: proposed in
  [[GD-0042-match-engine-core-model-and-calibration]] D4 as event anchors + 1 Hz
  for `competitive-full`, event anchors + 0.33 Hz for `interactive-standard`,
  and no renderable spatial track for background profiles by default.
- Statistical envelopes for tactics, star-player involvement, xG, pressing,
  cards, injuries and background-fast compatibility: proposed in GD-0042 D3/D5.
- Exact disconnect timers and pause budgets stay aligned with the architecture
  state machines and remain outside FMX-133; GD-0035/ADR-0087 own live-control
  and watch-party pause rules.

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
