---
title: GD-0007 Youth Academy
status: draft
tags: [game-design, gddr, youth]
created: 2026-05-17
updated: 2026-05-17
type: game-design
binding: false
related:
  - [[README]]
  - [[GD-0006-transfers]]
  - [[GD-0003-squad-players]]
  - [[../60-Research/anstoss-series-deep-dive]]
  - [[../60-Research/club-boss-analysis]]
  - [[../10-Architecture/09-Decisions/ADR-0004-data-model]]
  - [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]]
---

# GD-0007: Youth Academy

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

A long-horizon investment with real uncertainty — scouting a region, gambling
on a rating *range*, waiting seasons for a payoff.

## Decided / strong

- Intended model: **separate youth screen**, scout missions (~42 days), scout
  quality tied to staff salary, youth-investment slider, **promotion gate
  (player ≥17, two youth weeks)** (anstoss-series-deep-dive §3 "Youth").
- Adopt: **continent-targeted youth scouting**, "wonderkid"/"golden generation"
  archetypes, and a **rating *range*** on scouting reports (deliberate risk)
  (club-boss-analysis "Youth and scouting"; takeaway 4).
- Youth scouts are a discrete, **upgradeable** staff slot (club-boss-analysis
  "Staff"; takeaway 9).
- Youth promotions occur in the **post-season transfer window**
  (anstoss-series-deep-dive §4 season arc).

## Open (Wave 2)

- **R2-02 (critical)** — youth-prospect generation algorithm + age curve.
- **R2-06 (high)** — "rising youth nations" as part of dynamic-world drift.

## Rationale

Range-based scouting + long gates make youth a strategic bet, not a slot
machine (club-boss-analysis takeaway 4).

## Consequences

Positive:

- A multi-season investment loop that rewards patience.

Negative / constraints:

- Generation algorithm undefined (R2-02) → blocks ADR-0004 youth schema.

## Supersedes

None

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0004-data-model]] (youth/prospect schema, scouting RELATE)
- [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]] (generated youth names)
## Related

- [[README]]
- [[GD-0006-transfers]]
- [[GD-0003-squad-players]]
- [[../60-Research/anstoss-series-deep-dive]]
- [[../60-Research/club-boss-analysis]]
- [[../10-Architecture/09-Decisions/ADR-0004-data-model]]
- [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]]
