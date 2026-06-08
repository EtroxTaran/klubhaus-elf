---
title: ADR-0092 Vault governance — status/lifecycle single-source-of-truth + reference-integrity sweep
status: draft
tags: [adr, governance, vault, status-lifecycle, reference-integrity, editorial, fmx-105]
created: 2026-06-08
updated: 2026-06-08
type: adr
binding: false
supersedes: —
superseded_by:
related:
  - [[ADR-0089-bounded-context-portfolio-reconciliation]]
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0013-transactional-outbox]]
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0091-audit-security-context-definition]]
  - [[ADR-0017-observability-logging]]
  - [[ADR-0004-data-model]]
  - [[../bounded-context-map]]
  - [[../../00-Index/Decision-Log]]
  - [[../../00-Index/Open-Decisions-Dossier]]
  - [[../../90-Meta/vault-governance]]
  - [[../../90-Meta/collaboration-and-decision-protocol]]
---

# ADR-0092: Vault governance — status/lifecycle single-source-of-truth + reference-integrity sweep

## Status

draft

> **`draft` / `binding: false`.** Authored 2026-06-08. This is a **purely editorial / reference-integrity**
> ADR — it changes **no** architecture, tech, gameplay, data model, boundary or public contract. It exists
> because the open editorial debt below **cannot be fixed under the read-only / supersession-only rule by
> touching the affected files**: the fields are inconsistent *across* files (status, outbox lineage, context
> count, audit-trail position), so the fix is a governance rule + one coordinated apply-PR, not per-file
> edits. Awaiting Nico ratify; nothing here is accepted. See
> [[../../90-Meta/collaboration-and-decision-protocol]] for the gate.

## Date

2026-06-08

## Context

After the **2026-05-27 reopen** (all ADRs/GDDRs reset to `status: draft`, recorded across
[[../../00-Index/Home]], [[../../90-Meta/vault-governance]] and the index maps), a layer of cross-file
editorial drift accumulated that no single-file edit can resolve. Five concrete defects, all verified in the
current tree:

1. **Status disagrees with itself across three places.** Many ADRs carry **frontmatter `status: draft`** (post-reopen
   truth) while the **in-body `## Status` section still reads `Accepted` / `accepted`** *and* `binding: true`, and
   the [[../../00-Index/Decision-Log]] mirror still lists them as `accepted`. Verified examples:
   ADR-0019 body `Accepted (2026-05-16, gap B1…)` with frontmatter `draft` + `binding: true`; ADR-0017 body
   `Accepted (2026-05-17…)`; ADR-0011 body `Accepted (2026-05-16…)`; ADR-0007 body `Accepted (2026-05-17…)`;
   ADR-0023 / ADR-0027 / ADR-0028 / ADR-0009 / ADR-0043 body `accepted`. A reader cannot tell the **binding
   state** of a core ADR from the file. (Note: a few later ADRs — e.g. ADR-0051/0053/0061 — actually carry
   `status: accepted` in frontmatter too, so the inconsistency runs both directions and a uniform rule is needed.)

2. **ADR-0013 → ADR-0028 outbox citation rot.** [[ADR-0013-transactional-outbox]] is `superseded_by:
   ADR-0028`, yet [[ADR-0019-modular-monolith-ddd]], ADR-0014, [[ADR-0011-server-authoritative-multiplayer]] and
   [[ADR-0018-systemic-events-and-player-lifecycle]] still cite **ADR-0013** as the live outbox authority (plus the
   map §3). Live references point at a superseded decision instead of [[ADR-0028-postgres-transactional-outbox]].

3. **ADR-0018 renumber residue.** [[ADR-0018-systemic-events-and-player-lifecycle]] references **`ADR-0010`** twice
   (lines 60 and 178, "as required by ADR-0010" / "does not supersede ADR-0010") for player-lifecycle content
   that now lives in [[ADR-0019-modular-monolith-ddd]]; ADR-0010 is the **design-system** ADR. These are stale
   pre-renumber pointers.

4. **Context count says three different numbers.** [[ADR-0019-modular-monolith-ddd]] hardcodes **"eleven"**
   bounded contexts (§1, §"The eleven bounded contexts"); [[../bounded-context-map]] §1 header says
   **"Nineteen"** (and still narrates "eleven ratified … existing eleven-context map"); and
   [[ADR-0089-bounded-context-portfolio-reconciliation]] sets the canonical target at **28**. No single live count.

5. **`audit_log` sits in three conflicting positions.** [[ADR-0004-data-model]] (§"audit_log", core-tables list)
   and [[ADR-0027-postgres-data-model]] both **list an `audit_log` table**; [[ADR-0028-postgres-transactional-outbox]]
   explicitly states **"No separate `audit_log` table at MVP"** (audit derives from the outbox); and
   [[ADR-0091-audit-security-context-definition]] introduces a **separate Audit & Security log** as a context.
   Three answers to "where is the audit trail", with [[ADR-0017-observability-logging]] adjacent.

None of these is an architectural question — they are editorial truth-maintenance. They block confident
ratification downstream: a reviewer ratifying ADR-0089's count, or any outbox-touching ADR, hits contradictory
in-file state.

## Options considered

- **D1 — Status single-source-of-truth.**
  - **A. Frontmatter `status` is canonical; demote in-body `Accepted` to dated history under a standard reopen
    banner; align the Decision-Log mirror to frontmatter ← recommended.**
  - B. Per-ADR supersession/amendment note flipping each stale field individually (one note per file).
  - C. Treat the [[../../00-Index/Decision-Log]] as the sole authority and leave files as-is.
- **D2 — Reference-integrity fixes (outbox redirect 0013→0028, retire `ADR-0010` residue, retire "eleven",
    resolve `audit_log`).**
  - **A. Fold all four into the ADR-0089 ratification apply-PR, which already owns the count question, sourcing
    each fact from one canonical owner (map+0089 = count; ADR-0028 = outbox; ADR-0091 = audit context) and
    *referencing* not duplicating ← recommended.**
  - B. Separate per-field amendment ADRs/notes per affected file (heavier, more drift surface).
  - C. Leave references as-is and rely on readers to follow `superseded_by`.

## Decision

Propose, awaiting Nico: **D1 = A, D2 = A.**

### D1 — Frontmatter is the canonical status; body becomes dated history

Adopt one vault rule (to live in [[../../90-Meta/vault-governance]]): **the YAML frontmatter `status` +
`binding` fields are the single source of truth** for an ADR's lifecycle state. The in-body `## Status`
section is **narrative history**, not a second status field, and must never contradict frontmatter. This is the
MADR convention — frontmatter is the machine-readable metadata of record, the body is the decision story
(grounding: MADR ADR-0013 "Use YAML front matter for meta data", adr.github.io/madr, retrieved 2026-06-08).

Mechanics (applied by the apply-PR, **not** by this ADR, and **not** by editing superseded files):

- Frontmatter `status`/`binding` stay authoritative; where a body still reads `Accepted`/`accepted` after the
  2026-05-27 reopen, the apply-PR **prepends a standard reopen banner** and **demotes the old line to dated
  history** (e.g. `Originally accepted 2026-05-16; reopened to draft 2026-05-27 per vault reopen.`) — history is
  preserved, never deleted.
- The [[../../00-Index/Decision-Log]] status column is **re-derived from frontmatter**, so the mirror stops
  drifting. The Decision-Log already notes the reopen ("previously `accepted` was reset to `status: draft`"); D1
  makes that the mechanical rule rather than a manual reconciliation.

### D2 — One reference-integrity sweep, folded into the ADR-0089 apply-PR

ADR-0089 already owns the **count** question and already produces an apply-PR that edits the map on ratify.
Fold the remaining reference fixes into that same PR so the live tree converges in one pass, each fact sourced
from **exactly one canonical owner and referenced, not copied**:

| Defect | Canonical owner (single source) | Sweep action in the apply-PR |
|---|---|---|
| Outbox lineage | [[ADR-0028-postgres-transactional-outbox]] | Redirect the live ADR-0013 outbox citations in ADR-0019/0014/0011/0018 + map §3 to ADR-0028; ADR-0013 stays as the superseded record. |
| Renumber residue | [[ADR-0019-modular-monolith-ddd]] | Repoint ADR-0018's two `ADR-0010` references (player-lifecycle) to ADR-0019. |
| Context count | [[../bounded-context-map]] + [[ADR-0089-bounded-context-portfolio-reconciliation]] | Retire the hardcoded "eleven" in ADR-0019 and "Nineteen"/"eleven" narration in the map; the count lives in the map header (28 on 0089 ratify), referenced elsewhere — never re-stated as a literal. |
| Audit trail | [[ADR-0091-audit-security-context-definition]] (context) + [[ADR-0028-postgres-transactional-outbox]] (storage) | Pick one canonical answer for `audit_log` (see open question) and make ADR-0004/0027 reference it instead of independently listing the table. |

The supersession/read-only rule is honoured: this ADR edits nothing. The **apply-PR** is the mechanism, and it
only ever lands after Nico ratifies — at which point editing the (then-current) files is in-scope normal work,
not a violation. Superseded files (ADR-0013) are left untouched.

## Rationale

The defects are **cross-file**: status truth is split between frontmatter, body and the Decision-Log; the count
is split across three documents; the audit trail across four. A per-file amendment (D1-B / D2-B) would touch a
dozen-plus files and re-introduce the very duplication that caused the drift — every restated count/citation is a
future divergence. The single-owner-referenced model (one place states each fact, everyone else links) is the
only structurally stable fix and matches the vault's existing "one single current truth per fact" principle
([[../../90-Meta/vault-governance]]). D2-A also avoids a second apply-PR racing ADR-0089's map edit on the same
count. Confidence: **high** — this is editorial mechanics over already-verified facts, with zero architectural
surface.

## Consequences

Positive:

- Every ADR's **binding state is unambiguous** — read frontmatter, full stop; the body is dated history.
- All live **outbox / context-count / renumber** references point at current truth (ADR-0028, the map+0089,
  ADR-0019).
- **Exactly one canonical answer** for the audit trail, referenced not duplicated.
- Unblocks confident ratification of ADR-0089 and every outbox-touching ADR downstream; the Decision-Log mirror
  stops drifting because it derives from frontmatter.

Negative / caveats:

- Requires the apply-PR to be disciplined: every fix is **reference**, never a copied literal (see Risks).
- The vault gains one standing rule (frontmatter-is-canonical) that future ADRs must follow.
- Does not by itself fix any *new* drift introduced after the sweep — governance discipline must hold.

## Risks

- **A careless apply-PR could re-introduce stale counts/citations** by copying a literal instead of linking.
  Mitigation: the map header + ADR-0089 are the **sole** count source and ADR-0028 the **sole** outbox source;
  the sweep table above mandates *reference, not duplicate*. A follow-up grep gate (no literal "eleven"/"nineteen"
  context counts, no live ADR-0013 outbox citation outside ADR-0013/0028) can enforce it.
- **Audit_log resolution is still open** (below); the sweep must not silently pick one — it carries Nico's choice.

## Open questions

- **Reopen banner / frontmatter convention.** Exact wording and placement of the standard reopen banner, and
  whether `binding` is force-set to `false` for every reopened ADR or left per-ADR. (Proposed default: banner
  under `## Status`, `binding: false` until re-ratified.)
- **`audit_log` canonicalisation.** Drop the platform `audit_log` table entirely in favour of an
  outbox-derived audit projection (aligns ADR-0004/0027 to ADR-0028's "no separate table"), **or** keep
  `audit_log` as the materialised store owned by the [[ADR-0091-audit-security-context-definition]] Audit &
  Security context (aligns ADR-0028 to ADR-0091). This is the one sub-point with a faint architectural edge —
  flagged explicitly for Nico rather than decided here.

## Supersedes

—  (None. Editorial/reference-integrity only; supersedes no decision. Reconciles the in-body status text,
outbox citations, context-count literals and `audit_log` references across the related ADRs without replacing
any of them. Superseded files such as [[ADR-0013-transactional-outbox]] are left untouched.)

## Related Docs

- [[ADR-0089-bounded-context-portfolio-reconciliation]] — owns the count + the apply-PR this sweep folds into.
- [[ADR-0028-postgres-transactional-outbox]] — canonical outbox authority (supersedes ADR-0013).
- [[ADR-0013-transactional-outbox]] — superseded record; left untouched, only its stale live citations are redirected.
- [[ADR-0019-modular-monolith-ddd]] / [[ADR-0018-systemic-events-and-player-lifecycle]] — carry the "eleven" / `ADR-0010` residue.
- [[ADR-0004-data-model]] / [[ADR-0027-postgres-data-model]] / [[ADR-0091-audit-security-context-definition]] / [[ADR-0017-observability-logging]] — the `audit_log` three-position split.
- [[../bounded-context-map]] — canonical context-count owner; outbox §3 citation to redirect.
- [[../../00-Index/Decision-Log]] — status mirror to re-derive from frontmatter.
- [[../../90-Meta/vault-governance]] — home of the frontmatter-is-canonical rule.
- [[../../00-Index/Open-Decisions-Dossier]] — consolidated open-decision Q&A.
- MADR "Use YAML front matter for meta data" (adr.github.io/madr/decisions/0013, retrieved 2026-06-08) — grounding for frontmatter-as-canonical-status.
