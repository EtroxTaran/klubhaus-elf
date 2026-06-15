---
title: "Raw - notification offline delivery (FMX-156)"
status: raw
tags: [research, raw, perplexity, notification, messaging, inbox, push, offline, pwa, fmx-156]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-156
related:
  - [[../notification-offline-delivery-2026-06-15]]
  - [[raw-notification-offline-delivery-source-checks-2026-06-15]]
  - [[../../40-Execution/fmx-156-notification-platform-decision-queue-2026-06-15]]
  - [[../../10-Architecture/09-Decisions/ADR-0102-notification-platform-re-ratification-offline-delivery-clause]]
  - [[../../30-Implementation/notification-messaging-platform]]
---

# Raw - notification offline delivery (FMX-156)

## Research prompt

Perplexity was asked on 2026-06-15:

> For a football manager PWA notification platform ADR in June 2026, research
> the current best practices for offline notification delivery and inbox replay.
> Cover Web Push/Push API/Service Worker behavior when the app is closed,
> asleep, or offline; durable server inbox vs transient channels; idempotency,
> replay/watermarks, and push suppression across devices. Also include analogs
> from real football club operations and management games such as Football
> Manager, OSM, Top Eleven, and Hattrick. End with 5 decision questions and a
> recommended option for each. Provide source links for all material claims.

## Source-quality note

Perplexity was used as the discovery pass. Its consumer push-notification and
game-precedent sources were not treated as binding evidence. FMX-156 then ran
direct checks against MDN, W3C, web.dev, Capacitor, React Email, web-push, npm
registry metadata and Centrifugo release metadata. Those source checks are
preserved in [[raw-notification-offline-delivery-source-checks-2026-06-15]].

## Extracted findings

- Best-practice architecture is a durable server inbox plus transient push,
  realtime and email channels.
- Web Push can wake a service worker when the app is not foregrounded or even
  currently loaded, but platform behavior still depends on browser, OS, push
  service, permissions, subscription validity, TTL and quota/caveat handling.
- Offline delivery should be modeled as deferred visibility, not lost truth:
  the server inbox stores the record, while clients replay records above a
  stored watermark after reconnect.
- Push payloads should be minimal hints such as `notification_id`, `topic`,
  version/cursor, urgency and deep-link metadata. The service worker should
  fetch or reconcile authoritative inbox data before showing user-facing truth.
- Idempotency should exist at creation and delivery-attempt layers. A stable
  notification id plus delivery-attempt key prevents duplicate inbox entries
  and duplicate channel retries.
- Cross-device push suppression should use server-known evidence. If one device
  has opened the inbox and synced a read/seen watermark, redundant push to
  other devices can be suppressed. If read state is only local/offline and not
  synced, redundant push is safer than losing urgent deadline awareness.
- Read/seen/dismissed state is preference-like state; notification content is
  owner-published fact state. Perplexity recommended server-side read state for
  suppression, but this was narrowed in the synthesis to avoid CRDT scope:
  server-known watermarks can suppress push, while local/offline state may sync
  LWW and never mutates notification truth.

## Game and real-world analogs surfaced

- Football Manager-style genre UX expects a persistent inbox/news feed where
  scouting, board, staff, match and transfer messages can be revisited later.
- Sports-management games commonly add badges, deadline cards, dashboard
  reminders, match-start notices and must-answer gates for critical actions.
- OSM/Top Eleven-style mobile loops show that push is useful for deadlines,
  match timing and auctions, but overuse of red dots and monetization nudges is
  a product risk.
- Hattrick/browser-manager loops support batched asynchronous updates and
  digest-style habits instead of constant interruption.
- Real club operations separate urgent staff alerts from durable records:
  matchday or medical changes may need immediate attention, while scouting,
  admin, finance and transfer records live in the club system of record.

These analogs support product recommendations, not technical guarantees.

## Perplexity recommendations surfaced

| Question | Perplexity recommendation | FMX-156 synthesis handling |
|---|---|---|
| Rely on push alone or add server inbox? | Durable server inbox plus push as transient channel. | Adopt as D2 recommended option. |
| Service worker render full payloads or fetch backend? | Fetch/reconcile backend inbox data. | Adopt as implementation guidance. |
| How to avoid duplicates? | Idempotency keys plus per-user watermarks and server read/ack state. | Adopt with the ADR-0090 watermark seam and no content CRDT. |
| Should all notifications be pushed immediately? | No; only urgent/actionable items. | Adopt as game/product policy guidance. |
| Handle offline/asleep/closed-tab users? | Assume deferred/missed push and replay from server inbox. | Adopt as D3/D4 recommended options. |

## Perplexity citations surfaced

- web.dev push notifications overview:
  <https://web.dev/articles/push-notifications-overview>
- W3C Push API:
  <https://www.w3.org/TR/push-api/>
- Apple Web Push for web apps and browsers:
  <https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers>
- MDN Push API:
  <https://developer.mozilla.org/en-US/docs/Web/API/Push_API>
- MagicBell PWA push article:
  <https://www.magicbell.com/blog/using-push-notifications-in-pwas>
- Gravitec push best practices:
  <https://gravitec.net/blog/web-push-notification-best-practices/>
- MoEngage push best practices:
  <https://www.moengage.com/learn/push-notification-best-practices/>

## Related

- [[../notification-offline-delivery-2026-06-15]]
- [[raw-notification-offline-delivery-source-checks-2026-06-15]]
- [[../../40-Execution/fmx-156-notification-platform-decision-queue-2026-06-15]]
