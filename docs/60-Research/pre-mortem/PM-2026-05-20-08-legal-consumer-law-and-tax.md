---
title: "Pre-Mortem 2026-05-20 · 08 · Legal, Consumer-Law & Tax"
status: draft
tags: [research, pre-mortem, legal, consumer-law, tax, trademark, dsa, agb, 2026-Q2]
created: 2026-05-20
updated: 2026-05-20
type: research
binding: false
report_id: PM-2026-05-20-08
report_set: 2026-05-20
horizon: 2026-11-20
target_dau: 10000
scenarios: [single-node-hetzner, cloud-autoscaling]
iteration: 3
related:
  - [[00-index]]
  - [[findings-registry]]
  - [[PM-2026-05-20-04-monetization]]
  - [[PM-2026-05-20-13-community-moderation-and-ugc]]
  - [[PM-2026-05-20-14-brand-pr-and-crisis-comms]]
  - [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability]]
  - [[PM-2026-05-20-18-responsible-gaming-and-open-source]]
  - [[../gdpr-compliance]]
  - [[../ip-and-licensing]]
  - [[../../30-Implementation/privacy-and-consent]]
---

# Pre-Mortem 2026-05-20 · 08 · Legal, Consumer-Law & Tax (beyond DSGVO)

> **Failure-Headline-Kandidaten**
> - „SEGA/Sports-Interactive-Abmahnung wegen 'football-manager-x' — Streitwert 75 k €, Anwaltskosten + Unterlassungserklärung."
> - „DFL-Anwaltsschreiben wegen 4.218 UGC-Saves mit 'FC Bayern München' + Wappen-Upload — 12 k € + erzwungene Reverse-Image-Lookup-Pipeline."
> - „Cosmetics-Pack-Launch ohne Probability-Disclosure → einstweilige Verfügung Verbraucherschutzverein."
> - „OSS-Schwelle 10 k € in Q3 verpasst → Nachforderung MwSt in 7 EU-Ländern, Schätzbescheid 18 k €."
> - „Fehlerhaftes Impressum (TMG-Reste) → Wettbewerbsabmahnung 1.500 €, bei Wiederholung bis 50 k € Bußgeld."

## Scope

Baut auf gelocktem [[../gdpr-compliance]] auf und erweitert um EU-Verbraucherschutz, AGB-Kontrolle, Impressum, Markenrecht, UGC-IP-Risiken, FIFPro/DFL-Player-Likeness, EU-OSS-Steuern (post-VAT-MOSS), DAC7, Glücksspielrecht, DSA, AI-Act-Art-50, Withholding-Tax. **DSGVO nicht duplizieren** — Referenz.

## Top Failure-Hypothesen

---

### PM-2026-05-20-08-F-01 — Update-Verpflichtung § 327f BGB für Live-Service-PWA unklarer Dauer

```yaml
id: PM-2026-05-20-08-F-01
priority: P3
domain: legal
probability: 4
impact: 3
score: 12
confidence: medium
early_warning:
  - metric: "Letztes Sicherheitsupdate Production-Branch"
    threshold: "> 90 Tage ohne Patch bei gemeldeter CVE-Klasse"
mitigation_summary: "Update-Policy publizieren (24 Mo. Sicherheits+Funktions, danach Sicherheits bis Service-EOL mit 6-Monats-Vorankündigung)"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "§ 327f BGB Aktualisierungen"
    url: "https://www.gesetze-im-internet.de/bgb/__327f.html"
    accessed: "2026-05-20"
    publisher: "BMJ"
    confidence: high
  - title: "Update-Pflicht — Haerting Rechtsanwälte"
    url: "https://haerting.de/wissen/update-pflicht-und-mehr/"
    accessed: "2026-05-20"
    publisher: "Haerting"
    confidence: high
verification_notes: "§ 327f Satz 2 BGB: 'Zeitraum, den der Verbraucher erwarten kann' — Auslegungsfrage. Kostenloses MVP = kürzere Erwartung, Premium = längere."
status: open
owner_suggested: legal+product
effort: M
created: 2026-05-20
updated: 2026-05-20
```

**Hypothese.** § 327f verpflichtet zur Bereitstellung erforderlicher Aktualisierungen einschließlich Sicherheitsupdates während des gesamten Bereitstellungszeitraums. Bei Live-Service ohne klares EOL ist das praktisch unbegrenzt. Service-Einstellung ohne Vorankündigung = § 327r-Streit + Mängelansprüche.

**Mitigation.** AGB-Klausel: „Sicherheitsupdates während gesamter Bereitstellungsdauer kostenlos. Funktionsaktualisierungen via Roadmap. Service-EOL mit 6 Monaten Vorankündigung; ab Ankündigung nur Sicherheitsupdates bis Abschalt-Datum." Impressum/FAQ Service-Lifecycle dokumentieren. Premium-Tier mit explizitem Mindest-Support-Zeitraum.

**Verifikation.** Jährliches Legal-Review; Lifecycle-Dashboard „letztes Sicherheitsupdate je Layer".

---

### PM-2026-05-20-08-F-02 — Widerrufsrecht digitale Inhalte nicht korrekt zum Erlöschen gebracht

```yaml
id: PM-2026-05-20-08-F-02
priority: P3
domain: legal
probability: 5
impact: 2
score: 10
confidence: high
early_warning:
  - metric: "Anteil Käufe mit dokumentiertem Verzicht-Checkbox"
    threshold: "< 99 %"
mitigation_summary: "Doppel-Checkbox vor Zahlung + § 312f-Bestätigungsmail mit dauerhaftem Datenträger"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "Widerrufsbelehrungen digitale Inhalte — Heuking"
    url: "https://www.heuking.de/de/news-events/newsletter-fachbeitraege/artikel/vorsicht-bei-widerrufsbelehrungen-bei-digitalen-inhalten-und-dienstleistungen.html"
    accessed: "2026-05-20"
    publisher: "Heuking Kühn Lüer Wojtek"
    confidence: high
  - title: "§ 356 BGB"
    url: "https://www.gesetze-im-internet.de/bgb/__356.html"
    accessed: "2026-05-20"
    publisher: "BMJ"
    confidence: high
verification_notes: "F2P-MVP nicht akut; kritisch ab erstem Verkauf. § 356 Abs. 5 BGB für digitale Inhalte erfordert exakte Verzichts-Sequenz."
status: open
owner_suggested: product+legal
effort: S
created: 2026-05-20
updated: 2026-05-20
```

**Hypothese.** Bei Premium/Cosmetic-Kauf ohne korrekte Verzichts-Sequenz: 14 Tage vollständig erstattbare Käufe → Cashflow-Risiko + Missbrauchsvektor.

**Mitigation.** Checkout-UX mit **zwei separaten Checkboxen** (keine Vorauswahl): (1) „Ich verlange ausdrücklich, dass Sie vor Ablauf der 14-tägigen Widerrufsfrist mit der Vertragsausführung beginnen." (2) „Mir ist bekannt, dass ich mit dem Beginn der Vertragsausführung mein Widerrufsrecht verliere." Nach Kauf E-Mail mit Bestätigung iSd § 312f BGB. Audit-Trail: persistiere Checkbox-Klicks mit Timestamp im Outbox.

**Verifikation.** Monatlicher Testkauf; Stripe/Paddle-Webhook-Audit korreliert jede Charge mit `withdrawal_waiver_accepted_at` und `confirmation_email_sent_at`.

---

### PM-2026-05-20-08-F-03 — AGB-Kontrolle §§ 305 ff. BGB — typische unwirksame Haftungsklauseln

```yaml
id: PM-2026-05-20-08-F-03
priority: P3
domain: legal
probability: 4
impact: 3
score: 12
confidence: high
early_warning:
  - metric: "AGB-Last-Review-Datum"
    threshold: "> 12 Monate ohne Legal-Review"
mitigation_summary: "AGB durch DE-Fachanwalt IT-Recht prüfen; pauschale Haftungsausschlüsse vermeiden; Transparenzgebot § 307 I 2 BGB"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "§ 305 BGB"
    url: "https://www.gesetze-im-internet.de/bgb/__305.html"
    accessed: "2026-05-20"
    publisher: "BMJ"
    confidence: high
verification_notes: "§ 309 Nr. 7 BGB: pauschaler Haftungsausschluss für Leben/Körper/Gesundheit nichtig. US-EULAs ('AS IS, no warranties') in DE-B2C reihenweise unwirksam."
status: open
owner_suggested: legal
effort: M
created: 2026-05-20
updated: 2026-05-20
```

**Hypothese.** US-Indie-EULAs enthalten Klauseln, die in DE-B2C-AGB-Kontrolle nichtig sind: „AS IS, no warranties" (§ 309 Nr. 7 + §§ 327d-i), Kündigung „at sole discretion" (§ 307), „arbitration in California" (Rom-I-VO Art. 6 unwirksam). Verbraucherzentrale-Abmahnung 200–1.500 € pro Verstoss.

**Mitigation.** AGB von Anfang an mit DE-Fachanwalt (€ 1–3 k einmalig); Transparenzgebot; Haftung nur „Vorsatz/grobe Fahrlässigkeit" ausschliessen, niemals Leben/Körper; symmetrische Kündigung; DE-Recht + Verbraucher-Wohnsitz-Gerichtsstand; keine TMG-Verweise (DDG-Update!); kein OS-Plattform-Link (abgeschaltet 20.07.2025).

**Verifikation.** Jährliches Legal-Review; Verbraucherzentrale-Hinweise abgleichen.

---

### PM-2026-05-20-08-F-04 — Impressumspflicht § 5 DDG: TMG-Reste, fehlende Pflichtangaben

```yaml
id: PM-2026-05-20-08-F-04
priority: P2
domain: legal
probability: 5
impact: 2
score: 10
confidence: high
early_warning:
  - metric: "TMG-Referenzen auf Website"
    threshold: "> 0 (DDG ist Pflicht seit 14.05.2024)"
mitigation_summary: "Footer-Impressum max 2 Klicks erreichbar; alle DDG § 5-Pflichtangaben; VSBG-Erklärung 'nicht teilnahmebereit' explizit; OS-Plattform-Link entfernt"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "§ 5 DDG"
    url: "https://www.gesetze-im-internet.de/ddg/__5.html"
    accessed: "2026-05-20"
    publisher: "BMJ"
    confidence: high
  - title: "DDG Enforcement — Taylor Wessing"
    url: "https://www.taylorwessing.com/en/insights-and-events/insights/2024/05/ddg"
    accessed: "2026-05-20"
    publisher: "Taylor Wessing"
    confidence: high
verification_notes: "§ 33 DDG Bußgeld bis 50 k €. In Praxis Wettbewerbs-Abmahnungen, Streitwerte 5–15 k €, Anwaltskosten 800–1.500 €."
status: open
owner_suggested: legal
effort: S
created: 2026-05-20
updated: 2026-05-20
```

**Hypothese.** DDG seit 14.05.2024 ersetzt TMG. Häufige Fehler: alter § 5 TMG-Verweis, fehlende USt-IdNr., kein Vertretungsberechtigter, OS-Plattform-Link nicht entfernt (abgeschaltet 20.07.2025).

**Mitigation.** Pflichtfelder: Name/Anschrift, Rechtsform + Vertretungsberechtigter, E-Mail + Telefon, HRB, USt-IdNr., VSBG-Erklärung „nicht teilnahmebereit". § 5 DDG zitieren, nicht § 5 TMG.

**Verifikation.** Halbjährlicher HTML-Check auf Footer-Impressum + Pflichtfelder.

---

### PM-2026-05-20-08-F-05 — Marken-Kollision „football-manager-x" mit Sports Interactive/SEGA

```yaml
id: PM-2026-05-20-08-F-05
priority: P0
domain: legal
probability: 4
impact: 5
score: 20
confidence: high
early_warning:
  - signal: "Domain-Indexing, Repo-Public-Sichtbarkeit, erste externe Erwähnung"
  - signal: "Eingehende Briefpost UK/DE-IP-Kanzlei"
mitigation_summary: "Sofort-Rebrand vor jedem Public-Asset; FTO-Recherche durch DE-Fachanwalt; Markenanmeldung DPMA + ggf. EUIPO"
linked_adrs: [[[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]]]
linked_specs: [[[PM-2026-05-20-14-brand-pr-and-crisis-comms]]]
linked_code: []
sources:
  - title: "Sports Interactive"
    url: "https://www.sports-interactive.com/"
    accessed: "2026-05-20"
    publisher: "Sports Interactive Ltd. (SEGA)"
    confidence: high
  - title: "DPMA Gebühren"
    url: "https://www.dpma.de/service/gebuehren/marken/index.html"
    accessed: "2026-05-20"
    publisher: "DPMA"
    confidence: high
  - title: "Markenrechts-Abmahnungen Kosten"
    url: "https://www.it-recht-kanzlei.de/markenabmahnungen-kosten-teuer.html"
    accessed: "2026-05-20"
    publisher: "IT-Recht Kanzlei"
    confidence: high
verification_notes: "TMview-Suche 'Football Manager' Nice 9/41 EU: >40 aktive Marken Sports Interactive. '-x'-Suffix beseitigt Verwechslungsgefahr NICHT (BGH-Linie)."
status: open
owner_suggested: founder+legal
effort: M
created: 2026-05-20
updated: 2026-05-20
```

**Hypothese.** „football-manager-x" enthält identische Wortkombination einer EU/DE-Marke in Nice 9 (Computer-Software) + 41 (Spiele) — exakt unsere Klassen. Abmahnschreiben über UK-/DE-Großkanzlei (Bird&Bird, Hogan Lovells, Taylor Wessing) ist Frage von Wochen sobald Public. Streitwert 50–100 k €, Abmahnkosten 1.400–2.500 € + eigene, plus Zwangs-Rename unter Zeitdruck mit Verlust aller Brand-Assets.

**Mitigation.** **Sofortiger Rebrand vor jedem Public-Asset**. FTO-Recherche durch DE-Markenanwältin auf 2–3 Top-Kandidaten (Heimrunde/Klubkönig/Formationfuchs aus Report 14). DPMA-Anmeldung (€ 290 + ggf. € 200 beschleunigt), EUIPO später (€ 850). Defensive Domain-Sicherung 3 Finalisten × 4 TLDs (~€ 360/Jahr).

**Verifikation.** FTO-Memo dokumentiert. Marken-Anmeldung als Gate-Bedingung für Marketing. CI-Lint: Repo-Rename vollständig (`grep -ri "football-manager-x"` = 0 außer CHANGELOG).

---

### PM-2026-05-20-08-F-06 — UGC-Marken: Spieler benennt Klubs „Bayern München", lädt Wappen hoch

```yaml
id: PM-2026-05-20-08-F-06
priority: P0
domain: legal
probability: 5
impact: 4
score: 20
confidence: high
early_warning:
  - metric: "UGC-Clubs mit echten Vereinsnamen (Tagcloud-Sample)"
    threshold: "> 5 % bei 100-Sample"
mitigation_summary: "Notice-and-Action-Webform Art. 16 DSA; UGC-Disclaimer AGB; Bloom-Filter Bundesliga + 2.BL + UEFA-Top-100 + Wappen-Hashes; Logos nur mit Disclaimer + perceptual-hash-Vergleich"
linked_adrs: [[[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]]]
linked_specs: [[[PM-2026-05-20-13-community-moderation-and-ugc]]]
linked_code: []
sources:
  - title: "DDG Host-Liability"
    url: "https://www.taylorwessing.com/en/insights-and-events/insights/2024/05/ddg"
    accessed: "2026-05-20"
    publisher: "Taylor Wessing"
    confidence: high
  - title: "DFL rechtliche Hinweise"
    url: "https://www.dfl.de/de/rechtliche-hinweise/"
    accessed: "2026-05-20"
    publisher: "DFL"
    confidence: high
  - title: "DFL Streitwert Bundesliga-Wappen"
    url: "https://www.lhr-law.de/magazine-en/sports-law/sportwettenanbieter-aufgepasst-bei-unbefugter-verwendung-der-clublogos-der-bundesligavereine-droht-hoher-streitwert"
    accessed: "2026-05-20"
    publisher: "LHR Rechtsanwälte"
    confidence: high
verification_notes: "Host-Privileg Art. 6 DSA / § 10 DDG: nur ohne Kenntnis. Ohne Notice-and-Action-Mechanismus geht Privileg verloren. Streitwert 50–100 k € pro Logo."
status: open
owner_suggested: legal+product+engineering
effort: L
created: 2026-05-20
updated: 2026-05-20
```

**Hypothese.** Trotz ADR-0007 (IP-clean) werden Nutzer Custom-Vereine „FC Bayern München" mit Original-Wappen anlegen. Plattform haftet ab Kenntnis. Ohne Art. 16 DSA-Mechanismus verlieren wir Privileg.

**Mitigation.** (1) Art. 16 DSA-konformer Webform + 48 h-SLA. (2) Hardcoded Block-List 36 BL + 36 2.BL + UEFA-Top-100 + DFB-Pokal-Drittligisten; Eingabevalidierung. (3) Logo-Upload: Disclaimer-Checkbox + perceptual-hash-Vergleich (pHash) in Moderation-Pipeline; Auto-Quarantäne. (4) AGB: User-Indemnification-Clause. (5) Repeat-Offender-Policy Art. 23 DSA.

**Verifikation.** Quartärlicher Audit: 100 Random-Clubs, Trefferquote echter Namen tracken. Notice-Postfach-SLA-Monitoring. Vollständige Implementierung in [[PM-2026-05-20-13-community-moderation-and-ugc]].

---

### PM-2026-05-20-08-F-07 — FIFPro/Player-Likeness — ADR-0007 schließt nicht alle Risiken aus

```yaml
id: PM-2026-05-20-08-F-07
priority: P3
domain: legal
probability: 2
impact: 4
score: 8
confidence: medium
early_warning:
  - metric: "Procedural-namegen-Output enthält real-existierende Spielernamen"
    threshold: "> 0 Treffer in 10k Generationen gegen FIFPro-Liste"
mitigation_summary: "Procedural-Namegen mit FIFPro-Top-3000 als Negativliste; UGC-Bloom-Filter; AGB-Indemnification"
linked_adrs: [[[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]]]
linked_specs: []
linked_code: []
sources:
  - title: "Foul play? Ibrahimović digital likeness — Freshfields"
    url: "https://technologyquotient.freshfields.com/post/102gpgj/foul-play-ibrahimovic-and-the-role-of-digital-likeness-in-sports-video-games"
    accessed: "2026-05-20"
    publisher: "Freshfields Bruckhaus Deringer"
    confidence: high
verification_notes: "DE: § 12 BGB Persönlichkeitsrecht + § 22 KUG. Reine Namen ohne Bild nicht per se geschützt, aber Prominente + kommerziell + Verwechslung → § 12 BGB greift."
status: open
owner_suggested: legal+engineering
effort: M
created: 2026-05-20
updated: 2026-05-20
```

**Hypothese.** Namegen-Pipeline könnte zufällig „Robert Lewandowski" oder „Jude Bellingham" erzeugen — § 12-BGB-Risiko. UGC-Spielernamen mit Profinamen verlagern Haftung primär auf Nutzer, aber Plattform muss notice-fähig sein.

**Mitigation.** Stoppliste FIFPro-Top-3000 + DFB-BL-Kader + UEFA-Top-Player aus Wikidata-Query. Bei Generations-Hit Re-Sampling. UGC-Eingabe gegen Stoppliste mit Soft-Warning. AGB-Indemnification. Notice via Art. 16 DSA.

**Verifikation.** Quartärlich: 10 k Procedural-Generationen gegen FIFPro-Liste matchen; Trefferquote < 0,01 %.

---

### PM-2026-05-20-08-F-08 — OSS-Schwellenwert 10.000 € EU-Cross-Border ab Premium-Launch

```yaml
id: PM-2026-05-20-08-F-08
priority: P3
domain: tax
probability: 4
impact: 3
score: 12
confidence: high
early_warning:
  - metric: "Cross-Border B2C-Umsatz EU YTD"
    threshold: "> 7.000 € (80 % Warnschwelle)"
mitigation_summary: "OSS-Registrierung BZSt vor erstem Premium-Verkauf; Stripe/Paddle Tax-Mode 'Inclusive'; Paddle als MoR = Risiko-Transfer"
linked_adrs: []
linked_specs: [[[PM-2026-05-20-04-monetization]]]
linked_code: []
sources:
  - title: "EU VAT One Stop Shop (OSS)"
    url: "https://europa.eu/youreurope/business/taxation/vat/one-stop-shop/index_en.htm"
    accessed: "2026-05-20"
    publisher: "European Commission"
    confidence: high
  - title: "OSS-Verfahren — DATEV"
    url: "https://www.datev.de/web/de/aktuelles/gesetzliche-themen/one-stop-verfahren-oss/"
    accessed: "2026-05-20"
    publisher: "DATEV"
    confidence: high
  - title: "Stripe EU VAT & OSS Guide"
    url: "https://stripe.com/guides/introduction-to-eu-vat-and-european-vat-oss"
    accessed: "2026-05-20"
    publisher: "Stripe"
    confidence: medium
verification_notes: "10 k €/Jahr EU-Schwelle seit 01.07.2021 für elektronische B2C-Dienstleistungen. OSS via BZSt-BOP = quartärlicher Single-Filing."
status: open
owner_suggested: finance+legal
effort: M
created: 2026-05-20
updated: 2026-05-20
```

**Hypothese.** Bei 10 k Spielern + 2–5 % Premium-Conversion × € 5/Mo = € 1–2,5 k/Monat → schnelle Überschreitung der 10 k €-Schwelle. Bei Verpassung: Nachforderungen pro EU-Land.

**Mitigation.** Stripe/Paddle-Konfig mit Empfänger-VAT-Berechnung. **Paddle als MoR** (5 %+€ 0,50): operativ einfachste Lösung. OSS-Registrierung BZSt bei Premium-Launch (nicht erst nach Schwellen-Überschreitung). Kleinunternehmer-Schwellen § 19 UStG: 25 k € Vorjahr / 100 k € laufend. Steuerberater ab € 5 k laufendem Bruttoumsatz.

**Verifikation.** Monatlich Cross-Border-Revenue-Dashboard; OSS-Quartalsmeldung kalendarisch geblockt.

---

### PM-2026-05-20-08-F-09 — DAC7 wahrscheinlich nicht anwendbar, bei UGC-Marketplace zu prüfen

```yaml
id: PM-2026-05-20-08-F-09
priority: P4
domain: tax
probability: 1
impact: 3
score: 3
confidence: medium
early_warning:
  - metric: "Monetarisierung von UGC zwischen Nutzern (Save-Sharing gegen Geld)"
    threshold: "≥ 1 Feature aktiv"
mitigation_summary: "Aktuell nicht DAC7-pflichtig (kein Marketplace). Re-Assessment vor jedem UGC-Marketplace-Feature."
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "DAC7 — EU Commission"
    url: "https://taxation-customs.ec.europa.eu/taxation/tax-transparency-cooperation/administrative-co-operation-and-mutual-assistance/dac7_en"
    accessed: "2026-05-20"
    publisher: "European Commission"
    confidence: high
  - title: "DAC7 — BZSt"
    url: "https://www.bzst.de/EN/Businesses/DPI_DAC7/Procedure/procedure_node.html"
    accessed: "2026-05-20"
    publisher: "BZSt"
    confidence: high
verification_notes: "DAC7 erfasst Plattform-Betreiber, die Verkäufer mit Käufern verbinden. B2C-SaaS direkt an Endkunden nicht erfasst. PStTG-Umsetzung: Bußgeld bis 50 k €."
status: open
owner_suggested: legal+finance
effort: S
created: 2026-05-20
updated: 2026-05-20
```

**Mitigation.** Vor jedem Save-Marketplace/Trading-Feature Mini-Assessment. Bei Marketplace-Trigger: KYC-Pflicht (TIN, Steuernummer) + jährliche BZSt-Meldung bis 31.01. Penalty bis € 50 k.

---

### PM-2026-05-20-08-F-10 — Lootboxen / Pack-Mechaniken — Glücksspielrecht-Trigger

```yaml
id: PM-2026-05-20-08-F-10
priority: P2
domain: legal
probability: 3
impact: 5
score: 15
confidence: medium
early_warning:
  - metric: "Monetisierungs-Feature mit Zufall + Geldeinsatz"
    threshold: "≥ 1 Pack/Lootbox/Gacha im Backlog"
mitigation_summary: "Lootboxen im MVP ausgeschlossen; alternative Monetarisierung (Battle-Pass, kosmetische Direktkäufe, Subscription); bei späterer Pack-Mechanik: probability disclosures + Altersgate 18 + Spend-Caps + kein Cash-Out"
linked_adrs: []
linked_specs: [[[PM-2026-05-20-18-responsible-gaming-and-open-source]]]
linked_code: []
sources:
  - title: "Loot boxes in German gambling law"
    url: "https://www.ferner-alsdorf.com/loot-boxes-in-german-gambling-law/"
    accessed: "2026-05-20"
    publisher: "Ferner Alsdorf"
    confidence: high
  - title: "AT-OGH FIFA-Lootboxes-Urteil 12/2025 — DLA Piper"
    url: "https://www.dlapiper.com/en/insights/publications/2026/01/supreme-court-shifts-the-playing-field-lootboxes-fall-outside-the-austrian-gambling-act"
    accessed: "2026-05-20"
    publisher: "DLA Piper"
    confidence: high
  - title: "Bundestag WD Loot-Boxen-Bericht"
    url: "https://www.bundestag.de/resource/blob/1030664/WD-1-019-24-WD-7-060-24-pdf.pdf"
    accessed: "2026-05-20"
    publisher: "Deutscher Bundestag"
    confidence: high
verification_notes: "GlüStV 2021 § 3 Abs. 1: 'entgeltliche Gewinnchance + Zufall überwiegend' = Glücksspiel. h.M.: Lootboxen ohne Cash-Out kein Vermögensvorteil iSd § 3. NL-Berufungsgericht 2022 + AT-OGH 18.12.2025 entwarnten FIFA-FUT-Packs. Reform-Druck in DE besteht."
status: open
owner_suggested: legal+product
effort: M
created: 2026-05-20
updated: 2026-05-20
```

**Hypothese.** Lootboxen in DE aktuell nicht ausdrücklich erfasst (h.M.: kein Vermögensvorteil ohne Cash-Out). Aber politischer Reformdruck + USK-18-Risiko + JMStV.

**Mitigation.** **MVP: keine Lootboxen/Packs/Gacha.** Post-MVP: Battle-Pass (deterministisch), Cosmetic-Direktkäufe, Premium-Subscription. Falls je Pack-Mechanik: (a) Probability-Disclosure direkt vor Kauf, (b) Hard-Spend-Cap pro Monat, (c) kein Trading + kein Cash-Out, (d) USK-Reassessment, (e) Altersgate 18. Jährliches Tracking DLA-Piper-/Bird&Bird-Newsletter.

**Verifikation.** Vor jedem neuen Monetarisierungs-Feature: „Enthält Feature Zufall + Bezahlung + In/Out-Game-Value?" Wenn ≥ 2 Ja → Fachanwalt-Glücksspielrecht.

---

### PM-2026-05-20-08-F-11 — DSA-Pflichten als Hosting-Service — Notice-Mechanismus Pflicht

```yaml
id: PM-2026-05-20-08-F-11
priority: P0
domain: legal
probability: 5
impact: 3
score: 15
confidence: high
early_warning:
  - metric: "Notice-and-Action-Webform live"
    threshold: "nicht live / > 24 h Reaktionszeit"
mitigation_summary: "Art. 16-Webform Pflicht für alle Hosting-Provider; SME-Ausnahme Art. 19 entlastet von Risk-Assessment etc.; Single Point of Contact (Art. 11) im Impressum"
linked_adrs: []
linked_specs: [[[PM-2026-05-20-13-community-moderation-and-ugc]]]
linked_code: []
sources:
  - title: "DSA Regulation (EU) 2022/2065 — EUR-Lex"
    url: "https://eur-lex.europa.eu/eli/reg/2022/2065/oj"
    accessed: "2026-05-20"
    publisher: "EUR-Lex"
    confidence: high
  - title: "DSA Art. 16 — CMS DigitalLaws"
    url: "https://www.cms-digitallaws.com/en/dsa/article-16/"
    accessed: "2026-05-20"
    publisher: "CMS"
    confidence: high
  - title: "DSA Obligations for Hosting — Rickert"
    url: "https://rickert.law/en/dsa-obligations-hosting/"
    accessed: "2026-05-20"
    publisher: "Rickert Rechtsanwälte"
    confidence: high
verification_notes: "DSA voll anwendbar seit 17.02.2024. Wir = Hosting-Service (User-Saves, UGC-Clubs); wahrscheinlich auch Online-Platform (Multiplayer). Art. 16 für alle; Art. 20/22/24 entfallen bei < 50 employees + < € 10 M Umsatz (Art. 19)."
status: open
owner_suggested: legal+engineering
effort: M
created: 2026-05-20
updated: 2026-05-20
```

**Hypothese.** Wir sind unter DSA Hosting-Service (Save-Daten, UGC-Vereine), wahrscheinlich auch Online-Platform (Multiplayer-Gruppen). Art. 16 gilt unabhängig von Größe. Schwerere Pflichten (Art. 20/22/24) entfallen bei < 50 employees + < € 10 M Umsatz (Art. 19).

**Mitigation.** (1) Art. 16-Webform mit Pflichtfeldern (Notifier-Name+Email, Permalink, Begründung, Bona-fide-Erklärung); E-Mail-Auto-Confirm + Decision-E-Mail; „Statement of Reasons" an betroffenen Nutzer. (2) „Single Point of Contact" für Behörden (Art. 11) im Impressum + `/legal/contact`. (3) AGB-Moderation-Prozess + Repeat-Offender-Policy (Art. 23). (4) Bei < 50 employees: SME-Ausnahme dokumentieren, jährlich prüfen.

**Verifikation.** E2E-Test Notice-Form (quartärlich); SLA-Monitoring (Erstreaktion < 48 h, Entscheidung < 14 Tage).

---

### PM-2026-05-20-08-F-12 — AI Act Art. 50 Transparenz bei LLM-Integration

```yaml
id: PM-2026-05-20-08-F-12
priority: P3
domain: legal
probability: 2
impact: 2
score: 4
confidence: medium
early_warning:
  - metric: "LLM-basierte User-facing Features"
    threshold: "≥ 1 Feature mit user-facing AI-Interaktion"
mitigation_summary: "Bei jeder LLM-Integration Art. 50-Transparenz; UI-Disclosure 'KI-generiert'; siehe Report 11 für Provider-Stack"
linked_adrs: [[[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]]]
linked_specs: [[[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks]]]
linked_code: []
sources:
  - title: "AI Act Art. 50"
    url: "https://artificialintelligenceact.eu/article/50/"
    accessed: "2026-05-20"
    publisher: "Future of Life Institute"
    confidence: high
  - title: "AI Act Regulation (EU) 2024/1689"
    url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj"
    accessed: "2026-05-20"
    publisher: "EUR-Lex"
    confidence: high
verification_notes: "Art. 50 gilt ab 02.08.2026 (Bestand bis 02.12.2026). Penalty bis € 7,5 M / 1,5 % global turnover. MVP deterministisch → Art. 50 nicht anwendbar."
status: open
owner_suggested: legal+product
effort: S
created: 2026-05-20
updated: 2026-05-20
```

**Mitigation.** MVP bleibt deterministisch (Report 11 Decision) → Art. 50 nicht anwendbar. Bei späterer LLM-Integration: UI-Banner „Diese Inhalte wurden KI-generiert" + machine-readable Marker (C2PA-style).

**Verifikation.** AI-Feature-Gate-Checkliste vor Launch.

---

### PM-2026-05-20-08-F-13 — Withholding-Tax & Currency-Risk bei US-Payment-Pass-Through

```yaml
id: PM-2026-05-20-08-F-13
priority: P4
domain: tax
probability: 2
impact: 2
score: 4
confidence: medium
early_warning:
  - metric: "Stripe/Paddle-Auszahlungen mit US-Withholding"
    threshold: "> 0 % einbehalten (fehlendes W-8BEN-E)"
mitigation_summary: "W-8BEN-E bei Stripe für DBA D-US Art. 7 → 0 % Withholding; EUR-Auszahlungsziel; Paddle als MoR umgeht Problem"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "Stripe W-8BEN-E Guide"
    url: "https://stripe.com/resources/more/w-8-ben-tax-form"
    accessed: "2026-05-20"
    publisher: "Stripe"
    confidence: high
  - title: "IRS Form W-8BEN-E"
    url: "https://www.irs.gov/pub/irs-pdf/fw8bene.pdf"
    accessed: "2026-05-20"
    publisher: "IRS"
    confidence: high
verification_notes: "DBA D-US Art. 7 Geschäftsgewinne ohne US-Betriebsstätte → 0 % Withholding. W-8BEN-E 3 Jahre gültig."
status: open
owner_suggested: finance
effort: S
created: 2026-05-20
updated: 2026-05-20
```

**Mitigation.** W-8BEN-E bei Stripe-Onboarding (DBA → 0 %); EUR-Auszahlungs-Konto; jährliches Renewal-Reminder. Paddle als MoR (Niederlande/UK) umgeht das.

**Verifikation.** Erstes Stripe-Statement auf „withheld amounts" prüfen.

---

## Quantitatives Modell

| Kostenpunkt | Spanne |
|---|---|
| Markenrechts-Abmahnung Streitwert € 50–100 k Anwaltskosten (Gegner) | € 1.400–4.000 + eigene |
| DFL Vereinslogo-Abmahnung Streitwert | € 50–100 k pro Logo |
| DDG-§5-Impressum Bußgeld Behörde | bis € 50 k |
| DDG-§5-Impressum UWG-Abmahnung typisch | € 800–1.500 |
| OSS-Schwelle EU-Cross-Border | € 10 k/Jahr |
| Kleinunternehmer § 19 UStG (Vorjahr/laufend, seit 2025) | € 25 k / € 100 k netto |
| § 257 HGB Aufbewahrung (seit 01.01.2025) | 8 Jahre Belege / 10 Jahre Jahresabschlüsse |
| AI Act Art. 50 Penalty | bis € 7,5 M oder 1,5 % global turnover |
| FIFPro-Lizenz (Indie unrealistisch) | ~$ 1 M (legacy quote) |
| DSA SME-Schwelle Art. 19 | < 50 employees + < € 10 M turnover |
| Cyber-Versicherung € 100 k Deckung | € 500–2.000/Jahr |
| FTO-Recherche durch DE-Markenanwältin | € 500–1.500 |
| DPMA-Markenanmeldung Grundgebühr (3 Klassen) | € 290 + € 200 beschleunigt |
| EUIPO-Anmeldung 1. Klasse | € 850 + € 50/€ 150 weitere |

## SLO-/Compliance-Vorschläge

- DSA-Art-16-Notice: Erstreaktion < 24 h, Entscheidung < 14 Tage, Statement of Reasons als Mail.
- § 5 DDG-Impressum: halbjährliches Audit; bei Rechtsform-Änderung < 72 h Update.
- AGB-Legal-Review: jährlich + bei substantiellen Produkt-Änderungen.
- OSS-Threshold-Monitoring: Dashboard YTD-Cross-Border-Revenue, Alert bei 80 %.
- Markenrechts-FTO: vor jedem Public-Branding-Move (Name, Logo, Slogan).
- UGC-Moderation: 100 % BL+UEFA-Top-100-Klubnamen blocken; 99 % Detection-Rate Wappen via pHash; < 48 h Notice-Reaktion.
- Update-Verpflichtung § 327f BGB: Lifecycle-Statement, Sicherheits-Patch-SLA < 30 Tage nach disclosed CVE.

## Audit-Plan

| Frequenz | Audit | Owner |
|---|---|---|
| jährlich | AGB-Review durch Fachanwalt IT-Recht | legal |
| jährlich | Markenrechts-Monitoring (DPMA + EUIPO) | legal |
| jährlich | DSA-SME-Status-Bestätigung | finance |
| halbjährlich | Impressum-Check § 5 DDG | legal |
| quartärlich | OSS-Meldung BZSt | finance |
| quartärlich | UGC-Moderation-Sample (100 Random-Clubs vs Block-List) | product+engineering |
| quartärlich | Notice-Response-SLO | engineering |
| ad-hoc | Glücksspielrecht-Check vor Monetarisierungs-Feature | legal |
| ad-hoc | AI-Act-Art-50-Implementierung vor LLM-Feature | legal+engineering |

## Runbook-Skizzen

### RB-08-1 Abmahnung Marken/Wettbewerb/UWG
1. **Tag 0**: Mahnung lesen, Anlagen + UE-Vorschlag scannen, **nichts unterschreiben**.
2. **Tag 0–1**: Fristen kalkulieren (typ. 7–10 Tage), Mailbox/Logs konservieren.
3. **Tag 1–2**: Fachanwalt Markenrecht/IT-Recht (DE) kontaktieren, Erstberatung (€ 100–250).
4. **Tag 2–5**: Entscheiden: (a) modifizierte UE, (b) Inhalt entfernen/ändern, (c) Verteidigung.
5. **Tag 5–7**: Modifizierte UE + technische Umsetzung + Kostentragung verhandeln.
6. Lessons-Learned in `docs/60-Research/legal-incidents.md`.

### RB-08-2 DSAR / Right-to-be-Forgotten vs steuerliche Aufbewahrung
1. DSAR triagieren; auf Art. 17 markieren.
2. Konflikt: § 257 HGB / § 147 AO 8–10 Jahre — **Vorrang vor Art. 17 GDPR** via Art. 17(3)(b).
3. Rechnungsdaten in separate `finance_records`-Tabelle; PII-Felder pseudonymisieren ("ANONYMIZED"), Steuer-relevante Felder bleiben.
4. Brief-Template an Anfragenden: Pseudonymisierung-Erklärung.
5. Audit-Log + Ablaufdatum tracken; finale Löschung im monatlichen Cleanup-Job.

### RB-08-3 Trademark Cease-and-Desist SEGA/SI für „football-manager-x"
1. **Day 0**: C&D lesen, Anwalt SEGA/SI identifizieren (vermutlich UK-Kanzlei wie Bird&Bird, Browne Jacobson), Notice quittieren ohne inhaltliche Stellungnahme.
2. **Day 0–2**: Eigener Fachanwalt IT-Recht; FTO-Risiko = hoch; Re-Branding-Optionen aus Report 14 vorbereiten.
3. **Day 2–7**: Übergangsfrist verhandeln (typ. 30–90 Tage Sunset); Token-Inventur (Domain, App-Store, Social-Handles, GitHub-Repo).
4. **Day 7–60**: Rebrand-Execution: neue Domain, DPMA-Anmeldung, App-Store-Update, Social-Migration, alte Domain 301, Repo-Rename.
5. **Post-Sunset**: Letter of Compliance an SEGA-Anwalt; Kostentragung verhandeln (typ. 30–50 % Settlement).

## Offene Fragen

1. **Branding-Strategie**: Working-Title bleibt intern, Re-Brand vor Public-Beta? **Empfehlung**: Re-Brand bis Q3 2026, FTO sofort.
2. **Lootbox-Stance**: Hard-Constraint im ADR? **Empfehlung**: explizites „no lootboxes / no gacha — battle-pass + cosmetics only" in zukünftigem Monetisierungs-ADR.
3. **MoR-Auswahl**: Stripe vs Paddle? **Empfehlung**: Paddle für MVP wegen Compliance-Vereinfachung; Migration zu Stripe Tax bei Skalierung möglich.
4. **UGC-Lizenz-Klausel**: Minimal-Lizenz + Indemnification + Verzicht auf kommerzielle Sub-Lizenz.
5. **Schlichtungsstelle**: Universalschlichtungsstelle Bund — § 36 VSBG „nicht bereit" ablehnen bis Umsatz/Beschwerden Schlichtung notwendig machen.

## „Wenn wir nur 3 Dinge tun"-Liste

1. **Re-Branding + Marken-FTO vor Public-Launch (F-05)**: Score 20. Fachanwalt-FTO € 500–1.500 + neuer Name vor App-Store/Marketing/Press. ROI: vermiedener € 100 k-Streitwert.
2. **DSA-Art-16-Notice-and-Action + UGC-Vereinsname-Blocklist (F-06, F-11)**: Pflicht aus DSA + Schutzschild gegen DFL/Vereins-/UEFA-Claims. ~5 PT Einmal-Engineering. Adressiert Score 20+15 in einem Bundle.
3. **AGB + Impressum + Widerrufs-Sequenz durch DE-Fachanwalt (F-02, F-03, F-04)**: € 1–3 k einmalig. Macht B2C-Compliance-Fundament abmahnfest.

## Verfolgung & Verkettung

IDs `PM-2026-05-20-08-F-NN`. Aggregat-Status: [[findings-registry]].

## Related

- [[00-index]] · [[findings-registry]] · [[threat-model]]
- [[PM-2026-05-20-04-monetization]] · [[PM-2026-05-20-13-community-moderation-and-ugc]] · [[PM-2026-05-20-14-brand-pr-and-crisis-comms]] · [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability]] · [[PM-2026-05-20-18-responsible-gaming-and-open-source]]
- [[../gdpr-compliance]] · [[../ip-and-licensing]]
- [[../../30-Implementation/privacy-and-consent]]
- [[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]]
