---
title: Feature - Watch Party
status: draft
tags: [feature, watch-party, multiplayer]
created: 2026-05-16
updated: 2026-05-16
type: feature
binding: false
related: [[README]], [[../50-Game-Design/watch-party-and-conference]], [[../10-Architecture/state-machines/watch-party]], [[../10-Architecture/09-Decisions/ADR-0015-spectator-snapshot-streaming]]
---

# Feature - Watch Party

## Goal

Schedule and broadcast a single match (or a conference of matches) live
to a private async group, with configurable spectator delay.

## User stories

- As a group I can schedule a watch party for a derby via a 2-4 slot
  poll.
- As an active manager I see the match live and can do live coaching.
- As a spectator I see the match with a 15-60 s delay so chat / voice
  doesn't leak realtime info.
- As an admin I can cancel a watch party before broadcast.

## In scope (MVP)

- Watch-party state machine (proposed / poll_open / scheduled /
  setup_locked / live / completed / cancelled).
- Backward-deadline propagation (setup, line-up, transfer locks).
- Snapshot / event stream from match worker.
- Spectator service with configurable delay.
- Live chat (in-app).

## Out of scope (MVP)

- Voice (use external Discord etc.).
- Multi-match conference (Phase 2).
- Recording sharing outside the group.

## Acceptance

- Scheduling sets correct backward deadlines.
- Delay math is correct across timezones.
- Match worker performance is independent of spectator count.
- Replay is available post-match without spectator delay.

## Dependencies

- [[../10-Architecture/09-Decisions/ADR-0015-spectator-snapshot-streaming]]
- [[../50-Game-Design/match-engine]]
