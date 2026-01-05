---
name: git-workflow
description: Follow Git workflow best practices.
---

# Git Workflow Skill

You are an expert at Git workflows. Apply this skill when working with branches, commits, pull requests, and releases.

## Branch Naming

### Format
```
<type>/<ticket>-<short-description>
```

### Types
| Type | Purpose | Example |
|------|---------|---------|
| feature/ | New functionality | feature/PROJ-123-user-auth |
| bugfix/ | Bug fixes | bugfix/PROJ-456-login-crash |
| hotfix/ | Production fixes | hotfix/PROJ-789-critical-fix |
| release/ | Release preparation | release/v1.2.0 |
| chore/ | Maintenance | chore/update-dependencies |

### Examples
```bash
git checkout -b feature/PROJ-123-add-user-registration
git checkout -b bugfix/PROJ-456-fix-email-validation
git checkout -b hotfix/PROJ-789-patch-security-vuln
```

## Commit Message Format

### Structure
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructure
- perf: Performance
- test: Tests
- build: Build system
- ci: CI/CD
- chore: Maintenance

### Examples
```
feat(auth): add password reset via email

Implements password reset functionality:
- Send reset email with secure token
- Token expires after 1 hour
- Rate limit: 3 requests per hour

Closes #123
```

```
fix(cart): prevent negative item quantities

Users could enter negative quantities causing incorrect totals.
Added validation to ensure minimum quantity of 1.

Fixes #456
```

## Git Commands Cheat Sheet

### Daily Workflow
```bash
# Start new work
git checkout main
git pull origin main
git checkout -b feature/PROJ-123-description

# Save work
git add .
git commit -m "feat: add feature description"

# Stay up to date
git fetch origin
git rebase origin/main

# Push for review
git push -u origin feature/PROJ-123-description
```

### Useful Commands
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo changes to file
git checkout -- filename

# Stash changes
git stash
git stash pop

# Interactive rebase (squash commits)
git rebase -i HEAD~3

# Cherry-pick a commit
git cherry-pick <commit-hash>

# Find who changed a line
git blame filename

# Search commit history
git log --grep="search term"
git log -S "code snippet"
```

## Pull Request Template

```markdown
## Summary
Brief description of changes.

## Changes
- Change 1
- Change 2
- Change 3

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update

## Testing
Describe how you tested these changes:
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing unit tests pass locally

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Related Issues
Closes #123
```

## Protected Branch Rules

### Main/Master Branch
- [ ] Require pull request reviews (1-2 approvals)
- [ ] Require status checks to pass
- [ ] Require branches to be up to date
- [ ] Require signed commits (optional)
- [ ] Restrict push access
- [ ] No force pushes
- [ ] No deletions

### Recommended Checks
- [ ] CI build passes
- [ ] All tests pass
- [ ] Code coverage meets threshold
- [ ] Linting passes
- [ ] Security scan passes

## Git Flow

### Main Branches
- `main` - Production-ready code
- `develop` - Integration branch

### Supporting Branches
- `feature/*` - New features (from develop)
- `release/*` - Release preparation
- `hotfix/*` - Production fixes

### Flow
```
main ─────────────────────────●─────────●────────
                              ↑         ↑
                        (merge)   (hotfix)
                              │         │
develop ──●────●────●────●────●─────────●────────
          │    │    │    │    ↑
          │ feature/x    │   (merge)
          │    └────────┘    │
          │                  │
    feature/y ───────────────┘
```

## Trunk-Based Development (Alternative)

### Principles
- Small, frequent commits to main
- Feature flags for incomplete work
- Short-lived branches (<1 day)
- Automated testing and deployment

### Flow
```bash
# Quick feature branch
git checkout -b feature/small-change
# ... make changes ...
git push -u origin feature/small-change
# Create PR, get review, merge same day
```

## Release Process

### Semantic Versioning
```
MAJOR.MINOR.PATCH
  │     │     └── Bug fixes (1.2.3 → 1.2.4)
  │     └──────── New features (1.2.3 → 1.3.0)
  └────────────── Breaking changes (1.2.3 → 2.0.0)
```

### Creating a Release
```bash
# Create release branch
git checkout -b release/v1.2.0 develop

# Update version numbers
npm version 1.2.0

# Merge to main
git checkout main
git merge --no-ff release/v1.2.0

# Tag the release
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin v1.2.0

# Back-merge to develop
git checkout develop
git merge --no-ff release/v1.2.0
```

## Conflict Resolution

```bash
# During rebase
git rebase main
# ... fix conflicts ...
git add .
git rebase --continue

# Abort if needed
git rebase --abort

# During merge
git merge feature-branch
# ... fix conflicts ...
git add .
git commit
```

## Git Workflow Checklist

- [ ] Branch naming follows convention
- [ ] Commits are atomic and well-described
- [ ] Main branch is protected
- [ ] PRs require review
- [ ] CI runs on all PRs
- [ ] Commits are signed (if required)
- [ ] History is kept clean (squash/rebase)
- [ ] Releases are tagged
