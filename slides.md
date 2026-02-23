---
marp: true
theme: default
paginate: true
title: "Beyond Suggestions: AI That Does Things"
---

<!--
  SLIDE-READY MARKDOWN
  Works with: Marp, Google Slides (paste sections), or present raw in terminal
  Each --- is a slide break
  Generate slides: npx @marp-team/marp-cli slides.md --html
-->

# Beyond Suggestions
## From AI Chat to AI That Does Things

---

# You Already Use AI

You write code. Cursor/Copilot suggests the next line. You accept or reject.

You get stuck. You open the chat sidebar. You paste code. You get an answer.

**That's valuable. But it's only the first floor of the building.**

This talk is about the upper floors.

---

# The Three Floors of AI-Assisted Development

```
┌─────────────────────────────────────────────────────┐
│  FLOOR 3: Autonomous Workflows                      │
│  "Review this PR against the Jira requirements"     │
│  → AI fetches everything, runs reviewers,           │
│    presents findings                                │
├─────────────────────────────────────────────────────┤
│  FLOOR 2: Tool-Using AI                             │
│  "Run the tests and fix what's failing"             │
│  → AI runs commands, reads output, edits code       │
├─────────────────────────────────────────────────────┤
│  FLOOR 1: Suggestions & Chat  ← YOU ARE HERE        │
│  "What does this function do?"                      │
│  → AI answers, you do the work                      │
└─────────────────────────────────────────────────────┘
```

---

# The Key Difference Between Floors

**Floor 1** — You drive, AI navigates
> You copy code, paste it, ask questions, copy the answer back

**Floor 2** — You give directions, AI drives
> You say what to do, AI executes it (runs commands, edits files)

**Floor 3** — You say where to go, AI plans the route and drives
> You state the goal, AI figures out the steps and executes them

<!--
Speaker note: The jump from Floor 1 to Floor 2 is the biggest mindset shift. Once you see AI running commands and editing files, Floor 3 becomes natural.
-->

---

# What Floor 2 Looks Like

You probably do this today:

```
You:    "Why is this test failing?"
Chat:   "The mock isn't returning the expected format.
         Try changing line 42 to: mockUser({ id: 1, name: 'test' })"
You:    [goes to file, finds line 42, makes the edit, re-runs test]
```

Floor 2:

```
You:    "Run the tests, find what's failing, and fix it"
AI:     [runs npm test]
        [reads the failure output]
        [opens the file, edits line 42]
        [re-runs the tests]
        [all green ✅]
        "Fixed — the mock wasn't matching the expected format"
```

**Same result. You just didn't do the mechanical parts.**

---

# What Floor 3 Looks Like

This is where it gets interesting.

```
You:    "Review PR #456"
```

That's it. One sentence. Behind the scenes:

1. AI calls GitHub API → fetches the full diff
2. AI calls Jira API → fetches the ticket requirements
3. AI reads existing review comments → avoids duplicating feedback
4. AI spawns 8 specialized reviewers **in parallel**
5. Each reviewer analyzes from a different angle
6. Findings are cross-referenced and verified
7. You get a structured report in ~2 minutes

**You didn't specify any of those steps. The AI knew the workflow.**

---

# How? Agents.

An **agent** is just AI with:
1. **A specific job** ("fetch Jira ticket details")
2. **Access to tools** (Jira API, GitHub CLI, browser, filesystem)
3. **A trigger** (activates when relevant)

Think of them as pre-built macros that can adapt to any input.

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Jira Agent  │  │   PR Agent   │  │ Notion Agent │
│              │  │              │  │              │
│  Reads Jira  │  │  Reads PRs   │  │ Searches docs│
│  via CLI     │  │  via gh CLI  │  │ via Notion   │
└──────────────┘  └──────────────┘  └──────────────┘
```

**Not magic. Just AI with permissions to run specific commands.**

---

# My Actual Day — Live Demo

---

# Step 1: Sprint Overview

```
Me:  "/jira-status"
```

```
📋 SPRINT BOARD — Sprint 42

🔵 IN PROGRESS (My Work)
  A. CSD-2345  Add user authentication     ✓ (active session)
  B. CSD-2350  Fix payment rounding bug    - (no session)

🟡 READY FOR REVIEW (To Review)
  C. CSD-2301  Refactor cart service        (Maria's PR)
  D. CSD-2318  Add email notifications      (Jake's PR)

🟢 HAS REVIEW (My PRs with feedback)
  E. CSD-2340  Update search API

🔴 TO DO
  F. CSD-2360  Add rate limiting
```

I type a letter. AI takes the right action.

<!--
Speaker note: Point out the ✓ and - indicators. These show which tickets have an active workspace on my machine. The AI knows this because it checks my running sessions.
-->

---

# Step 2: Start a Ticket

```
Me:  "F"  (picks the rate limiting ticket)
```

**What happens automatically:**
- Creates an isolated git workspace (worktree)
- Names the branch `CSD-2360-add-rate-limiting`
- Opens a terminal session for that workspace
- Fetches the full Jira ticket context
- Fetches the parent epic for bigger picture
- Pulls acceptance criteria and team comments

**10 seconds. I'm coding with full context.**

Compare: open Jira → read ticket → click epic → read comments →
open terminal → `git checkout -b` → name the branch → context switch back

---

# Step 3: While Coding — Context on Demand

I never leave my terminal. Context comes to me:

```
Me:  "Check Notion for our rate limiting docs"
AI:  → searches Notion → finds architecture decision record
     → shows the key points inline
```

```
Me:  "Read this design doc" [pastes Google Drive link]
AI:  → downloads → converts to text → shows the content
```

```
Me:  "What did the team say about this in the comments?"
AI:  → fetches Jira comments → presents chronologically
```

**Zero browser tabs. Zero context switches.**

---

# Step 4: Review Someone's PR

```
Me:  "Review PR #456"
```

The review orchestrator kicks off:

```
Phase 1 — Gather context (parallel):
  ├─→ Fetch full diff from GitHub
  ├─→ Fetch Jira requirements + acceptance criteria
  ├─→ Fetch existing review comments
  └─→ Read project coding guidelines

Phase 2 — Run reviewers (8 in parallel):
  ├─→ Test coverage analyzer
  ├─→ Error handling hunter
  ├─→ Type safety reviewer
  ├─→ Code simplification reviewer
  ├─→ Requirements compliance checker
  ├─→ Comment/PR feedback analyzer
  ├─→ Gemini (external LLM — fresh perspective)
  └─→ Codex (another external LLM)

Phase 3 — Aggregate + Verify:
  └─→ Cross-reference findings
  └─→ Verify each against actual code (filter hallucinations)
  └─→ Present structured report
```

---

# What the Review Output Looks Like

```
🔍 PR REVIEW — #456 CSD-2345: Add user authentication

━━━ CRITICAL ━━━
🔴 Missing rate limit on login endpoint
   src/auth/login.ts:42
   Flagged by: error-hunter, code-reviewer, gemini
   → Brute force vulnerability without rate limiting

━━━ IMPORTANT ━━━
🟡 No test for expired token scenario
   src/auth/__tests__/token.test.ts
   Flagged by: test-analyzer, codex
   → Token expiry is in acceptance criteria but untested

🟡 Inconsistent error response format
   src/auth/middleware.ts:67
   Flagged by: code-reviewer
   → Uses { error: string } but convention is { message, code }

━━━ SUGGESTIONS ━━━
🔵 Extract token validation to shared util
   src/auth/middleware.ts:23-45
   Flagged by: simplifier
   → Same logic exists in src/api/middleware.ts:12-30

Recommendation: REQUEST_CHANGES (1 critical, 2 important)
```

**Thorough review. 2 minutes. Multiple perspectives.**

---

# Step 5: Check My Own PR

```
Me:  "What's blocking my PR?"
```

```
PR #789 — CSD-2340: Update Search API

CI/CD:      ✅ All checks passing
Approvals:  1/2 required (Maria ✅, waiting on Jake)
Comments:   3 unresolved
  - L42: "Should this handle the empty array case?"
  - L89: "Can we add a test for timeout?"
  - General: "Looks good, minor nits"
```

No switching to GitHub. No clicking through tabs.

---

# Step 6: End of Month — Timesheet

```
Me:  "/harvest-timesheet fill January"
```

The AI:
1. Opens Google Calendar in a real browser
2. Reads every meeting for January, week by week
3. Categorizes each meeting:
   - "Sprint Planning" → Project X / Meetings
   - "1:1 with Manager" → Internal / Management
4. Shows me the categorization — I confirm or tweak
5. Opens Harvest in the browser
6. Fills each week's timesheet grid
7. **Remembers categorizations** — next month it already knows

**45 minutes → 3 minutes**

---

# Why This Beats Chat Sidebar

---

# Chat Sidebar Limitation 1: Copy-Paste Loop

```
Chat sidebar workflow:
  1. You paste code into chat
  2. AI suggests a fix
  3. You copy the fix
  4. You paste it into your file
  5. You run the test manually
  6. It fails — back to step 1
```

```
Tool-using AI workflow:
  1. "Fix the failing test in auth.test.ts"
  2. Done.
```

**The copy-paste loop is the biggest productivity killer.**

---

# Chat Sidebar Limitation 2: No Context Beyond Your Paste

Your chat sidebar only knows what you show it.

But the PR review needs:
- The full diff (50+ files sometimes)
- Jira ticket + acceptance criteria
- Epic context
- Existing review comments
- Project coding guidelines

**You'd never paste all of that into a sidebar.**
Agents fetch it automatically.

---

# Chat Sidebar Limitation 3: One Perspective

Chat gives you **one answer** from **one model**.

My PR review runs **8 different reviewers** in parallel,
each looking for different things.

Then cross-references — issues flagged by 3+ reviewers
are almost certainly real problems.

**Diverse perspectives catch more bugs.**

---

# Chat Sidebar Limitation 4: No Memory

You open a new chat. It knows nothing about your project.

My agents remember:
- Meeting categorizations for timesheets
- Project conventions for code review
- Sprint context for ticket management

**Learning compounds. Chat resets.**

---

# The Architecture (For the Curious)

```
┌────────────────────────────────────────────────────────┐
│                    YOU (terminal/editor)                │
│               "Review PR #456 for CSD-2345"            │
└───────────────────────┬────────────────────────────────┘
                        │
               ┌────────▼────────┐
               │   ORCHESTRATOR  │   Claude Code understands
               │   (Claude Code) │   intent, picks agents
               └────────┬────────┘
                        │
         ┌──────────────┼──────────────┐
         │              │              │
    ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
    │  Jira   │   │   PR    │   │   PR    │
    │ Reader  │   │ Content │   │ Status  │
    └────┬────┘   └────┬────┘   └────┬────┘
         │              │              │
     (acli CLI)     (gh CLI)       (gh CLI)
         │              │              │
         └──────────────┼──────────────┘
                        │
               ┌────────▼────────┐
               │ REVIEW SKILL    │
               │ (orchestrates   │
               │  8 reviewers)   │
               └────────┬────────┘
                        │
     ┌───┬───┬───┬──── │ ────┬───┬───┬───┐
     ▼   ▼   ▼   ▼     ▼     ▼   ▼   ▼   ▼
    R1  R2  R3  R4    R5    R6  R7  R8   (parallel)
     │   │   │   │     │     │   │   │
     └───┴───┴───┴─────┼─────┴───┴───┘
                        │
               ┌────────▼────────┐
               │   AGGREGATE +   │
               │     VERIFY      │
               └────────┬────────┘
                        ▼
                   FINAL REPORT
```

---

# What Makes This Possible

**It's not complicated.** Four things:

1. **AI that can run commands** — not just answer questions
2. **CLI tools** — `gh`, `acli`, `rclone` (you probably have some already)
3. **Agent definitions** — a markdown file saying "when X, do Y using Z"
4. **An orchestrator** — AI that picks the right agents for the job

**The agents are just markdown files. ~50 lines each.**

<!--
Speaker note: This is important to demystify. People assume this requires custom ML or complex infrastructure. It's literally markdown files and CLI tools.
-->

---

# A Real Agent — It's Just a Markdown File

```yaml
---
name: atlas-jira-analyst
description: >
  Fetches Jira issue information.
  PROACTIVELY USED when a Jira issue ID is mentioned.
tools: [Bash, Read, Grep]
model: sonnet
---
```

```markdown
## Instructions

When a Jira issue ID is detected:
1. Run: acli jira workitem view ISSUE-ID --fields *all --json
2. Extract: summary, description, acceptance criteria
3. If it has a parent epic, fetch that too
4. Return the structured data
```

**That's it.** A YAML header + instructions in plain English.

---

# Practical Patterns You Can Use Today

---

# Pattern 1: Let AI Run Your Commands

**You're probably already doing this:**
```
Chat: "What command do I run to check test coverage?"
AI:   "npm test -- --coverage"
[you copy-paste and run it]
```

**Next level — use a tool-using AI instead:**
```
You: "Check test coverage for the auth module"
AI:  [runs the command, reads the output, summarizes]
     "Auth module: 73% coverage. Missing: token.ts lines 42-60,
      middleware.ts lines 88-95. Want me to write those tests?"
```

**Tools:** Claude Code, Cursor Composer (Ctrl+I), Windsurf Cascade

---

# Pattern 2: Multi-Step Tasks

Instead of:
```
1. You: "What tests are failing?"
2. [reads answer, finds file, looks at the test]
3. You: "Here's the test code: [paste]. What's wrong?"
4. [reads answer, makes the edit]
5. You: "Now it has a different error: [paste]"
```

Try:
```
You: "The tests in auth/ are failing. Figure out why and fix them."
AI:  [runs tests → reads output → identifies root cause →
      edits files → re-runs tests → confirms green]
```

**Let AI do the iteration loop, not you.**

---

# Pattern 3: Context Loading

Before asking AI about code, **load the context first**:

```
"Read src/auth/login.ts and src/auth/middleware.ts,
 then explain how our authentication flow works"
```

Better than pasting snippets — AI sees the full files, imports,
types, and how they connect.

**In Cursor/Windsurf:** Use @file mentions to include context.
**In Claude Code:** It reads files directly.

---

# Pattern 4: Codebase-Aware Prompts

Don't ask generically. Reference your actual codebase:

```
Bad:  "Write a service for handling payments"

Good: "Write a PaymentService following the same pattern as
       src/services/UserService.ts — same error handling,
       same logging style, same test structure"
```

AI reads your existing code and matches the patterns.

**Your conventions become the template. AI follows them.**

---

# Pattern 5: Batch Operations

Things that are tedious for you but trivial for AI:

```
"Add error handling to all API endpoints in src/routes/"

"Update all test files to use the new mock format"

"Add TypeScript types to all the untyped functions in utils/"
```

AI iterates through files, applies the same pattern,
adapts to each file's specific context.

**What takes you an afternoon takes AI 5 minutes.**

---

# Getting to Floor 2 — Practical Steps

---

# Option A: Claude Code (What I Use)

Terminal-based. Works with any editor.

```bash
# Install
npm install -g @anthropic-ai/claude-code

# Use
cd your-project
claude

# Then just talk:
> "Run the tests and tell me what's failing"
> "Read the PR comments on my current branch"
> "Refactor this function to use async/await"
```

**Strength:** Full terminal access, runs any command, works everywhere.

---

# Option B: Cursor Composer

You already use Cursor for suggestions. The **Composer** does more.

**Ctrl+I** (or Cmd+I) opens Composer mode:
- It can edit multiple files at once
- It can run terminal commands
- It understands your full codebase

```
Composer: "Add input validation to the signup form.
           Follow the same pattern as the login form."

→ Edits form component, validation schema, tests
→ All in one shot
```

**Strength:** Visual diffs, inline in your editor.

---

# Option C: Windsurf Cascade

Similar to Cursor Composer but with an "agent mode":
- Automatically reads relevant files
- Executes multi-step plans
- Shows you what it's doing step by step

```
Cascade: "The checkout flow is broken after the
          last refactor. Find and fix the issue."

→ Reads error logs → traces the code path →
  identifies the breaking change → fixes it →
  runs tests to confirm
```

**Strength:** Good at autonomous multi-step tasks.

---

# The Mindset Shift

```
Floor 1 thinking:
  "I'll write the code, AI helps me when I'm stuck"

Floor 2 thinking:
  "I'll describe what I want, AI writes the first draft,
   I review and refine"

Floor 3 thinking:
  "I'll define the workflow once,
   AI runs it every time I need it"
```

**Each floor multiplies your output, not replaces your judgment.**

---

# What I'd Recommend

1. **This week:** Try one multi-step task in Composer/Cascade/Claude Code
   - "Run tests, fix failures, re-run until green"
   - See how it feels to let AI iterate

2. **Next week:** Try a batch operation
   - "Add error handling to all routes in this directory"
   - Watch it adapt per file

3. **This month:** Identify your most repetitive workflow
   - What do you do the same way every time?
   - Could AI do the mechanical parts?

**You don't need custom agents to get Floor 2 value.**

---

# Recap

- You're already on Floor 1 (suggestions + chat). That's good.
- **Floor 2** (AI that runs commands and edits files) is the biggest jump.
- **Floor 3** (autonomous workflows with agents) is where I am.
- The difference: **AI as navigator** → **AI as driver** → **AI as autopilot**
- Start with Composer/Cascade or Claude Code for Floor 2.
- Agents are just markdown files + CLI tools — not rocket science.

---

# Questions?

**Try this after the talk:**

Pick a task you'd normally do in 5 steps.
Ask your AI tool to do all 5 steps in one prompt.

See what happens.

---

# Appendix

---

# Appendix: My Full Agent Ecosystem

| Agent | Trigger | What It Does |
|-------|---------|-------------|
| Jira Reader | Ticket ID mentioned | Fetches full ticket + epic + comments |
| Jira Writer | "create ticket" | Creates/transitions tickets via CLI |
| PR Status | "PR status" | CI checks, reviews, blockers |
| PR Content | "what's in PR" | Full diff, commits, file categories |
| Doc Reader | Drive URL pasted | Downloads and converts documents |
| Notion Search | "find docs" | Searches Notion workspace |
| PR Reviewer | "review PR" | 8-reviewer parallel code review |
| Worktree Mgr | "work on [ticket]" | Creates isolated git workspace |

---

# Appendix: Time Savings (My Experience)

| Task | Before | After | Weekly Savings |
|------|--------|-------|----------------|
| Sprint board check | 10 min | 30 sec | ~10 min |
| Starting a ticket | 8 min | 10 sec | ~8 min/ticket |
| Fetching context | 5 min | 10 sec | ~5 min/ticket |
| PR review (thorough) | 30 min | 3 min | ~27 min/review |
| PR status check | 5 min | 15 sec | ~5 min |
| Monthly timesheet | 45 min | 3 min | ~42 min/month |
| **Rough weekly total** | | | **~3-4 hours** |

Not counting: faster coding, fewer context switches, better review quality.

---

# Appendix: Floor 2 Comparison

| Feature | Claude Code | Cursor Composer | Windsurf Cascade |
|---------|-------------|-----------------|------------------|
| Runs commands | Yes | Yes | Yes |
| Edits files | Yes | Yes (visual diff) | Yes (visual diff) |
| Multi-file edits | Yes | Yes | Yes |
| Codebase awareness | Yes | Yes (@file) | Yes (auto) |
| Custom agents | Yes (plugins) | Limited | Limited |
| External API access | Yes (CLI tools) | Limited | Limited |
| Works in terminal | Yes | No (IDE only) | No (IDE only) |
| Visual interface | No (terminal) | Yes | Yes |

---

# Appendix: Getting Started with Claude Code

```bash
# 1. Install
npm install -g @anthropic-ai/claude-code

# 2. Navigate to your project
cd ~/your-project

# 3. Start
claude

# 4. Try these prompts:
> "Read src/index.ts and explain the main flow"
> "Run the tests and summarize results"
> "Find all TODO comments in the codebase"
> "What's the PR status for my current branch?"

# 5. Optional — install my public plugin collection:
> "/plugin marketplace add emiperez95/cc-toolkit"
```
