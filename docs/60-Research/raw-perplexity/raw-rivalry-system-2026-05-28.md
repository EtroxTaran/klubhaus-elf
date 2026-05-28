---
title: Raw - Rivalry System Ownership Research (FMX-34)
status: raw
tags: [research, raw, perplexity, rivalry, derby, bounded-context, fmx-34]
created: 2026-05-28
updated: 2026-05-28
type: raw-research
binding: false
linear: FMX-34
sourceType: perplexity
related:
  - [[../rivalry-system-bounded-context-2026-05-28]]
  - [[../fan-culture-segmentation-research]]
---

# Raw - Rivalry System Ownership Research (FMX-34)

> Three Perplexity queries run during FMX-34 to support the rivalry-
> system ownership recommendation. Raw input; not implementation
> authority. Synthesis at
> [[../rivalry-system-bounded-context-2026-05-28]].

## Why these queries

The 15-context bounded-context map has no Rivalry owner.
`rivalry-system.md` (GDDR draft) designs a concrete 5-sub-score model
(regional, historical, sporting, fan-incident, transfer-tension) with
threshold tiers (None/Mild/Strong/High/Volatile), per-season decay
rules and explicit cross-system consumers - fan-ecology atmosphere
multiplier, matchday-event-engine security trigger, regulations
sanction chain, future watch-party auto-proposal, future Manager &
Legacy archetype signal. But no context claims it.

Three queries target the ownership decision:

1. **Genre precedent** - how do football sims model derby intensity
   (binary flag, weighted score, computed on-demand)?
2. **DDD authority** - canonical pattern for cross-cutting scoring /
   relationship systems with multiple input streams + multiple
   downstream consumers.
3. **Real-world grounding** - 2023-2026 rivalry classification in
   football (UEFA risk matches, Premier League Category A/B/C,
   Bundesliga Rotspiel, derby attendance/revenue premiums, incident
   decay).

## Query 1 - Football management sim rivalry modelling

### Prompt

How do FM, EA FC, OOTP, FIFA Manager, Anstoss model rivalry / derby
intensity? Sub-questions: (1) binary flag, weighted score, computed
on-demand? (2) sub-score factors? (3) match-day effects? (4) pre-
authored vs emergent? (5) intra-save evolution? (6) developer
sources?

### Output summary

- **Confidence is LOW for this query.** Available public sources do
  not expose rivalry-data internals for the named titles. The strongest
  finding is for Football Manager.
- **Football Manager**: public/community evidence supports **pre-
  authored rivalry relationships in the database**; the exact storage
  format and any formula are NOT publicly documented. The FM match
  engine is highly multi-factor and data-driven, but rivalry-specific
  inputs are not exposed.
- **EA FC Career, OOTP, FIFA Manager, Anstoss**: **not verifiable**
  from the retrieved sources. EA FC career mode documentation in the
  retrieved set does not cover rivalry internals.
- **The defensible cross-game statement**: most management sims either
  pre-author rivalry as DB labels/flags (FM, EA FC) or do not model it
  formally; none expose a documented multi-factor scoring engine
  comparable to the FMX `rivalry-system.md` design. FMX would lead
  the genre with an explicit 5-sub-score emergent model.

### Citations Perplexity returned

- [1] steamcommunity - FM match engine discussion (multi-factor,
  general; not rivalry-specific)
- [2] Wharton paper - rivalry increases risk-taking (academic, not
  game)
- [7] footballmanager.com The Dugout (official hub; not rivalry
  internals)
- Others: YouTube / ESPN (not game-architecture)

### Confidence

**Low.** Source-thin. The conclusion that FMX would lead the genre
with an explicit emergent multi-factor rivalry model is defensible
(no surveyed title has documented one) but the genre comparison is
weak. The synthesis must lean on DDD (Query 2) and real-world (Query
3) for the load-bearing recommendation.

## Query 2 - DDD canonical pattern for cross-cutting scoring / relationship systems

### Prompt

DDD canonical pattern for cross-cutting relationship / affinity /
scoring system that computes one derived metric (club-pair rivalry
intensity) served as a read model to multiple consumers? Sub-questions:
(1) own context vs sub-aggregate of League/Club? (2) real-world DDD
analogues (credit rating, customer affinity, supplier relationship,
recommendation)? (3) context-mapping pattern for multi-stream input +
single derived metric? (4) lifecycle (decay, thresholds) strengthen
the case for separation? (5) where does the relationship graph live?

### Output summary

- **Direct DDD answer: cross-cutting scoring system warrants its own
  bounded context** when multiple criteria align - precisely the FMX
  situation. Vernon, Evans, Microsoft Learn DDD guidance converge.
- **Bounded-context split criteria** (Vernon strategic design):
  - Distinct ubiquitous language (scores, decay, thresholds, ranking,
    calibration, features) different from League/Club language.
  - Multiple upstream inputs (Match, Transfer, Incident, Geography)
    and multiple downstream consumers (Ticketing, Marketing,
    Scheduling, Media, Compliance).
  - Independent lifecycle and deployment (change scoring algorithm
    without coordinating with Club/League).
  - Different non-functional needs (batch / streaming / ML pipelines
    vs transactional Club/League operations).
  - Substantial domain rules (lifecycle, decay, thresholds).
- **Real-world DDD analogues for cross-cutting scoring:**
  - **Credit rating / risk score** - classic financial DDD: Risk /
    Credit BC computes scores from accounts + market data + credit
    history; exposed to Sales / Trading / Compliance via Customer-
    Supplier (Upstream-Downstream) context map.
  - **Customer affinity / propensity / segmentation** - Analytics /
    Customer Insights BC computes affinity + segments + LTV; publishes
    for Marketing / Recommendation / CRM.
  - **Recommendation relevance scores** - own Recommendation /
    Personalization BC ingests events from Orders + Catalog + Search;
    exposes relevance scores / ranked lists. Vernon explicitly
    discusses reporting/analytics as separate contexts.
  - **Supplier relationship / supplier score** - Procurement /
    Supplier Management separate from Logistics / Inventory; scoring
    is upstream provider.
- **Canonical context-mapping pattern**:
  - **Separate bounded context** for the scoring concern.
  - **Input via domain events** from each source context (Match →
    MatchPlayed; Transfer → PlayerTransferred; Incident →
    IncidentOccurred; Geography → StadiumRelocated if needed).
  - **Process manager / saga inside scoring context** for long-
    running event reactions ("when N incidents in M days after high-
    stakes matches → escalate score").
  - **Domain service** for the actual scoring calculation.
  - **CQRS-style read models** for query-optimized consumer access
    (`RivalryScore(A, B)`, `TopRivals(A)`, `RivalryCluster(A)`).
  - **Consumers treat scores as external facts** - they apply their
    own policies (Marketing pricing, Safety procedures, Atmosphere
    multiplier) in their own contexts. Scoring context does NOT
    contain consumer policies.
- **Anti-pattern called out**: "On-demand Domain Service called by
  each consumer" - effectively leaks cross-context model, pushes the
  scoring subdomain into everyone else's language. Vernon warns
  against placing cross-cutting domain logic into shared services
  with no bounded context.
- **Lifecycle (decay, thresholds, states) STRONGLY strengthens the
  case for separate bounded context.** Rich domain behavior specific
  to the scoring model belongs in its own context. Consumer reactions
  (atmosphere, pricing, safety) belong in their respective contexts.
- **Where does the relationship graph live?** Inside the scoring
  context. Use graph DB or graph structure internally (infrastructure
  choice, not context choice). Club context provides identity
  (`ClubId`); Scoring context stores `RivalryEdge(ClubA, ClubB,
  score, history, state)`. Do NOT embed graph into Club aggregate -
  makes Club huge and couples to scoring. Do NOT share a technical
  "graph service" with no domain language - leads to big-ball-of-mud.

### Citations Perplexity returned

- [1] reintech.io - cross-cutting concerns DDD
- [2] YouTube - DDD context boundaries
- [4] learn.microsoft.com - Azure microservices domain analysis (MS
  Learn)
- [5] vaadin.com - DDD Part 1 Strategic Domain-Driven Design (Vernon)

### Confidence

**High.** Multiple DDD authorities (Vernon strategic design, MS Learn,
Vaadin DDD primer). Real-world analogues (credit-rating /
recommendation / customer-affinity) directly map to rivalry-scoring.
Pattern (separate BC + CQRS read model + event-driven integration +
process manager) is unambiguous.

## Query 3 - Real-world 2023-2026 rivalry classification & data

### Prompt

Modern football 2023-2026 rivalry intensity metric? Sub-questions:
(1) objective metric from Opta / StatsBomb / Athletic / Football
Benchmark? (2) high-security classification (Premier League Category
A, Bundesliga Rotspiel, UEFA risk matches)? (3) derby attendance and
revenue premiums? (4) incident decay across seasons? (5) public vs
internal classifications? (6) recent sources.

### Output summary

- **No single standardised rivalry-intensity metric across data
  providers, leagues or UEFA.** Parallel systems exist: commercial fan-
  facing indexes, internal high-risk-match classifications, academic
  literature.
- **Opta / Stats Perform / StatsBomb**: do NOT publish a formal rivalry
  score. Event taxonomies focus on on-ball events; rivalry appears
  informally as labels ("derby", "El Clásico") or derived variables
  (distance, head-to-head, stakes) in academic / club analytics.
- **Academic + club-side analysts** build measures from:
  - Geographic distance between stadiums (often core derby predictor)
  - Head-to-head history (meetings, balance of wins, goal difference,
    title-deciding derbies)
  - Current sporting stakes (title race, European qualification,
    relegation)
  - Fan incidents / police risk levels (violence, arrests, pyro, pitch
    incursions)
  - Transfer conflicts / institutional disputes (controversial
    transfers, breakaway clubs)
- **UEFA Stadium and Security Regulations + Safety & Security
  Handbook (2023-2024 editions):**
  - Match risk assessment: Low / Medium / High risk classifications.
  - Inputs: history of incidents, rivalries and derby character,
    political/ethnic/religious tensions, expected away following,
    kick-off time, local public order intelligence.
  - High-risk consequences: increased steward/police presence with
    specific ratios, segregation + buffer zones, enhanced entry
    controls, alcohol controls, mandatory Security Officer + SLO,
    enhanced CCTV + command/control centres, emergency planning.
- **England / Premier League + SGSA Green Guide**:
  - Local Safety Advisory Groups (SAGs) - club + local authority +
    police + fire + ambulance + transport.
  - **Category A / B / C** system: A = low-risk; C = high-risk
    (require more officers + specialist resources). Labels vary by
    police force / club.
  - Inputs: historical disorder data, fixture rivalry profile (North
    London Derby, Merseyside, title-deciders), match timing, alcohol-
    related risk, planned pyrotechnic intelligence, away allocation
    size, distance, transport.
  - Operational consequences: higher police deployment + costs,
    larger stewarding, more senior safety officials, stricter
    segregation, specific ingress/egress plans, road closures + escort
    of away fans, stricter search regimes.
- **Germany / Bundesliga + DFL/DFB:**
  - **Rotspiel** ("red match") designation for high-risk fixtures,
    especially derbies and politically sensitive games.
  - Inputs: police records of violence/disorder, rivalry + fan-scene
    classifications (ultras + hooligan networks), expected away
    numbers + travel (special trains/convoys), political/ideological
    conflicts.
  - Consequences: massive police deployment (incl. riot units BFEs),
    intensified entry controls, alcohol restrictions, wider buffer
    zones, more segregated access, sometimes hold-back of away fans
    after match.
- **Derby attendance + revenue premiums (documented academic +
  commercial):**
  - Higher attendance vs baseline fixtures (econometric studies,
    several percentage points of stadium capacity).
  - Higher ticket prices / yield per ticket (demand-based or category
    pricing; derbies = "Category A+" or similar).
  - Elevated hospitality + corporate demand (close to 100% sell-
    through in top derbies at big clubs).
  - Greater broadcast viewership → long-term rights value.
  - Hospitality and commercial: derbies as flagship sponsorship
    inventory; near-100% sell-through at big clubs.
- **Away travel multipliers**: short-distance derbies (London, Ruhr,
  Milan) see max away allocations sold + strong informal additional
  demand even when capped for safety.
- **Incident decay** ("fan-incident memory across seasons") -
  three overlapping systems:
  - **Police / public order**: national football policing units
    maintain databases of incidents tied to fixtures + clubs + groups.
    Includes arrests, pyro use, violence, pitch invasions, racist /
    extremist displays, identity of groups. Records subject to
    informal decay: recent incidents weighted more; uneventful
    fixtures may be downgraded after several seasons. Football banning
    orders / stadium bans 3-10 years duration.
  - **Leagues / federations (disciplinary)**: UEFA + national FAs +
    leagues maintain disciplinary histories. Repeat-offender escalators
    (second/third offence within window triggers heavier penalty).
    "Probation" periods where future offences reactivate suspended
    sanctions. Implicit time-bounded memory.
  - **Clubs**: internal records (safety officer + steward incident
    reports, CCTV-based analyses, identified risk groups + patterns).
    Internal fixture risk matrices with rolling look-back (3-5
    seasons, higher weight on last 1-2).
- **Public vs internal classifications:**
  - Operational risk classifications partially public (media reports
    high-risk / Rotspiel / Category C announcements affecting police
    deployment).
  - Full risk scoring methodologies + internal matrices NOT fully
    published; general factors described in regulations.
  - No universal FA / league "derby list" with legal status; "derby"
    is mainly descriptive / marketing language.
  - Club / commercial categorisations partially public via ticket
    pricing tiers but underlying ranking around security risk vs
    commercial value not fully revealed.

### Citations Perplexity returned

- [1-8] StatsBomb articles + Opta event definitions + Stats Perform +
  academic resources + YouTube (data providers don't expose rivalry
  metric)
- UEFA / SGSA / Bundesliga documentation referenced via summary; full
  citations not always returned in result set but described
  authoritatively

### Confidence

**High.** UEFA Stadium and Security Regulations + Premier League
SGSA Green Guide + Bundesliga DFL Rotspiel documentation are
authoritative regulatory sources. Academic literature on derby
pricing + attendance premiums is established. Three-layer
"police / league / club" incident-decay framework is well-documented.
The defensible claim: rivalry classification IS operationally distinct
in real football (UEFA risk matches, Category A/B/C, Rotspiel) and
has measurable commercial + safety effects (attendance + revenue
premiums + sanction escalation). Real-world precedent supports the
FMX design directly.

## Combined implications for FMX-34 recommendation

1. **DDD answer is decisive (Query 2, high confidence).** Cross-cutting
   scoring system with own ubiquitous language + lifecycle (decay,
   thresholds, states) + multiple input streams + multiple downstream
   consumers + independent deployment = canonical separate bounded
   context. Vernon's real-world DDD analogues (credit rating,
   customer affinity, recommendation, supplier relationship) directly
   map. CQRS read model + Process Manager / Saga + Domain Service is
   the textbook pattern.

2. **Real-world structural precedent (Query 3, high confidence) is
   unambiguous.** UEFA risk-match classification, Premier League
   Category A/B/C, Bundesliga Rotspiel are all operationally distinct
   from league orchestration + club management. The FMX rivalry-system
   design (5 sub-scores + threshold tiers + decay + cross-system
   consumers) mirrors the real-world structure directly. Derby
   attendance + revenue premiums + sanction-chain escalation give
   concrete consumer effects, all from a single rivalry-status input.

3. **Genre precedent (Query 1, LOW confidence) is thin.** FM has pre-
   authored rivalry DB but no documented formula. EA FC / OOTP / FIFA
   Manager / Anstoss not verifiable. The defensible claim: FMX would
   lead the genre with an explicit emergent 5-sub-score model. Genre
   does NOT contradict the carve.

4. **Five-of-six DDD split criteria fire** (analog to FMX-26/28/30):
   - Own ubiquitous language: rivalry, derby, sub-score, intensity
     tier (None/Mild/Strong/High/Volatile), fan-incident memory,
     transfer tension, decay rate. ✓
   - Own lifecycle / state machine: threshold-tier FSM + per-season
     decay (deterministic) + sub-score updates on events. ✓
   - Own storage boundary: per-pair rivalry edges + sub-score history
     + incident references. ✓
   - Multiple consumers: Fan Ecology (atmosphere multiplier),
     Matchday-Event-Engine via Club Mgmt (Pyro trigger), Watch Party
     (auto-propose), Manager & Legacy (future derby-style signal),
     Notification (rivalry-themed inbox copy), Match (derby
     classification marker), Tactics (future derby-specific opposition
     awareness if designed), Regulations (sanction escalation
     consumer), People (future journalist/fan-rep personas if
     ADR-0052 ratifies), Narrative (future derby media framing if
     ADR-0054 ratifies). ✓
   - Cross-cutting role: every consumer above queries rivalry. ✓
   - Co-change counterargument: rivalry score evolves independently
     of any consumer's transaction (decay per season + event-driven
     sub-score updates from upstream). ✗ (split is justified)

5. **Scope is smaller than Tactics/Regulations.** Tactics had four
   aggregate types + light FSM + presets + opposition templates.
   Regulations had five aggregate types + multi-regulator catalog +
   window FSM + sanction catalog. Rivalry has roughly one aggregate
   type (`RivalryPair` / `RivalryEdge`) + sub-score graph + threshold
   FSM + decay policy. **Smaller, lighter context** - this argues
   *for* a clean carve (less to absorb into an existing context) and
   *against* growing context count for trivial-scope concerns. The
   five-of-six DDD criteria firing + cross-cutting consumer count
   tips it toward separate context.

The combined evidence reinforces **Option C (Rivalry as own bounded
context)** as the recommendation. The lighter scope is a real risk
worth naming (`§Named risks`), but the cross-cutting role + lifecycle
+ multi-input/multi-output shape match Vernon's scoring-context
pattern directly. Real-world precedent (UEFA / Premier League /
Bundesliga risk-match systems) reinforces the operational reality.
