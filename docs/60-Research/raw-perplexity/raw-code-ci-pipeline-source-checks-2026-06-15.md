---
title: Raw code-CI pipeline source checks
status: raw
tags: [research, raw, source-check, ci, github-actions, nx, pnpm, vitest, playwright, fast-check, stryker, lighthouse, accessibility, sbom, determinism, fmx-175]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-175
related:
  - [[../code-ci-pipeline-2026-06-15]]
  - [[raw-code-ci-pipeline-2026-06-15]]
  - [[../../30-Implementation/ci-and-review-process]]
  - [[../../40-Quality/test-strategy]]
  - [[../../40-Execution/fmx-175-code-ci-pipeline-decision-queue-2026-06-15]]
---

# Raw code-CI pipeline source checks

This note preserves the official/primary checks used to turn the Perplexity
discovery pass into canonical FMX-175 wording.

## Official / primary source checks

| Source family | Source | FMX-175 implication |
|---|---|---|
| GitHub branch protection | [GitHub REST branch protection - required status checks](https://docs.github.com/en/rest/branches/branch-protection?apiVersion=2026-03-10#update-status-check-protection) | Required checks are named contexts/checks and updating them is an admin/owner operation. FMX should not list nonexistent code contexts as required. |
| GitHub runner hardening | [GitHub Actions secure use - self-hosted runner hardening](https://docs.github.com/en/actions/reference/security/secure-use#hardening-for-self-hosted-runners) | Keep the PR path GitHub-hosted/portable until any local/self-hosted runner has a separate isolation, secret-exposure and maintenance proof gate. |
| pnpm workspaces | [pnpm workspaces](https://pnpm.io/workspaces) | A real workspace requires `pnpm-workspace.yaml`; workspace package linking should use explicit workspace behavior once code phase starts. |
| pnpm CI install | [pnpm install](https://pnpm.io/cli/install) | `--frozen-lockfile` is true by default in CI when a lockfile exists. Code-phase CI should rely on lockfile consistency, not floating installs. |
| pnpm recursive | [pnpm recursive](https://pnpm.io/cli/recursive) | Recursive workspace commands can run across projects, but FMX keeps root scripts as the public human/CI entrypoints and lets Nx own graph-aware orchestration. |
| Nx CI | Context7: `/websites/nx_dev` for Nx setup CI, affected tasks and run-many | Official Nx docs show `nx affected` for PR-impact scope, full git history / `nx-set-shas` for CI and `run-many`/affected targets for task orchestration. |
| Vitest | Context7: `/vitest-dev/vitest/v4.1.6` | Vitest projects support separate node/browser/test surfaces; coverage thresholds and Browser Mode/provider configuration belong in the future code scaffold, not docs phase. |
| Playwright | Context7: `/microsoft/playwright/v1.58.2` | Official Playwright CI docs support retries on CI, traces on first retry, controlled workers, sharding and report artifacts. FMX keeps Playwright as `e2e` smoke on the PR path and broader matrices later. |
| fast-check | [fast-check test reports](https://github.com/dubzzz/fast-check/blob/main/website/docs/tutorials/quick-start/read-test-reports.md?plain=1#L6) | fast-check failures include seed, path and counterexample data that can be replayed; FMX should preserve these as property evidence. |
| StrykerJS | [StrykerJS incremental mode](https://github.com/stryker-mutator/stryker-js/blob/master/docs/incremental.md?plain=1#L8) | Incremental mutation can reduce cost, but a dry run remains required. Mutation stays scheduled/release first unless a future baseline proves PR suitability. |
| Storybook a11y | [Storybook accessibility testing in CI](https://github.com/storybookjs/storybook/blob/next/docs/writing-tests/accessibility-testing.mdx?plain=1#L189) | Storybook a11y can run in CI, but it must be explicitly configured to error. Treat it as future evidence once Storybook exists. |
| Lighthouse CI | [Lighthouse CI configuration](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md) | LHCI supports config files, `autorun`, assertions and `numberOfRuns` (default 3). FMX can use Lighthouse as smoke/reporting first, not an immediate core required context. |
| SBOM | [CycloneDX cdxgen BOM pipeline](https://github.com/CycloneDX/cdxgen/blob/master/docs/BOM_PIPELINE.md?plain=1#L19) | cdxgen can produce CycloneDX JSON from source/container/archive inputs. Security/SBOM evidence belongs under the future `security` gate. |
| Simulation determinism | [Chance et al., game-engine determinism for simulation verification](https://arxiv.org/abs/2104.06262) | Deterministic simulation tests become trustworthy when repeated runs are controlled and replayable. This supports FMX's replay/golden-seed/soak quality ladder. |

## Source quality notes

- The official tool docs support the packaging rule: define stable check
  contexts only where real scripts and workflows exist.
- The strongest game/simulation source for this beat is not a public football
  manager CI config. It is the broader simulation determinism evidence plus
  FMX's accepted [[../../40-Quality/test-strategy]] / ADR-0118 quality ladder.
- Perplexity blog/video links were not copied into canonical guidance because
  the official docs above cover the actionable CI mechanics.
- Version observations are deliberately not pinned here. The future scaffold
  PR must re-check current stable package versions before adding dependencies.

## Related

- [[../code-ci-pipeline-2026-06-15]]
- [[raw-code-ci-pipeline-2026-06-15]]
- [[../../30-Implementation/ci-and-review-process]]
- [[../../40-Quality/test-strategy]]
- [[../../40-Execution/fmx-175-code-ci-pipeline-decision-queue-2026-06-15]]
