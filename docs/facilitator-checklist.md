# Facilitator Checklist

Quick reference for running the workshop. For full details see `docs/notes.md`.

---

## Before the Workshop

- [ ] GitHub issue #1 exists and is visible
- [ ] Notion page "Bookmarks Feature — Technical Notes" is accessible
- [ ] `docs/board-status.md` backup ready to drop in if someone gets stuck
- [ ] Tested full pipeline end-to-end with Claude Code
- [ ] Verified the issue produces an imperfect first plan (ambiguity works)
- [ ] Ceiling demo ready (CLAUDE.md examples, hooks, agents, parallel sessions)

## Day Of — Pre-Start

- [ ] Confirm everyone ran `bash scripts/check-setup.sh` and all checks pass
- [ ] Have the notes.md open for reference

---

## Part 1: Framing + Orientation (15 min)

### Framing (5 min)
- [ ] Explain the difference: "It can execute — not just suggest"
- [ ] Set expectations: "One GitHub issue, start to finish"

### Orientation (10 min)
- [ ] Everyone runs `cd demo-project && claude`
- [ ] Everyone runs `/init` — glance at the generated CLAUDE.md
- [ ] Quick explanation: natural language in, actions out, permission prompts
- [ ] Start the server: `npm run develop`
- [ ] Verify it works: `curl http://localhost:3000/api/articles`
- [ ] "Keep the server running"

## Part 2: Build a Command (15 min)

- [ ] Instruct: "Create `/board-status` — file at `.claude/commands/board-status.md`, shows open issues grouped by label, uses `gh`"
- [ ] They test with `/board-status` and spot issue #1
- [ ] If stuck after 10 min → drop in `docs/board-status.md` backup
- [ ] After it works: `/clear` → `Ctrl+C` twice → `claude -c`

## Part 3: Work the Issue (60-70 min)

### Step 1: Fetch the issue (~5 min)
- [ ] "Ask Claude to look at issue #1"
- [ ] They read the requirements — AC, PO notes, ambiguities

### Step 2: Fetch the design doc (~5 min)
- [ ] "Ask Claude to fetch 'Bookmarks Feature — Technical Notes' from Notion"
- [ ] Ask: "How does the design doc compare to the issue?"
- [ ] Guide to the tension: "similar to favorites" vs. "dedicated model"

### Step 3: Plan the implementation (~15 min)
- [ ] "Ask Claude to plan the implementation. Read the plan carefully."
- [ ] **Don't let them skip this.** Walk around and check.
- [ ] Ask one at a time:
  - "What data model did Claude pick?" → should be dedicated model per Notion doc
  - "Did it include bookmark count?" → PO unsure, doc says skip for v1
  - "What endpoints did it propose?" → doc says action under resource, filter on existing list
  - "Did it over-engineer anything?" → folders/collections are out of scope
- [ ] After architecture settles: "Also plan the test cases — TDD, tests first"
- [ ] Review test cases:
  - "Do they cover edge cases? Already bookmarked? Unauthorized? Non-existent article?"
- [ ] Encourage pushback: "This back-and-forth is the real skill"

### Step 4: Implement (~15-20 min)
- [ ] "Approve the plan and let Claude implement"
- [ ] They watch the TDD cycle: tests fail → implementation → tests pass
- [ ] If something looks wrong, they can course-correct mid-build
- [ ] Run all tests — originals + new should pass

### Step 5: Test the feature (~5 min)
- [ ] "Start the server if not running, try the endpoints"
- [ ] Test manually with curl: bookmark, list, unbookmark
- [ ] Nudge if they skip: "Tests pass, but have you actually hit the API?"

### Step 6: Ship to a PR (~5 min)
- [ ] "Ask Claude to commit and create a PR on a feature branch"
- [ ] Claude handles git natively — no plugin needed

### Step 7: Review the PR (~10 min)
- [ ] `/clear` → `Ctrl+C` twice → `claude` (fresh session)
- [ ] Install: `/plugin install code-review@claude-plugins-official`
- [ ] Run the review against the PR
- [ ] Fix any action items
- [ ] "This is how real reviews work — fresh eyes, separate context"

## Part 4: The Ceiling (10 min)

- [ ] Show a real project's CLAUDE.md
- [ ] Show hooks config (auto-format, auto-lint)
- [ ] Mention full agent suite (8 agents)
- [ ] Mention parallel sessions / worktrees
- [ ] Keep it to 10 min — "There's more depth if you keep using it"

## Part 5: Debrief + Q&A (10 min)

- [ ] "What surprised you? What frustrated you?"
- [ ] Let discussion flow — don't lecture
- [ ] Land key points if they don't come up:
  - Context matters (issue + Notion doc = better result)
  - Steering is the skill (propose → evaluate → redirect)
  - It's a workflow, not a trick
- [ ] Close: "Try it on real work this week"

---

## Tips to Drop Throughout

Use these whenever relevant — no specific timing:

| Tip | When to mention |
|-----|-----------------|
| `Esc` twice → history/rollback | When they make a mistake or want to undo |
| `/context` → see loaded context | When they ask "what does Claude know?" |
| `/model` → switch models | When something is slow or too simple for Opus |
| `/permissions` → debug permissions | When permission prompts are confusing |
| Hooks for auto-allow | When permission prompts slow them down |
| `/clear` → clean context | When switching tasks |
| `/rename` → name the session | When they have multiple sessions |
| `claude -c` vs `claude -r` | When resuming work (-c keeps context, -r fresh start) |
| `--dangerously-skip-permissions` | For advanced users wanting full automation |
