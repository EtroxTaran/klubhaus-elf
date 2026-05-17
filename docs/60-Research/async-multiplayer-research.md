---
title: Async Multiplayer Research - Cadence, Watch Parties, Transfer Escalation
status: in-review
tags: [research, async, multiplayer, watch-party, synthesis, wave-2]
created: 2026-05-16
updated: 2026-05-16
type: research
binding: false
related: [[raw-perplexity/raw-async-multiplayer]], [[mode-design-research]], [[../50-Game-Design/async-multiplayer-private-group]], [[../50-Game-Design/watch-party-and-conference]], [[../50-Game-Design/transfer-negotiations-p2p]]
---

# Async Multiplayer Research - Cadence, Watch Parties, Transfer Escalation

Distilled from four parallel Perplexity iterations
([[raw-perplexity/raw-async-multiplayer]]) into the recommended async
multiplayer rule sets and technical patterns.

## 1. Two cadence rule sets

Ship **both** and let the group pick at creation; admin may switch only at
season boundary.

| Rule set | Progress trigger | Strength | Risk | Default |
|---|---|---|---|---|
| **Fixed Cadence** | Fixed match-days + hard deadlines | Predictable, easy to explain | Higher wait in active groups | Yes |
| **Dynamic Cadence** | Quorum reached + countdown | Flexible, group-driven, faster flow | More edge cases, needs strong notifications | Opt-in |

Both share the same state machine - only the trigger for `quorum_reached`
differs.

## 2. Dynamic cadence rules

1. Each manager processes their club week at their own pace.
2. `CompleteWeek` command marks the week server-side done.
3. When the configured quorum is reached, a countdown starts.
4. After the countdown, match-day opens.
5. After match-lock, matches are simulated server-side.
6. Reports + events emitted, next week opens.

Safety nets are mandatory:

- Maximum week length forcing auto-resolve.
- Inactivity fall-backs (last tactic, assistant, minimal default).
- Visible reminders + countdown UI.

### Group settings (configurable)

| Setting | Options |
|---|---|
| Time model | Fixed \| Dynamic |
| Quorum | 50 / 66 / 70 / 80 / 100 % |
| Countdown after quorum | 6 / 12 / 24 / 36 h |
| Max week length | 2 / 3 / 5 / 7 days |
| Auto-resolve on inactivity | Last tactic \| Assistant \| Minimal default |
| Pause vote quorum | 50 / 66 / 80 % \| Admin override |

## 3. State machine (shared by both cadences)

`week_open → quorum_reached → pre_match_countdown → matchday_open →
matchday_locked → matchday_resolving → post_match_reports → week_open`, plus
`paused`. Detail: [[../10-Architecture/state-machines/league-week]].

## 4. Transfer escalation between humans

Player-to-player transfers must never be blocked by silence.

### Escalation flow

1. Offer sent with response deadline.
2. Counter-offer permitted.
3. Reminder / notification.
4. Auto-expire on missed deadline.
5. Repeated ignored strong interest builds escalation.

### Escalation stages

1. First non-response → offer `expired`.
2. Repeated ignoring of strong interest → agent / player registers.
3. Sustained → player unrest, transfer request, training-mood slip.
4. Late stages: media leaks, strike threats, public unrest.

Strike is *never* an immediate consequence of one ignored offer.

State machine: [[../10-Architecture/state-machines/transfer]].

## 5. Watch parties - synchronous spikes

Game-play value: target emotional highlights, not every match.

### Candidates

- Direct human-vs-human duels.
- Champions-League final.
- Cup final.
- Last match-day.
- Relegation playoff.
- Promotion / relegation conferences.
- Derby.

Game proposes; group or admin confirms.

### Scheduling

Lightweight scheduling polls:

- 2-4 slot proposals.
- Clear vote deadline.
- Auto-pick the best slot OR admin lock-in on tie.
- Reminders.
- Once scheduled, all upstream deadlines (setup, transfer lock, line-up
  lock) compute *backwards* from the broadcast time.

### Technical model

- Match simulated **server-authoritative** on the match service.
- Periodic snapshots / event frames produced.
- Separate spectator / replay service consumes the snapshot stream.
- Spectators read the stream with configurable delay (15-60 s).
- Active managers see live; chat live; voice external (Discord).

State machine: [[../10-Architecture/state-machines/watch-party]].

### Spectator delay = fairness

Without delay, voice/chat coaches gain a real-time information edge over
the manager who is playing. 15-60 s delay neutralises this without killing
the live feel.

## 6. Conference mode

Decisive last match-days with several promotion/relegation games at once.
Built on the same snapshot stream:

- Conference subscribes to multiple match feeds simultaneously.
- Switches between feeds by event priority (goal, red card, penalty, lead
  change, table swing).
- Each manager can still manage their own match while watching others.
- Chat / Discord drives the emotion.

## 7. Notification classes

Notifications are not comfort - they are core gameplay.

| Class | Examples |
|---|---|
| Transactional | Transfer offer received, deadline closing, quorum reached |
| Realtime | Watch-party starting, match-day open, counter-offer arrived |
| Digest | Weekly summary, post-match recap, group status |

Required:

- Rate-limiting to prevent spam.
- User per-channel preferences.
- Escalation in-app → reminder → optional mail / Discord webhook.

Tech: transactional outbox + Redis-style queue + retry + idempotent
commands.

## 8. Pause by majority

- Admin or any member can start a pause vote.
- Options: pause 1 week / 2 weeks / until date X.
- Vote has explicit deadline + quorum rule.
- On success, league enters `paused`, freezing countdowns and auto-resolve
  jobs.
- Admin may override but groups with democratic style benefit from a clear
  quorum mechanism.

## 9. Comparison table

| Aspect | Fixed | Dynamic |
|---|---|---|
| Predictability | Very high | Medium |
| Flexibility | Medium | Very high |
| Wait time | Higher in active groups | Lower |
| Social pressure | Predictable | Fluctuates |
| Tech complexity | Lower | Higher |
| Notification need | Medium | Very high |
| Watch-party integration | Easy | Good, more deadlines needed |
| Best for | Fixed gaming groups | Flexible friend groups |

## 10. Final recommendation

- Offer both async variants.
- Default **Fixed Cadence**.
- Provide **Dynamic Cadence** as advanced rule set.
- Watch parties as optional highlight system over either model.
- Rule-set switch only between weeks / seasons.

Strong product narrative: **one async system, two time models, one shared
core, optional social peaks via watch parties**.

## 11. Sources (new URLs)

All retrieved 2026-05-16.

- Microservices.io transactional outbox - [microservices.io transactional-outbox](https://microservices.io/patterns/data/transactional-outbox.html)
- AWS prescriptive transactional outbox - [docs.aws.amazon transactional-outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)
- event-driven.io outbox/inbox + delivery guarantees - [event-driven.io outbox/inbox](https://event-driven.io/en/outbox_inbox_patterns_and_delivery_guarantees_explained/)
- OneUptime Redis notification design - [oneuptime.com notification system using redis](https://oneuptime.com/blog/post/2026-03-31-redis-how-to-design-a-notification-system-using-redis-in-a-system/view)
- SurveyMonkey scheduling poll guide - [surveymonkey.com online schedule poll](https://www.surveymonkey.com/learn/survey-best-practices/online-schedule-poll/)
- Doodle group scheduling - [doodle.com group scheduling](https://doodle.com/en/the-best-way-to-use-doodle-com-for-group-scheduling/)
- Strawpoll meetings - [strawpoll.com meetings](https://strawpoll.com/meetings/)
- Unity discussions spectator mode + streaming - [discussions.unity.com spectator + streaming](https://discussions.unity.com/t/spectator-mode-and-streaming/938940)
- Unreal Engine replication delay for spectators - [forums.unrealengine.com delay replication spectators](https://forums.unrealengine.com/t/delay-replication-for-spectators/381186)
- Reddit r/leagueoflegends spectator delay context - [reddit lol spectator delay](https://www.reddit.com/r/leagueoflegends/comments/fcd51y/how_to_deal_with_3_minute_spectator_delay_as_a/)
