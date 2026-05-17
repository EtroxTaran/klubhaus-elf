---
title: Implementation Map
status: current
tags: [implementation, meta]
created: 2026-05-16
updated: 2026-05-17
type: map
binding: false
related: [[Architecture-Map]], [[Current-State]]
---

# Implementation Map

Use this map for operational, deployment, data, and agent workflow work.

## Implementation Notes

- [Cursor Cloud Agent Workflow](../30-Implementation/cursor-cloud-agent-workflow.md)
- [Linear Task Tracking](../30-Implementation/linear-task-tracking.md)
- [PWA Offline Strategy](../30-Implementation/pwa-offline-strategy.md)
- [SurrealDB Integration](../30-Implementation/surrealdb-integration.md)
- [Deployment Dokploy](../30-Implementation/deployment-dokploy.md)
- [Observability Runbook](../30-Implementation/observability-runbook.md)
- [Client Telemetry](../30-Implementation/client-telemetry.md)
- [Jobs and Scheduler](../30-Implementation/jobs-and-scheduler.md) - includes
  matchday scheduling, quality-profile dispatch and future extracted
  `match-worker` observability hooks.
- [Audit Trail](../30-Implementation/audit-trail.md)
- [Incident Response](../30-Implementation/incident-response.md)
- [Secrets Rotation](../30-Implementation/secrets-rotation.md)
- [Transfer Market Implementation Plan](../30-Implementation/transfer-market-implementation-plan.md)

## Related Rules

- [../90-Meta/agent-memory-protocol.md](../90-Meta/agent-memory-protocol.md)
- [../90-Meta/vault-governance.md](../90-Meta/vault-governance.md)
- [../90-Meta/mcp-memory-integration.md](../90-Meta/mcp-memory-integration.md)

## Binding Rule

Implementation notes describe current process and system behavior. If they
conflict with an accepted ADR, the ADR wins and the note should be updated.
