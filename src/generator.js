/**
 * File generator for CC Scaffold
 * Generates CLAUDE.md, settings.json, and component files
 */

import fs from 'fs/promises';
import path from 'path';
import { skills, getSkill } from './templates/skills.js';
import { agents, getAgent } from './templates/agents.js';
import { hooks, getHook, getHooksByEvent } from './templates/hooks.js';

/**
 * Generate complete project configuration
 *
 * @param {Object} config - Configuration object
 * @returns {Object} Summary of generated files
 */
export async function generateProject(config) {
  const {
    projectName,
    description,
    outputDir = './.claude',
    projectType,
    techStack = [],
    architecture = [],
    skills: selectedSkills = [],
    agents: selectedAgents = [],
    hooks: selectedHooks = [],
    enforcementLevel = 'strict',
    customComponents = [],
  } = config;

  const summary = {
    files: [],
    skills: 0,
    agents: 0,
    hooks: 0,
  };

  // Create directories
  await ensureDir(outputDir);
  await ensureDir(path.join(outputDir, 'skills'));
  await ensureDir(path.join(outputDir, 'agents'));
  await ensureDir(path.join(outputDir, 'hooks'));

  // Generate CLAUDE.md
  const claudeMdPath = path.join(path.dirname(outputDir), 'CLAUDE.md');
  const claudeMdContent = generateClaudeMd({
    projectName,
    description,
    projectType,
    techStack,
    architecture,
    skills: selectedSkills,
    agents: selectedAgents,
    hooks: selectedHooks,
    enforcementLevel,
  });
  await fs.writeFile(claudeMdPath, claudeMdContent);
  summary.files.push(claudeMdPath);

  // Generate settings.json
  const settingsPath = path.join(outputDir, 'settings.json');
  const settingsContent = generateSettingsJson({
    hooks: selectedHooks,
  });
  await fs.writeFile(settingsPath, JSON.stringify(settingsContent, null, 2));
  summary.files.push(settingsPath);

  // Generate skill files
  for (const skillName of selectedSkills) {
    const skill = getSkill(skillName);
    if (skill) {
      const skillDir = path.join(outputDir, 'skills', skillName);
      await ensureDir(skillDir);
      const skillPath = path.join(skillDir, 'SKILL.md');
      await fs.writeFile(skillPath, skill.content);
      summary.files.push(skillPath);
      summary.skills++;
    }
  }

  // Generate agent files
  for (const agentName of selectedAgents) {
    const agent = getAgent(agentName);
    if (agent) {
      const agentPath = path.join(outputDir, 'agents', `${agentName}.md`);
      await fs.writeFile(agentPath, agent.content);
      summary.files.push(agentPath);
      summary.agents++;
    }
  }

  // Generate hook files
  for (const hookName of selectedHooks) {
    const hook = getHook(hookName);
    if (hook) {
      const hookPath = path.join(outputDir, 'hooks', `${hookName}.sh`);
      await fs.writeFile(hookPath, hook.content, { mode: 0o755 });
      summary.files.push(hookPath);
      summary.hooks++;
    }
  }

  // Generate custom components
  for (const custom of customComponents) {
    await generateCustomComponent(outputDir, custom);
    summary.files.push(custom.name);
    if (custom.type === 'skill') summary.skills++;
    if (custom.type === 'agent') summary.agents++;
    if (custom.type === 'hook') summary.hooks++;
  }

  return summary;
}

/**
 * Generate CLAUDE.md content
 */
export function generateClaudeMd(config) {
  const {
    projectName,
    description,
    projectType,
    techStack,
    architecture,
    skills: selectedSkills,
    agents: selectedAgents,
    hooks: selectedHooks,
    enforcementLevel,
  } = config;

  let content = `# ${projectName}

${description || 'A project configured with Claude Code components.'}

## Project Context

- **Type**: ${projectType || 'general'}
- **Stack**: ${techStack?.join(', ') || 'Not specified'}
- **Architecture**: ${architecture?.join(', ') || 'Not specified'}

`;

  // Required Skills
  if (selectedSkills.length > 0) {
    content += `## Required Skills

${selectedSkills.map((s) => `- @.claude/skills/${s}/SKILL.md`).join('\n')}

`;
  }

  // Required Agents
  if (selectedAgents.length > 0) {
    content += `## Required Agents

${selectedAgents.map((a) => `- @.claude/agents/${a}.md`).join('\n')}

`;
  }

  // Hooks
  if (selectedHooks.length > 0) {
    content += `## Active Hooks

The following hooks run automatically:

${selectedHooks.map((h) => {
  const hook = getHook(h);
  return `- **${h}**: ${hook?.description || 'Custom hook'}`;
}).join('\n')}

`;
  }

  // Enforcement Rules
  if (enforcementLevel === 'strict') {
    content += `## Enforcement Rules

This project uses **strict** enforcement:

- Hooks will **block** operations if requirements are not met
- All quality gates must pass before completion
- Skills should be consulted for their respective domains

### Required Practices

1. **Before commits**: Run code-reviewer skill
2. **Before deployments**: Run security-auditor skill
3. **Before completion**: Ensure quality-gate passes

`;
  } else if (enforcementLevel === 'suggested') {
    content += `## Guidelines

This project uses **suggested** enforcement:

- Skills are recommended but not required
- Hooks provide warnings rather than blocking
- Follow best practices when possible

`;
  } else {
    content += `## Available Components

Components are installed but enforcement is optional.
Use skills and agents as needed for your workflow.

`;
  }

  // Checklist
  content += `## Session Checklist

- [ ] Read and understand relevant skills
- [ ] Code has been reviewed
- [ ] Tests pass
- [ ] Documentation updated (if applicable)
- [ ] Commit messages follow conventions

`;

  return content;
}

/**
 * Generate settings.json content
 */
export function generateSettingsJson(config) {
  const { hooks: selectedHooks = [] } = config;

  const hooksByEvent = getHooksByEvent();
  const settings = {
    hooks: {},
  };

  // Group selected hooks by event type
  for (const hookName of selectedHooks) {
    const hook = getHook(hookName);
    if (hook) {
      const event = hook.event;
      if (!settings.hooks[event]) {
        settings.hooks[event] = [];
      }
      settings.hooks[event].push({
        matcher: hook.matcher,
        command: `.claude/hooks/${hookName}.sh`,
      });
    }
  }

  return settings;
}

/**
 * Generate a custom component
 */
async function generateCustomComponent(outputDir, component) {
  const { type, name, description } = component;

  switch (type) {
    case 'skill': {
      const skillDir = path.join(outputDir, 'skills', name);
      await ensureDir(skillDir);
      const content = `---
name: ${name}
description: ${description}
---

# ${name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Skill

${description}

## Usage

Apply this skill when...

## Guidelines

### Do's
-

### Don'ts
-

## Output Format

Provide feedback in this format:

\`\`\`
## Summary

[Your summary here]

## Recommendations

1. Recommendation 1
2. Recommendation 2
\`\`\`
`;
      await fs.writeFile(path.join(skillDir, 'SKILL.md'), content);
      break;
    }

    case 'agent': {
      const content = `---
name: ${name}
description: ${description}
tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - Bash
model: sonnet
---

# ${name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Agent

${description}

## Capabilities

1. Capability 1
2. Capability 2
3. Capability 3

## Process

### Step 1: Analyze
Understand the current state.

### Step 2: Plan
Determine the best approach.

### Step 3: Execute
Implement the changes.

### Step 4: Verify
Confirm the changes are correct.

## Output Format

\`\`\`
## Summary

[Summary of actions taken]

### Changes Made
- Change 1
- Change 2

### Verification
- [ ] Verified item 1
- [ ] Verified item 2
\`\`\`
`;
      await fs.writeFile(path.join(outputDir, 'agents', `${name}.md`), content);
      break;
    }

    case 'hook': {
      const content = `#!/bin/bash
# ${name} Hook
# Description: ${description}
# Exit codes: 0 = pass, 2 = block with message

set -e

# Get input from Claude
INPUT=$(cat)

# Your hook logic here
echo "Running ${name} hook..."

# Example: Extract file path
# FILE_PATH=$(echo "$INPUT" | jq -r '.file_path // .path // empty')

# Success
exit 0
`;
      const hookPath = path.join(outputDir, 'hooks', `${name}.sh`);
      await fs.writeFile(hookPath, content, { mode: 0o755 });
      break;
    }
  }
}

/**
 * Add components to an existing project
 *
 * @param {string} type - Component type (skill, agent, hook)
 * @param {string[]} names - Component names to add
 * @param {string} outputDir - Output directory
 */
export async function addComponents(type, names, outputDir = './.claude') {
  const added = [];

  for (const name of names) {
    switch (type) {
      case 'skill': {
        const skill = getSkill(name);
        if (skill) {
          const skillDir = path.join(outputDir, 'skills', name);
          await ensureDir(skillDir);
          await fs.writeFile(path.join(skillDir, 'SKILL.md'), skill.content);
          added.push(name);
        }
        break;
      }

      case 'agent': {
        const agent = getAgent(name);
        if (agent) {
          await ensureDir(path.join(outputDir, 'agents'));
          await fs.writeFile(
            path.join(outputDir, 'agents', `${name}.md`),
            agent.content
          );
          added.push(name);
        }
        break;
      }

      case 'hook': {
        const hook = getHook(name);
        if (hook) {
          await ensureDir(path.join(outputDir, 'hooks'));
          const hookPath = path.join(outputDir, 'hooks', `${name}.sh`);
          await fs.writeFile(hookPath, hook.content, { mode: 0o755 });
          added.push(name);

          // Update settings.json
          await updateSettingsWithHook(outputDir, hook);
        }
        break;
      }
    }
  }

  return added;
}

/**
 * Update settings.json with a new hook
 */
async function updateSettingsWithHook(outputDir, hook) {
  const settingsPath = path.join(outputDir, 'settings.json');
  let settings = { hooks: {} };

  // Read existing settings
  try {
    const content = await fs.readFile(settingsPath, 'utf-8');
    settings = JSON.parse(content);
    if (!settings.hooks) {
      settings.hooks = {};
    }
  } catch {
    // File doesn't exist or is invalid, use defaults
  }

  // Add hook
  const event = hook.event;
  if (!settings.hooks[event]) {
    settings.hooks[event] = [];
  }

  // Check if hook already exists
  const hookEntry = {
    matcher: hook.matcher,
    command: `.claude/hooks/${hook.name}.sh`,
  };

  const exists = settings.hooks[event].some(
    (h) => h.command === hookEntry.command
  );

  if (!exists) {
    settings.hooks[event].push(hookEntry);
    await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));
  }
}

/**
 * Validate existing configuration
 *
 * @param {string} outputDir - Directory to validate
 * @returns {Object} Validation results
 */
export async function validateConfiguration(outputDir = './.claude') {
  const results = {
    valid: true,
    errors: [],
    warnings: [],
    summary: {
      skills: 0,
      agents: 0,
      hooks: 0,
    },
  };

  // Check if directory exists
  try {
    await fs.access(outputDir);
  } catch {
    results.valid = false;
    results.errors.push(`Directory not found: ${outputDir}`);
    return results;
  }

  // Check settings.json
  const settingsPath = path.join(outputDir, 'settings.json');
  try {
    const content = await fs.readFile(settingsPath, 'utf-8');
    JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      results.warnings.push('settings.json not found');
    } else {
      results.errors.push(`Invalid settings.json: ${error.message}`);
      results.valid = false;
    }
  }

  // Check CLAUDE.md
  const claudeMdPath = path.join(path.dirname(outputDir), 'CLAUDE.md');
  try {
    await fs.access(claudeMdPath);
  } catch {
    results.warnings.push('CLAUDE.md not found in project root');
  }

  // Count skills
  try {
    const skillsDir = path.join(outputDir, 'skills');
    const skillDirs = await fs.readdir(skillsDir);
    for (const dir of skillDirs) {
      const skillFile = path.join(skillsDir, dir, 'SKILL.md');
      try {
        await fs.access(skillFile);
        results.summary.skills++;
      } catch {
        results.warnings.push(`Skill directory missing SKILL.md: ${dir}`);
      }
    }
  } catch {
    // Skills directory doesn't exist
  }

  // Count agents
  try {
    const agentsDir = path.join(outputDir, 'agents');
    const agentFiles = await fs.readdir(agentsDir);
    results.summary.agents = agentFiles.filter((f) => f.endsWith('.md')).length;
  } catch {
    // Agents directory doesn't exist
  }

  // Count and validate hooks
  try {
    const hooksDir = path.join(outputDir, 'hooks');
    const hookFiles = await fs.readdir(hooksDir);
    results.summary.hooks = hookFiles.filter((f) => f.endsWith('.sh')).length;

    // Check hook permissions
    for (const hookFile of hookFiles) {
      if (hookFile.endsWith('.sh')) {
        const hookPath = path.join(hooksDir, hookFile);
        try {
          const stats = await fs.stat(hookPath);
          if (!(stats.mode & 0o111)) {
            results.warnings.push(`Hook not executable: ${hookFile}`);
          }
        } catch {
          // Ignore stat errors
        }
      }
    }
  } catch {
    // Hooks directory doesn't exist
  }

  return results;
}

/**
 * Ensure directory exists
 */
async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

export default {
  generateProject,
  generateClaudeMd,
  generateSettingsJson,
  addComponents,
  validateConfiguration,
};
