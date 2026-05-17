---
title: Crosscutting Concerns
status: draft
tags: [architecture, security, quality]
created: 2026-05-15
updated: 2026-05-17
type: arch
related: [[09-Design-System]], [[10-Quality]], [[09-Decisions/ADR-0006-i18n]], [[09-Decisions/ADR-0008-mobile-first-ui]]
---

# Crosscutting Concerns

- **Logging**: structured logs at server boundaries; no secrets in logs.
- **Errors**: user-safe UI messages, detailed server logs.
- **Security**: strict secret handling, no production credentials in agents, CSP before production.
- **Accessibility**: WCAG 2.1 AA / BITV 2.0 target; audited token contrast and touch targets in [[09-Design-System]].
- **Performance**: Lighthouse mobile performance score >= 90.
- **PWA updates**: service-worker update prompt, no mutation response caching.

## Related

- [[09-Design-System]] — a11y/perf realization · [[10-Quality]] — gates · [[../30-Implementation/secrets-rotation]] — secret handling
- [[09-Decisions/ADR-0008-mobile-first-ui]] · [[09-Decisions/ADR-0006-i18n]] — decisions
- [[../30-Implementation/pwa-offline-strategy]] — SW update strategy
