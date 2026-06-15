# Aurelia Premier · Design-System & Migrations-Plan

> **Status:** Plan-Phase, 19. Mai 2026
> **Zielgruppe:** implementierende Entwickler:innen + Designreviewer
> **Quelle:** Prototyp `design_handoff_aurelia_premier/` (Babel-Standalone)
> **Produkt:** **Klubhaus Elf** (intern: Aurelia Premier)
> **Ziel:** **Design-System-Lieferung** auf **Vite + TanStack + shadcn/ui +
> Radix + Tailwind**. Alle Komponenten sind genau die, die später in
> Production zum Einsatz kommen — nicht zwei parallele Welten.
>
> **Scope-Klärung (19.05., final):**
> - Vite-pur, kein TanStack Start (kein SSR nötig)
> - **Alle Screens + alle UI-only Funktionen vollständig** — nur die
>   reine Sim-Logik (Match-Engine, KI) bleibt gestubbt
> - Cloud-Sync: **nur als UI-Andeutung** im Design, kein Backend-Code
> - i18n: **DE primär, EN als zweite Sprache**, vollständiges Key-System,
>   Tabloid-Headlines EN werden im Design geschrieben
> - Trikot-Generator: **mit dabei, ausgebaut** (Phase-3-Track)
> - **Storybook 8** als Komponenten-Doku zusätzlich zur Canvas-Library
>   (siehe §14d) — Industry-Best-Practice
> - Praktikabilität schlägt Vollständigkeit nur bei der **Sim-Engine** —
>   sonst gilt: vollständige UI.

---

## 0 · TL;DR

1. **Stack-Wechsel.** Brief sagt „Next.js 14". Anforderung „TanStack
   fully" überschreibt das. Wir bauen auf **Vite + TanStack Router**
   (kein TanStack Start, kein SSR — die App ist offline-first PWA).
   Rest bleibt: Tailwind, shadcn/ui, Radix, Dexie, Workbox.
2. **TanStack-Surface.** Query, Router, Table, Form, Virtual, Store,
   Pacer — *jedes* hat einen klaren Slot im Produkt (siehe §3).
3. **Komponenten-Migration.** Drei-Schicht-Architektur:
   `ui/` (shadcn primitives) → `components/` (App-Composites) →
   `routes/` (Screen-Compositions). 7 Composites werden zuerst extrahiert.
4. **Responsiveness.** Mobile-first, Container-Queries pro Karte,
   3 Breakpoint-Tiers (Phone / Tablet / Desktop), ein einziger
   `AdaptiveShell` der je Tier umrüstet.
5. **Zeitplan.** 8 Wochen für MVP, gegliedert in 4 Meilensteine
   (M1 Fundament · M2 Daten & Match-Loop · M3 Tiefe & Identity · M4 Politur).

---

## 1 · Stack-Entscheidungen

### 1.1 Framework

| Schicht | Wahl | Begründung |
|--|--|--|
| Runtime | **Vite 5** | Schnellstes DX, kein App-Router-Lock-in, kein SSR nötig (offline-first PWA) |
| Framework | **TanStack Router** (pure Vite) | File-based Routing mit Type-Safety, Loader-API verträgt sich nativ mit `@tanstack/react-query`. Kein TanStack Start — kein Server-Bedarf. |
| Sprache | TypeScript 5.4 strict | Pflicht — Routes, Forms, Tables sind ohne TS schmerzhaft |
| Styling | **Tailwind CSS 3.4 + tailwindcss-animate + @tailwindcss/container-queries** | Vorhanden, plus Container-Queries für die adaptive Card-Logik |
| UI-Kit | **shadcn/ui (`new-york`)** | Bereits konfiguriert (`components.json`) |
| Primitive | **Radix UI** | Kommt durch shadcn, ergänzt um Radix Colors für Tonleiter |
| Icons | **lucide-react** | Vorhanden |
| Fonts | Newsreader + Inter + JetBrains Mono via `@fontsource/*` (kein Google-CDN) | Offline-first |

### 1.2 Datenschicht

| Aufgabe | Tool |
|--|--|
| Persistenz lokal | **Dexie 4** (IndexedDB) — Saves, Karrieren, Saisonarchiv |
| Server-State / Cloud-Sync (opt-in) | **TanStack Query 5** |
| Client-State (UI, Theme, Match-Tick) | **TanStack Store** (`@tanstack/react-store`) |
| Forms | **TanStack Form** + Zod-Validierung |
| Tabellen | **TanStack Table 8** + **TanStack Virtual** |
| Search / Filter Debounce | **TanStack Pacer** |
| Offline-Strategie | **Workbox 7** über `vite-plugin-pwa` |

### 1.3 Tooling

- **ESLint flat config** + `eslint-plugin-tanstack-query` + `eslint-plugin-jsx-a11y`
- **Prettier** + **tailwindcss-plugin** (Klassen-Sort)
- **Vitest** (Unit) + **Playwright** (E2E, plus a11y-Scan via `@axe-core/playwright`)
- **Storybook 8** für Komponenten-Doku (ergänzt `library.jsx`)
- **Chromatic** als CI-Visual-Diff (optional, post-MVP)

---

## 2 · Drei-Schicht-Architektur

```
src/
├── ui/                  ← shadcn primitives + Aurelia-Brand-Atome
│   ├── button.tsx       ← shadcn Button + tabloid-tweaks
│   ├── card.tsx
│   ├── sheet.tsx
│   ├── crest.tsx        ← Aurelia, kein shadcn-Äquivalent
│   ├── jersey.tsx
│   ├── form-strip.tsx   ← S/U/N-Strip
│   └── …
├── components/          ← Domain-Composites (wiederverwendbar in Screens)
│   ├── player-card.tsx
│   ├── inbox-card.tsx
│   ├── hub-tile.tsx
│   ├── match-event.tsx
│   ├── neg-message.tsx
│   ├── press-answer-card.tsx
│   ├── player-bubble.tsx
│   └── …
├── features/            ← Komponierte Domain-Slices (eigene State + Tabellen)
│   ├── squad/
│   │   ├── squad-table.tsx        ← TanStack Table
│   │   ├── squad-virtual-list.tsx
│   │   └── squad.store.ts
│   ├── match/
│   ├── transfers/
│   └── …
├── routes/              ← TanStack Router File-Routing (= Screens)
│   ├── _app.tsx
│   ├── hub.tsx
│   ├── inbox.tsx
│   ├── squad.index.tsx
│   ├── match.$matchId.tsx
│   ├── tactics.tsx
│   └── …
├── lib/
│   ├── db.ts            ← Dexie Schema
│   ├── theme.ts         ← Token-Auflösung, Klubfarb-Switch
│   ├── i18n/de.json
│   └── utils.ts
└── stores/              ← TanStack Store-Instanzen
    ├── match.store.ts
    ├── ui.store.ts
    └── save.store.ts
```

**Regel:** `ui/` darf nur Tailwind + Radix kennen. `components/` darf
`ui/` importieren. `features/` darf `components/` + Stores importieren.
`routes/` darf alles importieren. **Niemals andersrum.**

---

## 3 · TanStack-Integration je Feature

### 3.1 TanStack Router

- **Filebasierte Routes** unter `src/routes/`.
- Routen-Loader laden Daten parallel zu Code-Splitting; `loader()` ruft
  `queryClient.ensureQueryData(...)`.
- **Type-Safe Links** für alle Navigationen (z.B. Spielerdetail-Link
  prüft `playerId` zur Compile-Zeit).
- **Pending / Error UI** pro Route via `pendingComponent` /
  `errorComponent` — vermeidet Boilerplate für Skeletons.

| Route | Notiz |
|--|--|
| `/` | Redirect → letztes Karriere-Slot |
| `/onboarding/(country|club|manager)` | Stepper, 3 Substeps |
| `/hub` | Default Landing nach Onboarding |
| `/inbox` + `/inbox/$threadId` | Master-Detail (Mobile: Drawer) |
| `/squad` + `/squad/$playerId` | Master-Detail |
| `/squad/$playerId/heatmap/$matchId` | Heatmap-Detail (T2.1) |
| `/match/$matchId` (Layout) | mit `/feed`, `/ticker`, `/lineup` |
| `/match/$matchId/halftime` | Modal-Route |
| `/tactics`, `/lineup` | Tabs als Search-Param |
| `/finance`, `/stadium`, `/transfers` | |
| `/board`, `/press/$conferenceId` | |
| `/saves` | Karriereverwaltung |
| `/settings` | |
| `/dev/library` | Storybook-Mirror, nur in `import.meta.env.DEV` |

### 3.2 TanStack Query

- **One QueryClient**, default `staleTime: 30s`, `gcTime: 10min`.
- **Persistenz** via `@tanstack/query-async-storage-persister` →
  IndexedDB, sodass beim Offline-Reload die Caches vorhanden sind.
- **Optimistic Mutations** für:
  - Inbox-Aktion (Annehmen/Vertagen/Ablehnen)
  - Transferangebot-Submit (T1.2)
  - Vertragsverhandlung-Submit
  - Pressekonferenz-Antwort (T1.3)
- **`useQuery`-Keys** sind hierarchisch:
  `['saves']`, `['saves', slotId]`, `['saves', slotId, 'squad']`, etc.
- **`useSuspenseQuery`** im Master-Detail (zusammen mit Route-Loader),
  nie mit `enabled: false`.
- **Mutation-Side-Effects** invalidieren konservativ (nur die betroffene
  Liste, nicht den Root-Key).

### 3.3 TanStack Table (Tabellen-Kandidaten)

Headless, immer mit shadcn `<Table>` als Renderer.

| Screen | Spalten | Features |
|--|--|--|
| **03 Kader** | Trikotnr, Name, Pos, Alter, Str, Tal, Form, Vertrag | Sort, Group-by-Position, Filter (Pos/Alter), Pin-Spalte „Name", Virtual Scrolling ab 30 Reihen |
| **22 Scouting** | Spielername, Klub, Liga, Skala 1-5, Status | Multi-Sort, Spalten-Visibility-Toggle |
| **27 Profi-Modus** | 1-20 Attribute (28 Spalten!) | Horizontal Virtualization, Sticky-Left-Spalten, Color-Heatmap pro Zelle |
| **29 Transferbüro** | Spieler, Klub, Wert, Status, Frist | Filter-Drawer, Bulk-Aktion (Anbieten) |
| **30 Liga-Tabelle** | Sp, S, U, N, T, GT, Pkt | Sort default Pkt desc, Tiebreaker-Tooltips, Striped-Highlight für Eigenes Team |
| **31 Pokal-Bracket** | Nicht klassische Tabelle, sondern Tree | Kein Table — eigener `BracketTree`-Renderer; aber TanStack Tree-Queries für Datenfluss |
| **17 Statistiken** | Multi-Tab, eigene Tabellen pro Tab | Tab-State in Search-Param |

**Konvention:** Jede Tabelle hat eine `*-table.tsx` und eine
`*-columns.ts` Datei. Filterleiste sitzt in `*-toolbar.tsx`. Bei
> 50 Reihen → TanStack Virtual.

### 3.4 TanStack Form

Verwendet überall, wo es echte Eingabe gibt:

- **Onboarding** (Land, Klub, Manager) — 3 Formulare mit shared
  ZodSchema.
- **Spielervertrag-Verhandlung** (Screen 11) — `Gehalt`, `Laufzeit`,
  `Bonus`, `Klausel`; Live-Validation gegen Budget-Slice.
- **Pressekonferenz** (Screen 14, 36) — Choice-Field; serverseitige
  Validierung simuliert via Mutation.
- **Transfer-Gegenangebot** (Screen 38) — `Ablöse`, `Bonus`, `Klausel`,
  mit Beraterstress-Constraint.
- **Sponsoren-Verhandlung** (Screen 13).
- **Einstellungen** (Screen 34) — flach, aber Form für Persistenz.

Validierung **immer** mit Zod, gemeinsamer Schemas-Ordner
`src/schemas/*.ts`.

### 3.5 TanStack Virtual

- Inbox (potenziell 100+ Karten pro Save).
- Scouting (großer Talent-Pool).
- League-Table (klein, kein Virtual nötig).
- Match-Feed (long-running, scrolling) — Virtual + Sticky-Header pro
  Minute.
- Saison-Album (Bilder-Grid).

### 3.6 TanStack Store

- `matchStore` — `minute`, `score`, `events`, `xg`, `fatigueByPlayer`,
  `tempo`, `paused`. Wird vom Match-Tick aktualisiert; Halftime-Sheet
  liest live.
- `uiStore` — `themeKey` (`A_hafenstadt` etc.), `scheme` (light/dark/auto),
  `density` (kompakt/profi), `motionPref` (auto/reduce), `tweaksOpen`.
- `saveStore` — aktive `slotId`, Quick-Save-Trigger.

**Warum Store statt Query?** Diese Daten sind nicht remote, sondern
*UI-Tick-State*. Query wäre overkill.

### 3.7 TanStack Pacer

- Such-Inputs in Scouting, Transferbüro, Kader-Filter → `debounce(200ms)`.
- Slider in Finanzen / Tactics → `throttle(60ms)` für Live-Tooltip,
  `debounce(400ms)` für Persistenz-Write.
- Match-Tempo-Button → `throttle(100ms)` gegen Spam.

---

## 4 · Komponenten-Extraktion

### 4.1 Vorhandene Atome (kein Refactor nötig, nur Port)

Stand `COMPONENTS.md`:

| Atom | Datei (Prototyp) | Port nach |
|--|--|--|
| `Crest` | `ui.jsx` | `ui/crest.tsx` |
| `Portrait` | `ui.jsx` | `ui/portrait.tsx` |
| `Jersey` | `identity.jsx` | `ui/jersey.tsx` |
| `PlayerToken` | `identity.jsx` | `ui/player-token.tsx` |
| `StrBar`, `Talent`, `FormStrip`, `PosPill` | `ui.jsx` | `ui/data-atoms.tsx` |
| `PillBtn`, `LevyChip`, `TraitPill`, `OutcomeChip`, `OfferChip` | div. | `ui/chips.tsx` |
| `FormationPitch`, `MiniPitch`, `StadiumPlot` | `ui.jsx` | `ui/pitch.tsx`, `ui/stadium-plot.tsx` |
| `StandSideView`, `StadiumTypePlan`, `CapacityBar` | `stadium.jsx` | `ui/stadium/*` |
| `Sparkline`, `BreakBar`, `LiveXgStrip` | div. | `ui/charts.tsx` |
| `AttrBar`, `Attr20`, `TeamRadar` | `team.jsx`, `compare.jsx` | `ui/stats.tsx` |
| `MoodFace` | `ui.jsx` | `ui/mood-face.tsx` |
| `Glyph*` (Roof, Seat, Stand, …) | `stadium.jsx` | `ui/glyphs/*.tsx` |
| Inline Icon-Set `I` | `ui.jsx` | **Ersetzen** durch `lucide-react`-Imports + eigene SVGs für Spezial-Glyphen |

### 4.2 Zu extrahierende Composites (aktuell inline)

Reihenfolge nach Nutzungs-Frequenz × Klarheit:

| # | Composite | Props-Skizze | Verwendet in Screens |
|--|--|--|--|
| 1 | **`PlayerCard`** | `{ player, dense?, withForm?, withContract?, onClick? }` | 03, 16, 18, 21, 22, 33 |
| 2 | **`HubTile`** | `{ icon, label, sub, flag?, href }` | 01, Desktop-Hub |
| 3 | **`InboxCard`** | `{ tone, from, title, body, time, actions[] }` | 02, Desktop |
| 4 | **`MatchEvent`** | `{ min, kind, headline, sub, score? }` | 05, 39 |
| 5 | **`StatStrip`** | `{ left, right, label, mode? }` | 04, 25, 26 |
| 6 | **`PlayerBubble`** | `{ player, mood, line, reactions[] }` | 37 |
| 7 | **`NegotiationMessage`** | `{ side, who, when, offer, msg }` | 38, 11, 13 |
| 8 | **`PressAnswerCard`** | `{ tone, quote, predictions[], onPick }` | 14, 36 |
| 9 | **`TabloidCover`** | `{ tone, headline, subtitle, photo, facts[], stamp? }` | 35, 41 |
| 10 | **`HomeMatchEconomy`** | `{ blocks[], onPriceChange }` | (T2.4, neu) |
| 11 | **`SponsorPyramid`** | `{ tiers[] }` | 43 |
| 12 | **`CareerTimeline`** | `{ events[] }` | 40 |
| 13 | **`PlayerHeatmap`** | `{ playerId, matchId, seed }` | 39 |

Jede Komponente bekommt:
- TypeScript-Props mit JSDoc
- Storybook-Story mit allen Varianten
- `@axe-core/react` Test
- Visuelle Variations-Tabelle in `dev/library`

### 4.3 shadcn / Radix Mapping pro Komposite

Welche shadcn-Primitives kapsel ich in welchem App-Composite? Single
Source of Truth für Code-Reviews.

| App-Composite | shadcn Primitives | Radix Primitives (durch shadcn) |
|--|--|--|
| `PlayerCard` | `Card`, `Badge`, `Avatar`, `Tooltip`, `Progress` | `Tooltip.Root` |
| `HubTile` | `Card`, `Button` | — |
| `InboxCard` | `Card`, `Badge`, `Button`, `DropdownMenu` | `DropdownMenu.Root` |
| `MatchEvent` | `Card`, `Badge` | — |
| `StatStrip` | `Progress`, `Tooltip` | — |
| `PlayerBubble` | `Card`, `Button`, `Avatar` | — |
| `NegotiationMessage` | `Card`, `Badge` | — |
| `PressAnswerCard` | `Card`, `Button`, `Tooltip` | `Tooltip.Root` |
| `TabloidCover` | `AspectRatio`, `Badge` | `AspectRatio.Root` |
| `SponsorPyramid` | `HoverCard` (Sponsor-Detail), `Badge` | `HoverCard.Root` |
| Onboarding-Stepper | `Tabs`, `Form`, `Input`, `Select`, `RadioGroup`, `Button` | `Tabs.Root`, `RadioGroup.Root` |
| Halbzeit-Sheet | **`Sheet`** (Drawer von unten), `Tabs`, `Button` | `Dialog.Root` (Sheet ist Dialog) |
| Pressekonferenz | `Dialog`, `RadioGroup`, `Button`, `Tooltip` | `Dialog.Root`, `RadioGroup.Root` |
| Spielervergleich | `Tabs`, `Separator`, `ScrollArea` | `Tabs.Root`, `ScrollArea.Root` |
| Taktik-Slider | `Slider`, `Switch`, `Toggle`, `Label` | `Slider.Root`, `Switch.Root` |
| Finanzen | `Tabs`, `Slider`, `Tooltip`, `Card` | |
| Stadion-Tabs | `Tabs`, `Card`, `Sheet` (Slot-Detail) | |
| Squad-Filter | `Popover`, `Command`, `Checkbox`, `Slider` | `Popover.Root` |
| Match-Tab-Switch | `Tabs` mit `searchParam` | `Tabs.Root` |
| Inbox-Detail | `Sheet` (mobile) / inline (desktop) — Adaptive | |
| Tooltip-globally | `Tooltip` | mobile-fallback: **kein Tooltip**, statt dessen Press-and-Hold-Popover |
| Toasts | `Toast` (Sonner über shadcn) | |
| Skeletons | `Skeleton` | |
| Avatare | `Avatar` (fällt zurück auf `<Portrait>`) | |
| Scrollbare Listen | `ScrollArea` | |

**Nicht zu shadcn-zwingen:** Crest, Jersey, PlayerToken, FormationPitch,
StadiumPlot, TabloidCover, alle `Glyph*` — sind domänenspezifisch und
gehören in `ui/`, nicht in `ui/shadcn/`.

### 4.4 Bibliotheks-Storybook

`src/dev/library/` ersetzt `library.jsx`. Stories pro Atom + Composite.
Sieben Kategorien wie im Prototyp. `args`/`controls` werden zu echtem
Storybook-Tooling. Visual-Regression via Chromatic (optional).

---

## 5 · Responsive-Strategie

### 5.1 Drei Tiers

| Tier | Range | Layout-Strategie |
|--|--|--|
| **Phone** | `≤ 768 px` | Single-Column, Bottom-Sheet für Detail, Sticky-CTA, kein Bottom-Tab-Bar (Advance-Button wäre verdeckt) |
| **Tablet** | `769 – 1199 px` | 2-Column: Liste links 360px + Detail rechts; kein Right-Rail |
| **Desktop** | `≥ 1200 px` | 3-Column: Left-Rail 220px (Navigation) + Main + Right-Rail 320px (Context) |

### 5.2 `AdaptiveShell` (statt zwei separater Implementierungen)

Eine einzige Shell-Komponente:

```tsx
<AdaptiveShell
  nav={<NavRail />}            // links, ab tablet sichtbar
  context={<MatchContext />}   // rechts, ab desktop sichtbar
  bottomActions={<AdvanceBar />} // unten, nur phone
>
  <Outlet />
</AdaptiveShell>
```

**Hide-Strategie:** `hidden md:flex` / `flex md:hidden` Tailwind.
**Kein** JS-basiertes Viewport-Sniffing — alles CSS.

### 5.3 Container-Queries pro Karte

Wo eine Karte in unterschiedlichen Containern landet (Phone-Hub vs
Desktop-Hub-Rail), entscheidet die *Karte*, nicht die Page:

```tsx
<div className="@container/hub-tile">
  <Card className="grid grid-cols-1 @[20rem]:grid-cols-2 …">
```

Konkret:
- **`HubTile`** — Stack auf Phone, 2-Spalten ab `@[20rem]`
- **`InboxCard`** — Vertikal auf Phone, Inline-Aktionen ab `@[24rem]`
- **`PlayerCard`** — Dense-Variant ab `@[18rem]`, Profile-Variant ab
  `@[28rem]`
- **`StatStrip`** — Stacked-Bar auf Phone, Side-by-Side ab `@[26rem]`
- **`SponsorPyramid`** — Vertikal auf Phone, 5 Bänder waagerecht ab
  `@[36rem]`
- **`FormationPitch`** — Quer auf Desktop ab `@[40rem]`

**Plugin:** `@tailwindcss/container-queries`.

### 5.4 Touch / Pointer / Hover

| Affordance | Phone | Desktop |
|--|--|--|
| Inbox-Aktion | 4 Pill-Buttons (44px) | Dieselben, aber Hover-State sichtbar |
| Tooltip | **Press-and-Hold** öffnet Popover | Mouse-Hover öffnet Tooltip |
| Drag-Reorder (Lineup) | Long-press → drag | Click-and-drag |
| Spielerdetail-öffnen | Sheet von unten | Right-Rail füllt sich |
| Filter | Popover unten als Sheet | Popover inline |

Erkennung: `@media (hover: hover)` für hover-only Affordanzen,
`@media (pointer: coarse)` für Touch-Boost (44px min-Targets).

### 5.5 200%-Zoom + Reflow

- Kein horizontales Scrollen in den oberen 60 % der Phone-Screens.
- Tabellen werden ab 200 % zu Card-Lists (TanStack Table → Card-Renderer
  unter `@[20rem]` Breite).
- Match-Feed bleibt vertikal, Score-Strip nicht-fixed.

### 5.6 Fluid Type

`clamp()` für Hero-Headlines (Tabloid, Tunnel, Hub-Kicker):

```css
font-size: clamp(1.75rem, 4vw + 1rem, 3.25rem);
```

UI-Größen bleiben fest (Inter/Mono): `text-sm`, `text-base`, `text-lg`.

---

## 6 · Theming & Tokens

### 6.1 CSS-Variablen-Layer

`app/globals.css` enthält den Block aus dem Kommentar in
`tailwind.config.ts`. Klubfarbe wird per Data-Attribute am Root-Element
gescoped:

```html
<html data-theme="A_hafenstadt" data-scheme="light">
```

`lib/theme.ts` exportiert `applyTheme(themeKey, scheme)` der die HSL-
Variablen im aktiven Root-Style überschreibt.

### 6.2 Migration: `t.x` → `var(--x)`

Aktuell liest der Prototyp inline aus JS (`t.accent`, `t.bg`). Nicht
shadcn-idiomatisch. Migrations-Schritt:

1. **Phase 1** (während Atom-Port): Komponenten nehmen `theme`/`scheme`
   Props weg, lesen über Tailwind-Klassen (`bg-card text-foreground`).
2. **Phase 2** (Klubthemen): `[data-theme="A_kaltenbach"]`-Selector im
   CSS-Layer setzt `--accent` etc.
3. **Phase 3** (Tweaks-Panel): Klubfarbe-Switch ruft `applyTheme()` und
   persistiert in `uiStore`.

### 6.3 Schemes

| Scheme | Trigger |
|--|--|
| `light` | Default |
| `dark` | `class="dark"` an `<html>`, gesetzt von `uiStore` |
| `auto` | `@media (prefers-color-scheme: dark)` |
| `forced-colors` | Win-High-Contrast — Akzent → `Highlight`, Ink → `WindowText` (Phase-4 Polish) |

---

## 7 · State-Management-Inventar

| Slice | Tool | Persistenz |
|--|--|--|
| `matchStore` (Tick, xG, Events) | TanStack Store | nur im Memory, nach Match-Ende in Dexie geschnappt |
| `uiStore` (Theme, Scheme, Density) | TanStack Store | LocalStorage |
| `saveStore` (aktiver Slot) | TanStack Store | LocalStorage |
| Squad / Inbox / Finance / Stadium / Transfers | TanStack Query (Dexie als „server") | IndexedDB |
| Forms (lokale Inputs) | TanStack Form | flüchtig |
| Tab- & Filter-State | URL Search-Params | URL |

**Regel:** Wenn der State *bookmarkable* sein soll (Filter, Tab,
Sortierung) → URL Search-Param. Wenn er *karriereweit* persistiert
werden soll → Dexie via Query. Wenn er *flüchtig* ist (Sheet-offen,
Hover) → React state.

---

## 8 · Dexie-Schema

```ts
db.version(1).stores({
  saves:        '++id, name, clubId, createdAt, lastPlayedAt',
  squad:        '[saveId+playerId], saveId, position, age',
  fixtures:     '[saveId+matchId], saveId, date, type',
  inbox:        '[saveId+threadId], saveId, readAt, tone',
  finance:      '[saveId+monthKey], saveId',
  staff:        '[saveId+staffId], saveId, role',
  tactics:      '[saveId+slotId], saveId',
  matchEvents:  '[saveId+matchId+seq], saveId, matchId',
  heatmaps:     '[saveId+matchId+playerId], saveId',
  sponsors:     '[saveId+sponsorId], saveId, tier',
  saveSnapshots:'++id, saveId, takenAt',   // für Quick-Save
})
```

Jede Tabelle bekommt einen Hook (`useSquad(saveId)`,
`useInbox(saveId)`), der `useSuspenseQuery` mit Dexie-Live-Query
(`liveQuery` → Observable → Query-Adapter) verheiratet.

---

## 9 · Routing-Pattern

### 9.1 Master-Detail mit Adaptive Layout

`/squad` Layout:

```
PHONE                    TABLET / DESKTOP
┌──────────────┐         ┌────────┬─────────┐
│ Squad-List   │         │ Squad  │ Player  │
│              │         │ Table  │ Detail  │
│ (tap→detail) │         │        │         │
└──────────────┘         └────────┴─────────┘
```

Implementierung: Eine Route `routes/squad/_layout.tsx` rendert links
immer die Liste; `routes/squad/$playerId.tsx` ist Outlet, auf Phone
ein `<Sheet>` von unten, auf Desktop inline.

### 9.2 Modal-Routen

Halbzeit, Pressekonferenz, Inbox-Detail (Phone) — alle als
`useNavigate({to: …, mask: …})` mit Dialog/Sheet-Outlet.

### 9.3 Match-Layout (Tabs als Search-Param)

`/match/$matchId?tab=feed` — TabsList nutzt
`useSearch()` + `useNavigate()`. Reload behält Tab.

---

## 10 · A11y-Pflichten (per Komponente)

Aus `ACCESSIBILITY.md` + neue Items:

| Komponente | Pflicht |
|--|--|
| Alle Icon-only Buttons | `aria-label` |
| `FormStrip` | Buchstabe (S/U/N) + Farbe, nicht nur Farbe |
| `StrBar` | Numerische Ziffer immer sichtbar |
| `Sheet` (Halbzeit) | Keyboard-Trap, Esc schließt |
| `Dialog` (Press) | RadioGroup mit `aria-describedby` für Outcome-Pills |
| Tabloid-Cover | `role="img"` mit `aria-label="<headline>"`, Live-Region für Stempel |
| Tunnel-Moment, Siegerehrung | Reduced-Motion fallback → Final-Frame |
| Slider | Keyboard-Steps ±1, ±10 (Shift), Live-Tooltip mit `aria-live="polite"` |
| Charts | `<title>` und `<desc>` im SVG, optional `aria-describedby` mit Daten-Zusammenfassung |
| Tooltip auf Touch | Verboten — Press-and-Hold-Popover |

CI-Pflicht: `@axe-core/playwright` läuft auf jeder Storybook-Story und
auf den 12 Kern-Screens.

---

## 11 · Performance-Budget

| Metrik | Ziel |
|--|--|
| Cold-Start Hub (offline, gecached) | < 1.5 s LCP |
| Match-Tick → UI-Update | < 50 ms |
| Squad-Table Sort (700 Reihen) | < 80 ms |
| Bundle initial | < 220 kB gzipped JS, ohne Match-Engine |
| Match-Engine Worker | Separater Chunk, lazy import beim Match-Start |
| Image-Assets | 0 (alles SVG inline / proceduraly) |
| Web-Vitals | LCP < 2.5 s · INP < 200 ms · CLS < 0.05 |

**Stellschrauben:**
- `react-virtual` für Squad / Inbox / Scouting
- `Suspense`-Boundary pro Route → Skeleton statt Spinner
- Match-Sim als Web-Worker (kein UI-Lag bei Tick)
- Code-Split per Route via TanStack Router default

---

## 12 · PWA / Offline

- **Workbox 7** via `vite-plugin-pwa`
- Precache: index.html + Routen-Chunks + Fonts
- Runtime-Cache: nichts (keine Remote-Resources)
- **Update-Flow:** neue Version → Toast „Update verfügbar" →
  `skipWaiting` + reload nur auf Klick.
- **iOS-Install-Banner** als persistenter Hinweis im Saves-Screen (10),
  bereits im Prototyp.
- **Manifest:** Name „Aurelia Premier", Theme-Color `#b7301b`,
  Background-Color `#f4ede0`, Icons 192/512 (procedural SVG → PNG-Export
  im Build).

---

## 13 · Testing-Strategie

| Schicht | Tool | Coverage-Ziel |
|--|--|--|
| Atoms (`ui/`) | Vitest + Testing Library | 90 % statements |
| Composites (`components/`) | Vitest + Storybook-Test-Runner | 80 % |
| Features (`features/`) | Vitest + MSW (falls Cloud-Sync) | 70 % |
| Stores (`stores/`) | Vitest pure | 95 % |
| Routes (E2E) | Playwright | 12 Kern-Screens als smoke |
| A11y | `@axe-core/playwright` + Storybook addon | 0 ernste Verstöße |
| Visual | Chromatic (optional) | — |

---

## 14 · Migration in 4 Meilensteinen

### M1 · Fundament (Wochen 1-2)

**Ziel:** Leeres Shell, Theme-Atome, Routing-Skelett.

- [ ] Vite + TanStack Start + Router scaffold
- [ ] Tailwind + shadcn `init`, `tailwind.config.ts` + `components.json`
      aus Bundle übernehmen
- [ ] CSS-Variablen-Layer in `app/globals.css`
- [ ] shadcn-Primitives generieren: Button, Card, Badge, Tabs, Sheet,
      Dialog, Tooltip, ScrollArea, Toast, Skeleton, Slider, Switch,
      Toggle, DropdownMenu, Avatar, Progress, Separator, Form, Input,
      Select, RadioGroup, Checkbox, Popover, HoverCard, AspectRatio
- [ ] `ui/` Atome porten: Crest, Portrait, Jersey, PlayerToken,
      StrBar, Talent, FormStrip, PosPill, FormationPitch,
      MiniPitch, StadiumPlot, Glyph*
- [ ] `lib/theme.ts` mit Klubfarb-Switch (`applyTheme`)
- [ ] Storybook + erste Stories für die Atome
- [ ] Dexie-Schema + erste Seeds (8 Klubs, 1 Save-Slot mit Beispiel-Kader)
- [ ] CI: TypeScript, ESLint, Vitest, Playwright-Smoke

**Definition of Done M1:** Eine leere `/hub`-Route zeigt
`<HubTile>`-Atome mit Klubfarbe + Theme-Switch funktioniert.

### M2 · Kern-Schleife (Wochen 3-4)

**Ziel:** Karte-zu-Karte spielbar, Match-Loop funktioniert.

- [ ] Composites: `HubTile`, `InboxCard`, `PlayerCard`, `MatchEvent`,
      `StatStrip`
- [ ] Routes: `/hub`, `/inbox`, `/squad`, `/match/$matchId/feed`,
      `/match/$matchId/halftime`, `/match/$matchId/lineup`
- [ ] TanStack Query Hooks: `useSquad`, `useInbox`, `useFixtures`
- [ ] TanStack Table: Squad-Table (mit Sort, Filter, Group-by-Position)
- [ ] TanStack Form: Halbzeit-Formular (Formation, Mentalität, Wechsel)
- [ ] TanStack Store: `matchStore` mit synthetischem Tick (1s = 1 Min)
- [ ] `AdaptiveShell` v1 (Phone + Tablet)
- [ ] Container-Queries auf `HubTile`, `InboxCard`, `PlayerCard`
- [ ] Halbzeit-Sheet (Radix Dialog / shadcn Sheet)

**DoD M2:** Nutzer kann Onboarding skippen, ins Hub, ein Spiel starten,
durch die 90 Minuten ticken, Halbzeit-Sheet öffnen, ein Tempo wechseln,
beim Anpfiff den Schluss-Stand sehen.

### M3 · Tiefe & Identität (Wochen 5-6)

**Ziel:** Anstoss-Gefühl, Verhandlungen, Tabloid.

- [ ] Composites: `PressAnswerCard`, `NegotiationMessage`, `TabloidCover`,
      `PlayerBubble`
- [ ] Routes: `/board`, `/press/$id`, `/transfers`,
      `/squad/$playerId` (mit Profi-Toggle), `/tactics`, `/finance`,
      `/stadium`
- [ ] TanStack Form: Vertragsverhandlung, Sponsoring, Press-Choice
- [ ] TanStack Query Mutations: Inbox-Action, Vertrag-Submit,
      Press-Pick mit Optimistic Update
- [ ] Pressekonferenz mit Verzweigung (T1.3)
- [ ] Transfer-Gegenangebot-Loop (T1.2)
- [ ] Tabloid-Cover-Renderer (T1.1) + Saison-Album
- [ ] Player-Heatmap (Canvas, deterministisch)
- [ ] Profi-Modus: TanStack Table mit 28 Spalten + horizontal
      Virtualization

**DoD M3:** Nach einem Heimspiel ploppt ein Tabloid-Cover ins Postfach,
nach Cup-Niederlage gibt's eine Press-Konferenz mit 5 Fragen.

### M4 · Politur, Responsive Desktop, A11y, PWA (Wochen 7-8)

**Ziel:** Production-Ready.

- [ ] `AdaptiveShell` v2 mit Right-Rail (Desktop)
- [ ] Container-Queries auf allen Composites
- [ ] Desktop-Adaptionen aus `responsive.jsx` als Layout-Varianten
      derselben Komponenten
- [ ] Tunnel-Moment + Siegerehrung als Cinematic-Routes
- [ ] Reduced-Motion-Audit aller Animationen
- [ ] A11y-Pass via axe + manuelle Screenreader-Checks
- [ ] Workbox + Manifest + Update-Toast
- [ ] iOS-Install-Banner final
- [ ] Storybook-Library komplett, in `dev/library` deploybar
- [ ] Tweaks-Panel (Q.2) mit Klubfarb-, Schema-, Density-Switch
- [ ] Tweaks-Persistenz im `uiStore`

**DoD M4:** Lighthouse PWA Score 100, axe 0 ernste Verstöße,
LCP < 2.5 s auf Mid-Range Android, alle 45 Screens auf Phone und Desktop
ohne Layout-Bruch.

---

## 14a · i18n-Strategie (DE + EN)

### Setup

- **Library:** `@formatjs/intl` (light, framework-agnostisch). Kein
  `react-intl` — wir nutzen `Intl` direkt + dünne Hook-Schicht.
- **Locales:** `de-DE` (primär), `en-GB` (sekundär). Switcher als Tweak +
  in Einstellungen.
- **Dateien:** `src/i18n/de.json`, `src/i18n/en.json` — flache Key-Struktur
  mit Punkt-Namespace (`hub.advance`, `inbox.empty.title`,
  `match.event.goal`).
- **Hook:** `useT()` gibt `(key, vars?) => string` zurück. Pluralregeln
  via ICU MessageFormat (`{count, plural, one {Tag} other {Tage}}`).
- **Zahlen + Datum:** ausschließlich `Intl.NumberFormat` /
  `Intl.DateTimeFormat` mit aktivem Locale — `12.500 €` vs `€12,500`
  funktioniert ohne extra Code.

### Vokabular

Aus dem Brief: harte Übersetzungs-Tabelle, nicht eigenständig.

| Key | de-DE | en-GB |
|--|--|--|
| `match.advance` | Anpfiff | Kick-off |
| `inbox.title` | Posteingang | Inbox |
| `board.confidence` | Vorstandsvertrauen | Board Confidence |
| `finance.levy` | Verbandsabgabe | League Levy |
| `stadium.addon` | Anbau | Stand Upgrade |
| `match.halftime` | Halbzeit | Half-time |
| `transfers.office` | Transferbüro | Transfer Office |
| `tactics.role` | Rolle | Role |

Tabloid-Schlagzeilen sind **nicht 1:1 übersetzbar** — `i18n/en.json`
bekommt eigene britisch-tabloide Headlines (Sun-Mirror-Register),
nicht die deutsche Übersetzung der deutschen Schlagzeile.

### Liefer-Scope im Design-System

- Vollständiges Key-System (~ 300 Keys geschätzt)
- DE komplett übersetzt
- EN nur für: Hub, Inbox, Squad, Match-Feed, Halftime, Settings,
  Tabloid-Cover (Sieg/Krise) — die Rest-Screens behalten DE-Strings mit
  TODO-Marker
- Sprache-Toggle als Tweak: `de` ↔ `en` mit Live-Re-Render

---

## 14b · Trikot-Generator (ausgebaut)

Aus dem Prototyp (`identity.jsx`) wird ein eigener Track in Phase 3
(M3 Tiefe & Identität). Erweiterungen:

| Feature | Status Prototyp | Im Design-System |
|--|--|--|
| 6 Muster (solid, stripes, hoops, sash, split, chevron) | ✅ | ✅ |
| 2 Tinkturen pro Trikot | ✅ | ✅ |
| Heim / Auswärts / Drittes Trikot | ✅ | ✅ |
| Sleeve-Akzent on/off | ✅ | ✅ |
| Wappen auf der Brust | ✅ | ✅ |
| Rückennummer-Schrift (Newsreader / Mono / Stencil) | ❌ | ✅ **neu** |
| Spielername-Schrift über Nummer | ❌ | ✅ **neu** |
| Sponsor-Brust + Sponsor-Ärmel-Slot | ❌ | ✅ **neu** (Pyramid-Tier) |
| Trikot-Vorschau auf 2D-Ticker live | ✅ | ✅ |
| Welcome-Moment zeigt fertiges Trikot | ✅ | ✅ |
| Saison-Trikot speichern + im Album anzeigen | ❌ | ✅ **neu** (T3.1 Track) |
| Export als PNG | ❌ | Nur angedeutet |

`Jersey` und `PlayerToken` bleiben die zwei wiederverwendbaren Bausteine
in `ui/`. Das Studio (`IdentityStudio`) wird zur Composite in
`features/identity/`.

---

## 14c · Scope-Matrix · gebaut vs. nur angedeutet

Klare Trennung, was im Design-System **vollständig produktionsreif**
geliefert wird vs. **als Mockup mit Stempel „angedeutet"**:

| Bereich | Status | Begründung |
|--|--|--|
| **Hub, Inbox, Squad, Onboarding, Saves, Settings** | ✅ Voll | Kern-Loop, alle Komponenten gebraucht |
| **Match-Feed (Reportage), Halbzeit, 2D-Ticker** | ✅ Voll | Match-UI komplett |
| **Pre-Match, Lineup, Lineup mit Rollen** | ✅ Voll | Match-Vorbereitung |
| **Tactics (15), Aufstellung (16), Rollen-Editor (28)** | ✅ Voll | Alle Taktik-Tabs UI-only |
| **Vertragsverhandlung, Press-Konf, Sponsoring, Vorstand** | ✅ Voll | Anstoss-Gefühl |
| **Tabloid, Pressekonferenz-Verzweigung, Halftime-Bubbles, Transfer-Loop** | ✅ Voll | Depth-of-Play |
| **Finanzen, Stadion, Transfer-Office, Liga-Tabelle, Pokal** | ✅ Voll | Wirtschafts-Loop |
| **Trikot-Generator + Welcome-Moment** | ✅ Voll | Identity-Track |
| **Stats (17) Multi-Tab** | ✅ Voll | Alle 5 Tabs als UI — Daten gemockt |
| **Scouting-Netzwerk** | ✅ Voll | Talente-Pool, Filter, Berichte — alles UI |
| **Heatmap / Karrierebogen / Saison-Album** | ✅ Voll | Datenarchiv |
| **A11y-Audit-Screen** | ✅ Voll | Glaubwürdigkeits-Anker |
| **Tunnel-Moment, Siegerehrung** | ✅ Voll | Kino-Momente |
| **Match-Engine-Tick (Live-Sim)** | 🟡 Mock | Synthetischer Tick, Status-Pill „Engine-Mock" |
| **KI-Verhalten (Gegner, Berater-Reaktion)** | 🟡 Mock | Deterministisches Skript hinter Fassade |
| **Cloud-Sync** | 🟡 UI-only | Pill + Toggle + Konflikt-Mock, **kein Code** |
| **Multiplayer / Live-Liga** | ❌ Nicht im Scope | |
| **3D-Match** | ❌ Nicht im Scope | |

**Visueller Anker für gemockte Engine:** Stempel-Komponente
`<TbdStamp>` mit rotiertem scharlachroten Tabloid-Stempel
„ENGINE · MOCK" — nur auf Match-Tick und KI-Reaktionen, nicht auf
UI-Screens. So bleibt für Reviewer klar, was UI vs. was Sim ist.

---

## 14d · Komponenten-Dokumentation: Storybook + Canvas

**Best Practice:** **Storybook 8** ist Industry Standard für
Design-Systeme — Shopify Polaris, IBM Carbon, GitHub Primer, Adobe
Spectrum, Atlassian, Microsoft Fluent nutzen alle Storybook. Es liefert:

- Komponenten-Playground mit `args`/`controls` (Live-Props)
- A11y-Addon (axe-Scan inline)
- Interaction-Tests (Play-Functions, Vitest-Backed)
- Visual-Regression via Chromatic
- MDX-Doku für Patterns / Do's & Don'ts
- Auto-Generated TypeScript-API-Doku aus Props

**Empfehlung: beide Surfaces, nicht entweder/oder.**

| Surface | Zweck | Audience |
|--|--|--|
| **Canvas-Library** (`library.jsx`, im Prototyp) | Pan-Zoom-Showcase aller Screens + Karten nebeneinander, einzigartig | Stakeholder, Designreview, Quick-Compare |
| **Storybook** | Komponenten-Playground, Props-Doku, A11y-Tests, MDX-Patterns | Entwickler:innen, Designer:innen im Iteration-Modus |

Die Canvas-Library bleibt im Design-System-HTML als Review-Surface;
Storybook entsteht parallel im Production-Codebase ab M1. Beide nutzen
**dieselben Komponenten** — keine Drift möglich.

---

## 15 · Risiken (offene Fragen geklärt)

| Risiko | Mitigation |
|--|--|
| **TanStack Form API ist v0.x** | Schema-First-Ansatz (Zod) macht spätere API-Änderungen handlebar. |
| **Container-Queries Browser-Support** | Caniuse ≥ 93 %. Fallback: regulär `lg:` Breakpoints. |
| **Dexie + TanStack Query Sync** | Eigener Adapter (`liveQueryToObservable`) — kleinen Wrapper schreiben, getestet. |
| **Tooltip auf Touch** | Komplette Vermeidung; alternative Affordance pro Komponente dokumentiert. |
| **Klubfarbe vs Kontrast** | Auerbach-Grün ist knapp 4.7:1 auf weißem Button-Text — A11y-Audit pro Klub. |
| **Inline-Theme-Migration** | Schrittweise pro Atom; Lint-Rule, die `t.x` als Verbot markiert. |
| **Match-Engine fehlt** | Synthetischer Tick für die 2-3 Beispiel-Match-Screens — Hinweis-Layer „Engine TBD" sichtbar. |

**Geklärte Fragen (19.05.):**

1. ✅ **Vite-pur**, kein TanStack Start.
2. ✅ **Cloud-Sync nur andeuten** — UI-Layer, kein Code: Sync-Status-Pill
   („Letzter Sync vor 3 h"), Sync-Toggle in Einstellungen, Konflikt-
   Dialog als Screen-Mockup. Kein Backend.
3. ✅ **i18n DE + EN.** Vollständige Key-Infrastruktur (`i18n/de.json`,
   `i18n/en.json`), Tweak-Toggle für Sprache, alle UI-Strings
   abstrahiert. Zahlen-/Datumsformat über `Intl`.
4. ✅ **Trikot-Generator dabei.** Heim/Auswärts/Drittes, 6 Muster,
   2 Tinkturen, optionaler Sleeve-Akzent, Rückennummer-Schriftwahl,
   Persistenz pro Save in Dexie. Welcome-Moment zeigt das fertige
   Trikot. (T3.4 ist bereits erledigt — Ausbau in Phase 3.)
5. ✅ **Match-Engine außerhalb Scope.** Wir liefern 2-3 Beispielscreens:
   Match-Feed (05), Halbzeit (06), 2D-Ticker (32). Tactics-Deep-Dive
   bekommt 2-3 Beispiele (15 Taktik + 16 Aufstellung + 33 Rollen-Chips)
   — alle weiteren Taktik-Tabs als „angedeutet" mit Klarheitsstempel.

---

## 16 · Anhang · Pakete-Manifest

```jsonc
{
  "dependencies": {
    "@tanstack/react-query": "^5.51.0",
    "@tanstack/react-query-persist-client": "^5.51.0",
    "@tanstack/query-async-storage-persister": "^5.51.0",
    "@tanstack/react-router": "^1.45.0",
    "@tanstack/react-router-with-query": "^1.45.0",
    "@tanstack/react-table": "^8.20.0",
    "@tanstack/react-virtual": "^3.10.0",
    "@tanstack/react-form": "^0.31.0",
    "@tanstack/react-store": "^0.5.0",
    "@tanstack/react-pacer": "^0.5.0",

    "@radix-ui/react-accordion": "^1.2.0",
    "@radix-ui/react-alert-dialog": "^1.1.0",
    "@radix-ui/react-aspect-ratio": "^1.1.0",
    "@radix-ui/react-avatar": "^1.1.0",
    "@radix-ui/react-checkbox": "^1.1.0",
    "@radix-ui/react-collapsible": "^1.1.0",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.0",
    "@radix-ui/react-hover-card": "^1.1.0",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-popover": "^1.1.0",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-radio-group": "^1.2.0",
    "@radix-ui/react-scroll-area": "^1.1.0",
    "@radix-ui/react-select": "^2.1.0",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-slider": "^1.2.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.0",
    "@radix-ui/react-toggle": "^1.1.0",
    "@radix-ui/react-toggle-group": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.0",

    "tailwindcss-animate": "^1.0.7",
    "@tailwindcss/container-queries": "^0.1.1",
    "@tailwindcss/typography": "^0.5.13",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.0",
    "lucide-react": "^0.460.0",

    "dexie": "^4.0.8",
    "dexie-react-hooks": "^1.1.7",
    "zod": "^3.23.0",
    "sonner": "^1.5.0",

    "@formatjs/intl": "^2.10.0",
    "@formatjs/intl-localematcher": "^0.5.0",

    "@fontsource/newsreader": "^5.0.0",
    "@fontsource/inter": "^5.0.0",
    "@fontsource/jetbrains-mono": "^5.0.0"
  },
  "devDependencies": {
    "vite": "^5.4.0",
    "@vitejs/plugin-react": "^4.3.0",
    "vite-plugin-pwa": "^0.20.0",
    "typescript": "^5.6.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",

    "vitest": "^2.1.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.0",
    "playwright": "^1.47.0",
    "@axe-core/playwright": "^4.10.0",
    "msw": "^2.4.0",

    "storybook": "^8.3.0",
    "@storybook/react-vite": "^8.3.0",
    "@storybook/addon-a11y": "^8.3.0",
    "@storybook/test-runner": "^0.19.0",

    "eslint": "^9.10.0",
    "eslint-plugin-react": "^7.36.0",
    "eslint-plugin-jsx-a11y": "^6.10.0",
    "@tanstack/eslint-plugin-query": "^5.50.0",
    "prettier": "^3.3.0",
    "prettier-plugin-tailwindcss": "^0.6.0"
  }
}
```

---

## 17 · Referenz-Index

- **`README.md`** — Bundle-Übersicht, Screens, Theming, A11y
- **`COMPONENTS.md`** — Komponenten-Index mit Props
- **`TASKS.md`** — Depth-of-Play-Roadmap (T1-T3, Q.1-Q.7)
- **`RATIONALE.md`** — Designentscheidungen
- **`ACCESSIBILITY.md`** — Kontrast-Audit + 6 Engineering-To-Dos
- **`plan.md`** — *dieses Dokument*

Letzte Änderung: 19. Mai 2026
