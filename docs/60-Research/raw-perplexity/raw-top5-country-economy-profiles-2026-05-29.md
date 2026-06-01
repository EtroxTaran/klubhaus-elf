---
title: Raw Perplexity - Top-5 Country Economy Calibration Profiles 2026-05-29
status: raw
tags: [research, raw, perplexity, economy, finance, country-profile, calibration, germany, england, spain, italy, france, fmx-53]
created: 2026-05-29
updated: 2026-05-29
type: research
binding: false
linear: FMX-53
sourceType: perplexity
related:
  - [[../top5-country-economy-profiles-2026-05-29]]
  - [[../club-economy-blueprint-2026-05-27]]
  - [[../../50-Game-Design/GD-0008-finance-economy]]
  - [[../../50-Game-Design/economy-system]]
  - [[../ip-and-licensing]]
  - [[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]]
---

# Raw Perplexity - Top-5 Country Economy Calibration Profiles 2026-05-29

Lossless-ish capture of the FMX-53 external research pass. Four thematic
Perplexity queries were run, each spanning all five countries so coverage stays
equal-depth. Promoted into the synthesis
[[../top5-country-economy-profiles-2026-05-29]]. Not binding; never the only
source. Real league/club names appear here for analysis only — shipped game data
stays IP-clean per [[../ip-and-licensing]] and
[[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]].

> Confidence note: Deloitte and UEFA figures are primary/authoritative. Several
> ticketing, ownership and tax figures came back anchored to secondary analysis
> (Daniel Geey, The Esk, FSA, KPMG/EY country tax profiles) or were flagged by
> the model as "widely established" rather than pulled from a named primary
> source. Those are marked lower-confidence in the synthesis and need a primary
> re-check before any number is treated as final calibration.

## Query 1 — Club revenue mix (matchday / broadcast / commercial)

Representative ranges (Deloitte 2023/24 Big-Five aggregate: €20.4bn revenue,
€9.4bn broadcast, €8.0bn commercial — commercial was the primary growth driver):

| League | League revenue (recent) | Avg club revenue | Matchday | Broadcast | Commercial |
|---|---|---|---|---|---|
| Premier League | ~€7.0bn+ (2023/24), largest | ~€368m / 20 clubs | 12–18% | 44–52% | 34–42% |
| Bundesliga | ~€3.0–3.4bn | ~€160–180m / 18 | 10–15% | 35–45% | 40–50% |
| LaLiga | ~€3.0–3.3bn | ~€150–165m / 20 | 10–16% | 38–48% | 34–46% |
| Serie A | ~€2.3–2.6bn | ~€115–130m / 20 | 8–14% | 42–52% | 30–40% |
| Ligue 1 | ~€1.8–2.0bn | ~€95–105m / 18 | 8–13% | 45–60% | 25–38% |

Big-vs-small dispersion (cited top/bottom revenue multiples): PL ~1.6x (most
balanced), Serie A ~2.3x, Ligue 1 ~3.2–3.3x, Bundesliga ~3.3x, LaLiga
~3.6–3.8x (most concentrated). Big clubs skew commercial-heavy; small clubs
skew broadcast-dependent.

Sources: Deloitte Annual Review of Football Finance / Money League 2026;
danielgeey.com broadcasting-deals analysis; tifosy.com broadcasting breakdown;
Statista Big-Five; Wikipedia Big Five.

## Query 2 — Media distribution model + financial-control regime + parachute style

- **England (PL):** centralized domestic sale; split 50% equal / 25% merit /
  25% facility fees; overseas historically more equal. Most equalized of the
  big-5. Instalment payments across the broadcast year. Control = PSR: max £105m
  loss over rolling 3 years, points-deduction sanctions. Parachute payments over
  up to 3 seasons (2 for 1-year members), front-loaded — the only league with a
  large formal relegation buffer.
- **Germany (Bundesliga):** centralized DFL sale; heavily performance-weighted:
  ~70% five-year league performance, 23% five-year both-divisions, 5% 20-year,
  2% German U23 minutes. Instalment payments. Control = DFL licensing: pre-season
  liquidity/viability proof + in-season monitoring (a solvency gate, not a PSR
  ratio). No PL-style parachute; relies on redistribution.
- **Spain (LaLiga):** centralized since 2015/16; split 50% equal / 25% five-year
  sporting / 25% popularity (matchday income + TV audience) — amplifies big
  clubs. Monthly/periodic instalments. Control = LCPD "Límite de Coste de
  Plantilla Deportiva" individualized squad-cost cap; overspend blocks player
  registration even if cash exists → strictest wage-registration regime. Limited
  parachute; steep TV cliff on relegation.
- **Italy (Serie A):** centralized Lega Serie A sale; split = equal share +
  sporting results + fan base/tradition + market factors (exact % not in source).
  Instalments. Control = FIGC/COVISOC licensing + economic indicators; moderate
  ex-ante control, less rigid than LCPD/PSR. No broad parachute → steep cliff.
- **France (Ligue 1):** centralized LFP sale; classic 50–30–20 (50% equal/fixed,
  30% standing, 20% media profile). Instalments. Control = DNCG, the clearest
  ex-ante budget-control body — reviews budgets in advance, can impose
  recruitment/payroll restrictions before insolvency. No PL-style parachute.

All five → model media income as **instalment-based**, not annual lump sum.

Sources: danielgeey.com; Deloitte; sportbusiness.com; sportspro.com; theesk.org.

## Query 3 — Matchday & season-ticket culture + stadium ownership

- **Germany:** highest attendance ~43–45k, top clubs >95–98% utilisation, league
  ~90–95%. ST-dominant (60–70%+ of capacity at big clubs), long multi-year
  waiting lists. Cheapest big-5 per game; safe-standing/terraces structurally
  central (50+1, member control); cheapest ST often standing €200–350, top seats
  ~€800–1000. Mostly club-owned/long-lease stadiums → strong revenue capture;
  yield from **volume not price**.
- **England:** attendance ~39–41k, >95% utilisation league-wide. ST 60–80% of
  capacity, membership-gated singles. Most expensive in Europe: cheapest adult ST
  avg ~£600, dearest avg ~£1210 (2024/25 FSA/Esk); outliers — Fulham £3084,
  Arsenal £921–£1726, West Ham cheapest £345. ~19% ST inflation since COVID.
  Almost all club-owned high-yield assets; premiumisation monetized directly.
  Highest ARPU (ticket + F&B + merch).
- **Spain:** attendance ~28–30k, bimodal utilisation (giants 80–90%+, long tail
  <70%). Strong "abono" culture at top/community clubs; growing tourist dynamic
  pricing. All-seater (no standing factor). Big clubs club-owned & heavily
  monetized (Bernabéu, Metropolitano, San Mamés); smaller clubs municipal/shared
  → limited ancillary capture. Mid-to-high prices for giants, low-mid for rest.
- **Italy:** attendance ~29–31k but **utilisation only ~60–75%** — large old
  municipal grounds. Weaker, more volatile ST culture; more single-ticket room.
  Cheap entry prices (single tickets as low as €9 at AC Milan). The "municipal
  stadium problem": most clubs don't own grounds, lease cheaply but can't
  redevelop; shared San Siro dilutes brand. Few modern exceptions (Juventus
  Allianz, Udinese, Sassuolo) with outsized economics. Low per-seat revenue.
- **France:** attendance ~24–26k, variable utilisation (PSG/Lens/Marseille
  >85–90%, many <75%). Medium ST share, bimodal pricing (PSG luxury, rest
  affordable). All-seater. Mixed ownership — some modern club-controlled (Lyon
  Groupama, Lille), many municipal/public-private post-Euro-2016 with varying
  control. PSG monetizes strongly; rest modest.

Sources: theesk.org ticketing/accessibility analysis 2025/26; thefsa.org.uk
StopExploitingLoyalty; UEFA attendance benchmarking; fanbaseclub.com pricing.

## Query 4 — Commercial scale + tax/levy + matchday operating costs

Commercial intensity ranking (share + sophistication, not absolute size):
England > Germany > Spain (top-heavy) > France (PSG-skewed) > Italy
(under-indexes). Big-5 commercial revenue ~€7.6bn (2022/23).

Suggested commercial multipliers vs big-5 baseline 1.0: PL 1.3–1.4; Bundesliga
1.2–1.3 (deep mid-table commercialisation); LaLiga 1.05–1.1 league-avg but steep
drop-off outside top 6 (Real/Barça each €400–500m+, Madrid >€1.2bn total
2024/25); Serie A 0.8–0.9 (under-investment, governance/stadium drag); Ligue 1
~0.9 overall but PSG 1.2–1.3.

Tax / levy (model as "gross wage cost for a target net" + "tax drag on profit"):
- **England:** corp tax 25%; employer NICs 13.8% (~+10–12% on top wages); no
  football-specific regime.
- **Germany:** combined corp ~29–30%; high social contributions (~20%+ employer)
  → high payroll on-cost; no special football tax.
- **Spain:** corp 25%; top PIT ~45–48% regional; "Beckham Law" expat flat
  ~24–24.75% (curtailed for footballers after 2015, partly revived 2023 Start-up
  Law — now case-specific). Model as a modest net-wage discount flag for some
  foreign signings.
- **Italy:** IRES 24% + IRAP ~3–3.9% (~27–28%); "Decreto Crescita" gave
  50% (sometimes 70%) income exemption for incoming workers 2019→ ; **abolished
  for footballers from 2024 contracts** (grandfathered). Model the net-wage
  advantage 2019/20–2023/24 then switch off.
- **France:** corp 25%; very high employer social charges (~30–45% of gross) →
  costliest labour in big-5. Former 75% super-tax (2013–15, abolished). **"Taxe
  Buffet" = 5% levy on sale of sports broadcast rights** funding amateur sport →
  model as a haircut on distributable central TV revenue.

Matchday operating-cost index vs big-5 avg, and policing: PL 1.2–1.3 (clubs
charged for policing on/adjacent to property, litigated, high UK labour cost);
Bundesliga 1.0–1.1 (large steward forces, DFL/Länder policing-cost disputes,
less universal billing); LaLiga 0.9–1.0 (mostly state-funded policing); Serie A
0.8–0.9 (state-borne policing, lower unit labour cost); Ligue 1 1.0–1.1
(state-funded policing, high social on-costs on staffing).

Sources: Deloitte Money League / Annual Review; europeanleagues.com financial
landscape report; Statista commercial revenue big-5; KPMG/EY country tax
profiles (model-cited); winningwithanalytics.com; French sports-ministry "taxe
Buffet" documentation.

## Primary source anchors carried from prior FMX economy notes

- UEFA Club Licensing & Financial Sustainability Regulations 2025 (squad-cost
  ratio 70% from 2025/26):
  <https://documents.uefa.com/r/UEFA-Club-Licensing-and-Financial-Sustainability-Regulations-2025-Online>
- UEFA European Club Finance and Investment Landscape 2026:
  <https://www.uefa.com/news-media/news/02a2-200452a66064-0cfd3f86b94f-1000--new-report-highlights-record-revenues-and-increasing-investment-into-european-football/>
- Deloitte Annual Review of Football Finance 2025:
  <https://www.deloitte.com/global/en/Industries/tmt/research/annual-review-of-football-finance.html>
- Deloitte Football Money League 2026:
  <https://www.deloitte.com/uk/en/services/financial-advisory/analysis/deloitte-football-money-league.html>
- Premier League Handbook 2025/26 (parachute 55/45/20% over up to 3 seasons):
  <https://resources.premierleague.pulselive.com/premierleague/document/2025/10/22/c03ebde8-8b59-4822-9f3b-bd42ed587f92/PL_Handbook_25-26_07.10.pdf>

## New secondary source URLs (accessed 2026-05-29)

- Daniel Geey — broadcasting deals across the top-5:
  <https://www.danielgeey.com/done-deal-blog/football-broadcasting-deals-across-the-top-5-european-leagues>
- Tifosy — broadcasting breakdown of the European big-5:
  <https://www.tifosy.com/insights/broadcasting-breakdown-the-european-big-5-3481>
- The Esk — Premier League / European ticketing & fan accessibility 2025/26:
  <https://theesk.org/2025/09/07/the-analysis-series-premier-league-european-football-ticketing-fan-accessibility/>
- Football Supporters' Association — Stop Exploiting Loyalty:
  <https://thefsa.org.uk/stopexploitingloyalty/>
- European Leagues — Financial Landscape of European Football report:
  <https://europeanleagues.com/wp-content/uploads/REPORT-THE-FINANCIAL-LANDSCAPE-OF-EUROPEAN-FOOTBALL.pdf>
- Statista — commercial revenue of the big-5 leagues:
  <https://www.statista.com/statistics/1023150/commercial-revenue-big-five-football-leagues/>
