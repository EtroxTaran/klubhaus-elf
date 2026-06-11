---
title: "Raw — ADR status/lifecycle SSOT + integrity-check automation (FMX-143)"
status: raw
tags: [research, raw, perplexity, governance, adr, status-ssot, supersession, integrity-check, fmx-143]
created: 2026-06-11
updated: 2026-06-11
type: research
binding: false
linear: FMX-143
related:
  - [[../ratification-status-ssot-reconciliation-2026-06-11]]
---

# Raw capture — ADR status SSOT + drift automation (Perplexity, 2026-06-11)

Verbatim-faithful capture of the two Perplexity strands grounding the FMX-143
ratification-status reconciliation. Synthesis in
[[../ratification-status-ssot-reconciliation-2026-06-11]].

## Strand 1 — Frontmatter-as-SSOT, supersede vs amend, bulk-ratification hygiene

### Prompt (summary)

Best practices for ADR lifecycle/status management in large docs-as-code repos:
(1) machine-readable YAML frontmatter (MADR convention) as single source of truth vs
in-body `## Status` section — what do MADR / adr-tools / Nygard / AWS / Microsoft
recommend, and how to treat the body status when frontmatter is canonical?
(2) supersede vs amend discipline incl. PARTIAL supersession (amendment pattern,
link types). (3) post-bulk-ratification reconciliation of stale body text without
rewriting history.

### Key findings (verbatim-faithful)

- Strongest cross-source pattern: treat the ADR as an **append-only historical
  record**, keep **one canonical status field** if machine-readable metadata is
  used, and use in-body status text as *human-readable narrative/history*, not a
  second source of truth.
- **MADR** explicitly recommends **YAML front matter for metadata** and "plain
  Markdown everywhere" else (MADR decision 0013 "Use YAML front matter for meta
  data", adr.github.io). MADR's published metadata decision shows Status /
  Decision Maker(s) / Date in front matter; it does **not** standardize
  relationship keys (`supersedes`, `amends`, `clarifies`) — those are
  **tool- or repository-convention-specific**.
- **Microsoft (Azure Well-Architected, architect role / ADR guidance):** ADRs are
  an **append-only log**; do **not** go back and edit accepted records; if a
  decision changes, write a **new record that supersedes the original and link
  the two together**.
- **AWS (Architecture Blog, "Master ADRs — best practices"):** if an ADR
  supersedes a previous one, **document the change and link the new ADR in the
  superseded document**.
- **Partial supersession:** the most maintainable pattern is **amendment by
  scope**, not silent overwrite — keep the original ADR, add an explicit dated
  note that **only part of it is superseded** ("partially superseded by ADR-XYZ",
  naming the exact decision element affected), while the new ADR states the
  narrowed/revised rule. Preserves history without pretending the whole record
  is obsolete.
- **Bulk ratification waves:** reconcile stale body text by adding a **dated
  status-history note** (e.g. "Accepted on X; reaffirmed on Y after review;
  superseded parts documented in ADR-Z"), leaving original decision text intact.
  Front matter carries the current machine-readable status; the body keeps the
  compact narrative. Avoids two competing status sources per file.
- Nygard-derived templates keep a readable Status section as part of the
  historical narrative (Status/Context/Decision/Consequences), i.e. human-facing,
  not machine-owned.

### Sources cited by Perplexity (strand 1)

1. https://aws.amazon.com/blogs/architecture/master-architecture-decision-records-adrs-best-practices-for-effective-decision-making/
2. https://adr.github.io/madr/decisions/0013-use-yaml-front-matter-for-meta-data.html
3. https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record
4. https://ozimmer.ch/practices/2022/11/22/MADRTemplatePrimer.html
5. https://codesoapbox.dev/preserving-critical-software-knowledge-using-architectural-decision-records/
6. https://github.com/architecture-decision-record/architecture-decision-record

## Strand 2 — Automated integrity/drift checks for ADR vaults

### Prompt (summary)

Automated integrity/consistency checks for ADR repositories and docs-as-code
vaults: (1) CI lint rules/tools detecting STATUS DRIFT between records,
decision logs and architecture maps (frontmatter-vs-body mismatch, broken
supersedes/superseded_by pairs, stale "pending" banners); (2) what
log4brains / adr-tools / adr-viewer / Backstage ADR plugin / remark-lint /
markdownlint / Obsidian Linter / custom scripts offer; (3) post-bulk-change
reconciliation patterns (inventory tables, single-pass batch edits, standing
checks).

### Key findings (verbatim-faithful)

- **No widely adopted general-purpose "ADR linter"** understands status
  transitions, supersede chains and decision indexes; teams combine ADR-aware
  tools with Markdown linters plus **custom scripts in CI**.
- Strongest current pattern: *treat ADR metadata as a small domain model*
  (ID, status, date, supersedes, tags) and write a **short validator that runs
  in CI over that model**. Typical cross-file rules: no duplicate IDs; every
  `supersedes` resolves; each `superseded_by` matched; no circular chains;
  index/decision-log includes all non-draft records; frontmatter-vs-body status
  match; stale `Proposed`-banner detection.
- **adr-tools** keeps supersede chains consistent only *at change time* via
  `adr supersede`; no re-validation of manual edits. **log4brains** enforces a
  parseable frontmatter shape (site generation fails otherwise) but ships no
  drift linter. **adr-viewer / Backstage ADR plugin** surface broken links and
  malformed metadata implicitly at render/scan time (build-failure-as-CI-signal
  pattern). **remark-lint/markdownlint custom rules** fit per-file checks;
  cross-file symmetry is usually an external script. **Obsidian Linter** is a
  local normalization tool, not a CI gate.
- **"Fitness functions" derived from ADRs** (platformtoolsmith.com): extract the
  violation patterns an ADR implies, implement checks that run on each PR — the
  same model fits "ADR status must match registry and supersede graph" as a
  documentation fitness function.
- **Post-bulk-change reconciliation:** (a) **inventory tables / registries**
  rebuilt from frontmatter, compared against the human-maintained index, with a
  mismatch report (analogous to drift detection in IaC); (b) **single-pass
  scripted batch edits** on a feature branch, immediately followed by the
  validator until clean; (c) **convert the checks into permanent CI gates**
  (dedicated docs-lint/adr-validate job + branch protection) so the new schema
  cannot regress; optionally scheduled stale-decision audits.

### Sources cited by Perplexity (strand 2)

1. https://platformtoolsmith.com/blog/operationalizing-adrs-fitness-functions/
2. https://circleci.com/blog/add-linting-and-formatting-to-your-ci-cd-workflow/
3. https://github.com/bpg/terraform-provider-proxmox/issues/2773 (ADR-compliance linter pattern in the wild)
4. https://docs.gitlab.com/api/lint/
5. https://sysmansquad.com/2020/12/08/give-your-adr-a-little-boost-with-status-filter-rules-and-powershell/
