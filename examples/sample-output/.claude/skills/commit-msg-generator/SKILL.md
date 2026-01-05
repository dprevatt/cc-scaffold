---
name: commit-msg-generator
description: Generate conventional commit messages from staged changes.
---

# Commit Message Generator Skill

You are an expert at writing clear, conventional commit messages. Apply this skill when committing changes.

## Conventional Commit Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Commit Types

| Type | Description | Example |
|------|-------------|---------|
| feat | New feature | `feat: add user registration` |
| fix | Bug fix | `fix: resolve null pointer in login` |
| docs | Documentation only | `docs: update API reference` |
| style | Formatting, no code change | `style: fix indentation` |
| refactor | Code change, no feature/fix | `refactor: extract validation logic` |
| perf | Performance improvement | `perf: optimize database queries` |
| test | Adding/updating tests | `test: add unit tests for auth` |
| build | Build system changes | `build: update webpack config` |
| ci | CI configuration | `ci: add GitHub Actions workflow` |
| chore | Maintenance tasks | `chore: update dependencies` |
| revert | Revert previous commit | `revert: revert "feat: add feature"` |

## Scope Examples

Scopes indicate the area of change:
- `feat(auth): add OAuth support`
- `fix(api): handle timeout errors`
- `refactor(ui): simplify form validation`
- `test(utils): add date formatting tests`

## Writing Good Descriptions

### Do's
- Use imperative mood ("add" not "added")
- Be specific about what changed
- Keep under 50 characters
- Start lowercase after type

### Don'ts
- Don't end with a period
- Don't be vague ("fix stuff")
- Don't repeat the type ("feat: add new feature")

## Good Examples

```
feat(auth): add password reset via email

Implements password reset flow:
- Send reset email with token
- Token expires after 1 hour
- Rate limit: 3 requests per hour

Closes #123
```

```
fix(cart): prevent negative quantities

Users could enter negative quantities which caused
incorrect totals. Now validates minimum of 1.

Fixes #456
```

```
refactor(api): extract validation middleware

Moved inline validation to reusable middleware.
No functional changes.
```

```
perf(queries): add index for user lookups

Reduces user search from 500ms to 50ms average.
```

## Bad Examples (and why)

```
# Too vague
fix: fix bug

# Wrong mood
feat: added login

# Too long
feat: add the ability for users to reset their password through email verification

# Ends with period
docs: update readme.

# Redundant
feat: new feature for authentication
```

## Breaking Changes

Use `!` or footer for breaking changes:

```
feat(api)!: change authentication to JWT

BREAKING CHANGE: API now requires JWT tokens instead of sessions.
Migration guide: https://docs.example.com/jwt-migration
```

## Footer References

```
fix(auth): resolve session timeout issue

Fixes #123
Closes #124
Refs #100
```

## Multi-line Body Guidelines

When to use a body:
- Explaining why the change was made
- Describing what changed at a high level
- Listing breaking changes or migrations

Format:
- Separate from subject with blank line
- Wrap at 72 characters
- Use bullet points for lists

## Commit Message Template

```
# <type>[scope]: <subject>
#
# [body - explain why, not what]
#
# [footer - references, breaking changes]
#
# Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore
# Scope: auth, api, ui, db, etc.
# Subject: imperative, lowercase, no period, <50 chars
# Body: wrap at 72 chars, explain motivation
# Footer: Closes #issue, BREAKING CHANGE:
```
