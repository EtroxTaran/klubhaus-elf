---
title: "Raw - Watch Party context ownership DDD (FMX-159)"
status: raw
tags: [research, raw, perplexity, ddd, bounded-context, watch-party, match, notification, offline-sync, crdt, fmx-159]
created: 2026-06-17
updated: 2026-06-17
type: research
binding: false
linear: FMX-159
related:
  - [[../watch-party-context-ownership-2026-06-17]]
  - [[raw-watch-party-context-ownership-source-checks-2026-06-17]]
  - [[../../40-Execution/fmx-159-watch-party-context-ownership-decision-queue-2026-06-17]]
  - [[../../10-Architecture/09-Decisions/ADR-0133-watch-party-context-definition]]
  - [[../../10-Architecture/bounded-context-map]]
  - [[../../10-Architecture/state-machines/watch-party]]
---

# Raw - Watch Party context ownership DDD (FMX-159)

## Research prompt

Perplexity was asked on 2026-06-17:

> Research DDD best practices for defining a Watch Party bounded context
> layered over an event-sourced Match context. The game has: Match owns
> deterministic simulation and committed event log; Watch Party owns
> scheduling/live co-view orchestration; Notification owns inbox/delivery;
> Offline Sync owns client queue/rebase and may have CRDT overlay future. What
> should the Watch Party context-definition ADR own, publish, consume, and
> explicitly not own? How should CRDT chat/markers be placed: Watch Party
> sub-capability, Notification, or generic Offline Sync/collaboration channel?

## Source-quality note

Perplexity was used as discovery only. It surfaced a useful DDD split but mixed
strong sources (Fowler, Microsoft) with weak community/blog links. FMX-159 then
source-checked the DDD and CRDT claims against primary/current docs in
[[raw-watch-party-context-ownership-source-checks-2026-06-17]].

## Extracted findings

- Watch Party should be the bounded context for the social co-viewing session,
  not a submodule of Match or Notification.
- Match should remain upstream for deterministic match facts: match lifecycle,
  committed event log, replay cursors and pause/resume execution.
- Watch Party should consume Match facts through published language and an ACL
  style translation, never by reading Match storage or mutating match state.
- Notification should remain downstream from Watch Party for invites,
  reminders, mentions and start alerts. It owns channel delivery, inbox truth,
  subscriptions, preferences and delivery attempts, not party membership or
  chat.
- Offline Sync should remain an infrastructure/platform context for client
  queue, retry/rebase UX and eventual CRDT mechanics. It should not own party
  business language.
- Watch Party should publish party lifecycle, participant, scheduling,
  playback, pause-vote and party-social events as self-contained facts.
- The best DDD placement for chat/markers is domain semantics in Watch Party
  and optional CRDT mechanics in Offline Sync or a future generic
  collaboration capability. Notification is the wrong owner.

## Perplexity recommendations surfaced

| Question | Perplexity recommendation | FMX-159 synthesis handling |
|---|---|---|
| Context-definition home | Dedicated Watch Party ADR. | Adopt as D1 recommendation. |
| Watch Party scope | Own party lifecycle, membership, playback/cursor, scheduling and party-scoped social semantics. | Adopt, narrowed to existing FMX state-machine language. |
| Match relationship | Match upstream, Watch Party downstream via events/read models/ACL. | Adopt; aligns with ADR-0099 and ADR-0129. |
| Notification relationship | Notification consumes Watch Party events/intent and owns delivery. | Adopt; aligned with ADR-0102's draft inbox-first posture. |
| CRDT placement | Watch Party owns semantics; Offline Sync/collab stack owns merge mechanics. | Adopt with MVP no-CRDT default. |

## Perplexity citations surfaced

- Martin Fowler, Bounded Context:
  <https://martinfowler.com/bliki/BoundedContext.html>
- Microsoft Press Store DDD/context map excerpt:
  <https://www.microsoftpressstore.com/articles/article.aspx?p=3192407&seqNum=4>
- Agile Alliance DDD/team autonomy report:
  <https://agilealliance.org/resources/experience-reports/towards-autonomous-aligned-teams-with-domain-driven-design/>
- Dremio bounded-context explainer:
  <https://www.dremio.com/wiki/bounded-context/>
- StackOverflow bounded-context communication discussion:
  <https://stackoverflow.com/questions/16713041/communicating-between-two-bounded-contexts-in-ddd>

## Related

- [[../watch-party-context-ownership-2026-06-17]]
- [[raw-watch-party-context-ownership-source-checks-2026-06-17]]
- [[../../40-Execution/fmx-159-watch-party-context-ownership-decision-queue-2026-06-17]]
