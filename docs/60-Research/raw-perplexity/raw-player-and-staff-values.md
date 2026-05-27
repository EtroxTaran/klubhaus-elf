---
title: Raw — Player & Staff Values (Competitor Analysis + EOS Foundation)
status: raw
tags: [research, raw, perplexity, player-attributes, staff, development, mentoring]
created: 2026-05-27
updated: 2026-05-27
type: raw-research
binding: false
sourceType: external
related:
  - [[../incoming-design-research-2026-05-27]]
  - [[../data-generators]]
  - [[../player-strength-presentation]]
  - [[../systemic-events-player-development-venue-ops]]
  - [[../ai-manager-behaviour]]
---

> Lossless import of Nico's external research report (Perplexity-style), filed
> 2026-05-27. **`status: raw` — not implementation authority.** Analysis, vault
> mapping and divergence flags live in [[../incoming-design-research-2026-05-27]].
> Raw research may quote competitor product / player / club names for analysis
> only; any implementation follows [[../ip-and-licensing]] and
> [[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]]. The visible-/
> hidden-attribute counts proposed here **diverge** from the locked 16+4+8
> schema (D2 [[../data-generators]]) — see the analysis note before using.

# Spieler- & Mitarbeiterwerte in Fußballmanagern – Vollständige Konkurrenzanalyse & EOS-Grundlage

## Executive Summary

Dieser Report analysiert vollständig, welche sichtbaren und versteckten Spieler- und Mitarbeiterwerte die wichtigsten Konkurrenzspiele nutzen, wie Entwicklung technisch funktioniert, was welchen Wert beeinflusst – und leitet daraus Empfehlungen für das eigene EOS-System ab. Die Hauptquellen sind Football Manager (FM/SI Games), EA Sports FC Career Mode, eFootball/PES (Konami), Hattrick (Online-Browser), Top Eleven und Online Soccer Manager (OSM).

***

## 1. Football Manager (FM26 – Sports Interactive) – Die Referenz

### 1.1 Sichtbare Spielerattribute (1–20 Skala)

FM ist das detaillierteste System und dient als Hauptreferenz. Alle Attribute werden auf einer Skala von **1 bis 20** gemessen[^1][^2].

#### Technische Attribute (14 Werte, nur Feldspieler)

| Attribut | Bedeutung | Beeinflusst im Match |
|----------|-----------|---------------------|
| **Corners** | Qualität beim Eckstoß | Präzision der Flanke/Schuss direkt |
| **Crossing** | Flankenqualität aus dem Halbfeld | Chancenerzeugung für Kopfballspieler |
| **Dribbling** | Ballführung unter Druck | Kombiniert mit Pace, Agility, Balance[^3] |
| **Finishing** | Torschussgenauigkeit | Zusammen mit Composure & Decisions[^4] |
| **First Touch** | Ballkontrolle beim Empfang | Zusammen mit Technique |
| **Free Kick Taking** | Freistoßqualität | Direkt + indirekt; mit Technique kombiniert |
| **Heading** | Kopfballstärke | Mit Jumping Reach & Strength |
| **Long Shots** | Fernschussstärke | Standalone-Attribut, via Traits verstärkt |
| **Long Throws** | Einwurfweite | Mit Strength kombiniert |
| **Marking** | Manndeckung | Mit Positioning, Anticipation, Strength |
| **Passing** | Passgenauigkeit | Mit Vision & Technique kombiniert |
| **Penalty Taking** | Elfmeterqualität | Mit Composure & Finishing |
| **Tackling** | Zweikampfstärke | Mit Positioning & Decisions |
| **Technique** | Allgemeine Balltechnik | Basis für Passing, Crossing, Finishing[^4] |

#### Mentale Attribute (14 Werte)

| Attribut | Bedeutung | Kategorie |
|----------|-----------|-----------|
| **Aggression** | Pressing-Intensität, Zweikampfhärte | Defensiv/Pressing |
| **Anticipation** | Spiellesefähigkeit, Reaktionsschnelligkeit | Universal – wichtigste Gruppe |
| **Bravery** | Bereitschaft zu riskanten Aktionen | Verbunden mit Determination |
| **Composure** | Ruhe am Ball, unter Druck | Beim Abschluss & Spielaufbau |
| **Concentration** | Fokus über 90 Minuten | Fehlerquote spät im Spiel |
| **Decisions** | Qualität der Entscheidungsfindung | Universal – wichtigste Gruppe |
| **Determination** | Willen zu siegen, zu trainieren | Basis für Persönlichkeit & Entwicklung[^4] |
| **Flair** | Kreativität, Unberechenbarkeit | Dribbling, Fernschüsse, Trickshots |
| **Leadership** | Einfluss auf Mitspieler auf dem Platz | Kapitän-Attribut |
| **Off the Ball** | Bewegung ohne Ball | Freie Raumläufe, Anbieten |
| **Positioning** | Defensivstellungsspiel | Nur defensiv relevant |
| **Teamwork** | Umsetzung taktischer Anweisungen | Verbunden mit Arbeitstempo |
| **Vision** | Erkennen von Passmöglichkeiten | Mit Technique & Decisions |
| **Work Rate** | Laufbereitschaft & Arbeitseinsatz | Mit Stamina kombiniert |

#### Physische Attribute (8 Werte)

| Attribut | Bedeutung |
|----------|-----------|
| **Acceleration** | Anfangsbeschleunigung |
| **Agility** | Richtungswechsel unter Tempo |
| **Balance** | Standfestigkeit im Zweikampf |
| **Jumping Reach** | Sprungkraft/Kopfballreichweite |
| **Natural Fitness** | Grundkonstitution, Genesungsrate |
| **Pace** | Höchstgeschwindigkeit |
| **Stamina** | Ausdauer über 90 Minuten |
| **Strength** | Körperkraft im Zweikampf |

#### Torwart-Attribute (6 Werte, anstelle der Technischen)

Aerial Ability, Command of Area, Communication, Eccentricity, First Touch (geteilt), Handling, Kicking, One on Ones, Punching, Reflexes, Rushing Out, Throwing[^5].

***

### 1.2 Hidden Attributes (6 versteckte Werte)

FM hat **6 offizielle Hidden Attributes**, die nur per Editor oder durch extensives Scouting sichtbar werden[^6]. Sie erscheinen als Pro/Con in Scout-Reports[^7].

| Hidden Attribut | Skala | Bedeutung | Impact |
|----------------|-------|-----------|--------|
| **Consistency** | 1–20 | Wie konstant spielt der Spieler an seine Maximalleistung heran? | Niedrig = unzuverlässig, variiert stark von Match zu Match[^8] |
| **Important Matches** | 1–20 | Performance-Multiplikator in Hochdruckspielen (Finals, Derbys, CL) | Niedrig = Underperformance im Endspiel; hoch = steigt auf[^8][^9] |
| **Injury Proneness** | 1–20 | Verletzungsanfälligkeit (hier: höher = schlechter) | Hoher Wert = häufige Verletzungen |
| **Versatility** | 1–20 | Fähigkeit, auf fremden Positionen zu spielen | Beeinflusst Positionsflexibilität[^10] |
| **Dirtiness** | 1–20 | Bereitschaft zu unfairem Spiel | Gelb/Rot-Kartenrisiko, Fouls |
| **Adaptability** | 1–20 | Anpassung an neue Länder/Kulturen | Relevant für ausländische Transfers |

> **Wichtig:** Consistency und Important Matches interagieren **nicht** direkt miteinander – Consistency betrifft alle Spiele (Rauschfaktor um die Grundleistung), Important Matches nur spezifisch Hochdrucksituationen[^9]. Ein Spieler kann hohe Consistency (immer solide) aber niedrige Important Matches haben (bricht in Finals ein) – das ist die Basis für realistischen "Big Match"-Druck.

***

### 1.3 Personality-System (aus Hidden Attributes abgeleitet)

Spieler erhalten eine **zusammengesetzte Persönlichkeit** aus 9 Basis-Attributen[^11]:

- Ambition (sichtbar/hidden)
- Controversy (hidden)
- Loyalty (hidden)
- Pressure (hidden)
- Professionalism (hidden)
- Sportsmanship (hidden)
- Temperament (hidden)
- Determination (sichtbar)
- Leadership (sichtbar)

Diese erzeugen **30 Persönlichkeitstypen** in drei Kategorien[^11]:

**Positive (Entwicklungs-Booster):**
Model Citizen, Perfectionist, Model Professional, Professional, Spirited, Resolute, Driven, Born Leader, Iron Willed, Resilient, u.a.

**Neutral:**
Jovial, Loyal, Balanced, Sporting, Honest, u.a.

**Negativ (nur Newgens):**
Slack, Casual, Spineless, Unambitious, Easily Discouraged, Low Determination, u.a.

> **Cristiano Ronaldo-Typ = "Perfectionist" oder "Model Professional":** Kombiniert maximale Professionalism (20), hohe Ambition (18+), hohe Determination (18+), hohe Consistency (17+) und wichtige Matches (17+). Dieser Spieler entwickelt sich schneller, performt konstant, steigt in Finals auf und verbessert andere durch Mentoring.

***

### 1.4 Wie FM-Spielerentwicklung funktioniert

#### Das CA/PA-Modell

Jeder Spieler hat eine **Current Ability (CA)** und eine **Potential Ability (PA)**, beide auf einer Skala von 0–200[^12].

- **CA** = aktuelle Gesamtstärke; Summe der gewichteten Attribute nach Position
- **PA** = hartes Limit; kann im normalen Spielverlauf nicht überschritten werden[^12]
- PA ist **fix** (außer bei Random-PA-Ranges für unter 21-Jährige: -1 bis -10, z.B. -10 = 170–200 PA)[^12]
- CA kann steigen (Training, Spielzeit, Mentoring) und **fallen** (Alter, Verletzung, kein Training)[^12]

#### Entwicklungs-Formel (experimentell verifiziert, FM23)

Tests mit PA=200 und CA=97-100 bei 21-Jährigen ergaben[^13][^14]:
1. **Training + Matches** = maximale Entwicklung
2. **Nur Training** = moderate Entwicklung
3. **Nur Matches** = schwächere Entwicklung
4. **Nichts** = Stagnation oder Rückgang ab Alter 23

Die stärksten Einflussfaktoren auf Entwicklungsrate[^15]:

| Faktor | Einfluss | Mechanismus |
|--------|---------|-------------|
| **PA–CA-Gap** | Sehr hoch | Größerer Gap = schnellere Entwicklung möglich |
| **Professionalism** (hidden) | Sehr hoch | Direkt: Training-Effizienz, indirekt: Commitment |
| **Ambition** (hidden) | Hoch | Motivationsbooster für Entwicklung |
| **Match Appearances** | Hoch | >20–30 Senior-Auftritte pro Saison = signifikant besser |
| **Alter** | Hoch | Peak: 18–21 für Outfield; bis ~24; GK bis ~29[^13] |
| **Trainingsqualität** | Mittel | Richtung der Entwicklung, nicht die Gesamtmenge |
| **Trainingsinfrastruktur** | Mittel | State-of-the-art vs. poor: Attributpunkte/Monat stark different[^16] |
| **Mentoring** | Mittel | Persönlichkeitstransfer; kein direkter CA-Boost |

> **Schlüsselerkenntnis FM:** Der beste Entwicklungs-Treiber ist **Match Rating**. Spiele, die mit 7+ bewertet werden, generieren deutlich mehr CA-Wachstum als schlechte Ratings[^17]. D.h. Spielzeit auf passendem Niveau ist wichtiger als bloße Spielzeit.

#### Wie Attribute durch CA-Wachstum verteilt werden

Wenn CA wächst, werden Attributpunkte nach **positionsspezifischen Gewichtungen** verteilt[^18]. Ein Stürmer-CA-Punkt geht primär in Finishing, Composure, Off the Ball – nicht in Tackling. Das bedeutet: Training kann die *Richtung* lenken (Individual Focus), aber die PA-CA-Differenz bestimmt die *Menge*[^18].

***

### 1.5 Mentoring in FM

Das Mentoring-System (ab FM19) ermöglicht **Persönlichkeitstransfer** zwischen Spielern[^11][^19].

**Mechanismus:**
- Mentoring-Gruppen bestehen aus 1–3+ erfahrenen Mentors + jungen Mentees
- Das Spiel wählt periodisch zufällig einen Spieler, der einen anderen beeinflusst
- Spieler mit höherer Squad-Hierarchy = höhere Einflusswahrscheinlichkeit[^20]
- Mentees können Mental-Attribute, Player Traits und Persönlichkeit adaptieren[^11]
- Beste Ratio: 1 Mentor : 2 Mentees[^20]

**Wer ist guter Mentor:**
- Hohe Determination (18+)
- Hohe Professionalism
- Hohe Leadership
- Positive Persönlichkeit (Model Professional, Born Leader, etc.)[^11]

**Was übertragen werden kann:**
- Mental-Attribute (Determination, Composure, Teamwork)
- Player Traits/Preferred Moves
- Persönlichkeitstyp (bei unter 23-Jährigen)[^11]

**Wer ist kein guter Mentor:**
- Negative Persönlichkeit (Casual, Unambitious) → kann Mentees negativ beeinflussen[^21]
- Sehr niedriger Squad-Status

> **Ein Ronaldo-Typ wird Mentor:** Ein Spieler mit Model Professional oder Perfectionist, hoher Leadership, Squad-Hierarchie-Spitze, positiver Sozialgruppe ist der ideale Mentor. Er überträgt Professionalism, Determination und Traits auf jüngere Spieler[^11].

***

### 1.6 FM Staff Attributes – Vollständige Liste

FM hat **18 Rollen** in 3 Bereichen (Coaching, Scouting, Medizin)[^22].

#### Coaching-Attribute (alle auf Skala 1–20)

| Attribut | Bedeutung | Beeinflusst |
|----------|-----------|-------------|
| **Attacking** | Coachen von Angriffsfußball | Finishing, Crossing, Composure, Off the Ball, Flair |
| **Defending** | Coachen von Abwehrfußball | Aggression, Concentration, Positioning, Marking, Tackling |
| **Technical** | Coachen von Ballverarbeitung | First Touch, Passing, Technique, Dribbling, Heading |
| **Mental** | Mentale Flexibilität, individueller Ansatz | Anticipation, Decisions, Vision, Teamwork |
| **Fitness** | Physische Entwicklung | Pace, Acceleration, Balance, Agility, Stamina, Strength, Natural Fitness |
| **Goalkeeping** | GK-Entwicklung | Shot Stopping, Handling, Distribution (je als Sub-Attribut) |
| **Working With Youngsters** | Jugendcoaching | U19-Entwicklungsrate, Talent-Identifikation[^22] |

#### Mentale Attribute (alle Coaches)

| Attribut | Bedeutung |
|----------|-----------|
| **Determination** | Ehrgeiz des Coaches, sich selbst zu verbessern; Lizenzierungsdrang[^22] |
| **Level of Discipline** | Strenge (hoch = mehr Fortschritt, mehr Unzufriedenheit möglich)[^23][^22] |
| **Motivating** | Fähigkeit, Spieler vor und während Matches zu motivieren[^22] |
| **Man Management** | Umgang mit Spielern, Moralerhalt, Konfliktlösung[^23][^22] |
| **Adaptability** | Anpassung an neue Länder/Kulturen[^22] |

#### Scouting-Attribute

| Attribut | Bedeutung |
|----------|-----------|
| **Judging Player Ability (JPA)** | Genauigkeit der aktuellen Spielerbewertung[^22] |
| **Judging Player Potential (JPP)** | Genauigkeit der Potenzial-Prognose[^22] |
| **Tactical Knowledge** | Erfahrung & Taktikbreite; Qualität der Berichte[^22] |
| **Negotiating** | Verhandlungsgeschick bei Transfers[^22] |

#### Data Analyst-Attribute

| Attribut | Bedeutung |
|----------|-----------|
| **Judging Player Data** | Auswertung statistischer Spieler-Daten[^22] |
| **Judging Team Data** | Auswertung von Team-Taktikdaten[^22] |
| **Presenting Data** | Verständliche Aufbereitung von Analysen[^22] |

#### Medizin-Attribute

| Attribut | Bedeutung |
|----------|-----------|
| **Physiotherapy** | Präzision der Verletzungsdiagnose + Heilungsqualität[^22] |
| **Sports Science** | Fitnessmanagement, Verletzungsrisikoprognose[^22] |

#### Non-Playing Tendencies (Coaches/Staff)

Coaches haben zusätzlich ~15 **taktische Tendenzen** (1–20), z.B. "Use Counter-Attacks", "Rely on Set Pieces", "Sign Many Youth Players", "Use Zonal Marking"[^22]. Diese beeinflussen Empfehlungen und automatisches Verhalten.

#### Welcher Staff ist für was gut?

| Rolle | Wichtigste Attribute |
|-------|---------------------|
| **Chefcoach** | Alle Coaching-Bereiche + Tactical Knowledge + Man Management |
| **Assistent** | Tactical Knowledge, Man Management, Motivating, JPA, JPP[^24] |
| **Fitness Coach** | Fitness (Specialist); + Level of Discipline, Motivating |
| **GK Coach** | Goalkeeping (alle 3 Sub-Attribute); + Working with Youngsters |
| **Jugendtrainer** | Working with Youngsters (primär), Technical, Mental, JPP[^24] |
| **Chefscout** | JPA, JPP, Determination (Eigenmotivation)[^24] |
| **Data Analyst** | Judging Player Data, Judging Team Data, Presenting Data[^22] |
| **Physio** | Physiotherapy (primär); + Man Management[^24] |
| **Sportswissenschaftler** | Sports Science (primär)[^22] |

***

## 2. EA Sports FC / FIFA Career Mode

### 2.1 Sichtbare Spielerattribute

EA FC nutzt ein ähnliches, aber flacheres System als FM. Attribute sind auf **1–99 Skala** (gelegentlich bis 104+ für Boni)[^25].

Kategorien und Attribute:

| Kategorie | Attribute |
|-----------|-----------|
| **Pace** | Sprint Speed, Acceleration |
| **Shooting** | Finishing, Long Shots, Shot Power, Volleys, Penalties, Positioning (attack) |
| **Passing** | Short Passing, Long Passing, Vision, Crossing, Curve |
| **Dribbling** | Ball Control, Dribbling, Agility, Balance, Reactions |
| **Defense** | Defensive Awareness, Standing Tackle, Sliding Tackle, Interceptions |
| **Physical** | Stamina, Strength, Jumping, Aggression |
| **GK** | GK Diving, Handling, Kicking, Positioning, Reflexes |

Zusätzliche Werte (nicht in Kategorien): Heading Accuracy, Free Kick Accuracy, Long Passing, Composure[^25].

**OVR** = gewichteter Durchschnitt aller positionsrelevanten Attribute; **POT** = maximales erreichbares OVR[^26].

### 2.2 PlayStyles & PlayStyles+

Ab FC 25 wurden PlayStyles eingeführt – das sind **sichtbare spezielle Fähigkeiten** (z.B. Finesse Shot, Tiki Taka, Trivela), die nur hochrangige Spieler in bestimmten Attributen besitzen[^25]. PlayStyle+ sind die Elite-Versionen.

### 2.3 Player Development in EA FC

**Kein CA/PA-Attributsystem** wie FM – stattdessen:

- **Potential (POT)** = max. erreichbares OVR[^26]
- **Development Plans**: Spieler werden einer spezifischen Rolle zugewiesen ("Poacher", "Playmaker", "Inside Forward") – nur diese positionsspezifischen Attribute wachsen, aber schneller[^27][^28]
- **Balanced Plan**: alle Attribute wachsen, aber ~2–3x langsamer[^27]
- **Dynamic Potential**: Ab FIFA 20; außergewöhnliche Saisons können POT erhöhen; schlechte Leistungen senken es[^26]

Einflussfaktoren auf Wachstum[^28][^29]:
1. **Spielzeit** (Hauptfaktor: regelmäßige Minuten)
2. **Match Rating** (Performen in Spielen = schnelleres Wachstum)
3. **Coach-Qualität** (Sterne-Wertung; 5-Sterne-Coach = kürzere Level-up-Zeiten)[^30]
4. **Development Plan** (Richtung der Entwicklung)
5. **Form & Morale**
6. **Leihe** auf passendem Niveau[^31]

> **EA FC Coach-Attribute:** In EA FC gibt es keine detaillierten Coaching-Attribute wie in FM. Coaches werden durch **Sterne-Wertung** (1–5) und **Knowledge Level** (Rookie/Specialist/Expert) bewertet[^30][^29]. Spezialisierte Coaches decken Positionen ab (Angriff/Mittelfeld/Abwehr/Torwart) und reduzieren die Development-Plan-Dauer. Es gibt keine Werte wie JPA/JPP oder Staff Tendencies[^29].

### 2.4 Player Traits in EA FC

Ähnlich FM: Sichtbare Spezial-Traits wie "Flair", "Leadership", "Long Shot Taker", "Speed Dribbler", "Outside Foot Shot"[^26].

***

## 3. eFootball / PES (Konami)

### 3.1 Spielerattribute (vollständige offizielle Liste)

PES/eFootball nutzt eine **0–99+ Skala** für alle Attribute[^32].

**Offensive Attribute:**
| Attribut | Bedeutung |
|----------|-----------|
| Offensive Awareness | Reaktionsgeschwindigkeit beim Angriff |
| Ball Control | Allgemeine Ballkontrolle; Trap & Feints |
| Dribbling | Ballführung bei hohem Tempo |
| Tight Possession | Dribbling bei niedrigem Tempo, enge Wendungen |
| Low Pass | Genauigkeit flacher Pässe |
| Lofted Pass | Genauigkeit hoher Pässe |
| Finishing | Torschussgenauigkeit |
| Set Piece Taking | Ecken, Freistöße, Elfmeter |
| Curl | Schnittkurve auf dem Ball |
| Header | Kopfballgenauigkeit |

**Defensive Attribute:**
| Attribut | Bedeutung |
|----------|-----------|
| Defensive Awareness | Reaktionsgeschwindigkeit beim Verteidigen |
| Interceptions | Ballgewinne ohne Zweikampf |
| Aggression | Aggressivität in Duellen |

**Physische Attribute:**
| Attribut | Bedeutung |
|----------|-----------|
| Kicking Power | Schussstärke |
| Speed | Höchstgeschwindigkeit off ball |
| Acceleration | Anfangsbeschleunigung |
| Balance | Standfestigkeit im Zweikampf |
| Physical Contact | Gewinnchancen bei Körperkontakt |
| Jump | Sprungkraft |
| Stamina | Ausdauer |

**Spezial-Werte (begrenzte Skala):**
| Attribut | Max. Wert | Bedeutung |
|----------|-----------|-----------|
| **Weak Foot Usage** | 4 | Häufigkeit der schwachen Fuß-Nutzung |
| **Weak Foot Accuracy** | 4 | Genauigkeit mit schwachem Fuß |
| **Form** | 8 | Fähigkeit zur Formkonstanz[^32] |
| **Injury Resistance** | 3 | Widerstand gegen Verletzungen[^32] |

**GK-Attribute:** GK Awareness, GK Catching, GK Clearing, GK Reflexes, GK Reach[^32].

### 3.2 Inspire-System (PES/eFootball-Einzigartigkeit)

Das **Inspire**-System ist Konami-exklusiv: Spieler mit herausragenden Fähigkeiten inspirieren Mitspieler in Echtzeit während des Spiels[^32].

- **Dribble on the Break**: Wenn ein Spieler dribbelt, bewegen sich Mitspieler wie bei einem Durchbruch
- **Low Pass Inspire**: Mitspieler antizipieren Flachpässe
- **Lofted Pass Inspire**: Mitspieler antizipieren hohe Pässe

Dies ist de facto eine **taktische Synergie-Mechanik** – ein Einzelspieler beeinflusst das Bewegungsmuster aller umliegenden Spieler.

### 3.3 PES Master League – Entwicklungssystem

PES (klassisch) nutzte **Wachstumskurven** pro Spieler[^33][^34]:
- **Short-Term-Spieler**: Frühreif, schnelles Wachstum, früher Peak
- **Standard-Spieler**: Gleichmäßige Kurve bis ca. 26–28
- **Long-Term-Spieler** (z.B. Maldini-Typ): Langsam, aber sehr lang auf hohem Niveau

Trainingseinheiten vergaben **Experience Points**; Auszeichnungen (MVP, Top Scorer) konnten Wachstumskurven kurzfristig überschreiten[^33].

In **eFootball (modern)**: Spieler werden durch **Matches** oder **In-Game-Items** (Progression Points) gelevelt; Progression Points werden für Stat-Erhöhungen ausgegeben[^35]. Es gibt kein tiefes Staff-System – Training ist primär item-/ressourcenbasiert.

***

## 4. Hattrick (Browser-Manager)

### 4.1 Die 8 Basisskills (0–20, Denominations-System)

Hattrick nutzt **8 universelle Skills** für alle Spieler mit einer einzigartigen **Wort-Skala**[^36][^37]:

| Wert | Level-Name |
|------|-----------|
| 0 | Non-existent |
| 1 | Disastrous |
| 2 | Wretched |
| 3 | Poor |
| 4 | Weak |
| 5 | Inadequate |
| 6 | Passable |
| 7 | Solid |
| 8 | Excellent |
| 9 | Formidable |
| 10 | Outstanding |
| 11 | Brilliant |
| 12 | Magnificent |
| 13 | World Class |
| 14 | Supernatural |
| 15 | Titanic |
| 16 | Extra-Terrestrial |
| 17 | Mythical |
| 18 | Magical |
| 19 | Utopian |
| 20 | Divine |

Die 8 Skills:

| Skill | Relevant für Positionen |
|-------|------------------------|
| **Goalkeeping** | Nur Torwart |
| **Defending** | Torwart, Verteidiger, Halbmittelfeld |
| **Playmaking** | Mittelfeld (primär), Flügel, Stürmer |
| **Winger** | Flügel (primär), Wingback |
| **Passing** | Unterstützung Angriff; Qualität der Chancen |
| **Scoring** | Stürmer (primär) |
| **Set Pieces** | Ecken, Freistöße, Elfmeter (ein Spezialist reicht)[^37] |
| **Stamina** | Ausdauer über 90 Minuten; max. "Excellent" (8) erreichbar[^37] |

> **Positionsmix:** Jeder Spieler hat alle 8 Skills, aber nur 2–3 sind positionsrelevant. Ein Central Midfielder braucht primär Playmaking + Passing + Defending. Ein Winger braucht Winger + Playmaking + Passing[^36].

### 4.2 Persönlichkeits-Attribute in Hattrick

Zusätzlich zu den Skills haben Spieler **Persönlichkeits-Attribute**[^38]:

| Attribut | Bedeutung |
|----------|-----------|
| **Agreeability** | Von nasty bis beloved team member → beeinflusst Team Spirit beim Abgang/Ankunft |
| **Aggressiveness** | Von tranquil bis unstable → mehr Gelb/Rot, kann Gegner verletzen |
| **Honesty** | Von infamous bis saint-like → Diving/Fouls vs. Fair Play |
| **Experience** | Akkumuliert durch Matches; verhindert Confusion & Nervosität in wichtigen Spielen[^38] |
| **Leadership** | Wichtig für Kapitän; Experience+Leadership = Bonus für Teamkalkulation |
| **Loyalty** | Pro Tag im Verein steigt Loyalität; Divine Loyalty = +1 Level auf alle Skills (außer Stamina)[^38] |
| **Form** | Aktuell-Formwert; beeinflusst direkt Match-Performance[^38] |
| **TSI** (Total Skill Index) | Numerischer Gesamtindex aller Skills; steigt mit Training, sinkt mit Alter[^38] |

> **Loyalty-Mechanik:** Das ist elegant und einzigartig: Je länger ein Spieler bei deinem Verein bleibt, desto besser wird er – Divine Loyalty entspricht +1 Skill-Level auf alles. Eigene Jugendspieler haben Divine Loyalty + "Mother Club Bonus" (+0,5 Level auf alle Skills)[^38].

### 4.3 Hattrick Trainings-System

Hattrick hat das **tiefste und expliziteste Trainings-Modell** unter allen untersuchten Spielen[^39]:

**Trainingsregeln:**
- Training passiert **einmal wöchentlich** (Donnerstag-Update)[^39]
- Nur Spieler, die **90 Minuten** in einer trainierten Position gespielt haben, werden voll trainiert
- Spieler brauchen die richtige **Position** auf dem Feld für das Training
- Friendly-Spiele ermöglichen Training zusätzlicher Spieler pro Woche[^39]

**11 Trainingstypen:**

| Training | Primär verbessert | Trainierbares für |
|----------|------------------|------------------|
| Goalkeeping | Goalkeeper | Torwärter |
| Defending | Defending | Verteidiger |
| Playmaking | Playmaking | Mittelfeld |
| Winger | Winger | Flügel |
| Scoring | Scoring | Stürmer |
| Passing | Passing | Mittelfeld, Flügel |
| Set Pieces | Set Pieces | Alle |
| Stamina | Stamina | Alle |
| Individual | Zufälliger positionsrelevanter Skill | Alle (schlechtere Effizienz)[^40] |
| Keeper Special | GK-Spezialtraining | Torwart |
| Outfield Special | Feldspieler-Spezialtraining | Feldspieler |

**Youth Academy – Revelation System:**
Youth-Skills sind initial versteckt und werden durch Training **enthüllt** (revealed)[^41]:
- Primary Training enthüllt das aktuelle Niveau
- Secondary Training enthüllt das Potenzial-Niveau
- Mind. 44 Minuten im trainierbaren Position nötig für Revelation[^41]

***

## 5. Top Eleven

### 5.1 Spielerattribute (15 Attribute, 3 Kategorien)

Top Eleven ist ein Mobile-First-Game mit vereinfachtem System[^42]:

**Defence-Attribute:** Goalkeeping, Aerial Defence, Defending, Marking, Tackling, Heading

**Attack-Attribute:** Finishing, Long Shots, Crossing, Dribbling, Passing

**Physical & Mental:** Pace, Stamina, Strength, Positioning

**Quality-Score:** Numerischer Gesamtwert auf Basis der gewichteten Attribute nach Position[^42].

### 5.2 Tier-System (Monetarisierungs-Mechanik)

Top Eleven hat ein **Tier-System** für permanente Attribut-Upgrades[^43]:

| Tier | Permanenter Key-Attribut-Bonus |
|------|-------------------------------|
| Rare | +10 |
| Elite | +30 |
| Stellar | +50 |
| Master | +80 |
| Epic | +120 |
| Legendary | +160 |

> **Kritisch/P2W-gefährdet:** Tiers können gegen Premium-Ressourcen erworben werden und geben permanente Vorteile, die nicht durch reguläres Spielen kompensierbar sind. Für unser Konzept: Dieses System ist im Multiplayer **klar P2W und inkompatibel** mit unserer no-P2W-Regel.

### 5.3 Training & Player Academy

Top Eleven hat drei Trainingsstufen[^44]:
1. **Stretching** – sehr geringe Attributgewinne, geringe Condition-Kosten
2. **Cardio** – moderate Gewinne
3. **Practice Match** – hohe Gewinne, hohe Kosten

Zusätzlich gibt es eine **Player Academy** (ab Training-Level 25)[^45], wo spezialisierte Coaches individuell trainieren können.

**Wichtige Regel:** Die maximale Differenz zwischen zwei Skill-Kategorien darf 20 nicht überschreiten. Ein Spieler mit Defense 50 kann keine weiteren Defense-Punkte kaufen, bis Attack auf 30 ist[^44].

***

## 6. Online Soccer Manager (OSM)

OSM ist das schlankste System: Spieler haben nur **3 Attribute**[^46]:

- **Attack** (primär für Stürmer)
- **Defense** (primär für Verteidiger und TW)
- **Overall** (primär für Mittelfeld)

Welches Attribut primär genutzt wird, hängt von der **Linie** (Angriff/Mittelfeld/Abwehr) ab. Sekundär-Attribute wirken über Linienkrätik-Settings[^46].

Entwicklung: Super-Training via RNG-Zufallsmechanik[^47]. Kein tiefes Staff-System.

***

## 7. Konkurrenz-Vergleichsmatrix

### Spieler-Attribut-Systeme

| Spiel | Anzahl Attribute | Skala | Hidden Attributes | Persönlichkeitssystem | Staff-Tiefe |
|-------|-----------------|-------|------------------|-----------------------|-------------|
| **Football Manager** | 36 (Feldspieler) + 12 GK | 1–20 | 6 (+ aus 9 Basis-Attrs) | 30+ Persönlichkeiten | Sehr hoch (18 Rollen, 15+ Attr.) |
| **EA Sports FC** | ~34 | 1–99+ | Keine (Traits sichtbar) | Keine (nur Traits) | Niedrig (Sterne/Wissens-Level) |
| **eFootball/PES** | ~21 + 5 GK | 0–99+ | Form (1–8), Injury (1–3) | Inspire-System | Minimal |
| **Hattrick** | 8 Skills + 7 Persönlichkeits-Attr. | 0–20 (Wörter) | Potenziell-Skill (hidden in YA) | Agreeability, Aggression, Honesty, Experience, Leadership, Loyalty | Trainer-Attribut (1 Wert) |
| **Top Eleven** | 15 | 0–∞ (stars) | Keine | Keine | Keine |
| **OSM** | 3 | 0–110+ | Keine | Keine | Keine |

### Spielerentwicklungs-Systeme

| Spiel | Mechanismus | Haupttreiber | Altersdegression | Mentoring |
|-------|-------------|-------------|-----------------|-----------|
| **FM** | CA/PA-Gap, Training + Spielzeit | Professionalism, Ambition, Match Rating | Nach 21 langsamer; GK bis 29 | Ja (Persönlichkeit, Traits, Mental) |
| **EA FC** | Development Plans + OVR-Wachstum | Coach-Sterne, Spielzeit, Form | POT ist Deckel; Decline ab 30+ | Nein |
| **eFootball** | Experience Points + Items | Spielzeit, Items | Alters-Kurven | Nein |
| **Hattrick** | Wochentraining (90-Min-Regel) | Trainierbares Skill, Trainerqualität | Klar: jung trainiert deutlich schneller | Nein (aber Loyalty-Bonus) |
| **Top Eleven** | Skill Points + Player Academy | Drills + Coachs + Zeit | Ja (jünger = schneller) | Nein |
| **OSM** | RNG Super-Training | Zufallsmechanik | Implizit | Nein |

***

## 8. Wie "Große-Spiele-Versager" entstehen

Football Manager bietet hier die detaillierteste Antwort[^8][^9]:

**Der Mechanismus:**
1. Jedes Match berechnet eine **Performance-Baseline** aus Attributen (CA-basiert)
2. Darum legt sich ein **Consistency-Rauschen**: Bei niedriger Consistency (1–8) variiert die tatsächliche Performance stark um diese Baseline (hohe Standardabweichung)
3. In klassifizierten **Important Matches** (Finale, Derby, Topspiel) wird ein **zusätzlicher Druckmodifikator** auf die Baseline angewendet – bei niedrigem Important Matches Wert: stark negative Abweichung
4. Beide Werte sind unabhängig: Ein Spieler kann **inkonsistent UND gut in großen Spielen** sein (manchmal überragendes Match, manchmal Totalausfall, aber in Finals immer top)

**Das Profil des "Big Game Flops":**
- Hohe Attribute (CA = 150+)
- Niedrige Consistency (5–8)
- Niedrige Important Matches (4–8)
- Oft niedrige Composure, Pressure-Attribut

**Das Profil des "Born Winner" (Cristiano Ronaldo-Typ):**
- Hohe Attribute (CA = 180+)
- Hohe Consistency (17–20): performt jede Woche nahe Maximalwert
- Hohe Important Matches (17–20): Performen in Finals steigt sogar
- Hohe Determination (18–20), Professionalism (18–20): entwickelt sich schneller
- Hohe Ambition: immer motiviert, immer hungrig
- Starke Pressure-Wert: hält Druck stand

***

## 9. EOS-Empfehlungen – Aufbau eines eigenen Systems

Auf Basis der vollständigen Konkurrenzanalyse werden folgende Empfehlungen für das EOS-System gegeben:

### 9.1 Spieler-Wertesystem

**Bevorzugter Ansatz für EOS:** FM-inspiriertes System mit sinnvoller Komplexitätsreduktion.

**Sichtbare Attribute (Vorschlag: 20–24 Werte)**

| Kategorie | Empfohlene Attribute |
|-----------|---------------------|
| **Technisch** | Passing, First Touch, Dribbling, Crossing, Finishing, Heading, Tackling, Positioning, Technique, Long Shots, Set Pieces |
| **Mental** | Decisions, Anticipation, Composure, Vision, Work Rate, Teamwork, Concentration, Aggression |
| **Physisch** | Pace, Acceleration, Stamina, Strength, Jumping Reach, Agility |

**Versteckte Attribute (Empfehlung: 7–9 Werte)**

| Verstecktes Attribut | Bedeutung | EOS-Funktion |
|---------------------|-----------|-------------|
| **Consistency** | Rauschen um die Grundleistung | Unzuverlässiger Superstar vs. solider Mittelfeldmann |
| **Big Game Temperament** | Performance-Modifikator in Hochdruckspielen | Finals, Derbys, Abstiegsspiele |
| **Professionalism** | Trainingseffizienz, CA-Wachstum | Haupttreiber Spielerentwicklung |
| **Ambition** | Motivationsbooster, Wechselwilligkeit | Entwicklungsrate, Transfer-Eagerness |
| **Injury Proneness** | Verletzungswahrscheinlichkeit | Risikofaktor bei Kaderselektion |
| **Adaptability** | Eingewöhnung in neue Ligen/Kulturen | Auslandstransfer-Risiko |
| **Leadership** | Einfluss auf Mitspieler (on-pitch) | Kapitäns-Wert, Mentoring-Eignung |
| **Mentoring Aptitude** | Fähigkeit, andere zu entwickeln | Direkt: Mentoring-Output |
| **Natural Fitness** | Konstitution, Genesungsrate | Verletzungsmanagement |

### 9.2 Spielerentwicklungs-Modell

**Die EOS-Entwicklungsformel sollte auf diesen Säulen basieren:**

1. **PA–CA-Gap** (größter einzelner Treiber): Je weiter vom Limit entfernt, desto schneller wächst der Spieler
2. **Professionalism × Ambition** (Multiplikator): Schlechte Werte können gutes Training fast neutralisieren
3. **Spielminuten auf angemessenem Niveau** (notwendige Bedingung): Ohne echte Minuten kein Wachstum; Dominanz in schwacher Liga = weniger Wachstum
4. **Match-Bewertung** (Qualitätsfaktor): Gute Leistungen beschleunigen Wachstum
5. **Trainer-Spezialisierung** (Richtungsgeber): Bestimmt, in welche Attribute CA-Punkte fließen
6. **Alter** (Zeitfenster): Peak-Wachstum 17–21; nach 27 stark rückläufig
7. **Mentoring** (Persönlichkeitstransfer): Verbessert hidden Attributes, besonders Professionalism

**Phasenmodell:**
| Phase | Alter | Fokus |
|-------|-------|-------|
| 1 – Formung | 14–17 | Technik, Koordination, Persönlichkeit formen |
| 2 – Prägung | 18–21 | Spielminuten, Rollenfestigung, Athletik |
| 3 – Peak-Aufbau | 22–27 | Taktische Feinheit, Rollenstabilisierung |
| 4 – Erhalt | 28+ | Regeneration, Erfahrungs-Boni, Mentoring-Rolle |

### 9.3 Mitarbeiter-Wertesystem

**Bevorzugter Ansatz:** Vereinfachtes FM-System mit 3 Kernbereichen.

**Trainer (Coaches):**

| Attribut | Skaliert Entwicklung von |
|----------|--------------------------|
| Attacking Coaching | Angriffstechnik & -taktik |
| Defending Coaching | Defensivtechnik & -taktik |
| Technical Coaching | Ballverarbeitung |
| Fitness Coaching | Physische Attribute |
| Mental Coaching | Mentale Attribute |
| Working With Youngsters | U21-Entwicklungsbonus |
| Motivation | Kurzfristige Moral-/Formboosts |
| Man Management | Spielerzufriedenheit, Konfliktlösung |
| Level of Discipline | Training-Effizienz vs. Unzufriedenheitsrisiko |

**Scouting:**

| Attribut | Funktion |
|----------|---------|
| Judging Ability | Genauigkeit aktueller Spielerbewertung |
| Judging Potential | Genauigkeit der Potenzialprognose |
| Personality Assessment | Erkennen versteckter Persönlichkeitswerte |
| Regional Knowledge | Datenqualität in bestimmten Märkten |

**Medizin:**

| Attribut | Funktion |
|----------|---------|
| Physiotherapy | Verletzungsdauer, Heilungsqualität |
| Sports Science | Verletzungsrisikoprognose, Fitnessmanagement |

### 9.4 Wie sich entscheidet, welcher Trainer für was gut ist

Ein Trainer ist gut für einen Spieler, wenn folgende Bedingungen erfüllt sind:

1. **Coaching-Spezialisierung passt zur Spielerrolle** (z.B. Attacking Coach für einen Stürmer)
2. **Working With Youngsters** hoch, wenn Spieler unter 21 ist
3. **Man Management** passt zur Spieler-Persönlichkeit (strikte Spieler brauchen weniger man management; fragile Persönlichkeiten brauchen gutes man management)
4. **Level of Discipline** × Morale: Zu streng bei ohnehin motivierten Spielern = Overtraining/Unzufriedenheit; zu locker bei ambitionslosen Spielern = verpuffter Effekt

### 9.5 Mentoring-Tauglichkeit

Ein Spieler ist ein guter Mentor, wenn:
- Hohe Leadership (15+)
- Hohe Mentoring Aptitude (hidden, 15+)
- Positive Persönlichkeit (hohe Professionalism + Determination)
- Hoher Squad-Status (Schlüsselspieler, langjährig im Verein)
- Gleiche oder ähnliche Position wie Mentee

Ein Spieler ist schlecht als Mentor (oder sogar schädlich), wenn:
- Negative Persönlichkeit (niedrige Professionalism, Unambitious)
- Niedrige Leadership
- Niedriger Squad-Status

### 9.6 Offline/Online-Strategie

| Feature | Offline-Modus | Online/Hybrid |
|---------|--------------|--------------|
| Spielerattribute (sichtbar) | Lokal gespeichert, kein Sync nötig | Serverautoritativ bei MP |
| Hidden Attributes | Lokal; für SP: vollständige Freiheit | Server: nur schreibgeschützt |
| Entwicklungs-Berechnungen | Lokal (deterministic mit Seed) | Server für MP-Fairness |
| Mentoring-Transfer | Lokal für SP | Server + Validierung für MP |
| Staff-Attribute | Lokal für SP | Server-Sync beim Stafftransfer |

***

## 10. Offene Fragen & Risiken

| Frage | Risiko | Empfehlung |
|-------|--------|-----------|
| Wie viele sichtbare Attribute sind UX-sinnvoll? | Zu viele = Paralysis; zu wenige = Flachheit | Empfehlung: 20–24; mit "Detail View" für Power User |
| Hidden Attributes vs. Scouting-Unschärfe | Falsche Werte vor Scouting = Überraschungseffekt; aber auch Frust | FM-Modell: Attribut-Ranges bei unbekannten Spielern |
| Mentoring im Multiplayer | P2W-Gefahr, wenn Mentoren käuflich boostbar | Mentoring nur durch organische Spieler-Signings; keine Käufe |
| Trainer-Attribute: Tiefe vs. Überkomplexität | Zu viele Coach-Werte = Micro-Management-Hölle | 3–4 Core-Attribute pro Coach-Typ; Rest intern berechnet |
| Cristiano Ronaldo-Spieler: Wie selten? | Zu viele = inflation; zu wenige = nie Freude | Schätzung: <1% aller Spieler in normalen Leagues haben Consistency 17+ und Important Matches 17+ |

---

## References

1. [Football Manager 2025 – Player Attributes](https://www.fifplay.com/football-manager-2025-player-attributes/) - Football Manager 2025 attributes explained: A guide to player attributes in FM 24.

2. [Player attributes in Football Manager](https://fminside.net/guides/positional-guides/28-player-attributes-in-football-manager) - This guide will explain all the player attributes and what they do.

3. [Football Manager 2024 – Player Attributes](https://www.fifplay.com/football-manager-2024-player-attributes/) - Football Manager 2024 attributes explained: A guide to player attributes in FM 24.

4. [FM24 Guide: Player’s Attributes Explained](https://sortitoutsi.net/content/67538/fm24-guide-players-attributes-explained) - FM24 Guide: Player’s Attributes Explained FM24 Article posted on General Discussion for Football Man...

5. [Player Attributes | Football Manager 2022 Guide](https://www.guidetofm.com/players/attributes/) - Guide to player attributes on Football Manager. Explanations of all visible and hidden attributes.

6. [Football Manager Guide to Hidden Attributes • Passion4FM.com](https://www.passion4fm.com/football-manager-guide-to-hidden-attributes/) - The 6 Different Football Manager Hidden Attributes. Adaptability; Consistency; Important Matches; Ve...

7. [ELI5: Hidden attributes : r/footballmanagergames - Reddit](https://www.reddit.com/r/footballmanagergames/comments/3a9yb4/eli5_hidden_attributes/) - There are basically 11 hidden attributes which you cannot see on the players information screen. All...

8. [Top 5 Player Weaknesses in Football Manager & How to Fix Them](https://www.footballmanagerblog.org/2024/12/top-5-player-cons-football-manager-hidden-attributes.html) - 1. Doesn't Enjoy Big Matches ... This con is tied to the hidden attribute called Important Matches. ...

9. [Do the Consistency and Important Matches ratings interact with each ...](https://fm-base.co.uk/threads/do-the-consistency-and-important-matches-ratings-interact-with-each-other.139041/) - Actually, they matter. Important Matches attribute refers to those high-profile, high-pressure match...

10. [Ingame Hidden Attributes Viewer - FM Scout](https://www.fmscout.com/i-741-Ingame-Hidden-Attributes-Viewer.html) - It comes as a team squad / player search view option. You can either see hidden attributes as 2 read...

11. [Player Personalities in Football Manager - FMInside.net](https://fminside.net/guides/basic-guides/30-personalities-in-football-manager) - Personalities fall into three categories: Positive, Neutral, and Negative. Real players in FM typica...

12. [Current Ability, Potential Ability and Star Ratings in Football ...](https://sortitoutsi.net/content/67526/current-ability-potential-ability-and-star-ratings-in-football-manager) - A players CA can never exceed their PA and, unlike CA, a player's PA is a fixed number and does not ...

13. [Pattern of Player Growth in FM23 | PDF | Experience](https://www.scribd.com/document/666462487/Pattern-of-player-growth-in-FM23) - Player growth in FM23 is dependent on training, match experience, and a player's potential ability (...

14. [Pattern of Player Growth in FM23 | PDF | Experience | Behavioural Sciences](https://es.scribd.com/document/666462487/Pattern-of-player-growth-in-FM23) - Pattern_of_player_growth_in_FM23 - Free download as PDF File (.pdf), Text File (.txt) or read online...

15. [Player Development and Training](https://fm-arena.com/thread/2671-player-development-and-training/)

16. [Youth development Part 2](https://fminside.net/guides/youth-guides/47-youth-development-part-2) - Part two of the guide on youth development in Football Manager.

17. [You Need to Know This Secret of Training | Football Manager](https://www.youtube.com/watch?v=LPcu8VIRufg) - In 3 minutes I'll give you all you need to know to get the best FM training out of your players with...

18. [3. Impact on Player...](https://www.fmscout.com/a-guide-to-current-ability-in-football-manager.html?pg=2) - In this guide, we'll show you how current ability (CA) is calculated based on a player's attributes ...

19. [(My) Mentoring in Football Manager 2020 - CoffeehouseFM](https://coffeehousefm.com/fmrensieblog/2021/11/16/my-mentoring-in-football-manager-2020) - This is my system of mentoring in Football Manager 2020. I spent some time reading different materia...

20. [Ideal Mentoring Setup | General Discussion About Football Manager ...](https://fm-arena.com/thread/13314-ideal-mentoring-setup/) - The ideal numerical setup is one mentor to two mentees. 2. We know (roughly) the factors that make s...

21. [Football Manager 26: How to Develop Young Players](https://www.operationsports.com/football-manager-26-how-to-develop-young-players/) - The ultimate challenge.

22. [Football Manager Staff Attributes & Non-Playing Tendencies ...](https://www.passion4fm.com/football-manager-staff-attributes/) - Ultimate guide to the Football Manager Staff Attributes and non-playing attributes. How does the non...

23. [Staff Attributes - Football Manager 2013 Guide - IGN](https://www.ign.com/wikis/football-manager-2013/Staff_Attributes) - Strict coaches generally get better and faster results, but are more likely to upset players and pos...

24. [Staff Roles Explained - FM Base](https://fm-base.co.uk/threads/staff-roles-explained.65030/) - The four attributes are Man Management, Level of Discipline, Motivation and Determination. The Coach...

25. [Players EA FC 26 - Rating and Potential - Career Mode Database](https://cmtracker.net/players) - Dive into detailed profiles of top-rated players, rising stars, and hidden gems. Discover their stat...

26. [A GUIDE: HOW POTENTIAL WORKS IN FIFA - CareerModeTips](https://careermodetips.wordpress.com/2021/09/15/a-guide-how-potential-works-in-fifa/) - Overall Rating of players in FIFA Career Mode grow as seasons go on. But up to how much depends on p...

27. [How does the new player development actually work? : r/FifaCareers](https://www.reddit.com/r/FifaCareers/comments/jnfh3u/how_does_the_new_player_development_actually_work/) - The player growth is dictated by the development plans. The better form the player is in, the faster...

28. [EA FC 26 Guide: How to develop young players quickly in Career ...](https://www.sportskeeda.com/esports/ea-fc-26-guide-how-develop-young-players-quickly-career-mode) - Player development in EA FC 26 is influenced by multiple factors like playtime, performance, trainin...

29. [EA FC 26 Career Mode: New features and tips for success - Red Bull](https://www.redbull.com/int-en/ea-fc-26-career-mode-tips-guide) - Want to become a successful manager in EA Sports FC 26's revamped career mode. Let us show you how t...

30. [FC 25: PLAYER GROWTH TIPS - YouTube](https://www.youtube.com/watch?v=UR4yfkFYmWs) - FC25 #CareerMode Easy to follow, simple tips and advice to help maximise Player Growth in FC 25 Care...

31. [Any tricks to increase the player ratings quickly. : r/FifaCareers - Reddit](https://www.reddit.com/r/FifaCareers/comments/14d9wzn/any_tricks_to_increase_the_player_ratings_quickly/) - Some positions change in 2 weeks and that in itself already makes the players OVR rating grow. Also ...

32. [Player Attributes in PES 2021](https://pesmyclubguide.com/player-attributes/) - Dribbling. Indicates how adept a player is at maintaining control of the ball while dribbling at spe...

33. [Master League Training Guide - Super Cheats](https://www.supercheats.com/playstation2/walkthroughs/proevolutionsoccer4-walkthrough01.txt) - Pro Evolution Soccer 4 walkthroughs on SuperCheats - Master League Training Guide

34. [Pro Evolution Soccer - Wikipedia](https://en.wikipedia.org/wiki/Pro_Evolution_Soccer) - From PES 3 (Winning Eleven 7), players' growth and decline curves were added, where a player's stati...

35. [eFootball - App Store](https://apps.apple.com/ph/app/efootball/id1117270703) - Level up players by putting them in matches or using in-game items, then spend the Progression Point...

36. [Players - Skills (Hattrick Tutorial) - YouTube](https://www.youtube.com/watch?v=GvlfbciSt18) - Discover the fundamental skills that define every player in Hattrick, from goalkeeping to scoring. L...

37. [Skills | What I have learned about Hattrick (so far....) - WordPress.com](https://wihlah.wordpress.com/2008/12/15/skills/) - Skills are used to represent how good a player is, in different aspects of a match. Depending on his...

38. [Players - Other attributes (Hattrick Tutorial) - YouTube](https://www.youtube.com/watch?v=KFNSjy9Dqsg) - ... player's skills. 0:00 Age 0:20 Personality 0:27 Agreeability 0:53 Aggressiveness 1:13 Honesty 1:...

39. [Training](https://wiki.hattrick.org/wiki/Training)

40. [YA Individual Training : r/hattrick - Reddit](https://www.reddit.com/r/hattrick/comments/106dtje/ya_individual_training/) - "You also have "Individual training" which trains each player randomly to a relevant skill, though t...

41. [How to FORCE Skill Revelations in Hattrick (Full Method ... - YouTube](https://www.youtube.com/watch?v=s7XAPI68PYo) - Skill revelations in the Hattrick Youth Academy aren't random — they follow a clear system based on ...

42. [Player | Top-Eleven Wiki | Fandom](https://top-eleven.fandom.com/wiki/Player) - MTE EM PREPARO. BY DANIEL REIS. Each player in Top Eleven has 15 attributes that are divided into 3 ...

43. [Player Tiers and OVR - Top Eleven - Be a Football Manager](https://www.topeleven.com/player-tiers-ovr/) - The Overall quality of your player is represented by two components: stars and Tier increase. · Play...

44. [How to Improve Your Players with Training - Top Eleven](https://www.topeleven.com/training-in-top-eleven/) - The most common way to improve your players' skill is, of course, by training. There are three forms...

45. [Training & Player Academy Tutorial | Top Eleven 2023 - YouTube](https://www.youtube.com/watch?v=UKUY_nqO5UI) - ... Coaches [02:48] Player Selection [03:21] Player Academy Coaches [ ... When Teenage Messi DESTROY...

46. [Secondary qualities - NodeBB](https://forum.onlinesoccermanager.com/topic/68343/secondary-qualities) - Players have 3 attributes (attack, defense, overall), and for each line in the formation one of thes...

47. [Curious about player stats : r/onlinesoccermanager - Reddit](https://www.reddit.com/r/onlinesoccermanager/comments/d4s6e1/curious_about_player_stats/) - Anything above 105 should be good, but just keep training your players. The RNG super-training can b...
## Related

- [[../incoming-design-research-2026-05-27]]
- [[../data-generators]]
- [[../player-strength-presentation]]
- [[../systemic-events-player-development-venue-ops]]
- [[../ai-manager-behaviour]]
