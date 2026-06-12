---
title: Open-Decisions Dossier — questions, recommendations, ratify checklist
status: current
tags: [meta, index, decisions, open-questions, dossier, fmx-105]
created: 2026-06-07
updated: 2026-06-11
type: index
binding: false
related:
  - [[Decision-Log]]
  - [[Current-State]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
  - [[../10-Architecture/09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[../10-Architecture/09-Decisions/ADR-0091-audit-security-context-definition]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../10-Architecture/09-Decisions/ADR-0059-community-overlay-pipeline-context]]
  - [[../10-Architecture/09-Decisions/ADR-0060-youth-academy-context]]
---

# Open-Decisions Dossier

> **CLOSED — all items below were decided 2026-06-08 and merged 2026-06-08/09 via PRs
> #153/#157–#161 (merge = the ratification act).** §A A1–A5, §B M1–M3, §C D1–D3 and all 15 §D
> rows were ratified on the ★-recommended disposition (13 scope-calls + 2 forks decided live);
> the carried in-ADR items **ADR-0026 HF-1/HF-2** and **ADR-0094 ICU-MF1** were resolved in
> PR #159. This note is now a **closed historical index** — the authoritative records are the
> [[../40-Execution/decision-queue-2026-06-08-ratified|ratification ledger]], [[Decision-Log]]
> and the per-ADR frontmatter (SSOT per
> [[../10-Architecture/09-Decisions/ADR-0092-vault-governance-status-ssot-and-reference-integrity-sweep|ADR-0092]]).
> Closure recorded 2026-06-11 (FMX-143,
> [[../40-Execution/ratification-status-inventory-2026-06-11|status inventory]]). New open
> decisions get new dossier/queue notes — this one is not reopened.

> **Post-dossier decisions (historical completeness, added 2026-06-11 — FMX-145 consolidated
> sub-task; the dossier stays closed).** Two decision records were authored 2026-06-08, *after*
> this dossier's 2026-06-07 snapshot, and were therefore never catalogued here:
> [[../10-Architecture/09-Decisions/ADR-0095-balanced-transfer-ledger-posting-invariant|ADR-0095]]
> (ledger posting shape, D1 A-vs-B) and
> [[../10-Architecture/09-Decisions/ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract|ADR-0101]]
> (band-collapse rule / quality-profile enum / insolvency postings). Their open D-questions were
> decided outside this dossier: **ADR-0095 D1 = A (balanced double-entry) + `binding: true`,
> two-level chart-of-accounts granularity, no save migration — Nico live 2026-06-11 (FMX-145)**;
> ADR-0101's remaining axes are tracked as **FMX-149** (collapse rule — **decided 2026-06-12:
> seeded-within-band, D2 clause binding**), **FMX-147** (quality-profile enum) and **FMX-146**
> (insolvency posting contract), with the concrete chart
> of accounts as **FMX-150**. Authoritative records: [[Decision-Log]] + per-ADR frontmatter.

One place where everything still open across the domains **was decided**. Each item below is a
crisp question with researched options and a **recommended answer** (grounded externally
2026-06-07 — Perplexity Sonar + Exa + DDD/sim literature; see the per-item research notes).
Nothing here was self-accepted: ratification happened via the 2026-06-08 sweep above.

> Reading order: §A genuinely-open decisions → §B mini ratification points →
> §C the "20th-context" reconciliation → §D ratify-only checklist. Recommendations are
> marked **→**; every recommendation below was ratified as marked.

---

## A. Genuinely-open decisions

> **All decided 2026-06-08 (#153):** A1–A5 ratified `accepted` on the recommended options
> (A1 D1/D2=A/A · A2 D1/D2=A/A · A3 D1/D2=C/A · A4 D1/D2=A/A · A5 D1/D2=A/A).

### A1 · People / Persona & Skills — [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
Research: [[../60-Research/people-persona-skills-bounded-context-2026-06-07]]

- **D1 Granularity** — A. Own bounded context (profile/relationship/scoring, not an identity
  registry) · B. Squad sub-aggregate · C. split persona/skills. **→ A.**
- **D2 MVP scope** — A. Ratify boundary+contracts now, ship thin slice (persona substrate + player
  skill profile + DialogueContextCard; rest reserved-stub) · B. Full model in MVP · C. Defer. **→ A.**

Why: the personality + relationship-graph + scoring concern fires every DDD split heuristic and
mirrors how CK2/CK3 (Opinion System), Talk-of-the-Town (Big-Five + relationship graph) and FM
(personality from hidden attributes) centralise a behaviour-driving substrate. Thin MVP unblocks
Staff Operations / Narrative / Scouting which already assume stable People queries.

### A2 · Community Overlay Pipeline — [[../10-Architecture/09-Decisions/ADR-0059-community-overlay-pipeline-context]]
Research: [[../60-Research/community-overlay-pipeline-decision-2026-06-07]]

- **D1 Owner** — A. Own bounded context (Option D) · B. Platform service · C. Identity/Offline-Sync
  sub-aggregate. **→ A.**
- **D2 MVP distribution** — A. Local-file / P2P import only (no own-backend DSA scope; FMX-54
  privacy gate) · B. Hosted marketplace in MVP. **→ A.**

Why: an ingestion pipeline with its own language/lifecycle/storage/governance and delegated
semantic validation is a real supporting context (Factorio/Paradox/Steam precedent); two binding
ADRs (0056, 0057) already name it as their orchestrator. Local-only keeps MVP out of EU-DSA
platform obligations; a hosted adapter can plug in later.

### A3 · Youth Academy — [[../10-Architecture/09-Decisions/ADR-0060-youth-academy-context]]
Research: [[../60-Research/youth-academy-context-decision-2026-06-07]]

- **D1 Owner** — C. Own bounded context (kept coarse) · A/B/D sub-aggregate of Squad/Training/Staff.
  **→ C.**
- **D2 Home-grown boundary** — A. Rules-centric: Regulations owns eligibility *interpretation*,
  Academy owns *training-history facts* (counter = derived projection) · B. Academy stores the
  home-grown boolean. **→ A.**

Why: annual-vs-weekly cadence mismatch + lifecycle independence + EPPP/NLZ separate-audited-unit +
FM/OOTP/EHM genre precedent. Keep eligibility interpretation in Regulations (rules change; meaning
drifts) — a one-line tightening of the existing `HomeGrownShareRecalculated` → Regulations-ACL contract.

### A4 · Offline Sync — [[../10-Architecture/09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]] (new)
Research: [[../60-Research/offline-sync-scope-and-conflict-strategy-2026-06-07]]

- **D1 MVP scope** — A. Thin (cache + draft + synchronous commands) behind a command-queue migration
  seam · B. Build full sync engine up front. **→ A.**
- **D2 Conflict strategy** — A. Server-authoritative re-validation + rebase (idempotency +
  expected-version + outbox canonical events; CRDT only for watch-party overlays; LWW only cosmetic)
  · B. LWW · C. OT · D. CRDT for core state. **→ A.**

Why: a rules-strict deterministic event-sourced game = command-sourcing + server-replay (Replicache
model), not CRDT/OT document merge. Consistent with ADR-0008's Dexie draft lifecycle + expected-version
seam. Mandated seam keeps the full engine additive.

### A5 · Audit & Security — [[../10-Architecture/09-Decisions/ADR-0091-audit-security-context-definition]] (new)
Research: [[../60-Research/audit-security-context-definition-2026-06-07]]

- **D1 Boundary** — A. Own *narrow* bounded context (observe/record/verify/flag) · B. cross-cutting
  library · C. rich core security domain. **→ A.**
- **D2 Audit log** — A. Separate security audit log (hash-chained + signed checkpoints), distinct from
  the domain event store · B. reuse domain events. **→ A.**

Why: server re-simulation is the anti-cheat; the security audit log answers "who attempted what under
which decision" (≠ the event store's "how did state change"). Owns replay-dedup state, anomaly flags,
retention/redaction; does **not** own domain validation, Identity, or the outbox. GDPR via
minimize/pseudonymize + retain-fact-sever-identifier.

---

## B. Mini ratification points (recommendation = the option each ADR already proposes)

> **All decided 2026-06-08 (#153) per recommendation:** M1 reuse `WorldAiMgmtRng:media:*` ·
> M2 pure deterministic HoF formula · M3 Stadium Operations keeps pitch-condition state.

- **M1 · Media Ecology RNG label** ([[../10-Architecture/09-Decisions/ADR-0085-media-ecology-context-and-outlet-operational-behaviour]]) —
  reuse `WorldAiMgmtRng:media:*` sub-label **→** vs dedicated `MediaRng`. **→ reuse** (ADR-0018 §3
  stream discipline + FMX-66/67/80/92 precedent; outlets are AI-world actors).
- **M2 · Hall-of-Fame voting RNG** ([[../10-Architecture/09-Decisions/ADR-0083-awards-honours-records-and-hall-of-fame-contract]]) —
  pure deterministic induction formula (no new `*Rng`) **→** vs stochastic `LegacyRng`/`HoFRng`.
  **→ pure formula** for MVP; if stochastic voting later, use an existing-stream sub-label, not a new
  top-level RNG.
- **M3 · Pitch-condition state ownership** ([[../10-Architecture/09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch]]) —
  Stadium Operations keeps the pitch-condition state/aggregate; Environment & Climate owns weather as
  a consumed input **→** vs moving the pitch aggregate into Environment & Climate. **→ Stadium Ops keeps
  state** (keep the facility-dependent invariant together).

---

## C. The "20th-context" reconciliation — [[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]] (new, keystone)
Research: [[../60-Research/bounded-context-portfolio-reconciliation-2026-06-07]]

> **Decided 2026-06-08 (#153): D1/D2/D3 = A/A/A** — 28-context catalog with fixed ordinals
> (20–28) + six subdomain clusters; the bounded-context-map §1 table now reflects it.

Nine ADRs each propose a new context and each claims "the 20th". This is the single knot that needs
your call on the *portfolio*, not just individual contexts.

- **D1 Portfolio** — A. Accept all nine as own-BCs → **19 → 28** (0065 stays a Narrative subdomain) ·
  B. Collapse some to sub-aggregates · C. Freeze at 19. **→ A.**
- **D2 Numbering** — A. Canonical catalog with a fixed ordinal key by ADR number (positions 20–28),
  map re-derives from the catalog at each apply-PR · B. first-to-ratify takes next ordinal. **→ A.**
- **D3 Governance** — A. Group the 28 into six subdomain clusters (Sporting Core · Competition & World
  Sim · Club/Finance & Commerce · Recruitment/People & Career · Engagement & Narrative · Platform &
  Governance) + context catalog + no-shared-tables architecture-test invariant · B. flat list. **→ A.**

Why: in a modular monolith, **count is not the cost** — coupling + cognitive load are; ~28 in-process
contexts is reasonable when each is subdomain-aligned, low-coupled and governed by clusters + a catalog
(Evans/Vernon/Team-Topologies). Each of the nine is independently justified + already Nico-directed;
clusters cap cognitive load; the catalog removes the "everyone is the 20th" ambiguity.

---

## D. Ratify-only checklist (your direction already given — just needs a formal yes)

These were `proposed`/`draft` ADRs already chosen live; **all 15 rows were ratified `accepted`
2026-06-08 (#153)** (✓ below = ratified; ADR-0076/0085 thread portions later amended by ADR-0100,
recorded 2026-06-11 per FMX-143):

| Ratify? | ADR / GDDR | What you chose | Notes |
|:---:|---|---|---|
| ✓ | [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]] | Narrative as own context | new BC #21 in §C catalog |
| ✓ | [[../10-Architecture/09-Decisions/ADR-0064-scouting-activity-context]] | Scouting own context (Option C, 2026-06-02) | new BC #24 |
| ✓ | [[../10-Architecture/09-Decisions/ADR-0065-narrative-media-press-content-ownership]] | Media/Press = Narrative subdomain (not a BC) | confirmed in §C |
| ✓ | [[../10-Architecture/09-Decisions/ADR-0071-ai-world-simulation-context-and-drift-contract]] | AI World Sim own context (D1=B, 2026-06-03) | new BC #25 |
| ✓ | [[../10-Architecture/09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch]] | Env & Climate own context (C/A/A/A) | new BC #26; M3 above |
| ✓ | [[../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner]] | Statistics & Analytics own context | new BC #27 |
| ✓ | [[../10-Architecture/09-Decisions/ADR-0085-media-ecology-context-and-outlet-operational-behaviour]] | Media Ecology own context (B/A/A/A) | new BC #28; M1 above |
| ✓ | [[../10-Architecture/09-Decisions/ADR-0075-loan-orchestration-process-manager]] | Transfer-led loan saga (A/B/A/A) | contract among existing BCs |
| ✓ | [[../10-Architecture/09-Decisions/ADR-0078-player-discipline-suspension-contracts]] | Squad-owned discipline (A/A/A/A) | no new BC |
| ✓ | [[../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]] | split event model (C/B/C) | no new BC |
| ✓ | [[../10-Architecture/09-Decisions/ADR-0082-manager-style-signal-and-run-analysis-contract]] | hooks-only (A/A/A/A) | extends ADR-0051 |
| ✓ | [[../10-Architecture/09-Decisions/ADR-0083-awards-honours-records-and-hall-of-fame-contract]] | extend ADR-0051; full HoF MVP (A/A/A/B) | M2 above |
| ✓ | [[../10-Architecture/09-Decisions/ADR-0086-background-fast-matchday-cost-settlement]] | coarse parametric + seeded variance (A/A/A/C) | no new BC |
| ✓ | [[../10-Architecture/09-Decisions/ADR-0087-live-match-intervention-buffer-and-pause-vote]] | bounded buffer + veto/quorum (A/A/A/A) | no new BC |
| ✓ | [[../10-Architecture/09-Decisions/ADR-0088-async-escalation-fsm-and-watch-party-deadline-source-of-truth]] | 5-stage FSM + seeded variance (A/A/A/B/A/A/A) | no new BC (FMX-102) |

FMX-52 calibration debt (numeric magnitudes behind `*Version` flags) is **not** a ratification
blocker for any of the above — it is a separate, later tuning wave.

---

## Authoring note

All items authored `proposed`/`draft`, never self-accepted (per
[[../90-Meta/collaboration-and-decision-protocol]]). `bounded-context-map.md` is **untouched** — every
map change is described "proposed-not-applied" inside its ADR and reconciled by §C. Per-item external
research (2026-06-07) is filed under `60-Research/*-2026-06-07.md`; raw evidence for People is in
`60-Research/raw-perplexity/raw-people-persona-bounded-context-2026-06-07.md`, with the remaining
items' sources cited inline in their dated synthesis notes.
