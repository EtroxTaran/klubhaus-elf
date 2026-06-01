---
title: Raw Perplexity - Fan-Service Campaign Catalog and Effects 2026-06-01
status: raw
tags: [research, raw, perplexity, economy, fans, fan-service, sponsorship, travel, alcohol, safety, fmx-48]
created: 2026-06-01
updated: 2026-06-01
type: research
binding: false
linear: FMX-48
sourceType: perplexity
related:
  - [[../fan-service-campaign-catalog-and-effects-2026-06-01]]
  - [[../club-economy-impact-map-and-commercial-contracts-2026-05-28]]
  - [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../../50-Game-Design/audience-and-atmosphere]]
  - [[../../30-Implementation/club-economy-commercial-contracts]]
---

# Raw Perplexity - Fan-Service Campaign Catalog and Effects 2026-06-01

This note preserves the FMX-48 research prompts and condensed raw outputs. It is
not implementation authority and not final balance data. The synthesis is
[[../fan-service-campaign-catalog-and-effects-2026-06-01]]. Real clubs,
operators, sponsors, supporter bodies and campaigns appear for source evidence
only; shipped content must remain fictional and IP-clean per
[[../ip-and-licensing]] and
[[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]].

## Prompt 1 - away travel, special trains, buses and flights

Research real fan travel subsidies and club-organised away travel in European
football, especially special trains / Sonderzug, buses and flights. Focus on
2023-2026 where possible, supporter liaison / safety / logistics / costs /
risk.

### Condensed raw answer

- Public sources show away travel is a cost, safety and logistics issue more
  often than a transparent subsidy product. Exact club subsidy rates are rarely
  published.
- Strongest direct current source found in targeted follow-up: Deutsche Bahn's
  football fan page lists additional local and long-distance trains to football
  events and frames them as getting fans safely to and from the stadium.
- Historical German coverage records that football special trains can be
  expensive and damage-prone, and that some models force certain away supporters
  onto a chartered fan train. This supports modelling dedicated travel as
  high-capacity but requiring security, cleaning and damage reserves.
- DB's EURO 2024 preparation note reported more than 100,000 Fan Tickets sold
  before the tournament and extra capacity / special offers for football travel.
- 2026 international tournament coverage shows high travel cost and complex
  travel planning remain visible barriers for supporters.
- Game implication: travel campaigns should be capacity-bound and risk-bound:
  `away-train`, `bus-subsidy`, `flight-subsidy` and `green-away-scheme`.
  They improve away support, core/ultras mood and atmosphere, but create
  logistics cost, disruption, policing/station transfer and damage-reserve risk.
- Uncertainty: public sources do not establish a standard subsidy percentage;
  FMX should use profile ranges and visible assumptions, not real constants.

### Source anchors

- Deutsche Bahn, "Zusatz-Zuege zu Fussballspielen":
  <https://www.bahn.de/service/individuelle-reise/fanecke/angebot>
- Deutsche Bahn press release, "Ueber 100.000 verkaufte Fan-Tickets: DB ist auf
  EM-Sommer gut vorbereitet":
  <https://www.deutschebahn.com/de/presse/pressestart_zentrales_uebersicht/Ueber-100-000-verkaufte-Fan-Tickets-DB-ist-auf-EM-Sommer-gut-vorbereitet--12889148>
- RevierSport, Bundesliga clubs should pay for special trains:
  <https://www.reviersport.de/fussball/1bundesliga/a293065---bundesliga-vereine-sollen-sonderzuege-selbst-zahlen.html>
- Der Spiegel, "Fanzuege in der Fussballbundesliga: Bahn droht mit Abschaffung":
  <https://www.spiegel.de/sport/fussball/fanzuege-in-der-fussballbundesliga-bahn-droht-mit-abschaffung-a-1008827.html>
- Tagesspiegel, EURO 2024 special trains / security:
  <https://www.tagesspiegel.de/sport/sonderzuge-mehr-sitzplatze-mehr-sicherheit-wie-die-bahn-die-em-bewaltigen-will-11769182.html>
- CGTN Europe, 2026 fan travel cost concerns:
  <https://newseu.cgtn.com/news/2026-05-27/European-football-fans-question-cost-of-attending-2026-World-Cup-1Ntckx6oMFi/p.html>

## Prompt 2 - fan days, family days, community blocks and fan festivals

Research fan days, family days, summer parties, community ticket blocks and fan
festivals run by football clubs or stadiums, preferably 2023-2026 Europe.

### Condensed raw answer

- Public club/event sources show fan days and family/community activations are
  common, but profit/loss or attendance-uplift metrics are rarely disclosed.
- DFL documents kids and youth clubs for Bundesliga / 2. Bundesliga clubs as
  recurring activity frameworks beyond match attendance. This supports treating
  family campaigns as long-term loyalty pipeline, not pure matchday revenue.
- UEFA and FIFA fan festivals show the event pattern at larger scale: free
  public entry, sponsor/community zones, entertainment, capacity control and
  security/weather exposure.
- Community ticket blocks have clear design logic but thin public KPIs:
  better utilisation and local goodwill at the cost of short-term ticket yield
  and no-show risk.
- Game implication: `family-day`, `summer-party`, `community-ticket-day` and
  `fan-festival` campaigns should have direct event cost, optional sponsor
  contribution, capacity, weather sensitivity, no-show risk, and segment effects
  primarily on Family, Core, Casual and local community reputation.
- Legal/safety inference: child-focused events require safeguarding; digital
  passes or kids clubs imply consent/privacy handling; temporary event structures
  and public fan festivals require safety/licensing and weather fallback.

### Source anchors

- DFL, Kids and youth clubs of Bundesliga and 2. Bundesliga:
  <https://www.dfl.de/de/fans/inklusion-und-vielfalt/kids-clubs/>
- UEFA Conference League event guide, Leipzig Fan Festival:
  <https://www.uefa.com/uefaconferenceleague/event-guide/fan-festival/>
- FIFA World Cup 2026 Kansas City Fan Festival:
  <https://kansascityfwc26.com/fifa-fan-festival/>
- European Leagues, Europe Day 2026 matchday activation:
  <https://europeanleagues.com/european-domestic-football-to-lead-celebrations-around-europe-day-2026/>

## Prompt 3 - choreo support, supporter liaison and fan dialogue

Research choreo/material support, supporter liaison officers (SLOs), fan
dialogue, supporter group coordination and safety boundaries in European
football.

### Condensed raw answer

- UEFA and Football Supporters Europe define SLOs as bridges between clubs and
  supporters, facilitating two-way communication, trust, supporter group
  relationships, and coordination with police, stewards, transport and security.
- SLO work covers matchday and non-matchday projects: fan forums, information
  evenings, away travel information, risk fixture coordination and violence
  prevention.
- UEFA 2026 SLO workshop material explicitly highlights fan dialogue, matchday
  experience and the presence of fan materials inside stadiums. Structured
  communication is framed as preventing conflict and creating shared
  responsibility.
- FSE stresses that the SLO facilitates dialogue but does not represent or lead
  supporter groups. This matters for game design: the club cannot simply command
  fan groups.
- Game implication: `choreo-support` and `supporter-dialogue` campaigns should
  require a planning/approval step, SLO workload/trust, material budget,
  security agreement and supporter group acceptance. Positive outcome boosts
  atmosphere and trust; poor handling can trigger confiscated materials,
  protests, sanctions or broken-trust memory.
- Sensitive behaviours such as pyro or prohibited messages should be abstracted
  as risk flags, not simulated as how-to detail.

### Source anchors

- UEFA Practical Guide to Supporter Liaison:
  <https://editorial.uefa.com/resources/026f-13cca3e5461b-a462a58818bb-1000/uefa_practical_guide_to_supporter_liaison.pdf>
- UEFA, Supporter liaison guide:
  <https://fr.uefa.com/news-media/news/026f-13d62b668a5d-d52d71c97e09-1000--uefa-supporter-liaison-guide-building-bridges-between-club/>
- UEFA 2026 SLO workshop:
  <https://www.uefa.com/news-media/news/02a2-1fd6ec01dbc8-24265205eb2d-1000--shared-commitment-to-advanced-fan-dialogue-continues-at-th/>
- Football Supporters Europe, Supporter Liaison Officer:
  <https://www.fanseurope.org/supporter-liaison-officer/>
- UEFA Academy SLO education programme:
  <https://uefaacademy.com/wp-content/uploads/sites/2/2020/12/20200306_UEFA_SLO_Brochure_BD_final.pdf>
- Supporters Direct Scotland SLO page:
  <https://www.supporters-direct.scot/activities/slo/>

## Prompt 4 - alcohol-linked campaigns and beer-per-goal

Research alcohol-linked football fan campaigns and sponsor activations such as
beer-per-goal promotions, brewery partnerships, alcohol restrictions in stadiums
and safety/legal considerations.

### Condensed raw answer

- A direct current football case was found in targeted search: SV Darmstadt 98
  and Krombacher's "BoellenfallTOR Bonus" / goal bonus rewards supporters for
  home goals in the 2025/26 season. The older English page states supporters
  receive 98 litres of Krombacher Pils per home goal. This is strong evidence
  that a goal-linked beer reward can exist, but it is a specific local sponsor
  activation, not a universal template.
- Alcohol-linked football sponsorship remains common but differs strongly by
  country and venue rules. The Perplexity pass highlighted:
  - England: no alcohol consumption in football-ground areas with view of the
    pitch in the top tiers under the 1985 control law.
  - Scotland: stricter public-area ground ban, useful as a stricter profile.
  - France: Loi Evin restricts alcohol advertising/sponsorship; low/no-alcohol
    variants or off-site activations are safer abstractions.
  - Germany: more plausible for stadium-adjacent beer activations, still
    subject to local public-order rules.
  - Spain/Italy: source detail weaker; use medium/low confidence profile hooks.
- Public health and event-safety sources tie intense alcohol marketing to
  disorder, drink-driving and domestic-violence concerns around major events.
- Game implication: `beer-per-goal` should be country-profile gated and should
  allow non-alcoholic / soft-drink variants. It should increase sponsor
  satisfaction and some adult/casual/core buzz while risking family appeal,
  safety scrutiny, alcohol restrictions and regulator response.

### Source anchors

- SV Darmstadt 98, Krombacher BoellenfallTOR Bonus 2025/26:
  <https://www.sv98.de/krombacher-boellenfalltor-bonus-10/>
- SV Darmstadt 98, older English goal bonus page:
  <https://www.sv98.de/krombacher-boellenfalltor-goal-bonus-3/>
- UK legislation, Sporting Events (Control of Alcohol etc.) Act 1985:
  <https://www.legislation.gov.uk/ukpga/1985/57>
- Heineken campaign, "Cheers to the Real Hardcore Fans":
  <https://www.adsoftheworld.com/campaigns/cheers-to-the-real-hardcore-fans>
- Marketing Brew, World Cup alcohol marketing:
  <https://www.marketingbrew.com/stories/alcohol-brands-world-cup-marketing-soccer>
- Movendi, World Cup alcohol marketing and public health response:
  <https://movendi.ngo/media-snapshot/world-cup-exposes-tension-between-alcohol-industrys-marketing-ambitions-and-mexico-citys-public-health-response/>

## Prompt 5 - sponsor activation, measurement, low uptake and cooldown

Research sports sponsorship activation and event-marketing best practices
relevant to football fan-service campaigns: sponsor contribution, brand fit,
measuring impressions/attendance/NPS, low-uptake/cancellation handling,
cooldown/anti-spam frequency and operational risk.

### Condensed raw answer

- Modern sponsorship practice has shifted from logo exposure to co-created fan
  experiences, first-party data, measurable participation, engagement,
  impressions, conversions, sentiment and earned media value.
- Sponsor contribution is not only cash: sponsors may provide prizes,
  technology, media spend, staff, content, community grants or activation assets.
- Strong brand fit raises fan reception and sponsor ROI. Misaligned categories
  increase negative sentiment, especially for family/community events or alcohol
  campaigns.
- Low uptake and cancellation need make-good logic: extra LED/social inventory,
  another event slot, partial fee credit, sponsor extension or lower renewal
  value. Weather, safety, weak promotion, poor prize value and bad timing are
  recurring low-uptake drivers.
- Frequency matters: sources emphasize relevance and quality over saturation.
  Game inference should model fan communication fatigue and cooldowns for
  high-intensity data-capture or intrusive sponsor events.
- Legal/safety notes: UGC campaigns need rules, eligibility, content moderation,
  usage rights and data handling; physical activations need crowd-flow, staff,
  emergency planning and liability coverage.

### Source anchors

- SportsPro, tech and innovation in sponsorship activation:
  <https://www.sportspro.com/insights/features/sports-sponsorship-tech-activation-innovation-impact-x/>
- Brandlens, Sponsor Flywheel for fan video contests:
  <https://brandlens.io/blog/the-sponsor-flywheel-structuring-fan-video-contests-that-deliver-measurable-roi-2026-edition/>
- The DIGIDECK, sports sponsorship activation examples:
  <https://www.thedigideck.com/sports-sponsorship-activations/>
- SponsorCX, sports activation ideas:
  <https://www.sponsorcx.com/top-sports-activation-ideas-that-bring-fans-closer-to-the-game/>
- SponsorUnited, 2026 community sponsorship trend:
  <https://www.sponsorunited.com/insights/breakout-plays-the-trends-winning-sports-sponsorship-in-2026-community-sponsosrships>
- MoZeus, sports sponsorship activations:
  <https://www.mozeus.com/sports-sponsorship-activations/>

## Research caveats

- Club-level cost, ROI, subsidy and uplift data are usually not public. FMX
  should store profile ranges and assumptions rather than copying values.
- Spain/Italy alcohol policy and fan-service operating details need a later
  primary-source pass before country constants are frozen.
- Several sources are marketing / practitioner sources, useful for activation
  patterns but weaker for hard finance calibration.
