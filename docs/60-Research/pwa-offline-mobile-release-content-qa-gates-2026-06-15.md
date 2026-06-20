---
title: PWA Offline Mobile Release Content QA Gates
status: current
tags: [research, synthesis, pwa, offline, mobile, service-worker, rollback, content-qa, localization, llm, quality, fmx-197]
context: offline-sync
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-197
related:
  - [[raw-perplexity/raw-pwa-offline-mobile-release-content-qa-2026-06-15]]
  - [[raw-perplexity/raw-pwa-offline-mobile-release-content-qa-source-checks-2026-06-15]]
  - [[../40-Quality/pwa-offline-mobile-release-content-qa-gates]]
  - [[../10-Architecture/09-Decisions/ADR-0124-pwa-offline-mobile-release-content-qa-gates]]
  - [[../40-Execution/fmx-197-pwa-offline-mobile-release-content-qa-decision-queue-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
  - [[../10-Architecture/09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[../10-Architecture/09-Decisions/ADR-0104-mobile-delivery-grounding-and-ratification]]
  - [[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
  - [[../30-Implementation/hybrid-online-pwa-strategy]]
---

# PWA Offline Mobile Release Content QA Gates

## Scope

FMX-197 closes the quality follow-up split from ADR-0118 for:

- PWA storage/offline/mobile degradation;
- service-worker update and rollback evidence;
- staged release gates;
- content-pack, localization and generated-content QA.

It does not add code and does not ratify a new rule. Existing binding sources
remain intact until Nico decides:

- accepted
  [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
  and current [[../30-Implementation/hybrid-online-pwa-strategy]] keep the MVP
  hybrid-online: app shell, confirmed read caches and local drafts may work
  offline; authoritative progression is server-confirmed;
- accepted
  [[../10-Architecture/09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]]
  keeps Offline Sync thin at MVP and reserves durable command outbox/conflict
  UX for later phases;
- accepted
  [[../10-Architecture/09-Decisions/ADR-0104-mobile-delivery-grounding-and-ratification]]
  keeps the responsive PWA as source of truth, with native shell questions
  separate;
- accepted
  [[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
  defines the overall future quality ladder.

## Evidence synthesis

### PWA storage is useful but not authoritative

MDN's storage quota guidance confirms that browser storage is per-origin,
browser-specific and normally best-effort. IndexedDB, Cache API and related
storage can fail with quota errors, and eviction can remove all origin data
together. `navigator.storage.estimate()` can report approximate use/quota, and
`navigator.storage.persist()` can request persistent storage, but browser
approval differs.

FMX implication:

- browser storage can cache and draft, but cannot become authoritative game
  truth for the MVP;
- every write path to IndexedDB/Cache must have quota-error and rehydration
  behavior;
- iOS/Safari/WebKit behavior needs explicit device-floor evidence, not desktop
  extrapolation.

### Service-worker update is a release event

Chrome/Workbox docs confirm that an updated service worker normally waits until
controlled tabs close or navigate. Workbox can detect a waiting worker and
prompt the user to reload; Chrome notes apps may need to save transient state
before reload. Workbox quota guidance supports explicit cache limits and
`purgeOnQuotaError` for runtime caches safe to delete.

Chrome also documents a no-op service worker as a recovery path for buggy
service workers. The no-op must be deployed at the same service-worker URL.
`Clear-Site-Data` can help in some browsers but clears origin storage, so it is
too destructive for routine FMX rollback.

FMX implication:

- use user-mediated activation for stateful sessions;
- keep a stable `sw.js` URL and a rehearsed no-op/rescue path;
- make service-worker rollback a release runbook item, not an improvised hotfix;
- never rely on `Clear-Site-Data` as the normal path because it can destroy
  drafts and cached evidence.

### Staged rollout precedent is concrete

Google Play supports staged release percentages, increasing a rollout,
halting/resuming and monitoring crash reports/user feedback. Apple App Store
Connect phased release uses a seven-day automatic-update ladder and allows a
pause budget.

FMX implication:

- the web/PWA path should copy the control shape: internal/beta validation,
  staged exposure, halt criteria, monitoring and rollback/fix-forward decision;
- native wrapper store mechanics are later, but the release-quality discipline
  applies now.

### Content QA is a release gate, not copy review at the end

FMX content risk spans data packs, league/rules facts, fictional naming,
localized text, Narrative templates and possible generated prose. Existing
records already constrain this:

- [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]] requires
  IP-clean fictional naming;
- [[../10-Architecture/09-Decisions/ADR-0094-i18n-stack-and-locale-scope]]
  defines i18n direction;
- [[../10-Architecture/09-Decisions/ADR-0065-narrative-media-press-content-ownership]]
  owns Narrative templates, provenance and fallback coverage;
- [[../10-Architecture/09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]]
  establishes active pack references in save/export thinking.

Microsoft's pseudolocalization guidance supports using pseudo text early to
surface truncation, concatenation, font and formatting issues. OWASP's LLM
Prompt Injection cheat sheet supports treating generated/user content as
untrusted, separating instructions from data, validating input/output and using
HITL controls.

FMX implication:

- content packs need schema, manifest, hash, dependency and compatibility
  gates before activation;
- pseudo-loc and football glossary checks should run before release evidence;
- generated text should enter player-visible packs only through templates,
  provenance and validators unless a later runtime-LLM decision accepts more
  risk.

### Comparable game precedent

Sports Interactive's public Football Manager 25 cancellation statement is a
useful management-game precedent: SI chose not to ship and fix later when the
overall player experience/interface missed the standard. FMX must not infer SI
internals, but the public lesson is valid: annual/seasonal pressure does not
justify shipping a substandard management-game experience.

## Recommended FMX packet

### Offline and mobile degradation

Adopt the hybrid-online offline matrix:

| Surface | Online | Offline | Degraded storage |
|---|---|---|---|
| App shell | Load latest served version | Load last installed shell/offline fallback | Show recovery/offline fallback; no blank screen |
| Confirmed read models | Network-first or stale-while-revalidate by freshness class | Last confirmed read with `fetchedAt`, version and stale label | Clear cache class and rehydrate when online |
| Drafts | Save locally and submit online | Save local draft only; no final effect copy | Keep most recent critical drafts; show storage-limited state |
| Mutating commands | Submit and confirm through server | Pre-stage only if command family supports draft; no authoritative effect | Disable final action; preserve draft where possible |
| Match progression | Server-confirmed | No authoritative progression | Preview-only only if a future decision permits it |
| Content/language packs | Activate validated compatible pack | Use active validated pack | Roll back to last compatible pack or require reconnect |

### Release rollback gates

Minimum release evidence for PWA/SW/storage-affecting changes:

- last-known-good static bundle and content-pack versions recorded;
- stable service-worker URL and no-op/rescue SW procedure rehearsed;
- old-client/new-server and new-client/old-content compatibility smoke;
- storage quota/eviction/degraded mode test evidence;
- staged rollout plan with halt and fix-forward/rollback criteria;
- monitoring for SW registration/update errors, navigation failures, cache
  misses, IndexedDB/quota failures, draft-loss reports and content activation
  failures.

### Content QA gates

Minimum content-release evidence:

- content manifest with pack ID, version, schema version, hashes, dependencies,
  compatibility range, provenance and activation status;
- schema validation and referential integrity checks;
- football rules/season sanity checks: fixtures, standings, squad limits,
  competition dates, promotion/relegation paths and regulatory constraints;
- IP-clean naming/sponsor/club/person validation per ADR-0007;
- localization resource completeness, ICU/message variable validation,
  pseudo-loc render smoke and football glossary review;
- Narrative template fallback coverage, provenance and banned-output checks;
- generated-content pipeline validation with OWASP-style prompt-injection and
  output-safety tests if generated text is used.

## Decision queue summary

The decision queue
[[../40-Execution/fmx-197-pwa-offline-mobile-release-content-qa-decision-queue-2026-06-15]]
asks Nico to decide:

- D1 offline/degradation scope;
- D2 storage budget and eviction policy;
- D3 service-worker update/rollback policy;
- D4 staged rollout and release evidence;
- D5 content-pack validation gates;
- D6 generated-content/IP/localization safety;
- D7 evidence retention and rebaseline policy.

Recommended packet: D1=A, D2=A, D3=A, D4=A, D5=A, D6=A, D7=A.

## Related

- [[raw-perplexity/raw-pwa-offline-mobile-release-content-qa-2026-06-15]]
- [[raw-perplexity/raw-pwa-offline-mobile-release-content-qa-source-checks-2026-06-15]]
- [[../40-Quality/pwa-offline-mobile-release-content-qa-gates]]
- [[../10-Architecture/09-Decisions/ADR-0124-pwa-offline-mobile-release-content-qa-gates]]
- [[../40-Execution/fmx-197-pwa-offline-mobile-release-content-qa-decision-queue-2026-06-15]]
- [[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
