---
title: Raw — Roguelite × Football Manager Meta-Progression
status: raw
tags: [research, raw, perplexity, roguelite, meta-progression, manager]
created: 2026-05-27
updated: 2026-05-27
type: raw-research
binding: false
sourceType: external
related: [[../incoming-design-research-2026-05-27]], [[../mode-design-research]], [[../late-game-systems]], [[../../50-Game-Design/mode-create-a-club-roguelite]]
---

> Lossless import of Nico's external research report (Perplexity-style), filed
> 2026-05-27. **`status: raw` — not implementation authority.** Analysis, vault
> mapping and divergence flags live in [[../incoming-design-research-2026-05-27]].
> Largely **additive** to the locked Create-a-Club Roguelite mode
> ([[../../50-Game-Design/mode-create-a-club-roguelite]]) and late-game systems
> ([[../late-game-systems]]); the "perks SP-only / no P2W" stance matches the
> project posture. Raw research may quote competitor names for analysis only;
> implementation follows [[../ip-and-licensing]] and
> [[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]].

# Roguelite × Football Manager – Meta-Progression, Manager-Entwicklung & Genre-Fusion

## Executive Summary

Das Design-Konzept „Puso-Manager als Roguelite" berührt mehrere etablierte Game-Design-Paradigmen: klassische Roguelite-Meta-Progression, Legacy-Mechaniken aus Brettspiel-Design und das bisher weitgehend unbesetzte Feld des Management-Roguelites. Dieser Report analysiert die Kernmuster beider Genres, identifiziert konkrete Referenzspiele, benennt Risiken und leitet daraus ein kohärentes Progressions-Framework für den Puso-Manager ab.

Zentrale These: **Das Neue an diesem Konzept ist nicht die Roguelite-Mechanik an sich, sondern die Kombination aus verhaltensbasierter Post-Run-Analyse und kontextabhängiger Perk-Freischaltung** – also die Tatsache, dass nicht der Spieler einfach stärker wird, sondern dass das System seinen *Stil* erkennt und daraus individuelle Manager-Identitäten destilliert. Das gibt es als bewusstes Genre-Konzept bislang nicht.

***

## Teil 1: Was Roguelites wirklich gut machen

### Der Unterschied zwischen Run-Progression und Meta-Progression

Roguelite-Design trennt sauber zwischen zwei Progressionsebenen[^1]:

- **In-Run-Progression**: Upgrades, Karten, Relics, Gebäude – alles, was innerhalb eines Durchlaufs aufgebaut wird und danach weg ist (das Inventar im Sinne des Puso-Konzepts: Kader, Stadion, Verträge).
- **Meta-Progression**: Alles, was *zwischen* Runs bleibt – neue Startoptionen, Charaktereigenschaften, freigeschaltete Systeme, leichte Boni.

Die wichtigste Design-Lektion der letzten zehn Jahre ist: **Meta-Progression sollte neue Möglichkeiten schaffen, nicht rohe Stärke verleihen.** Flat-Stat-Buffs (+10% auf alles) sind die schlechteste Umsetzung – sie werten Skill ab, machen den Run trivial und erzeugen Grind statt Mastery[^2]. Die besten Systeme verfolgen einen anderen Ansatz: Sie schalten neue Archetypen, Spielweisen, Startprofile und Komplexitäts-Layer frei – so dass der nächste Run *anders*, nicht bloß *einfacher* wird[^3].

### Referenz-Systeme im Vergleich

| Spiel | Meta-Progressions-Typ | Kernmechanik | Qualität der Lösung |
|---|---|---|---|
| **Hades** | Weiche Stat-Boni + neue Waffen/Aspekte | Mirror of Night, resettbar | Sehr gut – Boni skalierbar, Challenge durch Pact of Punishment[^4][^5] |
| **Slay the Spire** | Unlock-basiert, kein Stat-Grind | Karten/Relics pro Charakter freischalten, Ascension-System | Exzellent – Unlocks = mehr Optionen, mehr Komplexität[^1][^6] |
| **Rogue Legacy** | Harte Stat-Progression (Gold → Upgrades) | Kaste vererbt Münzen, nächste Generation stärker | Umstritten – Game wird mit der Zeit trivial[^7][^8] |
| **Darkest Dungeon 2** | Candles of Hope → Altar of Hope | Kerzen durch Fortschritt verdienen, Helden-Buffs, Itempool-Unlocks | Gut – risikoangepasst, Run-Abbruch kostet Kerzen[^9][^10] |
| **Against the Storm** | Building-/Ability-Unlocks, Prestige-Level | Jedes Settlement läuft durch, Ressourcen → Citadel-Upgrades | Sehr gut – Unlocks = neue Synergien, keine Power-Inflation[^11][^12] |

**Besonders relevant für den Puso-Manager** ist *Against the Storm*: Ein Spiel, das City-Building (analog: Club-Management) mit Roguelite verbindet – jede Siedlung ist ein Run, dauert 1–3 Stunden, und scheitert oder gelingt. Meta-Progression kauft neue Gebäude-Unlocks, nicht überlegene Rohstärke[^11]. Das ist die nächste bekannte Vorlage für das geplante Konzept.

### Legacy-Mechaniken als ergänzende Schicht

Aus dem Brettspiel-Bereich kommen wertvolle Impulse: **Legacy Games** (Pandemic Legacy, Gloomhaven, Charterstone) sind Spiele, die sich permanent verändern – Sticker auf dem Board, zerrissene Karten, freigeschaltete Umschläge[^13][^14]. Das Prinzip: Jede Spielsitzung hinterlässt physische Spuren im Spiel selbst. Für ein Videospiel bedeutet das: Die Karriere-Historie wird Teil der Spielwelt. Ehemalige Clubs, bekannte Spieler-Namen, verbrannte Brücken – alles bleibt als Welt-Layer erhalten[^15][^16].

Das ist der „Legacy-Carry"-Gedanke: Nicht du wirst stärker, sondern *die Welt trägt deine Geschichte*.

***

## Teil 2: Das Manager-Progressions-Konzept im Detail

### Die Grundstruktur: Zwei Ebenen, zwei Lebensdauern

Das Puso-Konzept basiert auf einer eleganten Dualstruktur:

**Verein (Run-Asset) – stirbt mit dem Bankrott:**
- Kader, Verträge, Spielerwerte
- Stadion, Infrastruktur, Trainingszentrum
- Sponsoren, Finanzen, Fanbase
- Taktisches System und Vereins-DNA

**Manager (Charakter) – persistiert zwischen Runs:**
- Erfahrung, Reputation, Netzwerk
- Freigeschaltete Stil-Perks (Offensiv, Jugend, Pressing etc.)
- Infrastruktur-Boni (früheres Startkapital, besserer Bauplatz)
- Manager-Traits (erzählerisch wie spielmechanisch)

Diese Trennung ist das Herzstück des Designs. Sie entspricht dem bekannten Roguelite-Prinzip: Der Run-Charakter stirbt (Permadeath), der Meta-Charakter wächst[^17]. Im Puso-Manager: Der Club geht pleite, der Manager sammelt Erfahrung.

### Die drei Schichten der Meta-Progression

Nach den Erkenntnissen aus Slay the Spire, Hades, Darkest Dungeon 2 und Against the Storm empfiehlt sich folgende Dreischichtung[^1][^2][^18]:

**Schicht 1 – Knowledge Unlocks (keine Stärkeerhöhung):**
Neue Systeme, Reports, Startkonfigurationen werden freigeschaltet. Der Spieler versteht das Spiel tiefer, hat aber keine überlegene Rohstärke. Beispiele:
- Detaillierte Jugend-Scout-Reports (ab Run 3)
- Erweiterte Taktik-Vorlagen für bestimmte Spielphilosophien
- Neue Club-Archetypen (Investorenclub, Traditionsverein, Ausbildungsclub)

**Schicht 2 – Soft Carries (leichte, thematische Vorteile):**
Kleine Boni, die einen Start erleichtern, ohne ihn zu trivialisieren. Beispiele:
- Ein zusätzlicher Scout-Slot bei 3+ Runs mit Fokus auf Jugendarbeit
- Günstigerer Startkredit bei bewiesener Finanzdisziplin (5+ Saisons ohne Schulden)
- Besserer Verhandlungsbonus bei nachgewiesener Transferstärke

**Schicht 3 – Identity Carries (erzählerische Permanenz):**
Wappen, Vereinshistorie, Managername, bekannte Ex-Spieler tauchen in der Spielwelt wieder auf. Der neue Club zitiert den alten – vielleicht kaufst du einen Jugendtalent, den du vor 3 Runs ausgebildet hast. Diese Schicht kostet kaum Balance-Aufwand, schafft aber enorme emotionale Bindung[^19][^13].

***

## Teil 3: Verhaltensbasierte Perk-Freischaltung – das Neue Genre-Element

### Das Kernkonzept: Run-Analyse → Stil-Erkennung → Perk-Freischaltung

Hier liegt die eigentliche Innovation. Bestehende Roguelites analysieren *Erfolg* (hast du gewonnen?), aber nicht *Stil* (wie hast du gespielt?). Der Puso-Manager soll nach jedem Run ein **Verhaltens-Profil** erstellen und daraus individuelle Perks destillieren.

Das ist eine Kombination aus:
- Post-Run-Scoresheet (bekannt aus Roguelikes wie Cogmind[^20])
- Playstyle-Erkennung (bekannt aus Sportanalyse und EA FC-Systemen[^21])
- Behavior-based Unlocks (konzeptionell neu für das Manager-Genre)

### Beispiel-Metriken und ihre Perk-Konsequenzen

Die folgende Matrix zeigt, wie gemessenes Spielerverhalten in konkrete Perks übersetzt werden kann:

| Gemessenes Verhalten (über X Saisons) | Freischaltbarer Perk | Kategorie |
|---|---|---|
| >60% Ballbesitz im Schnitt | „Possession Coach" – Jugendtalente entwickeln Technik schneller | Taktik-Perk |
| >8 eigene Jugendtalente in A-Kader befördert | „Talent Whisperer" – bessere Jugend-Startbedingungen im nächsten Run | Jugend-Perk |
| 3+ Saisons ohne Bankrottnähe (Cash-Reserve stabil) | „Financial Architect" – 10% günstigerer Startkredit | Finanz-Perk |
| Pressingstil mit >55% erfolgreichen Balleroberungen | „Gegenpressing DNA" – Neuzugänge passen sich schneller an | Taktik-Perk |
| >5 Spieler mit Marktwertgewinn >200% verkauft | „Transfer Mastermind" – frühere Scouting-Reports auf Talente | Transfer-Perk |
| Rivalen-Derby-Serie >70% gewonnen | „Derby-Dominator" – Heimspiel-Atmosphären-Bonus | Identitäts-Perk |
| Infrastruktur systematisch ausgebaut (5+ Stadionerweiterungen) | „Infrastructure Builder" – günstigerer Stadionbau-Start | Infrastruktur-Perk |
| Coaching-Staff immer ausgebaut und investiert | „Staff Architect" – Besonderer Staff-Slot freigeschaltet | Personal-Perk |

### Wichtige Designregeln für dieses System

**Schwellenwert-basiert, nicht gradlinig:** Perks sollten nicht durch schlichtes Akkumulieren einer Währung erworben werden, sondern durch das Erreichen konkreter Verhaltens-Muster[^2][^1]. Das verhindert Grind und erzwingt stilistische Kohärenz.

**Perks reflektieren die Spielweise, nicht bloß den Erfolg:** Ein Spieler, der 8 Saisons lang hervorragende Jugendarbeit leistete, aber sportlich nie Meister wurde, sollte trotzdem den „Talent Whisperer"-Perk erhalten. Das wertet das *Spielen* an sich auf – nicht nur das Gewinnen.

**Kein Perk darf einen Run dominieren:** Selbst die stärksten Infrastruktur-Perks (z.B. ein etwas besseres Startbudget) sollten den Run nicht vorentscheiden. Die Spannung des frühen Runs muss erhalten bleiben[^22][^3].

**Perks sind opt-in, nicht erzwungen:** Beim Neustart wählt der Spieler, welche seiner freigespielten Perks er aktiviert. Das erlaubt Challenge-Runs ohne alle Vorteile und gibt dem System selbst eine strategische Dimension.

***

## Teil 4: In-Run Manager-Entwicklung

### Das doppelte Progressionsproblem

Der Puso-Manager braucht Progression auf zwei Zeitskalen gleichzeitig:

1. **Innerhalb des Runs** (Saison 1 bis Bankrott): Der Manager soll spürbar wachsen – besser verhandeln, taktisch flexibler werden, ein wachsendes Netzwerk aufbauen.
2. **Zwischen Runs** (Meta-Ebene): Ein Teil dieser Entwicklung bleibt erhalten, ein Teil wird zurückgesetzt.

Das ist das klassische Roguelite-Dilemma, das am besten von Darkest Dungeon 2 gelöst wurde: Helden behalten ihre Charaktereigenschaften zwischen Runs, verlieren aber alle materiellen Ressourcen[^10]. Im Puso-Manager: Der Manager behält seinen Ruf und seine Stil-Perks, verliert aber seinen Club.

### In-Run-Progression: Manager-Attribut-System

Innerhalb eines Runs entwickelt der Manager folgende Attribute, die *während des Runs* aktiv wirken:

**Taktik-IQ:** Steigt durch erfolgreiche Taktikwechsel, gewonnene Duelle gegen überlegene Gegner, Anpassungen in der Halbzeit. Schaltet neue Taktik-Optionen und tiefere Analyse-Reports frei.

**Netzwerk-Wert:** Wächst durch abgeschlossene Transfers, Vereinspartnerschaften, Medienpräsenz. Besseres Netzwerk = mehr Transferanfragen, günstigere Beraterhonorare.

**Motivation-Skill:** Entwickelt sich durch Teamgespräche, Krisenbewältigung, Spieler-Management. Betrifft Moral-Werte des Kaders.

**Finanzintelligenz:** Wächst durch erfolgreiche Budget-Verwaltung, clevere Vertragsgestaltung. Schaltet bessere Finanzreports und Verhandlungsoptionen frei.

Diese Attribute sind **temporär verstärkt durch Runs, aber partiell persistent**. Konkret: Nach dem Bankrott sinkt jedes Attribut um 30-50% seines Run-Höchstwertes – aber nie unter die Meta-Basis des Managers. Das bedeutet: Wer viele Runs gespielt hat, startet den nächsten Run mit einem erfahreneren Manager, der schneller auf seine alten Höchstwerte kommt.

### Der Reset-Mechanismus: Was bleibt, was geht

Das ist die sensibelste Design-Entscheidung. Aus der Forschung zu erfolgreichen Roguelites ergibt sich folgendes Prinzip[^3][^2]:

| Komponente | Status nach Bankrott |
|---|---|
| Vereinsvermögen, Kader, Verträge | Komplett weg (Permadeath) |
| Infrastruktur (Stadion, Training) | Komplett weg |
| In-Run-Attribute (Taktik-IQ etc.) | 50% Reset, aber nie unter Meta-Baseline |
| Stil-Perks (Jugend, Offensiv etc.) | Bleiben erhalten, werden durch Run-Analyse ergänzt |
| Manager-Reputation (globale Bekanntheit) | Sinkt um 20%, steigt aber im nächsten Run schneller |
| Welt-Legacy (bekannte Spieler, Rivalen etc.) | Bleibt in der Spielwelt (Legacy-Carry) |
| Freischaltungen (Startprofile, Club-Archetypen) | Bleiben permanent freigeschaltet |

***

## Teil 5: Infrastruktur-Perks – Sonderfall

### Der Kern der Frage: Darf ein Perk bessere Infrastruktur geben?

Dies ist das heikelste Design-Problem. Infrastruktur-Boni (besseres Startbudget, günstigerer Bau, vorhandene Grundausstattung) sind mächtige Vorteile, die einen Run von Anfang an prägen. Falsch implementiert werden sie zu Pay-to-Win-Mechaniken oder trivialisieren den Early-Game komplett.

Die Lösung aus Against the Storm und Slay the Spire zeigt den Weg[^11][^6]: **Infrastruktur-Perks dürfen nicht den Start-Kader oder das Startkapital direkt erhöhen, sondern die *Effizienz* bestimmter Investitionen.**

Konkrete Empfehlung:

| Perk-Typ | Akzeptabel? | Begründung |
|---|---|---|
| „Stadionbau 15% günstiger" (nach 10 gebauten Stadien) | ✅ Ja | Beeinflusst Effizienz, nicht Startvorsprung |
| „Start mit kleinem Fanclub (500 treue Fans)" (nach 5 Jugendprojekt-Runs) | ✅ Ja | Kosmetisch/narrativ, minimaler Effekt |
| „Start mit 30% mehr Kapital" | ⚠️ Grenzwertig | Nur als sehr spät freischaltbarer Perk nach 15+ Runs |
| „Start mit bereits ausgebautem Trainingsgelände" | ❌ Nein | Zu starker Run-Vorteil im Early-Game |
| „Start mit top Jugendscout bereits angestellt" | ⚠️ Grenzwertig | Nur als thematischer Perk für Jugend-Spezialisten |

**Goldene Regel:** Infrastruktur-Perks dürfen den Run beschleunigen, aber nicht den Fail-State verhindern. Wer schlechte Finanzdisziplin hat, geht auch mit Bau-Bonus pleite.

***

## Teil 6: Neue Genre-Nische und Wettbewerbsposition

### Bekannte Hybride im Markt

| Spiel | Genre-Mischung | Stärke | Schwäche |
|---|---|---|---|
| **Against the Storm** | City-Builder + Roguelite | Tiefes Meta-System, hohe Varianz | Kein Sport-Bezug, abstrakter |
| **Legend of Keepers** | Dungeon-Manager + Roguelite | Narrative, gut umgesetzte Runs | Klein, kein Echtzeit-Sport-Sim[^23] |
| **Football Manager** (klassisch) | Manager-Karriere, kein Roguelite | Tiefe, Realismus | Kein Permadeath, kein Meta-Carry, keine Run-Struktur[^24] |
| **Hades** | Action-RPG + Roguelite | Meisterklasse Meta-Progression | Kein Management-Aspekt |
| **Darkest Dungeon** | RPG-Manager + Roguelite | Ressourcen-Management, Permadeath | Kein Sport-Element[^9] |

**Kein Spiel kombiniert bislang:** tiefes sportliches Management (Taktik, Transfers, Jugend, Finanzen, Stadion) + Roguelite-Run-Struktur + verhaltensbasierter Manager-Progression. Das ist die Genre-Lücke.

### Was das Neue Genre ausmacht

Der Puso-Manager als „Sports Management Roguelite" wäre das erste Spiel, das folgende Merkmale gleichzeitig vereint:

1. **Permadeath auf Club-Ebene** (Bankrott = Run-Ende), nicht auf Charakter-Ebene
2. **Stil-basierte Meta-Progression** (wie du spielst prägt deinen Manager-Archetyp)
3. **Legacy-Welt** (deine alten Clubs hinterlassen Spuren in der Spielwelt)
4. **Dual-Progression** (in-Run-Entwicklung + Meta-Manager-Entwicklung)
5. **Vollständige Sport-Simulation** (Taktik, Transfers, Jugend, Finanzen, Match Engine)

Die nächsten Vergleichstitel fehlen entweder Punkt 1–3 (Football Manager, FM Mobile) oder Punkt 5 (Against the Storm, Darkest Dungeon).

***

## Teil 7: Konkrete Implementierungs-Empfehlungen

### Das Post-Run-Analyse-System: Technische Skizze

```
RunAnalysisResult {
  // Taktische Metriken
  avg_possession_pct: float
  pressing_success_rate: float
  offensive_style_score: float  // 0 = tief, 1 = offensiv
  
  // Entwicklungs-Metriken  
  youth_players_promoted: int
  player_value_increase_avg: float
  
  // Finanz-Metriken
  seasons_without_loss: int
  transfer_profit_total: float
  
  // Stabilität
  seasons_survived: int
  max_league_position: int
  
  // Kumuliert über alle Runs
  career_runs: int
  total_youth_promoted: int
}

// Perk-Freischaltungs-Logik
if career.total_youth_promoted >= 10:
  unlock_perk("talent_whisperer")
  
if run.avg_possession_pct >= 0.60 AND run.seasons_survived >= 3:
  unlock_perk("possession_master")
```

### Schwellenwert-Tabelle: Wann schalten Perks frei?

Alle Perks sollten so kalibriert sein, dass sie nach 3–8 Runs (abhängig von Spielintensität) natürlich auftreten – nicht als Grind-Belohnung, sondern als organische Reflexion des Spielstils[^1]:

| Perk | Freischalt-Bedingung | Typ |
|---|---|---|
| „Possession Coach" | 3 Runs mit Ø >58% Ballbesitz | Soft Carry |
| „Talent Whisperer" | 8 total beförderte Eigenjugendliche über alle Runs | Soft Carry |
| „Financial Architect" | 5+ Saisons ohne Verlust-Quartal in einem Run | Soft Carry |
| „Gegenpressing DNA" | 2 vollständige Runs mit Pressing-Fokus | Identity |
| „Transfer Mastermind" | 5 Spieler mit >150% Marktwert-Gewinn verkauft | Knowledge Unlock |
| „The Grinder" | 10 Runs insgesamt abgeschlossen | Identity |
| „Derby Legend" | 3 Runs mit >70% Derby-Gewinnrate | Identity |
| „Infrastructure Baron" | Stadion in 2 Runs auf >25.000 Plätze ausgebaut | Soft Carry |

### Manager-Archetypen als Endpunkt

Langfristig sollte das System auf **Manager-Archetypen** hinauslaufen – eine Kombination aus 3–5 freigeschalteten Perks ergibt einen Archetypen mit eigenem Namen und eigenem Starting-Bonus:

- **„Der Jugendtrainer"**: 3+ Jugend-Perks → bessere Jugend-Startinfrastruktur, stärkere Jugend-Bindung
- **„Der Taktiker"**: 3+ Taktik-Perks → tiefere Taktik-Optionen von Beginn an verfügbar
- **„Der Kaufmann"**: 3+ Finanz-/Transfer-Perks → günstigerer Startkredit, mehr Transferkontakte
- **„Der Motivator"**: Staff- und Moral-Perks → stärkere Teamkohäsion zu Beginn
- **„Der Bauherr"**: Infrastruktur-Perks → effizienteres Stadion- und Trainingszentrum-System

Diese Archetypen sind keine fixen Klassen, sondern **emergente Identitäten** – der Spieler baut sich seinen Manager durch Spielen, nicht durch Charaktererstellung.

***

## Teil 8: Risiken und Balancing-Empfehlungen

### Kritische Risiken

**1. Meta-Progression trivialisiert den Run** (höchstes Risiko)
Wenn Perks zu stark sind, wird der Early-Game langweilig. Jeder Run mit dem erfahrenen Manager wirkt dann wie Easy Mode[^25][^26]. Gegenmittel: Perks geben Effizienz, nie direkte Macht; Ascension-System (Slay the Spire-Prinzip) gibt mehr Herausforderung je mehr Perks man hat.

**2. Verhaltens-Tracking fühlt sich künstlich an**
Wenn der Spieler merkt, dass er „Offensiv-Fußball erzwingen muss um den Offensiv-Perk zu bekommen", verliert das System seinen Reiz. Gegenmittel: Metriken still messen, keine expliziten Progress-Balken für einzelne Perks; der Spieler soll die Perks als Überraschungs-Reflexion seines Stils erleben.

**3. Bankrott als Frustrations-State statt Motivations-State**
Wenn der Spieler nach 7 Saisons pleitegeht und das System schlecht kommuniziert wird, fühlt sich der Verlust destruktiv an. Gegenmittel: Post-Run-Screen mit Highlights, Welt-Legacy-Anzeige, Perk-Vorschau – Verlust fühlt sich wie ein „Kapitelabschluss" an, nicht wie Scheitern.

**4. Multiplayer-Fairness**
Im Multiplayer-Modus dürfen Perks keinen kompetitiven Vorteil geben. Empfehlung: Im Gruppenspiel werden alle Perks auf ein gemeinsames Baseline-Niveau normalisiert oder deaktiviert. Meta-Progression ist nur im Singleplayer-Modus voll aktiv.

### Ascension-System als Gegenpol

Analog zu Slay the Spire sollte ein **Herausforderungs-System** eingebaut werden, das mit freigeschalteten Perks skaliert[^6][^27]:

- Je mehr Perks ein Spieler hat, desto höhere „Manager-Prestige-Level" stehen zur Verfügung
- Prestige-Level erhöhen die Schwierigkeit (härtere Gegner-KI, weniger Transfermarkt-Glück, höhere Inflation, instabilere Sponsoren)
- Das verhindert, dass das Spiel mit Erfahrung trivial wird

***

## Fazit: Blueprint für das neue Genre

Der Puso-Manager kann ein echtes Genre-Novum schaffen – nicht durch Technologie, sondern durch Design-Intelligenz. Die Schlüsselelemente:

1. **Klare Run-Struktur**: Club-Lebenszyklus mit hartem Permadeath (Bankrott)
2. **Dualer Charakter**: Verein = Run-Asset; Manager = persistenter Charakter
3. **Verhaltens-basierte Perk-Freischaltung**: Stil wird erkannt, nicht Erfolg belohnt
4. **Legacy-System**: Die Spielwelt erinnert sich an deine Clubs und Spieler
5. **Ascension-Gegenpol**: Neue Herausforderungen skalieren mit freigeschalteter Stärke
6. **Archetyp-Emergenz**: Spieler *erspielt sich* seine Manager-Identität, wählt sie nicht

Das Spiel löst damit das zentrale Problem aller bisherigen Roguelites mit Meta-Progression: Die besten Systeme machen den Spieler nicht stärker, sondern tiefer. Und Tiefe ist im Sports-Management-Genre das Versprechen, das alle großen Spiele machen – aber keines bisher mit Roguelite-Konsequenz einlöst.

---

## References

1. [Meta progression with gradual tutorial in roguelike games](https://notes.hamatti.org/gaming/video-games/meta-progression-with-gradual-tutorial-in-roguelike-games) - Start with simple mechanics (cards, weapons, relics) to help player learn and then gradually introdu...

2. [How can I develop a good meta-progression system? : r/roguelites](https://www.reddit.com/r/roguelites/comments/18dc2t4/how_can_i_develop_a_good_metaprogression_system/) - Try to avoid stat-boosting meta progress. Unlocks should feel fun and exciting, and straight "+10%" ...

3. [Roguelites Need to Focus More on Player Progression - YouTube](https://www.youtube.com/watch?v=nB5nTejOCxQ) - I think that an over-reliance on meta progression has started to detract From the main Joy of the ro...

4. [Hades' Mirror Of Night Does Upgrades Right](https://www.thegamer.com/hades-mirror-of-night-roguelite-progression/) - Hades' Mirror of Night is brilliant because of how well it understands progression.

5. [Can someone specify me exact amount of roguelite-ness of this game?](https://www.reddit.com/r/HadesTheGame/comments/ifugjb/can_someone_specify_me_exact_amount_of/) - Can someone specify me exact amount of roguelite-ness of this game?

6. [All Ascension levels in Slay the Spire 2 - PCGamesN](https://www.pcgamesn.com/slay-the-spire-2/ascension-levels) - Here's how the Ascension levels system works in Slay the Spire 2, including how they're unlocked and...

7. [Arcana Cards & Meta-Progression in Hades 2 Have Me Hooked](https://frostilyte.ca/2025/04/09/arcana-cards-meta-progression-in-hades-2-have-me-hooked/) - I wanted to talk about changes that were made between Hades and Hades 2 as it relates to progression...

8. [Die Entwicklung von Roguelike-Design - Wie Rogue zu FTL ... - Reddit](https://www.reddit.com/r/Games/comments/ah9fhj/the_evolution_of_roguelike_design_how_rogue_led/) - Und das ist ein völlig akzeptables Design (viele Leute lieben Rogue Legacy) ... Legacy ähnelt, außer...

9. [Darkest Dungeon 2 gets major update to metagame and progression](https://www.eurogamer.net/darkest-dungeon-2-gets-major-update-to-metagame-and-progression) - Early access roguelike Darkest Dungeon 2 is getting a major update which reworks the game's progress...

10. [Darkest Dungeon 2: Progression vs DD1's Progression? - Reddit](https://www.reddit.com/r/darkestdungeon/comments/1g8cfy6/darkest_dungeon_2_progression_vs_dd1s_progression/) - The hero is also kept between runs exactly as they are, with all positives and negatives. Each DD1 r...

11. [Against the Storm Highlights (and Breaks) the Limitations of Modern ...](https://www.escapistmagazine.com/against-the-storm-highlights-and-breaks-the-limitations-of-modern-roguelites/) - It valiantly combines traditional city-building mechanics with the fun, breezy thrills of an action-...

12. [What part is "roguelite" ? : r/Against_the_Storm - Reddit](https://www.reddit.com/r/Against_the_Storm/comments/107qy7x/what_part_is_roguelite/) - Most broadly roguelike means permadeath + procedural generation, while "roguelite" means permadeath ...

13. [Legacy Board Games Guide: Games That Change Forever](https://goblinwars.com/legacy-board-games-guide/) - Legacy Board Games Guide: Games That Change Forever Legacy board games permanently alter components ...

14. [Game Mechanics: Legacy games](https://xenomarket.com/blogs/news/game-mechanics-legacy-games) - Let's talk about Legacy game mechanics. Traditionally, when you are done playing a game, all the rul...

15. [Legacy Games](http://virt10.itu.chalmers.se/index.php/Legacy_Games)

16. [Legacy game - Wikipedia](https://en.wikipedia.org/wiki/Legacy_game)

17. [Meta-progression design challenge explained - Facebook](https://www.facebook.com/groups/TGC.designer.discussion/posts/2997763263864881/) - In meta-progression, we're looking for something that happens between instances of a game rather tha...

18. [ich-mochte-eine-Art-Fussballmanager-als-app-_Entwi.md](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_fdf1dd79-bbbe-41c4-a356-052e376b8b7c/820c4b98-64c9-4347-9e3e-cf52dc40d1ed/ich-mochte-eine-Art-Fussballmanager-als-app-_Entwi.md?AWSAccessKeyId=ASIA2F3EMEYE7YSZNCGS&Signature=1PI6t0mmSWp3PSbnFrseGIUQy1A%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIQDFxHXBZVVY%2FLFZv5RO9TbcSTtUVx7lkIwoAoPm%2F6nSGQIgCdo%2Bl2chSPc2HNDRaNwFmBuyyJmNZfQDX7a9Z9eBbTUq%2FAQIlP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARABGgw2OTk3NTMzMDk3MDUiDFoeQjnynL5%2B7Y8JLCrQBDreCZjrCPveg6Kp7jR1L5%2BiDkhvDt0z0CK9%2FAiazjGqO8HS5eRMUKW3jiEDEnSThzHiWsWzgBMjob1fFeZ8GYOnGIEPM0Mt%2FS5nFuaoLa2sm4cQ2bxkyv9r%2BJe1zU4pbqdmMBxqiuyIMhSZ4EE4fH7cX%2F8LOzD5WnQM3Uv0bZ6i5kFQcOd4%2BKfm0R%2F225iJPZNIJ4oyypT8nSDZJZqwKpbxBWUkNP17y9D79cq4x9JmFyJ5yta0ejBjjuXccD6py21bNXA7T8TsC75JpXTLJdjE7NWzar13vljrd%2FigVZ6dm8XpT6mqa9USXNKq28oHlW%2BpCphbNvZwKlX%2FHpb7s4%2BL%2BPqMkvwap2ZOy7YzCIPQ3v1AZwbDblzUmKiMOiictWxYNYWLBobyIDayBTK6wpxPM0Epzjb1lVyw17sUuQPYHNbsB28b57XNG9xT%2FOd%2F1%2FU0T3EjTOi0ZEPlXuhngTGTIqb9QOYiLeVWnSRCZM7J%2FarjgI6KYl7joUUS0U0J0rwBJg8V1p5KV%2FwiWU2SeqsnyMi%2By03d3z4u%2FWXGasymGydIQBDGHmvJQdsqewbphLgI1dIIHeEdjBN1PfbObzgmfvHBiIrfi%2FBRH8d%2FHcJOxQv1iULMtqULrwVtyF6aeqQvD45zltKuUz4fbGb%2Bsz5OjemFFWZSi%2Bf1U9o56Uziw6PCA4MlBsjK0SLUOXHOPM7oL64IbftQDGkdynCtRNmYWb%2B8jAOiP0K3Cm%2BczyIj7UZKXVyY5D%2FQDUigbeV7aKDn%2F4MmL%2F6ORPqValBa97Uw2Z%2Fb0AY6mAHE5sf9BCokPbFGjQKWQcO4JaCImfObhVveagRg8BhMPvmo47K20p71bqL96ROfs40aRa0rI6Rf5mJG5ExyFxtVDZb1MFhnjiIo9225%2Bu1mhnT5hqTZHTdyLgGxfPOVpzQ4Yz56CTiub4uvXQfIVyyvQI1v5bTjFrDAUOfGdQScrbXgDqrgR88xfKpXVol9eJ8DbjwyTkwVBg%3D%3D&Expires=1779883436) - Das Feld sollte in logische Zonen geteilt werden - erste Aufbauzone, - Halbrume, - Flgel, - Zwischen...

19. [Any examples of persistent worlds between runs? Or mission-based game structures?](https://www.reddit.com/r/roguelikedev/comments/nfymcl/any_examples_of_persistent_worlds_between_runs_or/)

20. [The Ultimate Roguelike Morgue File, Part 2: Mid-run Stat Dumps](https://www.gridsagegames.com/blog/2019/08/building-ultimate-roguelike-morgue-file-part-3-mid-run-stat-dumps/) - A mid-run stat dump as an alternative short summary of the run's progress and (most importantly) cur...

21. [Youth Academy playstyles change is a big step in the right direction](https://www.reddit.com/r/FifaCareers/comments/1768u8r/youth_academy_playstyles_change_is_a_big_step_in/)

22. [What makes or breaks agency in roguelikes - Tom's Site](https://thom.ee/blog/what-makes-or-breaks-agency-in-roguelikes/) - I won't step into the dictionary debate of roguelikes versus roguelites, but suffice to say, meta-pr...

23. ["RPG in Reverse": A Roguelike and Dungeon Manager Hybrid is ...](https://ixbt.games/en/news/2026/04/17/rpg-naoborot-v-steam-razdaiut-gibrid-rogalika-i-menedzhera-podzemelii.html) - The Goblinz Studio team is currently developing Infamous Keepers — a hybrid of roguelite and tower d...

24. [Is Football Manager the Greatest RPG Ever? (tldr: YES!)](https://loudpoet.com/2023/09/23/is-football-manager-the-greatest-rpg-ever-tldr-yes/) - Instead of weapons, magic items, and gold, Football Manager is all about people and money. Your play...

25. [As with other roguelikes, you can unlock persistent upgrades that ...](https://news.ycombinator.com/item?id=43657882) - As with other roguelikes, you can unlock persistent upgrades that smooth over repetitive parts of th...

26. [Meta-progression is a mostly bad design - Game Observatory](https://gameobservatory.neocities.org/opinions/ontopic21) - Normally, meta-progression exists to trick player into playing for longer and buy microtransactions,...

27. [More games should handle difficulty like Slay the Spire](https://frostilyte.ca/2020/04/16/more-games-should-handle-difficulty-like-slay-the-spire/) - Once you've beaten a full run on the default difficulty you're able to turn on ascension levels to a...

