# Komponenten · Aurelia Premier

> Wiederverwendbare React-Composites des Prototypen, sortiert nach Rolle.
> Jeder Eintrag nennt **Datei**, **Props** und kurz: wann nutzen, wann nicht.
>
> Stand 16.05.2026 · alle Komponenten leben aktuell als globale Funktionen
> (Babel-Standalone-Setup); für die shadcn-Implementierung empfohlen ist
> `components/ui/*.tsx` pro Atom, `components/*.tsx` pro Composite.

## Konventionen

- **Theme-Props.** Jede Komponente, die Farben anzeigt, nimmt
  `theme={'A' | 'A_<clubId>' | 'B' | 'C'}` und `scheme={'light' | 'dark'}`.
  In der shadcn-Umsetzung werden diese durch CSS-Variablen ersetzt und
  Theme-Switch via Class-Toggle auf `<html>`.
- **Bekanntes Implementierungs-Gap (shadcn-Migration).** Der Prototyp
  liest Farben *inline aus JS* (`t.accent`, `t.bg` etc.), nicht aus
  CSS-Variablen. Der `ThemeCss`-Helfer schreibt zwar `--accent` global
  auf `.phone-screen`, aber die Screens nutzen weiterhin die JS-Werte —
  der visuelle Effekt stimmt, der Mechanismus aber nicht. **Für shadcn:**
  Theme-Variablen per `data-theme="A_kaltenbach"` auf dem Screen-Root
  scopen und alle Farbnutzungen auf `var(--accent)` etc. umstellen.
  Vorgehen pro Komponente: `t.x` → `var(--x)`-Attribut via styled
  oder `tw-` Klasse mit `style={{ '--accent': ... }}`-Inline-Override.
- **Locale.** Alle Strings sind de-DE.
- **A11y.** Buttons ohne sichtbares Label haben `aria-label`.
  Icons sind nie alleiniger Träger semantischer Information; Status hat
  immer Glyph + Farbe (z. B. `FormStrip` S/U/N).

---

## Marken-Atome

### `Crest`
**Datei:** `ui.jsx` · **Props:** `shape: 'heater'|'iberian'|'gonfalon'|'roundel'`, `a: hex`, `b: hex`, `charge: 'lion'|'eagle'|'ship'|'wave'|'tower'|'sword'|'cog'|'cross'|'star'|'ball'`, `motto?: string`, `size?: number=88`
Procedural SVG-Wappen. Deterministisch aus `(shape, a, b, charge)`. Bevorzugt aus `CLUB_REGISTRY` ziehen: `<Crest {...crestFor('FC Hafenstadt')} size={32}/>`.

### `Portrait`
**Datei:** `ui.jsx` · **Props:** `name: string`, `size?: number=48`, `variant?: 'staff'|'player'`
Initialen-Avatar aus den ersten Buchstaben des Namens. Player-Variante setzt einen Akzent­ring. Niemals als Foto-Platzhalter benutzen — der Initialen-Look ist Absicht (keine Foto-Uploads in v1).

### `WordmarkA` · `WordmarkB` · `WordmarkC`
**Datei:** `directions.jsx` · **Props:** `size?: number=28`, `ink?: hex`, `accent?: hex`, `mono?: boolean`
Die drei Direction-Schriftzüge. Nur für Direction-Vergleich, Onboarding-Splash und PWA-Manifest.

---

## Daten-Atome

### `StrBar`
**Datei:** `ui.jsx` · **Props:** `n: 1-10`, `max?: number=10`, `w?: number=72`
1-10-Stärke als Glyphbar mit numerischer Ziffer vorne. Pflicht: **nie Farbe allein** — Ziffer immer mitanzeigen.

### `Talent`
**Datei:** `ui.jsx` · **Props:** `n: 1-4`, `max?: number=4`
Vier-Sterne-Talent. Akzent­farbe für gefüllte Sterne, `rule` für leere.

### `FormStrip`
**Datei:** `ui.jsx` · **Props:** `form: string` (5 Zeichen aus `S|U|N`)
Fünf farbig-glyph-codierte Form-Kacheln. Buchstabe **muss** sichtbar sein.

### `PosPill`
**Datei:** `ui.jsx` · **Props:** `pos: 'TW'|'IV'|'AV'|'DM'|'ZM'|'OM'|'ST'`
Positions-Badge mit semantischer Farbe. Mono, 11 px.

### `Sparkline`
**Datei:** `tactics.jsx` · **Props:** `data: number[]`
Inline-Sparkline mit Akzent­linie + 12 %-Fläche. Letzter Punkt fett. Kein Achsen­schmuck.

### `BreakBar`
**Datei:** `tactics.jsx` · **Props:** `rows: { l: string, v: number, c: hex }[]` (v = Prozent)
Gestapelter horizontaler 100 %-Balken + Legend-Grid 2×N.

### `LiveXgStrip`
**Datei:** `live-demo.jsx` · **Props:** `a: number`, `b: number`, `aLabel`, `bLabel`, `points: { min, a, b }[]`
Live-xG-Liniendiagramm für den Match-Header. Akzent (Heim) gegen Mute (Gast), gestrichelte Halbzeit-Linie bei Minute 45.

---

## Chips & Pills

### `PillBtn`
**Datei:** `ui.jsx` · **Props:** `intent: 'accept'|'neutral'|'soft'|'danger'`, `icon?`, `children`
Inbox-Aktions-Pille. 36 px hoch, ≥ 44 px Tap-Hit via padding.

### `LevyChip`
**Datei:** `ui.jsx` · **Props:** —
Persistent sichtbare Verbandsabgabe. Immer im Finanz-Screen und im Hub.

### `TraitPill`
**Datei:** `team.jsx` · **Props:** `label: string`, `tone?: 'accent'|'ok'|'warn'|'mute'`
Spieler-Persönlichkeits-Pille. Bullet + Label, niedrige Sättigung.

### `OutcomeChip`
**Datei:** `depth.jsx` · **Props:** `who: string`, `d: -2..+2`
Pressekonferenz-Antwort-Vorhersage. ▲▼= Glyphe + Wiederholungs­zahl.

### `OfferChip`
**Datei:** `depth.jsx` · **Props:** `k: string`, `v: string`, `dark?: boolean`
Transfer-Angebots-Bestandteil im Mono. Dark-Variante für eigene Bubble.

### Tabellen-Helper · `Kpi` / `Sum` / `Stat` / `KV`
**Dateien:** `tactics.jsx`, `team.jsx`, `depth-data.jsx` · alle nehmen `k`, `v`, optional `accent`.
Mini-Stat-Tiles in verschiedenen Größen.

---

## Eingabe

### `TSlider`
**Datei:** `tactics.jsx` · **Props:** `label`, `value: 0-100`, `onChange`, `leftL`, `rightL`, `hint`, `mid?: boolean`
Taktik-Slider mit zwei End-Labels und einem aktiven Hint rechts. Optionaler Mittel­strich (für ±-Bereiche).

### `Slider`
**Datei:** `screens-part2.jsx` · **Props:** `label`, `value`, `tooltip`, `leftL`, `rightL`, `last?: boolean`
Finanz-Slider mit Live-Tooltip in Euro/Saison.

### `Seg`
**Datei:** `tactics.jsx` · **Props:** `opts: { id, l }[]`, `value`, `onChange`, `label?`
Segmented Control, 2–4 Optionen. Bei mehr Optionen oder >12 Zeichen → `Select` (post-MVP).

### `TacticToggle`
**Datei:** `tactics.jsx` · **Props:** `label`, `on: boolean`, `onChange`, `hint?`
iOS-Style Switch mit Erklärungs­zeile. Pflicht für jeden binären Hebel.

### `Lever`
**Datei:** `depth.jsx` · **Props:** `label`, `value: number`, `min`, `max`, `step`, `onChange`, `last?`
Slider mit Euro-Wert-Bubble (z. B. Transfer-Ablöse). Mit Native-Range-Input für A11y.

---

## Karten-Composites

### `PlayerCard`
**Datei:** `screens-part1.jsx` · **Props:** `p: { n, pos, age, str, tal, form, contract, nat, shirt, bench? }`
Kompakte Spielerkarte. Nutzt `PosPill`, `StrBar`, `Talent`. Vertragsdatum bekommt einen Punkt, wenn `06/26`.

### `InboxCard` (logisch — als Inline-Markup in `screens-part1.jsx#ScreenInbox`)
**Empfohlen für Extraktion** zu eigener Komponente.
**Vorgeschlagene Props:** `tone: 'board'|'media'|'sponsor'|'scout'|'fan'`, `from`, `title`, `body`, `time`, `actions: PillBtnProps[]`

### `HubTile` (logisch — Inline in `screens-part1.jsx#ScreenHub`)
**Empfohlen für Extraktion.**
**Vorgeschlagene Props:** `icon: ReactNode`, `label: string`, `sub: string`, `flag?: string`
Hub-Kachel: Icon-Box + Titel + Untertitel + scharlachrote Flag-Zeile.

### `MatchEvent` (logisch — Inline in `screens-part2.jsx#FeedView` und `depth-data.jsx`)
**Empfohlen für Extraktion.**
**Vorgeschlagene Props:** `min: string`, `kind: 'goal'|'card'|'sub'|'chance'|'set'|'whistle'`, `t: string`, `s: string`, `score?: string`

### `StatStrip` / `CmpRow`
**Datei:** `screens-part1.jsx` (`Row` inline), `compare.jsx` (`CmpRow`)
Gegenüber­liegende Werte mit hervorgehobener Gewinner­seite. Eine konsolidierte Implementierung in `components/StatStrip.tsx` wird empfohlen.

### `Workload`
**Datei:** `team.jsx` · **Props:** `label`, `value: 0-100`, `note`, `last?`
Belastungs-Zeile mit ampelfarbigem Balken (>=70 rot / >=50 gelb / sonst grün).

---

## Spielfeld & Stadion

### `FormationPitch`
**Datei:** `ui.jsx` · **Props:** `formation: '4-3-3'|'4-4-2'|'4-2-3-1'|'3-5-2'|'5-3-2'`
Vertikales Spielfeld mit 11 Spieler­knoten. Skaliert auf Container­breite.

### `MiniPitch`
**Datei:** `ui.jsx` · **Props:** `size?: number=22`, `color?: hex`
Kompaktes Pitch-Glyph für Set-Pieces im Match-Feed.

### `StadiumPlot`
**Datei:** `ui.jsx` · **Props:** —
Isometrischer Stadion­plan mit benannten Tribünen­blöcken (N/O/S/W), Flutlicht­masten an den Ecken, Slot-Pins für Anbauten.

### `StandSideView`
**Datei:** `stadium.jsx` · **Props:** `stand: { id, cap, seats, standing, vip, roof, rows, blocks, ... }`
Tribünen-Seiten­ansicht: Pitch-Linie + Rasenheizungs-Spirale + treppen­förmige Ränge + Dach-Variante (full/partial/open) + VIP-Logen-Markierung + Flutlicht­mast.

### `StadiumTypePlan`
**Datei:** `stadium.jsx` · **Props:** `type: { id, ... }`
Top-down Mini-Plan eines Stadion­typs. Vier Tribünen (Standard), Dorfplatz (eine), Hufeisen (drei), Arena (umlaufend).

### `CapacityBar`
**Datei:** `stadium.jsx` · **Props:** `stand`
Gestapelter Steh-/Sitz-/VIP-Balken mit Glyphen + Zahlen.

---

## Statistik

### `AttrBar`
**Datei:** `team.jsx` · **Props:** `label`, `value: 0-10`, `max?: number=10`, `hint?: string`, `accentHi?: boolean`
1-10-Attribut-Zeile mit Glyphbar + Numeric + optionaler Erklärungs­zeile.

### `Attr20`
**Datei:** `compare.jsx` · **Props:** `label`, `value: 1-20`, `last?: boolean`
Profi-Modus-Variante mit 20 vertikalen Zellen, Tier-Farbe (rot < 9 / orange < 13 / ink < 17 / grün ≥ 17).

### `TeamRadar`
**Datei:** `compare.jsx` · **Props:** —
6-Achsen-Radar Hafenstadt vs. Northbridge. Für generische Nutzung: Akzent + Mute-Pfad einplanen.

---

## Animations- & Tiefen-Komponenten

### `TabloidCover` (Screen 35)
**Datei:** `depth.jsx#ScreenTabloidCover` · **Props:** `tone: 'triumph'|'storm'`
Voll­bildige Zeitungs­seite. Engineer-To-Do: extrahieren zu wieder­verwendbarem `<TabloidCover headline subtitle photo facts quote stamp/>`.

### `PlayerBubble` (logisch — Inline in `ScreenHalftimeBubbles`)
**Empfohlen für Extraktion.**
**Vorgeschlagene Props:** `player: { name, pos, form }`, `mood: 'energie'|'frust'|'erschöpft'`, `line: string`, `reactions: { l, e, onSelect }[]`

### `NegotiationMessage` (logisch — Inline in `ScreenTransferNeg`)
**Empfohlen für Extraktion.**
**Vorgeschlagene Props:** `side: 'us'|'them'`, `who`, `when`, `offer: { ablöse, bonus, klausel }`, `msg`

### `PressAnswerCard` (logisch — Inline in `ScreenPressConference`)
**Empfohlen für Extraktion.**
**Vorgeschlagene Props:** `tone: 'höflich'|'kantig'|'sarkasmus'|'neutral'`, `quote`, `predict: { w, d }[]`, `onPick`

### `ArcEvent`
**Datei:** `depth-data.jsx` · **Props:** `e: { kind, y, ... }`
Karrierebogen-Marker + Karte. Kind drives glyph + color.

### `AlbumPhoto` / `Trophy`
**Datei:** `depth-data.jsx`
Saison-Album-Foto-Kachel (B/W-SVG-Szenen) und SVG-Trophäen­ikonen. Sehr spezifisch — nur fürs Album-Layout.

---

## Glyphen

In `stadium.jsx`:
- `GlyphRoof` / `GlyphRoofOpen` / `GlyphRoofPartial`
- `GlyphSeat` / `GlyphStand` / `GlyphVIP`
- `GlyphFloodlight` / `GlyphHeating`
- `BeerGlyph` / `WurstGlyph`

Alle Stroke-only oder mit `fillOpacity`, akzeptieren `size`, `color`. Für die shadcn-Umsetzung als eigenes `components/glyphs/*.tsx` Modul, **nicht** als lucide-Override.

---

## Empfohlene Extraktions-Reihenfolge

1. **`PlayerCard`** — meistgenutzt, klare Props, sofortiger Gewinn.
2. **`HubTile`** + **`InboxCard`** — kommen in Hub und Inbox vor, gleicher Grund.
3. **`MatchEvent`** — wiederholt in 3 Screens.
4. **`Crest` + `Portrait`** — globale Abhängigkeit aller Screens mit Identität.
5. **`StrBar` + `Talent` + `FormStrip`** — die drei „Atom­karten" der Daten-Sprache.
6. **`Sparkline` + `BreakBar`** — die zwei Daten-Visualisierungen.
7. **`StandSideView` + `StadiumTypePlan`** — falls Stadion-Ausbau live geht.

---

## Was NICHT extrahieren

- Die **Direction-Vergleichs­karten** (`DirectionFrame` in `directions.jsx`) — nur für Design-Review. Werden in Production gelöscht.
- Die **`DesignCanvas`-Wrapper** (`DCArtboard`, `DCSection`) — sind aus dem `design_canvas.jsx` Starter und gehören nicht in die App.
- **`ClubHub`** in `more.jsx` — ist eine Variante von `ScreenHub`, nur für die Klubfarben-Demo. Production benutzt direkt `ScreenHub` mit theme-prop.
