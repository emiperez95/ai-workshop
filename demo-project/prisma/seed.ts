import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/hashPasswords";
import slugfy from "../src/utils/slugfy";

const prisma = new PrismaClient();
const force = process.argv.includes("--force");

async function main() {
  // Skip if already seeded (unless --force)
  const userCount = await prisma.user.count();
  if (userCount > 0 && !force) {
    console.log("Database already seeded. Use --force to re-seed.");
    return;
  }

  // Clear all data (order matters for FK constraints)
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  console.log("Cleared existing data.");

  // --- Users ---
  const password = hashPassword("password123");

  const jake = await prisma.user.create({
    data: {
      username: "jake",
      email: "jake@example.com",
      password,
      bio: "Tech blogger and open-source enthusiast. I write about programming, developer tools, and software architecture.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=jake",
    },
  });

  const sarah = await prisma.user.create({
    data: {
      username: "sarah",
      email: "sarah@example.com",
      password,
      bio: "Product thinker and design advocate. Writing about UX, product strategy, and how teams build great software.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    },
  });

  const mike = await prisma.user.create({
    data: {
      username: "mike",
      email: "mike@example.com",
      password,
      bio: "Backend engineer who loves databases, infrastructure, and making systems scale.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    },
  });

  const anna = await prisma.user.create({
    data: {
      username: "anna",
      email: "anna@example.com",
      password,
      bio: "Frontend developer passionate about React, CSS, and building delightful user interfaces.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=anna",
    },
  });

  await prisma.user.create({
    data: {
      username: "demo",
      email: "demo@example.com",
      password,
      bio: null,
      image: null,
    },
  });

  console.log("Created 5 users.");

  // --- Articles ---
  const articles = await Promise.all([
    prisma.article.create({
      data: {
        title: "Why TypeScript Is Worth the Learning Curve",
        slug: slugfy("Why TypeScript Is Worth the Learning Curve"),
        description: "A practical look at how TypeScript catches bugs before they reach production.",
        body: "I resisted TypeScript for years. JavaScript was fine, I told myself. Then I joined a team working on a large Express API and everything changed.\n\nThe first thing I noticed was autocomplete. Not just any autocomplete — context-aware suggestions that knew exactly what properties existed on my request objects. No more guessing, no more checking docs every five minutes.\n\nBut the real win was refactoring. When we renamed a field in our Prisma schema, TypeScript immediately flagged every file that referenced the old name. In plain JavaScript, those bugs would have shown up in production.\n\nThe learning curve is real. Generics feel alien at first, and sometimes you'll fight the type system more than your actual code. But after a month, you'll wonder how you ever shipped without it.",
        authorUsername: jake.username,
        tagList: {
          connectOrCreate: [
            { where: { tagName: "programming" }, create: { tagName: "programming" } },
            { where: { tagName: "typescript" }, create: { tagName: "typescript" } },
          ],
        },
      },
    }),
    prisma.article.create({
      data: {
        title: "Designing APIs That Developers Actually Enjoy",
        slug: slugfy("Designing APIs That Developers Actually Enjoy"),
        description: "Lessons from building APIs that people want to integrate with.",
        body: "Bad APIs are everywhere. You know the type — inconsistent naming, cryptic error codes, documentation that was last updated two years ago.\n\nAfter building and consuming dozens of APIs, here are the patterns that actually matter:\n\n**Consistency over cleverness.** Pick a naming convention and stick with it. If you use camelCase for one endpoint, don't switch to snake_case for another.\n\n**Errors should help, not hide.** Return specific error messages with actionable information. 'Validation failed' tells me nothing. 'Field email must be a valid email address' tells me exactly what to fix.\n\n**Pagination from day one.** Every list endpoint should be paginated. Your dataset is small now, but it won't be forever.\n\nThe best APIs feel invisible. You read the docs once, and everything just works the way you'd expect.",
        authorUsername: sarah.username,
        tagList: {
          connectOrCreate: [
            { where: { tagName: "design" }, create: { tagName: "design" } },
            { where: { tagName: "programming" }, create: { tagName: "programming" } },
          ],
        },
      },
    }),
    prisma.article.create({
      data: {
        title: "SQLite in Production: Yes, Really",
        slug: slugfy("SQLite in Production: Yes, Really"),
        description: "Why SQLite might be the right database for your next project.",
        body: "Every time I suggest SQLite for a new project, someone raises an eyebrow. 'But it's not a real database,' they say.\n\nLet me push back on that. SQLite handles millions of reads per second, supports transactions, and requires zero configuration. For read-heavy workloads — blogs, content sites, internal tools — it's often the best choice.\n\nThe limitations are real but specific: no concurrent writes from multiple processes, no built-in replication, no network access. If your app is a single-process server (like most Express apps), none of these matter.\n\nWe run SQLite in production for three internal services. Deployment is copying a single file. Backups are copying a single file. There's no database server to monitor, no connection pool to tune.\n\nStart simple. Migrate to Postgres when you actually need it, not when someone on Twitter tells you to.",
        authorUsername: mike.username,
        tagList: {
          connectOrCreate: [
            { where: { tagName: "databases" }, create: { tagName: "databases" } },
            { where: { tagName: "programming" }, create: { tagName: "programming" } },
          ],
        },
      },
    }),
    prisma.article.create({
      data: {
        title: "CSS Grid Changed How I Think About Layouts",
        slug: slugfy("CSS Grid Changed How I Think About Layouts"),
        description: "Moving from flexbox-everything to intentional grid layouts.",
        body: "I was a flexbox maximalist. Every layout was a flex container with justify-content and align-items. It worked, but my CSS was full of nested wrappers and magic numbers.\n\nCSS Grid changed that. Instead of thinking about content flow, I started thinking about the actual layout I wanted. Define the grid, place the items. No wrappers needed.\n\nThe mental model shift was the hardest part. With flexbox, you think in one dimension — row or column. With Grid, you think in two dimensions simultaneously. It felt awkward for a week, then everything clicked.\n\nMy favorite pattern is grid-template-areas. You literally draw your layout in ASCII art, and the browser makes it happen. It's the closest CSS gets to being fun.",
        authorUsername: anna.username,
        tagList: {
          connectOrCreate: [
            { where: { tagName: "frontend" }, create: { tagName: "frontend" } },
            { where: { tagName: "css" }, create: { tagName: "css" } },
          ],
        },
      },
    }),
    prisma.article.create({
      data: {
        title: "The Art of Writing Useful Pull Request Descriptions",
        slug: slugfy("The Art of Writing Useful Pull Request Descriptions"),
        description: "How better PR descriptions lead to faster reviews and fewer bugs.",
        body: "Your PR description is the first thing a reviewer sees. If it says 'fixed stuff' or is blank, you're already starting with friction.\n\nA good PR description answers three questions: What changed? Why did it change? How can I verify it works?\n\nThe 'what' is easy — a short summary of the changes. The 'why' is where most people fall short. Link to the issue, explain the user problem, describe why you chose this approach over alternatives.\n\nThe 'how to verify' is a gift to your reviewer. Step-by-step instructions to test the change. Include curl commands, screenshots, or test cases.\n\nI've seen review turnaround drop from days to hours just by writing better descriptions. Reviewers aren't avoiding your PR because they're lazy — they're avoiding it because they don't have enough context to review confidently.",
        authorUsername: jake.username,
        tagList: {
          connectOrCreate: [
            { where: { tagName: "career" }, create: { tagName: "career" } },
            { where: { tagName: "programming" }, create: { tagName: "programming" } },
          ],
        },
      },
    }),
    prisma.article.create({
      data: {
        title: "Why Your Team Needs a Design System (Even a Small One)",
        slug: slugfy("Why Your Team Needs a Design System (Even a Small One)"),
        description: "Starting small with shared components and tokens pays off fast.",
        body: "Design systems sound like something only big companies need. A component library, tokens, documentation — that's a full-time job, right?\n\nNot necessarily. Start with three things: a color palette, a spacing scale, and a button component. That's your design system. Ship it in a shared package and iterate.\n\nThe value isn't in having a beautiful Storybook. The value is in shared language. When a designer says 'use the primary action button,' every developer builds the same thing. When someone says 'add medium spacing,' everyone adds the same 16px.\n\nWe started our design system with 5 components and 12 tokens. A year later it has 40 components, and new features ship twice as fast because nobody is reinventing buttons.",
        authorUsername: sarah.username,
        tagList: {
          connectOrCreate: [
            { where: { tagName: "design" }, create: { tagName: "design" } },
            { where: { tagName: "frontend" }, create: { tagName: "frontend" } },
          ],
        },
      },
    }),
    prisma.article.create({
      data: {
        title: "Database Migrations Without the Downtime",
        slug: slugfy("Database Migrations Without the Downtime"),
        description: "Strategies for evolving your database schema safely in production.",
        body: "Deploying a migration that locks a table for 30 seconds feels fine in staging. In production, with 10,000 concurrent requests, it's a outage.\n\nThe key principle is: never mix destructive and additive changes in one deploy.\n\nAdding a column? Safe. Adding an index? Usually safe (use CONCURRENTLY in Postgres). Renaming a column? That's a three-step deploy: add new column, backfill data, remove old column.\n\nWe learned this the hard way when a 'simple' column rename took down our API for 45 seconds. The migration grabbed a table lock, and every in-flight query queued up behind it.\n\nNow we follow a strict rule: every migration must be backward-compatible. The old code must work with the new schema, and the new code must work with the old schema. This means more deploys, but zero downtime.",
        authorUsername: mike.username,
        tagList: {
          connectOrCreate: [
            { where: { tagName: "databases" }, create: { tagName: "databases" } },
            { where: { tagName: "career" }, create: { tagName: "career" } },
          ],
        },
      },
    }),
    prisma.article.create({
      data: {
        title: "React Server Components: A Practical Introduction",
        slug: slugfy("React Server Components: A Practical Introduction"),
        description: "What RSC actually changes about how we build React apps.",
        body: "React Server Components aren't just 'React on the server.' They fundamentally change how you think about where code runs.\n\nThe mental model: some components only need to render once, on the server. They fetch data, format it, and send HTML. No JavaScript bundle, no hydration, no loading states.\n\nOther components need interactivity — forms, toggles, animations. These are Client Components, and they work exactly like React always has.\n\nThe practical impact is smaller bundles and faster page loads. That server component that fetches and renders a list of articles? Zero KB of client JavaScript. The 'like' button below each article? That's a small client component.\n\nThe hardest part is deciding where to draw the line. My rule of thumb: start everything as a Server Component, add 'use client' only when you need useState, useEffect, or event handlers.",
        authorUsername: anna.username,
        tagList: {
          connectOrCreate: [
            { where: { tagName: "frontend" }, create: { tagName: "frontend" } },
            { where: { tagName: "programming" }, create: { tagName: "programming" } },
          ],
        },
      },
    }),
    prisma.article.create({
      data: {
        title: "How I Approach Debugging Production Issues",
        slug: slugfy("How I Approach Debugging Production Issues"),
        description: "A systematic framework for finding and fixing bugs under pressure.",
        body: "It's 2 AM, your pager goes off, and the dashboard is red. What do you do first?\n\nNot fix it. First, you assess. Is the system fully down or degraded? Are users affected? Is it getting worse? These answers determine your urgency and approach.\n\nNext, gather signals. Check the logs around the time the alerts started. Look for error spikes, latency changes, or deployment events. 90% of production issues are caused by something that changed in the last hour.\n\nNow form a hypothesis. 'The deploy at 1:45 AM introduced a query that's not using an index.' Test it — check slow query logs, look at the query plan, compare with the previous version.\n\nThe biggest mistake I see is skipping straight to fixing. Engineers will roll back a deploy before understanding what broke. Sometimes that's necessary, but you lose the chance to learn. Understand first, fix second, prevent third.",
        authorUsername: jake.username,
        tagList: {
          connectOrCreate: [
            { where: { tagName: "career" }, create: { tagName: "career" } },
            { where: { tagName: "databases" }, create: { tagName: "databases" } },
          ],
        },
      },
    }),
    prisma.article.create({
      data: {
        title: "Building Accessible Forms That Don't Suck",
        slug: slugfy("Building Accessible Forms That Don't Suck"),
        description: "Practical accessibility patterns for web forms that benefit everyone.",
        body: "Accessibility isn't a feature you add later. It's a quality of the code you write from the start.\n\nForms are where most apps fail at accessibility. Missing labels, no error announcements, tab order that jumps randomly around the page.\n\nThe basics take five minutes: every input needs a label (not placeholder text — a real label), errors should be associated with their fields via aria-describedby, and the submit button should be reachable by keyboard.\n\nBut good accessible forms go further. Use aria-live regions to announce validation errors as they appear. Group related fields with fieldset and legend. Make sure error messages explain how to fix the problem, not just that something is wrong.\n\nThe best part? Accessible forms are better for everyone. Clear labels, helpful errors, and logical tab order make your form easier to use for every single person.",
        authorUsername: anna.username,
        tagList: {
          connectOrCreate: [
            { where: { tagName: "frontend" }, create: { tagName: "frontend" } },
            { where: { tagName: "design" }, create: { tagName: "design" } },
          ],
        },
      },
    }),
  ]);

  console.log(`Created ${articles.length} articles.`);

  // --- Comments ---
  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        body: "Great breakdown. I had the same experience — TypeScript felt slow at first but now I can't go back to plain JS.",
        authorUsername: sarah.username,
        articleSlug: articles[0].slug,
      },
    }),
    prisma.comment.create({
      data: {
        body: "The refactoring argument is what convinced my team. We caught three bugs just from the initial migration.",
        authorUsername: mike.username,
        articleSlug: articles[0].slug,
      },
    }),
    prisma.comment.create({
      data: {
        body: "Consistency over cleverness — that should be on a poster. I've worked with too many 'clever' APIs.",
        authorUsername: jake.username,
        articleSlug: articles[1].slug,
      },
    }),
    prisma.comment.create({
      data: {
        body: "The pagination point is crucial. We had to retrofit pagination on 15 endpoints and it was painful.",
        authorUsername: anna.username,
        articleSlug: articles[1].slug,
      },
    }),
    prisma.comment.create({
      data: {
        body: "We use SQLite for our CI test suite and it's blazing fast. Never considered it for production though — might give it a shot.",
        authorUsername: jake.username,
        articleSlug: articles[2].slug,
      },
    }),
    prisma.comment.create({
      data: {
        body: "Bold take! What's your strategy for when you do need to migrate to Postgres eventually?",
        authorUsername: sarah.username,
        articleSlug: articles[2].slug,
      },
    }),
    prisma.comment.create({
      data: {
        body: "grid-template-areas is so underrated. It makes responsive layouts trivial with media queries.",
        authorUsername: jake.username,
        articleSlug: articles[3].slug,
      },
    }),
    prisma.comment.create({
      data: {
        body: "I adopted the three-question format for my PRs and review time dropped significantly. Thanks for this.",
        authorUsername: anna.username,
        articleSlug: articles[4].slug,
      },
    }),
    prisma.comment.create({
      data: {
        body: "The 'start small' advice is spot on. Our first design system attempt failed because we tried to build everything at once.",
        authorUsername: mike.username,
        articleSlug: articles[5].slug,
      },
    }),
    prisma.comment.create({
      data: {
        body: "That three-step migration pattern saved us last quarter. Always separate additive from destructive changes.",
        authorUsername: jake.username,
        articleSlug: articles[6].slug,
      },
    }),
    prisma.comment.create({
      data: {
        body: "Really clear explanation of the server vs client component split. The rule of thumb at the end is perfect.",
        authorUsername: sarah.username,
        articleSlug: articles[7].slug,
      },
    }),
    prisma.comment.create({
      data: {
        body: "The 'understand first, fix second, prevent third' framework is going on my team's incident response doc.",
        authorUsername: mike.username,
        articleSlug: articles[8].slug,
      },
    }),
    prisma.comment.create({
      data: {
        body: "Needed this. I always forget about aria-describedby for error messages. Bookmarked.",
        authorUsername: sarah.username,
        articleSlug: articles[9].slug,
      },
    }),
  ]);

  console.log(`Created ${comments.length} comments.`);

  // --- Follows ---
  await prisma.user.update({
    where: { username: "jake" },
    data: { follows: { connect: [{ username: "sarah" }, { username: "mike" }] } },
  });
  await prisma.user.update({
    where: { username: "sarah" },
    data: { follows: { connect: [{ username: "jake" }] } },
  });
  await prisma.user.update({
    where: { username: "mike" },
    data: { follows: { connect: [{ username: "jake" }, { username: "anna" }] } },
  });
  await prisma.user.update({
    where: { username: "anna" },
    data: { follows: { connect: [{ username: "sarah" }, { username: "jake" }] } },
  });

  console.log("Created follow relationships.");

  // --- Favorites ---
  await prisma.user.update({
    where: { username: "jake" },
    data: { favorites: { connect: [{ slug: articles[1].slug }, { slug: articles[2].slug }, { slug: articles[3].slug }] } },
  });
  await prisma.user.update({
    where: { username: "sarah" },
    data: { favorites: { connect: [{ slug: articles[0].slug }, { slug: articles[6].slug }, { slug: articles[9].slug }] } },
  });
  await prisma.user.update({
    where: { username: "mike" },
    data: { favorites: { connect: [{ slug: articles[0].slug }, { slug: articles[4].slug }, { slug: articles[7].slug }] } },
  });
  await prisma.user.update({
    where: { username: "anna" },
    data: { favorites: { connect: [{ slug: articles[1].slug }, { slug: articles[5].slug }, { slug: articles[8].slug }] } },
  });

  console.log("Created favorite relationships.");

  console.log("\nSeed complete! Summary:");
  console.log("  - 5 users (jake, sarah, mike, anna, demo)");
  console.log(`  - ${articles.length} articles with tags`);
  console.log(`  - ${comments.length} comments`);
  console.log("  - Follow and favorite relationships");
  console.log("\nAll passwords: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
