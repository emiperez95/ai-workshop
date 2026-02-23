# Workshop: Beyond Suggestions — AI That Does Things

## Workshop Definition

### Objective
Get 6-10 experienced engineers to adopt agentic AI (Claude Code) as part of their daily workflow by working a Jira ticket through a full ticket-to-PR pipeline.

### The Audience
Good engineers who use Cursor/Copilot for suggestions and sidebar chat. Some are enthusiastic, some aren't particularly interested. Most have tried AI tools and have a working relationship with them — but mainly for autocomplete and quick questions.

**They won't be convinced by a pitch or a demo.** They need to try it themselves on real-feeling tasks and form their own opinion.

### Core Strategy
Give them a real workflow — not toy exercises. One Jira ticket, worked from start to finish: fetch the ticket, read the design doc, plan the implementation, write the code, review it, ship it. They do the whole thing with Claude Code. No comparisons, no proving a point.

### Desired Outcome
Every participant leaves having:
1. **Worked a full ticket** — from Jira ticket to PR, using Claude Code for every step
2. **Steered the AI** — read a plan, pushed back, refined the approach through discussion
3. **Built something** — created their own `/jira-status` command, so they understand how to extend the tool
4. **Formed their own opinion** — based on hands-on experience, not a demo
5. **Seen the ceiling** — a brief look at what advanced workflows look like

### Format
- **Duration**: ~2 hours
- **Group**: 6-10 engineers
- **Style**: Hands-on workshop — they do the work, you facilitate
- **Tool**: Claude Code (terminal)

---

## Demo Project

### What It Is
A fork of the [RealWorld](https://github.com/gothinkster/realworld) "Medium clone" API — a blog platform with users, articles, comments, tags, follows, and favorites.

### Tech Stack
- **Runtime**: Node.js + TypeScript
- **Framework**: Express
- **ORM**: Prisma 5
- **Database**: SQLite (zero config, local file)
- **Tests**: Jest (100 tests, fully mocked — no DB needed)

### Why This Project
- Domain is universally understood (blog platform)
- Architecture is clear: route → validator → auth → controller → prisma query → viewer
- Adding a feature touches 5-7 files across the whole stack
- Tests pass out of the box with zero infrastructure
- Existing patterns (favorites, follows) serve as templates for new features

### Zero-Config Setup
```bash
git clone [repo-url]
cd demo-project
npm install          # deps + prisma generate
npm test             # 100 tests pass
npm run develop      # creates SQLite DB + compiles + starts server on :3000
```

### What's Pre-Built in the Repo
```
demo-project/
├── .claude/
│   └── agents/
│       ├── atlas-jira-analyst.md       # Reads Jira tickets via acli
│       └── minerva-notion-oracle.md    # Reads Notion docs via MCP
├── .mcp.json                           # Notion MCP config (auth on first use)
├── prisma/schema.prisma                # 4 models: User, Article, Comment, Tag
├── src/
│   ├── controllers/                    # articles, comments, profile, tags, user
│   ├── middleware/                     # validators, auth, error handling
│   ├── routes/api/                     # 20 REST endpoints
│   ├── utils/db/                       # Prisma query functions
│   └── view/                           # Response formatters
└── package.json
```

---

## The Workshop Ticket

### WORK-42: Add bookmarks feature

**Description**: Users want to save articles for later. Separate from favorites (which are more like "likes"). Should work similar to favorites but be independent.

**Acceptance Criteria**:
- Users can bookmark and unbookmark articles
- There should be a way to get a user's bookmarked articles
- Article responses should indicate bookmark status
- Bookmarking requires authentication

**PO Notes** (intentionally ambiguous):
- Bookmark count on articles — "not sure if we need that for v1, up to you"
- Folders/collections — "Sarah wants this at some point, keep it in mind"
- `bookmarkedAt` timestamp — "mobile team wants this for sorting"

**Linked Notion doc**: "Bookmarks Feature — Technical Notes" — contains the decision to use a dedicated Bookmark model (not a simple many-to-many like favorites), endpoint conventions, and scope boundaries.

### Why This Ticket Works for the Workshop

The ticket is **intentionally ambiguous** in ways that force discussion:

1. **"Similar to favorites"** → Claude will propose copying the favorites pattern (many-to-many). But the Notion doc says use a dedicated model. The participant needs to steer.
2. **Folders/collections "at some point"** → Classic PO trap. Claude might over-engineer or ignore it. Either way, the participant should have an opinion.
3. **`bookmarkedAt` timestamp** → Doesn't fit a simple many-to-many. Pushes toward a dedicated model. Participant needs to weigh in.
4. **Bookmark count** → Claude has to decide. If they include it, scope grows. If they skip it, participant might push back.
5. **Endpoint design** → Not specified. New route vs. filter param. Claude will pick one, participant evaluates.

**The ideal interaction**: Claude proposes a plan, participant reads it, notices tensions with the Notion doc, pushes back, they discuss in plan mode, land on an approach together. This is the real skill — steering the AI, not just approving everything.

---

## Workshop Structure

### Part 0: Pre-Workshop Setup (on their own, before the day)

Participants do this on their own, 3+ days before the workshop.

1. Install the tools: Claude Code, gh, acli
2. Clone the repo: `git clone [repo-url]`
3. Run the setup checker: `bash scripts/check-setup.sh`
   - Validates: Claude Code, git, gh + auth, acli + auth, Notion MCP, npm install, tests pass
4. Fix any failures using the hints in the output
5. If stuck, ping the facilitator before the workshop

**The goal**: on workshop day, everyone's machine is ready. Zero time wasted on installs.

### Part 1: Framing + Orientation (15 min)

**5-minute framing**:

"You all use AI for code suggestions and chat. The tool you're about to try is different in one way: **it can execute.** It reads files, runs commands, edits code across multiple files, runs your tests. Instead of suggesting what to do, it does it — with your approval at each step."

"We're going to work a real Jira ticket from start to finish — fetch the requirements, plan the approach, implement it, review it, ship it. Use Claude Code for the whole thing."

**10-minute orientation** — everyone follows along:

1. Open Claude Code in the demo project: `cd demo-project && claude`
2. Run `/init` to generate the project's `CLAUDE.md`
   - "This teaches Claude about the project. It reads this file at the start of every session."
   - Quick look at what it generated — structure, test commands, conventions
3. Quick orientation (3 min):
   - You type in natural language, it responds and takes actions
   - When it wants to run a command or edit a file, it asks permission
   - If it goes in the wrong direction, just tell it
   - That's all you need — start building

### Part 2: Build Your First Command (15 min)

**What they do**: Create a `/jira-status` command that shows the Jira board.

**Why**: It's quick (one `.md` file), produces visible output, and teaches how commands work. It's also the first step in the pipeline they're about to use.

**Instructions** (on screen or printed):
> "Create a Claude Code command called `/jira-status` that takes a project key and shows tickets in the current sprint, grouped by status. You'll need a file at `.claude/commands/jira-status.md`. The Jira CLI is `acli` — ask Claude to help you figure out the right command."

**What they'll experience**:
- Claude helps them write the command file
- They test it: `/jira-status WORK`
- They see the board, pick their ticket (WORK-42)
- They've just extended Claude Code themselves

**Facilitator note**: Have `facilitator-backup/jira-status.md` ready to drop in for anyone who gets stuck.

### Part 3: Work the Ticket (60-70 min)

**Format**: Individual work. Everyone works the same ticket (WORK-42) at their own pace. Facilitator circulates.

**The pipeline they follow**:

#### Step 1: Fetch the ticket (~5 min)
> "Ask Claude to look at ticket WORK-42"

Atlas agent automatically fetches the ticket details, AC, and PO notes. They read the requirements.

#### Step 2: Fetch the design doc (~5 min)
> "The ticket links to a Notion doc. Ask Claude to fetch it."

Minerva agent fetches the technical design notes from Notion. Now they have the full context — and the tension between "similar to favorites" (ticket) vs. "dedicated model" (Notion doc).

#### Step 3: Plan the implementation (~15 min)
> "Ask Claude to plan the implementation. Read the plan carefully — do you agree with the approach?"

This is the core learning moment. Claude will propose a plan. Participants should:
- Read it critically
- Notice if it contradicts the Notion doc
- Push back on design decisions
- Discuss alternatives in plan mode
- Refine until they're satisfied

**Facilitator tip**: Walk around during this phase. If someone just approves the plan without reading it, nudge them: "What approach did it pick for the data model? Does that match what the design doc says?"

#### Step 4: Implement (~15-20 min)
> "Approve the plan and let Claude implement it."

Claude writes the code: Prisma schema change, query functions, controller, routes, validator, viewer updates, tests. They approve each step.

#### Step 5: Review (~10 min)
> "Install the code review plugin and run it."

They install: `/plugin install code-review@claude-plugins-official`
Then run the review. Claude reviews its own code and gives feedback. They fix action items.

#### Step 6: Ship (~5 min)
> "Commit and create a PR."

They install: `/plugin install commit-commands@claude-plugins-official`
Then run `/commit` to create the commit with a good message, or do it manually with git.

### Part 4: The Ceiling (10 min)
**Format**: Brief show-and-tell. Facilitator shares screen.

Now that they've experienced the pipeline firsthand, show where it goes:

- **CLAUDE.md**: "You generated one with `/init`. Here's what ours looks like for the real project — conventions, test commands, gotchas."
- **Hooks**: "Every file Claude edits gets auto-formatted and linted. 5-line config."
- **Full agent suite**: "What you used today — Atlas, Minerva — we have 8 of these. PR reviewers, Jira writers, Drive readers."
- **Parallel sessions**: "I work on multiple tickets simultaneously, each in its own isolated environment."

**Keep it to 10 minutes.** The message: "What you did today is the foundation. There's more depth if you keep using it."

### Part 5: Debrief + Q&A (10 min)
**Format**: Open discussion.

Start with: "What surprised you? What frustrated you?"

Let it flow naturally. Likely topics:
- **"The plan was wrong."** Good — that's why you read it. How did you steer it?
- **"It wanted to do X but the Notion doc said Y."** Exactly — context matters. The more context you give it, the better it gets.
- **"How do I know what it changed?"** Git diff. Same as reviewing anyone else's code.
- **"What about our actual project?"** The `CLAUDE.md` is the bridge. Writing one for the real project is the natural next step.

**Close with**: "You have Claude Code installed. Try it on your real work this week. We can share notes next Friday."

---

## Pre-Workshop Setup

### For participants (send 3+ days before):

**Email/message to send:**

> **Workshop prep — do this before [date]**
>
> We'll be using Claude Code (a terminal AI tool) in the workshop. You need a few things installed and authenticated beforehand so we don't waste workshop time on setup.
>
> 1. Install Claude Code: `npm install -g @anthropic-ai/claude-code`
> 2. Run `claude` once to authenticate (opens browser)
> 3. Install GitHub CLI: `brew install gh` → `gh auth login`
> 4. Install Atlassian CLI: `brew tap atlassian/homebrew-acli && brew install acli` → `acli auth login --web`
> 5. Clone the workshop repo: `git clone [repo-url]`
> 6. Run the checker: `bash scripts/check-setup.sh`
> 7. Fix any failures using the hints — run the script again until everything passes
>
> If you get stuck, ping me before the workshop.

### Setup Checker
`scripts/check-setup.sh` validates everything in one run:
- Claude Code >= 2.0.0 (+ node/npm if Claude missing)
- git, gh + auth, acli + auth
- Notion MCP configured + authenticated
- Demo project: npm install + all 100 tests pass
- Demo repo accessible (if configured)
- Jira board accessible (if configured)

### For facilitator:
- [ ] Jira project created (WORK) with ticket WORK-42
- [ ] Notion page created with technical design notes
- [ ] Demo project tested end-to-end with Claude Code
- [ ] Ticket produces an imperfect first plan (verify the ambiguity works)
- [ ] `facilitator-backup/jira-status.md` ready
- [ ] Advanced setup ready for ceiling demo (agents, hooks, parallel sessions)

---

## What's in the Repo

```
ai-workshop/
├── CLAUDE.md                          # Project instructions
├── workshop-final.md                  # This file — the workshop plan
├── jira-ticket.md                     # Ticket text (to create in Jira)
├── notion-doc.md                      # Notion page text (to create in Notion)
├── scripts/
│   └── check-setup.sh                 # Pre-workshop setup validator
├── facilitator-backup/
│   └── jira-status.md                 # Backup command if someone gets stuck
├── demo-project/                      # The codebase participants work on
│   ├── .claude/agents/                # Atlas + Minerva (pre-built)
│   ├── .mcp.json                      # Notion MCP config
│   ├── prisma/schema.prisma           # Data models
│   ├── src/                           # Express + TypeScript API
│   └── package.json                   # Zero-config: npm install && npm test
├── workshop.md                        # Earlier draft (reference only)
├── workshop-claude-workflow.md        # Earlier draft (reference only)
└── slides.md                          # Earlier draft (reference only)
```

---

## Key Principles

1. **They do the work, not you.** Your job is to facilitate, not perform. Every minute they spend watching you is a minute they're not forming their own experience.

2. **The plan mode discussion is the most important moment.** This is where they learn to steer. Don't let them skip it.

3. **No comparisons.** Don't frame it as "old way vs. new way." It's just a new tool to try.

4. **Don't rescue too quickly.** If Claude gives a wrong answer, let them figure out how to steer it. That's the real skill. Step in only for tooling issues.

5. **Context is the lesson.** The ticket + Notion doc pattern shows them: the more context you give the AI, the better it performs. `CLAUDE.md`, agents, design docs — it all feeds the same idea.

6. **No pressure to adopt.** The goal is exposure, not conversion. If someone tries it and decides it's not for them right now, that's fine.
