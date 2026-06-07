---
title: "Raw — Real-world football media ecology (outlet types, stance, reach, cadence) (FMX-82)"
status: raw
tags: [research, raw, perplexity, media, outlets, real-world, editorial-stance, reach, cadence, fmx-82]
created: 2026-06-07
updated: 2026-06-07
type: research
binding: false
linear: FMX-82
related:
  - [[../media-outlet-operational-behaviour-2026-06-07]]
---

# Raw capture — Real-world football media ecology (Perplexity, 2026-06-07)

Verbatim-faithful capture of the Perplexity strand on the real-world football media
ecology, for abstract IP-safe modelling. Synthesis in
[[../media-outlet-operational-behaviour-2026-06-07]].

## Prompt (summary)

Describe the real-world football media ecology to model abstractly: (1) outlet TYPES
and how they differ; (2) editorial STANCE/BIAS drivers; (3) REACH/audience scope;
(4) publication CADENCE; (5) how rivalries, results and the manager-press relationship
shape coverage. Give the small set of dimensions that best capture an outlet abstractly
and how stance realistically reacts to events. Keep IP-safe.

## Key findings (verbatim-faithful)

Model the ecology as a small set of outlet "species" differing along shared attributes:
**Type · Stance · Reach · Reliability · Cadence**, reacting dynamically to events.

### 1. Outlet types
- **National broadsheet (quality press)** — analysis/context/credibility; higher reliability,
  moderate sensationalism, broad reach.
- **National tabloid (mass-market sensational)** — attention/emotion; rumours, crisis narratives,
  gossip; high sensationalism, variable reliability, very high volume.
- **Regional/local press** — geographic loyalty; detailed local-club coverage; narrow reach, high
  local interest, tone coupled to local sentiment/results.
- **Club-aligned / in-house media** — club-owned; PR + fan service; positive framing, near-zero
  negative internal coverage; high access, high factual reliability but biased interpretation.
- **Broadcasters (TV/radio/streaming)** — rights-dependent; live coverage + studio debate; very
  high global reach for top competitions; cadence spikes around live events.
- **Wire agencies** — neutral, fast, fact-driven feedstock for others; high reliability, low
  sensationalism; indirect influence (decide the floor of "newsworthy enough").
- **Online-only / aggregators / click-farms** — SEO/virality; rewrites, rumour lists, outrage bait;
  high click-sensitivity, medium-low reliability, constant cadence following search trends.
- **Fan media (blogs/podcasts/fanzines)** — by/for fans; strong emotional tone (devotion↔fury);
  narrow-to-medium reach but huge influence on hardcore fan sentiment; very result/rivalry-sensitive.

### 2. Editorial stance / bias — decompose into numeric attributes
`ClubAffinity[club/cluster]` (hostile→neutral→supportive), `Sensationalism` (0–100),
`Independence` (0–100, inverse of PR alignment), `AccessDependence[club/league]` (0–100),
`CommercialFocus` (traffic vs prestige).
Drivers: (1) ownership/political-commercial interests; (2) revenue model (ad/click → sensational;
subscription → quality/trust; club-funded → positive spin); (3) **access journalism** (reliance on
exclusives softens criticism of source clubs/agents); (4) regional loyalty & rivalries; (5)
sensationalism for clicks; (6) club relationships (in-house/friendly run puff pieces, reframe
negatives as bad luck/conspiracy).

### 3. Reach / audience scope — three axes
Geographic scope (local → regional → national → continental → global), audience size (small →
mass), audience composition (hardcore vs casual vs general). Local press dominates small-club
narrative; national press shapes the "official" narrative; broadcasters/platforms propagate
talking points; wires are a silent global backbone; aggregators are global-but-language-bounded;
fan media are global-but-niche. **Big club** = baseline coverage from local→national→international,
even minor events covered, rumours multiply. **Small club** = mostly local/regional + fan media;
national/global only on upsets/relegation/giant-killings. Suggested device: a per-club **"news
gravity"** score; `CoverageProbability = f(outlet reach, club news gravity, story importance,
outlet affinity)`.

### 4. Publication cadence — structural cycles + shock events
Baseline by club size (big = daily multi-outlet flow; medium = consistent local + intermittent
national; small = mostly pre/post-match + occasional features). Temporal cycles: **matchdays**
(previews → live → reports/ratings/reactions; tabloids/fan media spike emotionally first,
broadsheets follow with measured analysis), **transfer windows** (rumour volume explodes,
aggregators/tabloids ramp hardest), **crises/inflection points** (losing streaks, leaks, scandals,
ownership issues — sensational outlets + fan media spike, broadsheets do deep dives, in-house goes
quiet/reframes). Game form:
`Cadence = BaseCadence[clubSize × outletType] + MatchdayFactor + TransferWindowFactor + CrisisFactor + BigEventFactor`.

### 5. Rivalries, results, manager-press relationship
- **Rivalries** (define a rivalry matrix): more preview/reaction content for rival fixtures; more
  schadenfreude on rival failure; national outlets build "who owns this era" narratives.
- **Results**: emotional swing largest for fan media + high-sensationalism outlets + high-gravity
  clubs. Positive → supportive amplify, neutral cover if surprising, hostile downplay ("lucky").
  Negative → supportive reframe as blip, neutral give balanced analysis, hostile maximalist crisis.
- **Manager-press relationship** (an outlet↔manager score, e.g. −100..+100): good → friendlier
  framing/benefit of the doubt; hostile → amplify failures/leaks/sacking rumours; charismatic
  managers can partly shape narrative; exclusives improve relationship and shift tone.

### 6. Core abstract attributes per outlet
1. **Type** (categorical). 2. **Reach** (`Scope`, `AudienceSize`, `AudienceProfile`).
3. **Stance** (`ClubAffinity[]`, `Sensationalism`, `Independence`, `AccessDependence[]`,
   `CommercialFocus`). 4. **Reliability/Reputation** (`FactReliability`, `RumorReliability`,
   `PerceivedAuthority`). 5. **Cadence** (`BaseCadence`, `EventSensitivity` weights).
6. **Tone generation** (`PositivityBias`, `ResultSensitivity`, `CrisisAmplification`).

### 7. Dynamic stance reactions (examples)
Winning streak + good relationship → affinity slowly rises, crisis thresholds rise. Repeated
high-stakes failures → short-term criticism spike then affinity drifts neutral (hostile amplify
"bottlers"). Manager bans/insults an outlet → relationship strongly negative, less positive
coverage / more rumours, other outlets cover the "manager vs media" story. Exclusive access →
high-AccessDependence outlets become more positive / less willing to break damaging stories.
Scandal → broadsheets investigate (high reliability), tabloids/aggregators explode (mixed
reliability), in-house goes quiet, fan media split. Recompute Tone + Cadence each "tick" from
results/league position, event flags, relationship scores, global context.

### 8. Plugging into a management game
Represent a manageable number of outlets (handful per key market; abstract small ones into
**clusters** e.g. "Local Press"/"Global Tabloid Cluster"). For each event × outlet: decide cover
(reach × gravity × importance × affinity) → tone (stance + relationships) → prominence (reach ×
drama). Aggregate tone × prominence into public mood / board perception / player morale; player
reacts via press conferences, granting/denying access, leaks to friendly outlets, media training.
