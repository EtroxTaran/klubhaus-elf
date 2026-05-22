---
title: "Pre-Mortem 2026-05-20 Â· 08 Â· Legal, Consumer-Law & Tax"
status: current
tags: [research, pre-mortem, legal, consumer-law, tax, trademark, dsa, agb, 2026-Q2]
created: 2026-05-20
updated: 2026-05-22
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

# Pre-Mortem 2026-05-20 Â· 08 Â· Legal, Consumer-Law & Tax (beyond DSGVO)

> **Failure-Headline-Kandidaten**
> - â€žSEGA/Sports-Interactive-Abmahnung wegen 'football-manager-x' â€” Streitwert 75 k â‚¬, Anwaltskosten + UnterlassungserklÃ¤rung."
> - â€žDFL-Anwaltsschreiben wegen 4.218 UGC-Saves mit 'FC Bayern MÃ¼nchen' + Wappen-Upload â€” 12 k â‚¬ + erzwungene Reverse-Image-Lookup-Pipeline."
> - â€žCosmetics-Pack-Launch ohne Probability-Disclosure â†’ einstweilige VerfÃ¼gung Verbraucherschutzverein."
> - â€žOSS-Schwelle 10 k â‚¬ in Q3 verpasst â†’ Nachforderung MwSt in 7 EU-LÃ¤ndern, SchÃ¤tzbescheid 18 k â‚¬."
> - â€žFehlerhaftes Impressum (TMG-Reste) â†’ Wettbewerbsabmahnung 1.500 â‚¬, bei Wiederholung bis 50 k â‚¬ BuÃŸgeld."

## Scope

Baut auf gelocktem [[../gdpr-compliance]] auf und erweitert um EU-Verbraucherschutz, AGB-Kontrolle, Impressum, Markenrecht, UGC-IP-Risiken, FIFPro/DFL-Player-Likeness, EU-OSS-Steuern (post-VAT-MOSS), DAC7, GlÃ¼cksspielrecht, DSA, AI-Act-Art-50, Withholding-Tax. **DSGVO nicht duplizieren** â€” Referenz.

## Top Failure-Hypothesen

---

### PM-2026-05-20-08-F-01 â€” Update-Verpflichtung Â§ 327f BGB fÃ¼r Live-Service-PWA unklarer Dauer

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
mitigation_summary: "Update-Policy publizieren (24 Mo. Sicherheits+Funktions, danach Sicherheits bis Service-EOL mit 6-Monats-VorankÃ¼ndigung)"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "Â§ 327f BGB Aktualisierungen"
    url: "https://www.gesetze-im-internet.de/bgb/__327f.html"
    accessed: "2026-05-20"
    publisher: "BMJ"
    confidence: high
  - title: "Update-Pflicht â€” Haerting RechtsanwÃ¤lte"
    url: "https://haerting.de/wissen/update-pflicht-und-mehr/"
    accessed: "2026-05-20"
    publisher: "Haerting"
    confidence: high
verification_notes: "Â§ 327f Satz 2 BGB: 'Zeitraum, den der Verbraucher erwarten kann' â€” Auslegungsfrage. Kostenloses MVP = kÃ¼rzere Erwartung, Premium = lÃ¤ngere."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: legal+product
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Â§ 327f verpflichtet zur Bereitstellung erforderlicher Aktualisierungen einschlieÃŸlich Sicherheitsupdates wÃ¤hrend des gesamten Bereitstellungszeitraums. Bei Live-Service ohne klares EOL ist das praktisch unbegrenzt. Service-Einstellung ohne VorankÃ¼ndigung = Â§ 327r-Streit + MÃ¤ngelansprÃ¼che.

**Mitigation.** AGB-Klausel: â€žSicherheitsupdates wÃ¤hrend gesamter Bereitstellungsdauer kostenlos. Funktionsaktualisierungen via Roadmap. Service-EOL mit 6 Monaten VorankÃ¼ndigung; ab AnkÃ¼ndigung nur Sicherheitsupdates bis Abschalt-Datum." Impressum/FAQ Service-Lifecycle dokumentieren. Premium-Tier mit explizitem Mindest-Support-Zeitraum.

**Verifikation.** JÃ¤hrliches Legal-Review; Lifecycle-Dashboard â€žletztes Sicherheitsupdate je Layer".

---

### PM-2026-05-20-08-F-02 â€” Widerrufsrecht digitale Inhalte nicht korrekt zum ErlÃ¶schen gebracht

```yaml
id: PM-2026-05-20-08-F-02
priority: P3
domain: legal
probability: 5
impact: 2
score: 10
confidence: high
early_warning:
  - metric: "Anteil KÃ¤ufe mit dokumentiertem Verzicht-Checkbox"
    threshold: "< 99 %"
mitigation_summary: "Doppel-Checkbox vor Zahlung + Â§ 312f-BestÃ¤tigungsmail mit dauerhaftem DatentrÃ¤ger"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "Widerrufsbelehrungen digitale Inhalte â€” Heuking"
    url: "https://www.heuking.de/de/news-events/newsletter-fachbeitraege/artikel/vorsicht-bei-widerrufsbelehrungen-bei-digitalen-inhalten-und-dienstleistungen.html"
    accessed: "2026-05-20"
    publisher: "Heuking KÃ¼hn LÃ¼er Wojtek"
    confidence: high
  - title: "Â§ 356 BGB"
    url: "https://www.gesetze-im-internet.de/bgb/__356.html"
    accessed: "2026-05-20"
    publisher: "BMJ"
    confidence: high
verification_notes: "F2P-MVP nicht akut; kritisch ab erstem Verkauf. Â§ 356 Abs. 5 BGB fÃ¼r digitale Inhalte erfordert exakte Verzichts-Sequenz."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: product+legal
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Bei Premium/Cosmetic-Kauf ohne korrekte Verzichts-Sequenz: 14 Tage vollstÃ¤ndig erstattbare KÃ¤ufe â†’ Cashflow-Risiko + Missbrauchsvektor.

**Mitigation.** Checkout-UX mit **zwei separaten Checkboxen** (keine Vorauswahl): (1) â€žIch verlange ausdrÃ¼cklich, dass Sie vor Ablauf der 14-tÃ¤gigen Widerrufsfrist mit der VertragsausfÃ¼hrung beginnen." (2) â€žMir ist bekannt, dass ich mit dem Beginn der VertragsausfÃ¼hrung mein Widerrufsrecht verliere." Nach Kauf E-Mail mit BestÃ¤tigung iSd Â§ 312f BGB. Audit-Trail: persistiere Checkbox-Klicks mit Timestamp im Outbox.

**Verifikation.** Monatlicher Testkauf; Stripe/Paddle-Webhook-Audit korreliert jede Charge mit `withdrawal_waiver_accepted_at` und `confirmation_email_sent_at`.

---

### PM-2026-05-20-08-F-03 â€” AGB-Kontrolle Â§Â§ 305 ff. BGB â€” typische unwirksame Haftungsklauseln

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
mitigation_summary: "AGB durch DE-Fachanwalt IT-Recht prÃ¼fen; pauschale HaftungsausschlÃ¼sse vermeiden; Transparenzgebot Â§ 307 I 2 BGB"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "Â§ 305 BGB"
    url: "https://www.gesetze-im-internet.de/bgb/__305.html"
    accessed: "2026-05-20"
    publisher: "BMJ"
    confidence: high
verification_notes: "Â§ 309 Nr. 7 BGB: pauschaler Haftungsausschluss fÃ¼r Leben/KÃ¶rper/Gesundheit nichtig. US-EULAs ('AS IS, no warranties') in DE-B2C reihenweise unwirksam."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: legal
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** US-Indie-EULAs enthalten Klauseln, die in DE-B2C-AGB-Kontrolle nichtig sind: â€žAS IS, no warranties" (Â§ 309 Nr. 7 + Â§Â§ 327d-i), KÃ¼ndigung â€žat sole discretion" (Â§ 307), â€žarbitration in California" (Rom-I-VO Art. 6 unwirksam). Verbraucherzentrale-Abmahnung 200â€“1.500 â‚¬ pro Verstoss.

**Mitigation.** AGB von Anfang an mit DE-Fachanwalt (â‚¬ 1â€“3 k einmalig); Transparenzgebot; Haftung nur â€žVorsatz/grobe FahrlÃ¤ssigkeit" ausschliessen, niemals Leben/KÃ¶rper; symmetrische KÃ¼ndigung; DE-Recht + Verbraucher-Wohnsitz-Gerichtsstand; keine TMG-Verweise (DDG-Update!); kein OS-Plattform-Link (abgeschaltet 20.07.2025).

**Verifikation.** JÃ¤hrliches Legal-Review; Verbraucherzentrale-Hinweise abgleichen.

---

### PM-2026-05-20-08-F-04 â€” Impressumspflicht Â§ 5 DDG: TMG-Reste, fehlende Pflichtangaben

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
mitigation_summary: "Footer-Impressum max 2 Klicks erreichbar; alle DDG Â§ 5-Pflichtangaben; VSBG-ErklÃ¤rung 'nicht teilnahmebereit' explizit; OS-Plattform-Link entfernt"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "Â§ 5 DDG"
    url: "https://www.gesetze-im-internet.de/ddg/__5.html"
    accessed: "2026-05-20"
    publisher: "BMJ"
    confidence: high
  - title: "DDG Enforcement â€” Taylor Wessing"
    url: "https://www.taylorwessing.com/en/insights-and-events/insights/2024/05/ddg"
    accessed: "2026-05-20"
    publisher: "Taylor Wessing"
    confidence: high
verification_notes: "Â§ 33 DDG BuÃŸgeld bis 50 k â‚¬. In Praxis Wettbewerbs-Abmahnungen, Streitwerte 5â€“15 k â‚¬, Anwaltskosten 800â€“1.500 â‚¬."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: legal
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** DDG seit 14.05.2024 ersetzt TMG. HÃ¤ufige Fehler: alter Â§ 5 TMG-Verweis, fehlende USt-IdNr., kein Vertretungsberechtigter, OS-Plattform-Link nicht entfernt (abgeschaltet 20.07.2025).

**Mitigation.** Pflichtfelder: Name/Anschrift, Rechtsform + Vertretungsberechtigter, E-Mail + Telefon, HRB, USt-IdNr., VSBG-ErklÃ¤rung â€žnicht teilnahmebereit". Â§ 5 DDG zitieren, nicht Â§ 5 TMG.

**Verifikation.** HalbjÃ¤hrlicher HTML-Check auf Footer-Impressum + Pflichtfelder.

---

### PM-2026-05-20-08-F-05 â€” Marken-Kollision â€žfootball-manager-x" mit Sports Interactive/SEGA

```yaml
id: PM-2026-05-20-08-F-05
priority: P0
domain: legal
probability: 4
impact: 5
score: 20
confidence: high
early_warning:
  - signal: "Domain-Indexing, Repo-Public-Sichtbarkeit, erste externe ErwÃ¤hnung"
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
  - title: "DPMA GebÃ¼hren"
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
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder+legal
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** â€žfootball-manager-x" enthÃ¤lt identische Wortkombination einer EU/DE-Marke in Nice 9 (Computer-Software) + 41 (Spiele) â€” exakt unsere Klassen. Abmahnschreiben Ã¼ber UK-/DE-GroÃŸkanzlei (Bird&Bird, Hogan Lovells, Taylor Wessing) ist Frage von Wochen sobald Public. Streitwert 50â€“100 k â‚¬, Abmahnkosten 1.400â€“2.500 â‚¬ + eigene, plus Zwangs-Rename unter Zeitdruck mit Verlust aller Brand-Assets.

**Mitigation.** **Sofortiger Rebrand vor jedem Public-Asset**. FTO-Recherche durch DE-MarkenanwÃ¤ltin auf 2â€“3 Top-Kandidaten (Heimrunde/KlubkÃ¶nig/Formationfuchs aus Report 14). DPMA-Anmeldung (â‚¬ 290 + ggf. â‚¬ 200 beschleunigt), EUIPO spÃ¤ter (â‚¬ 850). Defensive Domain-Sicherung 3 Finalisten Ã— 4 TLDs (~â‚¬ 360/Jahr).

**Verifikation.** FTO-Memo dokumentiert. Marken-Anmeldung als Gate-Bedingung fÃ¼r Marketing. CI-Lint: Repo-Rename vollstÃ¤ndig (`grep -ri "football-manager-x"` = 0 auÃŸer CHANGELOG).

---

### PM-2026-05-20-08-F-06 â€” UGC-Marken: Spieler benennt Klubs â€žBayern MÃ¼nchen", lÃ¤dt Wappen hoch

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
    publisher: "LHR RechtsanwÃ¤lte"
    confidence: high
verification_notes: "Host-Privileg Art. 6 DSA / Â§ 10 DDG: nur ohne Kenntnis. Ohne Notice-and-Action-Mechanismus geht Privileg verloren. Streitwert 50â€“100 k â‚¬ pro Logo."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: legal+product+engineering
effort: L
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Trotz ADR-0007 (IP-clean) werden Nutzer Custom-Vereine â€žFC Bayern MÃ¼nchen" mit Original-Wappen anlegen. Plattform haftet ab Kenntnis. Ohne Art. 16 DSA-Mechanismus verlieren wir Privileg.

**Mitigation.** (1) Art. 16 DSA-konformer Webform + 48 h-SLA. (2) Hardcoded Block-List 36 BL + 36 2.BL + UEFA-Top-100 + DFB-Pokal-Drittligisten; Eingabevalidierung. (3) Logo-Upload: Disclaimer-Checkbox + perceptual-hash-Vergleich (pHash) in Moderation-Pipeline; Auto-QuarantÃ¤ne. (4) AGB: User-Indemnification-Clause. (5) Repeat-Offender-Policy Art. 23 DSA.

**Verifikation.** QuartÃ¤rlicher Audit: 100 Random-Clubs, Trefferquote echter Namen tracken. Notice-Postfach-SLA-Monitoring. VollstÃ¤ndige Implementierung in [[PM-2026-05-20-13-community-moderation-and-ugc]].

---

### PM-2026-05-20-08-F-07 â€” FIFPro/Player-Likeness â€” ADR-0007 schlieÃŸt nicht alle Risiken aus

```yaml
id: PM-2026-05-20-08-F-07
priority: P3
domain: legal
probability: 2
impact: 4
score: 8
confidence: medium
early_warning:
  - metric: "Procedural-namegen-Output enthÃ¤lt real-existierende Spielernamen"
    threshold: "> 0 Treffer in 10k Generationen gegen FIFPro-Liste"
mitigation_summary: "Procedural-Namegen mit FIFPro-Top-3000 als Negativliste; UGC-Bloom-Filter; AGB-Indemnification"
linked_adrs: [[[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]]]
linked_specs: []
linked_code: []
sources:
  - title: "Foul play? IbrahimoviÄ‡ digital likeness â€” Freshfields"
    url: "https://technologyquotient.freshfields.com/post/102gpgj/foul-play-ibrahimovic-and-the-role-of-digital-likeness-in-sports-video-games"
    accessed: "2026-05-20"
    publisher: "Freshfields Bruckhaus Deringer"
    confidence: high
verification_notes: "DE: Â§ 12 BGB PersÃ¶nlichkeitsrecht + Â§ 22 KUG. Reine Namen ohne Bild nicht per se geschÃ¼tzt, aber Prominente + kommerziell + Verwechslung â†’ Â§ 12 BGB greift."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: legal+engineering
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Namegen-Pipeline kÃ¶nnte zufÃ¤llig â€žRobert Lewandowski" oder â€žJude Bellingham" erzeugen â€” Â§ 12-BGB-Risiko. UGC-Spielernamen mit Profinamen verlagern Haftung primÃ¤r auf Nutzer, aber Plattform muss notice-fÃ¤hig sein.

**Mitigation.** Stoppliste FIFPro-Top-3000 + DFB-BL-Kader + UEFA-Top-Player aus Wikidata-Query. Bei Generations-Hit Re-Sampling. UGC-Eingabe gegen Stoppliste mit Soft-Warning. AGB-Indemnification. Notice via Art. 16 DSA.

**Verifikation.** QuartÃ¤rlich: 10 k Procedural-Generationen gegen FIFPro-Liste matchen; Trefferquote < 0,01 %.

---

### PM-2026-05-20-08-F-08 â€” OSS-Schwellenwert 10.000 â‚¬ EU-Cross-Border ab Premium-Launch

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
    threshold: "> 7.000 â‚¬ (80 % Warnschwelle)"
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
  - title: "OSS-Verfahren â€” DATEV"
    url: "https://www.datev.de/web/de/aktuelles/gesetzliche-themen/one-stop-verfahren-oss/"
    accessed: "2026-05-20"
    publisher: "DATEV"
    confidence: high
  - title: "Stripe EU VAT & OSS Guide"
    url: "https://stripe.com/guides/introduction-to-eu-vat-and-european-vat-oss"
    accessed: "2026-05-20"
    publisher: "Stripe"
    confidence: medium
verification_notes: "10 k â‚¬/Jahr EU-Schwelle seit 01.07.2021 fÃ¼r elektronische B2C-Dienstleistungen. OSS via BZSt-BOP = quartÃ¤rlicher Single-Filing."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: finance+legal
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Bei 10 k Spielern + 2â€“5 % Premium-Conversion Ã— â‚¬ 5/Mo = â‚¬ 1â€“2,5 k/Monat â†’ schnelle Ãœberschreitung der 10 k â‚¬-Schwelle. Bei Verpassung: Nachforderungen pro EU-Land.

**Mitigation.** Stripe/Paddle-Konfig mit EmpfÃ¤nger-VAT-Berechnung. **Paddle als MoR** (5 %+â‚¬ 0,50): operativ einfachste LÃ¶sung. OSS-Registrierung BZSt bei Premium-Launch (nicht erst nach Schwellen-Ãœberschreitung). Kleinunternehmer-Schwellen Â§ 19 UStG: 25 k â‚¬ Vorjahr / 100 k â‚¬ laufend. Steuerberater ab â‚¬ 5 k laufendem Bruttoumsatz.

**Verifikation.** Monatlich Cross-Border-Revenue-Dashboard; OSS-Quartalsmeldung kalendarisch geblockt.

---

### PM-2026-05-20-08-F-09 â€” DAC7 wahrscheinlich nicht anwendbar, bei UGC-Marketplace zu prÃ¼fen

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
    threshold: "â‰¥ 1 Feature aktiv"
mitigation_summary: "Aktuell nicht DAC7-pflichtig (kein Marketplace). Re-Assessment vor jedem UGC-Marketplace-Feature."
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "DAC7 â€” EU Commission"
    url: "https://taxation-customs.ec.europa.eu/taxation/tax-transparency-cooperation/administrative-co-operation-and-mutual-assistance/dac7_en"
    accessed: "2026-05-20"
    publisher: "European Commission"
    confidence: high
  - title: "DAC7 â€” BZSt"
    url: "https://www.bzst.de/EN/Businesses/DPI_DAC7/Procedure/procedure_node.html"
    accessed: "2026-05-20"
    publisher: "BZSt"
    confidence: high
verification_notes: "DAC7 erfasst Plattform-Betreiber, die VerkÃ¤ufer mit KÃ¤ufern verbinden. B2C-SaaS direkt an Endkunden nicht erfasst. PStTG-Umsetzung: BuÃŸgeld bis 50 k â‚¬."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: legal+finance
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Vor jedem Save-Marketplace/Trading-Feature Mini-Assessment. Bei Marketplace-Trigger: KYC-Pflicht (TIN, Steuernummer) + jÃ¤hrliche BZSt-Meldung bis 31.01. Penalty bis â‚¬ 50 k.

---

### PM-2026-05-20-08-F-10 â€” Lootboxen / Pack-Mechaniken â€” GlÃ¼cksspielrecht-Trigger

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
    threshold: "â‰¥ 1 Pack/Lootbox/Gacha im Backlog"
mitigation_summary: "Lootboxen im MVP ausgeschlossen; alternative Monetarisierung (Battle-Pass, kosmetische DirektkÃ¤ufe, Subscription); bei spÃ¤terer Pack-Mechanik: probability disclosures + Altersgate 18 + Spend-Caps + kein Cash-Out"
linked_adrs: []
linked_specs: [[[PM-2026-05-20-18-responsible-gaming-and-open-source]]]
linked_code: []
sources:
  - title: "Loot boxes in German gambling law"
    url: "https://www.ferner-alsdorf.com/loot-boxes-in-german-gambling-law/"
    accessed: "2026-05-20"
    publisher: "Ferner Alsdorf"
    confidence: high
  - title: "AT-OGH FIFA-Lootboxes-Urteil 12/2025 â€” DLA Piper"
    url: "https://www.dlapiper.com/en/insights/publications/2026/01/supreme-court-shifts-the-playing-field-lootboxes-fall-outside-the-austrian-gambling-act"
    accessed: "2026-05-20"
    publisher: "DLA Piper"
    confidence: high
  - title: "Bundestag WD Loot-Boxen-Bericht"
    url: "https://www.bundestag.de/resource/blob/1030664/WD-1-019-24-WD-7-060-24-pdf.pdf"
    accessed: "2026-05-20"
    publisher: "Deutscher Bundestag"
    confidence: high
verification_notes: "GlÃ¼StV 2021 Â§ 3 Abs. 1: 'entgeltliche Gewinnchance + Zufall Ã¼berwiegend' = GlÃ¼cksspiel. h.M.: Lootboxen ohne Cash-Out kein VermÃ¶gensvorteil iSd Â§ 3. NL-Berufungsgericht 2022 + AT-OGH 18.12.2025 entwarnten FIFA-FUT-Packs. Reform-Druck in DE besteht."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: legal+product
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Lootboxen in DE aktuell nicht ausdrÃ¼cklich erfasst (h.M.: kein VermÃ¶gensvorteil ohne Cash-Out). Aber politischer Reformdruck + USK-18-Risiko + JMStV.

**Mitigation.** **MVP: keine Lootboxen/Packs/Gacha.** Post-MVP: Battle-Pass (deterministisch), Cosmetic-DirektkÃ¤ufe, Premium-Subscription. Falls je Pack-Mechanik: (a) Probability-Disclosure direkt vor Kauf, (b) Hard-Spend-Cap pro Monat, (c) kein Trading + kein Cash-Out, (d) USK-Reassessment, (e) Altersgate 18. JÃ¤hrliches Tracking DLA-Piper-/Bird&Bird-Newsletter.

**Verifikation.** Vor jedem neuen Monetarisierungs-Feature: â€žEnthÃ¤lt Feature Zufall + Bezahlung + In/Out-Game-Value?" Wenn â‰¥ 2 Ja â†’ Fachanwalt-GlÃ¼cksspielrecht.

---

### PM-2026-05-20-08-F-11 â€” DSA-Pflichten als Hosting-Service â€” Notice-Mechanismus Pflicht

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
mitigation_summary: "Art. 16-Webform Pflicht fÃ¼r alle Hosting-Provider; SME-Ausnahme Art. 19 entlastet von Risk-Assessment etc.; Single Point of Contact (Art. 11) im Impressum"
linked_adrs: []
linked_specs: [[[PM-2026-05-20-13-community-moderation-and-ugc]]]
linked_code: []
sources:
  - title: "DSA Regulation (EU) 2022/2065 â€” EUR-Lex"
    url: "https://eur-lex.europa.eu/eli/reg/2022/2065/oj"
    accessed: "2026-05-20"
    publisher: "EUR-Lex"
    confidence: high
  - title: "DSA Art. 16 â€” CMS DigitalLaws"
    url: "https://www.cms-digitallaws.com/en/dsa/article-16/"
    accessed: "2026-05-20"
    publisher: "CMS"
    confidence: high
  - title: "DSA Obligations for Hosting â€” Rickert"
    url: "https://rickert.law/en/dsa-obligations-hosting/"
    accessed: "2026-05-20"
    publisher: "Rickert RechtsanwÃ¤lte"
    confidence: high
verification_notes: "DSA voll anwendbar seit 17.02.2024. Wir = Hosting-Service (User-Saves, UGC-Clubs); wahrscheinlich auch Online-Platform (Multiplayer). Art. 16 fÃ¼r alle; Art. 20/22/24 entfallen bei < 50 employees + < â‚¬ 10 M Umsatz (Art. 19)."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: legal+engineering
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Wir sind unter DSA Hosting-Service (Save-Daten, UGC-Vereine), wahrscheinlich auch Online-Platform (Multiplayer-Gruppen). Art. 16 gilt unabhÃ¤ngig von GrÃ¶ÃŸe. Schwerere Pflichten (Art. 20/22/24) entfallen bei < 50 employees + < â‚¬ 10 M Umsatz (Art. 19).

**Mitigation.** (1) Art. 16-Webform mit Pflichtfeldern (Notifier-Name+Email, Permalink, BegrÃ¼ndung, Bona-fide-ErklÃ¤rung); E-Mail-Auto-Confirm + Decision-E-Mail; â€žStatement of Reasons" an betroffenen Nutzer. (2) â€žSingle Point of Contact" fÃ¼r BehÃ¶rden (Art. 11) im Impressum + `/legal/contact`. (3) AGB-Moderation-Prozess + Repeat-Offender-Policy (Art. 23). (4) Bei < 50 employees: SME-Ausnahme dokumentieren, jÃ¤hrlich prÃ¼fen.

**Verifikation.** E2E-Test Notice-Form (quartÃ¤rlich); SLA-Monitoring (Erstreaktion < 48 h, Entscheidung < 14 Tage).

---

### PM-2026-05-20-08-F-12 â€” AI Act Art. 50 Transparenz bei LLM-Integration

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
    threshold: "â‰¥ 1 Feature mit user-facing AI-Interaktion"
mitigation_summary: "Bei jeder LLM-Integration Art. 50-Transparenz; UI-Disclosure 'KI-generiert'; siehe Report 11 fÃ¼r Provider-Stack"
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
verification_notes: "Art. 50 gilt ab 02.08.2026 (Bestand bis 02.12.2026). Penalty bis â‚¬ 7,5 M / 1,5 % global turnover. MVP deterministisch â†’ Art. 50 nicht anwendbar."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: legal+product
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** MVP bleibt deterministisch (Report 11 Decision) â†’ Art. 50 nicht anwendbar. Bei spÃ¤terer LLM-Integration: UI-Banner â€žDiese Inhalte wurden KI-generiert" + machine-readable Marker (C2PA-style).

**Verifikation.** AI-Feature-Gate-Checkliste vor Launch.

---

### PM-2026-05-20-08-F-13 â€” Withholding-Tax & Currency-Risk bei US-Payment-Pass-Through

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
mitigation_summary: "W-8BEN-E bei Stripe fÃ¼r DBA D-US Art. 7 â†’ 0 % Withholding; EUR-Auszahlungsziel; Paddle als MoR umgeht Problem"
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
verification_notes: "DBA D-US Art. 7 GeschÃ¤ftsgewinne ohne US-BetriebsstÃ¤tte â†’ 0 % Withholding. W-8BEN-E 3 Jahre gÃ¼ltig."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: finance
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** W-8BEN-E bei Stripe-Onboarding (DBA â†’ 0 %); EUR-Auszahlungs-Konto; jÃ¤hrliches Renewal-Reminder. Paddle als MoR (Niederlande/UK) umgeht das.

**Verifikation.** Erstes Stripe-Statement auf â€žwithheld amounts" prÃ¼fen.

---

## Quantitatives Modell

| Kostenpunkt | Spanne |
|---|---|
| Markenrechts-Abmahnung Streitwert â‚¬ 50â€“100 k Anwaltskosten (Gegner) | â‚¬ 1.400â€“4.000 + eigene |
| DFL Vereinslogo-Abmahnung Streitwert | â‚¬ 50â€“100 k pro Logo |
| DDG-Â§5-Impressum BuÃŸgeld BehÃ¶rde | bis â‚¬ 50 k |
| DDG-Â§5-Impressum UWG-Abmahnung typisch | â‚¬ 800â€“1.500 |
| OSS-Schwelle EU-Cross-Border | â‚¬ 10 k/Jahr |
| Kleinunternehmer Â§ 19 UStG (Vorjahr/laufend, seit 2025) | â‚¬ 25 k / â‚¬ 100 k netto |
| Â§ 257 HGB Aufbewahrung (seit 01.01.2025) | 8 Jahre Belege / 10 Jahre JahresabschlÃ¼sse |
| AI Act Art. 50 Penalty | bis â‚¬ 7,5 M oder 1,5 % global turnover |
| FIFPro-Lizenz (Indie unrealistisch) | ~$ 1 M (legacy quote) |
| DSA SME-Schwelle Art. 19 | < 50 employees + < â‚¬ 10 M turnover |
| Cyber-Versicherung â‚¬ 100 k Deckung | â‚¬ 500â€“2.000/Jahr |
| FTO-Recherche durch DE-MarkenanwÃ¤ltin | â‚¬ 500â€“1.500 |
| DPMA-Markenanmeldung GrundgebÃ¼hr (3 Klassen) | â‚¬ 290 + â‚¬ 200 beschleunigt |
| EUIPO-Anmeldung 1. Klasse | â‚¬ 850 + â‚¬ 50/â‚¬ 150 weitere |

## SLO-/Compliance-VorschlÃ¤ge

- DSA-Art-16-Notice: Erstreaktion < 24 h, Entscheidung < 14 Tage, Statement of Reasons als Mail.
- Â§ 5 DDG-Impressum: halbjÃ¤hrliches Audit; bei Rechtsform-Ã„nderung < 72 h Update.
- AGB-Legal-Review: jÃ¤hrlich + bei substantiellen Produkt-Ã„nderungen.
- OSS-Threshold-Monitoring: Dashboard YTD-Cross-Border-Revenue, Alert bei 80 %.
- Markenrechts-FTO: vor jedem Public-Branding-Move (Name, Logo, Slogan).
- UGC-Moderation: 100 % BL+UEFA-Top-100-Klubnamen blocken; 99 % Detection-Rate Wappen via pHash; < 48 h Notice-Reaktion.
- Update-Verpflichtung Â§ 327f BGB: Lifecycle-Statement, Sicherheits-Patch-SLA < 30 Tage nach disclosed CVE.

## Audit-Plan

| Frequenz | Audit | Owner |
|---|---|---|
| jÃ¤hrlich | AGB-Review durch Fachanwalt IT-Recht | legal |
| jÃ¤hrlich | Markenrechts-Monitoring (DPMA + EUIPO) | legal |
| jÃ¤hrlich | DSA-SME-Status-BestÃ¤tigung | finance |
| halbjÃ¤hrlich | Impressum-Check Â§ 5 DDG | legal |
| quartÃ¤rlich | OSS-Meldung BZSt | finance |
| quartÃ¤rlich | UGC-Moderation-Sample (100 Random-Clubs vs Block-List) | product+engineering |
| quartÃ¤rlich | Notice-Response-SLO | engineering |
| ad-hoc | GlÃ¼cksspielrecht-Check vor Monetarisierungs-Feature | legal |
| ad-hoc | AI-Act-Art-50-Implementierung vor LLM-Feature | legal+engineering |

## Runbook-Skizzen

### RB-08-1 Abmahnung Marken/Wettbewerb/UWG
1. **Tag 0**: Mahnung lesen, Anlagen + UE-Vorschlag scannen, **nichts unterschreiben**.
2. **Tag 0â€“1**: Fristen kalkulieren (typ. 7â€“10 Tage), Mailbox/Logs konservieren.
3. **Tag 1â€“2**: Fachanwalt Markenrecht/IT-Recht (DE) kontaktieren, Erstberatung (â‚¬ 100â€“250).
4. **Tag 2â€“5**: Entscheiden: (a) modifizierte UE, (b) Inhalt entfernen/Ã¤ndern, (c) Verteidigung.
5. **Tag 5â€“7**: Modifizierte UE + technische Umsetzung + Kostentragung verhandeln.
6. Lessons-Learned in `docs/60-Research/legal-incidents.md`.

### RB-08-2 DSAR / Right-to-be-Forgotten vs steuerliche Aufbewahrung
1. DSAR triagieren; auf Art. 17 markieren.
2. Konflikt: Â§ 257 HGB / Â§ 147 AO 8â€“10 Jahre â€” **Vorrang vor Art. 17 GDPR** via Art. 17(3)(b).
3. Rechnungsdaten in separate `finance_records`-Tabelle; PII-Felder pseudonymisieren ("ANONYMIZED"), Steuer-relevante Felder bleiben.
4. Brief-Template an Anfragenden: Pseudonymisierung-ErklÃ¤rung.
5. Audit-Log + Ablaufdatum tracken; finale LÃ¶schung im monatlichen Cleanup-Job.

### RB-08-3 Trademark Cease-and-Desist SEGA/SI fÃ¼r â€žfootball-manager-x"
1. **Day 0**: C&D lesen, Anwalt SEGA/SI identifizieren (vermutlich UK-Kanzlei wie Bird&Bird, Browne Jacobson), Notice quittieren ohne inhaltliche Stellungnahme.
2. **Day 0â€“2**: Eigener Fachanwalt IT-Recht; FTO-Risiko = hoch; Re-Branding-Optionen aus Report 14 vorbereiten.
3. **Day 2â€“7**: Ãœbergangsfrist verhandeln (typ. 30â€“90 Tage Sunset); Token-Inventur (Domain, App-Store, Social-Handles, GitHub-Repo).
4. **Day 7â€“60**: Rebrand-Execution: neue Domain, DPMA-Anmeldung, App-Store-Update, Social-Migration, alte Domain 301, Repo-Rename.
5. **Post-Sunset**: Letter of Compliance an SEGA-Anwalt; Kostentragung verhandeln (typ. 30â€“50 % Settlement).

## Future-scope decisions (classified future-scope)
1. **Branding-Strategie**: Working-Title bleibt intern, Re-Brand vor Public-Beta? **Empfehlung**: Re-Brand bis Q3 2026, FTO sofort.
2. **Lootbox-Stance**: Hard-Constraint im ADR? **Empfehlung**: explizites â€žno lootboxes / no gacha â€” battle-pass + cosmetics only" in zukÃ¼nftigem Monetisierungs-ADR.
3. **MoR-Auswahl**: Stripe vs Paddle? **Empfehlung**: Paddle fÃ¼r MVP wegen Compliance-Vereinfachung; Migration zu Stripe Tax bei Skalierung mÃ¶glich.
4. **UGC-Lizenz-Klausel**: Minimal-Lizenz + Indemnification + Verzicht auf kommerzielle Sub-Lizenz.
5. **Schlichtungsstelle**: Universalschlichtungsstelle Bund â€” Â§ 36 VSBG â€žnicht bereit" ablehnen bis Umsatz/Beschwerden Schlichtung notwendig machen.

## â€žWenn wir nur 3 Dinge tun"-Liste

1. **Re-Branding + Marken-FTO vor Public-Launch (F-05)**: Score 20. Fachanwalt-FTO â‚¬ 500â€“1.500 + neuer Name vor App-Store/Marketing/Press. ROI: vermiedener â‚¬ 100 k-Streitwert.
2. **DSA-Art-16-Notice-and-Action + UGC-Vereinsname-Blocklist (F-06, F-11)**: Pflicht aus DSA + Schutzschild gegen DFL/Vereins-/UEFA-Claims. ~5 PT Einmal-Engineering. Adressiert Score 20+15 in einem Bundle.
3. **AGB + Impressum + Widerrufs-Sequenz durch DE-Fachanwalt (F-02, F-03, F-04)**: â‚¬ 1â€“3 k einmalig. Macht B2C-Compliance-Fundament abmahnfest.

## Verfolgung & Verkettung

IDs `PM-2026-05-20-08-F-NN`. Aggregat-Status: [[findings-registry]].

## Related

- [[00-index]] Â· [[findings-registry]] Â· [[threat-model]]
- [[PM-2026-05-20-04-monetization]] Â· [[PM-2026-05-20-13-community-moderation-and-ugc]] Â· [[PM-2026-05-20-14-brand-pr-and-crisis-comms]] Â· [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability]] Â· [[PM-2026-05-20-18-responsible-gaming-and-open-source]]
- [[../gdpr-compliance]] Â· [[../ip-and-licensing]]
- [[../../30-Implementation/privacy-and-consent]]
- [[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]]
