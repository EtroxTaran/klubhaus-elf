---
title: ADR-0025 Mobile Delivery (PWA + Capacitor)
status: superseded
tags: [adr, architecture, mobile, pwa, capacitor]
created: 2026-05-19
updated: 2026-06-11
accepted_at: 2026-05-19
type: adr
binding: false
supersedes:
superseded_by: ADR-0104-mobile-delivery-grounding-and-ratification
related: [[ADR-0021-revised-tech-stack]], [[ADR-0008-mobile-first-ui]], [[ADR-0023-realtime-transport]], [[ADR-0002-offline-first]], [[../11-Risks]]
---

# ADR-0025: Mobile Delivery (PWA + Capacitor)

> **SUPERSEDED on 2026-06-08 by [[ADR-0104-mobile-delivery-grounding-and-ratification]].**
> Old way: PWA + Capacitor delivery with ungrounded iOS-push/EU-DMA claims. New way: grounded claims, Capacitor 7.x pinned; responsive PWA = source of truth, thin additive shell. Kept for history — do not
> implement.

## Status

superseded

> Superseded 2026-06-08 by [[ADR-0104-mobile-delivery-grounding-and-ratification]] (ratification
> sweep, PR #153); body previously read `accepted`. Body status reconciled to the frontmatter SSOT
> (ADR-0092) on 2026-06-11 (FMX-143).

## Date

2026-05-19

## Context

Product goals require messaging + push notifications on mobile. 2026 research:
iOS PWA Web Push is structurally unfit for this — forced manual "Add to Home
Screen" before any notification, ~16% opt-in vs 40–70% native, the 3-strike
rule kills silent/background data pushes (fatal for a background inbox/match
feed), no Background Sync, ~7-day storage eviction, and **EU iOS PWAs get no
push at all** under the DMA. ADR-0008 (mobile-first UI) covers layout; this ADR
covers *delivery channel*.

## Options Considered

- PWA-only (zero extra pipeline; iOS messaging/push effectively broken,
  EU iOS gets none).
- React Native rewrite (discards the ~7.5k-LOC web codebase — rejected).
- Capacitor shell wrapping the existing web app (one codebase; native
  APNs/FCM).

## Decision

The responsive **PWA stays the single source of truth**. A thin **Capacitor**
shell is the **planned** path to the App Store / Play Store with native
APNs/FCM push, reusing the unchanged web `webDir`. It is additive and reversible
(no web-code fork). Estimated ~1–2 engineer-weeks one-time to stand up
(Mac + native build pipeline + App Store review), then low maintenance.

This decision was recorded as the research-recommended default after the
question was skipped at plan approval; it is open to reversal if mobile-iOS is
explicitly deprioritised for launch.

## Rationale

Capacitor is the only path that makes the two core mobile features (real-time
inbox + live-match push) actually work — especially for EU iOS users — without
rewriting the front end. It fits the project's additive/reversible posture.

## Consequences

Positive:

- ~3–4× notification opt-in, reliable background delivery, EU iOS coverage.
- One web codebase serves desktop/web/PWA and both app stores.

Negative:

- One-time native build pipeline + ongoing App Store review/maintenance
  (accepted risk — see [[../11-Risks]]).
- The Capacitor target is post-MVP planned, not MVP-blocking.

## Supersedes

None.

## Related Docs

- [[ADR-0021-revised-tech-stack]] · [[ADR-0008-mobile-first-ui]] · [[ADR-0023-realtime-transport]] · [[ADR-0002-offline-first]] · [[../11-Risks]]
