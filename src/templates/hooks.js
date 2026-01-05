/**
 * Hook templates for CC Scaffold
 * Each hook is a bash script with proper exit codes (0 = pass, 2 = block with message)
 */

export const hooks = {
  'pre-commit-lint': {
    name: 'pre-commit-lint',
    description: 'Run linter before file writes',
    event: 'PreToolUse',
    matcher: 'Write|Edit',
    content: `#!/bin/bash
# Pre-commit Linting Hook
# Event: PreToolUse (Write|Edit)
# Purpose: Run linter on files before allowing writes
# Exit codes: 0 = pass, 2 = block with message

set -e

# Get the file path from the tool input (passed via stdin as JSON)
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.file_path // .path // empty')

if [ -z "$FILE_PATH" ]; then
  echo "No file path provided"
  exit 0
fi

# Get file extension
EXT="\${FILE_PATH##*.}"

# Function to check if command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Run appropriate linter based on file type
case "$EXT" in
  js|jsx|ts|tsx|mjs|cjs)
    if command_exists eslint; then
      if ! eslint "$FILE_PATH" --quiet 2>/dev/null; then
        echo "ESLint errors found in $FILE_PATH"
        echo "Run 'npx eslint $FILE_PATH --fix' to auto-fix"
        exit 2
      fi
    fi
    ;;
  py)
    if command_exists ruff; then
      if ! ruff check "$FILE_PATH" --quiet 2>/dev/null; then
        echo "Ruff errors found in $FILE_PATH"
        echo "Run 'ruff check $FILE_PATH --fix' to auto-fix"
        exit 2
      fi
    elif command_exists flake8; then
      if ! flake8 "$FILE_PATH" --quiet 2>/dev/null; then
        echo "Flake8 errors found in $FILE_PATH"
        exit 2
      fi
    fi
    ;;
  cs)
    if command_exists dotnet; then
      if ! dotnet format --verify-no-changes "$FILE_PATH" 2>/dev/null; then
        echo "C# formatting issues found in $FILE_PATH"
        echo "Run 'dotnet format' to fix"
        exit 2
      fi
    fi
    ;;
  go)
    if command_exists golangci-lint; then
      if ! golangci-lint run "$FILE_PATH" 2>/dev/null; then
        echo "Go lint errors found in $FILE_PATH"
        exit 2
      fi
    fi
    ;;
  *)
    # No linter configured for this file type
    ;;
esac

# Success - allow the write
exit 0
`
  },

  'post-edit-format': {
    name: 'post-edit-format',
    description: 'Auto-format files after editing',
    event: 'PostToolUse',
    matcher: 'Write|Edit',
    content: `#!/bin/bash
# Post-edit Formatting Hook
# Event: PostToolUse (Write|Edit)
# Purpose: Auto-format files after writing
# Exit codes: 0 = success

set -e

# Get the file path from the tool input
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.file_path // .path // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Skip if file doesn't exist (deleted)
if [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

# Get file extension
EXT="\${FILE_PATH##*.}"

# Function to check if command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Run appropriate formatter based on file type
case "$EXT" in
  js|jsx|ts|tsx|mjs|cjs|json|css|scss|less|html|md|yaml|yml)
    if command_exists prettier; then
      prettier --write "$FILE_PATH" 2>/dev/null || true
      echo "Formatted $FILE_PATH with Prettier"
    fi
    ;;
  py)
    if command_exists black; then
      black "$FILE_PATH" --quiet 2>/dev/null || true
      echo "Formatted $FILE_PATH with Black"
    elif command_exists ruff; then
      ruff format "$FILE_PATH" 2>/dev/null || true
      echo "Formatted $FILE_PATH with Ruff"
    fi
    ;;
  cs)
    if command_exists dotnet; then
      dotnet format "$FILE_PATH" 2>/dev/null || true
      echo "Formatted $FILE_PATH with dotnet format"
    fi
    ;;
  go)
    if command_exists gofmt; then
      gofmt -w "$FILE_PATH" 2>/dev/null || true
      echo "Formatted $FILE_PATH with gofmt"
    fi
    ;;
  rs)
    if command_exists rustfmt; then
      rustfmt "$FILE_PATH" 2>/dev/null || true
      echo "Formatted $FILE_PATH with rustfmt"
    fi
    ;;
esac

exit 0
`
  },

  'session-context-loader': {
    name: 'session-context-loader',
    description: 'Display available skills and agents at session start',
    event: 'SessionStart',
    matcher: '*',
    content: `#!/bin/bash
# Session Context Loader Hook
# Event: SessionStart
# Purpose: Display available skills, agents, and reminders
# Exit codes: 0 = success

set -e

CLAUDE_DIR=".claude"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📚 Claude Code Session Initialized"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# List available skills
if [ -d "$CLAUDE_DIR/skills" ]; then
  SKILLS=$(find "$CLAUDE_DIR/skills" -name "SKILL.md" -type f 2>/dev/null | wc -l | tr -d ' ')
  if [ "$SKILLS" -gt 0 ]; then
    echo "📚 Available Skills ($SKILLS):"
    for skill_dir in "$CLAUDE_DIR/skills"/*/; do
      if [ -f "\${skill_dir}SKILL.md" ]; then
        skill_name=$(basename "$skill_dir")
        echo "   • $skill_name"
      fi
    done
    echo ""
  fi
fi

# List available agents
if [ -d "$CLAUDE_DIR/agents" ]; then
  AGENTS=$(find "$CLAUDE_DIR/agents" -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' ')
  if [ "$AGENTS" -gt 0 ]; then
    echo "🤖 Available Agents ($AGENTS):"
    for agent_file in "$CLAUDE_DIR/agents"/*.md; do
      if [ -f "$agent_file" ]; then
        agent_name=$(basename "$agent_file" .md)
        echo "   • $agent_name"
      fi
    done
    echo ""
  fi
fi

# List active hooks
if [ -f "$CLAUDE_DIR/settings.json" ]; then
  echo "🪝 Active Hooks:"
  if command -v jq >/dev/null 2>&1; then
    jq -r '.hooks | to_entries[] | "   • \\(.key): \\(.value | length) hook(s)"' "$CLAUDE_DIR/settings.json" 2>/dev/null || true
  else
    echo "   • (install jq for detailed hook info)"
  fi
  echo ""
fi

# Show reminders
echo "📝 Reminders:"
echo "   • Use @.claude/skills/NAME to reference skills"
echo "   • Use @.claude/agents/NAME.md to reference agents"
echo "   • Run quality checks before committing"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

exit 0
`
  },

  'quality-gate': {
    name: 'quality-gate',
    description: 'Verify tests pass before session completion',
    event: 'Stop',
    matcher: '*',
    content: `#!/bin/bash
# Quality Gate Hook
# Event: Stop
# Purpose: Verify tests pass before allowing session to complete
# Exit codes: 0 = pass, 2 = block with message

set -e

echo "🔍 Running quality gate checks..."

# Determine project type and run appropriate tests
run_tests() {
  # Node.js project
  if [ -f "package.json" ]; then
    if command -v npm >/dev/null 2>&1; then
      if grep -q '"test"' package.json; then
        echo "Running npm test..."
        if ! npm test --silent 2>/dev/null; then
          echo ""
          echo "❌ Tests failed!"
          echo ""
          echo "Please fix failing tests before completing this session."
          echo "Run 'npm test' to see details."
          return 1
        fi
        echo "✅ npm tests passed"
      fi
    fi
    return 0
  fi

  # Python project
  if [ -f "requirements.txt" ] || [ -f "pyproject.toml" ] || [ -f "setup.py" ]; then
    if command -v pytest >/dev/null 2>&1; then
      echo "Running pytest..."
      if ! pytest --quiet 2>/dev/null; then
        echo ""
        echo "❌ Tests failed!"
        echo ""
        echo "Please fix failing tests before completing this session."
        echo "Run 'pytest -v' to see details."
        return 1
      fi
      echo "✅ pytest tests passed"
    fi
    return 0
  fi

  # .NET project
  if ls *.csproj >/dev/null 2>&1 || ls *.sln >/dev/null 2>&1; then
    if command -v dotnet >/dev/null 2>&1; then
      echo "Running dotnet test..."
      if ! dotnet test --verbosity quiet 2>/dev/null; then
        echo ""
        echo "❌ Tests failed!"
        echo ""
        echo "Please fix failing tests before completing this session."
        echo "Run 'dotnet test' to see details."
        return 1
      fi
      echo "✅ dotnet tests passed"
    fi
    return 0
  fi

  # Go project
  if [ -f "go.mod" ]; then
    if command -v go >/dev/null 2>&1; then
      echo "Running go test..."
      if ! go test ./... -short 2>/dev/null; then
        echo ""
        echo "❌ Tests failed!"
        echo ""
        echo "Please fix failing tests before completing this session."
        echo "Run 'go test ./... -v' to see details."
        return 1
      fi
      echo "✅ go tests passed"
    fi
    return 0
  fi

  # No recognized project type
  echo "ℹ️  No test framework detected"
  return 0
}

# Run the tests
if ! run_tests; then
  exit 2
fi

echo ""
echo "✅ Quality gate passed!"
exit 0
`
  },

  'secrets-scanner': {
    name: 'secrets-scanner',
    description: 'Block commits containing secrets',
    event: 'PreToolUse',
    matcher: 'Write',
    content: `#!/bin/bash
# Secrets Scanner Hook
# Event: PreToolUse (Write)
# Purpose: Detect and block writes containing potential secrets
# Exit codes: 0 = pass, 2 = block with message

set -e

# Get the content being written
INPUT=$(cat)
CONTENT=$(echo "$INPUT" | jq -r '.content // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.file_path // .path // empty')

if [ -z "$CONTENT" ]; then
  exit 0
fi

# Skip certain file types that commonly have false positives
case "$FILE_PATH" in
  *.lock|*.sum|*-lock.json|*.min.js|*.min.css)
    exit 0
    ;;
esac

# Patterns for potential secrets
PATTERNS=(
  # AWS
  'AKIA[0-9A-Z]{16}'
  'aws_secret_access_key\s*=\s*[A-Za-z0-9/+=]{40}'

  # Generic API keys
  'api[_-]?key\\s*[=:]\\s*["'"'"'][A-Za-z0-9_-]{20,}["'"'"']'
  'apikey\\s*[=:]\\s*["'"'"'][A-Za-z0-9_-]{20,}["'"'"']'

  # Generic secrets
  'secret\\s*[=:]\\s*["'"'"'][A-Za-z0-9_-]{20,}["'"'"']'
  'password\\s*[=:]\\s*["'"'"'][^"'"'"']{8,}["'"'"']'

  # Private keys
  '-----BEGIN (RSA |DSA |EC |OPENSSH )?PRIVATE KEY-----'
  '-----BEGIN PGP PRIVATE KEY BLOCK-----'

  # Tokens
  'ghp_[A-Za-z0-9]{36}'  # GitHub Personal Access Token
  'gho_[A-Za-z0-9]{36}'  # GitHub OAuth Token
  'github_pat_[A-Za-z0-9]{22}_[A-Za-z0-9]{59}'  # GitHub Fine-grained PAT
  'sk-[A-Za-z0-9]{48}'   # OpenAI API Key
  'sk-proj-[A-Za-z0-9]{48}'  # OpenAI Project Key
  'xox[baprs]-[A-Za-z0-9-]{10,}'  # Slack tokens

  # Database URLs with credentials
  '(postgres|mysql|mongodb)://[^:]+:[^@]+@'

  # JWT tokens (potential)
  'eyJ[A-Za-z0-9_-]*\.eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*'
)

# Check content against patterns
FOUND_SECRETS=()

for pattern in "\${PATTERNS[@]}"; do
  if echo "$CONTENT" | grep -qE "$pattern" 2>/dev/null; then
    # Get matching line for context (first match only)
    MATCH=$(echo "$CONTENT" | grep -oE "$pattern" | head -1)
    FOUND_SECRETS+=("$MATCH")
  fi
done

# If secrets found, block the write
if [ \${#FOUND_SECRETS[@]} -gt 0 ]; then
  echo ""
  echo "🚨 POTENTIAL SECRETS DETECTED!"
  echo ""
  echo "File: $FILE_PATH"
  echo ""
  echo "Found patterns that may be secrets:"
  for secret in "\${FOUND_SECRETS[@]}"; do
    # Partially mask the secret
    MASKED=$(echo "$secret" | sed 's/\\(.\\{10\\}\\).*\\(.\\{4\\}\\)/\\1***\\2/')
    echo "  • $MASKED"
  done
  echo ""
  echo "If these are not secrets, consider:"
  echo "  • Using environment variables"
  echo "  • Adding to .gitignore"
  echo "  • Using a secrets manager"
  echo ""
  echo "To proceed anyway, remove or replace the sensitive values."
  exit 2
fi

exit 0
`
  },

  'layer-violation-blocker': {
    name: 'layer-violation-blocker',
    description: 'Block Clean Architecture layer violations',
    event: 'PreToolUse',
    matcher: 'Write',
    content: `#!/bin/bash
# Layer Violation Blocker Hook
# Event: PreToolUse (Write)
# Purpose: Enforce Clean Architecture layer dependencies
# Exit codes: 0 = pass, 2 = block with message

set -e

# Get the file path and content
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.file_path // .path // empty')
CONTENT=$(echo "$INPUT" | jq -r '.content // empty')

if [ -z "$FILE_PATH" ] || [ -z "$CONTENT" ]; then
  exit 0
fi

# Define layer patterns (customize based on your project structure)
# Layer hierarchy: Domain <- Application <- Infrastructure <- Presentation

is_domain_layer() {
  echo "$1" | grep -qE '(domain|entities|core)/|Domain|Entities|Core' 2>/dev/null
}

is_application_layer() {
  echo "$1" | grep -qE '(application|usecases|services)/|Application|UseCases|Services' 2>/dev/null
}

is_infrastructure_layer() {
  echo "$1" | grep -qE '(infrastructure|data|repositories|persistence)/|Infrastructure|Data|Repositories' 2>/dev/null
}

is_presentation_layer() {
  echo "$1" | grep -qE '(presentation|ui|api|controllers|web)/|Presentation|Controllers|Api|Web' 2>/dev/null
}

# Function to extract imports from content
get_imports() {
  # JavaScript/TypeScript imports
  echo "$1" | grep -oE "from ['\"]([^'\"]+)['\"]" | sed "s/from ['\"]//g" | sed "s/['\"]//g"
  # Python imports
  echo "$1" | grep -oE "^(from|import) [a-zA-Z0-9_.]+( import)?" | sed 's/from //g' | sed 's/import //g' | sed 's/ //g'
  # C# using statements
  echo "$1" | grep -oE "^using [a-zA-Z0-9_.]+;" | sed 's/using //g' | sed 's/;//g'
}

# Check for violations
VIOLATIONS=()

if is_domain_layer "$FILE_PATH"; then
  # Domain layer should not import from any other layer
  IMPORTS=$(get_imports "$CONTENT")
  for import in $IMPORTS; do
    if is_application_layer "$import" || is_infrastructure_layer "$import" || is_presentation_layer "$import"; then
      VIOLATIONS+=("Domain layer importing from higher layer: $import")
    fi
  done
fi

if is_application_layer "$FILE_PATH"; then
  # Application layer should not import from Infrastructure or Presentation
  IMPORTS=$(get_imports "$CONTENT")
  for import in $IMPORTS; do
    if is_infrastructure_layer "$import" || is_presentation_layer "$import"; then
      VIOLATIONS+=("Application layer importing from higher layer: $import")
    fi
  done
fi

if is_infrastructure_layer "$FILE_PATH"; then
  # Infrastructure layer should not import from Presentation
  IMPORTS=$(get_imports "$CONTENT")
  for import in $IMPORTS; do
    if is_presentation_layer "$import"; then
      VIOLATIONS+=("Infrastructure layer importing from Presentation: $import")
    fi
  done
fi

# Report violations
if [ \${#VIOLATIONS[@]} -gt 0 ]; then
  echo ""
  echo "🏗️  CLEAN ARCHITECTURE VIOLATION DETECTED!"
  echo ""
  echo "File: $FILE_PATH"
  echo ""
  echo "Violations:"
  for violation in "\${VIOLATIONS[@]}"; do
    echo "  ❌ $violation"
  done
  echo ""
  echo "Clean Architecture Layer Rules:"
  echo "  • Domain: No dependencies on other layers"
  echo "  • Application: Can depend on Domain only"
  echo "  • Infrastructure: Can depend on Domain & Application"
  echo "  • Presentation: Can depend on all layers"
  echo ""
  echo "Consider using dependency injection or interfaces"
  echo "to invert the dependency direction."
  exit 2
fi

exit 0
`
  },

  'large-file-warning': {
    name: 'large-file-warning',
    description: 'Warn when creating files over 500 lines',
    event: 'PreToolUse',
    matcher: 'Write',
    content: `#!/bin/bash
# Large File Warning Hook
# Event: PreToolUse (Write)
# Purpose: Warn when creating large files that may need splitting
# Exit codes: 0 = pass (with warning), 2 = block for very large files

set -e

# Configuration
WARN_LINES=500
BLOCK_LINES=1000

# Get the content being written
INPUT=$(cat)
CONTENT=$(echo "$INPUT" | jq -r '.content // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.file_path // .path // empty')

if [ -z "$CONTENT" ]; then
  exit 0
fi

# Skip certain file types
case "$FILE_PATH" in
  *.lock|*.sum|*-lock.json|*.min.js|*.min.css|*.svg|*.generated.*)
    exit 0
    ;;
esac

# Count lines
LINE_COUNT=$(echo "$CONTENT" | wc -l | tr -d ' ')

# Block if extremely large
if [ "$LINE_COUNT" -gt "$BLOCK_LINES" ]; then
  echo ""
  echo "🚨 FILE TOO LARGE: $LINE_COUNT lines!"
  echo ""
  echo "File: $FILE_PATH"
  echo ""
  echo "Files over $BLOCK_LINES lines are blocked."
  echo ""
  echo "Consider splitting into smaller, focused modules:"
  echo "  • Extract related functions into separate files"
  echo "  • Create utility/helper modules"
  echo "  • Use composition over large monolithic files"
  echo ""
  exit 2
fi

# Warn if large
if [ "$LINE_COUNT" -gt "$WARN_LINES" ]; then
  echo ""
  echo "⚠️  LARGE FILE WARNING: $LINE_COUNT lines"
  echo ""
  echo "File: $FILE_PATH"
  echo ""
  echo "This file exceeds $WARN_LINES lines. Consider:"
  echo "  • Splitting into smaller modules"
  echo "  • Extracting utilities/helpers"
  echo "  • Using composition patterns"
  echo ""
  echo "Proceeding anyway..."
  echo ""
fi

exit 0
`
  },

  'branch-protection': {
    name: 'branch-protection',
    description: 'Prevent direct commits to protected branches',
    event: 'PreToolUse',
    matcher: 'Bash',
    content: `#!/bin/bash
# Branch Protection Hook
# Event: PreToolUse (Bash)
# Purpose: Prevent direct commits/pushes to protected branches
# Exit codes: 0 = pass, 2 = block with message

set -e

# Get the command being run
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.command // empty')

if [ -z "$COMMAND" ]; then
  exit 0
fi

# Protected branches
PROTECTED_BRANCHES=("main" "master" "production" "prod" "release")

# Get current branch
get_current_branch() {
  git rev-parse --abbrev-ref HEAD 2>/dev/null || echo ""
}

# Check if branch is protected
is_protected_branch() {
  local branch="$1"
  for protected in "\${PROTECTED_BRANCHES[@]}"; do
    if [ "$branch" = "$protected" ]; then
      return 0
    fi
  done
  return 1
}

# Parse command
CURRENT_BRANCH=$(get_current_branch)

# Check for git commit on protected branch
if echo "$COMMAND" | grep -qE '^git commit'; then
  if is_protected_branch "$CURRENT_BRANCH"; then
    echo ""
    echo "🚫 PROTECTED BRANCH: Cannot commit directly to '$CURRENT_BRANCH'"
    echo ""
    echo "Please create a feature branch and submit a pull request:"
    echo ""
    echo "  git checkout -b feature/your-feature"
    echo "  git commit -m 'your message'"
    echo "  git push -u origin feature/your-feature"
    echo ""
    exit 2
  fi
fi

# Check for git push to protected branch
if echo "$COMMAND" | grep -qE '^git push'; then
  # Check if pushing to a protected branch
  for protected in "\${PROTECTED_BRANCHES[@]}"; do
    if echo "$COMMAND" | grep -qE "(origin|upstream)\s+$protected(\s|$)"; then
      echo ""
      echo "🚫 PROTECTED BRANCH: Cannot push directly to '$protected'"
      echo ""
      echo "Please create a pull request instead."
      echo ""
      exit 2
    fi
  done

  # Check if on protected branch with no explicit target
  if is_protected_branch "$CURRENT_BRANCH"; then
    if ! echo "$COMMAND" | grep -qE 'origin\s+[a-zA-Z]'; then
      echo ""
      echo "🚫 PROTECTED BRANCH: Cannot push from '$CURRENT_BRANCH'"
      echo ""
      echo "Please create a feature branch first."
      echo ""
      exit 2
    fi
  fi
fi

# Check for force push
if echo "$COMMAND" | grep -qE 'git push.*(-f|--force)'; then
  if is_protected_branch "$CURRENT_BRANCH"; then
    echo ""
    echo "🚨 FORCE PUSH BLOCKED on protected branch '$CURRENT_BRANCH'!"
    echo ""
    echo "Force pushing to protected branches is not allowed."
    echo ""
    exit 2
  fi

  echo ""
  echo "⚠️  WARNING: Force push detected. Use with caution!"
  echo ""
fi

exit 0
`
  },

  'changelog-reminder': {
    name: 'changelog-reminder',
    description: 'Remind to update CHANGELOG before completing',
    event: 'Stop',
    matcher: '*',
    content: `#!/bin/bash
# Changelog Reminder Hook
# Event: Stop
# Purpose: Remind developers to update CHANGELOG for significant changes
# Exit codes: 0 = pass (just a reminder)

set -e

# Look for changelog file (various names)
CHANGELOG=""
for name in CHANGELOG.md CHANGELOG changelog.md changelog CHANGES.md CHANGES HISTORY.md HISTORY; do
  if [ -f "$name" ]; then
    CHANGELOG="$name"
    break
  fi
done

# Check if there are staged changes
if ! git diff --cached --quiet 2>/dev/null; then
  HAS_STAGED=true
else
  HAS_STAGED=false
fi

# Check if there are committed changes not pushed
UNPUSHED=$(git log @{u}.. --oneline 2>/dev/null | wc -l | tr -d ' ')

# Only remind if there are changes
if [ "$HAS_STAGED" = true ] || [ "$UNPUSHED" -gt 0 ]; then
  # Check if changelog was modified
  CHANGELOG_MODIFIED=false
  if [ -n "$CHANGELOG" ]; then
    if git diff --cached --name-only 2>/dev/null | grep -q "^$CHANGELOG$"; then
      CHANGELOG_MODIFIED=true
    fi
    if [ "$UNPUSHED" -gt 0 ] && git diff @{u}.. --name-only 2>/dev/null | grep -q "^$CHANGELOG$"; then
      CHANGELOG_MODIFIED=true
    fi
  fi

  if [ "$CHANGELOG_MODIFIED" = false ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📝 CHANGELOG REMINDER"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    if [ -n "$CHANGELOG" ]; then
      echo "Don't forget to update $CHANGELOG if you made significant changes!"
    else
      echo "Consider adding a CHANGELOG.md to track project changes."
    fi

    echo ""
    echo "Include entries for:"
    echo "  • New features"
    echo "  • Bug fixes"
    echo "  • Breaking changes"
    echo "  • Deprecations"
    echo ""
    echo "Format suggestion (Keep a Changelog):"
    echo "  ## [Unreleased]"
    echo "  ### Added"
    echo "  - New feature description"
    echo "  ### Fixed"
    echo "  - Bug fix description"
    echo ""
  fi
fi

# This is just a reminder, don't block
exit 0
`
  },

  'todo-collector': {
    name: 'todo-collector',
    description: 'Extract TODOs from code to tracking file',
    event: 'PostToolUse',
    matcher: 'Write|Edit',
    content: `#!/bin/bash
# TODO Collector Hook
# Event: PostToolUse (Write|Edit)
# Purpose: Extract TODO/FIXME comments to a tracking file
# Exit codes: 0 = success

set -e

# Get the file path from the tool input
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.file_path // .path // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Skip if file doesn't exist or is in excluded paths
if [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

case "$FILE_PATH" in
  *node_modules/*|*.min.js|*.min.css|*vendor/*|*dist/*|*build/*|*.lock)
    exit 0
    ;;
esac

# Output file
TODO_FILE=".claude/TODO_TRACKER.md"

# Create .claude directory if needed
mkdir -p .claude

# Function to extract TODOs from a file
extract_todos() {
  local file="$1"
  local line_num=0

  while IFS= read -r line; do
    ((line_num++))

    # Match TODO, FIXME, HACK, XXX, BUG patterns
    if echo "$line" | grep -qE '(TODO|FIXME|HACK|XXX|BUG):?\s'; then
      # Extract the comment text
      COMMENT=$(echo "$line" | sed -E 's/.*((TODO|FIXME|HACK|XXX|BUG):?\\s*.*)$/\\1/' | sed 's/\\*\\/$//' | sed 's/-->$//' | xargs)

      # Determine priority based on keyword
      case "$COMMENT" in
        FIXME*|BUG*)
          PRIORITY="🔴 HIGH"
          ;;
        HACK*|XXX*)
          PRIORITY="🟡 MEDIUM"
          ;;
        *)
          PRIORITY="🟢 LOW"
          ;;
      esac

      echo "| $PRIORITY | \`$file:$line_num\` | $COMMENT |"
    fi
  done < "$file"
}

# Update the TODO file
update_todo_file() {
  local current_date=$(date +"%Y-%m-%d %H:%M")

  # Create header if file doesn't exist
  if [ ! -f "$TODO_FILE" ]; then
    cat > "$TODO_FILE" << 'EOF'
# TODO Tracker

Auto-generated list of TODO, FIXME, HACK, XXX, and BUG comments in the codebase.

## Legend
- 🔴 HIGH: FIXME, BUG - Should be addressed soon
- 🟡 MEDIUM: HACK, XXX - Technical debt
- 🟢 LOW: TODO - Nice to have

## TODOs

| Priority | Location | Comment |
|----------|----------|---------|
EOF
  fi

  # Extract TODOs from the changed file
  NEW_TODOS=$(extract_todos "$FILE_PATH")

  if [ -n "$NEW_TODOS" ]; then
    # Remove old entries for this file
    grep -v "\`$FILE_PATH:" "$TODO_FILE" > "$TODO_FILE.tmp" 2>/dev/null || cp "$TODO_FILE" "$TODO_FILE.tmp"
    mv "$TODO_FILE.tmp" "$TODO_FILE"

    # Add new entries
    echo "$NEW_TODOS" >> "$TODO_FILE"

    # Sort by priority (HIGH first)
    {
      head -n 10 "$TODO_FILE"  # Keep header
      tail -n +11 "$TODO_FILE" | sort -t'|' -k2  # Sort entries
    } > "$TODO_FILE.tmp"
    mv "$TODO_FILE.tmp" "$TODO_FILE"

    echo "📝 Updated $TODO_FILE with TODOs from $FILE_PATH"
  fi
}

update_todo_file

exit 0
`
  }
};

/**
 * Get hook template by name
 */
export function getHook(name) {
  return hooks[name];
}

/**
 * Get all hook names
 */
export function getHookNames() {
  return Object.keys(hooks);
}

/**
 * Get hook list with metadata
 */
export function getHookList() {
  return Object.values(hooks).map(hook => ({
    name: hook.name,
    description: hook.description,
    event: hook.event,
    matcher: hook.matcher
  }));
}

/**
 * Get hooks grouped by event type
 */
export function getHooksByEvent() {
  const grouped = {};
  for (const hook of Object.values(hooks)) {
    if (!grouped[hook.event]) {
      grouped[hook.event] = [];
    }
    grouped[hook.event].push(hook);
  }
  return grouped;
}

export default hooks;
