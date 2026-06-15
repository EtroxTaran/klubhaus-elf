---
title: "FMX-156 notification platform decision queue"
status: current
tags: [execution, decision-queue, notification, messaging, offline, push, fmx-156]
created: 2026-06-15
updated: 2026-06-15
type: execution
binding: false
linear: FMX-156
related:
  - [[../60-Research/notification-offline-delivery-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-notification-offline-delivery-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-notification-offline-delivery-source-checks-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0102-notification-platform-re-ratification-offline-delivery-clause]]
  - [[../30-Implementation/notification-messaging-platform]]
---

# FMX-156 notification platform decision queue

## Context

FMX-156 repairs the ADR-0043 -> ADR-0102 Notification platform chain. ADR-0102
now has one coherent non-binding state (`draft` / `binding: false`) and awaits
Nico's ratification decision. The recommendations below are source-backed but
not accepted until Nico decides.

## D1 - Ratification shape

| Option | Description | Recommendation | Nico decision |
|---|---|---|---|
| **A** | Keep ADR-0102 as the dedicated successor to ADR-0043 and, after approval, promote it to `accepted` / `binding: true`. | **Yes** | Pending |
| B | Fold the status repair into a generic governance/status ADR and keep this file offline-only. | No | Pending |
| C | Re-activate ADR-0043 directly and drop ADR-0102 as successor. | No | Pending |

Recommended: **A**.

## D2 - Authoritative read surface

| Option | Description | Recommendation | Nico decision |
|---|---|---|---|
| **A** | Postgres notification records plus Dexie inbox mirror are the only read/replay surface; external channels accelerate awareness only. | **Yes** | Pending |
| B | Allow push/native payloads to carry renderable notification truth. | No | Pending |
| C | Treat realtime frames as primary online truth and reconcile later. | No | Pending |

Recommended: **A**.

## D3 - Push/asleep/offline policy

| Option | Description | Recommendation | Nico decision |
|---|---|---|---|
| **A** | Web Push/native push are best-effort wake/attention channels; missed/expired/suppressed push is repaired by inbox replay. | **Yes** | Pending |
| B | Treat push-service queueing as enough durability for important gameplay notices. | No | Pending |
| C | Remove push from the platform until a future native shell exists. | No | Pending |

Recommended: **A**.

## D4 - Replay, idempotency and cross-device suppression

| Option | Description | Recommendation | Nico decision |
|---|---|---|---|
| **A** | Use watermark replay plus stable ids and `DeliveryAttempt` idempotency; suppress push only with server-known seen/read or foreground evidence. | **Yes** | Pending |
| B | Add a global read/seen CRDT and suppress all channels from it. | No | Pending |
| C | Keep read/seen local-only and never suppress cross-device push. | No | Pending |

Recommended: **A**.

## D5 - Dependency version handling

| Option | Description | Recommendation | Nico decision |
|---|---|---|---|
| **A** | Record source checks now, but leave exact package pins to FMX-168/tooling or first code-phase implementation. | **Yes** | Pending |
| B | Ratify exact notification package versions in ADR-0102 now. | No | Pending |
| C | Keep ADR-0043's old version table as binding. | No | Pending |

Recommended: **A**.

## Recommended package if Nico accepts all

Approve **D1-D5 = A/A/A/A/A**.

Applied follow-up after approval:

- Promote ADR-0102 to `accepted` / `binding: true`.
- Keep ADR-0043 superseded and body-untouched.
- Promote Current-State, Decision-Log, Architecture-Map and Implementation-Map
  wording from pending to binding.
- Keep dependency versions routed to the dependency-currency/code-phase beat.

## Related

- [[../60-Research/notification-offline-delivery-2026-06-15]]
- [[../10-Architecture/09-Decisions/ADR-0102-notification-platform-re-ratification-offline-delivery-clause]]
- [[../30-Implementation/notification-messaging-platform]]
