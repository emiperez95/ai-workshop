# AI-Assisted Development Workshop
## From Autocomplete to Autonomous — The Jump You're Not Making Yet

---

## Agenda

1. **The Gap** — What you're doing vs. what's possible
2. **Agentic AI** — What changes when AI can execute, not just suggest
3. **Working With an Agent** — The skills that actually matter
4. **How I Actually Work** — Live walkthrough of a parallel workflow
5. **Bridging Over** — How to go from Cursor/Copilot to agentic workflows

---

## 1. The Gap

### What You're Already Doing

You use AI every day. Tab-complete suggestions, chat sidebar, "explain this code", maybe Cmd+K inline edits. This is **assistive AI** — it lives inside your editor and helps you write code faster.

```
You type code  →  AI suggests the next line  →  you accept or reject
You select code  →  "refactor this"  →  AI modifies it in place
You ask a question  →  AI answers in a sidebar  →  you apply manually
```

This is genuinely useful. But there's a ceiling: **you are still the executor.** You decide what to do, you navigate to the file, you run the tests, you commit. AI just makes each step a bit faster.

### What You're Not Doing

```
You describe a task  →  AI reads the codebase  →  AI proposes a plan
You approve the plan →  AI edits multiple files →  AI runs the tests
AI finds failures    →  AI fixes them          →  AI commits when green
```

This is **agentic AI** — the AI is the executor, you are the reviewer. You describe intent, it does the work, you verify the result.

### Why This Matters

The difference isn't "10% faster coding." It's a different way of working:

| Assistive (Cursor/Copilot) | Agentic (Claude Code, etc.) |
|---|---|
| You navigate to files | AI finds the relevant files itself |
| You write code, AI suggests | AI writes code, you review |
| One file at a time | Changes across 5-10 files in one pass |
| You run tests manually | AI runs tests, fixes failures, re-runs |
| You do one task at a time | Multiple AI sessions work in parallel |
| You are the bottleneck | Your review speed is the bottleneck |

**The mental shift:** stop thinking "AI helps me code" and start thinking "I direct AI, then review its work."

---

## 2. Agentic AI — What's Different

### It Reads Your Codebase

Not just the file you have open — the whole project. When you say "add soft delete to users," an agent will:

1. Find the User model
2. Look at how other models handle similar patterns
3. Check the existing migrations for conventions
4. Find the controller endpoints that query users
5. Find the tests
6. Then propose a plan touching all the relevant files

In Cursor, you'd need to manually open each file or @-mention them. An agent explores on its own.

### It Runs Commands

This is the big one. An agent can:

```
Run your test suite         →  see what fails
Run linters                 →  fix the issues
Run database migrations     →  verify they work
Run build commands          →  catch compile errors
Run git commands            →  stage and commit
```

It closes the feedback loop that IDE tools leave open. Instead of "here's the code, go run it yourself," it's "here's the code, I already ran the tests, they pass."

**You approve every command** — it's not running wild. But the loop of write → test → fix → test is handled for you.

### It Works Across Files

IDE suggestions work great for single-file changes. But real tasks often span multiple files:

- Add a DB column → migration + model + controller + serializer + tests
- Fix an N+1 query → model scope + controller eager load + test verification
- New API endpoint → route + controller + service + serializer + tests + docs

An agent handles all of these in one pass, keeping everything consistent. No "I updated the model but forgot the serializer."

### It Has Memory (Per Session)

An agent remembers everything that happened in the session:

```
You: "Add the export feature"
Agent: [reads codebase, implements it]
You: "Actually, make it async with a background job"
Agent: [knows exactly what it just built, refactors it]
You: "Add rate limiting — max 5 exports per hour per user"
Agent: [still has full context, adds it in the right place]
```

In a sidebar chat, each question is often semi-independent. In an agent session, you're having a continuous conversation where context accumulates.

### CLAUDE.md — Project Context That Persists

The biggest difference from IDE chat: you can give the agent **permanent project knowledge** via a `CLAUDE.md` file at your project root.

```markdown
# my-project

E-commerce platform. React frontend, Rails API, PostgreSQL.

## Commands
bin/dev              # start dev server
bundle exec rspec    # run tests
bin/rails db:migrate # migrations

## Architecture
app/
├── controllers/   # API endpoints, inherit ApplicationController
├── models/        # ActiveRecord, validations here
├── services/      # Business logic, one public method per service
└── serializers/   # JSON via Blueprinter

## Conventions
- Service objects for anything beyond simple CRUD
- RSpec + FactoryBot for tests
- Never use .where without .limit in controllers
```

Every session reads this automatically. It's like onboarding a new engineer — except it happens in 2 seconds, every time.

**This replaces the constant @-mentioning** you do in Cursor to give the AI context. Write it once, every session benefits.

---

## 3. Working With an Agent — The Skills That Matter

### You Already Know How to Prompt

You've been using AI chat in your IDE. The prompting fundamentals are the same. What changes with agents is **scope and trust level.**

### The Key Difference: Plan Mode

In an IDE chat, AI generates code and you paste it. With an agent, there's a step in between:

```
You describe the task
        ↓
Agent explores the codebase (reads files, checks patterns)
        ↓
Agent proposes a PLAN — "Here's what I'll do and which files I'll change"
        ↓
You review the plan — approve, adjust, or reject
        ↓
Agent implements — edits files, runs tests
        ↓
You review the result
```

**Plan mode is the most important habit to build.** It prevents the "AI wrote 500 lines in the wrong direction" problem. For anything bigger than a one-file change, always ask for a plan first.

### Scoping: The Skill That Matters Most

With IDE autocomplete, scope doesn't matter much — you're getting line-by-line suggestions. With an agent, **how you scope the task determines the quality of the output.**

```
# Too broad — agent will produce mediocre results
"Build the user authentication system"

# Right scope — agent can nail this
"Add password reset: create the reset token migration,
the mailer, the controller endpoint, and the tests.
Follow the same pattern as email_confirmation_controller.rb"
```

The sweet spot: **one task that touches 3-8 files, with clear boundaries and a reference for the pattern to follow.**

### When to Use Agent vs. IDE Autocomplete

Not everything needs an agent. Use the right tool:

| Use IDE autocomplete/chat | Use an agent |
|---|---|
| Writing a function you already have in your head | Implementing a feature across multiple files |
| Quick inline refactors (rename, extract) | Large refactors that need consistency across files |
| Asking "what does this do?" while reading code | "How does auth work in this project?" (needs exploration) |
| Small, obvious fixes | Bug fix that requires tracing through multiple layers |
| Boilerplate in the current file | Boilerplate that spans files (migration + model + tests) |

**They're complementary, not competing.** I still use IDE autocomplete constantly. But when the task is bigger than one file, I switch to an agent session.

### Common Mistakes When Coming From IDE Chat

1. **Pasting code into the chat.** In Cursor you select code and ask about it. With an agent, just reference the file: "Look at `app/services/payment_service.rb` and add webhook handling." The agent will read it itself — more efficiently than pasting.

2. **Micromanaging.** In IDE chat, you guide step by step. With an agent, describe the outcome and let it figure out the path. "Add pagination to the users endpoint" is enough — you don't need to say "open the controller, find the index action, add the gem..."

3. **Not using plan mode.** With IDE chat, the cost of a bad suggestion is low — you just don't apply it. With an agent that edits files directly, a bad direction means undoing work. Always ask for a plan on non-trivial tasks.

4. **Trying to do everything in one session.** Break large features into 3-5 tasks. Do each as a separate session (or todo item). Each task should be reviewable in one pass.

5. **Not giving project context.** IDE tools see your open files. An agent sees the whole project but doesn't know your conventions unless you tell it (via CLAUDE.md or in the prompt).

---

## 4. How I Actually Work — The Full Flow

> This section shows what's possible after building up tooling over time.
> You don't need any of this to start — Section 5 covers how to begin.

### The Starting Point: A Jira Board

I run a command that shows me the sprint board with session status:

```
IN PROGRESS
  A. ✓ CSD-2576  Add authentication flow          ← ✓ = agent session running
  B. ✓ CSD-2580  Search improvements

TO DO
  C. - CSD-2590  Export feature                    ← - = no session yet
  D. - CSD-2592  Fix date picker

READY FOR REVIEW
  E. ✓ CSD-2570  User profile page
```

### Starting a New Ticket

When I pick ticket C (no session), the system automatically:

1. Creates a **git worktree** — isolated branch in its own directory
2. Allocates **unique ports** and creates a **database** — no conflicts with other sessions
3. Copies env files, project config, AI context from the main repo
4. Creates a **tmux session** pointed at the worktree
5. Starts **Claude Code** with the prompt: "Work on CSD-2590, the export feature"
6. Claude reads the **Jira ticket**, fetches requirements, and starts working

**30 seconds** from "pick a ticket" to "AI is implementing."

### The Dashboard — Managing Parallel Sessions

While Claude works on CSD-2590, I check my dashboard:

```
┌──────────────────────────────────────────────────┐
│  ★ 🌳 CSD-2576-auth          ⏳ Working    2m   │  writing code
│    🌳 CSD-2580-search        ⚡ Permission  5m   │  needs me to approve a command
│    🌳 CSD-2590-export        📋 Plan        0m   │  showing me its plan
│    🏪 store-manager           ⏳ Working    1m   │  personal project
│    🏠 hive                    ❓ Question   3m   │  asking me something
└──────────────────────────────────────────────────┘
```

I can see every session's status in real-time. I approve CSD-2580's permission without switching to it. Then I jump to CSD-2590 to review the plan.

This works because Claude Code has **hooks** — events that fire when Claude does things. My dashboard listens to those hooks and displays the status. Think of it like a CI dashboard, but for AI sessions.

### The Todo Loop — Autonomous Task Processing

For well-scoped work, I break a ticket into subtasks:

```
Todos for CSD-2590:
  1. Create the export service with CSV support
  2. Add the API endpoint for triggering exports
  3. Add background job for large exports
  4. Write tests
  5. Add error handling for malformed data
```

Claude picks up #1, shows me a plan, I approve, it implements, runs tests, commits. Then **automatically moves to #2.** I review each commit like a PR.

**The key insight**: I'm reviewing completed work from session A while sessions B and C are implementing, and session D just finished and is waiting for me. My job is **review, decide, direct** — not type.

### PR Review

When ticket E (ready for review) comes up, Claude:
1. Reads the Jira ticket requirements
2. Reads the PR diff
3. Cross-references: does the code implement what the ticket asked for?
4. Produces a checklist of what's covered and what's missing

This **front-loads the mechanical checking** so human review can focus on design and edge cases.

### The Layers

Everything I showed is built in layers over months:

```
Layer 5: Orchestration     Jira → pick ticket → session auto-created
Layer 4: Automation        Todo loop — agent processes tasks autonomously
Layer 3: Agents            Specialized sub-agents (Jira, PR, Notion...)
Layer 2: Dashboard         Real-time monitoring of all sessions
Layer 1: Claude Code       The foundation — agent + terminal + CLAUDE.md
─────────────────────────────────────────────────────────────────────────
         You start here ↑  Everything above is optional
```

**Layer 1 alone** — one agent session, one task, CLAUDE.md — is already a significant change from IDE-only AI. Everything else is optimization I built as I found friction points.

---

## 5. Bridging Over — From IDE AI to Agentic Workflows

### You Don't Have to Choose

This isn't "stop using Cursor." It's "add another tool to your workflow." I still use IDE autocomplete for quick in-file work. I use agent sessions for multi-file tasks.

Think of it as the difference between a screwdriver and a power drill. Both are useful. You just reach for the drill when you have 50 screws.

### Step 1: Install and Try (15 minutes)

```bash
npm install -g @anthropic-ai/claude-code
```

Start Claude in a project you know well:

```bash
cd your-project
claude
```

Try these — they show the difference from IDE chat immediately:

```
"Trace the complete request flow for POST /api/orders — from
the route definition through middleware, controller, service,
database, and back to the response. Show me the key files."
```
→ Agent reads the whole codebase, follows the chain. In IDE chat you'd need to manually open each file.

```
"This test is flaky: spec/models/order_spec.rb:45.
Read the test and the code it tests, figure out why it fails
intermittently, and fix it."
```
→ Agent reads, diagnoses, edits, runs the test to verify. In IDE chat you'd copy-paste the suggestion and run it yourself.

```
"Add a `status` enum to the Order model (pending, confirmed,
shipped, delivered). Add the migration, update the model with
validations, update the serializer, and write tests. Follow
existing patterns in the codebase."
```
→ Agent creates 4-5 files in one pass, all consistent. This is where agents start to shine vs. IDE chat.

### Step 2: Write a CLAUDE.md (30 minutes)

Create `CLAUDE.md` at your project root. Think of it as "onboarding docs for the AI":

- How to run things (dev server, tests, linter, build)
- Where things live (project structure)
- How you do things (conventions, patterns)
- What NOT to do (if there are common pitfalls)

Commit it. Now every team member benefits.

### Step 3: Do a Real Task

Pick something from your board:
- **Well-scoped** — one feature, not a rewrite
- **Has tests** — so you can verify the result
- **Not urgent** — low stakes if it takes longer the first time

Good first tasks:
- Write missing tests for an existing module
- Add a new field end-to-end (migration + model + API + tests)
- Fix a bug where you know the area
- Small, well-defined feature

**The workflow:**
1. Describe what you want
2. Ask for a plan first
3. Review the plan — does it make sense?
4. Approve → agent implements
5. Review the code like a PR
6. Have the agent run tests
7. Commit if it's good

### Step 4: Build the Habit

After a few successful tasks, you'll naturally start recognizing "this is a Cursor task" vs. "this is an agent task":

- Quick inline edit while reading code → stay in your IDE
- "Add validation to this field" → IDE chat is fine
- "Implement the export feature from the Jira ticket" → agent session
- "Why are these tests slow?" + fix them → agent session
- "Refactor all API responses to use the new format" → agent session

### Step 5: Explore Further

Once you're comfortable with single agent sessions:

| Feature | What it does | When to explore |
|---|---|---|
| **Permissions config** | Pre-approve safe commands (test, lint, git) | After clicking "yes" too many times |
| **Custom slash commands** | Reusable prompt templates | When you type the same instructions often |
| **Hooks** | Scripts triggered by agent events | When you want notifications or logging |
| **Multiple sessions** | Parallel work on different tasks | When you trust yourself to review agent output quickly |
| **MCP servers** | Connect agent to Notion, browser, Jira, etc. | When you need the agent to interact with external tools |

---

## Quick Reference

### Mental Model
```
IDE autocomplete:  You write  →  AI suggests  →  you accept
IDE chat:          You ask    →  AI responds   →  you apply
Agent:             You direct →  AI executes   →  you review
```

### Good Agent Prompts
```
"Add [feature]. Before writing code, show me a plan."
"Fix [bug]. Read the code first, then fix and run tests."
"Write tests for [module]. Follow existing test patterns."
"Refactor [X] to [Y pattern]. Only change what's needed."
"Trace how [feature] works across the codebase."
```

### Habits to Build
- **Plan first** — always ask for a plan on multi-file changes
- **One task per session** — start fresh for new work
- **Review everything** — treat agent output like a PR from a new team member
- **Scope tightly** — the more specific your prompt, the better the result
- **Let it run tests** — close the feedback loop inside the session
- **CLAUDE.md** — invest 30 minutes, save hours

---

## Appendix: Concepts Glossary

| Term | What it means |
|---|---|
| **Agentic AI** | AI that can read, write, and execute — not just suggest |
| **CLAUDE.md** | Project config file the agent reads automatically on startup |
| **Context window** | Agent's working memory. ~200k tokens. Gets compressed when full. |
| **Plan mode** | Agent shows a plan before implementing. You approve or reject. |
| **Permission** | Agent asks before running commands. You approve or deny. |
| **Hook** | Shell script triggered by agent events (start, stop, tool use) |
| **MCP server** | External tool the agent can use (Notion, browser, Jira, etc.) |
| **Agent (sub-agent)** | Specialized assistant the main agent delegates to |
| **Session** | A single agent conversation. One task per session. |
| **Slash command** | Custom reusable workflow triggered by `/command-name` |
