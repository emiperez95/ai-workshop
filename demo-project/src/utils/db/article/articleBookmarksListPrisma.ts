import { User } from "@prisma/client";
import prisma from "../prisma";

export default async function articleBookmarksListPrisma(currentUser: User) {
  const articles = await prisma.article.findMany({
    where: { bookmarkedBy: { some: { username: currentUser.username } } },
    orderBy: { updatedAt: "desc" },
    include: {
      tagList: true,
      author: {
        include: { followedBy: { where: { username: currentUser.username } } },
      },
      _count: { select: { favoritedBy: true } },
    },
  });
  return articles;
}
