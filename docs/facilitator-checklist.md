# Facilitator Checklist

Quick reference for running the workshop. For full details see `facilitator-prompt.md`.

---

## Before the Workshop

- [ ] GitHub issue #1 exists and is visible
- [ ] Notion page "Bookmarks Feature — Technical Notes" is accessible
- [ ] `docs/board-status.md` backup ready to drop in if someone gets stuck
- [ ] Tested full pipeline end-to-end with Claude Code
- [ ] Verified the issue produces an imperfect first plan (ambiguity works)
- [ ] Ceiling demo ready (CLAUDE.md examples, hooks, agents, parallel sessions)

## Day Of — Pre-Start

- [ ] Confirm everyone ran `bash check-setup.sh` and all checks pass
- [ ] Have the facilitator-prompt.md open for reference

---

## Step 0: Setup (10 min)

- [ ] Clone repo: `git clone https://github.com/emiperez95/ai-workshop.git`
- [ ] Run: `bash check-setup.sh` — all checks should pass
- [ ] Troubleshoot any failures using the script's fix hints

## Step 1: Orientation (10 min)

- [ ] Everyone runs `cd demo-project && claude`
- [ ] Everyone runs `/init` — glance at the generated CLAUDE.md
- [ ] Add convention to CLAUDE.md: "When adding features, update `prisma/seed.ts` with sample data and `prisma/check.ts` to display the new data"
- [ ] Quick explanation: natural language in, actions out, permission prompts
- [ ] Start the server: `npm run develop`
- [ ] Check the database: `npm run db:check` — 5 users, 10 articles, tags
- [ ] Verify the API: `curl http://localhost:3000/api/articles`
- [ ] "Keep the server running"

## Step 2: Build a Command (15 min)

- [ ] Instruct: "Create `/board-status` — file at `.claude/commands/board-status.md`, shows open issues grouped by label, uses `gh`"
- [ ] Restart Claude Code for new command: `Ctrl+C` twice → `claude -c`
- [ ] They test with `/board-status` and spot issue #1
- [ ] If stuck after 10 min → drop in `docs/board-status.md` backup
- [ ] After it works: `/clear` to clean context

## Step 3: Gather Context & Plan (20 min)

- [ ] "Ask Claude to look at issue #1, fetch the linked Notion design doc, and plan the implementation"
- [ ] Watch agents work: Atlas fetches issue, Minerva fetches Notion doc, Claude plans
- [ ] Key word is "plan" — triggers plan mode. `Shift+Tab` also toggles it. If Claude starts coding, press Escape.
- [ ] **Don't let them skip the plan review.** Walk around and check.
- [ ] Tell them what to check for:
  - Data model → should be dedicated Bookmark model per Notion doc, not many-to-many
  - Bookmark count → PO unsure, doc says skip for v1
  - Endpoints → action under resource (`POST/DELETE /api/articles/:slug/bookmark`), filter on existing list
  - Scope creep → folders/collections are out of scope
- [ ] After architecture settles: "Also plan the test cases — TDD, tests first"
- [ ] Point out edge cases: already bookmarked? unauthorized? non-existent article?
- [ ] Encourage pushback: "This back-and-forth is the real skill"

## Step 4: Implement (15-20 min)

- [ ] "Approve the plan and let Claude implement"
- [ ] They watch the TDD cycle: tests fail → implementation → tests pass
- [ ] If something looks wrong, they can course-correct mid-build
- [ ] Run all tests — originals + new should pass

## Step 5: Test the Feature (5 min)

- [ ] "Start the server if not running (`npm run develop`), try the endpoints"
- [ ] Log in as a seed user (e.g. `jake`, password `password123`)
- [ ] Test manually with curl: bookmark, list bookmarks, unbookmark
- [ ] Run `npm run db:check` — should now show bookmark count
- [ ] Nudge if they skip: "Tests pass, but have you actually hit the API?"

## Step 6: Ship to a PR (5 min)

- [ ] "Ask Claude to commit and create a PR on a feature branch"
- [ ] Claude handles git natively — no plugin needed

## Step 7: Review the PR (10 min)

- [ ] `Ctrl+C` twice → `claude` (fresh session, NOT `claude -c`)
- [ ] Install: `/plugin install pr-review-toolkit@claude-plugins-official`
- [ ] Run: `/review-pr`
- [ ] Results are presented locally — nothing posted to GitHub
- [ ] Fix any action items with Claude's help
- [ ] "This is how real reviews work — fresh eyes, separate context"

## Step 8: Reflect (5 min)

- [ ] Wrap up with takeaways:
  - Context matters (issue + Notion doc = better result)
  - Steering is the skill (propose → evaluate → redirect)
  - It's a workflow, not a trick
- [ ] Mention what's beyond: CLAUDE.md refinement, hooks, custom agents, parallel sessions
- [ ] Close: "Try it on real work this week"

---

## Tips to Drop Naturally

Use these whenever the moment feels right — don't dump them all at once:

| Tip | When to mention |
| --- | --- |
| `!` prefix runs bash directly | When they want a quick command without Claude interpreting it |
| `Shift+Tab` toggles plan mode | Before asking Claude to do something they want to review first |
| `Escape` interrupts Claude | When Claude starts doing something they didn't intend |
| `/allowed-tools` pre-approves tools | When permission prompts slow them down |
| `/clear` resets context | When switching between unrelated tasks |
| `Ctrl+C` twice → `claude -c` | When they need to restart to pick up new commands |
