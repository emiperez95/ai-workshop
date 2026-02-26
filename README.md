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

If you're completing the workshop on your own, use the AI facilitator to guide you through it step by step.

**Option A — Use the GPT (easiest):**
Open the [Claude Code Workshop Facilitator](https://chatgpt.com/g/g-69a04d49dea88191a996ad94471b35b4-claude-code-workshop-facilitator) GPT and start chatting.

**Option B — Use any LLM:**
1. Open any LLM chat (Claude, ChatGPT, etc.)
2. Paste the contents of [`docs/facilitator-prompt.md`](docs/facilitator-prompt.md) as the system prompt or first message
3. Follow the facilitator's instructions

In both cases, do the actual work in a **separate Claude Code terminal session** — the facilitator tells you what to do there.

### 3. Live Workshop

If you're running this as a live session, see [`docs/notes.md`](docs/notes.md) for the full facilitator guide and [`docs/facilitator-checklist.md`](docs/facilitator-checklist.md) for a quick-reference checklist.

## Repo Structure

```
ai-workshop/
├── docs/
│   ├── notes.md                   # Full workshop plan (structure, timing, exercises)
│   ├── facilitator-prompt.md      # AI facilitator prompt for self-guided mode
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
