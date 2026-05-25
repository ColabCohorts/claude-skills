---
name: add-new-skill
description: Guide users through creating a new Claude skill and submitting it as a pull request to the Colab Toolkit repository. Use when someone wants to add a new prompt or skill to the toolkit.
---

# Add a New Skill

Guide the user through creating a new Claude skill for the Colab Toolkit and submitting it as a pull request.

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

Check existing skills in the `skills/` directory to ensure uniqueness. Confirm the ID with the user before proceeding.

### Step 3: Create a Branch

Create a new git branch for the contribution:

```bash
git checkout -b add-skill/{skill-id}
```

### Step 4: Write the SKILL.md

Create the file at `skills/{skill-id}/SKILL.md` with this structure:

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

### Step 5: Update the README

Add the new skill to the "Available Skills" table in `README.md`.

### Step 6: Validate

Run the validation script to confirm the skill is correctly formatted:

```bash
node scripts/validate-skills.js
```

Fix any errors before proceeding.

### Step 7: Commit and Push

Stage, commit, and push the new skill:

```bash
git add skills/{skill-id}/SKILL.md README.md
git commit -m "Add skill: {skill-id}"
git push -u origin add-skill/{skill-id}
```

### Step 8: Create a Pull Request

Create a pull request targeting the upstream repository:

```bash
gh pr create --repo ColabCohorts/claude-skills --base main --title "Add skill: {skill-id}" --body "## New Skill

**Name:** {skill-id}
**Description:** {description}

## Checklist
- [ ] Skill ID is unique and kebab-case
- [ ] SKILL.md has valid YAML frontmatter with name and description
- [ ] name field matches folder name
- [ ] Instructions are clear and actionable
- [ ] README table updated
- [ ] Validation passes (`node scripts/validate-skills.js`)"
```

If `gh` is not available or not authenticated, provide the user with a direct link:

```
https://github.com/ColabCohorts/claude-skills/compare/main...add-skill/{skill-id}
```

And provide the PR body text for them to paste.

## Rules

- Always confirm each step with the user before writing files
- Ensure the skill ID is unique (check existing skills in `skills/`)
- Keep descriptions concise — Claude uses them for skill discovery
- Instructions should be actionable and specific
- Always include "Context to Gather" so the skill asks for missing info
- The `name` field in frontmatter MUST match the folder name exactly
- Run validation before committing — do not submit broken skills
- Always create a branch — never commit directly to main
