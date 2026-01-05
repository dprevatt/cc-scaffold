#!/bin/bash
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
  'aws_secret_access_keys*=s*[A-Za-z0-9/+=]{40}'

  # Generic API keys
  'api[_-]?key\s*[=:]\s*["'"'"'][A-Za-z0-9_-]{20,}["'"'"']'
  'apikey\s*[=:]\s*["'"'"'][A-Za-z0-9_-]{20,}["'"'"']'

  # Generic secrets
  'secret\s*[=:]\s*["'"'"'][A-Za-z0-9_-]{20,}["'"'"']'
  'password\s*[=:]\s*["'"'"'][^"'"'"']{8,}["'"'"']'

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
  'eyJ[A-Za-z0-9_-]*.eyJ[A-Za-z0-9_-]*.[A-Za-z0-9_-]*'
)

# Check content against patterns
FOUND_SECRETS=()

for pattern in "${PATTERNS[@]}"; do
  if echo "$CONTENT" | grep -qE "$pattern" 2>/dev/null; then
    # Get matching line for context (first match only)
    MATCH=$(echo "$CONTENT" | grep -oE "$pattern" | head -1)
    FOUND_SECRETS+=("$MATCH")
  fi
done

# If secrets found, block the write
if [ ${#FOUND_SECRETS[@]} -gt 0 ]; then
  echo ""
  echo "🚨 POTENTIAL SECRETS DETECTED!"
  echo ""
  echo "File: $FILE_PATH"
  echo ""
  echo "Found patterns that may be secrets:"
  for secret in "${FOUND_SECRETS[@]}"; do
    # Partially mask the secret
    MASKED=$(echo "$secret" | sed 's/\(.\{10\}\).*\(.\{4\}\)/\1***\2/')
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
