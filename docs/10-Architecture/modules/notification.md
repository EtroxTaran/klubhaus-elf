---
title: Notification module
status: draft
tags: [architecture, module, notification, messaging]
context: notification
created: 2026-06-20
updated: 2026-06-20
type: module
binding: false
related: [[../05-Building-Blocks]], [[../bounded-context-map]], [[../09-Decisions/ADR-0102-notification-platform-re-ratification-offline-delivery-clause]], [[../09-Decisions/ADR-0043-notification-and-messaging-platform]], [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]], [[../09-Decisions/ADR-0027-postgres-data-model]]
---

# Notification Boundary

## Purpose

First-party DDD bounded context in the *Engagement & Narrative* cluster that
owns durable user-facing notifications: it writes the durable notification
record before any external channel attempt, exposes the in-app inbox as the
single authoritative read/replay surface, and treats SSE/Centrifugo, email,
Web Push and native push as transient delivery accelerants only.

## Owns

Aggregates / state owned (ADR-0043 / ADR-0102):

- `Notification`
- `NotificationPreference`
- `DeliveryAttempt`
- `NotificationSubscription`
- `NotificationTemplateVersion`
- `NotificationSchedule`

Also owns: preference resolution (quiet hours, digest/batching), delivery
idempotency, push suppression decisions, the notification `lastSeenVersion` /
watermark, and provider adapters behind stable ports (`EmailGateway`, Web Push,
deferred native push).

## Public contract

Exposed outputs (BCM row — *User-facing message projections, unread counters,
delivery/audit events*):

- **Queries / read models:** user-facing message projections (the inbox),
  unread / badge counters.
- **Domain events:** delivery / audit events (notification written, delivery
  attempted/succeeded/failed). Exact event names are not enumerated in the
  source — see Open items.
- **Replay contract:** clients carry a notification `lastSeenVersion` /
  watermark, reconnect, fetch records above the watermark, and advance the
  watermark only after applying the inbox projection (ADR-0090 seam via
  ADR-0102).
- **Push payload contract:** push payloads are opaque hints carrying only
  `notification_id`, `version`, category, urgency and deep-link metadata — no
  secret, provider credential or personal data.

Commands and named queries/events are not formally listed in the ADRs or BCM;
they are flagged under Open items rather than invented here.

## Storage ownership

- **Postgres is the durable system of record** for notification records,
  subscriptions, delivery attempts, preferences, schedules and template
  versions; the record is durable before SSE/email/Web Push/native push is
  attempted.
- The context owns its **own schema/tables**; no other context writes or joins
  its tables, and Notification does not write into other contexts' tables —
  cross-context access is contract-only, per
  [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
  and the Postgres data model
  ([[../09-Decisions/ADR-0027-postgres-data-model]]).
- **Dexie mirrors the inbox** for offline reads, local UI state and reconnect
  recovery; Dexie is not authoritative.
- **SurrealDB** may serve additive graph/live inbox projections; it is not
  authoritative.

## Consumers / Producers

- **Consumes facts (via the Postgres transactional outbox, ADR-0028):** domain
  facts from producing contexts — e.g. Training (`TrainingWeekProcessed`,
  `InjuryRiskUpdated`, `TrainingInjuryOccurred`), Squad & Player
  (`PlayerAvailabilityChanged`, `PlayerReturnedFromInjury`,
  `PlayerDevelopmentDeltaApplied`), Match (`MatchInjuryOccurred`), Club
  Management (`VenueEventBooked`, `MatchdayEventTriggered`) and Rivalry System
  (`RivalryTierTransitioned`). Notification renders deterministic projections
  from these facts; it does not mutate source domain state.
- **Consumed by:** UI / web surfaces render the inbox projection, unread
  counters and badges from this context; it remains the delivery owner across
  contexts.
- **Boundary with People/Persona:** People owns persona projections; it does not
  write notification delivery records.

## Invariants

- The durable notification record is written **before** any external channel is
  attempted; the UI renders from the inbox projection, never from a
  push/email/realtime payload.
- The **in-app inbox is the only authoritative read/replay surface**; all other
  channels only accelerate awareness.
- **No CRDT for notification content** — notifications are owner-published
  facts. Read/seen/dismissed is preference-like state that may sync LWW;
  server-known seen/read watermarks may suppress redundant push.
- Web Push / native push are **best-effort wake/attention only** — they may be
  delayed, suppressed, expired or platform-limited, and reconnect replay always
  repairs missed state.
- Push payloads carry no secret, credential or personal data — opaque hint only.
- External providers (Brevo/Mailjet, Web Push, Capacitor native push) are
  swappable adapters behind stable ports; they never own notification state.
- No cross-context table joins; all cross-context data flows through published
  contracts (ADR-0121).

## Dependencies

- [[../09-Decisions/ADR-0102-notification-platform-re-ratification-offline-delivery-clause]]
  (accepted/binding terminus of the Notification chain)
- [[../09-Decisions/ADR-0043-notification-and-messaging-platform]]
  (superseded source decision — kept for history, do not implement)
- [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
- [[../09-Decisions/ADR-0027-postgres-data-model]]

## Open items

The ADRs and BCM define aggregates, storage ownership, the replay/push
contracts and exposed-output categories, but do not pin explicit names for:

- Concrete **command** names accepted by the context (e.g. enqueue/dispatch,
  preference update, subscription register/invalidate).
- Concrete **query** names for the inbox projection and unread/badge counters.
- Concrete **domain event** names for the delivery/audit stream.

These must be defined when the public Notification contract is specified; they
are intentionally not invented here.
