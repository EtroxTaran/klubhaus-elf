---
title: GD-0013 Narrative, Inbox & Events
status: approved
tags: [game-design, gddr, narrative]
created: 2026-05-17
updated: 2026-05-17
type: game-design
binding: true
related: [[README]], [[GD-0006-transfers]], [[GD-0015-ip-clean-data]], [[../60-Research/club-boss-analysis]], [[../60-Research/anstoss-series-deep-dive]], [[../60-Research/research-wave-2-gaps]], [[../10-Architecture/09-Decisions/ADR-0006-i18n]], [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]]
---

# GD-0013: Narrative, Inbox & Events

## Status

approved

> **Approved** — the **Decided / strong** section is ratified design
> direction; an ADR or implementation must not contradict it. The
> **Open (Wave 2)** items are NOT approved and not implementable until
> Wave 2 research closes.

## Date

2026-05-17

## Player experience goal

One warm, slightly tabloid feed that turns admin into stories — humour in the
copy, never in the mechanics.

## Decided / strong

- **Inbox-as-feed is the unified narrative engine**: one queue for scouting,
  bids, contracts, sponsors, board feedback; Dexie-backed, offline-survivable;
  feed cards with **Accept / Decline / Defer / Snooze**
  (club-boss-analysis takeaway 2; anstoss-series-deep-dive §7 rec. 9).
- **Humour in copy, not mechanics**: keep the Anstoss tabloid/parodic warm
  tone; personality traits (`smoker`, `prankster`, `homesick`) seed stories
  (anstoss-series-deep-dive §2 item 2, §5 takeaway 9, §6 "Tone").
- Press conferences with **100+ keyed responses** are **post-MVP** (Anstoss had
  600+/2400+) (anstoss-series-deep-dive §3, §7 post-MVP 16).
- Media/PR affects morale, fan mood, board pressure; concrete Anstoss anchors:
  ideal motivation ~110, praise effective only when form ≥11
  (anstoss-series-deep-dive §3 "Media & PR", "Fan & morale").
- **Hard content boundary** — excluded: doping mini-game, "Babe of the Month",
  "schwarze Kasse"/illegal accounting, gambling-style sponsor draws
  (anstoss-series-deep-dive §5 takeaway 9, §6 "Hard boundaries").

## Open (Wave 2)

- **R2-15 (high)** — authoring format, ICU MessageFormat keys, event-family
  taxonomy → feed-card actions, deterministic seeding (ties R2-08), translator
  hand-off, Anstoss-tone portable-vs-toxic audit.
- **R2-10 (medium)** — de-DE tabloid tone vs en-GB drier register.

## Rationale

A single feed is the cheapest, most scalable narrative surface; tone is
portable, the toxic Anstoss bits are not (anstoss-series-deep-dive §5/§6).

## Consequences

Positive:

- One scalable story surface; legally safe humour.

Negative / constraints:

- Authoring pipeline + tone undefined (R2-15/R2-10).

## Supersedes

None

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0006-i18n]] (keyed copy, ICU)
- [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]] (IP-clean content)

## Related

- Research: [[../60-Research/club-boss-analysis]] · [[../60-Research/anstoss-series-deep-dive]] · [[../60-Research/research-wave-2-gaps]]
- [[README]] — hub · siblings: [[GD-0006-transfers]] · [[GD-0015-ip-clean-data]] · [[GD-0011-career-progression]]
