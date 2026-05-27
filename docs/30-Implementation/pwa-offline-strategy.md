---
title: PWA Offline Strategy
status: superseded
tags: [pwa, implementation]
created: 2026-05-15
updated: 2026-05-18
type: implementation
binding: false
superseded_by: hybrid-online-pwa-strategy
related:
  - [[../10-Architecture/06-Runtime]]
  - [[../60-Research/pwa-offline-patterns]]
  - [[../10-Architecture/09-Decisions/ADR-0002-offline-first]]
  - [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
  - [[../10-Architecture/09-Decisions/ADR-0005-save-format]]
  - [[hybrid-online-pwa-strategy]]
---

# PWA Offline Strategy

> **Superseded — historical memory only.** This document is superseded by [[hybrid-online-pwa-strategy]] and must not be implemented. The current decision/spec lives there; see also [[../00-Index/Decision-Log]] for the authoritative index. Retained for historical context per the vault's supersede discipline.

Bootstrap uses `vite-plugin-pwa` with an injected service worker. Game saves will
use Dexie-backed IndexedDB. Mutating HTTP responses must not be cached.
## Related

- [[../10-Architecture/06-Runtime]]
- [[../60-Research/pwa-offline-patterns]]
- [[../10-Architecture/09-Decisions/ADR-0002-offline-first]]
- [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
- [[../10-Architecture/09-Decisions/ADR-0005-save-format]]
- [[hybrid-online-pwa-strategy]]
