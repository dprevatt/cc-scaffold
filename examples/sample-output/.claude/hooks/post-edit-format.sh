#!/bin/bash
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
EXT="${FILE_PATH##*.}"

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
