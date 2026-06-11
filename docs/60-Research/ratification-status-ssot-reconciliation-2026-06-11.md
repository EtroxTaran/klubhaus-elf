---
title: Ratification-status SSOT reconciliation — best practices (FMX-143)
status: current
tags: [research, governance, adr, status-ssot, ratification, supersession, integrity-check, fmx-143]
created: 2026-06-11
updated: 2026-06-11
type: research
binding: false
linear: FMX-143
sourceType: external
related:
  - [[raw-perplexity/raw-ratification-status-ssot-2026-06-11]]
  - [[../10-Architecture/09-Decisions/ADR-0092-vault-governance-status-ssot-and-reference-integrity-sweep]]
  - [[../90-Meta/vault-governance]]
  - [[../40-Execution/decision-queue-2026-06-08-ratified]]
  - [[../40-Execution/ratification-status-inventory-2026-06-11]]
  - [[../00-Index/Open-Decisions-Dossier]]
  - [[../00-Index/Decision-Log]]
---

# Ratification-status SSOT reconciliation — best practices (FMX-143)

Grounding research for the FMX-143 sweep that pulls in-body status text, the
bounded-context-map prose, and the Open-Decisions-Dossier onto the frontmatter
SSOT after the merged 2026-06-08/09 ratification PRs (#153, #157–#161). Raw
capture: [[raw-perplexity/raw-ratification-status-ssot-2026-06-11]].

## 1. Frontmatter as SSOT — the industry-aligned choice

The cross-source consensus (MADR decision 0013, Microsoft Azure
Well-Architected ADR guidance, AWS Architecture Blog, Nygard-derived
templates) is exactly the rule [[../10-Architecture/09-Decisions/ADR-0092-vault-governance-status-ssot-and-reference-integrity-sweep|ADR-0092]]
already adopted:

- **One canonical, machine-readable status field** — YAML frontmatter (MADR:
  "use YAML front matter for meta data").
- The in-body `## Status` section is **human-readable narrative history**,
  never a second status field. When frontmatter changes, the body gets a
  **dated history line** ("Accepted on X; reaffirmed on Y after review"),
  not a competing value.
- ADRs are an **append-only log** (Microsoft): never retroactively rewrite an
  accepted record's decision text; record lifecycle changes as new dated
  notes/records.

**Applied here:** every body `## Status` that still reads `draft`/`proposed`
after the merged ratification is *stale narrative*, and the fix is the
ADR-0092 demotion mechanic — set the body status word to the frontmatter value
and append a dated history line. No decision content is touched.

## 2. Partial supersession — the amendment pattern

MADR standardizes no relationship keys; `supersedes`/`superseded_by`/
`amends` are repository conventions. For a record that replaces **only part**
of an earlier decision, the sourced best practice is **amendment by scope**:

- Keep the original ADR `accepted`.
- Add an explicit dated note in the original: *"partially superseded by
  ADR-XYZ"*, naming the exact decision element affected.
- The new ADR states the narrowed/revised rule; everything else in the
  original stands.

This vault already practices this (ADR-0095 amends ADR-0050, ADR-0097 amends
ADR-0027, ADR-0098 amends ADR-0005 — predecessors stay `accepted`).

**Applied here (HITL H1, Nico 2026-06-11):** ADR-0100 ↔ ADR-0076/0085 is
recorded on the amendment pattern. ADR-0100's own scope text says it
"supersedes **only the thread-ownership / thread-naming portions**"; flipping
ADR-0076/0085 to `superseded` wholesale would contradict the record itself.
The ledger's shorthand "0076/0085→0100" is annotated with an erratum in the
[[../40-Execution/ratification-status-inventory-2026-06-11|status inventory]]
(the ledger stays untouched as a scribe record).

## 3. Post-bulk-ratification reconciliation — sweep + standing gate

There is **no off-the-shelf ADR drift linter**; the sourced pattern for repos
like this one is:

1. **Inventory table** rebuilt from frontmatter, compared source-by-source
   (registry/decision-log, architecture map, open-decisions index), every
   mismatch classified — drift-detection style. → the
   [[../40-Execution/ratification-status-inventory-2026-06-11|FMX-143 inventory]].
2. **Single-pass scripted batch edits** on a feature branch, immediately
   re-validated until clean. → the FMX-143 reconciliation batches.
3. **Convert the checks into a permanent CI gate** so the schema cannot
   regress ("documentation fitness function": *frontmatter ⇄ body ⇄ map ⇄
   index must agree*). Custom Node validator over the vault's own metadata
   model is the recommended vehicle; generic Markdown linters can't do the
   cross-file rules. → `scripts/status-consistency-check.mjs`, wired into the
   docs-check workflow (HITL H3, Nico 2026-06-11). This also closes two known
   blind spots of `scripts/docs-check.mjs` (list-style `supersedes:` values
   invisible to its line-based parser; body status not checked at all).

## 4. Decisions this research grounds

| HITL | Decision (Nico, live 2026-06-11) | Grounding |
|---|---|---|
| H1 | ADR-0100 = partial supersession/**amendment**; ADR-0076/0085 stay `accepted` with dated partial-supersession notes | §2 (amendment-by-scope is sourced best practice; matches ADR-0100's own scope text + vault precedent 0095/0097/0098) |
| H2 | Mode-spec/system notes stay `draft`; body "approved" wording demoted to dated history; `binding: false` while draft | §1 (append-only + one truth: they were not among the 133 ratified decisions, so raising status would be self-accept) |
| H3 | Standing `status-consistency-check.mjs` + CI wiring | §3 (sweeps without standing gates regress) |
| H4 | `onboarding-and-tutorial.md` `approved` = reopen-sweep oversight → align per H2 | §1 (registry/actual drift remediation) |

## 5. Honest limitations

- Perplexity strands confirm conventions but no single authority standardizes
  partial-supersession link semantics — `amends`-style relations remain a
  repo-local convention; ours is now documented in the inventory + ADR-0092
  lineage notes.
- LLM-based "fitness function" checking of ADR semantics is an emerging
  pattern, not adopted here; the standing checker is deterministic
  string/structure validation only.
