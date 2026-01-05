import fs from 'fs/promises';
import path from 'path';

/**
 * Merge new configuration with existing .claude/ directory
 */
export async function mergeConfigurations(existing, newConfig, strategy = 'merge') {
  if (strategy === 'backup-replace') {
    await backupExisting(existing.path);
    return newConfig;
  }

  if (strategy === 'replace') {
    return newConfig;
  }

  if (strategy === 'cancel') {
    return null;
  }

  // Default: merge strategy
  // Keep existing customizations while adding new components
  return {
    ...newConfig,
    components: {
      skills: mergeComponents(
        existing.skills,
        newConfig.components?.skills || [],
        'skill'
      ),
      agents: mergeComponents(
        existing.agents,
        newConfig.components?.agents || [],
        'agent'
      ),
      hooks: mergeComponents(
        existing.hooks,
        newConfig.components?.hooks || [],
        'hook'
      ),
      custom: [
        ...(existing.custom || []),
        ...(newConfig.components?.custom || []),
      ],
    },
    preservedContext: existing.preservedContext,
  };
}

/**
 * Backup existing .claude/ directory
 */
export async function backupExisting(projectPath = process.cwd()) {
  const claudeDir = path.join(projectPath, '.claude');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(projectPath, `.claude.backup.${timestamp}`);

  try {
    // Check if .claude exists
    await fs.access(claudeDir);

    // Copy to backup location
    await copyDir(claudeDir, backupDir);

    console.log(`Backed up existing .claude/ to ${path.basename(backupDir)}`);
    return backupDir;
  } catch (error) {
    if (error.code === 'ENOENT') {
      // No .claude directory to backup
      return null;
    }
    throw new Error(`Failed to backup: ${error.message}`);
  }
}

/**
 * Recursively copy a directory
 */
async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

/**
 * Load existing configuration from .claude/ directory
 */
export async function loadExistingConfig(projectPath = process.cwd()) {
  const claudeDir = path.join(projectPath, '.claude');

  const config = {
    path: claudeDir,
    exists: false,
    skills: [],
    agents: [],
    hooks: [],
    custom: [],
    settings: null,
    claudeMd: null,
    preservedContext: {},
  };

  // Check if .claude exists
  try {
    await fs.access(claudeDir);
    config.exists = true;
  } catch {
    return config;
  }

  // Load settings.json
  const settingsPath = path.join(claudeDir, 'settings.json');
  try {
    const content = await fs.readFile(settingsPath, 'utf-8');
    config.settings = JSON.parse(content);
  } catch {
    // No settings or invalid JSON
  }

  // Load skills
  const skillsDir = path.join(claudeDir, 'skills');
  try {
    const skillDirs = await fs.readdir(skillsDir);
    for (const dir of skillDirs) {
      const skillDirPath = path.join(skillsDir, dir);
      const stat = await fs.stat(skillDirPath).catch(() => null);

      if (stat?.isDirectory()) {
        const skillPath = path.join(skillDirPath, 'SKILL.md');
        try {
          const content = await fs.readFile(skillPath, 'utf-8');
          config.skills.push({
            name: dir,
            content,
            customSections: extractCustomSections(content),
          });
        } catch {
          // Skill directory without SKILL.md
          config.skills.push({ name: dir, content: null, customSections: '' });
        }
      }
    }
  } catch {
    // No skills directory
  }

  // Load agents
  const agentsDir = path.join(claudeDir, 'agents');
  try {
    const agentFiles = await fs.readdir(agentsDir);
    for (const file of agentFiles) {
      if (file.endsWith('.md')) {
        const content = await fs.readFile(path.join(agentsDir, file), 'utf-8');
        config.agents.push({
          name: file.replace('.md', ''),
          content,
          customSections: extractCustomSections(content),
        });
      }
    }
  } catch {
    // No agents directory
  }

  // Load hooks
  const hooksDir = path.join(claudeDir, 'hooks');
  try {
    const hookFiles = await fs.readdir(hooksDir);
    for (const file of hookFiles) {
      if (file.endsWith('.sh')) {
        const content = await fs.readFile(path.join(hooksDir, file), 'utf-8');
        config.hooks.push({
          name: file.replace('.sh', ''),
          content,
        });
      }
    }
  } catch {
    // No hooks directory
  }

  // Load CLAUDE.md from project root
  const claudeMdPath = path.join(projectPath, 'CLAUDE.md');
  try {
    config.claudeMd = await fs.readFile(claudeMdPath, 'utf-8');
  } catch {
    // No CLAUDE.md
  }

  // Load preserved context
  const contextDir = path.join(claudeDir, 'context');
  try {
    const contextFiles = await fs.readdir(contextDir);
    for (const file of contextFiles) {
      if (file.endsWith('.md')) {
        const content = await fs.readFile(path.join(contextDir, file), 'utf-8');
        config.preservedContext[file.replace('.md', '')] = content;
      }
    }
  } catch {
    // No context directory
  }

  return config;
}

/**
 * Extract custom/project-specific sections from a component.
 * These are sections marked with specific headers that should be preserved.
 */
function extractCustomSections(content) {
  if (!content) return '';

  const customMarkers = [
    '## Project-Specific',
    '## Our Rules',
    '## Custom Rules',
    '## Project Rules',
    '## Local Additions',
    '## Team Conventions',
    '## Company Standards',
  ];

  let customContent = '';

  for (const marker of customMarkers) {
    const markerIndex = content.indexOf(marker);
    if (markerIndex !== -1) {
      // Find the next ## heading or end of file
      const afterMarker = content.slice(markerIndex + marker.length);
      const nextHeadingMatch = afterMarker.match(/\n## [^#]/);
      const endIndex = nextHeadingMatch
        ? markerIndex + marker.length + nextHeadingMatch.index
        : content.length;

      customContent += content.slice(markerIndex, endIndex) + '\n\n';
    }
  }

  return customContent.trim();
}

/**
 * Merge component arrays, preserving custom sections from existing components
 */
function mergeComponents(existing, incoming, type) {
  const existingByName = new Map();

  // Index existing components
  for (const item of existing) {
    const name = typeof item === 'string' ? item : item.name;
    existingByName.set(name, item);
  }

  const merged = [];

  // Process incoming components
  for (const item of incoming) {
    const name = typeof item === 'string' ? item : item;
    const existingItem = existingByName.get(name);

    if (existingItem) {
      // Component exists - preserve custom sections
      merged.push({
        name,
        preserveCustomSections: existingItem.customSections || '',
        isUpdate: true,
      });
      existingByName.delete(name);
    } else {
      // New component
      merged.push({
        name,
        isNew: true,
      });
    }
  }

  // Add remaining existing components that weren't in incoming
  for (const [name, item] of existingByName) {
    merged.push({
      name,
      content: item.content,
      customSections: item.customSections,
      isExisting: true,
    });
  }

  return merged;
}

/**
 * Restore from a backup
 */
export async function restoreFromBackup(backupPath, projectPath = process.cwd()) {
  const claudeDir = path.join(projectPath, '.claude');

  // Remove current .claude
  try {
    await fs.rm(claudeDir, { recursive: true });
  } catch {
    // May not exist
  }

  // Copy backup to .claude
  await copyDir(backupPath, claudeDir);

  console.log(`Restored .claude/ from ${path.basename(backupPath)}`);
}

/**
 * List available backups
 */
export async function listBackups(projectPath = process.cwd()) {
  const entries = await fs.readdir(projectPath, { withFileTypes: true });
  const backups = [];

  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.startsWith('.claude.backup.')) {
      const timestamp = entry.name.replace('.claude.backup.', '');
      const stat = await fs.stat(path.join(projectPath, entry.name));
      backups.push({
        name: entry.name,
        timestamp,
        created: stat.birthtime,
        path: path.join(projectPath, entry.name),
      });
    }
  }

  // Sort by creation time, newest first
  backups.sort((a, b) => b.created - a.created);

  return backups;
}

/**
 * Clean up old backups, keeping only the most recent N
 */
export async function cleanupBackups(projectPath = process.cwd(), keepCount = 5) {
  const backups = await listBackups(projectPath);

  if (backups.length <= keepCount) {
    return { removed: 0, kept: backups.length };
  }

  const toRemove = backups.slice(keepCount);
  let removed = 0;

  for (const backup of toRemove) {
    try {
      await fs.rm(backup.path, { recursive: true });
      removed++;
    } catch {
      // Failed to remove, continue
    }
  }

  return { removed, kept: keepCount };
}

/**
 * Get summary of differences between existing and new configuration
 */
export function getDiffSummary(existing, newConfig) {
  const existingSkills = new Set(existing.skills.map((s) => s.name));
  const existingAgents = new Set(existing.agents.map((a) => a.name));
  const existingHooks = new Set(existing.hooks.map((h) => h.name));

  const newSkills = new Set(newConfig.components?.skills || []);
  const newAgents = new Set(newConfig.components?.agents || []);
  const newHooks = new Set(newConfig.components?.hooks || []);

  return {
    skills: {
      added: [...newSkills].filter((s) => !existingSkills.has(s)),
      removed: [...existingSkills].filter((s) => !newSkills.has(s)),
      kept: [...newSkills].filter((s) => existingSkills.has(s)),
    },
    agents: {
      added: [...newAgents].filter((a) => !existingAgents.has(a)),
      removed: [...existingAgents].filter((a) => !newAgents.has(a)),
      kept: [...newAgents].filter((a) => existingAgents.has(a)),
    },
    hooks: {
      added: [...newHooks].filter((h) => !existingHooks.has(h)),
      removed: [...existingHooks].filter((h) => !newHooks.has(h)),
      kept: [...newHooks].filter((h) => existingHooks.has(h)),
    },
  };
}

/**
 * Format diff summary for display
 */
export function formatDiffSummary(diff) {
  const lines = [];

  const formatSection = (name, section) => {
    const parts = [];
    if (section.added.length > 0) {
      parts.push(`+${section.added.length} new`);
    }
    if (section.kept.length > 0) {
      parts.push(`${section.kept.length} kept`);
    }
    if (section.removed.length > 0) {
      parts.push(`-${section.removed.length} removed`);
    }
    if (parts.length > 0) {
      lines.push(`${name}: ${parts.join(', ')}`);
    }
  };

  formatSection('Skills', diff.skills);
  formatSection('Agents', diff.agents);
  formatSection('Hooks', diff.hooks);

  return lines.join('\n');
}
