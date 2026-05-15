<!--
id: R-006
title: [research] Research PWA offline-first save and sync patterns
labels: type:research, area:research, area:pwa, area:save, prio:high, size:m, parallel:safe
milestone: M1 Research & Architecture
depends_on: none
output: docs/60-Research/pwa-offline-patterns.md
-->

# [research] Research PWA offline-first save and sync patterns

**ID:** R-006  
**Labels:** `type:research`, `area:research`, `area:pwa`, `area:save`, `prio:high`, `size:m`, `parallel:safe`  
**Milestone:** M1 Research & Architecture  
**Depends on:** none  
**Primary output:** `docs/60-Research/pwa-offline-patterns.md`

## Goal

Research robust offline-first architecture for local career saves, PWA installability, service worker updates, storage limits, and future cloud sync.

## Research questions

- IndexedDB/Dexie schema versioning and migration patterns.
- Save import/export JSON patterns and corruption recovery.
- Service worker cache strategy for app shell vs. mutations.
- Background Sync and mutation queue constraints.
- iOS/Android browser storage limitations and install behavior.
- Future conflict resolution strategy for optional SurrealDB cloud sync.

## Output

Write `docs/60-Research/pwa-offline-patterns.md`.

## Acceptance criteria

- [ ] Recommended MVP save architecture.
- [ ] IndexedDB migration strategy.
- [ ] Service worker update strategy.
- [ ] Offline E2E test strategy with Playwright.
- [ ] Cloud-sync conflict-resolution options and recommendation.
- [ ] iOS/Android storage-risk notes.
- [ ] Direct input sections for ADR-0002 and ADR-0005.

## Agent prompt

Research PWA/offline-first save and sync patterns for an installable football manager. Write `docs/60-Research/pwa-offline-patterns.md`; do not edit app code or configs.

## Independence check

- File exclusivity: writes `pwa-offline-patterns.md` only.
- Interface stability: no API/schema changes.
- Config exclusivity: no config changes.
- Parallel label: `parallel:safe`.
