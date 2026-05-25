# Colab Toolkit - Claude Skills

These are custom Claude Skills that can be imported into Claude for use in projects and conversations.

## How to Import

1. Copy the `claude-skills` folder (or individual skill folders) into your Claude project's `claude/skills/` directory
2. Each skill will be automatically available when Claude detects a relevant request

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

## Skill Structure

Each skill follows the Claude Skills format:

```
skill-name/
└── SKILL.md       # Contains YAML frontmatter (name, description) + instructions
```

## Usage

Once imported, Claude will automatically invoke the relevant skill when it detects a matching request. You can also explicitly ask Claude to use a specific skill.
