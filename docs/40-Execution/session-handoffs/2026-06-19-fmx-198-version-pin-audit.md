---
title: Handoff - FMX-198 Version Pin Audit
status: open
tags: [meta, execution, handoff, fmx-198, dependency-currency, tooling, versions]
created: 2026-06-19
updated: 2026-06-19
type: handoff
binding: false
related:
  - [[../../60-Research/version-pin-audit-2026-06-19]]
  - [[../fmx-198-version-pin-audit-decision-queue-2026-06-19]]
  - [[../../30-Implementation/stack-currency-ledger]]
---

# Handoff: FMX-198 Version Pin Audit (2026-06-19)

## Linear

- Issue: FMX-198

## Done this session

- Created/claimed FMX-198 and worked from
  `codex/fmx-198-version-pin-audit` at current `origin/main`.
- Audited docs-vault version references for active pins, target stack rows and
  historical package observations.
- Ran Perplexity discovery, then source-checked against npm dist-tags, GitHub
  releases, Node.js release index, PostgreSQL versions RSS, Context7 and Ref.
- Completed a second exact-version pass covering XState, Storybook/Vite, i18n,
  architecture-fitness/test-support packages, match-engine helper libs, Motion
  and Centrifugo historical rows.
- Added raw Perplexity/source-check captures, synthesis and Nico decision queue.
- Updated current-facing docs so stale June 15 observations are no longer
  presented as current stable facts.

## Open / next step

- Nico needs to answer D1-D6 in
  [[../fmx-198-version-pin-audit-decision-queue-2026-06-19]] before active
  toolchain files are mutated.
- Recommended next narrow follow-up is D1=A: update pnpm from 11.7.0 to
  11.8.0 in `package.json` and `.mise.toml`.

## Blockers

- Node, PostgreSQL, Nx and Capacitor changes are architecture/platform
  decisions, not agent-owned cleanup.
- The repo is still docs-vault-only; target stack rows must be rechecked before
  the first real dependency lockfile.

## Changed vault paths

- `docs/60-Research/raw-perplexity/raw-fmx-198-version-pin-audit-2026-06-19.md`
- `docs/60-Research/raw-perplexity/raw-fmx-198-version-source-checks-2026-06-19.md`
- `docs/60-Research/version-pin-audit-2026-06-19.md`
- `docs/40-Execution/fmx-198-version-pin-audit-decision-queue-2026-06-19.md`
- `docs/40-Execution/session-handoffs/2026-06-19-fmx-198-version-pin-audit.md`
- `docs/40-Execution/session-handoffs/README.md`
- `docs/30-Implementation/stack-currency-ledger.md`
- `docs/30-Implementation/notification-messaging-platform.md`
- `docs/30-Implementation/code-phase-dod-transition-contract.md`
- `docs/10-Architecture/07-Deployment.md`
- `docs/10-Architecture/11-Risks.md`
- `docs/10-Architecture/12-Glossary.md`
- `docs/10-Architecture/09-Decisions/ADR-0043-notification-and-messaging-platform.md`
- `docs/10-Architecture/09-Decisions/ADR-0064-scouting-activity-context.md`
- `docs/10-Architecture/09-Decisions/ADR-0094-i18n-stack-and-locale-scope.md`
- `docs/10-Architecture/09-Decisions/ADR-0104-mobile-delivery-grounding-and-ratification.md`
- `docs/60-Research/00-summary.md`
- `docs/00-Index/Current-State.md`
- `docs/00-Index/Research-Map.md`

## Needs promotion

- D1-D6 require Nico approval before active tool pins, accepted mobile/runtime
  decisions or historical package-row implementation policy can change.

## Related

- [[../../60-Research/version-pin-audit-2026-06-19]]
- [[../fmx-198-version-pin-audit-decision-queue-2026-06-19]]
- [[../../30-Implementation/stack-currency-ledger]]
