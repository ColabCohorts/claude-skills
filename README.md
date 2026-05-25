# Colab Toolkit — Claude Code Plugin

A Claude Code plugin with product management skills for discovery, strategy, prioritization, and communication workflows.

[![Validate Claude Skills](https://github.com/ColabCohorts/claude-skills/actions/workflows/validate-skills.yml/badge.svg)](https://github.com/ColabCohorts/claude-skills/actions/workflows/validate-skills.yml)

## Installation

### From a marketplace (recommended)

If this plugin is listed in a marketplace you have configured:

```bash
/plugin install @marketplace-name colab-toolkit
```

### Local installation

Clone the repo and load it directly:

```bash
git clone https://github.com/johnbowker/claude-skills.git
claude --plugin-dir ./claude-skills
```

### Per-project installation

Add to your project's `.claude/plugins.json`:

```json
{
  "plugins": [
    {
      "url": "https://github.com/johnbowker/claude-skills"
    }
  ]
}
```

## Usage

Once installed, skills are available under the `colab-toolkit` namespace:

```
/colab-toolkit:build-compelling-story
/colab-toolkit:refine-metric
/colab-toolkit:brainstorm-solutions
```

Claude will also automatically invoke skills based on task context using the skill descriptions.

## Available Skills

| Skill | Description |
|-------|-------------|
| `build-compelling-story` | Transform raw notes into a Steve Jobs style 3-Act Narrative |
| `executive-alignment` | Rewrite messages for executives using Minto Pyramid Principle |
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
| `prioritization-framework` | Apply RICE framework to feature lists |
| `draft-prd-outline` | Generate structured PRD outlines |
| `add-new-skill` | Scaffold new skills following the standard format |

## Plugin Structure

```
claude-skills/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── skills/                  # All skills live here
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

Each skill is a folder containing a `SKILL.md` with YAML frontmatter (`name`, `description`) and markdown instructions.

## Development

### Validate skills locally

```bash
node scripts/validate-skills.js
```

### Test the plugin

```bash
claude --plugin-dir .
```

## Contributing

1. Create a new skill folder under `skills/` with a `SKILL.md`
2. Ensure the `name` field in frontmatter matches the folder name
3. Run `node scripts/validate-skills.js` to check formatting
4. Submit a PR — CI will validate automatically
