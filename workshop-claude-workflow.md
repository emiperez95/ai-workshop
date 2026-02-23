# Workshop: Beyond Autocomplete — AI as an Autonomous Collaborator

> **Audience**: Software engineers who use AI through IDE integrations (Cursor, Copilot, Cody, etc.) — tab-completion, inline suggestions, and sidebar chat — but haven't explored agentic, terminal-based AI workflows.
>
> **Goal**: Show what changes when AI can **run commands, read your tools, and chain actions together** — and give a clear path to get there from what you already know.

---

## What You Already Know (and Where It Stops)

If you use Cursor, Copilot, or similar tools, you're already familiar with:

- **Tab completion**: AI predicts your next line of code
- **Sidebar chat**: You paste code, ask questions, get snippets back
- **Inline edits**: Select code, ask "refactor this," get a diff

This is genuinely useful. But notice what it **can't** do:

| You can ask it to... | But it can't... |
|---|---|
| "Write a test for this function" | Run the test to see if it passes |
| "Fix this bug" | Read the error logs from CI to understand what failed |
| "Update the API endpoint" | Check if the Jira ticket has additional requirements |
| "Review this code" | Look at the PR diff, check CI status, read related tickets |
| "Help me with this ticket" | Open Jira, read the acceptance criteria, check the epic context |

The AI lives in a box — it can see the file you're editing and nothing else. It doesn't know your project's test commands, can't read your Jira board, can't check if CI passed, can't look at the PR comments.

**This workshop is about what happens when you take the AI out of that box.**

---

## The Shift: From Suggestion Engine to Autonomous Agent

Here's the core difference:

```
WHAT YOU HAVE NOW (IDE AI):
┌──────────────┐     ┌──────────┐
│  Your Editor  │────→│  AI API  │──→ Suggestion/snippet
│  (one file)   │     └──────────┘
└──────────────┘

WHAT WE'RE TALKING ABOUT (Agentic AI):
┌──────────────┐     ┌──────────────────────────────────┐
│              │     │  AI Agent                         │
│  Your        │────→│  ├── Reads entire codebase        │
│  Terminal    │     │  ├── Runs tests                   │
│              │     │  ├── Reads Jira tickets           │
│              │◄────│  ├── Checks CI/CD                 │
│              │     │  ├── Creates PRs                  │
│              │     │  ├── Edits multiple files          │
│              │     │  └── Chains all of the above       │
│              │     └──────────────────────────────────┘
└──────────────┘
```

The AI isn't just predicting text — it's **taking actions**. It reads files, runs commands, edits code, and chains these together to accomplish multi-step tasks.

---

## The Mental Model: 4 Layers

Think of this as a progression. Each layer builds on the previous one, but each is independently useful.

```
┌─────────────────────────────────────────────────────┐
│  Layer 4: WORKFLOWS                                  │
│  Multi-step automations that chain agents together   │
│  "Take this Jira ticket from idea to Pull Request"   │
├─────────────────────────────────────────────────────┤
│  Layer 3: SPECIALISTS                                │
│  Agents that do one job well                         │
│  "Read the Jira ticket" · "Check PR status"          │
├─────────────────────────────────────────────────────┤
│  Layer 2: AUTOMATION                                 │
│  Things that happen without you asking               │
│  "Auto-format every file I edit" · "Log everything"  │
├─────────────────────────────────────────────────────┤
│  Layer 1: FOUNDATION                  ← START HERE   │
│  Teaching the AI your project's rules                │
│  "Never run pnpm test" · "Use this test command"     │
└─────────────────────────────────────────────────────┘
```

**You start at the bottom.** Layer 1 alone is already a massive upgrade over sidebar chat.

---

## Layer 1: Foundation — Teaching AI Your Project's Rules

### The Problem You Already Know

When you use Cursor's chat and say "write a test for this," it generates code. But it doesn't know:
- What test runner you use
- Your project's file naming conventions
- That your test database needs a special setup command
- That `pnpm test` will hang the machine but `pnpm --filter server test -- --runInBand` works fine

You end up correcting the same things over and over, in every conversation.

### The Solution: `CLAUDE.md` Files

These are plain markdown files that the AI reads **before every conversation**. Think of Cursor's "Rules for AI" settings — but living in your project, version-controlled, and shared with the team.

| File | Cursor equivalent | Who sees it | In git? |
|---|---|---|---|
| `CLAUDE.md` (project root) | `.cursorrules` | Entire team | Yes |
| `CLAUDE.local.md` (project root) | Your personal "Rules for AI" | Just you | No |
| `~/.claude/CLAUDE.md` | Global "Rules for AI" | Just you, all projects | N/A |

### Real Example

Here's a real `CLAUDE.local.md` from this project:

```markdown
# Local Machine Optimizations

## Testing
Do NOT use `pnpm test` (runs tests in parallel via Turbo, hangs the machine).
Run tests individually per package with --runInBand:
- `pnpm --filter server test -- --runInBand` for backend tests
- `pnpm --filter web test` for frontend tests
- `pnpm --filter api test -- --runInBand` for API package tests

## Linting
Do NOT use `pnpm lint` (runs in parallel via Turbo, resource intensive).
Run lint individually per package with --cache:
- `pnpm --filter server lint -- --cache` for backend
- `pnpm --filter web lint -- --cache` for frontend
```

**The difference from Cursor rules**: This isn't just about code style. Because the AI can *run commands*, these rules prevent it from crashing your machine. The AI actually executes `pnpm --filter server test -- --runInBand` instead of `pnpm test`.

### What to Put in Your Team's `CLAUDE.md`

Think of it as the README your project deserves but never got:

- How to run tests (and how NOT to)
- How to run the dev server
- Project structure ("backend is in /server, frontend in /web")
- Naming conventions
- Things to never do ("don't modify migration files directly")
- Common gotchas new developers hit

### The Big Difference: Permissions

Because the AI can run commands, there's a permission system. You pre-approve what it's allowed to do:

```json
{
  "permissions": {
    "allow": [
      "Bash(pnpm --filter server test:*)",
      "Bash(gh pr view:*)",
      "Bash(git push:*)"
    ]
  }
}
```

Without pre-approval, it asks before every command. With it, common operations are frictionless.

---

## Layer 2: Automation — Things That Happen Without You Asking

### Comparison to What You Know

In Cursor, when you accept an AI edit, the file saves and your editor's format-on-save kicks in. That's it.

In an agentic setup, you can define **hooks** — shell scripts that fire on specific lifecycle events:

| Event | When it fires | Example |
|---|---|---|
| `PostToolUse` | After the AI edits any file | Auto-run Prettier + ESLint |
| `PreToolUse` | Before the AI uses any tool | Block writes to protected files |
| `Stop` | When the AI finishes responding | Trigger follow-up actions |
| `Notification` | When the AI needs your attention | Play a sound |

### Real Example: Auto-Format on Save

Every time Claude edits a `.ts`, `.tsx`, `.js`, or `.jsx` file, this hook runs Prettier and ESLint automatically:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "file_path=$(jq -r '.tool_input.file_path') && if [[ \"$file_path\" =~ \\.(ts|tsx|js|jsx)$ ]]; then pnpm exec prettier --write \"$file_path\" 2>/dev/null; pnpm exec eslint --cache --fix \"$file_path\" 2>/dev/null; fi; exit 0"
          }
        ]
      }
    ]
  }
}
```

**Why this matters**: The AI never commits poorly formatted code. Not because you told it to format — it happens automatically, every single time. You'd have to actively disable it to get unformatted output.

### Why This Is Different from IDE Plugins

Your IDE already has format-on-save. But hooks go beyond formatting:

- **Read-only guard**: A hook that calls a small AI model to classify whether an operation is read-only, blocking writes unless explicitly approved
- **Logging**: Every action gets logged for debugging and audit
- **Notifications**: Audio alerts when the AI finishes a long task and needs your input
- **Worktree lifecycle**: Automatically set up/tear down development environments

---

## Layer 3: Specialists — Agents That Do One Job

### The Problem

Sidebar chat is a generalist. Ask it about Jira and it'll give you generic advice. Ask it about your PR and it can only see the file you have open — not the diff, the CI results, or the linked ticket.

### The Solution: Specialized Agents

Instead of one AI that does everything poorly, you create focused agents that each handle one domain. They're defined in markdown files — no code needed.

### The Agent Roster (Real Production Setup)

Each agent is named after a mythological figure (just a naming convention — call yours whatever you want):

| Agent | Domain | What it does | How it activates |
|---|---|---|---|
| **Atlas** | Jira | Reads tickets, acceptance criteria, epics, comments | You mention a ticket ID like "CSD-2576" |
| **Apollo** | Jira | Creates/updates tickets, transitions status | "Move this to In Review" |
| **Hermes** | GitHub | Collects PR data — changes, commits, linked issues | "What's in this PR?" |
| **Heimdall** | GitHub | Checks PR status — CI, reviews, merge blockers | "Is the PR ready to merge?" |
| **Minerva** | Notion | Searches the team's Notion workspace | "Check the docs for..." |
| **Clio** | Google Drive | Reads Docs, Sheets, PDFs | You share a Drive link |
| **Janus** | Git | Creates/manages git worktrees for parallel work | "Let's work on CSD-2576" |

### What an Agent Looks Like

It's just a markdown file with instructions. No Python, no JavaScript, no framework:

```markdown
---
name: atlas-jira-analyst
description: Fetches Jira issue information
tools: Bash, Read, Grep, WebFetch
---

You are a Jira data collector. When given a ticket ID:
1. Fetch the ticket details using the Atlassian CLI
2. Get acceptance criteria and Definition of Done
3. Find linked issues and epic context
4. Return structured data — do NOT analyze, just collect
```

**Key design principle**: Agents **collect data**, they don't make decisions. The main AI session orchestrates and decides. This keeps each piece simple, testable, and debuggable.

### Comparison to Cursor

In Cursor, you might:
1. Open a browser tab, go to Jira, read the ticket
2. Copy the acceptance criteria
3. Paste it into the chat
4. Ask the AI to implement it

With agents:
1. Say "Let's work on CSD-2576"
2. Atlas automatically fetches the ticket, AC, epic, comments
3. Claude has full context without you copying anything

The AI does the context-gathering that you used to do manually.

### How Agents Work Together (Real Flow)

```
You: "Let's work on CSD-2576"
  │
  ├── Janus: creates a git worktree + branch + tmux session
  ├── Atlas: fetches the Jira ticket, acceptance criteria, epic
  │
You: "Implement this"
  │
  ├── Claude: writes code across multiple files
  ├── [Hook: auto-formats every file touched]
  │
You: "Create a PR"
  │
  ├── Hermes: gathers all changes, categorizes by type
  ├── Claude: creates PR with structured description
  │
You: "Review the PR"
  │
  ├── Athena: runs 6+ reviewers in parallel (see below)
  ├── Heimdall: checks CI/CD status, merge readiness
  └── You get a consolidated review with confidence scores
```

Compare this to the sidebar chat workflow: open Jira, copy ticket, paste, ask for code, copy code, paste into files, run tests manually, open GitHub, create PR manually, wait for review... The agents compress hours of context-switching into a conversation.

---

## Layer 4: Workflows — Multi-Step Automations

### The Problem

Even with agents, you're still the orchestrator. "First read the ticket. Now create the branch. Now implement. Now run tests. Now create the PR." That's a lot of steering.

### The Solution: Slash Commands

Slash commands are reusable workflows that chain multiple steps. They're like macros, but intelligent — they adapt to what they find.

### Key Workflows

#### `/dev-orchestrator` — Ticket to PR in One Command

```
Phase 1: Understand the ticket (Atlas reads Jira)
   ↓ [You confirm understanding]
Phase 2: Plan the implementation
   ↓ [You approve the plan]
Phase 3: Implement (Claude writes code, hooks auto-format)
   ↓ [You review the code]
Phase 4: Test (runs relevant test suites)
   ↓ [You verify tests pass]
Phase 5: Create PR (Hermes gathers context, Claude writes description)
```

**Human checkpoints at every phase.** The AI doesn't run unsupervised — it stops and waits for your go-ahead before each major step. You stay the decision-maker.

#### `/fix-pipeline` — Fix CI Until It's Green

```
1. Check which CI checks failed
2. Fetch the error logs
3. Analyze the failures
4. Implement fixes
5. Push
6. Repeat until all checks pass
```

Instead of: open GitHub → find the failing check → click to expand logs → read the error → switch to IDE → find the file → fix it → commit → push → wait → repeat.

#### `/jira-status` — Board in Your Terminal

```
IN PROGRESS:
  [A] CSD-2576 - Do/Don't modification (tmux: active)
  [B] CSD-2571 - Front first state management

READY FOR REVIEW:
  [C] CSD-2558 - Fix Test Meaning layout

TO DO:
  [D] CSD-2590 - Add export functionality
```

No browser tab. No context switch. Your board state in the same terminal where you're coding.

#### Other Useful Commands

| Command | What it does |
|---|---|
| `/project-status` | Health report: git, CI, tests, code quality |
| `/pending-work` | PRs needing attention: unanswered questions, ready to merge, team PRs needing review |
| `/analyze-pr` | Cross-references PR changes against Jira acceptance criteria |

---

## Deep Dive: The Athena PR Review System

This is the most advanced piece — and probably the most immediately valuable for the team.

### What It Does

Instead of one AI reviewing your PR (like Cursor would if you pasted a diff), Athena runs **6+ specialized reviewers in parallel**, each with a different focus:

| Reviewer | Focus |
|---|---|
| **Error Hunter** | Potential bugs, edge cases, null reference issues |
| **Test Analyzer** | Test coverage, test quality, missing test scenarios |
| **Type Reviewer** | TypeScript type safety, unsafe casts, missing types |
| **Code Reviewer** | Architecture, patterns, best practices |
| **Simplifier** | Over-engineering, unnecessary complexity |
| **Comment Analyzer** | Documentation quality, misleading comments |
| **+ Gemini** | Different AI model — catches different things |
| **+ Codex** | Cloud sandbox — can actually run the code |

### How It Filters Noise

The biggest problem with AI code review is false positives. Athena handles this with a pipeline:

```
1. Gather context (PR diff, Jira ticket, epic, git blame, prior review comments)
2. Run ALL reviewers in parallel
3. Each reviewer scores findings with confidence (0-100)
4. Drop findings with confidence < 80%
5. Boost findings flagged by 2+ reviewers independently
6. Verify each remaining finding against the actual diff (catches hallucinations)
7. Cluster results by theme and present
```

The verification step is critical — it re-reads the actual code to confirm the finding is real, not something the AI imagined.

### Why Multiple Reviewers Beat One

- A bug-focused reviewer catches different things than a style-focused one
- Different AI models have different blind spots
- When two independent reviewers flag the same line, it's almost certainly a real issue
- Confidence scoring means you see signal, not noise

---

## Using Multiple AI Tools Together

Different AI tools have different strengths. This setup integrates three:

| Tool | Strength | Used for |
|---|---|---|
| **Claude Code** | Deep reasoning, multi-step tasks, agent orchestration | Primary development — the "brain" |
| **Gemini** | Huge context window (1M+ tokens) | Analyzing large codebases, reading entire modules at once |
| **OpenAI Codex** | Cloud sandboxes, parallel execution | Running experiments in clean environments |

These are integrated as slash commands (`/gemini`, `/codex`) so switching between them is seamless.

**For your context**: This is like having Cursor, but you can also say "hey, use Gemini to read the entire /server directory and tell me about the architecture" or "use Codex to run this in 3 parallel cloud sandboxes."

---

## The Worktree System — Working on Multiple Tickets in Parallel

### The Problem You Already Know

You're working on feature A. A review comes back on feature B. You stash your changes, switch branches, address the review, switch back, pop your stash, remember where you were... 15 minutes gone just from context-switching.

### The Solution: Git Worktrees + Isolated Environments

Each ticket gets its own completely isolated environment:
- Its own directory (git worktree)
- Its own branch
- Its own database (if needed)
- Its own terminal session (tmux)
- Its own AI session (with its own conversation history)

```
$ hive wt list

ACTIVE WORKTREES:
  CSD-2576-do-dont-modification          (tmux: active)
  CSD-2571-front-first-state-management  (tmux: active)
  CSD-2558-fix-test-meaning-layout       (tmux: detached)
  CSD-2541-llm-session-summary           (tmux: detached)
  ... (23 total)
```

Switch between tickets by switching tmux windows. No stashing, no branch switching, no "wait, where was I?" Each environment is exactly where you left it.

---

## Getting Started: A Practical Roadmap

You're not starting from zero — you already use AI for coding. Here's how to level up from where you are.

### Week 1: Try the Terminal (Layer 1)

You already know AI chat. This is the same thing, but it can *do* things.

1. Install Claude Code: `npm install -g @anthropic-ai/claude-code`
2. Open it in your project directory: `claude`
3. Try things your IDE chat can't do:
   - "Run the tests for the server package and fix any failures"
   - "Find all usages of UserService and explain the dependency chain"
   - "Read the CI logs for the last failing build and tell me what went wrong"
4. Notice what's different: it reads files itself, runs commands, and edits code across multiple files — without you copy-pasting anything.

### Week 2: Teach It Your Rules (Layer 1)

1. Create a `CLAUDE.md` at your project root with 10-15 lines:
   - How to run tests safely
   - Project structure overview
   - Key conventions
2. Create a personal `CLAUDE.local.md` for your machine-specific settings
3. Notice that it follows the rules every time — you never have to re-explain

### Week 3: Add the Safety Net (Layer 2)

1. Set up the auto-format PostToolUse hook (copy the JSON from the hooks section)
2. Pre-approve common commands in `settings.local.json`
3. Now AI edits are always formatted and linted — automatically

### Week 4: Try Agents (Layer 3)

1. Start with the one that saves you the most time:
   - **Jira users**: Atlas (reads tickets without you leaving the terminal)
   - **PR reviewers**: Hermes (gathers PR data) + Heimdall (checks status)
2. Agents are markdown files — easy to create, easy to modify, easy to share

### Month 2+: Build Your Own Workflows (Layer 4)

1. Identify your most repetitive multi-step processes
2. Turn them into slash commands
3. Share useful ones with the team

---

## Common Questions from IDE AI Users

### "I already have Copilot/Cursor — why do I need this?"

They're complementary. Keep using Cursor for inline completions and quick edits — it's great at that. Use the agentic approach for:
- Multi-file changes
- Tasks that need external context (Jira, GitHub, Notion)
- Running and fixing tests
- CI debugging
- PR reviews
- Anything that requires more than one step

Think of it this way: Cursor is a great writing assistant. This is a junior developer who can also read your Jira board, run your tests, and create your PRs.

### "Is it hard to set up?"

Layer 1 (CLAUDE.md + basic usage) takes 10 minutes. Layer 2 (hooks) takes 30 minutes. Layers 3-4 are built over weeks as you identify what you need. You don't have to build all of this at once.

### "Will it break my code?"

Same guardrails you already have:
- Your pre-commit hooks still run (lint-staged, type checks)
- The auto-format hook catches style issues
- You review every PR before merging
- Permissions control what the AI can do
- Human checkpoints in workflows mean you approve each step

### "What about my IDE? Do I have to switch to the terminal?"

No. Claude Code can run inside VS Code and other IDEs as an extension. But even as a terminal tool, it complements your IDE — run it in a split terminal while you have your editor open. Many developers use both simultaneously: IDE for browsing code, terminal AI for executing multi-step tasks.

### "What about security?"

- Code is sent to the AI API for inference — same as Copilot/Cursor
- Claude Code runs locally — no intermediary servers
- Permissions are explicit — you control what commands it can run
- `.local.md` files are gitignored — personal settings stay private
- You can set up read-only guards to prevent unauthorized writes

### "How much does it cost?"

Claude Code uses API credits. For the Max subscription ($100/month or $200/month) you get a generous usage allowance. Similar pricing to Cursor Pro. The ROI comes from automating the tasks that eat your time: CI debugging, PR reviews, Jira admin, context switching.

---

## Key Takeaways

1. **You already use AI for coding — this is the next step.** Going from "AI suggests code" to "AI executes multi-step tasks" is the biggest productivity jump.

2. **Start with Layer 1 — it takes 10 minutes.** A `CLAUDE.md` file and a terminal session. That's it. You'll immediately see the difference from sidebar chat.

3. **The AI does your context-switching.** Reading Jira, checking CI, gathering PR data, switching branches — the AI does the boring parts so you can focus on decisions.

4. **Human checkpoints keep you in control.** Workflows pause at every major step. You approve plans, review code, verify tests. The AI accelerates your workflow — it doesn't replace your judgment.

5. **It compounds over time.** Every rule you teach, every agent you build, every workflow you create makes every future session more productive. Unlike IDE autocomplete, which is the same every day, this system gets better as you invest in it.
