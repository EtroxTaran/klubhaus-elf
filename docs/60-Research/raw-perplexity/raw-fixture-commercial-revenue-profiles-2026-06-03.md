---
title: "Raw Perplexity - Fixture commercial and competition revenue profiles (FMX-78)"
status: raw
tags: [research, raw, perplexity, league, competition, fixture, commercial, revenue, ddd, game-design, fmx-78]
created: 2026-06-03
updated: 2026-06-03
type: research
binding: false
linear: FMX-78
sourceType: external
related:
  - [[../fixture-commercial-revenue-profiles-2026-06-03]]
  - [[../../10-Architecture/09-Decisions/ADR-0070-fixture-commercial-revenue-profile-contract]]
  - [[../cup-and-competition-revenue-profiles-2026-05-28]]
  - [[../../30-Implementation/club-economy-commercial-contracts]]
---

# Raw Perplexity capture - FMX-78

> Condensed capture of the Perplexity (Sonar) passes run for FMX-78. The first
> pass returned a useful field taxonomy but a weak citation list with unrelated
> scheduling links; the synthesis note therefore uses this capture as taxonomy
> input only and hardens the factual evidence with official/public sources.
> Synthesis lives in [[../fixture-commercial-revenue-profiles-2026-06-03]].

## Query 1 - Real-world football commercial and revenue mechanics

**Prompt (verbatim):** Research the real-world football operations needed to
design two supplier payloads for a football manager game: (1)
FixtureCommercialProfile, a per-fixture profile published by League/Competition
orchestration for commercial and matchday settlement; (2)
CompetitionRevenueProfile, a per-competition-season profile. Focus on domestic
cups/leagues and continental competitions: gate sharing, neutral venue/final
handling, prize money/facility fees/media distributions, ticket allocations,
match organizer/host responsibilities, replays/two-leg ties,
recognition/payment timing. Return: key source-backed facts, URLs, and a
recommended field taxonomy. Do not invent exact amounts unless source-backed;
prefer field concepts over values.

**Answer (condensed):**

- Domestic leagues generally distinguish club-owned matchday revenue from
  centrally sold and redistributed media/commercial income.
- Domestic cups commonly need profile data for net-gate sharing, allowable
  deductions, neutral semi/final treatment, replay or extra-time rules, round
  prize ladders, live-selection/facility fees and settlement deadlines.
- Continental club competitions need profile data for central distribution
  pillars, performance/progression bonuses, market/value components, solidarity,
  home-and-away legs, neutral finals and centrally controlled final inventory.
- Accounting treatment should separate cash, receivables, deferred revenue and
  forecast-only upside. Ticket revenue is normally recognized when the match or
  material right is delivered; performance prizes and bonuses need a variable
  consideration / probability or trigger model.

**Recommended taxonomy returned by Perplexity:**

- `FixtureCommercialProfile`: fixture identity, competition season, stage/round,
  leg/replay flags, neutral/final flag, organizer/host responsibility, venue,
  gate model, net-receipts definition, ticket allocation, prize/facility/media
  triggers, replay/two-leg handling and recognition hooks.
- `CompetitionRevenueProfile`: competition-season identity, organizer, prize
  model, facility/media distribution model, gate-sharing framework, ticket
  allocation policy, organization responsibility matrix, replay/two-leg rules,
  payment timing, recognition policy, sanctions/deductions and provenance.

**Citation quality note:** The returned citation list included unrelated NFL and
generic scheduling links. Those links are not used as evidence in the synthesis.
Official/public source hardening is recorded in Query 2 and the synthesis source
table.

## Query 2 - Primary/public source hardening

**Prompt (verbatim):** Find primary/official public sources for football
competition revenue and match commercial rules that could support a game design
architecture note. Need sources for: FA Cup or similar domestic cup prize
fund/gate sharing/replays/finals; UEFA club competitions financial
distribution/ticketing/final allocations/home club gate revenue; Premier League
or EFL central distribution/facility fees/away ticket allocation; IFRS 15 or
official accounting guidance for recognizing ticket/season-ticket/performance
bonus revenue. Return a compact table: source name, official/public URL, what
rule concept it supports.

**Answer (condensed and source-hardened):**

| Source | URL | Concept supported |
|---|---|---|
| The FA Cup prize fund | <https://www.thefa.com/competitions/thefacup/prize-fund> | Published round prize ladder and winner/loser amounts. |
| FA Cup rules 2025-26 | <https://www.thefa.com/-/media/thefacom-new/files/competitions/2025-26/rules/rules-of-the-fa-challenge-cup-2025-26.ashx> | Match arrangements, replays/draw resolution, gate receipts, net proceeds and settlement concepts. |
| UEFA Champions League 2025-26 regulations | <https://documents.uefa.com/r/Regulations-of-the-UEFA-Champions-League-2025/26> | Match organization, ticketing, commercial rights and financial rules for continental club competitions. |
| UEFA men's competitions distribution explainer | <https://www.uefa.com/news-media/news/028c-1a963496826a-bf40705cb183-1000--men-s-competitions/> | Equal share, performance, value/legacy and non-participant solidarity concepts. |
| UEFA UCL revenue distribution | <https://www.uefa.com/uefachampionsleague/about/revenue-distribution/> | Per-competition revenue distribution pillars and payment concepts. |
| Premier League publications | <https://www.premierleague.com/publications> | Handbook and annual club-payment reports for central revenue distribution evidence. |
| Premier League central revenue explainer | <https://www.premierleague.com/en/news/1693127> | Equal share, facility fees, merit payments and central revenue distribution concepts. |
| EFL rules and regulations | <https://www.efl.com/governance/efl-rules-regulations/> | Lower-tier league rule and distribution reference surface. |
| IFRS 15 standard page | <https://www.ifrs.org/issued-standards/list-of-standards/ifrs-15-revenue-from-contracts-with-customers/> | Revenue-recognition model, performance obligations and variable consideration. |

## Query 3 - Published language / event vs query best practice

**Prompt (verbatim, condensed):** For DDD bounded contexts, decide how a supplier
bounded context should publish commercial fixture and competition revenue facts
to a consumer context. Compare event-only, query/read-model-only and hybrid
event-plus-query. Include Customer-Supplier, Published Language,
Anticorruption Layer, idempotency, schema versioning, self-contained payloads and
audit/replay needs.

**Answer (condensed):**

- Event-plus-query is the strongest default for settlement facts:
  - immutable integration/domain events create a consumer-owned audit trail;
  - consumer projections isolate CommercialPortfolio from League persistence;
  - supplier queries remain available for bootstrap, diagnostics and
    reconciliation, not as the normal settlement path.
- Event-only is clean and highly decoupled but makes rebuild, drift detection
  and operational debugging harder unless every event can be replayed forever.
- Query-only is simplest initially but creates a runtime dependency on the
  supplier, weakens temporal/audit guarantees and makes settlement depend on
  "latest" state instead of the published profile version active at the fixture.
- Published Language payloads should be self-contained, schema-versioned,
  idempotent, provenance-bearing and consumed through an Anticorruption Layer.

## Query 4 - Game-design precedent

**Prompt (verbatim):** Compare how management games present
commercial/fixture/competition revenue to players, with URLs where possible:
Football Manager finances screens, OOTP team finances/revenue sharing/gate
revenue, Motorsport Manager sponsorship/race bonus payouts, Anstoss-style
football manager finance/sponsor reporting. For a football manager game,
recommend how to expose FixtureCommercialProfile and CompetitionRevenueProfile
in quick/background mode versus standard/expert mode. Focus on UI/gameplay
clarity, not implementation.

**Answer (condensed):**

- Football Manager exposes finance through dense Summary / Income / Expenditure
  / Salary-style surfaces, with income categories such as gate receipts, TV
  revenue, prize money, sponsorship and merchandising. Major financial changes
  are also surfaced via news/inbox messages.
- OOTP-style simulation finance emphasizes season totals, gate revenue, media
  revenue, budget-vs-actual and revenue-sharing comparisons; it is useful for
  expert league-economics dashboards.
- Motorsport Manager is a strong per-event precedent: sponsor offers and race
  results make payout triggers readable, and event summaries tie prize/sponsor
  income to a single race.
- Anstoss-style football managers favor season-start sponsor choices, finance
  summaries and narrative sponsor feedback over granular accounting-only
  surfaces.

**Design recommendation returned by Perplexity:**

- Quick/background mode: a compact post-match "money card" and season-review
  tiles; show net result, gate/tickets, broadcast/prize contribution,
  matchday costs and one explanatory driver.
- Standard mode: fixture-level settlement breakdown, competition-revenue
  breakdown, recent trend and comparison to last season.
- Expert mode: full tables for profile rules, prize ladders, gate-sharing
  formulas, payment timing, forecast EV and league/peer comparisons.

**Source quality note:** Perplexity cited a mix of official and community
sources for game UI precedent. The synthesis uses them only for design
precedent, not for binding real-world rules.
