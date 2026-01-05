/**
 * Project analyzer and recommendation engine for CC Scaffold
 */

/**
 * Recommendation rules based on project context
 */
const recommendationRules = [
  // Clean Architecture
  {
    condition: (ctx) => ctx.architecture?.includes('clean-architecture'),
    skills: ['refactoring-advisor', 'naming-conventions', 'code-reviewer'],
    agents: ['architect', 'refactorer'],
    hooks: ['layer-violation-blocker'],
    reason: 'Clean Architecture requires strict layer boundaries and naming conventions',
  },

  // Vertical Slice
  {
    condition: (ctx) => ctx.architecture?.includes('vertical-slice'),
    skills: ['refactoring-advisor', 'code-reviewer'],
    agents: ['architect'],
    hooks: [],
    reason: 'Vertical Slice Architecture benefits from feature-focused organization',
  },

  // CQRS
  {
    condition: (ctx) => ctx.architecture?.includes('cqrs'),
    skills: ['code-reviewer', 'naming-conventions'],
    agents: ['architect'],
    hooks: [],
    reason: 'CQRS pattern requires clear separation of commands and queries',
  },

  // Microservices
  {
    condition: (ctx) => ctx.architecture?.includes('microservices'),
    skills: ['api-design-reviewer', 'logging-standards', 'error-handling-patterns'],
    agents: ['architect', 'debugger'],
    hooks: [],
    reason: 'Microservices require robust API design and observability',
  },

  // Data Integrity concerns
  {
    condition: (ctx) => ctx.concerns?.includes('data-integrity'),
    skills: ['database-reviewer', 'test-writer', 'error-handling-patterns'],
    agents: ['test-runner', 'migrator'],
    hooks: ['quality-gate'],
    reason: 'Data integrity requires comprehensive testing and safe migrations',
  },

  // Security concerns
  {
    condition: (ctx) => ctx.concerns?.includes('security'),
    skills: ['security-auditor', 'dependency-auditor', 'error-handling-patterns'],
    agents: ['security-auditor'],
    hooks: ['secrets-scanner', 'quality-gate'],
    reason: 'Security concerns require proactive vulnerability scanning',
  },

  // Performance concerns
  {
    condition: (ctx) => ctx.concerns?.includes('performance'),
    skills: ['performance-analyzer', 'database-reviewer'],
    agents: ['debugger'],
    hooks: [],
    reason: 'Performance optimization needs systematic analysis',
  },

  // Accessibility concerns
  {
    condition: (ctx) => ctx.concerns?.includes('accessibility'),
    skills: ['accessibility-auditor', 'ux-reviewer'],
    agents: [],
    hooks: [],
    reason: 'Accessibility requires WCAG compliance validation',
  },

  // User Experience concerns
  {
    condition: (ctx) => ctx.concerns?.includes('user-experience'),
    skills: ['ux-reviewer', 'accessibility-auditor'],
    agents: [],
    hooks: [],
    reason: 'Great UX requires usability heuristic evaluation',
  },

  // Test Coverage concerns
  {
    condition: (ctx) => ctx.concerns?.includes('test-coverage'),
    skills: ['test-writer', 'code-reviewer'],
    agents: ['test-runner'],
    hooks: ['quality-gate'],
    reason: 'High test coverage requires systematic test writing',
  },

  // Documentation concerns
  {
    condition: (ctx) => ctx.concerns?.includes('documentation'),
    skills: ['doc-generator', 'commit-msg-generator'],
    agents: ['doc-engineer', 'onboarder'],
    hooks: ['changelog-reminder'],
    reason: 'Good documentation needs consistent generation and updates',
  },

  // Non-technical users
  {
    condition: (ctx) => ctx.targetUsers === 'non-technical',
    skills: ['accessibility-auditor', 'ux-reviewer'],
    agents: [],
    hooks: [],
    reason: 'Non-technical users need accessible, intuitive interfaces',
  },

  // Frontend frameworks
  {
    condition: (ctx) =>
      ctx.techStack?.includes('angular') ||
      ctx.techStack?.includes('react') ||
      ctx.techStack?.includes('nextjs'),
    skills: ['accessibility-auditor', 'ux-reviewer', 'performance-analyzer', 'test-writer'],
    agents: ['test-runner'],
    hooks: ['post-edit-format'],
    reason: 'Frontend frameworks benefit from UX validation and formatting',
  },

  // Angular specific
  {
    condition: (ctx) => ctx.techStack?.includes('angular'),
    skills: ['naming-conventions', 'test-writer'],
    agents: ['test-runner'],
    hooks: ['pre-commit-lint'],
    reason: 'Angular projects need strict conventions and testing',
  },

  // React/Next.js specific
  {
    condition: (ctx) => ctx.techStack?.includes('react') || ctx.techStack?.includes('nextjs'),
    skills: ['performance-analyzer', 'test-writer'],
    agents: ['test-runner'],
    hooks: ['pre-commit-lint'],
    reason: 'React projects benefit from performance optimization',
  },

  // .NET / C#
  {
    condition: (ctx) => ctx.techStack?.includes('dotnet'),
    skills: ['naming-conventions', 'code-reviewer', 'test-writer'],
    agents: ['architect', 'test-runner'],
    hooks: ['pre-commit-lint', 'post-edit-format'],
    reason: '.NET projects need consistent conventions and architecture',
  },

  // Entity Framework Core / SQL
  {
    condition: (ctx) =>
      ctx.techStack?.includes('ef-core') || ctx.techStack?.includes('sql'),
    skills: ['database-reviewer'],
    agents: ['migrator'],
    hooks: [],
    reason: 'Database work needs migration safety and query optimization',
  },

  // Node.js
  {
    condition: (ctx) => ctx.techStack?.includes('nodejs'),
    skills: ['logging-standards', 'error-handling-patterns', 'dependency-auditor'],
    agents: ['debugger'],
    hooks: ['pre-commit-lint', 'post-edit-format'],
    reason: 'Node.js projects need good error handling and dependency management',
  },

  // TypeScript
  {
    condition: (ctx) => ctx.techStack?.includes('typescript'),
    skills: ['naming-conventions', 'code-reviewer'],
    agents: [],
    hooks: ['pre-commit-lint'],
    reason: 'TypeScript benefits from strict naming and type checking',
  },

  // Python
  {
    condition: (ctx) => ctx.techStack?.includes('python'),
    skills: ['naming-conventions', 'test-writer', 'doc-generator'],
    agents: ['test-runner'],
    hooks: ['pre-commit-lint', 'post-edit-format'],
    reason: 'Python projects need PEP8 compliance and documentation',
  },

  // Docker/Kubernetes
  {
    condition: (ctx) =>
      ctx.techStack?.includes('docker') || ctx.techStack?.includes('kubernetes'),
    skills: ['security-auditor'],
    agents: ['architect'],
    hooks: ['secrets-scanner'],
    reason: 'Container environments need security hardening',
  },

  // API projects
  {
    condition: (ctx) => ctx.hasApi,
    skills: ['api-design-reviewer', 'doc-generator', 'security-auditor'],
    agents: ['doc-engineer'],
    hooks: [],
    reason: 'APIs benefit from design validation and documentation',
  },

  // CLI tools
  {
    condition: (ctx) => ctx.projectType === 'cli-tool',
    skills: ['doc-generator', 'error-handling-patterns'],
    agents: ['doc-engineer'],
    hooks: [],
    reason: 'CLI tools need good documentation and error handling',
  },

  // Monorepos
  {
    condition: (ctx) => ctx.projectType === 'monorepo',
    skills: ['naming-conventions', 'git-workflow'],
    agents: ['architect'],
    hooks: ['branch-protection'],
    reason: 'Monorepos need consistent conventions across packages',
  },

  // Always include these for any project
  {
    condition: () => true,
    skills: ['code-reviewer', 'commit-msg-generator', 'git-workflow'],
    agents: ['code-reviewer'],
    hooks: ['session-context-loader'],
    reason: 'Essential skills for any software project',
  },
];

/**
 * Default skills, agents, and hooks that are always available
 */
export const defaults = {
  skills: [
    'code-reviewer',
    'test-writer',
    'commit-msg-generator',
    'git-workflow',
  ],
  agents: ['code-reviewer', 'debugger'],
  hooks: ['session-context-loader'],
};

/**
 * Official Anthropic skills (document processing)
 */
export const officialSkills = [
  { name: 'docx', description: 'Process Microsoft Word documents' },
  { name: 'pdf', description: 'Process PDF documents' },
  { name: 'pptx', description: 'Process PowerPoint presentations' },
  { name: 'xlsx', description: 'Process Excel spreadsheets' },
  { name: 'skill-creator', description: 'Help create new custom skills' },
  { name: 'frontend-design', description: 'Design frontend interfaces' },
];

/**
 * Analyze project context and generate recommendations
 *
 * @param {Object} context - Project context from user input
 * @returns {Object} Recommended skills, agents, hooks, and reasons
 */
export function analyzeProject(context) {
  const recommendations = {
    skills: new Set(),
    agents: new Set(),
    hooks: new Set(),
    reasons: [],
  };

  // Apply each rule
  for (const rule of recommendationRules) {
    try {
      if (rule.condition(context)) {
        // Add skills
        if (rule.skills) {
          rule.skills.forEach((s) => recommendations.skills.add(s));
        }
        // Add agents
        if (rule.agents) {
          rule.agents.forEach((a) => recommendations.agents.add(a));
        }
        // Add hooks
        if (rule.hooks) {
          rule.hooks.forEach((h) => recommendations.hooks.add(h));
        }
        // Add reason (if not a generic always-true rule)
        if (rule.reason && rule.condition.toString() !== '() => true') {
          recommendations.reasons.push(rule.reason);
        }
      }
    } catch (error) {
      // Skip rules that fail (e.g., missing properties)
      continue;
    }
  }

  // Convert sets to arrays
  return {
    skills: [...recommendations.skills],
    agents: [...recommendations.agents],
    hooks: [...recommendations.hooks],
    reasons: [...new Set(recommendations.reasons)], // Dedupe reasons
  };
}

/**
 * Get priority score for a component based on recommendations
 *
 * @param {string} name - Component name
 * @param {string[]} recommended - List of recommended components
 * @returns {number} Priority score (higher = more important)
 */
export function getPriorityScore(name, recommended) {
  if (recommended.includes(name)) {
    return 100;
  }
  // Default priority based on common usefulness
  const priorities = {
    'code-reviewer': 90,
    'test-writer': 85,
    'security-auditor': 80,
    'git-workflow': 75,
    'commit-msg-generator': 70,
    'doc-generator': 65,
    'quality-gate': 60,
    'session-context-loader': 55,
  };
  return priorities[name] || 50;
}

/**
 * Sort components by priority
 *
 * @param {string[]} components - List of component names
 * @param {string[]} recommended - List of recommended components
 * @returns {string[]} Sorted list
 */
export function sortByPriority(components, recommended) {
  return [...components].sort((a, b) => {
    const scoreA = getPriorityScore(a, recommended);
    const scoreB = getPriorityScore(b, recommended);
    return scoreB - scoreA;
  });
}

/**
 * Detect project type from file system (future enhancement)
 *
 * @param {string} directory - Project directory
 * @returns {Object} Detected project context
 */
export async function detectProjectContext(directory) {
  // This would analyze package.json, tsconfig.json, etc.
  // For now, return empty context
  return {
    projectType: null,
    techStack: [],
    architecture: [],
    hasApi: false,
  };
}

export default {
  analyzeProject,
  getPriorityScore,
  sortByPriority,
  detectProjectContext,
  defaults,
  officialSkills,
};
