import prisma from "../prisma";

export default async function bookmarkCreatePrisma(
  username: string,
  slug: string
) {
  return prisma.bookmark.create({
    data: { username, articleSlug: slug },
  });
}
