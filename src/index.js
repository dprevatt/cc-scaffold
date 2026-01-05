#!/usr/bin/env node

/**
 * CC Scaffold - Claude Code Configuration Wizard
 * Interactive CLI for scaffolding skills, agents, and hooks
 */

import { Command } from 'commander';
import * as p from '@clack/prompts';
import ora from 'ora';
import {
  showBanner,
  sectionHeader,
  successBox,
  infoBox,
  warningBox,
  recommendationsBox,
  generationSummary,
  componentList,
  cancelled,
  colors,
  icons,
} from './ui.js';
import { getSkillList, getSkillNames } from './templates/skills.js';
import { getAgentList, getAgentNames } from './templates/agents.js';
import { getHookList, getHookNames } from './templates/hooks.js';
import { analyzeProject, officialSkills, defaults } from './analyzer.js';
import {
  generateProject,
  addComponents,
  validateConfiguration,
} from './generator.js';

const program = new Command();

// Project types
const projectTypes = [
  { value: 'dotnet-clean-arch', label: '.NET Clean Architecture' },
  { value: 'angular-frontend', label: 'Angular Frontend' },
  { value: 'react-nextjs', label: 'React / Next.js' },
  { value: 'api-service', label: 'API Service' },
  { value: 'cli-tool', label: 'CLI Tool' },
  { value: 'monorepo', label: 'Monorepo' },
  { value: 'general', label: 'General Project' },
];

// Tech stack options
const techStackOptions = [
  { value: 'dotnet', label: '.NET / C#' },
  { value: 'ef-core', label: 'Entity Framework Core' },
  { value: 'angular', label: 'Angular' },
  { value: 'react', label: 'React' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'sql', label: 'SQL Database' },
  { value: 'nosql', label: 'NoSQL Database' },
  { value: 'docker', label: 'Docker' },
  { value: 'kubernetes', label: 'Kubernetes' },
];

// Architecture patterns
const architectureOptions = [
  { value: 'clean-architecture', label: 'Clean Architecture' },
  { value: 'vertical-slice', label: 'Vertical Slice' },
  { value: 'cqrs', label: 'CQRS' },
  { value: 'event-sourcing', label: 'Event Sourcing' },
  { value: 'repository-pattern', label: 'Repository Pattern' },
  { value: 'microservices', label: 'Microservices' },
  { value: 'modular-monolith', label: 'Modular Monolith' },
];

// Quality concerns
const qualityConcerns = [
  { value: 'data-integrity', label: 'Data Integrity' },
  { value: 'security', label: 'Security' },
  { value: 'performance', label: 'Performance' },
  { value: 'accessibility', label: 'Accessibility' },
  { value: 'user-experience', label: 'User Experience' },
  { value: 'test-coverage', label: 'Test Coverage' },
  { value: 'documentation', label: 'Documentation' },
];

// Target users
const targetUserOptions = [
  { value: 'developers', label: 'Developers' },
  { value: 'non-technical', label: 'Non-technical Users' },
  { value: 'mixed', label: 'Mixed Audience' },
];

// Enforcement levels
const enforcementLevels = [
  {
    value: 'strict',
    label: `${icons.lock} Strict (recommended)`,
    hint: 'Hooks block if requirements not met',
  },
  {
    value: 'suggested',
    label: `${icons.info} Suggested`,
    hint: 'CLAUDE.md recommends but doesn\'t enforce',
  },
  {
    value: 'available',
    label: `${icons.gear} Available Only`,
    hint: 'Components installed but not enforced',
  },
];

/**
 * Main init command - Interactive project setup
 */
async function initCommand() {
  showBanner();

  // Check for cancellation
  const onCancel = () => {
    cancelled();
    process.exit(0);
  };

  // ===== SECTION 1: Project Details =====
  sectionHeader('Project Details', icons.folder);

  const projectDetails = await p.group(
    {
      name: () =>
        p.text({
          message: 'Project name',
          placeholder: 'my-awesome-project',
          validate: (value) => {
            if (!value) return 'Project name is required';
            if (!/^[a-z0-9-_]+$/i.test(value))
              return 'Use only letters, numbers, hyphens, and underscores';
          },
        }),
      description: () =>
        p.text({
          message: 'Describe your project',
          placeholder: 'A brief description of what your project does...',
        }),
      outputDir: () =>
        p.text({
          message: 'Output directory',
          placeholder: './.claude',
          initialValue: './.claude',
        }),
    },
    { onCancel }
  );

  // ===== SECTION 2: Technology Stack =====
  sectionHeader('Technology Stack', icons.gear);

  const projectType = await p.select({
    message: 'Project type',
    options: projectTypes,
  });

  if (p.isCancel(projectType)) {
    onCancel();
  }

  const techStack = await p.multiselect({
    message: 'Tech stack (select all that apply)',
    options: techStackOptions,
    required: false,
  });

  if (p.isCancel(techStack)) {
    onCancel();
  }

  const architecture = await p.multiselect({
    message: 'Architecture patterns (select all that apply)',
    options: architectureOptions,
    required: false,
  });

  if (p.isCancel(architecture)) {
    onCancel();
  }

  // ===== SECTION 3: Quality Priorities =====
  sectionHeader('Quality Priorities', icons.target);

  const concerns = await p.multiselect({
    message: 'Critical quality concerns',
    options: qualityConcerns,
    required: false,
  });

  if (p.isCancel(concerns)) {
    onCancel();
  }

  const targetUsers = await p.select({
    message: 'Target users',
    options: targetUserOptions,
  });

  if (p.isCancel(targetUsers)) {
    onCancel();
  }

  const hasApi = await p.confirm({
    message: 'Does the project expose an API?',
    initialValue: false,
  });

  if (p.isCancel(hasApi)) {
    onCancel();
  }

  // ===== SECTION 4: Analyze & Recommend =====
  const spinner = ora({
    text: colors.secondary('Analyzing project requirements...'),
    spinner: 'dots',
  }).start();

  await sleep(1500); // Simulate analysis

  const context = {
    projectType,
    techStack,
    architecture,
    concerns,
    targetUsers,
    hasApi,
  };

  const recommendations = analyzeProject(context);

  spinner.succeed(colors.success('Analysis complete!'));

  // Display recommendations
  recommendationsBox(recommendations);

  // ===== SECTION 5: Component Selection =====
  sectionHeader('Component Selection', icons.package);

  // Official Skills
  console.log(colors.primary.bold('\nOfficial Anthropic Skills'));
  const officialSelected = await p.multiselect({
    message: 'Select official skills',
    options: officialSkills.map((s) => ({
      value: s.name,
      label: s.name,
      hint: s.description,
    })),
    required: false,
  });

  if (p.isCancel(officialSelected)) {
    onCancel();
  }

  // Custom Skills
  console.log(colors.primary.bold('\nQuality Skills'));
  const skillOptions = getSkillList().map((s) => ({
    value: s.name,
    label: s.name,
    hint: s.description,
  }));

  const selectedSkills = await p.multiselect({
    message: 'Select skills',
    options: skillOptions,
    initialValues: recommendations.skills,
    required: false,
  });

  if (p.isCancel(selectedSkills)) {
    onCancel();
  }

  // Agents
  console.log(colors.primary.bold('\nSpecialized Agents'));
  const agentOptions = getAgentList().map((a) => ({
    value: a.name,
    label: a.name,
    hint: a.description,
  }));

  const selectedAgents = await p.multiselect({
    message: 'Select agents',
    options: agentOptions,
    initialValues: recommendations.agents,
    required: false,
  });

  if (p.isCancel(selectedAgents)) {
    onCancel();
  }

  // Hooks
  console.log(colors.primary.bold('\nLifecycle Hooks'));
  const hookOptions = getHookList().map((h) => ({
    value: h.name,
    label: h.name,
    hint: `${h.event}: ${h.description}`,
  }));

  const selectedHooks = await p.multiselect({
    message: 'Select hooks',
    options: hookOptions,
    initialValues: recommendations.hooks,
    required: false,
  });

  if (p.isCancel(selectedHooks)) {
    onCancel();
  }

  // ===== SECTION 6: Enforcement Level =====
  sectionHeader('Enforcement', icons.lock);

  const enforcementLevel = await p.select({
    message: 'How strictly should Claude follow components?',
    options: enforcementLevels,
    initialValue: 'strict',
  });

  if (p.isCancel(enforcementLevel)) {
    onCancel();
  }

  // ===== SECTION 7: Custom Components =====
  sectionHeader('Custom Components', icons.magic);

  const customComponents = [];
  const wantsCustom = await p.confirm({
    message: 'Create project-specific custom components?',
    initialValue: false,
  });

  if (p.isCancel(wantsCustom)) {
    onCancel();
  }

  if (wantsCustom) {
    let addMore = true;
    while (addMore) {
      const customType = await p.select({
        message: 'Component type',
        options: [
          { value: 'skill', label: `${icons.skill} Skill` },
          { value: 'agent', label: `${icons.agent} Agent` },
          { value: 'hook', label: `${icons.hook} Hook` },
        ],
      });

      if (p.isCancel(customType)) {
        break;
      }

      const customName = await p.text({
        message: 'Component name',
        placeholder: 'my-custom-component',
        validate: (value) => {
          if (!value) return 'Name is required';
          if (!/^[a-z0-9-]+$/.test(value))
            return 'Use lowercase letters, numbers, and hyphens only';
        },
      });

      if (p.isCancel(customName)) {
        break;
      }

      const customDesc = await p.text({
        message: 'Description',
        placeholder: 'What does this component do?',
      });

      if (p.isCancel(customDesc)) {
        break;
      }

      customComponents.push({
        type: customType,
        name: customName,
        description: customDesc,
      });

      addMore = await p.confirm({
        message: 'Add another custom component?',
        initialValue: false,
      });

      if (p.isCancel(addMore)) {
        break;
      }
    }
  }

  // ===== SECTION 8: Generate Output =====
  sectionHeader('Generation', icons.rocket);

  const generateSpinner = ora({
    text: colors.secondary('Generating Claude Code configuration...'),
    spinner: 'dots',
  }).start();

  try {
    const config = {
      projectName: projectDetails.name,
      description: projectDetails.description,
      outputDir: projectDetails.outputDir,
      projectType,
      techStack,
      architecture,
      skills: selectedSkills,
      agents: selectedAgents,
      hooks: selectedHooks,
      enforcementLevel,
      customComponents,
    };

    await generateProject(config);

    generateSpinner.succeed(colors.success('Configuration generated!'));

    // Show summary
    generationSummary({
      outputDir: projectDetails.outputDir,
      skills: selectedSkills,
      agents: selectedAgents,
      hooks: selectedHooks,
    });

    // Next steps
    console.log(colors.muted('\nNext steps:'));
    console.log(colors.muted(`  1. Review the generated CLAUDE.md`));
    console.log(colors.muted(`  2. Customize skills and agents as needed`));
    console.log(colors.muted(`  3. Start using Claude Code with your new configuration!`));
    console.log();
  } catch (error) {
    generateSpinner.fail(colors.error('Generation failed'));
    console.error(colors.error(error.message));
    process.exit(1);
  }
}

/**
 * Add command - Add components to existing project
 */
async function addCommand(type) {
  showBanner();

  const validTypes = ['skill', 'agent', 'hook'];
  if (!validTypes.includes(type)) {
    console.log(colors.error(`Invalid type: ${type}`));
    console.log(colors.muted(`Valid types: ${validTypes.join(', ')}`));
    process.exit(1);
  }

  let options;
  let message;

  switch (type) {
    case 'skill':
      options = getSkillList().map((s) => ({
        value: s.name,
        label: s.name,
        hint: s.description,
      }));
      message = 'Select skills to add';
      break;
    case 'agent':
      options = getAgentList().map((a) => ({
        value: a.name,
        label: a.name,
        hint: a.description,
      }));
      message = 'Select agents to add';
      break;
    case 'hook':
      options = getHookList().map((h) => ({
        value: h.name,
        label: h.name,
        hint: `${h.event}: ${h.description}`,
      }));
      message = 'Select hooks to add';
      break;
  }

  const selected = await p.multiselect({
    message,
    options,
    required: true,
  });

  if (p.isCancel(selected)) {
    cancelled();
    process.exit(0);
  }

  const spinner = ora({
    text: colors.secondary(`Adding ${type}s...`),
    spinner: 'dots',
  }).start();

  try {
    const added = await addComponents(type, selected);
    spinner.succeed(colors.success(`Added ${added.length} ${type}(s)`));

    console.log();
    for (const name of added) {
      console.log(colors.success(`  ${icons.check} ${name}`));
    }
    console.log();
  } catch (error) {
    spinner.fail(colors.error('Failed to add components'));
    console.error(colors.error(error.message));
    process.exit(1);
  }
}

/**
 * List command - List available components
 */
function listCommand(type) {
  showBanner();

  if (!type || type === 'all') {
    componentList('skills', getSkillList());
    componentList('agents', getAgentList());
    componentList('hooks', getHookList());
  } else if (type === 'skills') {
    componentList('skills', getSkillList());
  } else if (type === 'agents') {
    componentList('agents', getAgentList());
  } else if (type === 'hooks') {
    componentList('hooks', getHookList());
  } else {
    console.log(colors.error(`Unknown type: ${type}`));
    console.log(colors.muted('Valid types: skills, agents, hooks, all'));
  }
}

/**
 * Validate command - Validate current configuration
 */
async function validateCommand() {
  showBanner();

  const spinner = ora({
    text: colors.secondary('Validating configuration...'),
    spinner: 'dots',
  }).start();

  try {
    const results = await validateConfiguration();
    spinner.stop();

    if (results.valid) {
      successBox(
        'Configuration Valid',
        `${icons.skill} Skills: ${results.summary.skills}\n` +
          `${icons.agent} Agents: ${results.summary.agents}\n` +
          `${icons.hook} Hooks: ${results.summary.hooks}`
      );
    } else {
      warningBox('Configuration Issues', results.errors.join('\n'));
    }

    if (results.warnings.length > 0) {
      console.log(colors.warning('\nWarnings:'));
      results.warnings.forEach((w) => {
        console.log(colors.warning(`  ${icons.warning} ${w}`));
      });
    }

    console.log();
  } catch (error) {
    spinner.fail(colors.error('Validation failed'));
    console.error(colors.error(error.message));
    process.exit(1);
  }
}

/**
 * Sleep helper
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ===== CLI Setup =====

program
  .name('cc-scaffold')
  .description('Interactive CLI for scaffolding Claude Code skills, agents, and hooks')
  .version('1.0.0');

program
  .command('init')
  .description('Interactive project setup')
  .action(initCommand);

program
  .command('add <type>')
  .description('Add skill/agent/hook to existing project')
  .action(addCommand);

program
  .command('list [type]')
  .description('List all available components')
  .action(listCommand);

program
  .command('validate')
  .description('Validate current configuration')
  .action(validateCommand);

// Default to init if no command specified
if (process.argv.length <= 2) {
  initCommand();
} else {
  program.parse();
}
