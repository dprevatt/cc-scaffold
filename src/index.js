#!/usr/bin/env node

/**
 * CC Scaffold - Claude Code Configuration Wizard
 * Interactive CLI for scaffolding skills, agents, and hooks
 */

import { Command } from 'commander';
import * as p from '@clack/prompts';
import ora from 'ora';
import boxen from 'boxen';
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
import { scanProject, formatScanResults } from './scanner.js';
import { analyzeWithClaude, applyRecommendations, quickAudit } from './claude-analyzer.js';
import {
  mergeConfigurations,
  loadExistingConfig,
  backupExisting,
  getDiffSummary,
  formatDiffSummary,
  listBackups,
} from './merger.js';

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
async function initCommand(options) {
  showBanner();

  // Check for cancellation
  const onCancel = () => {
    cancelled();
    process.exit(0);
  };

  let prefilled = {
    name: '',
    projectType: 'general',
    techStack: [],
    architecture: [],
    hasApi: false,
  };

  // ===== AUTO-SCAN (if --scan flag is provided) =====
  if (options.scan) {
    const spinner = ora({
      text: colors.secondary('Scanning project...'),
      spinner: 'dots',
    }).start();

    try {
      prefilled = await scanProject(process.cwd());
      spinner.succeed(
        colors.success(
          `Detected: ${prefilled.frameworks.length > 0 ? prefilled.frameworks.join(', ') : prefilled.projectType}`
        )
      );

      // Show scan results
      console.log(
        boxen(formatScanResults(prefilled), {
          title: `${icons.brain} Scan Results`,
          padding: 1,
          borderColor: 'cyan',
          borderStyle: 'round',
        })
      );
    } catch (e) {
      spinner.warn('Scan completed with warnings');
    }
  }

  // ===== CHECK FOR EXISTING .claude/ =====
  if (prefilled.existingClaude) {
    console.log();
    const action = await p.select({
      message: 'Existing .claude/ found. What would you like to do?',
      options: [
        { value: 'merge', label: `${icons.sparkles} Merge (keep customizations, add new)` },
        { value: 'backup-replace', label: `${icons.package} Backup & Replace` },
        { value: 'analyze', label: `${icons.brain} Analyze with Claude first` },
        { value: 'cancel', label: `${icons.cross} Cancel` },
      ],
    });

    if (p.isCancel(action) || action === 'cancel') {
      onCancel();
    }

    if (action === 'analyze') {
      // Redirect to analyze command
      await analyzeCommand({ fix: false });
      return;
    }

    prefilled.mergeStrategy = action;
  }

  // ===== SECTION 1: Project Details =====
  sectionHeader('Project Details', icons.folder);

  const projectDetails = await p.group(
    {
      name: () =>
        p.text({
          message: 'Project name',
          placeholder: 'my-awesome-project',
          initialValue: prefilled.name || '',
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

  // Pre-select project type from scan
  const projectTypeInitial = projectTypes.find((t) => t.value === prefilled.projectType)
    ? prefilled.projectType
    : 'general';

  const projectType = await p.select({
    message: 'Project type',
    options: projectTypes,
    initialValue: projectTypeInitial,
  });

  if (p.isCancel(projectType)) {
    onCancel();
  }

  // Pre-select tech stack from scan
  const techStackInitial = prefilled.techStack || [];

  const techStack = await p.multiselect({
    message: 'Tech stack (select all that apply)',
    options: techStackOptions,
    initialValues: techStackInitial,
    required: false,
  });

  if (p.isCancel(techStack)) {
    onCancel();
  }

  // Pre-select architecture from scan
  const architectureInitial = prefilled.architecture || [];

  const architecture = await p.multiselect({
    message: 'Architecture patterns (select all that apply)',
    options: architectureOptions,
    initialValues: architectureInitial,
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
    initialValue: prefilled.hasApi || false,
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

  // Handle merge strategy if existing config
  if (prefilled.mergeStrategy === 'backup-replace') {
    const backupSpinner = ora({
      text: colors.secondary('Backing up existing configuration...'),
      spinner: 'dots',
    }).start();

    try {
      await backupExisting(process.cwd());
      backupSpinner.succeed(colors.success('Backup created'));
    } catch (error) {
      backupSpinner.warn('Could not create backup: ' + error.message);
    }
  }

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
 * Analyze command - Deep Claude-powered analysis
 */
async function analyzeCommand(options) {
  showBanner();

  console.log(
    boxen(
      `This will invoke Claude to deeply analyze your codebase.

Claude will:
  ${icons.folder} Read and understand your project structure
  ${icons.gear} Examine existing .claude/ configuration
  ${icons.target} Identify gaps and issues
  ${icons.lightning} Provide intelligent recommendations`,
      {
        title: `${icons.brain} DEEP PROJECT ANALYSIS`,
        padding: 1,
        borderColor: 'magenta',
        borderStyle: 'round',
      }
    )
  );

  const proceed = await p.confirm({ message: 'Proceed?', initialValue: true });
  if (p.isCancel(proceed) || !proceed) {
    cancelled();
    return;
  }

  const spinner = ora({
    text: colors.secondary('Invoking Claude for deep analysis...'),
    spinner: 'dots',
  }).start();

  try {
    const analysis = await analyzeWithClaude(process.cwd(), {
      ...options,
      onProgress: (charsReceived) => {
        spinner.text = colors.secondary(
          `Analyzing with Claude... (${charsReceived.toLocaleString()} chars received)`
        );
      },
    });
    spinner.succeed(colors.success('Analysis complete!'));

    // Display results
    displayAnalysis(analysis);

    if (analysis.recommendations?.length > 0) {
      const action = await p.select({
        message: 'What would you like to do?',
        options: [
          {
            value: 'apply-all',
            label: `${icons.rocket} Apply all ${analysis.recommendations.length} recommendations`,
          },
          { value: 'apply-high', label: `${icons.warning} Apply high priority only` },
          { value: 'select', label: `${icons.gear} Select individually` },
          { value: 'export', label: `${icons.file} Export report` },
          { value: 'exit', label: `${icons.cross} Exit` },
        ],
      });

      if (p.isCancel(action) || action === 'exit') {
        return;
      }

      if (action === 'apply-all') {
        const applySpinner = ora({
          text: colors.secondary('Applying recommendations...'),
          spinner: 'dots',
        }).start();

        const results = await applyRecommendations(analysis.recommendations);
        applySpinner.succeed(colors.success('Recommendations applied!'));

        const applied = results.filter((r) => r.applied).length;
        const failed = results.filter((r) => !r.applied).length;

        console.log(
          colors.success(`\n  ${icons.check} Applied: ${applied}`) +
            (failed > 0 ? colors.error(`  ${icons.cross} Failed: ${failed}`) : '')
        );
      } else if (action === 'apply-high') {
        const highPriority = analysis.recommendations.filter((r) => r.priority === 'high');

        if (highPriority.length === 0) {
          console.log(colors.muted('\nNo high priority recommendations.'));
          return;
        }

        const applySpinner = ora({
          text: colors.secondary(`Applying ${highPriority.length} high priority recommendations...`),
          spinner: 'dots',
        }).start();

        const results = await applyRecommendations(highPriority);
        applySpinner.succeed(colors.success('High priority recommendations applied!'));

        const applied = results.filter((r) => r.applied).length;
        console.log(colors.success(`\n  ${icons.check} Applied: ${applied}`));
      } else if (action === 'select') {
        const recOptions = analysis.recommendations.map((r, i) => ({
          value: i,
          label: `[${r.action.toUpperCase()}] ${r.name}`,
          hint: r.reason,
        }));

        const selected = await p.multiselect({
          message: 'Select recommendations to apply',
          options: recOptions,
          required: false,
        });

        if (!p.isCancel(selected) && selected.length > 0) {
          const toApply = selected.map((i) => analysis.recommendations[i]);

          const applySpinner = ora({
            text: colors.secondary(`Applying ${toApply.length} recommendations...`),
            spinner: 'dots',
          }).start();

          const results = await applyRecommendations(toApply);
          applySpinner.succeed(colors.success('Selected recommendations applied!'));

          const applied = results.filter((r) => r.applied).length;
          console.log(colors.success(`\n  ${icons.check} Applied: ${applied}`));
        }
      } else if (action === 'export') {
        const fs = await import('fs/promises');
        const reportPath = './claude-analysis-report.json';
        await fs.writeFile(reportPath, JSON.stringify(analysis, null, 2));
        console.log(colors.success(`\n${icons.check} Report exported to ${reportPath}`));
      }
    }
  } catch (error) {
    spinner.fail(colors.error('Analysis failed'));
    console.error(colors.error(error.message));

    // Offer fallback
    const fallback = await p.confirm({
      message: 'Fall back to file-based scanning?',
      initialValue: true,
    });

    if (fallback && !p.isCancel(fallback)) {
      const scanSpinner = ora({
        text: colors.secondary('Scanning project files...'),
        spinner: 'dots',
      }).start();

      const scan = await scanProject(process.cwd());
      scanSpinner.succeed(colors.success('Scan complete!'));

      console.log(
        boxen(formatScanResults(scan), {
          title: `${icons.folder} Scan Results`,
          padding: 1,
          borderColor: 'cyan',
          borderStyle: 'round',
        })
      );
    }
  }
}

/**
 * Audit command - Quick validation of existing config
 */
async function auditCommand() {
  showBanner();

  const spinner = ora({
    text: colors.secondary('Auditing configuration...'),
    spinner: 'dots',
  }).start();

  try {
    const results = await quickAudit(process.cwd());
    spinner.stop();

    if (!results.exists) {
      warningBox('No Configuration Found', 'No .claude/ directory found in this project.\n\nRun `cc-scaffold init` to create one.');
      return;
    }

    if (results.issues.length === 0) {
      successBox(
        'Configuration Valid',
        `${icons.check} No issues found!\n\nYour .claude/ configuration is properly set up.`
      );
      return;
    }

    // Display issues by type
    const errors = results.issues.filter((i) => i.type === 'error');
    const warnings = results.issues.filter((i) => i.type === 'warning');
    const info = results.issues.filter((i) => i.type === 'info');

    let output = '';

    if (errors.length > 0) {
      output += colors.error.bold('\nErrors:\n');
      errors.forEach((e) => {
        output += colors.error(`  ${icons.cross} ${e.message}\n`);
      });
    }

    if (warnings.length > 0) {
      output += colors.warning.bold('\nWarnings:\n');
      warnings.forEach((w) => {
        output += colors.warning(`  ${icons.warning} ${w.message}\n`);
      });
    }

    if (info.length > 0) {
      output += colors.muted.bold('\nInfo:\n');
      info.forEach((i) => {
        output += colors.muted(`  ${icons.info} ${i.message}\n`);
      });
    }

    console.log(
      boxen(output.trim(), {
        title: `${icons.target} Audit Results`,
        padding: 1,
        borderColor: errors.length > 0 ? 'red' : warnings.length > 0 ? 'yellow' : 'cyan',
        borderStyle: 'round',
      })
    );

    console.log(
      colors.muted(
        `\nSummary: ${results.summary.errors} errors, ${results.summary.warnings} warnings, ${results.summary.info} info`
      )
    );
  } catch (error) {
    spinner.fail(colors.error('Audit failed'));
    console.error(colors.error(error.message));
    process.exit(1);
  }
}

/**
 * Display analysis results
 */
function displayAnalysis(analysis) {
  if (analysis.parseError) {
    console.log('\nClaude\'s analysis (raw):\n');
    console.log(analysis.raw);
    return;
  }

  // Project Summary
  if (analysis.projectSummary) {
    console.log(
      boxen(analysis.projectSummary, {
        title: `${icons.folder} PROJECT UNDERSTANDING`,
        padding: 1,
        borderColor: 'cyan',
        borderStyle: 'round',
      })
    );
  }

  // Tech Stack
  if (analysis.techStack) {
    let techInfo = '';
    if (analysis.techStack.languages?.length) {
      techInfo += `Languages: ${analysis.techStack.languages.join(', ')}\n`;
    }
    if (analysis.techStack.frameworks?.length) {
      techInfo += `Frameworks: ${analysis.techStack.frameworks.join(', ')}\n`;
    }
    if (analysis.techStack.databases?.length) {
      techInfo += `Databases: ${analysis.techStack.databases.join(', ')}\n`;
    }
    if (analysis.techStack.tools?.length) {
      techInfo += `Tools: ${analysis.techStack.tools.join(', ')}\n`;
    }

    if (techInfo) {
      console.log(
        boxen(techInfo.trim(), {
          title: `${icons.gear} TECH STACK`,
          padding: 1,
          borderColor: 'blue',
          borderStyle: 'round',
        })
      );
    }
  }

  // Existing Config Assessment
  if (analysis.existingConfig?.hasClaudeDir) {
    let configStatus = '';

    for (const skill of analysis.existingConfig.skills || []) {
      const icon = skill.status === 'good' ? icons.check : skill.status === 'needs-update' ? icons.warning : icons.cross;
      configStatus += `${icon} ${skill.name} - ${skill.notes}\n`;
    }

    for (const agent of analysis.existingConfig.agents || []) {
      const icon = agent.status === 'good' ? icons.check : agent.status === 'needs-update' ? icons.warning : icons.cross;
      configStatus += `${icon} ${agent.name} - ${agent.notes}\n`;
    }

    for (const hook of analysis.existingConfig.hooks || []) {
      const icon = hook.status === 'good' ? icons.check : hook.status === 'needs-update' ? icons.warning : icons.cross;
      configStatus += `${icon} ${hook.name} - ${hook.notes}\n`;
    }

    if (configStatus) {
      console.log(
        boxen(configStatus.trim(), {
          title: `${icons.file} EXISTING CONFIGURATION`,
          padding: 1,
          borderColor: 'yellow',
          borderStyle: 'round',
        })
      );
    }
  }

  // Recommendations
  if (analysis.recommendations?.length > 0) {
    let recText = '';

    const byPriority = { high: [], medium: [], low: [] };
    for (const rec of analysis.recommendations) {
      byPriority[rec.priority || 'medium'].push(rec);
    }

    if (byPriority.high.length) {
      recText += colors.error.bold('HIGH PRIORITY:\n');
      byPriority.high.forEach((r, i) => {
        recText += `  ${i + 1}. [${r.action.toUpperCase()}] ${r.name}\n`;
        recText += `     ${colors.muted(r.reason)}\n`;
      });
    }

    if (byPriority.medium.length) {
      recText += colors.warning.bold('\nMEDIUM PRIORITY:\n');
      byPriority.medium.forEach((r, i) => {
        recText += `  ${i + 1}. [${r.action.toUpperCase()}] ${r.name}\n`;
        recText += `     ${colors.muted(r.reason)}\n`;
      });
    }

    if (byPriority.low.length) {
      recText += colors.muted.bold('\nLOW PRIORITY:\n');
      byPriority.low.forEach((r, i) => {
        recText += `  ${i + 1}. [${r.action.toUpperCase()}] ${r.name}\n`;
        recText += `     ${colors.muted(r.reason)}\n`;
      });
    }

    console.log(
      boxen(recText.trim(), {
        title: `${icons.lightning} RECOMMENDATIONS`,
        padding: 1,
        borderColor: 'green',
        borderStyle: 'round',
      })
    );
  }

  // Custom Component Suggestions
  if (analysis.customComponentSuggestions?.length > 0) {
    let suggestText = '';
    analysis.customComponentSuggestions.forEach((s) => {
      suggestText += `${icons.sparkles} ${s.name} (${s.type})\n`;
      suggestText += `   ${s.description}\n`;
      suggestText += `   ${colors.muted(s.reason)}\n\n`;
    });

    console.log(
      boxen(suggestText.trim(), {
        title: `${icons.magic} CUSTOM COMPONENT SUGGESTIONS`,
        padding: 1,
        borderColor: 'magenta',
        borderStyle: 'round',
      })
    );
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
  .option('--scan', 'Auto-detect project characteristics before wizard')
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

program
  .command('analyze')
  .description('Deep Claude-powered analysis of project')
  .option('--fix', 'Auto-apply recommendations')
  .option('--verbose', 'Show detailed output')
  .action(analyzeCommand);

program
  .command('audit')
  .description('Quick validation of existing .claude/ configuration')
  .action(auditCommand);

// Default to init if no command specified
if (process.argv.length <= 2) {
  initCommand({ scan: false });
} else {
  program.parse();
}
