# Jira Ticket: AW-1

**Project:** AW
**Type:** Story
**Priority:** Medium
**Sprint:** Workshop Sprint

---

## Add bookmarks feature

### Description

Users want to save articles for later. Right now they can only favorite articles but that's more of a "like" — we need a separate bookmark/save feature so users can keep a reading list.

Should work similar to favorites but be independent. A user can favorite AND bookmark the same article.

### Acceptance Criteria

- Users can bookmark and unbookmark articles
- There should be a way to get a user's bookmarked articles
- Article responses should indicate bookmark status
- Bookmarking requires authentication

### References

- [Bookmarks Feature — Technical Notes](notion-link-placeholder)

### Notes from PO

- We discussed showing bookmark count on articles too but not sure if we need that for v1. Up to you.
- Sarah mentioned she wants to be able to organize bookmarks into folders/collections at some point, keep that in mind
- The mobile team asked if we can add a `bookmarkedAt` timestamp so they can sort by "recently saved"
