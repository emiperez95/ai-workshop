# AI Workshop Project

## What This Is

A hands-on workshop to get 6-10 experienced engineers to adopt agentic AI (Claude Code) as part of their daily workflow. Participants work a GitHub issue through a full issue-to-PR pipeline.

## Workshop Decisions (Resolved)

### Audience
- Good engineers who already use Cursor/Copilot/similar IDE AI tools
- Mixed attitude — some enthusiastic, some not interested
- They won't be convinced by a pitch — they need to try it themselves

### Tone
- No comparisons, no sales pitch
- Give them a tool and real tasks, let them form their own opinion

### Format
- 1.5 hours, hands-on
- Tool: Claude Code (terminal)
- Demo project: RealWorld blog API (Express + TypeScript + Prisma + SQLite)
- Everyone works the same GitHub issue (#1: Add bookmarks)
- They do the work, facilitator circulates and helps

### The Flow (Issue to PR)

```
1. /board-status         → See the issues, pick #1
2. Atlas agent           → Fetch issue details from GitHub (gh)
3. Minerva agent         → Fetch design doc from Notion (MCP)
4. Plan mode             → AI proposes approach, participant steers and refines
5. Implement             → AI writes the code
6. Review                → code-review plugin reviews the work
7. Ship                  → Commit + PR
```

### Tech Stack
- Node.js + Express + TypeScript
- Prisma 5 + SQLite (zero config)
- Jest (100 tests, fully mocked)

### Agents & Tools

| Component | Type | Status | How |
|---|---|---|---|
| Atlas (GitHub reader) | Agent | Pre-built in repo | Uses `gh` CLI |
| Minerva (Notion reader) | Agent | Pre-built in repo | Uses Notion MCP |
| `/board-status` | Command | **Participants build this** | Uses `gh` CLI |
| `code-review` | Plugin | Participants install | Official plugin |
| CLAUDE.md | Config | Participants run `/init` | Built into Claude Code |

### What's NOT in the workshop
- Hermes/Heimdall (GitHub PR agents) — post-PR, won't get there in 2 hours
- Clio (Google Drive) — cut for scope
- Git worktrees / parallel work — ceiling section only
- Hive system
- Full Athena (8 reviewers + external LLMs)

## Files in This Repo

- `check-setup.sh` — Pre-workshop setup validator
- `docs/` — Workshop notes, facilitator prompt, checklist, GitHub issue, Notion design doc, promo, backup command
- `demo-project/` — The codebase participants work on


## Agent Setup Requirements

| Component | CLI needed | Auth method | Setup time |
|---|---|---|---|
| Atlas (GitHub) | `gh` | `gh auth login` (browser OAuth) | ~3 min |
| Minerva (Notion) | Notion MCP | OAuth on first MCP connect | ~5 min |

