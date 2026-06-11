---
title: "ADR-0048: Design-System Update & Migration Path"
status: accepted
tags: [adr, architecture, design, process, migration]
created: 2026-05-27
updated: 2026-06-11
type: adr
binding: false
supersedes:
superseded_by:
amends: [[ADR-0010-design-system]]
related: [[ADR-0010-design-system]], [[../09-Design-System]], [[../../30-Implementation/design-sync-workflow]], [[ADR-0047-babylon-3d-presentation-engine]], [[../../00-Index/Decision-Log]]
---

# ADR-0048: Design-System Update & Migration Path

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `draft`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

## Date

2026-05-27

## Context

The design is an external claude.ai/design export and will receive **recurring updates**
over the project's life (and across a growing, multi-lead team). We need a clear,
repeatable migration path so updates flow in **without churn or conflicting versions** —
not an ad-hoc 45-screen re-read each time. The tooling already snapshots + diffs each
export (`scripts/design-sync.mjs`, [[../../30-Implementation/design-sync-workflow]]); this
ADR fixes the *policy* around it.

## Options Considered

- **Update flow:** ad-hoc re-read/eyeball vs **versioned, diff-driven sync** (snapshots +
  `CHANGES.md`).
- **Tokens:** duplicated per consumer vs **one canonical token source** that wiki + app derive from.
- **Breaking changes:** silent overwrite vs **supersede discipline** (banner + migration note).

## Decision

1. **Token single source of truth.** The design tokens are canonicalised once
   ([[../09-Design-System]] §2 + the export's `tailwind.config.ts`); the **Quartz wiki
   theme and the future app both derive from them**. A token change is made in one place
   and propagates everywhere — values are never hand-copied.
2. **Versioned lineage.** Every export is a dated snapshot `design/handoff/<date>/` +
   `manifest.json` (`code` / `sha256` / `fetchedAt` / `baseline`) → a traceable
   design-version history. Old snapshots are history; never edited.
3. **Diff-driven, sync-only.** `pnpm sync:design <fresh-url>` writes the snapshot +
   `CHANGES.md`; that diff is the mapping checklist. **Never reimplement a design by eye.**
   Expired link → re-export (per the workflow doc); `--from-cache` for a dropped tarball.
4. **One current truth.** [[../09-Design-System]] is the only current spec; **breaking
   changes follow the vault supersede discipline** (banner + migration note, not silent
   overwrite).
5. **Docs-phase target now:** deltas map to the **design-system doc + the Quartz wiki
   theme**; component/screen mapping resumes when the app returns.
6. **Each update = one Linear issue + PR** (`Closes FMX-<n>`) → auto-merges on green;
   tooling stays a portable repo script (no vendor lock-in). Same flow with multiple leads.

Operational how-to: [[../../30-Implementation/design-sync-workflow]] (now `current`).

## Rationale

Snapshots + diffs turn each update into a small targeted patch with full lineage; a single
token source means a refreshed export re-themes the wiki (and later the app) without manual
re-painting; supersede discipline keeps history honest when the design changes direction.
Amends [[ADR-0010-design-system]] (which set "sync, never copy") with the recurring-update
policy + token single-source.

## Consequences

Positive:

- Recurring design updates are low-effort, traceable, and never produce conflicting versions.
- Wiki theme and future app stay in lockstep with the canonical tokens.
- Scales unchanged to a multi-lead team (issue + PR + auto-merge per update).

Negative:

- Requires keeping the canonical token source authoritative (no drive-by hex edits).
- A token artifact (e.g. `design/tokens.*`) may be wanted later so wiki + app consume the
  exact same file rather than a documented table — deferred until the app returns.

## Supersedes

None. Amends [[ADR-0010-design-system]].

## Related Docs

- [[ADR-0010-design-system]] · [[../09-Design-System]] · [[../../30-Implementation/design-sync-workflow]]
- [[ADR-0047-babylon-3d-presentation-engine]]
