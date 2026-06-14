---
title: "Raw - Pitch-condition real-world operations (FMX-142)"
status: raw
tags: [research, raw, perplexity, football, stadium, pitch, groundskeeping, facilities, weather, fmx-142]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-142
related:
  - [[../pitch-condition-state-ownership-2026-06-14]]
  - [[../../10-Architecture/bounded-context-map]]
  - [[../../10-Architecture/09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch]]
  - [[../../10-Architecture/state-machines/pitch-condition]]
---

# Raw capture - Pitch-condition real-world operations (Perplexity, 2026-06-14)

Perplexity capture for **FMX-142**. Status `raw`: this is source input only; the
synthesis is [[../pitch-condition-state-ownership-2026-06-14]].

No FMX private data, secrets or user data were sent. Prompts were generic
football operations and product research prompts.

## Prompt

**Prompt.** In professional football and stadium operations, who owns the
condition and maintenance of the playing surface: the stadium/club operations
team, a weather/meteorology provider, match officials or a competition body?
Research real-world pitch maintenance, facility management, weather risk,
drainage, undersoil heating, covers and playability implications. Include
sources and implications for a football-manager game domain model.

## Key captured findings

- Operational responsibility for pitch quality lives with the venue/stadium
  owner or operator and its grounds/facility team. They maintain the surface,
  drainage, heating/cooling, covers, maintenance equipment and match-prep
  cadence.
- Governing bodies set standards and inspection expectations; they do not own
  the club's ongoing pitch state. Referees/match officials may rule a pitch
  playable or unplayable at match time, but that ruling is not the maintenance
  aggregate.
- Weather services and forecasts are inputs. They affect watering, covers,
  heating, drainage risk and safety planning, but they are not the owner of
  pitch-condition state.
- Realistic football levers are facility-side: drainage, irrigation, undersoil
  heating, ventilation/vacuum/cooling systems, covers, maintenance planning and
  recovery between events.
- FMX implication: pitch condition should be a Stadium Operations state shaped
  by weather facts, facility quality and usage. Environment & Climate should
  publish weather inputs; Stadium Operations should remain the state/event
  owner.

## Useful sources returned

- FIFA Stadium Guidelines, "Facility management":
  <https://inside.fifa.com/innovation/stadium-guidelines/general-process-guidelines/operations/facility-management>
- FIFA Stadium Guidelines, "Turf and pitch design":
  <https://publications-uat.fifa.com/en/football-stadiums-guidelines/general-process-guidelines/design/turf-and-pitch-design/>
- FIFA, "Natural Turf Guidelines" PDF:
  <https://www.engorussia.ru/upload-files/FIFA_Natural_Turf_Guidelines_Jan_2023_24012023.pdf>
- UEFA, "Pitch Quality Guidelines 2018" PDF:
  <https://hns.family/files/documents/19065/UEFA%20Pitch%20Quality%20Guidelines%202018%20EN.pdf>
- Football Foundation, "Pitch Maintenance Agreement Guidance Proforma":
  <https://footballfoundation.org.uk/sites/default/files/2023-01/Pitch%20Maintenance%20Agreement%20Guidance%20Proforma%20(Mar%2021).docx>
- Mondo Macchina, "Natural grass football pitches: maintenance and machinery":
  <https://www.mondomacchina.it/en/natural-grass-football-pitches-maintenance-and-machinery-c688>
- Pix4D, "Turf management for a football pitch":
  <https://www.pix4d.com/blog/turf-management-football-pitch>

## Source quality note

The synthesis treats FIFA/UEFA/Football Foundation guidance as stronger
football-domain evidence than vendor blogs. Vendor/industry pieces were used
only to cross-check operational vocabulary such as drainage, monitoring,
maintenance equipment and surface recovery.
