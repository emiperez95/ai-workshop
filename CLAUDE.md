# AI Workshop Project

## What This Is

A hands-on workshop to get 6-10 experienced engineers to adopt agentic AI (Claude Code) as part of their daily workflow. Participants work a Jira ticket through a full ticket-to-PR pipeline.

## Workshop Decisions (Resolved)

### Audience
- Good engineers who already use Cursor/Copilot/similar IDE AI tools
- Mixed attitude — some enthusiastic, some not interested
- They won't be convinced by a pitch — they need to try it themselves

### Tone
- No comparisons, no sales pitch
- Give them a tool and real tasks, let them form their own opinion

### Format
- 2 hours, hands-on
- Tool: Claude Code (terminal)
- Demo project: RealWorld blog API (Express + TypeScript + Prisma + SQLite)
- Everyone works the same Jira ticket (WORK-42: Add bookmarks)
- They do the work, facilitator circulates and helps

### The Flow (Ticket to PR)

```
1. /jira-status          → See the board, pick ticket WORK-42
2. Atlas agent           → Fetch ticket details from Jira (acli)
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
| Atlas (Jira reader) | Agent | Pre-built in repo | Uses `acli` CLI |
| Minerva (Notion reader) | Agent | Pre-built in repo | Uses Notion MCP |
| `/jira-status` | Command | **Participants build this** | Uses `acli` CLI |
| `code-review` | Plugin | Participants install | Official plugin |
| `commit-commands` | Plugin | Participants install | Official plugin |
| CLAUDE.md | Config | Participants run `/init` | Built into Claude Code |

### What's NOT in the workshop
- Apollo (Jira writer) — skipped, everyone works the same ticket
- Hermes/Heimdall (GitHub PR agents) — post-PR, won't get there in 2 hours
- Clio (Google Drive) — cut for scope
- Git worktrees / parallel work — ceiling section only
- Hive system
- Full Athena (8 reviewers + external LLMs)

## Files in This Repo

- `workshop-final.md` — **Current workshop plan** (structure, timing, exercises)
- `jira-ticket.md` — Ticket text to create in Jira (WORK-42)
- `notion-doc.md` — Notion page text to create (design notes for WORK-42)
- `scripts/check-setup.sh` — Pre-workshop setup validator
- `facilitator-backup/jira-status.md` — Backup `/jira-status` command
- `demo-project/` — The codebase participants work on

### Earlier Drafts (reference only)
- `workshop.md` — Earlier draft focused on narrative/skills
- `workshop-claude-workflow.md` — Earlier draft focused on technical detail
- `slides.md` — Earlier draft as a Marp slide deck

## Agent Setup Requirements

| Component | CLI needed | Auth method | Setup time |
|---|---|---|---|
| Atlas (Jira) | `acli` | `acli auth login --web` (OAuth) | ~5 min |
| Minerva (Notion) | Notion MCP | OAuth on first MCP connect | ~5 min |
| gh (GitHub) | `gh` | `gh auth login` (browser OAuth) | ~3 min |

## Still TODO

- [ ] Create Jira project (WORK) and ticket (WORK-42)
- [ ] Create Notion page with technical design notes
- [ ] Test full pipeline end-to-end with Claude Code
- [ ] Verify ticket ambiguity produces imperfect first plan
- [ ] Decide exact workshop timing
