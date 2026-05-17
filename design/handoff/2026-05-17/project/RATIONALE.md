# Aurelia Premier — Design Rationale

> "Karte, nicht Tabelle. Anpfiff, nicht Start."

## Design intent

Aurelia Premier is a manager game for the tram-stop pocket and the Sunday couch — and both sessions must feel equally good. The entire interface vocabulary is built around a single verb-loop: **weiter zum nächsten Termin** (advance to next event). Anything that does not serve that loop — answering a card, confirming a substitution, blowing the whistle — recedes to the background.

We reject FM's spreadsheet wall and Top Eleven's gacha brightness. We are playing a tabloid: warm, earnest, with dry humour in the copy and quiet chrome in the layout. Cream paper, dark ink, one scarlet accent. Newsreader for headlines, Inter for UI, JetBrains Mono for numbers.

---

## Per-direction breakdown

### Direction A — Sonntagszeitung *(recommended)*
- **Pitch:** *"Cremepapier, dunkle Tinte, scharlachroter Akzent — wie die Sonntagsausgabe, nur dass Sie der Trainer sind."*
- **Palette:** paper `#f4ede0`, ink `#1a1410`, scarlet `#b7301b`. Dark scheme: sepia-black `#16110d` with warmed-up scarlet `#e8553b`.
- **Type:** Newsreader (display + narrative event copy), Inter (UI), JetBrains Mono (numbers, ticker).
- **Hits the brief:** office-as-cockpit warmth, tabloid headlines, restrained chrome.
- **Risk:** could read "too adult". Mitigated with italic Sonntagszeitung kicker on the Hub and serif punctuation throughout.

### Direction B — Schalterhalle
- **Pitch:** *"Marineblauer Grund, Messing, warmes Weiß — Vereinsbüro im Stil der Nachkriegsmoderne."*
- **Palette:** deep navy `#0e1c2e`, brass `#b4863a`, off-white card `#ffffff`.
- **Type:** Source Serif 4 + Inter.
- **Risk:** drifts toward FM coldness; the warmth depends entirely on the brass accent surviving small-screen rendering.

### Direction C — Hallenfunk
- **Pitch:** *"Mattschwarzer Schiefer, Neongrün, runde Kanten — mobil-nativ, OLED-erste Klasse."*
- **Palette:** slate `#0c0d10`, electric green `#22ee8b`, single font Inter.
- **Risk:** indistinguishable from generic sport-tracking apps; the tabloid humour does not land when the type is too neutral to carry parodic headlines.

---

## Per-screen breakdown

### 01 · Office Hub
Tabloid quote at the top as a kicker, prominent next-match card, four hub tiles (training, transfers, board pressure, finances) with a one-line scarlet "flag" for current friction. Advance button fills the thumb zone, prints day-offset (`+3 Tage`) so time-passage is visible. Deliberately **no bottom tab bar** — it would compete with the only important button.

### 02 · Inbox
Cards, not list rows. One glyph per sender type (Vorstand §, Presse ¶, Sponsor €, Scout ◎, Fans ♪) **in addition** to colour — required for WCAG. Actions are always the same four pills: Annehmen / Vertagen / Ablehnen / [Mehr]. Long press reveals deeper detail, the daumen-flow stays unbroken.

### 03 · Squad
We punish FM data density. Instead of 1–20 attribute grids: 1–10 strength bar with a numeric digit alongside (**never colour-only**), 4 talent stars, form as a decimal, contract date with a dot glyph for soon-expiring deals. Sort chips at the top. Heavy header, light cards.

### 04 · Pre-match
Side-by-side stat strip with accent column for the player's side. Key-player cards — one "in form" outlined in scarlet. Direct comparison as five glyph-and-colour-coded tiles (S/U/N), italic Sonntagszeitung line below as a narrative anchor. The **Anpfiff** CTA is the only scarlet block on the screen — it wins every comparison.

### 05 · Match report (text feed)
Newspaper typography. Minute left, glyph centre, headline + sub right. Goals 17px serif, everything else 14px. Segmented tab swaps between Reportage and 2D-Ticker — ticker is second tier, not the default. Mini-pitch icon for set pieces. Tempo and Pause buttons in the thumb zone.

### 06 · Halftime (bottom sheet)
Three required controls: Formation (horizontal scroll, 5 options), Mentality (Sichern / Ausgeglichen / Drücken), suggested substitution with "co-trainer empfiehlt" tag. "Mehr Taktik" expander hides deeper FM-style levers without making them the default.

### 07 · Finance
Two-layer P&L with segmented tabs (Betrieb / Investition / Verlauf). Verbandsabgabe lives **persistently top-right** as a `LevyChip` — the ongoing friction the player must never forget. Three sliders show live tooltips in Euros/season, not percent. Monthly balance prominent in serif.

### 08 · Stadium
Heraldic isometric plot with 5 slot pins (✓ vs +). Slot rows are **cards, not table rows** — ROI in green, cost in grey, status right-aligned. Klubdisco carries an explicit "Imagerisiko" note — we name the friction without enabling Anstoss-era tropes.

### 09 · Onboarding
Three screens, ~15–25 s each: country (real) → club (procedural, 6 options + dice reroll) → manager (initials chip, no photo upload). Progress bar at the top. The final "Karriere starten" button is **ink, not scarlet** — the club's own accent takes over from there.

### 10 · Save management
Three slot cards (one as a Plus-tile when empty). Per slot: quota bar from `navigator.storage.estimate()`, explicit Export / Import / Delete — all 44×44 px. Persistent offline note. Scarlet banner card for iOS users who haven't installed, with Safari share glyph.

---

## What I'd cut

- **Klubdisco slot.** Even worded politely, it smells like the Anstoss tropes the brief explicitly rules out. Replace with **Konferenzräume** (sponsor-events) or **Multifunktions-Arena** (concerts) — tabloid-friendly, PR-safe.
- **2D-Ticker content.** Shipping the tab structure now is fine; designing the actual ticker is post-MVP and deserves its own pass.
- **Cup bracket and league table screens.** The brief omitted them and so did I — same reason: they're a second-rank screen behind Hub / Inbox / Match, and they need their own typography pass to avoid becoming the FM data grid we're trying to escape.

---

## Verdict — recommendation

**Take Direction A — Sonntagszeitung.**

It's the only direction that carries the Anstoss DNA without copying Football Manager's cold blue-grey or sliding into Top Eleven gacha brightness. Newsreader headlines on cream paper are our shield against the "SaaS dashboard" look the brief explicitly forbids. The single accent prevents accent-inflation and gives the Anpfiff button a rare, almost ceremonial weight. Dark mode is not an afterthought — we shift paper into sepia-black and keep the scarlet, slightly warmed.

A few opinions I'll defend:
- **One accent, never two.** Scarlet is the only colour that earns a button background. Wins, losses, and warnings get their own glyph + colour pair, never the accent.
- **Serif on headlines, sans on chrome.** The minute the score header is in Inter, the tabloid voice dies. Newsreader earns its kilobytes.
- **Persistent offline affordance.** The cloud-off glyph next to the battery is small, deliberate, and never apologetic. Offline is a feature.

---

## Accessibility checks
- Body ink/paper contrast ≈ 14:1 (AA pass, AAA possible).
- Scarlet on paper ≈ 5.3:1 → safe for ≥ 14 pt bold body and white text on scarlet buttons (~5.8:1).
- All Form S/N/U and inbox type indicators dual-coded (colour + letter/symbol).
- Primary actions ≥ 44×44 px, Advance button 56 px tall.
- All key screens scroll vertically at 200 % zoom without horizontal overflow.
- All animations ≤ 220 ms and gated by `motion-safe:`.

## Language calibration
- *Anpfiff* (not "Start Match"), *Posteingang* (not "Notifications"), *Vorstandsvertrauen* (not "Board Confidence"), *Verbandsabgabe* (not "Tax"), *Anbau* (not "Module"), *Karte* (not "Notification card").
- Headline style: 4–8 words, active voice, no colon headers. *"Brody schießt sich in die Herzen"* — not *"Spieler-News: Brody"*.
- Numbers: `12.500 €`, `2,4 Mio. €`, form as decimal-comma (`7,4`).
