import { Response } from "express";
import { Request } from "express-jwt";
import articlesUnBookmark from "./articlesUnBookmark";
import userGetPrisma from "../../utils/db/user/userGetPrisma";
import articleUnBookmarkPrisma from "../../utils/db/article/articleUnBookmarkPrisma";
import articleViewer from "../../view/articleViewer";

jest.mock("../../utils/db/user/userGetPrisma");
jest.mock("../../utils/db/article/articleUnBookmarkPrisma");
jest.mock("../../view/articleViewer");

const mockedUserGetPrisma = jest.mocked(userGetPrisma);
const mockedArticleUnBookmarkPrisma = jest.mocked(articleUnBookmarkPrisma);
const mockedArticleViewer = jest.mocked(articleViewer);

function mockResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    sendStatus: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

const mockUser = {
  username: "test-user",
  bio: null,
  email: "test@example.com",
  image: null,
  password: "hashed",
  follows: [],
  followedBy: [],
  authored: [],
  favorites: [],
  bookmarks: [{ id: 1, username: "test-user", slug: "test-slug", bookmarkedAt: new Date() }],
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

const mockArticleView = {
  slug: "test-slug",
  title: "Test Article",
  description: "desc",
  body: "body",
  tagList: [],
  createdAt: mockArticle.createdAt,
  updatedAt: mockArticle.updatedAt,
  favorited: false,
  favoritesCount: 0,
  bookmarked: false,
  author: { username: "test-user", bio: null, image: null, following: false },
};

describe("articlesUnBookmark controller", () => {
  beforeEach(() => jest.clearAllMocks());

  test("Success: returns un-bookmarked article", async () => {
    const mockReq = {
      params: { slug: "test-slug" },
      auth: { user: { username: "test-user" } },
    } as unknown as Request;
    const mockRes = mockResponse();
    const next = jest.fn();

    mockedUserGetPrisma.mockResolvedValueOnce(mockUser as any);
    mockedArticleUnBookmarkPrisma.mockResolvedValueOnce(mockArticle as any);
    mockedUserGetPrisma.mockResolvedValueOnce({ ...mockUser, bookmarks: [] } as any);
    mockedArticleViewer.mockReturnValue(mockArticleView as any);

    await articlesUnBookmark(mockReq, mockRes as unknown as Response, next);

    expect(mockedArticleUnBookmarkPrisma).toHaveBeenCalledWith(
      expect.objectContaining({ username: "test-user" }),
      "test-slug"
    );
    expect(mockRes.json).toHaveBeenCalledWith({ article: mockArticleView });
    expect(next).not.toHaveBeenCalled();
  });

  test("Returns 401 when user is not found", async () => {
    const mockReq = {
      params: { slug: "test-slug" },
      auth: { user: { username: "ghost" } },
    } as unknown as Request;
    const mockRes = mockResponse();
    const next = jest.fn();

    mockedUserGetPrisma.mockResolvedValueOnce(null);

    await articlesUnBookmark(mockReq, mockRes as unknown as Response, next);

    expect(mockRes.sendStatus).toHaveBeenCalledWith(401);
    expect(mockedArticleUnBookmarkPrisma).not.toHaveBeenCalled();
  });

  test("Returns 404 when article is not found", async () => {
    const mockReq = {
      params: { slug: "missing-slug" },
      auth: { user: { username: "test-user" } },
    } as unknown as Request;
    const mockRes = mockResponse();
    const next = jest.fn();

    mockedUserGetPrisma.mockResolvedValueOnce(mockUser as any);
    mockedArticleUnBookmarkPrisma.mockResolvedValueOnce(null);

    await articlesUnBookmark(mockReq, mockRes as unknown as Response, next);

    expect(mockRes.sendStatus).toHaveBeenCalledWith(404);
  });

  test("Calls next on unexpected error", async () => {
    const mockReq = {
      params: { slug: "test-slug" },
      auth: { user: { username: "test-user" } },
    } as unknown as Request;
    const mockRes = mockResponse();
    const next = jest.fn();
    const error = new Error("db error");

    mockedUserGetPrisma.mockResolvedValueOnce(mockUser as any);
    mockedArticleUnBookmarkPrisma.mockRejectedValueOnce(error);

    await articlesUnBookmark(mockReq, mockRes as unknown as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
