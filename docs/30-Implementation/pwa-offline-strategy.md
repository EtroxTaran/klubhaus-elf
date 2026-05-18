---
title: PWA Offline Strategy
status: superseded
tags: [pwa, implementation]
created: 2026-05-15
updated: 2026-05-18
type: implementation
superseded_by: [[hybrid-online-pwa-strategy]]
related: [[../10-Architecture/06-Runtime]], [[../60-Research/pwa-offline-patterns]], [[../10-Architecture/09-Decisions/ADR-0002-offline-first]], [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]], [[../10-Architecture/09-Decisions/ADR-0005-save-format]], [[hybrid-online-pwa-strategy]]
---

# PWA Offline Strategy

> **SUPERSEDED on 2026-05-18 by [[hybrid-online-pwa-strategy]].** Old way:
> full offline-first MVP implementation. New way: hybrid-online MVP with
> offline-ready app shell, read caches and drafts; full selective offline and
> export/import are post-MVP. Kept for history — do not implement for MVP.

Bootstrap uses `vite-plugin-pwa` with an injected service worker. Game saves will
use Dexie-backed IndexedDB. Mutating HTTP responses must not be cached.

## Related

- [[hybrid-online-pwa-strategy]] — current MVP implementation strategy
- [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]] · [[../10-Architecture/09-Decisions/ADR-0005-save-format]] — current/future decisions
- [[../10-Architecture/09-Decisions/ADR-0002-offline-first]] — superseded historical decision
- [[../60-Research/pwa-offline-patterns]] — full technical patterns this implements
- [[../10-Architecture/06-Runtime]] — arc42 runtime · [[../10-Architecture/modules/web]] — owning module
