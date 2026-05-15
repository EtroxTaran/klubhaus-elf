---
title: GitHub Issue Suite
status: draft
tags: [meta, backlog]
updated: 2026-05-15
---

# GitHub Issue Suite

This directory contains ready-to-create GitHub issue bodies for Phase 1 research, Phase 2 architecture/ADRs, and seed epics for the post-architecture implementation backlog.

Actual GitHub issue creation was not performed by this Cloud Agent because the available GitHub CLI is restricted to read-only operations and no GitHub issue MCP/write tool is available in this environment.

## How to use

1. Create labels/milestones from `labels.md`.
2. Create all `R-*` research issues first. Issues marked `parallel:safe` can be dispatched to separate agents.
3. Run `R-007` only after the research notes are complete.
4. Create/run `A-*` ADR and architecture issues after `R-007`.
5. Use `B-*` and `M*-*` issues as seed epics after Phase 2 decisions are reviewed.

## Parallel wave plan

### Wave 1 - parallel research

- R-001 Club Boss analysis
- R-002 Anstoss deep dive
- R-003 Competitor matrix
- R-005 IP/licensing/naming
- R-006 PWA offline patterns

### Wave 2 - dependent research

- R-004 Feature-gap MoSCoW after R-001/R-002/R-003
- R-007 Research summary after all research notes

### Wave 3 - ADRs

- A-001 through A-009 can mostly run in parallel after R-007, except ADR-0007 should wait for R-005 and ADR-0002/0005 should use R-006.

### Wave 4 - architecture synthesis and backlog

- A-010 expands arc42 docs after ADRs.
- B-002 creates detailed beat issues after A-010.

## Manifest

See `manifest.json` for machine-readable titles, labels, dependencies, and file paths.

## Optional import helper

Run a dry-run command preview:

```bash
node scripts/prepare-github-issues.mjs
```

After labels and milestones exist, create the issues intentionally:

```bash
node scripts/prepare-github-issues.mjs --execute
```

The Cloud Agent did not run `--execute`; this is for a human or explicitly authorized environment.
