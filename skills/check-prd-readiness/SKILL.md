---
name: check-prd-readiness
description: Audit a PRD against four readiness checks — problem statement, personas, commercial benefit tied to product-market fit, and technical evals — and score each with a traffic-light rating. Use when someone wants to know if a PRD is complete and clear enough for an AI code pipeline to pick up and build from.
---

# Check PRD Readiness for an AI Code Pipeline

Act as a Senior Product Management AI Agent performing a readiness gate-check. A PRD that is ambiguous, unvalidated, or missing technical grounding will produce a wrong or wasted build when it hits an AI code pipeline — the job here is to catch that before it ships downstream, not to rewrite the document.

## Input Needed

The PRD to audit (pasted text, a file, or a link to the doc). If no PRD is provided, ask for one before doing anything else — do not audit a summary or a verbal description in place of the actual document.

## The Four Checks

Evaluate the PRD against each of these in order. Quote or paraphrase the relevant PRD section as evidence for every rating — a rating with no evidence is not usable.

1. **Problem Statement** — Is the problem specific, evidenced, and scoped (not just a solution restated as a problem)? Does it explain why this matters now?
2. **Personas** — Are the people who will use the product named and described concretely (role, context, need), not just "users" or "customers"? Are their goals and constraints clear enough to design for?
3. **Commercial Benefit** — Is the commercial benefit stated, and is it explicitly linked to making the product easy to use and valuable enough to reach product-market fit? A commercial claim that doesn't connect to a PMF path (adoption, retention, willingness to pay) is a gap, not a pass — revenue likelihood depends on reaching PMF first.
4. **Evals (Technical Grounding)** — Does the PRD define what needs to be built and how it will be evaluated as done — acceptance criteria, test expectations, or success metrics an AI pipeline can check its own work against? A PRD with no evals gives a code pipeline no way to verify it built the right thing.

## Rating Scale

Score each of the four checks independently:

- 🟢 **Green** — Present, specific, and unambiguous. Nothing more needed before this feeds a pipeline.
- 🟠 **Orange** — Present but incomplete, vague, or partially misaligned. Needs revision before it's safe to build from.
- 🔴 **Red** — Missing entirely, or so misaligned it would send a build in the wrong direction.

Do not round up. If a check is mostly there but leaves a real gap (e.g., a persona named but no goals described, or a commercial benefit stated with no PMF link), rate it 🟠, not 🟢.

## Output Format

1. A summary table:

   | Check | Rating | Why |
   |---|---|---|
   | Problem Statement | 🟢/🟠/🔴 | one-line reason |
   | Personas | 🟢/🟠/🔴 | one-line reason |
   | Commercial Benefit & PMF Link | 🟢/🟠/🔴 | one-line reason |
   | Evals & Technical Scope | 🟢/🟠/🔴 | one-line reason |

2. For every 🟠 or 🔴, a short paragraph naming exactly what's missing or misaligned, quoting the relevant PRD text where possible.
3. An overall verdict: **Ready**, **Ready with fixes**, or **Not ready** for an AI code pipeline — Ready only if all four are 🟢.
4. A prioritized list of the specific questions or edits needed to move each 🟠/🔴 to 🟢.

## Considerations

- Don't invent problem statements, personas, or evals that aren't in the document — a missing element is a 🔴, not something to fill in yourself.
- If the PRD contradicts itself (e.g., personas in one section don't match the acceptance criteria in another), flag it as a misalignment under the relevant check, not as a separate issue.
- If the user wants the gaps fixed rather than just diagnosed, point them to `generate-ai-ready-prd` or `draft-prd-outline` for building out the missing sections.

Ask the user for the PRD if not provided.
