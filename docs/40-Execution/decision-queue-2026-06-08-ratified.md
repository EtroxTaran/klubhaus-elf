---
title: Decision-Queue — Ratification Ledger (Sweep 2026-06-08)
type: execution
status: draft
binding: false
created: 2026-06-08
related:
  - "[[decision-queue-2026-06-08]]"
  - "[[adr-re-audit-master-2026-06-08]]"
  - "[[Decision-Log]]"
  - "[[collaboration-and-decision-protocol]]"
---

# Decision-Queue — Ratification Ledger (Sweep 2026-06-08)

> [!note] Running record of Nico's planning-mode ratification sweep
> This captures **Nico's decisions** as we walk [[decision-queue-2026-06-08]] batch by
> batch. It is the scribe's record, not an authority: the formal status flips on the
> ADR/GDDR files and the [[Decision-Log]] entries are a follow-up **apply** step
> (PR, Nico's merge authority). `status: draft`, `binding: false`.

## Scope-calls (decided first — they cascade widest)

| Decision | Choice | Note |
|---|---|---|
| **GD-0037** — Offline narration tier | **B** | Deterministic template floor always present; optional on-device WebGPU small-LLM enrichment; cloud LLM when online. Keeps ADR-0030 + offline-first intact. Sets the ceiling for the Narrative/Media cluster. |
| **GD-0040** — Future Contracts/CLM extraction seam | **A** | Reserve an explicit ACL seam in Player-Contract context now; extract later. Shapes ADR-0073/0075 + GD-0006. |
| **GD-0038 / ADR-0089** — Bounded-context count | **B** | Adopt the reconciled 28-context map as the canonical count source (ADR-0089 ratify-with-amendment), but keep the count under a standing merge-review gate (GD-0038); trim candidates that always co-change. |
| **Data layer (§D / ADR-0097)** — SurrealDB seam | **A** | Postgres 18.x sole system-of-record; SurrealDB kept as a reserved, optional, non-authoritative 1.x projection behind the existing interface (ADR-0043). Re-evaluate 2.x only at production maturity + a proven graph need. (ADR-0097's schema-envelope + drop-platform-`audit_log` half stands on its own technical recommendation A.) |
| **GD-0017** — MVP scope & mode sequencing | **A** | Ratify the canonical MVP boundary as-is (Create-a-Club Roguelite first, Career later, hybrid-online; export/import + multiplayer + full-offline deferred). |
| **GD-0015** — IP-clean data generation | **A** | Community datapacks default-OFF (local/P2P only, revisit M5+); editor-typed real names via EULA/warning, local-only, never shipped/synced. Procedural + curated evocative-but-not-real seeds as the floor. |
| **GD-0004** — Tactics & formations MVP slice | **A** | Lock the recommended MVP slice (5–8 formations, 3 mentalities, 4 instructions + chemistry multiplier); exact taxonomy = FMX-52 debt. Stale binding/approved cleaned via ADR-0092. |
| **ADR-0083** — Awards / HoF | **A** | D1: pure deterministic HoF induction in MVP (no new top-level RNG) **but reserve the existing-stream sub-label seam now** so seeded voting can ship post-MVP without a refactor (keeps the seeded-variance lean open). D2: keep **D4=B** — full HoF in MVP. |
| **GD-0020** — EOS people/skills substrate | **A** | Ratify the substrate direction as-is (16+4+8, OCEAN internal, football labels) + confirm the full MVP actor-class breadth. Unblocks ADR-0052. |
| **GD-0021** — Player/staff development gate | **B** | Narrow pipeline modifiers: staff skills affect only Staff-Operations pipeline-quality read-models (Training/Scouting/Medical/Match-Day). No full staff-card catalog/UI in MVP. |
| **GD-0022** — Economy commercial impact | **A** | MVP dynamic-pricing = category pricing + bounded surcharges only; full dynamic pricing stays an explicit later decision. |
| **GD-0023** — AI club economy owner-support | **A** *(Nico override; rec. was B)* | In-fiction AI owner-support (equity injection / director soft loan) enabled for **all** owner profiles, magnitude/strings differ by archetype. Never the real-money Investor. *(Differs from the recommended regime-gated B — recorded as Nico's choice.)* |

## Individual low-confidence / fork decisions

| Decision | Choice | Note |
|---|---|---|
| **ADR-0104** — Mobile delivery (supersedes ADR-0025) | **B** | Grounding pass: ground iOS-push/EU-DMA claims to dated sources, pin Capacitor 7.x, explicit ratification; direction unchanged (responsive PWA = source of truth, thin additive Capacitor shell, no web-code fork). Re-check EU-DMA before build. |
| **ADR-0045** — Branch-naming convention | **A** | Record BOTH accepted forms — `tool/fmx-n-slug` for issue-scoped work, `tool/<thema>` for cross-cutting/meta sweeps — and state which gates apply to each. |

## Bulk-accepted (★-recommended disposition)

Per Nico's authorization, **all 118 remaining decisions are ratified on their queue ★-recommended
disposition** ([[decision-queue-2026-06-08]]): the **52 ratify-as-is** items (reopen → re-ratify
unchanged) and the remaining **ratify-with-amendment / supersede-by-new** items each on their
recommended option (e.g. ADR-0027→0097, ADR-0050→0095, ADR-0006→0094, ADR-0005→0098,
ADR-0049/0003→0096, ADR-0043→0102, ADR-0009→0103, ADR-0015→0099, ADR-0076/0085→0100).
The five co-ratification pairs are ratified as units: ADR-0012+0088, ADR-0016+0059, GD-0011+0030,
GD-0010+0024, GD-0020+0021. Consistency note: **GD-0032** HoF-induction follows the same line as
**ADR-0083** — pure deterministic in MVP **+ reserve the existing-stream sub-label seam** for later
seeded voting; D4=B (full HoF in MVP) kept.

## Carried to ratify-time (one open in-ADR item)

- **ADR-0026 HF-1 / HF-2** — two in-ADR human-decision forks the card defers to Nico at ratify
  time (not MVP-blocking). To be resolved inside ADR-0026 when its status flips; ask Claude to
  break out HF-1/HF-2 explicitly if a separate decision is wanted.

## Status

**All 133 decisions now have a ratified disposition** (13 scope-calls + 2 forks decided
interactively; 118 bulk-accepted on ★-recommended; 1 in-ADR fork carried to ratify-time).

## Apply step (next — Nico's merge authority)

The decisions above are **made** but not yet **applied** to the canonical vault. Applying means,
in one batch PR for Nico's merge:
1. Flip each ratified ADR/GDDR `status:` (draft → accepted) + reconcile body/frontmatter/banner
   per ADR-0092's status-SSOT rule.
2. Adopt the 13 new draft ADRs (0092–0104) + 4 new GDs (0037–0040); mark superseded ADRs
   `superseded_by:` (never delete).
3. Insert the new rows into [[Decision-Log]] (the ready-to-paste tables in
   [[adr-re-audit-master-2026-06-08]] §H) + the existing-row reconciliations (E-7/E-1/E-2).
4. Run ADR-0092's reference-integrity sweep (outbox 0013→0028, ADR-0010→0019 residue, retire
   "eleven contexts", `audit_log` canonicalisation).
5. Update [[Current-State]] to reflect the re-ratified portfolio.
