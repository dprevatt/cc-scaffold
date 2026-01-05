#!/bin/bash
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
EXT="${FILE_PATH##*.}"

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
