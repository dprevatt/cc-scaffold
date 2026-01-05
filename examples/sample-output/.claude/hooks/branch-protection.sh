#!/bin/bash
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
  for protected in "${PROTECTED_BRANCHES[@]}"; do
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
  for protected in "${PROTECTED_BRANCHES[@]}"; do
    if echo "$COMMAND" | grep -qE "(origin|upstream)s+$protected(s|$)"; then
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
    if ! echo "$COMMAND" | grep -qE 'origins+[a-zA-Z]'; then
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
