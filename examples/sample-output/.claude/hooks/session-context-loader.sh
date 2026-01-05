#!/bin/bash
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
      if [ -f "${skill_dir}SKILL.md" ]; then
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
    jq -r '.hooks | to_entries[] | "   • \(.key): \(.value | length) hook(s)"' "$CLAUDE_DIR/settings.json" 2>/dev/null || true
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
