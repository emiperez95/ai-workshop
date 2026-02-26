# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# First-time setup (push schema + seed DB)
npm run setup

# Start development server (with file watching)
npm run develop

# Run all tests
npm test

# Run a single test file
dotenv -e .env.development -- jest -i src/path/to/file.test.ts

# Run tests in watch mode
npm run test:watch

# Check DB contents
npm run db:check

# Push schema changes to DB
npm run migrate:develop

# Lint
npm run lint
```

Environment variables are loaded from `.env.development` (SQLite DB path + JWT secret). The `dotenv-cli` prefix is required for any command that touches Prisma or tests.

## Architecture

This is a [RealWorld](https://github.com/gothinkster/realworld) spec backend — a Medium-like blog API with users, articles, comments, tags, follows, and favorites.

### Request flow

```
Route → Auth middleware → Validator middleware → Controller → Prisma util → DB
                                                           ↓
                                                        View (shapes response)
```

- **`src/routes/api/`** — Express routers, one file per resource (`users`, `user`, `profiles`, `articles`, `tags`)
- **`src/middleware/auth/authenticator.ts`** — `authenticate` (required JWT) and `optionalAuthenticate` (optional JWT) via `express-jwt`. Token goes in `Authorization: Token <jwt>` header. Decoded payload available as `req.auth.user`.
- **`src/middleware/*Validator/`** — Input validation middleware; invalid requests get a 422 response before hitting the controller.
- **`src/controllers/*Controller/`** — Thin orchestration layer: calls Prisma utils, shapes responses via viewers, delegates errors to `next()`.
- **`src/utils/db/`** — One function per DB operation, organized by entity (`article/`, `user/`, `comment/`, `tag/`). Each function wraps a Prisma query and returns a typed result.
- **`src/view/`** — Pure functions that shape Prisma results into API response objects (`articleViewer`, `commentViewer`, `profileViewer`, `userViewer`, `tagViewer`).
- **`src/middleware/errorHandling/`** — Chained error handlers for auth errors, Prisma errors, and general errors.

### Prisma / Data model

Schema is in `prisma/schema.prisma`. Key relationships:
- `User` ↔ `User` (self-join for follows)
- `User` ↔ `Article` (authored, favorites)
- `Article` ↔ `Tag` (many-to-many)
- `Article` ↔ `Comment`

Prisma client singleton is at `src/utils/db/prisma.ts`.

### Testing

All tests are unit tests — Prisma is fully mocked via `jest-mock-extended`. Import `prismaMock` from `src/utils/test/prismaMock.ts` in test files; it auto-resets before each test. Controllers mock their Prisma util dependencies directly with `jest.mock(...)`. There are no integration or end-to-end tests in the test suite (a Postman collection exists at `src/test/postman/` for manual API testing).

### Adding a new feature (e.g., bookmarks)

Typical pattern:
1. Add model/relation to `prisma/schema.prisma`, run `npm run migrate:develop`
2. Add Prisma util functions in `src/utils/db/<entity>/`
3. Add controller(s) in `src/controllers/<entity>Controller/`
4. Wire up route in `src/routes/api/<resource>.ts`
5. Add viewer update if the response shape changes
6. Add unit tests co-located with the controller/middleware file

When adding a new Prisma model, also update:
- **`prisma/seed.ts`** — add a `deleteMany` in the clear block (respecting FK order) and a seed block with representative data
- **`prisma/check.ts`** — add the model to the `db:check` output so it shows up in `npm run db:check`
