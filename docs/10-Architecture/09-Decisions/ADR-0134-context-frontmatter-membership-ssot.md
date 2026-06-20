---
title: ADR-0134 context frontmatter as NotebookLM-export membership SSOT
status: draft
tags: [adr, architecture, docs, tooling, notebooklm, governance]
created: 2026-06-19
updated: 2026-06-19
type: adr
binding: false
supersedes:
superseded_by:
related: [[bounded-context-map]], [[ADR-0089-bounded-context-portfolio-reconciliation]], [[vault-governance]], [[Decision-Log]]
---

# ADR-0134: `context:` frontmatter as NotebookLM-export membership SSOT

## Status

draft

## Date

2026-06-19

## Context

The vault is exported per bounded context into NotebookLM bundles
(`scripts/export-notebooklm.mjs`) so each domain can be explained on its own. A
2026-06-19 audit found that bundle membership was derived purely from a heuristic
(`tags:` intersection OR a seed ADR/GD id in the basename), which produced three
classes of defect:

- **Drops** — a doc whose tag is a near-miss of the exact token (e.g. tag
  `account-recovery` vs the domain token `account`, `club-economy` vs
  `club-management`, compound `manager-legacy` vs separate `manager`/`legacy`)
  matched no domain and was silently exported nowhere.
- **Mis-routes / ambiguity** — over-broad shared tags (`compliance`, `security`,
  `gdpr`, `lifecycle`, `contract-lifecycle`) pulled docs into the wrong bundle or
  into several at once, so "this domain" was not unambiguous.
- **Granularity gap** — the script defined 23 bundles while the canonical
  portfolio is 28 bounded contexts ([[ADR-0089-bounded-context-portfolio-reconciliation]]);
  5 contexts (People/Persona & Skills, Scouting, Environment & Climate, Media
  Ecology, Community Overlay Pipeline) had no standalone bundle.

The vault is organised by artefact *type*, not by domain, and there was no
authoritative per-note statement of which context a note belongs to.

## Options Considered

- **A — Harden the heuristic in-script only:** add the 5 bundles, tag aliases and
  narrower tags. Contained, but membership stays tag-derived and therefore never
  truly unambiguous; near-miss drops keep recurring as tags drift.
- **B — Explicit `context:` frontmatter as the SSOT:** each note declares its
  owning context(s) by slug; the exporter reads that first and ignores tags/seeds
  for declared notes. Authoritative and unambiguous; costs a vault-wide backfill.
- **C — Hybrid:** `context:` only on the authoritative ADR/GD records, tags for
  the rest. Smaller backfill, but research/feature notes stay ambiguous.

## Decision

Adopt **Option B**: introduce an explicit `context:` frontmatter field as the
single source of truth for NotebookLM-export membership.

- `context:` holds one slug or a list of slugs drawn from the fixed set of 28
  bounded-context bundles defined in `scripts/export-notebooklm.mjs`
  (mirroring [[bounded-context-map]] / [[ADR-0089-bounded-context-portfolio-reconciliation]]).
- When `context:` is present it is authoritative: the note lands in exactly the
  declared bundle(s) and the tag/seed heuristic is ignored for it.
- When `context:` is absent the exporter **falls back** to the legacy tag/seed
  heuristic, so the migration is incremental and back-compatible (zero `context:`
  fields reproduces today's behaviour minus the structural fixes below).
- The bundle catalog is completed to **28** (the 5 missing contexts get dedicated
  bundles; overlapping tags are moved out of their former host bundles).
- Superseded notes (`status: superseded`) are exported into a `_historical/`
  sub-folder per bundle with a banner, never beside current content.
- An unknown `context:` slug is reported in the export `_MANIFEST.md` as an error.

This ADR ratifies the **mechanism and the contract**. The **backfill** of
`context:` across the existing vault is a separate, ratified follow-up (each note
is a boundary judgement); only a small set of audit-confirmed drops/leaks is
seeded now to validate the mechanism.

## Rationale

`context:` makes domain membership explicit, reviewable and stable against tag
drift — the only way to guarantee "complete and unambiguous" per-domain exports.
The fallback keeps the change low-risk and shippable immediately, while the
explicit field becomes more authoritative as the backfill proceeds. Keeping the
allowed slugs anchored to ADR-0089's 28-context catalog avoids inventing a second
taxonomy.

## Consequences

Positive:

- Each of the 28 contexts is standalone-explainable; audit-confirmed drops are
  fixed; superseded content can no longer masquerade as current.
- Membership is auditable per note and survives tag churn.
- CI re-export on push to `main` keeps the published bundles current (the export
  is git-ignored, so CI is the canonical latest copy).

Negative / follow-up:

- A vault-wide `context:` backfill (~hundreds of notes) is required for full
  unambiguity; until then mixed `context:`/heuristic membership coexists.
- A future `docs-check` rule should validate `context:` values against the slug
  set and (optionally) require it on accepted ADR/GD records — to be decided with
  the backfill.
- Allowed-slug list now lives in two places (script + this ADR/ADR-0089); keep in
  sync when the portfolio changes.

## Supersedes

None

## Related Docs

- [[bounded-context-map]]
- [[ADR-0089-bounded-context-portfolio-reconciliation]]
- [[vault-governance]]
- [[Decision-Log]]
