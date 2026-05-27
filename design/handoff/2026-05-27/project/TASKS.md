# Football Manager — Aurelia Premier · TASKS

> Stand: 16. Mai 2026. Quelle der Wahrheit für die Tiefen-Ausbauarbeit nach
> dem Audit. Sortiert nach **Wirkung × 1/Aufwand**, nicht nach Reihenfolge der
> Idee. Jeder Block hat einen `id`, der in Branches/PRs/Tickets eintauchen kann.

## Legende
- **🔥 Tier 1** — *„Anstoss-Geschmack pro Pixel"* — sollten als nächstes kommen.
- **🟡 Tier 2** — gute Mehrwert-Module, aber teurer oder weniger sichtbar.
- **🔵 Tier 3** — Polish / post-MVP.
- **Effort:** `S` ≤ 1 Tag · `M` 2-3 Tage · `L` ≥ 1 Woche.
- **Depends:** vorausgesetzter anderer Task oder Komponente.

---

## Tier 1 — Choreografie & Verhandlung

### 🔥 T1.1 Tabloid-Karten als Spiel-Cover · `M`
Nach jedem Pflichtspiel: animierte Zeitungsseite (Schlagzeile + Untertitel +
B/W-Foto-Platzhalter + zerrissene Ecke + Stempel). Bleibt im Saison-Album.

- Komponente: `TabloidCover` — SVG-Layout mit `<image-slot>`-Platzhalter.
- Spawn-Logik: Spielende → Inbox-Card als "Cover" mit Tap-to-expand.
- 4 Layout-Templates (Sieg / Niederlage / Skandal / Routine).
- **Depends:** Inbox-Card-System, image-slot Starter.

### 🔥 T1.2 Spielertransfer: Gegenangebot-Loop · `M`
Echtes Hin-und-Her statt Einzel-Slider. Drei Hebel (Ablöse / Bonus / Klausel),
sichtbarer Berater-Stress­balken, lowball → Berater wird grantig.

- Erweitert `ScreenPlayerNeg` um State-Machine (Angebot, Gegenangebot,
  Final, Abgebrochen).
- Komponente: `NegotiationLog` — alternierende Chat-bubble-artige Karten mit
  Zeitstempeln und Berater-Reaktionen (Sätze aus 6er-Pool).
- Beraterstress als 0-100 Balken oben — färbt sich rot bei drei Lowballs.
- **Depends:** ScreenPlayerNeg.

### 🔥 T1.3 Pressekonferenz mit Verzweigungen · `M`
Drei Antwort-Pfade pro Frage (höflich / kantig / Vorstandszitat). Jede Antwort
hat sichtbare Vorhersage-Pills (Vorstand ▲ / Fans ▼ / Sponsor =).

- Erweitert `ScreenPressInterview` um 5-Fragen-Flow.
- Komponente: `PressAnswerCard` — drei Antworten, jede mit Outcome-Vorhersage.
- Reichweite: 3 Fragen pro normaler PK, 6 nach Cup-Finale.

### 🔥 T1.4 Halbzeit-Sprechblasen statt Slider · `S`
Drei Spieler-Sprechblasen im Bottom-Sheet ("Ich hab noch was", "Halt mich auf
dem Platz", "Die Rechte ist zu") — **ist** die Ansprache.

- Erweitert `ScreenHalftime`.
- Komponente: `PlayerBubble` — Porträt + Sprechblase + Reaktions-Buttons
  ("Mehr Mut" / "Beruhige dich" / "Du wechselst").

### 🔥 T1.5 Anpfiff-Countdown im Hub · `S`
Wenn das nächste Spiel < 30 Min entfernt, ersetzt die Next-Match-Karte sich
durch ein "ANPFIFF IN 23:14"-Layout mit großem Mono-Timer.

- Refactor `ScreenHub` Next-Match-Karte um conditional render.

---

## Tier 2 — Daten-Tiefe & Wirtschaft

### 🟡 T2.1 Heatmap pro Spieler-Spiel · `M`
30×20-Pitch mit Wärme-Blobs. Drei Klicks tief im Match-Bericht (Spiel → MOTM
→ Heatmap).

- Komponente: `PlayerHeatmap` — Canvas mit gaussian-blob-Generator,
  deterministisch aus seed pro (Spiel, Spieler).

### 🟡 T2.2 Karrierebogen pro Spieler · `M`
Vertikale Timeline mit Vereinen, Saison-Bewertungen, Verletzungen, Trophäen.
Wirkt wie ein CV.

- Komponente: `CareerTimeline` — vertical-axis-SVG mit Marker-Klassen
  (transfer / injury / trophy / award).

### 🟡 T2.3 xG-Verlauf live im Match · `S`
Dünne Linie unter dem Score-Header, pro Chance wächst sie weiter. Beide
Seiten in verschiedener Farb-Linie.

- Erweitert `ScreenMatchFeed` Header.
- Komponente: `LiveXgStrip` — SVG-line mit `points` Array.

### 🟡 T2.4 Heimspiel-Wirtschaft live · `M`
Vor jedem Heimspiel: Karte mit Ticketpreis × Block, erwartete Gastro-Erträge,
Vorrat. Live-Slider verändert Vorhersage.

- Komponente: `HomeMatchEconomy` — drei Block-Reihen (N/S/O/W) je mit
  Slider + Live-Total in der Mitte.

### 🟡 T2.5 Sponsor-Pyramide · `S`
SVG-Pyramide: Trikot­front / Ärmel / Hose / Stadion / Aufdruck­geber. Pro
Sponsor Mini-Gantt der Vertragslaufzeit.

- Komponente: `SponsorPyramid` — 5 horizontale Bänder mit Status-Pills.

---

## Tier 3 — Saison-Rhythmus & Identität

### 🔵 T3.1 Saison-Chronik · `L`
Vintage-Album-Seite pro Saison: 3-Foto-Collage, beste Ergebnisse, Pokale,
Tabloid-Schnipsel, Stempel.

### 🔵 T3.2 Winterpause-Modal · `M`
Wie ein Jahresende-Brief: Halbzeitbilanz, Vorstandswort, Vertrags­warnungen,
Frühjahrsplan. Vollscreen, kein Sheet.

### 🔵 T3.3 Spitznamen-System · `S`
"Der Hafen-Brody" entsteht spontan nach drei Toren. Wird vom Reporter geprägt.

- Engine: 12 Schablonen × Spieler-Eigenschaft × Klub-Trope.

### 🔵 T3.4 Trikot-Designer (heraldisch) · `L`
Streifen + zwei Farben aus `CLUB_REGISTRY`. Erscheint auf 2D-Ticker + Lineup.

### 🔵 T3.5 Vorsaison-Bühne · `L`
Trainingslager-Wahl, 2 Testspiele, Frühform-Diagramm. ~5 min real, 4 Wochen
in-game.

### 🔵 T3.6 Tunnel-Moment vor Anpfiff · `S`
≤ 3 Sek, übersprbar. Aufstellung tropft rein, Stadion-Geräusch nicht-auto.

---

## Querschnitts-Aufgaben

### ⚙️ Q.1 Responsive Desktop-Layout · `L` (👉 **jetzt in Arbeit**)
Volles 3-Spalten-Office-Layout für Tablet ≥ 1024 px und Desktop ≥ 1440 px.
Phone-Layouts bleiben unverändert; gleiches React kommt ins Desktop-Shell.

- Komponente: `DesktopShell` — fester linker Rail (Navigation),
  variabler Mittelbereich, optional rechter Kontext-Rail.
- Adaptive Hooks:
  - `<= 768 px` — Phone (aktuell)
  - `769–1199 px` — Tablet (2-Spalten)
  - `>= 1200 px` — Desktop (3-Spalten)
- Container-Queries pro Karte für Layout-Switch (z.B. KPI-Tile-Grid 2×2 → 4×1).
- **Depends:** keine — kann gegen aktuelle Screens laufen.

### ⚙️ Q.2 Tweaks-Panel · `S`
Klubfarbe / Schema / Datendichte direkt im Prototyp wechseln. Macht das
Token-System sichtbar.

- Starter: `tweaks_panel.jsx`.
- 3 Klubfarb-Optionen + Hell/Dunkel + Profi/Kompakt-Toggle.

### ⚙️ Q.3 Komponentenbibliothek extrahieren · `M`
Aus den 34 Screens die wirklich wiederverwendeten Composites ziehen:
`PlayerCard`, `InboxCard`, `MatchEvent`, `StatStrip`, `HubTile`, `LevyChip`,
`FormStrip`, `Sparkline`, `BreakBar`, `AttrBar`, `Attr20`, `RoleCard`,
`Workload`, `Portrait`, `Crest`, `StandSideView`, `StadiumTypePlan`.

- Output: `components/` Ordner mit je 1 Datei + Storybook-ähnliche Doku.

### ⚙️ Q.4 Tweaks-Persistenz · `S`
EDITMODE-Block in `index.html` für die wichtigsten Tweaks (Klubfarbe, Schema,
Datendichte). Reload-stabil.

### ⚙️ Q.5 i18n-Vorbereitung · `M`
Alle de-DE-Strings in `i18n/de.json`. Hilfsfunktion `t(key)`. Vorbereitung
auf en-GB.

### ⚙️ Q.6 Accessibility-Pass · `M`
- Screenreader-Labels prüfen (alle Icons-only Buttons haben `aria-label`).
- Keyboard-Trap-Test auf Halbzeit-Sheet, Pressekonferenz-Choice.
- Kontrast-Audit der dunklen Klubthemen (manche Vereinsfarben werden auf
  Cremepapier knapp 4.5:1).

### ⚙️ Q.7 Print-Pfad · `S`
Tabloid-Cover, Saison-Chronik und Tabelle via `@media print` ausdruckbar.

---

## Was noch fehlt — Screens

Sortiert nach „würde ich vermissen, wenn ich richtig spiele".

### Tier 1 Screens
- **35 · Heimspiel-Cockpit** (Spieltag selbst, kombiniert Pre-Match + Aufstellung + Verkauf). `M`
- **36 · Pressekonferenz mit Verzweigungen** (deeper als der Single-Card aktuell). `M`
- **37 · Saisonziele-Bogen** (Halbjahres-Ziel vom Vorstand). `S`
- **38 · Tabloid-Cover-Detail** (Vollbild eines Tabloid-Specials). `S`

### Tier 2 Screens
- **39 · Spieler-Karrierebogen-Detail** (Lebenslauf-Look). `M`
- **40 · Saisonende-Bilanz** (Tabellenfinale + Pokal-Übergabe). `M`
- **41 · Sponsoren­übersicht** (Pyramide + alle Verträge). `S`
- **42 · Trainingslager-Vorsaison** (Lager-Wahl, 3 Optionen). `M`

### Tier 3 Screens
- **43 · Schiedsrichter-Statistik** (für Profi-Modus, Gelbe Karten pro Schiri).
- **44 · Stadion-Beleuchtungs­show** (Halbzeit, ROI-Spielerei).
- **45 · Vereins­geschichte** (Wikipedia-artig, gestempelt).

---

## Was noch fehlt — Komponenten

- `TabloidCover` — Spielergebnis-Coverkarte.
- `NegotiationLog` — Chat-bubble-Verhandlung.
- `PressAnswerCard` — 3-Wege-Antwort mit Outcome-Pills.
- `PlayerBubble` — Halbzeit-Sprechblase mit Reaktionen.
- `PlayerHeatmap` — Canvas-Pitch + Wärme-Blobs.
- `CareerTimeline` — vertikale CV-Timeline.
- `LiveXgStrip` — wachsende xG-Linie unter dem Score.
- `HomeMatchEconomy` — Block-Slider mit Live-Total.
- `SponsorPyramid` — 5-Band-Pyramide.
- `DesktopShell` — 3-Spalten-Office-Layout.
- `LeftRail` / `RightRail` / `BreadCrumb` — Desktop-Navigation.

---

## Reihenfolge — was ich als nächstes nehmen würde

1. **Q.1 Responsive Desktop-Layout** (👉 jetzt)
2. **T1.5 Anpfiff-Countdown** + **T1.4 Halbzeit-Sprechblasen** (beide `S`, sofortige Wirkung)
3. **T1.1 Tabloid-Cover** + Screen 38 (Cover-Detail)
4. **T1.2 Transfer-Gegenangebot-Loop** + Screen 36 (Pressekonferenz mit Verzweigung)
5. **T2.3 xG-Verlauf live** (sehr günstig, sofortige Live-Match-Tiefe)
6. **Q.2 Tweaks-Panel** + **Q.4 Persistenz**
7. Saison-Bogen-Trilogie: T2.1 Heatmap → T2.2 Karrierebogen → T3.1 Saison-Chronik
