---
title: ADR-0124 PWA Offline Mobile Release Content QA Gates
status: accepted
tags: [adr, architecture, pwa, offline, mobile, service-worker, rollback, content-qa, localization, llm, quality, fmx-197, accepted]
context: offline-sync
created: 2026-06-15
updated: 2026-06-19
type: adr
binding: true
linear: FMX-197
amends:
  - [[ADR-0020-hybrid-online-mvp-offline-ready]]
  - [[ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[ADR-0104-mobile-delivery-grounding-and-ratification]]
  - [[ADR-0118-test-strategy-and-quality-gates]]
supersedes:
superseded_by:
related:
  - [[../../60-Research/pwa-offline-mobile-release-content-qa-gates-2026-06-15]]
  - [[../../60-Research/raw-perplexity/raw-pwa-offline-mobile-release-content-qa-2026-06-15]]
  - [[../../60-Research/raw-perplexity/raw-pwa-offline-mobile-release-content-qa-source-checks-2026-06-15]]
  - [[../../40-Quality/pwa-offline-mobile-release-content-qa-gates]]
  - [[../../40-Execution/fmx-197-pwa-offline-mobile-release-content-qa-decision-queue-2026-06-15]]
  - [[../../30-Implementation/hybrid-online-pwa-strategy]]
---

# ADR-0124: PWA Offline Mobile Release Content QA Gates

> **RATIFIED on 2026-06-19.** Nico approved the linked FMX decision
> queue via `APPROVE ALL RECOMMENDED`; this ADR/amendment is now
> binding according to its approved scope.


## Status

accepted

Prepared for FMX-197 on 2026-06-15. Binding after Nico approved D1-D7 on 2026-06-19 in
[[../../40-Execution/fmx-197-pwa-offline-mobile-release-content-qa-decision-queue-2026-06-15]].

## Date

2026-06-15

## Context

ADR-0118 accepts the general future quality ladder but deliberately splits PWA
storage/offline/mobile degradation, release rollback and content-validation QA
into FMX-197.

FMX's MVP is not full offline authority. ADR-0020 and
[[../../30-Implementation/hybrid-online-pwa-strategy]] keep the MVP
hybrid-online: app shell, confirmed read models and local drafts can work
offline; final commands and authoritative progression are server-confirmed.
ADR-0090 keeps Offline Sync thin at MVP. ADR-0104 keeps the PWA as the mobile
source of truth while native wrapper questions stay separate.

The missing decision is the release-quality contract around that posture: what
must work offline, what degrades, how storage failure is handled, how a bad SW
or content release is recovered and how generated/localized content is gated.

## Proposed decision

### D1 - Offline and mobile degradation scope

Adopt the hybrid-online degradation contract:

- app shell/offline fallback loads without network;
- confirmed read models are cacheable with stale labels and freshness metadata;
- local drafts can be saved on device with local-only copy;
- final effects require online server confirmation;
- no authoritative local match/progression is introduced by this ADR;
- mobile floor devices must prove the matrix rather than inheriting desktop
  assumptions.

### D2 - Storage budget and eviction policy

Use explicit storage tiers:

| Tier | Contents | Deletion policy |
|---|---|---|
| Critical | current draft intent, pwa/update flags, minimal shell evidence | preserve first; if lost, explain local-only loss |
| Rehydratable | confirmed read caches, content/language packs | safe to delete and rehydrate |
| Disposable | images/media, old runtime caches, diagnostics | purge first under pressure |

Code phase should use storage estimate/persist checks where supported, quota
error handling around browser writes and release evidence for eviction/recovery.

### D3 - Service-worker update and rollback

FMX should treat a service-worker change as a release event:

- stable SW URL;
- versioned static bundles/caches;
- user-mediated waiting-worker activation for stateful sessions;
- transient state preserved before reload;
- last-known-good bundle/content recorded;
- no-op/rescue SW procedure rehearsed;
- `Clear-Site-Data` emergency-only, never routine rollback.

### D4 - Release rollout

Use staged release gates for PWA/web and later native wrappers:

- internal channel;
- beta/limited exposure;
- staged config/traffic/platform rollout for SW/storage/content changes;
- explicit halt criteria;
- monitoring for SW errors, navigation failures, cache/draft failures and
  content activation failures;
- release go/no-go record before broader exposure.

### D5 - Content-pack validation

Every content pack needs a manifest and validation report before activation:

- pack ID/version/schema;
- hashes;
- dependencies and compatibility range;
- provenance/source classification;
- rollback predecessor;
- schema/reference/football sanity/IP-safe naming/localization/Narrative
  fallback checks.

### D6 - Generated content, localization and IP safety

For MVP, use a template-first content pipeline:

- no runtime LLM player-visible prose is authorized by this ADR;
- generated/build-time assisted content can enter packs only after schema,
  safety, IP and human-review gates;
- prompt-injection/output-validation checks are required when generated content
  is involved;
- pseudo-localization and glossary checks are release evidence for UI/content
  surfaces.

### D7 - Evidence retention and rebaseline

Keep release evidence and content validation records by version:

- release evidence manifest;
- content-pack validation report;
- rollout/halt/rollback decision record;
- failed/adversarial generated-content samples when they affect acceptance;
- rebaseline requires Nico approval until ownership is delegated.

## Options considered

### D1 - offline/degradation scope

| Option | Meaning | Assessment |
|---|---|---|
| A. Hybrid-online offline contract | Shell, confirmed read cache and drafts offline; final actions online/server-confirmed. | **Recommended.** Matches ADR-0020/0090 and gives useful offline value without local authority. |
| B. Read-only only | Shell and read cache, no local drafts. | Lower data risk but weak for a manager game. |
| C. Local-authoritative MVP | Offline progression/matches with later reconciliation. | Reopens offline authority, anti-cheat and conflict scope. |

### D2 - storage budget

| Option | Meaning | Assessment |
|---|---|---|
| A. Tiered storage budgets and eviction UX | Critical/rehydratable/disposable tiers, quota handling and recovery copy. | **Recommended.** Browser storage is useful but evictable. |
| B. Best-effort storage only | Store and hope; handle failures generically. | Too weak for local drafts and PWA trust. |
| C. Large offline world by default | Maximize cache/content locally. | High iOS/mobile quota and stale-content risk. |

### D3 - SW update/rollback

| Option | Meaning | Assessment |
|---|---|---|
| A. User-mediated update plus rescue SW | Waiting-worker prompt, versioned caches, last-known-good and no-op recovery. | **Recommended.** Fits stateful sessions and Chrome/Workbox guidance. |
| B. Auto `skipWaiting` every release | Always activate immediately. | Can interrupt active sessions and mixed assets. |
| C. No rollback contract | Fix forward only. | Too risky for SW/storage releases. |

### D4 - rollout

| Option | Meaning | Assessment |
|---|---|---|
| A. Internal/beta/staged release gates | Progressive exposure, halt criteria and release monitoring. | **Recommended.** Mirrors Google/Apple staged-release controls. |
| B. Big-bang web deploy | Release to all users once CI passes. | Too risky for SW/content/storage changes. |
| C. Store-only gates later | Defer staged discipline until native shell. | Misses PWA/source-of-truth risk. |

### D5 - content QA

| Option | Meaning | Assessment |
|---|---|---|
| A. Manifested content packs and validators | Version/hash/dependency/provenance plus schema/football/IP/localization checks. | **Recommended.** Makes content activation auditable and rollbackable. |
| B. Manual copy review only | Human spot check. | Too weak for large football data and localization. |
| C. Runtime content correction | Ship content and patch live as issues appear. | Bad trust posture for long saves. |

### D6 - generated/localized content safety

| Option | Meaning | Assessment |
|---|---|---|
| A. Template-first, generated content only after review | No runtime LLM authority; generated text enters packs after gates. | **Recommended.** Aligns ADR-0030/0065/0117 and OWASP guidance. |
| B. Authored-only MVP | No generated content. | Lowest risk but less useful for tooling/content scale. |
| C. Runtime LLM content by default | Online generated prose in player UX. | Reopens safety, cost, replay and provenance decisions. |

### D7 - evidence retention/rebaseline

| Option | Meaning | Assessment |
|---|---|---|
| A. Versioned evidence and approval-gated rebaseline | Preserve release/content evidence and decide rebaselines explicitly. | **Recommended.** Prevents silent release-quality drift. |
| B. CI summaries only | Store pass/fail summary. | Too weak for rollback/content forensics. |
| C. Keep every artifact indefinitely | Max evidence. | Storage/noise burden without clear retention policy. |

## Consequences if accepted

Positive:

- Closes ADR-0118's PWA/offline/mobile/rollback/content-QA gap.
- Keeps the MVP honest: useful offline planning without local authority.
- Makes service-worker rollback and content activation explicit release
  evidence.
- Gives localization and generated content concrete QA gates before code phase.
- Preserves mobile floor-device testing as a release requirement.

Costs:

- Future code phase needs test fixtures for storage, quota, SW update and
  content activation.
- Release work needs explicit evidence manifests and rollback drills.
- Content authoring needs schemas, glossary and pseudo-loc discipline.

## Related

- [[../../60-Research/pwa-offline-mobile-release-content-qa-gates-2026-06-15]]
- [[../../60-Research/raw-perplexity/raw-pwa-offline-mobile-release-content-qa-2026-06-15]]
- [[../../60-Research/raw-perplexity/raw-pwa-offline-mobile-release-content-qa-source-checks-2026-06-15]]
- [[../../40-Quality/pwa-offline-mobile-release-content-qa-gates]]
- [[../../40-Execution/fmx-197-pwa-offline-mobile-release-content-qa-decision-queue-2026-06-15]]
- [[ADR-0020-hybrid-online-mvp-offline-ready]]
- [[ADR-0090-offline-sync-scope-and-conflict-strategy]]
- [[ADR-0104-mobile-delivery-grounding-and-ratification]]
- [[ADR-0118-test-strategy-and-quality-gates]]
