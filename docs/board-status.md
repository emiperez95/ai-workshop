---
description: Show GitHub issues grouped by label/state
argument-hint: [OWNER/REPO]
allowed-tools: Bash
---

Show the current issues for repository `$1`.

Run this command to get all open issues:

```bash
gh issue list --repo $1 --state open --json number,title,state,labels,assignees --limit 50
```

Parse the JSON output and display the issues grouped by label (e.g., "enhancement", "bug", "documentation"). Issues without labels go under "Unlabeled".

Format each issue as:

```
#[NUMBER] Title (Assignee)
```

If no repo is provided, try using the current repo with `gh issue list`.
