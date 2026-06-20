---
title: Incident Response
status: current
tags: [implementation, operations, incident-response, observability, gdpr, privacy, breach-notification, bfdi, fmx-183]
context: audit-security
created: 2026-05-17
updated: 2026-06-19
type: implementation
binding: true
adr: [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
related: [[observability-runbook]], [[deployment-dokploy]], [[audit-trail]], [[../60-Research/telemetry-privacy]], [[privacy-and-consent]], [[secrets-management]], [[../60-Research/breach-notification-runbook-2026-06-15]], [[../40-Execution/fmx-183-breach-notification-decision-queue-2026-06-15]]
---

# Incident Response

> **RATIFIED on 2026-06-19.** Nico approved the linked FMX decision
> queue via `APPROVE ALL RECOMMENDED`; this implementation or quality note is now
> binding according to its approved scope.


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
8. Set `personal_data_involved` to `no`, `unknown` or `yes`. For SEV1/SEV2,
   `unknown` is enough to page the Privacy Lead.

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

## GDPR Breach Notification (Art. 33/34)

This section is the operational drill for the binding decision tree and user
template in [[privacy-and-consent]] §9. Do not duplicate or override that note:
it owns the legal trigger tree and DE/EN user-notification copy. This runbook
owns the clock, escalation, evidence and form checklist.

### Trigger and 72-hour clock

- `T_alert` is when FMX first detects or receives the incident.
- GDPR `T0` starts when the Privacy Lead or delegated incident owner has a
  reasonable degree of certainty that a security incident caused personal-data
  compromise.
- In the first 15 minutes, classify `personal_data_involved` as `no`,
  `unknown` or `yes`.
- SEV1/SEV2 security incidents with `unknown` or `yes` page the Privacy Lead
  immediately. Examples: server/root compromise, auth DB exposure,
  session/refresh token leak, processor breach notice, public support export,
  user-tied log/analytics export.
- If Art. 33 looks likely and facts are incomplete, prepare a partial
  notification rather than waiting for perfect forensics.

Operational checkpoints:

| Timebox | Required action |
|---|---|
| `T0 + 24h` | Record personal-data categories, approximate affected users/records, likely consequences, containment status and current Art. 33/34 risk view. |
| `T0 + 48h` | Decide whether to prepare/file a partial Art. 33 notification. Escalate to Nico/counsel if authority route, risk threshold or user messaging is ambiguous. |
| `T0 + 70h` | File required Art. 33 notification or record the no-notification rationale, leaving a two-hour buffer before the 72-hour deadline. |
| Post-file | Supplement the authority notification without undue delay as facts improve. |

### Authority route and BfDI form

- Current operational bookmark: BfDI Lucom form
  ([Meldung von Datenschutzverletzungen](https://formulare.bfdi.bund.de/lip/action/invoke.do?id=BfDIDSverstoesse)).
- Source route: EDPB DPA notification index
  (<https://www.edpb.europa.eu/notify-data-breach_en>).
- At entity setup, each drill and each live incident, the Privacy Lead verifies
  whether BfDI or a German state authority is the competent route for the
  current controller/main-establishment posture.
- If the Lucom form is unavailable, record the outage and use the current DPA
  contact route from the EDPB/national authority page.

### Art. 33 authority checklist

Record or prepare these fields before filing:

- incident summary and current status;
- `T_alert`, GDPR `T0`, containment time and whether the incident is ongoing;
- breach nature: confidentiality, integrity and/or availability;
- affected systems and data categories;
- approximate affected data subjects and records, using ranges if exact counts
  are not known;
- Privacy Lead/DPO contact;
- likely consequences for users;
- measures taken/proposed, including containment, credential/session resets,
  processor coordination, monitoring and planned follow-up;
- whether Art. 34 user communication is required or still under assessment;
- reasons for any notification later than 72 hours;
- submission reference, timestamp and later supplement history.

All personal-data breach assessments, including no-notify decisions, are stored
in the incident timeline for GDPR Art. 33(5) accountability.

### Severity mapping

| Incident pattern | FMX severity | Art. 33 posture | Art. 34 posture |
|---|---|---|---|
| Server/root compromise, user personal data likely accessible | SEV1 | Prepare/file unless risk is demonstrably unlikely. | Likely if account takeover, payment, chat/support or broad exposure exists. |
| Auth DB, password hash, session/refresh token or signing-key exposure | SEV1/SEV2 | Prepare/file unless strong containment proves unlikely risk. | Likely for reusable credentials/tokens or broad account takeover risk. |
| Payment processor breach notice | SEV1/SEV2 | Assess controller/processor role and prepare/file unless risk unlikely. | Often likely high risk if financial abuse, phishing or card-data risk exists. |
| Support export/ticket leak | SEV2/SEV3 | File if uncontrolled, broad, sensitive or externally accessible. | Notify users if exposure is broad, uncontrolled or includes sensitive free text. |
| Analytics/log export with IP/device/user ids | SEV2/SEV3 | Assess; likely if user-tied logs leave the approved processor boundary. | Usually only if account access, sensitive content or high abuse risk follows. |
| Public analytics property id only | SEV4 | No Art. 33; document no personal-data breach. | No Art. 34. |

### RACI

| Task | Incident Owner | Privacy Lead | Security/Engineering | Nico | Counsel | Comms/Support |
|---|---|---|---|---|---|---|
| Incident timeline and evidence | A/R | C | R | I | I | I |
| Personal-data breach assessment | C | A/R | C | I | C when ambiguous | I |
| Competent-authority route check | I | A/R | I | C | C when ambiguous | I |
| Art. 33 authority notification | I | A/R | C | A for company posture | C when ambiguous | I |
| Art. 34 user communication | C | A/R | C | A for product/public comms | C when ambiguous | R |
| Technical containment | A | C | R | I | I | I |
| Post-incident record and controls | R | R | R | A | C if legal action likely | C |

### User communication handoff

When [[privacy-and-consent]] §9 says Art. 34 applies:

- use the DE/EN template in [[privacy-and-consent]] §9.4;
- send direct email to affected users where feasible;
- add in-app inbox/status/community updates for SEV1/high-impact live-service
  incidents, but do not rely on transient push/social posts as the only notice;
- include concrete player actions: password reset, session/device review,
  phishing caution, payment-card monitoring or support contact as applicable;
- keep all final copy, send timestamp, recipient scope and update history in
  the incident timeline.

### Drill cadence

- Annually: full breach-notification tabletop with mock Art. 33 form, Art. 34
  user copy and post-incident review.
- Semiannually: verify Privacy Lead contact, counsel escalation contact, EDPB
  route and BfDI/national-authority form accessibility.
- After each SEV1/SEV2 security incident: record whether the incident would
  have been Art. 33/34 reportable and update the runbook if the answer was hard
  to produce.

## Communication

Internal update cadence:

- SEV1: every 30 minutes until mitigated;
- SEV2: every 60 minutes until mitigated;
- SEV3/SEV4: as needed.

External communication is decided by Nico except GDPR breach notifications,
which follow the GDPR Breach Notification section above and
[[privacy-and-consent]] §9. Nico still approves public product/community
messaging and counsel escalation.

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
- whether retention/legal hold can be released;
- for personal-data breach assessments, the Art. 33/34 decision, authority
  submission reference if filed, user-communication artifact if sent and
  rationale if notification was not required.

## Change History

- 2026-06-15: Added FMX-183 GDPR/BfDI breach-notification operational drill,
  severity mapping, authority checklist and drill cadence.
- 2026-05-17: Created for ADR-0017 observability rollout.
