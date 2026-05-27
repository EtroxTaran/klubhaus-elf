---
title: GD-0003 Squad, Players & Attributes
status: draft
tags: [game-design, gddr, squad]
created: 2026-05-17
updated: 2026-05-17
type: game-design
binding: false
related:
  - [[README]]
  - [[GD-0005-training]]
  - [[GD-0006-transfers]]
  - [[../60-Research/anstoss-series-deep-dive]]
  - [[../60-Research/club-boss-analysis]]
  - [[../10-Architecture/09-Decisions/ADR-0004-data-model]]
  - [[../10-Architecture/modules/db-schema]]
---

# GD-0003: Squad, Players & Attributes

> **REOPENED on 2026-05-27:** This game-design note is `draft` again. Any `approved`, `binding`, or `locked` wording below is historical pre-reopen context until Nico re-approves it.

## Status

approved

> **Approved** — the **Decided / strong** section is ratified design
> direction; an ADR or implementation must not contradict it. The
> **Open (Wave 2)** items are NOT approved and not implementable until
> Wave 2 research closes.

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

- [[README]]
- [[GD-0005-training]]
- [[GD-0006-transfers]]
- [[../60-Research/anstoss-series-deep-dive]]
- [[../60-Research/club-boss-analysis]]
- [[../10-Architecture/09-Decisions/ADR-0004-data-model]]
- [[../10-Architecture/modules/db-schema]]
