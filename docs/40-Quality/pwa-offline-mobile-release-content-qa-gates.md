---
title: PWA Offline Mobile Release Content QA Gates
status: draft
tags: [quality, pwa, offline, mobile, service-worker, rollback, content-qa, localization, llm, fmx-197]
created: 2026-06-15
updated: 2026-06-15
type: quality
binding: false
linear: FMX-197
related:
  - [[../60-Research/pwa-offline-mobile-release-content-qa-gates-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-pwa-offline-mobile-release-content-qa-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-pwa-offline-mobile-release-content-qa-source-checks-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0124-pwa-offline-mobile-release-content-qa-gates]]
  - [[../40-Execution/fmx-197-pwa-offline-mobile-release-content-qa-decision-queue-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
---

# PWA Offline Mobile Release Content QA Gates

This is the non-binding FMX-197 draft runbook. It becomes binding only if Nico
accepts draft
[[../10-Architecture/09-Decisions/ADR-0124-pwa-offline-mobile-release-content-qa-gates]]
or promotes this note directly.

## Offline degradation matrix

| Surface | Required evidence | Failure behavior |
|---|---|---|
| App shell/offline fallback | App loads from installed shell; unknown routes and network failures do not blank screen | Offline fallback plus reconnect action |
| Confirmed read cache | Cached read model carries version, fetched time and stale marker | Show stale label; rehydrate online |
| Local drafts | Draft save/load survives reload and offline session within budget | Show local-only status; block final action offline |
| Final commands | Final command requires online confirmation | Disable or queue only if future accepted command family allows it |
| Storage full/quota | Quota error path tested for IndexedDB and Cache writes | Drop non-critical caches first; preserve critical draft intent where possible |
| Eviction/reinstall | Origin storage loss simulated | Rebuild shell/read cache from server; explain lost local-only drafts |
| Mobile device floor | Android Chrome, iOS Safari/WebKit and target wrapper browser tested on floor devices | Disable advanced/offline extras with explicit copy |

## Service-worker and rollback gates

| Gate | PR | Nightly | Release |
|---|---|---|---|
| SW registration/update smoke | SW-touching PR | Full supported browser run | Required |
| Waiting-worker update prompt | SW-touching PR | Full matrix | Required, with transient-state preservation |
| No-op/rescue SW dry-run | Not default | Scheduled drill | Required for SW-affecting release |
| Versioned cache cleanup | SW/cache PR | Full matrix | Required |
| Last-known-good artifact record | N/A | N/A | Required |
| Old-client/new-server compatibility | Contract PR | Scheduled | Required |
| New-client/old-content compatibility | Content/runtime PR | Scheduled | Required |

`Clear-Site-Data` is an emergency-only addition because it can clear
IndexedDB/cache/local state and is not universally supported.

## Content-pack validation gates

Each active pack needs:

- pack ID, pack version and schema version;
- content hash/manifest hash;
- dependency list and compatibility range;
- provenance/source classification;
- activation status and rollback predecessor;
- validation report pointer.

Required validators:

- JSON/schema and referential integrity;
- fixtures/calendar/standings/regulation sanity;
- squad/person/entity uniqueness and fictional-name/IP-clean checks;
- versioned content-pack compatibility with saves and read caches;
- localization completeness, ICU/message variable validation and pseudo-loc
  render smoke;
- Narrative template fallback/provenance coverage;
- generated-text banned output, prompt-injection and human-review gates when
  generated content enters a pack.

## QA cadence matrix

| Area | PR | Nightly | Release | Manual |
|---|---|---|---|---|
| Offline shell/read/draft smoke | targeted | broader browser matrix | full device-floor matrix | flaky-network session |
| Storage/quota degradation | targeted storage changes | synthetic low-quota run | device-floor evidence | nearly-full-device test |
| SW update/rollback | SW-touching PR | waiting-worker/no-op drill | required rollback dry-run | release-manager rehearsal |
| Content schema/integrity | every content pack | full corpus | required | spot review |
| Football realism/content sanity | pack PR smoke | full corpus | required | football-domain review |
| IP-safe naming | every pack | full corpus | required | exception review |
| Pseudo-localization | string/UI PR | key flows | required | top-flow visual review |
| Generated/LLM content | pipeline/content PR | adversarial corpus | required before activation | HITL sample review |
| Rollout/monitoring hooks | config PR | config-state simulation | required dashboard/halt criteria | release go/no-go |

## Release evidence record sketch

```yaml
pwaReleaseEvidence:
  releaseId: null
  clientVersion: null
  serviceWorkerVersion: null
  staticBundleHash: null
  contentPackVersions: []
  lastKnownGood:
    clientVersion: null
    serviceWorkerVersion: null
    contentPackVersions: []
  offlineMatrix:
    appShell: pass
    readCache: pass
    drafts: pass
    storageQuota: pass
    evictionRecovery: pass
  rollback:
    noOpServiceWorkerDrill: pass
    rollbackConfigDryRun: pass
    clearSiteDataEmergencyOnly: true
  rollout:
    stage: internal
    haltCriteria: []
    monitors: []
```

## Related

- [[../60-Research/pwa-offline-mobile-release-content-qa-gates-2026-06-15]]
- [[../10-Architecture/09-Decisions/ADR-0124-pwa-offline-mobile-release-content-qa-gates]]
- [[../40-Execution/fmx-197-pwa-offline-mobile-release-content-qa-decision-queue-2026-06-15]]
- [[test-strategy]]
