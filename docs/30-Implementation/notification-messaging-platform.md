---
title: Notification and Messaging Platform
status: current
tags: [implementation, notification, messaging, inbox, email, push, realtime, scheduler, gdpr]
created: 2026-05-22
updated: 2026-05-22
type: implementation
binding: false
adr:
  - "[[../10-Architecture/09-Decisions/ADR-0043-notification-and-messaging-platform]]"
  - "[[../10-Architecture/09-Decisions/ADR-0023-realtime-transport]]"
  - "[[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]]"
  - "[[../10-Architecture/09-Decisions/ADR-0025-mobile-delivery]]"
related:
  - [[privacy-and-consent]]
  - [[rate-limiting-anti-abuse]]
  - [[audit-trail]]
  - [[jobs-and-scheduler]]
  - [[../50-Game-Design/GD-0013-narrative-inbox]]
  - [[../50-Game-Design/async-multiplayer-private-group]]
---

# Notification and Messaging Platform

## Purpose

This note implements ADR-0043. It defines the durable Notification bounded
context, its channels, provider adapters, offline inbox behavior, delivery
semantics, scheduling, rate limits, privacy requirements and migration process.

## Scope

MVP and pre-launch hardening include:

- in-app inbox as the primary channel;
- Postgres-backed notification records;
- Dexie offline mirror for inbox reads and local read/dismissed UI state;
- SSE notification updates through ADR-0023;
- transactional email through Brevo with a Mailjet fallback adapter prepared;
- template rendering through React Email;
- preference, quiet-hour, digest and rate-limit policy rules;
- provider webhook ingestion for delivery, bounce and complaint events.

Post-MVP or gated:

- Web Push delivery;
- Capacitor native push;
- Centrifugo deployment for scalable fan-out, recovery and presence;
- watch-party chat;
- Novu spike;
- user-facing Discord/webhook integrations.

Out of scope:

- SMS and WhatsApp;
- generic direct messages in MVP;
- marketing email without a separate consent decision.

## Domain Model

The Notification context owns these public concepts:

| Concept | Purpose |
|---|---|
| `Notification` | Durable user-facing message record. |
| `NotificationPreference` | Per-user and per-save/channel/category settings. |
| `DeliveryAttempt` | One attempt to deliver one notification through one channel. |
| `NotificationSubscription` | Web Push/native push/email endpoint metadata. |
| `NotificationTemplateVersion` | Versioned template metadata and rendered snapshot lineage. |
| `NotificationSchedule` | Future reminders, digest jobs and deadline notices. |

The context consumes domain events from the PostgreSQL outbox. It emits its own
events for audit, delivery attempts and user actions.

Stable event families:

- `notification.created`
- `notification.delivered`
- `notification.delivery_failed`
- `notification.read`
- `notification.dismissed`
- `notification.preference_changed`
- `notification.subscription_created`
- `notification.subscription_revoked`
- `notification.digest_sent`

Every event uses UUIDv7 ids, a correlation id, schema version and Zod-validated
payload. No secret, token or raw provider credential may appear in payloads.

## Storage and Projections

PostgreSQL is authoritative:

- `public.notification`
- `public.notification_preference`
- `public.notification_delivery_attempt`
- `public.notification_subscription`
- `public.notification_template_version`
- `public.notification_schedule`

Implementation may refine exact table names, but the ownership boundary is
fixed: no other bounded context writes Notification tables directly.

SurrealDB is allowed as an additive projection for:

- inbox graph reads by user, save, team, match, group or sender;
- live projections for notification counters and related entities;
- non-authoritative relationship exploration.

Projection lag must be observable. If SurrealDB is unavailable, Postgres remains
the source of truth and the inbox must still render from Postgres-backed queries.

Dexie mirrors:

- recent inbox items;
- unread counters;
- local read/dismissed state awaiting sync;
- notification freshness metadata.

Dexie is not authoritative. Reconnect reconciles by server version and
notification id.

## Delivery Semantics

Creation is at-least-once from domain outbox to notification store and exactly
once per `(source_event_id, user_id, notification_type)` through an idempotency
key.

External channel delivery is at-least-once with provider-specific idempotency
where available. `DeliveryAttempt` records:

- channel;
- provider;
- provider message id when available;
- status;
- attempt count;
- error code class;
- next retry time;
- timestamps.

Old notifications store:

- template id;
- template version;
- locale;
- variables needed for audit and rerender where allowed;
- rendered title/body/action snapshot.

The snapshot is what users saw. Template changes do not rewrite history.

## Channels

| Channel | Timing | Rules |
|---|---|---|
| In-app inbox | MVP | Primary channel. Durable, offline mirrored, user-visible history. |
| SSE | MVP | Wake-up/update channel only. Never the durable record. |
| Transactional email | MVP/pre-launch | Brevo default, Mailjet fallback, adapter-only access. |
| Web Push | Pre-launch/post-MVP | Opt-in, VAPID, opaque `notification_id` payload only. |
| Native push | Post-MVP | Capacitor shell only; same preference/subscription model. |
| Centrifugo | First realtime scale step | Presence/history/recovery/fan-out; Redis only ephemeral engine. |
| Watch-party chat | Post-MVP | Separate persisted message model and moderation decision. |
| Discord/webhook user integrations | Post-MVP | Opt-in only; never default; privacy review required. |

## Email Implementation

Email delivery is accessed only through:

```ts
export interface EmailGateway {
  sendTransactionalEmail(input: {
    notificationId: string
    to: string
    subject: string
    html: string
    text: string
    idempotencyKey: string
  }): Promise<{ provider: 'brevo' | 'mailjet'; providerMessageId: string }>
}
```

Rules:

- Brevo is the production default.
- Mailjet is a prepared fallback adapter.
- React Email renders HTML and plain text in server-only code.
- SPF, DKIM and DMARC are required before public launch.
- Bounce, block, spam complaint and delivery webhooks update
  `DeliveryAttempt` and may suppress future email for the affected address.
- Provider secrets are handled by the secrets-management note; never expose
  them to route loaders or client code.

## Preferences and Policy

Preferences are resolved in this order:

1. mandatory security/account notices;
2. per-user global channel settings;
3. per-save or per-group overrides;
4. notification category defaults;
5. quiet hours and digest settings.

Mandatory security/account notices cannot be disabled. Gameplay reminders,
digests and social notifications can be disabled or collapsed depending on
category.

Required preference fields:

- locale;
- timezone;
- quiet-hours window;
- digest frequency;
- channel enablement;
- category enablement;
- group/save override scope.

## Categories

| Category | Default |
|---|---|
| Security/account | In-app + email, cannot disable. |
| Transactional gameplay | In-app, email only for important deadlines. |
| Deadline/realtime | In-app + realtime; push/email only if opted in. |
| Narrative/digest | In-app; digest-capable. |
| Social/group | In-app; external channels opt-in only. |
| Ops/internal | Not user-facing. |

## Scheduling and Rate Limits

The scheduler owns future reminders and digests, but Notification owns the
policy deciding whether to create or deliver them.

Required rules:

- collapse duplicate notifications in the same category/window;
- cap per-user channel sends;
- respect quiet hours except security/account notices;
- coalesce async multiplayer deadline reminders;
- retry transient provider failures with exponential backoff;
- mark permanent failures terminal and visible to ops metrics.

Rate-limiting and anti-abuse extends [[rate-limiting-anti-abuse]]:

- notification-triggering endpoints receive per-user and per-group quotas;
- outbound email and push have channel caps;
- watch-party chat and spectator messages require a separate quota table before
  implementation;
- notification storms emit `infra.rate_limit_pattern` or
  `notification.delivery_throttled` events.

## Privacy and Compliance

Notification data is personal data. The Privacy Notice and DSAR export must
include:

- notification records;
- preferences;
- subscriptions;
- delivery attempts;
- transactional email history;
- provider ids where retained.

Push payloads must not contain personal data beyond the opaque notification id.
External providers receive only the minimum required data for delivery.

Transactional email remains a processor surface. Any provider change requires:

1. DPA check;
2. RoPA update;
3. Privacy Notice update;
4. staging delivery test;
5. provider migration entry in the deployment change record.

## Migration and Update Process

Provider migration:

1. Implement new adapter behind the existing port.
2. Add contract tests using the same fixture set.
3. Dual-send in staging with idempotency keys.
4. Canary production traffic if production exists.
5. Flip provider config.
6. Keep old adapter for rollback until delivery metrics are stable.

Notification schema migration:

1. Add new columns/tables forward-only.
2. Backfill in a job with progress metrics.
3. Keep readers compatible with old and new shape.
4. Remove old shape only after one release cycle and an ADR/note update.

Dependency updates:

- React Email, web-push, Capacitor and provider SDKs stay pinned.
- Renovate opens upgrades, never automerges frontier notification deps.
- Each upgrade runs unit, provider contract, PWA offline and e2e notification
  smoke tests before merge.

## Test Plan

- Unit: preference resolution, quiet hours, digest coalescing, deadline
  reminders, idempotency keys and retry classification.
- Integration: Postgres outbox -> Notification record -> SSE event -> Dexie
  mirror.
- Provider contract: Brevo adapter, Mailjet fallback, webhook signature/payload
  validation, bounce/complaint suppression.
- PWA: offline inbox, reconnect sync, stale Dexie reconciliation, Web Push
  subscription lifecycle when enabled.
- Abuse: storm collapse, channel caps, async multiplayer deadline reminder
  coalescing, watch-party chat quota once chat is promoted.

## Source Versions Locked by ADR-0043

| Tool/library | Version |
|---|---:|
| React Email | 6.3.1 |
| `@react-email/render` | 2.0.8 |
| `web-push` | 3.6.7 |
| `@types/web-push` | 3.6.4 |
| `@capacitor/core` | 8.3.4 |
| `@capacitor/push-notifications` | 8.1.1 |

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
## Related

- [[privacy-and-consent]]
- [[rate-limiting-anti-abuse]]
- [[audit-trail]]
- [[jobs-and-scheduler]]
- [[../50-Game-Design/GD-0013-narrative-inbox]]
- [[../50-Game-Design/async-multiplayer-private-group]]
