---
title: "Notification offline delivery and ratification packet (FMX-156)"
status: current
tags: [research, synthesis, notification, messaging, inbox, push, offline, pwa, game-precedent, fmx-156]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-156
related:
  - [[raw-perplexity/raw-notification-offline-delivery-2026-06-15]]
  - [[raw-perplexity/raw-notification-offline-delivery-source-checks-2026-06-15]]
  - [[../40-Execution/fmx-156-notification-platform-decision-queue-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0102-notification-platform-re-ratification-offline-delivery-clause]]
  - [[../10-Architecture/09-Decisions/ADR-0043-notification-and-messaging-platform]]
  - [[../30-Implementation/notification-messaging-platform]]
---

# Notification offline delivery and ratification packet (FMX-156)

## Scope

FMX-156 resolves the Notification platform successor chain
ADR-0043 -> ADR-0102 and closes the offline-delivery gaps around Web Push,
native push, cross-device suppression and reconnect replay.

This packet is intentionally non-binding. It asks Nico to decide whether to
promote ADR-0102 to the binding Notification platform terminus.

## Source-backed findings

### Push can wake, but push is not FMX truth

MDN and W3C both support the basic platform premise: Web Push can deliver to a
service worker when the web app is not foregrounded or currently loaded, and a
push service can store messages while the user agent is temporarily offline.
web.dev also describes queued delivery until the browser comes online or the
message expires.

That is not enough to make push the FMX record of truth:

- browsers differ in quota, battery and subscription handling;
- Web Push sends through browser-vendor push services, not an FMX-owned log;
- TTL, urgency and topic affect attempted delivery;
- invalid subscriptions must be repaired after 404/410 style failures;
- Capacitor/native push adds platform caveats such as Android Doze, Android 15
  Private Space and iOS/data-only limitations.

Recommendation: persist notification records before any channel attempt and
render the UI from the inbox projection.

### Inbox-first replay is the durable path

The Notification context should use the same broad seam as ADR-0090:

- Postgres owns the durable notification record.
- Dexie mirrors recent inbox state for offline reads and local UI.
- Each client carries a notification `lastSeenVersion` or equivalent watermark.
- Reconnect fetches records above the watermark and applies them to the inbox
  projection.
- Channel attempts are idempotent and separately auditable through
  `DeliveryAttempt`.

No external channel is on the offline read path. Missed SSE, expired push,
delivery-provider failure or a sleeping OS delays awareness only; it does not
delete a notification.

### Cross-device suppression should be conservative

The useful product behavior is clear: if the user is actively reading a notice
on one device, the game should avoid noisy duplicate pushes on another device.
The safe architecture rule is narrower:

- suppress push when the server has reliable seen/read/foreground evidence;
- tolerate redundant push when read state is only local/offline and unsynced;
- never let read/seen state mutate notification content;
- avoid a notification-content CRDT.

This preserves ADR-0090's owner-published-fact posture and still reduces spam
when the server actually knows the alert is already consumed.

## Game and real-world product guidance

Football-management UX should feel like a manager's working desk, not a generic
mobile notification feed.

Recommended surfaces:

- central inbox/news feed as the durable reviewable history;
- dashboard badges and deadline cards for "next important thing";
- critical-only must-answer gates for lineup, matchday, contract, transfer and
  compliance blockers;
- digest/batching for scouting, training, board and media reports;
- quiet hours and category/channel preferences;
- grouped threads for transfer/player/scouting topics instead of repeated
  one-off alerts.

Avoid:

- red-dot spam;
- monetization-style push loops;
- important state that exists only inside an external notification;
- repeated report notifications when a digest or thread would preserve context.

Real club operations support the same split: urgent staff alerts can accelerate
attention, while scouting, medical, transfer, finance and admin records need a
durable system of record.

## Recommended decision packet

| Decision | Recommendation | Why |
|---|---|---|
| D1 ratification chain | Keep ADR-0102 as successor to ADR-0043 and promote it only after Nico approval. | Dedicated successor is clearer than editing ADR-0043 or hiding a domain-specific offline clause in governance. |
| D2 read surface | Postgres + Dexie inbox is authoritative; transient channels only accelerate awareness. | Survives offline/asleep/closed-tab cases and preserves replay. |
| D3 push policy | Web Push/native push are best-effort wake/attention channels. | Platform docs support background delivery but also show expiry, quotas, subscriptions and OS caveats. |
| D4 replay/suppression | Watermark replay plus idempotent `DeliveryAttempt`; suppress only with server-known seen/foreground evidence. | Prevents duplicates without making local read state authoritative or adding CRDT scope. |
| D5 dependency versions | Do not ratify exact package pins here; route to dependency-currency/code phase. | June 15 source checks already show mixed currency in ADR-0043's table. |

## Version-currency note

ADR-0043's version table is a historical source observation, not a safe current
pin list. On 2026-06-15:

- `react-email` latest was 6.6.0, while ADR-0043 named 6.3.1.
- React Email 6 migration guidance imports `render` from `react-email`, even
  though `@react-email/render` 2.0.8 still exists.
- `@capacitor/core` latest was 8.4.0, while ADR-0043 named 8.3.4.
- `web-push` 3.6.7, `@types/web-push` 3.6.4 and
  `@capacitor/push-notifications` 8.1.1 still matched the ADR-0043 values.

Exact code pins must be rechecked at the implementation beat.

## Decision needed from Nico

See [[../40-Execution/fmx-156-notification-platform-decision-queue-2026-06-15]]
for the full D1-D5 options and recommendations. Until Nico accepts, ADR-0102
stays `draft` / `binding: false` and FMX-156 remains in progress.

## Sources

- Raw Perplexity capture:
  [[raw-perplexity/raw-notification-offline-delivery-2026-06-15]]
- Source checks:
  [[raw-perplexity/raw-notification-offline-delivery-source-checks-2026-06-15]]
- MDN Push API:
  <https://developer.mozilla.org/en-US/docs/Web/API/Push_API>
- W3C Push API:
  <https://www.w3.org/TR/push-api/>
- web.dev push notifications overview:
  <https://web.dev/articles/push-notifications-overview>
- Capacitor Push Notifications:
  <https://capacitorjs.com/docs/apis/push-notifications>
- React Email docs:
  <https://react.email/docs/getting-started/updating-react-email>,
  <https://react.email/docs/utilities/render>
- web-push:
  <https://github.com/web-push-libs/web-push>

## Related

- [[../40-Execution/fmx-156-notification-platform-decision-queue-2026-06-15]]
- [[../10-Architecture/09-Decisions/ADR-0102-notification-platform-re-ratification-offline-delivery-clause]]
- [[../30-Implementation/notification-messaging-platform]]
