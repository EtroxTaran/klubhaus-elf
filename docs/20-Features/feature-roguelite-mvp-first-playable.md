---
title: Feature - Roguelite MVP First Playable
status: approved
tags: [feature, mvp, roguelite, first-playable]
created: 2026-05-18
updated: 2026-05-18
type: feature
binding: true
related: [[README]], [[../00-Index/MVP-Scope]], [[../50-Game-Design/GD-0017-mvp-scope-and-mode-sequencing]], [[../50-Game-Design/mode-create-a-club-roguelite]], [[feature-club-economy-mvp-pillar]], [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
---

# Feature - Roguelite MVP First Playable

This is the focused feature slice for the MVP. It translates
[[../00-Index/MVP-Scope]] and
[[../50-Game-Design/GD-0017-mvp-scope-and-mode-sequencing]] into an
implementable first playable.

## User story

As a new manager, I want to create a fictional club and play the opening week of
a roguelite run so that I understand the core loop, see meaningful stakes, and
know which deeper modes are coming later.

## MVP scope

In scope:

- Experience question and Roguelite-first onboarding.
- Mode step with:
  - **Create-a-Club Roguelite** playable now;
  - **Manage-a-Club Career** visible as "comes later".
- Fictional club setup: country/region, generated name suggestion, colours,
  crest and starter identity.
- Starter squad/read model sufficient for first tactics choice.
- First Home dashboard with feed-card guidance.
- Basic tactics choice from starter presets.
- First match resolution and report.
- Club Economy MVP pillar foundation: weekly ledger, runway/risk feedback and
  staged crisis visibility.
- Server-confirmed progression; Dexie cache/drafts only.
- Offline shell/read/draft behavior with explicit "requires connection" copy
  for final actions.

Out of scope:

- Manage-a-Club playable campaign.
- Full offline-first local-authoritative play.
- Save export/import UI.
- Async multiplayer, P2P transfers and watch parties.
- Deep multi-run legacy economy beyond minimum first-run flags.
- Final economy balance constants and payment/IAP systems.

## Gherkin scenarios

```gherkin
Feature: Roguelite MVP first playable

  Scenario: Start a Create-a-Club Roguelite run
    Given I open the app for the first time
    When I answer the experience question
    Then I see Create-a-Club Roguelite as playable
    And I see Manage-a-Club Career marked as coming later

  Scenario: Create a fictional club
    Given I choose Create-a-Club Roguelite
    When I accept or edit the generated club identity
    Then a new roguelite run is created after server confirmation
    And no real club, player, stadium or sponsor names are used

  Scenario: Reach first tactical choice quickly
    Given my roguelite run has been created
    When I land on the Home dashboard
    Then the primary feed-card points me to the first tactical choice
    And the flow can reach that choice in under 60 seconds on the default path

  Scenario: Resolve the first match
    Given I confirmed a starter tactic
    When I start the first match while online
    Then the match is resolved through the authoritative command path
    And I see a match report with result, basic stats and next action

  Scenario: Work with drafts while offline
    Given I lose network connectivity on the tactics screen
    When I edit my tactic
    Then the tactic is saved as a local draft
    And the UI says it requires connection before final submission

  Scenario: Export and import are planned but not shipped
    Given I open save management in the MVP
    Then export/import is not an active flow
    But the product copy may label it as coming later
```

## Acceptance criteria

- A new user can enter the Roguelite flow without encountering Career-only
  choices.
- The Career promise is visible as "comes later" and cannot be started.
- The first playable uses server-confirmed state for durable progression.
- Local drafts and cached reads are labelled as local/stale rather than final.
- The implementation links to the save envelope and offline-ready contracts but
  does not build full export/import.
- UI and docs keep the long-term mode matrix visible without expanding MVP
  scope.

## Related

- [[../00-Index/MVP-Scope]]
- [[../50-Game-Design/GD-0017-mvp-scope-and-mode-sequencing]]
- [[../50-Game-Design/mode-create-a-club-roguelite]]
- [[feature-club-economy-mvp-pillar]]
- [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
