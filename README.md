# Colab Toolkit

A ready-made set of product management skills — for discovery, strategy, prioritization, and communication work. Once installed, you don't need to memorize any commands: just describe what you're trying to do (e.g. "help me refine this metric" or "prioritise this list of opportunities") and the right skill is used automatically.

[![Validate Agent Skills](https://github.com/ColabCohorts/colab-product-skills/actions/workflows/validate-skills.yml/badge.svg)](https://github.com/ColabCohorts/colab-product-skills/actions/workflows/validate-skills.yml)

## Getting Started

These skills work inside four different AI tools: **Claude Code**, **Codex CLI**, **ChatGPT**, and **Gemini CLI**. Pick whichever one your team already uses below — you only need to follow one section.

Not sure which one you have? Ask your engineering team, or look at what's already on your computer. Each option below assumes the base tool (Claude Code, Codex CLI, ChatGPT desktop, or Gemini CLI) is already installed — if it isn't, that's a one-time setup your engineering team can help with first. Everything below is a one-time step: once it's done, the skills are just there whenever you use the tool.

### Claude Code

1. Open Claude Code.
2. Type this into the chat box and press enter:
   ```
   /plugin marketplace add ColabCohorts/colab-product-skills
   ```
3. Then type this and press enter:
   ```
   /plugin install colab-toolkit@colab-toolkit
   ```

That's it. From now on, just describe what you need in plain English and Claude will pick the right skill automatically. If you want to name one directly, you can type things like:

```
/colab-toolkit:refine-metric
/colab-toolkit:build-compelling-story
```

### ChatGPT / Codex CLI

ChatGPT and Codex CLI share the same skills, so one setup step covers both.

1. Open your computer's **Terminal** app (not a ChatGPT or Codex chat window).
2. Run these two lines:
   ```bash
   codex plugin marketplace add ColabCohorts/colab-product-skills
   codex plugin add colab-toolkit
   ```

That's it. From now on, describe what you need in plain English in either ChatGPT or Codex CLI and it'll pick the right skill. If you want to name one directly, use `@refine-metric` in ChatGPT or `$refine-metric` in Codex CLI.

### Gemini CLI

1. Open your computer's **Terminal** app.
2. Run this line:
   ```bash
   gemini extensions install https://github.com/ColabCohorts/colab-product-skills
   ```

That's it. From now on, describe what you need in plain English in Gemini CLI and it'll pick the right skill automatically.

## Available Skills

You don't need to memorize this list — it's here for reference. Just describe your task and the right skill will be used automatically.

| Skill | Description |
|-------|-------------|
| `build-compelling-story` | Transform raw notes into a Steve Jobs style 3-Act Narrative |
| `executive-alignment` | Rewrite messages for executives using Minto Pyramid Principle |
| `pyramid-principle-comms` | Restructure updates into a top-down executive format using the Pyramid Principle |
| `test-hypothesis` | Create customer-centred scenarios to validate hypotheses |
| `refine-metric` | Ensure metrics focus on outcomes, not outputs |
| `refine-outcome-statement` | Make outcome statements specific and measurable |
| `list-opportunities` | Identify user opportunities from research data |
| `prioritise-opportunities` | Rank opportunities by business impact |
| `brainstorm-solutions` | Generate diverse solution ideas for an opportunity |
| `prioritise-solutions` | Rank solutions and map assumptions |
| `prototype-solutions` | Sketch end-to-end user journeys |
| `develop-test-plan` | Create lean validation plans |
| `create-prfaq` | Generate PRFAQ documents from hypotheses |
| `generate-user-personas` | Create detailed personas from user data |
| `create-interview-questions` | Generate open-ended research questions |
| `summarize-user-feedback` | Analyze feedback for themes and sentiment |
| `draft-product-vision` | Craft inspiring product vision statements |
| `swot-analysis` | Conduct strategic SWOT analysis |
| `define-north-star-metric` | Brainstorm North Star Metrics |
| `generate-user-stories` | Break features into user stories |
| `prioritisation-framework` | Apply RICE framework to feature lists |
| `draft-prd-outline` | Generate structured PRD outlines |
| `generate-ai-ready-prd` | Expand a problem, persona, and solution into a full 8-section AI-ready PRD |
| `explain-this-codebase` | Explain a codebase in plain English for non-technical readers |
| `add-new-skill` | Scaffold new skills following the standard format |
| `check-prd-readiness` | Score a PRD's readiness for an AI code pipeline with traffic-light ratings |

---

## For Maintainers

The sections below are for whoever maintains this repository, not for everyday users of the skills.

### Repository Structure

```
colab-product-skills/
├── .claude-plugin/
│   ├── plugin.json          # Claude Code plugin manifest
│   └── marketplace.json     # Claude Code marketplace catalog
├── .codex-plugin/
│   └── plugin.json          # Codex CLI / ChatGPT plugin manifest
├── .agents/
│   └── plugins/
│       └── marketplace.json # Codex CLI / ChatGPT marketplace catalog
├── gemini-extension.json    # Gemini CLI extension manifest
├── skills/                  # All skills live here — shared by every provider
│   ├── refine-metric/
│   │   └── SKILL.md
│   ├── brainstorm-solutions/
│   │   └── SKILL.md
│   └── ...
├── scripts/
│   └── validate-skills.js   # CI validation script
└── .github/
    └── workflows/
        └── validate-skills.yml
```

Each skill is a folder containing a `SKILL.md` with YAML frontmatter (`name`, `description`) and markdown instructions. The same `SKILL.md` is what every provider manifest above points at — there is no per-provider copy of skill content.

### Local Testing

Clone the repo and load it directly, without going through a marketplace:

```bash
git clone https://github.com/ColabCohorts/colab-product-skills.git
claude --plugin-dir ./colab-product-skills
```

### Require for Your Team

Add to your project's `.claude/settings.json` so teammates are prompted to install:

```json
{
  "extraKnownMarketplaces": {
    "colab-toolkit": {
      "source": {
        "source": "github",
        "repo": "ColabCohorts/colab-product-skills"
      }
    }
  }
}
```

### Validate Skills Locally

```bash
node scripts/validate-skills.js
```

### Contributing

1. Create a new skill folder under `skills/` with a `SKILL.md`
2. Ensure the `name` field in frontmatter matches the folder name
3. Run `node scripts/validate-skills.js` to check formatting
4. Submit a PR — CI will validate automatically

A `SKILL.md` written this way automatically works across Claude Code, Codex CLI, ChatGPT, and Gemini CLI — no provider-specific steps needed. Only the provider manifests at the repo root (not covered by this checklist) need updating when the toolkit itself changes name, version, or description.
