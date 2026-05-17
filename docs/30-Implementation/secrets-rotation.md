---
title: Secrets Rotation
status: draft
tags: [security, implementation]
created: 2026-05-15
updated: 2026-05-17
type: implementation
related: [[../10-Architecture/08-Crosscutting]], [[deployment-dokploy]], [[agent-workflow-pattern]]
---

# Secrets Rotation

Cloud Agents must not receive production credentials. Rotate staging tokens at
least quarterly and whenever a token might have been exposed to an agent context.

## Related

- [[../10-Architecture/08-Crosscutting]] — security concern this details
- [[deployment-dokploy]] — where staging tokens live · [[agent-workflow-pattern]] — agent credential boundary
- [[../00-Index/Non-Goals]] — no prod credentials in agents
