---
title: ADR-0140 AI-review merge gate — phase-aware policy for the docs-only phase
status: proposed
tags: [adr, ci, review-gate, merge-policy, governance, fmx-269, fmx-226]
context: [audit-security]
created: 2026-07-23
updated: 2026-07-23
type: adr
binding: false
linear: [FMX-269]
supersedes:
superseded_by:
related:
  - [[ADR-0044-cicd-and-merge-policy]]
  - [[ADR-0110-code-phase-dod-transition-contract]]
  - [[ADR-0045-issue-first-worktree-workflow]]
  - [[../../30-Implementation/ci-and-review-process]]
---

# ADR-0140: AI-review merge gate — phase-aware policy for the docs-only phase

## Status

proposed

Authored `proposed` per the never-self-accept rule; changing a merge/security gate is
a HITL decision (`needs:nico-decision`). `binding: false` until Nico ratifies. Amends
the CI/merge policy of [[ADR-0044-cicd-and-merge-policy]] for the current phase.

## Context

FMX-226 made **`ai-review/consensus` the single required status check** on `main` and
stood up the bb8 `ai-review-watch` pipeline (`.ai-review/config.yaml`). That pipeline is
a full **code**-review gate: `code_review` (codex), `security`, `design` and
`ac_validation` stages are all `blocking: true`, and `consensus.fail_closed_on_missing_stage:
true`. When a reviewer cannot complete — e.g. the runner's codex/cursor credentials expire
(the same failure mode as an expired `gh` token) — a stage goes "missing", consensus fails
closed, and **trivial documentation PRs are blocked** (observed on #248, #249: `local-review`
→ failure, `consensus` never posted; `review-depth` = "routine: documentation-only diff").

But the repo is **docs-vault-only, no code** (AGENTS.md; ADR-0110 code-phase not yet
active). A code-review gate on a repo with no code adds no signal on content docs and is
brittle. The documented docs-phase gate ([[ADR-0044-cicd-and-merge-policy]] / FMX-181) is
`docs-check` + `linear-id` with auto-merge. FMX-226 layered the code gate on top ahead of
the code phase.

One nuance must be preserved: **control-plane / governance files** (`AGENTS.md`,
`CLAUDE.md`, `.cursor/**`, `.ai-review/**`, `.github/**`, `scripts/**`,
`.project-governance.yaml`) change how every agent behaves — the pipeline already flags
these "critical: protected control-plane path". They deserve **human** review, not AI
code-review.

## Decision

Make the merge gate **phase-aware**:

1. **Docs-phase hard gate = `docs-check` + `linear-id`** (deterministic, always available;
   `ai-review/docs-validation` may be added as a third required deterministic check).
   Restore this as the required status check on the `main` ruleset in place of
   `ai-review/consensus`.
2. **AI code/security/design reviewers run ADVISORY (non-blocking)** during the docs phase
   — set those stages `blocking: false` in `.ai-review/config.yaml` (or run the pipeline in
   `mode: fast`). They **re-arm to blocking at the code-phase transition** (ADR-0110), when
   real code exists for them to review.
3. **Control-plane / governance paths require Nico's explicit human approval** before merge
   (CODEOWNERS entry for those paths, or a required review). AI code-review is not a
   substitute for human judgment on governance semantics.
4. **Keep the `pipeline-bootstrap` waiver** (`.ai-review/config.yaml` `waivers`) as the
   sanctioned, audited escape hatch for genuine pipeline outages, and **fix the runner's
   codex/cursor credentials** so the advisory review is actually informative.

Green docs PRs continue to auto-merge on the deterministic gate (ADR-0044); Nico still
merges control-plane changes.

## Consequences

- The two stuck PRs (#248 control-plane, #249 routine docs) unblock once the required check
  is `docs-check` + `linear-id`; #248 additionally gets Nico's human review (rule 3).
- No more false reds on content docs; the gate no longer trains us to bypass a red check.
- The AI reviewers still run (advisory), so their signal is available without blocking.
- When code returns, the full gate re-arms via ADR-0110 — future-proof, not a permanent
  weakening.

### Enactment (owner-applied, since the gate is Nico's infra)

- **Ruleset:** set `main` required status checks to `docs-check` + `linear-id`
  (revert from `ai-review/consensus`). Repo → Rules, or `gh api`.
- **`.ai-review/config.yaml`:** set `code_review`/`security`/`design` `blocking: false`
  for the docs phase (this repo-side change is included as a proposed diff in the FMX-269 PR
  for review; apply on ratification).
- **Runner:** refresh codex/cursor-agent credentials on bb8; restart
  `ai-review-watch@klubhaus-elf.service`.
- **CODEOWNERS:** add the control-plane paths under Nico for required human review.

## Alternatives considered

- **Keep `ai-review/consensus` required for everything + just fix creds** — leaves a
  brittle code gate blocking pure docs and running code stages with no code; and trains
  routine bypass when it flakes.
- **Drop the AI gate entirely** — loses the (useful) human-review protection on
  control-plane changes like #248; rejected.
- **Bypass-merge the stuck PRs** — one-off, doesn't fix the recurring friction.
