---
title: Raw local-parity Lefthook source checks
status: raw
tags: [research, raw, source-check, tooling, lefthook, pnpm, biome, local-parity, ci, fmx-176]
created: 2026-06-17
updated: 2026-06-17
type: research
binding: false
linear: FMX-176
related:
  - [[../local-parity-lefthook-2026-06-17]]
  - [[raw-local-parity-lefthook-2026-06-17]]
  - [[../../40-Execution/fmx-176-local-parity-decision-record-2026-06-17]]
  - [[../../30-Implementation/ci-and-review-process]]
  - [[../../30-Implementation/code-phase-dod-transition-contract]]
---

# Raw local-parity Lefthook source checks

## Capture metadata

- **Issue:** FMX-176
- **Date:** 2026-06-17
- **Purpose:** Validate tool versions and hook/config semantics before pinning
  a new local-parity tool.

## Sources checked

| Source | Relevant finding | FMX implication | Confidence |
|---|---|---|---|
| npm registry, `lefthook/latest`: <https://registry.npmjs.org/lefthook/latest> | Latest npm release checked during the session was `lefthook@2.1.9`. | Pin `lefthook` exactly at `2.1.9`, not a floating range. | High |
| GitHub release `evilmartians/lefthook` `v2.1.9`: <https://github.com/evilmartians/lefthook/releases/tag/v2.1.9> | Latest GitHub release checked during the session was `v2.1.9`, published 2026-05-29, non-draft and non-prerelease. | Registry and upstream release agree on the stable Lefthook pin. | High |
| Lefthook `run` docs: <https://lefthook.dev/configuration/run.html> | `run` is the command executed by a hook job and can use file templates when needed. | The docs-phase job can be a plain repo-level `pnpm docs:check`; no staged-file template is required. | High |
| Lefthook `exclude` docs: <https://lefthook.dev/configuration/exclude.html> | File filtering matters when jobs use file templates; hooks can skip when filtered files are absent. | Useful later for code-phase file-scoped jobs, but unnecessary for the current whole-vault docs check. | High |
| Lefthook `root` docs: <https://lefthook.dev/configuration/root.html> | `root` changes command working directory and can filter hook execution by path. | Not needed now because the repo has one root docs gate. Future app/package hooks may use it after workspace bootstrap. | High |
| pnpm `approve-builds` docs: <https://pnpm.io/cli/approve-builds> | `pnpm approve-builds` approves dependencies for running scripts and writes allow/deny metadata. | Lefthook's install script must be explicitly allowed so installs can build the hook binary/wrapper. | High |
| pnpm package settings docs: <https://pnpm.io/package_json#pnpmonlybuiltdependencies> | pnpm v11 no longer reads these settings from the `pnpm` field in `package.json`; they must live in `pnpm-workspace.yaml`. | Commit a minimal root `pnpm-workspace.yaml` with `allowBuilds.lefthook: true`. This is a pnpm policy file, not the FMX-179 app workspace scaffold. | High |
| npm registry, `@biomejs/biome/latest`: <https://registry.npmjs.org/@biomejs%2Fbiome/latest> | Latest npm release checked during the session was `@biomejs/biome@2.5.0`. | Do not pin Biome in FMX-176 because no code-style hook is approved now; re-check version before code bootstrap. | High |
| GitHub release `biomejs/biome` `@biomejs/biome@2.5.0`: <https://github.com/biomejs/biome/releases/tag/%40biomejs%2Fbiome%402.5.0> | Upstream release checked during the session matched npm and was non-draft/non-prerelease. | Confirms Biome currency knowledge, but still defers adoption to code phase. | High |
| Biome CLI reference: <https://biomejs.dev/reference/cli/> | Biome supports commands such as `check`, `--staged`, `--changed` and `--no-errors-on-unmatched`. | Future hooks can avoid unsupported-file failures, but adding Biome now would be premature because the repo has no code workspace. | High |

## Source-check conclusion

- Use `lefthook@2.1.9` exactly.
- Add only the current docs-phase parity job: `pre-push` -> `pnpm docs:check`.
- Add explicit scripts for humans/agents: `pnpm hooks:install` and
  `pnpm hooks:run:pre-push`. The manual run script should force execution and
  disable auto-install so it validates the gate even outside a real Git
  pre-push event.
- Keep `docs:status-check` manual. It is conditional on ADR/GDDR
  `status:`/`binding:` changes and should not block every push.
- Commit `pnpm-workspace.yaml` only to hold `allowBuilds.lefthook: true`; this
  does not activate app/package workspace gates.
- Defer Biome, Nx, lint-staged and code-phase hook filtering until the
  FMX-179/workspace bootstrap creates real scripts and paths.
