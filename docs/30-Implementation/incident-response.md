---
title: Incident Response
status: current
tags: [implementation, operations, incident-response, observability]
created: 2026-05-17
updated: 2026-05-22
type: implementation
binding: false
adr: [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
related:
  - [[observability-runbook]]
  - [[deployment-dokploy]]
  - [[audit-trail]]
  - [[../60-Research/telemetry-privacy]]
---

# Incident Response

## Purpose

Operational response process for outages, stability regressions, data
durability risk, security issues and telemetry blind spots.

## Severity Levels

| Severity | Definition | Examples |
|---|---|---|
| SEV1 | broad outage, data loss risk or active security incident | app unavailable, save corruption, credential leak |
| SEV2 | major feature degraded for many users | multiplayer sync stuck, crash spike in latest release |
| SEV3 | limited degradation or workaround exists | one browser family has SW failure spike |
| SEV4 | low-risk issue or investigation | dashboard gap, noisy alert |

## First 15 Minutes

1. Acknowledge the alert.
2. Identify severity and user impact.
3. Open the overview dashboard.
4. Check latest deploy/release.
5. Check app health, crash reports, 5xx rate, outbox lag and telemetry
   pipeline health.
6. Assign an incident owner.
7. Start an incident timeline.

## Evidence Sources

- Grafana overview dashboards.
- Loki logs by `service`, `release`, `correlation_id` and `request_id`.
- GlitchTip grouped crashes and affected release.
- Prometheus metrics and alerts.
- Tempo traces when enabled.
- PostgreSQL outbox/audit archive tables for domain truth.
- CI artifacts for release regressions.

Operational logs are short-retention evidence. Domain audit evidence is
the ADR-0028 PostgreSQL outbox/archive.

## Legal Hold

If an incident may involve security, privacy, data loss or regulator
reporting:

- freeze only the narrow time window needed;
- record who approved the hold and why;
- restrict access to evidence;
- redact before external sharing;
- remove the hold when the incident closes unless counsel/Nico decides
  otherwise.

## Communication

Internal update cadence:

- SEV1: every 30 minutes until mitigated;
- SEV2: every 60 minutes until mitigated;
- SEV3/SEV4: as needed.

External communication is decided by Nico until a formal support/comms
process exists.

## Common Playbooks

### Client Crash Spike

1. Check GlitchTip issue grouping and release.
2. Confirm source maps are available.
3. Segment by browser, route and display mode.
4. Check recent deploys and feature flags.
5. If severe, roll back or disable affected feature.

### Offline Sync Stuck

1. Check client failed-command and retry metrics.
2. Check ADR-0013 outbox metrics.
3. Query failed command reasons.
4. Verify Redis consumer lag and publisher retries.
5. Use Audit context for user-visible command history.

### Save Durability Risk

1. Treat as SEV1 until proven otherwise.
2. Check IndexedDB quota/transaction diagnostics.
3. Check save-format and Dexie code changes in latest release.
4. Preserve relevant crash/log evidence under legal hold if needed.
5. Prepare user guidance for export/backup if risk is confirmed.

### Telemetry Blind Spot

1. Check Alloy, Loki, Prometheus, Tempo and GlitchTip health.
2. Confirm disk usage and retention jobs.
3. Check app health separately so pipeline failure is not mistaken for
   app health.
4. Restore telemetry before relying on absence of errors.

## Post-incident Review

Every SEV1/SEV2 needs a short review:

- summary and timeline;
- customer/user impact;
- root cause;
- detection gap;
- mitigation;
- prevention tasks;
- docs/runbook updates;
- whether retention/legal hold can be released.

## Change History

- 2026-05-17: Created for ADR-0017 observability rollout.
## Related

- [[observability-runbook]]
- [[deployment-dokploy]]
- [[audit-trail]]
- [[../60-Research/telemetry-privacy]]
