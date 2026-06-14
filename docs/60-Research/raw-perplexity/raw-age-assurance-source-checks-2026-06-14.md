---
title: "Raw - age assurance source checks (FMX-185)"
status: raw
tags: [research, raw, source-check, age-gate, age-assurance, gdpr, bdsg, jmstv, kjm, usk, iarc, fmx-185]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-185
related:
  - [[../age-assurance-and-iarc-rating-2026-06-14]]
  - [[raw-age-assurance-legal-posture-2026-06-14]]
  - [[raw-age-rating-iarc-usk-evidence-2026-06-14]]
  - [[raw-football-manager-age-rating-precedents-2026-06-14]]
  - [[../../40-Compliance/age-assurance-and-rating-evidence]]
  - [[../../10-Architecture/09-Decisions/ADR-0112-age-assurance-and-rating-evidence-posture]]
---

# Raw capture - age assurance source checks (2026-06-14)

Targeted official/source checks for **FMX-185**. Status `raw`: this is source
input only; the synthesis is [[../age-assurance-and-iarc-rating-2026-06-14]].

No FMX private data, secrets or user data were sent.

## GDPR / BDSG checks

- EUR-Lex, GDPR Regulation (EU) 2016/679:
  <https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng>
  - Relevant finding: Article 8 sets age 16 for a child's own consent to
    information-society-service processing and lets Member States lower the age
    only down to 13; controllers must make reasonable efforts around parental
    authorization where consent is needed.
- Official BDSG §12:
  <https://www.gesetze-im-internet.de/bdsg_2018/__12.html>
  - Relevant finding: §12 is about the Federal Commissioner's official
    relationship (`Amtsverhaeltnis`), not child consent, GDPR Art. 8 or age 16.
- Official BDSG index:
  <https://www.gesetze-im-internet.de/bdsg_2018/index.html>
  - Relevant finding: no obvious child-consent lowering section. BDSG §38 is
    the DPO threshold section; §51 is a separate consent provision for another
    BDSG part, not the FMX signup age gate.
- Official BDSG §38:
  <https://www.gesetze-im-internet.de/bdsg_2018/__38.html>
  - Relevant finding: non-public entities generally appoint a data protection
    officer at 20 people regularly engaged in automated personal-data
    processing, or regardless of headcount for DPIA-mandatory/commercial
    transfer/scoring/market-research cases.

## JMStV / KJM / USK checks

- KJM, "Unzulaessige Inhalte" / age-verification systems:
  <https://www.kjm-online.de/themen/technischer-jugendmedienschutz/unzulaessige-inhalte/>
  - Relevant finding: closed user groups and AV systems are for certain
    inadmissible/adult or harmful telemedia content, especially pornography,
    certain indexed and seriously youth-endangering content. AVS must include
    adult identification and per-session authentication.
- KJM AVS criteria PDF, English:
  <https://www.kjm-online.de/fileadmin/user_upload/KJM/Themen/Technischer_Jugendmedienschutz/AVS-Raster_gueltig_seit_12.05.2022-ENG.pdf>
  - Relevant finding: closed-user-group AVS requires adult identification,
    usually face-to-face or equivalent ID/biometric software, and
    authentication at each session so only the verified adult can access the
    content.
- Brandenburg official JMStV text, §7:
  <https://bravors.brandenburg.de/vertraege/jmstv#7>
  - Relevant finding: providers of generally accessible telemedia with content
    that can impair development or endanger youth must appoint a youth
    protection officer. Providers with fewer than 50 employees or demonstrably
    fewer than 10 million monthly average accesses per year can waive direct
    appointment if they join a voluntary self-regulation body and assign that
    body the duties.
- KJM legal view on youth protection officers:
  <https://www.kjm-online.de/fileadmin/user_upload/KJM/Service/Positionen/Rechtsauffassung_KJM_Jugendschutzbeauftragte1.pdf>
  - Relevant finding: KJM repeats the appointment duty and the same
    self-regulation carve-out. The document did not expose a 50,000-user
    mandatory trigger.
- USK, youth protection officer service:
  <https://usk.de/fuer-unternehmen/service-angebot-der-usk/jugendschutzbeauftragter/>
  - Relevant finding: commercial providers of online content that can impair
    development for children/youth must appoint a youth protection officer; USK
    can take over that role for member companies; failure can be an
    administrative offence.

## IARC / USK rating checks

- IARC FAQ:
  <https://globalratings.com/faq/>
  - Relevant finding: developers access the questionnaire only through
    participating storefront ingestion portals; ratings via IARC are free of
    cost to developers because storefronts/platforms pay the license fee; IARC
    ratings are displayed on participating storefronts and can be checked or
    corrected.
- IARC "How IARC Works":
  <https://globalratings.com/how-iarc-works/>
  - Relevant finding: developers complete the questionnaire; IARC returns age
    ratings, content descriptors and interactive elements by region. Interactive
    elements include in-game purchases, randomized purchases, user interaction,
    location sharing and internet access.
- USK FAQ:
  <https://usk.de/en/home/frequently-asked-questions/>
  - Relevant finding: IARC is free of charge for app/game publishers on
    connected platforms; IARC ratings are valid only within the connected IARC
    platform; physically distributed games in Germany need standard USK
    classification.
- USK obligations for content providers:
  <https://usk.de/en/home/obligations-for-content-providers/>
  - Relevant finding: digital/online games are governed by JMStV obligations;
    online point-of-sale should display age rating/descriptors where applicable;
    storefronts connected to IARC display labels/descriptors via IARC.

## Source quality note

The official/source checks correct two stale or weak inputs:

- Do **not** cite BDSG §12 for child consent; it is the wrong section.
- Do **not** preserve the pre-mortem's "Jugendschutzbeauftragter at 50k MAU"
  as a legal threshold. The current official check points to content/business
  relevance and the §7 self-regulation carve-out (`<50 employees` or
  `<10m monthly average accesses/year`), not 50k MAU.
