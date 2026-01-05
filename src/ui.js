import chalk from 'chalk';
import boxen from 'boxen';
import figlet from 'figlet';
import gradient from 'gradient-string';

// Color palette
export const colors = {
  primary: chalk.hex('#7C3AED'),    // Purple
  secondary: chalk.hex('#06B6D4'),   // Cyan
  success: chalk.hex('#10B981'),     // Green
  warning: chalk.hex('#F59E0B'),     // Amber
  error: chalk.hex('#EF4444'),       // Red
  muted: chalk.hex('#6B7280'),       // Gray
  highlight: chalk.hex('#F472B6'),   // Pink
  white: chalk.white,
  dim: chalk.dim,
};

// Icon set
export const icons = {
  skill: '📚',
  agent: '🤖',
  hook: '🪝',
  check: '✅',
  cross: '❌',
  warning: '⚠️',
  info: 'ℹ️',
  rocket: '🚀',
  sparkles: '✨',
  folder: '📁',
  file: '📄',
  gear: '⚙️',
  lightning: '⚡',
  brain: '🧠',
  target: '🎯',
  shield: '🛡️',
  lock: '🔒',
  magic: '🪄',
  package: '📦',
  arrow: '→',
  bullet: '•',
  star: '⭐',
  code: '💻',
  test: '🧪',
  doc: '📝',
  security: '🔐',
  database: '🗄️',
  api: '🌐',
  performance: '⚡',
  accessibility: '♿',
  ux: '🎨',
  git: '🌿',
  error: '🚨',
  log: '📋',
  name: '🏷️',
};

// Custom gradient for the banner
const ccGradient = gradient(['#7C3AED', '#06B6D4', '#10B981']);

/**
 * Display the main banner
 */
export function showBanner() {
  const banner = figlet.textSync('CC Scaffold', {
    font: 'Standard',
    horizontalLayout: 'default',
  });

  console.log('\n' + ccGradient(banner));

  const tagline = boxen(
    colors.secondary('Claude Code Configuration Wizard') + '\n' +
    colors.muted('Skills • Agents • Hooks'),
    {
      padding: { top: 0, bottom: 0, left: 2, right: 2 },
      borderColor: '#7C3AED',
      borderStyle: 'round',
      textAlignment: 'center',
    }
  );

  console.log(tagline);
  console.log();
}

/**
 * Display a section header
 */
export function sectionHeader(title, icon = '') {
  const header = `\n${icon ? icon + ' ' : ''}${colors.primary.bold(title)}`;
  const line = colors.muted('─'.repeat(50));
  console.log(header);
  console.log(line);
}

/**
 * Display a success box
 */
export function successBox(title, content) {
  const box = boxen(
    colors.success.bold(title) + '\n\n' + content,
    {
      padding: 1,
      borderColor: '#10B981',
      borderStyle: 'round',
    }
  );
  console.log('\n' + box);
}

/**
 * Display an info box
 */
export function infoBox(title, content) {
  const box = boxen(
    colors.secondary.bold(title) + '\n\n' + content,
    {
      padding: 1,
      borderColor: '#06B6D4',
      borderStyle: 'round',
    }
  );
  console.log('\n' + box);
}

/**
 * Display a warning box
 */
export function warningBox(title, content) {
  const box = boxen(
    colors.warning.bold(title) + '\n\n' + content,
    {
      padding: 1,
      borderColor: '#F59E0B',
      borderStyle: 'round',
    }
  );
  console.log('\n' + box);
}

/**
 * Display an error box
 */
export function errorBox(title, content) {
  const box = boxen(
    colors.error.bold(title) + '\n\n' + content,
    {
      padding: 1,
      borderColor: '#EF4444',
      borderStyle: 'round',
    }
  );
  console.log('\n' + box);
}

/**
 * Display recommendations in a styled box
 */
export function recommendationsBox(recommendations) {
  const { skills, agents, hooks, reasons } = recommendations;

  let content = '';

  if (skills.length > 0) {
    content += colors.primary.bold(`${icons.skill} Recommended Skills:\n`);
    skills.forEach(s => {
      content += colors.white(`   ${icons.bullet} ${s}\n`);
    });
    content += '\n';
  }

  if (agents.length > 0) {
    content += colors.primary.bold(`${icons.agent} Recommended Agents:\n`);
    agents.forEach(a => {
      content += colors.white(`   ${icons.bullet} ${a}\n`);
    });
    content += '\n';
  }

  if (hooks.length > 0) {
    content += colors.primary.bold(`${icons.hook} Recommended Hooks:\n`);
    hooks.forEach(h => {
      content += colors.white(`   ${icons.bullet} ${h}\n`);
    });
    content += '\n';
  }

  if (reasons.length > 0) {
    content += colors.muted.bold('Reasons:\n');
    reasons.forEach(r => {
      content += colors.muted(`   ${icons.info} ${r}\n`);
    });
  }

  const box = boxen(
    colors.secondary.bold(`${icons.brain} Analysis Results\n\n`) + content.trim(),
    {
      padding: 1,
      borderColor: '#7C3AED',
      borderStyle: 'round',
    }
  );

  console.log('\n' + box);
}

/**
 * Display generation summary
 */
export function generationSummary(config) {
  const { outputDir, skills, agents, hooks } = config;

  let content = '';
  content += colors.white(`${icons.folder} Output: ${colors.secondary(outputDir)}\n\n`);

  content += colors.primary.bold('Generated Components:\n');
  content += colors.white(`   ${icons.skill} Skills: ${skills.length}\n`);
  content += colors.white(`   ${icons.agent} Agents: ${agents.length}\n`);
  content += colors.white(`   ${icons.hook} Hooks: ${hooks.length}\n\n`);

  content += colors.primary.bold('Files Created:\n');
  content += colors.muted(`   ${icons.file} CLAUDE.md\n`);
  content += colors.muted(`   ${icons.file} .claude/settings.json\n`);

  if (skills.length > 0) {
    content += colors.muted(`   ${icons.folder} .claude/skills/ (${skills.length} skills)\n`);
  }
  if (agents.length > 0) {
    content += colors.muted(`   ${icons.folder} .claude/agents/ (${agents.length} agents)\n`);
  }
  if (hooks.length > 0) {
    content += colors.muted(`   ${icons.folder} .claude/hooks/ (${hooks.length} hooks)\n`);
  }

  const box = boxen(
    colors.success.bold(`${icons.rocket} Configuration Generated Successfully!\n\n`) + content.trim(),
    {
      padding: 1,
      borderColor: '#10B981',
      borderStyle: 'double',
    }
  );

  console.log('\n' + box);
}

/**
 * Display a list of components
 */
export function componentList(type, components) {
  const iconMap = {
    skills: icons.skill,
    agents: icons.agent,
    hooks: icons.hook,
  };

  const icon = iconMap[type] || icons.package;

  sectionHeader(`Available ${type.charAt(0).toUpperCase() + type.slice(1)}`, icon);

  components.forEach(comp => {
    console.log(colors.white(`  ${icons.bullet} ${colors.secondary(comp.name)}`));
    console.log(colors.muted(`    ${comp.description}`));
    console.log();
  });
}

/**
 * Display a cancelled message
 */
export function cancelled() {
  console.log('\n' + colors.muted(`${icons.cross} Operation cancelled.`));
}

/**
 * Display a divider
 */
export function divider() {
  console.log(colors.muted('\n' + '─'.repeat(60) + '\n'));
}

/**
 * Format a list item
 */
export function listItem(text, checked = false) {
  const icon = checked ? icons.check : colors.muted('○');
  return `${icon} ${text}`;
}

export default {
  colors,
  icons,
  showBanner,
  sectionHeader,
  successBox,
  infoBox,
  warningBox,
  errorBox,
  recommendationsBox,
  generationSummary,
  componentList,
  cancelled,
  divider,
  listItem,
};
