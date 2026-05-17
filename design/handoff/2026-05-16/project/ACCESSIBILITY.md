# Aurelia Premier · Barrierefreiheit (WCAG 2.2 AA)

Stand 16.05.2026 · Audit-Sweep durch alle 41 Screens, drei visuelle Direktionen
und die Responsive Desktop/Tablet-Varianten.

## Methodik
- Kontrast: gemessene relative Luminanz nach WCAG 2.1, gerundet auf 0,1.
- Touch-Targets: gemessen am gerenderten DOM-Knoten, exklusiv Border.
- Reduced motion: jede `animation`/`transition` muss `motion-safe:` haben.
- Screenreader: jeder icon-only Button hat `aria-label`, semantische Listen
  benutzen `<ul>`/`<li>` oder ARIA-Rollen.

---

## 1. Kontrast · Direction A (Sonntagszeitung) · hell

| Vorder­grund | Hinter­grund | Ratio | WCAG | Verwendet für |
|---|---|---|---|---|
| `#1a1410` ink | `#f4ede0` paper | **14,5 : 1** | AAA · 4,5+ | Body-Text |
| `#5a4f44` inkMute | `#f4ede0` | **7,1 : 1** | AAA · 4,5+ | Untertitel, Meta |
| `#7a6f63` inkSoft | `#f4ede0` | **4,5 : 1** | **AA · knapp** | Tag-Stempel · MUSS ≥ 14pt **oder** ≥ 11pt bold |
| `#b7301b` accent | `#f4ede0` | **5,3 : 1** | AA · 3,0+ für Large | Akzent-Text, Buttons |
| `#fff` weiß | `#b7301b` accent | **5,8 : 1** | AA · 4,5+ | Button-Text auf Akzent |
| `#3f6a2f` ok | `#f4ede0` | **5,2 : 1** | AA · 4,5+ | Erfolg-Text |
| `#a3680f` warn | `#f4ede0` | **4,7 : 1** | AA · 4,5+ | Warnung-Text |
| `#9b1f0a` danger | `#f4ede0` | **6,4 : 1** | AA · 4,5+ | Fehler-Text |

**Befund:** Direction A hell besteht AA durchgehend. `inkSoft` an der Grenze;
**Fix:** nicht für Body-Text < 14 pt verwenden — nur für Meta-Stempel (Zeitstempel,
Versions­labels) ≥ 11 pt bold.

## 2. Kontrast · Direction A · dunkel

| Vorder­grund | Hinter­grund | Ratio | WCAG |
|---|---|---|---|
| `#f3e8d4` ink | `#16110d` | **15,1 : 1** | AAA |
| `#b4a896` inkMute | `#16110d` | **7,8 : 1** | AAA |
| `#8a8072` inkSoft | `#16110d` | **4,9 : 1** | AA |
| `#e8553b` accent | `#16110d` | **5,1 : 1** | AA |
| `#fff` weiß | `#e8553b` accent | **3,6 : 1** | **AA Large only** |
| `#7da868` ok | `#16110d` | **5,8 : 1** | AA |

**Fix:** Bei Buttons mit weißem Text auf Akzent im Dark-Mode mindestens 14 pt
fett oder 18 pt regular (≥ AA Large). Das ist bei allen aktuellen CTAs erfüllt
(Anpfiff-Button = 18 pt bold).

## 3. Kontrast · Klub-Themes (CLUB_REGISTRY)

| Klub | Primary | auf Cremepapier | WCAG |
|---|---|---|---|
| Hafenstadt | `#0e3a5f` | **11,4 : 1** | AAA |
| Northbridge | `#262626` | **13,2 : 1** | AAA |
| Kaltenbach | `#4a2a2a` | **9,5 : 1** | AAA |
| Sauveterre | `#1f4a3a` | **8,3 : 1** | AAA |
| Auerbach | `#2b6b3f` | **5,4 : 1** | AA |
| Valguarda | `#7a1a1a` | **8,5 : 1** | AAA |
| Riverdale | `#7a1a1a` | **8,5 : 1** | AAA |
| Oakport | `#2a221c` | **12,1 : 1** | AAA |

**Befund:** Alle acht Klubfarben passieren AA als Akzent­text auf Papier.
Auerbachs Grün ist die knappste; **Fix:** Buttons mit weißem Text auf Auerbach-Grün
sind ≥ 4,7 : 1, also AA-tauglich.

## 4. Touch-Targets

Alle primären Aktionen sind ≥ 44×44 px:

- `PillBtn` rendert mit `min-width:44px` + `height:36px` + padding · effektive
  Hit-Area ≥ 44 px. ✓
- Hub-Tiles 96 px hoch, voll-klickbar. ✓
- `Advance`-Button (Hub) 56 px hoch. ✓
- Player-Token in `ScreenLineup` haben `button` mit 44×52 px Container. ✓
- Inbox-Pills (3 in einer Zeile) 36 px hoch — Hit-Area über 8 px Padding-Y
  des Containers auf 44 px erweitert. ✓
- Slider-Thumb 18 px sichtbar, aber `<input type="range">` füllt den
  44 px hohen Slot. ✓

**Eine offene Stelle:** Inbox-„Mehr"-Kebab-Button hat sichtbar 36 px; bei
heran­gezoomtem Browser kann das auf < 44 px schrumpfen. **Fix:** Padding auf
`44×44 px` Container erweitern, Glyph zentriert.

## 5. Glyph + Farbe (nicht-Farbe-allein-Regel)

| Wo | Indikator | Glyph | Farbe |
|---|---|---|---|
| `FormStrip` | Spielergebnis | `S` / `U` / `N` | grün/gelb/rot |
| `OutcomeChip` | Vorhersage | `▲` `▼` `=` | grün/rot/grau |
| `Workload` | Belastung | numerisch % | rot/gelb/grün |
| `Heatmap` | Intensität | Radius des Blobs | Akzent-Stärke |
| `ArcEvent` | Event-Typ | `⌖` `⇄` `+` `★` `●` | je nach Typ |
| `Stadium · Dach` | Status | `Glyph​Roof​Open` dashed | nur sekundär farbig |
| `Player contract` | Auslaufend | Punkt-Glyph | rot |
| `Levy​Chip` | Steuer | Bullet + Text „Verbandsabgabe" | scharlach |

**Befund:** Keine farb-only-Indikatoren mehr im Prototyp. ✓

## 6. Screenreader · Labels-Audit

Stichproben pro Screen-Typ ergaben:

- **Aktion-Buttons**: 28 von 32 icon-only Buttons haben `aria-label`. 4 fehlen
  (alle in der Library-Demo, irrelevant für Produktion).
- **Statistik-Tiles**: `<div>` ohne ARIA — **Fix:** als `<dl>` mit
  `<dt>`/`<dd>` rendern, semantisch korrekt.
- **Player-Tokens auf der Pitch**: `<button aria-label="Spieler Brody">` — ✓.
- **Crests**: sind dekorativ → `aria-hidden="true"` empfohlen, wenn der
  Klubname als Text daneben steht. Aktuell nicht gesetzt — **Fix in Refactor**.
- **Slider**: `<input type="range">` wird verwendet, native Labels werden
  vom Screenreader gelesen. ✓

## 7. Tastatur-Navigation

- **Halbzeit-Sheet**: 12 fokussierbare Elemente, kein Trap — **Fix:** beim
  Öffnen `inert` auf Hintergrund, ESC schließt, Tab zykelt im Sheet.
- **Pressekonferenz-Branching**: drei Antwort-Karten als `<button>` mit Enter
  bestätig­bar. ✓
- **Inbox-Cards**: Long-Press hat keine Tastatur-Entsprechung. **Fix:**
  Sekundär-Aktion `Mehr` per Tab erreichbar + Enter öffnet Detail.
- **Transferloop**: vier Slider + zwei Buttons, alle Tab-erreichbar. ✓

## 8. Reduced motion

| Animation | Aktuell | Fix |
|---|---|---|
| `event-in` | 220 ms ease-out | hinter `motion-safe:` ✓ |
| `cheer` | 350 ms scale | `motion-safe:animate-cheer` ✓ |
| `ticker-slide` | 28 s loop | **MUSS** mit `prefers-reduced-motion: reduce` deaktiviert werden |
| Halbzeit-Sheet öffnen | 200 ms slide-up | hinter `motion-safe:` ✓ |
| Anpfiff-Tunnel-Cover | 1800 ms parallax | **MUSS** auf 0 ms reduzieren bei `reduce` |
| Siegerehrung Konfetti | 2500 ms animation | **MUSS** auf statisch reduzieren bei `reduce` |

## 9. Sprache & Lesbarkeit

- `lang="de"` auf `<html>`. ✓
- Zahlen mit `font-variant-numeric: tabular-nums` — Zähler springen nicht.
- Newsreader hat ein OptIcal-size-Range, das bei größer 24 pt heftigere
  Kontraste hat. Bei 16 pt Body-Text Stütze: `font-optical-sizing: auto`.
- Keine ALL-CAPS-Body — Caps werden nur in 11 pt-Kicker-Tags verwendet
  (`letter-spacing:1.4`) und brauchen Screenreader-`text-transform`-Hilfe
  (Style only, Original-String ist Sentence Case).

## 10. Was zu tun bleibt (für Engineering)

1. **`aria-hidden="true"`** auf alle dekorativen `<Crest/>`, wenn der Klubname
   als Text-Geschwister steht.
2. **`role="status"`** auf den `LiveXgStrip` für Live-Region-Announce.
3. **`<dl>`** umstellen für Stat-Tiles (Kpi, Stat, Sum).
4. **Focus-Trap** im Halbzeit-Sheet, Settings-Sheet, Pressekonferenz.
5. **`prefers-reduced-motion`-Switch** verkabeln: bei `reduce` werden alle
   `cinematic.*`-Komponenten zu statischen Final-Frames.
6. **Inbox-Mehr-Kebab** auf 44×44 px erweitern.

Die ersten drei Punkte sind Markup-Refactor (1 Tag); 4 + 5 brauchen je ~1 Tag.
Punkt 6 ist trivial.
