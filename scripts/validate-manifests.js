#!/usr/bin/env node

/**
 * Validates the provider manifests that make these skills installable from
 * Claude Code, Codex CLI / ChatGPT, and Gemini CLI, and checks they stay
 * consistent with each other (same product name, same version where both
 * providers require one, and that any path they reference actually exists).
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');

let errors = 0;

function fail(message) {
  console.error(`  ❌ ${message}`);
  errors++;
}

function ok(message) {
  console.log(`  ✅ ${message}`);
}

function requireJson(relPath) {
  const fullPath = path.join(REPO_ROOT, relPath);
  if (!fs.existsSync(fullPath)) {
    fail(`Missing file: ${relPath}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
  } catch (err) {
    fail(`Invalid JSON in ${relPath}: ${err.message}`);
    return null;
  }
}

console.log('\nValidating provider manifests\n');

// --- Claude Code -----------------------------------------------------------

const claudePlugin = requireJson('.claude-plugin/plugin.json');
if (claudePlugin) {
  if (!claudePlugin.name || !claudePlugin.description) {
    fail('.claude-plugin/plugin.json missing required field: name or description');
  } else {
    ok(`.claude-plugin/plugin.json valid: ${claudePlugin.name}`);
  }
}

const claudeMarketplace = requireJson('.claude-plugin/marketplace.json');
if (claudeMarketplace) {
  if (!claudeMarketplace.name || !claudeMarketplace.owner || !claudeMarketplace.plugins?.length) {
    fail('.claude-plugin/marketplace.json missing required field: name, owner, or plugins');
  } else {
    claudeMarketplace.plugins.forEach((p, i) => {
      if (!p.name || !p.source) fail(`.claude-plugin/marketplace.json plugins[${i}] missing name or source`);
    });
    if (errors === 0) ok(`.claude-plugin/marketplace.json valid: ${claudeMarketplace.plugins.length} plugin(s)`);
  }
}

// --- Codex CLI / ChatGPT -----------------------------------------------------

const codexPlugin = requireJson('.codex-plugin/plugin.json');
if (codexPlugin) {
  const requiredTop = ['name', 'version', 'description', 'author', 'interface', 'skills'];
  const missingTop = requiredTop.filter(f => !codexPlugin[f]);
  if (missingTop.length) {
    fail(`.codex-plugin/plugin.json missing required field(s): ${missingTop.join(', ')}`);
  }

  const requiredInterface = ['displayName', 'shortDescription', 'longDescription', 'category'];
  const missingInterface = requiredInterface.filter(f => !codexPlugin.interface?.[f]);
  if (missingInterface.length) {
    fail(`.codex-plugin/plugin.json "interface" missing required field(s): ${missingInterface.join(', ')}`);
  }

  if (codexPlugin.skills) {
    // Resolved relative to the plugin root — the directory containing .codex-plugin/, i.e. REPO_ROOT.
    const skillsPath = path.join(REPO_ROOT, codexPlugin.skills);
    if (!fs.existsSync(skillsPath)) {
      fail(`.codex-plugin/plugin.json "skills" points at ${codexPlugin.skills}, which does not exist (resolved: ${skillsPath})`);
    }
  }

  if (missingTop.length === 0 && missingInterface.length === 0) {
    ok(`.codex-plugin/plugin.json valid: ${codexPlugin.name} v${codexPlugin.version}`);
  }
}

const codexMarketplace = requireJson('.agents/plugins/marketplace.json');
if (codexMarketplace) {
  if (!codexMarketplace.name || !codexMarketplace.plugins?.length) {
    fail('.agents/plugins/marketplace.json missing required field: name or plugins');
  } else {
    codexMarketplace.plugins.forEach((p, i) => {
      if (!p.name || !p.source) fail(`.agents/plugins/marketplace.json plugins[${i}] missing name or source`);
    });
    if (errors === 0) ok(`.agents/plugins/marketplace.json valid: ${codexMarketplace.plugins.length} plugin(s)`);
  }
}

// --- Gemini CLI --------------------------------------------------------------

const geminiExtension = requireJson('gemini-extension.json');
if (geminiExtension) {
  if (!geminiExtension.name || !geminiExtension.version) {
    fail('gemini-extension.json missing required field: name or version');
  } else {
    ok(`gemini-extension.json valid: ${geminiExtension.name} v${geminiExtension.version}`);
  }

  // Gemini auto-discovers skills from a `skills/` directory sitting next to the manifest — no path field to check.
  const geminiSkillsDir = path.join(REPO_ROOT, 'skills');
  if (!fs.existsSync(geminiSkillsDir)) {
    fail(`gemini-extension.json expects a sibling "skills/" directory, not found at ${geminiSkillsDir}`);
  }
}

// --- Cross-provider consistency ---------------------------------------------

if (codexPlugin && geminiExtension && codexPlugin.version && geminiExtension.version) {
  if (codexPlugin.version !== geminiExtension.version) {
    fail(`Version mismatch — .codex-plugin/plugin.json (${codexPlugin.version}) vs gemini-extension.json (${geminiExtension.version})`);
  } else {
    ok(`Codex and Gemini manifest versions match: ${codexPlugin.version}`);
  }
}

const productNames = [
  ['.claude-plugin/plugin.json', claudePlugin?.name],
  ['.codex-plugin/plugin.json', codexPlugin?.name],
  ['gemini-extension.json', geminiExtension?.name],
  ['.agents/plugins/marketplace.json plugins[0]', codexMarketplace?.plugins?.[0]?.name],
].filter(([, name]) => Boolean(name));

const distinctNames = new Set(productNames.map(([, name]) => name));
if (distinctNames.size > 1) {
  fail(`Product name mismatch across manifests: ${productNames.map(([src, name]) => `${src}="${name}"`).join(', ')}`);
} else if (distinctNames.size === 1) {
  ok(`Product name consistent across all manifests: ${[...distinctNames][0]}`);
}

// --- Result -------------------------------------------------------------------

console.log(`\n📊 Results: ${errors} error(s)\n`);

if (errors > 0) {
  console.log('❌ Manifest validation failed\n');
  process.exit(1);
} else {
  console.log('✅ All provider manifests are valid and consistent\n');
  process.exit(0);
}
