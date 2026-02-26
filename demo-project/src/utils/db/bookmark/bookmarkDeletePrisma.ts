import prisma from "../prisma";

export default async function bookmarkDeletePrisma(
  username: string,
  slug: string
) {
  try {
    return await prisma.bookmark.delete({
      where: {
        username_articleSlug: { username, articleSlug: slug },
      },
    });
  } catch (error: any) {
    if (error?.code === "P2025") return null;
    throw error;
  }
}
