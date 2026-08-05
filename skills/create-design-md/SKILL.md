---
name: create-design-md
description: Builds a single design.md steering doc — tokens, components, logo, framework choice — from a CSS/theme file or a live website URL, anchored on the real DESIGN.md format spec (github.com/google-labs-code/design.md) — YAML front-matter tokens plus the 8 canonical sections. A fast on-ramp for build-prototype-harness's Step 1 when someone only has a design system to bring, not a full codebase — built for workshop/demo use where people show up with just a site or a stylesheet. Use when asked to "build a design.md from this CSS/site", "create a design system doc for [url/file]", "make me a design.md", or similar.
---

# Create design.md from a CSS file or website

## Scope — read this first

This skill produces **only** `design.md`, not the other seven harness
docs. It exists because a workshop participant (or anyone without a full
codebase to mine) still needs a *grounded* starting point rather than a
generic one. Once this doc exists, hand off into
[build-prototype-harness](../build-prototype-harness/SKILL.md) for the rest (personas,
ethics, strategy, etc.) if the full harness is wanted — don't try to
extend this skill to cover those.

**The output format is the real [DESIGN.md spec](https://github.com/google-labs-code/design.md)**
(currently `alpha` — it may change; re-check the repo if something in this
skill stops matching it), not an ad-hoc structure invented for this
harness. Concretely: a YAML front-matter block of machine-readable tokens
(`colors`, `typography`, `rounded`, `spacing`, `components`, plus
`version`/`name`/`description`/`omitted`), followed by a markdown body
organized into the spec's 8 canonical `##` sections, in order: **Overview,
Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's
and Don'ts**. See `create-colab-prototype/references/design.md` in this
same plugin for a complete worked example of this shape applied to a real
company's design system.

The same core principle as the rest of this harness applies here without
exception: **every value in the output must be traceable to something
real** — an actual property found in a real CSS file. Where nothing real
could be extracted, say so explicitly in the doc rather than guessing.

## Step 1 — Detect the input

- A CSS/theme file (uploaded, pasted, or a path) → **Path A**.
- A URL → **Path B**, which always tries to escalate into Path A first
  (see below) before falling back to anything lower-fidelity.
- Neither provided → ask for one. Don't fabricate a design system from
  nothing; there's no fallback below "ask the user."

## Path A — CSS file provided (high fidelity)

Read the file directly and extract, in order, mapping each finding onto
the spec's actual token schema (not a custom structure):

1. **`colors` tokens.** Find custom properties (`--name: value;`) inside
   `:root` or theme-switch blocks (`.dark`, `.light`, `[data-theme]`,
   `prefers-color-scheme` media queries). Reproduce values verbatim — don't
   round or rename them. Map to the spec's token map (`map<string, Color>`);
   at minimum a `primary` color must exist (the linter warns if it's
   missing). If the source has multiple themes (dark/light), treat one as
   the primary token set (usually whichever is the documented/CSS default)
   and document the other theme's real values in the Colors section's
   prose as overrides — the spec's token schema doesn't have a native
   multi-theme construct, so don't invent parallel token keys for it.
2. **Semantic colors.** Scan for hex/rgb color values that repeat 3+
   times *outside* an already-captured token — these are usually
   success/warning/error/info colors even if not tokenized. Cross-check
   against nearby class names (`.error`, `.success`, `.warn`, `.danger`,
   `.info`) to label them correctly rather than guessing from color alone
   (e.g. don't assume red always means "error" without checking). Add
   them as their own color tokens (`error`, `success`, etc. — `error` is
   in the spec's own recommended-names list).
3. **`typography` tokens.** Pull the `font-family` stack and every
   distinct heading/body/label text treatment (`font-size` + `font-weight`
   + `line-height` + `letter-spacing` combination actually used) directly
   from the CSS. Name them using the spec's recommended convention
   (`headline-lg`, `body-md`, `label-sm`, etc.) rather than inventing an
   unrelated naming scheme — don't force a 9–15 level scale if the source
   only really has a handful of distinct treatments; a shallow, honest
   scale beats padding it out with duplicates.
4. **`rounded` tokens.** Collect the distinct `border-radius` values seen
   in the CSS and name them by scale level (`sm`/`md`/`lg`/`full`, or
   whatever levels the source actually uses) — note which component uses
   which (pill `9999px` vs. rounded-rect vs. square vs. sharp/`0`).
5. **`spacing` tokens.** Only include this if the source CSS actually
   defines a named spacing scale (custom properties like `--space-md` or
   a documented scale in a config file). If there's no such scale — just
   ad-hoc pixel values scattered through the CSS, or a bare utility
   framework default — **use the spec's `omitted` front-matter field**
   with a real reason, don't invent a scale that isn't there (see
   `create-colab-prototype/references/design.md`'s own `omitted: spacing`
   entry for a real example of this).
6. **`components` tokens.** Look for class blocks that combine
   `border-radius` + `padding`/`background`/`color` — these mark real UI
   components (buttons, cards, inputs, badges) as opposed to bare utility
   classes. Map each to the spec's valid component properties only
   (`backgroundColor`, `textColor`, `typography`, `rounded`, `padding`,
   `size`, `height`, `width`) — use `{colors.x}` / `{typography.x}` /
   `{rounded.x}` token references rather than repeating literal values.
   Variants (hover, active) become separate entries with a related key
   name (`button-primary-hover`).
7. **Icons.** If any markup is available alongside the CSS, detect an
   icon library by class-name convention (`fa-`, `hero-`, `lucide-`,
   `material-icons`) — don't assume one is in use without seeing it
   referenced. Note it in the Components section's prose (the spec has no
   dedicated icon-library token field).

## Path B — Website URL provided (variable fidelity)

1. **Always try to escalate to Path A first.** Fetch the page, find every
   `<link rel="stylesheet" href="...">`, and fetch those files directly.
   A URL that resolves to a real stylesheet should be treated as Path A
   from that point on — parse it the same way, citing the stylesheet
   URL(s) as the source.
2. **Minified CSS is still real CSS.** Don't be thrown by a lack of
   whitespace or hashed/obfuscated class names (common with Tailwind's
   generated utility classes or CSS-in-JS build output) — hex colors,
   `border-radius` values, and `font-family` stacks are still directly
   extractable by pattern regardless of formatting. Only component-level
   grouping (step 3 above) gets harder when class names are hashed; note
   that limitation in the doc rather than inventing plausible-sounding
   class names.
3. **Only fall back to visual approximation if no usable stylesheet could
   be fetched at all** (fully inline styles, blocked fetch, pure
   CSS-in-JS with nothing statically served). In that case:
   - Describe only what's directly, visually observable from the fetched
     page content — background colors, button shapes, visible spacing
     rhythm.
   - Don't invent anything not directly observable — no hover states,
     no transition timings, no component code, no dark/light variants
     that weren't actually seen.
   - **Mark every approximated section explicitly** in the output, e.g.
     `⚠️ Visually approximated from the live page — not extracted from
     source CSS. Verify before relying on this.` This is the same
     honesty standard the rest of this harness applies to missing
     internal docs, applied here to missing source CSS.

## Step 2 — Logo

Look for `<link rel="icon">` and header/nav `<img>` tags with an alt or
class hinting at "logo"/brand. If found, embed it using the exact method
already documented in build-prototype-harness's
["Embedding real visual assets as base64"](../build-prototype-harness/SKILL.md#embedding-real-visual-assets-logos-icons-as-base64)
section — don't duplicate that logic here, follow it as-is (find the real
file, confirm real usage size, downsize before encoding, never hand-type
the base64, round-trip decode and view it to verify). If no logo can be
found, omit the Logo section entirely rather than inventing a placeholder.

## Step 3 — Framework

Ask the same React / Vue.js / "choose for me" question this harness's own
`design.md` asks — **unless** it's inferable from something else already
provided (a `package.json`, a Tailwind/Vite config, framework-specific
markers in the HTML like Vue's `data-v-*` attributes or a React root div).
If inferred, state plainly what it was inferred from instead of asking.

## Step 4 — Write design.md in the DESIGN.md spec shape

**YAML front matter first** (the tokens gathered in Path A/B, in the
spec's schema): `version: alpha`, `name`, `description`, `omitted` (if
any section — usually `spacing` — was genuinely absent from the source),
`colors`, `typography`, `rounded`, `spacing` (unless omitted),
`components`. Reference other tokens with `{path.to.token}` rather than
repeating literal values inside `components`.

**Then the markdown body**, organized into the spec's 8 canonical `##`
sections, in this order (omit any that don't apply, but don't reorder
the ones that are present): **Overview, Colors, Typography, Layout,
Elevation & Depth, Shapes, Components, Do's and Don'ts**.

- **Overview**: brand personality, target audience, emotional tone —
  pull from any real brand/voice material found, not a generic
  description. If none exists, describe only what's visually inferable
  and say so.
- **Colors** / **Typography** / **Shapes**: prose explaining *why* the
  tokens are what they are (which the tokens alone don't convey) —
  descriptive names are fine here even though the front matter uses
  systematic ones (the spec explicitly expects this split).
- **Layout**: real spacing/sizing facts (max-widths, nav height, grid
  model) even if the `spacing` token section itself was omitted.
- **Elevation & Depth**: how the source conveys visual hierarchy — real
  shadow/blur values if defined, or the flat-design alternative
  (borders, tonal contrast) if no elevation system exists.
- **Components**: prose per component family (buttons, cards, inputs,
  etc.), plus any real interactive-component code found (or, like this
  harness's own checkbox pattern, a clearly-flagged *new* pattern if a
  component is needed but nothing real was found for it).
- **Do's and Don'ts**: only rules actually backed by what was found in
  the source (e.g. "buttons are consistently pill-shaped, radius 9999px"
  — only if every button class seen actually confirms that) — don't pad
  this section with generic advice that isn't traceable to the source.

**Colab-harness-specific extras** (Why this doc exists, Stack/framework
choice, Logo, environment notes, Linter notes) aren't part of the spec —
keep them as additional non-canonical `##` sections wherever they fit
contextually. The spec explicitly preserves unknown section headings
without erroring, so this is safe; just don't let extra sections disrupt
the relative order of the 8 canonical ones.

The `> Grounded in: ...` opening line must name the actual source — the
file name, or the URL plus exactly which stylesheet(s) were actually
fetched from it — and must say plainly if any section is approximated
rather than extracted (point back to the `⚠️` markers from Path B if
used). Cite the spec itself too: `Anchored on the DESIGN.md format spec
(github.com/google-labs-code/design.md, alpha).`

**Validate before finishing.** Run `npx @google/design.md lint design.md`
against the output. Zero errors is the bar — fix any (a broken `{token}`
reference is the most likely one to introduce by hand). For warnings,
don't reflexively "fix" them by distorting a real extracted value just to
silence the linter — decide per-warning whether it's a real gap worth
surfacing (document it, e.g. a genuine low-contrast color pairing found
in the source) or a false-positive limitation of the checker (document
that too, the way `create-colab-prototype/references/design.md`'s own
"Linter notes" section does for its alpha-blended badge colors). Either
way, the reasoning goes in the doc — don't silently accept or silently
"fix" a warning without saying why.

## Step 5 — Hand off

State plainly that this produced `design.md` only, and offer to continue
into `build-prototype-harness`'s remaining steps for the full eight-doc harness
if that's wanted — don't assume the user wants the full harness just
because this doc exists.
