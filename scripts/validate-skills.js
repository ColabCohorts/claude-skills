#!/usr/bin/env node

/**
 * Validates that all Claude Skills conform to the expected format:
 * - Each skill folder contains a SKILL.md file
 * - SKILL.md has valid YAML frontmatter with required fields (name, description)
 * - The `name` field matches the folder name
 * - There is markdown content after the frontmatter
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.resolve(__dirname, '..', 'claude-skills');
const REQUIRED_FIELDS = ['name', 'description'];

let errors = 0;
let warnings = 0;
let skillCount = 0;

function log(level, skillId, message) {
  const prefix = level === 'error' ? '❌' : '⚠️';
  console.log(`  ${prefix} [${skillId}] ${message}`);
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const yaml = match[1];
  const fields = {};

  for (const line of yaml.split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim();
    fields[key] = value;
  }

  return { fields, raw: yaml, endIndex: match[0].length };
}

function validateSkill(skillDir, folderName) {
  const skillFile = path.join(skillDir, 'SKILL.md');

  // Check SKILL.md exists
  if (!fs.existsSync(skillFile)) {
    log('error', folderName, 'Missing SKILL.md file');
    errors++;
    return;
  }

  const content = fs.readFileSync(skillFile, 'utf-8');

  // Check frontmatter exists and is valid
  const frontmatter = parseFrontmatter(content);
  if (!frontmatter) {
    log('error', folderName, 'Missing or invalid YAML frontmatter (must start with --- and end with ---)');
    errors++;
    return;
  }

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (!frontmatter.fields[field] || frontmatter.fields[field].length === 0) {
      log('error', folderName, `Missing required frontmatter field: "${field}"`);
      errors++;
    }
  }

  // Check name matches folder
  if (frontmatter.fields.name && frontmatter.fields.name !== folderName) {
    log('error', folderName, `Frontmatter "name" (${frontmatter.fields.name}) does not match folder name (${folderName})`);
    errors++;
  }

  // Check description length
  if (frontmatter.fields.description && frontmatter.fields.description.length < 10) {
    log('warning', folderName, 'Description is very short — consider making it more descriptive');
    warnings++;
  }

  // Check body content exists
  const body = content.slice(frontmatter.endIndex).trim();
  if (body.length === 0) {
    log('error', folderName, 'No markdown content after frontmatter');
    errors++;
  } else if (body.length < 50) {
    log('warning', folderName, 'Very little content in skill body — consider adding more instructions');
    warnings++;
  }

  // Check body starts with a heading
  if (body.length > 0 && !body.startsWith('#')) {
    log('warning', folderName, 'Body content does not start with a markdown heading');
    warnings++;
  }
}

// Main
console.log(`\nValidating Claude Skills in: ${SKILLS_DIR}\n`);

if (!fs.existsSync(SKILLS_DIR)) {
  console.error(`Skills directory not found: ${SKILLS_DIR}`);
  process.exit(1);
}

const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true });
const skillFolders = entries.filter(e => e.isDirectory());

if (skillFolders.length === 0) {
  console.error('No skill folders found');
  process.exit(1);
}

for (const folder of skillFolders) {
  skillCount++;
  validateSkill(path.join(SKILLS_DIR, folder.name), folder.name);
}

console.log(`\n📊 Results: ${skillCount} skills checked, ${errors} error(s), ${warnings} warning(s)\n`);

if (errors > 0) {
  console.log('❌ Validation failed\n');
  process.exit(1);
} else {
  console.log('✅ All skills are valid\n');
  process.exit(0);
}
