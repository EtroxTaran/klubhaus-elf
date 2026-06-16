---
title: Raw Perplexity - Live Match Pause Ratification
status: raw
tags: [research, raw, perplexity, match, watch-party, pause-vote, tactics-pause, anti-grief, determinism, fmx-140]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-140
related:
  - [[../live-match-pause-ratification-2026-06-16]]
  - [[raw-live-match-pause-source-checks-2026-06-16]]
  - [[../../10-Architecture/09-Decisions/ADR-0087-live-match-intervention-buffer-and-pause-vote]]
  - [[../../50-Game-Design/GD-0035-live-coaching-intervention-and-pause-rules]]
  - [[../../10-Architecture/state-machines/match]]
  - [[../../10-Architecture/state-machines/watch-party]]
---

# Raw Perplexity - Live Match Pause Ratification

## Prompt

Research live in-match pause and tactical-intervention design for an
online/hybrid football manager game with deterministic simulation. Cover:

- real-world football stoppage, substitution, halftime, time-wasting and
  manager-timeout precedent;
- comparable games/esports/multiplayer precedent for player pauses, tactical
  timeouts, host/admin privileges, anti-grief limits and audit trails;
- deterministic/authoritative command buffering and pause state;
- MVP recommendation for a longer tactics pause once per half, local
  per-group reputation/trust tier privileges, small additive Head Coach/host
  privileges and audit-gated revocation.

## Perplexity capture

Perplexity framed in-match tactical pauses as a **fictional manager-timeout**
layer on top of football's stricter stoppage model. It recommended keeping
real-world football as the realism baseline while treating deliberate pause as
a video-game concession constrained by transparent budgets, hard durations,
cooldowns and audit.

Core real-world findings returned by Perplexity:

- football uses two 45-minute halves, a halftime interval and referee-added
  allowance for lost time;
- the laws do not give managers a timeout right;
- substitutions are bound to stoppages and referee permission;
- modern substitution-window practice and the 10-second substitution-exit
  protocol are anti-disruption signals;
- halftime is the only fully natural coaching pause, so any in-half pause is a
  concession that should stay scarce and bounded.

Core multiplayer/game-pattern findings returned by Perplexity:

- esports commonly separates tactical timeouts from technical pauses, keeps
  them short and limited, and gives admins/hosts override authority;
- public/casual multiplayer usually avoids unrestricted user pause because it
  is an obvious grief vector;
- manager-game precedent supports a host/authority-controlled simulation clock
  and queued tactical changes, but Perplexity could not provide strong primary
  sources for Football Manager internals;
- vote-to-pause and per-player budgets are useful for small-group fairness.

Core deterministic-simulation findings returned by Perplexity:

- the authoritative simulation should advance on a monotonic tick stream;
- commands need stable issuer, sequence/idempotency and target tick or semantic
  boundary metadata;
- pausing should happen at deterministic safe points, or mark a pending pause
  that takes effect at the next safe point;
- tactics/substitutions accepted during a pause should be queued and applied
  atomically at resume or the next legal restart;
- spectators should use a read-only presentation clock and never mutate
  authoritative match state.

## Perplexity recommendation captured

Perplexity's recommended MVP shape aligned with Nico's FMX-140 choices:

- **Pause semantics:** active-manager deliberate pauses suspend the
  authoritative sim at deterministic pause boundaries; spectator replay remains
  presentation-only.
- **Tactics pause:** one longer tactics pause per half, separate from ordinary
  deliberate pause budget and from disconnect pause.
- **Roles:** Head Coach/host may get small additive privilege and early resume
  authority, but not unbounded pause control.
- **Reputation:** use a local per-group trust tier rather than a global social
  score.
- **Abuse controls:** every pause, resume, rejected request, override and
  privilege change should be audit-logged and revocable.

## Weak citations / do not canonize without checks

Perplexity cited or mentioned several weak sources:

- esports tactical-timeout numbers were presented as industry pattern, not
  source-checked rulebook facts;
- Football Manager pause/networking details were experiential/community
  knowledge rather than official technical documentation;
- social-media posts about substitution timing were not authoritative.

FMX-140 therefore uses this Perplexity pass as discovery input only and
canonizes claims through [[raw-live-match-pause-source-checks-2026-06-16]] plus
the existing accepted FMX notes.

## URLs surfaced

- IFAB Law 7, Duration of the Match:
  https://www.theifab.com/laws/latest/the-duration-of-the-match/
- IFAB Law 3, The Players:
  https://www.theifab.com/laws/latest/the-players/
- Gaffer On Games, Deterministic Lockstep:
  https://gafferongames.com/post/deterministic_lockstep/
- The Guardian, IFAB/MLS time-wasting rule changes:
  https://www.theguardian.com/football/2026/feb/27/mls-rule-changes-ifab-time-wasting

