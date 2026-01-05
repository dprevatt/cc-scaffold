import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { skills as skillTemplates } from './templates/skills.js';
import { agents as agentTemplates } from './templates/agents.js';
import { hooks as hookTemplates } from './templates/hooks.js';

/**
 * Invoke Claude CLI for deep project analysis
 */
export async function analyzeWithClaude(projectPath = process.cwd(), options = {}) {
  const { verbose = false, onProgress = null } = options;

  // First, check if Claude CLI is available
  const claudeAvailable = await checkClaudeCLI();
  if (!claudeAvailable) {
    throw new Error(
      'Claude CLI not found. Install with: npm install -g @anthropic-ai/claude-code'
    );
  }

  // Build the analysis prompt
  const prompt = buildAnalysisPrompt(projectPath);

  // Shell out to Claude
  const result = await invokeClaude(prompt, projectPath, verbose, onProgress);

  // Parse Claude's response
  const analysis = parseAnalysisResponse(result);

  return analysis;
}

/**
 * Check if Claude CLI is installed and accessible
 */
async function checkClaudeCLI() {
  return new Promise((resolve) => {
    const proc = spawn('claude', ['--version'], { stdio: 'pipe', shell: true });
    proc.on('close', (code) => resolve(code === 0));
    proc.on('error', () => resolve(false));
  });
}

/**
 * Shell out to Claude CLI with the analysis prompt
 */
async function invokeClaude(prompt, projectPath, verbose = false, onProgress = null) {
  return new Promise((resolve, reject) => {
    // Use claude CLI with --print for non-interactive output
    // The -p flag passes the prompt directly
    const args = ['--print', '-p', prompt];

    if (verbose) {
      console.log('\n[DEBUG] Invoking Claude with prompt...\n');
    }

    const claude = spawn('claude', args, {
      cwd: projectPath,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env },
      shell: true,
    });

    let stdout = '';
    let stderr = '';
    let lastActivity = Date.now();
    let charsReceived = 0;

    claude.stdout.on('data', (data) => {
      const text = data.toString();
      stdout += text;
      charsReceived += text.length;
      lastActivity = Date.now();

      if (verbose) {
        process.stdout.write(data);
      } else if (onProgress) {
        onProgress(charsReceived, text);
      }
    });

    claude.stderr.on('data', (data) => {
      stderr += data.toString();
      lastActivity = Date.now();
    });

    claude.on('close', (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`Claude exited with code ${code}: ${stderr}`));
      }
    });

    claude.on('error', (err) => {
      reject(new Error(`Failed to invoke Claude: ${err.message}`));
    });

    // Set a timeout of 5 minutes, but check for activity
    const timeoutMs = 5 * 60 * 1000;
    const activityCheckMs = 30 * 1000; // 30 seconds without activity = stalled

    const checkActivity = setInterval(() => {
      const idleTime = Date.now() - lastActivity;
      if (idleTime > activityCheckMs && charsReceived === 0) {
        // No output received and idle for 30+ seconds - likely stalled
        clearInterval(checkActivity);
        claude.kill();
        reject(new Error('Claude analysis appears stalled (no output received). Try running with --verbose or check if Claude CLI is working.'));
      }
    }, 10000);

    setTimeout(() => {
      clearInterval(checkActivity);
      claude.kill();
      reject(new Error(`Claude analysis timed out after 5 minutes. Received ${charsReceived} chars before timeout.`));
    }, timeoutMs);
  });
}

/**
 * Build the analysis prompt for Claude
 */
function buildAnalysisPrompt(projectPath) {
  return `
You are analyzing a software project to provide recommendations for Claude Code configuration.

PROJECT PATH: ${projectPath}

TASK: Perform a comprehensive analysis of this project. Read the actual source files to understand the codebase deeply.

## STEP 1: Explore the Project

First, explore the project structure:
- List directories to understand organization
- Read key files (package.json, *.csproj, CLAUDE.md, etc.)
- Examine a few source files to understand patterns

## STEP 2: Analyze These Areas

### Tech Stack
- Languages and versions
- Frameworks and libraries
- Database technologies
- Build tools and package managers

### Architecture
- Folder structure patterns
- Layer organization (if any)
- Design patterns in use
- Dependency flow

### Existing .claude/ Configuration (if present)
For each component, assess:
- Is it comprehensive for this project?
- Does it use this project's actual patterns?
- Are there gaps or outdated references?

### Code Patterns
- Naming conventions actually used
- Error handling approach
- Test patterns and frameworks
- Documentation style

### Quality Gaps
- What skills would help this project?
- What agents would be useful?
- What hooks should be added?
- What existing components need updates?

## STEP 3: Output JSON

After your analysis, output a JSON block with this structure:

\`\`\`json
{
  "projectSummary": "One paragraph describing what this project is and does",
  "techStack": {
    "languages": ["csharp", "typescript"],
    "frameworks": ["dotnet", "angular", "ef-core"],
    "databases": ["postgresql"],
    "tools": ["docker", "github-actions"]
  },
  "architecture": {
    "pattern": "Clean Architecture",
    "layers": ["Domain", "Application", "Infrastructure", "WebAPI"],
    "designPatterns": ["CQRS", "Repository", "MediatR"]
  },
  "existingConfig": {
    "hasClaudeDir": true,
    "skills": [
      {"name": "code-reviewer", "status": "good", "notes": "Comprehensive"},
      {"name": "test-writer", "status": "needs-update", "notes": "Uses Jest examples but project uses xUnit"}
    ],
    "agents": [
      {"name": "architect", "status": "good", "notes": "Well configured"}
    ],
    "hooks": [
      {"name": "quality-gate", "status": "broken", "notes": "References npm test but project uses dotnet test"}
    ],
    "claudeMd": {
      "status": "needs-update",
      "notes": "Missing project-specific terminology"
    }
  },
  "codePatterns": {
    "namingConvention": "PascalCase for public, _camelCase for private fields",
    "errorHandling": "Custom exception classes with FluentValidation",
    "testFramework": "xUnit with FluentAssertions",
    "testPattern": "Arrange-Act-Assert with descriptive names"
  },
  "recommendations": [
    {
      "priority": "high",
      "action": "add",
      "type": "skill",
      "name": "database-reviewer",
      "reason": "Project has 23 EF Core migrations with complex relationships",
      "details": "Should include project's specific migration patterns"
    },
    {
      "priority": "high",
      "action": "fix",
      "type": "hook",
      "name": "quality-gate",
      "reason": "Currently runs 'npm test' but project uses 'dotnet test'",
      "details": "Change command to: dotnet test --no-build"
    },
    {
      "priority": "medium",
      "action": "update",
      "type": "skill",
      "name": "test-writer",
      "reason": "Examples use Jest but project uses xUnit",
      "details": "Replace examples with xUnit + FluentAssertions patterns"
    }
  ],
  "customComponentSuggestions": [
    {
      "type": "skill",
      "name": "project-specific-etl-patterns",
      "description": "ETL pipeline conventions specific to this project",
      "reason": "Project has unique data transformation patterns that should be documented"
    }
  ]
}
\`\`\`

Be thorough. Read actual files. Reference specific things you observe.
The JSON must be valid and parseable.
`;
}

/**
 * Parse Claude's response to extract the JSON analysis
 */
function parseAnalysisResponse(response) {
  // Look for JSON block in the response
  const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);

  if (jsonMatch && jsonMatch[1]) {
    try {
      return JSON.parse(jsonMatch[1]);
    } catch (e) {
      // Try to find raw JSON
      const rawJsonMatch = response.match(/\{[\s\S]*"projectSummary"[\s\S]*\}/);
      if (rawJsonMatch) {
        try {
          return JSON.parse(rawJsonMatch[0]);
        } catch (e2) {
          return { raw: response, parseError: true, error: e2.message };
        }
      }
    }
  }

  // Fallback: try to parse the entire response as JSON
  try {
    return JSON.parse(response);
  } catch {
    return { raw: response, parseError: true };
  }
}

/**
 * Apply recommendations from the analysis
 */
export async function applyRecommendations(recommendations, projectPath = process.cwd()) {
  const results = [];

  for (const rec of recommendations) {
    try {
      if (rec.action === 'add') {
        await addComponent(rec, projectPath);
        results.push({ ...rec, applied: true });
      } else if (rec.action === 'update') {
        await updateComponent(rec, projectPath);
        results.push({ ...rec, applied: true });
      } else if (rec.action === 'fix') {
        await fixComponent(rec, projectPath);
        results.push({ ...rec, applied: true });
      } else if (rec.action === 'remove') {
        await removeComponent(rec, projectPath);
        results.push({ ...rec, applied: true });
      } else {
        results.push({ ...rec, applied: false, error: `Unknown action: ${rec.action}` });
      }
    } catch (error) {
      results.push({ ...rec, applied: false, error: error.message });
    }
  }

  return results;
}

/**
 * Add a component based on recommendation
 */
async function addComponent(rec, projectPath) {
  const claudeDir = path.join(projectPath, '.claude');

  if (rec.type === 'skill') {
    const skillDir = path.join(claudeDir, 'skills', rec.name);
    await fs.mkdir(skillDir, { recursive: true });

    // Check if we have a template for this skill
    const template = skillTemplates[rec.name];
    if (template) {
      await fs.writeFile(path.join(skillDir, 'SKILL.md'), template);
    } else {
      // Generate a basic skill template
      const basicSkill = `# ${formatName(rec.name)} Skill

${rec.reason || 'Custom skill for this project.'}

## When to Use

${rec.details || 'Use this skill when working on related functionality.'}

## Guidelines

<!-- Add project-specific guidelines here -->

## Checklist

- [ ] Item 1
- [ ] Item 2
- [ ] Item 3
`;
      await fs.writeFile(path.join(skillDir, 'SKILL.md'), basicSkill);
    }
    console.log(`  Added skill: ${rec.name}`);
  } else if (rec.type === 'agent') {
    const agentsDir = path.join(claudeDir, 'agents');
    await fs.mkdir(agentsDir, { recursive: true });

    const template = agentTemplates[rec.name];
    if (template) {
      await fs.writeFile(path.join(agentsDir, `${rec.name}.md`), template);
    } else {
      const basicAgent = `# ${formatName(rec.name)} Agent

${rec.reason || 'Custom agent for this project.'}

## Capabilities

${rec.details || '- Capability 1\n- Capability 2'}

## Process

1. Step 1
2. Step 2
3. Step 3

## Output Format

Describe expected output format here.
`;
      await fs.writeFile(path.join(agentsDir, `${rec.name}.md`), basicAgent);
    }
    console.log(`  Added agent: ${rec.name}`);
  } else if (rec.type === 'hook') {
    const hooksDir = path.join(claudeDir, 'hooks');
    await fs.mkdir(hooksDir, { recursive: true });

    const template = hookTemplates[rec.name];
    if (template) {
      const hookPath = path.join(hooksDir, `${rec.name}.sh`);
      await fs.writeFile(hookPath, template);
      await fs.chmod(hookPath, 0o755);
    } else {
      const basicHook = `#!/bin/bash
# ${formatName(rec.name)} Hook
# ${rec.reason || 'Custom hook'}
# Exit codes: 0 = pass, 2 = block with message

set -e

# ${rec.details || 'Add hook logic here'}

exit 0
`;
      const hookPath = path.join(hooksDir, `${rec.name}.sh`);
      await fs.writeFile(hookPath, basicHook);
      await fs.chmod(hookPath, 0o755);
    }
    console.log(`  Added hook: ${rec.name}`);
  }
}

/**
 * Update an existing component
 */
async function updateComponent(rec, projectPath) {
  const claudeDir = path.join(projectPath, '.claude');

  if (rec.type === 'skill') {
    const skillPath = path.join(claudeDir, 'skills', rec.name, 'SKILL.md');

    // Read existing content
    let existingContent = '';
    try {
      existingContent = await fs.readFile(skillPath, 'utf-8');
    } catch {
      // If file doesn't exist, create it
      await addComponent(rec, projectPath);
      return;
    }

    // Add update note at the end
    const updateNote = `

---

## Updates Needed

**Reason**: ${rec.reason}

**Details**: ${rec.details || 'See above sections for needed changes.'}

<!-- TODO: Apply the above changes to this skill -->
`;

    if (!existingContent.includes('## Updates Needed')) {
      await fs.writeFile(skillPath, existingContent + updateNote);
    }
    console.log(`  Marked skill for update: ${rec.name}`);
  } else if (rec.type === 'agent') {
    const agentPath = path.join(claudeDir, 'agents', `${rec.name}.md`);

    let existingContent = '';
    try {
      existingContent = await fs.readFile(agentPath, 'utf-8');
    } catch {
      await addComponent(rec, projectPath);
      return;
    }

    const updateNote = `

---

## Updates Needed

**Reason**: ${rec.reason}

**Details**: ${rec.details || 'See above sections for needed changes.'}
`;

    if (!existingContent.includes('## Updates Needed')) {
      await fs.writeFile(agentPath, existingContent + updateNote);
    }
    console.log(`  Marked agent for update: ${rec.name}`);
  }
}

/**
 * Fix a broken component
 */
async function fixComponent(rec, projectPath) {
  // For now, fixing is similar to updating with more urgent messaging
  // In a more complete implementation, we could attempt automated fixes
  console.log(`  Fix needed for ${rec.type}: ${rec.name}`);
  console.log(`    Reason: ${rec.reason}`);
  console.log(`    Details: ${rec.details || 'Manual fix required'}`);

  // Mark component as needing fix
  await updateComponent(
    {
      ...rec,
      reason: `[FIX REQUIRED] ${rec.reason}`,
    },
    projectPath
  );
}

/**
 * Remove a component
 */
async function removeComponent(rec, projectPath) {
  const claudeDir = path.join(projectPath, '.claude');

  if (rec.type === 'skill') {
    const skillDir = path.join(claudeDir, 'skills', rec.name);
    try {
      await fs.rm(skillDir, { recursive: true });
      console.log(`  Removed skill: ${rec.name}`);
    } catch {
      console.log(`  Could not remove skill: ${rec.name} (may not exist)`);
    }
  } else if (rec.type === 'agent') {
    const agentPath = path.join(claudeDir, 'agents', `${rec.name}.md`);
    try {
      await fs.unlink(agentPath);
      console.log(`  Removed agent: ${rec.name}`);
    } catch {
      console.log(`  Could not remove agent: ${rec.name} (may not exist)`);
    }
  } else if (rec.type === 'hook') {
    const hookPath = path.join(claudeDir, 'hooks', `${rec.name}.sh`);
    try {
      await fs.unlink(hookPath);
      console.log(`  Removed hook: ${rec.name}`);
    } catch {
      console.log(`  Could not remove hook: ${rec.name} (may not exist)`);
    }
  }
}

/**
 * Format a kebab-case name to Title Case
 */
function formatName(name) {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Quick audit of existing configuration (no Claude required)
 */
export async function quickAudit(projectPath = process.cwd()) {
  const issues = [];
  const claudeDir = path.join(projectPath, '.claude');

  // Check if .claude directory exists
  try {
    await fs.access(claudeDir);
  } catch {
    return {
      exists: false,
      issues: [{ type: 'error', message: 'No .claude/ directory found' }],
    };
  }

  // Check settings.json
  const settingsPath = path.join(claudeDir, 'settings.json');
  try {
    const content = await fs.readFile(settingsPath, 'utf-8');
    JSON.parse(content); // Validate JSON
  } catch (e) {
    if (e.code === 'ENOENT') {
      issues.push({ type: 'warning', message: 'No settings.json found' });
    } else {
      issues.push({ type: 'error', message: `Invalid settings.json: ${e.message}` });
    }
  }

  // Check skills
  const skillsDir = path.join(claudeDir, 'skills');
  try {
    const skills = await fs.readdir(skillsDir);
    for (const skill of skills) {
      const skillPath = path.join(skillsDir, skill);
      const stat = await fs.stat(skillPath);
      if (stat.isDirectory()) {
        const skillMdPath = path.join(skillPath, 'SKILL.md');
        try {
          await fs.access(skillMdPath);
        } catch {
          issues.push({
            type: 'warning',
            message: `Skill '${skill}' missing SKILL.md`,
          });
        }
      }
    }
  } catch {
    issues.push({ type: 'info', message: 'No skills directory found' });
  }

  // Check hooks are executable
  const hooksDir = path.join(claudeDir, 'hooks');
  try {
    const hooks = await fs.readdir(hooksDir);
    for (const hook of hooks) {
      if (hook.endsWith('.sh')) {
        const hookPath = path.join(hooksDir, hook);
        const stat = await fs.stat(hookPath);
        // Check if file is executable (Unix)
        if (!(stat.mode & 0o111)) {
          issues.push({
            type: 'warning',
            message: `Hook '${hook}' is not executable`,
          });
        }
      }
    }
  } catch {
    issues.push({ type: 'info', message: 'No hooks directory found' });
  }

  // Check CLAUDE.md exists
  const claudeMdPath = path.join(projectPath, 'CLAUDE.md');
  try {
    await fs.access(claudeMdPath);
  } catch {
    issues.push({ type: 'warning', message: 'No CLAUDE.md found in project root' });
  }

  return {
    exists: true,
    issues,
    summary: {
      errors: issues.filter((i) => i.type === 'error').length,
      warnings: issues.filter((i) => i.type === 'warning').length,
      info: issues.filter((i) => i.type === 'info').length,
    },
  };
}
