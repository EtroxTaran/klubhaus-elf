---
title: "FMX-156 notification platform decision queue"
status: accepted
tags: [execution, decision-queue, notification, messaging, offline, push, fmx-156, accepted]
created: 2026-06-15
updated: 2026-06-19
type: decision-queue
binding: true
linear: FMX-156
related:
  - [[../60-Research/notification-offline-delivery-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-notification-offline-delivery-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-notification-offline-delivery-source-checks-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0102-notification-platform-re-ratification-offline-delivery-clause]]
  - [[../30-Implementation/notification-messaging-platform]]
---

# FMX-156 notification platform decision queue

> **APPROVED on 2026-06-19.** Nico approved all recommended options via
> `APPROVE ALL RECOMMENDED`. This note is now the accepted decision
> record; no open Nico decision remains for FMX-156.


## Context

FMX-156 repairs the ADR-0043 -> ADR-0102 Notification platform chain. ADR-0102
now has one coherent non-binding state (`draft` / `binding: false`) and awaits
Nico's ratification decision. The recommendations below are source-backed but
not accepted until Nico decides.

## D1 - Ratification shape

| Option | Description | Recommendation | Nico decision (2026-06-19) |
|---|---|---|---|
| **A** | Keep ADR-0102 as the dedicated successor to ADR-0043 and, after approval, promote it to `accepted` / `binding: true`. | **Yes** | See approved packet |
| B | Fold the status repair into a generic governance/status ADR and keep this file offline-only. | No | See approved packet |
| C | Re-activate ADR-0043 directly and drop ADR-0102 as successor. | No | See approved packet |

Recommended: **A**.

## D2 - Authoritative read surface

| Option | Description | Recommendation | Nico decision (2026-06-19) |
|---|---|---|---|
| **A** | Postgres notification records plus Dexie inbox mirror are the only read/replay surface; external channels accelerate awareness only. | **Yes** | See approved packet |
| B | Allow push/native payloads to carry renderable notification truth. | No | See approved packet |
| C | Treat realtime frames as primary online truth and reconcile later. | No | See approved packet |

Recommended: **A**.

## D3 - Push/asleep/offline policy

| Option | Description | Recommendation | Nico decision (2026-06-19) |
|---|---|---|---|
| **A** | Web Push/native push are best-effort wake/attention channels; missed/expired/suppressed push is repaired by inbox replay. | **Yes** | See approved packet |
| B | Treat push-service queueing as enough durability for important gameplay notices. | No | See approved packet |
| C | Remove push from the platform until a future native shell exists. | No | See approved packet |

Recommended: **A**.

## D4 - Replay, idempotency and cross-device suppression

| Option | Description | Recommendation | Nico decision (2026-06-19) |
|---|---|---|---|
| **A** | Use watermark replay plus stable ids and `DeliveryAttempt` idempotency; suppress push only with server-known seen/read or foreground evidence. | **Yes** | See approved packet |
| B | Add a global read/seen CRDT and suppress all channels from it. | No | See approved packet |
| C | Keep read/seen local-only and never suppress cross-device push. | No | See approved packet |

Recommended: **A**.

## D5 - Dependency version handling

| Option | Description | Recommendation | Nico decision (2026-06-19) |
|---|---|---|---|
| **A** | Record source checks now, but leave exact package pins to FMX-168/tooling or first code-phase implementation. | **Yes** | See approved packet |
| B | Ratify exact notification package versions in ADR-0102 now. | No | See approved packet |
| C | Keep ADR-0043's old version table as binding. | No | See approved packet |

Recommended: **A**.

## Recommended package if Nico accepts all

Approve **D1-D5 = A/A/A/A/A**.

Applied follow-up after approval:

- Promote ADR-0102 to `accepted` / `binding: true`.
- Keep ADR-0043 superseded and body-untouched.
- Promote Current-State, Decision-Log, Architecture-Map and Implementation-Map
  wording from pending to binding.
- Keep dependency versions routed to the dependency-currency/code-phase beat.


## Approved Packet

Nico approved all recommended options on 2026-06-19: **D1=A, D2=A, D3=A, D4=A, D5=A**.

No open Nico decision remains for FMX-156.

## Related

- [[../60-Research/notification-offline-delivery-2026-06-15]]
- [[../10-Architecture/09-Decisions/ADR-0102-notification-platform-re-ratification-offline-delivery-clause]]
- [[../30-Implementation/notification-messaging-platform]]
