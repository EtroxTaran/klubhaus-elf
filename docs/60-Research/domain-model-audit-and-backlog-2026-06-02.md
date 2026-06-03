---
title: Domain-Model Audit & Backlog 2026-06-02
status: draft
binding: false
tags: [research, ddd, bounded-context, audit, backlog, domain-model]
created: 2026-06-02
updated: 2026-06-02
type: research
linear: [FMX-56, FMX-57, FMX-58, FMX-59, FMX-60, FMX-61, FMX-62, FMX-63, FMX-64, FMX-65, FMX-103]
related: ["[[../10-Architecture/bounded-context-map]]", "[[../00-Index/Decision-Log]]", "[[../50-Game-Design/README]]", "[[../00-Index/Current-State]]", "[[../90-Meta/collaboration-and-decision-protocol]]", "[[../90-Meta/vault-governance]]"]
---

# Domain-Model Audit & Backlog (2026-06-02)

> **Status: draft / proposal — nothing here is ratified.** This note is the synthesis
> of a read-only, multi-agent DDD + gameplay documentation audit of the vault. Every
> target-model change, new context, gap remediation and backlog item is a **proposal
> pending Nico's ask-first decision gate** (see [[../90-Meta/collaboration-and-decision-protocol]]).
> No ADR/GDDR/map was edited and no decision was self-ratified. The operational backlog
> lives in **Linear team FMX** (epics [FMX-56..FMX-65]); this note is the durable
> knowledge-base record per the vault/Linear split. **Lane 11 (platform tier) was re-run on
> 2026-06-02 — see the [[#Platform-Tier Follow-up Audit (2026-06-02)|Platform-Tier Follow-up Audit]]
> below (epic E10 / [FMX-103], children [FMX-104]–[FMX-117]).**

> **Method.** 47-agent read-only workflow: 5 inventory lanes (368 docs classified) →
> 11 of 12 domain-audit lanes (lane 11 — Identity/Offline Sync/Audit & Security/Save/IP —
> failed structured capture; **subsequently completed by the 45-agent platform-tier follow-up
> audit appended below**) → 14 adversarial gap-challenges → synthesis (target model / gap
> register / vault design) → backlog → adversarial consistency review. The 8 consistency fixes
> were applied before the Linear backlog was created (see §Consistency review).

---

## Section A — Executive Audit

**Overall health: strong.** The vault is a mature, disciplined, service-ready 19-context
modular monolith with contracts-first communication rules, supersede discipline, hub-and-spoke
MOCs, and a followed research→game-design→architecture→implementation chain. All 55 prior
Linear FMX issues are **Done** (economy wave FMX-41→53 + bounded-context wave FMX-24→40);
there was **no open backlog**, so this audit is a genuine *what's-next* planning pass with no
live-work collisions.

**Top structural risks (in priority order):**

1. **Binding debt from a proposed context.** Two *accepted* ADRs (0056 Regulations, 0057
   Rivalry) delegate validation to Community Overlay Pipeline (ADR-0059), which is still
   *proposed* — two binding contexts reference an unratified one.
2. **One genuinely missing critical domain: Competition & Fixtures** (G1). League owns the
   *clock*, Regulations the *rules*; nothing owns competition registry / fixture generation /
   cup formats (GD-0009 R2-14 critical-open).
3. **Five designed contexts stranded in `draft`** (People, Narrative, Youth Academy, Community
   Overlay, Scouting) — each 5–6/6 DDD criteria, each blocking downstream work.
4. **Cross-domain *contracts* are the dominant gap shape** — ownership is mostly clear, but
   command/event/query signatures between contexts are unspecified (G11/G14/G15/G18).
5. **Determinism/RNG discipline is inconsistently applied** to stochastic systems (G8/G9/G23) —
   a replay-safety hazard; every stochastic system must declare its `*Rng` sub-label (ADR-0018 §3).
6. **Documentation hygiene drift** (G26): frontmatter `status:draft` vs body "Approved" across
   ~12 GDDRs; superseded-but-still-linked docs; ADR status not synced post-supersede.

**Top missing areas (confirmed after adversarial challenge):** Competition & Fixtures (critical);
player contract-renewal/Bosman FSM; loan-lifecycle orchestration; in-match discipline→suspension→
appeals; media-outlet operational behaviour; statistics read-model; awards/HoF; late-game/dynasty arc.

**Challenged and dismissed (NOT gaps):** save determinism/replay (owned by Match + Audit & Security);
board confidence/job-security (owned by Audience & Atmosphere ouster FSM + Club Management board-pressure
+ career-mode sacking FSM); People "blocking" (intentional, documented sequencing gate).

**Confidence:** high on structure and the gap set. The platform/cross-cutting tier (Identity / Offline
Sync / Audit & Security / Save / IP) — initially *medium* because lane 11 failed structured capture — has
since been covered by the **[[#Platform-Tier Follow-up Audit (2026-06-02)|Platform-Tier Follow-up Audit]]**
appended below (now **high** confidence; 16 confirmed + 19 reframed gaps; Linear epic E10 / [FMX-103]). It
surfaced three live contradictions in `status:current` binding docs — SurrealDB-vs-Postgres drift, two
disagreeing threat-models, and orphaned save-integrity intent — to resolve before multiplayer/security build-out.

---

## Section B — Current-State Inventory (368 docs classified)

| Cluster | Docs | Maturity signal | Key quality findings |
|---|---|---|---|
| Game Design (`50-`) | 52 | 23 GDDRs + 23 system/mode notes + index | all reopened to `draft` 2026-05-27; 6 fresh FMX-wave GDDRs (GD-0018→0023) await approval; Wave-2 gates (R2-02/03/04/05/06/14) scattered in bodies; **frontmatter-vs-body status conflict** systemic |
| Architecture & ADRs (`10-`) | 80 | 18 accepted, ~32 draft, 5 superseded | clean supersede chains (0001→0021, 0004→0027, 0013→0028); **no duplication, no orphans**; cross-context contracts *inlined* across arc42 §4/§5 + 24 ADRs |
| Research (`60-`) | 130 | 26 binding syntheses, 49 raw-Perplexity, 18 pre-mortems (191 findings) | exhaustive synthesis-feed coverage; **fact-vs-decision boundary blurs** (impact-map "research" treated as authority); one-directional research→decision links |
| Features & Implementation (`20-`,`30-`) | 53 | mixed | **spec drift** (impl notes more precise than the features they implement); some impl notes pre-decide architecture during no-dev phase; `agent-workflow-pattern` mixes 7 concerns; feature-spec density varies 60–300 LOC |
| Index, Meta & Archive (`00-`,`90-`,`40-`,`70-`,`95-`) | 53 | mature | legacy `github-issue-suite/` superseded by Linear; `95-Archive/product-os/` shadows old scaffold; 57 handoffs consolidated; `70-User-Docs` correctly stubbed |

---


# Section C — Proposed Target Domain Model

> **Method note.** Baseline = 19 ratified + 5 proposed contexts. This section preserves the ratified core, recommends ratification of the proposed contexts (with conditions), and proposes a small number of new/split contexts where the lane audits show a real ownership gap, an over-broad context, or a binding-but-orphaned reference. Each item is tagged **Fact** (from audit/ADR), **Interpretation** (my reading of the evidence), or **Recommendation** (proposed action — requires Nico's decision gate; nothing here is self-ratified).

---

## C.1 Target Context List (Summary)

Legend — **Status:** R = ratified (keep) · P→R = proposed, recommend ratify · NEW = recommend create · REFRAME = keep but tighten/rename · WATCH = scope risk to monitor. **Decision** = needs Nico HITL gate.

| # | Bounded Context | Status | Core ownership (one line) | Decision? |
|---|---|---|---|---|
| 1 | Identity & Access | R (thin, OK) | Auth, group membership, device/session→manager binding | — |
| 2 | League Orchestration | R | Season/week/match-day FSM, cadence, quorum, run lifecycle | — |
| 3 | Club Management | R | Sole finance-ledger writer, budgets, board pressure, insolvency FSM | — |
| 4 | Squad & Player | R | Player base facts, attributes, contracts, fitness, injuries, Impact Lens | — |
| 5 | Training | R | Weekly load, development signals, injury-risk, tactical familiarity | — |
| 6 | Transfer | R | Offer/negotiation lifecycle, valuation, clauses, windows (queried) | — |
| 7 | Match | R | Match lifecycle FSM, event log, intervention queueing, summary | — |
| 8 | Watch Party | R | Synchronous broadcast FSM, polls, backward-deadline propagation | yes (ADR-0015) |
| 9 | Notification | R | Durable message records, delivery, preferences, digests | — |
| 10 | Manager & Legacy | R | Cross-run meta, run snapshots, style signals, prestige/legacy | yes (records scope) |
| 11 | Staff Operations | R | Staff hire/fire/wage/role, specialisation effect-readiness | — |
| 12 | Tactics | R | Tactic presets, set-pieces, opposition templates, role/duty, fingerprint | — |
| 13 | Regulations & Compliance | R | Versioned rule catalog, windows, sanctions, licence tiers | — |
| 14 | Rivalry System | R | Rivalry-edge graph, 5-sub-score, decay, tier classification | — |
| 15 | Stadium Operations | R | Matchday FSM, facility decay, venue calendar, seat/hospitality inventory | — |
| 16 | Audience & Atmosphere | R | Fan segments, atmosphere engine, ticketing-trust, politics FSM | — |
| 17 | CommercialPortfolio | R | Ticketing/contract policy, settlement sagas, IFRS accrual, campaigns | — |
| 18 | Offline Sync | R (thin, OK) | Local cache/draft/freshness, save migration runner | — |
| 19 | Audit & Security | R (thin, OK) | Cross-cutting audit trail, provenance, security posture | — |
| 20 | People / Persona & Skills | P→R | Personhood, OCEAN substrate, relationships, skill profiles, context cards | yes (ADR-0052) |
| 21 | Narrative | P→R | Non-authoritative narration, scene selection, LLM adapter, validation | yes (ADR-0054/0030) |
| 22 | Youth Academy | P→R | Annual intake FSM, cohort lifecycle, investment, home-grown counter | yes (ADR-0060) |
| 23 | Community Overlay Pipeline | P→R **(unblock debt)** | Pack registry, import FSM, IP gate, multi-BC validation delegation | yes (ADR-0059) |
| 24 | Scouting Activity | P→R | Scout assignments, report lifecycle, coverage, lists, reveal-gate | yes (ADR-0064) |
| 25 | **Competition & Fixtures** | **NEW** | Competition registry, fixture templates, scheduling, cup formats | yes |
| 26 | **Discipline & Match Officials** | **NEW (or sub-aggregate)** | In-match cards/fouls, suspension accumulation, appeals | yes |
| 27 | **Loan Lifecycle** *(process manager, not full BC)* | **NEW (orchestration)** | Loan agreement FSM, minutes/recall enforcement, environment effects | yes |

**Not recommended as new contexts** (resolved inside existing BCs — see C.5): Board Confidence, Awards/Records/Hall-of-Fame, Statistics & Analytics, Weather, Contract-Renewal/Bosman, Media/Press outlets, Player-Interaction/Morale.

---

## C.2 Contexts to RATIFY (proposed → ratified)

These five are designed, score 5–6/6 DDD criteria in their ADRs, and have binding references pointing at them. **Recommendation: ratify, with the listed conditions.**

### 20. People / Persona & Skills (ADR-0052)
- **Fact.** ADR-0052 draft; ADR-0051 (accepted) and ADR-0053 (accepted) both contain conditional references that collapse to stubs until it ratifies; Tactics/Transfer read role-fit + personality flags from Squad until it lands.
- **Why it exists (Interpretation).** Personhood, OCEAN substrate, relationship graph and skill profiles are needed by ≥6 contexts and do not belong inside Squad & Player (numeric attributes) without breaking single-responsibility. The "three parallel substrates" confusion (hidden-meta / OCEAN / labels) is a strong signal the derivation logic needs one owner.
- **Belongs:** actor registry, OCEAN (internal only), derived football labels, relationships (with provenance), player/staff skill-profile snapshots (locked at match/training), dialogue context cards.
- **Does NOT belong:** numeric attributes/CA/PA/contracts/injuries (Squad), development deltas (Training), media-outlet publication rules, message delivery.
- **Up/down:** ← Squad, Training, Match, Transfer, Audience & Atmosphere; → Narrative, Tactics, Transfer, Manager & Legacy.
- **Extension points:** skill catalog versioning; agent identity (post-MVP); media/fan-group ActorRefs.
- **Team/role:** Gameplay-systems + AI/persona lead.
- **Recommendation / decision gate:** Ratify; **Nico must first resolve** staff-skill MVP activation (Option A/B/C — audit recommends B) and confirm media/fan-group are opaque ActorRefs, not full actors. Also publish the single hidden-meta→OCEAN→label derivation mapping as part of ratification (closes a high-severity cross-cutting gap).

### 21. Narrative (ADR-0054 + ADR-0030 LLM boundary)
- **Fact.** Both draft; LLM-out-of-authoritative-state is binding intent but gated on a recorded legal/compliance review (EU AI Act Art. 50). Template-only mode is implementable now.
- **Why it exists.** Non-authoritative narration (scene selection, context-card assembly, fallback templates, LLM adapter, validation, provenance) is cross-cutting and must be architecturally fenced off from all authoritative state.
- **Belongs:** scene/storylet selection, context cards, fallback rendering, LLM provider adapter, validation policies, provenance, eval corpus, short-TTL narrative memory (presentation-only).
- **Does NOT belong:** any authoritative fact; "is X newsworthy?" *decisions* that mutate state; promises/relationship changes (People).
- **Up/down:** ← People, Squad, Match, Transfer, Club Management, Audience & Atmosphere; → Notification.
- **Extension points:** DialogueIntent taxonomy per surface; provider routing; media-outlet ActorRefs.
- **Team/role:** AI-narration lead + legal reviewer (gate).
- **Recommendation / decision gate:** Ratify **after** (1) ADR-0030 legal gate recorded, (2) DialogueIntent taxonomy + intent→mechanical-effect map locked (high-severity blocker), (3) media-outlet ownership decided (see C.4 / C.5). Ship template-only first; LLM is optional acceleration.

### 22. Youth Academy (ADR-0060)
- **Fact.** ADR-0060 draft; GD-0007 approved + youth-academy-and-development binding, but the 19-context map has no owner. Orthogonal timescale to Training (annual cohort vs weekly dev) — **no true contradiction.**
- **Why it exists.** Annual intake FSM, cohort lifecycle, investment slider, productivity (EPPP-analogue) and home-grown counter are a coherent annual-cadence aggregate that would otherwise smear across Squad/Training/Staff.
- **Belongs:** AcademySeason/YouthCohort FSMs, investment posting (via ACL to Club Mgmt), productivity + home-grown counters, Snapshot publication to Squad.
- **Does NOT belong:** player base data (Squad), weekly dev (Training), HoY hire/fire (Staff), scout coverage source (Scouting), wage ledger (Club Mgmt), loan orchestration (→ Loan Lifecycle, C.4).
- **Up/down:** ← Staff Ops, Scouting, League, Club Mgmt, Community Overlay; → Squad, Club Mgmt, Regulations, Manager & Legacy, Notification.
- **Extension points:** EPPP audit cycle; reserve/B-team; wonderkid tagging; regional-yield override packs.
- **Team/role:** Squad-lifecycle lead.
- **Recommendation / decision gate:** Ratify. **Fix on ratify:** update consumed-facts wording "Scouting / Transfer" → "Scouting (ADR-0064)"; confirm Snapshot publishes at season-archive (batch, atomic).

### 23. Community Overlay Pipeline (ADR-0059) — **resolve binding debt**
- **Fact (critical).** ADR-0056 (Regulations, accepted) and ADR-0057 (Rivalry, accepted) already delegate pack-override semantic validation to "FMX-33 Community Overlay Pipeline," which is only proposed. Two binding contexts reference an unratified one.
- **Why it exists.** Pack registry, import FSM, manifest/IP-safety gate, multi-BC semantic-validation delegation, and immutable per-save activation snapshot need one orchestrator; downstream BCs own their own semantic validation.
- **Belongs:** PackRegistry, ImportSession FSM, ManifestSchema versioning, IPSafetyAuditLog, ConflictResolutionPolicy, ActivePacksSnapshot (save-creation only).
- **Does NOT belong:** per-domain semantic validation (each BC), hosting/distribution (P2P per ADR-0016), Identity.
- **Up/down:** ← Identity, League (save-creation); ↔ Regulations, Rivalry (+future Tactics/Squad/Club Mgmt); → Notification, Manager & Legacy.
- **Extension points:** pack migration runner (coordinate with Offline Sync); revocation/appeals.
- **Team/role:** Platform/tooling lead.
- **Recommendation / decision gate:** **Ratify or explicitly re-architect.** This is the highest-priority decision in this section: either accept ADR-0059, or move semantic-validation orchestration into Regulations + Rivalry as sub-aggregates. Leaving it proposed keeps two accepted contexts dangling.

### 24. Scouting Activity (ADR-0064)
- **Fact.** ADR-0064 proposed; Nico HITL shaping decisions (2026-06-02) confirm Option C (own context), 6/6 DDD criteria fire; map-patch attached but not applied (still 19).
- **Why it exists.** Scout *activity* (assignments, reports w/ knowledge%, coverage, lists, hidden-flag reveal-gate) is distinct from scout *identity* (People) and offer/negotiation (Transfer); satisfies the no-cross-context-join Impact-Lens rule by construction.
- **Belongs:** ScoutAssignment, ScoutingReport (opacity layers), CoveragePlan, CandidateList, HiddenFlagRevealLedger (reveal-state only).
- **Does NOT belong:** scout persona/skill (People), hire/fire (Staff), offer/window (Transfer), player truth (Squad), youth intake (Youth Academy).
- **Up/down:** ← People, Staff, Squad, Transfer, League, Regulations; → Transfer, Squad (Impact Lens), Youth Academy, Notification, Manager & Legacy.
- **Extension points:** reserved `OppositionScoutingRequested` hook (recruitment-only now); agent-sourced tips.
- **Team/role:** Recruitment-systems lead.
- **Recommendation / decision gate:** Ratify (Nico already confirmed shaping) and apply the 19→20 map patch.

---

## C.3 Contexts to KEEP but REFRAME / TIGHTEN

- **Transfer (REFRAME — narrow, do not split).** *Interpretation:* the contract-renewal/Bosman/free-agent FSM and async P2P escalation are real gaps, but they are **extensions of Transfer's lifecycle, not a new context.** *Recommendation:* add a **Contract-Lifecycle sub-aggregate** inside Squad & Player for renewal/expiry state, and a **renewal-negotiation flow** inside Transfer; do NOT create a "Contracts" BC (would fracture player-terms ownership). Lock the cash-equivalent clause formula and the 5-stage escalation thresholds (decision needed).
- **Match (REFRAME — confirm, add sub-aggregates).** *Recommendation:* keep Match as the owner; add explicit **Intervention-Buffer** policy and a **Discipline** sub-aggregate *unless* C.4 #26 is created as its own BC. Clarify async result-confirmation/dispute ownership (Match vs League).
- **Manager & Legacy (REFRAME — widen slightly).** *Recommendation:* extend scope to own **cross-save Hall-of-Fame / records / honours** (natural home for cross-save meta) rather than spawning an Awards BC. Decision: keep MVP hooks-only but reserve the records data model now.
- **Audience & Atmosphere (WATCH).** Correctly scoped; NamedSupporterGroup overlay must stay FMX-54-gated. No reframe.
- **Matchday-Event-Engine (KEEP as multi-owned ruleset, NOT a BC).** *Fact/Interpretation:* it is correctly a declarative ruleset whose effects are owned by Stadium Ops / Audience & Atmosphere / Club Mgmt / Regulations. Do not promote to a context. Document event-evaluation order + composition rules (gap).

---

## C.4 NEW contexts recommended (evidence-backed gaps)

### 25. Competition & Fixtures — **NEW (critical gap)**
- **Fact.** GD-0009 (binding) mandates a pyramid + multiple parallel cups; **no context owns** competition registry, fixture templates, scheduling, or cup formats. League Orchestration owns *temporal* boundaries only; Regulations owns *rules* only. GD-0009 R2-14 (critical) flags the schema as unresolved.
- **Why it exists.** Format/structure is a distinct concern from the week/match-day clock; promotion/relegation, cup entry, fixture generation and multi-competition calendar clashes need one owner.
- **Belongs:** Competition registry (tier↔format), FixtureTemplate (round-robin/knockout/group), deterministic fixture generation, neutral-venue/replay rules, cup-entry eligibility, multi-competition calendar reconciliation.
- **Does NOT belong:** week/match-day FSM (League), rule catalog (Regulations), results (Match), revenue profiles (CommercialPortfolio owns settlement; this context owns the Competition↔RevenueProfile *mapping* — decision).
- **Up/down:** ← League (calendar), Regulations (windows/eligibility); → Match, CommercialPortfolio, Club Mgmt, Audience & Atmosphere.
- **Extension points:** women's calendar offset (GD-0009 R2-13); continental cups; B-team competition entry.
- **Team/role:** Competition-systems lead.
- **Decision gate:** Create as own BC **or** as an explicit sub-aggregate of League Orchestration. *Recommendation:* own BC — the audit shows it touches 5+ contexts and has independent evolution (mid-save format changes).

### 26. Discipline & Match Officials — **NEW or Match sub-aggregate**
- **Fact.** Regulations owns the *post-match* sanction catalog; **in-match card/foul logic and suspension accumulation/appeals have no owner.** Cross-lane audits flag this as high/medium severity, scattered across Match/Squad/Regulations.
- **Why it exists.** In-match disciplinary events → cumulative suspensions → appeals is a coherent FSM bridging Match (issuance) and Regulations (escalation).
- **Belongs:** Card/foul issuance model, suspension accumulation, ban-window state, appeal FSM.
- **Does NOT belong:** sanction catalog/rules (Regulations), player availability mutation (Squad applies it), wage impact (Club Mgmt).
- **Up/down:** ← Match (events), Regulations (escalation rules); → Squad (availability), Club Mgmt (fines), Notification, Narrative.
- **Decision gate.** *Recommendation:* keep as a **Discipline sub-aggregate inside Match** for MVP (lower overhead), promote to own BC only if appeals/referee-bias depth grows. Either way, define the in-match→post-match handoff contract.

### 27. Loan Lifecycle — **NEW orchestration (process manager, not full BC)**
- **Fact.** Loan governance is the most-repeated gap across lanes (Youth Academy, Transfer, Squad, Training all defer it). `YouthLoaned`/loan offers exist as events with **no consumer-side orchestrator.**
- **Why it exists.** Loan quality + minutes-guarantee + recall + wage-share spans 4+ contexts; it is a classic multi-BC **saga**, not a data-owning context.
- **Belongs:** loan-agreement FSM, minutes-promise enforcement, recall authority, wage-share scheduling, loan-environment effect application (dev multiplier).
- **Does NOT belong:** player base data (Squad), dev calc (Training), negotiation/fee (Transfer), ledger (Club Mgmt).
- **Up/down:** ← Transfer, Youth Academy (entry events), League (windows); → Squad (loaned-out state), Training (environment multiplier), Club Mgmt (wage-share).
- **Decision gate.** *Recommendation:* implement as a **Process Manager owned by Transfer** (Transfer already owns the deal); do not create a standalone data-heavy BC. Post-MVP.

---

## C.5 Candidate "missing domains" that should NOT become contexts

*Interpretation/Recommendation — each resolves inside an existing BC; flagged here to prevent context sprawl.*

| Candidate gap | Resolution | Owner |
|---|---|---|
| Board Confidence / job security | Sub-aggregate (FSM) | Club Management (inputs from Match/League/Audience) |
| Awards / Records / Hall-of-Fame | Widen existing scope (C.3) | Manager & Legacy |
| Statistics & Analytics hub | Read-model layer, not a BC | Squad & Player (projects Match/Club facts) |
| Weather & environment | Deterministic input (RNG sub-label) | League (seasonal template) → consumed by Match/Audience/Stadium |
| Contract renewal / Bosman / free-agent | Sub-aggregate + flow (C.3) | Squad & Player + Transfer |
| Media / Press / journalist outlets | Non-authoritative ActorRefs | Narrative (decision: outlets are narrative-only, not operational) |
| Player interaction / dressing-room / morale | Morale FSM sub-aggregate | Squad & Player (dialogue context from People/Narrative) |

---

## C.6 Thin contexts — scope confirmation

- **Identity & Access (Fact: appears only as upstream auth in audits).** *Interpretation:* under-described — multiplayer needs explicit group-membership, device-trust and session→manager binding contracts. *Recommendation:* **keep as own thin BC, but flesh out its published contracts before multiplayer implementation.** Correctly scoped, currently under-specified.
- **Offline Sync (R, thin).** *Recommendation:* **correctly scoped.** Owns local cache/draft/freshness and the save-migration *runner*. One coordination decision: who triggers Community-pack migrations (Offline Sync vs Community Overlay) — assign at ratification of ADR-0059.
- **Audit & Security (R, thin).** *Recommendation:* **correctly scoped as cross-cutting.** Confirm it (not Narrative) owns canonical *provenance* storage; Narrative emits provenance, Audit & Security retains it. No reframe.

---

## C.7 Net change vs baseline

- **Fact/Recommendation summary:** 19 ratified kept; **5 proposed → ratify** (People, Narrative, Youth Academy, Community Overlay, Scouting); **+3 net-new** proposed (Competition & Fixtures = own BC; Discipline = Match sub-aggregate preferred; Loan Lifecycle = Transfer-owned saga) → **target ≈ 22 full bounded contexts + 2 orchestration/sub-aggregate concerns + Matchday-Event-Engine as a shared ruleset.**
- **Highest-priority Nico decisions:** (1) **Community Overlay ratify-or-rearchitect** (resolves binding debt from two accepted ADRs); (2) **Competition & Fixtures ownership** (own BC vs League sub-aggregate); (3) **People + Narrative + LLM legal gate**; (4) staff-skill MVP option; (5) media-outlet ownership.
- **All items above are proposals only and require the ask-first decision gate; nothing is self-ratified.**

## Section D — Consolidated Gap Register

**Method.** Candidate gaps from seven lane audits were filtered against the challenge verdicts: `already-owned` and `not-a-gap` verdicts were dropped; `partially-covered` verdicts were downgraded to *refinement* gaps (the domain owner exists; only a spec/FSM/contract layer is missing); un-challenged candidates surviving scrutiny were kept as *confirmed*. Cross-lane duplicates (e.g. loan lifecycle appeared in 3 lanes; contract renewal in 2; media ownership in 2) were consolidated into single systematic findings.

**Dropped per challenge verdict:** Save Determinism & Replay Format R2-08 (already-owned: Match + Audit & Security + Offline Sync, `determinism-and-replay.md` binding); Board confidence / job-security ownership (already-owned: Audience & Atmosphere ouster FSM + Club Management board-pressure + GD-0011/mode-manage-a-club-career sacking FSM); People/Persona ratification "blocking" (not-a-gap: intentional sequencing gate with documented contingency in ADR-0053).

### Severity summary

| Severity | Count | IDs |
|---|---|---|
| Critical | 1 | G1 |
| High | 13 | G2, G3, G4, G5, G6, G7, G8, G9, G10, G11, G12, G13, G14 |
| Medium | 9 | G15, G16, G17, G18, G19, G20, G21, G22, G23 |
| Low | 3 | G24, G25, G26 |

### Register (scannable)

| ID | Title | Type | Sev | Human decision? |
|---|---|---|---|---|
| G1 | Competition Registry & Fixture Scheduling schema (R2-14) | missing-domain | critical | yes |
| G2 | Late-game / dynasty arc undesigned (R2-06) | missing-gameplay-rules | high | yes |
| G3 | Manager-archetype taxonomy & perk/prestige balance (GD-0019) | unresolved-balancing-decision | high | yes |
| G4 | Onboarding 60s flow / guided first season (R2-05) | missing-gameplay-rules | high | yes |
| G5 | Mobile route map + client-state pattern (R2-07/R2-17) | missing-gameplay-rules | high | yes |
| G6 | Match rendering & controls UX (R2-16) | missing-gameplay-rules | high | yes |
| G7 | AI narration scope + LLM out-of-state ratification (ADR-0030/0054) | missing-gameplay-rules | high | yes |
| G8 | AI world-drift algorithm (rival drift, fallen-giant, rising nations) | unclear-invariants | high | yes |
| G9 | Set-piece variant selection determinism | unclear-invariants | high | yes |
| G10 | Tactical-identity fingerprint aggregation algorithm | unclear-invariants | high | yes |
| G11 | Opposition-template AI consumption contract | missing-cross-domain-contract | high | yes |
| G12 | Set-piece-coach effect-readiness multiplier curve | weak-domain | high | yes |
| G13 | Dialogue-intent taxonomy → mechanical effect matrix | missing-gameplay-rules | high | yes |
| G14 | Newsworthiness / domain-event publication semantics for narrative | missing-cross-domain-contract | high | no |
| G15 | Loan-orchestration Process Manager deferred | missing-cross-domain-contract | high | yes |
| G16 | Player contract renewal / expiry / Bosman FSM unowned | missing-domain | high | yes |
| G17 | Media-outlet operational behaviour ownership | missing-domain | high | yes |
| G18 | Player discipline state (cards/suspension/appeals) ownership | weak-domain | medium | yes |
| G19 | Statistics & analytics read-model owner | missing-domain | medium | no |
| G20 | Awards / honours / records / Hall of Fame owner | missing-domain | medium | yes |
| G21 | Background-fast quality-profile cost settlement path | missing-gameplay-rules | medium | yes |
| G22 | Hidden-attribute substrate (8-meta / OCEAN / labels) mapping | weak-domain | high | yes |
| G23 | Weather ownership + RNG/determinism path | unclear-invariants | medium | yes |
| G24 | Live-match intervention buffer / pause-vote spam policy | missing-gameplay-rules | medium | no |
| G25 | Async escalation thresholds + watch-party deadline mutation | unclear-invariants | medium | no |
| G26 | Doc-hygiene: stale "open" flags, ADR status sync, dangling refs | doc-hygiene-structure | low | no |

---

### Per-gap detail

**G1 — Competition Registry & Fixture Scheduling schema (R2-14).** `missing-domain`, **critical**, human decision required.
League Orchestration *owns* the temporal lifecycle and publishes `FixtureCommercialProfile` / `CompetitionRevenueProfile` (`docs/10-Architecture/bounded-context-map.md`), but the competition-registry / fixture-template / scheduling-algorithm **schema** is unresolved per `docs/50-Game-Design/GD-0009-league-structure.md` R2-14 (critical, open). Multi-competition worlds, cup entry eligibility, and the "living league" goal (GD-0010) cannot be built without it. *Remediation:* lock the `league`/`competition`/`fixture` schema as a sub-aggregate inside League Orchestration (commands `ScheduleCompetition`/`GenerateFixtures`, event `FixturesPublished`); cups deferrable post-MVP but the schema shape must be future-proofed now. *Dependency:* gates Match scheduling, CommercialPortfolio cup-revenue settlement (FMX-45), Regulations per-competition transfer windows.

**G2 — Late-game / dynasty arc undesigned (R2-06).** `missing-gameplay-rules`, **high**, human decision required.
`docs/50-Game-Design/GD-0011-career-progression.md` states the late-game arc is undesigned and dynasty saves flatline ~season 4–6. Board-ambition escalation, ownership transitions, the national-team (Bundestrainer) arc and prestige/HoF metrics are all open. Retention risk at the worst inflection point. *Remediation:* design escalation model, ownership-transition triggers, national-team unlock thresholds, and investigate the empirical flatline. *Dependency:* couples to G3 (archetype/prestige), G20 (records/HoF), Manager & Legacy (ADR-0051).

**G3 — Manager-archetype taxonomy & perk/prestige balance.** `unresolved-balancing-decision`, **high**, human decision required.
`docs/50-Game-Design/GD-0019-manager-archetype-roguelite-progression.md` defers the V1 archetype family list, perk thresholds and the prestige ladder to playtest. Perks require prestige; prestige requires challenge modes; none locked. *Remediation:* MVP captures run-end facts + signal-confidence only; freeze taxonomy/perk caps only after post-MVP playtest clusters are observed. *Dependency:* hard chicken-egg dependency with G2; feeds Manager & Legacy.

**G4 — Onboarding 60-second flow / guided first season (R2-05).** `missing-gameplay-rules`, **high**, human decision required.
`docs/50-Game-Design/GD-0012-onboarding.md` R2-05 (high, "single biggest churn risk") leaves exact step timing, guided-first-season unlock sequence, empty-state/re-engagement copy, feed-card prioritisation formula, and onboarding accessibility paths open. *Remediation:* instrument stopwatch playtests, spec guided-first-season as a day/week sequence, formalise feed-card weight formula, spec keyboard-first nav + WCAG 2.2 AA on the experience-question and mode-step screens. *Dependency:* primary MVP retention lever; spec-to-implementation gate. **FMX-99 update (2026-06-03):** resolved by [[onboarding-guided-first-season-2026-06-03]] and approved [[../50-Game-Design/GD-0012-onboarding]]; this audit line is retained as the original backlog finding.

**G5 — Mobile route map + client-state pattern (R2-07/R2-17).** `missing-gameplay-rules`, **high**, human decision required.
`docs/50-Game-Design/GD-0016-mobile-ux-loop.md` R2-07 (route map, bottom-nav vs drawer vs hub-tile, 44px targets, prefers-reduced-motion) and R2-17 (client-state pattern; no Redux/Zustand) are open and block `ADR-0008` ratification. *Remediation:* lock route map + IA, validate targets/contrast, design draft/optimistic/offline state model with worker-bridge contract, then ratify ADR-0008.

**G6 — Match rendering & controls UX (R2-16).** `missing-gameplay-rules`, **high**, human decision required.
`docs/50-Game-Design/GD-0016-mobile-ux-loop.md` R2-16 leaves match-controls UX and rendering tech open; tied to draft `ADR-0024`/`ADR-0041`/`ADR-0049`. *Remediation:* spec halftime modal + in-match controls (pause/speed/subs/on-the-fly tactics), validate Canvas-2D MVP perf on target devices, lock engine↔renderer coupling. *Dependency:* couples to G9 (set-piece determinism), Match-engine spike (ADR-0049).

**G7 — AI narration scope + LLM-out-of-state ratification.** `missing-gameplay-rules`, **high**, human decision required.
`docs/10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state.md` and `ADR-0054-narrative-context-and-ai-narration-framework.md` are draft; MVP scope lists "AI Narration pillar". Legal/compliance review gate (EU AI Act Art. 50) is a hard prerequisite. *Remediation:* ratify ADR-0054 before ADR-0030 binds; complete legal review; ship fallback templates for every prose point; LLM adapter optional, never authoritative. *Dependency:* ratification gate; couples to G13, G14, G17.

**G8 — AI world-drift algorithm.** `unclear-invariants`, **high**, human decision required.
`docs/50-Game-Design/GD-0010-ai-world.md` R2-06 and `docs/60-Research/ai-manager-behaviour.md` name world-drift (rival drift, fallen-giant cycles, rising youth nations) but do not specify triggers, cadence, RNG sub-labels or archetype resistance. The "living league" goal is unimplementable without it. *Remediation:* spec each drift mechanism with quantified triggers + `WorldAiMgmtRng` sub-labels + per-season vs continuous cadence; route to FMX-52 calibration.

**G9 — Set-piece variant selection determinism.** `unclear-invariants`, **high**, human decision required.
`docs/50-Game-Design/set-pieces.md` §2 ("Trigger: when to use this variant") and `GD-0002-match-engine.md` §7 (`variant = tactic.set_pieces[type].select(context)`) do not define whether selection is seed-deterministic, opposition-aware-at-set-piece-time, or interactive — critical for replay (`ADR-0026` determinism contract). *Remediation:* pin variant selection in the lock-time `TacticSnapshot` (immutable, replay-safe) with a deterministic priority/rotation rule when multiple variants match.

**G10 — Tactical-identity fingerprint aggregation algorithm.** `unclear-invariants`, **high**, human decision required.
`docs/10-Architecture/09-Decisions/ADR-0055-tactics-context.md` defines `TacticalIdentityFingerprint` as a deterministic projection but the aggregation function is undefined; GD-0019 needs possession/pressing/risk/adaptation/set-piece signals. *Remediation:* spec signal definitions, aggregation window/decay, confidence bounds, and familiarity influence as a GDDR/ADR appendix. *Dependency:* feeds G3 (archetype detection) and Manager & Legacy.

**G11 — Opposition-template AI consumption contract.** `missing-cross-domain-contract`, **high**, human decision required.
`ADR-0055` §Consequences notes opposition-template AI consumption is "a separate beat"; `bounded-context-map.md` says "Tactics publishes the catalog, AI consumes" with no mechanism. *Remediation:* define whether selection is pre-match AI planning (League/Club queries Tactics → `OppositionTemplateSelectedForMatch`), embedded in Match lock-time snapshot, or split; include query signature + event schema. *Dependency:* couples to G8 (AI behaviour), Match lock-time inputs.

**G12 — Set-piece-coach effect-readiness multiplier curve.** `weak-domain`, **high**, human decision required.
`ADR-0055` defers the curve; `docs/50-Game-Design/set-pieces.md` §4 ("multiplies training-block effectiveness") gives no formula; `SetPieceCoachReadinessUpdated` payload undefined. Training/Tactics cannot bind effect values. *Remediation:* draft GDDR pinning the multiplier model + payload, co-designed with Staff Operations (`ADR-0053`) specialisation metadata.

**G13 — Dialogue-intent taxonomy → mechanical effect matrix.** `missing-gameplay-rules`, **high**, human decision required.
`docs/50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue.md` §Open and `ADR-0054` leave the per-surface `DialogueIntent` enum and intent→effect mapping unspecified, while `ADR-0030` mandates that only intent (never generated prose) drives mechanics. Implementation blocker for People/Narrative context cards. *Remediation:* lock per-surface intent enums, availability conditions, and deterministic morale/trust/pressure/transfer-readiness deltas; Narrative renders, Squad/Transfer/Club apply.

**G14 — Newsworthiness / event-publication semantics for narrative.** `missing-cross-domain-contract`, **high**, no human decision required.
Across Narrative/Notification/Media: `ADR-0043` and `ADR-0054` assume event-driven flow but never answer *who decides a fact is newsworthy* (injury, suspension, contract expiry, board pressure, transfer rumour) and what payload shape carries enough facts for context-card assembly without cross-context queries. *Remediation:* define an event-publication contract per source domain (e.g. `InjuryOccurred`, `PlayerSuspended`, `ContractExpiring`) with self-contained narrative-fact payloads; Narrative consumes, never joins. *Dependency:* couples to G7, G13, G16, G18.

**G15 — Loan-orchestration Process Manager (consolidated, 3 lanes).** `missing-cross-domain-contract`, **high**, human decision required.
Transfer owns loan deal/clauses (`transfer-market-and-contracts.md`), Training applies the loan-context development tag, Youth Academy owns youth-loan decisions (`ADR-0060` `DecideLoanCohortMember`/`YouthLoaned`), but no owner runs the cross-context loan **lifecycle** (condition monitoring, minutes-guarantee enforcement, recall, environment-effect application). `ADR-0060` §Named risks explicitly defers this to a follow-up ADR. *Remediation:* create a Loan-Orchestration Process Manager ADR (likely Transfer-led, co-authored by Squad & Player + Match) specifying loan-agreement FSM, multi-input quality model, minutes enforcement, recall/early-termination, window sync. *Dependency:* consumes Youth Academy `YouthLoaned` as one entry point.

**G16 — Player contract renewal / expiry / Bosman FSM unowned (consolidated, 2 lanes).** `missing-domain`, **high**, human decision required.
Staff-contract renewal is owned (`ADR-0053`) and commercial-contract renewal is owned (`ADR-0061`), but **player**-contract renewal has no FSM, expiry-to-free-agent conversion, pre-contract window, or Bosman handling. Squad & Player stores contract data (`squad-and-club-structure.md` §5) and Transfer consumes it, but neither names the workflow. *Remediation:* assign player-contract-renewal FSM (active → expiring → renewed/free-agent) to Transfer or Squad & Player; define expiry warnings, pre-contract window, free-agent signing path, and work-permit interplay on free transfers. *Dependency:* feeds squad churn, finance planning, G14 (expiry news).

**G17 — Media-outlet operational behaviour ownership (consolidated, 2 lanes).** `missing-domain`, **high**, human decision required.
`GD-0018` requires journalists/outlets as active actors; `ADR-0052` (People) owns only their *identity* as non-person ActorRefs and explicitly disclaims publication cadence/editorial stance/article delivery; `ADR-0054` (Narrative) owns phrasing, not article-existence decisions; no ratified context owns *when outlets publish, with what stance, what reach/reliability*. *Remediation:* either fold media-outlet generation into Narrative as a non-authoritative presentation concern with explicit cadence/stance rules, or stand up a small Media/Press ecology context. Recommend the former. *Dependency:* couples to G7, G14.

**G18 — Player discipline state (cards/suspension/appeals) ownership.** `weak-domain`, **medium**, human decision required.
Match emits card events (`match-engine.md` §5) and Regulations owns the sanction catalog (`ADR-0056`), but no context owns card-accumulation state, suspension-counter FSM, card→suspension thresholds, or appeal workflow. *Remediation:* assign a Discipline sub-aggregate (Match owns card facts; Squad & Player owns suspension-window availability; Regulations owns thresholds/appeal eligibility); decide whether appeals exist in MVP. *Dependency:* feeds Squad availability, G14.

**G19 — Statistics & analytics read-model owner.** `missing-domain`, **medium**, no human decision required.
No context owns per-match/per-season/career statistics aggregation beyond Squad & Player's Impact-Lens; needed for Expert UI and archetype profiling without violating the no-cross-context-join rule (`bounded-context-map.md` §6). *Remediation:* assign a Statistics read-model service (or Squad & Player sub-projection) that consumes Match/Squad/Club events and exposes denormalised analytics views; no alternate truth.

**G20 — Awards / honours / records / Hall of Fame owner.** `missing-domain`, **medium**, human decision required.
`docs/60-Research/late-game-systems.md` and `GD-0011` reference HoF, records and legends but no context owns them; Manager & Legacy (`ADR-0051`) is scoped hooks-only. *Remediation:* extend ADR-0051 to own cross-save HoF/records with determinism-safe snapshot rules, or defer post-MVP with a reserved data model stub. *Dependency:* couples to G2, G3.

**G21 — Background-fast quality-profile cost settlement path.** `missing-gameplay-rules`, **medium**, human decision required.
`GD-0002-match-engine.md` §6.2 defines background-fast as result/injuries/form only, but matchday operating-cost settlement (FMX-46) needs medical/infrastructure/security cost inputs — origin undefined for event-less matches. *Remediation:* have background-fast emit a `MatchdayOperatingCostSummary` (no events) derived from match context + risk profile, consumed by CommercialPortfolio→Club Management.

**G22 — Hidden-attribute substrate mapping (8-meta / OCEAN / labels).** `weak-domain`, **high**, human decision required.
Three parallel personality substrates exist with no mapping/derivation rules across `squad-and-club-structure.md` §5, `GD-0020`, `GD-0021`, `ADR-0052`; reveal-rule ownership and mentoring-influence computation are unassigned. *Remediation:* single GDDR detailing meta/OCEAN→label derivation, reveal-rule owner (recommend Squad & Player referencing Scouting confidence), and mentoring-influence computation owner (recommend Training). *Dependency:* gated by ADR-0052 ratification; feeds Tactics role-fit, Transfer refusal logic.

**G23 — Weather ownership + RNG/determinism path.** `unclear-invariants`, **medium**, human decision required.
Weather is consumed by Audience & Atmosphere (`ADR-0062`) and Match but its generator/owner and per-save RNG sub-label are undefined; risks per-save determinism breakage. *Remediation:* assign weather generation (League seasonal template or Match per-fixture) with an explicit `WorldRng` sub-label per `ADR-0018` §3; define parameters + liveness (forecast vs live).

**G24 — Live-match intervention buffer / pause-vote spam policy.** `missing-gameplay-rules`, **medium**, no human decision required.
`state-machines/match.md` and `ADR-0026` §8 defer intervention buffering semantics; `state-machines/watch-party.md` §5.1 names pause budgets but provides no FSM, leaving spam/jank surfaces. *Remediation:* add a Match-owned intervention-buffer policy (max size, acceptance window, rejection feedback) and a watch-party pause-vote FSM (budget/cooldown/audit per active manager per half).

**G25 — Async escalation thresholds + watch-party deadline mutation.** `unclear-invariants`, **medium**, no human decision required.
`transfer-negotiations-p2p.md` §3 lists 5 escalation stages without quantified thresholds/decay; `watch-party-and-conference.md` §1 claims "async core unchanged" while `state-machines/watch-party.md` §3 has watch-party *mutate* match deadlines. *Remediation:* spec escalation FSM with thresholds + decay; add explicit League-Orchestration rule that on `MatchdayOpened` it reads watch-party `broadcast_at` as deadline source-of-truth (resolving the additive-vs-mutative contradiction).

**G26 — Doc-hygiene: stale flags, ADR status sync, dangling refs.** `doc-hygiene-structure`, **low**, no human decision required.
Multiple stale signals: GD-0014 still lists R2-08 as open though resolved by `determinism-and-replay.md`; `ADR-0003` reads "Accepted" while superseded-as-planning-target by `ADR-0049`; GD-0007 status field out of sync with its "Approved" framing; `ADR-0060` references "Scouting / Transfer" pre-dating `ADR-0064`; accepted `ADR-0056`/`ADR-0057` reference unratified `ADR-0059`. *Remediation:* sweep stale "open" flags after resolution, add "deprecated-for-planning" notes to superseded-but-accepted ADRs, sync front-matter status fields, and update cross-references after each ratification.

---

### Cross-cutting systematic observations (not individual gaps)

1. **Ratification-sequencing chain.** Six proposed/draft ADRs (0030, 0052, 0054, 0059, 0060, 0064) gate downstream work; several are referenced by already-accepted ADRs. These are decision gates for Nico, not engineering gaps — but G1/G7/G15/G16/G17/G22 cannot fully close until the relevant ADR is ratified.
2. **Determinism + per-save RNG discipline** recurs across G8, G9, G21, G23: every stochastic system must declare its `WorldRng`/`InjuryRng`/etc. sub-label per `ADR-0018` §3 before implementation.
3. **Event-publication contracts** (G11, G14, G18, G25) are the dominant *missing-cross-domain-contract* pattern: ownership is mostly clear, but the command/event/query signatures between contexts are unspecified. A standard eligibility-saga + newsworthiness-event template would close most of them at once.

# Section E — Obsidian Vault Design: Recommended Deltas

The existing structure (00-Index hub-and-spoke, 09-Decisions ADRs, 50-Game-Design GDDRs, 60-Research with raw/synthesis split, 90-Meta/templates, supersede discipline) is sound and must be **preserved**. The deltas below are evidence-based additions, not restructurings.

---

## E1 — Open-Questions Register (NEW folder + template)

**Delta:** Add `docs/05-Open-Questions/` with a MOC index + one note per open question, keyed to a stable `OQ-####` ID. Promote the existing `open-question.md` template (already present, currently unused as a folder home) into this register.

**Evidence:**
- Wave-2 blockers (R2-02 attribute generation, R2-03 formation/mentality, R2-04 AI, R2-05 onboarding flow, R2-06 world drift, R2-14 schema) are scattered across GDDR bodies and `95-Archive/gap-reports/research-wave-2-gaps.md` with no live register. They live in an **archived** doc but gate **active** GDDRs.
- Many GDDRs carry "approved body / open numeric calibration" tension (GD-0004, GD-0005, GD-0008) — the open items have no canonical home.
- `90-Meta/templates/open-question.md` exists but no cluster consumes it (orphan template).

**Traceability rule:** every `R2-*`/blocker referenced in a GDDR or ADR body must resolve to one `OQ-####` note; the note links back to the gating decision and forward to the research that will close it.

---

## E2 — Ubiquitous-Language / Glossary Home (PROMOTE existing)

**Delta:** Elevate `00-Index/Glossary.md` (currently 8 terms) into a maintained ubiquitous-language register, OR add `docs/15-Domain-Language/` keyed per bounded context. Add a rule: every DDD term in the binding vocabulary (aggregate names, domain events, read models) is defined once.

**Evidence:**
- 19 ratified + 5 proposed bounded contexts with strict "commands + queries + domain events only" communication, but the glossary holds **8 meta terms** (Beat, Vault, etc.) — none of the actual domain vocabulary (e.g., "settlement fact", "cost fact", "wage fact", "Investor entitlement", "rivalry sub-score").
- Contracts-first DDD with no single ubiquitous-language source risks divergent term use across the 26 binding + 37 draft research docs.

---

## E3 — Cross-Domain Contract / Event Map (NEW note)

**Delta:** Add `docs/10-Architecture/cross-context-contract-map.md` — a single matrix of producer context → consumer context → contract type (command / query+read-model / domain event), with the event/command name and its Zod schema location.

**Evidence:**
- Communication rules are binding (commands + queries/read-models + domain events; NO cross-context joins; Club Management sole ledger writer via Customer-Supplier + ACL), but this surface is **inlined across arc42 §4/§5 and 24 individual ADRs** with no consolidated map.
- Inventory flags: "Cross-cutting infrastructure inlined in arc42 §4/§5 rather than dedicated map." The settlement/cost/wage-fact flows (ADR-0050/0058/0061/0062/0063) are the most cross-cut surface and have no single producer/consumer view.
- Economy cluster chain (blueprint→impact-map→contracts→catering→fan-service→financing) crosses Club Management ↔ CommercialPortfolio ↔ Audience repeatedly; a map prevents the noted "ledger-writer vs settlement" boundary erosion.

---

## E4 — Issue-Staging / Backlog-Proposal area (NEW folder)

**Delta:** Add `docs/40-Execution/backlog-staging/` for *proposed* (not-yet-created) Linear items, with a `BL-####` staging ID and an explicit "promoted to FMX-## on <date>" field.

**Evidence:**
- All 55 FMX issues are DONE; there is **no open backlog**, yet the no-dev phase keeps generating proposed work (new GDDRs GD-0018..0023, proposed contexts ADR-0052/0054/0059/0060/0064). New proposals currently have nowhere to live between "idea in a doc body" and "Linear issue."
- The legacy `90-Meta/github-issue-suite/` (obsolete, Linear-superseded) shows the failure mode of an unstructured staging area; a governed staging folder with a supersede/promote field avoids re-creating that drift.

---

## E5 — Research-to-Decision Traceability Rule (NEW convention, no new folder)

**Delta:** Add a mandatory frontmatter field pair: research notes carry `feeds: [ADR-####, GD-####]`; ADRs/GDDRs carry `grounded_by: [research-note paths]`. Add a thin `60-Research/traceability-matrix.md` generated/maintained view.

**Evidence:**
- Inventory states "research systematically feeds ADRs/GDDRs" and "all synthesis docs map via frontmatter" — but also flags **blurred fact-vs-decision** ("club-economy-impact-map is labeled research but treated as architecture authority") and "RESEARCH INTEGRATION OPAQUE" (implementation notes cite research as binding spec).
- Bidirectional links make the fact→choice boundary explicit and let an audit confirm every accepted ADR is grounded and every locked research note has a downstream decision.
- 49 raw-Perplexity transcripts already use a one-way "synthesised in" link; this extends the same discipline up the chain.

---

## E6 — Status/Binding Coherence Convention (NEW rule + lint)

**Delta:** Define a single canonical status model in `00-Index/Documentation-V1.md` and a Bugbot/CI check: `status` (frontmatter) and any "Approved" body section and `binding` must not conflict. Where a doc is reopened-to-draft but its body is binding direction, require an explicit `body_binding: true` flag.

**Evidence:**
- Repeated, systemic inventory findings: "FRONTMATTER 'status: draft' vs body 'Approved'" across GD-0001/04/05/06/07/09/11/12/13/14/15/16; "BINDING FIELD INCONSISTENCY"; "STATUS MISALIGNMENT" (draft features referencing binding ADRs); "BINDING FLAG INCOHERENCE" (16 binding / 15 non-binding implementation notes with no pattern).
- This is the single most-cited hygiene defect in the inventory and currently relies on README prose heuristics ("approved body wins") that are not machine-checkable.

---

## E7 — Feature-Spec Density Template + Feature↔Implementation Map (PROMOTE + NEW)

**Delta:** (a) Enforce the existing `90-Meta/templates/feature-spec.md` as a minimum-density gate (user stories, acceptance criteria, scenarios, out-of-scope, dependencies). (b) Add a `feature ↔ implementation-note ↔ ADR` column to `00-Index/Feature-Map.md`.

**Evidence:**
- "FEATURE SPEC DISCIPLINE VARIANCE" (60–300 LOC, no minimum), "FEATURE COMPLETENESS ASYMMETRY," and "INDEX/MOC FRAGMENTATION" (no SoT answering "which implementation note serves feature X?").
- "SPECIFICATION DRIFT": implementation notes (club-economy-accounting-ledger, club-economy-commercial-contracts) exist at higher precision than the feature they implement; a mapping column makes the inversion visible.

---

## E8 — Superseded-Link Hygiene Rule (NEW convention)

**Delta:** Convention: when a doc is marked `superseded`, all *active* docs must repoint wikilinks to the superseding doc; the superseded doc keeps only a banner + back-pointer. Add a periodic link-audit (graph query) to the vault-governance checklist.

**Evidence:**
- "SUPERSEDED BUT UNCLEAN": `pwa-offline-strategy` and `surrealdb-integration` are superseded yet still wiki-linked from active docs.
- Orphan remnant: `50-Game-Design/fan-ecology.md` superseded by `audience-and-atmosphere.md` but both exist and are reachable.
- Clean supersede chains already exist for ADRs (0001→0021, 0004→0027, 0013→0028) — this rule generalizes that proven discipline to research + implementation + game-design clusters.

---

## E9 — System-Note ↔ GDDR Ownership Rule (NEW convention)

**Delta:** Require every `50-Game-Design/*-system.md` / gameplay-spec note to declare an `owning_gddr:` field; where none exists (e.g., `club-dna-and-governance`, `stadium-and-campus`, no GD-0010 system note), either create the GDDR stub or mark the note `binding: false, owner: none (orphan)`.

**Evidence:**
- "HIDDEN GAPS": no dedicated system note for GD-0010 (AI world); "SYSTEM-NOTE STATUS DRIFT": many `binding:true` system notes with no corresponding GDDR (club-dna-and-governance, stadium-and-campus) → "Unclear ownership in some cases."
- 23 GDDRs vs 23 system notes is not 1:1; explicit ownership prevents spec/decision drift.

---

## Summary of New Artifacts

| Delta | Type | Location | Motivating observation |
|---|---|---|---|
| E1 | New folder + adopt template | `05-Open-Questions/` | R2-* blockers archived but gate active GDDRs; orphan `open-question` template |
| E2 | Promote/extend | `00-Index/Glossary.md` or `15-Domain-Language/` | 8 meta terms, zero domain vocabulary for 24 BCs |
| E3 | New note | `10-Architecture/cross-context-contract-map.md` | contracts inlined across arc42 + 24 ADRs |
| E4 | New folder | `40-Execution/backlog-staging/` | no home for proposed work; legacy issue-suite drift |
| E5 | New convention + matrix | frontmatter + `60-Research/traceability-matrix.md` | blurred fact-vs-decision; opaque research integration |
| E6 | New rule + CI lint | `Documentation-V1.md` + Bugbot | most-cited defect: status/binding incoherence |
| E7 | Promote template + map column | `feature-spec.md` + `Feature-Map.md` | spec-density variance; feature↔impl fragmentation |
| E8 | New convention | `vault-governance.md` checklist | unclean superseded links; fan-ecology orphan |
| E9 | New convention | `50-Game-Design` frontmatter | orphan system notes, no GD-0010 note |

**Guardrail:** All nine are additive conventions/registers/maps over the existing hub-and-spoke structure — none move or rename current binding docs. Each requires Nico's approval before adoption (no agent self-decision), consistent with the ask-first gate.

## Section F — Linear Backlog (created in FMX)

**10 epics (parent issues) + 37 children + 22 dependency relations**, all created in Linear team FMX on 2026-06-02, state = Backlog. Every issue is PROPOSE-only (Nico ratifies). Full issue bodies (problem / objective / context / scope / out-of-scope / deliverables / acceptance criteria / dependencies / labels / priority / owner / source docs / open questions / planning-agent blueprint) live in Linear; this note is the durable index. `By` = blocked-by, `~` = related-to (order-tolerant).

### FMX-56 — Epic E0: Proposed-Context Ratification Gate

| Child | Linear | Pri | Deps | Title |
|---|---|---|---|---|
| E0-1 | FMX-73 | Urgent | — | Ratify-ready dossier: People / Persona & Skills (ADR-0052) |
| E0-2 | FMX-71 | Urgent | By FMX-73 | Ratify-ready dossier: Narrative context (ADR-0054) + ADR-0030 sequencing |
| E0-3 | FMX-76 | High | By FMX-73 | Ratify-ready dossier: Scouting Activity context (ADR-0064) + map-apply patch |
| E0-4 | FMX-75 | High | By FMX-76 | Ratify-ready dossier: Youth Academy context (ADR-0060) |
| E0-5 | FMX-77 | Medium | — | Ratify-ready dossier: Community Overlay Pipeline (ADR-0059) |

### FMX-57 — Epic E1: League, Competition & Fixture Foundation

| Child | Linear | Pri | Deps | Title |
|---|---|---|---|---|
| E1-1 | FMX-79 | Urgent | — | Competition Registry sub-aggregate schema inside League Orchestration |
| E1-2 | FMX-72 | Urgent | By FMX-79 | Fixture scheduling + commands/events/queries contract |
| E1-3 | FMX-78 | High | By FMX-79, By FMX-72 | FixtureCommercialProfile + CompetitionRevenueProfile publication contract |
| E1-4 | FMX-74 | High | By FMX-79, By FMX-72 | Fixture/competition eligibility hand-off to Regulations & Compliance |

### FMX-58 — Epic E2: Match Determinism & Tactical Contracts

| Child | Linear | Pri | Deps | Title |
|---|---|---|---|---|
| E2-1 | FMX-70 | High | — | Set-piece variant selection determinism in TacticSnapshot |
| E2-2 | FMX-67 | Medium | By FMX-70 | Opposition-template AI consumption contract |
| E2-3 | FMX-68 | High | — | Tactical-identity fingerprint aggregation algorithm spec |
| E2-4 | FMX-69 | High | By FMX-70 | Set-piece-coach effect-readiness multiplier curve GDDR |
| E2-5 | FMX-66 | Medium | By FMX-72 | Weather ownership + RNG/determinism path |

### FMX-59 — Epic E3: Player & Squad Lifecycle FSMs

| Child | Linear | Pri | Deps | Title |
|---|---|---|---|---|
| E3-1 | FMX-85 | High | ~FMX-75 | [FMX] E3-1 — Loan-Orchestration Process Manager ADR (Transfer-led) |
| E3-2 | FMX-81 | High | — | [FMX] E3-2 — Player contract renewal / expiry / Bosman FSM ownership + spec |
| E3-3 | FMX-80 | Medium | — | [FMX] E3-3 — Player discipline sub-aggregate ownership split (cards / suspension / appeals) |
| E3-4 | FMX-86 | High | By FMX-73, By FMX-76 | [FMX] E3-4 — Hidden-attribute substrate mapping GDDR (8-meta / OCEAN / labels) |

### FMX-60 — Epic E4: Narrative, Dialogue & Newsworthiness

| Child | Linear | Pri | Deps | Title |
|---|---|---|---|---|
| E4-1 | FMX-83 | High | — | Newsworthiness / event-publication semantics for narrative surfaces |
| E4-2 | FMX-87 | High | — | Dialogue-intent taxonomy + mechanical effect matrix |
| E4-3 | FMX-82 | Medium | — | Media-outlet operational behaviour ownership decision |
| E4-4 | FMX-88 | High | — | AI narration scope freeze + fallback-template coverage rule |

### FMX-61 — Epic E5: AI World Simulation & Dynasty Arc

| Child | Linear | Pri | Deps | Title |
|---|---|---|---|---|
| E5-1 | FMX-91 | High | By FMX-79 | AI world-drift algorithm spec (rival drift, fallen-giant, rising nations) → calibration handoff |
| E5-2a | FMX-89 | High | By FMX-91 | Dynasty board-ambition escalation + ownership-transition & bankruptcy FSMs |
| E5-2b | FMX-84 | Medium | By FMX-79, By FMX-72, By FMX-91, By FMX-89 | National-team (Bundestrainer) dual-role late-game arc |
| E5-2c | FMX-90 | Medium | By FMX-89 | Dynasty engagement-flatline investigation + prestige/HoF metric inputs |
| E5-3 | FMX-93 | Medium | By FMX-68 | Manager-archetype taxonomy & perk/prestige balancing approach (GD-0019) — confirm MVP-hooks-only stance |

### FMX-62 — Epic E6: Economy Settlement Pipelines & Read-Models

| Child | Linear | Pri | Deps | Title |
|---|---|---|---|---|
| E6-1 | FMX-92 | Medium | By FMX-78 | Background-fast quality-profile cost settlement pipeline |
| E6-2 | FMX-94 | Medium | — | Statistics & analytics read-model owner assignment |
| E6-3 | FMX-95 | Medium | By FMX-90, By FMX-94 | Awards / honours / records / Hall of Fame owner |

### FMX-63 — Epic E7: UX, Onboarding & Match Presentation

| Child | Linear | Pri | Deps | Title |
|---|---|---|---|---|
| E7-1 | FMX-98 | High | — | Mobile route map + IA + client-state pattern (ratify ADR-0008) |
| E7-2 | FMX-99 | High | By FMX-98 | Onboarding 60-second flow / guided first season spec |
| E7-3 | FMX-100 | High | By FMX-98 | Match rendering & in-match controls UX (ADR-0024/0041) |

### FMX-64 — Epic E8: Live-Match & Async Coordination

| Child | Linear | Pri | Deps | Title |
|---|---|---|---|---|
| E8-1 | FMX-101 | Medium | By FMX-100 | Live-match intervention buffer + watch-party pause-vote policy |
| E8-2 | FMX-102 | Medium | By FMX-72 | Async escalation FSM + watch-party deadline-mutation resolution |

### FMX-65 — Epic E9: Vault Hygiene & Cross-Reference Sync

| Child | Linear | Pri | Deps | Title |
|---|---|---|---|---|
| E9-1 | FMX-97 | Low | — | Sweep stale open-flags + sync front-matter status fields |
| E9-2 | FMX-96 | Low | — | Update cross-references after ratifications |


# Section G — Planning-Agent Blueprint (reusable framework)

> **What this is.** A copy-pasteable operating procedure a future planning agent
> applies to *any* Football Manager X backlog issue. It encodes the FMX
> governance contract (agents **propose**, Nico **decides**), the read-first /
> research-grounded / ask-first / supersede-disciplined workflow, and the
> same-PR vault-update rule. Fill the `«slots»`. Nothing here authorizes a
> technology, gameplay, architecture, boundary, scope, or security/privacy
> decision — those are always Nico-gated.
>
> **Canonical authorities this blueprint defers to** (read, never restate):
> `docs/90-Meta/collaboration-and-decision-protocol.md` (roles, decision gate,
> phase, currency policy) · `docs/90-Meta/agent-memory-protocol.md` (session
> start/during/wrap-up) · `docs/90-Meta/vault-governance.md` (memory classes,
> canonical-location rule, supersede discipline) · `docs/10-Architecture/bounded-context-map.md`
> (binding domain model) · the templates under `docs/90-Meta/templates/`.

---

## G.0 — Copy-paste header (fill before starting)

ISSUE:            «FMX-NN — short title»  (Linear team FMX)
ONE-LINE ASK:     «what Nico actually wants decided/anchored»
ISSUE TYPE:       ☐ bounded-context / boundary  ☐ gameplay/system (GDDR)
                  ☐ tech/library/version (ADR)  ☐ economy/calibration
                  ☐ research-only anchor        ☐ other: «…»
TOUCHES (guess):  «contexts / aggregates / existing ADRs+GDDRs likely affected»
DECISION SURFACE: ☐ technology ☐ gameplay ☐ architecture ☐ data model
                  ☐ module boundary ☐ public API/contract ☐ scope
                  ☐ security/privacy   → if ANY ticked, ask-first gate applies
RISK LABELS:      ☐ risk:legal  ☐ risk:privacy  ☐ IP-safety (GD-0015/ADR-0007)

---

## G.1 — Enter planning/research mode (do this first, every time)

1. **Affirm the phase.** Current phase is *research / analysis / architecture
   planning — no development*. Output is **vault notes + a decision pack**, never
   code, never a unilateral decision. (Confirm phase is still this in
   `Current-State.md`; if it changed, stop and re-read the protocol.)
2. **Affirm the gate.** If any box in `DECISION SURFACE` is ticked, you will
   **stop and ask Nico** before committing to an answer — you may *recommend*,
   never *decide*.
3. **State your plan back in one short paragraph** (issue, what you'll read,
   what you'll research externally, what decision pack you'll produce, which
   vault notes you expect to draft). Do not start research until this is stated.

---

## G.2 — Read the right vault notes first (read-only; cite paths)

Read in this order; stop expanding once you can name the exact owner(s),
invariants, and open questions for `«FMX-NN»`.

**Always (session-start chain):**
- `docs/00-Index/Agent-Onboarding.md`
- `docs/00-Index/Current-State.md` (hot memory — look for prior bulletins on
  `«FMX-NN»` and sibling tickets; note what is `accepted` vs `draft`/reopened)
- `docs/90-Meta/collaboration-and-decision-protocol.md`
- `docs/90-Meta/vault-governance.md` (memory classes + supersede discipline)
- `docs/10-Architecture/bounded-context-map.md` (the binding 19-context model +
  §3 communication rules: commands + queries/read-models + domain events only;
  **no cross-context table joins**; Club Management = sole finance-ledger writer)

**Issue-scoped (pick by `ISSUE TYPE`):**
- Decision indexes — `docs/00-Index/Decision-Log.md` (ADRs),
  `docs/50-Game-Design/README.md` (GDDRs), `docs/60-Research/00-summary.md`
  (research), `docs/20-Features/README.md` (features).
- Every **`accepted`/`approved`** ADR/GDDR the issue touches (these are binding —
  you build *on* them, you do not contradict them).
- Every **`draft`** ADR/GDDR/research it touches (intent layer: read for
  direction so you don't re-decide; never cite as settled, never implement from).
- Adjacent **proposed contexts** if relevant (People ADR-0052, Narrative
  ADR-0054, Youth Academy ADR-0060, Community Overlay ADR-0059, Scouting
  Activity ADR-0064).
- The linked **Linear** issue (team FMX) + the latest **session handoff** under
  `docs/40-Execution/session-handoffs/` if continuing a thread.

**Output of G.2 — a short "what the vault already says" memo:**
- Current canonical owner(s) of the concern + binding invariants that constrain
  the answer.
- What is already decided (`accepted`/`approved`) vs still open (`draft`).
- The precise **gap / question** `«FMX-NN»` must close (one sentence).
- Notes likely to be **drafted** vs **refined** vs **superseded** (name paths).

> **Anti-duplication check (binding):** all 55 prior FMX issues are DONE and
> anchored. Confirm `«FMX-NN»` is not re-proposing completed-and-anchored work.
> If it overlaps, your deliverable is a *refine/supersede*, not a new parallel
> note.

---

## G.3 — Research externally (grounded, current, sourced)

Never guess facts or "latest" versions. Route by question kind:

| Question kind | Primary tool | Then |
|---|---|---|
| Domain / real-world football, finance, regulation, genre precedent (FM/EA FC/OOTP/FIFA Manager/Anstoss), DDD precedent | **Perplexity** (`perplexity-ask`) | Save raw transcript |
| Library / framework / SDK / CLI docs + APIs + migration | **context7** + **Ref (ref.tools)** | Per currency policy |
| Real latest stable version | `git ls-remote --tags`, repo default branch `--symref HEAD`, release notes | **never assume `latest`** |
| Deep multi-source fact-check | `deep-research` skill | Cite every claim |

**Currency policy (binding, never optional):** before proposing *or* upgrading
any lib/framework/tool, read its **current** docs + best practices via context7
and Ref, verify the **real** newest stable version, and plan an **exact pin**
(no floating ranges). Staying on an outdated version, or any migration with major
complications → **HITL/Nico**, never an agent decision.

**Raw-transcript discipline:** drop raw Perplexity output under
`docs/60-Research/raw-perplexity/raw-«topic»-«YYYY-MM-DD».md` with
`status: raw`, then **synthesize** into a clean research note (see G.6). Every
external claim carries a **source** and a **confidence** (high/medium/low).

**Structure the evidence on three axes** (proven FMX pattern for
boundary/system issues): **Genre** (how comparable games solve it) ·
**DDD / industry** (Vernon/Evans patterns + real software analogues) ·
**Real-world 2023–2026** (current football/regulatory/financial practice).
For a boundary issue, additionally run the **DDD split-criteria** check and
report how many of six fire (linguistic boundary, independent lifecycle,
distinct invariants, separate team/ownership, different change cadence,
external-integration seam).

---

## G.4 — Prepare the PM-facing decision pack (the core deliverable)

A single, skimmable pack for Nico. Sections:

1. **TL;DR (≤5 lines).** The gap, your recommended option, the single biggest
   trade-off, and whether the ask-first gate is triggered.
2. **What the vault already binds.** Accepted ADRs/GDDRs + invariants the answer
   must respect (esp. communication rules + sole-ledger-writer rule).
3. **Best practices (sourced).** 5–10 bullets from G.3, each with source +
   confidence; group by the three axes.
4. **Options — 2 to 3, each with:**
   - one-line description;
   - how it scores on the split-criteria / fit-to-invariants;
   - **trade-offs** (pro / con / risk / future-proofing — does it foreclose
     later evolution?);
   - blast radius (which contexts/contracts/ADRs change);
   - currency/version implications if any.
   Include an explicit **anti-pattern option** to reject, where instructive.
5. **Recommendation.** One option, stated decisively, with the *why-over-the-
   others* in 2–3 sentences. Mark it clearly as a **proposal pending Nico**.
6. **Proposed public contract (direction only).** Commands / queries+read-models
   / domain events as named JSON/Zod-shaped items (e.g. `DoXRequested`,
   `XBecameStale`, `XSnapshot`) — boundaries via Customer-Supplier + ACL; **no
   cross-context joins**. This is a sketch for ratification, not a final schema.
7. **Map / supersede impact (if any).** Exact patch you *propose* to
   `bounded-context-map.md` / affected ADRs — described, **not applied** (the
   map is edited only on ratification).
8. **Decision questionnaire** → G.5.

---

## G.5 — Ask Nico only the decisions that truly need a human

Filter ruthlessly: ask **only** items on the `DECISION SURFACE` (technology /
gameplay / architecture / data model / boundary / public API / scope /
security-privacy) or genuine trade-offs research can't settle. Everything an
agent can ground and decide reversibly, decide and just *note*.

Format each question as a tight, answerable unit:

Q«n». «decision needed in one line»
  Why human: «which gate / why irreversible / why preference-driven»
  Options:   A) «…»   B) «…»   C) «…»
  Agent recommendation: «X» — «one-line reason»
  Default if unanswered: «what you'll assume to keep moving» (or: BLOCKS)

If a question hard-blocks progress: escalate via **Linear (team FMX), beat =
Blocked**, and stop. Do not work around a gated decision.

---

## G.6 — Update the vault AFTER ratification (same-PR, supersede-disciplined)

> **Order is binding.** Draft notes may be written *as proposals* during
> planning, but anything that asserts a **decision** waits for Nico's
> ratification. ADRs stay `status: draft` / `binding: false` until Nico flips
> them to `accepted` / `binding: true`; GDDRs stay `draft` until `approved`. An
> agent **never** self-accepts.

**On ratification, in the same PR:**

1. **Research note** — synthesize raw → `docs/60-Research/«topic»-«YYYY-MM-DD».md`
   from `templates/research-note.md` (`status: draft`, `binding: false`,
   `sourceType`, `linear: FMX-NN`, Question / Summary / Findings(+source+confidence)
   / Inputs-For-Decisions / Future-scope). Keep the `raw-perplexity/…` file.
2. **ADR** (architecture/boundary/tech) — from `templates/adr.md`
   (`docs/10-Architecture/09-Decisions/ADR-NNNN-«slug».md`): Context / Options
   Considered / Decision / Rationale / Consequences (pos+neg) / Supersedes /
   Related. New number = max existing + 1. **Map patch:** propose against
   `bounded-context-map.md`; apply the map edit **only** when Nico ratifies the
   context bump (e.g. the 19→20 pattern in ADR-0064 — ADR carries the patch, map
   stays untouched until ratify).
3. **GDDR** (gameplay/system) — from `templates/game-design-note.md` into
   `docs/50-Game-Design/`; numbers stay **IP-clean calibration ranges**, never
   final constants; respect creative IP-safe naming (GD-0015 + ADR-0007).
4. **Feature spec** (if user-facing scope) — `docs/20-Features/` via
   `templates/feature-spec.md`.
5. **Indexes** — add/De-orphan in `Decision-Log.md` / `50-Game-Design/README.md`
   / `60-Research/00-summary.md` / `20-Features/README.md` as applicable.
6. **Current-State.md** — add a dated bulletin (`> **FMX-NN «title» (YYYY-MM-DD).**
   …`) summarizing the proposed/ratified target, what was refined vs drafted, and
   the explicit **Nico-gated / future-scope** residue. Update `updated:` and the
   `related:` frontmatter links.
7. **Supersede discipline** (when an approach changes — never silent overwrite):
   create/extend the replacement → set old note `status: superseded` → fill
   `supersedes` / `superseded_by` both directions → paste the dated SUPERSEDED
   banner under the old H1 (keep old content) → update Current-State + maps.
8. **Connectivity** — every new note is wiki-linked in and out (no orphans); one
   canonical truth per fact.
9. **Linear** — link the final vault paths back onto `«FMX-NN»`; record any
   decisions still needing promotion.
10. **Session handoff** — write/update `docs/40-Execution/session-handoffs/`
    (via `templates/handoff.md`): completed work, open tasks, blockers, changed
    paths, decisions awaiting ADR/GDDR promotion.

---

## G.7 — Pre-handoff checklist (gate before you finish)

- [ ] Phase respected — proposals/notes only, **no code, no self-accepted decision**.
- [ ] Every accepted/approved invariant respected (communication rules; sole
      finance-ledger writer; no cross-context joins).
- [ ] Not re-proposing completed-and-anchored work (anti-duplication done).
- [ ] Every external claim has source + confidence; versions verified, exact-pinned.
- [ ] Decision pack has 2–3 options + trade-offs + one clear recommendation.
- [ ] Questionnaire asks *only* truly-human (gated) decisions; rest decided+noted.
- [ ] Vault updates only after ratification; supersede discipline applied; indexes
      + Current-State + Linear + handoff updated **in the same PR**.
- [ ] Gated/legal/IP items flagged; `risk:*` labels set; escalation via Linear
      (beat=Blocked) where blocked.
- [ ] PR opened — **not** self-merged to `main` (merge authority = Nico).

---

## G.8 — Hard rules (never violate)

- Agents **propose**, Nico **decides**. No unilateral technology / gameplay /
  architecture / data-model / boundary / public-API / scope / security calls.
- **No shortcuts for speed.** Thoroughness and durable foundations first.
- **Grounded only** — no guessed facts or versions; context7 + Ref + Perplexity,
  cited and filed.
- **One canonical truth per fact**; supersede, never silently overwrite.
- Contexts talk **only** via commands + queries/read-models + domain events
  (JSON/Zod); **no cross-context table joins**; Club Management is the sole
  finance-ledger writer.
- Keep secrets / local Obsidian state / sensitive data out of the vault and out
  of external services.

This blueprint mirrors the actual FMX conventions verified against `docs/90-Meta/collaboration-and-decision-protocol.md`, `docs/90-Meta/agent-memory-protocol.md`, `docs/90-Meta/templates/{adr,research-note}.md`, the `raw-perplexity/` convention, the `Current-State.md` bulletin style, and the FMX-27/ADR-0064 (19→20 context) exemplar.


---

## Section H — Recommended Next Sequence

The single highest-leverage move is resolving the **ratification gate (E0)** — five draft
contexts unblock most downstream work, and Community Overlay clears active binding debt.

**Decision-first (queue for Nico, in order):**

1. **Community Overlay Pipeline** (E0-5) — ratify or re-architect; clears binding debt in *accepted*
   ADR-0056/0057. Highest priority.
2. **Competition & Fixtures ownership** (E1-1) — own BC vs League sub-aggregate; unblocks the one
   critical gap G1 (gates Match scheduling, cup revenue, per-competition windows).
3. **People + Narrative + the LLM legal gate** (E0-1, E0-2) — the keystone unblocker (People feeds
   G13/G22/Scouting/Staff; Narrative must ratify before ADR-0030 binds).
4. Staff-skill MVP option (A/B/C); media-outlet ownership (fold into Narrative).

**Execution waves (from the dependency graph):**

- **Wave 0** (parallel, no deps): E0-1, E0-2, E0-5, E1-1, E2-1, E2-3, E3-2, E3-3, E4-1, E4-4, E6-2,
  E7-1, E9-1.
- **Wave 1:** E0-3 (needs People), E0-4 (needs Scouting), E1-2, E2-2, E2-4, E4-2, E4-3, E5-1
  (needs Competition), E7-2, E7-3, E6-3.
- **Wave 2:** E1-3, E1-4, E2-5, E3-1 (loan PM), E3-4, E5-2a, E5-2c, E6-1, E8-1, E8-2.
- **Wave 3:** E5-2b, E5-3, E9-2 (cross-ref sync after ratifications).

**Resolve-first to kill the most downstream ambiguity:** the **event-publication contract template**
(G14) and **per-save RNG sub-label discipline** (G8/G9/G23) — cross-cutting patterns that, standardized
once, close a cluster of gaps at a stroke.

---

## Consistency fixes applied before backlog creation

The adversarial consistency review (full report below) ran 6 checks (3/5/6 PASS; 1/2/4 FAIL, minor/fixable).
All 8 recommended fixes were applied to the issues created in Linear:

1. **`PlayerSuspended` dedup** — E3-3 (Discipline) is sole author of the schema; E4-1 consumes only.
2. **ADR-0051 HoF dedup** — E6-3 is sole owner of the records amendment; E5-2c only feeds it metric inputs.
3. **E5-2 split** into E5-2a (board/ownership/bankruptcy FSMs), E5-2b (national-team arc), E5-2c
   (flatline + HoF metric inputs) → backlog count 35 → **37**.
4. **FMX-52 framing** — references point at the `economy-calibration-and-soak-test` runbook, not a reopened ticket.
5. **G25 boundary** — E1-4 carries a reserved hook only; E8-2 owns the deadline-mutation resolution.
6. **E3-1↔E0-4** — downgraded from a hard block to an order-tolerant `relatedTo` relation.
7. **E0-lane provenance** — E0-1..E0-5 are ratification-gate items (cross-cutting obs #1), not numbered gaps;
   stated on the E0 epic. The gap register is a subset of total backlog scope.
8. **`needsHumanDecision` reconciliation** — `needs:nico-decision` added to E4-1 and E6-2 (both carry real boundary calls).

> Label note: the workflow's `type:feature` was remapped to the live FMX taxonomy (`type:game-design` for
> E7-2; dropped as redundant where `type:adr` already present) — adding a new label is a taxonomy decision
> reserved for Nico.

---


## Adversarial Consistency Review (full report)

# Adversarial Consistency Review — Backlog vs Gap Register

## Check 1 — Gap coverage (every gap → ≥1 issue): **FAIL**

Mapping of the 26 gaps to issues:

| Gap | Covered by | Notes |
|---|---|---|
| G1 | E1-1, E1-2, E1-3, E1-4 | strong |
| G2 | E5-2 | ok |
| G3 | E5-3 | ok (hooks-only stance) |
| G4 | E7-2 | ok |
| G5 | E7-1 | ok |
| G6 | E7-3 | ok |
| G7 | E4-4 | ok |
| G8 | E5-1 | ok |
| G9 | E2-1 | ok |
| G10 | E2-3 | ok |
| G11 | E2-2 | ok |
| G12 | E2-4 | ok |
| G13 | E4-2 | ok |
| G14 | E4-1 | ok |
| G15 | E3-1 | ok |
| G16 | E3-2 | ok |
| G17 | E4-3 | ok |
| G18 | E3-3 | ok |
| G19 | E6-2 | ok |
| G20 | E6-3 | ok |
| G21 | E6-1 | ok |
| G22 | E3-4 | ok |
| G23 | E2-5 | ok |
| G24 | E8-1 | ok |
| G25 | E8-2 | ok |
| G26 | E9-1 (sweep half), E9-2 (cross-ref half) | ok |

All 26 gaps are covered. **However the check fails because the gap register is not the only scoped work**: the five E0 ratification dossiers (People/Narrative/Scouting/Youth/Community-Overlay) are NOT in the G1–G26 register at all. They are real, sized issues with no corresponding gap ID, so the register and the backlog are not in 1:1 correspondence. This is acceptable IF E0 is intentionally a separate "proposed-context ratification gate" lane — but nothing in the deliverable states that the gap register is a *subset* of backlog scope. Fix needed below.

Fixes:
- Add an explicit note that E0-1..E0-5 are ratification-gate items derived from the "cross-cutting systematic observation #1" (ratification-sequencing chain), not from a numbered gap, so coverage auditing is unambiguous.
- G19 and G14 are marked `needsHumanDecision:false` in the register, but their issues (E6-2, E4-1) still carry/imply Nico decisions (E6-2 "dedicated service vs sub-projection" is explicitly a boundary call; E4-1 open question on PlayerSuspended source). Either the register severity flag or the issue's decision framing is wrong — reconcile.

## Check 2 — Duplicate / overlapping issues: **FAIL (minor, fixable)**

Overlaps found:
- **E3-3 (discipline, G18) vs E4-1 (newsworthiness, G14)** both define `PlayerSuspended`. E4-1 explicitly defers the source-of-truth to G18, and E3-3 defines `PlayerSuspended` as a self-contained payload "satisfying G14". This is coordinated, but two issues both claim to specify the same event schema. Risk of divergent schemas.
- **E1-4 and E8-2** both touch G25 (watch-party `broadcast_at` deadline source-of-truth). E1-4 says it only "acknowledges the interaction with a reserved hook"; E8-2 owns the actual resolution. Boundary is stated but thin — two issues editing `league-week.md` deadline semantics.
- **E6-3 (G20) and E5-2 (G2)** both propose extending/owning ADR-0051 for HoF/records. E5-2 deliverables include "ADR-0051 revision... owning cross-save HoF/records (resolves G20 alongside)" while E6-3 is the dedicated G20 owner. Direct double-ownership of the same ADR amendment.

Fixes:
- Declare E3-3 the sole authority for the `PlayerSuspended` schema; E4-1 must consume it, not redefine it (tighten E4-1 scope wording).
- Make E1-4 strictly forbidden from editing deadline semantics; restrict it to a named reserved hook that E8-2 consumes.
- Remove the HoF/records ADR-0051 amendment from E5-2 deliverables and reference E6-3 as the owner (E5-2 should consume, not co-edit).

## Check 3 — Dependency chains coherent & acyclic: **PASS (with one inconsistency)**

Chains are acyclic. Spot-checks: E1-1→E1-2→{E1-3,E1-4}; E2-1→{E2-2,E2-4}; E0-1→E0-3→E3-4; E5-1→E5-2; E6-2→E6-3; E2-3→E5-3. No cycles detected.

Inconsistency to fix:
- **E3-1 "Blocked by: E0-4"** but E3-1 also states it "Blocks: full ratification of Youth Academy loan path (ADR-0060)". E0-4 *is* the Youth Academy ratification dossier. So E3-1 depends on E0-4 yet is described as unblocking ADR-0060 — a near-circular framing. Clarify: E3-1 consumes the `YouthLoaned` seam (order-tolerant), it should not hard-block on E0-4 ratification.
- **E3-4 "Blocked by: E0-1, E0-3"** is correct, but its body says it "proceeds independently" of ADR-0052 in one open question — contradicts the hard block. Pick one.

## Check 4 — Granularity appropriate: **PASS (two flags)**

Most issues are well-sized (one ADR/GDDR + contracts + map-patch). Flags:
- **Too big: E5-2** (dynasty arc) bundles board-ambition escalation + ownership-transition FSM + bankruptcy FSM + national-team unlock + prestige/HoF metrics + an empirical flatline investigation. That is 4–5 ratifiable decisions plus a research/instrumentation task. Split: (a) board/ownership/bankruptcy FSMs, (b) national-team arc, (c) flatline investigation + HoF metrics (the last folding into E6-3).
- **Too tiny / merge candidate: E9-1 and E9-2** are both low-severity doc-hygiene chores for the same gap (G26) with the same owner. They are separated only by a ratification dependency. Acceptable as-is, but could be one issue with two phases.

## Check 5 — Clear acceptance criteria: **PASS**

Every issue has checkbox acceptance criteria that are specific and verifiable (schema-describable, invariant-provable, map-patch-not-editing-canonical-file, etc.). E0-1..E0-5 and E1..E9 all conform. No issue ships with vague/untestable AC.

## Check 6 — Realistically agent-handleable with human validation: **PASS**

Decision-bearing issues correctly carry `needs:nico-decision` and enumerate the exact questions for Nico (ratification calls, boundary choices, numeric bands routed to FMX-52). Mechanical issues (E9-1/E9-2, E4-1, E6-2 partially) are agent-executable. The "agents propose, Nico ratifies" gate is respected; no issue self-accepts an ADR.

Caveat: several issues assume external research steps (EU AI Act, FIFA RSTP, deterministic scheduling) that are appropriate, but E4-4 and E2/E5 numeric work depend on FMX-52 calibration runs that do not yet have an issue in this backlog — verify FMX-52 is still a live workflow, not a closed Linear issue (the task brief says all FMX issues are DONE).

---

## Concrete fixes (priority order)

- **Reconcile FMX-52 references**: brief states all 55 FMX issues are DONE, yet E5-1/E5-2/E8-2/E6-1 "route parameters to the FMX-52 calibration gate". Confirm FMX-52 is a reusable *runbook/workflow* (it is anchored as `economy-calibration-and-soak-test-runbook.md`), not a closed ticket; reword "route to FMX-52" → "append to the calibration runbook" to avoid implying a reopened issue.
- **De-duplicate `PlayerSuspended`**: E3-3 owns the schema; E4-1 consumes only.
- **De-duplicate ADR-0051 HoF amendment**: E6-3 owns; remove from E5-2 deliverables.
- **Split E5-2** into ≤3 issues (ownership/board FSMs; national-team; flatline+HoF-metrics).
- **Tighten G25 boundary** between E1-4 (reserved hook only) and E8-2 (resolution).
- **Fix E3-1↔E0-4 framing** (order-tolerant consume, not hard block + reverse-unblock).
- **Resolve E3-4 block-vs-independent contradiction** re ADR-0052.
- **Add E0-lane provenance note** so the gap register is explicitly a subset of backlog scope (E0 = ratification gate, not a numbered gap).
- **Reconcile `needsHumanDecision` flags** for G14/G19 against their issues' actual Nico decisions.


---

## Platform-Tier Follow-up Audit (2026-06-02)

> **Status: draft / proposal — nothing ratified.** Closes the lane-11 gap from the main audit above
> (Identity & Access · Offline Sync · Audit & Security · Save/Persistence · IP). Read-only, evidence-based,
> every candidate gap adversarially challenged (default = dismiss). All remediation items are **proposals**
> pending Nico's ask-first decision gate. Operational backlog: **Linear FMX, new epic E10 ([FMX-103]),**
> children [FMX-104]–[FMX-117].

> **Method.** 45-agent read-only workflow: 5 context lanes (each reading its full canonical doc set against
> the DDD criteria) → adversarial gap-challenge per candidate → cross-cutting synthesis. **39 candidate gaps →
> 16 confirmed, 19 reframed, 4 dismissed.** Confidence on this tier is now **high** (was *medium*).

### Headline findings (independently re-verified)

| # | Severity | Finding | Evidence |
|---|---|---|---|
| 1 | **High** | SurrealDB still named as the live store in `status:current` binding docs after the Postgres move | `threat-model.md` (arch diagram + §RR-7), `gdpr-compliance.md` (backup/erasure boundary), `telemetry-privacy.md` (archive tables), `auth-flows.md` (cold store) vs ADR-0021/0027/0028 |
| 2 | **High** | Two `status:current` threat-models disagree on command integrity, no supersede line | `60-Research/threat-model.md` (server-side HMAC idempotency keys) vs `pre-mortem/threat-model.md` (client Ed25519 signing); latter cites `ADR-0026/0027/0028` by names that no longer match the real ADRs |
| 3 | **High** | No ADR backs **save integrity** — `trust_level`/merkle/engine-hash intent orphaned | spread across ADR-0011 B2 + ADR-0005 only; no owning decision |
| 4 | **High** | AI-generated narrative names have **no IP-enforcement gate** (legal) | rule lives in GD-0015/ADR-0007 (binding); runtime-LLM coverage recorded only in `narrative-content-pipeline` §13.5, not the owning ADR-0054 |
| 5 | Medium | **Audit & Security has no ratified ADR**, yet Identity/Offline-Sync/Save/Narrative hard-depend on it; provenance stored per-emitter, no central retainer | `audit-trail.md` impl-note only; ADR-0028/0017 own the substrate |
| 6 | Medium | **IP-clean invariant has no single owner**; denylist has no runtime-delivery contract for IPGate + AI-narrative consumers | ADR-0007 (seed) / ADR-0059 (packs) / ADR-0054 (free-text) each enforce a slice; denylist is a build-time TS artifact |
| 7 | Medium | Identity **GroupMembership aggregate + session→manager→club-slot binding** unspecified (MP blocker) | substrate in ADR-0004 §4 / ADR-0027 §6 / GDPR §7.1, never lifted to a published contract; matches §C.6 |
| 8 | Medium | Save: **autosave-slot model, corruption recovery, engineVersion live-progression** undefined; GD-0014 slots unreconciled with `save_registry` | GD-0014 + ADR-0005 |

**Recurring shape:** *a status field / capability is mandated but its states, owner, or contract are unspecified* —
GroupMembership FSM, draft-lifecycle FSM, freshness value-object, autosave rotation, IP denylist. And **four
persistence-touching contexts share the same SurrealDB drift**, so P1 is one coordinated sweep, not four patches.

**Correctly dismissed (4, not gaps):** IP / provenance context has no ADR or implementation note; No identity module spec / no consolidated published-contract surface; No owning Save/Persistence context/aggregate; IP-safety has no dedicated ADR; only a GDDR + a naming-schema ADR + implementation notes.

### Proposed backlog delta — 14 items (created in Linear, proposal-only)

New epic **E10 — Platform & Security Tier ([FMX-103])**: the platform/cross-cutting lane had no home in E0–E9.
E10 itself should be ratified at the E0 gate before its child ADRs are drafted.

| Ref | Linear | Epic | Pri | Item |
|---|---|---|---|---|
| P1 | [FMX-110] | E9 ([FMX-65]) | P2 | SurrealDB→Postgres substrate-reconciliation sweep across all binding persistence/security docs (amendment banners + ADR re-anchoring) |
| P2 | [FMX-115] | E0 ([FMX-56]) | P2 | Audit & Security context: ratify-by-reference appendix anchoring cross-cutting ownership (ADR-0028+0017+threat-model) and the provenance emit-vs-retain split |
| P3 | [FMX-104] | E10 ([FMX-103]) | P2 | ADR (draft): Command Signing & Replay Protection — decide HMAC-idempotency+Redis-cache vs Ed25519 per-command signing, reconcile dual threat models |
| P4 | [FMX-105] | E10 ([FMX-103]) | P2 | ADR (draft) 'Save Trust Levels & Command Integrity' — re-home orphaned save-trust intent, ratify trust_level enum + merkle/engine-hash fields + import/export trust matrix |
| P5 | [FMX-113] | E10 ([FMX-103]) | P2 | Identity & Access contract: GroupMembership aggregate + state machine (join/leave/kick/invite) and session→manager→club-slot binding for multiplayer |
| P6 | [FMX-108] | E10 ([FMX-103]) | P3 | Offline Sync draft-lifecycle FSM + FreshnessMeta value-object spec (context-contracts/sync) bound into ADR-0020 |
| P7 | [FMX-106] | E10 ([FMX-103]) | P2 | ADR-0039 'Client Storage Strategy' (draft, vorgeschlagen): quota probe + LRU eviction ownership across Offline Sync vs Save boundary |
| P8 | [FMX-116] | E9 ([FMX-65]) | P2 | ADR-0005 §12 appendix: autosave-slot model + corruption/loss recovery + engineVersion live-progression (consolidated Save-lifecycle contract) |
| P9 | [FMX-109] | E10 ([FMX-103]) | P2 | ADR-0028 appendix: cold-archive tamper-evidence (hash-chain) decision + DSAR-pseudonymisation append-only exception + PseudonymiseUserAuditTrail cross-context command |
| P10 | [FMX-114] | E9 ([FMX-65]) | P2 | IP-clean / Content-Policy cross-cutting section in 08-Crosscutting.md: name single denylist owner + define runtime-delivery contract for IPGate and AI-narrative consumers |
| P11 | [FMX-112] | E0 ([FMX-56]) | P2 | ADR-0054 appendix: IP-denylist validation gate on LLM free-text narrative + IP-grounding contract-test suite |
| P12 | [FMX-111] | E0 ([FMX-56]) | P3 | ADR-0007 ratification appendix: editor free-text-rename EULA ownership + corpus/denylist supersede fixes (Behind the Name forbidden) |
| P13 | [FMX-107] | E0 ([FMX-56]) | P4 | ADR-0059 ratification appendix: Community-pack migration-trigger ownership (Overlay orchestrates, Offline Sync runs) |
| P14 | [FMX-117] | E9 ([FMX-65]) | P3 | Doc-hygiene sweep: anchor thin/under-specified ownership seams in bounded-context-map.md (Save split, account-secret no-orphan, two migration axes, rate-limit detection vs enforcement, secrets posture, stranded outbox spec) |

**Dependency links wired:** P4→P3 (save-trust needs the signing decision); P8→P1+P7 (save-lifecycle needs the
Postgres reconciliation + quota stance); P9→P2 (tamper-evidence needs the Audit & Security anchor); P11→P10
(LLM gate consumes the published denylist policy); P6↔P7 (same Offline Sync owner).

**Sequencing.** *Wave 0:* P1 (SurrealDB sweep) + P2 (Audit & Security anchor) — both clear live contradictions in
binding docs. *Wave 1:* P3+P4 (coordinated signing/save-trust decision), P5 (Identity binding, before any MP build),
P7 (storage strategy), P9 (tamper-evidence + DSAR). *Wave 2:* P6, P8, P10. *Wave 3:* P11/P12/P13 (ratification-gated
appendices). *Wave 4:* P14 (BCM hygiene). P1 + the citation-re-anchoring in P14 overlap the E9/G26 sweep — merge, don't duplicate.

---

## Related

- [[../10-Architecture/bounded-context-map]] — the binding 19-context domain model audited here
- [[../00-Index/Decision-Log]] — ADR index (ratification targets ADR-0052/0054/0059/0060/0064)
- [[../50-Game-Design/README]] — GDDR index
- [[../00-Index/Current-State]] — hot-memory snapshot
- [[../90-Meta/collaboration-and-decision-protocol]] — roles + ask-first decision gate
- [[../90-Meta/vault-governance]] — supersede discipline + connectivity rules

*Backlog: Linear team FMX epics FMX-56..FMX-65 (children FMX-66..FMX-102), plus platform-tier epic E10/FMX-103 (children FMX-104..FMX-117) from the follow-up audit. This note is the durable knowledge-base record; Linear holds operational status.*
