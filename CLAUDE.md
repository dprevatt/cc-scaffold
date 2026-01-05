# cc-scaffold

Interactive CLI for scaffolding Claude Code skills, agents, and hooks with intelligent project analysis and recommendations.

## Project Overview

This CLI tool helps developers quickly set up Claude Code configurations for their projects. It interviews users about their project, analyzes the context, recommends relevant components, and generates a complete `.claude/` directory structure.

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **CLI Framework**: Commander.js
- **Interactive Prompts**: @clack/prompts
- **Styling**: chalk, picocolors, gradient-string, boxen, figlet
- **Spinners**: ora

## Architecture

```
cc-scaffold/
├── package.json
├── README.md
├── CLAUDE.md
├── .gitignore
├── src/
│   ├── index.js              # Main CLI entry point with commands
│   ├── generator.js          # File generation logic
│   ├── analyzer.js           # Project analysis & recommendations
│   ├── ui.js                 # UI utilities (colors, icons, boxes)
│   └── templates/
│       ├── skills.js         # All skill templates
│       ├── agents.js         # All agent templates
│       └── hooks.js          # All hook templates
└── examples/
    └── sample-output/        # Example generated output
```

## Commands to Implement

```bash
cc-scaffold init              # Interactive project setup
cc-scaffold add <type>        # Add skill/agent/hook to existing project
cc-scaffold list              # List all available components
cc-scaffold validate          # Validate current configuration
```

## Main CLI Flow (`src/index.js`)

### 1. Show Banner
- Use figlet for ASCII art "CC Scaffold"
- Use gradient-string for colorful output
- Show tagline in boxen

### 2. Project Details Section
```
? Project name: ___
? Describe your project: ___
? Output directory: ./.claude
```

### 3. Technology Stack Section
```
? Project type: (select one)
  - dotnet-clean-arch
  - angular-frontend
  - react-nextjs
  - api-service
  - cli-tool
  - monorepo
  - general

? Tech stack: (multiselect)
  - .NET / C#
  - Entity Framework Core
  - Angular
  - React
  - Next.js
  - TypeScript
  - Python
  - Node.js
  - SQL Database
  - NoSQL Database
  - Docker
  - Kubernetes

? Architecture patterns: (multiselect)
  - Clean Architecture
  - Vertical Slice
  - CQRS
  - Event Sourcing
  - Repository Pattern
  - Microservices
  - Modular Monolith
```

### 4. Quality Priorities Section
```
? Critical quality concerns: (multiselect)
  - Data Integrity
  - Security
  - Performance
  - Accessibility
  - User Experience
  - Test Coverage
  - Documentation

? Target users:
  - Developers
  - Non-technical users
  - Mixed audience

? Does project expose an API? (y/n)
```

### 5. Analyze & Recommend
- Show spinner "Analyzing project requirements..."
- Run recommendation engine
- Display recommendations in styled box with reasons

### 6. Component Selection
```
OFFICIAL ANTHROPIC SKILLS
◉ docx
◉ pdf
◉ pptx
◉ xlsx
◉ skill-creator
◯ frontend-design

CUSTOM QUALITY SKILLS
◉ code-reviewer
◉ test-writer
◉ security-auditor
... (pre-check recommended ones)

SPECIALIZED AGENTS
◉ architect
◉ code-reviewer
◉ test-runner
...

LIFECYCLE HOOKS
◉ session-context-loader
◉ quality-gate
...
```

### 7. Enforcement Level
```
? How strictly should Claude follow components?
  ❯ 🔒 Strict (recommended) - Hooks block if requirements not met
    ℹ️  Suggested - CLAUDE.md recommends but doesn't enforce
    👁️  Available Only - Components installed but not enforced
```

### 8. Custom Components (Optional)
```
? Create project-specific custom components? (y/n)

If yes, loop:
  ? Component type: skill / agent / hook
  ? Name: ___
  ? Description: ___
  ? Add another? (y/n)
```

### 9. Generate Output
- Show spinner "Generating Claude Code configuration..."
- Call generator.js
- Show success box with summary

## UI Utilities (`src/ui.js`)

```javascript
export const colors = {
  primary: chalk.hex('#7C3AED'),    // Purple
  secondary: chalk.hex('#06B6D4'),   // Cyan
  success: chalk.hex('#10B981'),     // Green
  warning: chalk.hex('#F59E0B'),     // Amber
  error: chalk.hex('#EF4444'),       // Red
  muted: chalk.hex('#6B7280'),       // Gray
  highlight: chalk.hex('#F472B6'),   // Pink
};

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
};

export function showBanner() { ... }
export function sectionHeader(title, icon) { ... }
```

## Recommendation Engine (`src/analyzer.js`)

```javascript
const recommendationRules = [
  {
    condition: (ctx) => ctx.architecture?.includes('clean-architecture'),
    skills: ['refactoring-advisor', 'naming-conventions'],
    agents: ['architect'],
    hooks: ['layer-violation-blocker'],
    reason: 'Clean Architecture requires strict layer boundaries',
  },
  {
    condition: (ctx) => ctx.concerns?.includes('data-integrity'),
    skills: ['database-reviewer', 'test-writer'],
    agents: ['test-runner'],
    hooks: ['quality-gate'],
    reason: 'Data integrity requires comprehensive testing',
  },
  {
    condition: (ctx) => ctx.concerns?.includes('security'),
    skills: ['security-auditor', 'dependency-auditor'],
    agents: ['security-auditor'],
    hooks: ['secrets-scanner'],
    reason: 'Security concerns require proactive scanning',
  },
  {
    condition: (ctx) => ctx.targetUsers === 'non-technical',
    skills: ['accessibility-auditor', 'ux-reviewer'],
    reason: 'Non-technical users need accessible interfaces',
  },
  {
    condition: (ctx) => ctx.techStack?.includes('angular') || ctx.techStack?.includes('react'),
    skills: ['accessibility-auditor', 'ux-reviewer'],
    reason: 'Frontend frameworks benefit from UX validation',
  },
  {
    condition: (ctx) => ctx.techStack?.includes('ef-core') || ctx.techStack?.includes('sql'),
    skills: ['database-reviewer'],
    agents: ['migrator'],
    reason: 'Database work needs migration safety reviews',
  },
  {
    condition: (ctx) => ctx.hasApi,
    skills: ['api-design-reviewer'],
    reason: 'APIs benefit from design validation',
  },
  {
    condition: (ctx) => ctx.concerns?.includes('performance'),
    skills: ['performance-analyzer'],
    reason: 'Performance concerns need systematic analysis',
  },
];

export function analyzeProject(context) {
  // Returns { skills: [], agents: [], hooks: [], reasons: [] }
}
```

## Generator (`src/generator.js`)

### Functions
- `generateProject(config)` - Main generator
- `generateClaudeMd(config)` - Generate CLAUDE.md content
- `generateSettingsJson(config)` - Generate .claude/settings.json
- `addComponents(type, names)` - Add components to existing project

### Output Structure
```
project/
├── CLAUDE.md
└── .claude/
    ├── settings.json
    ├── skills/
    │   ├── code-reviewer/
    │   │   └── SKILL.md
    │   ├── test-writer/
    │   │   └── SKILL.md
    │   └── project-standards/
    │       └── SKILL.md        # Meta-skill for enforcement
    ├── agents/
    │   ├── architect.md
    │   └── ...
    └── hooks/
        ├── session-context-loader.sh
        └── ...
```

---

## Component Templates

### Skills to Include (16 total)

Each skill needs a full SKILL.md with proper frontmatter and detailed instructions.

#### 1. code-reviewer
```yaml
name: code-reviewer
description: Review code for quality, security, and best practices. USE THIS SKILL for any code changes, before commits, during PR reviews, when editing files, when refactoring.
```
- Review checklist: Correctness, Security, Maintainability, Performance, Testing
- Output format with severity levels (Critical/Warning/Suggestion)
- Code smell detection patterns
- Security vulnerability patterns

#### 2. test-writer
```yaml
name: test-writer
description: Write comprehensive tests following AAA pattern. Use when creating unit tests, integration tests, or adding test coverage.
```
- AAA pattern (Arrange-Act-Assert)
- Coverage requirements (happy path, edge cases, errors)
- Naming conventions
- Anti-patterns to avoid

#### 3. security-auditor
```yaml
name: security-auditor
description: Audit code for security vulnerabilities. Use for auth logic, data handling, API endpoints, before deployments.
```
- OWASP checklist
- Search patterns for common vulnerabilities
- Severity classification
- Report format

#### 4. doc-generator
```yaml
name: doc-generator
description: Generate documentation from code. Use for README, API docs, inline documentation.
```
- Documentation types and templates
- Writing standards
- Code example requirements

#### 5. commit-msg-generator
```yaml
name: commit-msg-generator
description: Generate conventional commit messages from staged changes.
```
- Conventional commit format
- Type definitions
- Good/bad examples

#### 6. refactoring-advisor
```yaml
name: refactoring-advisor
description: Identify code smells and suggest refactoring patterns.
```
- Code smell categories (Bloaters, OO Abusers, Change Preventers, etc.)
- Refactoring patterns with examples
- Safety checklist

#### 7. api-design-reviewer
```yaml
name: api-design-reviewer
description: Review API design for REST/GraphQL best practices.
```
- URL design rules
- HTTP method usage
- Status code reference
- Response/error format standards
- Pagination, filtering, versioning

#### 8. database-reviewer
```yaml
name: database-reviewer
description: Review database schema and queries for optimization and safety.
```
- Schema design checklist
- Query optimization patterns
- N+1 detection
- Migration safety guide

#### 9. accessibility-auditor
```yaml
name: accessibility-auditor
description: Audit UI for WCAG compliance. Use for UI development, forms, navigation, interactive elements.
```
- WCAG 2.1 checklist by principle (Perceivable, Operable, Understandable, Robust)
- ARIA patterns
- Color contrast requirements
- Keyboard navigation

#### 10. ux-reviewer
```yaml
name: ux-reviewer
description: Review UI/UX for usability. Use for interface design, user flows, forms, navigation.
```
- Nielsen's 10 heuristics with checkpoints
- UX laws (Fitts, Hick, Jakob, Miller)
- Common UX issues checklist

#### 11. performance-analyzer
```yaml
name: performance-analyzer
description: Identify performance bottlenecks and optimization opportunities.
```
- Frontend checklist (Core Web Vitals, lazy loading, etc.)
- Backend checklist (queries, caching, etc.)
- Common bottleneck patterns
- Optimization strategies

#### 12. dependency-auditor
```yaml
name: dependency-auditor
description: Audit dependencies for vulnerabilities, outdated packages, license conflicts.
```
- Audit commands by ecosystem
- License compatibility guide
- Best practices

#### 13. naming-conventions
```yaml
name: naming-conventions
description: Enforce consistent naming conventions across codebase.
```
- Conventions by language (JS/TS, C#, Python)
- Naming patterns for functions, variables, files
- Anti-patterns

#### 14. error-handling-patterns
```yaml
name: error-handling-patterns
description: Implement consistent error handling patterns.
```
- Core principles
- Custom error classes
- Async handling
- Retry patterns
- Logging best practices

#### 15. logging-standards
```yaml
name: logging-standards
description: Implement consistent logging for observability.
```
- Log levels
- Structured logging format
- Correlation IDs
- PII masking
- What to log / not log

#### 16. git-workflow
```yaml
name: git-workflow
description: Follow Git workflow best practices.
```
- Branch naming
- Commit message format
- PR template
- Protected branch rules
- Release process

---

### Agents to Include (10 total)

Each agent needs frontmatter with name, description, tools, model.

#### 1. architect
- Design review and ADR generation
- Tools: Read, Grep, Glob, Bash
- ADR output format

#### 2. code-reviewer
- Post-change quality gate
- Automatic diff analysis
- Severity-based output

#### 3. security-auditor
- Pre-deployment security validation
- Vulnerability scanning
- Report generation

#### 4. test-runner
- Auto-run tests on changes
- Fix failing tests
- Model: haiku (for speed)
- Tools: Read, Write, Edit, Bash

#### 5. doc-engineer
- Technical documentation specialist
- Multiple doc types

#### 6. debugger
- Systematic debugging process
- Reproduce → Isolate → Hypothesize → Verify → Fix

#### 7. refactorer
- Safe refactoring with test verification
- Incremental changes

#### 8. migrator
- Database/API migration specialist
- Safe vs dangerous operations

#### 9. onboarder
- Generate onboarding docs from codebase analysis

#### 10. estimator
- Task breakdown and estimation
- Risk identification

---

### Hooks to Include (10 total)

Each hook is a bash script with proper exit codes (0 = pass, 2 = block with message).

#### 1. pre-commit-lint
- Event: PreToolUse (Write|Edit)
- Run linter, block if fails

#### 2. post-edit-format
- Event: PostToolUse (Write|Edit)
- Auto-format edited files

#### 3. session-context-loader
- Event: SessionStart
- Display available skills/agents/hooks
- Show reminders

#### 4. quality-gate
- Event: Stop
- Verify tests pass before completion

#### 5. secrets-scanner
- Event: PreToolUse (Write)
- Block commits containing secrets

#### 6. layer-violation-blocker
- Event: PreToolUse (Write)
- Block Clean Architecture violations

#### 7. large-file-warning
- Event: PreToolUse (Write)
- Warn when creating >500 line files

#### 8. branch-protection
- Event: PreToolUse (Bash)
- Prevent commits to main/master

#### 9. changelog-reminder
- Event: Stop
- Remind to update CHANGELOG

#### 10. todo-collector
- Event: PostToolUse (Write|Edit)
- Extract TODOs to tracking file

---

## settings.json Format

```json
{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Write|Edit", "command": ".claude/hooks/pre-commit-lint.sh" },
      { "matcher": "Write", "command": ".claude/hooks/secrets-scanner.sh" }
    ],
    "PostToolUse": [
      { "matcher": "Write|Edit", "command": ".claude/hooks/post-edit-format.sh" }
    ],
    "Stop": [
      { "matcher": "*", "command": ".claude/hooks/quality-gate.sh" }
    ],
    "SessionStart": [
      { "matcher": "*", "command": ".claude/hooks/session-context-loader.sh" }
    ]
  }
}
```

---

## CLAUDE.md Output Format

```markdown
# {Project Name}

{Description}

## Project Context
- **Type**: {projectType}
- **Stack**: {techStack}
- **Architecture**: {architecture}

## Required Skills
{List of @.claude/skills/X/SKILL.md}

## Required Agents
{List of @.claude/agents/X.md}

## Hooks (Automatic)
{List of hooks}

## Enforcement Rules (if strict)
- Before commits: Run code-reviewer
- Before deployments: Run security-auditor
- Hooks block if requirements not met

## Checklist
- [ ] Skills consulted
- [ ] Code reviewed
- [ ] Tests pass
- [ ] Docs updated
```

---

## Implementation Notes

1. **Use ES Modules** - All imports use `import` not `require`
2. **Beautiful output** - Every section should have visual polish
3. **Graceful cancellation** - Handle Ctrl+C cleanly
4. **Validation** - Validate inputs where appropriate
5. **Idempotent** - Running twice shouldn't break things
6. **Full templates** - Each skill/agent/hook should have complete, useful content

## Testing

After implementation, test with:
```bash
npm start
# Walk through the full flow
# Verify output in .claude/ directory
```

## Commit Strategy

1. Initial setup (package.json, .gitignore, README)
2. UI utilities (src/ui.js)
3. Templates (src/templates/*.js)
4. Analyzer (src/analyzer.js)
5. Generator (src/generator.js)
6. Main CLI (src/index.js)
7. Examples and polish
