---
title: Implementation (Map of Content)
status: current
tags: [implementation, moc]
created: 2026-05-17
updated: 2026-06-16
type: index
binding: true
related: [[../00-Index/Home]], [[agent-workflow-pattern]], [[code-phase-dod-transition-contract]], [[release-versioning-app-build-process]], [[incident-response]], [[../60-Research/breach-notification-runbook-2026-06-15]], [[../10-Architecture/README]], [[../00-Index/Documentation-V1]]
---

# Implementation - Map of Content

Hub for the implementation domain: process, CI, infra, data integration and
operational runbooks. Current implementable notes are classified by
[[../00-Index/Documentation-V1]].

## Process and Workflow

- [[agent-workflow-pattern]] - single source of truth for how agents work.
- [[code-phase-dod-transition-contract]] - executable docs-phase -> code-phase
  Definition-of-Done bridge; code gates are target-only until bootstrap creates
  workspace, Nx, scripts, CI and app/package paths.
- [[stack-currency-ledger]] - FMX-168 accepted tooling-currency ledger for
  source-checked package/tool rows, source-conflict policy, risk rings and
  bootstrap compatibility gates. Accepted by Nico 2026-06-19 in
  [[../40-Execution/fmx-168-tooling-currency-decision-queue-2026-06-15]].
- [[../60-Research/code-ci-pipeline-2026-06-15]] - FMX-175 accepted code-CI
  context contract: active `docs-check` / `linear-id`, future `quality` /
  `e2e` / `security` after real scripts, workflows and burn-in; D-002
  `cursor-smoke` / `configured` names are historical only.
- [[monorepo-workspace-bootstrap-plan]] - FMX-179 non-binding scaffold plan for
  the first real workspace: progressive context package catalog, real foundation
  packages only, Nx/pnpm/TypeScript linking and no-placeholder gate activation
  after ADR-0114 approval.
- [[release-versioning-app-build-process]] - FMX-178 accepted release runbook for
  future app versioning, generated `release.json`, immutable Dokploy promotion,
  rollback, PWA update UX and beta release ownership after ADR-0132 approval.
- [[cursor-cloud-agent-workflow]] - cloud-agent operational steps.
- [[ci-and-review-process]] - green-by-default enforcement.
- [[../40-Quality/test-strategy]] - FMX-177 current future code-phase test
  strategy; binding through accepted ADR-0118 but target-only until real code
  targets exist.
- [[design-sync-workflow]] - design export to codebase.
- [[linear-task-tracking]] - Linear (team FMX) conventions + GitHub branch/PR integration.
- [[domain-research-workflow]] - canonical six-phase beat for closing bounded-context gaps in Phase 1.

## Infrastructure and Integration

- [[deployment-dokploy]] - Dokploy/Hetzner deployment.
- [[postgres-drizzle-integration]] - current persistence, migrations, query gateway and outbox integration.
- [[hybrid-online-pwa-strategy]] - current MVP online/offline posture.
- [[observability-runbook]] - operational monitoring and response.
- [[client-telemetry]] - privacy-aware diagnostics.
- [[jobs-and-scheduler]] - scheduled work, matchday dispatch and future worker hooks.
- [[audit-trail]] - audit/event evidence.
- [[auth-flows]] - authentication implementation surface.
- [[session-management]] - session and refresh-token lifecycle.
- [[account-recovery]] - account key and recovery flows.
- [[privacy-and-consent]] - GDPR/ePrivacy implementation surface.
- [[rate-limiting-anti-abuse]] - quotas, anti-griefing and abuse response.
- [[incident-response]] - incident handling, including the FMX-183
  GDPR/BfDI breach-notification operational drill (`T0`, 72-hour checkpoints,
  Art. 33 checklist, Art. 34 handoff, RACI and drill cadence).
- [[secrets-management]] - full secrets and restore-drill runbook.
- [[secrets-rotation]] - narrow Cloud-Agent credential boundary policy.
- [[transfer-market-implementation-plan]] - transfer-market implementation slice.
- [[club-economy-accounting-ledger]] - draft Club Economy ledger contracts,
  read models and staged insolvency implementation surface.
- [[ai-narration-contract-testing-framework]] - draft AI narration contract,
  eval corpus, fallback coverage manifest, safety/privacy and Playtest First
  implementation framework.

## Historical Notes

- [[surrealdb-integration]] - superseded by [[postgres-drizzle-integration]]; do not implement.
- [[pwa-offline-strategy]] - superseded by [[hybrid-online-pwa-strategy]]; do not implement.

## Up

- [[../00-Index/Home]] - vault hub.
- [[../00-Index/Current-State]] - live state.
- [[../10-Architecture/README]] - architecture MOC.
- [[../60-Research/00-summary]] - research MOC.
- [[../90-Meta/agent-memory-protocol]] - memory protocol.
