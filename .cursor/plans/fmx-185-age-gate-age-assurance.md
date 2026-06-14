# FMX-185 age gate and rating evidence plan

## Goal

Create the FMX-185 decision packet and vault evidence trail for age-gate,
age-assurance and IARC/USK rating readiness.

## Steps

1. Confirm `FMX-185` is claimed in Linear and use branch
   `codex/fmx-185-age-gate-age-assurance`.
2. Preserve raw Perplexity research and targeted official source checks under
   `docs/60-Research/raw-perplexity/`.
3. Synthesize the recommendation in
   `docs/60-Research/age-assurance-and-iarc-rating-2026-06-14.md`.
4. Add the compliance evidence home under `docs/40-Compliance/`.
5. Draft non-binding ADR-0112 plus a Nico decision queue.
6. Update the existing privacy/auth/telemetry docs instead of creating a
   parallel age-gate source of truth.
7. Update front-door maps and session handoff.
8. Validate with docs checks before PR.

## Decision gate

Do not mark ADR-0112 as accepted or binding until Nico explicitly approves the
decision queue. The recommended line is privacy-minimal 16+ self-declaration,
no DOB, no persisted under-16 refusal, no optional telemetry before the gate,
and no KJM-grade AVS until the product adds adult/harmful/high-risk scope.
