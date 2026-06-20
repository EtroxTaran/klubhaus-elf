---
title: ADR-0102 Notification platform re-ratification + offline-delivery clause
status: accepted
tags: [adr, architecture, notification, messaging, offline, pwa, sync, governance, supersede, fmx-106, fmx-156, accepted]
context: [notification, offline-sync]
created: 2026-06-08
updated: 2026-06-19
type: adr
binding: true
supersedes: ADR-0043-notification-and-messaging-platform
superseded_by:
related:
  - [[ADR-0043-notification-and-messaging-platform]]
  - [[ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[ADR-0002-offline-first]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0023-realtime-transport]]
  - [[ADR-0089-bounded-context-portfolio-reconciliation]]
  - [[ADR-0065-narrative-media-press-content-ownership]]
  - [[ADR-0076-narrative-newsworthiness-event-contracts]]
  - [[ADR-0081-statistics-analytics-read-model-owner]]
  - [[ADR-0085-media-ecology-context-and-outlet-operational-behaviour]]
  - [[../../60-Research/notification-offline-delivery-2026-06-15]]
  - [[../../40-Execution/fmx-156-notification-platform-decision-queue-2026-06-15]]
  - [[../../30-Implementation/notification-messaging-platform]]
  - [[../../30-Implementation/pwa-offline-strategy]]
  - [[../../00-Index/Open-Decisions-Dossier]]
---

# ADR-0102: Notification platform re-ratification + offline-delivery clause

> **RATIFIED on 2026-06-19.** Nico approved the linked FMX decision
> queue via `APPROVE ALL RECOMMENDED`; this ADR/amendment is now
> binding according to its approved scope.


## Status

accepted

FMX-156 reopens this ADR as a coherent accepted decision. Earlier vault
state had `status: accepted` with `binding: false` and body text that still
said "accepted by Nico 2026-06-19 ratify"; that mixed state is not an implementable
architecture decision. This file now uses one consistent state:
`status: draft` / `binding: false`.

If Nico accepts the FMX-156 packet, promote this ADR to `accepted` /
`binding: true`, keep [[ADR-0043-notification-and-messaging-platform]]
superseded, and update the front-door summaries from "pending" to "binding".

## Date

2026-06-15

## Context

[[ADR-0043-notification-and-messaging-platform]] defined the original
Notification platform: a first-party DDD **Notification** bounded context,
Postgres as durable system of record, a Dexie inbox mirror for offline reads,
SSE for MVP realtime wake-up/update, Centrifugo as the scale step,
Brevo/Mailjet transactional email behind an `EmailGateway`, prepared Web Push
with VAPID and a deferred native-push path through Capacitor.

That content is still the right starting point, but FMX-156 found three gaps
that prevent clean implementation:

1. **Ratification chain ambiguity.** ADR-0043 is superseded, while ADR-0102 was
   marked `accepted` but not binding and still contained "accepted by Nico 2026-06-19"
   language. The active chain must have one explicit terminus.
2. **Offline delivery precision.** Web Push and native push can wake runtimes
   when the app is not open, and push services can queue messages while the user
   agent is offline, but those channels are not FMX-owned durable logs and do
   not prove the user saw the notification. The game needs an inbox-first
   replay contract.
3. **Version currency drift.** ADR-0043's source-version table contains old
   package observations. June 15 source checks show `react-email` and
   `@capacitor/core` have moved while `web-push`, `@types/web-push` and
   `@capacitor/push-notifications` still match the old values. Exact package
   pins are therefore a separate dependency-currency decision, not something to
   ratify incidentally in this ADR.

Research for FMX-156 is preserved in
[[../../60-Research/notification-offline-delivery-2026-06-15]] and raw captures
under [[../../60-Research/raw-perplexity/raw-notification-offline-delivery-2026-06-15]].

## Decision Questions

### D1 - Ratification shape

| Option | Description | Recommendation |
|---|---|---|
| **A** | Keep ADR-0102 as the dedicated successor to ADR-0043, and after Nico approval promote it to `accepted` / `binding: true`. | **Yes** |
| B | Fold the ratification into a generic governance/status ADR and leave this file as an offline-only note. | No |
| C | Re-activate ADR-0043 directly and remove ADR-0102 from the chain. | No |

Recommendation: **D1 = A**. The offline-delivery clause is
Notification-domain-specific, so a dedicated successor ADR is clearer than a
generic governance note. ADR-0043 remains historical and is not body-edited.

### D2 - Authoritative notification read surface

| Option | Description | Recommendation |
|---|---|---|
| **A** | Use Postgres notification records plus the Dexie inbox mirror as the only authoritative read/replay surface; all channels only accelerate awareness. | **Yes** |
| B | Let Web Push/native push payloads carry renderable notification truth when available. | No |
| C | Treat realtime frames as the primary source for online sessions and reconcile later. | No |

Recommendation: **D2 = A**. The server writes the durable notification before
any external channel attempt. The UI renders from the inbox projection, not
from a push/email/realtime payload.

### D3 - Push, offline and asleep behavior

| Option | Description | Recommendation |
|---|---|---|
| **A** | Treat Web Push/native push as best-effort wake/attention channels; they may be delayed, suppressed, expired or platform-limited, and reconnect replay always repairs missed state. | **Yes** |
| B | Treat push-service queueing as enough durability for important gameplay notices. | No |
| C | Remove push from the platform until a future mobile-only shell exists. | No |

Recommendation: **D3 = A**. MDN, W3C and web.dev all support background push
delivery semantics, but platform docs also show quotas, TTL/urgency/topic
constraints, invalid subscriptions, Android Doze/Private Space caveats and
native-shell data-only limitations. FMX should use push as an alert path, never
as the record of truth.

### D4 - Replay, idempotency and suppression

| Option | Description | Recommendation |
|---|---|---|
| **A** | Use `lastSeenVersion`/watermark replay, stable notification ids and `DeliveryAttempt` idempotency. Suppress push only when the server already knows the notification is seen/read or recently foreground-consumed; tolerate redundant push when state is local/offline and unsynced. | **Yes** |
| B | Make read/seen a global multi-device CRDT and use it to suppress all channels. | No |
| C | Keep all read/seen state local-only and never suppress cross-device push. | No |

Recommendation: **D4 = A**. This keeps notification content server-owned and
replayable, avoids CRDT complexity, and still prevents avoidable duplicate
alerts when the server has reliable evidence.

### D5 - Dependency-version handling

| Option | Description | Recommendation |
|---|---|---|
| **A** | Do not ratify exact notification package pins in FMX-156; record June 15 source checks and route exact package updates to FMX-168/tooling or the first code-phase implementation. | **Yes** |
| B | Update ADR-0102 with exact package pins now. | No |
| C | Keep ADR-0043's old version table as binding. | No |

Accepted recommendation: **D5 = A**. FMX-156 should decide architecture behavior. Exact
dependency pins must be verified again at implementation time and pinned in
code/tooling, not frozen in an architecture ratification note.

## Proposed Decision

Accepted by Nico 2026-06-19: **D1=A, D2=A, D3=A, D4=A, D5=A.**

If accepted, ADR-0102 becomes the binding Notification platform terminus:

- Notifications are a **first-party DDD bounded context** in the
  *Engagement & Narrative* cluster.
- **Postgres is the durable system of record** for notification records,
  subscriptions, delivery attempts, preferences, schedules and template
  versions.
- **Dexie mirrors the inbox** for offline reads, local UI state and reconnect
  recovery. Dexie is not authoritative.
- Domain events enter through the **Postgres transactional outbox**; the
  notification record is durable before SSE, email, Web Push or native push is
  attempted.
- **In-app inbox is the primary channel** and the only read/replay surface.
- **SSE/Centrifugo, email, Web Push and native push are transient delivery
  accelerants**. They may wake, alert, deep-link or update counters; they do not
  own notification truth.
- **Replay uses the ADR-0090 seam**: a client carries a notification
  `lastSeenVersion`/watermark, reconnects, fetches records above the watermark
  and advances the watermark only after applying the inbox projection.
- **No CRDT for notification content.** Notifications are owner-published facts.
  Read/seen/dismissed state is preference-like state that may sync LWW, while
  server-known seen/read watermarks may suppress redundant push.
- **Push payloads are opaque hints**: `notification_id`, `version`, category,
  urgency and deep-link metadata only. No secret, provider credential or
  personal data belongs in push payloads.
- **Game cadence follows genre precedent**: central inbox/news feed, badges for
  unseen items, critical-only must-answer gates, digest/batching for routine
  reports, quiet hours and configurable push. Avoid red-dot spam and hidden
  state that can only be recovered from an external alert.

## Consequences

Positive:

- ADR-0043 -> ADR-0102 has one explicit target once Nico approves it.
- Offline players lose no notification truth; they replay from the inbox after
  reconnect.
- Web Push/native push can be useful without becoming a reliability or privacy
  dependency.
- Duplicate alerts are reduced where the server has reliable read/foreground
  evidence, while offline/local-only state remains safe.
- Exact package versions stay under the dependency-currency workflow.

Negative / follow-up:

- Implementation must support notification watermarks, delivery idempotency and
  subscription invalidation handling before enabling push.
- Some redundant push is accepted when another device has only local/offline
  unsynced seen state.
- If Nico accepts this ADR, front-door summaries and implementation notes must
  be promoted from "pending" to binding wording in the same follow-up.

## Risks

Low-to-medium after approval. The accepted architecture is conservative and
source-backed, and changes the active Notification chain from a mixed
`accepted`/`binding:false` state to an explicit accepted record. Code-phase
implementation still requires the normal docs-to-code bootstrap gates.

## Supersedes

[[ADR-0043-notification-and-messaging-platform]] - superseded source decision.
FMX-156 does not body-edit ADR-0043; this file carries the successor accepted record.

## Sources

- FMX synthesis:
  [[../../60-Research/notification-offline-delivery-2026-06-15]]
- Raw Perplexity/source-check capture:
  [[../../60-Research/raw-perplexity/raw-notification-offline-delivery-2026-06-15]]
- MDN Push API:
  <https://developer.mozilla.org/en-US/docs/Web/API/Push_API>
- W3C Push API Working Draft:
  <https://www.w3.org/TR/push-api/>
- web.dev push notifications overview:
  <https://web.dev/articles/push-notifications-overview>
- Apple Web Push for web apps and browsers:
  <https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers>
- Capacitor Push Notifications docs:
  <https://capacitorjs.com/docs/apis/push-notifications>
- React Email update/render docs:
  <https://react.email/docs/getting-started/updating-react-email>
- web-push README:
  <https://github.com/web-push-libs/web-push>

## Related Docs

- [[../../40-Execution/fmx-156-notification-platform-decision-queue-2026-06-15]]
- [[../../30-Implementation/notification-messaging-platform]]
- [[../../30-Implementation/pwa-offline-strategy]]
- [[ADR-0090-offline-sync-scope-and-conflict-strategy]]
- [[ADR-0002-offline-first]]
- [[ADR-0028-postgres-transactional-outbox]]
- [[ADR-0023-realtime-transport]]
