---
title: League Regulations and Football Pyramids Research
status: in-review
tags: [research, regulations, leagues, pyramid, dfb, fa, lfp, figc, laliga]
created: 2026-05-16
updated: 2026-05-16
type: research
binding: false
related:
  - [[raw-perplexity/raw-environment-events]]
  - [[../50-Game-Design/regulations-and-compliance]]
  - [[ip-and-licensing]]
---

# League Regulations and Football Pyramids Research

Distilled from Perplexity research (Doc 2 §7015-end, raw at
[[raw-perplexity/raw-environment-events]]) into a country-by-country
regulation model. This note backs [[../50-Game-Design/regulations-and-compliance]]
and informs the promotion-compliance gameplay loop.

> IP-clean reminder: this note may quote competition names and federation
> documents for design analysis. The game itself uses fictional clubs and
> competitions (see [[ip-and-licensing]] and
> [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]]).

## 1. Three-layer rule model

| Layer | Rule type | Example |
|---|---|---|
| **Federation / League** | Hard admission rules | Floodlight standard, security concept, stadium admission |
| **Country** | Soft match culture | Alcohol policy, fan-travel patterns, stadium culture |
| **Competition** | Special rules | Squad registration, security tiers, international requirements |

The game's `LeagueRegulationService` keys rules by (country, tier,
competition).

## 2. Country coverage tiers

| Country | Coverage depth | Notes |
|---|---|---|
| **Germany** | Deepest - down to amateur boundary | Bundesliga / 2. Bundesliga / 3. Liga / Regionalliga / Oberliga-Verbandsliga |
| **England** | Deep - pyramid via FA Ground Grading | Almost a direct blueprint for promotion compliance |
| **France** | Top tiers via LFP licensing | Ecological + infrastructure criteria included |
| **Italy** | Top tiers via FIGC + UEFA licensing | Stadium "must" criteria |
| **Spain** | Abstract initially | Insufficient public detailed rules; start with licence profile |
| **Other** | Light abstraction | Generic league + licence profile |

This matches Nico's request: "Deutschland bis an die Grenze des
Amateurfußballs" + EN / FR / ES / IT main tiers + lighter elsewhere.

## 3. Germany - tier map

| Tier | Type | Key obligations (modelled) |
|---|---|---|
| Bundesliga | Professional | Full DFB + DFL licensing, ~30 k+ all-seater capacity, full hospitality, comprehensive security concept, video / media infrastructure |
| 2. Bundesliga | Professional | Same as Bundesliga with reduced thresholds; promotion-relegation with 3. Liga |
| 3. Liga | Semi-pro | DFB licensing, ~10 k capacity, floodlight, separation of home/away fans, hospitality light |
| Regionalliga | Semi-pro | NOFV / BFV / RLWS regional rules, security concept, safety officer, sanitary minimums |
| Oberliga / Verbandsliga | Amateur boundary | Soft rules; safety guideline for amateur football still applies |

DFB sources cited:

- Spielordnung (Heft 04, 2024-07-01).
- Durchführungsbestimmungen (Heft 05, 2024-01-01).
- Sicherheitsrichtlinien für Bundesspiele (gültig ab 2018-07-01).
- Leitfaden Sicherheit im Amateurfußball.
- Regionalliga security guidelines (NOFV, BFV, RLWS).

## 4. England - FA Ground Grading

The FA Ground Grading / Stadium Accreditation framework is *purpose-built*
to gate progression up the English pyramid by infrastructure tier. It is
the closest real-world analogue to our compliance gameplay.

Tier grades (illustrative, simplified for game use):

| Grade | Tier (approx.) | Key obligations |
|---|---|---|
| A | National League | Seating, segregation, floodlight ≥ 250 lux |
| B | National League North/South | Reduced seating, floodlight ≥ 180 lux |
| C | Step 3 (e.g. National League System) | Min capacity, hard-standing perimeter |
| D | Step 4 | Smaller minimum, rope-perimeter allowed |
| E | Step 5 | Basic facilities, club-house, dugouts |
| F-H | Step 6-7 | Pitch + perimeter only |

The pyramid pattern: promote with current grade insufficient → club has
ground-share window or fast retrofit obligation.

## 5. France - LFP / FFF

LFP "TEAM 2025 EN" reference documents specify club-licensing covering
infrastructure, ecological criteria (sustainability), youth pathway, women's
football and economic stability. The game's Ligue 1 / Ligue 2 model uses
these as licence-tier obligations.

## 6. Italy - FIGC / UEFA

FIGC + UEFA stadium licensing model with "must" / "should" / "if-feasible"
criteria. Italian top tiers therefore have a built-in three-grade system,
which we mirror.

## 7. Spain - LaLiga

LaLiga transparency / institutional information is mostly governance not
ground grading. The game uses a single Primera / Segunda licence profile +
abstract regional structure until deeper data is sourced.

## 8. Other countries

Lighter abstraction - league + licence profile only. Community datasets
(see [[../50-Game-Design/community-editor-and-datasets]]) can add detail per
country.

## 9. Promotion as compliance + investment problem

> Promotion triggers new duties, not just better opponents and TV money.

Possible obligations per tier (game-level taxonomy):

- Minimum capacity / specific stand categories.
- Floodlight standard.
- Media / press infrastructure.
- Security and separation concepts.
- Sanitary facilities.
- Hospitality / hospitality-light.
- Medical / public-order minimums.

Player options when not compliant:

- Special permit (with conditions / costs).
- Alternate stadium.
- Retrofit deadline.
- Conditional admission with revenue loss / fines.

The classic dilemma: *promoted on the pitch but stadium not league-grade*.

## 10. Sanctions chain (cross-reference)

The sanction chain detail lives in [[fan-culture-segmentation-research]] §6
and [[../50-Game-Design/matchday-event-engine]]. Summary: fine → partial
sector closure → visiting-fan restriction → alcohol ban / light beer →
partial ghost match → ghost match → elevated risk classification for
follow-up matches.

## 11. Sources (new URLs)

All retrieved 2026-05-16.

- DFB Spielordnung Heft 04, 2024-07-01 - [dfb.de Spielordnung Schiedsrichterordnung 20240701](https://www.dfb.de/fileadmin/_dfbdam/307865-Heft_04_Spielordnung_Schiedsrichterordnung_20240701.pdf)
- DFB Durchführungsbestimmungen Heft 05, 2024-01-01 - [dfb.de Durchfuehrungsbestimmungen 20240101](https://www.dfb.de/fileadmin/_dfbdam/297082-Heft_05_Durchfuehrungsbestimmungen_20240101.pdf)
- DFB Sicherheitsrichtlinien für Bundesspiele 2018 - [dfb.de Richtlinien Sicherheit Bundesspiele 2018](https://www.dfb.de/fileadmin/_dfbdam/173992-Richtlinien_zur_Verbesserung_der_Sicherheit_bei_Bundesspielen_-_g%C3%BCltig_ab_01._Juli_2018.pdf)
- DFB Leitfaden Sicherheit Amateurfußball - [assets.dfb.de Leitfaden Sicherheit Amateurfussball](https://assets.dfb.de/uploads/000/218/010/original__2_Leitfaden_Sicherheit_im_Amateurfu%C3%9Fball.pdf?1579954693)
- Regionalliga Südwest security guideline - [regionalliga-suedwest.de Sicherheit RLWS](https://www.regionalliga-suedwest.de/.cm4all/uproc.php/0/Richtlinie%20zur%20Verbesserung%20der%20Sicherheit%20bei%20Spielen%20der%20RLWS_22.02.23.pdf)
- NOFV Sicherheitsrichtlinie - [nofv-online.de satzung-ordnungen Sicherheitsrichtlinie](https://nofv-online.de/index.php/satzung-ordnungen.html?file=files%2FInhalt%2FDownloads%2Fsatzungen+und+ordnungen%2FSicherheitsrichtlinie.pdf)
- BFV Regionalliga Sicherheitsrichtlinie - [bfv.de sicherheitsrichtlinie-regionalliga](https://www.bfv.de/binaries/content/assets/inhalt/der-bfv/satzung-richtlinien-amtliches/richtlinien/2023/sicherheitsrichtlinie-regionalliga-01.07.2024.pdf)
- FA Ground Grading entry page - [thefa.com player ground-grading](https://www.thefa.com/get-involved/player/ground-grading)
- FA Stadium Accreditation 2025-26 - [thefa.com stadium-accreditation-criteria-2025-26](https://www.thefa.com/-/media/thefacom-new/files/get-involved/2025/oct2025/stadium-accreditation-criteria-2025-26.ashx)
- Stadium Solutions ground-grading services - [stadiumsolutions.co.uk football-ground-gradings](https://www.stadiumsolutions.co.uk/football-ground-gradings/)
- LFP TEAM 2025 EN - [lfp.fr TEAM 2025 EN](https://www.lfp.fr/assets/1_TEAM_2025_EN_a8363be443.pdf)
- FIGC stadium impianto regolamento (EN) - [figc.it Regolamento impianto Aug 2021 EN](https://www.figc.it/media/159597/regolamento-duso-impianto-_-agosto-2021_eng.pdf)
- LaLiga transparency - [laliga.com transparency institutional-information](https://www.laliga.com/en-GB/transparency/institutional-information)
- The Drinks Business Euro 2024 booze ban - [thedrinksbusiness.com Euro 2024 booze](https://www.thedrinksbusiness.com/2023/12/england-fans-face-booze-ban-at-euro-2024/)
- Mirror England-Serbia beer ban - [mirror.co.uk England Serbia beer ban](https://www.mirror.co.uk/sport/football/news/england-v-serbia-beer-banned-33010452)
## Related

- [[raw-perplexity/raw-environment-events]]
- [[../50-Game-Design/regulations-and-compliance]]
- [[ip-and-licensing]]
