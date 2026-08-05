---
name: build-prototype-harness
description: Builds a complete "prototype harness" — seven grounded steering docs (design.md, workflows.md, ethics.md, accessibility.md, seeddata.md, userprofiles.md, strategy.md) packaged as an installable Claude Code plugin — for ANY company, sourced from their real codebases and real internal knowledge (Drive, Slack, Notion, wikis, whatever's connected), so a coding agent stays grounded in that company's actual design patterns, customers, and guardrails instead of inventing generic ones. Use when asked to "build a prototype harness", "create steering docs for [company]", "set up vibe-coding guardrails for our team", "do what we did for Colab but for [company]", or similar. Company- and framework-agnostic — this is the general method, not Colab-specific content.
---

# Build a New Prototype Harness

This skill is the generalized version of how `colab-prototype-harness`
itself was built. See [references/worked-example.md](references/worked-example.md)
for the concrete, step-by-step case study — use it when demoing this skill
or when you want to see every step below applied for real.

## The core principle

**Every line in every doc must be traceable to something real** — a shipped
repo, an actual internal document, a real quote, a real number. Genericity
is the exact failure mode this exercise exists to prevent: a steering doc
that says "we value accessibility" or "our users are busy professionals" is
worthless. A steering doc that says "WCAG 2.1 AA is a named acceptance
criterion in `steering/prd.md`; touch targets must be 44×44px" is not. If
research turns up nothing for a section, say so explicitly in the doc
rather than filling the gap with plausible-sounding invention.

## What you're building

Seven markdown docs, each answering one question a coding agent needs
answered before it can work inside a real company's product context
without drifting into generic assumptions:

| Doc | Question it answers |
|---|---|
| `design.md` | What does this company's product actually look like, and how is it built? |
| `workflows.md` | How does this team actually work, and what's the real quality bar? |
| `ethics.md` | What must never be violated — privacy, IP, compliance, responsible-AI use? |
| `accessibility.md` | What accessibility bar does this company actually hold to? |
| `seeddata.md` | What does realistic mock/seed data look like for this company's real domain objects? |
| `userprofiles.md` | Who is this company actually building for? |
| `strategy.md` | Where is the business actually headed right now? |

This set is a proven baseline, not a rigid law — drop a doc that genuinely
doesn't apply, or add one (e.g. `localization.md` for a heavily
multi-region product) if a real, distinct concern doesn't fit the seven
above. Don't skip one just because research is hard for it; flag the gap
in the doc instead (see Step 3).

## Step 1 — Gather real sources before writing anything

Do NOT start drafting until you've actually looked. Concretely:

1. **Ask which real product repo(s) to source `design.md` and `seeddata.md`
   from**, if not already given. Look for: an existing design-system doc,
   component library, or style guide committed in the repo (check
   `steering/`, `.kiro/`, `docs/`, or the repo root — companies that
   already vibe-code often keep exactly this kind of doc); real API
   contracts (error shapes, auth patterns, role models); real data-
   generation scripts and their output schemas. If two or more repos
   share a design system, diff them — an identical file across repos is
   strong evidence it's the company's one real source of truth, not a
   one-off.
2. **Search every connected knowledge source** (Drive, Slack, Notion,
   Confluence, wikis — whatever's actually available in the session) for:
   ethics/privacy/IP-protection commitments, user personas or ICP
   documents, and strategy/roadmap material. Prefer the **most recently
   modified** strategy/roadmap artifact over an older "official-sounding"
   one — a live backlog spreadsheet updated last week beats a polished
   strategy deck from six months ago.
3. **Distinguish real internal material from teaching/example content.**
   Companies that train people on AI/vibe-coding often have example or
   template folders (fictional personas, sample one-pagers, workshop
   material) sitting in the same Drive right next to their real docs.
   Using a fictional teaching example as if it were real company data is
   a serious grounding failure — check the content's actual subject matter
   against what the company actually does before citing it.
4. **When nothing real turns up for a doc** (this will happen — most
   companies don't have a written "ethics policy"), synthesize that doc
   from the closest real, adjacent commitments instead (e.g. a security/
   privacy NFR in a real PRD, an IP-protection clause in a real contract
   or steering doc) and say so explicitly at the top of the file, so
   whoever reads it later knows to reconcile it if a formal doc surfaces.

## Step 2 — Confirm who the core customer actually is

This is the single highest-leverage question to get right, and the
easiest one for an agent to get wrong by defaulting to the most visible
product rather than the actual core business. Concretely:

- If a real strategy/revenue document exists, check the actual revenue or
  usage mix — the loudest, most user-facing product is not always the
  core business (e.g. a consumer-facing tool can be small relative to an
  enterprise/B2B engine that generates most of the revenue but has no
  flashy app of its own).
- Ask the user directly if it's ambiguous, rather than assuming. Getting
  this wrong means every persona, ethics priority, and strategy framing
  downstream is subtly off — this is exactly the kind of correction that's
  expensive to make after all seven docs are drafted, and cheap to make
  before.
- Write `userprofiles.md` and `strategy.md` to lead with the confirmed
  core customer, and demote (don't delete) any other real personas/
  products as clearly-labeled secondary ones.

## Step 3 — Draft the seven docs, one real citation at a time

- Open every doc with a one-line **"> Grounded in: ..."** citation naming
  the specific real sources used (file paths, doc titles, dates for
  anything time-sensitive like strategy).
- Prefer direct quotes and concrete numbers over paraphrase — a real
  quoted user complaint or a real named acceptance criterion is more
  useful to a future agent than a paraphrased summary.
- Cross-link the docs to each other where one doc's rule depends on
  another's (e.g. seed-data volume needed to exercise an anonymity
  threshold defined in ethics) using relative markdown links once they're
  real sibling files.
- End docs that have actionable guardrails with a short concrete
  checklist an agent can literally run through.

### Embedding real visual assets (logos, icons) as base64

`design.md` should carry the company's actual logo/brand mark inline, not a
placeholder `<img src="/logo.png">` a future agent has to go hunt down.
Concrete method — learned by getting it wrong once:

1. **Find the real file before reconstructing anything.** If a user pastes
   or uploads a logo image directly in conversation, you likely have no
   way to export the raw bytes of what you're only seeing as vision
   input — there's no tool for that. Before attempting to redraw or
   approximate it from pixels, check whether the real asset already
   exists in a real product repo (`public/`, `src/assets/`, `static/` —
   companies almost always commit logos there for the app to actually use
   them). Grep the repo for `logo` to find the exact filename and
   confirm it's really referenced/shipped, not just sitting unused.
2. **Confirm it's the right one before using it.** If more than one
   candidate exists (e.g. the same filename duplicated across repos),
   diff their hashes and dimensions and view them to pick the
   highest-quality/canonical copy — don't assume the first match found is
   authoritative.
3. **Downsize to real usage, not source resolution.** Grep the codebase
   for how large the logo is actually ever rendered (size classes,
   explicit width/height, CSS). Resize the source file down to roughly
   2x that real maximum — retina-crisp, not wastefully oversized — before
   encoding. A multi-thousand-pixel master embedded verbatim bloats the
   steering doc with base64 that gets re-read into context every single
   time an agent loads the file, for zero visual benefit at real usage
   sizes.
4. **Never hand-type or reproduce the base64 string yourself.** Do the
   extraction, resizing, and insertion entirely with scripts — a shell
   one-liner into `base64`, or a short script that reads the resized file
   and writes the exact string into the target doc programmatically.
   Manually retyping or reconstructing a multi-thousand-character base64
   blob is exactly the kind of task a model can silently produce a
   plausible-looking-but-wrong string for instead of the real data — this
   happened once already, on the very asset this section describes.
5. **Verify by round-tripping, every time.** After writing the base64
   into the doc, extract it back out programmatically, decode it to an
   actual image file, and view it to visually confirm it matches the
   source — before considering the step done. Don't trust that a
   string-replacement succeeded just because the tool call returned
   without error.
6. **Document the real usage convention alongside it** — e.g. a
   light/dark theme swap, or which variant goes where — sourced from how
   the real app actually switches between logo variants, not invented.

When a later prototype needs the logo, extract it from the steering doc
the same programmatic way (regex/script, never by retyping), and
round-trip-verify again once it's placed in the new file.

**This specific mistake recurred once already, in a new context worth
naming.** The first time, it happened editing an existing file (`design.md`)
to insert the asset — the fix was "use a script." The *second* time, it
happened while scaffolding a brand-new prototype file from scratch: with
no existing file to "edit," the natural move was to compose the whole
file — markup, logic, *and* the logo constant — in one authoring pass,
and the real string got hand-typed again as part of that. A written rule
("never hand-type it") wasn't enough to stop the mistake in a context the
rule didn't explicitly name. The concrete fix for this specific case: when
a new file needs an embedded asset, write the file first with a short,
obviously-fake placeholder in its place (e.g. `"PLACEHOLDER_LOGO"`), then
run a script that substitutes the real base64 in afterward — there should
never be a single authoring step where the real string and hand-typed
prose exist in the same tool call. Round-trip-verify after the
substitution, same as always.

## Step 4 — Package as an installable Claude Code plugin

- Structure: `.claude-plugin/plugin.json` (manifest) + `skills/<action-name>/`
  containing both `SKILL.md` (a skill whose description triggers on
  "build/scaffold/prototype for `<company>`" and whose body tells the
  agent which of the seven docs to always read vs. read situationally, in
  what order, and what to do when the docs conflict) **and** a nested
  `references/*.md` holding the seven docs themselves.
- **Nest the seven docs inside the skill's own directory — never at the
  plugin root.** A top-level `context/*.md` (or any folder outside
  `skills/<name>/`) silently fails to install when the plugin is used from
  claude.ai: only files living inside a skill's own directory tree are
  bundled there, so a plugin-root folder ships fine locally in Claude Code
  but arrives with nothing in claude.ai — no error, just an agent running
  on partial knowledge. This was found the hard way building
  `colab-prototype-harness` itself (see
  [references/worked-example.md](references/worked-example.md)); don't
  repeat it for a new company's harness.
- **Check whether the company already has a plugin/skill convention**
  (an existing marketplace repo, an existing plugin's folder shape) before
  inventing a new one — matching their existing pattern makes the new
  harness feel native instead of bolted-on, and means it can go in their
  existing marketplace rather than needing a new one.
- If a real marketplace repo exists, wire the new plugin in using the
  correct `source` schema for a plugin living in a separate repo (a
  `{"source": "github", "repo": "org/repo"}`-shaped object, not a bare
  relative path — bare relative paths only work for a plugin nested
  inside the marketplace repo itself). Confirm the schema against current
  docs rather than guessing; it changes.

## Step 5 — Test the harness before calling it done

This step is not optional and is the one most likely to get skipped under
time pressure. Spawn a **fresh agent with no memory of the drafting
conversation**, hand it only the skill file and the context docs (by path,
so it reads them itself), and give it a realistic, meaty build request —
ideally one that touches most of the seven docs at once (a persona,
a data-sensitive feature, a UI component, a strategic question). Ask it to:

1. Do a dry run — report exactly what it would say/ask/do, not actually
   scaffold code.
2. Then, explicitly, critique the skill and docs it just used — what was
   unclear, contradictory, missing, or forced it to guess. This second
   part is the valuable part; a dry run that only confirms things worked
   is a weaker test than one that surfaces real gaps.

Fix what it finds. A steering-doc harness that hasn't been stress-tested
by an agent that didn't help write it is unverified.

## Step 6 — Iterate as the company's reality changes

These docs are living, not a one-time artifact. When something is learned
that contradicts a doc — a new real design pattern ships, a persona
assumption turns out wrong, strategy shifts, a fresh test surfaces a gap —
update the relevant file immediately rather than letting the harness drift
stale relative to the company it's supposed to reflect.
