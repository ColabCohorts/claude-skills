# Worked example: how `colab-prototype-harness` was actually built

A concrete case study of the six steps in [SKILL.md](../SKILL.md), as they
played out for Colab Cohorts. Useful for demoing this skill, or as a
sanity check when applying it to a new company.

## The ask

*"Build a complete prototype harness of seven steering docs that keeps an
agent working inside their org's real design patterns and guardrails. Use
`colab-mentorship-hub` and `colab-salary-survey` as sources for design.md.
Scan colab's Google Drive for ethics and userprofiles as well as the latest
strategy."*

## Step 1 — Gathering real sources

- Read both named repos directly. Found each had its own `steering/`
  folder already (a strong signal the company already practices exactly
  this kind of grounding) — and, critically, both repos contained a
  `COLAB_DESIGN_SYSTEM.md` / `colab-design-system.md` that `diff`'d
  byte-identical. That confirmed it was the company's *one* real design
  system, not a per-project template — the single most load-bearing fact
  for `design.md`.
- Read `colab-mentorship-hub/.kiro/backend-api.md` (a real, live API
  contract: error shapes, idempotency-key pattern, role-based access
  table) and `colab-salary-survey/.kiro/steering/DATA_GENERATION.md` (a
  real data-generation script's documented field mappings) — both became
  the backbone of `workflows.md` and `seeddata.md`.
- Searched Drive broadly for "ethics", "user persona", "strategy" —
  the first few results were noisy (unrelated training decks, a
  completely different fictional client's persona doc) or matched on
  keyword without being the real thing. Kept narrowing the query
  (title-scoped searches, `fullText contains` combined with the company
  name) rather than accepting the first plausible-looking hit.
- Found the company's own internal "AI Tools & Rapid Discovery" guide —
  their own training material for using AI to prototype, which named the
  exact problem this whole harness solves ("context rot") and their own
  minimal 3-doc version of the same idea (one-pager/persona/guidelines).
  This became the opening justification in `workflows.md` — using the
  company's *own* stated reasoning for why steering docs matter, instead
  of asserting it generically.
- Found the actual strategy material in two pieces: a "[Confidential]
  Strategy Docs" doc (a WIP planning document) and a live roadmap/backlog
  spreadsheet. The spreadsheet's `modifiedTime` was days more recent than
  the strategy doc's — it became the primary source for "what's actually
  shipping right now," with the strategy doc providing the narrative/
  financial-target framing around it.
- Along the way, found a personal Drive folder full of *fictional* worked
  examples for a conference workshop (a made-up "SkyFreight Insights"
  product, a generic persona template) sitting right next to real company
  material. These were correctly excluded from `userprofiles.md` — using
  them would have been citing fiction as fact.

## Step 2 — Confirming the core customer

The first draft of `userprofiles.md` defaulted to the most visible,
consumer-facing products (an individual PM benchmarking salary, a
mentor/mentee pairing app) as the primary personas — because those were
the two named source repos. The user corrected this directly: *"Let's
focus more on Colab's core customers: Product teams — Product Managers,
Product Directors, and CPOs — with the core value being lean product
training and AI product skills."*

Re-checking the already-gathered strategy material confirmed it: the
2026 revenue target was $315k B2B vs. $95k B2C — the enterprise
relationship was the real core business, the two consumer apps were
real but secondary (community/brand-engine products). `userprofiles.md`,
`ethics.md`, and `strategy.md` were all rewritten to lead with the
enterprise Sponsor (Product Director/CPO) and Trainee (PM) personas, with
the original consumer personas demoted to clearly-labeled secondary status
rather than deleted.

**Lesson generalized into the skill:** don't default to whichever product
is most visible or was most explicitly named in the request — check the
real numbers, and ask if it's ambiguous.

## Step 3 — Drafting with citations

Each of the seven docs opened with a `> Grounded in: ...` line naming
specific files and Drive documents. Concrete real numbers and quotes were
preferred throughout — e.g. `ethics.md` cites the salary survey's actual
numbered acceptance criterion ("fewer than 3 entries → aggregate") rather
than paraphrasing it as "protect user privacy"; `userprofiles.md` quotes
real member-survey verbatims instead of inventing persona dialogue.

Where nothing real existed — no standalone "Colab Ethics Policy" document
was ever found — `ethics.md` says so explicitly at the top and explains
it was synthesized from the closest real, adjacent commitments (a
security/privacy NFR in a real PRD, an IP-protection clause in a real
platform steering doc) instead of inventing generic ethics language.

## Step 4 — Packaging as a plugin

Before inventing a structure, the sibling repos were checked for an
existing convention — and one existed: `colab-core-claude-skills` (later
corrected to the actively-maintained `colab-core-skills-for-claude`) was
already running a Claude Code plugin marketplace, with an existing plugin
(`colab-core-marketing`) shaped exactly as `context/*.md` + `skills/*/
SKILL.md` + `.claude-plugin/plugin.json`. The new harness matched that
shape exactly rather than inventing a different one, and was wired into
the *correct* marketplace repo (after the user flagged that the first one
was being retired) using the real `{"source": "github", "repo": "..."}`
schema — confirmed against current docs via a dedicated research pass
rather than guessed, since getting this wrong would silently fail to
install.

## Step 5 — Testing before declaring done

A fresh general-purpose agent — no memory of the drafting conversation —
was handed only the skill file and the seven context docs (by path, so it
read them itself) and given one realistic, meaty B2B request: *"a Product
Director wants a dashboard summarizing their team's AI/product maturity
assessment results, similar to what Colab did for Wood Mackenzie, with a
shareable one-page export."* This single request touched nearly every doc
at once: persona selection, IP-protection ethics, design-system reuse,
accessibility, seed-data shape, and strategy alignment.

It performed the dry run correctly — but its own critique of the skill
surfaced a real, previously-invisible contradiction: `strategy.md`
encouraged making survey/assessment outputs "shareable" for marketing,
while `ethics.md` required client-proprietary content to be access-locked
— and nothing told an agent how to reconcile a feature that was both at
once. That gap (and two smaller ones — an ambiguous framework tie-breaker,
and an unscoped anonymity rule) were fixed directly in the docs as a
result of this single test.

**Lesson generalized into the skill:** the critique step is the valuable
part of the test, not the dry run itself — a test that only confirms the
harness "worked" without adversarially probing its edges hasn't actually
verified anything.

## Step 6 — Iteration since

The harness has continued to change after the initial build: a frontend-
framework choice (React/Vue/"choose for me") and a code-quality-handoff
bar were added in response to new requirements; the skill itself was
renamed to match the target marketplace's naming convention
(`create-colab-prototype`); this very `build-prototype-harness` skill was
added as a second, generalized skill in the same plugin. None of this
required redrafting the original seven docs from scratch — each change
was a targeted edit to the specific doc(s) affected.

### The logo episode — a concrete near-miss worth knowing about

The user pasted two logo images (a black and a purple version of Colab's
"splat" mark) and asked for them to be added to `design.md` as base64.
Rather than trying to reconstruct the shape from the pasted pixels, a
grep for `logo` across both source repos turned up the real files —
`colab-logo-dark.png` and `colab-logo-light.png` — already committed in
each app's `public/` folder and genuinely referenced by real components
(`AppNav.vue`, `AppFooter.vue`). Comparing hashes showed the dark variant
was byte-identical across both repos (the canonical master); the light
variant differed, so the higher-resolution copy was used. Grepping actual
usage sizes in the codebase (the largest was `w-16 h-16`, 64px) justified
downsizing the source files to 128px before encoding, instead of
embedding the 2160px/800px originals verbatim.

On the first attempt, the base64 written into `design.md` was **not** the
real data — it was a plausible-looking but fabricated string. This was
only caught because the very next step was a round-trip check: extract
the string back out of the file, decode it, and view the resulting image.
The fabricated version didn't produce anything real; the fix (re-doing
the extraction with a script that read the actual PNG bytes directly,
rather than reproducing the string by hand) did, and was confirmed by
the same round-trip check before committing.

The same logo was reused shortly after in a test prototype (a React
onboarding wizard built to demo the harness). It was pulled out of
`design.md` programmatically (regex extraction into a JS constant), not
retyped, and round-trip-verified again once placed in the new file.

**Lesson generalized into the skill:** a multi-thousand-character base64
string is exactly the kind of content a model can silently hallucinate a
convincing-but-wrong version of. Treat "the file was written" as
unverified until you've decoded what's actually there and looked at it —
the same discipline as Step 5's testing, applied to a single asset
instead of the whole harness.

### The claude.ai packaging episode

A live run of `create-colab-prototype` inside claude.ai (rather than
Claude Code) on 14 July 2026 surfaced a bug that Step 5's local dry-run
testing couldn't have caught: only the two `SKILL.md` files and
`build-prototype-harness/references/worked-example.md` actually
installed. None of the seven docs arrived — they lived in a plugin-root
`context/` folder at the time, outside every skill's own directory. The
agent's "always read first" step failed silently (the files it tried to
read simply weren't there), and it fell back to rebuilding a plausible-
looking but wrong design system from memory of Colab's presentation-deck
template — including making primary buttons lime instead of the real
violet.

The fix confirmed the actual mechanism first rather than guessing: claude.ai
(and, per the plugin caching docs, plugin installation generally) only
bundles files inside a recognized top-level directory — `skills/`,
`agents/`, `hooks/`, `commands/`, etc. — and, within `skills/`, everything
nested inside each individual skill's own folder. A bare `context/` at the
plugin root matches none of that, so it's silently dropped; a file like
`skills/build-prototype-harness/references/worked-example.md` survives
because it's nested inside `skills/`. The seven docs were moved to
`skills/create-colab-prototype/references/`, matching the pattern that
had already worked by coincidence for `worked-example.md`, and `design.md`
itself was hardened (an explicit "primary action = violet, never the deck
palette" note, plus a claude.ai-specific environment note about Font
Awesome/Tailwind-arbitrary-value constraints in that sandbox) so the
failure mode is harder to hit even if a future packaging bug reappears.

**Lesson generalized into the skill:** Step 5's dry-run test is necessary
but not sufficient — it verifies the *content* of the docs, not that a
real installation channel actually delivers them. Test a plugin's
packaging in every environment it's meant to run in (Claude Code CLI
*and* claude.ai, if both are targets), not just one, and treat "installs
locally" and "installs where the audience will actually use it" as two
separate claims.

The fix was confirmed shortly after by actually running
`create-colab-prototype` end-to-end again (this time faithfully, not a
dry run — reading the docs from their new location, asking the framework
question, building a real prototype): all seven docs read back cleanly
from `skills/create-colab-prototype/references/`, and the hardened
primary-colour note held (the test prototype's primary buttons came out
correctly violet). One thing that surfaced during that same run,
unrelated to packaging: see the base64 note added to the "Embedding real
visual assets" section above — the "never hand-type it" mistake recurred
in a new context (scaffolding a brand-new file, not editing an existing
one), which is a good reminder that confirming a fix once doesn't mean
every variant of the underlying mistake has been closed off.
