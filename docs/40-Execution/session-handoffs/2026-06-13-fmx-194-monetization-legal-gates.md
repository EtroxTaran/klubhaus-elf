---
title: FMX-194 Monetization legal gates handoff
status: current
tags: [handoff, execution, monetization, legal, compliance, fmx-194]
created: 2026-06-13
updated: 2026-06-13
type: handoff
binding: false
linear: FMX-194
related:
  - [[../../60-Research/monetization-legal-gates-2026-06-13]]
  - [[../../40-Compliance/monetization-legal-gates-evidence-2026-06-13]]
  - [[../../10-Architecture/09-Decisions/ADR-0109-payment-provider-and-monetization-legal-gates]]
  - [[../fmx-194-monetization-legal-gates-decision-queue-2026-06-13]]
---

# FMX-194 Monetization legal gates handoff

## Goals

- Close the ADR-0063 open legal-sensitive gates with research, options and a
  Nico decision queue.
- Save Perplexity and source-check evidence for payment provider, refund,
  age-gate and paid soft-launch compliance.
- Create the compliance evidence home requested by Linear.

## Completed

- Linear FMX-194 moved to `In Progress`.
- Branch: `codex/fmx-194-monetization-legal-gates`.
- Research saved:
  - [[../../60-Research/raw-perplexity/raw-payment-provider-mor-vs-direct-2026-06-13]]
  - [[../../60-Research/raw-perplexity/raw-refund-spent-cash-policy-2026-06-13]]
  - [[../../60-Research/raw-perplexity/raw-age-gate-and-soft-launch-gates-2026-06-13]]
  - [[../../60-Research/raw-perplexity/raw-monetization-legal-source-checks-2026-06-13]]
- Synthesis saved at [[../../60-Research/monetization-legal-gates-2026-06-13]].
- Compliance checklist saved at
  [[../../40-Compliance/monetization-legal-gates-evidence-2026-06-13]].
- Draft ADR prepared:
  [[../../10-Architecture/09-Decisions/ADR-0109-payment-provider-and-monetization-legal-gates]].
- HITL decision queue prepared:
  [[../fmx-194-monetization-legal-gates-decision-queue-2026-06-13]].

## Open Tasks

- Nico must decide D1-D5 before ADR-0109 can become binding.
- Legal counsel must approve actual Terms, withdrawal text, imprint, privacy,
  DPA/AVV, refund policy, age gate and provider contracts before paid activation.
- Future implementation must re-check current provider/store docs and versions.

## Decisions Made

None binding. Recommended packet is D1=A, D2=A, D3=A, D4=A, D5=A.

## Blockers

- Legal review and Nico approval are required for all FMX-194 decisions.

## Durable Notes Updated

- Current-State, Decision-Log, Research Summary, Research Map, raw Perplexity
  index, Home and session handoff index should reference the packet.

## Promotion Needed

If Nico approves the packet, promote ADR-0109 to `accepted` / `binding: true`
and update ADR-0063/0107/0108 references plus Current-State/Decision-Log in the
same PR.

