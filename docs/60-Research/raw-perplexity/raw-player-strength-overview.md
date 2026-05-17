---
title: Raw Player Strength Overview Research
status: raw
tags: [research, raw, perplexity, player-strength, squad-ui]
created: 2026-05-17
updated: 2026-05-17
type: research
binding: false
related: [[README]], [[../player-strength-presentation]], [[../../50-Game-Design/progressive-disclosure-ui]], [[../../50-Game-Design/tactics-system]]
source_path: "C:\\Users\\nico.rimmele\\Downloads\\Bitte rechachiere was ist die Beste Methode Spiele.md"
---

# Raw Player Strength Overview Research

This note preserves the attached Perplexity research input that triggered the
Impact Lens documentation pass. It is **not authoritative**. Use
[[../player-strength-presentation]] and the promoted game-design /
architecture notes for implementation guidance.

## Source Prompt

> Bitte recherchiere: Was ist die beste Methode, Spieler und ihre Stärke auf
> der Übersicht darzustellen? Wie machen das andere Manager und was wäre für
> uns die beste Methode und ein Alleinstellungsmerkmal?

## Raw Answer: Initial Recommendation

Für die Kader-Übersicht ist eine kombinierte Anzeige aus Rollen-Score,
Kategorien-Stärken (z.B. "Defensiv", "Kreativ", "Physisch") und Drill-down
auf Attribute am stärksten. Das Alleinstellungsmerkmal kann eine rollen- und
taktikadaptive, farbkodierte "Impact-Ansicht" sein, statt einer simplen
Gesamtzahl wie 83 OVR.

### Wie machen es andere Manager?

- Football Manager zeigt primär Einzelattribute (1-20) und überlässt es dem
  Spieler, sich eigene Squad-Views mit Attributspalten zu bauen. Rollen heben
  relevante Attribute nur auf Detailseiten hervor.
- Es gibt zwar CA/PA und teils versteckte Attribute, diese werden im
  Standard-UI aber nicht als klarer "Stärkewert" im Kader dargestellt, sondern
  eher über Sterne, Reports und Filter. Viele Spieler installieren deshalb
  Custom Views, um schnell vergleichbare Spalten zu bekommen.
- Mobile-Manager und FIFA/EA FC nutzen oft einen einheitlichen Overall-Wert
  (0-100 oder Sterne) plus ein paar Icons. Das ist schnell verständlich,
  verdeckt aber Tiefe und kann für Detailmanager frustrierend sein.

### Ableitbare Best Practices

- Ein "Flat Overall" ist gut für schnelle Orientierung, aber nicht ausreichend
  für taktische Entscheidungen.
- Kategorien wie Speed / Shooting / Passing / Dribbling / Defense / Physical
  mit je einem Score verbessern Vergleichbarkeit und UI-Lesbarkeit deutlich.
- Rollen- und positionsbezogene Highlighting-Logik wird von FM-Spielern
  genutzt, ist aber bisher nicht in einer kompakten Kader-Übersicht
  konsequent umgesetzt.

## Vorschlag für unser Basismodell in der Übersicht

Ziel: Auf einem Screen musst du sehen, wer für **deine** aktuelle Taktik und
Rolle wirklich stark ist, ohne jedes Profil öffnen zu müssen. Das passt zum
realistischen, aber zugänglichen Design und zur Tiered World Simulation.

### Ebene 1: Rollen-Impact-Score

- Berechnung z.B. 0-100 anhand relevanter Attribute für die aktuell gewählte
  Rolle, z.B. Ballspielender IV, Box-to-Box oder Flügelstürmer.
- Gewichtung kann nach Spielstil variieren, z.B. Gegenpressing oder Tiki-Taka.
- Anzeige in der Kaderliste als farbiger Balken + Zahl, z.B. "BPD: 82" oder
  "IV klassisch: 76".
- Wenn der Spielstil in der Taktik wechselt, aktualisiert sich der Impact-Score
  live. Das erzeugt spürbare Tiefe und passt zu Domain-/Read-Model-Ansätzen.

### Ebene 2: Kategorie-Stärken

- Nutzung bestehender Attribut-Cluster wie Technik, Athletik, Mental,
  Charakter und Torwart.
- Anzeige als Mini-Radar oder horizontale Mikro-Balken, damit Spielertypen
  sofort erkennbar sind: athletisch stark, technisch schwach; technisch stark,
  wenig physisch.

### Ebene 3: Form, Moral, Fitness

- 3-4 kleine konsistente Indikatoren: Fitness, Formtrend, Moral,
  Match-Sharpness.
- Diese Werte sind wichtig für das Aufstellungsgefühl und können im Async-MP
  serverautoritativ, im Singleplayer lokal berechnet werden.

## Konkretes UI-Pattern für die Kaderliste

Eine sinnvolle Zeile könnte so aussehen:

- Name | Position | Rolle
- Rollen-Impact-Score als Balken + Zahl
- Drei Kategorie-Scores als Mini-Balken
- Fitness, Form, Moral
- Alter, Vertrag, Potenzial-Indikator ohne exakte Zahl im Realismus-Modus

Damit lassen sich sortieren und filtern:

- Impact im aktuellen System
- Kategorie, z.B. physisch stärkste IVs
- Kombination aus Impact und Potenzial

Das wäre mächtiger als FM-Standard-Views, aber schnell lesbar, gerade auf
Mobile/PWA mit begrenzter Breite.

## Vorgeschlagenes Alleinstellungsmerkmal

### Taktikadaptiver Impact statt statischem Overall

Jeder Spieler hat keinen einen Gesamtwert, sondern mehrere Impact-Scores je
Rolle/Spielstil. Im UI sieht man immer den Score für die Rolle, in der man ihn
aktuell plant.

### Simulations-Transparenz-Layer

Ein optionales Overlay erklärt, warum der Impact so ist:

- + Tempo
- + Tackling
- - Antizipation

Das soll Entscheidungen nachvollziehbar machen, ohne Hidden Attributes zu
cheaten.

### Modusabhängige Darstellungsmodi

- Singleplayer-Roguelite: Mehr Informationen freischaltbar, z.B. genauere
  Potenzial-Range oder Experten-Scouting-Layer.
- Async-Multiplayer: Gleiche Kernoberfläche, aber Potenzial und bestimmte
  Charakterwerte nur als qualitative Labels, um Pay-to-Win-Gefahr und
  Informationsvorsprung zu vermeiden.

### Vergleichsmatrix aus dem Input

| Aspekt | Football Manager Standard | Mobile Manager / EA | Vorgeschlagenes Modell |
|---|---|---|---|
| Gesamtwert in Übersicht | Sterne, vage; Fokus Attributliste | Feste OVR-Zahl schnell, aber flach | Rollen- und taktikabhängiger Impact-Score |
| Kategorien-Stärken | Implizit, kein klarer Score | Teilweise Pace / Shooting etc. | 3-4 klare Kategorien mit Balken |
| Rollenbezug | Über Filter / Custom Views | Meist Position | Rolle als zentrales Feld |
| Form / Moral | Ja, aber verteilt | Oft Match-Rating-Trend | Kompakte Status-Icons |
| Spielstil-Anpassung | Teilweise Taktik-Screens | Gering | Live-Anpassung der Impact-Scores |
| USP-Potenzial | Etabliert, listenlastig | Casual, wenig Tiefe | "Smart Manager Lens" |

## Empfehlung aus dem Input

- Kein einzelnes OVR nutzen, sondern Rollen-Impact + Kategorie-Scores + klare
  Status-Icons als Standard-Kaderansicht.
- Impact-Scores als reine Read-Model-Projektion implementieren, die
  Attributlogik nutzt, aber nicht die Simulation verkompliziert.
- Feature als "Taktik-Lupen-Ansicht" positionieren: Ein Klick auf die
  Formation zeigt die besten Spieler für jede Rolle im System.

## Follow-up Prompt

> Okay recherchiere das vollständig und bereite das Ganze so auf, dass es eine
> vollständige, umsetzbare Definition ergibt.

## Raw Answer: Implementation Definition

### 1. Ziele und Prinzipien

Ziel der Kader-Übersicht:

- Auf einen Blick erkennen, welche Spieler für die aktuelle Taktik und Rolle
  am stärksten sind.
- Sowohl Manager-Nerds als auch Casuals bedienen.

Design-Prinzipien:

- Klarheit vor Vollständigkeit.
- Taktik- und rollenadaptiv.
- Konsistente Kategorien.

### 2. Fachliches Modell

Der Input nahm ein Attributsystem mit Technik, Athletik, Mental, Charakter und
Torwart an und leitete daraus ab:

1. Rollen-Impact-Score 0-100: "Wie gut ist dieser Spieler als X in diesem
   Spielstil?"
2. Kategorie-Scores 0-100: TechnikScore, AthletikScore, MentalScore,
   TorwartScore.
3. Status-Indikatoren: Fitness, Form, Moral, Match-Sharpness.
4. Entwicklung / Potenzial: CA grob als Stufe, PA als Range oder qualitative
   Beschreibung.

### 3. Berechnungslogik

Der Input schlug für 1-20 Attribute vor:

```ts
function normalize20To100(value: number): number {
  return ((value - 1) / 19) * 100
}

function categoryScore(attrs: Record<string, number>, keys: string[]): number {
  const vals = keys.map((key) => normalize20To100(attrs[key]))
  const avg = vals.reduce((sum, value) => sum + value, 0) / vals.length
  return Math.round(avg)
}
```

Für Rollen:

```ts
type RoleWeights = Record<string, number>

function roleImpactScore(
  attrs: Record<string, number>,
  weights: RoleWeights,
): number {
  let sum = 0
  let totalWeight = 0

  for (const [attr, weight] of Object.entries(weights)) {
    sum += normalize20To100(attrs[attr]) * weight
    totalWeight += weight
  }

  const base = sum / (totalWeight || 1)
  return Math.round(base)
}
```

Taktik / Spielstil kann zusätzliche Modifier liefern, z.B. Gegenpressing
erhöht Gewicht auf Ausdauer, Aggressivität oder Tempo.

### 4. UI-Definition

Mobile-first Spielerzeile:

1. Identität: Kürzel / Nummer + Name, Positionen.
2. Rolle + Impact: aktuelle Rolle als Badge, Rollen-Impact als Zahl + Balken.
3. Kategorien + Status: drei Mini-Balken und Fitness / Form / Moral.
4. Optionale zweite Zeile: Alter, Vertrag, PA-Icon.

Sortierung:

- primär nach Rollen-Impact für die Rolle im Taktik-Screen,
- sekundär nach Position / Seite.

Drill-down:

- Tap auf Rollen-Impact erklärt die wichtigsten Treiber.
- Long-press / Hover auf Kategorie-Balken zeigt Einzelfaktoren.
- Swipe für Schnellaktionen.

### 5. Varianten nach Modus

Singleplayer-Roguelite:

- PA als Range oder geschätzter Wert sichtbar, wenn ausreichend gescoutet.
- Impact kann Top-3 relevante Attribute anzeigen.
- Änderungen nach Training / Spielen können als kleine Deltas erscheinen.

Async-Multiplayer:

- Rollen-Impact, Kategorie-Scores und CA-Stufe für alle Manager verfügbar.
- PA / Potenzial nur vage Labels abhängig vom Scouting-Level.
- Keine Stärkeboni oder Zusatzattribute hinter Paywalls.

### 6. Technischer Blueprint

Der Input schlug einen Squad-Read-Model-Service vor, der eine
`SquadOverviewProjection` erzeugt:

```ts
type SquadOverviewPlayer = {
  playerId: string
  name: string
  number: number
  positions: string[]
  currentRoleId: string
  roleImpactScore: number
  techniqueScore: number
  athleticScore: number
  mentalScore: number
  keeperScore?: number
  fitnessPercent: number
  formScore: number
  moraleLevel: number
  caTier: number
  potentialLabel: 'unknown' | 'depth' | 'talent' | 'top_talent' | 'late_bloomer'
  age: number
  contractUntil: string
}
```

Berechnungspipeline:

1. Inputs aus BaseAttributes, Rollen-Definition, Status, Training und Match
   sammeln.
2. Projektion aus Kategorie-Scores, Rollen-Impact und CA/PA-Mapping bauen.
3. In SurrealDB oder separatem Read-Store persistieren.
4. Über TanStack Start Loader / Queries ausliefern, optional mit Live Query.

### 7. UX-Details

- Rollen-Impact: Rot / Gelb / Grün.
- Kategorien: separate Farben, kurze Labels.
- Ungescoutete Spieler: Fragezeichen oder graue Farbe.
- Erster Besuch erklärt Impact: "Impact zeigt, wie gut ein Spieler für seine
  Rolle in deiner aktuellen Taktik geeignet ist."

### 8. Definition of Done aus dem Input

Ein Kader-Übersichts-Feature gilt als fertig, wenn:

- Jede Spielerzeile Name, Nummer, Positionen, Rolle, Rollen-Impact,
  Kategorien, Fitness, Form, Moral, Alter, Vertragsende zeigt.
- Rollen-Impact und Kategorien deterministisch aus Attributsystem und Taktik
  berechnet werden.
- Sortierung nach Rollen-Impact und Filter nach Rolle / Kategorie / Status
  möglich sind.
- Singleplayer PA informativer, Multiplayer nur qualitative Labels zeigt.
- UI mobil gut nutzbar ist und Desktop erweitert werden kann.
- Das SquadOverview-Read-Model als Projection-Typ umgesetzt ist und nicht in
  die Kern-Domänenlogik eingebrannt wird.

## Input Citations

The original source referenced these public or project-local inputs:

- Football-Manager-Game-Vollstandige-Feature-Recherche-Konzeptbibliothek.md
- ich-mochte-eine-Art-Fussballmanager-als-app-_Entwi.md
- Reddit / community posts about custom squad views and player data systems
- Public football-manager and sports-stat UI examples
- EA / mobile-manager style attribute summaries

These citations were not enough by themselves to become binding design. The
challenged and corrected synthesis is in [[../player-strength-presentation]].
