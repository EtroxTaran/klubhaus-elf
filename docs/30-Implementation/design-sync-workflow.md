---
title: Design Sync Workflow
status: draft
tags: [implementation, design, workflow]
created: 2026-05-16
updated: 2026-05-17
type: implementation
related: [[../10-Architecture/09-Design-System]], [[../10-Architecture/09-Decisions/ADR-0010-design-system]], [[ci-and-review-process]], [[agent-workflow-pattern]]
---

# Design Sync Workflow

How design updates get from claude.ai/design into the codebase without
guesswork. Companion to [[../10-Architecture/09-Design-System]] and
[[../10-Architecture/09-Decisions/ADR-0010-design-system]].

## Why

The design is an external Claude Design export — a gzip-tar bundle at
`https://api.anthropic.com/v1/design/h/<code>`. Share links **expire and are
per-export** (a stale code returns HTTP 404), so there is no stable URL to poll;
the designer must re-export and hand over a fresh link. We snapshot every export
and diff it so an update is a *targeted patch*, not a 45-screen re-read.

## Steps

1. Designer iterates in claude.ai/design and **re-exports**, producing a fresh
   handoff URL.
2. `pnpm sync:design <fresh-url|code>` — fetches, snapshots to
   `design/handoff/<YYYY-MM-DD>/` (extracted `project/` text + `README.md` +
   `manifest.json`; raw `bundle.tar.gz` is gitignored), and writes
   `CHANGES.md` diffed against the previous snapshot.
3. Read `design/handoff/<date>/CHANGES.md` — it buckets the diff into
   token/theme, narrative/spec, screen, new, removed, plus a mapping checklist.
4. Map each delta to the layers in [[../10-Architecture/09-Design-System]]:
   tokens → `apps/web/src/styles/app.css`; atoms/composites; screens + routes;
   sample data/copy → `screens/fixtures.ts` / `locales/{de,en}.ts`.
5. Implement as a **small, dedicated PR** (TDD, per the repo gates). The sync
   script **never edits `apps/web`** — patching is deliberately manual.
6. If the architecture shifted, update
   [[../10-Architecture/09-Design-System]] (and an ADR if a decision changed).

## Dry run

`pnpm sync:design <url> --dry-run` prints the manifest and the
`git diff --stat` against the baseline and writes nothing under `design/`.

## Expired / unreachable link

`curl` fails (404/expired) → the script exits 1 with: re-export from
claude.ai/design and re-run with the fresh URL. No retry loop; no partial
snapshot is written.

## Baseline

The diff baseline is the lexicographically-greatest prior
`design/handoff/<date>/` (override with `--baseline <dir>`). The seeded
baseline is the original export (code `Q1QpCHaEa8-_ssWDnyj_Xg`). If a link is
dead, drop the export tarball at `design/handoff/<date>/bundle.tar.gz` and run
`pnpm sync:design --from-cache` to (re-)extract and diff from it.

## Phasing the remaining screens

10 of 45 screens shipped in Phase 1 (PR #13). The remaining 35 are tracked in
[[../90-Meta/github-issue-suite/issues/D-001-remaining-screens-by-phase]] and
seeded against [[../90-Meta/github-issue-suite/implementation-backlog]]. Phase
grouping needs product input (flagged in D-001).

## Safety

Zero external deps; network only via `curl` writing to a file (never piped to
a shell); no `.env*`/secret reads; no app or vault edits — honors
`.cursor/rules/99-safety.mdc`. CI syntax-checks the script in the
`cursor-smoke` job.

## Related

- [[../10-Architecture/09-Decisions/ADR-0010-design-system]] — decision this realizes
- [[../10-Architecture/09-Design-System]] — design reference it syncs into
- [[ci-and-review-process]] — small-PR landing rule · [[agent-workflow-pattern]] — workflow context
