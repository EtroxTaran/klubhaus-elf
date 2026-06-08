---
title: GD-0003 Squad, Players & Attributes
status: accepted
tags: [game-design, gddr, squad]
created: 2026-05-17
updated: 2026-06-08
type: game-design
binding: false
related: [[README]], [[GD-0005-training]], [[GD-0006-transfers]], [[GD-0021-player-staff-development-and-decision-influence]], [[../60-Research/anstoss-series-deep-dive]], [[../60-Research/club-boss-analysis]], [[../60-Research/data-generators]], [[../60-Research/player-staff-development-decision-model-2026-05-28]], [[../10-Architecture/09-Decisions/ADR-0004-data-model]], [[../10-Architecture/modules/db-schema]]
---

# GD-0003: Squad, Players & Attributes

## Status

draft

> **Reopened draft.** This record contains historical pre-Wave-2 wording. The
> current player data baseline is 16 visible outfield attributes + 4 GK extras
> + 8 hidden meta on a 1-20 scale from [[../60-Research/data-generators]],
> [[tactics-system]] and
> [[GD-0021-player-staff-development-and-decision-influence]]. Do not implement
> the older 1-10 strength compression language without a new owner decision.

## Date

2026-05-17

## Player experience goal

Players legible at a glance on a phone, with enough personality to generate
stories — not a desktop spreadsheet.

## Decided / strong

- **Compressed rating scale: 1–10 strength + 4 talent buckets** (tighter than
  Anstoss' 1–13 / 5-tier, for mobile readability and determinism)
  (anstoss-series-deep-dive §7 rec. 2; §6 "Player rating compression").
- Player data renders as **compact player cards on phones**, never a desktop
  data grid (anstoss-series-deep-dive §5 takeaway 4).
- **8–12 flavour personality traits** (e.g. `smoker`, `prankster`, `homesick`)
  trimmed from Anstoss' ~32, driving narrative events
  (anstoss-series-deep-dive §6, §7 post-MVP 13).
- Individual injury proneness; star/talent + current rating; development via
  training (club-boss-analysis "Squad and players").
- **Persistent legacy artefacts** — most-capped, all-time top scorer, most
  expensive signing/sale, hall of fame, lifetime stats — survive player
  turnover ("retention gold") (club-boss-analysis takeaway 5).

## Open (Wave 2)

- **R2-02 (critical)** — attribute generation, age-curve generator, the actual
  entity attribute set.
- **R2-14 (critical)** — concrete `player` table schema (record-link vs
  embedded). ADR-0004 states the attribute set is unstable until Wave 2.

## Rationale

Compression and cards keep the squad scannable one-handed; traits make turnover
narratively interesting (anstoss-series-deep-dive §6).

## Consequences

Positive:

- Mobile-legible, deterministic, story-generating squad.

Negative / constraints:

- Exact attributes unknown until R2-02/R2-14 → blocks ADR-0004.

## Supersedes

None

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0004-data-model]]
- [[../10-Architecture/09-Decisions/ADR-0003-match-engine]] (attribute inputs)

## Related

- Research: [[../60-Research/anstoss-series-deep-dive]] · [[../60-Research/club-boss-analysis]]
- Module: [[../10-Architecture/modules/db-schema]]
- [[README]] — hub · siblings: [[GD-0005-training]] · [[GD-0006-transfers]] · [[GD-0007-youth]]
