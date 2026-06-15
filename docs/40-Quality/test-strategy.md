---
title: Test Strategy
status: current
tags: [quality, testing, ci, vitest, playwright, fast-check, stryker, mutation, determinism, accessibility, performance, security, architecture-fitness, dependency-cruiser, pwa, offline, mobile, rollback, content-qa, fmx-167, fmx-172, fmx-177, fmx-196, fmx-197]
created: 2026-06-14
updated: 2026-06-15
type: quality
binding: true
linear: FMX-177
related:
  - [[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
  - [[../60-Research/test-strategy-adr-2026-06-14]]
  - [[../60-Research/raw-perplexity/raw-test-strategy-adr-2026-06-14]]
  - [[../40-Execution/fmx-177-test-strategy-decision-queue-2026-06-14]]
  - [[../10-Architecture/09-Decisions/ADR-0125-stryker-mutation-testing-gate]]
  - [[stryker-mutation-testing-gate]]
  - [[../60-Research/mutation-testing-gate-2026-06-15]]
  - [[../40-Execution/fmx-172-stryker-mutation-gate-decision-queue-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0120-deterministic-simulation-qa-and-save-forward-matrix]]
  - [[deterministic-simulation-qa-harness]]
  - [[../10-Architecture/09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
  - [[architecture-fitness-function]]
  - [[../10-Architecture/09-Decisions/ADR-0124-pwa-offline-mobile-release-content-qa-gates]]
  - [[pwa-offline-mobile-release-content-qa-gates]]
  - [[../60-Research/pwa-offline-mobile-release-content-qa-gates-2026-06-15]]
  - [[../40-Execution/fmx-197-pwa-offline-mobile-release-content-qa-decision-queue-2026-06-15]]
  - [[../10-Architecture/10-Quality]]
  - [[../30-Implementation/ci-and-review-process]]
---

# Test Strategy

This note is the current future code-phase quality strategy for FMX, binding
through accepted
[[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]].

Current docs-phase validation remains:

- `node scripts/docs-check.mjs`;
- `node scripts/status-consistency-check.mjs` when a PR changes ADR/GDDR
  `status:` or `binding:` semantics.

No code-phase script, package path, Storybook app or CI gate exists in the
post-reset repo until bootstrap work creates real targets per ADR-0110.

## Quality-gate ladder

| Gate | PR | Nightly | Release | Notes |
|---|---|---|---|---|
| Docs vault validation | Required now | Optional | Required | Active in current repo. |
| TypeScript/Biome | Code phase | Code phase | Code phase | Exact scripts restored by bootstrap. |
| Unit/domain tests | Code phase | Code phase | Code phase | Vitest node projects. |
| Component/DOM tests | Code phase | Code phase | Code phase | Vitest DOM and selective Browser Mode. |
| Property tests | Smoke | Deep run | Stress run | fast-check with replay artifacts. |
| Integration/contract tests | Required | Required | Required | Context/persistence/API/schema contracts. |
| Architecture fitness | Code phase | Code phase | Release evidence | Future `quality` subgate: import boundaries plus Drizzle/schema/query/migration storage-boundary scanners. |
| Playwright E2E/PWA | Smoke | Browser/device matrix | Full release matrix | Offline, mobile viewport, key journeys. |
| Accessibility | Automated smoke | Broader automated | Automated + manual | axe/Lighthouse/Storybook plus manual focus/reduced-motion. |
| Determinism replay | Smoke seeds | Larger seed set | Stress seed set | Byte-identical replay and entropy guards. |
| Save-forward compatibility | Changed save code | Matrix | Matrix | Supported versions only. |
| Soak/calibration | Not default | 50-year envelopes | 50-year envelopes | Long-horizon economy/competition stability. |
| Mutation testing | Not default first | Scoped Stryker | Scoped Stryker | PR gate only after measured stability; FMX-172 draft refines activation. |
| Visual regression | Curated only | Curated | Curated | Avoid blanket flaky story snapshots. |
| Performance/Web Vitals | Smoke | Budget drift | Device-floor evidence | LHCI/Web Vitals once app exists. |
| Security/dependency/SBOM | Fast scan | Deeper scan | Release artifact | cdxgen/SBOM and dependency evidence. |
| Load/chaos/DAST | Not before services | Target-only | Release/manual | Future service phase only. |

## Tool ownership

| Tool | Proposed owner surface |
|---|---|
| Vitest | Unit/domain, DOM/component, selective Browser Mode, coverage, property integration. |
| Playwright Test | User journeys, offline/PWA, cross-browser/device smoke, a11y integration, browser traces. |
| fast-check | Input-space/property invariants with replayable counterexamples. |
| StrykerJS | Mutation quality for deterministic/domain packages, first on scheduled cadence; FMX-172 draft defines the pending gate details. |
| Storybook test-runner | Interaction/a11y checks for curated design-system stories after showcase exists. |
| Lighthouse / LHCI | Performance, a11y and PWA budget evidence after app exists. |
| cdxgen / dependency scanners | SBOM and dependency evidence for release/security gates. |
| dependency-cruiser + custom AST/SQL scanners | FMX-167 architecture-fitness gate for context import boundaries, Drizzle schema/query ownership and migration SQL checks after code bootstrap. |

## Base thresholds

ADR-0118 D5 accepts this base threshold:

- 85 statements;
- 85 lines;
- 85 functions;
- 75 branches;
- per-file for meaningful first-party product logic.

This threshold does not apply to generated files, route-tree output,
framework-only bootstrap glue, test utilities or empty scaffolds. Those
exclusions must be documented in config once code exists. Empty packages must
not be made green through placeholder tests or fake coverage.

Coverage is a floor, not proof of correctness. Deterministic/domain code still
needs property, replay, mutation and soak gates.

## Replay evidence convention

Property and determinism failures should produce a small artifact with:

- property or replay suite ID;
- `seed`;
- fast-check `path` when present;
- minimized counterexample or fixture pointer;
- engine/content/config hash when relevant;
- command to rerun locally;
- PR/build/nightly identity;
- failed invariant or replay hash diff.

The artifact should be linked from CI and saved with enough information to
debug without rerunning a large random search.

## Mutation scope

Recommended initial Stryker scope:

- match engine and replay-bearing helpers;
- save parser/migration/envelope validation;
- ledger/accounting settlement;
- regulations/eligibility policies;
- replay-protection/idempotency validators.

ADR-0118 D4 accepts scheduled mutation testing first, scoped to the surfaces
above. The initial scoped threshold target is 70 break / 80 low / 90 high after
baseline. Do not activate a mutation gate for broad UI glue before the codebase
has measured runtime and stable baselines.

FMX-172 adds a non-binding packet for those activation details:
[[stryker-mutation-testing-gate]] and draft
[[../10-Architecture/09-Decisions/ADR-0125-stryker-mutation-testing-gate]].
Until Nico accepts D1-D6, this note remains the binding general strategy and
FMX-172 remains planning context only.

## Accessibility evidence

Automated a11y gates should fail on critical/serious violations in targeted
flows. They are not the whole accessibility proof. Release evidence should also
include keyboard navigation, focus order, focus traps, reduced motion and
screen-reader smoke for critical flows.

## CI cost evidence

The code-phase CI should report wall time and, where available, runner-minute
cost by gate family:

- PR hot path;
- nightly deep path;
- release audit path.

CI must stay portable across the active GitHub-hosted path and Nico's future
local AI-server runner environment. In this note, `xAi` means Nico's own local
stack, not xAI/Grok. The local runner path is not activated by this note: it
requires a later compatibility, isolation, secret-exposure, maintenance and
cost gate before any trusted PR or scheduled work uses it.

## Ratified decisions and follow-up gaps

See [[../40-Execution/fmx-177-test-strategy-decision-queue-2026-06-14]].

Accepted on 2026-06-15:

- D1=A: tiered 16-layer strategy;
- D2=A: Vitest projects + Playwright E2E split;
- D3=A: replayable property evidence;
- D4=A: scoped mutation, scheduled first, 70/80/90 after baseline;
- D5=A: 85/85/85/75 per-file base coverage threshold;
- D6=A-custom: portable GitHub-hosted path plus future local `xAi` runner
  capability, with separate activation proof required.

Follow-up gaps remain outside FMX-177 and should be tracked separately:

- Stryker mutation-testing activation details now have a non-binding FMX-172
  packet:
  [[stryker-mutation-testing-gate]] and draft
  [[../10-Architecture/09-Decisions/ADR-0125-stryker-mutation-testing-gate]];
- deterministic simulation replay harness, soak/calibration metrics and
  save-forward compatibility matrix now have a non-binding FMX-196 packet:
  [[deterministic-simulation-qa-harness]] and draft
  [[../10-Architecture/09-Decisions/ADR-0120-deterministic-simulation-qa-and-save-forward-matrix]];
- architecture fitness for no shared tables / no cross-context joins is now
  accepted in FMX-167:
  [[architecture-fitness-function]] and
  [[../10-Architecture/09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]];
- PWA storage/offline/mobile degradation, release rollback and
  content-validation QA gates now have a non-binding FMX-197 packet:
  [[pwa-offline-mobile-release-content-qa-gates]] and draft
  [[../10-Architecture/09-Decisions/ADR-0124-pwa-offline-mobile-release-content-qa-gates]].

## Related

- [[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
- [[../10-Architecture/09-Decisions/ADR-0125-stryker-mutation-testing-gate]]
- [[stryker-mutation-testing-gate]]
- [[../60-Research/mutation-testing-gate-2026-06-15]]
- [[../40-Execution/fmx-172-stryker-mutation-gate-decision-queue-2026-06-15]]
- [[../10-Architecture/09-Decisions/ADR-0120-deterministic-simulation-qa-and-save-forward-matrix]]
- [[deterministic-simulation-qa-harness]]
- [[../10-Architecture/09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
- [[architecture-fitness-function]]
- [[../10-Architecture/09-Decisions/ADR-0124-pwa-offline-mobile-release-content-qa-gates]]
- [[pwa-offline-mobile-release-content-qa-gates]]
- [[../60-Research/test-strategy-adr-2026-06-14]]
- [[../60-Research/raw-perplexity/raw-test-strategy-adr-2026-06-14]]
- [[../30-Implementation/ci-and-review-process]]
- [[../10-Architecture/10-Quality]]
