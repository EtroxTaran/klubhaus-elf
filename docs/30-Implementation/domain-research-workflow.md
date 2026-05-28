---
title: Domain Research Workflow (Phase 1)
status: current
tags: [implementation, process, research, ddd, bounded-context]
created: 2026-05-28
updated: 2026-05-28
type: implementation
binding: true
linear: FMX-24
related: [[../10-Architecture/bounded-context-map]], [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]], [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]], [[linear-task-tracking]], [[agent-workflow-pattern]], [[../90-Meta/collaboration-and-decision-protocol]], [[../90-Meta/vault-governance]], [[../90-Meta/templates/research-note]], [[../90-Meta/templates/adr]], [[../90-Meta/templates/game-design]]
---

# Domain Research Workflow (Phase 1)

This is the **single source of truth** for how a bounded-context gap is
researched, evaluated and proposed for ratification during the current
research / analysis / architecture phase. It is bound from `FMX-24` (parent
research-wave ticket) and applies to every child research ticket that
addresses a domain not yet cleanly owned in
[[../10-Architecture/bounded-context-map]].

This note **does not** decide ownership. It defines the discipline. All
decisions go through Nico via the ask-first gate
([[../90-Meta/collaboration-and-decision-protocol]]).

## When this workflow applies

Use this workflow for any domain that fits one of these conditions:

- The domain appears in `docs/50-Game-Design/*` but is **not named** in the
  bounded-context map (e.g. Staff & Backroom, Regulations & Compliance).
- The domain is **implicitly distributed** across several existing contexts
  without a written owner (e.g. Scouting, Tactics persistence, Rivalry).
- A draft ADR proposes a new context but is **not yet ratified** (e.g.
  ADR-0051 Manager & Legacy).
- A documented sub-aggregate has its own loop / FSM / tables and may justify
  carving (e.g. Stadium/Venue Operations, Fan Ecology, Sponsorship).

Do **not** use this workflow for:

- Implementation work — Phase 1 is research-only.
- Editing `bounded-context-map.md` directly — patches land via the ADR.
- Closing already-accepted boundaries — those follow normal ADR supersession
  ([[../90-Meta/vault-governance]]).

## The six-phase beat

Every child ticket follows the same beat. No phase may be skipped.

### Phase 1 — Vault grounding

Before any external research, read everything the vault already says about
the domain.

1. `docs/10-Architecture/bounded-context-map.md` — current ratified state.
2. `docs/50-Game-Design/*` — every note that touches the domain.
3. `docs/60-Research/raw-perplexity/*` and `docs/60-Research/*` — prior
   research that may overlap.
4. Related ADRs in `docs/10-Architecture/09-Decisions/`.

Capture three lists in the research-synthesis draft:

- **Already binding** (accepted ADRs / approved GDDRs that constrain the
  decision).
- **Currently draft** (proposed ADRs / draft GDDRs the decision must respect
  or supersede).
- **Open** (questions with no written answer yet).

If the domain already lives implicitly inside another context, quote the
exact map line that hosts it.

### Phase 2 — External research (Perplexity + context7 + Ref)

Run at least **three focused Perplexity queries**, split across:

1. **Genre best-practice** — Football Manager / SI, EA FC Career, Anstoss,
   Out of the Park, FIFA Manager, comparable management sims.
2. **DDD / bounded-context best-practice** for the domain class (e.g.
   cross-cutting policy, lifecycle aggregate, content authoring).
3. **Real-world domain modelling** when the domain has a real-world analogue
   (regulations, scouting, academy operations, rivalry detection).

For every library / framework that might appear in the recommended
solution, run a `context7` and a `Ref (ref.tools)` lookup — verbindlich per
`FMX-18` (Dependency- & Tooling-Currency-Policy).

Use web search only for real-industry primary sources (FIFA TPI/TPO rules,
UEFA FFP statutes, Premier League GBE points criteria) that Perplexity may
miss or summarise inaccurately.

Archive every raw report under
`docs/60-Research/raw-perplexity/raw-<domain-slug>.md` with frontmatter
`status: raw`, `tags: [research, raw, <domain>]`, `created: <ISO date>`. Raw
notes are append-only inputs to the synthesis; nothing else cites them
directly.

### Phase 3 — Synthesis

Produce a research-synthesis note at
`docs/60-Research/<domain-slug>-bounded-context-<YYYY-MM-DD>.md` using
[[../90-Meta/templates/research-note]]. Mandatory fields:

- **Question** — the precise ownership question being answered.
- **Summary** — decision-ready one-paragraph synthesis.
- **Findings** — each with **Source** and **Confidence** (high / medium / low).
- **Inputs For Decisions** — what the ADR and GDDR draft will encode.
- **Future-scope notes** — questions deferred out of this beat.

The synthesis is what the ADR cites. The raw notes are not cited from the
ADR.

### Phase 4 — Options and recommendation (ask-first gate)

Per the ask-first gate in
[[../90-Meta/collaboration-and-decision-protocol]] and ADR-0019 §Decision,
the agent never decides. The draft ADR must contain **2–3 options**, each
with:

- **Description** — Public Contract sketch (Commands / Domain Events /
  Queries / Read Models / State Machine), storage scope, ownership rules.
- **Trade-offs** — coupling with adjacent contexts, test-isolation, service
  extractability (per ADR-0019 §5), data sovereignty, save-snapshot
  determinism.
- **Best-practice justification** — citing the synthesis findings.
- **Risks** — what each option forecloses, what it makes harder.

After the options, the ADR ends with a **clear recommendation** and the
rationale. Status stays `proposed` / `draft` and `binding: false` until Nico
ratifies.

### Phase 5 — Vault outputs (acceptance bar)

Each child ticket must produce or update these artefacts before it can move
to *In Review*:

1. **Raw research** — `docs/60-Research/raw-perplexity/raw-<slug>.md`.
2. **Synthesis** — `docs/60-Research/<slug>-bounded-context-<YYYY-MM-DD>.md`.
3. **Draft GDDR** — `docs/50-Game-Design/GD-<NNNN>-<slug>.md` (only when a
   gameplay pillar is touched; otherwise a one-line note in the synthesis
   explaining why no GDDR is needed).
4. **Draft ADR** — `docs/10-Architecture/09-Decisions/ADR-<NNNN>-<slug>.md`,
   `status: proposed` (or `draft`), `binding: false`, with the Public
   Contract sketch and storage / determinism rules from Phase 4.
5. **Map patch proposal** — a concrete diff for
   `docs/10-Architecture/bounded-context-map.md` (as a fenced patch inside
   the ADR or an appended ```diff``` block). The map itself is **not**
   modified by this ticket — the patch lands when Nico ratifies the ADR.
6. **Index anchoring** — `docs/00-Index/Current-State.md`,
   `docs/00-Index/Decision-Log.md`, optionally `docs/00-Index/Home.md`.
7. **Session handoff** —
   `docs/40-Execution/session-handoffs/<YYYY-MM-DD>-<slug>.md` naming the
   next beat (ratification date, blocking questions).

### Phase 6 — Validation and handover

- `pnpm docs:check` is green (frontmatter, wikilinks, no secrets, ADR
  registration in Decision-Log).
- All new wikilinks are bidirectional where the project convention requires
  it (see [[../90-Meta/vault-governance]]).
- The Linear ticket carries the `needs:nico-decision` label and moves to *In
  Review*.
- The session handoff names the explicit ratification ask and any
  cross-ticket dependencies (e.g. a Scouting recommendation may depend on
  the Staff & Backroom outcome).

## Ticket template

Every child research ticket uses this body structure, following the
conventions in [[linear-task-tracking]]:

```markdown
## Summary
One sentence: what the research must decide.

## Context
- Domain question (1–2 sentences): where the domain lives today, what is open.
- Vault anchors: `bounded-context-map.md`, relevant GDDRs, prior raw research.
- Related ADRs (`related: \[\[ADR-XXXX\]\]`).

## Requirements
- At least 3 Perplexity queries (see workflow Phase 2).
- context7 + Ref lookups for any library / framework in the proposed solution.
- Vault outputs per workflow Phase 5 (raw research, synthesis, GDDR draft if
  pillar, ADR draft, map patch proposal, index anchoring, handoff).
- 2–3 options with trade-offs + a clear recommendation. No autonomous decision.
- ADR stays `proposed` / `draft`, `binding: false`, until Nico ratifies.

## Acceptance Criteria
- [ ] Raw research note at `docs/60-Research/raw-perplexity/raw-<slug>.md`
      with ≥3 cited sources.
- [ ] Synthesis at `docs/60-Research/<slug>-bounded-context-<YYYY-MM-DD>.md`
      with Question / Summary / Findings / Inputs.
- [ ] Draft GDDR (if pillar-relevant) or justified note that no GDDR is needed.
- [ ] Draft ADR (`status: proposed`, `binding: false`) with Public Contract
      sketch and storage / determinism rules.
- [ ] Map patch proposal (diff or Mermaid update) attached to the ADR.
- [ ] `bounded-context-map.md` itself is **not** modified (ratification gate).
- [ ] Decision-Log + Current-State link the new notes.
- [ ] Session handoff written.
- [ ] `pnpm docs:check` green.
- [ ] Label `needs:nico-decision` set; nothing is finally accepted without Nico.
```

Labels (per [[linear-task-tracking]] §Labels): always carry one `type:` and
one `area:`. Research tickets that produce an ADR carry both `type:research`
and `type:adr`. Add `risk:legal` if IP / compliance is involved (e.g.
regulations, dataset overlays).

## Ratification rules

- The map is updated only when Nico explicitly accepts the ADR. The current
  baseline is fifteen contexts (eleven ratified 2026-05-16; Manager &
  Legacy ratified 2026-05-28 via FMX-25 + FMX-35; Staff Operations
  ratified 2026-05-28 via FMX-26 + FMX-36; Tactics ratified 2026-05-28
  via FMX-28 + FMX-37; Regulations & Compliance ratified 2026-05-28 via
  FMX-30 + FMX-39).
- Acceptance of an ADR moves it from `status: proposed` to `status:
  accepted` and `binding: true`. The map patch is applied in the same PR.
- Rejection moves the ADR to `status: rejected` with a `superseded_by` link
  or a rationale paragraph; the synthesis note remains as evidence.
- Deferral keeps the ADR `proposed` with a documented blocker and a
  follow-up ticket linked in `## Related`.

## Cross-references

- [[../10-Architecture/bounded-context-map]] — current fifteen-context baseline.
- [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]] — modular
  monolith and per-context contracts.
- [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]] —
  reference for a draft context proposal (the model child ticket).
- [[linear-task-tracking]] — Linear / GitHub conventions.
- [[agent-workflow-pattern]] — the loop every agent follows.
- [[../90-Meta/collaboration-and-decision-protocol]] — roles and ask-first gate.
- [[../90-Meta/vault-governance]] — canonical-location and supersession rules.
- [[../90-Meta/templates/research-note]] · [[../90-Meta/templates/adr]] ·
  [[../90-Meta/templates/game-design]] — templates used in Phase 5.

## Change history

- 2026-05-28 — Created from FMX-24. Captures the six-phase beat agreed
  during the 2026-05-28 domain-gap analysis. Bound from the parent ticket
  and applied to the ten children (FMX-25 → FMX-34).
