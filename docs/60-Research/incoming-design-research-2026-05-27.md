---
title: Incoming Design Research Triage — 2026-05-27
status: draft
tags: [research, triage, incoming, player-attributes, narrative, ai, roguelite, economy, match-engine]
created: 2026-05-27
updated: 2026-05-27
type: research
binding: false
sourceType: external
related:
  - [[raw-perplexity/raw-player-and-staff-values]]
  - [[raw-perplexity/raw-character-personality-and-dialogue]]
  - [[raw-perplexity/raw-ai-llm-usage]]
  - [[raw-perplexity/raw-roguelite-meta-progression]]
  - [[raw-perplexity/raw-club-economy-simulation]]
  - [[raw-perplexity/raw-match-engine-offline-and-disconnect]]
  - [[data-generators]]
  - [[narrative-content-pipeline]]
  - [[ai-manager-behaviour]]
  - [[late-game-systems]]
  - [[systems-design-synthesis]]
  - [[match-engine-runtime-strategy]]
  - [[offline-mvp-scope-and-sync-strategy]]
---

# Incoming Design Research Triage — 2026-05-27

## Question

Nico provided six external research reports (Perplexity-style, German source
language). This note files them into the research vault, maps each one to the
existing decision layer, and — most importantly — flags where each report
**extends**, **confirms**, or **diverges from** locked decisions, so the
divergences become explicit owner decisions instead of silent drift.

## Status & provenance

- These are **external inputs**, `status: raw`. They are **not implementation
  authority**. Per [[../90-Meta/vault-governance]], promotion of any of their
  ideas into a binding GDDR/ADR requires reconciliation with the locked
  knowledge base **plus an explicit owner decision** — it does not happen by
  being filed here.
- Lossless verbatim copies live in `60-Research/raw-perplexity/` (the
  established lossless-input location). This note is the synthesis/triage layer
  above them.
- Causal chain reminder: `research (60-Research) → game design (50-Game-Design)
  → architecture (ADRs) → implementation`. These reports sit at the very left
  of that chain.
- IP boundary: the raw reports quote competitor products and real club / league
  / player names for analysis only. Any promotion respects
  [[ip-and-licensing]] and
  [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]] (no real
  Bundesliga/EPL club, logo, or player names in shipped content).

## Document index

| # | Report (raw copy) | Primary vault target(s) | Verdict |
|---|---|---|---|
| 1 | [[raw-perplexity/raw-player-and-staff-values]] | [[data-generators]], [[player-strength-presentation]], [[systemic-events-player-development-venue-ops]] | Extends + **1 divergence** |
| 2 | [[raw-perplexity/raw-character-personality-and-dialogue]] | [[narrative-content-pipeline]], [[ai-manager-behaviour]] | Extends + **1 hard divergence** |
| 3 | [[raw-perplexity/raw-ai-llm-usage]] | [[narrative-content-pipeline]], [[pre-mortem/PM-2026-05-20-11-ai-llm-dependency-and-fallbacks]] | Principle confirms + **scope divergence** |
| 4 | [[raw-perplexity/raw-roguelite-meta-progression]] | [[../50-Game-Design/mode-create-a-club-roguelite]], [[late-game-systems]], [[mode-design-research]] | Additive extension |
| 5 | [[raw-perplexity/raw-club-economy-simulation]] | [[../50-Game-Design/economy-system]], [[../50-Game-Design/GD-0008-finance-economy]], [[systems-design-synthesis]] | Additive detail |
| 6 | [[raw-perplexity/raw-match-engine-offline-and-disconnect]] | [[match-engine-runtime-strategy]], [[offline-mvp-scope-and-sync-strategy]] | Confirms + tooling mismatch |

## Per-document analysis

### 1. Player & Staff Values (Competitor analysis + "EOS" foundation)

- **Summary.** Full competitor sweep of player/staff value systems (FM, EA FC,
  eFootball/PES, Hattrick, Top Eleven, OSM): visible attributes, hidden
  attributes, CA/PA development model, mentoring, staff attribute trees, and a
  recommended own ("EOS") attribute set.
- **Maps to.** [[data-generators]] (D2 — the canonical attribute schema),
  [[systemic-events-player-development-venue-ops]] (development, mentoring,
  injuries), [[player-strength-presentation]] (Impact Lens), [[ai-manager-behaviour]]
  (staff/personality reads).
- **Extends.** Useful structured reference for hidden-attribute semantics
  (Consistency, Big-Game Temperament, Injury Proneness), the mentoring/
  personality-transfer model, and the staff coaching/scouting/medicine trees —
  all candidate refinements for the systemic-events research and any future
  staff GDDR.
- **⚠ Divergence — attribute counts.** The report recommends **20–24 visible +
  7–9 hidden** for "EOS". The project has a **locked** schema: **16 visible**
  (7 Technical + 5 Mental + 4 Physical) **+ 4 GK-only + 8 hidden meta** on a
  1–20 scale (D2 [[data-generators]], realized in
  [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]],
  [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]],
  [[../50-Game-Design/squad-and-club-structure]], [[../50-Game-Design/tactics-system]]).
  The 8-hidden count is close; the visible count is not. Treat the report's list
  as a reconciliation candidate against the locked 8 hidden meta — **do not
  expand the visible set without a superseding D2 revision + owner sign-off.**

### 2. Character personality system & player dialogue layer

- **Summary.** Proposes (a) a personality model for every actor (players,
  journalists, board, fan reps) and (b) an intent-based dialogue layer where the
  user picks an intent and an LLM phrases the line, with template fallback.
- **Maps to.** [[narrative-content-pipeline]] (D15 — voice cards, 10 senders,
  press conferences, deterministic rendering), [[ai-manager-behaviour]] (D4 — 8
  personality traits, 10 archetypes), and the 8 hidden meta player attributes.
- **Extends.** The "every actor has consistent traits" goal and the
  **intent-based** dialogue structure (intent is the simulation input, text is
  cosmetic, template fallback exists) align well with the vault's
  deterministic-narrative philosophy. The per-role personality axes are a good
  input for a future media/journalist persona GDDR.
- **⚠ Hard divergence — runtime LLM.** The report's central mechanism is a
  **runtime** LLM dialogue service. The locked MVP line is **no runtime LLM** —
  build-time authoring assistance only, never runtime (D8
  [[determinism-and-replay]], D15 [[narrative-content-pipeline]],
  [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]];
  runtime LLM is a **Future-Scope Gate** item in [[../00-Index/Documentation-V1]]).
  The intent + persona + template-fallback skeleton is implementable **without**
  an LLM today; the runtime-LLM phrasing layer stays gated.

### 3. AI / LLM usage analysis & decision matrix

- **Summary.** A use-case matrix for where LLMs help (narrative flavour text,
  press snippets, match reports) vs. where they must not be used (simulation,
  finance, match engine), with an OpenRouter cost model and an offline fallback
  architecture (calc first → result fixed → LLM phrases → template fallback).
- **Maps to.** [[narrative-content-pipeline]] (D15),
  [[pre-mortem/PM-2026-05-20-11-ai-llm-dependency-and-fallbacks]],
  [[telemetry-privacy]] (any external API call has privacy implications).
- **Confirms (principle).** The report's core discipline — **simulation is
  deterministic and LLM-free; AI only ever dresses an already-computed result;
  every call has a deterministic template fallback** — is exactly the vault's
  stance and is a clean external validation of D8/D15.
- **⚠ Scope divergence — runtime vs build-time.** The report assumes **runtime**
  OpenRouter calls in the MVP. The vault forbids runtime LLM in MVP (build-time
  authoring only). So: adopt the *matrix and fallback architecture* as research
  validation; the *runtime OpenRouter integration* is Future-Scope-Gate, not MVP.
  If/when the gate opens, the privacy (prompt-injection sanitisation, PII, EU
  data-residency), cost-cap and rate-limit notes here are good starting points.

### 4. Roguelite × Football Manager meta-progression

- **Summary.** Run/meta split (club = run asset, dies on bankruptcy; manager =
  persistent character), three meta layers (knowledge unlocks / soft carries /
  identity carries), **behaviour-based** perk unlocking (the system reads your
  *style*, not just success), legacy world-carry, and an ascension-style
  difficulty counterweight.
- **Maps to.** [[../50-Game-Design/mode-create-a-club-roguelite]] (the locked
  MVP mode), [[late-game-systems]] (D6 — legacy, Hall of Fame, cross-save
  perks), [[mode-design-research]], [[../50-Game-Design/GD-0017-mvp-scope-and-mode-sequencing]].
- **Additive extension.** Mostly compatible and enriching. The
  "meta-progression grants new options, not raw power" rule and the **SP-only /
  no-P2W, MP-normalised perks** stance both match the project posture. The
  **behaviour-based perk unlock** ("Talent Whisperer", "Possession Coach",
  "Financial Architect") is a genuinely novel candidate worth a dedicated GDDR
  discussion — reconcile against D6's existing cross-save Legacy perks (which
  are world-gen-time-only and deterministic-safe per D8) so any new perks keep
  that determinism guarantee.

### 5. Club economy simulation design document

- **Summary.** A full economy model: fixed weekly cash-drain vs. event-based
  income, matchday/season/TV/sponsor/transfer/cup revenue, cost structure,
  seasonal cashflow calendar, promotion/relegation revenue cliffs, fanbase
  multipliers, infrastructure tree, insolvency cascade, and an SP-only investor
  monetisation moment.
- **Maps to.** [[../50-Game-Design/economy-system]],
  [[../50-Game-Design/GD-0008-finance-economy]],
  [[../50-Game-Design/stadium-and-campus]], [[../50-Game-Design/sponsorship-portfolio]],
  [[../50-Game-Design/fan-ecology]], [[systems-design-synthesis]] (7-pillar club
  model).
- **Additive detail.** The strongest raw input of the six for the economy GDDRs.
  The "insolvency = game over" framing matches the Roguelite mode. The absolute
  € figures are **illustrative external references** — the project's own model
  scales multiplicatively by league tier (which this report itself recommends),
  so promote the *structure and mechanics*, not the literal numbers. The SP-only
  investor IAP is consistent with the no-P2W posture but is a monetisation
  decision (see pre-mortem 04-monetization) — keep it owner-gated.

### 6. Match engine, offline strategy & disconnect handling

- **Summary.** Where does the match compute, what happens on disconnect, how far
  can the PWA go offline. Concludes: SP fully local (Web Worker), MP
  server-authoritative, the manager-week is offline-capable with a command
  queue + background sync, Canvas 2D rendering, deterministic engine for
  replay/validation, and graceful-finish on disconnect.
- **Maps to.** [[match-engine-runtime-strategy]], [[match-engine-simulation-model]],
  [[offline-mvp-scope-and-sync-strategy]],
  [[../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]],
  [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]],
  [[../10-Architecture/09-Decisions/ADR-0024-match-renderer-abstraction]],
  [[../10-Architecture/09-Decisions/ADR-0026-match-frame-contract]].
- **Confirms.** The architectural conclusions are essentially the already-locked
  design: server-authoritative MP, local-authoritative SP, deterministic
  seed-based replay, Canvas 2D + Web Worker, offline manager-week with reject-
  on-conflict (no auto-rebase), graceful-finish. Useful external corroboration.
- **Note — transport tooling.** The report names **Colyseus / Nakama** as
  example realtime servers. That is **not** the locked stack: realtime is
  **SSE for MVP → Centrifugo at scale** behind a transport interface
  ([[../10-Architecture/09-Decisions/ADR-0023-realtime-transport]]). Read the
  tooling as illustrative, not prescriptive.

## Divergences to reconcile (owner decisions)

These are the only points that must **not** be implemented from the reports
as-is. Each needs an explicit Nico decision before any promotion.

| ID | Report | Report proposes | Locked decision | Disposition |
|---|---|---|---|---|
| D-A | #1 Player values | 20–24 visible attributes | **16 visible + 4 GK + 8 hidden meta** (D2 / ADR-0007 / ADR-0018) | Keep locked schema. Treat hidden-attribute *semantics* as reconciliation candidates only. |
| D-B | #2 Personality/dialogue | Runtime LLM dialogue service | **No runtime LLM in MVP**; build-time authoring only (D8 / D15 / ADR-0018) | Build the intent + persona + template skeleton LLM-free. Runtime phrasing = Future-Scope Gate. |
| D-C | #3 AI usage | Runtime OpenRouter calls in MVP | Same as D-B | Adopt the matrix + fallback *principle*; defer runtime integration to the gate. |
| D-D | #6 Match engine | Colyseus / Nakama transport | **SSE → Centrifugo** behind interface (ADR-0023) | Tooling illustrative only; locked transport stands. |

## Confirmations of locked decisions

Worth recording because the governance asks us to capture validation, not only
corrections:

- #3 and #6 independently confirm the **deterministic-core / LLM-free-simulation
  / template-fallback** philosophy (D8, D15) and the **server-authoritative MP +
  local SP + Canvas 2D + deterministic replay** architecture (ADR-0011 / 0020 /
  0024 / 0026, [[match-engine-runtime-strategy]]).
- #4 confirms the **no-P2W / MP-normalised, SP-only meta-progression** posture
  and the "options not raw power" meta-design rule.

## Inputs for decisions (if/when promoted)

- **Game design (GDDR candidates):** a Staff/coaching attribute GDDR and a
  Media/journalist-persona GDDR (from #1 + #2); a behaviour-based meta-perk
  extension to the Roguelite/late-game GDDRs (#4); economy mechanics enrichment
  for [[../50-Game-Design/economy-system]] / [[../50-Game-Design/GD-0008-finance-economy]] (#5).
- **Architecture (ADR candidates):** none required now — #6 corroborates
  existing ADRs; #2/#3 only become ADR-relevant if the runtime-LLM Future-Scope
  Gate opens.
- **No ADR/GDDR is created or amended by this note.** It is triage only.

## How to use this note

- Read it to understand what arrived and where it belongs.
- Do **not** implement from it or from the raw copies (`status: raw` / `draft`).
- To act on any item, open the relevant GDDR/ADR, reconcile against the locked
  knowledge base, and get owner sign-off — then this note's raw inputs can be
  cited as `Design source` in the resulting record.
## Related

- [[raw-perplexity/raw-player-and-staff-values]]
- [[raw-perplexity/raw-character-personality-and-dialogue]]
- [[raw-perplexity/raw-ai-llm-usage]]
- [[raw-perplexity/raw-roguelite-meta-progression]]
- [[raw-perplexity/raw-club-economy-simulation]]
- [[raw-perplexity/raw-match-engine-offline-and-disconnect]]
- [[data-generators]]
- [[narrative-content-pipeline]]
- [[ai-manager-behaviour]]
- [[late-game-systems]]
- [[systems-design-synthesis]]
- [[match-engine-runtime-strategy]]
- [[offline-mvp-scope-and-sync-strategy]]
