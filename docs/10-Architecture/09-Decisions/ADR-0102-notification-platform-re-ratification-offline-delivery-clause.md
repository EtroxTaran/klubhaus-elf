---
title: ADR-0102 Notification platform re-ratification + offline-delivery clause
status: draft
tags: [adr, architecture, notification, messaging, offline, pwa, sync, governance, supersede, fmx-106]
created: 2026-06-08
updated: 2026-06-08
type: adr
binding: false
supersedes: ADR-0043
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
  - [[../../30-Implementation/notification-messaging-platform]]
  - [[../../30-Implementation/pwa-offline-strategy]]
  - [[../../00-Index/Open-Decisions-Dossier]]
---

# ADR-0102: Notification platform re-ratification + offline-delivery clause

## Status

draft

> **`draft` / `binding: false`.** Authored 2026-06-08 to resolve a status-drift + offline-seam gap on the
> **Notification** bounded context surfaced in the open-decisions sweep. This is a **superseding ADR**:
> it re-states [[ADR-0043-notification-and-messaging-platform]]'s decision **unchanged** under the current
> decision gate, and **adds one additive clause** binding notification delivery to the offline-first
> posture. It does **not** edit ADR-0043 (supersession is by this new file only). **Awaiting Nico ratify.**

## Date

2026-06-08

## Context

[[ADR-0043-notification-and-messaging-platform]] is the platform decision for notifications: a first-party
DDD **Notification** bounded context, **Postgres** as system of record (with SurrealDB as a non-authoritative
graph/live projection), **SSE for MVP → Centrifugo** as the realtime scale step, **Brevo/Mailjet** transactional
email behind an `EmailGateway` port, **Web Push** (VAPID) prepared-not-critical, deferred native push, and a
**Dexie** offline inbox mirror. **That decision content is sound and is not in dispute.** Two artefacts of the
phase make it ambiguous, however:

1. **Status drift.** ADR-0043's **frontmatter** says `status: draft` / `binding: true` (and carries an
   `accepted_at`), while its **body** `## Status` heading says `accepted`. The repo-wide reopening to `draft`
   (Current-State; all ADRs/GDDRs reopened) was applied to the frontmatter but not the body, so the file
   **self-contradicts** on whether it is accepted. Four cluster ADRs nonetheless cite it as a settled anchor:
   - [[ADR-0065-narrative-media-press-content-ownership]] — "ADR-0043 (Notification, accepted) owns durable
     delivery, in-app inbox …";
   - [[ADR-0076-narrative-newsworthiness-event-contracts]] — Narrative/Notification render-without-source-joins
     contract;
   - [[ADR-0081-statistics-analytics-read-model-owner]] — read-model/notification consumer boundary;
   - [[ADR-0085-media-ecology-context-and-outlet-operational-behaviour]] — "**ADR-0043** (accepted)
     Notification = delivery/inbox only" and "Notification delivers (ADR-0043)".
   Each anchors on an ADR whose binding state is currently undefined.

2. **Offline-seam gap.** ADR-0043 is dated 2026-05-22 and **predates** both [[ADR-0090-offline-sync-scope-and-conflict-strategy]]
   (which fixes the Offline Sync context's scope, the `commandId`/`expectedVersion`/`lastSeenVersion` seam, and
   server-authoritative re-validation + rebase) and the **re-centred [[ADR-0002-offline-first]] offline-first
   posture**. ADR-0043 correctly names the **in-app inbox as the primary channel that must work offline through
   Dexie**, but its **online-only channels** (SSE/Centrifugo realtime, Brevo/Mailjet email, Web Push) are never
   re-stated **against the offline-sync seam**: what a notification's lifecycle is while the client is offline,
   how queued/undelivered notifications replay on reconnect, and which channels are authoritative-for-read vs
   best-effort enhancements are left implicit. Under offline-first these must be explicit.

This ADR's job is **only** to (a) re-ratify ADR-0043's decision unchanged under the gate, fixing the status
drift in one authoritative place, and (b) add the missing offline-delivery clause. **No channel, provider,
package or boundary from ADR-0043 changes.**

## Options considered

- **D1 — How to resolve the drift + gap.**
  - **A.** Treat the **frontmatter (`draft`) as truth** and add a one-line re-ratification note pointing at it.
    Cheapest, but the **body still self-describes as `accepted`** (the contradiction the four cluster ADRs read),
    and it does **not** close the offline-delivery gap at all.
  - **B (RECOMMENDED).** Author this **small superseding ADR** that **re-states ADR-0043 unchanged** under the
    current gate **and adds an explicit offline-delivery clause** (inbox-first as the authoritative-for-read
    channel; SSE/Centrifugo/email/Web Push are best-effort **online enhancements**; undelivered notifications
    replay via the [[ADR-0090-offline-sync-scope-and-conflict-strategy]] reconnect/version seam). Fixes the
    status drift **and** the offline gap in one move while keeping the (sound) decision intact.
  - **C.** Leave entirely as a **known phase artefact** documented only in the dossier. Lowest effort, **highest
    future-confusion risk** — the body/frontmatter contradiction and the offline gap persist, and four
    downstream ADRs keep anchoring on an undefined binding state.

## Decision

Propose, awaiting Nico: **D1 = B.**

### Re-ratification (decision content unchanged)

ADR-0043's decision is **re-stated verbatim in intent** and remains the platform decision:

- Notifications are a **first-party DDD bounded context** (Notification, ordinal-anchored per
  [[ADR-0089-bounded-context-portfolio-reconciliation]] in the *Engagement & Narrative* cluster).
- **Postgres is the durable system of record**; SurrealDB is a non-authoritative graph/live projection only;
  **Dexie** mirrors the inbox for offline reads + local UI state.
- The context owns `Notification`, `NotificationPreference`, `DeliveryAttempt`, `NotificationSubscription`,
  `NotificationTemplateVersion`, `NotificationSchedule`.
- Domain events enter via the **Postgres transactional outbox** ([[ADR-0028-postgres-transactional-outbox]]);
  the notification record is **durable before any external channel is attempted**.
- Channels: **in-app inbox** (primary, offline via Dexie); **realtime** SSE (MVP) → Centrifugo (scale)
  per [[ADR-0023-realtime-transport]]; **email** Brevo→Mailjet behind `EmailGateway`; **Web Push** (VAPID,
  opaque `notification_id` payload) prepared-not-critical; native push deferred to the Capacitor shell;
  user chat/DM and SMS/WhatsApp out of MVP; ops alerts separate from user notifications. **Novu stays a future
  spike, not a start dependency.**

This supersession resets the binding state to a single, internally consistent value (this ADR's
`status: draft` / `binding: false`), removing the ADR-0043 frontmatter↔body contradiction. **ADR-0043 is not
edited**; its `superseded_by` linkage is expressed through this file's `Supersedes: ADR-0043`.

### Added offline-delivery clause (additive)

Bind notification delivery to the offline-first seam ([[ADR-0002-offline-first]], [[ADR-0090-offline-sync-scope-and-conflict-strategy]]):

1. **Inbox-first, authoritative-for-read.** The durable Postgres notification record, mirrored into the
   **Dexie inbox**, is the **single authoritative read surface**. The app's notification view always renders
   from the inbox mirror, never from a transient channel. A user offline at delivery time **loses nothing**:
   the record is durable server-side and arrives on the next sync.
2. **Transient channels are best-effort online enhancements.** **SSE/Centrifugo realtime, email
   (Brevo/Mailjet) and Web Push** are **delivery accelerants, not sources of truth.** A missed realtime frame,
   an undelivered email, or a suppressed push **never** changes notification state — it only delays the moment
   the user *sees* an already-durable record. No channel is on the offline read path.
3. **Replay on reconnect via the ADR-0090 seam.** Undelivered/unseen notifications reconcile through the
   **same reconnect + versioning seam** ADR-0090 mandates: each client inbox projection carries
   `lastSeenVersion`; on reconnect the client rehydrates new notification records from the server
   (outbox-sourced) above that watermark. **Notification delivery is server-authoritative** and consistent
   with ADR-0090's "server always wins" model — there is **no client-side merge of notification content** and
   **no CRDT** (notifications are owner-published facts, not multi-writer collaborative state). Read/seen state
   is a **per-client local preference** that may sync last-write-wins (ADR-0090 D2 cosmetic-preference lane),
   never affecting the record itself.
4. **Idempotent, version-aware replay.** Replay reuses the existing `DeliveryAttempt` idempotency keys
   (ADR-0043 Test Requirements) so reconnect-driven re-delivery never duplicates an inbox entry or re-fires a
   push for an already-seen notification.

This clause is **purely additive**: it makes explicit the offline behaviour ADR-0043 already implied
("In-app inbox … must work offline through Dexie", "Notification records are durable before any external
channel is attempted") and aligns it with the now-ratified Offline Sync seam.

## Rationale

The decision content needs no change — the grounding behind ADR-0043 (first-party context for offline-survivable
messaging, Postgres truth, Centrifugo realtime path, Brevo EU email, Web Push caveats) still holds and is cited
in that file's own Sources. What is broken is **metadata coherence and an unstated seam**, both of which the gate
requires to be authoritative and explicit. A superseding ADR is the vault's only sanctioned mechanism to correct
a ratified-decision artefact without editing it (Supersede-not-overwrite, vault-governance), so Option B is the
correct shape even though the substance is unchanged. Folding only the status fix into a governance ADR (see Open
questions) would leave the offline clause homeless; the offline clause is **domain-specific to Notification** and
therefore justifies a dedicated note rather than a one-line governance footnote. Option A leaves the body/frontmatter
contradiction live; Option C leaves both defects unowned while four ADRs keep citing an undefined anchor.

## Consequences

Positive:

- The Notification platform's **binding state is unambiguous** (one consistent `draft`/`binding:false` value
  here; the ADR-0043 body↔frontmatter contradiction is superseded, not patched).
- **Offline delivery behaviour is explicit and gate-ratifiable**: inbox-first authoritative-for-read, transient
  channels best-effort, replay via the ADR-0090 seam.
- Four downstream ADRs ([[ADR-0065-narrative-media-press-content-ownership]],
  [[ADR-0076-narrative-newsworthiness-event-contracts]], [[ADR-0081-statistics-analytics-read-model-owner]],
  [[ADR-0085-media-ecology-context-and-outlet-operational-behaviour]]) re-anchor on a **current, internally
  consistent** Notification ADR.
- Notification delivery is now provably consistent with [[ADR-0002-offline-first]] and
  [[ADR-0090-offline-sync-scope-and-conflict-strategy]].

Negative / follow-up:

- One more ADR in the chain; readers must follow ADR-0043 → ADR-0102 (mitigated by `Supersedes`/`related` links).
- The offline clause adds a small implementation obligation: the inbox replay path must honour `lastSeenVersion`
  watermarks and reuse `DeliveryAttempt` idempotency keys on reconnect (already implied by ADR-0043 Test
  Requirements + ADR-0090, now explicit).
- On final ratification, ADR-0043's `superseded_by` should be reflected in the Decision-Log index (index update,
  not a body edit of ADR-0043).

## Risks

**Low.** The decision content is **unchanged** — only metadata coherence + an additive offline clause. The clause
restates behaviour ADR-0043 already implied and aligns it with the already-proposed ADR-0090 seam, so it forecloses
nothing and introduces no new infrastructure, provider, package or boundary.

## Open questions

- **Fold into the governance ADR vs dedicated superseding ADR?** If the **status drift were the only concern** it
  could be absorbed into a governance/status-reconciliation ADR. The **offline-delivery clause** is
  Notification-domain-specific and justifies this dedicated note; if Nico prefers a single governance sweep for
  *all* status-drift artefacts, this ADR could be reduced to the offline clause and cross-reference that sweep
  for the re-ratification half.

## Supersedes

[[ADR-0043-notification-and-messaging-platform]] — re-stated unchanged under the current gate, plus the additive
offline-delivery clause. **ADR-0043 is not edited**; its retirement is expressed solely via this file's
`Supersedes: ADR-0043` frontmatter (Supersede-not-overwrite).

## Related Docs

- [[ADR-0043-notification-and-messaging-platform]] — superseded source decision (content re-stated unchanged).
- [[ADR-0090-offline-sync-scope-and-conflict-strategy]] — offline-sync seam (`commandId`/`expectedVersion`/
  `lastSeenVersion`, server-authoritative rebase) the offline clause reuses for replay.
- [[ADR-0002-offline-first]] — offline-first posture the delivery clause binds to.
- [[ADR-0028-postgres-transactional-outbox]] — canonical event channel feeding durable notification records.
- [[ADR-0023-realtime-transport]] — SSE→Centrifugo realtime path (best-effort online enhancement).
- [[ADR-0089-bounded-context-portfolio-reconciliation]] — places Notification in the *Engagement & Narrative*
  cluster of the 28-context portfolio.
- [[ADR-0065-narrative-media-press-content-ownership]] / [[ADR-0076-narrative-newsworthiness-event-contracts]] /
  [[ADR-0081-statistics-analytics-read-model-owner]] / [[ADR-0085-media-ecology-context-and-outlet-operational-behaviour]]
  — downstream ADRs that anchor on Notification = delivery/inbox.
- [[../../30-Implementation/notification-messaging-platform]] — implementation note.
- [[../../30-Implementation/pwa-offline-strategy]] — PWA caching/offline implementation note.
- [[../../00-Index/Open-Decisions-Dossier]] — consolidated open-decision Q&A (status-drift + offline-seam entries).
