import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { username: true, _count: { select: { authored: true, favorites: true, comment: true } } },
  });
  const articles = await prisma.article.findMany({
    select: { title: true, authorUsername: true, _count: { select: { favoritedBy: true, comments: true } }, tagList: { select: { tagName: true } } },
    orderBy: { createdAt: "desc" },
  });
  const tags = await prisma.tag.findMany({ select: { tagName: true } });

  console.log("=== Database Status ===\n");

  // Users
  console.log(`Users (${users.length}):`);
  for (const u of users) {
    const parts = [`${u._count.authored} articles`, `${u._count.favorites} favorites`, `${u._count.comment} comments`];
    console.log(`  @${u.username.padEnd(8)} ${parts.join(", ")}`);
  }

  // Articles
  console.log(`\nArticles (${articles.length}):`);
  for (const a of articles) {
    const tags = a.tagList.map((t) => t.tagName).join(", ");
    console.log(`  "${a.title}"`);
    console.log(`    by @${a.authorUsername} | ${a._count.favoritedBy} favs, ${a._count.comments} comments | [${tags}]`);
  }

  // Tags
  console.log(`\nTags (${tags.length}): ${tags.map((t) => t.tagName).join(", ")}`);

  // Bookmarks — detect if table exists (participants add this during the workshop)
  try {
    const tables: { name: string }[] = await prisma.$queryRawUnsafe(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='Bookmark'`
    );
    if (tables.length > 0) {
      const rows: { count: bigint }[] = await prisma.$queryRawUnsafe(
        `SELECT COUNT(*) as count FROM Bookmark`
      );
      const count = Number(rows[0].count);
      console.log(`\nBookmarks: ${count > 0 ? `${count} total` : "table exists, none yet — try bookmarking an article!"}`);
    }
  } catch {
    // Bookmark table doesn't exist yet — that's fine
  }

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
