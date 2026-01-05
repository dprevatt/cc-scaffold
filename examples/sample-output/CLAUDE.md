# example-webapp

A full-stack web application with React frontend and Node.js API

## Project Context

- **Type**: react-nextjs
- **Stack**: react, typescript, nodejs, sql
- **Architecture**: clean-architecture, repository-pattern

## Required Skills

- @.claude/skills/code-reviewer/SKILL.md
- @.claude/skills/test-writer/SKILL.md
- @.claude/skills/security-auditor/SKILL.md
- @.claude/skills/doc-generator/SKILL.md
- @.claude/skills/commit-msg-generator/SKILL.md
- @.claude/skills/api-design-reviewer/SKILL.md
- @.claude/skills/database-reviewer/SKILL.md
- @.claude/skills/git-workflow/SKILL.md

## Required Agents

- @.claude/agents/architect.md
- @.claude/agents/code-reviewer.md
- @.claude/agents/test-runner.md
- @.claude/agents/debugger.md
- @.claude/agents/doc-engineer.md

## Active Hooks

The following hooks run automatically:

- **session-context-loader**: Display available skills and agents at session start
- **quality-gate**: Verify tests pass before session completion
- **pre-commit-lint**: Run linter before file writes
- **post-edit-format**: Auto-format files after editing
- **secrets-scanner**: Block commits containing secrets
- **branch-protection**: Prevent direct commits to protected branches

## Enforcement Rules

This project uses **strict** enforcement:

- Hooks will **block** operations if requirements are not met
- All quality gates must pass before completion
- Skills should be consulted for their respective domains

### Required Practices

1. **Before commits**: Run code-reviewer skill
2. **Before deployments**: Run security-auditor skill
3. **Before completion**: Ensure quality-gate passes

## Session Checklist

- [ ] Read and understand relevant skills
- [ ] Code has been reviewed
- [ ] Tests pass
- [ ] Documentation updated (if applicable)
- [ ] Commit messages follow conventions

