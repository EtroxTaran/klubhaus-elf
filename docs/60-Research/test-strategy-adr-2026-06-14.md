---
title: Test Strategy ADR Research
status: current
tags: [research, testing, quality, vitest, playwright, fast-check, stryker, determinism, accessibility, performance, security, ci, fmx-177]
created: 2026-06-14
updated: 2026-06-15
type: research
binding: false
linear: FMX-177
related:
  - [[raw-perplexity/raw-test-strategy-adr-2026-06-14]]
  - [[pre-mortem/PM-2026-05-20-16-test-strategy-depth]]
  - [[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
  - [[../40-Quality/test-strategy]]
  - [[../40-Execution/fmx-177-test-strategy-decision-queue-2026-06-14]]
  - [[../10-Architecture/10-Quality]]
  - [[../30-Implementation/ci-and-review-process]]
---

# Test Strategy ADR Research

FMX-177 replaces the dead pre-mortem-era `ADR-0040` placeholder with a current,
source-checked decision packet for the future code-phase test strategy.

Nico accepted the decision packet on 2026-06-15. The binding source is
accepted
[[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
plus current [[../40-Quality/test-strategy]]. This research note remains
non-binding evidence.

## Recommendation

Adopt a **tiered quality-gate strategy**:

- Vitest owns fast node/domain tests, DOM/component tests, selective Browser
  Mode tests and property-test integration.
- Playwright owns E2E journeys, offline/PWA behavior, cross-browser smoke,
  a11y integration and performance/browser evidence.
- fast-check property tests are mandatory for deterministic/domain input-space
  risk and must persist replayable `seed` / `path` / counterexample evidence.
- Stryker mutation testing starts scoped to high-value deterministic/domain
  packages and runs nightly/release before it becomes a PR blocker.
- Deterministic simulation gets a separate ladder: PR smoke seeds, nightly deep
  seeds, release stress seeds, golden replay, save-forward compatibility and
  50-year soak/calibration envelopes.
- Code coverage becomes a base signal only. It must not replace
  property/mutation/replay/a11y/performance gates.

This keeps the PR loop fast enough to stay enabled while protecting the
surfaces that matter most for a long-running football manager: deterministic
matches, save compatibility, offline behavior, low-end mobile performance and
player-facing UI trust.

## Findings

### F1 - FMX needs a tiered pyramid, not an all-per-PR wall

The old pre-mortem correctly identified the risk of a shallow test pyramid and
expensive CI. Its mistake was treating `ADR-0040` as a future fixed target and
pinning stale tool assumptions. Current research supports the core idea but
changes the operating model:

- per-PR gates catch fast, deterministic and user-critical regressions;
- nightly gates explore larger input/seed spaces and mutation quality;
- release gates prove long-horizon save, soak, security and real-device
  evidence.

That mirrors how simulation bugs surface in practice: many are compounding
multi-season failures, not isolated unit examples.

### F2 - Vitest and Playwright should be split by responsibility

Vitest 4 projects and Browser Mode can cover unit/domain/component cases
without making every UI test a full Playwright route test. Playwright remains
the right tool for browser journeys, offline/PWA flows, cross-browser smoke and
traces.

Recommended split:

| Surface | Primary tool | Why |
|---|---|---|
| Pure domain units, policies, validators | Vitest node project | Fast, deterministic, easy coverage. |
| DOM/component behavior that does not need real browser APIs | Vitest DOM project | Fast component feedback. |
| Browser component behavior needing real APIs/layout | Vitest Browser Mode with Playwright provider | Real browser without full route journey cost. |
| Routes, flows, offline, cross-browser, a11y integration | Playwright Test | Browser context, devices, tracing, sharding. |
| Property/invariant tests | fast-check via Vitest | Counterexample shrinking and replay. |

Sources:

- Vitest Browser Mode: https://vitest.dev/guide/browser.html
- Playwright sharding/reporters/config: https://playwright.dev/docs/test-sharding

### F3 - Property tests must be replayable evidence, not random noise

fast-check is valuable only if failures can be reproduced. FMX should record
`seed`, `path`, property ID, engine/content hash and minimized counterexample
artifact for any failed property. This is especially important for:

- match-engine invariants;
- save parser/migration round-trips;
- league table/tie-break rules;
- accounting settlement/balancing invariants;
- transfer/registration eligibility;
- generated squad/world inputs.

The source-checked fast-check docs support reruns with `{ seed, path,
endOnFailure: true }` and explicit replay examples.

Sources:

- https://github.com/dubzzz/fast-check/blob/main/website/docs/tutorials/quick-start/read-test-reports.md?plain=1#L66
- https://github.com/dubzzz/fast-check/blob/main/website/docs/advanced/fuzzing.md?plain=1#L91

### F4 - Mutation testing should start scoped

Mutation testing finds assertion weakness, but it is expensive. FMX should not
try to mutate all UI glue from day one. Start with high-value deterministic
surfaces:

- match engine and replay-bearing helpers;
- save parser/migration/KDF envelope validation;
- ledger/accounting settlement;
- eligibility/regulatory policies;
- security/idempotency/replay-protection validators.

StrykerJS supports Vitest and incremental mode, but the docs also show that a
dry run remains part of mutation testing. This supports nightly/release cadence
before PR enforcement.

Sources:

- https://github.com/stryker-mutator/stryker-js/blob/master/docs/incremental.md?plain=1#L8
- https://github.com/stryker-mutator/stryker-js/blob/master/docs/vitest-runner.md?plain=1#L22

### F5 - Deterministic simulation gates are separate from coverage

Coverage can show that code was executed. It cannot prove byte-stable replay,
long-run economy stability, or save-forward compatibility.

FMX needs dedicated gates:

- `determinism-smoke`: small seed set per PR for byte-identical golden replay;
- `determinism-nightly`: larger seed set and cross-runtime parity;
- `determinism-release`: stress seed set and compatibility matrix;
- save-forward-compatibility matrix across supported save versions;
- 50-year soak assertions with calibration envelopes;
- lint/architecture guards against hidden entropy (`Math.random`, wall-clock,
  float-threshold branching in replay-bearing code, provider calls in replay).

This aligns with accepted ADR-0096 and the FMX determinism notes.

### F6 - Accessibility and performance need both automated and manual evidence

Automated axe/Lighthouse checks catch common issues but do not prove full WCAG
conformance. The Playwright docs explicitly warn about this limit. The strategy
should require:

- automated a11y checks for critical user flows and Storybook/design-system
  stories where appropriate;
- manual keyboard, focus order, reduced-motion and screen-reader smoke at
  release cadence;
- Lighthouse/Web Vitals budgets and low-end mobile performance budgets after
  code phase starts.

Sources:

- https://github.com/microsoft/playwright/blob/main/docs/src/accessibility-testing-js.md?plain=1#L22
- https://github.com/storybookjs/storybook/blob/next/docs/writing-tests/integrations/test-runner.mdx?plain=1#L127
- https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md

### F7 - CI cost is part of the product decision

The quality strategy must remain affordable enough that gates stay enabled.
GitHub Actions billing docs distinguish public/free minutes, private quotas and
self-hosted runners. FMX should keep the PR hot path portable and simple, and
move expensive nightly/release work to scheduled local/self-hosted capacity
only when Nico accepts the runner compatibility, isolation, maintenance and
security posture.

Source:

- https://docs.github.com/en/actions/concepts/billing-and-usage#about-billing-for-github-actions

## Ratified decision packet

The full options are in
[[../40-Execution/fmx-177-test-strategy-decision-queue-2026-06-14]]. The
accepted packet is:

- D1=A: tiered 16-layer strategy of record, not every layer per PR.
- D2=A: Vitest projects + Playwright E2E split.
- D3=A: deterministic property-test replay evidence.
- D4=A: scoped mutation testing, nightly/release first.
- D5=A: one base coverage threshold of record, 85/85/85/75 per-file for
  meaningful first-party product logic after code phase starts, with explicit
  baseline exceptions only during bootstrap and stronger domain gates layered
  on top.
- D6=A-custom: portable GitHub-hosted path plus future local `xAi` runner
  capability. `xAi` means Nico's own local stack, not xAI/Grok; it is inactive
  until a later compatibility, isolation, secret, maintenance and cost gate.

The second Perplexity pass also surfaced follow-up topics that stay outside
FMX-177: deterministic simulation replay harness and soak/calibration metrics,
save-forward compatibility, PWA storage/offline/mobile degradation, release
rollback and content-validation QA.

## Supersession handling

[[pre-mortem/PM-2026-05-20-16-test-strategy-depth]] remains useful historical
research. It is superseded as the source of current instructions because it
names stale tool versions and dead ADR targets (`ADR-0040`). FMX-177 moves the
active decision surface to:

- accepted [[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]];
- current [[../40-Quality/test-strategy]];
- decision record
  [[../40-Execution/fmx-177-test-strategy-decision-queue-2026-06-14]].

## Related

- [[raw-perplexity/raw-test-strategy-adr-2026-06-14]]
- [[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
- [[../40-Quality/test-strategy]]
- [[../40-Execution/fmx-177-test-strategy-decision-queue-2026-06-14]]
- [[../10-Architecture/10-Quality]]
- [[../30-Implementation/ci-and-review-process]]
