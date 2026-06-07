---
title: "Raw — Real-world matchday operating-cost structure & cheap estimation (FMX-92)"
status: raw
tags: [research, raw, perplexity, economy, matchday-costs, attendance, risk-tier, fmx-92]
created: 2026-06-07
updated: 2026-06-07
type: research
binding: false
linear: FMX-92
related:
  - [[../background-fast-cost-settlement-2026-06-07]]
---

# Raw capture — real-world matchday operating costs (Perplexity, 2026-06-07)

Verbatim-faithful capture of the Perplexity strand on how a single fixture's day-of operating
costs can be estimated cheaply from coarse inputs. Synthesis in
[[../background-fast-cost-settlement-2026-06-07]].

## Prompt (summary)

Real-world football matchday operating costs. How can a single fixture's day-of operating cost
be estimated cheaply from a few coarse inputs (expected attendance band + a security/public-order
risk tier) rather than itemising every cost? (1) main cost families + primary drivers;
(2) which costs are fixed per fixture vs linear in attendance vs step-function in risk tier — is
`cost = base(competitionTier) + perAttendee*attendanceBand + riskUplift(riskTier)` defensible;
(3) order-of-magnitude figures/ratios for top-5 leagues (SGSA, Special Police Services, UEFA);
(4) behind-closed-doors vs full house — which families remain, which collapse.

## Answer (verbatim)

A defensible **cheap-estimation model** for a single professional football fixture is: **base cost
by competition tier + attendance-linked variable cost + risk-tier uplift + weather/condition
shocks**. That is consistent with how the main matchday cost families behave in practice, although
some items are step-changes rather than smoothly linear. [2][3][4][5]

For your purposes, the most useful simplification is to treat **stewarding, temporary crowd-facing
staff, cleaning/waste, and some medical cover** as *attendance-sensitive*, **policing/Special
Police Services, extra security, and some compliance costs** as *risk-tier-sensitive*, and
**officials, many venue fixed costs, and much of insurance/compliance** as *mostly fixed per
fixture*. [2][3][4]

### 1) Main matchday operating cost families and primary drivers

| Cost family | What it covers | Main driver(s) | Typical behavior |
|---|---|---|---|
| **Stewarding / crowd management** | Stewards, queue management, turnstiles, segregation, ingress/egress | **Attendance**, **risk tier**, competition tier | Usually scales with crowd size; higher-risk fixtures need more stewards and supervisors. [4] |
| **Private security** | Contracted security guards, searches, perimeter protection | **Risk tier**, attendance | More step-like than linear; high-risk matches often require extra guards and search points. [4] |
| **Policing / Special Police Services** | Officers deployed at or around the ground, traffic/public-order policing | **Risk tier** most strongly; also attendance and local authority/police judgment | Often a major **step-up** for derbies, rivalries, or large away followings because clubs may be charged for "special services." [2][4] |
| **Medical / ambulance cover** | Ambulance, paramedics, doctor, first aid | **Attendance**, **competition tier**, risk tier | Usually partly fixed, then rises with crowd size and competition requirements. [4] |
| **Cleaning / waste** | Litter collection, post-match cleaning, toilets, waste removal | **Attendance** | Closely linked to attendance and hospitality usage; usually near-linear. [4] |
| **Energy / floodlights / undersoil heating** | Lighting, heating, pumps, generators, pitch systems | **Weather**, kick-off time, season, competition tier | Mostly fixed for the fixture, with weather-driven spikes. [4] |
| **Temporary catering & retail staff** | Concessions, bars, merchandising, tills, stock handling | **Attendance** | Strongly attendance-linked; more customers require more staff. [4] |
| **Match officials** | Referee, assistants, fourth official, VAR team where applicable | **Competition tier** | Largely fixed per fixture, driven by league/cup level and federation rules. [4] |
| **Pitch recovery / groundskeeping** | Re-lining, divots, turf repair, reseeding, post-match works | **Attendance**, **weather**, pitch type, competition tier | Partly fixed, but heavier usage and bad weather increase cost. [4] |
| **Insurance / compliance / licensing** | Event insurance, safety certificates, SAG/liaison, medical plans, steward plans | **Competition tier**, **risk tier**, stadium size | Mostly fixed-ish per fixture or per season allocation, with higher requirements at higher tiers. [3][4] |
| **Damage reserve / contingency** | Broken seats, vandalism, crowd damage, extraordinary repairs | **Risk tier**, attendance | Best modeled as a small expected-value reserve that jumps for high-risk matches. [4] |

The strongest public evidence for the *structure* of these costs comes from club-budget guidance,
which explicitly separates matchday costs such as referees and stewards, facility costs,
hospitality, and contingency/reserve items. [3][4]

### 2) Fixed vs attendance-linear vs risk-step

A practical classification is:

| Cost family | Best model form | Why |
|---|---|---|
| **Match officials** | **Fixed per fixture** | Typically set by competition rules rather than crowd size. [4] |
| **Base insurance / compliance** | **Mostly fixed** | Driven by hosting the match at that tier and stadium, with some uplift for risk. [3][4] |
| **Pitch recovery** | **Mostly fixed + weather shock** | Ground staff and wear-and-tear are incurred every match, but bad conditions increase work. [4] |
| **Energy / floodlights / heating** | **Mostly fixed + weather/time shock** | Main drivers are kick-off time and weather rather than attendance. [4] |
| **Cleaning / waste** | **Attendance-linear** | More spectators means more waste and more cleaning. [4] |
| **Temporary catering & retail staff** | **Attendance-linear** | Staffing needs rise with throughput. [4] |
| **Stewarding** | **Attendance-linear with risk step-up** | More fans require more crowd control; high-risk games need extra supervisory density. [4] |
| **Medical / ambulance** | **Base + attendance + risk step-up** | Minimum cover is needed, then additional resources for larger or higher-risk crowds. [4] |
| **Private security** | **Risk-step + some attendance** | A derby or high-risk classification often changes the required deployment materially. [4] |
| **Policing / SPS** | **Strong risk-step** | Police deployment is highly sensitive to public-order assessment and can jump sharply for derbies. [2][4] |
| **Damage reserve** | **Risk-step / expected loss reserve** | Best treated as a small probabilistic allowance rather than a smooth line. [4] |

So yes: **"base(competition tier) + perAttendee × attendanceBand + riskUplift(riskTier)" is a
defensible approximation**, especially if your goal is simulation rather than accounting
precision. The main caveat is that **risk-related costs are not smoothly linear**; they often
behave like **threshold/step functions** once a match is classified as higher risk. [2][4]

### 3) Rough public figures and ratios

Public, club-specific matchday cost figures are limited, but the literature and football
operations guidance support these order-of-magnitude relationships:

- **Stewarding** is commonly treated as a major variable matchday cost that rises with crowd
  size; club budgeting guidance explicitly lists **stewards** among matchday costs, alongside
  referees and hospitality-related staffing. [4]
- A useful modeling heuristic is to expect **stewarding and crowd-control costs to scale broadly
  with attendance**, while policing can change **nonlinearly** when the fixture is classed as high
  risk. [4]
- **Policing/Special Police Services** are often the largest single "shock" item for high-risk
  matches because clubs can be charged for police deployed above normal baseline cover under local
  "special services" arrangements. [2][4]
- For **behind-closed-doors** matches, many crowd-facing costs collapse, but not all matchday
  costs disappear; clubs still incur officials, some venue operations, utilities,
  broadcast/compliance, and pitch recovery. [3][4]

Because the prompt asks for league-by-league public figures and ratios, the honest answer is that
**widely comparable public fixture-level cost tables are scarce** for England, Germany, Spain,
Italy, and France. The public material more often describes *which* costs exist and what drives
them than giving standardized "£ per 1,000 fans" benchmarks. [3][4][5][7]

What is publicly and safely inferable is:

- **England** has the clearest public linkage between matchday safety planning and staffing costs
  because club and ground-safety guidance explicitly references stewards, matchday costs, and
  contingency planning. [3][4]
- **Germany, Spain, Italy, and France** also have comparable matchday expense families in
  professional football, but public standardized cost disclosures are much less accessible, so
  cross-league numerical comparison is usually inferred from club accounts rather than published as
  a single league benchmark. [7]

### 4) Behind closed doors vs full house

For **behind-closed-doors** / ghost matches: crowd-facing families collapse toward near-zero
(stewarding, temporary catering & retail staff, cleaning/waste largely tied to spectators, much
private security, and most policing), while **officials, base utilities/energy, pitch recovery,
base insurance/compliance, and broadcast/compliance** remain. This matches the project's
`closedDoor` risk tier ("Ticket and most catering income removed; required operations still post").

## Citations (as returned)

- [1] https://financialmodelslab.com/blogs/operating-costs/soccer-team
- [2] https://avecsport.com/blog/what-are-the-costs-of-running-a-football-club
- [3] https://www.irishfa.com/media/32465/club-operations-finances.pdf
- [4] https://www.youtube.com/watch?v=huT1P9Pevbs
- [5] https://footballbenchmark.com/club-finance-methodology
- [6] https://www.econstor.eu/bitstream/10419/328183/1/193339711X.pdf
- [7] https://www.statista.com/statistics/723826/average-operating-costs-football-clubs-europe/
