import { User } from "@prisma/client";
import prisma from "../prisma";

export default async function articleUnBookmarkPrisma(
  currentUser: User,
  slug: string
) {
  const article = await prisma.article.update({
    where: { slug },
    data: {
      bookmarkedBy: {
        delete: {
          username_articleSlug: {
            username: currentUser.username,
            articleSlug: slug,
          },
        },
      },
    },
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
