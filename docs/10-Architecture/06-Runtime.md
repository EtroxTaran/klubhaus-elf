---
title: Runtime
status: draft
tags: [architecture]
created: 2026-05-15
updated: 2026-05-17
type: arch
related: [[03-Context]], [[07-Deployment]], [[../30-Implementation/pwa-offline-strategy]], [[09-Decisions/ADR-0002-offline-first]]
---

# Runtime

The first runtime target is a browser-installed PWA with local IndexedDB saves.
TanStack Start handles SSR, server routes, and future server functions.

## Related

- [[../30-Implementation/pwa-offline-strategy]] — realizes this runtime · [[../60-Research/pwa-offline-patterns]] — source patterns
- [[09-Decisions/ADR-0002-offline-first]] · [[09-Decisions/ADR-0005-save-format]] — decisions
- [[03-Context]] · [[07-Deployment]] — arc42 siblings · [[modules/web]]
