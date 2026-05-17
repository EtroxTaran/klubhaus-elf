# Design Handoff Changes — 2026-05-17

Source: https://api.anthropic.com/v1/design/h/mI0chwgxM7O_eC-k9BgQ8g
Baseline: design\handoff\2026-05-16
SHA-256: `cb63c648a4f6b1cce02ddbd6357c8f17e269c67a61c9e25c2529e87c3039d957`

## Summary (git diff --stat)

```
.../app.jsx"                                       |   22 +
 .../design_handoff_aurelia_premier/COMPONENTS.md"  |   13 +-
 .../design_handoff_aurelia_premier/RATIONALE.md"   |   17 +-
 .../design_handoff_aurelia_premier/TASKS.md"       |    8 +-
 .../design_handoff_aurelia_premier/a11y.jsx"       |   12 +-
 .../design_handoff_aurelia_premier/app.jsx"        |   71 +-
 .../design_handoff_aurelia_premier/data.jsx"       |   45 +-
 .../design_handoff_aurelia_premier/directions.jsx" |  152 +--
 .../design_handoff_aurelia_premier/identity.jsx"   | 1019 ++++++++++++++++++++
 .../design_handoff_aurelia_premier/index.html"     |    1 +
 .../design_handoff_aurelia_premier/library.jsx"    |   21 +-
 .../design_handoff_aurelia_premier/more.jsx"       |  208 ++--
 .../negotiations.jsx"                              |   14 +-
 .../screens-part1.jsx"                             |   41 +-
 .../screens-part2.jsx"                             |   95 +-
 .../design_handoff_aurelia_premier/settings.jsx"   |    5 +
 .../design_handoff_aurelia_premier/sponsor.jsx"    |   13 +-
 .../design_handoff_aurelia_premier/tactics.jsx"    |   56 +-
 .../design_handoff_aurelia_premier/team.jsx"       |   68 +-
 .../design_handoff_aurelia_premier/ui.jsx"         |   69 +-
 .../identity.jsx"                                  |  735 ++++++++++++++
 .../index.html"                                    |    1 +
 22 files changed, 2179 insertions(+), 507 deletions(-)
```

## Token / theme changes

_none_

## Narrative / spec changes (RATIONALE / COMPONENTS / ACCESSIBILITY / TASKS)

_none_

## Screen / prototype changes

_none_

## Other changed files

- M	"design\\handoff\\2026-05-16\\project/app.jsx"
- M	"design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/COMPONENTS.md"
- M	"design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/RATIONALE.md"
- M	"design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/TASKS.md"
- M	"design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/a11y.jsx"
- M	"design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/app.jsx"
- M	"design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/data.jsx"
- M	"design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/directions.jsx"
- M	"design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/index.html"
- M	"design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/library.jsx"
- M	"design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/more.jsx"
- M	"design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/negotiations.jsx"
- M	"design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/screens-part1.jsx"
- M	"design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/screens-part2.jsx"
- M	"design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/settings.jsx"
- M	"design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/sponsor.jsx"
- M	"design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/tactics.jsx"
- M	"design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/team.jsx"
- M	"design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/ui.jsx"
- M	"design\\handoff\\2026-05-16\\project/index.html"

## New files

- "design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/identity.jsx"
- "design\\handoff\\2026-05-17\\project/identity.jsx"

## Removed files

_none_

## Mapping checklist (fill in when patching — separate targeted PR)

- [ ] Tokens → `apps/web/src/styles/app.css`
- [ ] Atoms → `apps/web/src/components/atoms/**`
- [ ] Composites → `apps/web/src/components/composites/**`
- [ ] Screens + routes → `apps/web/src/screens/**`, `apps/web/src/routes/**`
- [ ] Sample data / copy → `apps/web/src/screens/fixtures.ts`, `apps/web/src/locales/{de,en}.ts`
- [ ] Update `docs/10-Architecture/09-Design-System.md` if architecture shifted

<details><summary>Full unified diff</summary>

```diff
diff --git "a/design\\handoff\\2026-05-16\\project/app.jsx" "b/design\\handoff\\2026-05-17\\project/app.jsx"
index 20daccd..f28e07b 100644
--- "a/design\\handoff\\2026-05-16\\project/app.jsx"
+++ "b/design\\handoff\\2026-05-17\\project/app.jsx"
@@ -165,6 +165,28 @@ function App(){
         </DCArtboard>
       </DCSection>
 
+      <DCSection id="identity"
+        title="Klub-Identität · Wappen- & Trikot-Generator"
+        subtitle="Interaktives Studio + Phone-Screen. Zwei Tinkturen, vier Schildformen, zehn Symbole, sechs Trikot-Muster — wirkt sofort auf Aufstellung, Tabelle und 2D-Ticker.">
+        <DCArtboard id="identity-studio" label="Studio · interaktiv · 1200×740" width={1200} height={740}>
+          <IdentityStudio/>
+        </DCArtboard>
+        <DCArtboard id="identity-phone-light" label="Phone · Klub-Identität · hell" width={410} height={864}>
+          <div style={{display:'grid', placeItems:'center', padding:10, background:'#f0eee9', height:'100%'}}>
+            <PhoneFrame theme="A" scheme="light">
+              <ScreenIdentity theme="A" scheme="light"/>
+            </PhoneFrame>
+          </div>
+        </DCArtboard>
+        <DCArtboard id="identity-phone-dark" label="Phone · Klub-Identität · dunkel" width={410} height={864}>
+          <div style={{display:'grid', placeItems:'center', padding:10, background:'#f0eee9', height:'100%'}}>
+            <PhoneFrame theme="A" scheme="dark">
+              <ScreenIdentity theme="A" scheme="dark"/>
+            </PhoneFrame>
+          </div>
+        </DCArtboard>
+      </DCSection>
+
       <DCSection id="screens-a"
         title="Schlüsselscreens · Richtung A (empfohlen)"
         subtitle="Portrait 390×844 · hell + dunkel nebeneinander. Posteingang, Kader, Spiel, Halbzeit, Finanzen, Stadion.">
diff --git "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/COMPONENTS.md" "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/COMPONENTS.md"
index 08bef60..1d3da37 100644
--- "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/COMPONENTS.md"
+++ "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/COMPONENTS.md"
@@ -39,9 +39,17 @@ Procedural SVG-Wappen. Deterministisch aus `(shape, a, b, charge)`. Bevorzugt au
 **Datei:** `ui.jsx` · **Props:** `name: string`, `size?: number=48`, `variant?: 'staff'|'player'`
 Initialen-Avatar aus den ersten Buchstaben des Namens. Player-Variante setzt einen Akzent­ring. Niemals als Foto-Platzhalter benutzen — der Initialen-Look ist Absicht (keine Foto-Uploads in v1).
 
-### `WordmarkA` · `WordmarkB` · `WordmarkC`
+### `Wordmark`
 **Datei:** `directions.jsx` · **Props:** `size?: number=28`, `ink?: hex`, `accent?: hex`, `mono?: boolean`
-Die drei Direction-Schriftzüge. Nur für Direction-Vergleich, Onboarding-Splash und PWA-Manifest.
+Horizontaler Klub-Schriftzug für Onboarding-Splash und PWA-Manifest.
+
+### `Jersey`
+**Datei:** `identity.jsx` · **Props:** `pattern: 'solid'|'stripes'|'hoops'|'sash'|'split'|'chevron'`, `a: hex`, `b: hex`, `sleeveAccent?: bool=true`, `crest?: CrestProps`, `number?: str`, `name?: str`, `showBack?: bool`, `size?: number=200`
+Prozedurales Trikot-SVG. Bevorzugt aus `CLUB_REGISTRY[*].kit` ziehen: `<Jersey {...kitFor('FC Hafenstadt')} a={crest.a} b={crest.b}/>`. Vor- und Rückseite via `showBack`. Crest auf der Brust optional.
+
+### `PlayerToken`
+**Datei:** `identity.jsx` · **Props:** `kit: {pattern, sleeveAccent}`, `a: hex`, `b: hex`, `shirt: str`, `highlight?: bool`, `size?: number=36`, `accent?: hex`
+Trikot + Rückennummer-Badge — der einzige Spieler-Marker auf Spielfeldern (2D-Ticker, Lineup, Rollen-Editor). Hat eine Luminanz-Logik, damit die Nummer immer lesbar bleibt. Bei `highlight={true}` wird die Nummer scharlachrot hinterlegt.
 
 ---
 
@@ -256,6 +264,5 @@ Alle Stroke-only oder mit `fillOpacity`, akzeptieren `size`, `color`. Für die s
 
 ## Was NICHT extrahieren
 
-- Die **Direction-Vergleichs­karten** (`DirectionFrame` in `directions.jsx`) — nur für Design-Review. Werden in Production gelöscht.
 - Die **`DesignCanvas`-Wrapper** (`DCArtboard`, `DCSection`) — sind aus dem `design_canvas.jsx` Starter und gehören nicht in die App.
 - **`ClubHub`** in `more.jsx` — ist eine Variante von `ScreenHub`, nur für die Klubfarben-Demo. Production benutzt direkt `ScreenHub` mit theme-prop.
diff --git "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/RATIONALE.md" "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/RATIONALE.md"
index 88ce42e..2a0142f 100644
--- "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/RATIONALE.md"
+++ "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/RATIONALE.md"
@@ -12,24 +12,13 @@ We reject FM's spreadsheet wall and Top Eleven's gacha brightness. We are playin
 
 ## Per-direction breakdown
 
-### Direction A — Sonntagszeitung *(recommended)*
+### Sonntagszeitung
 - **Pitch:** *"Cremepapier, dunkle Tinte, scharlachroter Akzent — wie die Sonntagsausgabe, nur dass Sie der Trainer sind."*
 - **Palette:** paper `#f4ede0`, ink `#1a1410`, scarlet `#b7301b`. Dark scheme: sepia-black `#16110d` with warmed-up scarlet `#e8553b`.
 - **Type:** Newsreader (display + narrative event copy), Inter (UI), JetBrains Mono (numbers, ticker).
 - **Hits the brief:** office-as-cockpit warmth, tabloid headlines, restrained chrome.
 - **Risk:** could read "too adult". Mitigated with italic Sonntagszeitung kicker on the Hub and serif punctuation throughout.
 
-### Direction B — Schalterhalle
-- **Pitch:** *"Marineblauer Grund, Messing, warmes Weiß — Vereinsbüro im Stil der Nachkriegsmoderne."*
-- **Palette:** deep navy `#0e1c2e`, brass `#b4863a`, off-white card `#ffffff`.
-- **Type:** Source Serif 4 + Inter.
-- **Risk:** drifts toward FM coldness; the warmth depends entirely on the brass accent surviving small-screen rendering.
-
-### Direction C — Hallenfunk
-- **Pitch:** *"Mattschwarzer Schiefer, Neongrün, runde Kanten — mobil-nativ, OLED-erste Klasse."*
-- **Palette:** slate `#0c0d10`, electric green `#22ee8b`, single font Inter.
-- **Risk:** indistinguishable from generic sport-tracking apps; the tabloid humour does not land when the type is too neutral to carry parodic headlines.
-
 ---
 
 ## Per-screen breakdown
@@ -76,9 +65,9 @@ Three slot cards (one as a Plus-tile when empty). Per slot: quota bar from `navi
 
 ## Verdict — recommendation
 
-**Take Direction A — Sonntagszeitung.**
+**Sonntagszeitung — die einzige Richtung.**
 
-It's the only direction that carries the Anstoss DNA without copying Football Manager's cold blue-grey or sliding into Top Eleven gacha brightness. Newsreader headlines on cream paper are our shield against the "SaaS dashboard" look the brief explicitly forbids. The single accent prevents accent-inflation and gives the Anpfiff button a rare, almost ceremonial weight. Dark mode is not an afterthought — we shift paper into sepia-black and keep the scarlet, slightly warmed.
+It carries the Anstoss DNA without copying Football Manager's cold blue-grey or sliding into Top Eleven gacha brightness. Newsreader headlines on cream paper are our shield against the "SaaS dashboard" look the brief explicitly forbids. The single accent prevents accent-inflation and gives the Anpfiff button a rare, almost ceremonial weight. Dark mode is not an afterthought — we shift paper into sepia-black and keep the scarlet, slightly warmed.
 
 A few opinions I'll defend:
 - **One accent, never two.** Scarlet is the only colour that earns a button background. Wins, losses, and warnings get their own glyph + colour pair, never the accent.
diff --git "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/TASKS.md" "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/TASKS.md"
index 024a127..2e150ce 100644
--- "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/TASKS.md"
+++ "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/TASKS.md"
@@ -112,8 +112,12 @@ Frühjahrsplan. Vollscreen, kein Sheet.
 
 - Engine: 12 Schablonen × Spieler-Eigenschaft × Klub-Trope.
 
-### 🔵 T3.4 Trikot-Designer (heraldisch) · `L`
-Streifen + zwei Farben aus `CLUB_REGISTRY`. Erscheint auf 2D-Ticker + Lineup.
+### ✅ T3.4 Trikot-Designer (heraldisch) · `L`  — *erledigt Mai 2026*
+Streifen + zwei Farben aus `CLUB_REGISTRY`. Erscheint auf 2D-Ticker + Lineup +
+Aufstellung mit Rollen + Pre-Match. `identity.jsx` enthält `ScreenIdentity`
+(Phone-Editor) und `IdentityStudio` (Canvas-Studio); `Jersey` und `PlayerToken`
+sind die zwei wiederverwendbaren Bausteine. `CLUB_REGISTRY[*].kit` ist die
+neue Single-Source-of-Truth für Muster + Ärmelakzent.
 
 ### 🔵 T3.5 Vorsaison-Bühne · `L`
 Trainingslager-Wahl, 2 Testspiele, Frühform-Diagramm. ~5 min real, 4 Wochen
diff --git "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/a11y.jsx" "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/a11y.jsx"
index ce5c82a..a5fc8e2 100644
--- "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/a11y.jsx"
+++ "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/a11y.jsx"
@@ -17,15 +17,11 @@ function ScreenA11yAudit({theme='A', scheme='light'}){
   return (
     <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
       <ThemeCss theme={theme} scheme={scheme}/>
-      <header style={{padding:'4px 16px 8px'}}>
-        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
-          <div>
-            <div style={{fontSize:10.5,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>Audit · WCAG 2.2 AA</div>
-            <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:700, color:t.ink, lineHeight:1}}>Barrierefreiheit</SerifH>
-          </div>
+      <ScreenHeader theme={theme} scheme={scheme}
+        kicker="Audit · WCAG 2.2 AA" title="Barrierefreiheit"
+        right={
           <span style={{fontSize:11, color:t.ok, fontWeight:800, padding:'4px 10px', borderRadius:99, background:t.ok+'1f', letterSpacing:.4}}>✓ AA bestanden</span>
-        </div>
-      </header>
+        }/>
 
       <div style={{flex:1, overflowY:'auto', padding:'8px 16px 20px'}}>
         {/* Score card */}
diff --git "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/app.jsx" "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/app.jsx"
index 20daccd..51f3620 100644
--- "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/app.jsx"
+++ "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/app.jsx"
@@ -145,16 +145,6 @@ const SCREENS_FINAL = [
 function App(){
   return (
     <DesignCanvas>
-      <DCSection id="directions"
-        title="Visuelle Richtungen"
-        subtitle="Drei benannte Vorschläge im Vergleich. Empfehlung: Richtung A — Sonntagszeitung.">
-        <DCArtboard id="dirs" label="Vergleich · A · B · C" width={1200} height={1280}>
-          <div style={{padding:20, background:'#f0eee9'}}>
-            <DirectionsCompare/>
-          </div>
-        </DCArtboard>
-      </DCSection>
-
       <DCSection id="crests"
         title="Wappen-Grammatik"
         subtitle="shape × 2 Tinkturen × charge × optionales Motto — deterministisch je Klub.">
@@ -165,6 +155,49 @@ function App(){
         </DCArtboard>
       </DCSection>
 
+      <DCSection id="identity"
+        title="Klub-Identität · Wappen- & Trikot-Generator"
+        subtitle="Interaktives Studio + Phone-Screen. Zwei Tinkturen, vier Schildformen, zehn Symbole, sechs Trikot-Muster — wirkt sofort auf Aufstellung, Tabelle und 2D-Ticker.">
+        <DCArtboard id="identity-studio" label="Studio · Heim/Auswärts/Drittes · 1200×860" width={1200} height={860}>
+          <IdentityStudio/>
+        </DCArtboard>
+        <DCArtboard id="identity-phone-light" label="Phone · Klub-Identität · hell" width={410} height={864}>
+          <div style={{display:'grid', placeItems:'center', padding:10, background:'#f0eee9', height:'100%'}}>
+            <PhoneFrame theme="A" scheme="light">
+              <ScreenIdentity theme="A" scheme="light"/>
+            </PhoneFrame>
+          </div>
+        </DCArtboard>
+        <DCArtboard id="identity-phone-dark" label="Phone · Klub-Identität · dunkel" width={410} height={864}>
+          <div style={{display:'grid', placeItems:'center', padding:10, background:'#f0eee9', height:'100%'}}>
+            <PhoneFrame theme="A" scheme="dark">
+              <ScreenIdentity theme="A" scheme="dark"/>
+            </PhoneFrame>
+          </div>
+        </DCArtboard>
+        <DCArtboard id="identity-welcome-hafenstadt" label="Welcome-Moment · Hafenstadt · hell" width={410} height={864}>
+          <div style={{display:'grid', placeItems:'center', padding:10, background:'#f0eee9', height:'100%'}}>
+            <PhoneFrame theme="A" scheme="light">
+              <ScreenIdentityWelcome theme="A" scheme="light" clubId="hafenstadt" mgrName="Julia Lindquist" mgrInitials="JL"/>
+            </PhoneFrame>
+          </div>
+        </DCArtboard>
+        <DCArtboard id="identity-welcome-kaltenbach" label="Welcome-Moment · Kaltenbach · hell" width={410} height={864}>
+          <div style={{display:'grid', placeItems:'center', padding:10, background:'#f0eee9', height:'100%'}}>
+            <PhoneFrame theme="A" scheme="light">
+              <ScreenIdentityWelcome theme="A" scheme="light" clubId="kaltenbach" mgrName="Marek Brody" mgrInitials="MB"/>
+            </PhoneFrame>
+          </div>
+        </DCArtboard>
+        <DCArtboard id="identity-welcome-sauveterre-dark" label="Welcome-Moment · Sauveterre · dunkel" width={410} height={864}>
+          <div style={{display:'grid', placeItems:'center', padding:10, background:'#f0eee9', height:'100%'}}>
+            <PhoneFrame theme="A" scheme="dark">
+              <ScreenIdentityWelcome theme="A" scheme="dark" clubId="sauveterre" mgrName="Élise Vannier" mgrInitials="EV"/>
+            </PhoneFrame>
+          </div>
+        </DCArtboard>
+      </DCSection>
+
       <DCSection id="screens-a"
         title="Schlüsselscreens · Richtung A (empfohlen)"
         subtitle="Portrait 390×844 · hell + dunkel nebeneinander. Posteingang, Kader, Spiel, Halbzeit, Finanzen, Stadion.">
@@ -422,23 +455,13 @@ function RationaleDoc(){
           Aurelia Premier ist ein Trainerspiel für die Hosentasche und das Sofa — und beide Sitzungen sollen sich gleich gut anfühlen. Die gesamte Sprache des Interfaces ist auf einen einzigen Verb-Loop ausgelegt: <b>weiter zum nächsten Termin</b>. Alles, was nicht diesen Loop bedient — eine Karte beantworten, einen Wechsel bestätigen, einen Anpfiff geben — wird in den Hintergrund gerückt. Wir entscheiden uns gegen die FM-Tabellenwand und gegen die Top-Eleven-Buntheit. Wir spielen ein Tabloid: warm, ernst, mit trockenem Witz in der Kopie und ruhigem Chrom im Layout.
         </p>
 
-        <h2>Die drei Richtungen — kurz</h2>
+        <h2>Die Richtung</h2>
 
-        <h3>Richtung A — Sonntagszeitung <span className="small">(empfohlen)</span></h3>
+        <h3>Sonntagszeitung</h3>
         <p>
           Cremepapier (<kbd>#f4ede0</kbd>), dunkle Tinte (<kbd>#1a1410</kbd>), ein einziger scharlachroter Akzent (<kbd>#b7301b</kbd>). Newsreader für Schlagzeilen, Inter für UI, JetBrains Mono für Zahlen. Trifft die Anstoss-DNA frontal: die Schlagzeile macht den Witz, das Layout bleibt streng. Geringe Sättigung, hohe Lesbarkeit, druckreif. Risiko: könnte zu „erwachsen" wirken — wir kompensieren mit kursivem Zitat-Kicker auf dem Hub und Schwarzweißfotostil bei späteren Pressebildern.
         </p>
 
-        <h3>Richtung B — Schalterhalle</h3>
-        <p>
-          Marineblauer Grund (<kbd>#0e1c2e</kbd>) mit Messing-Akzent (<kbd>#b4863a</kbd>), Source Serif als Erzähl-Schrift. Vereinsbüro im Stil der Nachkriegsmoderne. Sehr „seriös", sehr „Vorstand". Risiko: nähert sich der FM-Kühle an, die wir explizit vermeiden wollen — die Wärme kommt nur über das Messing, und Messing wird in der Mobilansicht schnell zu Gold.
-        </p>
-
-        <h3>Richtung C — Hallenfunk</h3>
-        <p>
-          Mattschwarzer Schiefer mit elektrischem Grün (<kbd>#22ee8b</kbd>), Inter only, runde Kanten. OLED-erste Klasse, mobile-native, junges Publikum. Risiko: wird leicht zu „Sport-App generic"; das Tabloid-Gefühl verliert sich, sobald die Schrift nicht mehr seriös genug ist, um die parodistischen Schlagzeilen zu tragen.
-        </p>
-
         <h2>Per Schlüsselscreen — was wir machen und warum</h2>
 
         <h3>01 · Office Hub</h3>
@@ -473,8 +496,8 @@ function RationaleDoc(){
 
         <h2>Empfehlung</h2>
         <div className="verdict">
-          <h2>Wir nehmen Richtung A — Sonntagszeitung.</h2>
-          <p>Sie ist die einzige Richtung, die die Anstoss-DNA trägt, <b>ohne</b> Football Managers Kälte zu kopieren oder in Top-Eleven-Buntheit abzurutschen. Newsreader-Schlagzeilen + Cremepapier sind unser Schutzschild gegen den „SaaS-Look", den die Aufgabe ausdrücklich verbietet. Der einzelne Akzent (<kbd>#b7301b</kbd>) verhindert Akzent-Inflation und gibt dem Anpfiff-Button eine seltene, fast feierliche Bedeutung. Dark Mode ist hier kein Afterthought — wir verschieben das Papier ins Sepia-Schwarz, behalten den Ink-Akzent.</p>
+          <h2>Sonntagszeitung — die einzige Richtung.</h2>
+          <p>Sie trägt die Anstoss-DNA, <b>ohne</b> Football Managers Kälte zu kopieren oder in Top-Eleven-Buntheit abzurutschen. Newsreader-Schlagzeilen + Cremepapier sind unser Schutzschild gegen den „SaaS-Look", den die Aufgabe ausdrücklich verbietet. Der einzelne Akzent (<kbd>#b7301b</kbd>) verhindert Akzent-Inflation und gibt dem Anpfiff-Button eine seltene, fast feierliche Bedeutung. Dark Mode ist hier kein Afterthought — wir verschieben das Papier ins Sepia-Schwarz, behalten den Ink-Akzent.</p>
           <p style={{marginTop:8}}><b>Was ich streichen würde:</b> Das „Klubdisco"-Slot. Auch wenn wir es höflich formulieren, riecht es nach den Anstoss-Tropes (schwarzes Konto, Doping), die wir laut Brief explizit nicht haben wollen. Wir ersetzen es durch <i>Konferenzräume</i> (Sponsoring-Auftritt) oder <i>Multifunktions-Arena</i> (Konzerte) — beides Tabloid-tauglich, beides ohne PR-Risiko.</p>
           <p style={{marginTop:8}}><b>Was als Nächstes wackelt:</b> der 2D-Ticker (Inhalt = post-MVP) und der Cup-Bracket — den haben wir absichtlich aus dem Brief gelassen. Beides bekommt eine eigene Runde.</p>
         </div>
diff --git "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/data.jsx" "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/data.jsx"
index 0026c54..8a6a950 100644
--- "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/data.jsx"
+++ "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/data.jsx"
@@ -190,12 +190,18 @@ const GASTRO = [
 
 // Onboarding club choices
 const CLUBS_PROC = [
-  { n:'FC Hafenstadt',     league:'Aurelia Premier',  pitch:'Hafenstadt erwartet einen Trainer mit ruhiger Hand.', shape:'heater', a:'#0e3a5f', b:'#c8a45a', charge:'ship' },
-  { n:'SV Auerbach 02',    league:'Liga Norvania',    pitch:'Provinzklub mit großem Herz. Aufstieg in Reichweite.', shape:'iberian', a:'#2b6b3f', b:'#f4e4b8', charge:'wave' },
-  { n:'Sporting Kaltenbach',league:'Liga Norvania',  pitch:'Strenges Budget, eiserne Disziplin. Wer hier formt, formt Helden.', shape:'gonfalon', a:'#4a2a2a', b:'#d8c8a8', charge:'sword' },
-  { n:'Riverdale Athletic',league:'Aurelia Premier',  pitch:'Reiche Tradition, hungriger Vorstand. Schnell liefern.', shape:'roundel', a:'#7a1a1a', b:'#f0e8d8', charge:'lion' },
-  { n:'Olympique Sauveterre',league:'Liga Norvania', pitch:'Romantischer Außenseiter. Talente reifen, Trainer ergrauen.', shape:'iberian', a:'#1f4a3a', b:'#e8d28a', charge:'eagle' },
-  { n:'Oakport United FC', league:'Aurelia Premier',  pitch:'Industriestadt, kalter Wind, treue Fans. Geld kommt selten.', shape:'heater', a:'#262626', b:'#c97a2a', charge:'cog' },
+  { n:'FC Hafenstadt',     league:'Aurelia Premier',  pitch:'Hafenstadt erwartet einen Trainer mit ruhiger Hand.', shape:'heater', a:'#0e3a5f', b:'#c8a45a', charge:'ship',
+    kit:{pattern:'stripes', sleeveAccent:true} },
+  { n:'SV Auerbach 02',    league:'Liga Norvania',    pitch:'Provinzklub mit großem Herz. Aufstieg in Reichweite.', shape:'iberian', a:'#2b6b3f', b:'#f4e4b8', charge:'wave',
+    kit:{pattern:'hoops', sleeveAccent:true} },
+  { n:'Sporting Kaltenbach',league:'Liga Norvania',  pitch:'Strenges Budget, eiserne Disziplin. Wer hier formt, formt Helden.', shape:'gonfalon', a:'#4a2a2a', b:'#d8c8a8', charge:'sword',
+    kit:{pattern:'sash', sleeveAccent:true} },
+  { n:'Riverdale Athletic',league:'Aurelia Premier',  pitch:'Reiche Tradition, hungriger Vorstand. Schnell liefern.', shape:'roundel', a:'#7a1a1a', b:'#f0e8d8', charge:'lion',
+    kit:{pattern:'hoops', sleeveAccent:true} },
+  { n:'Olympique Sauveterre',league:'Liga Norvania', pitch:'Romantischer Außenseiter. Talente reifen, Trainer ergrauen.', shape:'iberian', a:'#1f4a3a', b:'#e8d28a', charge:'eagle',
+    kit:{pattern:'solid', sleeveAccent:true} },
+  { n:'Oakport United FC', league:'Aurelia Premier',  pitch:'Industriestadt, kalter Wind, treue Fans. Geld kommt selten.', shape:'heater', a:'#262626', b:'#c97a2a', charge:'cog',
+    kit:{pattern:'chevron', sleeveAccent:true} },
 ];
 
 const SAVE_SLOTS = [
@@ -210,21 +216,29 @@ const SAVE_SLOTS = [
 // `id` is the stable key used to register a derived theme (see more.jsx).
 const CLUB_REGISTRY = {
   hafenstadt: { id:'hafenstadt', name:'FC Hafenstadt',        short:'FCH', primary:'#0e3a5f', secondary:'#c8a45a',
-                crest:{shape:'heater',   a:'#0e3a5f', b:'#c8a45a', charge:'ship'} },
+                crest:{shape:'heater',   a:'#0e3a5f', b:'#c8a45a', charge:'ship'},
+                kit:  {pattern:'stripes', sleeveAccent:true} },
   northbridge:{ id:'northbridge', name:'Northbridge City',    short:'NBC', primary:'#262626', secondary:'#c97a2a',
-                crest:{shape:'roundel',  a:'#262626', b:'#c97a2a', charge:'tower'} },
+                crest:{shape:'roundel',  a:'#262626', b:'#c97a2a', charge:'tower'},
+                kit:  {pattern:'split',   sleeveAccent:true} },
   kaltenbach: { id:'kaltenbach', name:'Sporting Kaltenbach',  short:'SPK', primary:'#4a2a2a', secondary:'#d8c8a8',
-                crest:{shape:'gonfalon', a:'#4a2a2a', b:'#d8c8a8', charge:'sword'} },
+                crest:{shape:'gonfalon', a:'#4a2a2a', b:'#d8c8a8', charge:'sword'},
+                kit:  {pattern:'sash',    sleeveAccent:true} },
   sauveterre: { id:'sauveterre', name:'Olympique Sauveterre', short:'OSV', primary:'#1f4a3a', secondary:'#e8d28a',
-                crest:{shape:'iberian',  a:'#1f4a3a', b:'#e8d28a', charge:'eagle'} },
+                crest:{shape:'iberian',  a:'#1f4a3a', b:'#e8d28a', charge:'eagle'},
+                kit:  {pattern:'solid',   sleeveAccent:true} },
   auerbach:   { id:'auerbach', name:'SV Auerbach 02',         short:'SVA', primary:'#2b6b3f', secondary:'#f4e4b8',
-                crest:{shape:'iberian',  a:'#2b6b3f', b:'#f4e4b8', charge:'wave'} },
+                crest:{shape:'iberian',  a:'#2b6b3f', b:'#f4e4b8', charge:'wave'},
+                kit:  {pattern:'hoops',   sleeveAccent:true} },
   valguarda:  { id:'valguarda', name:'AC Valguarda',          short:'ACV', primary:'#7a1a1a', secondary:'#f0e8d8',
-                crest:{shape:'gonfalon', a:'#7a1a1a', b:'#f0e8d8', charge:'lion'} },
+                crest:{shape:'gonfalon', a:'#7a1a1a', b:'#f0e8d8', charge:'lion'},
+                kit:  {pattern:'stripes', sleeveAccent:true} },
   riverdale:  { id:'riverdale', name:'Riverdale Athletic',    short:'RVA', primary:'#7a1a1a', secondary:'#f0e8d8',
-                crest:{shape:'roundel',  a:'#7a1a1a', b:'#f0e8d8', charge:'lion'} },
+                crest:{shape:'roundel',  a:'#7a1a1a', b:'#f0e8d8', charge:'lion'},
+                kit:  {pattern:'hoops',   sleeveAccent:true} },
   oakport:    { id:'oakport', name:'Oakport United FC',       short:'OAK', primary:'#2a221c', secondary:'#c97a2a',
-                crest:{shape:'heater',   a:'#262626', b:'#c97a2a', charge:'cog'} },
+                crest:{shape:'heater',   a:'#262626', b:'#c97a2a', charge:'cog'},
+                kit:  {pattern:'chevron', sleeveAccent:true} },
 };
 // Lookup by full club name (used by inline screens). Falls back to Hafenstadt.
 const clubByName = (name) => {
@@ -234,11 +248,12 @@ const clubByName = (name) => {
   return CLUB_REGISTRY.hafenstadt;
 };
 const crestFor   = (name) => clubByName(name).crest;
+const kitFor     = (name) => clubByName(name).kit || {pattern:'solid', sleeveAccent:true};
 const themeKeyFor = (clubId) => 'A_' + clubId;
 
 Object.assign(window, {
   SQUAD, FEED, INBOX, FIXTURES, OPP, OWN, FIN, STADIUM, STADIUM_INFO,
   STANDS, STADIUM_TYPES, PITCH_LIGHT, GASTRO, CLUBS_PROC, SAVE_SLOTS,
-  CLUB_REGISTRY, clubByName, crestFor, themeKeyFor,
+  CLUB_REGISTRY, clubByName, crestFor, kitFor, themeKeyFor,
   eur, eurK,
 });
diff --git "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/directions.jsx" "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/directions.jsx"
index bf29878..4c089f0 100644
--- "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/directions.jsx"
+++ "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/directions.jsx"
@@ -23,32 +23,6 @@ function WordmarkA({ size=28, ink='#1a1410', accent='#b7301b', mono=false }){
     </div>
   );
 }
-function WordmarkB({ size=28, ink='#e6ecf3', accent='#dcb15c' }){
-  return (
-    <div style={{display:'inline-flex', alignItems:'center', gap:10}}>
-      <span style={{width:size*0.9, height:size*0.9, borderRadius:6, background:accent, color:'#0a1422',
-        display:'grid', placeItems:'center', fontFamily:'"Source Serif 4", Georgia, serif', fontWeight:800, fontSize:size*0.55,
-        boxShadow:'inset 0 -3px 0 rgba(0,0,0,.15)'}}>AP</span>
-      <span style={{fontFamily:'"Source Serif 4", Georgia, serif', fontWeight:700, fontSize:size, color:ink, letterSpacing:0.5}}>
-        AURELIA <span style={{color:accent}}>PREMIER</span>
-      </span>
-    </div>
-  );
-}
-function WordmarkC({ size=28, ink='#eaecef', accent='#22ee8b' }){
-  return (
-    <div style={{display:'inline-flex', alignItems:'center', gap:8}}>
-      <span style={{
-        width:size*0.95, height:size*0.95, borderRadius:size*0.32,
-        background:accent, color:'#0c0d10', display:'grid', placeItems:'center',
-        fontWeight:900, fontSize:size*0.58, fontFamily:'Inter', letterSpacing:-1
-      }}>ap</span>
-      <span style={{fontFamily:'Inter', fontWeight:800, fontSize:size, color:ink, letterSpacing:-0.5}}>
-        aurelia<span style={{color:accent}}>·</span>premier
-      </span>
-    </div>
-  );
-}
 
 // Square PWA icon
 function PwaIconA(){
@@ -62,25 +36,6 @@ function PwaIconA(){
     </svg>
   );
 }
-function PwaIconB(){
-  return (
-    <svg width="80" height="80" viewBox="0 0 80 80">
-      <rect width="80" height="80" rx="16" fill="#0a1422"/>
-      <rect x="10" y="10" width="60" height="60" rx="10" fill="#dcb15c"/>
-      <text x="40" y="50" textAnchor="middle" fontFamily="'Source Serif 4', Georgia, serif" fontWeight="800" fontSize="34" fill="#0a1422">AP</text>
-      <rect x="22" y="58" width="36" height="2" fill="#0a1422"/>
-    </svg>
-  );
-}
-function PwaIconC(){
-  return (
-    <svg width="80" height="80" viewBox="0 0 80 80">
-      <rect width="80" height="80" rx="22" fill="#0c0d10"/>
-      <circle cx="40" cy="40" r="26" fill="#22ee8b"/>
-      <text x="40" y="50" textAnchor="middle" fontFamily="Inter" fontWeight="900" fontSize="30" letterSpacing="-2" fill="#0c0d10">ap</text>
-    </svg>
-  );
-}
 
 // ------------------------------------------------------------------
 // Sample player card (compact, direction-specific styling)
@@ -116,109 +71,6 @@ function SampleInboxCard({theme, scheme}){
   );
 }
 
-// ------------------------------------------------------------------
-// One direction frame (no phone bezel — flat card)
-// ------------------------------------------------------------------
-function DirectionFrame({theme, schemeForBg='light', label, oneliner, wordmark, pwaIcon, typeNote, recommended=false}){
-  const t = THEMES[theme][schemeForBg];
-  const tDark = THEMES[theme].dark;
-  const tLight = THEMES[theme].light;
-  const swatches = (vals, isDark) => (
-    <div style={{display:'flex', gap:0, borderRadius:8, overflow:'hidden', border:`1px solid ${isDark?'#000':'#0001'}`}}>
-      {vals.map(([k,v],i)=>(
-        <div key={i} style={{
-          flex:1, height:34, background:v, color: ['bg','bgInk','card'].includes(k) ? (isDark?'#fff':'#000') : '#fff',
-          display:'flex', alignItems:'flex-end', justifyContent:'flex-start',
-          padding:'3px 5px', fontSize:8, fontFamily:'JetBrains Mono', fontWeight:700
-        }}>{k}</div>
-      ))}
-    </div>
-  );
-  const lightKeys = ['bg','card','ink','accent','ok','warn','danger'];
-  const darkKeys = ['bg','card','ink','accent','ok','warn','danger'];
-  return (
-    <div style={{
-      width:380, background: t.bg, color: t.ink,
-      border:`1px solid ${t.rule}`, borderRadius:18, padding:'18px 18px 20px',
-      fontFamily: THEMES[theme].ui, position:'relative'
-    }}>
-      {recommended && (
-        <div style={{position:'absolute', top:-12, right:14, background:t.accent, color:'#fff', fontSize:10, fontWeight:800, letterSpacing:1, padding:'5px 10px', borderRadius:99, boxShadow:`0 4px 12px -4px ${t.accent}90`}}>EMPFEHLUNG</div>
-      )}
-      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:10}}>
-        <div>
-          <div style={{fontSize:10, fontWeight:800, letterSpacing:1.4, color:t.accent}}>RICHTUNG {label.split(' — ')[0]}</div>
-          <SerifH theme={theme} style={{display:'block', fontSize:22, fontWeight:700, color:t.ink, marginTop:2}}>{label.split(' — ')[1]}</SerifH>
-          <div style={{fontSize:12, color:t.inkMute, marginTop:4, fontFamily:THEMES[theme].font, fontStyle:'italic', lineHeight:1.35, maxWidth:260}}>„{oneliner}"</div>
-        </div>
-        <div style={{flex:'0 0 80px'}}>{pwaIcon}</div>
-      </div>
-
-      {/* Wordmark */}
-      <div style={{marginTop:14, padding:'14px 14px', background:t.card, borderRadius:12, border:`1px solid ${t.rule}`}}>
-        {wordmark}
-        <div style={{fontSize:10, color:t.inkSoft, marginTop:8, fontFamily:'JetBrains Mono'}}>Horizontaler Schriftzug — PWA-installierbar</div>
-      </div>
-
-      {/* Palette */}
-      <div style={{marginTop:14}}>
-        <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', marginBottom:5}}>Palette · hell</div>
-        {swatches(lightKeys.map(k=>[k, tLight[k]]), false)}
-        <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', marginTop:8, marginBottom:5}}>Palette · dunkel</div>
-        {swatches(darkKeys.map(k=>[k, tDark[k]]), true)}
-      </div>
-
-      {/* Type */}
-      <div style={{marginTop:14, padding:'12px 14px', background:t.card, borderRadius:12, border:`1px solid ${t.rule}`}}>
-        <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>Schrift</div>
-        <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:700, color:t.ink, lineHeight:1.05, marginTop:2}}>Brody schießt sich in die Herzen</SerifH>
-        <div style={{fontSize:12, color:t.inkMute, marginTop:3, lineHeight:1.4}}>Display & narrative · {typeNote.display}. UI · {typeNote.ui}. Zahlen · JetBrains Mono.</div>
-      </div>
-
-      {/* Sample components */}
-      <div style={{marginTop:14}}>
-        <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', marginBottom:6}}>Spielerkarte · Posteingang</div>
-        <div style={{display:'grid', gap:8}}>
-          <SamplePlayerCard theme={theme} scheme={schemeForBg}/>
-          <SampleInboxCard theme={theme} scheme={schemeForBg}/>
-        </div>
-      </div>
-    </div>
-  );
-}
-
-function DirectionsCompare(){
-  return (
-    <div style={{display:'flex', gap:18, padding:'4px'}}>
-      <DirectionFrame
-        theme="A" schemeForBg="light"
-        label="A — Sonntagszeitung"
-        oneliner="Cremepapier, dunkle Tinte, scharlachroter Akzent — wie die Sonntagsausgabe, nur dass Sie der Trainer sind."
-        wordmark={<WordmarkA size={28}/>}
-        pwaIcon={<PwaIconA/>}
-        typeNote={{display:'Newsreader', ui:'Inter'}}
-        recommended={true}
-      />
-      <DirectionFrame
-        theme="B" schemeForBg="light"
-        label="B — Schalterhalle"
-        oneliner="Marineblauer Grund, Messing, warmes Weiß — Vereinsbüro im Stil der Nachkriegsmoderne."
-        wordmark={<WordmarkB size={22} ink="#0e1c2e" accent="#b4863a"/>}
-        pwaIcon={<PwaIconB/>}
-        typeNote={{display:'Source Serif 4', ui:'Inter'}}
-      />
-      <DirectionFrame
-        theme="C" schemeForBg="dark"
-        label="C — Hallenfunk"
-        oneliner="Mattschwarzer Schiefer, Neon­grün, runde Kanten — mobil-nativ, OLED-erste Klasse."
-        wordmark={<WordmarkC size={24} ink="#eaecef" accent="#22ee8b"/>}
-        pwaIcon={<PwaIconC/>}
-        typeNote={{display:'Inter Display', ui:'Inter'}}
-      />
-    </div>
-  );
-}
-
 // ------------------------------------------------------------------
 // Procedural crest grammar showcase
 // ------------------------------------------------------------------
@@ -450,7 +302,7 @@ export default {
 }
 
 Object.assign(window, {
-  WordmarkA, WordmarkB, WordmarkC, PwaIconA, PwaIconB, PwaIconC,
-  SamplePlayerCard, SampleInboxCard, DirectionFrame, DirectionsCompare,
+  WordmarkA, PwaIconA,
+  SamplePlayerCard, SampleInboxCard,
   CrestGrammar, TokensPanel
 });
diff --git "a/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/identity.jsx" "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/identity.jsx"
new file mode 100644
index 0000000..d3cbd1c
--- /dev/null
+++ "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/identity.jsx"
@@ -0,0 +1,1019 @@
+// identity.jsx — Klub-Identitäts-Studio.
+// Two surfaces:
+//   1. ScreenIdentity        — phone-portrait screen (Wappen / Trikot tabs)
+//   2. IdentityStudio        — wide artboard, interactive editor + preview
+//
+// Closes the open TASKS item T3.4 (Trikot-Designer · heraldisch) and adds the
+// missing Logo-Generator UI on top of the existing CrestGrammar engine.
+
+// ---------------- Shared tincture palette ----------------
+// Drawn from CLUB_REGISTRY tones so colour-mixing always feels "in world".
+const IDENT_TINCT = [
+  { id:'navy',     hex:'#0e3a5f', name:'Marineblau' },
+  { id:'wine',     hex:'#7a1a1a', name:'Weinrot'    },
+  { id:'forest',   hex:'#1f4a3a', name:'Tannengrün' },
+  { id:'meadow',   hex:'#2b6b3f', name:'Wiesengrün' },
+  { id:'liver',    hex:'#4a2a2a', name:'Leberbraun' },
+  { id:'graphite', hex:'#262626', name:'Graphit'    },
+  { id:'gold',     hex:'#c8a45a', name:'Altgold'    },
+  { id:'brass',    hex:'#c97a2a', name:'Messing'    },
+  { id:'butter',   hex:'#f4e4b8', name:'Butter'     },
+  { id:'cream',    hex:'#f0e8d8', name:'Cremepapier'},
+  { id:'sand',     hex:'#d8c8a8', name:'Sand'       },
+  { id:'paper',    hex:'#fbf6ea', name:'Papier'     },
+];
+
+const IDENT_SHAPES   = ['heater','iberian','gonfalon','roundel'];
+const IDENT_SHAPE_LABEL = { heater:'Heater', iberian:'Iberisch', gonfalon:'Gonfalon', roundel:'Rundschild' };
+const IDENT_CHARGES  = ['ship','lion','eagle','tower','sword','cog','cross','star','wave','ball'];
+const IDENT_CHARGE_LABEL = {
+  ship:'Schiff', lion:'Löwe', eagle:'Adler', tower:'Turm', sword:'Schwert',
+  cog:'Zahnrad', cross:'Kreuz', star:'Stern', wave:'Welle', ball:'Ball'
+};
+
+const IDENT_PATTERNS = [
+  { id:'solid',     name:'Uni'         },
+  { id:'stripes',   name:'Streifen'    },
+  { id:'hoops',     name:'Querstreifen'},
+  { id:'sash',      name:'Schärpe'     },
+  { id:'split',     name:'Halbiert'    },
+  { id:'chevron',   name:'Spitze'      },
+];
+
+// ---------------- Procedural jersey ----------------
+// Single SVG, deterministic by (pattern, a, b, sleeveAccent, crest, number).
+// viewBox 120×120. Crest sits on chest at (50, 56).
+function Jersey({
+  pattern='stripes', a='#0e3a5f', b='#c8a45a',
+  sleeveAccent=true, crest=null, number='9', name='BRODY',
+  showBack=false, size=200,
+}){
+  // Body outline (front-on shirt with raglan sleeves)
+  const BODY = "M30 22 L14 18 L8 20 L4 38 L24 44 L30 38 L30 112 L90 112 L90 38 L96 44 L116 38 L112 20 L106 18 L90 22 Q60 30 30 22 Z";
+  // Sleeve cuff regions (for accent fill) — taken from corners of the body path
+  const CUFF_L = "M4 38 L24 44 L22 50 L4 46 Z";
+  const CUFF_R = "M116 38 L96 44 L98 50 L116 46 Z";
+  // Collar
+  const COLLAR = "M44 22 Q60 30 76 22 L72 28 Q60 33 48 28 Z";
+
+  const clipId = `jc-${pattern}-${a.replace('#','')}-${b.replace('#','')}-${showBack?'b':'f'}`.toLowerCase();
+
+  // Pattern fills are rendered *inside* the body clip.
+  function PatternFill(){
+    switch(pattern){
+      case 'solid':
+        return <rect x="0" y="0" width="120" height="120" fill={a}/>;
+      case 'stripes': {
+        // 6 vertical stripes alternating a/b
+        return (
+          <g>
+            <rect x="0" y="0" width="120" height="120" fill={a}/>
+            {[1,3,5].map(i=>(
+              <rect key={i} x={i*20-2} y="0" width="14" height="120" fill={b}/>
+            ))}
+          </g>
+        );
+      }
+      case 'hoops': {
+        return (
+          <g>
+            <rect x="0" y="0" width="120" height="120" fill={a}/>
+            {[0,1,2,3].map(i=>(
+              <rect key={i} x="0" y={28+i*18} width="120" height="9" fill={b}/>
+            ))}
+          </g>
+        );
+      }
+      case 'sash':
+        return (
+          <g>
+            <rect x="0" y="0" width="120" height="120" fill={a}/>
+            <polygon points="0,72 0,52 120,12 120,32" fill={b}/>
+          </g>
+        );
+      case 'split':
+        return (
+          <g>
+            <rect x="0" y="0" width="60" height="120" fill={a}/>
+            <rect x="60" y="0" width="60" height="120" fill={b}/>
+          </g>
+        );
+      case 'chevron':
+        return (
+          <g>
+            <rect x="0" y="0" width="120" height="120" fill={a}/>
+            <polygon points="0,30 60,60 120,30 120,52 60,82 0,52" fill={b}/>
+          </g>
+        );
+      default:
+        return <rect x="0" y="0" width="120" height="120" fill={a}/>;
+    }
+  }
+
+  // Pick a sensible text colour against pattern A.
+  const inkOn = (hex) => {
+    // Quick luminance approximation
+    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), bl = parseInt(hex.slice(5,7),16);
+    const L = (0.299*r + 0.587*g + 0.114*bl)/255;
+    return L > 0.55 ? '#11100e' : '#fbf6ea';
+  };
+  const ink = inkOn(a);
+  const accent = sleeveAccent ? b : a;
+
+  return (
+    <svg width={size} height={size} viewBox="0 0 120 120" style={{display:'block'}}>
+      <defs>
+        <clipPath id={clipId}><path d={BODY}/></clipPath>
+        <linearGradient id={`${clipId}-sh`} x1="0" x2="0" y1="0" y2="1">
+          <stop offset="0"  stopColor="#000" stopOpacity="0"/>
+          <stop offset="1"  stopColor="#000" stopOpacity=".18"/>
+        </linearGradient>
+      </defs>
+
+      {/* Body fill with pattern */}
+      <g clipPath={`url(#${clipId})`}>
+        <PatternFill/>
+        {/* subtle shadow */}
+        <rect x="0" y="0" width="120" height="120" fill={`url(#${clipId}-sh)`}/>
+      </g>
+
+      {/* Sleeve accent stripes (cuffs) */}
+      {sleeveAccent && (
+        <g>
+          <path d={CUFF_L} fill={accent} opacity=".95"/>
+          <path d={CUFF_R} fill={accent} opacity=".95"/>
+        </g>
+      )}
+
+      {/* Collar */}
+      <path d={COLLAR} fill={accent}/>
+
+      {/* Body outline */}
+      <path d={BODY} fill="none" stroke="#11100e" strokeWidth="1.4" strokeLinejoin="round"/>
+
+      {/* Front: crest + sponsor placeholder. Back: number + name. */}
+      {!showBack && (
+        <g>
+          {crest && (
+            <g transform="translate(38, 44) scale(0.22)">
+              <Crest {...crest} size={100}/>
+            </g>
+          )}
+          {/* sponsor strip — kept as a placeholder marker for sponsor flow */}
+          <rect x="44" y="78" width="32" height="6" rx="1" fill={ink} opacity=".14"/>
+          <text x="60" y="83" textAnchor="middle" fontSize="4.5"
+                fontFamily="JetBrains Mono, monospace" fontWeight="700"
+                fill={ink} opacity=".5">SPONSOR</text>
+        </g>
+      )}
+      {showBack && (
+        <g>
+          <text x="60" y="50" textAnchor="middle" fontSize="9"
+                fontFamily="Inter, sans-serif" fontWeight="800"
+                fill={ink} letterSpacing="1">{name.toUpperCase()}</text>
+          <text x="60" y="86" textAnchor="middle" fontSize="34"
+                fontFamily="Inter, sans-serif" fontWeight="800"
+                fill={ink}>{number}</text>
+        </g>
+      )}
+    </svg>
+  );
+}
+
+// ---------------- Shield silhouette (picker thumb) ----------------
+function ShapeThumb({shape, color='#1a1410', size=28}){
+  return (
+    <svg width={size} height={size*1.2} viewBox="0 0 100 120">
+      <path d={shieldPath(shape)} fill={color}/>
+    </svg>
+  );
+}
+
+// ---------------- Charge chip ----------------
+// `Charge` itself isn't exported from ui.jsx — we reuse Crest with a flat
+// background to render the symbol alone.
+function ChargeChip({kind, fg='#1a1410', bg='#fbf6ea', size=44, active=false, onClick}){
+  return (
+    <button onClick={onClick} style={{
+      width:size, height:size, borderRadius:8,
+      background: active ? fg : bg,
+      border:`1.5px solid ${active ? fg : '#d9cdb4'}`,
+      display:'grid', placeItems:'center', cursor:'pointer', padding:0
+    }} title={IDENT_CHARGE_LABEL[kind]}>
+      <Crest shape="roundel" a={active?fg:bg} b={active?fg:bg} charge={kind} size={size-12}/>
+    </button>
+  );
+}
+
+// ---------------- Swatch button ----------------
+function Swatch({hex, name, active, onClick, size=32, label=true, theme, scheme}){
+  const t = THEMES[theme][scheme];
+  return (
+    <button onClick={onClick} style={{
+      display:'flex', flexDirection:'column', alignItems:'center', gap:4,
+      background:'transparent', border:'none', cursor:'pointer', padding:0,
+    }} title={name}>
+      <span style={{
+        width:size, height:size, borderRadius:8,
+        background: hex,
+        border: active ? `2.5px solid ${t.ink}` : `1px solid ${t.rule}`,
+        boxShadow: active ? `0 0 0 2px ${t.bg}` : 'none',
+        display:'block',
+      }}/>
+      {label && <span style={{fontSize:9.5, color:t.inkMute, fontWeight:600, letterSpacing:.2}}>{name}</span>}
+    </button>
+  );
+}
+
+// ---------------- Segment (Tabs) ----------------
+function IdentSegment({options, value, onChange, theme, scheme}){
+  const t = THEMES[theme][scheme];
+  return (
+    <div style={{
+      display:'flex', background:t.bgInk, padding:3, borderRadius:10,
+      border:`1px solid ${t.rule}`
+    }}>
+      {options.map(o=>{
+        const on = o.id===value;
+        return (
+          <button key={o.id} onClick={()=>onChange(o.id)} style={{
+            flex:1, height:32, borderRadius:8, border:'none',
+            background: on ? t.card : 'transparent',
+            color: on ? t.ink : t.inkMute,
+            fontWeight:700, fontSize:12, fontFamily:'inherit',
+            boxShadow: on ? `0 1px 0 ${t.rule}` : 'none',
+            cursor:'pointer',
+          }}>{o.label}</button>
+        );
+      })}
+    </div>
+  );
+}
+
+// ---------------- The mobile screen ----------------
+function ScreenIdentity({theme, scheme}){
+  const t = THEMES[theme][scheme];
+  const [tab, setTab]       = React.useState('crest'); // crest | jersey
+  const [shape, setShape]   = React.useState('heater');
+  const [crestA, setCrestA] = React.useState('#0e3a5f');
+  const [crestB, setCrestB] = React.useState('#c8a45a');
+  const [charge, setCharge] = React.useState('ship');
+  const [motto, setMotto]   = React.useState('Per mare ad astra');
+  const [showBack, setShowBack] = React.useState(false);
+
+  // Three kit variants — defaults: home matches crest, away inverts, third = graphite
+  const [variant, setVariant] = React.useState('home');
+  const [kits, setKits] = React.useState({
+    home:  { pattern:'stripes', a:'#0e3a5f', b:'#c8a45a', sleeveAccent:true },
+    away:  { pattern:'solid',   a:'#c8a45a', b:'#0e3a5f', sleeveAccent:true },
+    third: { pattern:'sash',    a:'#262626', b:'#c8a45a', sleeveAccent:true },
+  });
+  const kit = kits[variant];
+  const updateKit = (changes) => setKits(k => ({...k, [variant]: {...k[variant], ...changes}}));
+
+  const crest = { shape, a:crestA, b:crestB, charge, motto: motto || undefined };
+
+  const VARIANT_LABEL = { home:'Heim', away:'Auswärts', third:'Drittes' };
+
+  const SectionLabel = ({children, hint}) => (
+    <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginTop:14, marginBottom:8}}>
+      <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>{children}</div>
+      {hint && <div style={{fontSize:10, color:t.inkSoft}}>{hint}</div>}
+    </div>
+  );
+
+  return (
+    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
+      <ThemeCss theme={theme} scheme={scheme}/>
+      {/* Top bar */}
+      <header style={{padding:'4px 16px 8px'}}>
+        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
+          <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center', cursor:'pointer'}}>
+            <I.ChevronLeft color={t.ink} size={18}/>
+          </button>
+          <div style={{textAlign:'center'}}>
+            <SerifH theme={theme} style={{fontSize:17, fontWeight:700, color:t.ink, display:'block', lineHeight:1}}>Klub-Identität</SerifH>
+            <div style={{fontSize:10, color:t.inkSoft, marginTop:2, letterSpacing:.4}}>Wappen · Trikot · Vorschau</div>
+          </div>
+          <button style={{width:36,height:36,borderRadius:10,background:t.accent,border:'none',display:'grid',placeItems:'center', cursor:'pointer'}}>
+            <I.Check color="#fff" size={18}/>
+          </button>
+        </div>
+      </header>
+
+      {/* Big preview */}
+      <div style={{
+        position:'relative', margin:'0 16px',
+        background:t.card, border:`1px solid ${t.rule}`, borderRadius:14,
+        padding:'14px 12px 10px',
+      }}>
+        {/* sepia paper backdrop */}
+        <div style={{
+          position:'absolute', inset:8, borderRadius:10,
+          background:`repeating-linear-gradient(0deg, ${t.bgInk} 0 1px, transparent 1px 6px)`,
+          opacity:.45, pointerEvents:'none',
+        }}/>
+        <div style={{position:'relative', display:'flex', alignItems:'center', justifyContent:'center', gap:14, minHeight:188}}>
+          {tab==='crest' ? (
+            <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
+              <Crest {...crest} size={140}/>
+              <div style={{marginTop:6, fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>
+                {IDENT_SHAPE_LABEL[shape]} · {IDENT_CHARGE_LABEL[charge]}
+              </div>
+            </div>
+          ) : (
+            <div style={{display:'flex', alignItems:'center', gap:18}}>
+              <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
+                <Jersey pattern={kit.pattern} a={kit.a} b={kit.b} sleeveAccent={kit.sleeveAccent}
+                        crest={crest} number="9" name="BRODY"
+                        showBack={showBack} size={160}/>
+                <div style={{marginTop:4, fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>
+                  {VARIANT_LABEL[variant]} · {showBack ? 'Rückseite' : 'Vorderseite'}
+                </div>
+              </div>
+            </div>
+          )}
+        </div>
+
+        {/* mini lineup preview */}
+        <div style={{position:'relative', marginTop:6, paddingTop:8, borderTop:`1px dashed ${t.rule}`,
+                     display:'flex', alignItems:'center', justifyContent:'center', gap:6}}>
+          {[0,1,2,3,4].map(i=>(
+            <Jersey key={i} pattern={kit.pattern} a={kit.a} b={kit.b}
+                    sleeveAccent={kit.sleeveAccent} crest={null} size={28}/>
+          ))}
+          <span style={{fontSize:9.5, color:t.inkMute, marginLeft:6, letterSpacing:.4, fontWeight:700, textTransform:'uppercase'}}>2D-Ticker · Aufstellung</span>
+        </div>
+      </div>
+
+      {/* Tab segment */}
+      <div style={{padding:'12px 16px 0'}}>
+        <IdentSegment
+          theme={theme} scheme={scheme} value={tab} onChange={setTab}
+          options={[{id:'crest', label:'Wappen'}, {id:'jersey', label:'Trikot'}]}/>
+      </div>
+
+      {/* Scrollable controls */}
+      <div style={{flex:1, overflowY:'auto', padding:'0 16px 20px'}}>
+        {tab==='crest' && (
+          <>
+            <SectionLabel hint="4 Formen">Schildform</SectionLabel>
+            <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:8}}>
+              {IDENT_SHAPES.map(s=>{
+                const on = s===shape;
+                return (
+                  <button key={s} onClick={()=>setShape(s)} style={{
+                    display:'flex', flexDirection:'column', alignItems:'center', gap:4,
+                    padding:'10px 4px', borderRadius:10, cursor:'pointer',
+                    background: on ? t.bgInk : t.card,
+                    border: `1.5px solid ${on ? t.ink : t.rule}`,
+                    fontFamily:'inherit',
+                  }}>
+                    <ShapeThumb shape={s} color={t.ink} size={26}/>
+                    <span style={{fontSize:10, color:t.ink, fontWeight:600, letterSpacing:.2}}>{IDENT_SHAPE_LABEL[s]}</span>
+                  </button>
+                );
+              })}
+            </div>
+
+            <SectionLabel hint="Hauptfarbe">Tinktur A</SectionLabel>
+            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:8, justifyItems:'center'}}>
+              {IDENT_TINCT.map(c=>(
+                <Swatch key={c.id} hex={c.hex} name={c.name}
+                        active={crestA===c.hex} onClick={()=>setCrestA(c.hex)}
+                        size={30} label={false} theme={theme} scheme={scheme}/>
+              ))}
+            </div>
+
+            <SectionLabel hint="Zweitfarbe">Tinktur B</SectionLabel>
+            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:8, justifyItems:'center'}}>
+              {IDENT_TINCT.map(c=>(
+                <Swatch key={c.id} hex={c.hex} name={c.name}
+                        active={crestB===c.hex} onClick={()=>setCrestB(c.hex)}
+                        size={30} label={false} theme={theme} scheme={scheme}/>
+              ))}
+            </div>
+
+            <SectionLabel hint="10 Symbole">Wappensymbol</SectionLabel>
+            <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:8, justifyItems:'center'}}>
+              {IDENT_CHARGES.map(k=>(
+                <ChargeChip key={k} kind={k}
+                            active={charge===k}
+                            fg={t.ink} bg={t.card}
+                            onClick={()=>setCharge(k)}/>
+              ))}
+            </div>
+
+            <SectionLabel hint="optional, max. 32 Zeichen">Motto</SectionLabel>
+            <input value={motto} onChange={e=>setMotto(e.target.value.slice(0,32))}
+                   placeholder="Per mare ad astra"
+                   style={{
+                     width:'100%', height:40, borderRadius:10,
+                     background:t.card, border:`1px solid ${t.rule}`,
+                     padding:'0 12px', fontSize:13, color:t.ink,
+                     fontFamily:THEMES[theme].font, fontStyle:'italic',
+                     outline:'none',
+                   }}/>
+          </>
+        )}
+
+        {tab==='jersey' && (
+          <>
+            {/* Variant segment — three kits */}
+            <div style={{marginTop:14}}>
+              <IdentSegment
+                theme={theme} scheme={scheme} value={variant} onChange={setVariant}
+                options={[
+                  {id:'home',  label:'Heim'},
+                  {id:'away',  label:'Auswärts'},
+                  {id:'third', label:'Drittes'},
+                ]}/>
+            </div>
+
+            <SectionLabel hint="6 Muster">Trikotmuster · {VARIANT_LABEL[variant]}</SectionLabel>
+            <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8}}>
+              {IDENT_PATTERNS.map(p=>{
+                const on = p.id===kit.pattern;
+                return (
+                  <button key={p.id} onClick={()=>updateKit({pattern:p.id})} style={{
+                    display:'flex', flexDirection:'column', alignItems:'center', gap:4,
+                    padding:'8px 4px 6px', borderRadius:10, cursor:'pointer',
+                    background: on ? t.bgInk : t.card,
+                    border: `1.5px solid ${on ? t.ink : t.rule}`,
+                    fontFamily:'inherit',
+                  }}>
+                    <Jersey pattern={p.id} a={kit.a} b={kit.b} sleeveAccent={kit.sleeveAccent} crest={null} size={42}/>
+                    <span style={{fontSize:10, color:t.ink, fontWeight:600}}>{p.name}</span>
+                  </button>
+                );
+              })}
+            </div>
+
+            <SectionLabel hint="Trikot-Hauptfarbe">Hauptfarbe</SectionLabel>
+            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:8, justifyItems:'center'}}>
+              {IDENT_TINCT.map(c=>(
+                <Swatch key={c.id} hex={c.hex} name={c.name}
+                        active={kit.a===c.hex} onClick={()=>updateKit({a:c.hex})}
+                        size={30} label={false} theme={theme} scheme={scheme}/>
+              ))}
+            </div>
+
+            <SectionLabel hint="Streifen, Kragen, Stutzen">Zweitfarbe</SectionLabel>
+            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:8, justifyItems:'center'}}>
+              {IDENT_TINCT.map(c=>(
+                <Swatch key={c.id} hex={c.hex} name={c.name}
+                        active={kit.b===c.hex} onClick={()=>updateKit({b:c.hex})}
+                        size={30} label={false} theme={theme} scheme={scheme}/>
+              ))}
+            </div>
+
+            <SectionLabel>Details</SectionLabel>
+            <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'4px 12px'}}>
+              <ToggleRow theme={theme} scheme={scheme}
+                k="Ärmel-Akzent" sub="Kragen + Stutzen in Tinktur B"
+                on={kit.sleeveAccent} onChange={()=>updateKit({sleeveAccent: !kit.sleeveAccent})}/>
+              <ToggleRow theme={theme} scheme={scheme}
+                k="Rückseite zeigen" sub="Spielername + Nummer im Profi-Stil"
+                on={showBack} onChange={()=>setShowBack(v=>!v)} last/>
+            </div>
+          </>
+        )}
+      </div>
+
+      {/* Footer CTA */}
+      <div style={{padding:'8px 16px 14px', borderTop:`1px solid ${t.rule}`, background:t.bg}}>
+        <button style={{
+          width:'100%', height:48, borderRadius:12,
+          background:t.accent, color:'#fff',
+          border:'none', fontWeight:700, fontSize:14, fontFamily:'inherit',
+          letterSpacing:.2, cursor:'pointer',
+          display:'flex', alignItems:'center', justifyContent:'center', gap:8,
+        }}>
+          <I.Check size={16} color="#fff"/>
+          Auf Klub anwenden
+        </button>
+        <div style={{textAlign:'center', fontSize:10, color:t.inkSoft, marginTop:6, letterSpacing:.3}}>
+          Wirkt sofort auf 2D-Ticker, Aufstellung & Liga-Tabelle.
+        </div>
+      </div>
+    </div>
+  );
+}
+
+// Small toggle row, local to this screen
+function ToggleRow({k, sub, on, onChange, last, theme, scheme}){
+  const t = THEMES[theme][scheme];
+  return (
+    <button onClick={onChange} style={{
+      width:'100%', display:'flex', alignItems:'center', gap:10,
+      padding:'10px 0', background:'transparent',
+      border:'none', borderBottom: last?'none':`1px solid ${t.rule}`,
+      cursor:'pointer', fontFamily:'inherit', textAlign:'left',
+    }}>
+      <div style={{flex:1}}>
+        <div style={{fontSize:12.5, fontWeight:700, color:t.ink}}>{k}</div>
+        {sub && <div style={{fontSize:10.5, color:t.inkSoft, marginTop:2}}>{sub}</div>}
+      </div>
+      <div style={{width:38, height:22, borderRadius:99, background: on ? t.accent : t.bgInk, position:'relative', transition:'background .15s'}}>
+        <span style={{position:'absolute', top:2, left: on ? 18 : 2, width:18, height:18, borderRadius:99, background:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,.2)', transition:'left .15s'}}/>
+      </div>
+    </button>
+  );
+}
+
+// ================================================================
+// IdentityStudio — wide artboard, two-column live editor
+// Three kit variants (Heim / Auswärts / Drittes), shared crest.
+// ================================================================
+function IdentityStudio(){
+  const theme  = 'A';
+  const scheme = 'light';
+  const t = THEMES[theme][scheme];
+
+  // Crest is shared across all variants
+  const [shape, setShape]   = React.useState('gonfalon');
+  const [crestA, setCrestA] = React.useState('#7a1a1a');
+  const [crestB, setCrestB] = React.useState('#f0e8d8');
+  const [charge, setCharge] = React.useState('lion');
+  const [motto, setMotto]   = React.useState('Cor leonis');
+
+  // Three independent kits — defaults are an "invert" away + a "graphite" third
+  const [variant, setVariant] = React.useState('home');
+  const [kits, setKits] = React.useState({
+    home:  { pattern:'hoops',   a:'#7a1a1a', b:'#f0e8d8', sleeveAccent:true },
+    away:  { pattern:'solid',   a:'#f0e8d8', b:'#7a1a1a', sleeveAccent:true },
+    third: { pattern:'sash',    a:'#262626', b:'#f0e8d8', sleeveAccent:true },
+  });
+  const kit = kits[variant];
+  const updateKit = (changes) => setKits(k => ({...k, [variant]: {...k[variant], ...changes}}));
+
+  const crest = { shape, a:crestA, b:crestB, charge, motto: motto || undefined };
+
+  const Panel = ({title, hint, children}) => (
+    <div style={{marginBottom:14}}>
+      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6}}>
+        <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.8, textTransform:'uppercase'}}>{title}</div>
+        {hint && <div style={{fontSize:10, color:t.inkSoft}}>{hint}</div>}
+      </div>
+      {children}
+    </div>
+  );
+
+  const presetClubs = [
+    { id:'hafenstadt', label:'Hafenstadt' },
+    { id:'kaltenbach', label:'Kaltenbach' },
+    { id:'sauveterre', label:'Sauveterre' },
+    { id:'valguarda',  label:'Valguarda'  },
+    { id:'northbridge',label:'Northbridge'},
+    { id:'auerbach',   label:'Auerbach'   },
+  ];
+  const applyPreset = (id) => {
+    const c = CLUB_REGISTRY[id];
+    if(!c) return;
+    setShape(c.crest.shape);
+    setCrestA(c.crest.a);
+    setCrestB(c.crest.b);
+    setCharge(c.crest.charge);
+    setMotto('');
+    // Derive three kits from the club registry
+    setKits({
+      home:  { pattern: c.kit?.pattern || 'solid',  a: c.crest.a, b: c.crest.b,  sleeveAccent: true },
+      away:  { pattern: 'solid',                     a: c.crest.b, b: c.crest.a,  sleeveAccent: true },
+      third: { pattern: c.kit?.pattern === 'hoops' ? 'sash' : 'hoops',
+                                                     a:'#262626',  b: c.crest.b,  sleeveAccent: true },
+    });
+    setVariant('home');
+  };
+
+  const VARIANTS = [
+    { id:'home',  label:'Heim',      sub:'Tinkturen wie Wappen' },
+    { id:'away',  label:'Auswärts',  sub:'invertiert · sichtbar bei Auswärtsspiel' },
+    { id:'third', label:'Drittes',   sub:'Pokal · Sondertrikot' },
+  ];
+
+  return (
+    <div style={{padding:24, background:'#fbf6ea', height:'100%', display:'flex', flexDirection:'column', fontFamily:THEMES[theme].ui, color:t.ink}}>
+      <ThemeCss theme={theme} scheme={scheme}/>
+      <header style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', borderBottom:`1px solid ${t.rule}`, paddingBottom:14, marginBottom:18}}>
+        <div>
+          <div style={{fontSize:11, color:t.accent, fontWeight:800, letterSpacing:1.6, textTransform:'uppercase'}}>Studio · interaktiv</div>
+          <SerifH theme={theme} style={{display:'block', fontSize:28, fontWeight:700, color:t.ink, marginTop:2}}>Klub-Identität entwerfen</SerifH>
+          <div style={{fontSize:12.5, color:t.inkMute, marginTop:4, maxWidth:540}}>
+            Ein Wappen, drei Trikot-Sets. Wechsle zwischen Heim, Auswärts und Drittem — die Bausteine bleiben gleich, nur Muster und Tinkturen variieren.
+          </div>
+        </div>
+        <div style={{display:'flex', gap:6, flexWrap:'wrap', justifyContent:'flex-end', maxWidth:380}}>
+          {presetClubs.map(p=>(
+            <button key={p.id} onClick={()=>applyPreset(p.id)} style={{
+              height:28, padding:'0 10px', borderRadius:99,
+              background:t.card, border:`1px solid ${t.rule}`,
+              color:t.ink, fontSize:11, fontWeight:600, cursor:'pointer',
+              fontFamily:'inherit',
+            }}>{p.label}</button>
+          ))}
+        </div>
+      </header>
+
+      <div style={{display:'grid', gridTemplateColumns:'minmax(0,1fr) 360px', gap:24, flex:1, minHeight:0}}>
+        {/* Left: previews */}
+        <div style={{display:'flex', flexDirection:'column', gap:14, minWidth:0}}>
+          {/* All-three kits row (small, always visible) + crest */}
+          <div style={{display:'grid', gridTemplateColumns:'minmax(0, 240px) minmax(0, 1fr)', gap:14}}>
+            {/* Crest card */}
+            <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:14, display:'flex', flexDirection:'column', alignItems:'center', gap:8}}>
+              <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.8, textTransform:'uppercase', alignSelf:'flex-start'}}>Wappen</div>
+              <Crest {...crest} size={130}/>
+              <div style={{fontSize:11, color:t.inkSoft, marginTop:'auto', textAlign:'center'}}>{IDENT_SHAPE_LABEL[shape]} · {IDENT_CHARGE_LABEL[charge]}</div>
+            </div>
+
+            {/* Three-kit comparison + variant tabs */}
+            <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:14, display:'flex', flexDirection:'column'}}>
+              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
+                <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.8, textTransform:'uppercase'}}>Trikot-Sets · klicken zum Bearbeiten</div>
+                <div style={{fontSize:10, color:t.inkSoft}}>{VARIANTS.find(v=>v.id===variant)?.sub}</div>
+              </div>
+              <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8, flex:1}}>
+                {VARIANTS.map(v=>{
+                  const k = kits[v.id];
+                  const on = v.id === variant;
+                  return (
+                    <button key={v.id} onClick={()=>setVariant(v.id)} style={{
+                      display:'flex', flexDirection:'column', alignItems:'center', gap:6,
+                      padding:'10px 6px', borderRadius:12, cursor:'pointer',
+                      background: on ? t.bgInk : t.bg,
+                      border:`2px solid ${on ? t.ink : t.rule}`,
+                      fontFamily:'inherit',
+                    }}>
+                      <Jersey pattern={k.pattern} a={k.a} b={k.b}
+                              sleeveAccent={k.sleeveAccent} crest={on ? crest : null}
+                              size={92}/>
+                      <span style={{fontSize:11.5, color:t.ink, fontWeight:700}}>{v.label}</span>
+                      <span style={{fontSize:9.5, color:t.inkSoft, textTransform:'uppercase', letterSpacing:.5, fontWeight:600}}>
+                        {IDENT_PATTERNS.find(p=>p.id===k.pattern)?.name}
+                      </span>
+                    </button>
+                  );
+                })}
+              </div>
+            </div>
+          </div>
+
+          {/* Front + Back of the active variant */}
+          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
+            <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:14, display:'flex', flexDirection:'column', alignItems:'center', gap:6}}>
+              <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.8, textTransform:'uppercase', alignSelf:'flex-start'}}>
+                {VARIANTS.find(v=>v.id===variant)?.label}-Trikot · vorne
+              </div>
+              <Jersey pattern={kit.pattern} a={kit.a} b={kit.b}
+                      sleeveAccent={kit.sleeveAccent} crest={crest} size={150}/>
+            </div>
+            <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:14, display:'flex', flexDirection:'column', alignItems:'center', gap:6}}>
+              <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.8, textTransform:'uppercase', alignSelf:'flex-start'}}>
+                {VARIANTS.find(v=>v.id===variant)?.label}-Trikot · hinten
+              </div>
+              <Jersey pattern={kit.pattern} a={kit.a} b={kit.b}
+                      sleeveAccent={kit.sleeveAccent} showBack number="9" name="Brody" size={150}/>
+            </div>
+          </div>
+
+          {/* Lineup row + tabloid */}
+          <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'14px 18px'}}>
+            <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10}}>
+              <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.8, textTransform:'uppercase'}}>
+                Anwendungen · so erscheint die Identität im Spiel
+              </div>
+              <div style={{fontSize:10, color:t.accent, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>
+                Vorschau: {VARIANTS.find(v=>v.id===variant)?.label}
+              </div>
+            </div>
+            <div style={{display:'flex', alignItems:'center', gap:18}}>
+              <div style={{flex:1, display:'flex', alignItems:'flex-end', gap:6}}>
+                {Array.from({length:11}).map((_,i)=>(
+                  <div key={i} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:3}}>
+                    <Jersey pattern={kit.pattern} a={kit.a} b={kit.b}
+                            sleeveAccent={kit.sleeveAccent} crest={null} size={32}/>
+                    <span style={{fontSize:9, color:t.inkMute, fontFamily:'JetBrains Mono, monospace', fontWeight:700}}>{i+1}</span>
+                  </div>
+                ))}
+              </div>
+              <div style={{width:1, height:54, background:t.rule}}/>
+              <div style={{display:'flex', alignItems:'center', gap:10, minWidth:0}}>
+                <Crest {...crest} size={42}/>
+                <div style={{minWidth:0}}>
+                  <SerifH theme={theme} style={{fontSize:14, fontWeight:700, color:t.ink, display:'block', lineHeight:1.1}}>
+                    {motto ? 'Klubname' : 'Dein Klub'}
+                  </SerifH>
+                  <div style={{fontSize:11, color:t.inkMute, fontStyle:'italic'}}>{motto || '—'}</div>
+                </div>
+              </div>
+            </div>
+          </div>
+        </div>
+
+        {/* Right: controls */}
+        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:18, overflowY:'auto'}}>
+          {/* ============ WAPPEN block ============ */}
+          <div style={{fontSize:11, color:t.accent, fontWeight:800, letterSpacing:1.4, textTransform:'uppercase', marginBottom:10}}>Wappen</div>
+
+          <Panel title="Schildform" hint="4 Formen">
+            <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:6}}>
+              {IDENT_SHAPES.map(s=>{
+                const on = s===shape;
+                return (
+                  <button key={s} onClick={()=>setShape(s)} style={{
+                    display:'flex', flexDirection:'column', alignItems:'center', gap:3,
+                    padding:'8px 2px', borderRadius:8, cursor:'pointer',
+                    background: on ? t.bgInk : t.bg,
+                    border: `1.5px solid ${on ? t.ink : t.rule}`,
+                    fontFamily:'inherit',
+                  }}>
+                    <ShapeThumb shape={s} color={t.ink} size={24}/>
+                    <span style={{fontSize:10, color:t.ink, fontWeight:600}}>{IDENT_SHAPE_LABEL[s]}</span>
+                  </button>
+                );
+              })}
+            </div>
+          </Panel>
+
+          <Panel title="Tinktur A · Hauptfarbe Wappen">
+            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:6, justifyItems:'center'}}>
+              {IDENT_TINCT.map(c=>(
+                <Swatch key={c.id} hex={c.hex} name={c.name}
+                        active={crestA===c.hex} onClick={()=>setCrestA(c.hex)}
+                        size={28} label={false} theme={theme} scheme={scheme}/>
+              ))}
+            </div>
+          </Panel>
+
+          <Panel title="Tinktur B · Zweitfarbe Wappen">
+            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:6, justifyItems:'center'}}>
+              {IDENT_TINCT.map(c=>(
+                <Swatch key={c.id} hex={c.hex} name={c.name}
+                        active={crestB===c.hex} onClick={()=>setCrestB(c.hex)}
+                        size={28} label={false} theme={theme} scheme={scheme}/>
+              ))}
+            </div>
+          </Panel>
+
+          <Panel title="Wappensymbol" hint="10 Symbole">
+            <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:6, justifyItems:'center'}}>
+              {IDENT_CHARGES.map(k=>(
+                <ChargeChip key={k} kind={k}
+                            active={charge===k}
+                            fg={t.ink} bg={t.bg}
+                            onClick={()=>setCharge(k)} size={40}/>
+              ))}
+            </div>
+          </Panel>
+
+          <Panel title="Motto" hint="optional">
+            <input value={motto} onChange={e=>setMotto(e.target.value.slice(0,32))}
+                   placeholder="Per mare ad astra"
+                   style={{
+                     width:'100%', height:36, borderRadius:8,
+                     background:t.bg, border:`1px solid ${t.rule}`,
+                     padding:'0 10px', fontSize:13, color:t.ink,
+                     fontFamily:THEMES[theme].font, fontStyle:'italic',
+                     outline:'none',
+                   }}/>
+          </Panel>
+
+          {/* ============ TRIKOT block ============ */}
+          <div style={{height:1, background:t.rule, margin:'14px 0'}}/>
+          <div style={{fontSize:11, color:t.accent, fontWeight:800, letterSpacing:1.4, textTransform:'uppercase', marginBottom:10, display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
+            <span>Trikot · {VARIANTS.find(v=>v.id===variant)?.label}</span>
+            <span style={{fontSize:9.5, color:t.inkSoft, letterSpacing:.4, fontWeight:600}}>oben Set wechseln</span>
+          </div>
+
+          <Panel title="Trikotmuster" hint="6 Muster">
+            <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:6}}>
+              {IDENT_PATTERNS.map(p=>{
+                const on = p.id===kit.pattern;
+                return (
+                  <button key={p.id} onClick={()=>updateKit({pattern:p.id})} style={{
+                    display:'flex', flexDirection:'column', alignItems:'center', gap:2,
+                    padding:'6px 2px 4px', borderRadius:8, cursor:'pointer',
+                    background: on ? t.bgInk : t.bg,
+                    border: `1.5px solid ${on ? t.ink : t.rule}`,
+                    fontFamily:'inherit',
+                  }}>
+                    <Jersey pattern={p.id} a={kit.a} b={kit.b} sleeveAccent={kit.sleeveAccent} crest={null} size={36}/>
+                    <span style={{fontSize:9.5, color:t.ink, fontWeight:600}}>{p.name}</span>
+                  </button>
+                );
+              })}
+            </div>
+          </Panel>
+
+          <Panel title="Trikot-Hauptfarbe">
+            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:6, justifyItems:'center'}}>
+              {IDENT_TINCT.map(c=>(
+                <Swatch key={c.id} hex={c.hex} name={c.name}
+                        active={kit.a===c.hex} onClick={()=>updateKit({a:c.hex})}
+                        size={28} label={false} theme={theme} scheme={scheme}/>
+              ))}
+            </div>
+          </Panel>
+
+          <Panel title="Trikot-Zweitfarbe" hint="Kragen, Stutzen, Streifen">
+            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:6, justifyItems:'center'}}>
+              {IDENT_TINCT.map(c=>(
+                <Swatch key={c.id} hex={c.hex} name={c.name}
+                        active={kit.b===c.hex} onClick={()=>updateKit({b:c.hex})}
+                        size={28} label={false} theme={theme} scheme={scheme}/>
+              ))}
+            </div>
+          </Panel>
+
+          <Panel title="Details">
+            <ToggleRow theme={theme} scheme={scheme}
+              k="Ärmel-Akzent" sub="Kragen + Stutzen in Tinktur B"
+              on={kit.sleeveAccent} onChange={()=>updateKit({sleeveAccent: !kit.sleeveAccent})} last/>
+          </Panel>
+        </div>
+      </div>
+    </div>
+  );
+}
+
+// ================================================================
+// PlayerToken — used on every pitch/lineup screen.
+// Stacks: club jersey (SVG) + shirt number badge.
+// Default size 36 reads well at 2D-pitch density.
+// ================================================================
+function PlayerToken({kit, a, b, shirt, highlight=false, accent='#b7301b', size=36, ring=null}){
+  // accept either kit object or loose a/b/pattern props
+  const pattern = kit?.pattern || 'solid';
+  const sleeveAccent = kit?.sleeveAccent !== false;
+  const colA = a || kit?.a || '#0e3a5f';
+  const colB = b || kit?.b || '#c8a45a';
+
+  // luminance pick for shirt number text
+  const lumA = (() => {
+    const r = parseInt(colA.slice(1,3),16), g = parseInt(colA.slice(3,5),16), bl = parseInt(colA.slice(5,7),16);
+    return (0.299*r + 0.587*g + 0.114*bl)/255;
+  })();
+  const numColor = lumA > 0.55 ? '#11100e' : '#ffffff';
+
+  return (
+    <div style={{
+      position:'relative',
+      width:size, height:size,
+      display:'inline-flex', alignItems:'center', justifyContent:'center',
+      filter: highlight ? `drop-shadow(0 0 6px ${accent})` : 'none',
+    }}>
+      <Jersey pattern={pattern} a={colA} b={colB}
+              sleeveAccent={sleeveAccent} crest={null}
+              size={size}/>
+      {/* Highlight ring under the shirt number */}
+      <span style={{
+        position:'absolute',
+        top:size*0.38, left:'50%', transform:'translateX(-50%)',
+        minWidth:size*0.46, height:size*0.36, padding:'0 3px',
+        borderRadius:4,
+        background: highlight ? accent : 'transparent',
+        display:'grid', placeItems:'center',
+        fontFamily:'JetBrains Mono, monospace', fontWeight:800,
+        fontSize: size*0.32, lineHeight:1,
+        color: highlight ? '#fff' : numColor,
+        letterSpacing:'-.5px',
+        pointerEvents:'none',
+      }}>{shirt}</span>
+      {ring && (
+        <span style={{
+          position:'absolute', inset:-3, borderRadius:'50%',
+          border:`2px solid ${ring}`, pointerEvents:'none',
+        }}/>
+      )}
+    </div>
+  );
+}
+
+Object.assign(window, {
+  ScreenIdentity, IdentityStudio, Jersey, PlayerToken, ScreenIdentityWelcome,
+  IDENT_TINCT, IDENT_SHAPES, IDENT_CHARGES, IDENT_PATTERNS,
+});
+
+// ================================================================
+// ScreenIdentityWelcome — cinematic "Tabloid front-page" moment
+// between Manager-Onboarding and the first Hub.
+// Reveals: club crest + home kit + motto + the manager's appointment.
+// Treats the player's first sitting as a Sunday-paper announcement.
+// ================================================================
+function ScreenIdentityWelcome({theme='A', scheme='light', clubId='hafenstadt', mgrName='Julia Lindquist', mgrInitials='JL'}){
+  const t = THEMES[theme][scheme];
+  const club = CLUB_REGISTRY[clubId] || CLUB_REGISTRY.hafenstadt;
+  const crest = club.crest;
+  const kit   = club.kit || {pattern:'solid', sleeveAccent:true};
+
+  // Newsprint vertical hatch — pure CSS
+  const newsprint = `
+    repeating-linear-gradient(0deg, ${t.bgInk}30 0 1px, transparent 1px 7px),
+    repeating-linear-gradient(90deg, ${t.bgInk}10 0 1px, transparent 1px 9px)
+  `;
+
+  return (
+    <div style={{display:'flex',flexDirection:'column',height:'100%', position:'relative', background:t.bg, overflow:'hidden'}}>
+      <ThemeCss theme={theme} scheme={scheme}/>
+      {/* Subtle paper texture */}
+      <div style={{position:'absolute', inset:0, background:newsprint, opacity:.5, pointerEvents:'none'}}/>
+      {/* Skip control — keeps the brief's skippable-cover rule */}
+      <button style={{
+        position:'absolute', top:10, right:10, zIndex:20,
+        padding:'6px 12px', borderRadius:99,
+        background:'transparent', border:`1px solid ${t.rule}`,
+        color:t.inkMute, fontFamily:'inherit', fontWeight:700, fontSize:11,
+        cursor:'pointer',
+      }}>Überspringen</button>
+
+      {/* Masthead */}
+      <header style={{padding:'8px 18px 6px', borderBottom:`2px solid ${t.ink}`, marginTop:6, position:'relative', zIndex:5}}>
+        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
+          <span style={{fontSize:9.5, color:t.inkMute, fontWeight:700, letterSpacing:1.6, textTransform:'uppercase', fontFamily:'JetBrains Mono, monospace'}}>Nr. 142 · Mo 18. Mai 2026 · 1,40 €</span>
+          <span style={{fontSize:9.5, color:t.inkMute, fontWeight:700, letterSpacing:1.2, textTransform:'uppercase'}}>Sportteil</span>
+        </div>
+        <SerifH theme={theme} style={{display:'block', fontSize:34, fontWeight:800, color:t.ink, letterSpacing:-1, lineHeight:1, marginTop:2, fontStyle:'italic'}}>
+          Aurelia Times
+        </SerifH>
+        <div style={{fontSize:10, color:t.accent, fontWeight:700, letterSpacing:1.4, marginTop:4, textTransform:'uppercase'}}>
+          ★ ★ ★ Klub-Sonderausgabe ★ ★ ★
+        </div>
+      </header>
+
+      {/* Headline */}
+      <div style={{padding:'14px 18px 8px', position:'relative', zIndex:5}}>
+        <div style={{fontSize:10, color:t.accent, fontWeight:800, letterSpacing:1.8, textTransform:'uppercase'}}>Exklusiv · Trainerwechsel</div>
+        <SerifH theme={theme} style={{display:'block', fontSize:34, fontWeight:800, color:t.ink, lineHeight:.95, marginTop:4, letterSpacing:-.5}}>
+          {mgrName.split(' ').slice(-1)[0]}<br/>
+          <span style={{color:t.accent, fontStyle:'italic'}}>übernimmt</span><br/>
+          den {club.short}.
+        </SerifH>
+        <div style={{fontSize:12, color:t.inkMute, marginTop:8, fontFamily:THEMES[theme].font, fontStyle:'italic', lineHeight:1.35, paddingLeft:8, borderLeft:`2px solid ${t.accent}`}}>
+          „Wir spielen mit ruhiger Hand. <br/>Drei Punkte, dann reden wir." <span style={{color:t.inkSoft}}>— {mgrName}, gestern Abend</span>
+        </div>
+      </div>
+
+      {/* Hero block — crest + jersey side by side, in a paper card */}
+      <div style={{
+        margin:'10px 18px 0', padding:'18px 14px 16px',
+        background:t.card, border:`1px solid ${t.rule}`, borderRadius:6,
+        boxShadow:`0 1px 0 ${t.rule}`,
+        position:'relative', zIndex:5,
+      }}>
+        <div style={{display:'flex', alignItems:'center', justifyContent:'space-around', gap:8}}>
+          <Crest {...crest} motto={undefined} size={120}/>
+          <Jersey pattern={kit.pattern} a={crest.a} b={crest.b}
+                  sleeveAccent={kit.sleeveAccent} crest={crest} size={120}/>
+        </div>
+        <div style={{textAlign:'center', marginTop:10, paddingTop:10, borderTop:`1px dashed ${t.rule}`}}>
+          <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:1.6, textTransform:'uppercase'}}>Verein</div>
+          <SerifH theme={theme} style={{display:'block', fontSize:22, fontWeight:700, color:t.ink, lineHeight:1.05, marginTop:2}}>{club.name}</SerifH>
+          <div style={{fontSize:11, color:t.accent, fontWeight:700, marginTop:4, letterSpacing:.8, textTransform:'uppercase'}}>Saison 2026 / 27 · Aurelia Premier</div>
+        </div>
+      </div>
+
+      {/* Manager footer card */}
+      <div style={{
+        margin:'12px 18px 0', padding:'10px 12px',
+        display:'flex', alignItems:'center', gap:10,
+        background:'transparent', borderTop:`1px solid ${t.rule}`, borderBottom:`1px solid ${t.rule}`,
+        position:'relative', zIndex:5,
+      }}>
+        <div style={{
+          width:42, height:42, borderRadius:'50%',
+          background:t.accentSoft, color:t.accent,
+          display:'grid', placeItems:'center',
+          fontFamily:THEMES[theme].font, fontWeight:800, fontSize:18,
+          border:`2px solid ${t.accent}`,
+        }}>{mgrInitials}</div>
+        <div style={{flex:1, minWidth:0}}>
+          <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>Neuer Trainer</div>
+          <SerifH theme={theme} style={{display:'block', fontSize:15, fontWeight:700, color:t.ink, lineHeight:1.1}}>{mgrName}</SerifH>
+        </div>
+        <div style={{textAlign:'right'}}>
+          <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>Vertrag</div>
+          <SerifH theme={theme} style={{display:'block', fontSize:14, fontWeight:700, color:t.ink, fontFamily:'JetBrains Mono, monospace'}}>3 Saisons</SerifH>
+        </div>
+      </div>
+
+      <div style={{flex:1}}/>
+
+      {/* CTA */}
+      <div style={{padding:'10px 18px 24px', position:'relative', zIndex:5}}>
+        <button style={{
+          width:'100%', height:56, borderRadius:14, border:'none',
+          background:t.accent, color:'#fff', fontWeight:800, fontSize:16,
+          display:'flex', alignItems:'center', justifyContent:'center', gap:10,
+          fontFamily:'inherit',
+          boxShadow:`0 8px 20px -6px ${t.accent}80`, cursor:'pointer',
+        }}>
+          <I.Whistle size={20} color="#fff" sw={2.2}/>
+          Erste Saison antreten
+        </button>
+        <div style={{textAlign:'center', fontSize:10, color:t.inkSoft, marginTop:8, letterSpacing:.4, textTransform:'uppercase', fontWeight:700}}>
+          ↓ wischen, um den ganzen Bericht zu lesen
+        </div>
+      </div>
+    </div>
+  );
+}
diff --git "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/index.html" "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/index.html"
index c75e593..66ea852 100644
--- "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/index.html"
+++ "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/index.html"
@@ -38,6 +38,7 @@
   <script type="text/babel" src="compare.jsx"></script>
   <script type="text/babel" src="more.jsx"></script>
   <script type="text/babel" src="settings.jsx"></script>
+  <script type="text/babel" src="identity.jsx"></script>
   <script type="text/babel" src="responsive.jsx"></script>
   <script type="text/babel" src="depth.jsx"></script>
   <script type="text/babel" src="depth-data.jsx"></script>
diff --git "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/library.jsx" "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/library.jsx"
index 6d81dac..4cb5159 100644
--- "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/library.jsx"
+++ "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/library.jsx"
@@ -114,24 +114,19 @@ function LibBrand(){
         <V label="Dunkel"><ThemeSlot scheme="dark" padding="8px"><Portrait name="Kaito Furukawa" theme="A" scheme="dark" size={48} variant="player"/></ThemeSlot></V>
       </LibraryCard>
 
-      <LibraryCard name="Wordmarks"
+      <LibraryCard name="Wordmark"
         file="directions.jsx"
-        signature={`<WordmarkA size={28}/>
-<WordmarkB size={24} ink accent/>
-<WordmarkC size={24} ink accent/>`}
-        note="Drei Direction-Schriftzüge. A wird empfohlen; B und C nur für Direction-Vergleich.">
-        <V label="A · Sonntagszeitung"><WordmarkA size={26}/></V>
-        <V label="B · Schalterhalle"><div style={{padding:'8px 10px', background:'#0a1422', borderRadius:6}}><WordmarkB size={20} ink="#e6ecf3" accent="#dcb15c"/></div></V>
-        <V label="C · Hallenfunk"><div style={{padding:'8px 10px', background:'#0c0d10', borderRadius:6}}><WordmarkC size={22} ink="#eaecef" accent="#22ee8b"/></div></V>
+        signature={`<WordmarkA size={28}/>`}
+        note="Horizontaler Klub-Schriftzug. Für Onboarding-Splash und PWA-Manifest.">
+        <V label="Standard"><WordmarkA size={26}/></V>
+        <V label="Dunkel"><ThemeSlot scheme="dark" padding="10px"><WordmarkA size={26}/></ThemeSlot></V>
       </LibraryCard>
 
       <LibraryCard name="PwaIcon"
         file="directions.jsx"
-        signature={`<PwaIconA/>  <PwaIconB/>  <PwaIconC/>`}
-        note="Square PWA installable icon pro Direction. 80×80, abgerundete Ecken, kein Foto.">
-        <V label="A"><PwaIconA/></V>
-        <V label="B"><PwaIconB/></V>
-        <V label="C"><PwaIconC/></V>
+        signature={`<PwaIconA/>`}
+        note="Square PWA installable icon. 80×80, abgerundete Ecken, kein Foto.">
+        <V label="Standard"><PwaIconA/></V>
       </LibraryCard>
     </LibrarySection>
   );
diff --git "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/more.jsx" "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/more.jsx"
index b4ca157..fea1d0e 100644
--- "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/more.jsx"
+++ "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/more.jsx"
@@ -47,6 +47,10 @@ function ClubHub({clubId, scheme='light'}){
       <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'6px 0 8px'}}>
         <div style={{display:'flex',alignItems:'center',gap:10}}>
           <Crest {...c.crest} size={34}/>
+          <Jersey pattern={c.kit?.pattern || 'solid'}
+                  a={c.crest.a} b={c.crest.b}
+                  sleeveAccent={c.kit?.sleeveAccent !== false}
+                  crest={null} size={30}/>
           <div>
             <div style={{fontSize:11, color:t.inkMute, letterSpacing:.4, fontWeight:600, textTransform:'uppercase'}}>{c.name}</div>
             <SerifH theme={themeKey} style={{fontSize:18, fontWeight:700, lineHeight:1.05, color:t.ink}}>Mo, 18. Mai · 09:41</SerifH>
@@ -134,15 +138,11 @@ function ScreenTransfers({theme, scheme}){
   return (
     <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
       <ThemeCss theme={theme} scheme={scheme}/>
-      <header style={{padding:'4px 16px 8px'}}>
-        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
-          <div>
-            <div style={{fontSize:10.5,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>Transferperiode · Sommer 26</div>
-            <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:700, color:t.ink, lineHeight:1}}>Transferbüro</SerifH>
-          </div>
+      <ScreenHeader theme={theme} scheme={scheme}
+        kicker="Transferperiode · Sommer 26" title="Transferbüro"
+        right={
           <span style={{fontSize:11, color:t.accent, fontWeight:800, padding:'4px 10px', borderRadius:99, background:t.accentSoft}}>Budget: 12,4 Mio. €</span>
-        </div>
-      </header>
+        }/>
 
       {/* Tabs */}
       <div style={{padding:'4px 12px 0'}}>
@@ -279,15 +279,11 @@ function ScreenLeagueTable({theme, scheme}){
   return (
     <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
       <ThemeCss theme={theme} scheme={scheme}/>
-      <header style={{padding:'4px 16px 8px'}}>
-        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
-          <div>
-            <div style={{fontSize:10.5,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>Saison 2026/27 · 32. Spieltag</div>
-            <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:700, color:t.ink, lineHeight:1}}>Aurelia Premier</SerifH>
-          </div>
+      <ScreenHeader theme={theme} scheme={scheme}
+        kicker="Saison 2026/27 · 32. Spieltag" title="Aurelia Premier"
+        right={
           <button style={{height:34, padding:'0 10px', borderRadius:9, background:t.card, border:`1px solid ${t.rule}`, color:t.ink, fontWeight:700, fontSize:11, fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:4}}>Heim/Ausw. <I.ChevronDown size={12} color={t.ink}/></button>
-        </div>
-      </header>
+        }/>
 
       {/* Legend chips */}
       <div style={{padding:'4px 16px 8px', display:'flex', gap:6, flexWrap:'wrap'}}>
@@ -304,11 +300,10 @@ function ScreenLeagueTable({theme, scheme}){
 
       {/* Table header */}
       <div style={{padding:'0 12px'}}>
-        <div style={{display:'grid', gridTemplateColumns:'24px 24px 1fr 28px 28px 28px 38px 56px 40px', gap:6, fontSize:9.5, color:t.inkMute, fontWeight:700, letterSpacing:.3, padding:'6px 8px'}}>
+        <div style={{display:'grid', gridTemplateColumns:'20px 20px 1fr 22px 22px 30px 44px 28px', gap:4, fontSize:9.5, color:t.inkMute, fontWeight:700, letterSpacing:.3, padding:'6px 6px'}}>
           <span></span>
           <span>#</span>
           <span>Klub</span>
-          <span style={{textAlign:'right'}}>Sp</span>
           <span style={{textAlign:'right'}}>S</span>
           <span style={{textAlign:'right'}}>U</span>
           <span style={{textAlign:'right'}}>Tore</span>
@@ -323,20 +318,27 @@ function ScreenLeagueTable({theme, scheme}){
             const z = zoneFor(r.r);
             return (
               <div key={r.r} style={{
-                display:'grid', gridTemplateColumns:'24px 24px 1fr 28px 28px 28px 38px 56px 40px',
-                gap:6, alignItems:'center', padding:'8px 8px',
+                display:'grid', gridTemplateColumns:'20px 20px 1fr 22px 22px 30px 44px 28px',
+                gap:4, alignItems:'center', padding:'8px 6px',
                 background: r.own ? t.accentSoft : 'transparent',
                 borderBottom: i<TABLE.length-1?`1px solid ${t.rule}`:'none',
                 position:'relative'
               }}>
                 {z && <span style={{position:'absolute', left:0, top:0, bottom:0, width:3, background:z.c}}/>}
-                <Crest {...r.crest} size={20}/>
+                {/* Kit-color bar at the right edge — split horizontally into two halves with club's tinctures */}
+                <div title="Klubfarben" aria-hidden="true" style={{
+                  position:'absolute', right:0, top:6, bottom:6, width:4, borderRadius:1.5,
+                  overflow:'hidden', display:'flex', flexDirection:'column',
+                }}>
+                  <div style={{flex:1, background:r.crest.a}}/>
+                  <div style={{flex:1, background:r.crest.b}}/>
+                </div>
+                <Crest {...r.crest} size={18}/>
                 <span style={{fontFamily:'JetBrains Mono', fontSize:12, fontWeight:800, color: r.own?t.accent:t.ink, fontVariantNumeric:'tabular-nums'}}>{r.r}</span>
                 <div style={{display:'flex', flexDirection:'column', minWidth:0}}>
                   <SerifH theme={theme} style={{fontSize:12.5, fontWeight: r.own?800:700, color: r.own?t.accent:t.ink, lineHeight:1.1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{r.n}</SerifH>
                   {r.own && <span style={{fontSize:9, color:t.accent, fontWeight:700, marginTop:1}}>— Sie</span>}
                 </div>
-                <span style={{fontFamily:'JetBrains Mono', fontSize:11, color:t.inkMute, textAlign:'right'}}>{r.sp}</span>
                 <span style={{fontFamily:'JetBrains Mono', fontSize:11, color:t.ok, fontWeight:700, textAlign:'right'}}>{r.w}</span>
                 <span style={{fontFamily:'JetBrains Mono', fontSize:11, color:t.warn, fontWeight:700, textAlign:'right'}}>{r.d}</span>
                 <span style={{fontFamily:'JetBrains Mono', fontSize:11, color:t.inkMute, textAlign:'right'}}>{r.gf}:{r.ga}</span>
@@ -385,15 +387,9 @@ function ScreenCupBracket({theme, scheme}){
   return (
     <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
       <ThemeCss theme={theme} scheme={scheme}/>
-      <header style={{padding:'4px 16px 8px'}}>
-        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
-          <div>
-            <div style={{fontSize:10.5,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>Confederation Cup · 2026/27</div>
-            <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:700, color:t.ink, lineHeight:1}}>Pokalbaum</SerifH>
-          </div>
-          <I.Trophy size={28} color={t.accent}/>
-        </div>
-      </header>
+      <ScreenHeader theme={theme} scheme={scheme}
+        kicker="Confederation Cup · 2026/27" title="Pokalbaum"
+        right={<I.Trophy size={28} color={t.accent}/>}/>
 
       <div style={{flex:1, overflowY:'auto', padding:'4px 12px 20px'}}>
         {/* Viertelfinale */}
@@ -619,40 +615,58 @@ function Pitch2D({theme, scheme}){
         <circle cx="326" cy="110" r="1.5" fill="#fff"/>
         <circle cx="180" cy="110" r="1.5" fill="#fff"/>
       </g>
-      {/* Players — Northbridge (red, away) on left, Hafenstadt (navy, home) on right */}
+      {/* Players — Northbridge (away kit) on left, Hafenstadt (home kit) on right.
+          We render via foreignObject so the procedural Jersey SVG can sit inside the pitch SVG. */}
       <g>
-        {[
-          // NBC
-          {x:30, y:110, c:'#262626', n:'1', t:'GK'},
-          {x:60, y:60, c:'#c97a2a', n:'2'},{x:60, y:90, c:'#c97a2a', n:'4'},
-          {x:60, y:130, c:'#c97a2a', n:'5'},{x:60, y:160, c:'#c97a2a', n:'3'},
-          {x:110, y:80, c:'#c97a2a', n:'6'},{x:110, y:140, c:'#c97a2a', n:'8'},
-          {x:140, y:110, c:'#c97a2a', n:'10'},
-          {x:170, y:70, c:'#c97a2a', n:'7'},{x:175, y:150, c:'#c97a2a', n:'11'},
-          {x:185, y:110, c:'#c97a2a', n:'9'},
-        ].map((p,i)=>(
-          <g key={'nbc'+i}>
-            <circle cx={p.x} cy={p.y} r="9" fill={p.c} stroke="#fff" strokeWidth="1.4"/>
-            <text x={p.x} y={p.y+2} textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" fontFamily="Inter">{p.n}</text>
-          </g>
-        ))}
-        {[
-          // FCH
-          {x:330, y:110, c:'#c8a45a', n:'1'},
-          {x:300, y:60, c:'#0e3a5f', n:'18'},{x:300, y:90, c:'#0e3a5f', n:'5'},
-          {x:300, y:130, c:'#0e3a5f', n:'4'},{x:300, y:160, c:'#0e3a5f', n:'22'},
-          {x:250, y:80, c:'#0e3a5f', n:'6'},{x:250, y:130, c:'#0e3a5f', n:'14'},
-          {x:230, y:110, c:'#0e3a5f', n:'8'},
-          {x:200, y:65, c:'#0e3a5f', n:'10', highlight:true},
-          {x:210, y:155, c:'#0e3a5f', n:'11'},
-          {x:195, y:108, c:'#0e3a5f', n:'9'},
-        ].map((p,i)=>(
-          <g key={'fch'+i}>
-            {p.highlight && <circle cx={p.x} cy={p.y} r="14" fill={t.accent} opacity=".4"/>}
-            <circle cx={p.x} cy={p.y} r="9" fill={p.c} stroke="#fff" strokeWidth="1.4"/>
-            <text x={p.x} y={p.y+2} textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" fontFamily="Inter">{p.n}</text>
-          </g>
-        ))}
+        {(() => {
+          const nbcCrest = crestFor('Northbridge City');
+          const nbcKit   = kitFor('Northbridge City');
+          const fchCrest = crestFor('FC Hafenstadt');
+          const fchKit   = kitFor('FC Hafenstadt');
+          const NBC = [
+            {x:30, y:110, n:'1', gk:true},
+            {x:60, y:60, n:'2'},{x:60, y:90, n:'4'},
+            {x:60, y:130, n:'5'},{x:60, y:160, n:'3'},
+            {x:110, y:80, n:'6'},{x:110, y:140, n:'8'},
+            {x:140, y:110, n:'10'},
+            {x:170, y:70, n:'7'},{x:175, y:150, n:'11'},
+            {x:185, y:110, n:'9'},
+          ];
+          const FCH = [
+            {x:330, y:110, n:'1', gk:true},
+            {x:300, y:60, n:'18'},{x:300, y:90, n:'5'},
+            {x:300, y:130, n:'4'},{x:300, y:160, n:'22'},
+            {x:250, y:80, n:'6'},{x:250, y:130, n:'14'},
+            {x:230, y:110, n:'8'},
+            {x:200, y:65, n:'10', highlight:true},
+            {x:210, y:155, n:'11'},
+            {x:195, y:108, n:'9'},
+          ];
+          const SZ = 22;
+          const renderToken = (p, kit, crest, isAway=false) => {
+            // GK gets a contrast kit (secondary color as main)
+            const a = p.gk ? crest.b : crest.a;
+            const b = p.gk ? crest.a : crest.b;
+            const pattern = p.gk ? 'solid' : kit.pattern;
+            return (
+              <foreignObject key={`${isAway?'nbc':'fch'}-${p.n}`}
+                x={p.x - SZ/2} y={p.y - SZ/2} width={SZ} height={SZ}
+                style={{overflow:'visible'}}>
+                <div xmlns="http://www.w3.org/1999/xhtml" style={{width:SZ, height:SZ, position:'relative'}}>
+                  <PlayerToken kit={{pattern, sleeveAccent:kit.sleeveAccent}}
+                               a={a} b={b} shirt={p.n} size={SZ}
+                               highlight={p.highlight} accent={t.accent}/>
+                </div>
+              </foreignObject>
+            );
+          };
+          return (
+            <>
+              {NBC.map(p => renderToken(p, nbcKit, nbcCrest, true))}
+              {FCH.map(p => renderToken(p, fchKit, fchCrest, false))}
+            </>
+          );
+        })()}
         {/* Ball + recent action arrow */}
         <g>
           <path d="M210 80 Q160 80 60 105" fill="none" stroke={t.accent} strokeWidth="1.6" strokeDasharray="3 2" opacity=".8"/>
@@ -716,15 +730,11 @@ function ScreenLineupRoles({theme, scheme}){
   return (
     <div style={{display:'flex',flexDirection:'column',height:'100%', position:'relative'}}>
       <ThemeCss theme={theme} scheme={scheme}/>
-      <header style={{padding:'4px 16px 6px'}}>
-        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
-          <div>
-            <div style={{fontSize:10.5,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>Aufstellung mit Rollen · 4-3-3</div>
-            <SerifH theme={theme} style={{display:'block', fontSize:22, fontWeight:700, color:t.ink, lineHeight:1}}>Mannschaft</SerifH>
-          </div>
+      <ScreenHeader theme={theme} scheme={scheme}
+        kicker="Aufstellung mit Rollen · 4-3-3" title="Mannschaft"
+        right={
           <span style={{fontSize:10, fontWeight:800, letterSpacing:.6, color:t.accent, padding:'4px 9px', borderRadius:99, background:t.accentSoft}}>EIGNUNG Ø 84 %</span>
-        </div>
-      </header>
+        }/>
 
       {/* Pitch */}
       <div style={{padding:'8px 14px 0', position:'relative'}}>
@@ -735,34 +745,32 @@ function ScreenLineupRoles({theme, scheme}){
             <line x1="2" y1="70" x2="98" y2="70" stroke="#fff" strokeWidth=".5" opacity=".6"/>
             <circle cx="50" cy="70" r="9" fill="none" stroke="#fff" strokeWidth=".5" opacity=".6"/>
           </svg>
-          {players.map((p,i)=>(
-            <div key={i} style={{
-              position:'absolute',
-              left:`calc(${p.x}% - 30px)`,
-              top:`calc(${(p.y/140)*100}% - 30px)`,
-              width:60, height:60, display:'flex', flexDirection:'column', alignItems:'center'
-            }}>
-              <div style={{
-                width:28, height:28, borderRadius:99,
-                background: p.hi ? t.accent : t.card,
-                color: p.hi ? '#fff' : t.ink,
-                border:`2px solid ${p.hi ? t.accent : t.ink}`,
-                display:'grid', placeItems:'center',
-                fontFamily:'JetBrains Mono', fontWeight:800, fontSize:11,
-                boxShadow: p.hi ? `0 0 0 4px ${t.accent}30` : `0 1px 2px ${t.ink}40`
-              }}>{p.shirt}</div>
-              <div style={{
-                fontSize:9, fontWeight:700, color:t.ink, lineHeight:1, marginTop:3,
-                background:t.bg, padding:'1px 3px', borderRadius:3, whiteSpace:'nowrap',
-                overflow:'hidden', textOverflow:'ellipsis', maxWidth:54
-              }}>{p.name}</div>
-              <div style={{
-                fontSize:8, color: p.hi?t.accent:t.accent, fontWeight:800,
-                background:t.accentSoft, padding:'1px 4px', borderRadius:3, marginTop:1,
-                whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:62
-              }}>{p.role}</div>
-            </div>
-          ))}
+          {players.map((p,i)=>{
+            const ownKit = kitFor('FC Hafenstadt');
+            const ownCrest = crestFor('FC Hafenstadt');
+            return (
+              <div key={i} style={{
+                position:'absolute',
+                left:`calc(${p.x}% - 30px)`,
+                top:`calc(${(p.y/140)*100}% - 30px)`,
+                width:60, height:60, display:'flex', flexDirection:'column', alignItems:'center'
+              }}>
+                <PlayerToken kit={ownKit} a={ownCrest.a} b={ownCrest.b}
+                             shirt={p.shirt} size={32}
+                             highlight={p.hi} accent={t.accent}/>
+                <div style={{
+                  fontSize:9, fontWeight:700, color:t.ink, lineHeight:1, marginTop:3,
+                  background:t.bg, padding:'1px 3px', borderRadius:3, whiteSpace:'nowrap',
+                  overflow:'hidden', textOverflow:'ellipsis', maxWidth:54
+                }}>{p.name}</div>
+                <div style={{
+                  fontSize:8, color: p.hi?t.accent:t.accent, fontWeight:800,
+                  background:t.accentSoft, padding:'1px 4px', borderRadius:3, marginTop:1,
+                  whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:62
+                }}>{p.role}</div>
+              </div>
+            );
+          })}
         </div>
       </div>
 
diff --git "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/negotiations.jsx" "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/negotiations.jsx"
index 4b4b2ff..54b7373 100644
--- "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/negotiations.jsx"
+++ "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/negotiations.jsx"
@@ -230,18 +230,12 @@ function ConfidenceGauge({value=7, max=10, theme, scheme, label='Vertrauen'}){
 }
 
 // ---------- SHARED SCREEN HEADER ----------
+// Now delegates to the global ScreenHeader so negotiation screens also get
+// the club crest + shortcode framing.
 function NegHeader({theme, scheme, kicker, title, right}){
-  const t = THEMES[theme][scheme];
   return (
-    <header style={{padding:'4px 16px 10px'}}>
-      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
-        <div>
-          <div style={{fontSize:10.5,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>{kicker}</div>
-          <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:700, color:t.ink, lineHeight:1}}>{title}</SerifH>
-        </div>
-        {right}
-      </div>
-    </header>
+    <ScreenHeader theme={theme} scheme={scheme}
+      kicker={kicker} title={title} right={right}/>
   );
 }
 
diff --git "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/screens-part1.jsx" "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/screens-part1.jsx"
index bdd9c11..bc48916 100644
--- "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/screens-part1.jsx"
+++ "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/screens-part1.jsx"
@@ -109,22 +109,20 @@ function ScreenInbox({theme, scheme}){
   return (
     <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
       <ThemeCss theme={theme} scheme={scheme}/>
-      <header style={{padding:'4px 16px 10px', borderBottom:`1px solid ${t.rule}`}}>
-        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
-          <div>
-            <div style={{fontSize:11,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>5 ungelesen</div>
-            <SerifH theme={theme} style={{display:'block', fontSize:26, fontWeight:700, color:t.ink, lineHeight:1}}>Posteingang</SerifH>
-          </div>
+      <ScreenHeader theme={theme} scheme={scheme}
+        kicker="5 ungelesen" title="Posteingang"
+        right={
           <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.Filter color={t.ink} size={16}/></button>
-        </div>
-        <div style={{display:'flex',gap:6,marginTop:10, overflowX:'auto'}}>
+        }>
+        <div style={{display:'flex',gap:6,marginTop:10, overflowX:'auto', paddingBottom:2}}>
           {['Alle','Vorstand','Presse','Sponsor','Scouting','Fans'].map((c,i)=>(
             <span key={c} style={{padding:'5px 10px', borderRadius:999, fontSize:11, fontWeight:600,
               background: i===0 ? t.ink : 'transparent', color: i===0?t.bg:t.inkMute,
               border:`1px solid ${i===0 ? t.ink : t.rule}`, whiteSpace:'nowrap'}}>{c}</span>
           ))}
         </div>
-      </header>
+        <div style={{borderBottom:`1px solid ${t.rule}`, marginTop:8, marginLeft:-16, marginRight:-16}}/>
+      </ScreenHeader>
 
       <div style={{flex:1, overflowY:'auto', padding:'10px 12px 24px'}}>
         {INBOX.map((c,i)=>{
@@ -164,17 +162,14 @@ function ScreenSquad({theme, scheme}){
   return (
     <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
       <ThemeCss theme={theme} scheme={scheme}/>
-      <header style={{padding:'4px 16px 10px'}}>
-        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
-          <div>
-            <div style={{fontSize:11,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>Kader · 14 Spieler</div>
-            <SerifH theme={theme} style={{display:'block', fontSize:26, fontWeight:700, color:t.ink, lineHeight:1}}>Erste Mannschaft</SerifH>
-          </div>
+      <ScreenHeader theme={theme} scheme={scheme}
+        kicker="Kader · 14 Spieler" title="Erste Mannschaft"
+        right={
           <div style={{display:'flex', gap:6}}>
             <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.Search color={t.ink} size={16}/></button>
             <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.Filter color={t.ink} size={16}/></button>
           </div>
-        </div>
+        }>
         <div style={{display:'flex',gap:6,marginTop:10, overflowX:'auto'}}>
           {[{l:'Stärke',a:true},{l:'Alter'},{l:'Vertrag'},{l:'Talent'},{l:'Position'}].map(c=>(
             <span key={c.l} style={{padding:'6px 11px', borderRadius:999, fontSize:11, fontWeight:600,
@@ -184,7 +179,7 @@ function ScreenSquad({theme, scheme}){
             </span>
           ))}
         </div>
-      </header>
+      </ScreenHeader>
 
       <div style={{flex:1, overflowY:'auto', padding:'4px 12px 20px'}}>
         {SQUAD.slice(0,11).map((p,i)=><PlayerCard key={i} p={p} theme={theme} scheme={scheme}/>)}
@@ -240,9 +235,13 @@ function PlayerCard({p, theme, scheme}){
 // =================================================================
 function ScreenPreMatch({theme, scheme}){
   const t = THEMES[theme][scheme];
-  const Side = ({s, crestProps, align}) => (
+  const Side = ({s, crestProps, kit, align}) => (
     <div style={{display:'flex',flexDirection:'column',alignItems:align==='right'?'flex-end':'flex-start',gap:6,flex:1}}>
-      <Crest {...crestProps} size={56}/>
+      <div style={{display:'flex', alignItems:'flex-end', gap:6, flexDirection:align==='right'?'row-reverse':'row'}}>
+        <Crest {...crestProps} size={56}/>
+        <Jersey pattern={kit.pattern} a={crestProps.a} b={crestProps.b}
+                sleeveAccent={kit.sleeveAccent} crest={null} size={40}/>
+      </div>
       <SerifH theme={theme} style={{fontSize:17, fontWeight:700, color:t.ink, lineHeight:1.05, textAlign:align==='right'?'right':'left'}}>{s.name}</SerifH>
       <div style={{fontSize:10, color:t.inkMute}}>{s.ranking}</div>
     </div>
@@ -269,9 +268,9 @@ function ScreenPreMatch({theme, scheme}){
       </header>
 
       <div style={{padding:'10px 16px 0', display:'flex', alignItems:'center', gap:10}}>
-        <Side s={OPP} crestProps={crestFor('Northbridge City')} align="left"/>
+        <Side s={OPP} crestProps={crestFor('Northbridge City')} kit={kitFor('Northbridge City')} align="left"/>
         <SerifH theme={theme} style={{fontSize:30, fontWeight:700, color:t.inkSoft, fontStyle:'italic'}}>vs.</SerifH>
-        <Side s={OWN} crestProps={crestFor('FC Hafenstadt')} align="right"/>
+        <Side s={OWN} crestProps={crestFor('FC Hafenstadt')} kit={kitFor('FC Hafenstadt')} align="right"/>
       </div>
 
       <div style={{margin:'14px 16px 0', background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'4px 14px'}}>
diff --git "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/screens-part2.jsx" "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/screens-part2.jsx"
index e94c7ee..0ba273f 100644
--- "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/screens-part2.jsx"
+++ "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/screens-part2.jsx"
@@ -26,11 +26,19 @@ function ScreenMatchFeed({theme, scheme}){
         <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:14, marginTop:6}}>
           <div style={{display:'flex', alignItems:'center', gap:8}}>
             <Crest {...crestFor('Northbridge City')} size={28}/>
+            <Jersey pattern={kitFor('Northbridge City').pattern}
+                    a={crestFor('Northbridge City').a} b={crestFor('Northbridge City').b}
+                    sleeveAccent={kitFor('Northbridge City').sleeveAccent}
+                    crest={null} size={24}/>
             <SerifH theme={theme} style={{fontSize:14, fontWeight:700, color:t.ink}}>Northbridge</SerifH>
           </div>
           <SerifH theme={theme} style={{fontSize:42, fontWeight:800, color:t.ink, letterSpacing:-1, fontFamily:THEMES[theme].font, lineHeight:1}}>1<span style={{color:t.inkSoft}}>:</span><span style={{color:t.accent}}>2</span></SerifH>
           <div style={{display:'flex', alignItems:'center', gap:8}}>
             <SerifH theme={theme} style={{fontSize:14, fontWeight:700, color:t.ink}}>Hafenstadt</SerifH>
+            <Jersey pattern={kitFor('FC Hafenstadt').pattern}
+                    a={crestFor('FC Hafenstadt').a} b={crestFor('FC Hafenstadt').b}
+                    sleeveAccent={kitFor('FC Hafenstadt').sleeveAccent}
+                    crest={null} size={24}/>
             <Crest {...crestFor('FC Hafenstadt')} size={28}/>
           </div>
         </div>
@@ -173,12 +181,23 @@ function ScreenHalftime({theme, scheme}){
             <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.5, textTransform:'uppercase'}}>Vorgeschlagener Wechsel</div>
             <span style={{fontSize:10, color:t.accent, fontWeight:700}}>Co-Trainer empfiehlt</span>
           </div>
-          <div style={{display:'flex', alignItems:'center', gap:8, marginTop:6, fontSize:13}}>
-            <span style={{fontWeight:700, color:t.ink}}>Holtmann</span>
+          <div style={{display:'flex', alignItems:'center', gap:10, marginTop:8, fontSize:13}}>
+            <div style={{display:'flex', alignItems:'center', gap:6}}>
+              <PlayerToken kit={kitFor('FC Hafenstadt')}
+                           a={crestFor('FC Hafenstadt').a} b={crestFor('FC Hafenstadt').b}
+                           shirt="6" size={30}/>
+              <span style={{fontWeight:700, color:t.ink}}>Holtmann</span>
+            </div>
             <I.ArrowRight size={16} color={t.inkSoft}/>
-            <span style={{fontWeight:700, color:t.accent}}>Velten</span>
+            <div style={{display:'flex', alignItems:'center', gap:6}}>
+              <PlayerToken kit={kitFor('FC Hafenstadt')}
+                           a={crestFor('FC Hafenstadt').a} b={crestFor('FC Hafenstadt').b}
+                           shirt="14" size={30}
+                           highlight={true} accent={t.accent}/>
+              <span style={{fontWeight:700, color:t.accent}}>Velten</span>
+            </div>
             <span style={{flex:1}}/>
-            <span style={{fontSize:11, color:t.inkMute}}>frischer · +0,4 Form</span>
+            <span style={{fontSize:11, color:t.inkMute, textAlign:'right'}}>frischer<br/>+0,4 Form</span>
           </div>
         </div>
 
@@ -213,15 +232,9 @@ function ScreenFinance({theme, scheme}){
   return (
     <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
       <ThemeCss theme={theme} scheme={scheme}/>
-      <header style={{padding:'4px 16px 10px'}}>
-        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
-          <div>
-            <div style={{fontSize:11,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>Mai 2026</div>
-            <SerifH theme={theme} style={{display:'block', fontSize:26, fontWeight:700, color:t.ink, lineHeight:1}}>Finanzen</SerifH>
-          </div>
-          <LevyChip theme={theme} scheme={scheme}/>
-        </div>
-      </header>
+      <ScreenHeader theme={theme} scheme={scheme}
+        kicker="Mai 2026" title="Finanzen"
+        right={<LevyChip theme={theme} scheme={scheme}/>}/>
 
       <div style={{padding:'0 16px 12px'}}>
         <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'12px 14px'}}>
@@ -389,18 +402,15 @@ function ScreenStadium({theme, scheme}){
   return (
     <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
       <ThemeCss theme={theme} scheme={scheme}/>
-      <header style={{padding:'4px 16px 8px'}}>
-        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
-          <div>
-            <div style={{fontSize:10.5,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>{STADIUM_INFO.name} · {STADIUM_INFO.built}</div>
-            <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:700, color:t.ink, lineHeight:1}}>Stadionausbau</SerifH>
-          </div>
+      <ScreenHeader theme={theme} scheme={scheme}
+        kicker={`${STADIUM_INFO.name} · ${STADIUM_INFO.built}`}
+        title="Stadionausbau"
+        right={
           <div style={{textAlign:'right'}}>
             <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>Kapazität</div>
             <SerifH theme={theme} style={{fontSize:18, fontWeight:800, color:t.ink, fontFamily:'JetBrains Mono'}}>27.412</SerifH>
           </div>
-        </div>
-      </header>
+        }/>
 
       {/* Section tabs */}
       <div style={{padding:'4px 12px 0'}}>
@@ -646,8 +656,14 @@ function ScreenOnboardingClub({theme, scheme}){
               borderRadius:14, padding:'10px 10px 12px',
               display:'flex', flexDirection:'column', alignItems:'flex-start', gap:4
             }}>
-              <Crest shape={c.shape} a={c.a} b={c.b} charge={c.charge} size={42}/>
-              <SerifH theme={theme} style={{fontSize:13, fontWeight:700, color:t.ink, lineHeight:1.1, marginTop:2}}>{c.n}</SerifH>
+              <div style={{display:'flex', alignItems:'flex-end', gap:6, alignSelf:'stretch'}}>
+                <Crest shape={c.shape} a={c.a} b={c.b} charge={c.charge} size={42}/>
+                <span style={{flex:1}}/>
+                <Jersey pattern={c.kit?.pattern || 'solid'} a={c.a} b={c.b}
+                        sleeveAccent={c.kit?.sleeveAccent !== false}
+                        crest={null} size={36}/>
+              </div>
+              <SerifH theme={theme} style={{fontSize:13, fontWeight:700, color:t.ink, lineHeight:1.1, marginTop:4}}>{c.n}</SerifH>
               <div style={{fontSize:10, color:i===0?t.accent:t.inkMute, fontWeight:700, letterSpacing:.4, textTransform:'uppercase'}}>{c.league}</div>
               <div style={{fontSize:10.5, color:t.inkMute, lineHeight:1.3, fontFamily:THEMES[theme].font, fontStyle:'italic'}}>{c.pitch}</div>
             </div>
@@ -742,10 +758,39 @@ function ScreenSaves({theme, scheme}){
           return (
             <div key={i} style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'14px', marginBottom:10}}>
               <div style={{display:'flex', alignItems:'center', gap:10}}>
-                <div style={{width:42, height:42, borderRadius:10, background:t.accentSoft, color:t.accent, display:'grid', placeItems:'center', fontFamily:THEMES[theme].font, fontWeight:800, fontSize:18}}>{s.mgr}</div>
+                {/* Club identity badge — jersey + crest stacked, replaces generic manager-initials chip */}
+                <div style={{
+                  width:54, height:54, borderRadius:12,
+                  background:t.bg, border:`1px solid ${t.rule}`,
+                  display:'grid', placeItems:'center',
+                  position:'relative', flex:'0 0 54px',
+                }}>
+                  <Jersey pattern={kitFor(s.club).pattern}
+                          a={crestFor(s.club).a} b={crestFor(s.club).b}
+                          sleeveAccent={kitFor(s.club).sleeveAccent}
+                          crest={null} size={42}/>
+                  <div style={{
+                    position:'absolute', bottom:-4, right:-4,
+                    width:22, height:22, borderRadius:'50%',
+                    background:t.card, border:`1.5px solid ${t.rule}`,
+                    display:'grid', placeItems:'center',
+                  }}>
+                    <Crest {...crestFor(s.club)} size={18}/>
+                  </div>
+                </div>
                 <div style={{flex:1, minWidth:0}}>
                   <SerifH theme={theme} style={{display:'block', fontSize:16, fontWeight:700, color:t.ink, lineHeight:1.1}}>{s.name}</SerifH>
-                  <div style={{fontSize:11, color:t.inkMute, marginTop:2}}>{s.club} · Saison {s.season}</div>
+                  <div style={{fontSize:11, color:t.inkMute, marginTop:2}}>
+                    <span style={{display:'inline-flex', alignItems:'center', gap:4}}>
+                      <span style={{
+                        width:14, height:14, borderRadius:'50%',
+                        background:t.accentSoft, color:t.accent,
+                        display:'grid', placeItems:'center',
+                        fontFamily:THEMES[theme].font, fontWeight:800, fontSize:9,
+                      }}>{s.mgr}</span>
+                      {s.club} · Saison {s.season}
+                    </span>
+                  </div>
                 </div>
                 <span style={{fontSize:10, color:t.inkSoft, whiteSpace:'nowrap'}}>{s.stamp}</span>
               </div>
diff --git "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/settings.jsx" "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/settings.jsx"
index ee367c1..9e0054e 100644
--- "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/settings.jsx"
+++ "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/settings.jsx"
@@ -58,6 +58,11 @@ function ScreenSettings({theme, scheme}){
           <I.ChevronRight size={16} color={t.inkSoft}/>
         </div>
 
+        <Group l="Klub">
+          <Row glyph={<Crest {...crestFor('FC Hafenstadt')} size={26}/>}
+               k="Wappen & Trikot" sub="Schildform, Tinkturen, Motto, Trikotmuster" v="bearbeiten" last/>
+        </Group>
+
         <Group l="Spiel">
           <Row glyph={<I.Globe color={t.ink} size={16}/>}    k="Sprache"        sub="Anrede, Tonalität, Datumsformat" v="Deutsch"/>
           <Row glyph={<I.Settings color={t.ink} size={16}/>}  k="Datendichte"    sub="Kompakt oder Profi-Modus mit 1–20-Attributen" v="Kompakt"/>
diff --git "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/sponsor.jsx" "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/sponsor.jsx"
index 2664aa0..ad8f756 100644
--- "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/sponsor.jsx"
+++ "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/sponsor.jsx"
@@ -43,17 +43,14 @@ function ScreenSponsorPyramid({theme='A', scheme='light'}){
   return (
     <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
       <ThemeCss theme={theme} scheme={scheme}/>
-      <header style={{padding:'4px 16px 8px'}}>
-        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
-          <div>
-            <div style={{fontSize:10.5,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>5 Verträge · {((TOTAL)/1_000_000).toFixed(1).replace('.', ',')} Mio. € pro Saison</div>
-            <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:700, color:t.ink, lineHeight:1}}>Sponsoren-Pyramide</SerifH>
-          </div>
+      <ScreenHeader theme={theme} scheme={scheme}
+        kicker={`5 Verträge · ${((TOTAL)/1_000_000).toFixed(1).replace('.', ',')} Mio. € pro Saison`}
+        title="Sponsoren-Pyramide"
+        right={
           <button style={{height:34, padding:'0 12px', borderRadius:9, background:t.card, border:`1px solid ${t.rule}`, fontWeight:700, fontSize:11, color:t.ink, fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:5}}>
             <I.Plus size={13} color={t.ink}/> Anbahnen
           </button>
-        </div>
-      </header>
+        }/>
 
       <div style={{flex:1, overflowY:'auto', padding:'0 16px 20px'}}>
         {/* Pyramid SVG */}
diff --git "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/tactics.jsx" "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/tactics.jsx"
index 2d384fc..549caab 100644
--- "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/tactics.jsx"
+++ "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/tactics.jsx"
@@ -99,17 +99,14 @@ function ScreenTactics({theme, scheme}){
   return (
     <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
       <ThemeCss theme={theme} scheme={scheme}/>
-      <header style={{padding:'4px 16px 6px'}}>
-        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
-          <div>
-            <div style={{fontSize:10.5,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>Taktik · gespeichert „Hafenstadt-Standard"</div>
-            <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:700, color:t.ink, lineHeight:1}}>Taktik</SerifH>
-          </div>
+      <ScreenHeader theme={theme} scheme={scheme}
+        kicker={`Taktik · gespeichert „Hafenstadt-Standard"`}
+        title="Taktik"
+        right={
           <button style={{height:34, padding:'0 10px', borderRadius:9, background:t.card, border:`1px solid ${t.rule}`, color:t.ink, fontWeight:700, fontSize:11, fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:4}}>
             <I.Plus size={13} color={t.ink}/> Speichern
           </button>
-        </div>
-      </header>
+        }/>
 
       {/* Preset row */}
       <div style={{padding:'6px 12px 0'}}>
@@ -315,15 +312,12 @@ function ScreenLineup({theme, scheme}){
   return (
     <div style={{display:'flex',flexDirection:'column',height:'100%', position:'relative'}}>
       <ThemeCss theme={theme} scheme={scheme}/>
-      <header style={{padding:'4px 16px 6px'}}>
-        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
-          <div>
-            <div style={{fontSize:10.5,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>Aufstellung · Northbridge auswärts</div>
-            <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:700, color:t.ink, lineHeight:1}}>Mannschaft</SerifH>
-          </div>
+      <ScreenHeader theme={theme} scheme={scheme}
+        kicker="Aufstellung · Northbridge auswärts"
+        title="Mannschaft"
+        right={
           <span style={{fontSize:10, fontWeight:800, letterSpacing:.6, color:t.accent, padding:'4px 9px', borderRadius:99, background:t.accentSoft}}>STÄRKE Ø 7,4</span>
-        </div>
-      </header>
+        }/>
 
       {/* Formation row */}
       <div style={{padding:'6px 12px 0'}}>
@@ -369,25 +363,21 @@ function ScreenLineup({theme, scheme}){
           {/* Player nodes overlaid as HTML for tap targets */}
           {players.map((p,i)=>{
             const isSel = selected === i;
+            const ownKit = kitFor('FC Hafenstadt');
+            const ownCrest = crestFor('FC Hafenstadt');
             return (
               <button key={p.shirt} onClick={()=>onTap(i)} aria-label={`Spieler ${p.name}`} style={{
                 position:'absolute',
                 left:`calc(${p.x}% - 22px)`,
-                top:`calc(${(p.y/140)*100}% - 26px)`,
-                width:44, height:52, padding:0,
+                top:`calc(${(p.y/140)*100}% - 28px)`,
+                width:44, height:60, padding:0,
                 background:'transparent', border:'none', cursor:'pointer',
                 display:'flex', flexDirection:'column', alignItems:'center',
                 fontFamily:'inherit'
               }}>
-                <div style={{
-                  width:32, height:32, borderRadius:99,
-                  background: isSel ? t.accent : t.card,
-                  color: isSel ? '#fff' : t.ink,
-                  border:`2px solid ${isSel ? t.accent : t.ink}`,
-                  display:'grid', placeItems:'center',
-                  fontFamily:'JetBrains Mono', fontWeight:800, fontSize:13,
-                  boxShadow: isSel ? `0 0 0 4px ${t.accent}40` : `0 1px 2px ${t.ink}40`
-                }}>{p.shirt}</div>
+                <PlayerToken kit={ownKit} a={ownCrest.a} b={ownCrest.b}
+                             shirt={p.shirt} size={36}
+                             highlight={isSel} accent={t.accent}/>
                 <div style={{
                   fontSize:9.5, fontWeight:700, color:t.ink, lineHeight:1, marginTop:3,
                   background:t.bg, padding:'1px 3px', borderRadius:3,
@@ -441,17 +431,13 @@ function ScreenStats({theme, scheme}){
   return (
     <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
       <ThemeCss theme={theme} scheme={scheme}/>
-      <header style={{padding:'4px 16px 8px'}}>
-        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
-          <div>
-            <div style={{fontSize:10.5,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>Saison 2026/27</div>
-            <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:700, color:t.ink, lineHeight:1}}>Statistiken</SerifH>
-          </div>
+      <ScreenHeader theme={theme} scheme={scheme}
+        kicker="Saison 2026/27" title="Statistiken"
+        right={
           <button style={{height:34, padding:'0 10px', borderRadius:9, background:t.card, border:`1px solid ${t.rule}`, color:t.ink, fontWeight:700, fontSize:11, fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:4}}>
             2026/27 <I.ChevronDown size={12} color={t.ink}/>
           </button>
-        </div>
-      </header>
+        }/>
 
       {/* tabs */}
       <div style={{padding:'4px 12px 0'}}>
diff --git "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/team.jsx" "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/team.jsx"
index e8951fb..b8776ec 100644
--- "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/team.jsx"
+++ "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/team.jsx"
@@ -219,15 +219,11 @@ function ScreenTraining({theme, scheme}){
   return (
     <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
       <ThemeCss theme={theme} scheme={scheme}/>
-      <header style={{padding:'4px 16px 6px'}}>
-        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
-          <div>
-            <div style={{fontSize:10.5,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>Trainingswoche · 19. Mai</div>
-            <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:700, color:t.ink, lineHeight:1}}>Training</SerifH>
-          </div>
+      <ScreenHeader theme={theme} scheme={scheme}
+        kicker="Trainingswoche · 19. Mai" title="Training"
+        right={
           <span style={{fontSize:11, color:t.accent, fontWeight:800, padding:'4px 10px', borderRadius:99, background:t.accentSoft}}>Sonntag: Northbridge</span>
-        </div>
-      </header>
+        }/>
 
       {/* Squad picker */}
       <div style={{padding:'8px 16px 0'}}>
@@ -332,17 +328,13 @@ function ScreenIndividualTraining({theme, scheme}){
   return (
     <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
       <ThemeCss theme={theme} scheme={scheme}/>
-      <header style={{padding:'4px 16px 8px'}}>
-        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
-          <div>
-            <div style={{fontSize:10.5,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>4 von 6 Slots belegt</div>
-            <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:700, color:t.ink, lineHeight:1}}>Einzeltraining</SerifH>
-          </div>
+      <ScreenHeader theme={theme} scheme={scheme}
+        kicker="4 von 6 Slots belegt" title="Einzeltraining"
+        right={
           <button style={{height:34, padding:'0 12px', borderRadius:9, background:t.ink, color:t.bg, border:'none', fontWeight:700, fontSize:11, fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:4}}>
             <I.Plus size={13} color={t.bg}/> Spieler
           </button>
-        </div>
-      </header>
+        }/>
 
       {/* Coach load */}
       <div style={{padding:'0 16px'}}>
@@ -430,15 +422,11 @@ function ScreenMedical({theme, scheme}){
   return (
     <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
       <ThemeCss theme={theme} scheme={scheme}/>
-      <header style={{padding:'4px 16px 8px'}}>
-        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
-          <div>
-            <div style={{fontSize:10.5,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>Medizinische Abteilung</div>
-            <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:700, color:t.ink, lineHeight:1}}>Krankenstation</SerifH>
-          </div>
+      <ScreenHeader theme={theme} scheme={scheme}
+        kicker="Medizinische Abteilung" title="Krankenstation"
+        right={
           <span style={{fontSize:11, color:t.danger, fontWeight:800, padding:'4px 10px', borderRadius:99, background:t.danger+'14'}}>3 Ausfälle</span>
-        </div>
-      </header>
+        }/>
 
       <div style={{flex:1, overflowY:'auto', padding:'10px 16px 20px'}}>
         {/* Doc */}
@@ -539,17 +527,13 @@ function ScreenScouting({theme, scheme}){
   return (
     <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
       <ThemeCss theme={theme} scheme={scheme}/>
-      <header style={{padding:'4px 16px 8px'}}>
-        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
-          <div>
-            <div style={{fontSize:10.5,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>4 Scouts · 15 Beobachtungen</div>
-            <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:700, color:t.ink, lineHeight:1}}>Scouting</SerifH>
-          </div>
+      <ScreenHeader theme={theme} scheme={scheme}
+        kicker="4 Scouts · 15 Beobachtungen" title="Scouting"
+        right={
           <button style={{height:34, padding:'0 10px', borderRadius:9, background:t.card, border:`1px solid ${t.rule}`, color:t.ink, fontWeight:700, fontSize:11, fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:4}}>
             <I.Search size={14} color={t.ink}/> Suche
           </button>
-        </div>
-      </header>
+        }/>
 
       <div style={{flex:1, overflowY:'auto', padding:'8px 16px 20px'}}>
         {/* Map placeholder */}
@@ -644,12 +628,8 @@ function ScreenTeams({theme, scheme}){
   return (
     <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
       <ThemeCss theme={theme} scheme={scheme}/>
-      <header style={{padding:'4px 16px 8px'}}>
-        <div>
-          <div style={{fontSize:10.5,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>FC Hafenstadt · drei Mannschaften</div>
-          <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:700, color:t.ink, lineHeight:1}}>Vereinsstruktur</SerifH>
-        </div>
-      </header>
+      <ScreenHeader theme={theme} scheme={scheme}
+        kicker="FC Hafenstadt · drei Mannschaften" title="Vereinsstruktur"/>
 
       <div style={{flex:1, overflowY:'auto', padding:'8px 16px 20px'}}>
         {teams.map((tm,i)=>(
@@ -743,17 +723,13 @@ function ScreenStaff({theme, scheme}){
   return (
     <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
       <ThemeCss theme={theme} scheme={scheme}/>
-      <header style={{padding:'4px 16px 8px'}}>
-        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
-          <div>
-            <div style={{fontSize:10.5,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>12 Personen · 3 Abteilungen</div>
-            <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:700, color:t.ink, lineHeight:1}}>Mitarbeiter</SerifH>
-          </div>
+      <ScreenHeader theme={theme} scheme={scheme}
+        kicker="12 Personen · 3 Abteilungen" title="Mitarbeiter"
+        right={
           <button style={{height:34, padding:'0 10px', borderRadius:9, background:t.card, border:`1px solid ${t.rule}`, color:t.ink, fontWeight:700, fontSize:11, fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:4}}>
             <I.Plus size={13} color={t.ink}/> Einstellen
           </button>
-        </div>
-      </header>
+        }/>
 
       <div style={{flex:1, overflowY:'auto', padding:'8px 16px 20px'}}>
         {groups.map((g,gi)=>(
diff --git "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/ui.jsx" "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/ui.jsx"
index 71956fd..4c03a65 100644
--- "a/design\\handoff\\2026-05-16\\project/design_handoff_aurelia_premier/ui.jsx"
+++ "b/design\\handoff\\2026-05-17\\project/design_handoff_aurelia_premier/ui.jsx"
@@ -31,42 +31,10 @@ const TOKENS_A_DARK = {
   warn:      '#d9a04c',
   danger:    '#e8553b',
 };
-// Direction B — Schalterhalle (deep navy + brass)
-const TOKENS_B_LIGHT = {
-  bg:'#eef1f5', bgInk:'#e3e8ef', card:'#ffffff',
-  ink:'#0e1c2e', inkMute:'#3b4a5e', inkSoft:'#6d7a8a',
-  rule:'#c8d2dd', accent:'#b4863a', accentSoft:'#f3e7cc',
-  ok:'#1f6f55', warn:'#b56b1a', danger:'#a32024'
-};
-const TOKENS_B_DARK = {
-  bg:'#0a1422', bgInk:'#0e1a2b', card:'#13243a',
-  ink:'#e6ecf3', inkMute:'#9eadc0', inkSoft:'#7889a0',
-  rule:'#1f3251', accent:'#dcb15c', accentSoft:'#2a2014',
-  ok:'#62a78a', warn:'#d8a256', danger:'#e26764'
-};
-// Direction C — Hallenfunk (dark-first slate + electric green)
-const TOKENS_C_LIGHT = {
-  bg:'#ececec', bgInk:'#dedede', card:'#fafafa',
-  ink:'#101012', inkMute:'#444448', inkSoft:'#6f6f73',
-  rule:'#cfcfd2', accent:'#0bb663', accentSoft:'#cdf3df',
-  ok:'#0bb663', warn:'#c98a08', danger:'#d23a2c'
-};
-const TOKENS_C_DARK = {
-  bg:'#0c0d10', bgInk:'#14161a', card:'#191c22',
-  ink:'#eaecef', inkMute:'#9ea3ad', inkSoft:'#6c727d',
-  rule:'#272a30', accent:'#22ee8b', accentSoft:'#0e2a1b',
-  ok:'#22ee8b', warn:'#e9b240', danger:'#ff6a59'
-};
 const THEMES = {
   A: { light: TOKENS_A_LIGHT, dark: TOKENS_A_DARK, name:'Sonntagszeitung',
        font:'Newsreader, "Source Serif 4", Georgia, serif',
        ui:'Inter, system-ui, sans-serif', radius:'14px' },
-  B: { light: TOKENS_B_LIGHT, dark: TOKENS_B_DARK, name:'Schalterhalle',
-       font:'"Source Serif 4", Georgia, serif',
-       ui:'Inter, system-ui, sans-serif', radius:'10px' },
-  C: { light: TOKENS_C_LIGHT, dark: TOKENS_C_DARK, name:'Hallenfunk',
-       font:'Inter, system-ui, sans-serif',
-       ui:'Inter, system-ui, sans-serif', radius:'18px' },
 };
 
 // ---------- ICONS (lucide-react look) ----------
@@ -562,8 +530,43 @@ function StadiumPlot({theme, scheme}){
 
 Object.assign(window, {
   THEMES, TOKENS_A_LIGHT, TOKENS_A_DARK,
-  TOKENS_B_LIGHT, TOKENS_B_DARK, TOKENS_C_LIGHT, TOKENS_C_DARK,
   I, PhoneFrame, ThemeCss, useTokens,
   PillBtn, StrBar, Talent, PosPill, FormStrip, LevyChip,
   Crest, shieldPath, MiniPitch, FormationPitch, StadiumPlot,
+  ScreenHeader,
 });
+
+// ---------- SHARED SCREEN HEADER ----------
+// Every screen's top section. Always shows the user's club crest + shortcode
+// in the kicker, then the screen's own title. Optional right-slot for actions
+// (chips, buttons, badges) and optional children for filter rows below.
+//
+// Usage:
+//   <ScreenHeader theme={theme} scheme={scheme}
+//     kicker="Kader · 14 Spieler" title="Erste Mannschaft"
+//     right={<button>…</button>}>
+//     <FilterChips/>
+//   </ScreenHeader>
+//
+// Pass `club={null}` to drop the crest (e.g. Onboarding before a club exists).
+function ScreenHeader({ theme, scheme, kicker, title, right, club='FC Hafenstadt', children, crestSize=30 }) {
+  const t = THEMES[theme][scheme];
+  const c = club ? (clubByName ? clubByName(club) : null) : null;
+  return (
+    <header style={{padding:'6px 16px 8px'}}>
+      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:10}}>
+        <div style={{display:'flex', alignItems:'center', gap:10, minWidth:0, flex:1}}>
+          {c && <Crest {...c.crest} size={crestSize}/>}
+          <div style={{minWidth:0}}>
+            <div style={{fontSize:10.5, color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
+              {c ? <><span style={{color:t.ink, fontWeight:700}}>{c.short}</span> · </> : null}{kicker}
+            </div>
+            <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:700, color:t.ink, lineHeight:1.05, marginTop:1}}>{title}</SerifH>
+          </div>
+        </div>
+        {right && <div style={{flex:'0 0 auto'}}>{right}</div>}
+      </div>
+      {children}
+    </header>
+  );
+}
diff --git "a/design\\handoff\\2026-05-17\\project/identity.jsx" "b/design\\handoff\\2026-05-17\\project/identity.jsx"
new file mode 100644
index 0000000..4e6eaeb
--- /dev/null
+++ "b/design\\handoff\\2026-05-17\\project/identity.jsx"
@@ -0,0 +1,735 @@
+// identity.jsx — Klub-Identitäts-Studio.
+// Two surfaces:
+//   1. ScreenIdentity        — phone-portrait screen (Wappen / Trikot tabs)
+//   2. IdentityStudio        — wide artboard, interactive editor + preview
+//
+// Closes the open TASKS item T3.4 (Trikot-Designer · heraldisch) and adds the
+// missing Logo-Generator UI on top of the existing CrestGrammar engine.
+
+// ---------------- Shared tincture palette ----------------
+// Drawn from CLUB_REGISTRY tones so colour-mixing always feels "in world".
+const IDENT_TINCT = [
+  { id:'navy',     hex:'#0e3a5f', name:'Marineblau' },
+  { id:'wine',     hex:'#7a1a1a', name:'Weinrot'    },
+  { id:'forest',   hex:'#1f4a3a', name:'Tannengrün' },
+  { id:'meadow',   hex:'#2b6b3f', name:'Wiesengrün' },
+  { id:'liver',    hex:'#4a2a2a', name:'Leberbraun' },
+  { id:'graphite', hex:'#262626', name:'Graphit'    },
+  { id:'gold',     hex:'#c8a45a', name:'Altgold'    },
+  { id:'brass',    hex:'#c97a2a', name:'Messing'    },
+  { id:'butter',   hex:'#f4e4b8', name:'Butter'     },
+  { id:'cream',    hex:'#f0e8d8', name:'Cremepapier'},
+  { id:'sand',     hex:'#d8c8a8', name:'Sand'       },
+  { id:'paper',    hex:'#fbf6ea', name:'Papier'     },
+];
+
+const IDENT_SHAPES   = ['heater','iberian','gonfalon','roundel'];
+const IDENT_SHAPE_LABEL = { heater:'Heater', iberian:'Iberisch', gonfalon:'Gonfalon', roundel:'Rundschild' };
+const IDENT_CHARGES  = ['ship','lion','eagle','tower','sword','cog','cross','star','wave','ball'];
+const IDENT_CHARGE_LABEL = {
+  ship:'Schiff', lion:'Löwe', eagle:'Adler', tower:'Turm', sword:'Schwert',
+  cog:'Zahnrad', cross:'Kreuz', star:'Stern', wave:'Welle', ball:'Ball'
+};
+
+const IDENT_PATTERNS = [
+  { id:'solid',     name:'Uni'         },
+  { id:'stripes',   name:'Streifen'    },
+  { id:'hoops',     name:'Querstreifen'},
+  { id:'sash',      name:'Schärpe'     },
+  { id:'split',     name:'Halbiert'    },
+  { id:'chevron',   name:'Spitze'      },
+];
+
+// ---------------- Procedural jersey ----------------
+// Single SVG, deterministic by (pattern, a, b, sleeveAccent, crest, number).
+// viewBox 120×120. Crest sits on chest at (50, 56).
+function Jersey({
+  pattern='stripes', a='#0e3a5f', b='#c8a45a',
+  sleeveAccent=true, crest=null, number='9', name='BRODY',
+  showBack=false, size=200,
+}){
+  // Body outline (front-on shirt with raglan sleeves)
+  const BODY = "M30 22 L14 18 L8 20 L4 38 L24 44 L30 38 L30 112 L90 112 L90 38 L96 44 L116 38 L112 20 L106 18 L90 22 Q60 30 30 22 Z";
+  // Sleeve cuff regions (for accent fill) — taken from corners of the body path
+  const CUFF_L = "M4 38 L24 44 L22 50 L4 46 Z";
+  const CUFF_R = "M116 38 L96 44 L98 50 L116 46 Z";
+  // Collar
+  const COLLAR = "M44 22 Q60 30 76 22 L72 28 Q60 33 48 28 Z";
+
+  const clipId = `jc-${pattern}-${a.replace('#','')}-${b.replace('#','')}-${showBack?'b':'f'}`.toLowerCase();
+
+  // Pattern fills are rendered *inside* the body clip.
+  function PatternFill(){
+    switch(pattern){
+      case 'solid':
+        return <rect x="0" y="0" width="120" height="120" fill={a}/>;
+      case 'stripes': {
+        // 6 vertical stripes alternating a/b
+        return (
+          <g>
+            <rect x="0" y="0" width="120" height="120" fill={a}/>
+            {[1,3,5].map(i=>(
+              <rect key={i} x={i*20-2} y="0" width="14" height="120" fill={b}/>
+            ))}
+          </g>
+        );
+      }
+      case 'hoops': {
+        return (
+          <g>
+            <rect x="0" y="0" width="120" height="120" fill={a}/>
+            {[0,1,2,3].map(i=>(
+              <rect key={i} x="0" y={28+i*18} width="120" height="9" fill={b}/>
+            ))}
+          </g>
+        );
+      }
+      case 'sash':
+        return (
+          <g>
+            <rect x="0" y="0" width="120" height="120" fill={a}/>
+            <polygon points="0,72 0,52 120,12 120,32" fill={b}/>
+          </g>
+        );
+      case 'split':
+        return (
+          <g>
+            <rect x="0" y="0" width="60" height="120" fill={a}/>
+            <rect x="60" y="0" width="60" height="120" fill={b}/>
+          </g>
+        );
+      case 'chevron':
+        return (
+          <g>
+            <rect x="0" y="0" width="120" height="120" fill={a}/>
+            <polygon points="0,30 60,60 120,30 120,52 60,82 0,52" fill={b}/>
+          </g>
+        );
+      default:
+        return <rect x="0" y="0" width="120" height="120" fill={a}/>;
+    }
+  }
+
+  // Pick a sensible text colour against pattern A.
+  const inkOn = (hex) => {
+    // Quick luminance approximation
+    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), bl = parseInt(hex.slice(5,7),16);
+    const L = (0.299*r + 0.587*g + 0.114*bl)/255;
+    return L > 0.55 ? '#11100e' : '#fbf6ea';
+  };
+  const ink = inkOn(a);
+  const accent = sleeveAccent ? b : a;
+
+  return (
+    <svg width={size} height={size} viewBox="0 0 120 120" style={{display:'block'}}>
+      <defs>
+        <clipPath id={clipId}><path d={BODY}/></clipPath>
+        <linearGradient id={`${clipId}-sh`} x1="0" x2="0" y1="0" y2="1">
+          <stop offset="0"  stopColor="#000" stopOpacity="0"/>
+          <stop offset="1"  stopColor="#000" stopOpacity=".18"/>
+        </linearGradient>
+      </defs>
+
+      {/* Body fill with pattern */}
+      <g clipPath={`url(#${clipId})`}>
+        <PatternFill/>
+        {/* subtle shadow */}
+        <rect x="0" y="0" width="120" height="120" fill={`url(#${clipId}-sh)`}/>
+      </g>
+
+      {/* Sleeve accent stripes (cuffs) */}
+      {sleeveAccent && (
+        <g>
+          <path d={CUFF_L} fill={accent} opacity=".95"/>
+          <path d={CUFF_R} fill={accent} opacity=".95"/>
+        </g>
+      )}
+
+      {/* Collar */}
+      <path d={COLLAR} fill={accent}/>
+
+      {/* Body outline */}
+      <path d={BODY} fill="none" stroke="#11100e" strokeWidth="1.4" strokeLinejoin="round"/>
+
+      {/* Front: crest + sponsor placeholder. Back: number + name. */}
+      {!showBack && (
+        <g>
+          {crest && (
+            <g transform="translate(38, 44) scale(0.22)">
+              <Crest {...crest} size={100}/>
+            </g>
+          )}
+          {/* sponsor strip — kept as a placeholder marker for sponsor flow */}
+          <rect x="44" y="78" width="32" height="6" rx="1" fill={ink} opacity=".14"/>
+          <text x="60" y="83" textAnchor="middle" fontSize="4.5"
+                fontFamily="JetBrains Mono, monospace" fontWeight="700"
+                fill={ink} opacity=".5">SPONSOR</text>
+        </g>
+      )}
+      {showBack && (
+        <g>
+          <text x="60" y="50" textAnchor="middle" fontSize="9"
+                fontFamily="Inter, sans-serif" fontWeight="800"
+                fill={ink} letterSpacing="1">{name.toUpperCase()}</text>
+          <text x="60" y="86" textAnchor="middle" fontSize="34"
+                fontFamily="Inter, sans-serif" fontWeight="800"
+                fill={ink}>{number}</text>
+        </g>
+      )}
+    </svg>
+  );
+}
+
+// ---------------- Shield silhouette (picker thumb) ----------------
+function ShapeThumb({shape, color='#1a1410', size=28}){
+  return (
+    <svg width={size} height={size*1.2} viewBox="0 0 100 120">
+      <path d={shieldPath(shape)} fill={color}/>
+    </svg>
+  );
+}
+
+// ---------------- Charge chip ----------------
+// `Charge` itself isn't exported from ui.jsx — we reuse Crest with a flat
+// background to render the symbol alone.
+function ChargeChip({kind, fg='#1a1410', bg='#fbf6ea', size=44, active=false, onClick}){
+  return (
+    <button onClick={onClick} style={{
+      width:size, height:size, borderRadius:8,
+      background: active ? fg : bg,
+      border:`1.5px solid ${active ? fg : '#d9cdb4'}`,
+      display:'grid', placeItems:'center', cursor:'pointer', padding:0
+    }} title={IDENT_CHARGE_LABEL[kind]}>
+      <Crest shape="roundel" a={active?fg:bg} b={active?fg:bg} charge={kind} size={size-12}/>
+    </button>
+  );
+}
+
+// ---------------- Swatch button ----------------
+function Swatch({hex, name, active, onClick, size=32, label=true, theme, scheme}){
+  const t = THEMES[theme][scheme];
+  return (
+    <button onClick={onClick} style={{
+      display:'flex', flexDirection:'column', alignItems:'center', gap:4,
+      background:'transparent', border:'none', cursor:'pointer', padding:0,
+    }} title={name}>
+      <span style={{
+        width:size, height:size, borderRadius:8,
+        background: hex,
+        border: active ? `2.5px solid ${t.ink}` : `1px solid ${t.rule}`,
+        boxShadow: active ? `0 0 0 2px ${t.bg}` : 'none',
+        display:'block',
+      }}/>
+      {label && <span style={{fontSize:9.5, color:t.inkMute, fontWeight:600, letterSpacing:.2}}>{name}</span>}
+    </button>
+  );
+}
+
+// ---------------- Segment (Tabs) ----------------
+function IdentSegment({options, value, onChange, theme, scheme}){
+  const t = THEMES[theme][scheme];
+  return (
+    <div style={{
+      display:'flex', background:t.bgInk, padding:3, borderRadius:10,
+      border:`1px solid ${t.rule}`
+    }}>
+      {options.map(o=>{
+        const on = o.id===value;
+        return (
+          <button key={o.id} onClick={()=>onChange(o.id)} style={{
+            flex:1, height:32, borderRadius:8, border:'none',
+            background: on ? t.card : 'transparent',
+            color: on ? t.ink : t.inkMute,
+            fontWeight:700, fontSize:12, fontFamily:'inherit',
+            boxShadow: on ? `0 1px 0 ${t.rule}` : 'none',
+            cursor:'pointer',
+          }}>{o.label}</button>
+        );
+      })}
+    </div>
+  );
+}
+
+// ---------------- The mobile screen ----------------
+function ScreenIdentity({theme, scheme}){
+  const t = THEMES[theme][scheme];
+  const [tab, setTab]       = React.useState('crest'); // crest | jersey
+  const [shape, setShape]   = React.useState('heater');
+  const [tincA, setTincA]   = React.useState('#0e3a5f');
+  const [tincB, setTincB]   = React.useState('#c8a45a');
+  const [charge, setCharge] = React.useState('ship');
+  const [motto, setMotto]   = React.useState('Per mare ad astra');
+  const [pattern, setPattern] = React.useState('stripes');
+  const [sleeveAccent, setSleeveAccent] = React.useState(true);
+  const [showBack, setShowBack] = React.useState(false);
+
+  const crest = { shape, a:tincA, b:tincB, charge, motto: motto || undefined };
+
+  const SectionLabel = ({children, hint}) => (
+    <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginTop:14, marginBottom:8}}>
+      <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>{children}</div>
+      {hint && <div style={{fontSize:10, color:t.inkSoft}}>{hint}</div>}
+    </div>
+  );
+
+  return (
+    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
+      <ThemeCss theme={theme} scheme={scheme}/>
+      {/* Top bar */}
+      <header style={{padding:'4px 16px 8px'}}>
+        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
+          <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center', cursor:'pointer'}}>
+            <I.ChevronLeft color={t.ink} size={18}/>
+          </button>
+          <div style={{textAlign:'center'}}>
+            <SerifH theme={theme} style={{fontSize:17, fontWeight:700, color:t.ink, display:'block', lineHeight:1}}>Klub-Identität</SerifH>
+            <div style={{fontSize:10, color:t.inkSoft, marginTop:2, letterSpacing:.4}}>Wappen · Trikot · Vorschau</div>
+          </div>
+          <button style={{width:36,height:36,borderRadius:10,background:t.accent,border:'none',display:'grid',placeItems:'center', cursor:'pointer'}}>
+            <I.Check color="#fff" size={18}/>
+          </button>
+        </div>
+      </header>
+
+      {/* Big preview */}
+      <div style={{
+        position:'relative', margin:'0 16px',
+        background:t.card, border:`1px solid ${t.rule}`, borderRadius:14,
+        padding:'14px 12px 10px',
+      }}>
+        {/* sepia paper backdrop */}
+        <div style={{
+          position:'absolute', inset:8, borderRadius:10,
+          background:`repeating-linear-gradient(0deg, ${t.bgInk} 0 1px, transparent 1px 6px)`,
+          opacity:.45, pointerEvents:'none',
+        }}/>
+        <div style={{position:'relative', display:'flex', alignItems:'center', justifyContent:'center', gap:14, minHeight:188}}>
+          {tab==='crest' ? (
+            <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
+              <Crest {...crest} size={140}/>
+              <div style={{marginTop:6, fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>
+                {IDENT_SHAPE_LABEL[shape]} · {IDENT_CHARGE_LABEL[charge]}
+              </div>
+            </div>
+          ) : (
+            <div style={{display:'flex', alignItems:'center', gap:18}}>
+              <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
+                <Jersey pattern={pattern} a={tincA} b={tincB} sleeveAccent={sleeveAccent}
+                        crest={crest} number="9" name="BRODY"
+                        showBack={showBack} size={160}/>
+                <div style={{marginTop:4, fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>
+                  {showBack ? 'Rückseite' : 'Vorderseite'}
+                </div>
+              </div>
+            </div>
+          )}
+        </div>
+
+        {/* mini lineup preview */}
+        <div style={{position:'relative', marginTop:6, paddingTop:8, borderTop:`1px dashed ${t.rule}`,
+                     display:'flex', alignItems:'center', justifyContent:'center', gap:6}}>
+          {[0,1,2,3,4].map(i=>(
+            <Jersey key={i} pattern={pattern} a={tincA} b={tincB}
+                    sleeveAccent={sleeveAccent} crest={null} size={28}/>
+          ))}
+          <span style={{fontSize:9.5, color:t.inkMute, marginLeft:6, letterSpacing:.4, fontWeight:700, textTransform:'uppercase'}}>2D-Ticker · Aufstellung</span>
+        </div>
+      </div>
+
+      {/* Tab segment */}
+      <div style={{padding:'12px 16px 0'}}>
+        <IdentSegment
+          theme={theme} scheme={scheme} value={tab} onChange={setTab}
+          options={[{id:'crest', label:'Wappen'}, {id:'jersey', label:'Trikot'}]}/>
+      </div>
+
+      {/* Scrollable controls */}
+      <div style={{flex:1, overflowY:'auto', padding:'0 16px 20px'}}>
+        {tab==='crest' && (
+          <>
+            <SectionLabel hint="4 Formen">Schildform</SectionLabel>
+            <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:8}}>
+              {IDENT_SHAPES.map(s=>{
+                const on = s===shape;
+                return (
+                  <button key={s} onClick={()=>setShape(s)} style={{
+                    display:'flex', flexDirection:'column', alignItems:'center', gap:4,
+                    padding:'10px 4px', borderRadius:10, cursor:'pointer',
+                    background: on ? t.bgInk : t.card,
+                    border: `1.5px solid ${on ? t.ink : t.rule}`,
+                    fontFamily:'inherit',
+                  }}>
+                    <ShapeThumb shape={s} color={t.ink} size={26}/>
+                    <span style={{fontSize:10, color:t.ink, fontWeight:600, letterSpacing:.2}}>{IDENT_SHAPE_LABEL[s]}</span>
+                  </button>
+                );
+              })}
+            </div>
+
+            <SectionLabel hint="Hauptfarbe">Tinktur A</SectionLabel>
+            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:8, justifyItems:'center'}}>
+              {IDENT_TINCT.map(c=>(
+                <Swatch key={c.id} hex={c.hex} name={c.name}
+                        active={tincA===c.hex} onClick={()=>setTincA(c.hex)}
+                        size={30} label={false} theme={theme} scheme={scheme}/>
+              ))}
+            </div>
+
+            <SectionLabel hint="Zweitfarbe">Tinktur B</SectionLabel>
+            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:8, justifyItems:'center'}}>
+              {IDENT_TINCT.map(c=>(
+                <Swatch key={c.id} hex={c.hex} name={c.name}
+                        active={tincB===c.hex} onClick={()=>setTincB(c.hex)}
+                        size={30} label={false} theme={theme} scheme={scheme}/>
+              ))}
+            </div>
+
+            <SectionLabel hint="10 Symbole">Wappensymbol</SectionLabel>
+            <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:8, justifyItems:'center'}}>
+              {IDENT_CHARGES.map(k=>(
+                <ChargeChip key={k} kind={k}
+                            active={charge===k}
+                            fg={t.ink} bg={t.card}
+                            onClick={()=>setCharge(k)}/>
+              ))}
+            </div>
+
+            <SectionLabel hint="optional, max. 32 Zeichen">Motto</SectionLabel>
+            <input value={motto} onChange={e=>setMotto(e.target.value.slice(0,32))}
+                   placeholder="Per mare ad astra"
+                   style={{
+                     width:'100%', height:40, borderRadius:10,
+                     background:t.card, border:`1px solid ${t.rule}`,
+                     padding:'0 12px', fontSize:13, color:t.ink,
+                     fontFamily:THEMES[theme].font, fontStyle:'italic',
+                     outline:'none',
+                   }}/>
+          </>
+        )}
+
+        {tab==='jersey' && (
+          <>
+            <SectionLabel hint="6 Muster">Trikotmuster</SectionLabel>
+            <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8}}>
+              {IDENT_PATTERNS.map(p=>{
+                const on = p.id===pattern;
+                return (
+                  <button key={p.id} onClick={()=>setPattern(p.id)} style={{
+                    display:'flex', flexDirection:'column', alignItems:'center', gap:4,
+                    padding:'8px 4px 6px', borderRadius:10, cursor:'pointer',
+                    background: on ? t.bgInk : t.card,
+                    border: `1.5px solid ${on ? t.ink : t.rule}`,
+                    fontFamily:'inherit',
+                  }}>
+                    <Jersey pattern={p.id} a={tincA} b={tincB} sleeveAccent={sleeveAccent} crest={null} size={42}/>
+                    <span style={{fontSize:10, color:t.ink, fontWeight:600}}>{p.name}</span>
+                  </button>
+                );
+              })}
+            </div>
+
+            <SectionLabel hint="übernimmt Wappen-Tinktur A">Hauptfarbe</SectionLabel>
+            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:8, justifyItems:'center'}}>
+              {IDENT_TINCT.map(c=>(
+                <Swatch key={c.id} hex={c.hex} name={c.name}
+                        active={tincA===c.hex} onClick={()=>setTincA(c.hex)}
+                        size={30} label={false} theme={theme} scheme={scheme}/>
+              ))}
+            </div>
+
+            <SectionLabel hint="Streifen, Kragen, Stutzen">Zweitfarbe</SectionLabel>
+            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:8, justifyItems:'center'}}>
+              {IDENT_TINCT.map(c=>(
+                <Swatch key={c.id} hex={c.hex} name={c.name}
+                        active={tincB===c.hex} onClick={()=>setTincB(c.hex)}
+                        size={30} label={false} theme={theme} scheme={scheme}/>
+              ))}
+            </div>
+
+            <SectionLabel>Details</SectionLabel>
+            <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'4px 12px'}}>
+              <ToggleRow theme={theme} scheme={scheme}
+                k="Ärmel-Akzent" sub="Kragen + Stutzen in Tinktur B"
+                on={sleeveAccent} onChange={()=>setSleeveAccent(v=>!v)}/>
+              <ToggleRow theme={theme} scheme={scheme}
+                k="Rückseite zeigen" sub="Spielername + Nummer im Profi-Stil"
+                on={showBack} onChange={()=>setShowBack(v=>!v)} last/>
+            </div>
+          </>
+        )}
+      </div>
+
+      {/* Footer CTA */}
+      <div style={{padding:'8px 16px 14px', borderTop:`1px solid ${t.rule}`, background:t.bg}}>
+        <button style={{
+          width:'100%', height:48, borderRadius:12,
+          background:t.accent, color:'#fff',
+          border:'none', fontWeight:700, fontSize:14, fontFamily:'inherit',
+          letterSpacing:.2, cursor:'pointer',
+          display:'flex', alignItems:'center', justifyContent:'center', gap:8,
+        }}>
+          <I.Check size={16} color="#fff"/>
+          Auf Klub anwenden
+        </button>
+        <div style={{textAlign:'center', fontSize:10, color:t.inkSoft, marginTop:6, letterSpacing:.3}}>
+          Wirkt sofort auf 2D-Ticker, Aufstellung & Liga-Tabelle.
+        </div>
+      </div>
+    </div>
+  );
+}
+
+// Small toggle row, local to this screen
+function ToggleRow({k, sub, on, onChange, last, theme, scheme}){
+  const t = THEMES[theme][scheme];
+  return (
+    <button onClick={onChange} style={{
+      width:'100%', display:'flex', alignItems:'center', gap:10,
+      padding:'10px 0', background:'transparent',
+      border:'none', borderBottom: last?'none':`1px solid ${t.rule}`,
+      cursor:'pointer', fontFamily:'inherit', textAlign:'left',
+    }}>
+      <div style={{flex:1}}>
+        <div style={{fontSize:12.5, fontWeight:700, color:t.ink}}>{k}</div>
+        {sub && <div style={{fontSize:10.5, color:t.inkSoft, marginTop:2}}>{sub}</div>}
+      </div>
+      <div style={{width:38, height:22, borderRadius:99, background: on ? t.accent : t.bgInk, position:'relative', transition:'background .15s'}}>
+        <span style={{position:'absolute', top:2, left: on ? 18 : 2, width:18, height:18, borderRadius:99, background:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,.2)', transition:'left .15s'}}/>
+      </div>
+    </button>
+  );
+}
+
+// ================================================================
+// IdentityStudio — wide artboard, two-column live editor
+// ================================================================
+function IdentityStudio(){
+  const theme  = 'A';
+  const scheme = 'light';
+  const t = THEMES[theme][scheme];
+
+  const [shape, setShape]   = React.useState('gonfalon');
+  const [tincA, setTincA]   = React.useState('#7a1a1a');
+  const [tincB, setTincB]   = React.useState('#f0e8d8');
+  const [charge, setCharge] = React.useState('lion');
+  const [motto, setMotto]   = React.useState('Cor leonis');
+  const [pattern, setPattern] = React.useState('hoops');
+  const [sleeveAccent, setSleeveAccent] = React.useState(true);
+
+  const crest = { shape, a:tincA, b:tincB, charge, motto: motto || undefined };
+
+  const Panel = ({title, hint, children}) => (
+    <div style={{marginBottom:14}}>
+      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6}}>
+        <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.8, textTransform:'uppercase'}}>{title}</div>
+        {hint && <div style={{fontSize:10, color:t.inkSoft}}>{hint}</div>}
+      </div>
+      {children}
+    </div>
+  );
+
+  const presetClubs = [
+    { id:'hafenstadt', label:'Hafenstadt' },
+    { id:'kaltenbach', label:'Kaltenbach' },
+    { id:'sauveterre', label:'Sauveterre' },
+    { id:'valguarda',  label:'Valguarda'  },
+    { id:'northbridge',label:'Northbridge'},
+    { id:'auerbach',   label:'Auerbach'   },
+  ];
+  const applyPreset = (id) => {
+    const c = CLUB_REGISTRY[id];
+    if(!c) return;
+    setShape(c.crest.shape);
+    setTincA(c.crest.a);
+    setTincB(c.crest.b);
+    setCharge(c.crest.charge);
+    setMotto('');
+  };
+
+  return (
+    <div style={{padding:24, background:'#fbf6ea', height:'100%', display:'flex', flexDirection:'column', fontFamily:THEMES[theme].ui, color:t.ink}}>
+      <ThemeCss theme={theme} scheme={scheme}/>
+      <header style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', borderBottom:`1px solid ${t.rule}`, paddingBottom:14, marginBottom:18}}>
+        <div>
+          <div style={{fontSize:11, color:t.accent, fontWeight:800, letterSpacing:1.6, textTransform:'uppercase'}}>Studio · interaktiv</div>
+          <SerifH theme={theme} style={{display:'block', fontSize:28, fontWeight:700, color:t.ink, marginTop:2}}>Klub-Identität entwerfen</SerifH>
+          <div style={{fontSize:12.5, color:t.inkMute, marginTop:4, maxWidth:540}}>
+            Wappen-Grammatik und Trikot-Muster teilen sich zwei Tinkturen.
+            Jeder Klick aktualisiert beide Vorschauen sowie die Lineup-Reihe unten.
+          </div>
+        </div>
+        <div style={{display:'flex', gap:6, flexWrap:'wrap', justifyContent:'flex-end', maxWidth:380}}>
+          {presetClubs.map(p=>(
+            <button key={p.id} onClick={()=>applyPreset(p.id)} style={{
+              height:28, padding:'0 10px', borderRadius:99,
+              background:t.card, border:`1px solid ${t.rule}`,
+              color:t.ink, fontSize:11, fontWeight:600, cursor:'pointer',
+              fontFamily:'inherit',
+            }}>{p.label}</button>
+          ))}
+        </div>
+      </header>
+
+      <div style={{display:'grid', gridTemplateColumns:'minmax(0,1fr) 360px', gap:24, flex:1, minHeight:0}}>
+        {/* Left: previews */}
+        <div style={{display:'flex', flexDirection:'column', gap:18, minWidth:0}}>
+          {/* Crest + Jersey side-by-side */}
+          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14}}>
+            <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:16, display:'flex', flexDirection:'column', alignItems:'center', gap:8}}>
+              <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.8, textTransform:'uppercase', alignSelf:'flex-start'}}>Wappen</div>
+              <Crest {...crest} size={150}/>
+              <div style={{fontSize:11, color:t.inkSoft, marginTop:'auto'}}>{IDENT_SHAPE_LABEL[shape]} · {IDENT_CHARGE_LABEL[charge]}</div>
+            </div>
+            <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:16, display:'flex', flexDirection:'column', alignItems:'center', gap:8}}>
+              <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.8, textTransform:'uppercase', alignSelf:'flex-start'}}>Heim-Trikot · vorne</div>
+              <Jersey pattern={pattern} a={tincA} b={tincB} sleeveAccent={sleeveAccent} crest={crest} size={170}/>
+              <div style={{fontSize:11, color:t.inkSoft, marginTop:'auto'}}>{IDENT_PATTERNS.find(p=>p.id===pattern)?.name}</div>
+            </div>
+            <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:16, display:'flex', flexDirection:'column', alignItems:'center', gap:8}}>
+              <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.8, textTransform:'uppercase', alignSelf:'flex-start'}}>Heim-Trikot · hinten</div>
+              <Jersey pattern={pattern} a={tincA} b={tincB} sleeveAccent={sleeveAccent} showBack number="9" name="Brody" size={170}/>
+              <div style={{fontSize:11, color:t.inkSoft, marginTop:'auto'}}>#9 · Brody</div>
+            </div>
+          </div>
+
+          {/* Lineup row */}
+          <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'14px 18px'}}>
+            <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.8, textTransform:'uppercase', marginBottom:10}}>
+              Anwendungen · so erscheint die Identität im Spiel
+            </div>
+            <div style={{display:'flex', alignItems:'center', gap:18}}>
+              {/* Lineup mini */}
+              <div style={{flex:1, display:'flex', alignItems:'flex-end', gap:6}}>
+                {Array.from({length:11}).map((_,i)=>(
+                  <div key={i} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:3}}>
+                    <Jersey pattern={pattern} a={tincA} b={tincB}
+                            sleeveAccent={sleeveAccent} crest={null} size={34}/>
+                    <span style={{fontSize:9, color:t.inkMute, fontFamily:'JetBrains Mono, monospace', fontWeight:700}}>{i+1}</span>
+                  </div>
+                ))}
+              </div>
+              <div style={{width:1, height:54, background:t.rule}}/>
+              {/* League-table row */}
+              <div style={{display:'flex', alignItems:'center', gap:10, minWidth:0}}>
+                <Crest {...crest} size={42}/>
+                <div style={{minWidth:0}}>
+                  <SerifH theme={theme} style={{fontSize:14, fontWeight:700, color:t.ink, display:'block', lineHeight:1.1}}>
+                    {motto ? 'Klubname' : 'Dein Klub'}
+                  </SerifH>
+                  <div style={{fontSize:11, color:t.inkMute, fontStyle:'italic'}}>{motto || '—'}</div>
+                </div>
+              </div>
+              <div style={{width:1, height:54, background:t.rule}}/>
+              {/* Tabloid headline */}
+              <div style={{maxWidth:240}}>
+                <div style={{fontSize:9.5, color:t.accent, fontWeight:800, letterSpacing:1.2, textTransform:'uppercase'}}>Tabloid-Cover</div>
+                <SerifH theme={theme} style={{display:'block', fontSize:18, lineHeight:1.05, fontWeight:700, color:t.ink, marginTop:2}}>
+                  Brody schießt sich in die Herzen
+                </SerifH>
+              </div>
+            </div>
+          </div>
+        </div>
+
+        {/* Right: controls */}
+        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:18, overflowY:'auto'}}>
+          <Panel title="Schildform" hint="4 Formen">
+            <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:6}}>
+              {IDENT_SHAPES.map(s=>{
+                const on = s===shape;
+                return (
+                  <button key={s} onClick={()=>setShape(s)} style={{
+                    display:'flex', flexDirection:'column', alignItems:'center', gap:3,
+                    padding:'8px 2px', borderRadius:8, cursor:'pointer',
+                    background: on ? t.bgInk : t.bg,
+                    border: `1.5px solid ${on ? t.ink : t.rule}`,
+                    fontFamily:'inherit',
+                  }}>
+                    <ShapeThumb shape={s} color={t.ink} size={24}/>
+                    <span style={{fontSize:10, color:t.ink, fontWeight:600}}>{IDENT_SHAPE_LABEL[s]}</span>
+                  </button>
+                );
+              })}
+            </div>
+          </Panel>
+
+          <Panel title="Tinktur A · Hauptfarbe">
+            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:6, justifyItems:'center'}}>
+              {IDENT_TINCT.map(c=>(
+                <Swatch key={c.id} hex={c.hex} name={c.name}
+                        active={tincA===c.hex} onClick={()=>setTincA(c.hex)}
+                        size={28} label={false} theme={theme} scheme={scheme}/>
+              ))}
+            </div>
+          </Panel>
+
+          <Panel title="Tinktur B · Zweitfarbe">
+            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:6, justifyItems:'center'}}>
+              {IDENT_TINCT.map(c=>(
+                <Swatch key={c.id} hex={c.hex} name={c.name}
+                        active={tincB===c.hex} onClick={()=>setTincB(c.hex)}
+                        size={28} label={false} theme={theme} scheme={scheme}/>
+              ))}
+            </div>
+          </Panel>
+
+          <Panel title="Wappensymbol" hint="10 Symbole">
+            <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:6, justifyItems:'center'}}>
+              {IDENT_CHARGES.map(k=>(
+                <ChargeChip key={k} kind={k}
+                            active={charge===k}
+                            fg={t.ink} bg={t.bg}
+                            onClick={()=>setCharge(k)} size={40}/>
+              ))}
+            </div>
+          </Panel>
+
+          <Panel title="Motto" hint="optional">
+            <input value={motto} onChange={e=>setMotto(e.target.value.slice(0,32))}
+                   placeholder="Per mare ad astra"
+                   style={{
+                     width:'100%', height:36, borderRadius:8,
+                     background:t.bg, border:`1px solid ${t.rule}`,
+                     padding:'0 10px', fontSize:13, color:t.ink,
+                     fontFamily:THEMES[theme].font, fontStyle:'italic',
+                     outline:'none',
+                   }}/>
+          </Panel>
+
+          <div style={{height:1, background:t.rule, margin:'14px 0'}}/>
+
+          <Panel title="Trikotmuster" hint="6 Muster">
+            <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:6}}>
+              {IDENT_PATTERNS.map(p=>{
+                const on = p.id===pattern;
+                return (
+                  <button key={p.id} onClick={()=>setPattern(p.id)} style={{
+                    display:'flex', flexDirection:'column', alignItems:'center', gap:2,
+                    padding:'6px 2px 4px', borderRadius:8, cursor:'pointer',
+                    background: on ? t.bgInk : t.bg,
+                    border: `1.5px solid ${on ? t.ink : t.rule}`,
+                    fontFamily:'inherit',
+                  }}>
+                    <Jersey pattern={p.id} a={tincA} b={tincB} sleeveAccent={sleeveAccent} crest={null} size={36}/>
+                    <span style={{fontSize:9.5, color:t.ink, fontWeight:600}}>{p.name}</span>
+                  </button>
+                );
+              })}
+            </div>
+          </Panel>
+
+          <Panel title="Details">
+            <ToggleRow theme={theme} scheme={scheme}
+              k="Ärmel-Akzent" sub="Kragen + Stutzen in Tinktur B"
+              on={sleeveAccent} onChange={()=>setSleeveAccent(v=>!v)} last/>
+          </Panel>
+        </div>
+      </div>
+    </div>
+  );
+}
+
+Object.assign(window, {
+  ScreenIdentity, IdentityStudio, Jersey,
+  IDENT_TINCT, IDENT_SHAPES, IDENT_CHARGES, IDENT_PATTERNS,
+});
diff --git "a/design\\handoff\\2026-05-16\\project/index.html" "b/design\\handoff\\2026-05-17\\project/index.html"
index c75e593..66ea852 100644
--- "a/design\\handoff\\2026-05-16\\project/index.html"
+++ "b/design\\handoff\\2026-05-17\\project/index.html"
@@ -38,6 +38,7 @@
   <script type="text/babel" src="compare.jsx"></script>
   <script type="text/babel" src="more.jsx"></script>
   <script type="text/babel" src="settings.jsx"></script>
+  <script type="text/babel" src="identity.jsx"></script>
   <script type="text/babel" src="responsive.jsx"></script>
   <script type="text/babel" src="depth.jsx"></script>
   <script type="text/babel" src="depth-data.jsx"></script>
```

</details>
