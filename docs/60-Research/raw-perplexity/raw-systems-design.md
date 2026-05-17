---
title: Raw - Core Club-Simulation Systems and Their Interplay
status: raw
tags: [research, raw, perplexity, systems, gameplay]
created: 2026-05-16
updated: 2026-05-16
type: research-raw
binding: false
related: [[README]], [[../systems-design-synthesis]], [[../fan-culture-segmentation-research]]
---

# Raw - Core Club-Simulation Systems and Their Interplay

> Source: private Perplexity transcripts (2026-05-16), Doc 2 sections 1082-2282.
> Two parallel iterations covered: "Systemdesign, Tiefe und Zusammenspiel" and
> "Ausarbeitung der Kernsysteme und ihres Zusammenspiels". Feeds
> [[../systems-design-synthesis]] and the Game-Design notes in `50-Game-Design/`.

## English summary

The transcript builds a 7-pillar model of a club: **Identity & Governance,
Economy, Infrastructure (Stadium + Campus), Fans & Brand, Sporting Core
(squad/staff/scouting/medicine/training/youth/transfers), Tactics & Match,
Time & Competition**. Each pillar is detailed with sub-mechanics (e.g.
Cash-flow vs Liquidity vs Transfer budget vs Wage budget vs Debt vs Reserve;
8 stadium revenue streams; 6 sponsor tiers; 6 fan segments; 7 sporting org
roles; 7-step recruitment funnel; 8 training blocks; 6 tactical layers; 5
set-piece modules; 4-stage match engine).

The central design principle is **the cascade**: every decision produces side
effects in other systems. Pressing tactic → fatigue → injuries → rotation →
morale issues → results → board pressure. The Perplexity output spells out
five master feedback loops (Fans→Atmosphere→Sport→Marketing; Infrastructure
→Development→SquadValue→Finance; Sponsors→Stadium→Experience→Sponsors;
Tactics→SquadNeed→Recruitment→Tactics; Risk→Debt→Pressure→Decisions).

Three concepts are flagged as differentiators against FM and Anstoss:
**Club-DNA system** (5-7 measurable identity axes), **stadium atmosphere as a
match-engine parameter** (steh-platz/Würstchenbude/fan-sector affect the
simulation directly), and **roguelite carries** that make permadeath
motivating not punitive.

## 1. System architecture - the 7 pillars

1. **Club Identity & Governance** - board, mission, philosophy, club size,
   expectation profile.
2. **Finance & Economy** - cash-flow, budget pots, sponsoring, match-day,
   debt, liquidity.
3. **Infrastructure & Stadium** - capacity, hospitality, catering, training
   and academy buildings.
4. **Fan & Brand Ecosystem** - core fans, ultras, families, away fans,
   image, atmosphere.
5. **Sporting Core** - squad, staff, scouting, medicine, training, youth,
   transfers.
6. **Tactics & Match System** - formation, roles, pressing, set pieces,
   morale, match events.
7. **Time & Competition Structure** - weekly rhythm, transfer window,
   match-days, injuries, development over seasons.

Each system produces *states* that become *costs, chances or risks* in others.
Crowd atmosphere ↑ home advantage and sponsor appeal; better sponsors fund
infrastructure; better infrastructure ↑ development and match performance;
sporting success ↑ fan growth and merch; over-extended wage structure ↓
liquidity and ↑ sacking risk.

## 2. Club Identity and Governance

### Club DNA parameters

| Parameter | In-game effect |
|---|---|
| Club size | Higher table / transfer / squad-depth expectations |
| Tradition | Fans react harder to style-breaks and selling icons |
| Region / economy | Sponsor potential, attendance base, talent pool |
| Board profile | Cautious / aggressive / youth-focused / profit-driven |
| Club philosophy | Pressing football / youth / selling club / defensive |
| Debt position | Liquidity pressure, credit cost, transfer cap |
| Brand strength | Merch turnover, sponsor tier, international reach |

### Board as a system, not a popup

Board reacts on internal KPIs not just placement:

- Table goal
- Budget discipline
- Wage-to-revenue ratio
- Youth minutes
- Transfer P&L
- Environment mood
- Stadium utilisation
- Media image

This produces a believable pressure loop: sporting failure on a high cost base
is much riskier than 10th place on a lean squad with positive cash-flow.

## 3. Economy system

### Account layers required

- **Liquidity** - cash immediately available.
- **Operating result** - revenue minus running cost.
- **Transfer budget** - board-released investment mass, *not* equal to cash.
- **Wage budget** - weekly / monthly ceiling.
- **Debt** - loans, instalments, interest pressure.
- **Risk reserve** - cushion against injury waves, relegation, missed bonuses.

### Revenue sources (detail)

| Source | Depth |
|---|---|
| Ticketing | Price tiers, demand, opponent attractiveness, weather, table |
| Season tickets | Planning security but less price flexibility |
| Hospitality / VIP | High potential, depends on comfort + business demand |
| Catering | Attendance, dwell time, stand density + quality |
| Merchandising | Brand strength, fan bonding, player popularity |
| Sponsoring | Success, reach, stadium assets, audience fit |
| Media rights | League-tier dependent |
| Transfers | Profit realisation but sporting risk |
| Events / tours | Non-match-day usage, stadium-dependent |

### Cost structure

- Player wages
- Staff wages
- Bonuses
- Transfer instalments and amortisation
- Stadium operation and maintenance
- Academy + scouting network
- Medicine + sport science
- Travel
- Debt service
- Match-day security and operation cost

### KPIs (instead of "balance green/red")

- Wage ratio to revenue
- Transfer ratio to revenue
- Match-day dependency
- Sponsor dependency
- Merch per fan
- Hospitality utilisation
- Home-grown share of squad
- Squad value vs book value

These KPIs *force a management style*. A small club can be sustainable by
developing+selling talents; a bigger club can be fragile despite high turnover
if wages and debt grow too fast.

## 4. Sponsoring as an asset portfolio

Real clubs monetise jersey front, sleeve, training kit, naming rights,
hospitality areas, LED boards, app inventory, match-day content and fan-zone
activations as **separate inventories** - the game should too.

### Sponsor categories

| Tier | Examples |
|---|---|
| Main partner | Jersey front, global lead partner |
| Secondary | Sleeve, shorts, training kit |
| Infrastructure | Stadium name, stand, academy, training centre |
| Match-day | Half-time show, fan zone, drinks partner, catering |
| Digital | App, line-up post, goal alert, fantasy/data partner |
| Local | Crafts, dealerships, regional brewery, SME |

### Sponsor valuation factors

- Club reach
- Brand safety / image
- Table + league level
- Stadium utilisation
- Hospitality quality
- Fan profile + regional fit
- Media resonance
- Per-category exclusivity

**Strategic depth**: sponsors should bring *side conditions* (youth focus,
family image, minimum reach, hospitality capacity, exclusion of other
industries), not only money.

## 5. Stadium build and club grounds

### Three layers of the stadium

1. **Capacity and seat mix** - standing, seating, premium, suites.
2. **Experience quality** - sightlines, comfort, access, cleanliness,
   security, connectivity.
3. **Commercial layer** - catering, fan shop, fan zone, sponsor surfaces,
   events.

### Expansion logic - trade-offs not linear

- Standing room ↑ volume + ultras density but lower per-seat revenue.
- VIP areas ↑ revenue but core fans may feel alienated.
- Fan zone ↑ dwell time + catering revenue but costs floor space, staff,
  security.
- Construction phases temporarily ↓ capacity + revenue.

### Stadium modules (effect matrix)

| Module | Primary effect | Secondary effect |
|---|---|---|
| Extra stand | Capacity | Higher maintenance and staffing |
| VIP suites | Higher revenue per seat | Better sponsor deals |
| Beer / sausage stand | Match-day revenue | Fan mood, dwell time |
| Fan shop | Merch revenue | Brand bonding |
| Fan zone | Atmosphere + sponsor activation | Security + event costs |
| WiFi / app infrastructure | In-app revenue, CRM | Sponsor digital inventory |
| Museum / tour | Non-match-day revenue | Club prestige |
| Event area | Non-match-day revenue | Pitch and logistics load |

### Club campus (beyond stadium)

- Training pitches by quality and specialisation
- Rehab / medical centre
- Performance diagnostics + sport science
- Youth academy + boarding
- Scouting and analysis centre
- Media + sponsor lounge

These don't just bump numbers - they change *process quality*: less downtime,
better regen, sharper reports, faster integration, higher-value sponsor visits.

## 6. Fan ecology and atmosphere

Fan culture is central because it unites sporting, economic and political
effects. Strong crowd support affects home advantage and even referee
behaviour. So mood is part of the simulation, not décor.

### Fan segments

- **Hardcore / Ultras** - loud, tradition-sensitive, max atmosphere impact.
- **Regulars** - season tickets, identity-strong, price-sensitive, stable.
- **Event / family fans** - quieter but economically important for side
  revenue.
- **Success fans** - grow on win streaks, drop fast on crisis.
- **Away travellers** - prestige and rivalry dynamics.

### Fan metrics

| Metric | Effect |
|---|---|
| Loyalty | Stabilises attendance even in crisis |
| Volume | Home advantage, player boost, opponent pressure |
| Radicality | Choreo potential, but higher penalty risk |
| Family-friendliness | Sponsor fit, catering revenue |
| Frustration | Protests, whistles, board pressure |
| Pride / identification | Merch turnover, stadium utilisation |

### Atmosphere engine inputs

Derby/rivalry, table context, utilisation, fan segments + stadium
architecture, weather + kickoff time, security interventions, current form +
club mood.

### Atmosphere outputs

Home advantage, morale swings in match engine, sponsor perception, social
buzz, per-capita match-day revenue.

### Fan politics & conflict triggers

Ticket-price hikes, displacement of active scene, sale of a club icon,
VIP-area over-expansion, sponsors from incompatible industries.

## 7. Squad and club structure

### Sporting organisation roles

- Manager / head coach
- Sport director
- Chief scout
- Data analyst
- Head of youth
- U-team coaches
- Fitness coach
- Medical / rehab team
- Set-piece coach
- Goalkeeping coach

Each role is part of pipelines, not isolated buffs. Strong chief scout without
analyst → many names but poor comparability. Strong medical team without
fitness coach → shorter rehab but no peak-load prevention.

### Squad design dimensions

- Immediate performance
- Tactical fit
- Age profile
- Personality
- Wage structure
- Resale value
- Home-grown / academy ratio
- Injury risk

A 29-year-old star instantly upgrades results but can destroy wage structure,
youth pathway and squad value.

## 8. Scouting and recruitment

### Recruitment process

1. **Needs analysis** - which role is missing for the play model?
2. **Long list** - many candidates, blurred data.
3. **Short list** - by role fit, budget, personality, timing.
4. **Deep scouting** - live + video + data report.
5. **Risk assessment** - adaptability, injuries, mentality.
6. **Negotiation** - club, player, agent, bonus structure.
7. **Integration** - language, tactical learning, social embedding.

### Scout attributes

| Attribute | Meaning |
|---|---|
| Current ability judgement | Accuracy on present strength |
| Potential judgement | Projection on youth |
| Regional knowledge | Data quality in given markets |
| Role understanding | Tactical fit analysis |
| Personality reading | Character + leadership |
| Network | More chances for early discovery |

### Market dynamics

Prices rise with competition, remaining contract length, wage demands, agent
relations, other clubs' squad needs and timing close to deadline. Async-MP
gains a lot here because players bluff and exploit time pressure.

## 9. Youth academy and player development

### Hidden + visible values per player

- Current ability
- Potential range (not a fixed cap)
- Learning ability
- Professionalism
- Ambition
- Resilience
- Injury proneness
- Positional understanding
- Game intelligence

### Development levers

| Factor | Influence |
|---|---|
| Training quality | Attribute growth, role learning |
| Match minutes | Match-readiness, decision quality |
| Mentoring | Personality transfer |
| Competition level | Learning curve vs overload |
| Infrastructure | Injury prevention, recovery |
| Morale / status | Training efficiency |
| Coach specialisation | Targeted role development |

### Development phases

- **U16-U18**: technique, coordination, game understanding, shape personality.
- **18-21**: hard minutes, loans, positional sharpening.
- **22-27**: peak build, tactical detail, role stabilisation.
- **28+**: performance maintenance, mentoring, physical decline.

### Loan system

Loans aren't just "+minutes". The target environment must fit: league quality,
play style, role, coach quality, guaranteed minutes, medical standards.
Otherwise a loan can *retard* development.

## 10. Training, load and medicine

### Training blocks

- Match Preparation
- Team Cohesion
- Tactical Familiarity
- Position-specific training
- Set Piece Sessions
- Recovery
- Physical Loading
- Individual Focus

### Load model

Load comes from minutes, intensity, travel, weather, fitness state and
medical history. High intensity briefly ↑ pressing and fitness but ↑ injury
+ form risk. Real resource management across the season.

### Medicine and sport science

Good medical centre delivers three things: shorter downtime, lower re-injury
rate, better end-of-season availability. Combined with diagnostics it lets a
club press harder, rotate more, develop juniors more stably.

## 11. Tactics system

### Tactical layers

1. **Formation** - 4-3-3, 3-4-2-1, …
2. **Play model** - positional, direct, counter, pressing-heavy,
   flank-oriented.
3. **Phase logic** - in possession, out of possession, transition to attack /
   defend, set plays.
4. **Roles** - target man, inverted full-back, ball-winner, deep-lying
   playmaker etc.
5. **Team rules** - defensive line, pressing trigger, passing risk, width,
   tempo.
6. **Opponent adaptation** - focus zones, man-marking, pressing traps,
   overloads.

### Role principle

Roles are not pure attribute buffs - they are *behaviour rules with
positional logic*. Full-back on attack ↑ width + runs but ↑ rest-defence
risk. Anchor 6 stabilises transitions but ↓ occupation of higher zones.
Forces compromises instead of meta-builds.

### Tactical familiarity

New tactics don't snap in. Teams learn automatisms over training + minutes +
squad continuity. Prevents exploits and makes squad-build, rotation and
staff quality matter.

## 12. Set pieces as a sub-system

### Modules

- Corners offensive / defensive
- Free kicks direct / indirect
- Throw-ins deep / high
- Penalties with psychological component
- Second balls and rear cover

### Key set-piece attributes

| Area | Sample attributes |
|---|---|
| Execution | Crossing, shot technique, composure, decisions |
| Target | Timing, heading, jumping, bravery |
| Blocker / runner | Anticipation, balance, aggression |
| Defensive org | Concentration, positioning, communication |

Set pieces tie tactics, training and squad-build together: a team with strong
crossers + headers can be efficient even with weaker open play.

## 13. Match engine

### Engine layers

1. **Pre-match setup** - team strength, form, morale, home advantage, tactic
   fit, fatigue, weather, referee profile.
2. **Field state model** - ball zone, team shape, pressing pressure,
   numerical up/down per zone, rest defence, set-piece state.
3. **Event resolution** - pass / dribble / pressing duel / aerial duel /
   shot / rebound / foul / set piece. Outcome from attributes + role + zone
   + fatigue + morale + pressure + RNG.
4. **Narrative layer** - text commentary, 2D animation, match stats,
   momentum.

### Match logic as a cycle

- Who controls which zone?
- Which safe action is likely there?
- How risky is that action for that role?
- How does the opponent react with pressing / cover / retreat?
- Does it produce progression, ball loss, foul or shot?

Matches emerge from many small local decisions, not one hidden dice roll.

### Event influence factors

| Factor | Effect |
|---|---|
| Attribute quality | Pass accuracy, finishing, duel strength |
| Role | Action priorities |
| Tactics | Zone occupation + risk profile |
| Morale | Bolder vs error-prone execution |
| Fatigue | Less pressing, lower concentration |
| Atmosphere | Home boost, opponent nerves |
| Set-piece scheme | Higher repeatability on dead balls |

### Useful match stats (not data trash)

Zone entries, ball wins in final third, pressing resistance, open vs
set-piece chances, cross quality, rest-defence errors, fatigue progression,
per-role impact on progression. These data points feed *back* into training,
transfers, tactic adjustments.

## 14. System interplay - the 5 master loops

### Loop 1: Fans → Atmosphere → Sport → Marketing

Better mood ↑ home advantage + match-day attractiveness. Success ↑ bonding,
utilisation, merch. Those ↑ sponsor values + match-day revenue. Money funds
squad + infrastructure.

### Loop 2: Infrastructure → Development → Squad Value → Finance

Better academy/training/medicine ↑ player quality + availability. Lower
external transfer cost. Home-grown ↑ in value, sales fund growth.

### Loop 3: Sponsors → Stadium → Experience → Sponsors

More hospitality / fan zone / digital activation surfaces ↑ sponsor
inventory. Strong partners fund further expansion. Better match-day
experience ↑ dwell time and per-visitor revenue.

### Loop 4: Tactics → Squad Need → Recruitment → Tactics

Play model defines roles you really need. Scouting targets sharper. Right
profiles ↑ tactical familiarity speed. Better execution ↑ performance and
validates the model.

### Loop 5: Risk → Debt → Pressure → Decisions

Over-aggressive investment ↓ liquidity + wage ratio. Sporting failure ↑
pressure. Manager makes panic transfers / sells icons. Fans and board
react. Drama emerges.

## 15. Detail tier per version (verbatim from source)

### Version 1 - Singleplayer Core

- Solid finance model with cash-flow, sponsors, match-day.
- Stadium build with capacity, catering, VIP, fan zone.
- Fan segments, atmosphere, home advantage.
- Squad build, scouting, youth, training, injuries.
- Tactics with roles, phases, set pieces.
- 2D match engine with comprehensible stats.

### Version 2 - Deeper Club Simulation

- Governance conflicts, board dynamics, media image.
- Sponsor inventory at asset level.
- Expanded staff inter-dependencies.
- Non-match-day revenue, events, museum, tours.
- Refined personality + mentoring systems.

### Version 3 - Async Multiplayer

- Private leagues with fixed match-day windows.
- Async management phases.
- Synchronous transfer negotiations between managers.
- Group-internal market + rivalry dynamics.
- Social layer: messages, provocation, deals, prestige.

## 16. Design principles (verbatim summary)

- **No number without context** - every KPI needs cause + effect.
- **No decision without trade-off** - building / transfers / tactics / prices
  never "more is better".
- **Atmosphere is a system, not a skin** - it must affect performance,
  finance, politics.
- **Tactics is behaviour, not just formation** - the play model must show
  in events.
- **Economy is tempo** - cash-flow, deadlines and seasonality create drama.
- **Youth is a portfolio** - not every cohort delivers; infrastructure
  reduces risk but never guarantees.
- **The stadium is a product** - not just capacity but dwell, comfort,
  sponsor activation drive yield.

## 17. Source citations (Doc 2 iterations 4-5)

Citations cover Deloitte Football Money League, FC Barcelona Innovation Hub
stadium revenue paper, European Leagues financial report, footballbenchmark,
Pioneer Group fan-zone paper, FM Scout supporter-confidence, ekkonocoaching
set pieces, expectinggoals set-piece analytics, Premier League stadium-fund
papers, Cambridge ultras-culture paper. Full URL list lives in the source
`.md`; we expose new URLs only via [[../systems-design-synthesis]] §Sources.
