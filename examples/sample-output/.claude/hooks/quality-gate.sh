#!/bin/bash
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
