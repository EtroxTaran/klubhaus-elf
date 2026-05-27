---
title: Raw — Club Economy Simulation Design Document
status: raw
tags: [research, raw, perplexity, economy, finance, club-management]
created: 2026-05-27
updated: 2026-05-27
type: raw-research
binding: false
sourceType: external
related:
  - [[../incoming-design-research-2026-05-27]]
  - [[../systems-design-synthesis]]
  - [[../../50-Game-Design/economy-system]]
  - [[../../50-Game-Design/GD-0008-finance-economy]]
---

> Lossless import of Nico's external research report (Perplexity-style), filed
> 2026-05-27. **`status: raw` — not implementation authority.** Analysis, vault
> mapping and divergence flags live in [[../incoming-design-research-2026-05-27]].
> Deep economy input for [[../../50-Game-Design/economy-system]] /
> [[../../50-Game-Design/GD-0008-finance-economy]]; the absolute € figures are
> illustrative external references — the project scales multiplicatively by
> league tier. Raw research may quote competitor / real club / league names for
> analysis only; implementation follows [[../ip-and-licensing]] and
> [[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]].

# Wirtschaftssimulation Fußballverein – Vollständiges Design-Dokument

> **Bereich:** Game Design → Wirtschaftsmechanik  
> **Modus:** Singleplayer Roguelite / Karriere  
> **Kernregel:** Insolvenz = Game Over. Jede Entscheidung hat ökonomische Konsequenzen.

***

## Executive Summary

Dieses Dokument beschreibt ein vollständiges Wirtschaftssimulationsmodell für einen Fußballmanager im Roguelite-Stil. Der Verein startet bei null, muss Infrastruktur aufbauen, Einnahmen erwirtschaften und darf zu keinem Zeitpunkt zahlungsunfähig werden. Das Modell bildet alle wesentlichen realen Einnahmequellen und Kostenblöcke eines Fußballvereins ab – von Spieltagseinnahmen bis zu Stadioninfrastruktur, Trikotverkäufen, Sponsoring, TV-Geldern und Pokalprämien – und macht sie spielbar durch saisonale Schwankungen, Auf-/Abstiegsschocks und Spieler-Stareffekte.

***

## 1. Grundmodell: Cashflow-Architektur

### 1.1 Zwei Typen von Geldflüssen

Das Herzstück der Simulation ist die Unterscheidung zwischen **fixem Cash-Drain** (läuft wöchentlich, unabhängig vom Spielgeschehen) und **ereignisbasiertem Cash-Eingang** (punktuell, saisonal, leistungsabhängig).

| Typ | Beschreibung | Beispiele |
|-----|-------------|---------|
| **Fixe Wochenkosten** | Laufen immer, auch spielfreie Wochen | Löhne, Mieten, Energie, Wartung |
| **Matchday-Einnahmen** | Nur an Heimspieltagen | Tickets, Gastronomie, VIP |
| **Saisonale Einnahmen** | Einmalig oder periodisch | Dauerkartenverkauf, TV-Geld, Pokal |
| **Transfers** | Unregelmäßig | Spielerverkauf, -kauf, Ablöse |
| **Ereignisbonus** | Leistungsabhängig | Meistertitel, Pokalfinale, Aufstieg |

**⚠️ Kerngefahr für den Spieler:** In spielfreien Wochen (Winter-Pause, Saisonpause, Länderspielpausen) laufen Fixkosten weiter, ohne Einnahmen. Das ist die erste große Insolvenzfalle.

### 1.2 Wöchentliche Geldfluss-Übersicht (Modelljahr)

Eine Saison umfasst ca. 34–38 Spieltage. Bei 17–19 Heimspielen gibt es pro Saison ca. **17–19 umsatzstarke Heimspielwochen** und ebenso viele **umsatzarme Auswärtswochen** plus **4–8 spielfreie Wochen** (Pause, Länderspiele, DFB-Pokal-Freiloswoche etc.)[^1].

***

## 2. Einnahmenquellen – Vollständige Übersicht

### 2.1 Spieltagseinnahmen (Matchday Revenue)

Die wichtigste und direkteste Einnahmequelle, besonders in unteren Ligen[^1][^2].

#### Ticketverkauf

| Kategorie | Beschreibung | Mechanik |
|-----------|-------------|---------|
| **Stehplatz / Normalticket** | Standard, günstigster Preis | Basisnachfrage, abhängig von Liga + Tabellenplatz |
| **Sitzplatz** | Mittlere Kategorie | Preisgestaltung durch Spieler wählbar |
| **VIP-Loge** | Premium-Ticket | Hoher Gewinn pro Platz, aber begrenzte Kapazität |
| **Dauerkarte** | Saisonticket, Vorverkauf | Cashflow-Puffer: Einnahme vor Saisonstart, günstigerer Einzelpreis |

**Dauerkarteneffekt:** Saisontickets bieten sichere Einnahmen, werden aber typischerweise mit 10–20% Rabatt gegenüber Einzeltickets verkauft[^3]. Das schafft Cash-Sicherheit, kostet aber Erlös bei ausverkauften Top-Spielen.

**Saisonalität:** Dauerkartenverkauf findet **vor Saisonstart** statt (Juli–August) – ein wichtiger Cash-Puffer für die ersten Wochen. Wer zu wenige Dauerkarten verkauft, startet mit einem Loch.

#### Nachfrage-Modifikatoren (Zuschaueranzahl)

- Tabellenplatz (höher = mehr Zuschauer)[^2]
- Gegner-Prestige (Topspiele vs. Kellerduell)
- Wochentag (Samstagsspiele > Dienstagabend)[^4]
- Wetterlage (Regen = Minus 5–15% Auslastung)
- Fanstimmung / Vereinskultur (aufbaubar)
- Risikospiele (z. B. Derby): Alkoholverbot → Bier-Umsatz −30%[^5]

### 2.2 Gastronomie & Stadionbetrieb (Infrastruktur-Einnahmen)

Realitätsnah nach dem Bundesliga-Catering-Modell[^5]:

#### Catering-Modelle (auswählbar im Spiel)

| Modell | Beschreibung | Vorteil | Nachteil |
|--------|-------------|---------|---------|
| **Eigenbetrieb** | Verein betreibt Kioske selbst (Würstchenstand etc.) | 100% Einnahmen | Höhere Personalkosten, Wareineinkauf teurer |
| **Pachtmodell** | Externer Caterer zahlt % des Umsatzes als Pacht | Kein Personalaufwand | Nur 10–20% der Einnahmen fließen an Verein |
| **Mischmodell** | Eigenbetrieb Public + Fremdcaterer VIP | Ausbalanciert | Höhere Verwaltungskosten |

**Realzahlen als Referenz:** Ein Bundesligist mit 48.000 Fans (ø 5 €/Fan an Kiosken) erzielt ca. 4,1 Mio. € Catering-Umsatz pro Saison im Public-Bereich. Die Marge liegt bei 3–10% für externe Caterer; beim Eigenbetrieb ist mehr möglich, aber Kosten sind höher[^5].

#### Einzelne Infrastruktur-Slots (baubar, skalierbar)

| Anlage | Baukosten | Wochenkosten | Einnahmen pro Heimspiel |
|--------|-----------|--------------|------------------------|
| Einfacher Würstchenstand | Niedrig | Gering | Gering |
| Bierausschank | Mittel | Mittel | Mittel (risikoabhängig) |
| Fan-Shop im Stadion | Mittel | Gering | Mittel + Merchandise-Umsatz |
| Restaurant / Kneipe | Hoch | Hoch | Hoch (auch nicht-Spieltage nutzbar) |
| VIP-Logenbereich | Sehr hoch | Mittel | Sehr hoch |
| Parkhaus / Stellplätze | Hoch | Niedrig | Stabil pro Heimspiel |

**Wichtig:** Gastronomie außerhalb von Spieltagen (Restaurant, Vereinsgaststätte) generiert auch an **spielfreien Wochen** Einnahmen – ein wichtiger Mechanismus gegen die Pausenkrise.

### 2.3 Merchandise & Trikotverkauf

#### Trikotverkauf – Stareffekt-Mechanik

Trikotverkäufe sind **spieler- und erfolgsabhängig** und schwanken stark[^6][^7]:

- Ein "Superstar" im Kader boosted die Trikotverkäufe um bis zu **+40–80%**
- Wenn dieser Spieler geht: Einbruch in der nächsten Saison um denselben Faktor
- Dies ist eine **direkte Insolvenzfalle**, wenn damit geplant wurde

**Faktor-System für Trikotverkäufe (Game-Modell):**

```
Basis-Trikotverkauf (pro Saison) = Ligafaktor × Fanbase × Popularitätsfaktor
Starbonus = Spieler-Ruhm-Wert × Multiplikator (0.5x – 3.0x)
Gesamt = Basis × Starbonus × Saisonform-Modifikator
```

Clubs erhalten vom Trikotverkauf typischerweise nur 7,5–20% des Endverkaufspreises, der Rest geht an den Ausrüster[^6]. Im Frühspiel (kleiner Verein, kein Markendeal) = Eigenbetrieb über Fanshop mit höherer Marge, aber geringerem Volumen.

#### Merchandise-Katalog (ausbaubar)

- Schals, Mützen, Poster (günstig, geringe Marge)
- Trikots Heim/Auswärts/3rd (Hauptprodukt)
- Kindertrikots (eigene Kategorie: loyalitätsfördernd)
- Sonderartikel (Meister-Shirt, Pokalfinale-Kollektion: einmalig, hohe Marge)

### 2.4 Sponsoring & Partnerschaften

Sponsoring ist **ligarelativ** und **rufabhängig**[^8][^9]:

| Liga-Ebene | Typischer Trikot-Sponsor (jährlich) | Bandenwerbung | Namenssponsor Stadion |
|-----------|-----------------------------------|--------------|-----------------------|
| Unterliga / Kreisliga | 5.000 – 50.000 € | 500 – 5.000 € | — |
| Regionalliga / 3. Liga | 50.000 – 500.000 € | 5.000 – 50.000 € | 50.000 – 200.000 € |
| 2. Liga | 500.000 – 3 Mio. € | 100.000 – 500.000 € | 500.000 – 2 Mio. € |
| 1. Liga | 3 – 15 Mio. € | 500.000 – 3 Mio. € | 2 – 10 Mio. € |

**Mechanik:** Sponsoren bewerten den Verein nach: Ligastufe, Tabellenplatz, Zuschauerschnitt, Medienreichweite (Regionalität), Vereinsruf. Bei Abstieg verlieren Sponsoren automatisch Interesse → Preisnachverhandlung oder Vertragskündigung.

**Lokale Sponsoren:** Unabhängig von der Liga ansiedeln – die Metzgerei und Brauerei aus der Region sponsert auch den Drittligisten. Bringt weniger, aber ist stabiler.

### 2.5 TV- und Mediengelder

TV-Geld ist die größte Einnahmequelle auf hohen Liganiveaus, auf niedrigem Niveau (fast) nicht vorhanden[^10][^11]:

| Liga | TV-Geld-Größenordnung (pro Saison) |
|------|-----------------------------------|
| Kreisliga / Amateurliga | 0 € |
| Regionalliga | 0 – 10.000 € |
| 3. Liga (Deutschland) | 1 – 3 Mio. € |
| 2. Bundesliga | 5 – 20 Mio. € |
| 1. Bundesliga | 20 – 80 Mio. € |
| Premier League (England) | 80 – 160 Mio. £ |

**Wichtig für das Spieldesign:** TV-Geld wird nicht wöchentlich ausgezahlt, sondern **quarterly oder als Einmalzahlung zu Saisonbeginn/-mitte** → Timing ist relevant für den Cash-Flow.

**Abstieg bedeutet TV-Geld-Cliff:** Abstieg von der 1. in die 2. Liga kann den TV-Topf um 60–80% reduzieren[^11]. Mit laufenden Spielerverträgen auf Erstliga-Niveau ist das oft nicht zu stemmen → Insolvenzgefahr.

### 2.6 Pokal- und Wettbewerbseinnahmen

Pokalteilnahmen sind Bonus-Einnahmen, aber mit Kostenseite (Reise, Spielerboni)[^12][^13]:

#### Nationale Pokalwettbewerbe (z. B. DFB-Pokal)

| Runde | Preisgeld (Referenz DFB-Pokal) |
|-------|-------------------------------|
| 1. Runde | ~170.000 € |
| 2. Runde | ~297.000 € |
| Achtelfinale | ~439.000 € |
| Viertelfinale | ~1.1 Mio. € |
| Halbfinale | ~2.15 Mio. € |
| Finale (Verlierer) | ~4.3 Mio. € |
| Finale (Sieger) | ~4.8 Mio. € |

**Heimspiel-Bonus:** Heimspiele im Pokal = Zusatz-Matchday-Einnahmen (Tickets, Gastronomie).

**Reisenkosten Auswärts:** Fahrt- und Hotelkosten für Auswärtsspiele summieren sich. In niederen Ligen kann eine weite Pokalreise netto sogar negativ sein[^14].

#### Europäische Wettbewerbe (Champions League / Europa League)

| Wettbewerb | Qualifikation (Mindest) | Max. Gewinn |
|------------|------------------------|-------------|
| Conference League | ~3,17 Mio. € | ~18,4 Mio. € |
| Europa League | ~4,31 Mio. € | ~29,6 Mio. € |
| Champions League | ~18,6 Mio. € | ~150 Mio. € |

Quelle[^12][^15]: UEFA-Preisgeld 2024/25.

**Zusatzeffekt:** Champions-League-Teilnahme erhöht Sponsorenwert, Trikotverkäufe und Dauerkartenabsatz sprunghaft.

### 2.7 Transfers & Spielerhandel

Transfers sind potenzielle Großeinnahmen, aber komplex[^16]:

- **Eigengewächse verkaufen:** Hohe Marge (Ausbildungskosten vs. Marktwert). Dreh- und Angelpunkt der Nachhaltigkeit in unteren Ligen.
- **Weiterverkauf:** Gekaufte Spieler mit Wertsteigerung verkaufen.
- **Leihe eingehend:** Günstige Kaderergänzung (nur Gehalt, keine Ablöse).
- **Leihe ausgehend:** Geringe Einnahmen, dafür Gehalt teilweise abgegeben.
- **Ausbildungsentschädigungen:** Bei Weiterverkauf junger Spieler fließt ein %-Anteil zurück an Ausbildungsverein → Als Einnahme für frühere Entwicklung.

**Insolvenzfalle:** Spieler auf dem Transfermarkt kaufen auf Pump (Ratenzahlung), dann abstieg → Raten laufen weiter, Einnahmen brechen ein.

### 2.8 Sonstige Einnahmen

| Quelle | Beschreibung | Frequenz |
|--------|-------------|---------|
| **Investoren / Mäzene** | Einmalige Kapitalspritze (SP-Mechanik: IAP-Option) | Unregelmäßig |
| **Stadionvermietung** | Konzerte, Events an spielfreien Tagen | Planbar (Off-Season) |
| **Trainingslager vermieten** | Nutzung der eigenen Einrichtungen | Saison-unabhängig |
| **Akademie-Einnahmen** | Fördergelder, Kooperationen | Jährlich |
| **Lotterielose / Vereinslotterie** | Kleine Zusatzeinnahmen, fangemeinschaftlich | Wöchentlich |
| **Ligen-Solidaritätszahlungen** | Kleines TV-Geld auch für untere Ligen | Jährlich |

***

## 3. Kostenstruktur – Vollständige Übersicht

### 3.1 Lohnkosten (größter Ausgabenblock)

Löhne machen in Profi-Clubs 55–90% der Ausgaben aus[^17][^18]:

| Liga-Ebene | Spieler-Gehaltsrange | Trainerteam | Verhältnis Lohn/Einnahmen |
|-----------|---------------------|-------------|--------------------------|
| Unterliga | 0 – 500 €/Monat | Ehrenamtlich | — |
| Regionalliga | 500 – 3.000 €/Monat | 2.000 – 10.000 €/Monat | ~70–80% |
| 3. Liga | 3.000 – 20.000 €/Monat | 10.000 – 50.000 €/Monat | ~65–80% |
| 2. Liga | 10.000 – 100.000 €/Monat | 50.000 – 200.000 €/Monat | ~60–75% |
| 1. Liga | 50.000 – 500.000 €/Monat | 200.000 – 2 Mio. €/Monat | ~55–65% |

**Warngrenze:** Liegt der Lohnanteil über 80% des Umsatzes, droht strukturelle Insolvenz[^18]. Das ist der UEFA-FFP-Richtwert.

**Vertragsfallen:** Langfristige Verträge mit hohen Fixgehältern = Risiko bei Abstieg. Realistische Verträge sollten **Abstiegsklauseln** enthalten (automatische Gehaltsreduktion um 20–50% bei Abstieg)[^11].

### 3.2 Stadion & Infrastruktur

#### Laufende Stadionkosten (wöchentlich, unabhängig von Spielen)

| Kostenart | Kleines Stadion | Mittelgroß | Große Arena |
|-----------|----------------|-----------|------------|
| Energie (Flutlicht, Heizung) | 500 – 2.000 €/Wo | 2.000 – 10.000 €/Wo | 10.000 – 50.000 €/Wo |
| Platzwart / Rasenunterhalt | 500 – 2.000 €/Wo | 2.000 – 8.000 €/Wo | 8.000 – 30.000 €/Wo |
| Sicherheitsdienst (Spieltag) | 1.000 – 5.000 €/Spiel | 5.000 – 30.000 €/Spiel | 30.000 – 150.000 €/Spiel |
| Reinigung | 200 – 1.000 €/Wo | 1.000 – 5.000 €/Wo | 5.000 – 20.000 €/Wo |
| Versicherungen | 500 – 2.000 €/Mo | 2.000 – 10.000 €/Mo | 10.000 – 50.000 €/Mo |

**Energie als Krisenfaktor:** Für Amateurklubs sind Flutlichtkosten eine der größten Einzelpositionen – Beispiel: Oxford City (non-league) sah seine Jahresenergierechnung von 72.000 £ auf 120.000 £ steigen[^1].

#### Kapitalkosten (einmalig / periodisch)

| Investition | Kosten | Lebensdauer |
|-------------|--------|-------------|
| Rasen-Sanierung | 50.000 – 500.000 € | 5–10 Jahre |
| Flutlichtanlage | 40.000 – 200.000 € | 15–20 Jahre |
| Tribüne ausbauen (+500 Plätze) | 200.000 – 2 Mio. € | 30+ Jahre |
| Kabinen-Renovierung | 20.000 – 200.000 € | 10 Jahre |
| VIP-Logen-Bau | 100.000 – 1 Mio. € | 20 Jahre |
| Fanshop (Umbau) | 10.000 – 100.000 € | 10 Jahre |
| Restaurant / Kneipe | 50.000 – 500.000 € | 15 Jahre |

**Liga-Aufstiegsinvestitionspflicht:** Auf jeder Ligastufe gibt es Mindestanforderungen (Sitzplätze, Flutlichtstärke, Kabinen, Sicherheit). Aufstieg kann also eine Pflicht-Investition auslösen, für die man vorplanen muss[^1].

### 3.3 Spielbetrieb & Reisekosten

| Kostenart | Beschreibung |
|-----------|-------------|
| **Busmiete Auswärtsfahrt** | 700 – 2.000 €/Spiel (steigend mit Distanz)[^1] |
| **Hotelübernachtungen** | 80 – 200 €/Person/Nacht (bei weiten Reisen) |
| **Schiedsrichtergebühren** | Werden vom Heimverein bezahlt, feste Staffeln |
| **Sportmedizin / Physio** | 2.000 – 20.000 €/Monat (je nach Liga) |
| **Ausrüstung (Bälle, Trikots)** | 5.000 – 50.000 €/Saison |
| **Spielerlizenzgebühren** | An den Verband, pro gemeldeten Spieler |

### 3.4 Verwaltung & Betrieb

| Posten | Monatlich |
|--------|-----------|
| Büropersonal / Geschäftsführung | 3.000 – 50.000 € |
| Buchhaltung / Steuerberater | 500 – 5.000 € |
| Marketing / Social Media | 500 – 10.000 € |
| IT / Software (Spielerverwaltung) | 200 – 2.000 € |
| Bankgebühren / Zinsen (Kredite) | Variabel |

### 3.5 Akademie & Nachwuchs

| Ebene | Jahreskosten | Einnahmen-Potenzial |
|-------|-------------|---------------------|
| Mini-Jugendabteilung | 5.000 – 50.000 € | Mitgliedsbeiträge, Fördergelder |
| Echte Akademie (U8–U21) | 200.000 – 5 Mio. € | Eigengewächse verkaufen (langfristig) |
| Leistungszentrum | 1 – 10 Mio. € | Top-Talente (5–10 Jahre Horizont) |

**Roguelite-Mechanik:** In frühen Runden kann eine Akademie zunächst nur kosten. Der Return kommt erst 2–4 Saisonen später – als Eigengewächs, das man teuer verkaufen oder ins Team integrieren kann.

***

## 4. Saisonaler Cashflow-Verlauf

### 4.1 Typisches Kalenderjahr (Europäische Saison)

```
JULI / AUGUST
  ↓ Dauerkartenverkauf startet → größter Cash-Eingang des Jahres (pre-season)
  ↓ Transferfenster: Spielerkäufe (Ausgaben) + ggf. Verkäufe (Einnahmen)
  ↓ Saisonvorbereitung: Kosten für Trainingslager, Testspiele
  ↓ Erste Liga-Spieltage: Matchday-Einnahmen starten

SEPTEMBER – NOVEMBER (Hauptsaison I)
  ↓ Regelmäßige Matchday-Einnahmen (ca. 2 Heimspiele/Monat)
  ↓ DFB-Pokal Runde 1 + 2: Bonus-Einnahmen
  ↓ Länderspiel-Pause (Oktober): 2 Wochen ohne Heimspiel → Fixkosten laufen
  ↓ Merchandise-Spitze: Weihnachten nähert sich → Trikotverkäufe steigen

DEZEMBER
  ↓ Weihnachtsgeschäft: Höchster Merchandise-Monat
  ↓ Letzter Spieltag vor Winterpause → danach 4–6 Wochen KEINE Heimspiele
  ↓ Löhne laufen weiter → kritischer Cash-Tiefpunkt naht

JANUAR (Winterpause)
  ↓ ⚠️ GEFÄHRLICHSTE WOCHEN für Insolvenz: Keine Heimspiele, hohe Fixkosten
  ↓ Transferfenster II: Käufe + Verkäufe möglich
  ↓ TV-Geld Zwischenzahlung (je nach Liga) stabilisiert Cash-Flow

FEBRUAR – APRIL (Hauptsaison II)
  ↓ Rückrunde startet: Matchday-Einnahmen wieder regelmäßig
  ↓ Pokal-Runden: Bonus-Einnahmen bei weiterem Durchkommen
  ↓ Entscheidende Spiele: Faninteresse und Auslastung steigen
  ↓ Tabelle spitzt sich zu → Abstiegs-/Aufstiegsspannung beeinflusst Ticketing

MAI / JUNI (Saisonende)
  ↓ TV-Geld Hauptzahlung
  ↓ Meisterprämie / Aufstiegsprämie (falls zutreffend)
  ↓ Ablöse-Zahlungen: Transferraten fällig
  ↓ Off-Season: Minimale Einnahmen (Stadionvermietung, Sommercamps)
  ↓ Planung nächste Saison: Verträge verhandeln, Kader planen
```

### 4.2 Cash-Flow-Profil eines typischen Klubs (schematisch)

| Monat | Einnahmen (Index) | Ausgaben (Index) | Net |
|-------|-------------------|------------------|-----|
| Juli | +++++ (Dauerkarte) | ++ (Transfer) | Positiv |
| August | ++ (Spieltage) | ++ | Leicht positiv |
| September | ++ | ++ | Neutral |
| Oktober | + (Länderspielpause) | ++ | Negativ |
| November | +++ (Pokal) | ++ | Positiv |
| Dezember | +++ (Merch + letzter ST) | ++ | Positiv |
| Januar | 0 (Winterpause) | ++ | ⚠️ Kritisch negativ |
| Februar | ++ | ++ | Neutral |
| März | ++ | ++ | Neutral |
| April | +++ (Entscheidungsspiele) | ++ | Positiv |
| Mai | +++ (TV-Geld) | + | Sehr positiv |
| Juni | + (Off-Season) | + | Neutral |

***

## 5. Auf- und Abstieg: Finanzielle Schockwellen

### 5.1 Abstieg – Der größte Einzelschock

Abstieg bedeutet einen sofortigen **Revenue-Cliff**[^11][^19]:

| Faktor | Auswirkung |
|--------|-----------|
| TV-Geld | Einbruch um 60–80% (z. B. Bundesliga → 2. Liga) |
| Sponsoren | Verlust nationaler Deals; nur regionale überleben |
| Zuschaueranzahl | −20–40% (weniger Interesse an 2. Liga) |
| Spielergehälter | Bleiben oft unvermindert (Vertragsbindung) |
| Trikotverkauf | −30–50% |

**Abstiegsklausel-Mechanik im Spiel:** Spielerverträge können mit Abstiegsklauseln ausgestattet werden. Ohne Klausel → Gehalt bleibt voll. Mit Klausel → automatisch −30%, aber Spieler könnte Wechsel erzwingen. Das ist eine echte Entscheidung für den Spieler.

**Parachute Payments (Fallschirmzahlungen):** Reale Ligen zahlen Absteigern mehrere Jahre lang Teile des alten TV-Geldes[^20][^21]:
- England, Jahr 1: ~55% des Premier-League-Gleichanteils (~40 Mio. £)
- England, Jahr 2: ~45% (~35 Mio. £)
- England, Jahr 3: ~20% (~15 Mio. £)

**Game-Empfehlung:** Parachute Payments als optionale Liga-Einstellung (realistisches vs. vereinfachtes Modell). Sie verhindern sofortigen Bankrott nach Abstieg, dafür kann der Spieler den Wiederaufstieg planen.

**Jo-Jo-Effekt:** Parachute-begünstigte Absteiger dominieren die 2. Liga und steigen häufig direkt wieder auf. Im Spiel simulierbar: Absteiger mit Parachute sind stärkere Konkurrenten in der neuen Liga.

### 5.2 Aufstieg – Euphorie mit Finanzierungsrisiko

Aufstieg bedeutet mehr Einnahmen, aber auch sofort höhere Anforderungen[^1][^11]:

| Faktor | Auswirkung |
|--------|-----------|
| TV-Geld | +200–500% sofort |
| Ligainfrastruktur-Pflichten | Zwangsinvestitionen (Sitzplätze, Kabinen) – kann 100.000 – 2 Mio. € kosten |
| Kaderkosten | Bessere Spieler nötig → Gehälter steigen |
| Zuschauerzahlen | +20–60% erwartet |
| Sponsoren | Upgrade auf nationalen Maßstab möglich |

**Gambling for Promotion:** Das gefährlichste Muster – auf Aufstieg investieren, ihn verpassen, aber mit den Kosten dastehen[^11]. Das ist exakt die Roguelite-Insolvenzfalle: Spieler erhöht Lohnniveau für Aufstiegsbudget, verpasst Aufstieg, kann nicht mehr zahlen.

### 5.3 Finanzielle Auswirkungsmatrix

| Ereignis | TV-Geld | Sponsoring | Matchday | Spielerwert | Lohnkosten |
|---------|---------|------------|---------|-------------|------------|
| Meistertitel | ++ | +++ | +++ | ++ | Neutral |
| Aufstieg | +++ | ++ | ++ | ++ | +++ (Pflicht) |
| Abstieg | −−− | −− | −− | −− | Bleibt oft hoch |
| Pokalfinale | + | + | +++ (Heimspiele) | + | Bonus-pflichtig |
| CL-Qualifikation | +++ | ++++ | ++++ | ++++ | ++ (Kader-Upgrade) |
| Starspielerverlust | Neutral | − | − | −−− | +? (Gehalt frei) |

***

## 6. Fanszene & Fanbase-System

### 6.1 Fanbase als zentraler Multiplikator

Die Fanszene ist kein Selbstläufer – sie wird **aktiv auf- oder abgebaut**[^2]:

| Fan-Kennzahl | Einfluss auf |
|-------------|-------------|
| **Fanbase-Größe** | Dauerkartenpotenzial, Trikotverkäufe, Merchandise |
| **Fan-Loyalität** | Auslastung auch bei schlechten Ergebnissen, Dauerkartenverlängerung |
| **Fan-Stimmung** | Heimvorteil auf dem Platz, Medienaufmerksamkeit |
| **Fanclub-Dichte** | Auswärtsfan-Einnahmen, überregionale Bekanntheit |

#### Fanbase-Wachstumsfaktoren

- Sportlicher Erfolg (stärkster Treiber)
- Investition in Fan-Infrastruktur (Fanzone, Bierpreise, Events)
- Starspielerverpflichtung (lokaler Held oder nationaler Star)
- Lokalness (Heimverbundenheit, Community-Events)
- Soziale Medien / Medienarbeit (im Spiel als Upgrade baubar)

#### Fanbase-Erosionsfaktoren

- Sportliche Talfahrt (mehrere Niederlagen in Folge)
- Hohe Ticketpreise ohne entsprechende Leistung
- Stadion-Qualitätsmangel (kein Dach bei Regen, kaputte Klos)
- Abstieg in untere Ligen
- Skandale (Korruption, Spielermanipulation)

### 6.2 Fanszene-Mechaniken im Spiel

**Fanclub-Gründung**: Ab einer bestimmten Fan-Loyalitätsschwelle entstehen organisierte Fanclubs → die bringen regelmäßige Auswärtsfans und Merchandiseabonnenten.

**Ultra-Kurve**: Stimmungsbooster auf dem Platz, aber risikoreicher. Bei Spielergebnis-Frust können sie negativ umschlagen → Fanprotest → reduzierte Zuschauer.

**Familien-Fanbereich / Logen**: Stabileres Segment, weniger emotional, höherer Ticketpreis, weniger Atmosphäre.

**Loyalitätsmodell:**
```
Loyalität steigt: Siegesserie, günstige Tickets, Fan-Events, Starspielerverpflichtung
Loyalität sinkt: Niederlageserie, Preiserhöhungen, Skandale, Abstieg
```

Loyalität hat einen **Trägheitseffekt**: Ein Traditionsclub hält seine Fans auch in schwierigen Zeiten länger als ein Neugründung.

***

## 7. Infrastruktur-Entwicklungsbaum

### 7.1 Stadion-Stufen

Das Stadion entwickelt sich in Stufen – jede Stufe schaltet neue Einnahmequellen frei:

| Stufe | Kapazität | Kosten | Neue Features |
|-------|-----------|--------|--------------|
| 0 – Bolzplatz | 0 Zuschauer | – | Nur Training |
| 1 – Dorfplatz | 200–500 | 10.000 – 50.000 € | Stehplätze, Einnahmen möglich |
| 2 – Sportanlage | 500–2.000 | 50.000 – 300.000 € | Kiosk (1 Slot), Umkleidekabine |
| 3 – Kleinstadion | 2.000–5.000 | 300.000 – 1 Mio. € | Sitzplatztribüne, Fan-Shop (1) |
| 4 – Regionalstadion | 5.000–15.000 | 1 – 5 Mio. € | VIP-Bereich, Restaurant, Parkplätze |
| 5 – Profistadion | 15.000–40.000 | 5 – 30 Mio. € | Logen, Naming Rights, Event-Halle |
| 6 – Arena | 40.000+ | 50 – 300 Mio. € | Kompletter Infrastruktur-Hub |

### 7.2 Umfeld-Infrastruktur (das "Nahbereich"-System)

Inspiriert von klassischen Manager-Spielen (z.B. Anstoss):

| Gebäude | Baukosten | Wochenkosten | Einnahmen | Effekt |
|---------|-----------|--------------|----------|--------|
| **Vereinsgaststätte** | 30.000 – 200.000 € | 500 – 2.000 €/Wo | täglich (auch ohne Spiel) | Fanloyalität + |
| **Fanshop (extern)** | 20.000 – 100.000 € | 300 – 1.500 €/Wo | täglich | Merchandise ganzjährig |
| **Trainingszentrum** | 100.000 – 5 Mio. € | 2.000 – 20.000 €/Wo | Indirekt (Spielerentwicklung) | Spieler-Wertsteigerung |
| **Jugendakademie** | 50.000 – 2 Mio. € | 1.000 – 10.000 €/Wo | Spielerverkäufe (verzögert) | Eigengewächse |
| **Medizin-Zentrum** | 50.000 – 1 Mio. € | 1.000 – 5.000 €/Wo | Verletzungsreduktion | Kaderavailability + |
| **Medien-/Pressezentrum** | 20.000 – 200.000 € | 500 – 3.000 €/Wo | Sponsorenwert + | Reichweite + |
| **Parkhaus** | 200.000 – 2 Mio. € | 1.000 – 5.000 €/Wo | 3–8 €/Auto pro Heimspiel | Zuschauerzufriedenheit + |
| **Kinderbetreuung (Spieltag)** | 10.000 – 50.000 € | 200 – 1.000 €/Spiel | Familien-Fanbase + | Loyalität + |

### 7.3 Off-Season-Nutzung

Nicht-Spieltag-Einnahmen aus Stadion und Infrastruktur:

- **Stadionführungen**: 5–20 €/Person, je nach Vereinsgröße
- **Konzerte/Events**: 20.000 – 500.000 € pro Event (nur größere Stadien)
- **Hallenvermietung/Konferenzen**: 1.000 – 20.000 € pro Tag
- **Fußball-Sommercamps**: 200 – 500 €/Kind/Woche
- **Fitnesspark / Vereinsgelände**: Dauervermietung, kleiner Betrag

***

## 8. Wirtschaftliche Kennzahlen & Insolvenz-Mechanik

### 8.1 Gesundheitsindikatoren im Spiel

| Kennzahl | Warnschwelle | Kritisch |
|----------|-------------|---------|
| **Lohnquote** (Löhne / Einnahmen) | > 75% | > 90% |
| **Cash-Puffer** (Wochen ohne Einnahmen überlebbar) | < 4 Wochen | < 1 Woche |
| **Schuldenquote** (Schulden / Jahreseinnahmen) | > 100% | > 200% |
| **Transferbilanz** (Ausgaben / Einnahmen) | > 150% | > 300% |

### 8.2 Insolvenz-Kaskade (Game-Over-Kette)

```
Schritt 1: Kassenstand fällt unter 0
         → Überziehungskredit möglich (teuer, kurze Frist)

Schritt 2: Kredit nicht bedienbar
         → Spieler klagen auf Gehaltszahlung → Punktabzug
         → Sponsoren kündigen Verträge

Schritt 3: Verband entzieht Lizenz
         → Zwangsabstieg oder Ausschluss aus Liga
         → GAME OVER (oder Investor-Option = IAP)
```

### 8.3 Investor als SP-Monetarisierungsmoment

Im Singleplayer kann bei drohendem Bankrott ein **Investor einspringen** – das ist der einzige Echtgeld-Moment im Roguelite. Mechanisch:

- Investor zahlt Schulden + gibt Cash-Puffer
- Im Gegenzug: hohe monatliche Dividende (Kostendruck steigt)
- Oder: Investor übernimmt Mehrheit → Kontrollverlust (Story-Event)
- **Balancing:** Der Investor rettet nicht gratis – er macht das Spiel schwieriger in der Folge

***

## 9. Balancing-Empfehlungen & Designrisiken

### 9.1 Bevorzugter Ansatz: Ligastufen-Skalierung

Alle Zahlen skalieren **multiplikativ** mit der aktuellen Ligastufe (Liga-Tier 1–8, wobei Tier 1 = Kreisliga, Tier 8 = Champions-League-Ebene):

```
Einnahme_real = Einnahme_Basis × Ligafaktor(tier) × Vereinsruf × Fanbase
Kosten_real   = Kosten_Basis   × Ligafaktor(tier) × Inflation(saison)
```

So bleibt jede Liga für sich herausfordernd, ohne dass feste Zahlen hart-gecoded werden müssen.

### 9.2 Designrisiken

| Risiko | Beschreibung | Gegenmaßnahme |
|--------|-------------|--------------|
| **Cash-Flow zu intransparent** | Spieler versteht nicht, warum er pleitegeht | Wöchentliche Übersicht, Warnindikatoren |
| **Zu viele Kostenarten** | Überforderung in der Startphase | Stufenweise Einführung (Onboarding: erst 3 Kostenkategorien) |
| **Stareffekt zu mächtig** | Spieler baut alles auf einen Spieler → 1 Verkauf = sofort Game Over | Graduelle Abhängigkeit, Warnung bei hoher Konzentrierung |
| **Parachute-Payment-Exploit** | Spieler steigt absichtlich ab für Parachute | Zeitliche Begrenzung, Fanbase-Schaden bei Abstieg |
| **Zu flacher Curve** | Aufstieg bringt immer Gewinn → kein Risiko | Pflichtinvestitionen bei Aufstieg + Gehaltsdruck realistisch halten |

### 9.3 Anti-P2W-Check

- ✅ **Investor (IAP)** ist **nur SP-Modus** – kein MP-Impact
- ✅ Investor macht Spiel schwieriger, nicht einfacher (keine Pay-to-Win-Wirkung)
- ✅ Alle Infrastruktur-Upgrades sind durch Gameplay erreichbar
- ✅ Kein "Superstar kaufen" per IAP – Transfers nur über Spielcurrency

***

## 10. Zusammenfassung: Wirtschaftsmodell-Blueprint

### Einnahmen-Hierarchie (nach Wichtigkeit, Ligastufe Tier 1–3)

1. Ticketverkauf (Matchday + Dauerkarte)
2. Gastronomie / Infrastruktur-Eigenleistung
3. Sponsoring (lokale Partner)
4. Merchandise / Trikotverkauf
5. Transfererlöse (Eigengewächse)
6. Pokalprämien
7. TV-Geld (erst ab Tier 4+ relevant)

### Einnahmen-Hierarchie (Tier 6–8: Profibereich)

1. TV-/Mediengelder (dominant)
2. Commercials / Sponsoring (global)
3. Champions League / Europacup-Prämien
4. Matchday (rel. kleiner Anteil)
5. Transfers (strategisch)
6. Merchandise

### Kostenhierarchie (alle Stufen)

1. Spieler- und Trainerlöhne (immer dominant, 55–90%)
2. Stadion-Betrieb (Energie, Rasen, Sicherheit)
3. Transfer-Abschreibungen / Ratenzahlungen
4. Verwaltung, Medizin, Ausrüstung
5. Akademie / Jugend (investiv)
6. Reisekosten (steigen mit Liga)

---

## References

1. [The Hidden Costs Of Running A Non-League Football Club In 2026](https://fcbusiness.co.uk/news/the-hidden-costs-of-running-a-non-league-football-club-in-2026/) - People see the gate receipts and the shirt sponsorship banner․ What they never see is the invoices, ...

2. [Stadium Business - Strategies to optimize matchday revenues - SFS](https://www.socialfootballsummit.com/en/stadium-business-strategies-to-optimize-matchday-revenues/) - In this article, we explore some of the strategies football clubs are implementing to maximize their...

3. [The Hidden Cost of Season Tickets - WHU](https://www.whu.edu/en/news-insights/whu-knowledge/article/the-hidden-cost-of-season-tickets/) - Season tickets provide secure revenues for clubs. But they come at a price that could undermine the ...

4. [Non-League Clubs Face Financial Strain from Weather-Related ...](https://www.linkedin.com/posts/jamie-smith-37b271244_nonleague-postponed-waterlooged-activity-7425930870613696512-WWdN) - Annual lump-sum fees feel tidy on paper, but they create friction: people disengage in the off-seaso...

5. [Bundesliga-Catering: Wer verdient was? - SPOBIS](https://spobis.com/article/bundesliga-catering-wer-verdient-was) - Auf Club-Seite stehen Einnahmen aus vier unterschiedlichen Quellen: von Bierpartnern, Softgetränkehe...

6. [How much money do football clubs make from shirt sales? - Goal.com](https://www.goal.com/en/news/how-much-money-do-football-clubs-make-from-shirt-sales/gv14e9wc0vny1vtyr0rxqqan5) - The money football clubs make from shirt sales varies from club to club based on factors such as how...

7. [Check out the top 10 clubs earning the most from shirt sales in Europe](https://sports.yahoo.com/articles/check-top-10-clubs-earning-122400853.html) - Below, check out the top 10 clubs that earned the most from shirts and merchandising*. Barcelona - 2...

8. [Football Sponsorship: Industrial Category Overview - SBI Barcelona](https://www.sbibarcelona.com/sponsorship/football-sponsorship-industrial-category-overview/) - Commercial revenue, a large part of which is through sponsorships, aggregate approximately €8.9bn in...

9. [New sponsorship deals in Europe's top football leagues exceed $1bn](https://www.ampereanalysis.com/insight/new-sponsorship-deals-in-europes-top-football-leagues-exceed-1bn) - Combined spending on new sponsorship deals and renewals across the Premier League, LaLiga, Serie A, ...

10. [Revenue Sources for Football Clubs - The Economics of Sportwww.sportseconomics.org › revenue-sou...](http://www.sportseconomics.org/sports-economics/revenue-sources-for-football-clubs) - By John Considine

11. [Infothema Auf- und Abstieg: Das finanzielle Risiko im Profifußball](https://www.speed-magazin.de/news/infothema-auf--und-abstieg-das-finanzielle-risiko-im-profifu%C3%9Fball_91937.html) - Eine Analyse der wirtschaftlichen Folgen von Relegation zeigt eindeutig auf, warum der Abstieg eines...

12. [Champions League vs Europa League vs Conference League: total earning compared](https://tribuna.com/en/blogs/champions-league-vs-europa-league-vs-conference-league-total/) - The financial rewards across UEFA's three European competitions differ dramatically, with the Champi...

13. [Europa League prize money: What is winning UEFA title worth ...](https://www.sportingnews.com/in/football/news/europa-league-prize-money-uefa-title-worth-champions-league/88e65d400a7a1c34d3213816) - Along with a direct financial windfall of €565 million earmarked for Europa League clubs, the Europa...

14. [How well do lower league teams do financially in the UK? - Reddit](https://www.reddit.com/r/football/comments/11efve9/how_well_do_lower_league_teams_do_financially_in/) - Clubs spend years in the League One/Two and in Non League absolutely fine by being well run clubs an...

15. [Champions League Prize Money 2025/26: How Clubs Reach ...](https://www.footballtransfers.com/en/football-finance/uefa-prize-money/2026/04/champions-league-prize-money-2025-26) - Discover how Champions League clubs earn from equal shares, performance and value pillars in 2025/26...

16. [The Premier League is making more money than ever from player ...](https://www.transfermarkt.com/new-record-this-season-the-premier-league-is-making-more-money-than-ever-from-player-sales/view/news/458193) - From a low of just €454m in player sales throughout the 2020/21 season, income earned across the top...

17. [Chart: The Uneven Premier League Wage Burden - Statista](https://www.statista.com/chart/22002/premier-league-wage-burden/) - Premier League revenue machines Manchester United and Manchester City had wage costs equal to 65 and...

18. [Premier League PSR: Clubs total of £1bn of losses in 11 charts - BBC](https://www.bbc.co.uk/sport/football/68713522) - Maguire says wages and transfer fees absorb about 90% of total Premier League revenue across all 20 ...

19. [[PDF] Consequences of Promotion and Relegation in Smaller European ...](https://www.diva-portal.org/smash/get/diva2:1971739/FULLTEXT01.pdf) - Regarding the financial consequences, relegated teams experienced hefty revenue losses, averaging ar...

20. [Premier League Fallschirm- und Solidaritätszahlungen](https://deutsch.wikibrief.org/wiki/Premier_League_parachute_and_solidarity_payments) - Die Premier League zahlt jede Saison eine formelhaft abgeleitete finanzielle Zahlung an jeden Club d...

21. [What are Premier League parachute payments & how much do ...](https://www.goal.com/en/news/what-premier-league-parachute-payments-how-much-teams-get/ndpbojgz6szj1ojgn3p7jlbuo) - Things can quickly spiral out of control for relegated clubs, but the Premier League now gives them ...
## Related

- [[../incoming-design-research-2026-05-27]]
- [[../systems-design-synthesis]]
- [[../../50-Game-Design/economy-system]]
- [[../../50-Game-Design/GD-0008-finance-economy]]
