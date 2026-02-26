import { User } from "@prisma/client";
import prisma from "../prisma";

export default async function articleUnBookmarkPrisma(
  currentUser: User,
  slug: string
) {
  await prisma.bookmark.deleteMany({
    where: { username: currentUser.username, articleSlug: slug },
  });

  const article = await prisma.article.findUnique({
    where: { slug },
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
