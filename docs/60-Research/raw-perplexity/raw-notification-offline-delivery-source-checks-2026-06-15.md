---
title: "Raw - notification offline delivery source checks (FMX-156)"
status: raw
tags: [research, raw, source-check, context7, ref, notification, push, offline, dependency-currency, fmx-156]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-156
related:
  - [[../notification-offline-delivery-2026-06-15]]
  - [[raw-notification-offline-delivery-2026-06-15]]
  - [[../../40-Execution/fmx-156-notification-platform-decision-queue-2026-06-15]]
  - [[../../10-Architecture/09-Decisions/ADR-0102-notification-platform-re-ratification-offline-delivery-clause]]
  - [[../../30-Implementation/notification-messaging-platform]]
---

# Raw - notification offline delivery source checks (FMX-156)

Checked on 2026-06-15.

## Platform behavior checks

| Source | Observed fact |
|---|---|
| MDN Push API | Push API is available in Web Workers and lets web apps receive server-pushed messages whether the app is foregrounded or currently loaded. An active service worker is required; the service worker starts as needed for incoming push messages. Browser handling differs, including quota/battery policies and `pushsubscriptionchange` for invalid/about-to-expire subscriptions. |
| W3C Push API Working Draft, 2025-12-01 | Application servers can send push messages while the web app or user agent is inactive. Push messages are delivered to a Service Worker. A push service can store messages while a user agent is temporarily offline, but push messages are still subject to push-service limits, latency and restrictions. |
| web.dev push notifications overview | Push and notifications are distinct. The browser returns a `PushSubscription` that should be stored server-side. The push service queues until the browser comes online or the message expires. TTL, urgency and topic customize delivery. The service worker receives `push` and can display a notification. |
| Apple Web Push documentation | Apple is the platform-specific source for Safari/iOS Web Push behavior. Treat it as a platform caveat source, not as FMX-owned delivery durability. |

## Library and SDK documentation checks

| Source | Observed fact |
|---|---|
| Context7 React Email `/resend/react-email` | React Email 6 unifies component and render utilities in `react-email`; `render` imports from `react-email`, replacing old `@react-email/render` import guidance for the main migration path. |
| Ref React Email docs | Official update/render docs show `render` usage from `react-email` and migration away from package-split imports. |
| Context7 Capacitor docs | Android 13 requires runtime notification permission checks. Android delivery can be affected by Doze; high-priority FCM can increase chance of receipt. Android 15 Private Space can hide notifications until unlocked and is not detectable by the app. |
| Ref Capacitor docs | iOS silent push is not supported by the Capacitor Push Notifications plugin. Android data-only notifications do not call `pushNotificationReceived` if the app was killed unless a native `FirebaseMessagingService` path is added. |
| Context7 web-push docs | `sendNotification` supports VAPID, TTL, urgency, topic, content encoding, timeout/proxy and returns push-service response metadata. 404/410 mean invalid/expired subscription and should remove or repair the stored subscription; 429 means rate limiting. |

## Registry and release checks

Checked with direct npm registry/GitHub release requests.

| Tool/library | Observed current artifact | Notes |
|---|---:|---|
| `react-email` | 6.6.0 | npm `latest`, node `>=20.0.0`; package exports render utilities. |
| `@react-email/render` | 2.0.8 | npm `latest`; still exists, but React Email 6 migration target is unified `react-email` imports. |
| `web-push` | 3.6.7 | npm `latest`, node `>=16`. |
| `@types/web-push` | 3.6.4 | npm `latest`. |
| `@capacitor/core` | 8.4.0 | npm `latest`. ADR-0043's `8.3.4` is stale. |
| `@capacitor/push-notifications` | 8.1.1 | npm `latest`, peer `@capacitor/core >=8.0.0`. |
| `@getbrevo/brevo` | 5.0.4 | npm `latest`, node `>=18.0.0`. |
| `node-mailjet` | 6.0.11 | npm `latest`, node `>=12.0.0`. |
| Centrifugo | v6.8.2 | GitHub latest, non-draft, non-prerelease, published 2026-06-08. |

## Decision supported

FMX-156 should not ratify exact notification package pins. It should record the
current source checks, mark ADR-0043's version table as historical and route
exact package pinning to the dependency-currency/code-phase workflow.

## Source URLs

- MDN Push API:
  <https://developer.mozilla.org/en-US/docs/Web/API/Push_API>
- W3C Push API:
  <https://www.w3.org/TR/push-api/>
- web.dev push notifications overview:
  <https://web.dev/articles/push-notifications-overview>
- Apple Web Push:
  <https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers>
- Capacitor Push Notifications:
  <https://capacitorjs.com/docs/apis/push-notifications>
- React Email update docs:
  <https://react.email/docs/getting-started/updating-react-email>
- React Email render docs:
  <https://react.email/docs/utilities/render>
- web-push README:
  <https://github.com/web-push-libs/web-push>
- npm registry:
  <https://registry.npmjs.org/react-email/latest>,
  <https://registry.npmjs.org/%40react-email%2Frender/latest>,
  <https://registry.npmjs.org/web-push/latest>,
  <https://registry.npmjs.org/%40types%2Fweb-push/latest>,
  <https://registry.npmjs.org/%40capacitor%2Fcore/latest>,
  <https://registry.npmjs.org/%40capacitor%2Fpush-notifications/latest>
- Centrifugo release:
  <https://github.com/centrifugal/centrifugo/releases/tag/v6.8.2>

## Related

- [[../notification-offline-delivery-2026-06-15]]
- [[raw-notification-offline-delivery-2026-06-15]]
- [[../../40-Execution/fmx-156-notification-platform-decision-queue-2026-06-15]]
