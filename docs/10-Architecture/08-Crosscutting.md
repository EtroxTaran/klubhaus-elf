---
title: Crosscutting Concerns
status: draft
tags: [architecture, security, quality]
updated: 2026-05-15
---

# Crosscutting Concerns

- **Logging**: structured logs at server boundaries; no secrets in logs.
- **Errors**: user-safe UI messages, detailed server logs.
- **Security**: strict secret handling, no production credentials in agents, CSP before production.
- **Accessibility**: WCAG 2.1 AA / BITV 2.0 target; audited token contrast and touch targets in [[09-Design-System]].
- **Performance**: Lighthouse mobile performance score >= 90.
- **PWA updates**: service-worker update prompt, no mutation response caching.
