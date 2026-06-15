---
title: Raw test strategy ADR research
status: raw
tags: [research, raw, perplexity, source-check, testing, quality, vitest, playwright, fast-check, stryker, lighthouse, accessibility, sbom, fmx-177]
created: 2026-06-14
updated: 2026-06-15
type: research
binding: false
linear: FMX-177
related:
  - [[../test-strategy-adr-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
  - [[../../40-Quality/test-strategy]]
  - [[../../40-Execution/fmx-177-test-strategy-decision-queue-2026-06-14]]
---

# Raw test strategy ADR research

## Prompt

Research a current 2026 TypeScript/PWA/game-simulation test strategy for
Football Manager X. Compare real-world engineering practice and other games /
simulation-heavy products for:

1. Vitest browser/component testing versus Playwright-heavy testing;
2. Playwright E2E, mobile/offline and cross-browser coverage;
3. fast-check property testing, deterministic seeds and replayable
   counterexamples;
4. Stryker mutation testing scope, thresholds and cadence;
5. golden replay, save-forward-compatibility, long soak and calibration tests
   for deterministic simulations;
6. accessibility, visual, performance, security/SBOM and CI-cost gates;
7. what should be per-PR, nightly, release-only or manual.

Preserve options and produce decision questions for Nico. Do not make the ADR
accepted without HITL approval.

## Perplexity capture

Perplexity's recommendation was a tiered "16-layer" strategy, but with gates
split by risk and cost instead of running every expensive check per PR.

Directional findings:

- Use **Vitest projects** for fast unit/domain tests and selective browser
  component tests. Browser/component tests should exercise real browser APIs
  only where jsdom/happy-dom mocks would hide risk.
- Keep **Playwright Test** for route/user journeys, offline/PWA smoke,
  cross-browser smoke, a11y integration, install-ish manifest checks where
  available, and visual/performance harnesses. Do not turn Playwright into the
  only test runner for pure domain code.
- Use **fast-check** for match-engine invariants, save parsers/migrations,
  lineup/tactic generators, transfer/economy guards and other input-space
  surfaces. Every failure must print enough seed/path/counterexample metadata
  to replay it locally.
- Use **Stryker** only on high-value deterministic domain surfaces at first:
  match engine, save parser/migration, settlement/accounting, policy/eligibility
  rules and critical validators. Running mutation testing over UI glue per PR
  is too slow and noisy.
- Deterministic simulation needs multiple layers beyond ordinary coverage:
  PR smoke seeds, nightly larger seed sets, release deep seed sets, byte-stable
  golden replays, save-forward-compatibility matrices and 50-year soak /
  calibration envelopes.
- Storybook/visual checks are useful for the design-system showcase, but
  expensive/flaky visual diffs should be curated and not used as blanket
  snapshots over every story from day one.
- Accessibility checks should combine automated axe/Lighthouse gates with
  manual keyboard/focus/reduced-motion checks, because automated tools do not
  find every WCAG issue.
- CI cost should be managed as a product constraint: fast PR gates on
  GitHub-hosted runners, heavier nightly/release checks on scheduled runners,
  and self-hosted runners only after the team accepts the maintenance and
  security burden.

Perplexity also surfaced weaker blog/vendor links. They are kept as discovery
input only. The canonical evidence below uses official or primary
documentation.

## 2026-06-15 source-check addendum

Nico accepted D1-D4=A, D5=A and D6=A-custom on 2026-06-15. The second
Perplexity pass also surfaced useful adjacent quality work: deterministic
simulation replay harness, soak/calibration metrics, save-forward
compatibility, PWA storage/offline/mobile degradation, release rollback and
content-validation QA. Nico chose to track those as follow-up gaps, not fold
them into ADR-0118.

D6 clarification: `xAi` means Nico's own local AI-server stack, not xAI/Grok.
ADR-0118 preserves CI portability for that future runner path, but does not
activate it. Activation needs a later compatibility, isolation, secret,
maintenance, failure-triage and cost gate.

Weak public game/blog links remain discovery-only input. The canonical evidence
for this packet is still the official/primary source-check set below.

## npm latest checks

Initial checks used `pnpm view <pkg> version` on 2026-06-14 after a transient
DNS (`EAI_AGAIN`) retry. Refreshed on 2026-06-15 with npm registry `/latest`
metadata via approved `curl`.

| Package | Latest stable returned | Handling |
|---|---:|---|
| `vitest` | `4.1.9` | Current target for code-phase version check. |
| `@vitest/browser` | `4.1.9` | Current browser-mode package target. |
| `@vitest/browser-playwright` | `4.1.9` | Current Browser Mode Playwright provider package target. |
| `playwright` | `1.60.0` | Current Playwright package target. |
| `@playwright/test` | `1.60.0` | Current E2E test-runner target. |
| `fast-check` | `4.8.0` | Current property-test target. |
| `@stryker-mutator/core` | `9.6.1` | Current mutation-test target. |
| `@stryker-mutator/vitest-runner` | `9.6.1` | Current Stryker/Vitest bridge target. |
| `@axe-core/playwright` | `4.11.3` | Current Playwright axe target. |
| `lighthouse` | `13.4.0` | Current Lighthouse target. |
| `@lhci/cli` | `0.15.1` | Current Lighthouse CI target. |
| `@storybook/test-runner` | `0.24.4` | Current Storybook runner target. |
| `@cyclonedx/cdxgen` | `12.6.0` | Current SBOM-generation target. |
| `@biomejs/biome` | `2.5.0` | Current formatter/lint target. |

The repo is still docs-only, so these are not pins. ADR-0118 should require a
fresh registry/doc check in the actual scaffold PR before adding dependencies.

## Official / primary source checks

### Vitest

Context7/Ref checks against official Vitest docs:

- Browser Mode is enabled through `browser.enabled: true` and a provider such
  as Playwright.
- Current Vitest 4 uses a separate `@vitest/browser-playwright` provider
  package for the Playwright provider path.
- Browser instances can be configured per browser, e.g. Chromium for the
  default component/browser suite.
- Vitest projects allow separate configurations for different test surfaces:
  node/domain, DOM/component, browser/component and property/invariant suites.
- Coverage thresholds are configurable under `coverage.thresholds`.

Source:

- https://vitest.dev/guide/browser.html

### Playwright

Context7/Ref checks against official Playwright docs:

- Playwright supports multi-project browser/device matrices.
- `--shard=N/M` splits large suites.
- Blob reports are recommended for merging reports from sharded runs.
- Traces can be collected on first retry, keeping normal PR runs cheaper while
  preserving failure evidence.

Sources:

- https://playwright.dev/docs/test-sharding
- https://playwright.dev/docs/test-reporters
- https://playwright.dev/docs/test-configuration

### fast-check

Context7/Ref checks against official fast-check docs:

- `fc.assert` accepts `seed`, `numRuns` and `verbose`.
- `@fast-check/vitest` exposes property-test integration for Vitest.
- A failure can be rerun with `{ seed, path, endOnFailure: true }`, allowing
  direct replay of the reduced counterexample.
- Advanced fuzzing docs also show `examples` plus `numRuns: 1` for explicit
  counterexample replay.

Sources:

- https://github.com/dubzzz/fast-check/blob/main/website/docs/tutorials/quick-start/read-test-reports.md?plain=1#L66
- https://github.com/dubzzz/fast-check/blob/main/website/docs/advanced/fuzzing.md?plain=1#L91

### StrykerJS

Ref checks against StrykerJS docs:

- Incremental mode is available through `--incremental` and stores state in
  `reports/stryker-incremental.json`.
- The Vitest runner uses `testRunner: "vitest"` and has runner-specific options
  such as `vitest.configFile`, `vitest.dir` and `vitest.related`.
- A dry run still executes before mutation testing, so Stryker does not replace
  normal tests.

Sources:

- https://github.com/stryker-mutator/stryker-js/blob/master/docs/incremental.md?plain=1#L8
- https://github.com/stryker-mutator/stryker-js/blob/master/docs/vitest-runner.md?plain=1#L22

### Accessibility

Playwright's official accessibility-testing docs show `@axe-core/playwright`
usage with `AxeBuilder({ page }).analyze()`, scoped `include()` checks and WCAG
tag filters such as `withTags([...])`. The same docs stress that automated
accessibility tests detect common issues but do not guarantee full WCAG
conformance.

Storybook's test-runner docs state that, with the Accessibility addon, the
test-runner can run accessibility tests alongside interaction tests.

Sources:

- https://github.com/microsoft/playwright/blob/main/docs/src/accessibility-testing-js.md?plain=1#L22
- https://github.com/storybookjs/storybook/blob/next/docs/writing-tests/integrations/test-runner.mdx?plain=1#L127

### Lighthouse / LHCI

Official Lighthouse CI docs confirm:

- `lighthouserc` configuration files are supported.
- `autorun` is the common CLI entrypoint.
- `numberOfRuns` defaults to 3.
- `budgetPath` and `performance-budget` assertions can enforce performance
  budgets.

Sources:

- https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
- https://developer.chrome.com/docs/lighthouse/overview

### SBOM / dependency evidence

CycloneDX `cdxgen` official CLI docs describe generation of CycloneDX and SPDX
BOMs, with options such as `--type`, `--output` and `--dry-run`.

Source:

- https://github.com/CycloneDX/cdxgen/blob/master/docs/CLI.md?plain=1#L1

### GitHub Actions cost and runners

GitHub Actions billing docs state that standard GitHub-hosted runners are free
for public repositories, private repositories have plan quotas/overage, and
self-hosted runners do not consume GitHub Actions minutes.

GitHub's runner hardening guidance treats GitHub-hosted runners as clean
ephemeral machines, while self-hosted runners can retain compromise across jobs
if they are not isolated. It says self-hosted runners should almost never be
used for public repositories and recommends controls such as runner groups,
network/secret restrictions and ephemeral or just-in-time runner patterns where
appropriate. This supports ADR-0118 D6: preserve the local `xAi` path, but do
not activate it until the runner security/maintenance plan is accepted.

Source:

- https://docs.github.com/en/actions/concepts/billing-and-usage#about-billing-for-github-actions
- https://docs.github.com/en/actions/reference/security/secure-use
- https://docs.github.com/en/actions/concepts/runners/github-hosted-runners
- https://docs.github.com/en/actions/concepts/runners/self-hosted-runners

## Real-world and game/simulation knowledge

The research points to four FMX-specific testing realities:

1. **Football manager games are long-horizon simulations.** Bugs often emerge
   through compounding season loops, transfer/economy feedback or save
   migration, not just single-page interactions. FMX needs soak, calibration and
   save-forward-compatibility gates.
2. **Replay and anti-cheat surfaces are trust-critical.** A deterministic
   match engine needs byte-stable replay checks, lint guards against hidden
   entropy and property tests for invariants that example-based tests miss.
3. **PWA/mobile risk is browser/device-dependent.** Offline shell, IndexedDB,
   service-worker, low-end mobile performance and safe-area/focus behavior need
   browser automation and real-device/manual evidence at release cadence.
4. **Quality gates must respect CI economics.** Running every layer per PR
   encourages disabling gates. A tiered cadence preserves signal: PR hot path,
   nightly deep path and release audit path.

## FMX inference

ADR-0118 should not be a blanket "run all tools always" mandate. The best
shape is:

- one canonical **test strategy of record**;
- tool ownership split: Vitest for fast domain/unit/component/property where
  appropriate, Playwright for browser journeys and PWA behavior;
- deterministic simulation gates separated into smoke/nightly/release tiers;
- mutation testing scoped to high-value deterministic/domain code;
- coverage as a base quality signal, not a substitute for property/mutation /
  replay gates;
- accepted thresholds, cadence and portable runner posture through ADR-0118;
- explicit follow-up tracking before expanding the ADR into deterministic sim
  harness, save-forward, PWA degradation, rollback or content-validation
  implementation work.

## Claim confidence

| Claim | Confidence | Handling in FMX-177 |
|---|---|---|
| Vitest projects plus selective Browser Mode are a better fit than Playwright-only for FMX's mixed domain/UI stack. | High | Accepted D2. |
| Playwright should own E2E/offline/a11y/perf browser journeys rather than pure domain tests. | High | Accepted D2. |
| fast-check must preserve seed/path/counterexample evidence for deterministic replay of failures. | High | Accepted D3. |
| Stryker should start scoped to deterministic/domain risk and run nightly/release first. | Medium-high | Accepted D4. |
| 85/85/85/75 per-file can serve as a simple code-phase base threshold if paired with stronger domain gates. | Medium | Accepted D5. |
| The future local `xAi` runner path should stay portable but inactive until compatibility, isolation, secrets, maintenance and cost are proven. | Medium-high | Accepted D6 custom. |
