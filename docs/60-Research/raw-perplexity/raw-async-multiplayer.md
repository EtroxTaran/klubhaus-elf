---
title: Raw - Async Multiplayer Cadence, Watch Parties and Transfer Escalation
status: raw
tags: [research, raw, perplexity, async, multiplayer, watch-party]
created: 2026-05-16
updated: 2026-05-16
type: raw-research
binding: false
related:
  - [[README]]
  - [[../async-multiplayer-research]]
---

# Raw - Async Multiplayer Cadence, Watch Parties and Transfer Escalation

> Source: private Perplexity transcripts (2026-05-16), Doc 2 sections 3301-4350.
> Four parallel iterations on the alternative dynamic-cadence model proposed by
> Nico (week ends when a configurable quorum of managers finishes), plus watch
> parties for human-vs-human and decisive matches, conference mode for
> promotion/relegation, transfer escalation, pause-by-majority, scheduling
> polls, spectator delay. Feeds [[../async-multiplayer-research]].

## English summary

All iterations agree: offer **two async rule-sets** sharing the same
simulation core - **Fixed Cadence** (fixed match-days, hard deadlines) and
**Dynamic Cadence** (quorum + countdown + max-week-length). The user picks one
when creating the group; admins may switch only at season boundary.

Dynamic cadence works as: each manager closes their week explicitly; when a
configurable quorum (50/66/70/80/100 %) of managers finish, a configurable
countdown (6/12/24/36 h) starts; match-day opens after the countdown; max
week length (2-7 days) forces auto-resolve if quorum is never reached. State
machine: `week_open → quorum_reached → pre_match_countdown → matchday_open →
matchday_resolving → post_match_reports`. Both cadences share the same
machine - only the trigger for `quorum_reached` / `pre_match_countdown`
differs.

Player-to-player transfers must never be blocked by silence. Recommended
multi-stage escalation: offer with deadline → counter-offers permitted →
auto-expiry on non-response → repeat ignored interest raises `agentPressure`
/ `playerUnrest` → eventually media leaks, transfer requests, training-mood
events. Strike is **never** an immediate consequence of one ignored offer.

Watch parties layer synchronous emotional highlights on top of async:
recommended for human-vs-human, Champions-League finals, cup finals,
relegation deciders, derby. Scheduling via lightweight poll (2-4 slots,
clear deadline, auto-pick best slot or admin lock-in). Once scheduled, all
upstream deadlines (line-up lock, transfer lock, tactic lock) compute
backwards. Technically: do **not** make every viewer a real match-server
client. Use **snapshot streaming with delay** (separate spectator service
consumes match events / snapshots). Active managers see live; spectators
see 15-60 s delayed; chat live. Conference mode subscribes to multiple
feeds and switches by priority (goal, red card, penalty, lead change,
table swing).

Notifications are not comfort - they are core gameplay. Three classes:
**Transactional** (offer / deadline / quorum), **Realtime** (watch-party
start, match-day open, counter-offer received), **Digest** (weekly summary,
post-match reports, group status). Outbox + queue + retry + rate-limit
required.

Pause by majority is supported but must be formal: any member can start a
pause vote with options like "pause 1 week / 2 weeks / until date X",
quorum-gated, freezes timers and auto-resolve jobs on success.

## 1. Two async cadence variants

| Rule set | Progress trigger | Strength | Risk |
|---|---|---|---|
| **Fixed Cadence** | Fixed match-days + hard deadlines | High predictability, easy to explain | More waiting in active groups |
| **Dynamic Cadence** | Quorum reached + post-quorum countdown | Flexible, group-driven, faster flow | More complexity, more edge cases, needs strong notifications |

Best practice: ship **both** rule sets, default Fixed, allow switch only
between weeks/seasons. Watch parties layered on top of either.

## 2. Dynamic cadence in detail

Rules:

1. Each manager processes their club week at their own pace.
2. A `CompleteWeek` command marks the week server-side done.
3. When the configured quorum is reached, a countdown starts.
4. After the countdown, match-day opens.
5. After match-lock, matches are simulated server-side.
6. Reports + events emitted.
7. Next week auto-opens.

Safety nets are mandatory:

- Maximum week length forcing auto-resolve.
- Inactivity fall-backs (last tactic, assistant, minimal default).
- Visible reminders + countdown UI.

Suggested group settings (verbatim):

- **Time model**: Fixed | Dynamic
- **Quorum**: 50 / 66 / 70 / 80 / 100 %
- **Countdown after quorum**: 6 h / 12 h / 24 h / 36 h
- **Max week length**: 2 / 3 / 5 / 7 days
- **Auto-resolve on inactivity**: last tactic | assistant takes over | minimal default

Admin may switch only between weeks - never inside a deadline.

## 3. Player-to-player transfer escalation

### Best-practice flow

1. Offer sent with response deadline.
2. Counter-offer permitted.
3. Reminder / notification.
4. Auto-resolve on missed deadline (expired).
5. Repeated ignored strong interest builds escalation.

### Escalation stages (verbatim)

1. First non-response - offer expires.
2. Repeated ignoring of strong interest - agent / player registers.
3. Repeated and sustained → player unrest, transfer request, training-mood
   slip.
4. Late stages only: media leaks, strike threats, public unrest.

Ignoring is never costless, but ignoring is never instantly catastrophic
either.

## 4. Notification system as core gameplay

Three notification classes (verbatim):

- **Transactional** - transfer offer received, deadline closing, quorum
  reached.
- **Realtime** - watch-party starting, match-day opening, counter-offer
  arrived.
- **Digest** - daily / weekly summary, post-match recap, group status.

Required features:

- Rate-limiting to prevent spam.
- User per-channel preferences.
- Escalation: in-app → reminder → optional mail/Discord webhook.

Underlying tech (recommended in the source): transactional outbox pattern,
Redis-based queue + retry, idempotent commands keyed by request IDs.

## 5. Pause by majority

Supported but formalised, *not* a loose signal.

- Admin or any member can start a pause vote.
- Options: pause 1 week / 2 weeks / until date X.
- Vote uses an explicit deadline + quorum rule.
- On success, league enters `paused`, freezing countdowns and auto-resolve
  jobs.
- Admin may override but groups with democratic style benefit from a clear
  quorum mechanism.

## 6. Watch parties - the synchronous spike

Game-play value: target emotional highlights, not every match. Suggested
candidates (verbatim):

- Direct human-vs-human duels.
- Champions-League final.
- Cup final.
- Last match-day.
- Relegation playoff.
- Promotion / relegation conferences.
- Derby.

The game should propose watch-party candidates automatically; group or admin
confirms.

### Scheduling

Use lightweight scheduling polls:

- 2-4 slot proposals.
- Clear vote deadline.
- Auto-pick the best slot OR admin lock-in on tie.
- Reminders.
- Once scheduled, all upstream deadlines (setup, transfer lock, line-up
  lock) compute backwards from the broadcast time.

### Technical model (consolidated)

- Match simulated **server-authoritative** on its own service.
- Periodic snapshots / event frames are produced.
- A separate spectator / replay service consumes the snapshot stream.
- Spectators read the stream with configurable delay (15-60 s).
- Active managers see (quasi-)live; chat live; voice external (Discord).

This avoids piling spectator clients onto the match server (CPU + bandwidth)
and gives replay almost for free.

### Spectator delay = fairness

Without delay, voice/chat coaches gain a real-time information edge over
the manager who is playing. 15-60 s delay neutralises this without killing
the live feel.

### Live coaching rules

For watch-party / human-vs-human matches define explicitly:

- Inputs only in defined windows? Or any time?
- Pause allowed? Yes/no per group rule.
- Who is coach vs spectator? Coaches see live, spectators see delayed.

## 7. Conference mode (multi-match)

Decisive last match-days with several promotion/relegation games at once.
Technically built on the same snapshot stream:

- Conference subscribes to multiple match feeds simultaneously.
- Switches between feeds by event priority (goal, red card, penalty, lead
  change, table swing).
- Each manager can still actively manage their own match while watching
  others.
- Chat / Discord drives the emotion.

## 8. Architecture recommendation (consolidated)

Common simulation core for both cadence rule-sets. Server-authoritative
league state. Domain events for all important transitions. Transactional
outbox for reliable notifications + follow-up jobs. Job queue / scheduler
for countdowns, reminders, escalation, auto-resolves. Realtime channel for
status and chat / watch-party signals. Snapshot / replay layer for watch
parties + conferences. State machine shared between cadences.

## 9. Comparison table (Fixed vs Dynamic)

| Aspect | Fixed | Dynamic |
|---|---|---|
| Predictability | Very high | Medium |
| Flexibility | Medium | Very high |
| Wait time | Higher in active groups | Lower |
| Social pressure | Clear and predictable | Fluctuates |
| Tech complexity | Lower | Higher |
| Notification need | Medium | Very high |
| Watch-party integration | Easy | Good, but more deadlines needed |
| Best for | Fixed gaming groups | Flexible friend groups |

## 10. Final recommendation (verbatim consolidation)

- Offer both async variants.
- Default **Fixed Cadence**.
- Provide **Dynamic Cadence** as the advanced rule set.
- Watch parties as optional highlight system over either model.
- Rule-set switch only between weeks / seasons.

Strong product narrative: **one async system, two time models, one shared
core, optional social peaks via watch parties**.

## 11. Citations preserved

Iterations 10-11 cite gamedeveloper.com (asynchronicity), wayline.io (async
multiplayer mobile reclaiming time), microservices.io (transactional
outbox), AWS prescriptive guidance (transactional outbox), event-driven.io
(outbox/inbox semantics), oneuptime.com (Redis notifications), Reddit
r/pbp (tracking time for multiple parties), surveymonkey.com (online poll
best practices), doodle.com (group scheduling), strawpoll.com (meetings),
schedly.io (group scheduling polls), Reddit r/leagueoflegends (spectator
delay), Unity discussions (spectator/replay), Unreal Engine forums
(replication delay), refactoring.guru + game programming patterns + game
dev forums (state machines). Full URL list in source `.md`; new URLs
surface via [[../async-multiplayer-research]] §Sources.
## Related

- [[README]]
- [[../async-multiplayer-research]]
