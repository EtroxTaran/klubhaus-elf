---
title: "FMX-195 pnpm tooling currency"
status: wrapped
tags: [meta, execution, handoff, tooling, pnpm, fmx-195]
created: 2026-06-15
updated: 2026-06-15
type: handoff
binding: false
linear: FMX-195
related:
  - [[../../60-Research/pnpm-tooling-currency-2026-06-15]]
  - [[../fmx-195-pnpm-tooling-currency-decision-queue-2026-06-15]]
  - [[../../30-Implementation/code-phase-dod-transition-contract]]
---

# Handoff: FMX-195 pnpm tooling currency (2026-06-15)

## Goals

- Claim FMX-195 and close the stale pnpm 11.1.2 active pin.
- Preserve the Perplexity/source-check research and Nico's dependency-currency
  decision.
- Keep the beat narrow: no workspace, Nx or code-phase bootstrap changes.

## Completed

- Claimed FMX-195 in Linear as `In Progress`.
- Fast-forwarded `main` before creating branch
  `codex/fmx-195-pnpm-pin-current-stable`.
- Updated active pins to `pnpm@11.7.0` in `package.json` and `.mise.toml`.
- Preserved raw Perplexity findings plus source checks in the vault.
- Added synthesis and decision queue for the 11.7.0 target decision.
- Updated current process/front-door docs for the resolved active pin.
- Normalized legacy repo/project naming to `klubhaus-elf` / **Klubhaus Elf**
  across governance, Linear/GitHub setup notes, pre-mortem/legal rebrand notes,
  historical PR references and design handoff labels.
- Initial pin update validated with `node scripts/docs-check.mjs`,
  `pnpm docs:check` and `git diff --check`; naming cleanup revalidated with
  `node scripts/docs-check.mjs`, a legacy-name `rg` check and
  `git diff --check`.

## Open Tasks

- Push/open the draft PR.
- Move Linear to `In Review` after the draft PR exists and is linked.
- Future code bootstrap must re-check tool versions again before adding
  workspace dependencies.

## Decisions Made

- D1: Pin `pnpm@11.7.0`, even though npm `latest` / `latest-11` still point to
  `11.6.0`, because 11.7.0 is a published public non-prerelease artifact and
  Nico reaffirmed the newest-version rule.
- D2: Update active docs-phase pins now; do not defer the active pin merely
  because the repo is docs-only.

## Blockers

- None for FMX-195.

## Durable Notes Updated

- `package.json`
- `.mise.toml`
- [[../../60-Research/pnpm-tooling-currency-2026-06-15]]
- [[../../60-Research/raw-perplexity/raw-pnpm-tooling-currency-2026-06-15]]
- [[../../60-Research/raw-perplexity/raw-pnpm-source-checks-2026-06-15]]
- [[../fmx-195-pnpm-tooling-currency-decision-queue-2026-06-15]]
- [[../../30-Implementation/code-phase-dod-transition-contract]]
- [[../../30-Implementation/ci-and-review-process]]
- [[../../00-Index/Current-State]]
- [[../../00-Index/Research-Map]]
- [[../../00-Index/Implementation-Map]]
- [[../../60-Research/00-summary]]
- Repo/project naming references in governance, pre-mortem/legal, raw research,
  handoff and design-handoff notes.

## Promotion Needed

- None beyond this FMX-195 pin update. Broader pnpm workspace/security policy
  remains follow-up work for FMX-168 / FMX-179.
