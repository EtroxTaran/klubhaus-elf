---
title: Audit Trail
status: current
tags: [implementation, audit, outbox, compliance, observability]
created: 2026-05-17
updated: 2026-05-22
type: implementation
binding: false
adr: [[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]], [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]], [[../10-Architecture/09-Decisions/ADR-0043-notification-and-messaging-platform]]
related: [[jobs-and-scheduler]], [[observability-runbook]], [[notification-messaging-platform]], [[../10-Architecture/09-Decisions/ADR-0004-data-model]]
---

# Audit Trail

## Purpose

Define the boundary between domain audit history and operational logs.

## Current Approach

ADR-0028 states that the Postgres outbox **is** the audit trail:

- hot table: `outbox_event`, last 60 days;
- cold archive: `outbox_event_archive_YYYY_MM`, kept forever;
- consumer offsets: `consumer_event_offset`, retained 60 days.

Operational logs in Loki are not the domain audit trail. They support
debugging and incident triage only.

## Audit Event Scope

Audit-relevant events include:

- authentication and account-security changes — concrete event
  catalogue (per [[auth-flows]] F2 §2 + §6 + §8):
  - `auth.signup_verified`
  - `auth.login_passkey`, `auth.login_password`, `auth.login_mfa`
  - `auth.password_changed`, `auth.password_reset_completed`
  - `auth.mfa_enrolled`, `auth.mfa_disabled`,
    `auth.recovery_codes_generated`, `auth.recovery_code_used`
  - `auth.session_revoked`, `auth.logout_everywhere`
  - `auth.account_secret_rotated`, `auth.email_changed`,
    `auth.account_deleted`
  - `auth.anomaly.*` (new-device / new-country / impossible-travel
    / credential-stuffing / reset-storm / signup-storm /
    global-fail-spike — F2 §8.5);
- save creation, archive, deletion and restore;
- multiplayer group creation and membership changes;
- submitted commands and server decisions;
- transfer offers, acceptances, rejections and deadline closures;
- match simulation/resolution summaries;
- economy and sponsorship decisions;
- admin actions;
- content moderation actions for community datasets.
- notification preference changes, subscription lifecycle, delivery state and
  provider webhook decisions:
  - `notification.created`
  - `notification.delivered`
  - `notification.delivery_failed`
  - `notification.read`
  - `notification.dismissed`
  - `notification.preference_changed`
  - `notification.subscription_created`
  - `notification.subscription_revoked`
  - `notification.digest_sent`

Each audit event is a domain event with:

- `event_id`;
- `correlation_id`;
- optional `causation_id`;
- `event_type`;
- `schema_version`;
- `aggregate_type`;
- `aggregate_id`;
- JSON payload validated by Zod;
- `emitted_at`.

## Operational Logs vs Audit

| Concern | Store | Retention | Purpose |
|---|---|---:|---|
| Domain event history | PostgreSQL outbox / partitioned archive ([[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]]) | 60 days hot, monthly partitioned archive forever | business/audit truth |
| App/server logs | Loki | 14 days | debugging, incident triage |
| Crash reports | GlitchTip | 30 days | error grouping and release regression |
| Metrics | Prometheus | 15 months | trends, alerts, SLOs |
| Traces | Tempo | 7 days | workflow debugging |

Do not reconstruct business truth from Loki. Query the Audit context,
which reads hot and archive tables transparently.

## Query Patterns

Audit UI/API should support:

- by aggregate id and type;
- by event type;
- by time range;
- by correlation id;
- by actor/telemetry subject id where allowed;
- by save id or multiplayer group id.

Large archive queries must be paginated and time-bounded.

## Privacy

Audit payloads still follow minimisation:

- no secrets or credentials;
- no raw save blobs;
- no unnecessary PII;
- user-facing names are stored only when required by the domain decision;
- payload schemas are versioned and documented.

Account deletion must follow F6 policy. Some audit rows may be retained
for legal/security reasons but should be minimised or pseudonymised where
possible.

## Tamper Evidence

Open F10 decision: whether cold archive partitions need hash-chain
tamper evidence. Until decided, the minimum control is:

- append-only event production via outbox;
- admin access logging;
- backup retention;
- no manual edits outside documented incident procedures.

## Change History

- 2026-05-17: Created to separate ADR-0013 audit from ADR-0017 operational logs.
- 2026-05-18: Concrete `auth.*` event catalogue added (F2 [[auth-flows]]).
