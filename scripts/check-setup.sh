#!/bin/bash
# Workshop Setup Checker
# Verifies all prerequisites for the Claude Code workshop.
#
# Usage:
#   bash check-setup.sh [--repo OWNER/REPO] [--jira-project KEY]
#
# Exit code: number of failed checks (0 = all passed)

set -uo pipefail

# ── Configuration (facilitator: fill these in before the workshop) ────
DEFAULT_REPO=""                # e.g. "myorg/demo-project"
DEFAULT_JIRA_PROJECT=""        # e.g. "WORK"
MIN_CLAUDE_VERSION="2.0.0"
MIN_NODE_VERSION=18
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEMO_PROJECT_DIR="$SCRIPT_DIR/../demo-project"

# ── Parse arguments ──────────────────────────────────────────────────
REPO="${WORKSHOP_REPO:-$DEFAULT_REPO}"
JIRA_PROJECT="${WORKSHOP_JIRA_PROJECT:-$DEFAULT_JIRA_PROJECT}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo) REPO="$2"; shift 2 ;;
    --jira-project) JIRA_PROJECT="$2"; shift 2 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

# ── State ────────────────────────────────────────────────────────────
PASS_COUNT=0
FAIL_COUNT=0
SKIP_COUNT=0

CLAUDE_OK=false
CLAUDE_INSTALLED=false
GH_INSTALLED=false
GH_AUTHED=false
ACLI_INSTALLED=false
ACLI_AUTHED=false
NPM_INSTALLED=false

# ── Helpers ──────────────────────────────────────────────────────────
pass() {
  local name="$1" detail="$2" desc="$3"
  printf '  \033[32m[PASS]\033[0m %-12s \033[2m(%s)\033[0m - %s\n' "$name" "$detail" "$desc"
  ((PASS_COUNT++))
}

fail() {
  local name="$1" detail="$2" desc="$3" fix="$4"
  printf '  \033[31m[FAIL]\033[0m %-12s \033[2m(%s)\033[0m - %s\n' "$name" "$detail" "$desc"
  printf '         \033[33mFix: %s\033[0m\n' "$fix"
  ((FAIL_COUNT++))
}

skip() {
  local name="$1" detail="$2" desc="$3"
  printf '  \033[2m[SKIP]\033[0m %-12s \033[2m(%s)\033[0m - %s\n' "$name" "$detail" "$desc"
  ((SKIP_COUNT++))
}

version_gte() {
  # Returns 0 if $1 >= $2 (semver comparison, major.minor.patch)
  printf '%s\n%s' "$1" "$2" | sort -t. -k1,1n -k2,2n -k3,3n -C
  # sort -C exits 0 if already sorted (i.e. $2 <= $1)
  # But we need $1 >= $2, so reverse:
  local sorted
  sorted=$(printf '%s\n%s' "$2" "$1" | sort -t. -k1,1n -k2,2n -k3,3n | tail -1)
  [[ "$sorted" == "$1" ]]
}

# ── Checks ───────────────────────────────────────────────────────────

check_claude() {
  if ! command -v claude &>/dev/null; then
    fail "claude" "not found" "Claude Code installed" "npm install -g @anthropic-ai/claude-code"
    return
  fi

  local version
  version=$(claude --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)

  if [[ -z "$version" ]]; then
    fail "claude" "unknown version" "Claude Code >= $MIN_CLAUDE_VERSION" "npm install -g @anthropic-ai/claude-code"
    return
  fi

  if version_gte "$version" "$MIN_CLAUDE_VERSION"; then
    pass "claude" "v$version" "Claude Code >= $MIN_CLAUDE_VERSION"
    CLAUDE_OK=true
    CLAUDE_INSTALLED=true
  else
    fail "claude" "v$version" "Claude Code >= $MIN_CLAUDE_VERSION" "npm install -g @anthropic-ai/claude-code"
  fi
}

check_node() {
  # Only check node/npm if claude is missing (they need it to install claude)
  if $CLAUDE_OK; then
    return
  fi

  echo ""
  printf '  \033[2m(Claude not found — checking Node.js to install it)\033[0m\n'

  if ! command -v node &>/dev/null; then
    fail "node" "not found" "Node.js >= $MIN_NODE_VERSION (needed to install Claude)" "brew install node"
    return
  fi

  local version major
  version=$(node --version | sed 's/^v//')
  major=${version%%.*}

  if (( major >= MIN_NODE_VERSION )); then
    pass "node" "v$version" "Node.js >= $MIN_NODE_VERSION"
  else
    fail "node" "v$version" "Node.js >= $MIN_NODE_VERSION (needed to install Claude)" "brew install node"
  fi

  if command -v npm &>/dev/null; then
    local npm_version
    npm_version=$(npm --version 2>/dev/null)
    pass "npm" "v$npm_version" "npm installed"
  else
    fail "npm" "not found" "npm installed (needed to install Claude)" "brew install node (npm comes with it)"
  fi
}

check_git() {
  if ! command -v git &>/dev/null; then
    fail "git" "not found" "Git installed" "xcode-select --install"
    return
  fi

  local version
  version=$(git --version | grep -oE '[0-9]+\.[0-9]+[0-9.]*' | head -1)
  pass "git" "v$version" "Git installed"
}

check_gh() {
  if ! command -v gh &>/dev/null; then
    fail "gh" "not found" "GitHub CLI installed" "brew install gh"
    return
  fi

  local version
  version=$(gh --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+[0-9.]*' | head -1)
  pass "gh" "v$version" "GitHub CLI installed"
  GH_INSTALLED=true
}

check_gh_auth() {
  if ! $GH_INSTALLED; then
    skip "gh_auth" "gh not installed" "GitHub CLI authenticated"
    return
  fi

  if gh auth status &>/dev/null; then
    local user
    user=$(gh api user --jq '.login' 2>/dev/null || echo "authenticated")
    pass "gh_auth" "$user" "GitHub CLI authenticated"
    GH_AUTHED=true
  else
    fail "gh_auth" "not authenticated" "GitHub CLI authenticated" "gh auth login"
  fi
}

check_acli() {
  if ! command -v acli &>/dev/null; then
    fail "acli" "not found" "Atlassian CLI installed" "brew tap atlassian/homebrew-acli && brew install acli"
    return
  fi

  local version
  version=$(acli --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+[0-9.]*' | head -1)
  pass "acli" "v$version" "Atlassian CLI installed"
  ACLI_INSTALLED=true
}

check_acli_auth() {
  if ! $ACLI_INSTALLED; then
    skip "acli_auth" "acli not installed" "Atlassian CLI authenticated"
    return
  fi

  if acli auth status &>/dev/null 2>&1; then
    pass "acli_auth" "authenticated" "Atlassian CLI authenticated"
    ACLI_AUTHED=true
  else
    fail "acli_auth" "not authenticated" "Atlassian CLI authenticated" "acli auth login --web"
  fi
}

check_notion_mcp() {
  if ! $CLAUDE_INSTALLED; then
    skip "notion_mcp" "claude not installed" "Notion MCP configured"
    return
  fi

  if [[ ! -f "$DEMO_PROJECT_DIR/.mcp.json" ]]; then
    fail "notion_mcp" "no .mcp.json" "Notion MCP configured" "The demo project is missing .mcp.json — re-clone the repo"
    return
  fi

  # Check if notion MCP is reachable via claude
  printf '  \033[2m         checking Notion MCP...\033[0m\033[K\r'
  local mcp_output
  mcp_output=$(cd "$DEMO_PROJECT_DIR" && claude mcp list 2>&1 || true)

  if echo "$mcp_output" | grep -q "notion.*Connected"; then
    pass "notion_mcp" "connected" "Notion MCP configured"
  elif echo "$mcp_output" | grep -q "notion.*authentication"; then
    fail "notion_mcp" "needs auth" "Notion MCP authenticated" "Open Claude Code in demo-project/ and connect to Notion when prompted"
  elif echo "$mcp_output" | grep -q "notion"; then
    pass "notion_mcp" "configured" "Notion MCP configured"
  else
    fail "notion_mcp" "not found" "Notion MCP configured" "cd demo-project && claude mcp add -s local notion --transport sse https://mcp.notion.com/sse"
  fi
}

check_npm_install() {
  if [[ ! -d "$DEMO_PROJECT_DIR" ]]; then
    fail "npm_install" "demo-project/ not found" "Demo project dependencies installed" "Make sure you cloned the full workshop repo"
    return
  fi

  if [[ -d "$DEMO_PROJECT_DIR/node_modules" ]]; then
    pass "npm_install" "already installed" "Demo project dependencies installed"
    NPM_INSTALLED=true
    return
  fi

  printf '  \033[2m         installing dependencies...\033[0m\033[K\r'
  if npm install --prefix "$DEMO_PROJECT_DIR" &>/dev/null; then
    pass "npm_install" "installed" "Demo project dependencies installed"
    NPM_INSTALLED=true
  else
    fail "npm_install" "install failed" "Demo project dependencies installed" "cd demo-project && npm install"
  fi
}

check_npm_test() {
  if ! $NPM_INSTALLED; then
    skip "npm_test" "deps not installed" "Demo project tests pass"
    return
  fi

  printf '  \033[2m         running tests...\033[0m\033[K\r'
  local output
  if output=$(cd "$DEMO_PROJECT_DIR" && npm test 2>&1); then
    local test_count
    test_count=$(echo "$output" | grep -oE 'Tests:[[:space:]]+[0-9]+ passed' | grep -oE '[0-9]+' | head -1)
    pass "npm_test" "${test_count:-all} passed" "Demo project tests pass"
  else
    fail "npm_test" "tests failed" "Demo project tests pass" "cd demo-project && npm test"
  fi
}

check_repo() {
  if [[ -z "$REPO" ]]; then
    skip "repo" "not configured" "Demo repo accessible"
    return
  fi

  if ! $GH_AUTHED; then
    skip "repo" "gh not ready" "Demo repo accessible"
    return
  fi

  if gh repo view "$REPO" --json name &>/dev/null 2>&1; then
    pass "repo" "$REPO" "Demo repo accessible"
  else
    fail "repo" "$REPO" "Demo repo accessible" "Check the repo URL and your GitHub org access"
  fi
}

check_jira() {
  if [[ -z "$JIRA_PROJECT" ]]; then
    skip "jira" "not configured" "Jira board accessible"
    return
  fi

  if ! $ACLI_AUTHED; then
    skip "jira" "acli not ready" "Jira board accessible"
    return
  fi

  if acli jira workitem search --jql "project = $JIRA_PROJECT" --limit 1 --json &>/dev/null 2>&1; then
    pass "jira" "$JIRA_PROJECT" "Jira board accessible"
  else
    fail "jira" "$JIRA_PROJECT" "Jira board accessible" "Check the project key and your Jira permissions"
  fi
}

# ── Run ──────────────────────────────────────────────────────────────
echo ""
echo "  Workshop Setup Check"
echo "  ===================="
echo ""

check_claude
check_node
check_git
check_gh
check_gh_auth
check_acli
check_acli_auth
check_notion_mcp
check_npm_install
check_npm_test
check_repo
check_jira

echo ""
echo "  ===================="
TOTAL=$((PASS_COUNT + FAIL_COUNT + SKIP_COUNT))
printf '  Results: \033[32m%d passed\033[0m' "$PASS_COUNT"
if (( FAIL_COUNT > 0 )); then
  printf ', \033[31m%d failed\033[0m' "$FAIL_COUNT"
fi
if (( SKIP_COUNT > 0 )); then
  printf ', \033[2m%d skipped\033[0m' "$SKIP_COUNT"
fi
echo ""

if (( FAIL_COUNT == 0 )); then
  echo ""
  printf '  \033[32mYou are ready for the workshop.\033[0m\n'
else
  echo ""
  printf '  Fix the failures above, then run this script again.\n'
fi

echo ""
exit "$FAIL_COUNT"
