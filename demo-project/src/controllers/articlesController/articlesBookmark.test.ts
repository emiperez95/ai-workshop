import { Response } from "express";
import { Request } from "express-jwt";
import articlesBookmark from "./articlesBookmark";
import userGetPrisma from "../../utils/db/user/userGetPrisma";
import articleBookmarkPrisma from "../../utils/db/article/articleBookmarkPrisma";
import articleViewer from "../../view/articleViewer";

jest.mock("../../utils/db/user/userGetPrisma");
jest.mock("../../utils/db/article/articleBookmarkPrisma");
jest.mock("../../view/articleViewer");

const mockedUserGetPrisma = jest.mocked(userGetPrisma);
const mockedArticleBookmarkPrisma = jest.mocked(articleBookmarkPrisma);
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
  bookmarks: [],
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
  bookmarked: true,
  author: { username: "test-user", bio: null, image: null, following: false },
};

describe("articlesBookmark controller", () => {
  beforeEach(() => jest.clearAllMocks());

  test("Success: returns bookmarked article", async () => {
    const mockReq = {
      params: { slug: "test-slug" },
      auth: { user: { username: "test-user" } },
    } as unknown as Request;
    const mockRes = mockResponse();
    const next = jest.fn();

    mockedUserGetPrisma.mockResolvedValueOnce(mockUser as any);
    mockedArticleBookmarkPrisma.mockResolvedValueOnce(mockArticle as any);
    mockedUserGetPrisma.mockResolvedValueOnce({
      ...mockUser,
      bookmarks: [{ id: 1, username: "test-user", slug: "test-slug", bookmarkedAt: new Date() }],
    } as any);
    mockedArticleViewer.mockReturnValue(mockArticleView as any);

    await articlesBookmark(mockReq, mockRes as unknown as Response, next);

    expect(mockedArticleBookmarkPrisma).toHaveBeenCalledWith(
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

    await articlesBookmark(mockReq, mockRes as unknown as Response, next);

    expect(mockRes.sendStatus).toHaveBeenCalledWith(401);
    expect(mockedArticleBookmarkPrisma).not.toHaveBeenCalled();
  });

  test("Returns 404 when article is not found", async () => {
    const mockReq = {
      params: { slug: "missing-slug" },
      auth: { user: { username: "test-user" } },
    } as unknown as Request;
    const mockRes = mockResponse();
    const next = jest.fn();

    mockedUserGetPrisma.mockResolvedValueOnce(mockUser as any);
    mockedArticleBookmarkPrisma.mockResolvedValueOnce(null);

    await articlesBookmark(mockReq, mockRes as unknown as Response, next);

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
    mockedArticleBookmarkPrisma.mockRejectedValueOnce(error);

    await articlesBookmark(mockReq, mockRes as unknown as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
