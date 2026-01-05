# CC Scaffold

Interactive CLI for scaffolding Claude Code skills, agents, and hooks with intelligent project analysis and recommendations.

## Features

- **Interactive Setup** - Guided wizard for configuring Claude Code for your project
- **Smart Recommendations** - Analyzes your project context to suggest relevant components
- **16 Quality Skills** - Pre-built skills for code review, testing, security, documentation, and more
- **10 Specialized Agents** - Autonomous agents for architecture, debugging, refactoring, and more
- **10 Lifecycle Hooks** - Automated quality gates, linting, formatting, and safety checks
- **Beautiful CLI** - Colorful output with gradients, spinners, and styled boxes

## Installation

```bash
npm install -g cc-scaffold
```

Or run directly with npx:

```bash
npx cc-scaffold init
```

## Usage

### Initialize a New Project

```bash
cc-scaffold init
```

This will:
1. Ask about your project details
2. Analyze your technology stack and architecture
3. Recommend relevant skills, agents, and hooks
4. Generate a complete `.claude/` directory structure

### Add Components to Existing Project

```bash
cc-scaffold add skill    # Add a skill
cc-scaffold add agent    # Add an agent
cc-scaffold add hook     # Add a hook
```

### List Available Components

```bash
cc-scaffold list
cc-scaffold list skills
cc-scaffold list agents
cc-scaffold list hooks
```

### Validate Configuration

```bash
cc-scaffold validate
```

## Generated Structure

```
your-project/
├── CLAUDE.md              # Project instructions for Claude
└── .claude/
    ├── settings.json      # Hook configurations
    ├── skills/
    │   ├── code-reviewer/
    │   │   └── SKILL.md
    │   ├── test-writer/
    │   │   └── SKILL.md
    │   └── ...
    ├── agents/
    │   ├── architect.md
    │   ├── debugger.md
    │   └── ...
    └── hooks/
        ├── pre-commit-lint.sh
        ├── quality-gate.sh
        └── ...
```

## Available Components

### Skills (16)

| Skill | Description |
|-------|-------------|
| code-reviewer | Review code for quality, security, and best practices |
| test-writer | Write comprehensive tests following AAA pattern |
| security-auditor | Audit code for security vulnerabilities |
| doc-generator | Generate documentation from code |
| commit-msg-generator | Generate conventional commit messages |
| refactoring-advisor | Identify code smells and suggest refactoring |
| api-design-reviewer | Review API design for REST/GraphQL best practices |
| database-reviewer | Review database schema and queries |
| accessibility-auditor | Audit UI for WCAG compliance |
| ux-reviewer | Review UI/UX for usability |
| performance-analyzer | Identify performance bottlenecks |
| dependency-auditor | Audit dependencies for vulnerabilities |
| naming-conventions | Enforce consistent naming conventions |
| error-handling-patterns | Implement consistent error handling |
| logging-standards | Implement consistent logging |
| git-workflow | Follow Git workflow best practices |

### Agents (10)

| Agent | Description |
|-------|-------------|
| architect | Design review and ADR generation |
| code-reviewer | Post-change quality gate |
| security-auditor | Pre-deployment security validation |
| test-runner | Auto-run tests on changes |
| doc-engineer | Technical documentation specialist |
| debugger | Systematic debugging process |
| refactorer | Safe refactoring with test verification |
| migrator | Database/API migration specialist |
| onboarder | Generate onboarding docs from codebase |
| estimator | Task breakdown and estimation |

### Hooks (10)

| Hook | Event | Description |
|------|-------|-------------|
| pre-commit-lint | PreToolUse | Run linter before file writes |
| post-edit-format | PostToolUse | Auto-format edited files |
| session-context-loader | SessionStart | Display available components |
| quality-gate | Stop | Verify tests pass before completion |
| secrets-scanner | PreToolUse | Block commits containing secrets |
| layer-violation-blocker | PreToolUse | Block Clean Architecture violations |
| large-file-warning | PreToolUse | Warn when creating large files |
| branch-protection | PreToolUse | Prevent commits to protected branches |
| changelog-reminder | Stop | Remind to update CHANGELOG |
| todo-collector | PostToolUse | Extract TODOs to tracking file |

## Enforcement Levels

When running `cc-scaffold init`, you can choose how strictly Claude should follow the components:

- **Strict** - Hooks block if requirements not met (recommended)
- **Suggested** - CLAUDE.md recommends but doesn't enforce
- **Available Only** - Components installed but not enforced

## Requirements

- Node.js 18.0.0 or higher

## License

MIT
