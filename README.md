# Beyond Suggestions — AI That Does Things

Hands-on workshop for experienced engineers to adopt agentic AI (Claude Code) as part of their daily workflow. Participants work a GitHub issue through a full issue-to-PR pipeline: fetch requirements, plan the approach, implement the feature, review it, and ship a PR.

**Duration:** ~1.5 hours
**Tool:** [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (terminal)
**Demo project:** RealWorld blog API (Express + TypeScript + Prisma + SQLite)

## Getting Started

### 1. Setup

Install prerequisites and run the setup checker:

```bash
npm install -g @anthropic-ai/claude-code
brew install gh && gh auth login
git clone https://github.com/emiperez95/ai-workshop.git
cd ai-workshop
bash scripts/check-setup.sh
```

Fix any failures using the hints in the output. Run the script again until everything passes.

### 2. Self-Guided Mode

If you're completing the workshop on your own, use the **facilitator prompt** to have an AI guide you through it step by step.

1. Open any LLM chat (Claude, ChatGPT, etc.)
2. Paste the contents of [`facilitator-prompt.md`](facilitator-prompt.md) as the system prompt or first message
3. Follow the facilitator's instructions — it will walk you through each step, one at a time
4. Do the actual work in a **separate Claude Code terminal session** — the facilitator tells you what to do there

The facilitator will guide you through the full pipeline: orientation, building a command, fetching requirements, planning, implementing with TDD, testing, shipping a PR, and reviewing it.

### 3. Live Workshop

If you're running this as a live session, see [`docs/notes.md`](docs/notes.md) for the full facilitator guide and [`docs/facilitator-checklist.md`](docs/facilitator-checklist.md) for a quick-reference checklist.

## Repo Structure

```
ai-workshop/
├── facilitator-prompt.md          # AI facilitator prompt for self-guided mode
├── docs/
│   ├── notes.md                   # Full workshop plan (structure, timing, exercises)
│   ├── facilitator-checklist.md   # Quick-reference checklist for live facilitation
│   ├── github-issue.md            # Issue #1 text (local copy)
│   ├── notion-doc.md              # Design doc (Bookmarks Feature — Technical Notes)
│   ├── board-status.md            # Backup /board-status command
│   └── promo.html                 # Promotional image template
├── scripts/
│   └── check-setup.sh            # Pre-workshop setup validator
└── demo-project/                  # The codebase participants work on
    ├── .claude/agents/            # Atlas (GitHub) + Minerva (Notion) agents
    ├── .mcp.json                  # Notion MCP config
    ├── prisma/schema.prisma       # Data models
    ├── src/                       # Express + TypeScript API
    └── package.json               # Zero-config: npm install && npm test
```
