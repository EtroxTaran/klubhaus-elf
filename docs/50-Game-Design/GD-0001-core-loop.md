---
title: GD-0001 Core Career Loop & Weekly Rhythm
status: draft
tags: [game-design, gddr, loop]
created: 2026-05-17
updated: 2026-05-17
type: game-design
binding: true
related: [[README]], [[GD-0011-career-progression]], [[GD-0016-mobile-ux-loop]], [[../60-Research/anstoss-series-deep-dive]], [[../60-Research/club-boss-analysis]], [[../10-Architecture/09-Decisions/ADR-0003-match-engine]]
---

# GD-0001: Core Career Loop & Weekly Rhythm

## Status

approved

> **Approved** — the **Decided / strong** section is ratified design
> direction; an ADR or implementation must not contradict it. The
> **Open (Wave 2)** items are NOT approved and not implementable until
> Wave 2 research closes.

## Date

2026-05-17

## Player experience goal

A predictable Monday-to-Sunday heartbeat the player can speed through or lean
into — one "advance" verb, sessions from 30 seconds to 20 minutes on the same UI.

## Decided / strong

- Model the game week as **7 day-ticks plus a separate match-tick**; the UI
  exposes a single "advance" verb; any task the player did not customise is
  fast-forwarded (the primary interaction, above any sub-screen)
  (anstoss-series-deep-dive §4, §7 rec. 1; §5 takeaway 3).
- Canonical standard league week: Mon recap/media/board pulse → Tue light
  training + individual focus → Wed tactical training + injury check → Thu
  scouting/transfer triage → Fri tactic lock + press → Sat **matchday** → Sun
  regen, fan mood, finance tick (anstoss-series-deep-dive §4).
- Season arc: **~7-week pre-season** (conditioning + chemistry) → league weeks
  (1 match/wk) → optional midweek cup → winter break (mini pre-season) → season
  review + board verdict → transfer window + youth promotions → next pre-season
  (anstoss-series-deep-dive §4).
- **Pre-season is an explicit gated phase** — friendlies and camps only, no
  league fixtures (anstoss-series-deep-dive §7 rec. 8).
- Mobile inner loop: open inbox → triage → adjust squad/training/ticket price →
  play match → watch event log → result + table delta → optional drill-down
  (club-boss-analysis "Inner loop", takeaway 1).

## Open (Wave 2)

- `tick` (engine) vs `day` (UI) terminology to be disambiguated in the glossary
  (research-wave-2-gaps R2-19). No other loop item is explicitly open.

## Rationale

The weekly heartbeat is one of the five "Anstoss feeling" qualities the project
intends to preserve; a single advance verb keeps it playable in 30 seconds
(anstoss-series-deep-dive §2 item 4, §6 "Pacing").

## Consequences

Positive:

- One coherent pacing model for every session length.

Negative / constraints:

- The match-tick vs day-tick split is a hard constraint on the engine
  (GD-0002 / ADR-0003) and the save model.

## Supersedes

None

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0003-match-engine]] (match-tick model)
- [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]] (single advance verb)

## Related

- Research: [[../60-Research/anstoss-series-deep-dive]] · [[../60-Research/club-boss-analysis]]
- [[README]] — Game Design Log (hub) · siblings: [[GD-0011-career-progression]] · [[GD-0016-mobile-ux-loop]] · [[GD-0002-match-engine]]
