---
title: Secrets Rotation — Cloud-Agent Credential Boundary
status: current
tags: [security, implementation, cloud-agents]
context: audit-security
created: 2026-05-15
updated: 2026-05-18
type: implementation
binding: true
related: [[secrets-management]], [[../10-Architecture/08-Crosscutting]], [[deployment-dokploy]], [[agent-workflow-pattern]]
---

# Secrets Rotation — Cloud-Agent Credential Boundary

This note covers the **narrow Cloud-Agent credential boundary**.
The full secrets-management runbook (sops + age + direnv repo
layout, per-category rotation policy, zero-downtime rotation
recipes, CI + Dokploy secret-injection, accidental-leak
response, Tier-A dependency audit, backup + recovery drills, DR
tabletop scenarios) is in [[secrets-management]] (F11).

## Cloud-Agent boundary

Cloud Agents (Cursor Cloud, Bugbot, Claude Code, etc.) must
NEVER receive production credentials. The boundary:

- **Production secrets** (categories B / C / D / E / F / G / I /
  J / K / N / O from [[secrets-management]] §2) — only decryptable
  by the prod environment age key on the Hetzner VM. Cloud
  Agents have no access path.
- **Staging secrets** — decryptable by the staging environment
  age key + the founder's developer age key. Cloud Agents may
  occasionally receive a transient staging token during a
  testing flow; rotate that token at least quarterly OR whenever
  it might have been exposed to an agent context.
- **Dev secrets** — decryptable by every developer's age key
  (per `.sops.yaml` dev rule). Cloud Agents that operate inside
  the repo via a developer's local context CAN see dev secrets;
  this is acceptable because dev secrets never touch production
  data.

## Rotation cadence (Cloud-Agent-touching tokens)

- Staging API keys + DB credentials: at least **quarterly**.
- Any token that has been pasted into a Cloud-Agent message,
  log, or stack trace: **immediately**.
- Trigger via the §6 procedures in [[secrets-management]].

## Related

- [[secrets-management]] (F11) — full runbook this note is a
  subset of.
- [[../10-Architecture/08-Crosscutting]] — security concern.
- [[deployment-dokploy]] — where staging tokens live.
- [[agent-workflow-pattern]] — agent credential boundary.
- [[../00-Index/Non-Goals]] — no prod credentials in agents.
