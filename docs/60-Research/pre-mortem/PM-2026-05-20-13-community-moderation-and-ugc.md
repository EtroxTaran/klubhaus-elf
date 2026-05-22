---
title: "Pre-Mortem 2026-05-20 Â· 13 Â· Community, Moderation & UGC"
status: current
tags: [research, pre-mortem, community, moderation, ugc, dsa, content-filter, 2026-Q2]
created: 2026-05-20
updated: 2026-05-22
type: research
binding: false
report_id: PM-2026-05-20-13
report_set: 2026-05-20
horizon: 2026-11-20
target_dau: 10000
scenarios: [single-node-hetzner, cloud-autoscaling]
iteration: 3
related:
  - [[00-index]]
  - [[findings-registry]]
  - [[threat-model]]
  - [[PM-2026-05-20-05-security-and-integrity]]
  - [[PM-2026-05-20-08-legal-consumer-law-and-tax]]
  - [[PM-2026-05-20-09-i18n-and-localization]]
  - [[../gdpr-compliance]]
---

# Pre-Mortem 2026-05-20 Â· 13 Â· Community, Moderation & UGC

> **Failure-Headline-Kandidaten**
> - â€ž3 Custom-Wappen mit Hakenkreuz schlÃ¼pften durch Upload-Filter â€” Reddit-Thread #FMXnazi 14 k Upvotes â€” Strafanzeige Â§ 86a StGB gegen Founder als Hoster."
> - â€žDFL-Anwaltsschreiben wegen 4.218 Save-Files mit 'FC Bayern MÃ¼nchen' inkl. Wappen â€” 14-Tage-Frist."
> - â€žDSA Art. 16 Notice 11 Tage ignoriert (Founder im Sommerurlaub) â€” DSC-NRW-Beschwerde â€” BuÃŸgeld-Androhung bis 6 % Umsatz."
> - â€žDiscord-Raid 200 Bot-Accounts in 90 Sek mit rassistischen Tactic-Namen; Auto-Mod schlug 12.000Ã— Alarm; Founder kapitulierte 03:47 Uhr."

## Top Failure-Hypothesen

### PM-2026-05-20-13-F-01 â€” DSA Art. 16 Notice-and-Action ohne SLA-getragene Prozessmaschine

```yaml
id: PM-2026-05-20-13-F-01
priority: P0
domain: community-moderation
probability: 5
impact: 5
score: 25
confidence: high
early_warning:
  - metric: "dsa_notice_open_total"
    threshold: "> 0 nach 14 d"
  - metric: "dsa_notice_response_time_p95_h"
    threshold: "> 72 h fÃ¼r klare FÃ¤lle"
mitigation_summary: "Ein-URL-Notice-Form mit Art-16-Pflichtfeldern, Mail-Inbox + Ticket-Bot, 24h-Receipt / 7-Tage-Decision-SLA, SoR-Template optional DSA-Datenbank"
linked_adrs: []
linked_specs: [[[PM-2026-05-20-08-legal-consumer-law-and-tax]]]
linked_code: ["apps/web/src/pages/legal/notice.tsx (geplant)", "apps/api/src/moderation/notice-router.ts (geplant)"]
sources:
  - title: "DSA Article 16 Notice and Action"
    url: "https://www.eu-digital-services-act.com/Digital_Services_Act_Article_16.html"
    accessed: "2026-05-20"
    publisher: "eu-digital-services-act.com"
    confidence: high
  - title: "DSA Art. 16 â€” CMS DigitalLaws"
    url: "https://www.cms-digitallaws.com/en/dsa/article-16/"
    accessed: "2026-05-20"
    publisher: "CMS"
    confidence: high
  - title: "Notice and Action Requirements (De Gruyter)"
    url: "https://www.degruyterbrill.com/document/doi/10.9785/cri-2024-250604/html"
    accessed: "2026-05-20"
    publisher: "De Gruyter Brill"
    confidence: medium
verification_notes: "Welle-1-Report-08 hat Pflicht nominal anerkannt, aber kein vollstÃ¤ndiges Notice-Formular spezifiziert. Penalty bis 6 % weltweiter Jahresumsatz (Art. 52). SME-Ausnahme Art. 19 entlastet von Risk-Assessment, NICHT von Art. 16."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: legal+platform
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** (1) Standalone Page `/legal/notice` mit Form-Felder + JSON-Schema-Backend. (2) Mail-Fallback `notice@â€¦` (Art. 16 (1) S. 2 elektronische Ãœbermittlung). (3) Ticket-System (Plane/Linear API oder GitHub-Issues mit Label `dsa-notice`). (4) SLA: `acknowledgement < 24 h`, `decision < 7 d` fÃ¼r klare Hassrede/Â§-86a-FÃ¤lle, `< 14 d` IP-Trademark. (5) Bona-fide-ErklÃ¤rung als Checkbox mit Legal-Text. (6) Automatisierte SoR an Notifier + Uploader.

**Verifikation.** Synthetic Notice-Submission jede Woche durch internen Bot; SLA-Burn-Rate-Alert bei p95 > 50 % SLA-Budget.

### PM-2026-05-20-13-F-02 â€” Â§ 86a StGB-Risiko bei Custom-Wappen-Upload (strafrechtlich, nicht zivil)

```yaml
id: PM-2026-05-20-13-F-02
priority: P1
domain: community-moderation
probability: 4
impact: 5
score: 20
confidence: high
early_warning:
  - metric: "image_upload_phash_match_total"
    threshold: "> 0"
  - metric: "image_upload_symbol_classifier_hit_total"
    threshold: "> 5/week"
mitigation_summary: "MVP: Wappen-Upload DEAKTIVIERT â€” prozedurale Wappen aus Klubname-Hash + Farbpalette + 200 SVG-Templates. Wave 2 nur via pHash + Symbol-Classifier + Human-Review-Hold"
linked_adrs: [[[../../10-Architecture/09-Decisions/ADR-0024-ugc-image-pipeline]]]
linked_specs: [[[PM-2026-05-20-05-security-and-integrity]]]
linked_code: ["apps/api/src/moderation/image-mod.ts (geplant)"]
sources:
  - title: "Â§ 86a StGB"
    url: "https://dejure.org/gesetze/StGB/86a.html"
    accessed: "2026-05-20"
    publisher: "dejure.org"
    confidence: high
  - title: "BzKJ Â§ 86a StGB Anbietersicht"
    url: "https://www.bzkj.de/resource/blob/130176/529e31da65b8e3e4a01399f038736771/201802-86a-aus-anbietersicht-data.pdf"
    accessed: "2026-05-20"
    publisher: "BzKJ"
    confidence: high
verification_notes: "Â§ 86a StGB Freiheitsstrafe bis 3 Jahre. Plattform-Privileg (Â§Â§ 7â€“10 DDG) greift erst ab positiver Kenntnis. Bei viralem Hakenkreuz-Wappen kann StA gegen Founder ermitteln. Custom-SVG ist XSS-Vektor."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder+legal
effort: L
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** (1) **MVP-Beschluss: Kein Custom-Wappen-Upload.** Prozedural generierte Wappen aus Klubname-Hash + Farbpalette + 200 vorbereiteten SVG-Templates. (2) Wave 2 mit Upload: Format-Whitelist `image/png|image/webp|image/jpeg`, **niemals SVG**. Sharp-Pipeline rasterisiert + strippt Metadata + Density-Cap. 256Ã—256 px, 256 KB Max. (3) Pipeline: Upload â†’ Sharp re-encode â†’ pHash + dHash â†’ DB-Lookup gegen Symbol-Hash-List (BPjM-Indizierungsliste + community-pflegt). Match â†’ Reject + Soft-Flag. (4) Symbol-Classifier (Llama-Guard-Vision oder Hive Visual Mod â€žHate-Symbols") als zweite Stufe. (5) Human-Review-Hold 60 Min, ID-Card-Style â€žpending review" bis Founder/Mod approved (Discord-Embed-Slash-Action). (6) Rate-Anomalie (> 3 Uploads/h/Account) â†’ Auto-Suspend + Push.

**Verifikation.** 30 Symbol-Varianten (Rotation, Spiegelung, Pixel-Noise) gegen Upload â†’ alle reject/hold. JS-in-SVG: MIME-Check + Magic-Bytes-PrÃ¼fung blockt.

### PM-2026-05-20-13-F-03 â€” Vereins-Trademark-Blocklist DFL/UEFA = Build-Time-Daten + Runtime-Match-Pipeline

```yaml
id: PM-2026-05-20-13-F-03
priority: P1
domain: community-moderation
probability: 5
impact: 4
score: 20
confidence: high
early_warning:
  - metric: "club_name_blocklist_hit_total"
    threshold: "Spike > 100/day â†’ False-Positive-Review"
  - metric: "trademark_complaint_open_total"
    threshold: "> 0"
mitigation_summary: "Wikidata-getriebene Blocklist (BL + 2.BL + UEFA-Top-100) mit jÃ¤hrlichem Cron-Build, Levenshtein â‰¤ 2 + Unicode-NFKC + Leet-Decoder + Phonetic-Fallback"
linked_adrs: []
linked_specs: [[[../ip-and-licensing]], [[PM-2026-05-20-08-legal-consumer-law-and-tax]]]
linked_code: ["packages/moderation/src/blocklist/clubs.ts (geplant)", "scripts/blocklist-build/from-wikidata.ts (geplant)"]
sources:
  - title: "Bundesliga legal notices"
    url: "https://www.bundesliga.com/en/bundesliga/info/legal-notices"
    accessed: "2026-05-20"
    publisher: "Bundesliga"
    confidence: high
verification_notes: "Naive Exact-Match scheitert: User tippen `FCBayern2026`, `Bayern_Munich_88`, `FC Ð’ayern` (kyrillisches Ð’), `B@yern Munchen`. Ohne Fuzzy+Confusable+Token = nutzlos."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform+legal
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** VollstÃ¤ndiges 6-Stufen-Matcher-Schema (siehe Block-List-Implementation unten): NFKC + Confusable-Decode â†’ Leet-Decode â†’ Token-Strip + Bag-of-Tokens â†’ Exact-Match â†’ Fuzzy (Jaro-Winkler â‰¥ 0.92) â†’ Phonetic (Double-Metaphone).

**Verifikation.** Bypass-Test-Suite: 200 generierte Varianten von 20 Schutz-Namen; â‰¥ 95 % blockiert; FPR auf 100 legitimen â‰¤ 2 %.

### PM-2026-05-20-13-F-04 â€” Single-Founder als Mod = Burnout + SLA-Verletzung

```yaml
id: PM-2026-05-20-13-F-04
priority: P1
domain: community-moderation
probability: 5
impact: 4
score: 20
confidence: high
early_warning:
  - metric: "mod_queue_depth"
    threshold: "> 50 outstanding fÃ¼r > 24 h"
  - metric: "founder_overtime_h_per_week"
    threshold: "> 60"
mitigation_summary: "Automatisierung first (Tier-1 AI-Filter), Discord-Bot-Workflow, Trusted-Community-Mods mit Mod-Charta + DSA-Haftungsausschluss, Eskalations-Cache"
linked_adrs: []
linked_specs: []
linked_code: []
related_findings: [PM-2026-05-20-07-F-08]
sources:
  - title: "On-Call Scheduling for Small Teams (Hyperping)"
    url: "https://hyperping.com/blog/oncall-scheduling-small-teams"
    accessed: "2026-05-20"
    publisher: "Hyperping"
    confidence: medium
verification_notes: "Founder ohne Mod-Team kann 7-Tage-DSA-SLA nur halten bei (a) â‰¤ 5 Notices/Tag und (b) keinen Urlaub. Bei 10k DAU mit 5â€“15 Notices/Tag realistisch."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** (1) **Tier-0 (Filter)**: AI-Pre-Filter (Llama-Guard 3 self-hosted EU + Profanity-Regex + Blocklist) blockiert vor VerÃ¶ffentlichung. (2) **Tier-1 (Trusted Community-Mod)**: 3â€“5 Free-Tier-Spieler mit `community-mod`-Discord-Rolle. Rechtsstatus: keine Vertretungsmacht ggÃ¼ Plattform-Pflichten; nur vorlÃ¤ufig verbergen; Final-Decision Founder. Mod-Charta + DSA-Haftungsausschluss. (3) **Tier-2 (Founder)**: Final-Decision + Statement of Reasons. (4) **Eskalations-Cache**: 72-h-Urlaub-Modus, AI-Filter aggressiver, alle Uploads `pending`.

**Verifikation.** WÃ¶chentlicher SLA-Burndown; bei `mod_queue_depth > 50` oder p95 > 48 h â†’ Discord-Webhook + SMS.

### PM-2026-05-20-13-F-05 â€” Hate-Speech-Bypass durch Leet/Unicode/Padding

```yaml
id: PM-2026-05-20-13-F-05
priority: P2
domain: community-moderation
probability: 5
impact: 3
score: 15
confidence: high
early_warning:
  - metric: "ugc_text_reject_rate"
    threshold: "Drop > 30 % nach Bypass-Variante in the wild"
  - metric: "ugc_text_post_publish_report_total"
    threshold: "> 10/week"
mitigation_summary: "Obscenity (Transformer-basiert) + confusable-homoglyphs Unicode-Normalize + Multi-Pass-Pipeline + Cool-down auf Toxicity-Score"
linked_adrs: []
linked_specs: []
linked_code: ["packages/moderation/src/text/profanity.ts (geplant)"]
sources:
  - title: "Obscenity npm"
    url: "https://www.npmjs.com/package/obscenity"
    accessed: "2026-05-20"
    publisher: "npm"
    confidence: high
  - title: "confusable_homoglyphs"
    url: "https://github.com/vhf/confusable_homoglyphs"
    accessed: "2026-05-20"
    publisher: "GitHub vhf"
    confidence: high
  - title: "Homoglyph Attack 2025"
    url: "https://deepstrike.io/blog/what-is-a-homoglyph-attack"
    accessed: "2026-05-20"
    publisher: "DeepStrike"
    confidence: medium
verification_notes: "Spieler umgehen Wordlist trivial: FuÃŸba11, SÑhei$$e (kyrill. Ñ), f u c k (Padding), fuuuuck (Repetition), ðŸ…µðŸ†„ðŸ…²ðŸ…º (Emoji-Stems)."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** 3-Stufen-Pipeline: (1) Unicode-NFKC + confusable-homoglyphs â†’ ASCII. (2) Obscenity / GLIN-Profanity (Transformer-basiert, matched `fuuuuck` + `wordsbeforefuckandafter`, `disableLeetSpeak: false`). (3) Perspective API oder lokale **Llama-Guard-3-8B** EU-Hosted (F1 0.939). Score > 0.85 â†’ Reject + log + repeat-offender++. Score 0.6â€“0.85 â†’ soft-flag.

**Verifikation.** Bypass-Test-Suite 500 Varianten Top-30-SchimpfwÃ¶rter: â‰¥ 90 % Recall, FPR auf 200 legitimen â‰¤ 3 %.

### PM-2026-05-20-13-F-06 â€” Repeat-Offender-Policy (Art. 23 DSA) fehlt

```yaml
id: PM-2026-05-20-13-F-06
priority: P2
domain: community-moderation
probability: 4
impact: 4
score: 16
confidence: medium
early_warning:
  - metric: "user_strike_count_p99"
    threshold: "p99 > 2 â†’ Policy-Bedarf bestÃ¤tigt"
mitigation_summary: "3-Strike + Cooldown-Eskalation (1h â†’ 24h â†’ 7d â†’ term), Prior-Warning vor Suspension, in T&C + DSA-Transparency-Report"
linked_adrs: []
linked_specs: []
linked_code: ["apps/api/src/moderation/strikes.ts (geplant)"]
sources:
  - title: "DSA Art. 23 Repeat Infringers"
    url: "https://www.eu-digital-services-act.com/Digital_Services_Act_Article_23.html"
    accessed: "2026-05-20"
    publisher: "eu-digital-services-act.com"
    confidence: high
verification_notes: "Art. 23 (1) DSA: 'hÃ¤ufig offensichtlich illegale Inhalte' â†’ Suspension. Ohne dokumentierte Policy juristisch angreifbar (Art. 54 Schadenersatz)."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: legal+platform
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Strike-Schema: Strike 1 (Hate-Speech-Klubname) â†’ Warning + reset auf default. Strike 2 â†’ 24 h Read-only. Strike 3 â†’ 7 d UGC-Sperre. Strike 4 â†’ Account-Termination + 6-Mo-Daten-Retention (forensisch, kollidiert mit Art. 17 â†’ F-09). Pre-Warning bei jedem Strike (Art. 23 (2)). Transparency-Report Art. 24 (3): Anzahl Suspensions je Kategorie. **Hinweis**: SME-Ausnahme gilt nicht fÃ¼r Art. 24 (3), nur (1)+(2).

### PM-2026-05-20-13-F-07 â€” Translation-UGC (post-MVP TMS) als unmoderiertes Hate-Vehikel

```yaml
id: PM-2026-05-20-13-F-07
priority: P3
domain: community-moderation
probability: 3
impact: 4
score: 12
confidence: medium
early_warning:
  - metric: "tms_translation_pending_unmoderated_total"
    threshold: "> 0 in prod build"
mitigation_summary: "TMS-PR-Workflow mit Human-Review + 2-Native-Approver; Sprachen ohne Reviewer = Locale nicht aktiviert"
linked_adrs: []
linked_specs: [[[PM-2026-05-20-09-i18n-and-localization]]]
linked_code: []
sources:
  - title: "Tolgee GitHub Platform"
    url: "https://github.com/tolgee/tolgee-platform"
    accessed: "2026-05-20"
    publisher: "Tolgee"
    confidence: high
verification_notes: "Italienische Ãœbersetzung mit faschistischen Slogans in obskuren Tooltips. Ohne 2-of-N-Reviewer geht das in Production."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** (1) TMS als GitHub-PR (Crowdin/Tolgee â†’ GitHub-Sync) â€” Founder merged explizit. (2) Pro Sprache 2 Native-Reviewer mit `translator`-Rolle. (3) VergÃ¼tung: Discord-Rolle + Credits (kein Geld â†’ keine Arbeitnehmer-Konstruktion â†’ DSGVO-Auftragsverarbeitung nicht nÃ¶tig). (4) Diff-View, kein Bulk-Approve. (5) Post-Merge AI-Scan auf Toxicity-Drift.

**Verifikation.** CI-Gate: Locale-File-Diff nicht ohne Approver-Signatur in `main`.

### PM-2026-05-20-13-F-08 â€” Async-Multiplayer-Chat als unkontrolliertes UGC-Forum (Post-MVP)

```yaml
id: PM-2026-05-20-13-F-08
priority: P3
domain: community-moderation
probability: 3
impact: 4
score: 12
confidence: low
early_warning:
  - metric: "private_msg_volume_per_dau"
    threshold: "> 5/Tag/DAU"
mitigation_summary: "Pre-MVP: KEIN Free-Form-Chat. Prepared-Emote-Set + 'Coach-Reaktion'-Templates. Wave-2 mit AI-Pre-Filter + Spam-Cooldown + Block-User"
linked_adrs: []
linked_specs: [[[../async-multiplayer-research]]]
linked_code: []
sources:
  - title: "DSA Article 16 (private content debate)"
    url: "https://www.cms-digitallaws.com/en/dsa/article-16/"
    accessed: "2026-05-20"
    publisher: "CMS"
    confidence: medium
verification_notes: "Art. 16 strittig fÃ¼r private Nachrichten, aber sicherheitshalber Notice-Mechanismus unabhÃ¤ngig von Ã–ffentlichkeit."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: L
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** **MVP: Kein Free-Form-Chat.** Liga-Bulletin (Founder schreibt News) + 12 vordefinierte Emote-Reaktionen pro Match. Wave 2: Chat mit AI-Pre-Filter + Block/Mute-Buttons + Slow-Mode.

**Verifikation.** Spec-Review: MVP-Roadmap enthÃ¤lt keinen Free-Form-Chat. Wave-2-ADR muss Filter spezifizieren vor Live.

### PM-2026-05-20-13-F-09 â€” DSGVO-Konflikt: Notice-Reporter-PII vs Aufbewahrung fÃ¼r Audit

```yaml
id: PM-2026-05-20-13-F-09
priority: P3
domain: privacy-moderation
probability: 4
impact: 3
score: 12
confidence: medium
early_warning:
  - metric: "gdpr_erasure_request_overlap_with_notice_records_total"
    threshold: "> 0"
mitigation_summary: "Pseudonymisierte Notice-Records (Notifier-Hash + verschlÃ¼sselter Mail-Vault); 6 Mo. Aufbewahrung; LÃ¶sch-Antrag â†’ Pseudonymisierung statt Komplett-LÃ¶schung"
linked_adrs: []
linked_specs: [[[../gdpr-compliance]]]
linked_code: []
sources:
  - title: "Art. 17 DSGVO"
    url: "https://dejure.org/gesetze/DSGVO/17.html"
    accessed: "2026-05-20"
    publisher: "dejure.org"
    confidence: high
verification_notes: "Reporter stellt Art-17-Antrag. DSA verlangt Audit-Trail (Art. 24 (1) implizit + nationale DDG-Beweispflichten). Direkter Konflikt."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: privacy+legal
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Notice-Record-Schema: `notifier_email_encrypted` (separater KMS-Key), `notifier_email_hash` (SHA-256 fÃ¼r Audit). LÃ¶schantrag â†’ KMS-Key-Rotation auf Hash-only, Plaintext irreversibel weg. Audit-Trail bleibt. Retention 6 Mo Default; T&C/Privacy-Policy explizit (Art. 14 Transparenz). Bona-fide-ErklÃ¤rung enthÃ¤lt Verarbeitungs-Consent + Speicher-Info.

**Verifikation.** Erasure-Drill: Synthetic-Notifier stellt Art-17-Antrag, Plaintext-Mail pseudonymisiert, Audit-Trail (Hash + Content + Decision) bleibt.

### PM-2026-05-20-13-F-10 â€” Username-Squatting auf Schutzmarken (FCBayern_2026, Real_Madrid_88)

```yaml
id: PM-2026-05-20-13-F-10
priority: P3
domain: community-moderation
probability: 4
impact: 3
score: 12
confidence: medium
early_warning:
  - metric: "username_blocklist_softmatch_total"
    threshold: "Spike > 30/day"
mitigation_summary: "Username-Blocklist deckungsgleich mit Club-Blocklist + Spieler-Top-3000 (FIFPro-Proxy via Wikidata) + Composite-Token-Match"
linked_adrs: []
linked_specs: []
linked_code: ["packages/moderation/src/blocklist/usernames.ts (geplant)"]
sources:
  - title: "FIFPro license analysis (Soccerverse case)"
    url: "https://soccerverse.com/news/soccerverse-secures-fifpro-license/"
    accessed: "2026-05-20"
    publisher: "Soccerverse"
    confidence: medium
verification_notes: "User wÃ¤hlt `Lewandowski` als Manager-Bio â†’ wir verbreiten Player-Likeness ohne Lizenz. FIFPro-Anwaltsschreiben droht."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Username-Blocklist baut auf Club-Blocklist + Spieler-Top-3000 aus Wikidata Query (P54 member of sports team, top-leagues). Composite-Match: `BayernMunich88` zerlegt in Tokens [Bayern, Munich, 88]; Bayern+Munich kombiniert matched gegen `FC Bayern MÃ¼nchen`.

### PM-2026-05-20-13-F-11 â€” Save-Sharing-Forum (Post-MVP) = neuer UGC-Vektor

```yaml
id: PM-2026-05-20-13-F-11
priority: P3
domain: community-moderation
probability: 3
impact: 4
score: 12
confidence: low
early_warning:
  - metric: "save_share_uploads_reported_per_day"
    threshold: "> 5"
mitigation_summary: "Save-Sharing in Wave 2: trust-level filter (Cross-Ref 05) + Klubname/Wappen durch UGC-Filter + Save-Title als Free-Text durch Profanity-Pipeline"
linked_adrs: []
linked_specs: [[[PM-2026-05-20-05-security-and-integrity]]]
linked_code: []
sources: []
verification_notes: "Save-Sharing erbt UGC-Risiken + addiert Save-Title-Feld. Cheat-Saves = Integrity, Hate-Saves = Moderation."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Save-Sharing-Gating: Nur `trust_level: verified` (Report 05). UGC-Filter auf allen User-Provided-Strings vor Upload. Hash-of-content; Re-Upload nach Takedown auto-reject.

## Block-List-Implementation (CORE OUTPUT)

### Datenmodell

```typescript
// packages/moderation/src/blocklist/types.ts
type BlocklistCategory = 
  | "club_trademark"      // DFL/UEFA-clubs
  | "player_likeness"     // FIFPro-proxy top-3000
  | "country_state"       // FIFA member assoc + variations
  | "profanity_de"        
  | "profanity_en"        
  | "extremism_symbol"    // Phrases & abbreviations: 88, 14words
  | "sexual"
  | "self_harm"
  | "spam_brand";         // Discord, OnlyFans-Pumps

interface BlocklistEntry {
  id: string;              // UUIDv7
  category: BlocklistCategory;
  canonical: string;       // "FC Bayern MÃ¼nchen"
  normalized: string;      // "fc bayern munchen" (NFKC + lowercase + diacritics)
  aliases: string[];       // ["Bayern Munich", "FCB", "Bayern Muenchen"]
  metaphone: string[];     // ["FKBRNMâ€¦"]
  origin: "wikidata" | "manual" | "uefa-list" | "fifpro-proxy";
  added_at: string;        // ISO
  updated_at: string;
  severity: "block" | "soft-flag" | "warn";
  jurisdictions: ("DE"|"EU"|"global")[];
  reference_url?: string;  // Wikidata Q-ID
}
```

### Update-Pipeline

```typescript
// scripts/blocklist-build/from-wikidata.ts
// Cron: '0 3 1 7 *' (yearly, 1. Juli vor Saisonstart) + manual trigger
//
// 1. SPARQL Query Wikidata:
//    SELECT ?club ?clubLabel ?league WHERE {
//      VALUES ?league { wd:Q82595 /* BL */ wd:Q124220 /* 2.BL */
//                       wd:Q19847 /* UCL participants */ }
//      ?club wdt:P118 ?league.   # member of
//    }
// 2. Wikidata "also known as" â†’ aliases.
// 3. Normalize: NFKC, lowercase, strip diacritics, strip "FC|SC|TSV|â€¦" prefix into aliases.
// 4. Double-metaphone fÃ¼r Phonetic-Fallback.
// 5. Append manual override ./blocklist-overrides.yaml.
// 6. Output: packages/moderation/data/blocklist-clubs.json (committed; PR-reviewable).
// 7. CI-Gate: Schema-Validation (zod) + sanity-count > 500 entries.
```

### Runtime-Match-Pipeline

```typescript
// packages/moderation/src/blocklist/matcher.ts
function checkClubName(userInput: string): MatchResult {
  // Stage 0: Length & charset guard
  if (userInput.length > 64 || /[^\p{L}\p{N}\s\-'.]/u.test(userInput)) {
    return { kind: "reject", reason: "invalid-charset" };
  }
  // Stage 1: Unicode NFKC + confusables decode
  let normalized = userInput.normalize("NFKC");
  normalized = confusableHomoglyphs.toAscii(normalized); // kyrill. Ð¾ â†’ o
  // Stage 2: Leet decode (light: 0â†’o, 1â†’i/l, 3â†’e, 5â†’s, $â†’s, @â†’a)
  const deLeetVariants = leetDecode(normalized);
  // Stage 3: Strip "fc|fc1|sc|tsv|vfb|borussia|real|fc bayern mÃ¼nchen" prefixes
  const tokens = tokenize(normalized.toLowerCase());
  // Stage 4: Exact-match against blocklist.normalized + aliases
  for (const entry of blocklistClubs) {
    if (tokens.intersection(entry.tokens).size === entry.tokens.size) {
      return { kind: "block", entry, mode: "exact-tokens" };
    }
  }
  // Stage 5: Fuzzy (Jaro-Winkler â‰¥ 0.92 OR Levenshtein â‰¤ 2 fÃ¼r â‰¥ 5 chars)
  for (const entry of blocklistClubs) {
    for (const variant of [normalized, ...deLeetVariants]) {
      if (jaroWinkler(variant, entry.normalized) >= 0.92) {
        return { kind: "soft-flag", entry, mode: "fuzzy" };
      }
    }
  }
  // Stage 6: Phonetic fallback (double-metaphone)
  const userPhon = doubleMetaphone(normalized);
  for (const entry of blocklistClubs) {
    if (entry.metaphone.some(m => m === userPhon[0])) {
      return { kind: "soft-flag", entry, mode: "phonetic" };
    }
  }
  return { kind: "allow" };
}
```

### Bypass-Coverage

| Bypass | Beispiel | Stage |
|---|---|---|
| Unicode-confusable | `FÐ¡ Bayern` (kyrill. Ð¡) | 1 |
| Leet | `FC B4yern` | 2 |
| Padding | `F C B a y e r n` | 3 (Tokenize) |
| Suffix-Spam | `FC Bayern 2026` | 4 (Token-Subset) |
| Typo/Anagram-light | `Bayren Munich` | 5 (Jaro-Winkler) |
| Phonetic-EN | `Bayern Mootnik` | 6 (Metaphone) |
| Emoji-Spam | `ðŸ”¥FCBayernðŸ”¥` | 0 Charset |
| ZWJ / RTL-Override | `FC Bayernâ€‹` | 1 NFKC |

### Strike-System

```typescript
interface UserStrikes {
  user_id: UUID;
  strikes: Strike[];      // sorted desc by date
  active_suspension?: { until: ISO; reason: string };
}
interface Strike {
  id: UUIDv7;
  category: BlocklistCategory | "report-confirmed" | "manual";
  notice_id?: string;      // DSA Art. 16 notice-ID
  severity: 1 | 2 | 3 | 4;  // 1=warn, 2=24h, 3=7d, 4=terminate
  created_at: ISO;
  warning_issued_at: ISO;  // Art. 23 (2) prior warning
  decay_at?: ISO;          // 90 d strike-decay
}
```

## Moderations-Tooling-Vergleich (CORE OUTPUT)

| Tool | Kategorie | EU-Hosting | Pricing 2025/2026 | DSA-Fit | Empfehlung |
|---|---|---|---|---|---|
| **Llama-Guard 3-8B self-hosted** | Text-Classifier | Hetzner GPU EU | Compute ~â‚¬120/Mo (A6000) | Voll DSGVO, audit-fÃ¤hig | **MVP-Primary** Text |
| **Obscenity (npm)** | Wordlist + Transformer | npm | Free MIT | DSGVO (lokal) | **MVP-Primary** Stage 0/1 |
| **confusable-homoglyphs (PyPI)** | Unicode-Normalize | local | Free | DSGVO | **MVP-Primary** Stage 1 |
| **Perspective API** | Toxicity-Score | US (Google) | Free bis 1 QPS | DPA mit Google; nicht EU-Host | Wave-2-Fallback |
| **OpenAI Moderation (omni-mod-latest)** | Text+Image | US | Free, kein DPA fÃ¼r non-DataPlus | EU-US-DPF erforderlich | Wave-2-Fallback non-persistent |
| **Hive Moderation** | Image/Text/Video | US | Custom $50â€“500/Mo SMB; opt-out 14d | DPA verfÃ¼gbar | Image-Fallback wenn Llama-Guard-Vision unzureichend |
| **Sightengine** | Image/Text | **EU (FR) Option** | $29/$99/$399 | EU-Hosting verfÃ¼gbar | **Image-Primary Wave-2** falls Wappen |
| **NSFWJS (TF.js)** | Image (NSFW) | client/server lokal | Free MIT, ~93 % accuracy | DSGVO | Optionaler client-side Pre-Filter |
| **NudeNet (self-hosted)** | Image (NSFW) | local | Free AGPL | DSGVO | Server-side Image-Pre-Filter |
| **pHash + Symbol-DB** | Image-hash-match | local | Free | DSGVO | **MVP-Primary** Â§86a-Symbol-Hashes |
| Microsoft Content Moderator | â€” | â€” | EOL'd 2027 | â€” | nicht empfohlen |
| **Discord AutoMod** | Server-Chat | Discord (US) | Free | Discord ist Verantwortlicher | Discord-Server-Hygiene ja |
| **Wick (Discord-Bot)** | Raid-Shield | Discord | Free tier | extern | Discord-Anti-Raid |

**MVP-Stack:**
1. **Text-UGC**: Obscenity + confusable-homoglyphs (Stage 1) + Blocklist (Stage 4â€“6) + **Llama-Guard-3-8B** Hetzner GPU fÃ¼r Kontext-Toxicity.
2. **Image-UGC** (Wave 2 falls Ã¼berhaupt): Sharp-Rasterize â†’ pHash + dHash gegen lokale `extremism-symbol-hashes` â†’ **Sightengine** EU fÃ¼r Nudity/Violence â†’ Human-Review-Hold.
3. **Discord**: AutoMod + Wick (anti-raid + 14-d-account-age) + Carl-bot Roles. Max 3 Bots.

**Total laufende Kosten MVP**: ~â‚¬120 GPU + â‚¬0â€“29 Sightengine-Starter = **~â‚¬120â€“150/Monat**. Wave-2 mit Image-Upload realistisch â‚¬300â€“400/Mo.

## Quantitatives Modell

| Metric | MVP-Estimate (10k DAU) |
|---|---|
| Notices/Tag | 5â€“15 (0.05â€“0.15 % DAU) |
| Notices/Tag bei Viral | 200â€“1.000 |
| UGC-Felder/Spieler | ~6 (Klubname, Wappen, Manager, Bio, 3â€“5 Tactic-Names, Save-Title Ã— N) |
| UGC-Submission-Rate | ~12/DAU/Mo |
| Pre-Filter Block-Rate | 0.5â€“2 % |
| Post-Publish Report-Rate | 0.05 % |
| Moderator-Stunden/10k DAU/Mo | 8â€“20 h |
| False-Positive Profanity | â‰¤ 3 % |
| False-Negative Hate-Speech | â‰¤ 10 % |
| Image-Upload bei aktiv | ~200/Tag |
| Symbol-Hit-Rate | 0.05â€“0.5 % der Uploads |

## SLO-VorschlÃ¤ge

| SLO | Ziel |
|---|---|
| `notice_acknowledgement_p95_h` | < 24 h |
| `notice_decision_p95_h` | < 7 d klare FÃ¤lle / < 14 d komplex |
| `ugc_text_filter_false_positive_rate_pct` | < 3 % (wÃ¶chentliche Random-Stichprobe) |
| `ugc_text_filter_recall_hate_pct` | > 90 % (Bypass-Suite) |
| `blocklist_freshness_days_since_build` | < 365 d (Cron) + < 30 d ad-hoc |
| `image_upload_symbol_hash_db_lag_d` | < 14 d nach Symbol-Hash-VerÃ¶ffentlichung |
| `mod_queue_depth` | < 25 ausstehend |
| `repeat_offender_strike_visibility_d` | Strike-Decay 90 d in T&C dokumentiert |

## Test-Plan

Synthetic-Attack-Suite (21 Test-Cases): Profanity Plain/Leet/Padding/Unicode/Repetition, Trademark Exact/Token/Typo/Phonetic, Player-Likeness, Symbol-Hash Hakenkreuz/Rotated/Schwarze-Sonne, SVG-Reject, Large-Image-DoS, Pixel-Bomb, Notice-Submission valid/invalid, Strike-Escalation, GDPR-Erasure-Notifier, Discord-Raid-Sim.

**Bypass-Test-Suite**: 500 Varianten Top-30-SchimpfwÃ¶rter + 200 Varianten Top-50-Klubnamen â†’ â‰¥ 90 % Recall, FPR auf 200 legitimen â‰¤ 3 %.

## Runbook-Skizzen

### RB-13-A: DFL-Anwaltsschreiben re Vereinsname/Logo-UGC
1. **0â€“24 h**: Eingang `legal-incoming@`, Notice-ID, EmpfangsbestÃ¤tigung mit Â§ 5 DDG-Anschrift.
2. **24â€“48 h**: DB-Suche aller Saves mit gematchtem Pattern. Bei Match: Soft-Hide 7 d + Notice-an-Uploader.
3. **48â€“72 h**: Schriftliche Antwort mit Hosting-Privileg-Hinweis (Â§ 7â€“10 DDG, DSA Art. 6) + Notice-and-Action-BestÃ¤tigung + Strike fÃ¼r Repeat-Uploader.
4. **7â€“14 d**: Blocklist-Erweiterung um spezifischen Trademark-Hit. Strike-Eskalation.
5. **Eskalation**: Bei Klage â†’ External-Counsel (HÃ¤rting RechtsanwÃ¤lte).

### RB-13-B: Massen-Hate-Speech-Spam-Welle
1. **T+0**: Anomaly-Detector bei > 20 UGC/Min mit Profanity-Score > 0.7.
2. **T+5 Min**: Auto-Throttle: UGC-Felder temporÃ¤r 1 Submission/h, Pre-Filter-Threshold auf 0.5.
3. **T+15 Min**: Founder-SMS + Discord-Webhook.
4. **T+30 Min**: Bot-Origin â†’ IP-Block Top-3 ASNs via Hetzner/Cloudflare. CAPTCHA-Gate temporÃ¤r.
5. **T+1 d**: Backlog-Sweep: alle Submissions des Fensters manuell.
6. **T+7 d**: Post-Mortem + Counter-Tuning.

### RB-13-C: Schwerwiegender Â§ 86a-Vorfall (Strafrecht)
1. **T+0**: Reporter-Notice / Tier-1 erkennt Hakenkreuz-Wappen.
2. **T+5 Min**: Sofort-Takedown (vor Diskussion). pHash + Original verschlÃ¼sselt in `evidence/`-Vault. **Nicht lÃ¶schen.**
3. **T+30 Min**: Founder-Triage: Einzelfall oder Multi-Upload-Spree? Letzteres â†’ RB-13-B.
4. **T+2 h**: Statement of Reasons an Uploader: Account-Suspension Strike 4. Daten 6 Mo Retention (forensisch).
5. **T+24 h**: Selbstanzeige bei StA *optional* â€” Anwalt-Konsultation zuerst. Hoster-Privileg schÃ¼tzt, aktive Anzeige umstritten (exponiert Reporter-PII).
6. **T+72 h**: Symbol-Hash zur lokalen `extremism-symbol-hashes`-DB. **Nie Originaldatei in DB.**
7. **Eskalation**: Bei BehÃ¶rden-Anfrage â†’ External-Counsel + Pseudonymisierung des Uploaders bis Beschlagnahme-Anordnung.

## Future-scope decisions (classified future-scope)
1. **Founder-Privatadresse als Impressum?** Â§ 5 DDG verlangt ladungsfÃ¤hige Anschrift. Coworking oder Postfach-Service (Clevvermail Hamburg ~â‚¬30/Mo)?
2. **Trusted-Community-Mod**: Halbarbeitnehmer-Status laut BAG? Reine Discord-Rolle + Code-of-Conduct sollte reichen; Anwalts-Bewertung vor Live.
3. **Selbst-Anzeige bei Â§ 86a-Fund**: Pflicht oder Option? Konsens: keine Anzeige-Pflicht fÃ¼r Hoster, aber Beweismittelaufbewahrung muss strafprozessual standhalten.
4. **Wikidata-Source-of-Truth-Risiko**: Vandalism-Risk. Manuelle PR-Approval-Pflicht + Diff-Cap (> 5 % change = CI-Fail).
5. **Image-Upload Ã¼berhaupt jemals?** Procedurale Wappen-Engine deckt 80 % Bedarf. Image-Upload Ã¶ffnet Â§ 86a-Box. Empfehlung: erst nach Series A.

## "Wenn wir nur 3 Dinge tun"-Liste

1. **MVP ohne Image-Upload + ohne Free-Form-Chat.** Procedural Wappen + Emote-Set decken ~80 % Bedarf. Eliminiert Â§ 86a-Hauptrisiko + Single-Founder-Mod-Load-Risiko.
2. **Notice-and-Action-Pipeline (Art. 16 DSA) als hartes Launch-Gate.** Form, Mail-Inbox, Ticket-System, 24h-ACK/7d-Decision-SLA. Ohne das keine Public-Beta â€” BuÃŸgeld-Risiko asymmetrisch.
3. **Blocklist-Pipeline (Wikidata + Fuzzy + Confusables + Strike) als Code, nicht Excel.** Yearly Cron, PR-reviewable, Bypass-Test-Suite im CI, Repeat-Offender-Policy in AGB.

## Verfolgung & Verkettung

IDs `PM-2026-05-20-13-F-NN`. Aggregat: [[findings-registry]].

## Related

- [[00-index]] Â· [[findings-registry]] Â· [[threat-model]]
- [[PM-2026-05-20-05-security-and-integrity]] (Save-Trust-Level) Â· [[PM-2026-05-20-08-legal-consumer-law-and-tax]] (DSA-Recht) Â· [[PM-2026-05-20-09-i18n-and-localization]] (Unicode-Validation)
- [[../gdpr-compliance]] Â· [[../async-multiplayer-research]] Â· [[../ip-and-licensing]]
