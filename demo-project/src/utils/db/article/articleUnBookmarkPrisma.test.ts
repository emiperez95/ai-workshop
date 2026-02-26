import prismaMock from "../../test/prismaMock";
import articleUnBookmarkPrisma from "./articleUnBookmarkPrisma";

const mockUser = {
  username: "test-user",
  email: "test@example.com",
  password: "hashed",
  bio: null,
  image: null,
};

const mockArticle = {
  slug: "test-slug",
  title: "Test Article",
  description: "desc",
  body: "body",
  tagList: [],
  author: { ...mockUser, followedBy: [] },
  authorUsername: "test-user",
  createdAt: new Date(),
  updatedAt: new Date(),
  _count: { favoritedBy: 0 },
};

describe("articleUnBookmarkPrisma", () => {
  test("Deletes a bookmark and returns the article", async () => {
    prismaMock.bookmark.delete.mockResolvedValueOnce({
      id: 1,
      username: "test-user",
      slug: "test-slug",
      bookmarkedAt: new Date(),
    });
    prismaMock.article.findUnique.mockResolvedValueOnce(mockArticle as any);

    const result = await articleUnBookmarkPrisma(mockUser as any, "test-slug");

    expect(prismaMock.bookmark.delete).toHaveBeenCalledWith({
      where: { username_slug: { username: "test-user", slug: "test-slug" } },
    });
    expect(prismaMock.article.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { slug: "test-slug" } })
    );
    expect(result).toEqual(mockArticle);
  });

  test("Returns null when article does not exist after deletion", async () => {
    prismaMock.bookmark.delete.mockResolvedValueOnce({
      id: 1,
      username: "test-user",
      slug: "test-slug",
      bookmarkedAt: new Date(),
    });
    prismaMock.article.findUnique.mockResolvedValueOnce(null);

    const result = await articleUnBookmarkPrisma(mockUser as any, "test-slug");

    expect(result).toBeNull();
  });
});
