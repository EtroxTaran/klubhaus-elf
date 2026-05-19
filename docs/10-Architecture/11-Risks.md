---
title: Risks
status: draft
tags: [architecture, risk]
created: 2026-05-15
updated: 2026-05-18
type: arch
related: [[10-Quality]], [[09-Decisions/ADR-0001-tech-stack]], [[09-Decisions/ADR-0007-naming-schema]], [[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
---

# Risks

- TanStack Start beta API changes can affect bootstrap stability.
- Hybrid-online MVP must not be mistaken for abandoning offline-first; docs and
  UI must keep selective offline-first as an explicit future path.
- Server-confirmed MVP progression introduces connectivity dependency; offline
  copy must be honest and drafts must never look final.
- Future export/import can be blocked by careless schema/storage shortcuts; keep
  save-envelope and versioning contracts visible from day one.
- Dokploy, Bugbot, branch protection, and Cursor Automation require account access.
- AI engineering stack repository access is currently unavailable to this agent.
- IP-safe naming needs explicit ADR review before generated data work starts.

## Related

- [[09-Decisions/ADR-0001-tech-stack]] — TanStack Start risk owner · [[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]] — hybrid-online staging · [[09-Decisions/ADR-0007-naming-schema]] — IP-safe naming gate
- [[../60-Research/research-wave-2-gaps]] — open research risk · [[../00-Index/Current-State]] — live blockers
- [[10-Quality]] — arc42 sibling
