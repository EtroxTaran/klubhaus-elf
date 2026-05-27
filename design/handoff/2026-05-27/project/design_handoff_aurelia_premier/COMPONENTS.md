# Komponenten · Aurelia Premier

> Wiederverwendbare React-Composites des Prototypen, sortiert nach Rolle.
> Jeder Eintrag nennt **Datei**, **Props** und kurz: wann nutzen, wann nicht.
>
> Stand 23. Mai 2026 · Atome und sechs Top-Composites sind in eigenen Dateien
> extrahiert (`components.jsx`, `ui.jsx`, `identity.jsx`). Für die shadcn-
> Implementierung empfohlen: `components/ui/*.tsx` pro Atom,
> `components/*.tsx` pro Composite.

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

### `Wordmark`
**Datei:** `directions.jsx` · **Props:** `size?: number=28`, `ink?: hex`, `accent?: hex`, `mono?: boolean`
Horizontaler Klub-Schriftzug für Onboarding-Splash und PWA-Manifest.

### `Jersey`
**Datei:** `identity.jsx` · **Props:** `pattern: 'solid'|'stripes'|'hoops'|'sash'|'split'|'chevron'`, `a: hex`, `b: hex`, `sleeveAccent?: bool=true`, `crest?: CrestProps`, `number?: str`, `name?: str`, `showBack?: bool`, `size?: number=200`
Prozedurales Trikot-SVG. Bevorzugt aus `CLUB_REGISTRY[*].kit` ziehen: `<Jersey {...kitFor('FC Hafenstadt')} a={crest.a} b={crest.b}/>`. Vor- und Rückseite via `showBack`. Crest auf der Brust optional.

### `PlayerToken`
**Datei:** `identity.jsx` · **Props:** `kit: {pattern, sleeveAccent}`, `a: hex`, `b: hex`, `shirt: str`, `highlight?: bool`, `size?: number=36`, `accent?: hex`
Trikot + Rückennummer-Badge — der einzige Spieler-Marker auf Spielfeldern (2D-Ticker, Lineup, Rollen-Editor). Hat eine Luminanz-Logik, damit die Nummer immer lesbar bleibt. Bei `highlight={true}` wird die Nummer scharlachrot hinterlegt.

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

### `ThemeCss` + `ThemeRoot` · CSS-Variablen-Layer (neu)

**Datei:** `ui.jsx`

Zwei Schichten koexistieren:

1. **Legacy** — Komponenten lesen `const t = THEMES[theme][scheme]` und nutzen `t.accent` inline. Funktioniert weiter.
2. **Neu** — Komponenten nutzen `var(--accent)` direkt in `style`-Attributen oder Tailwind-Klassen. Kein Re-render nötig wenn Tokens sich ändern — die CSS-Schicht aktualisiert in-place.

Beispiel-Migration:

```jsx
// Vorher
const t = THEMES[theme][scheme];
<div style={{background:t.card, color:t.ink, borderColor:t.rule}}>…</div>

// Nachher
<ThemeRoot theme={theme} scheme={scheme}>
  <div style={{background:'var(--card)', color:'var(--ink)', borderColor:'var(--rule)'}}>…</div>
</ThemeRoot>
```

`<ThemeRoot>` ist die opt-in-Wrapper für Komponenten außerhalb `.phone-screen`. Beide Schichten werden von `<ThemeCss>` emittiert; auf `.phone-screen` sind alle Tokens automatisch da, auf `[data-theme="A"][data-scheme="light"]`-Containern via ThemeRoot.

Für Production-Migration (plan.md §6.2): Komponenten Datei für Datei migrieren, dann `THEMES[theme][scheme]`-Lesungen entfernen.

---



Aus `system.jsx` — diese leben *außerhalb* der Screen-Komponenten und
versorgen die Tweaks-Panel-Wirkung sowie i18n und Engine-Mock-Stempel.

### `useT()`
React-Hook. Gibt `(key, vars?) => string` zurück, re-rendert die Komponente bei
`setLocale()`. Beispiel: `tr('hub.advance_days', {n:3})`.

### `getLocale()` / `setLocale(locale)` / `subscribeLocale(fn)`
Globale Setter/Getter. `locale` ist `'de'` oder `'en'`. Tweaks-Panel und
Einstellungen rufen `setLocale`.

### `applyClubColor(clubId)` / `setPrefs({clubId, scheme, density, motion, cloud})`
Schreibt Klubfarbe in `THEMES.A.{light,dark}.accent`. Trigger sind
Tweaks-Panel-Klicks; alle Komponenten mit `theme='A'` rendern neu.

### `EngineMockStamp`
**Props:** `corner?: 'tl'|'tr'|'bl'|'br'`, `size?: 'sm'|'md'|'lg'`, `label?`, `sub?`
Rotierter scharlachroter Tabloid-Stempel — auf Match-Tick-Screens platziert
(Feed, Halbzeit, 2D-Ticker, Halftime-Bubbles) um klar zu kennzeichnen, was
durch die Sim-Engine ersetzt wird.

### `TbdStamp`
**Props:** `label?`, `style?`
Neutrale gestrichelte Pill für nicht-Sim-Andeutungen.

### `usePrefs()`
React-Hook. Gibt das aktuelle Prefs-Objekt zurück (`{clubId, scheme, density, motion, cloud}`).

---

## Karten-Composites

### `PlayerCard`
**Datei:** `screens-part1.jsx` · **Props:** `p: { n, pos, age, str, tal, form, contract, nat, shirt, bench? }`
Kompakte Spielerkarte. Nutzt `PosPill`, `StrBar`, `Talent`. Vertragsdatum bekommt einen Punkt, wenn `06/26`.

### `HubTile` ✅ extrahiert
**Datei:** `components.jsx` · **Props:** `icon: ReactNode`, `label: string`, `sub: string`, `flag?: string`, `theme`, `scheme`, `onClick?`
Hub-Kachel: Icon-Box + Titel + Untertitel + scharlachrote Flag-Zeile. Hat JSDoc + Story-Tags (`@story HubTile/Default`, `HubTile/WithFlag`, `HubTile/NoFlag`).

### `InboxCard` ✅ extrahiert
**Datei:** `components.jsx` · **Props:** `tone: 'board'|'media'|'sponsor'|'scout'|'fan'`, `from`, `title`, `body`, `time`, `onAccept?`, `onDefer?`, `onDecline?`, `onMore?`, `theme`, `scheme`
Posteingang-Karte mit Tone-Glyph + 4 Aktionen (Annehmen/Vertagen/Ablehnen/Mehr). Reicht alle Klick-Handler nach außen, kein State intern. Story-Tags: Board / Press / Sponsor / Scout / Fan.

### `MatchEvent` ✅ extrahiert
**Datei:** `components.jsx` · **Props:** `min: string`, `kind: 'goal'|'chance'|'card'|'sub'|'set'|'whistle'`, `title: string`, `sub: string`, `score?: string`, `last?: boolean`, `theme`, `scheme`
Eine Zeile im Reportage-Feed. Goal-Variante in scharlachrotem Serif, Set-Piece nutzt `MiniPitch`-Glyph. Story-Tags: Goal / Chance / SetPiece / Whistle.

### `StatStrip` ✅ extrahiert
**Datei:** `components.jsx` · **Props:** `label`, `a: string|ReactNode`, `b: string|ReactNode`, `accentSide?: 'a'|'b'`, `hint?: string`, `mono?: boolean`, `last?: boolean`, `theme`, `scheme`
Gegenüberliegende Werte mit Gewinner-Akzent. Akzeptiert auch ReactNode (z.B. `<FormStrip/>`) als `a`/`b`. Story-Tags: Default / WinnerAccent / WithHint / NonNumeric.

### `AdvanceButton` ✅ extrahiert
**Datei:** `components.jsx` · **Props:** `label: string|ReactNode`, `daysOffset?: number`, `onClick?`, `theme`, `scheme`
Großer Hub-CTA mit Tages-Offset-Stempel oben links. Story-Tags: Default / NoStamp / Long.

### `NextMatchCard` ✅ extrahiert
**Datei:** `components.jsx` · **Props:** `home`, `away`, `dateLine`, `metaLine`, `aside?: ReactNode`, `theme`, `scheme`
Hub-Tile mit Kicker, Score-Strip und optionalem Aside (xG, Countdown). Story-Tags: Default / WithCountdown.

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

### `PressAnswerCard` ✅ extrahiert
**Datei:** `components.jsx` · **Props:** `tone: 'höflich'|'kantig'|'sarkasmus'|'neutral'`, `quote: string`, `predict: {w, d}[]`, `onPick?`, `theme`, `scheme`
Antwort-Karte in der Pressekonferenz mit Outcome-Pills (z.B. Vorstand ▲, Fans ▼). Story-Tags: Polite / Sharp / Sarcastic / Neutral.

### `PlayerBubble` ✅ extrahiert
**Datei:** `components.jsx` · **Props:** `player: {name, pos, form}`, `mood: 'energie'|'frust'|'erschöpft'|'cool'|'angeschlagen'`, `line: string`, `reactions: {l, e, onSelect?}[]`, `theme`, `scheme`
Halbzeit-Sprechblase mit Portrait + MoodFace + italic-Quote mit farbigem Border-Left (Stimmungs-Akzent) + Reaktions-Buttons. Story-Tags: Energie / Frust / Erschoepft.

### `NegotiationMessage` ✅ extrahiert
**Datei:** `components.jsx` · **Props:** `side: 'us'|'them'`, `who`, `when`, `msg`, `offer: {ablöse, bonus?, klausel?}`, `theme`, `scheme`
Chat-Bubble für Transfer-Loop. `us` rendert rechts in Ink, `them` links in Card. OfferChips werden inline ausgegeben. Story-Tags: Them / Us / Lowball.

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

## Empfohlene Extraktions-Reihenfolge (verbleibend)

1. ✅ **`PlayerCard`** — bereits extrahiert in `screens-part1.jsx`.
2. ✅ **`HubTile`** + **`InboxCard`** — neu in `components.jsx`.
3. ✅ **`MatchEvent`** — neu in `components.jsx`.
4. ✅ **`StatStrip`**, **`AdvanceButton`**, **`NextMatchCard`** — neu in `components.jsx`.
5. ✅ **`PressAnswerCard`** — neu in `components.jsx`. Refactor von `depth.jsx#ScreenPressConference` erledigt.
6. ✅ **`PlayerBubble`** — neu in `components.jsx`. Nutzt `MoodFace` für Stimmungs-Anzeige. Refactor von `depth.jsx#ScreenHalftimeBubbles` erledigt.
7. ✅ **`NegotiationMessage`** — neu in `components.jsx`. Refactor von `depth.jsx#ScreenTransferNeg` erledigt.
8. **`TabloidCover`** — aktuell vollständige Screen-Komponente in `depth.jsx`. Refactor zu `<TabloidCover headline subtitle photo facts quote stamp/>` würde das Saison-Album-Layout (`depth-data.jsx#ScreenSeasonAlbum`) wiederverwenden lassen. **Nicht für v1 erforderlich** — Screen funktioniert; nur Wiederverwendungspotenzial bleibt ungenutzt.
9. ✅ **`Crest` + `Portrait`** — schon eigenständige Atome in `ui.jsx`/`negotiations.jsx`, kein Refactor nötig.
10. ✅ **`StrBar` + `Talent` + `FormStrip`** — schon eigenständige Atome in `ui.jsx`.

---

## Was NICHT extrahieren

- Die **`DesignCanvas`-Wrapper** (`DCArtboard`, `DCSection`) — sind aus dem `design_canvas.jsx` Starter und gehören nicht in die App.
- **`ClubHub`** in `more.jsx` — ist eine Variante von `ScreenHub`, nur für die Klubfarben-Demo. Production benutzt direkt `ScreenHub` mit theme-prop.
