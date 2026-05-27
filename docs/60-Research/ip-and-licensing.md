---
title: IP and Licensing
status: ready
tags: [research, ip, gamedata, legal]
created: 2026-05-15
updated: 2026-05-17
type: research
linear:
related: [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]], [[00-summary]], [[anstoss-series-deep-dive]], [[competitor-matrix]], [[../10-Architecture/modules/game-data]], [[../95-Archive/gap-reports/feature-gap-analysis]]
---

# IP and Licensing

> Phase 1 research output (Wave 1).
> Defines the legal and product constraints for IP-clean club, player, league,
> crest, and stadium generation in the offline-first PWA football manager.
>
> **Scope:** product-level guidance, not a legal opinion. Any production launch
> decision that touches paid licensing, scraping, or brand-adjacent naming
> escalates to Nico (see [[../90-Meta/conventions]]).

## TL;DR

1. The game ships **fully IP-clean** at v1: no real clubs, no real player
   names, no real crests, no real sponsored stadium names, no protected
   competition names. Real-world *league structures* (tiers, table size, promotion
   rules) are mirrored because formats are not copyrightable, only the brand
   names attached to them.
2. The only data sources allowed for `packages/game-data` seed content are
   **CC0** (openfootball/football.json/football.db, Wikidata) and **CC BY**
   (GeoNames). OpenStreetMap (ODbL) is allowed for offline stadium *locations*
   but not for redistributable rendered tiles inside the PWA.
3. Hard-stop list (Section 4) is exhaustive for v1: DFL, FIFPro, FIFA, UEFA,
   Premier League, La Liga, Serie A, Ligue 1, plus all club crests, player
   names/likenesses, kit designs, and sponsored stadium names.
4. The fictional naming schema (Section 5) is **deterministic-seeded**, uses
   geographic + civic + heraldic morphemes, and is curated through a denylist
   so generated names cannot collide with any of the 100 best-known real
   clubs worldwide.
5. Two items remain `needs-decision` (Section 8): (a) whether the editor lets
   users *opt in* to community datapacks, (b) whether real country names and
   ISO codes count as protected branding (they do not, but kit colours mapping
   to national teams might).

## 1. Why IP-clean at all

The football-management genre has a 25-year history of trademark friction.
The relevant precedents that drove this research:

* **Manchester United v. SEGA / Sports Interactive (2020, EWHC 1439 Ch).**
  Manchester United sued the Football Manager publishers, arguing both that
  using the "Manchester United" word mark and *omitting* the official crest
  while showing other crests infringed their EU trademark. The case settled in
  2021; FM22 renamed the club to "Manchester UFC" "as a gesture of goodwill"
  while denying it legally required a licence. The case shows that even a
  defensible mark drives a multi-year legal cost. We do not want that cost.
* **DFL v. unlicensed publishers.** German courts have ruled that without a
  DFL licensing agreement, video-game developers cannot use Bundesliga club
  names or kit designs. The DFL holds an exclusive simulation-rights deal
  with EA Sports through 2027.
* **UEFA Champions League trademark.** UEFA holds 14 word-mark variants for
  "Champions League" (including "eCHAMPIONS LEAGUE") plus crest and 3D trophy
  marks, and actively enforces against unlicensed gaming use (e.g. UEFA v.
  Pentasia Malta).
* **Konami / Juventus / "Piemonte Calcio" (2019-2022).** When Juventus signed
  an exclusive deal with Konami, FIFA shipped the club as "Piemonte Calcio"
  and Football Manager shipped it as "Zebre". Even Goliath publishers have
  fallback fictional names ready for every licensed club because the licence
  can disappear overnight. We start from fiction; we never depend on a
  licence we do not own.
* **FIFPro / EA Sports / Football Manager.** Player name/image rights are
  collectively licensed via FIFPro for player names only; *likeness* rights
  are licensed separately (EA Sports holds most). Football Manager 26's FIFA
  deal explicitly excludes player likenesses. Modelling real players, even by
  name only, requires a paid FIFPro arrangement we will not be entering at
  v1.

Conclusion: the only zero-risk posture is full fiction with a deterministic
generator, designed so user mods can *optionally* layer real data at their
own risk under an EULA carve-out (see Section 8 needs-decision).

## 2. License matrix for candidate data sources

Legend:
* **Use:** `seed` = bundled in `packages/game-data` at build time.
  `runtime` = fetched online by the PWA. `dev-only` = used to validate the
  generator, never shipped. `forbidden` = do not use at all.
* **Risk** scores severity if we got the licensing wrong (low / med / high).

| Source                                              | License                        | Use         | Risk | Notes                                                                                                                              |
| --------------------------------------------------- | ------------------------------ | ----------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `openfootball/football.json`                        | CC0 1.0                        | `dev-only`  | low  | Public-domain schedules, results, tables. Useful to validate league-format invariants in tests. **Never** ship real club names.    |
| `openfootball/football.db`                          | CC0 1.0                        | `dev-only`  | low  | Same as above, SQLite distribution.                                                                                                |
| `openfootball/leagues`, `/worldcup`, etc.           | CC0 1.0                        | `dev-only`  | low  | Same coverage. We mirror *structure* (number of teams, promotion slots), not names.                                                |
| Wikidata structured data                            | CC0 1.0                        | `dev-only`  | low  | Multilingual labels for sanity-checking the denylist (top-200 clubs, top-2000 players). Not shipped.                               |
| GeoNames                                            | CC BY 4.0                      | `seed`      | low  | City names, regions, population, ASCII transliterations. Attribute centrally in About page. Drives fictional club-city placement. |
| OpenStreetMap (Nominatim API + planet dump)         | ODbL 1.0 + DbCL                | `dev-only`  | med  | Share-alike on derivative *databases*. Allowed at build time for non-redistributed lookups. Not bundled.                           |
| Unicode CLDR                                        | Unicode-3.0                    | `seed`      | low  | Country names, locales, plural rules. Used for i18n (ADR-0006).                                                                    |
| ISO 3166 country/region codes                       | not copyrightable (facts)      | `seed`      | low  | Identifiers only, used for nationality enum.                                                                                       |
| UNICEF SDG indicators (country statistics)          | CC BY 3.0 IGO                  | `seed`      | low  | Optional: country GDP/population tiers feeding fictional-league budget realism.                                                    |
| Behind the Name (free CSV exports)                  | CC BY-SA 4.0                   | `seed`      | med  | Given names + surnames by locale. **Share-alike viral risk on the derived dataset** if redistributed; bundle as a separately-licensed asset and document it. |
| Behind the Name (API, paid)                         | proprietary                    | `forbidden` | high | Display restrictions; commercial fee.                                                                                              |
| Forebears.io                                        | proprietary                    | `forbidden` | high | Per-name surname frequency, scrape-prohibited.                                                                                     |
| football-data.org free tier                         | proprietary, attribution req.  | `forbidden` | med  | 12 competitions, 10 calls/min, real club names. Not bundled, and not called at runtime (offline-first + IP-clean).                 |
| football-data.org paid tiers (€12 - €199+/mo)       | proprietary                    | `forbidden` | med  | Same as above with more competitions.                                                                                              |
| api-football.com                                    | proprietary, paid              | `forbidden` | high | Real clubs, real players, real fixtures.                                                                                           |
| Sofascore                                           | proprietary, scraping banned   | `forbidden` | high | ToS prohibits any redistribution.                                                                                                  |
| Transfermarkt                                       | proprietary, scraping banned   | `forbidden` | high | ToS: "reproduction, inclusion in online services, or duplication on data media of any kind - even in part - is only permitted with prior written consent". Includes commercial-resale ban. |
| FIFA / EA Sports / Konami databases                 | proprietary                    | `forbidden` | high | Hard stop.                                                                                                                         |
| FIFPro player-name catalogue                        | proprietary, collective        | `forbidden` | high | Hard stop without paid agreement.                                                                                                  |
| Club official APIs / Premier League data feed       | proprietary                    | `forbidden` | high | Hard stop.                                                                                                                         |
| Wikipedia article text                              | CC BY-SA 4.0                   | `forbidden` | med  | Share-alike viral; bundling text would relicense our game data. Don't.                                                             |
| Crowdsourced "real-name patches" (community packs)  | unknown, often infringing      | `forbidden` | high | Loading them in dev or shipping them in the binary is a no.                                                                        |

Attribution implications:

* GeoNames: a centralised "Data attributions" section in Settings is
  sufficient.
* UNICEF / Unicode CLDR: same About-page attribution suffices.
* Behind the Name CSV (CC BY-SA): attribution + share-alike. If we ship the
  derived `names.de.json` etc., the *names dataset* must be licensed
  CC BY-SA 4.0 and made downloadable separately. **It must not contaminate
  game code**, which stays under our chosen project license.

## 3. What is safe to model from real-world football

The following are *facts, formats, or rule sets* and are not copyrightable on
their own. They become unsafe only when bundled with protected names.

* League pyramid topology (tiered divisions, number of teams per division,
  promotion/relegation slots).
* Round-robin schedules, double round-robin, knock-out brackets, group-stage
  formats, away-goals (or its removal), seeding rules.
* Cup competition structures (single-leg, two-leg, replays).
* Continental qualification slots (e.g. "top 4 to a continental cup").
* IFAB Laws of the Game (offside, fouls, cards, substitutions, ET/penalties).
* Tactical formations (4-4-2, 3-5-2, 4-2-3-1, ...) as schemata. Specific
  named "playbooks" tied to a real coach are not safe.
* Transfer-window logic, contract structures, work-permit logic.
* Calendar shape (August-May seasons, winter break, international breaks).
* Stadium *physical* dimensions / pitch sizes (standard IFAB ranges).
* Realistic age curves, attribute decay, injury rates - all are derivable
  from public sports-science literature.

The following are *protected* even though they look structural:

* Specific competition *names* (Bundesliga, Premier League, Champions League,
  Europa League, Copa Libertadores, ...).
* Specific cup *trophies* and 3D trophy designs (UEFA trophy is a registered
  3D mark; FA Cup, DFB-Pokal, ...).
* The *combination* of a real league's exact club roster and exact
  promotion/relegation history, where it implicitly identifies the league.

## 4. Protected-IP hard-stop list (v1)

> Treat this as a denylist in `packages/game-data` validation. CI must fail
> if any of these strings (case-insensitive, diacritic-folded) appears in
> generated content, seed data, fixtures, or test snapshots.

### 4.1 Competitions and governing bodies

* `FIFA`, `FIFA World Cup`, `World Cup`, `FIFA Women's World Cup`,
  `Club World Cup`, `FIFA Confederations Cup`.
* `UEFA`, `UEFA Champions League`, `Champions League`, `UEFA Europa League`,
  `Europa League`, `UEFA Conference League`, `UEFA Super Cup`,
  `UEFA Nations League`, `Euros`, `UEFA Euro`, `eCHAMPIONS LEAGUE`.
* `CONMEBOL`, `Copa Libertadores`, `Copa Sudamericana`, `Copa America`.
* `CONCACAF`, `CAF`, `AFC`, `OFC` plus their named tournaments.
* `Bundesliga`, `2. Bundesliga`, `3. Liga`, `DFB-Pokal`, `DFL-Supercup`,
  `DFL` itself.
* `Premier League`, `EFL Championship`, `EFL`, `League One`, `League Two`,
  `FA Cup`, `EFL Cup`, `Carabao Cup`, `Community Shield`.
* `La Liga`, `LaLiga`, `LaLiga EA Sports`, `LaLiga Hypermotion`, `Copa del Rey`,
  `Supercopa de España`.
* `Serie A`, `Serie B`, `Coppa Italia`, `Supercoppa Italiana`.
* `Ligue 1`, `Ligue 2`, `Coupe de France`, `Trophée des Champions`.
* `Eredivisie`, `Primeira Liga`, `Süper Lig`, `MLS`, `Major League Soccer`,
  `Saudi Pro League`, `Liga MX`, `J1 League`, `K League`, `A-League`, `CSL`,
  `Egyptian Premier League` and any other competition where the league brand
  is centrally trademarked.

### 4.2 Clubs (illustrative; full denylist generated from openfootball/Wikidata at build time)

Top-200 by Wikidata Q-ID is included; this is a representative subset:

* Bayern Munich, Borussia Dortmund, RB Leipzig, Bayer Leverkusen, Schalke 04,
  Hamburger SV, VfB Stuttgart, Eintracht Frankfurt, Borussia Mönchengladbach.
* Manchester United, Manchester City, Liverpool, Chelsea, Arsenal,
  Tottenham Hotspur, Newcastle United, Aston Villa, Everton, West Ham United.
* Real Madrid, FC Barcelona, Atlético Madrid, Sevilla, Valencia, Real Betis,
  Athletic Bilbao, Real Sociedad.
* Juventus, AC Milan, Inter Milan, AS Roma, Lazio, Napoli, Atalanta, Fiorentina.
* Paris Saint-Germain, Olympique de Marseille, Olympique Lyonnais, AS Monaco.
* Ajax, PSV, Feyenoord, Benfica, Porto, Sporting CP, Galatasaray, Fenerbahçe,
  Beşiktaş, Celtic, Rangers, Boca Juniors, River Plate, Flamengo, Palmeiras,
  Corinthians, Santos, São Paulo, LA Galaxy, Inter Miami, Al-Hilal, Al-Nassr,
  Al-Ittihad.

### 4.3 People

* Any name of a current or recent (last 50 years) professional footballer,
  coach, referee, agent, executive, or club owner.
* Any name + nationality + birth-year tuple that uniquely identifies a real
  person (the generator's collision check guards this).
* Football "personalities" that have brand value (e.g. iconic commentators).

### 4.4 Visual identity

* Any real club crest, badge, logotype, mascot, or characteristic kit pattern
  (Barcelona's *blaugrana* vertical stripes; Juventus's black-and-white
  vertical stripes; Newcastle's stripes; Celtic's hoops). Patterns alone are
  not always protected, but the pattern + colour + city combination is.
* Real-world kit-manufacturer logos (Adidas, Nike, Puma, ...) and sponsor
  patches (Emirates, Etihad, Standard Chartered, T-Mobile, ...).
* Real-world ball designs (the official Champions League / World Cup ball is
  trademarked).

### 4.5 Venues

* Stadium *brand* names tied to a sponsor: `Allianz Arena`, `Signal Iduna Park`,
  `Etihad Stadium`, `Emirates Stadium`, `Estadio Santiago Bernabéu` (the
  arena bears a person's name licensed by the club), `Mercedes-Benz Stadium`,
  etc.
* "Neutral" club-owned names that still identify a real club:
  `Westfalenstadion`, `Old Trafford`, `Anfield`, `Camp Nou`, `San Siro`,
  `Maracanã`, `Wembley Stadium`. Treat these as protected by association.
* National-team stadium identifiers tied to a specific federation building.

### 4.6 Audio / video

* Real-league broadcast jingles, on-screen overlay templates, official
  anthem ("UEFA Champions League Anthem" by Tony Britten is a separate
  copyrighted musical work).
* Real match commentary clips, real crowd-chant recordings if identifiable to
  one club ("You'll Never Walk Alone" is licensed; generic stadium ambience
  is not).

### 4.7 Behaviour to avoid even with "made up" names

* Do not ship a fictional club whose name is a thin disguise of a real one
  (e.g. *"Munchen FC"* + red kit + "Allianz Arena" stand-in). Manchester
  United v. SEGA shows that even the *absence* of the crest can be argued
  into a trademark claim if it creates the impression of an unlicensed
  representation.
* Do not display a real club's name on the *input side* (e.g. a "find your
  favourite real club" search box) and then map it to a fictional in-game
  club. This is the classic "wink wink" that draws C&D letters.

## 5. Proposed fictional naming schema

The schema is **deterministic** (seeded by `gameId`) and **denylist-driven**.
All generators must pass through `packages/game-data/src/ip-denylist.ts`
before emitting a name.

### 5.1 Club name grammar

```
ClubName  ::= Prefix? Locality Suffix?
            | Suffix? Locality Prefix?   // language-dependent ordering
            | FoundedYear? Locality "Athletic" | "Sports" | "Calcio" | ...
Prefix    ::= "FC" | "SC" | "AC" | "SV" | "BSC" | "VfB" | "VfL" | "TSV"
            | "Real" | "Atlético" | "Sporting" | "Royal" | "Olympique"
Suffix    ::= "United" | "City" | "Town" | "Rovers" | "Albion" | "Wanderers"
            | "Athletic" | "Olympic" | "Calcio" | "Spor" | "Club"
Locality  ::= one of: real small/medium city (GeoNames), fictional city,
            or invented compound (River + -ford, Hill + -berg, Castle + -ton)
```

Hard rule: `Prefix + Locality + Suffix` must produce a string whose normalised
form (lowercased, ASCII-folded, whitespace-collapsed) does **not** match any
entry in the denylist *or* in `top-2000-real-clubs.txt`. The check is run at
generation time *and* at CI on shipped seed data.

#### 5.1.1 Examples (accepted)

| Generated name           | Why it's safe                                                                                   |
| ------------------------ | ----------------------------------------------------------------------------------------------- |
| `FC Hafenstadt`          | Compound German city + generic "FC" prefix; no real club called *Hafenstadt*.                   |
| `SV Auerbach 02`         | Real *small* town + neutral suffix; no top-flight club uses it. CI verifies.                    |
| `Sporting Kaltenbach`    | Invented compound German placename; Sporting prefix is generic across multiple countries.       |
| `Riverdale Athletic`     | Anglophone civic suffix; Riverdale is generic (multiple US/UK locations).                       |
| `Oakport United FC`      | Invented compound + neutral English football suffix.                                            |
| `AC Valguarda`           | Invented Italianate compound (`Val` + `guarda`).                                                |
| `Olympique Sauveterre`   | Real but obscure French commune + generic Francophone prefix.                                   |
| `Northbridge City`       | English compound; no Northbridge City exists at any professional tier.                          |

#### 5.1.2 Examples (rejected by the denylist)

| Rejected name              | Reason                                                                          |
| -------------------------- | ------------------------------------------------------------------------------- |
| `Manchester United`        | Identical to a top-200 real club.                                               |
| `Munchen FC`               | Diacritic-folded "München" + footballing context = Bayern adjacency.            |
| `Bayer Saarbrücken`        | Combines a real corporate sponsor stem (`Bayer`) with a German city.            |
| `Real Madrileño`           | Diminutive of `Real Madrid`; same brand association.                            |
| `Bayer 04`                 | Even without the city, `Bayer 04` is shorthand for Leverkusen.                  |
| `1. FC Köln Hennef`        | Mixes a real Bundesliga-style brand prefix with a German city; collision risk.  |
| `Inter Köln`               | `Inter <City>` reads as Inter-Mailand-adjacent across markets.                  |
| `Olympique de Paris`       | Indistinguishable from `Olympique de Marseille` brand schema + capital city.    |

### 5.2 Crest / colour guidance

* Crests are generated procedurally from a heraldic vocabulary: shield shape,
  primary tincture, secondary tincture, charge (lion, eagle, ship, wave,
  tower, sword, cog, cross, star, ball), motto banner (optional, fictional
  Latin or local-language phrase).
* Colour palette is drawn from a hand-curated 80-colour set covering all
  standard football jersey conventions; *combinations* that uniquely match a
  real club + city are blocked. Concretely: vertical red-and-blue stripes on
  a Catalan-named club, vertical black-and-white stripes on a Turin-region
  club, hoops in green/white on a Glasgow-region club, etc.
* No bitmap upload of real crests is permitted in v1 (editor restriction).
* Crests must remain copyright-able by *us* (the game), so the generator
  composes SVG primitives we own.

### 5.3 Stadium names

* Pattern: `Stadion` / `Stadio` / `Stadium` / `Arena` + `Locality` or
  `Founders' surname (fictional)` or `Geographical feature`.
* Capacity, surface, year-built are facts and can be modelled realistically.
* Allowed examples: `Stadion am Auerbach`, `Hafenstadt-Arena`,
  `Stadio del Valguarda`, `Riverdale Park`, `Northbridge Arena`,
  `Sauveterre Stade Municipal`.
* Rejected examples: `Allianz Arena`, `Signal Iduna Park`, `Etihad Stadium`,
  `Anfield`, `Old Trafford`, `Camp Nou`, `San Siro`, `Wembley`,
  any stadium name that includes a real corporate sponsor.
* "Sponsorship" inside the game uses fictional sponsor brands (see Section 7).

### 5.4 Competition names

* No real-world competition name (Section 4.1) may appear. Replace with
  generated names following these patterns:
  * Top tier: `Premier <Region>` / `<Country> Premier` / `<Country> Liga`
    where `<Country>` is a fictional or anonymised name, e.g.
    `Aurelia Premier`, `Liga Norvania`.
  * Cup: `<Country> Cup`, `<Country> Pokal`, `Coppa <Region>`.
  * Continental: `Confederation Cup`, `Continental Trophy`, `Federation Shield` -
    all fictional umbrella names. UEFA-adjacent strings are denylisted.
* The in-game default sandbox league is `Aurelia Premier` (already used as
  the working title in the game-design doc) - fully fictional country.

### 5.5 Sponsor and broadcaster brands

* Generated kit/stadium/broadcast sponsors use a vocabulary of fictional
  brand stems (`Volta`, `Lumin`, `Korex`, `Nordis`, `Astra`, `Vega`, `Helio`,
  `Pendel`, `Glanz`, `Quill`, ...) + suffixes (`Bank`, `Telekom`, `Mobil`,
  `Air`, `Logistik`, `Versicherung`, `Energy`, `Capital`).
* Sponsor names are also denylist-checked against the top-500 global brand
  index (Interbrand) to avoid accidental collisions (`Volta Bank` is safe;
  `Apple FC Telekom` is not).

## 6. Player-name generation constraints

The player generator (`packages/game-data/src/player-names`) must:

1. Draw given names and surnames from a locale-specific dataset derived from
   the CC BY-SA Behind the Name CSV exports, augmented by Wikidata `P735`
   (given name) and `P734` (family name) labels that are themselves CC0.
   The derived dataset ships as a separately-licensed asset under
   CC BY-SA 4.0 (see Section 2 attribution implications).
2. Combine names independently of any real-person record. Specifically: do
   not import any tuple `(given, family)` that exists in Wikidata as a
   `(P31 = Q5) ∧ (P106 = Q937857 association-football-player)` row from the
   past 70 years. The exclusion list is generated at build time from
   Wikidata's SPARQL endpoint (`dev-only`, never shipped) and bundled as a
   compact bloom filter in `packages/game-data/src/excluded-player-tuples.bin`.
3. Respect nationality realism: locale weights for given/family names match
   the player's birth country; mixed heritage uses a configurable migration
   model.
4. Avoid generating known *first-name + last-name + nation + birth-year*
   tuples for any of the top-2000 active or recently active professionals.
   The bloom filter from step 2 is the primary mechanism; a false-positive
   rate < 0.5 % is acceptable because regenerating with a different seed
   resolves the collision.
5. Never expose a "import real players" feature in v1. The editor allows
   manual name entry but presents a confirmation dialog that any
   user-entered real names are the user's responsibility, mirroring the
   Section 8 needs-decision around community datapacks.

Examples (accepted):

* `Lars Wendling` (Germany)
* `Mateo Carrara` (Italy)
* `Élise Vannier` (France, women's mode)
* `Kaito Furukawa` (Japan)
* `Felipe Manso` (Portugal)

Examples (rejected):

* Any tuple where the name + nationality + age uniquely identifies a real
  pro footballer.
* Names of famous coaches and executives appearing in the bloom filter.
* "Trick" combinations: `Lionel Messy`, `Cristiano Ronaldinho`. Disallowed
  via a Levenshtein-distance check against top-200 names with a threshold
  of 2 plus a manual review list.

## 7. Crest, kit, and brand asset generation

* All crest, kit, and sponsor SVGs are generated procedurally; the SVG output
  is then owned by us (the project) and ships under the project's chosen
  licence.
* The procedural generator is seeded by `(clubId, gameId)`, so the same club
  always renders the same crest across save games and devices.
* No raster image upload from the user is bundled into the binary or seed
  data. The editor can store user uploads in IndexedDB only (per
  [[../30-Implementation/pwa-offline-strategy]]) and they never sync to the
  server.

## 8. Needs-decision (Nico)

These items are flagged `needs-decision`. Recommendations are
provided; please confirm before ADR-0007 is finalised.

1. **Community datapack opt-in.**
   * Question: Should the editor expose a "load community datapack" feature
     that lets users sideload third-party real-name databases at their own
     risk?
   * Recommendation: **Yes, opt-in, sandboxed, off by default**, with an
     in-app warning that the user is solely responsible for IP compliance,
     the data lives in IndexedDB only, and never leaves the device. Mirrors
     the established Football Manager / We Are Football modding pattern.
   * Alternative: **No editor sideload at v1.** Safer legally; cheaper to
     build. Could be added in a later milestone.
   * Default if undecided: ship without sideload, revisit at M5+.

2. **Real national-team kit colours.**
   * Question: A fictional country's "national team" in our world has a kit
     palette. Does using real-country kit conventions (e.g. all-orange for
     "Netherlands-analogue", blue-and-white for "Argentina-analogue") create
     trademark risk?
   * Recommendation: **Acceptable.** National-team colour conventions are
     not trademarks of any single body; FIFA / UEFA do not own "orange =
     Netherlands". We only need to avoid the federation crest, federation
     name, and federation-licensed merchandise patterns.
   * Default if undecided: allow real-country colour palettes, forbid
     federation crests and federation names.

3. **Real country names vs fictional country names.**
   * Question: Should leagues be set in real countries (Germany, England,
     France) using only IP-clean clubs, or in fictional analogue countries
     (`Aurelia`, `Norvania`, `Valguarda`)?
   * Recommendation: **Hybrid.** Real country names + ISO codes for player
     nationalities (uncopyrightable facts). Fictional country names for
     league branding (`Aurelia Premier` instead of `Bundesliga`). This is
     the cleanest separation.
   * Default if undecided: hybrid as above.

4. **Editor lets users type real names.**
   * Question: If a user renames `FC Hafenstadt` to `Bayern Munich` in the
     editor, are we liable?
   * Recommendation: **No, but we add an EULA clause** ("user-generated
     content is the user's responsibility, must comply with applicable IP
     law, will not be uploaded or shared by the game"). Mirrors industry
     standard. Implementation: a one-time legal-acknowledgement dialog on
     first editor launch.
   * Default if undecided: ship the EULA clause and the dialog.

5. **Brand-adjacent abbreviations (`FCB`, `BVB`, `PSG`).**
   * Question: Can we generate `FCB` for a fictional Munich-area club whose
     city is `Bachsee`?
   * Recommendation: **Block well-known abbreviations** (the top 200 club
     abbreviations are denylisted alongside their full names). Cheap to
     implement; eliminates accidental brand-association risk.
   * Default if undecided: block.

## 9. Direct input for ADR-0007

> The following section is intended to be lifted verbatim into
> [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]] under the
> appropriate ADR sections (Context, Decision, Consequences). Phrased to fit
> ADR voice.

**Context.** A football-management game that distributes any real-world
football brand, name, crest, or kit design without a paid licence carries
unbounded trademark and personality-rights risk (Manchester United v. SEGA;
DFL v. unlicensed publishers; UEFA's Champions League word marks; the
Juventus / Piemonte Calcio precedent). FIFPro collective licensing is paid
and competition-licensing is dominated by long-running exclusive deals
(DFL-EA through 2027). For an indie offline-first PWA we cannot enter those
agreements; we therefore choose full IP cleanliness at v1 and design the
generator and editor for graceful future licensing.

**Decision.**

1. The game ships with **fully fictional clubs, players, leagues, stadiums,
   sponsors, and competitions**. No real-world football brand assets are
   bundled.
2. The fictional naming schema is **deterministic, seeded, denylist-driven**.
   A canonical denylist lives in `packages/game-data/src/ip-denylist.ts` and
   is generated at build time from CC0 sources (openfootball, Wikidata) plus
   a manually curated brand-abbreviation list.
3. **Seed data sources permitted:** CC0 (openfootball, Wikidata),
   CC BY (GeoNames, UNICEF), CC BY-SA (Behind the Name) where the derived
   asset ships under CC BY-SA in a separate bundle. **Forbidden:**
   Transfermarkt, Sofascore, football-data.org, API-Football, EA / FIFA /
   FIFPro databases, club APIs, Wikipedia article text.
4. **League formats** (number of tiers, table size, promotion slots, cup
   brackets) are mirrored from real-world leagues because formats are not
   copyrightable. **League names** are fictional.
5. **Real country names and ISO codes** are used for player nationality.
   **National-team colour palettes** may match real conventions. National
   federation crests, names, and merchandise patterns are denylisted.
6. **Player names** are generated locale-aware and verified against a
   Wikidata-derived bloom filter of professional footballers from the last
   70 years to avoid accidental real-person collisions.
7. **Crests, kits, sponsors, and stadium names** are procedurally generated
   SVG / strings owned by the project. The editor allows user-uploaded
   assets only into local IndexedDB and never syncs them.
8. **Community datapacks** (real-name mods) are out of scope at v1 and
   gated behind a future opt-in feature flag with an explicit user EULA.

**Consequences.**

* `packages/game-data` ships a CC0/CC BY/CC BY-SA mix; each asset bundle has
  its own `LICENSE` and the in-game Settings page surfaces aggregated
  attribution.
* CI must run `pnpm gamedata:lint` to validate every generated and shipped
  name against the IP denylist. Failures are blockers.
* The match engine and league simulator are unaffected: they consume the
  generated identifiers and need no licensing context.
* If we later acquire a licensing partner, the fictional-name layer becomes
  a *fallback*; the generator stays in place to handle every club outside
  the licensed dataset. This matches industry practice (Football Manager,
  PES/eFootball).
* A measurable design constraint: we never market the game as featuring or
  resembling any specific real-world league. Marketing copy is audited
  before release.

**Rejected alternatives.**

* *Acquire FIFPro / DFL / Premier League licences for v1.* Cost-prohibitive
  for an indie project, long lead time, and most licences are exclusive to
  competitors.
* *Ship real names with a "non-commercial / personal use" carve-out.*
  Manchester United v. SEGA and DFL precedents show this is not a defence.
* *Real names + community plausible-deniability.* Linking to known infringing
  community packs is itself contributory infringement.

## 10. References (verified during this research)

* Manchester United Football Club Ltd v. Sega Publishing Europe Ltd & Anor
  [2020] EWHC 1439 (Ch).
* Reddie & Grose: *"Manchester United sues the producers of Football Manager
  for trade mark infringement"* (2020).
* Manchester Evening News: *"Manchester United to be renamed on Football
  Manager following trademark settlement"* (2021).
* DFL Deutsche Fußball Liga e.V., USPTO Reg. 4166314 ("BUNDESLIGA"); DFL/EA
  Sports partnership extension through 2027.
* FIFPro: *"Sports Interactive and FIFPRO add women players to Football
  Manager video game"*; ESPN, *"Football Manager 26 secures FIFA license"*
  (clarifying likeness exclusion).
* BBC News and Goal.com: Juventus -> Piemonte Calcio / Zebre (2019-2022).
* UEFA Champions League trademark registrations (USPTO 79128886; 14
  word-mark variants per Reggster's CL trademark survey).
* openfootball/football.json README and LICENSE: CC0 1.0 Universal.
* Wikidata:Licensing (CC0 1.0 on structured data).
* GeoNames CC BY 4.0; OpenStreetMap ODbL 1.0; Behind the Name licensing
  page; Transfermarkt Terms of Use (`/intern/anb`, `/intern/impressum`).
* UNICEF Data: CC BY 3.0 IGO.

---

*Open the next research issue in the wave:* [[club-boss-analysis]] |
[[anstoss-series-deep-dive]] | [[competitor-matrix]] |
[[../95-Archive/gap-reports/feature-gap-analysis]] | [[pwa-offline-patterns]] |
[[../10-Architecture/09-Decisions/ADR-0007-naming-schema|ADR-0007]].

## Related

- [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]] — the decision this directly produced
- [[../10-Architecture/modules/game-data]] — module bound by these IP rules
- [[00-summary]] — research MOC · [[anstoss-series-deep-dive]] · [[competitor-matrix]] — siblings
