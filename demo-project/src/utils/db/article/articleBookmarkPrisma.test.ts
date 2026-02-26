import prismaMock from "../../test/prismaMock";
import articleBookmarkPrisma from "./articleBookmarkPrisma";

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

describe("articleBookmarkPrisma", () => {
  test("Creates a bookmark and returns the article", async () => {
    prismaMock.bookmark.create.mockResolvedValueOnce({
      id: 1,
      username: "test-user",
      slug: "test-slug",
      bookmarkedAt: new Date(),
    });
    prismaMock.article.findUnique.mockResolvedValueOnce(mockArticle as any);

    const result = await articleBookmarkPrisma(mockUser as any, "test-slug");

    expect(prismaMock.bookmark.create).toHaveBeenCalledWith({
      data: { username: "test-user", slug: "test-slug" },
    });
    expect(prismaMock.article.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { slug: "test-slug" } })
    );
    expect(result).toEqual(mockArticle);
  });

  test("Returns null when article does not exist", async () => {
    prismaMock.bookmark.create.mockResolvedValueOnce({
      id: 1,
      username: "test-user",
      slug: "missing-slug",
      bookmarkedAt: new Date(),
    });
    prismaMock.article.findUnique.mockResolvedValueOnce(null);

    const result = await articleBookmarkPrisma(mockUser as any, "missing-slug");

    expect(result).toBeNull();
  });
});
