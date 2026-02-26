import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: { db: { url: `file:${path.join(__dirname, "dev.db")}` } },
});

async function main() {
  const users = await prisma.user.findMany({
    select: {
      username: true,
      _count: {
        select: {
          authored: true,
          favorites: true,
          comment: true,
          bookmarks: true,
        },
      },
    },
  });
  const articles = await prisma.article.findMany({
    select: {
      title: true,
      authorUsername: true,
      _count: { select: { favoritedBy: true, comments: true } },
      tagList: { select: { tagName: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  const tags = await prisma.tag.findMany({ select: { tagName: true } });
  const bookmarkCount = await prisma.bookmark.count();

  console.log("=== Database Status ===\n");

  // Users
  console.log(`Users (${users.length}):`);
  for (const u of users) {
    const parts = [
      `${u._count.authored} articles`,
      `${u._count.favorites} favorites`,
      `${u._count.comment} comments`,
      `${u._count.bookmarks} bookmarks`,
    ];
    console.log(`  @${u.username.padEnd(8)} ${parts.join(", ")}`);
  }

  // Articles
  console.log(`\nArticles (${articles.length}):`);
  for (const a of articles) {
    const tags = a.tagList.map((t) => t.tagName).join(", ");
    console.log(`  "${a.title}"`);
    console.log(
      `    by @${a.authorUsername} | ${a._count.favoritedBy} favs, ${a._count.comments} comments | [${tags}]`
    );
  }

  // Tags
  console.log(
    `\nTags (${tags.length}): ${tags.map((t) => t.tagName).join(", ")}`
  );

  // Bookmarks
  console.log(
    `\nBookmarks: ${
      bookmarkCount > 0
        ? `${bookmarkCount} total`
        : "none yet — try bookmarking an article!"
    }`
  );

  console.log("");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
