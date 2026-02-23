# Notion Page: Bookmarks Feature — Technical Notes

**Page location:** Engineering > Features > Bookmarks
**Linked from:** WORK-42

---

## Bookmarks Feature — Technical Notes

### Context

From the product sync on Feb 10. Sarah wants a "save for later" feature separate from favorites. Favorites are public (other users can see what you liked), bookmarks should be private — only visible to the user who saved them.

### Data model decision

We talked about two approaches:

1. Many-to-many relation on User/Article, same as favorites
2. Dedicated Bookmark model with its own fields

Going with **option 2 — dedicated model**. Reasons:
- We'll want `bookmarkedAt` for sorting (mobile team needs this)
- Collections/folders are on the roadmap for Q3, a dedicated model makes that migration much simpler — we'd just add a nullable `collectionId` foreign key later
- Keeps bookmark logic decoupled from the favorites system

### Endpoint conventions

Reminder for whoever picks this up — we follow the existing patterns in the codebase:
- Action endpoints go under the resource: `/api/articles/:slug/bookmark` (POST to add, DELETE to remove)
- Listing bookmarked articles should use the existing articles list endpoint with a filter param, not a new top-level route
- Response format should extend the existing article response, don't create a new shape

### Open questions

- Do we want a `GET /api/articles/:slug/bookmark` to check bookmark status, or is including it in the article response enough? Leaning toward just the article response.
- Bookmark count on articles: product hasn't decided. Skip for v1, we can add it later without schema changes since it's just a count query.

### Out of scope for this ticket

- Collections/folders (Q3)
- Bookmark notes/annotations
- Sharing bookmarks
