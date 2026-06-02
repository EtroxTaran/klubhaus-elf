---
title: Handoff — FMX-27 Scouting Activity context (2026-06-02)
status: open
tags: [meta, execution, handoff, scouting, fmx-27]
created: 2026-06-02
updated: 2026-06-02
type: handoff
binding: false
related:
  - [[../../60-Research/scouting-activity-bounded-context-2026-06-02]]
  - [[../../60-Research/raw-perplexity/raw-scouting-activity-bounded-context-2026-06-02]]
  - [[../../10-Architecture/09-Decisions/ADR-0064-scouting-activity-context]]
  - [[../../50-Game-Design/scouting-and-recruitment]]
  - [[../../00-Index/Current-State]]
  - [[../../00-Index/Decision-Log]]
---

# Handoff: FMX-27 Scouting Activity context (2026-06-02)

## Linear

- Issue: **FMX-27** — Recherchiere Scouting & Recruitment Ownership (Sub-Modul
  Transfer vs eigener Kontext). Child of FMX-24; upstream FMX-23 / ADR-0052.

## Done this session

- Synced `main` (FMX-52 economy capstone merged, PR #113), branched
  `fmx-27-recherchiere-scouting-recruitment-ownership-sub-modul`.
- Phase 1 vault grounding: confirmed scout *activity* is genuinely unowned;
  Transfer only consumes scout output, People (ADR-0052) owns only scout
  identity, and `bounded-context-map.md` §3.1 (Impact-Lens) forbids the
  Transfer-internal-join that Option A would require.
- Phase 2 research: 3 mandated Perplexity queries (genre / DDD / real-world) +
  FMX-18 tooling-currency lookup (XState v5.20.1). Archived raw.
- Phase 3 synthesis: `scouting-activity-bounded-context-2026-06-02.md`
  (Question/Summary/Findings F1–F5 with sources + confidence/Inputs/Future-scope;
  six-of-six DDD scorecard).
- Phase 4 options + HITL: presented A/B/C + 3 scope questions to Nico with
  recommendations; **Nico confirmed all four** (2026-06-02):
  1. Ownership = **Option C** (own Scouting context, 20th BC).
  2. Opposition/match-prep scouting = **recruitment-only + reserved
     `OppositionScoutingRequested` hook**.
  3. Youth boundary = **Scouting discovers → Youth Academy intakes**
     (`ExternalYouthProspectIdentified`).
  4. Hidden flags = **Scouting gates the confidence-based reveal; People / Squad
     keep the truth**.
- Phase 5 outputs: new draft **ADR-0064** (`proposed` / `binding: false`) with
  options, recommendation, decision (owns / does-not-own), public-contract
  direction, determinism+storage rules, consequences and an order-tolerant
  **§Map patch proposal** (not applied). Amended GDDR
  `scouting-and-recruitment.md` with a new **§0 Activity ownership**. Anchored
  Current-State banner + Decision-Log row.

## Open / next step

1. **Nico ratify decision on ADR-0064** (Option C). If accepted → a separate
   **apply-PR** flips ADR-0064 to `accepted` / `binding: true` and applies the
   §Map patch to `bounded-context-map.md` (19 → 20 contexts; renumber prose,
   add `scouting/` source folder, §2 Mermaid `Scout` node + edges, §3.1
   clarifying note). Mirrors the FMX-35 / FMX-36-style apply-PRs.
2. **Order-tolerance:** if ADR-0059 (Community Overlay) and/or ADR-0060 (Youth
   Academy) ratify first, the apply-PR renumbers Scouting to 21st/22nd and the
   `ExternalYouthProspectIdentified` consumer (Youth Academy) becomes live.
3. **Remaining FMX-24 gap ticket:** FMX-31 (Media / Press / Narrative-Content
   ownership) is the last unstarted child of the wave (Medium).

## Blockers

- None blocking. ADR-0064 stays `proposed` pending Nico ratify (expected gate,
  not a blocker). People (ADR-0052) + Youth Academy (ADR-0060) are still
  draft/proposed — Scouting stubs scout identity from its assignment roster and
  emits the youth-handoff event unconsumed until they ratify (documented in
  ADR-0064 §Consequences).

## Changed vault paths

- `docs/60-Research/raw-perplexity/raw-scouting-activity-bounded-context-2026-06-02.md` (new)
- `docs/60-Research/scouting-activity-bounded-context-2026-06-02.md` (new)
- `docs/10-Architecture/09-Decisions/ADR-0064-scouting-activity-context.md` (new)
- `docs/50-Game-Design/scouting-and-recruitment.md` (amended — §0 + frontmatter)
- `docs/00-Index/Current-State.md` (FMX-27 banner)
- `docs/00-Index/Decision-Log.md` (ADR-0064 row)
- `docs/40-Execution/session-handoffs/2026-06-02-fmx-27-scouting-activity-context.md` (this note)

## Needs promotion

- On ratify: ADR-0064 → `accepted` / `binding: true`; `bounded-context-map.md`
  apply-PR; Decision-Log row status `proposed → accepted`; Current-State banner
  updated to "ratified"; `scouting-and-recruitment.md` §0 note can drop the
  "proposed" qualifier.
- FSM-library binding (XState v5 vs in-house deterministic FSM) → record at
  implementation phase, re-verifying currency.
