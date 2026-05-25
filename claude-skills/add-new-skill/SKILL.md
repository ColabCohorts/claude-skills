---
name: add-new-skill
description: Guide users through creating a new Claude skill and adding it to the Colab AI Prompts repository. Use when someone wants to add a new prompt or skill to the toolkit.
---

# Add a New Skill

Guide the user through creating a new Claude skill for the Colab AI Prompts repository.

## Process

Walk the user through these steps one at a time. Ask questions and confirm before proceeding to the next step.

### Step 1: Define the Skill

Ask the user:
1. **What does this skill do?** — What task or workflow does it help with?
2. **When should it be triggered?** — What kind of request would activate this skill?
3. **Who is the target user?** — Product managers, designers, researchers, etc.?

### Step 2: Generate the Skill ID

Create a kebab-case ID from the skill name:
- Lowercase letters, numbers, and hyphens only
- Maximum 64 characters
- Must be descriptive and unique

Confirm the ID with the user before proceeding.

### Step 3: Write the SKILL.md

Create the file at `claude-skills/{skill-id}/SKILL.md` with this structure:

```markdown
---
name: {skill-id}
description: {One sentence describing what the skill does and when to use it.}
---

# {Skill Title}

{Role or context statement if needed.}

## Instructions

{Clear, numbered steps for how Claude should execute this skill.}

### Context to Gather
- {What information does Claude need from the user?}

### Output Format
{Describe the expected output structure.}

### Considerations
- {Any important notes or edge cases.}

{End with: "Ask the user for X if not provided."}
```

### Step 4: Add to the Web App

Also create the corresponding entry for `src/data/prompts.js`:

```javascript
{
  id: '{skill-id}',
  title: '{Skill Title}',
  description: '{Short description for the card}',
  fullPrompt: `{The full prompt text}`
}
```

Confirm which category it belongs to:
- The Product Toolkit
- User Research & Analysis
- Product Strategy & Vision
- Roadmapping & Prioritization

Or suggest creating a new category if none fit.

### Step 5: Update the README

Add the new skill to the table in `claude-skills/README.md`.

## Rules

- Always confirm each step with the user before writing files
- Ensure the skill ID is unique (check existing skills in the repo)
- Keep descriptions concise — Claude uses them for skill discovery
- Instructions should be actionable and specific
- Always include "Context to Gather" so the skill asks for missing info
- Test that the YAML frontmatter is valid (no special characters in name)

## Existing Categories in the Web App

For reference, these are the current prompt categories in `src/data/prompts.js`:
1. **The Product Toolkit** — Story building, executive comms, hypothesis testing, metrics, onboarding, outcomes, opportunities, solutions, testing
2. **User Research & Analysis** — Personas, interview questions, feedback analysis
3. **Product Strategy & Vision** — Vision statements, SWOT, North Star metrics
4. **Roadmapping & Prioritization** — User stories, RICE framework, PRDs
