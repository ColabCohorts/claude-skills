---
name: explain-this-codebase
description: Analyze a codebase folder and produce a plain-English report, written for a reader with no engineering background, covering the tech stack (frontend, backend, database, other technologies), architecture, key user workflows/personas, any tech-debt or limitation notes found in code comments/docs, and backlog-ready improvement suggestions formatted for Jira or Linear — with links out to learn more about each technology. Use when a product manager or other non-engineer wants to understand how an application works by pointing at a folder, or when anyone wants a fast onboarding summary of an unfamiliar repo.
argument-hint: "[path-to-folder] (defaults to current directory)"
---

# Explain Codebase

Produce a plain-English explanation of a codebase for a genuinely non-technical audience — think a product manager with no coding background, not a junior engineer. This skill must work on **any** codebase, in any language/framework — do not assume the stack in advance. Discover it from the files.

**The bar for "plain English":** if a reader would need to Google a term to follow a sentence, either cut the term, define it in the same clause, or link to somewhere they can learn more (see step 6). Optimize for a reader skimming on their phone, not one studying the repo.

## 0. Resolve the target

- If `$ARGUMENTS` gives a path, analyze that folder. Otherwise default to the current working directory.
- Confirm the path exists before proceeding. If it's a monorepo with multiple independently-deployable projects (e.g. `apps/web`, `apps/api`, `services/*`), note that up front and cover each briefly rather than picking one arbitrarily.

## 1. Discover the stack

Don't guess — find evidence in manifest/config files. Check for (whichever are present):

**Frontend**
- `package.json` — look at `dependencies`/`devDependencies` for framework signals: `react`, `next`, `vue`, `nuxt`, `@angular/core`, `svelte`, `solid-js`. Note the framework version and language (`typescript` devDependency vs plain JS).
- Build tooling: `vite.config.*`, `webpack.config.*`, `next.config.*`, CRA scripts.
- Styling: `tailwind.config.*`, `styled-components`, CSS modules, Sass.
- State management: `pinia`, `redux`, `zustand`, `vuex`, `mobx`, React Context usage.

**Backend**
- Node: `express`, `fastify`, `koa`, `@nestjs/core` in `package.json`.
- Python: `requirements.txt` / `pyproject.toml` — `django`, `flask`, `fastapi`.
- Ruby: `Gemfile` — `rails`, `sinatra`.
- Java/Kotlin: `pom.xml` / `build.gradle` — Spring Boot.
- Go: `go.mod` — `gin`, `echo`, `chi`, or stdlib `net/http`.
- PHP: `composer.json` — `laravel/framework`, `symfony`.
- .NET: `*.csproj` — ASP.NET Core.
- Serverless/BaaS: look for `serverless.yml`, `template.yaml` (SAM), Vercel/Netlify functions, Supabase/Firebase config, AWS CDK/Terraform.
- **If no backend code lives in this repo**, check `.env.example` or config for an API base URL (e.g. `VITE_API_BASE_URL`, `NEXT_PUBLIC_API_URL`) and any docs describing the external API (README, `/docs`, `.kiro/`, `/steering`, ADR folders). State plainly: "this repo is frontend-only; it consumes a backend hosted elsewhere at X" rather than inventing backend detail you can't see.

**Database**
- ORM/query layer: `prisma/schema.prisma`, `sequelize`, `typeorm`, `mongoose`, SQLAlchemy models, ActiveRecord migrations, `knex`.
- Infra-as-config: `docker-compose.yml` services (`postgres`, `mysql`, `mongo`, `redis`), Terraform/CDK resources.
- Env vars in `.env.example` hinting at DB/service choice (`DATABASE_URL`, `POSTGRES_*`, `MONGO_URI`, `SUPABASE_*`, `FIREBASE_*`, `DYNAMODB_*`).
- Migration folders (`migrations/`, `db/migrate/`, `prisma/migrations/`).

**Other notable technologies**
- Auth: Auth0, Clerk, Firebase Auth, Cognito, custom JWT — check dependencies and env vars.
- Testing: Jest, Vitest, pytest, RSpec, Playwright/Cypress.
- CI/CD: `.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`.
- Hosting/infra clues: Vercel/Netlify config, Dockerfile, k8s manifests.

If something can't be determined from the code, say so explicitly rather than guessing ("no test framework detected" is a valid, useful finding).

## 2. Map key workflows and user roles

- Find where user roles/permissions are defined: route guards, middleware, auth checks, role enums, RBAC config. Identify the distinct personas the app serves (e.g. Admin, Mentor, Mentee, Guest, Org Owner). If the app has an explicit persona/role enum or RBAC table, use it as the source of truth. If instead you're inferring personas from scattered permission checks and feature gating, **say so** — label them "inferred" rather than presenting them as a definitive list, and note in Open Questions where the authoritative list would come from.
- Walk the app's routing (`router/`, `pages/`, `app/`, URL/controller definitions) and group screens/endpoints into the workflows a user actually performs — not a file-by-file inventory. Think in terms of "what can each persona *do*": sign up, get matched, book a session, review progress, manage members, etc.
- For each workflow, note which persona(s) use it and reference the primary file(s) so a reader could go look (e.g. `src/views/PairingView.vue`).
- Prefer breadth over exhaustive depth: cover every major feature area once rather than every edge case.

## 3. Surface tech debt and limitations

Search the codebase (not just source — also READMEs, ADRs, design docs) for:
- Comment markers: `TODO`, `FIXME`, `HACK`, `XXX`, `@deprecated`, `NOTE:`, `WARNING:`.
- Language hinting at known gaps: "temporary", "workaround", "hack", "legacy", "not implemented", "for now", "revisit", "technical debt".
- Explicit limitations documented in README/docs files (known issues, roadmap, "out of scope" sections).

Report each with a one-line plain-English translation of why it matters, plus a `file:line` pointer. Group related ones together instead of listing 40 near-duplicates. A precise `file:line` is ideal, but on a large codebase where enumerating every line isn't practical, a file-level or doc reference (or the tracking-ticket ID if the comment carries one) is acceptable — don't drop a real finding just because you can't pin an exact line.

## 4. For large codebases

If the folder is large enough that reading everything serially would be slow, delegate discovery to parallel subagents (one per major area — e.g. frontend, backend, infra/config) via the Agent tool, each reporting back stack findings, workflow findings, and tech-debt findings for its area. Synthesize their results yourself into the single report below — don't just concatenate their raw output.

**Instruct each subagent explicitly** to: actually read files and grep (use Glob/Grep/Read), return raw findings with `file:line` references, and **not invoke any skills** — this is read-only exploration, not a task that triggers other skills.

**Before you trust a subagent's result, sanity-check it — subagent output is unreliable in two specific ways this skill has hit repeatedly:**

1. **A subagent may return nothing useful.** If a result comes back suspiciously fast, with zero tool calls, or with text that doesn't answer what you asked (e.g. generic boilerplate or leaked instructions instead of findings), treat it as a failed run: discard it and relaunch that area with a sharper prompt. Do **not** synthesize from an empty or off-topic result.
2. **A subagent may re-report with a fuller result.** The same agent can finish once with a thin first pass and then complete again with a far more thorough one. A quick first `completed` is often *not* the final word. Before synthesizing, wait for each area's genuinely-final result, and when an agent reports more than once, **treat the most complete report as authoritative and reconcile** — a fuller pass routinely corrects stack facts (framework/package versions, which auth or data stores are actually used), upgrades "inferred/uncertain" personas into a concrete role model, and surfaces whole technologies the thin pass missed. Don't lock in the report off a first pass you'd be embarrassed to have been wrong about.

Verify each area's findings look real (non-zero tool calls, concrete `file:line` references) before folding them into the report.

## 5. Simplify complex implementations

Some things in a codebase are genuinely intricate — auth token flows, permission/role logic, calculated/derived fields, background jobs, polling, idempotency, caching, eventual consistency. A non-technical reader doesn't need the mechanism, they need a mental model of *what it does and why it's built that way*.

For each complex piece you decide to mention:
- Skip the internal mechanics (algorithms, data structures, specific API calls) unless the mechanics themselves are the point (e.g. it's the thing flagged as fragile tech debt).
- Replace it with a one- or two-sentence analogy or plain-language restatement a reader with no coding background would get in one pass. E.g. instead of "the server computes `floor(weeksSinceStart / windowSize) + 1`", say "the app automatically checks how far into the programme a pair is and whether they've had enough sessions for that point — like a syllabus pace tracker."
- Only go into implementation detail when it's directly relevant to a tech-debt or limitation finding (there, the specific file/line is the useful part).
- If a whole workflow is inherently complex (e.g. a multi-step approval chain), consider a short numbered list of plain-language steps instead of a paragraph.

## 6. Link out so the reader can learn more

The first time you name a specific technology, framework, pattern, or third-party service (in the Stack Overview or elsewhere), link it so a curious PM can go read more on their own.

Rules for links — accuracy matters more than coverage:
- **Only use canonical, well-known URLs you're already confident about**: a project's official homepage/docs (e.g. an official `*.dev`, `*.org`, or vendor docs domain), MDN for web-platform concepts, or a widely recognized reference for that exact concept (e.g. jwt.io for JWTs). These are stable and safe to link without checking.
- **Never fabricate or guess a URL.** If you aren't sure of the exact canonical link for something less common, either use WebSearch to confirm the real URL first, or simply don't link it — an unlinked term is better than a broken or wrong one.
- Link each distinct technology once (on first mention), not every time it's named again.
- Don't link generic programming terms a PM doesn't need a citation for (e.g. "form", "button", "login page") — reserve links for the named technologies/services/patterns that make up the stack.

## 7. Draft backlog-ready improvement suggestions

Turn what you found in step 3 (and any glaring friction you noticed while mapping workflows in step 2 — e.g. a manual step that could obviously be self-serve) into a short list of suggested backlog items. Ground every suggestion in something you actually observed — a comment, a doc callout, a missing capability you saw while tracing a workflow. Don't invent product features the codebase gives no evidence for; this is "here's what the code is telling us," not a roadmap brainstorm.

For each suggestion, first write the human-readable ticket summary, then two ready-to-use **agent prompts** — one for Jira, one for Linear — that the PM can copy-paste directly into that tool's AI agent (Atlassian's Rovo/Jira Assistant, or Linear's AI agent) or into Claude if it has Jira/Linear MCP tools connected. Fields for the human-readable summary:
- **Title** — short, imperative, e.g. "Add self-serve cohort archiving to admin UI."
- **Type** — Bug / Improvement / Tech Debt / Task (pick the closest fit).
- **Suggested priority** — High / Medium / Low, with a half-sentence reason.
- **Description** — plain language: what's wrong or missing today, and what "done" looks like. No code-level detail unless it's genuinely load-bearing (e.g. "the fragile role-lookup" needs enough detail that an engineer knows which file to open).
- **Source** — file:line or doc reference backing the suggestion, so whoever triages it can go verify.

**Every agent prompt must open with a duplicate check before it authorizes creating anything** — the point is to avoid an agent blindly filing a duplicate of something already tracked. Structure each prompt as: (1) search first, (2) only create if nothing close enough already exists, (3) if something close does exist, stop and report it instead of creating. Adapt vocabulary per tool:
- *Jira*: map Type to Jira's issue types (Bug/Story/Task), call out Priority as its own field, and instruct the agent to search the target project by summary/description keywords first.
- *Linear*: Linear's own vocabulary is Bug/Feature/Improvement and priority levels are No priority/Low/Medium/High/Urgent — use that language, and instruct the agent to search the target team's issues first.

Leave the specific project/team as a placeholder (e.g. `[Jira project key]`, `[Linear team]`) for the PM to fill in, since this skill has no way to know which one they use — don't guess a real project key or team name.

Template for each suggestion's prompts:

~~~text
Jira agent prompt:
"""
Search the [Jira project key] project for any existing issue whose summary or description overlaps with: '[Title]'. If a close match already exists, reply with its issue key and a one-line explanation of the overlap — do not create a new issue. If no close match exists, create a new issue:
- Project: [Jira project key]
- Issue type: [Bug/Story/Task]
- Summary: [Title]
- Priority: [High/Medium/Low]
- Description: [Description]  (Source: [file:line or doc reference])
"""

Linear agent prompt:
"""
Search the [Linear team] team for any existing issue whose title or description overlaps with: '[Title]'. If a close match already exists, reply with its identifier and a one-line explanation of the overlap — do not create a new issue. If no close match exists, create a new issue:
- Team: [Linear team]
- Type: [Bug/Feature/Improvement]
- Title: [Title]
- Priority: [Urgent/High/Medium/Low/No priority]
- Description: [Description]  (Source: [file:line or doc reference])
"""
~~~

If Jira or Linear MCP tools are already connected in this session (check via ToolSearch for "jira"/"linear" if unsure), you may offer to run the search-then-create flow directly instead of only emitting the prompt text — but still perform the duplicate search first, and still surface the ticket summary so the PM sees what's about to be filed before it's created.

Order suggestions most-impactful-first, not in the order findings were discovered.

## 8. Write the report

Output directly in the chat as Markdown, written for a reader with no engineering background — define any acronym or framework name the first time it's used, and apply the simplification and linking rules above throughout, not just in the Stack Overview. Use this structure:

```markdown
# [App Name] — Codebase Explainer

## Stack Overview
- **Frontend:** language, [framework](canonical-link), key libraries
- **Backend:** language, [framework](canonical-link) (or "none in this repo — see note")
- **Database:** [technology](canonical-link) + how the app talks to it, in plain language
- **Other technologies:** auth, testing, hosting/infra, CI/CD — each linked on first mention

## Architecture at a Glance
2-4 sentences on how the pieces fit together (one repo vs. multiple, how frontend/backend/db relate, deployment model if visible) — written as you'd explain it to someone who's never seen a system diagram.

## Key User Workflows
### [Persona name]
- What they can do, in plain language, with a pointer to where it lives in code. Where a workflow involves something intricate under the hood, use the plain-language/analogy treatment from step 5 instead of naming the mechanism.
(repeat per persona)

## Tech Debt & Known Limitations
- Grouped findings with plain-English explanation of *why it matters to the product/user*, plus file:line references for whoever picks it up next.

## Suggested Backlog Items
Most-impactful-first. Each includes a ready-to-paste prompt for Jira's or Linear's AI agent that checks for duplicates before creating anything.

### [Ticket title]
- **Type:** Bug / Improvement / Tech Debt / Task
- **Suggested priority:** High / Medium / Low — half-sentence reason
- **Description:** plain-language problem + what "done" looks like
- **Source:** file:line or doc reference

**Jira agent prompt:**
```
Search the [Jira project key] project for any existing issue whose summary or description overlaps with: '[Title]'. If a close match already exists, reply with its issue key and a one-line explanation of the overlap — do not create a new issue. If no close match exists, create a new issue:
- Project: [Jira project key]
- Issue type: [Bug/Story/Task]
- Summary: [Title]
- Priority: [High/Medium/Low]
- Description: [Description]  (Source: [file:line or doc reference])
```

**Linear agent prompt:**
```
Search the [Linear team] team for any existing issue whose title or description overlaps with: '[Title]'. If a close match already exists, reply with its identifier and a one-line explanation of the overlap — do not create a new issue. If no close match exists, create a new issue:
- Team: [Linear team]
- Type: [Bug/Feature/Improvement]
- Title: [Title]
- Priority: [Urgent/High/Medium/Low/No priority]
- Description: [Description]  (Source: [file:line or doc reference])
```
(repeat per suggestion)

## Learn More
- One line per technology named above: **[Name](link)** — one-sentence plain-language description of what it's for and why this app uses it.
- Only include technologies you linked with a confirmed canonical URL — don't pad this list with unlinked terms.

## Open Questions
- Anything that couldn't be determined from the code alone.
```

Keep the whole report scannable — a PM should be able to read it in under five minutes and come away knowing what the app does, who uses it, where the rough edges are, and where to go learn more about any piece of it.
