---
title: Raw - Environment, Regulations, Rivalries, Sanctions, Match-day Events, Progressive Disclosure
status: raw
tags: [research, raw, perplexity, regulations, fans, events, rivalry, ux]
created: 2026-05-16
updated: 2026-05-16
type: raw-research
binding: false
related:
  - [[README]]
  - [[../regulations-and-pyramids-research]]
  - [[../fan-culture-segmentation-research]]
  - [[../progressive-disclosure-research]]
---

# Raw - Environment, Regulations, Rivalries, Sanctions, Match-day Events, Progressive Disclosure

> Source: private Perplexity transcripts (2026-05-16), Doc 2 sections 7015 -
> end. Two parallel iterations on fan ecology, league regulations across
> DE/EN/FR/IT/ES, promotion-gated stadium requirements, community editor /
> dataset modding, rivalry graph, high-security games, pyrotechnics + alcohol
> bans + sanctions, weather/infra/medical/catering match-day events, plus one
> iteration on **progressive disclosure** for tactical depth (3 UX tiers:
> Quick / Standard / Expert). Feeds three synthesis notes.

## English summary

This batch elaborates the "club is more than a squad and a budget" view: it
adds an **environment / regulation / event simulation layer** sitting next
to club, squad and match. Six new services emerge:

- `FanCultureService` - multi-segment supporter ecology with conflict drivers.
- `LeagueRegulationService` - country-and-tier-keyed competition + facility
  + operations rules (deep for Germany down to Amateur, England via FA Ground
  Grading, lighter for FR/ES/IT, abstract elsewhere).
- `StadiumComplianceService` - checks the club against the regs of its
  current league; promotion triggers compliance demand (capacity, floodlight,
  fan separation, sanitary, press, security organisation, medical).
- `RivalryService` - emergent rivalry graph; rivalry score has 5 sub-scores
  (regional, historical, sporting, fan-incident, transfer-tension).
- `RiskAssessmentService` - classifies a match as high-security based on
  rivalry, table, fan profile, prior incidents.
- `MatchdayEventEngine` - rule-based events with trigger / probability /
  effect / prevention.
- `SanctionService` - chain of consequences: fines, partial sector closures,
  alcohol bans / light beer, ghost match (partial / full), reputation
  damage, higher risk classification for next match.

The community-editor model is an **override-pack system** (manifest +
versioning + schema validation + stable IDs), NOT raw file imports. Override
packs may replace names, colours, logos, competitions, rivalries, squads on
top of the base IP-clean dataset. Expansion and scenario packs are
additional layers.

A separate Progressive Disclosure iteration argues against splitting
"casual" and "pro" into two modes - instead, one simulation core with three
bedienebenen (Quick / Standard / Expert). All players play the same tactic +
match engine, only what the UI exposes differs.

## 1. Core extension model

| New service | Job | Effects |
|---|---|---|
| Fan Service | Multi-segment fan ecology, mobilisation, mood | Attendance, atmosphere, risk, revenue |
| Regulation Service | League + country rules, admissions, conditions | Promotion, squad rules, stadium duties |
| Stadium Compliance Service | Stadium fitness per league | Admission, special permit, alternate venue |
| Rivalry Service | Historical + regional rivalries | Risk matches, atmosphere, media value |
| Event Engine | Weather, security, infra, catering, incidents | Revenue, match interruptions, costs, sanctions |
| Sanction Service | Fines, partial closures, alcohol ban | Follow-on effects on home games + finance |

## 2. Fan ecology (6 segments + drivers)

Six segments aligned with FM Supporter Profile:

- Ultras / Hardcore.
- Core.
- Family.
- Casual / Event.
- Corporate / Hospitality.
- (FM also lists Fair Weather as an additional segment.)

Each reacts on different drivers:

- Ultras → identity, rivalry, repression, ticket prices.
- Family → safety, comfort, sanitary, cleanliness.
- Casual → success, stars, media hype.
- Corporate → hospitality, stadium standard, brand.

Conflict triggers (deliberate): more VIP areas ↑ revenue but ↓ tradition;
alcohol ban ↓ risk but ↓ catering + atmosphere.

## 3. Regulations - 3-layer model

| Layer | Rule type | Example |
|---|---|---|
| Federation / League | Hard admission rules | Floodlight, security concept, stadium admission |
| Country | Soft match-culture | Alcohol policy, fan travel patterns, stadium culture |
| Competition | Extra special rules | Squad registration, security tiers, intl requirements |

### Germany - deepest model

Tiers to cover (per source):

- Bundesliga / 2. Bundesliga.
- 3. Liga.
- Regionalliga.
- Oberliga / Verbandsliga - boundary toward amateur football.

DFB sources cited: Spielordnung, Durchführungsbestimmungen,
Sicherheitsrichtlinien, Leitfaden Sicherheit im Amateurfußball,
Regionalliga-Sicherheitsrichtlinien. Even amateur tier has organisational
+ safety standards relevant to gameplay.

### England

FA Ground Grading / Stadium Accreditation is *purpose-built* for tier-by-
tier progression and is therefore an almost direct blueprint for our
promotion-compliance gameplay.

### France, Spain, Italy

- France: LFP club-licensing covers ecological + infrastructure criteria.
- Italy: FIGC / UEFA licensing with stadium "must" criteria.
- Spain: abstract initially with league + licence profile; insufficient
  reliable detailed rules.

### Other countries

Lighter abstraction - league + licence profile only.

## 4. Promotion as a compliance + investment problem

Promotion must trigger new duties, not just better opponents and TV money.
Possible obligations per tier:

- Minimum capacity or specific stand categories.
- Floodlight standard.
- Media / press infrastructure.
- Security and separation concepts.
- Sanitary facilities.
- Hospitality / light hospitality.
- Medical / public-order minimums.

Player options when not compliant:

- Special permit (with conditions / costs).
- Alternate stadium.
- Retro-fit deadline.
- Conditional admission with revenue loss / fines.

Strong gameplay because sporting promotion suddenly carries investment
pressure - the classic "promoted but stadium not league-grade" dilemma.

## 5. Community editor and custom datasets

Best practice (per Kingdom-Come modding wiki + Reddit FM modding):
versioned, validatable **override packs**, not raw file imports.

Recommended data model:

- **Core Dataset**: official, IP-clean fictional universe.
- **Override Pack**: replaces names, colours, logos, competitions,
  rivalries, players.
- **Expansion Pack**: adds countries / leagues / clubs.
- **Scenario Pack**: alternative start years, historical worlds,
  fantasy.

Technical rules:

- Manifest with version + compatibility.
- Stable IDs as primary keys (not names).
- Schema validation on import.
- Import preview with conflict view.
- Migration path across game versions.

Architecture fit: `DatasetService` returns normalised master data;
simulation + rules only ever read stable entities.

## 6. Standort, history and rivalries

Each club gets: location, region, social embedding, historical balance,
relationship graph with other clubs.

Rivalries should grow emergently. Sources:

- Geographical proximity.
- Derby history.
- Frequent losses.
- Important lost matches.
- Promotion / relegation duels.
- Cup dramas.
- Fan incidents.
- Transfer conflicts.

Modelled as a `rivalry_score` with 5 sub-scores:

- `regional_score`
- `historical_score`
- `sporting_score`
- `fan_incident_score`
- `transfer_tension_score`

Real emerging stories: a benign neighbour can become high-risk after
repeated losses or incidents.

## 7. High-security matches

Triggered when rivalry + table situation + fan risk align. DFB security
guidance recommends conflict-potential analysis based on incident
history, table constellation, local security.

In-game effects:

- Higher security cost.
- More stewards / police demand.
- Possible visiting-fan limits.
- Sector closures.
- Alcohol ban.
- Higher penalty risk.
- More media attention.

Rivalry becomes economically + operationally relevant, not just cosmetic.

## 8. Pyrotechnics, alcohol ban and sanctions

UEFA disciplinary decisions cited (Arsenal, Eintracht Frankfurt) show the
typical chain: pyros / projectiles / blocked escape routes / racism /
pitch invasion / damage → fines, partial closures, ghost matches, ticket
bans.

Recommended in-game **sanction chain**:

1. Fine.
2. Partial sector closure.
3. Visiting-fan restriction.
4. Alcohol ban / light beer only.
5. Partial ghost match.
6. Full ghost match.
7. Higher security requirements for follow-ups.

Alcohol bans connect security and revenue directly. Reports on Germany /
Euro 2024 cite reduced alcohol strength or zoned restrictions at risk
matches.

## 9. Match-day events as a rule-based engine

Categories (verbatim):

- **Weather**: heat, frost, heavy rain, storm.
- **Infrastructure**: frozen beer line, floodlight fault, turnstile
  outage, pitch problems.
- **Medical**: fan collapses, paramedic call, match interruption.
- **Security**: pyro, fan march, block fight, projectiles.
- **Catering**: water demand spikes, beer drops, sausages sold out.
- **Media / PR**: protest banners, record attendance, boycott, choreo.

### Event schema (verbatim)

Every event defines:

- Trigger conditions.
- Probability.
- Effects.
- Prevention / counter-measures.

### Example 1 - Frozen beer line

| Field | Value |
|---|---|
| Trigger | Temperature < 0 °C, ageing infrastructure, low maintenance |
| Event | Frozen beer line |
| Effect | Beer revenue −80 %, fan frustration +, hospitality − |
| Prevention | Winterising, maintenance, mobile bars |

### Example 2 - 40 °C + water boom

| Field | Value |
|---|---|
| Trigger | 38-40 °C, sold-out stadium, low shade |
| Event | Multiple medical incidents |
| Effect | Match interruption, reputation damage, extra cost |
| Prevention | Water stations, shade, medical upgrade |

## 10. Mechanical integration

These systems must produce real management decisions, not flavour:

- Security budget up/down.
- Stadium maintenance.
- Water/beer/food logistics.
- Fan-project + prevention work.
- Ticket policy.
- Visiting-fan quota strategy.
- Communication / PR reaction.

Risks can be reduced but not eliminated - the design point that makes the
system feel believable.

## 11. Data and rule layers

| Layer | Content |
|---|---|
| Structural rules | League, stadium, security, promotion regulations |
| Historical / social rules | Rivalries, fan profiles, local culture, club history |
| Dynamic event rules | Weather, catering, incidents, sanctions, day events |

Lets official, historical and emergent rules stay cleanly separated.

## 12. Progressive Disclosure for tactical depth

Separate Perplexity iteration on tactical depth + casual-vs-power-user
coexistence.

### Product rule

"One simulation core, three operating tiers". Match + tactic engine stays
identical; only how the UI exposes it changes.

| Tier | Target | Operation |
|---|---|---|
| Quick | 5 min / week | Formation, star strength, player ratings, recommendations |
| Standard | Normal manager player | Roles, team focus, basic instructions |
| Expert | Tactics / data nerds | Role detail, player instructions, data hub, deep reports |

This is a classic Progressive Disclosure pattern: rare / complex options
deferred so beginners aren't overwhelmed without removing depth for
experts.

### Tactical depth model

Position + Role + Duty + Player Instructions + Traits / Tendencies.

Example: Right-back / Inverted Full-Back / Support / cuts inside, rarely
dribbles, never early-crosses, short-pass seek / "drifts to centre"
trait.

### Casual access via assistant

- Recommended line-up.
- Recommended roles.
- Auto-detection of best 11 for chosen style.
- Star ratings on players, hiding raw 1-20 attributes by default.
- Match Report Lite (won/lost, key player ratings).
- "What should I do next?" daily prompt list.

### Expert access

- Full attribute view (1-20).
- Role detail editor with player instructions.
- Data hub with zone heatmaps, pass networks, fatigue curves.
- Deep match report (per-event, per-player, set-piece efficiency).

### UI rule

The setting "always show me detailed reports" lives in user settings, not
per match. Default = Standard; Quick + Expert are explicit opt-ins.

## 13. Citations preserved

Citations 19_x and 20_x: DFB Spielordnung 04 + Durchführungsbestimmungen
05 + Sicherheitsrichtlinie 2018, Regionalliga-SW security richtlinie,
NOFV Sicherheitsrichtlinie, BFV Regionalliga, FA ground-grading + stadium
accreditation, FIGC stadium impianto regolamento, LFP Team 2025 EN,
LaLiga transparency, FM supporter confidence, sortitoutsi FM23
supporter, thedrinksbusiness Euro 2024 booze, mirror UK England-Serbia
beer ban, Pioneer fan-zone paper, modding.wiki Kingdom-Come, UEFA
disciplinary decisions (Arsenal, Eintracht Frankfurt), barcainnovationhub
stadium revenue, premierleaguestadiumfund accreditation, expectinggoals
set-piece analytics, footballbenchmark match-day, FA safety/weather
considerations. Full URL list in source `.md`; new URLs surface via the
respective synthesis notes.
## Related

- [[README]]
- [[../regulations-and-pyramids-research]]
- [[../fan-culture-segmentation-research]]
- [[../progressive-disclosure-research]]
