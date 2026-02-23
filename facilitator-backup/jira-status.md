---
description: Show the Jira board with tickets grouped by status
argument-hint: [PROJECT_KEY]
allowed-tools: Bash
---

Show the current Jira board for project `$1`.

Run this command to get all tickets in the current sprint:

```bash
acli jira workitem search --jql "project = $1 AND sprint in openSprints() ORDER BY status ASC, priority DESC" --fields key,summary,status,assignee,priority --json
```

Parse the JSON output and display the tickets grouped by status column (e.g., "To Do", "In Progress", "In Review", "Done").

Format each ticket as:
```
[KEY] Title (Assignee)
```

If no project key is provided, tell the user to run `/jira-status PROJECT_KEY`.
