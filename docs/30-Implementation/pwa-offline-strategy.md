---
title: PWA Offline Strategy
status: draft
tags: [pwa, implementation]
created: 2026-05-15
updated: 2026-05-17
type: implementation
related: [[../10-Architecture/06-Runtime]], [[../60-Research/pwa-offline-patterns]], [[../10-Architecture/09-Decisions/ADR-0002-offline-first]], [[../10-Architecture/09-Decisions/ADR-0005-save-format]]
---

# PWA Offline Strategy

Bootstrap uses `vite-plugin-pwa` with an injected service worker. Game saves will
use Dexie-backed IndexedDB. Mutating HTTP responses must not be cached.

## Related

- [[../10-Architecture/09-Decisions/ADR-0002-offline-first]] · [[../10-Architecture/09-Decisions/ADR-0005-save-format]] — decisions realized
- [[../60-Research/pwa-offline-patterns]] — full technical patterns this implements
- [[../10-Architecture/06-Runtime]] — arc42 runtime · [[../10-Architecture/modules/web]] — owning module
