---
title: "RAW — Scheduled-time vs cadence deadline reconciliation in async/turn-based games (FMX-102)"
status: raw
tags: [research, raw, perplexity, deadlines, async-multiplayer, games, prior-art, scheduling, fmx-102]
created: 2026-06-07
updated: 2026-06-07
type: research
related:
  - [[../fmx-102-async-escalation-and-deadline-source-of-truth-2026-06-07]]
---

> Unprocessed Perplexity transcript. Synthesised into
> [[../fmx-102-async-escalation-and-deadline-source-of-truth-2026-06-07]].
> Do not implement from raw. Captured 2026-06-07 for FMX-102 (gap G25, deadline half).
> NOTE: the model flagged that its sources directly support the general async pattern but do NOT
> document every named commercial title — treat game-specific claims as informed domain knowledge.

## Prompt

**System:** You are a game-design researcher focused on asynchronous, play-by-email, and turn-based
multiplayer games. Give concrete examples of how specific shipped games/servers handle scheduling and
deadlines. Cite where possible.

**User:** How do asynchronous and turn-based multiplayer games reconcile a FIXED scheduled event time
against a regular turn/deadline cadence for the SAME event? Concrete examples wanted: play-by-email
games and adjudication servers; Diplomacy servers (e.g. webDiplomacy / backstabbr) where players can
agree to process a turn early or at a set time; Hattrick / Online Soccer Manager / other online
football-manager games with scheduled matches and weekly cadence; correspondence chess (lichess/
chess.com) combining per-move and total clocks; and any sports sims where a scheduled 'live' broadcast
overrides a regular weekly tick. When players schedule a specific time for a match/turn, does that
time OVERRIDE the regular deadline, ADD an extra deadline layer, or DEFER the regular processing for
that item? How is the resulting single 'source of truth' deadline communicated to players so there is
no ambiguity or conflicting deadlines for the same fixture, and how do these systems prevent a
scheduled time from being changed at the last minute (lock-in at schedule time)?

## Response

In most shipped async/turn-based systems, a **scheduled time usually does not replace the underlying
deadline logic outright**; instead, the game defines a single authoritative "next processing time"
that is either the **earliest trigger** among player-set schedules and the regular cadence, or a
**locked-in processing timestamp** that supersedes the default cadence for that specific fixture. The
cleanest systems make that single source of truth visible to players as **one** displayed
"processing at" time, not two competing deadlines, and they typically **freeze/version** the schedule
once confirmed so late edits cannot create ambiguity.

Three interaction patterns:
- **Override model:** a user-scheduled time becomes the only effective time for that fixture,
  replacing the standard tick/deadline for that item.
- **Additive model:** the scheduled time becomes an extra eligible processing moment, but the regular
  deadline still exists as a fallback.
- **Deferral model:** the regular cadence remains the master clock; the scheduled time merely
  delays/advances the item within that cadence window.

Per-example (informed domain knowledge where sources don't cover the title):
- **Play-by-email / adjudication servers:** separate *move submission* from *adjudication*; the
  authoritative deadline is the **adjudication cutoff stored server-side**, not the client display.
- **Diplomacy (webDiplomacy / Backstabbr):** fixed phase deadline **plus** earlier processing when all
  orders are in — the "process now" condition acts like an **override** for that phase, with the
  original deadline as fallback.
- **Hattrick / Online Soccer Manager:** weekly fixture cadence; a scheduled match time is usually the
  **authoritative kickoff** for that fixture (override), while league/season ticks govern the rest.
- **Correspondence chess (lichess/chess.com):** per-move clock / timeout window; each move deadline is
  computed from the move clock and updates after every move — additive/deferred (the move timer is the
  source of truth for the current ply).
- **Sports sims with "live" broadcasts:** the live slot normally becomes the authoritative processing
  time for that event (override); the weekly sim handles the rest of the universe.

**How systems avoid ambiguity:**
- Store **one canonical timestamp** server-side for the next actionable event, even if the UI shows
  multiple concepts ("turn deadline," "match time," "earliest processing").
- **Recompute the displayed time from server state** after every relevant change; clients don't track
  competing clocks independently.
- **Lock-in rules:** once a player schedules a time, the server records it as the active fixture time
  and **rejects conflicting edits** after a cutoff or once all parties confirm.
- Distinguish **submission deadline** vs **resolution time**: players submit before the deadline;
  resolution happens at the canonical scheduled time or the regular tick per the rules.

Photon's async/turn-based docs are the clearest source on the **server-side shape**: games stored in
rooms, resumed later, driven by external services/webhooks so the **server (not the client) owns
persistence and processing** — exactly the "one source of truth" architecture you want for deadlines.

Citations:
[1] https://doc.photonengine.com/server/v4/applications/loadbalancing/async-and-turnbased
[2] https://www.skillz.com/news/competitive-multiplayer-mobile-games-synchronous-vs-asynchronous/
[3] https://www.andrewhagenbuch.com/2012/04/28/creating-online-games-synchronous-asynchronous-design/
[4] https://discussions.unity.com/t/asynchronously-turn-based-game/516382
