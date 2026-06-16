---
title: GD-0027 Hidden-Attribute Substrate Mapping (8-meta / OCEAN → labels)
status: accepted
tags: [game-design, gddr, persona, ocean, player-skills, scouting, mentoring, determinism, fmx-86, gap-g22]
created: 2026-06-05
updated: 2026-06-14
type: game-design
binding: false
related: [[README]], [[GD-0020-eos-player-skills-personas-and-people]], [[GD-0021-player-staff-development-and-decision-influence]], [[GD-0018-ai-narrative-personas-and-dialogue]], [[GD-0015-ip-clean-data]], [[GD-0006-transfers]], [[GD-0043-gameplay-calibration-ownership-and-acceptance-gate]], [[../30-Implementation/gameplay-calibration-and-soak-test-runbook]], [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]], [[../10-Architecture/09-Decisions/ADR-0064-scouting-activity-context]], [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]], [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]], [[../60-Research/hidden-attribute-reveal-owner-reconciliation-2026-06-14]], [[../60-Research/hidden-attribute-substrate-mapping-2026-06-05]]
supersedes:
superseded_by:
---

# GD-0027: Hidden-Attribute Substrate Mapping (8-meta / OCEAN → labels)

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `draft`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **History (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143; reconciled
> 2026-06-14 by FMX-154):** This record closed audit gap **G22** (FMX-86, E3 epic
> FMX-59). Decisions **D1-D4** were put to Nico live on 2026-06-05 (ask-first gate)
> and chosen **A/A/A/A**. The current `accepted` frontmatter/body status is the
> single source of truth; no separate `approved` flip remains pending. Numeric
> thresholds remain **(calibration)** and not locked. Builds on accepted GD-0020,
> ADR-0052 and ADR-0064; it specifies **derivation logic + ownership**, deferring
> the mentoring numeric model to GD-0021.

## Date

2026-06-05

## Player experience goal

A player reads a coherent personality picture — e.g. *leader · volatile · homesick* — that
**sharpens as scouting earns it** (vague at first, an estimated band next, confident later)
and **never contradicts itself** across the squad screen, scouting reports and dialogue. The
manager understands a footballer in football words, never a psychometric score, and feels
that mentoring and time genuinely move a young pro's character.

## The fixed frame (binding inputs this GDDR must obey)

- **GD-0020 (accepted, binding direction)** — "Keep 16+4+8": 8 hidden meta on 1-20
  (**Potential, Consistency, Pressure, Professionalism, Determination, Adaptability,
  Injury-Proneness, Big-Matches**); **OCEAN is internal substrate** (never shown directly);
  **football labels are the surface**. The 16+4+8 schema and "OCEAN internal" are **not
  reopened**.
- **ADR-0052 (accepted) People context** — owns the internal persona substrate, the OCEAN
  vector, the **derived football labels**, and the social/mentoring/conflict interpretation
  policies. "OCEAN … never exposed directly … without derivation." → **People is the label
  derivation owner** and the persona truth source.
- **ADR-0064 (accepted) Scouting Activity** — "Scouting gates the reveal, owners keep the
  truth"; `HiddenFlagRevealLedger` stores **reveal-state only** keyed to knowledge%, emits
  `HiddenFlagSurfaced`, **no cross-context join**. → **Scouting is the single reveal gate.**
- **GD-0006 (approved/binding)** — "Risk surfaced as **ranges, not point estimates**." →
  revealed persona is shown as **bands**, never exact substrate values.
- **GD-0021 (accepted)** — mentoring is "slow hidden-meta/tendency influence", Owner = People +
  Training/Squad facts, Consumer = Squad & Player + Training. → the **numeric** mentoring
  model lives in GD-0021, not here.
- **ADR-0030 (accepted/binding) + GD-0018** — generated prose is presentation-only; labels
  are deterministic facts the LLM may *phrase* but never *create or mutate*.
- **GD-0015 + creative-naming rule** — all surfaced labels are IP-clean, evocative-not-real.

## Decisions (D1–D4, chosen live by Nico 2026-06-05 = A/A/A/A)

| # | Decision | Chosen | Rationale |
|---|---|---|---|
| **D1** | OCEAN persistence model | **A — persist as state** | Derive OCEAN once at world-gen from hidden-meta + archetype seed, then **persist** it as authoritative save-state and **mutate in place** (mentoring/aging). Keep seed+meta for provenance. Event-sourcing + snapshot best practice: replay-safe, survives derivation-formula evolution, and is the only coherent option once the vector drifts. (vs B derive/cache only — breaks determinism on drift + formula change; vs lazy-persist-on-first-mutation — equivalent but adds per-actor state-machine complexity for a 5-float vector mutated early anyway.) |
| **D2** | Reveal-rule owner | **A — Scouting gates, People derives** | Reuse ADR-0064's `HiddenFlagRevealLedger` as the **single** confidence-gated reveal mechanism for **all** hidden persona signals (flags + labels). People owns label derivation (truth); Squad & Player presents an estimated **band** read-model. No second reveal owner = no second source of truth; consistent with ADR-0064 + GD-0006. (vs B Squad & Player owns reveal — duplicates ADR-0064's gate; vs C People owns reveal — couples persona-truth to scouting-progress, contradicts ADR-0064.) |
| **D3** | Mentoring-influence owner | **A — split: People policy + Training compute** | People owns the mentoring **relationship + eligibility + persona-fit policy**; Training owns the **development-outcome computation** (slow hidden-meta delta), consuming People's relationship facts + load. Matches ADR-0052 (People = social policy) AND GD-0021 (Training/Squad = development). Numeric model deferred to GD-0021. FMX-154 confirms this as accepted owner language; it does not reopen ADR-0052. (vs B Training fully — pulls social judgement out of People; vs C People fully — puts a development-delta compute inside the persona context.) |
| **D4** | Label model | **A — multi-label + exclusion axes** | A player carries several coexisting labels (e.g. leader + volatile + homesick), each from an orthogonal **axis** with per-axis mutual exclusion (can't be volatile AND unflappable); orthogonal **flags** coexist freely; cap ~2–3 on list views. Faithful to GD-0020's coexisting surface set + CK3/RimWorld practice; gives dialogue clean per-label hooks. (vs B hybrid 1-composite-word + tags — adds a composite layer GD-0020 doesn't define; vs C single composite only — cannot express orthogonal facets, information-lossy.) |

## Substrate recap (binding context — do not reopen)

| Layer | Content | Visibility |
|---|---|---|
| Visible attributes | 16 outfield + 4 GK (1–20) | shown (per scouting tier) |
| **Hidden meta (8)** | Potential, Consistency, Pressure, Professionalism, Determination, Adaptability, Injury-Proneness, Big-Matches (1–20) | hidden; reveal-gated as **bands** |
| **OCEAN (internal)** | Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism | **never surfaced raw** — only via derived labels |
| **Football labels** | the surface vocabulary (below) | shown; reveal-gated |

Initialisation (provenance): for **players**, OCEAN is seeded at world-gen from the hidden
meta + generation archetype; for **staff/board/journalists/fan-reps/agents**, from role
archetypes (per [[../60-Research/eos-player-staff-skills-and-personas-2026-05-28]]). After
gen, OCEAN is **persisted state** (D1).

## Derivation model — meta/OCEAN → labels (the core deliverable)

Deterministic **logic, not final numbers**. Every label is derived in People from a blend of
OCEAN dimensions and the related hidden-meta, then assigned by **axis**. Direction arrows are
binding; thresholds are **calibration**.

### Label axes (mutually exclusive within an axis — ≤1 label per axis)

| Axis | Labels (ordered) | Primary OCEAN drivers | Hidden-meta cross-check |
|---|---|---|---|
| **Leadership** | leader / influential / background | ↑Extraversion · ↑Conscientiousness · mid–↑Agreeableness · ↓/mid-Neuroticism | Determination, Pressure |
| **Temperament** | unflappable / balanced / volatile | volatile ← ↑Neuroticism · ↓Agreeableness; unflappable ← ↓Neuroticism | Consistency, Pressure |
| **Professionalism** | professional / steady / casual | ↑Conscientiousness · ↓Neuroticism | Professionalism, Determination |
| **Attachment** | settled / homesick | homesick ← ↑Neuroticism · ↓Openness · ↓Extraversion | Adaptability |
| **Openness-to-change** | adaptable / rigid | adaptable ← ↑Openness · ↓/mid-Neuroticism | Adaptability |
| **Media** | media-savvy / reserved / outspoken | savvy ← ↑Extraversion · ↑Agreeableness · ↓Neuroticism; outspoken ← ↓Agreeableness · ↑Extraversion | (Controversy/Temperament analogue) |

### Orthogonal flags (coexist freely with each other and with axis labels)

| Flag | Primary drivers |
|---|---|
| **mentor** | ↑Agreeableness · ↑Conscientiousness · ↓Neuroticism |
| **loner** | ↓Extraversion |
| **demanding** | ↑Conscientiousness · ↓/mid-Agreeableness |
| **ambitious** | ↑Conscientiousness · drive (maps to internal Ambition) |
| **loyal** | ↑Agreeableness · ↑Conscientiousness |

### Derivation rules (binding shape)

- **R-DERIVE**: each label/flag is a **pure deterministic function** of (OCEAN, hidden-meta).
  Same substrate → same labels. No RNG at derivation time (no `*Rng` sub-label).
- **R-AXIS**: at most **one** label per axis (mutual exclusion → never "volatile" + "unflappable").
  Flags are independent and may stack.
- **R-PATTERN**: assignment is **elite-bucket-first then fall-through to the neutral middle**
  (FM-style): extreme tiers claimed first, the neutral label is the default when no tier is met.
- **R-COEXIST**: orthogonal axes coexist → "leader + volatile + homesick" is valid (three
  different axes); the model exists precisely to express this.
- **R-IPCLEAN**: the surfaced vocabulary is exactly GD-0020's set (+ the tiered synonyms
  above), all IP-clean per GD-0015. Raw OCEAN/meta numbers are **never** surfaced.
- **R-CALIB**: all tier thresholds, the per-list visible-label cap (~2–3) and display priority
  are **calibration**, behind a `personaLabelModelVersion`.

## OCEAN persistence contract (D1)

```text
world-gen:   OCEAN := derive(hiddenMeta, archetypeSeed)        # once, at creation
persist:     store OCEAN as authoritative save-state           # seed + 8 meta also retained (provenance)
runtime:     mentoring / aging MUTATE the persisted OCEAN in place (D3 / GD-0021)
load:        read persisted OCEAN — NEVER re-derive from seed   # post-persist it is canonical state
versioning:  a new derive() formula applies only to newly generated actors (or an explicit
             content migration), never silently to existing saves
```

- **Determinism invariant:** same `worldSeed` → byte-identical OCEAN at gen; thereafter the
  persisted vector + the deterministic mutation stream reproduce identically on replay.
- Save-size impact is negligible (a 5-value vector per actor).

## Reveal contract (D2) — Scouting gates, People derives

```text
People    ── derives & owns the truth (OCEAN-derived labels + hidden-meta bands)
Scouting  ── owns the ONLY reveal gate: HiddenFlagRevealLedger (reveal-state only, keyed to
             knowledge%), emits HiddenFlagSurfaced as knowledge crosses a threshold (ADR-0064)
Squad&Player / UI ── presents an ESTIMATED BAND read-model that NARROWS as knowledge rises:
                     hidden  →  estimated band  →  (high knowledge) effectively known
```

- Reveal is expressed as a **query / read-model** against People's truth gated by Scouting's
  ledger — **no cross-context join** (ADR-0064 §3.1).
- Surfaced values are **bands, not point estimates** (GD-0006). A label may itself be shown
  tentatively (e.g. "*possibly volatile*") at low knowledge and firm up later.
- The five ADR-0064 hidden flags (injury-proneness, big-match temperament, professionalism,
  adaptability, ambition) and the persona **labels** use the **same** single gate — there is
  no second reveal owner.

## Mentoring ownership contract (D3) — split

```text
People    ── owns the mentoring RELATIONSHIP + eligibility + persona-fit policy
             (who can mentor whom; relationship edge + provenance; persona compatibility)
Training  ── owns the development-OUTCOME computation: the slow hidden-meta/persona delta,
             consuming People's relationship facts + training load (read-only facts, no join)
GD-0021   ── owns the NUMERIC model (weights, decay, thresholds) — deferred, not set here
```

- Drift produced by mentoring mutates the **persisted OCEAN / hidden-meta** in place (D1).
- This GDDR is `accepted`; FMX-154 confirms the boundary already ratified by ADR-0052:
  People owns mentoring relationship/policy truth, Training owns the development compute.

## Invariants (each a checkable policy)

| # | Invariant | Where enforced |
|---|---|---|
| **P1** | Labels are a **pure deterministic** derivation of (OCEAN, hidden-meta); no RNG, no `*Rng` sub-label. | People derivation fn |
| **P2** | Raw OCEAN and raw hidden-meta values are **never surfaced**; only derived labels / bands. | People read-models + UI |
| **P3** | **≤1 label per axis** (mutual exclusion); orthogonal flags may stack. | label assignment fn |
| **P4** | OCEAN is **persisted at gen and mutated in place**; load never re-derives from seed. | save/load + persona aggregate |
| **P5** | The reveal gate is **Scouting's `HiddenFlagRevealLedger` only**; People owns truth; presentation is a band read-model; **no cross-context join**. | Scouting ledger + read-model |
| **P6** | Revealed substrate is shown as **ranges, not point estimates** (GD-0006). | reveal read-model |
| **P7** | Mentoring = **People policy + Training compute**; numeric model deferred to GD-0021. | ownership boundary |
| **P8** | Label vocabulary is **IP-clean** (GD-0015) and reuses GD-0020's set. | content review |
| **P9** | Labels feed `PersonaContextCard`/dialogue as deterministic facts; **prose may phrase, never create/mutate** them (ADR-0030). | Narrative boundary |

## Acceptance-criteria mapping (FMX-86)

- [x] meta/OCEAN → label derivation specified as deterministic rules consistent with
      "Keep 16+4+8" + "OCEAN internal" → §Derivation model (P1, R-DERIVE).
- [x] OCEAN persisted-vs-derived decision recorded with rationale (resolves GD-0020 line 239)
      → D1 + §OCEAN persistence contract (P4).
- [x] Reveal-rule owner assigned with explicit Scouting-confidence reference, expressed as
      query/read-model, no cross-context join → D2 + §Reveal contract (P5, P6).
- [x] Mentoring-influence owner assigned with input contract + explicit GD-0021 deferral
      → D3 + §Mentoring ownership contract (P7).
- [x] Label vocabulary IP-clean and reuses GD-0020's set → §Derivation model (P8).
- [x] Notes it resolves G22 and keeps the ADR-0052 substrate boundary explicit; numeric items
      flagged as calibration → Status banner + §Feeds ADRs + R-CALIB.
- [x] Open questions needing Nico's decision listed → §Open / next (none blocking; D1–D4 resolved).

## Consequences

**Positive** — closes G22; one deterministic source for every "this player is a leader" claim
across squad UI / scouting / dialogue (no more three-way drift); reveal reuses the single
ADR-0064 gate (no second source of truth); persistence is replay-safe and survives formula
evolution; multi-axis labels express real footballers (leader + volatile + homesick) without
contradiction and give dialogue clean hooks; keeps the ADR-0052 substrate boundary explicit.

**Negative / constraints** — all tier thresholds + the visible-label cap are calibration debt
behind `personaLabelModelVersion`; persisting OCEAN adds a small per-actor save field and a
mutation/versioning discipline (new formulas apply only to new actors); the mentoring split
spans two contexts (People policy ↔ Training compute) — coordinated by read-only facts, no
join, but two owners to keep aligned.

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]] — provides the
  substrate boundary People uses (label derivation owner, OCEAN persistence, reveal/mentoring
  split).
- [[../10-Architecture/09-Decisions/ADR-0064-scouting-activity-context]] — confirms its
  `HiddenFlagRevealLedger` is the single reveal gate for persona labels too.

## Open / next

- **Status reconciliation:** FMX-154 confirms `accepted` as the current truth; no
  blocking status decision remains.
- **GD-0043 `people.personaLabels` calibration:** all axis/flag thresholds,
  knowledge% reveal bands per signal, the per-list visible-label cap (~2–3) +
  display priority — behind `personaLabelModelVersion`.
- **GD-0021:** the mentoring numeric model (weights/decay/thresholds) +
  staff-skill modifier formula/band tuning after FMX-152 accepted Option B.
- No blocking decisions remain (D1-D4 resolved live 2026-06-05).

## Calibration slot (FMX-141)

- Slot: `people.personaLabels`
- Parameter pack: `personaLabelModelVersion`
- Harness: T1/T2 label-distribution, reveal-band and metamorphic checks in
  [[../30-Implementation/gameplay-calibration-and-soak-test-runbook]].
- Metrics: axis thresholds, label co-occurrence, reveal confidence bands,
  visible-label cap, display priority and mentoring/personality modifier ranges.

## Related

- Research: [[../60-Research/hidden-attribute-reveal-owner-reconciliation-2026-06-14]] ·
  [[../60-Research/hidden-attribute-substrate-mapping-2026-06-05]] · raw
  [[../60-Research/raw-perplexity/raw-hidden-attribute-substrate-mapping-2026-06-05]] ·
  [[../60-Research/eos-player-staff-skills-and-personas-2026-05-28]] ·
  [[../60-Research/player-strength-presentation]]
- Game design: [[GD-0020-eos-player-skills-personas-and-people]] ·
  [[GD-0021-player-staff-development-and-decision-influence]] ·
  [[GD-0018-ai-narrative-personas-and-dialogue]] · [[GD-0015-ip-clean-data]] · [[GD-0006-transfers]]
- Decisions: [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]] ·
  [[../10-Architecture/09-Decisions/ADR-0064-scouting-activity-context]] ·
  [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]] ·
  [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
- [[README]] — Game Design Log · siblings: [[GD-0026-set-piece-coach-readiness]], [[GD-0025-in-match-controls]]
