---
title: "Pre-Mortem 2026-05-20 · 10 · Accessibility & Inclusion"
status: current
tags: [research, pre-mortem, accessibility, wcag, eaa, bfsg, aria, 2026-Q2]
created: 2026-05-20
updated: 2026-05-22
type: research
binding: false
report_id: PM-2026-05-20-10
report_set: 2026-05-20
horizon: 2026-11-20
target_dau: 10000
scenarios: [single-node-hetzner, cloud-autoscaling]
iteration: 3
related:
  - [[00-index]]
  - [[findings-registry]]
  - [[PM-2026-05-20-09-i18n-and-localization]]
  - [[PM-2026-05-20-16-test-strategy-depth]]
  - [[../../10-Architecture/09-Design-System]]
---

# Pre-Mortem 2026-05-20 · 10 · Accessibility & Inclusion (WCAG 2.2 AA / EAA-2025 / BFSG)

> **Failure-Headline-Kandidaten**
> - ”žTactic-Board-Drag verletzt WCAG 2.5.7 — kein Single-Pointer-/Tastatur-Pfad, Halbzeit-Wechsel für motorisch eingeschränkte Spieler unbenutzbar."
> - ”žBFSG-Geltungsbereich falsch eingeschätzt: B2C-E-Commerce-Funktion ab 28.06.2025 — Bußgeld bis € 100 k + Marktrücknahme."
> - ”žLive-Region des Match-Tickers `aria-live=assertive` — Screenreader-User können nichts anderes mehr fokussieren."
> - ”žshadcn/ui Default-Slate auf weiß: Kontrast nur knapp 4.5:1; Status-Badges reine Farbsignale — 8 % männliche User mit Farbsehschwäche ohne Signal."
> - ”žSquad-Tabelle als `<div>`-Grid statt semantisches `role=grid` — JAWS Browse-Mode kollabiert, 1500-Spieler-DB nicht navigierbar."

## Scope

Vertiefung von WCAG 2.2 AA (CLAUDE.md hartes Constraint) auf Component-Pattern-Ebene: drag-and-drop, DataGrid, ARIA-Live-Region, Reduced-Motion, Touch-Target, Kontrast, Keyboard-Trap, Authentifizierung-Accessible, CAPTCHA. Regulatorisch: EAA (RL 2019/882) ab 28.06.2025, BFSG (DE-Umsetzung 28.06.2025), BITV 2.0 als de-facto-Baseline.

## Top Failure-Hypothesen

### PM-2026-05-20-10-F-01 — WCAG 2.5.7 Dragging Movements verletzt durch Tactic-Board und Lineup-DnD

```yaml
id: PM-2026-05-20-10-F-01
priority: P0
domain: accessibility
probability: 5
impact: 5
score: 25
confidence: high
early_warning:
  - metric: "DnD-Interaktionen mit Tastatur-/Klick-Alternative"
    threshold: "< 100 %"
  - metric: "axe-core 'target-size' violations im Lineup-Editor"
    threshold: "> 0"
mitigation_summary: "react-aria useDraggableCollection/useDroppableCollection (volle Tastatur+SR-Parität) ODER 'Verschieben nach…'-Menü pro Spielerkarte"
linked_adrs: []
linked_specs: [[09-Design-System]]
linked_code: ["src/features/tactics/*", "src/features/lineup/*"]
sources:
  - title: "Understanding SC 2.5.7 Dragging Movements"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html"
    accessed: "2026-05-20"
    publisher: "W3C"
    confidence: high
  - title: "Taming the dragon: Accessible drag and drop"
    url: "https://react-spectrum.adobe.com/blog/drag-and-drop.html"
    accessed: "2026-05-20"
    publisher: "Adobe / React Aria"
    confidence: high
verification_notes: "WCAG 2.2 verlangt seit 10/2023 Level AA, dass jede Dragging-Geste Single-Pointer-Alternative hat. 'Essential'-Ausnahme greift NICHT, weil Aufstellung trivial via Liste/Menü umsetzbar."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: design+frontend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Football-Manager-Patterns leben von Drag&Drop (Aufstellung, Tactic-Board, Sub). Ohne Alternative ist Halbzeit-Modal-Substitution für motorisch eingeschränkte User unbedienbar.

**Mitigation.** **react-aria** `useDraggableCollection` / `useDroppableCollection` — out-of-the-box Tastatur-Modus (Enter aufnehmen, Tab zwischen Drop-Targets, Enter ablegen, Esc abbrechen) + SR-Announcements. Zusätzlich ”žVerschieben nach…"-Button pro Spielerkarte → Combobox-Menü (Single-Pointer-Pfad). Halbzeit-Modal: zwei Listen ”žAktuell auf dem Platz" / ”žBank" + Checkboxen + ”žTausch ausführen".

**Verifikation.** axe-core `target-size`, Storybook-Playwright "Lineup Sub via Keyboard", manuelles NVDA + Firefox / VoiceOver + iOS-Safari je Sprint. KPI: SR-Time-to-Complete Halbzeit-Tausch ≤ 2× Sighted-Baseline.

### PM-2026-05-20-10-F-02 — BFSG-/EAA-Pflicht falsch eingeschätzt (Geltungsbereich)

```yaml
id: PM-2026-05-20-10-F-02
priority: P1
domain: accessibility
probability: 4
impact: 5
score: 20
confidence: high
early_warning:
  - metric: "Accessibility-Statement nach EN 301 549 / § 14 BFSG"
    threshold: "fehlt"
  - metric: "Externes WCAG 2.2 AA Audit vor Launch"
    threshold: "nicht durchgeführt"
mitigation_summary: "Bei E-Commerce-Funktionen (Subscription, Shop) → BFSG. Accessibility-Statement + EN 301 549-Konformitätserklärung + Beschwerdekanal verpflichtend"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "Navigating BFSG: Germany's Implementation — Orrick"
    url: "https://www.orrick.com/en/Insights/2025/07/Navigating-the-Accessibility-Improvement-Act-Germanys-Implementation"
    accessed: "2026-05-20"
    publisher: "Orrick"
    confidence: high
  - title: "BFSG und Gamesbranche — Nimrod"
    url: "https://nimrod-rechtsanwaelte.de/das-bfsg-und-dessen-auswirkungen-auf-die-gamesbranche/"
    accessed: "2026-05-20"
    publisher: "Nimrod Rechtsanwälte"
    confidence: high
  - title: "EAA Fines"
    url: "https://auditsu.com/resources/european-accessibility-act-fines"
    accessed: "2026-05-20"
    publisher: "auditsu"
    confidence: medium
verification_notes: "Mikrounternehmens-Ausnahme (<10 MA, <€2M) gilt nur für DIENSTLEISTUNGEN, nicht für Produkte. Sobald E-Commerce-Komponente (Subscription, Premium-Slot, Plattform-Vertragsschluss) → App ist 'Dienstleistung im elektronischen Geschäftsverkehr' iSd § 1 Abs. 3 BFSG."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder+frontend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Single-Founder denkt ”žist nur ein Spiel, keine Bank". Tatsächlich macht jede E-Commerce-Komponente die App BFSG-pflichtig. Verstoß = Bußgeld bis € 100 k, Marktrückruf durch Landesmarktüberwachung, Verbandsklagen.

**Mitigation.** (1) Accessibility-Statement nach EN 301 549 v3.2.1 im Footer. (2) Beschwerdekanal (E-Mail + Postanschrift, 4-Wochen-Antwort). (3) WCAG 2.2 AA als Definition-of-Done-Akzeptanzkriterium jeder PR. (4) Externes Audit vor Launch (Aktion Mensch, materna, ds-on Berlin). (5) Mikrounternehmens-Ausnahme dokumentieren — fällt weg bei Co-Founder/Investitionen.

**Verifikation.** Statement-Checkliste der Bundesfachstelle Barrierefreiheit. A11y-Audit-Report archivieren.

### PM-2026-05-20-10-F-03 — Match-Ticker Live-Region falsch konfiguriert (Spam oder Stille)

```yaml
id: PM-2026-05-20-10-F-03
priority: P2
domain: accessibility
probability: 4
impact: 4
score: 16
confidence: high
early_warning:
  - metric: "Live-Region-Updates pro Minute im 2D-Ticker"
    threshold: "> 6"
  - metric: "aria-live=assertive außerhalb von Notfällen"
    threshold: "> 0"
mitigation_summary: "Ticker = role=log + aria-live=polite + aria-atomic=false; nur Tore/Karten/Subs announced, nicht Ballbesitz; 'Wichtige Ereignisse nur'-Filter"
linked_adrs: []
linked_specs: []
linked_code: ["src/features/match-sim/Ticker.tsx"]
sources:
  - title: "ARIA live regions"
    url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions"
    accessed: "2026-05-20"
    publisher: "MDN"
    confidence: high
  - title: "ARIA-live announcements cheatsheet"
    url: "https://rightsaidjames.com/2025/08/aria-live-regions-when-to-use-polite-assertive/"
    accessed: "2026-05-20"
    publisher: "Right Said James"
    confidence: medium
verification_notes: "Naive aria-live=assertive: NVDA/JAWS halt-vorlesen jeden Pass. Dynamisch eingefügter Knoten ohne Live-Region: gar keine Ansage."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: frontend
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** `<ol role="log" aria-live="polite" aria-relevant="additions">`. Wichtigkeits-Filter: nur Events mit `severity >= "important"` werden live injiziert. Halbzeit/Schlusspfiff: separate `aria-live=assertive` Status-Region, ein Satz, einmalig. Ballbesitz NICHT live.

**Verifikation.** Playwright + axe `region`-Regel; manuelle SR-Tests mit Stoppuhr (max 1 Announcement/4 s).

### PM-2026-05-20-10-F-04 — `prefers-reduced-motion` ignoriert im 2D-Ticker und Transitions

```yaml
id: PM-2026-05-20-10-F-04
priority: P3
domain: accessibility
probability: 4
impact: 3
score: 12
confidence: high
early_warning:
  - metric: "CSS-Animationen ohne @media (prefers-reduced-motion: reduce)"
    threshold: "> 0"
mitigation_summary: "Globaler Reset: bei prefers-reduced-motion alle Animationen auf 0.01ms; Match-Sim zeigt diskrete Snapshots statt Pan/Zoom"
linked_adrs: []
linked_specs: [[09-Design-System]]
linked_code: ["src/styles/globals.css", "src/features/match-sim/Pitch.tsx"]
sources:
  - title: "prefers-reduced-motion"
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion"
    accessed: "2026-05-20"
    publisher: "MDN"
    confidence: high
  - title: "Accessible animation"
    url: "https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/"
    accessed: "2026-05-20"
    publisher: "Pope Tech"
    confidence: medium
verification_notes: "Vestibulär empfindliche Nutzer (~35 % Migräne-Prävalenz EU, Meniere) reagieren mit Übelkeit auf Pan-Ticker. Spec sagt 'reduce', nicht 'none'."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: frontend
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Global CSS: `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; } }`. Match-Sim: statt Pan → diskrete Frames mit Highlight-Marker. In-App-Toggle ”žAnimationen reduzieren".

**Verifikation.** Storybook a11y-Addon mit reduced-motion-Toggle; Playwright `--emulate-media reduce-motion`.

### PM-2026-05-20-10-F-05 — Farbcodierung Status/Form/Moral ohne nicht-farbliche Affordanz

```yaml
id: PM-2026-05-20-10-F-05
priority: P2
domain: accessibility
probability: 5
impact: 3
score: 15
confidence: high
early_warning:
  - metric: "Status-Indikator-Komponenten ohne Icon oder Text"
    threshold: "> 0"
mitigation_summary: "Jeder Status-Badge: Icon + Text-Label + aria-label. Design-System-Token erzwingt Pattern; Lint-Rule blockt Build"
linked_adrs: []
linked_specs: [[09-Design-System]]
linked_code: ["src/components/StatusBadge.tsx"]
sources:
  - title: "WCAG 1.4.1 Use of Color"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html"
    accessed: "2026-05-20"
    publisher: "W3C"
    confidence: high
verification_notes: "8 % der Männer (Zielgruppe!) haben Rot-Grün-Schwäche. Klassische FM-Patterns (Form-Ampel, Verletzung-rot, Moral-Smileys) verlieren jede Information."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: design+frontend
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Token `StatusBadge` enforct Icon + Text. Lint-Rule (eslint-plugin-jsx-a11y oder custom): Build bricht wenn Badge ohne Icon-prop. Charts: Pattern-Fill statt nur Farbe (Radar mit Strich-Mustern).

**Verifikation.** Storybook A11y-Tab + Greyscale-Prüfung jeder neuen Status-Komponente.

### PM-2026-05-20-10-F-06 — Squad-DataGrid ohne semantische Grid-Rolle (JAWS-Killer)

```yaml
id: PM-2026-05-20-10-F-06
priority: P2
domain: accessibility
probability: 4
impact: 4
score: 16
confidence: high
early_warning:
  - metric: "Virtualisierte Tabellen ohne <table>/role=grid"
    threshold: "> 0"
mitigation_summary: "Squad-Tabelle: nativ <table> + Sort-Header als Button + aria-sort; bei Inline-Edit role=grid mit aria-rowcount/colcount + Tastatur-Modell"
linked_adrs: []
linked_specs: []
linked_code: ["src/features/squad/SquadTable.tsx"]
sources:
  - title: "Data Grid Pattern (W3C APG)"
    url: "https://www.w3.org/WAI/ARIA/apg/patterns/grid/"
    accessed: "2026-05-20"
    publisher: "W3C APG"
    confidence: high
  - title: "Sortable Table Example (W3C APG)"
    url: "https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/"
    accessed: "2026-05-20"
    publisher: "W3C APG"
    confidence: high
  - title: "ARIA Grid As an Anti-Pattern"
    url: "https://adrianroselli.com/2020/07/aria-grid-as-an-anti-pattern.html"
    accessed: "2026-05-20"
    publisher: "Adrian Roselli"
    confidence: high
verification_notes: "TanStack-Table mit divs ohne ARIA-Grid: Header-Zuordnung unklar, virtualisierte Zeilen fehlen im a11y-Tree. Roselli: 'wenn es echte Tabellendaten sind, native <table> immer vorziehen'."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: frontend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Squad = native `<table>` (Daten). Sortable: Header-Button mit `aria-sort`. Bei Inline-Edit: `role=grid` mit Pfeil/Home/End/PgUp/PgDn + `aria-rowindex` für Virtualisierung. Sticky-Header darf 2.4.11 (Focus Not Obscured) nicht verletzen — `scroll-margin-top`.

**Verifikation.** Playwright keyboard-test "Sort via Header"; manuelles JAWS in Firefox.

### PM-2026-05-20-10-F-07 — Halbzeit-Modal Focus-Trap / Focus-Return defekt

```yaml
id: PM-2026-05-20-10-F-07
priority: P3
domain: accessibility
probability: 3
impact: 4
score: 12
confidence: high
early_warning:
  - metric: "Modale ohne Radix Dialog oder eigene FocusScope"
    threshold: "> 0"
mitigation_summary: "Radix Dialog/AlertDialog verwenden — Focus-Trap, aria-modal, Restore-Focus out-of-the-box"
linked_adrs: []
linked_specs: []
linked_code: ["src/features/match-sim/HalftimeModal.tsx"]
sources:
  - title: "Radix Dialog"
    url: "https://www.radix-ui.com/primitives/docs/components/dialog"
    accessed: "2026-05-20"
    publisher: "Radix UI"
    confidence: high
  - title: "Radix Accessibility Overview"
    url: "https://www.radix-ui.com/primitives/docs/overview/accessibility"
    accessed: "2026-05-20"
    publisher: "Radix UI"
    confidence: high
verification_notes: "Eigenbau-Modal: Focus-Trap fragil. Halbzeit-Modal ist DER kritische Punkt — wenn Sub-Flow defekt, ganzes Spiel unbedienbar für Tastatur-User."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: frontend
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** `<Dialog.Root>`/`<Dialog.Content>` mit `<Dialog.Title>` (sichtbar) + `<Dialog.Description>`. Sub-Liste als Listbox mit `aria-activedescendant` ODER zwei Buttons ”žAuswechseln" / ”žVerwerfen". Trigger-Button erhält Focus zurück.

**Verifikation.** Storybook Story ”žHalftime Modal Keyboard-Only" + axe `aria-dialog-name`.

### PM-2026-05-20-10-F-08 — Touch-Target < 24×24 CSS-px (2.5.8) auf Mobile

```yaml
id: PM-2026-05-20-10-F-08
priority: P3
domain: accessibility
probability: 4
impact: 3
score: 12
confidence: high
early_warning:
  - metric: "Buttons/Icons mit Bounding-Box < 24px"
    threshold: "> 0"
mitigation_summary: "Tailwind-Tokens h-6 w-6 (24px) Minimum für interaktive Icons; transparente Padding-Hitbox falls visuell kleiner"
linked_adrs: []
linked_specs: [[09-Design-System]]
linked_code: []
sources:
  - title: "Understanding SC 2.5.8 Target Size (Minimum)"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html"
    accessed: "2026-05-20"
    publisher: "W3C"
    confidence: high
verification_notes: "Dichte Tabellen mit 16×16 Icon-Aktionen verstoßen 2.5.8. Mobile ist Hauptmarkt (PWA), Daumen-Trefferquote leidet."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: design+frontend
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Design-Token `--target-size-min: 1.5rem`. Storybook-Showcase erzwingt Minimum.

**Verifikation.** axe-core best-practice + Playwright Mobile-Emulation.

### PM-2026-05-20-10-F-09 — Kontrastfehler durch shadcn/ui Default-Slate-Tokens auf weiß

```yaml
id: PM-2026-05-20-10-F-09
priority: P4
domain: accessibility
probability: 3
impact: 3
score: 9
confidence: medium
early_warning:
  - metric: "Token-Kombinationen unter 4.5:1 Kontrast"
    threshold: "> 0"
mitigation_summary: "Light-Theme Token-Audit; muted-foreground (slate-500) grenzwertig (4.6:1) — ggf. slate-600 mappen; Lighthouse a11y-Score >= 95"
linked_adrs: []
linked_specs: [[09-Design-System]]
linked_code: ["src/styles/tokens.css"]
sources:
  - title: "WCAG 2.2 Contrast Ratio"
    url: "https://accessibilityassistant.com/blog/accessibility-insights/how-to-apply-wcag-22-colour-contrast-accessibility/"
    accessed: "2026-05-20"
    publisher: "Accessibility Assistant"
    confidence: medium
verification_notes: "shadcn/ui-Standard (slate/zinc) bewegt sich knapp über 4.5:1; muted-foreground + Placeholder fallen auf Cards/Hover oft drunter."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: design
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Token-Audit jeder Foreground/Background-Kombi mit WebAIM Contrast Checker; Ergebnisse in `09-Design-System.md` dokumentiert. Lighthouse-CI a11y ≥ 95 als Gate.

### PM-2026-05-20-10-F-10 — Authentifizierung verletzt 3.3.8 (CAPTCHA, 16+ Age-Gate)

```yaml
id: PM-2026-05-20-10-F-10
priority: P4
domain: accessibility
probability: 3
impact: 3
score: 9
confidence: medium
early_warning:
  - metric: "Login/Age-Gate nutzt unlösbares CAPTCHA oder Memory-Test"
    threshold: "vorhanden"
mitigation_summary: "Magic-Link / Passkey + WebAuthn primary; Friendly Captcha / Cloudflare Turnstile als barrierefreie CAPTCHA-Alternative; Geburtsdatum mit autocomplete=bday"
linked_adrs: []
linked_specs: []
linked_code: ["src/features/auth/*"]
sources:
  - title: "Understanding SC 3.3.8 Accessible Authentication"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html"
    accessed: "2026-05-20"
    publisher: "W3C"
    confidence: high
  - title: "WCAG-Compliant CAPTCHA"
    url: "https://friendlycaptcha.com/accessibility/wcag/"
    accessed: "2026-05-20"
    publisher: "Friendly Captcha"
    confidence: medium
verification_notes: "Klassisches reCAPTCHA v2 + Passwort verletzt 3.3.8: kognitive Funktion erforderlich, keine Alternative."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: frontend+backend
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** WebAuthn/Passkey-First; Fallback Magic-Link. Falls CAPTCHA notwendig: Friendly Captcha oder Turnstile (proof-of-work, keine UX-Reibung). Geburtsdatum-Eingabe `<input type=date>` + `autocomplete=bday`.

**Verifikation.** axe-core `autocomplete-valid`; manueller Login-Flow mit Bitwarden-Autofill.

### PM-2026-05-20-10-F-11 — Fehlende automatisierte a11y-Coverage in CI

```yaml
id: PM-2026-05-20-10-F-11
priority: P2
domain: accessibility
probability: 4
impact: 4
score: 16
confidence: high
early_warning:
  - metric: "Routen mit axe-core-Smoketest"
    threshold: "< Gesamtanzahl Top-Level-Routen"
  - metric: "Lighthouse a11y-Score pro Route"
    threshold: "< 95"
mitigation_summary: "@axe-core/playwright als Smoke-Test pro Top-Level-Route + Storybook addon-a11y; Failing Build = 0 critical/serious; Lighthouse-CI a11y >= 95"
linked_adrs: []
linked_specs: [[PM-2026-05-20-16-test-strategy-depth]]
linked_code: ["tests/a11y/*", ".lighthouserc.json"]
sources:
  - title: "Accessibility testing | Playwright"
    url: "https://playwright.dev/docs/accessibility-testing"
    accessed: "2026-05-20"
    publisher: "Playwright"
    confidence: high
  - title: "Automated Testing Identifies 57 % of Issues"
    url: "https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/"
    accessed: "2026-05-20"
    publisher: "Deque"
    confidence: high
verification_notes: "Aktuell läuft Lighthouse-CI nur für Performance. Ohne axe-core-Coverage schleichen Regressionen ein. Deque: 57 % automatisch erkennbar."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: frontend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** `@axe-core/playwright` in jeder Top-Level-Story + Route. Schwellwert 0 critical/serious. Storybook `@storybook/addon-a11y` standardmäßig aktiv. Pre-commit-Hook `pnpm a11y:changed`.

**Verifikation.** CI archiviert Reports. Quartärlich NVDA + VoiceOver-Skript ergänzend.

## Quantitatives Modell

- **Reichweite**: EU 24 % Pop. mit Disability (Eurostat 2024), DE ~10 % schwerbehindert, +8 % männl. Farbsehschwäche, +Aging. Konservativ: **15 % der Zielgruppe profitiert direkt**.
- **Bugfix-Kosten**: Pre-Launch O(Std–Tag), Post-Launch O(Sprint) — Deque shift-left: ~6× später.
- **CI-Regeln**: ~90 axe-core-Regeln aktiv; SLO 0 Verstöße critical/serious.
- **Bußgeld-Risiko**: € 100 k pro Verstoß DE (BFSG) + reputational + Marktrückruf.

## SLO-Vorschläge

1. axe-core violations (critical+serious) im CI **= 0** pro PR auf allen Top-Level-Routen.
2. Lighthouse-CI a11y-Score **≥ 95** Top-Level, ≥ 90 Sub-Routes.
3. Tastatur-Only-Flow-Coverage **100 %** Core-Gameplay-Loops (Lineup, Tactics, Halftime-Sub, Inbox, Calendar-Advance).
4. SR-Time-to-Complete Halbzeit-Sub ≤ **2×** Sighted-Baseline (manuell quartärlich).
5. WCAG 2.2 AA Audit (extern) **≤ 12 Monate** alt.

## Test-Plan

- **Static/CI**: `@axe-core/playwright` pro Route; `eslint-plugin-jsx-a11y` in lint; Storybook addon-a11y + Chromatic A11y-Reports.
- **Component**: jede `*.stories.tsx` enthält ”žkeyboard-only" Story-Variant.
- **Top-5 Flows manuell** (vor jedem Release): Squad sortieren/filtern (JAWS+Firefox), Tactics-Drag (NVDA+Chrome+Tastatur), 90-Min-Match mit Halbzeit-Sub (NVDA Polite), Calendar Week-Advance + Inbox (VoiceOver+Safari), Onboarding Create-a-Club (TalkBack+Android).
- **Real-User**: jährlich Aktion Mensch / DBSV Test-Session (3 Nutzer × 60 min).

## Runbook-Skizzen

### RB-10-A: A11y-Bug-Report (Inbox/GH-Issue/BFSG-Beschwerde)
1. Triage Severity (axe-Skala blocker/critical/serious/moderate) → Reproduktion → high/critical = Hotfix-Branch + Release < 14 Tage (BFSG-Frist).
2. SR-Test (NVDA + Firefox) zur Reproduktion.
3. Fix + axe-Regression-Test.

### RB-10-B: BFSG-Beschwerde via Marktüberwachung
1. Sofortige Receipt-Bestätigung; 4-Wochen-Antwortfrist.
2. Accessibility-Statement + Konformitätspruefnachweis bereithalten.
3. Eskalations-Pfad an Rechtsbeistand.

### RB-10-C: Pre-Launch-Audit-Checkliste
(a) axe-core CI grün, (b) Lighthouse a11y ≥ 95 alle Routen, (c) externe WCAG 2.2 AA Prüfung, (d) Accessibility-Statement publiziert, (e) Reduced-Motion + High-Contrast getestet, (f) NVDA/VoiceOver-Skript Top-5-Flows, (g) Touch-Targets 24px Mobile, (h) Sign-off Design-Lead + Founder.

## Future-scope decisions (classified future-scope)
1. `react-aria-components` zusätzlich zu Radix/shadcn? Nur für DnD oder breitflächig? **Empfehlung: Ja** (DnD-Bedarf unvermeidbar).
2. Dyslexie-Font-Toggle: Atkinson Hyperlegible als Opt-in, OpenDyslexic NICHT (2016-Studie negativ). Default System-UI / Inter.
3. Match-Sim 3D-Modus geplant? Falls ja, Audio-Description-Spur nötig.
4. Verantwortliche Person für Accessibility-Statement nach BFSG (Founder?).
5. CAPTCHA nötig oder reicht WebAuthn/Passkey + Rate-Limit?

## "Wenn wir nur 3 Dinge tun"-Liste

1. **`react-aria` DnD adoptieren** für Tactic-Board + Lineup (F-01). Löst WCAG 2.5.7 + Tastatur + SR-Announcements in einem. Höchster Hebel.
2. **axe-core/Playwright + Storybook addon-a11y CI-Gate** (F-11). Fängt 57 % der Issues automatisch, schützt Regression, einmalig ~1 Sprint Setup.
3. **Status-Tokens als Icon+Text+aria-label-Pattern** im Design-System verankern + Token-Lint (F-05). Löst Use-of-Color + Cognitive-Accessibility + SR-Lesbarkeit der dichtesten Datentabellen.

## Verfolgung & Verkettung

IDs `PM-2026-05-20-10-F-NN`. Aggregat: [[findings-registry]].

## Related

- [[00-index]] · [[findings-registry]] · [[threat-model]]
- [[PM-2026-05-20-09-i18n-and-localization]] (RTL + Unicode-Validation)
- [[PM-2026-05-20-13-community-moderation-and-ugc]] (CAPTCHA + barrierefreie Moderation)
- [[PM-2026-05-20-16-test-strategy-depth]] (axe-core CI-Layer)
- [[../../10-Architecture/09-Design-System]]
