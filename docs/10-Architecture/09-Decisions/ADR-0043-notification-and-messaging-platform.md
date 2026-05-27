---
title: ADR-0043 Notification and Messaging Platform
status: draft
tags: [adr, architecture, notification, messaging, realtime, email, push, gdpr]
created: 2026-05-22
updated: 2026-05-22
accepted_at: 2026-05-22
type: adr
binding: true
supersedes:
superseded_by:
related: [[ADR-0019-modular-monolith-ddd]], [[ADR-0021-revised-tech-stack]], [[ADR-0023-realtime-transport]], [[ADR-0025-mobile-delivery]], [[ADR-0028-postgres-transactional-outbox]], [[../../30-Implementation/notification-messaging-platform]], [[../../30-Implementation/privacy-and-consent]], [[../../30-Implementation/rate-limiting-anti-abuse]]
---

# ADR-0043: Notification and Messaging Platform

## Status

accepted

## Date

2026-05-22

## Context

The project already had partial decisions for user-facing messages:

- The approved narrative inbox establishes the inbox as a primary game surface.
- ADR-0023 defines an SSE MVP and Centrifugo as the scalable realtime upgrade.
- ADR-0028 moves domain event publication to a PostgreSQL transactional outbox.
- Privacy, consent and rate-limiting notes define GDPR, processor and abuse
  constraints.

What was missing was a binding architecture decision for notifications as a
platform: durable notification records, delivery channels, provider choices,
push, preferences, scheduling, retry, rate limits, chat boundaries and
migration policy.

## Options Considered

- **First-party Notification context** with provider adapters. Strong DDD fit,
  EU data control, smallest operational surface, but requires us to build the
  minimal orchestration we need.
- **Novu as the primary notification platform**. Strong workflow, inbox and
  multi-channel capabilities, but self-hosting adds MongoDB, Redis and object
  storage to the stack and creates a second subscriber/workflow source of
  truth.
- **Knock/Courier as managed orchestration**. Mature SaaS options, but they
  increase processor and data-residency review burden and add vendor lock-in
  before we know the product's actual notification complexity.

## Decision

Build notifications as a **first-party DDD bounded context**. PostgreSQL is the
durable system of record. SurrealDB may be used as an additive graph/live
projection for inbox views and relationship-heavy notification queries, but it
is not authoritative. Dexie mirrors the inbox for offline reads and local UI
state.

The Notification context owns:

- `Notification`
- `NotificationPreference`
- `DeliveryAttempt`
- `NotificationSubscription`
- `NotificationTemplateVersion`
- `NotificationSchedule`

Domain events enter through the PostgreSQL outbox from ADR-0028. Notification
records are durable before any external channel is attempted.

Channel decisions:

- **In-app inbox** is the primary channel and must work offline through Dexie.
- **Realtime** uses SSE for MVP and Centrifugo as the first scale step for
  presence, history, recovery and horizontal fan-out.
- **Transactional email** uses Brevo first, with Mailjet as a prepared fallback,
  behind an `EmailGateway` port.
- **Email templates** use React Email `6.3.1` and `@react-email/render 2.0.8`
  for versioned HTML and plain-text rendering.
- **Web Push** is prepared but not critical path for MVP. Use `web-push 3.6.7`
  with VAPID. Push payloads carry only an opaque `notification_id`; the app
  fetches details after open.
- **Native push** is deferred to the Capacitor shell, using
  `@capacitor/core 8.3.4` and `@capacitor/push-notifications 8.1.1` when the
  mobile shell becomes active.
- **User chat/DM** is out of MVP. Watch-party chat is post-MVP and requires a
  separate decision for persisted messages, moderation and Centrifugo fan-out.
- **Ops alerts** are separate from user notifications. Discord/webhooks are
  allowed only for internal alerts at MVP; user-facing Discord webhooks are
  post-MVP and opt-in.
- **SMS/WhatsApp** are explicitly out of scope for MVP because cost, privacy
  and operational burden do not create enough product value.

Novu is retained as a **future spike**, not a start dependency. Re-evaluate it
only if workflow editing, non-engineer template ownership, complex digests or
multi-channel orchestration become bottlenecks.

## Rationale

The game needs deterministic, inspectable, offline-survivable messaging more
than it needs a general-purpose notification SaaS. A first-party context keeps
the business truth, preferences, audit linkage and GDPR posture inside the
existing Postgres/Drizzle architecture. External providers become replaceable
delivery adapters, not owners of product state.

Centrifugo fits the planned realtime path because it provides WebSocket/SSE
transport options, Redis-backed horizontal scaling, history, recovery and
presence without replacing the Notification domain model.

Brevo is the default transactional email vendor because current privacy docs
already point at it, it has a stronger EU/GDPR fit for this setup than
US-centric DX-first providers, and Mailjet gives a credible EU fallback.

## Consequences

Positive:

- Notification truth stays in our database and audit model.
- Offline inbox, provider migration and GDPR export/deletion are tractable.
- SurrealDB's graph/live upside is available as a projection without risking
  money/progression state.
- Brevo/Mailjet/Web Push/Capacitor are swappable adapters behind stable ports.

Negative / follow-up:

- We must build minimal preference resolution, scheduling, digesting, retry and
  provider-webhook handling ourselves.
- Web Push has browser-specific caveats; iOS support depends on installed Home
  Screen web apps.
- Centrifugo and Redis become real operational services when realtime scale or
  chat requirements justify them.
- If Novu is later adopted, it must be introduced behind an
  anti-corruption adapter and cannot replace Postgres notification truth.

## Test Requirements

- Unit tests for preference resolution, quiet hours, digest coalescing,
  deadline reminders and idempotency keys.
- Integration tests for Postgres outbox -> notification record -> SSE event ->
  Dexie inbox mirror.
- Provider contract tests for Brevo, Mailjet fallback and bounce/complaint
  webhook validation.
- PWA tests for offline inbox read state, reconnect sync and Web Push
  subscription lifecycle.
- Abuse tests for notification storm collapse, per-channel caps and async
  multiplayer deadline reminders.

## Sources

- Apple Web Push for Safari/iOS:
  <https://developer.apple.com/documentation/UserNotifications/sending-web-push-notifications-in-web-apps-and-browsers>
- MDN Push API: <https://developer.mozilla.org/en-US/docs/Web/API/Push_API>
- Novu docs: <https://docs.novu.co/platform/how-novu-works>
- Novu self-hosting requirements:
  <https://docs.novu.co/community/self-hosting-novu/overview>
- React Email render docs: <https://react.email/docs/utilities/render>
- Brevo transactional email:
  <https://help.brevo.com/hc/en-us/articles/7924148470546-How-can-I-send-transactional-emails-with-Brevo>
- Brevo webhooks: <https://developers.brevo.com/docs/how-to-use-webhooks>
- Centrifugo engines/scaling: <https://centrifugal.dev/docs/server/engines>

## Related Docs

- [[../../30-Implementation/notification-messaging-platform]]
- [[ADR-0023-realtime-transport]]
- [[ADR-0028-postgres-transactional-outbox]]
- [[../../30-Implementation/privacy-and-consent]]
- [[../../30-Implementation/rate-limiting-anti-abuse]]
