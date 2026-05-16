---
title: Linear Issue Examples
status: current
tags: [meta, templates, linear, examples]
created: 2026-05-17
updated: 2026-05-17
type: template
binding: true
related:
  - [[linear-issue]]
  - [[../../30-Implementation/linear-task-tracking]]
---

# Linear Issue Examples

Use these examples as copy-adapt templates when creating new issues in Linear.

## Example 1: Feature issue

### Title

`transfer: add counter-offer expiration handling for async cadence`

### Context

- Why this matters now: transfer flow stalls when one side never responds.
- Who is impacted: players in async private groups using transfer negotiations.
- Constraints or assumptions: must align with cadence rules and server-authoritative flow.
- Links: `docs/20-Features/feature-p2p-transfer-negotiation.md`, `docs/50-Game-Design/transfer-negotiations-p2p.md`

### User Story

As a club manager, I want counter-offers to expire automatically, so that negotiations resolve without blocking weekly progression.

### Gherkin Scenarios

```gherkin
Scenario: Counter-offer expires without response
  Given a counter-offer is in "pending response" state
  And the configured expiration window has elapsed
  When the weekly progression job runs
  Then the counter-offer is marked as expired
  And both parties receive a negotiation update event
```

```gherkin
Scenario: Counter-offer accepted before expiration
  Given a counter-offer is in "pending response" state
  When the responding party accepts before expiration
  Then the transfer continues to the next state
  And no expiration event is emitted
```

### Acceptance Criteria

- [ ] Expiration timestamp is persisted for each counter-offer.
- [ ] Expired counter-offers transition deterministically.
- [ ] Notification/event payload includes `reason: expired`.
- [ ] Existing happy-path negotiation behavior remains unchanged.

### Out of Scope

- Real-time push UX polish.
- Contract clause renegotiation beyond existing transfer states.

### Dependencies

- Blocked by: cadence scheduler event tick reliability task.
- Blocks: transfer inbox stale-offer cleanup.
- Related: transfer state machine hardening issue.

### Documentation Links

- Vault source notes: `docs/20-Features/feature-p2p-transfer-negotiation.md`
- ADRs: `docs/10-Architecture/09-Decisions/ADR-0014-state-machines.md`
- Implementation notes: `docs/30-Implementation/linear-task-tracking.md`

### Verification / Test Notes

- Automated checks: state-machine unit tests + deterministic replay test.
- Manual validation: simulate offer, wait past expiry, verify state and notifications.
- Rollout notes: track count of expired counter-offers per cycle.

---

## Example 2: Bug issue

### Title

`ui-matchday: fix watch-party timeline desync after reconnect`

### Context

- Why this matters now: reconnecting spectators can see timeline jumps.
- Who is impacted: async multiplayer users in watch party sessions.
- Constraints or assumptions: snapshot stream remains source of truth.
- Links: `docs/20-Features/feature-watch-party.md`, `docs/10-Architecture/09-Decisions/ADR-0015-spectator-snapshot-streaming.md`

### User Story

As a spectator, I want the timeline to resume at the correct delayed position after reconnect, so that match playback remains coherent.

### Gherkin Scenarios

```gherkin
Scenario: Reconnect resumes at correct delayed offset
  Given a spectator disconnects during a live watch-party session
  And the session delay is configured
  When the spectator reconnects
  Then the timeline resumes from the last acknowledged delayed snapshot
  And no duplicate event burst is shown
```

```gherkin
Scenario: Late reconnect while match already ended
  Given the match reached final whistle
  When a spectator reconnects
  Then the client receives terminal snapshot state
  And timeline controls are consistent with completed state
```

### Acceptance Criteria

- [ ] Reconnect path restores playback offset from authoritative snapshot metadata.
- [ ] Duplicate events are deduplicated on resume.
- [ ] Final state reconnect produces stable completed timeline.

### Out of Scope

- New timeline UI controls.
- Mobile-specific buffering optimization.

### Dependencies

- Blocked by: snapshot metadata integrity fix.
- Related: watch-party stream lag observability issue.

### Documentation Links

- Vault source notes: `docs/20-Features/feature-watch-party.md`
- ADRs: `docs/10-Architecture/09-Decisions/ADR-0015-spectator-snapshot-streaming.md`

### Verification / Test Notes

- Automated checks: reconnect integration tests in multiplayer harness.
- Manual validation: disconnect/reconnect at 3 match phases.
- Rollout notes: monitor reconnect error rate and timeline correction count.

---

## Example 3: Research issue

### Title

`research-offline: evaluate conflict resolution UX patterns for rejected_with_reason`

### Context

- Why this matters now: current policy is hard reject with server reason; UX patterns need clear guidance.
- Who is impacted: offline players resyncing after divergent local actions.
- Constraints or assumptions: policy remains no auto-rebase at MVP.
- Links: `docs/10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer.md`, `docs/60-Research/wave-3-gap-analysis.md`

### User Story

As a player returning from offline mode, I want clear conflict explanations and recovery options, so that I can continue without confusion.

### Gherkin Scenarios

```gherkin
Scenario: Offline action rejected after reconnect
  Given a player performed an action offline
  And server state changed before reconnect
  When sync submits the offline action
  Then the action is rejected with machine-readable reason
  And the player sees recommended next actions
```

```gherkin
Scenario: Multiple rejected actions in one sync batch
  Given a reconnect submits several stale actions
  When sync processing rejects multiple actions
  Then grouped feedback is shown without losing chronology
  And user can inspect each rejection reason
```

### Acceptance Criteria

- [ ] Produce comparison matrix of at least 5 UX patterns from relevant games/apps.
- [ ] Recommend one MVP UX pattern + one post-MVP enhancement.
- [ ] Map recommendations to existing ADR constraints.
- [ ] Link final research output note in vault.

### Out of Scope

- Implementing conflict resolution UI.
- Policy changes to offline conflict handling.

### Dependencies

- Related: multiplayer error taxonomy issue.
- Related: notification copy guidelines task.

### Documentation Links

- ADRs: `docs/10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer.md`
- Research target note: `docs/60-Research/`

### Verification / Test Notes

- Validation: peer review by product + architecture owners.
- Exit criteria: recommendation promoted into a current note.
