import { User } from "@prisma/client";
import prisma from "../prisma";

export default async function articleBookmarkPrisma(
  currentUser: User,
  slug: string
) {
  const article = await prisma.article.update({
    where: { slug },
    data: { bookmarkedBy: { create: { username: currentUser.username } } },
    include: {
      tagList: true,
      author: {
        include: { followedBy: { where: { username: currentUser.username } } },
      },
      _count: { select: { favoritedBy: true } },
    },
  });
  return article;
}
