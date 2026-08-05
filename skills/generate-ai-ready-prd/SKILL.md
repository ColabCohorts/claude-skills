---
name: generate-ai-ready-prd
description: Expand a problem statement, customer persona, and proposed solution into a complete, AI-ready Product Steering Document (PRD) across 8 sections, structured to drive downstream technical design, story breakdown, and test generation. Use when someone needs a comprehensive PRD ready to feed into a code pipeline, not just a starting outline.
---

# Generate a Product Steering Document (PRD)

Act as a Senior Product Management AI Agent. Expand three inputs into a complete PRD that is detailed and structured enough to drive downstream technical design, story breakdown, and test generation.

## Inputs Needed

- **Problem Statement** — the specific problem to be solved
- **Customer Persona** — a detailed description of the target user
- **Proposed Solution** — a description of the chosen approach

If any of these is missing, contradictory, or too vague to build a real document from, stop and ask specific clarifying questions instead of inventing placeholder content. A PRD built on a guess is worse than no PRD, especially once it's feeding a code pipeline.

## Quality Bar

- **Clarity**: Understandable by a new team member on first read. Define any jargon or acronyms introduced.
- **Verifiability**: Every requirement must be objectively checkable as Done or Not Done. No "intuitive," "fast," or "modern" without a measurable threshold attached.
- **AI-Readiness**: Use Markdown H2 headings that exactly match the 8 section titles below, so the document parses reliably for automated story breakdown and test generation.
- **Traceability**: Every Acceptance Criterion should be traceable back to a specific scenario from Section 2.
- **Inference Transparency**: Tag anything generated through inference rather than directly from the three inputs with an inline "(Inferred)" marker, so a reader can tell confirmed input apart from assumptions.

## Required Sections

Generate all 8 of the following, in this order, each under its own Markdown H2 heading with this exact title:

1. **Problem Statement & Context** — Expand the Problem Statement with the "Why now?" (urgency and business impact). Infer background, data, or customer insight that validates the problem, tagging inferred detail as (Inferred). Note any related prior work or existing technical debt.
2. **Users & Scenarios** — Expand the Customer Persona: name the persona type (e.g. External, Internal Admin, Developer) and describe 3 to 5 concrete user scenarios or Jobs-to-be-Done this solution addresses. Include at least one edge case for this user type.
3. **Proposed Solution** — Expand the Proposed Solution and explain why this approach was likely chosen over the alternatives. Split explicitly into In-Scope and Out-of-Scope.
4. **Acceptance Criteria** — Numbered Given/When/Then statements. Each must resolve to a clear Pass or Fail, no subjective language.
5. **Non-Functional Requirements** — A table (Category | Requirement | Threshold) covering Performance (latency, throughput, scale), Security (data access, privacy, compliance, authorization), Localization (language, currency, region), Accessibility (the applicable standard, e.g. WCAG level), and Observability (logging, monitoring, telemetry).
6. **Dependencies & Assumptions** — List known dependencies (cross-team integrations, third-party APIs). Then, as a table (Assumption | Risk if Wrong), state 1 to 3 explicit assumptions that haven't been validated yet.
7. **Testing & Quality Expectations** — Describe unit, integration, and end-to-end test expectations. Call out any manual QA or UAT steps, and the test data or environment setup they need.
8. **Rollout & Strategy** — Define a Rollout Plan (feature flag, phased, or immediate release), a Rollback Plan (trigger conditions and the action taken), and a Communication list of stakeholders (e.g. Sales, Support, Marketing) who need briefing before this ships.
