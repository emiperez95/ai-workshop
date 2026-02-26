import { Response } from "express";
import { Request } from "express-jwt";
import articlesUnBookmark from "./articlesUnBookmark";
import userGetPrisma from "../../utils/db/user/userGetPrisma";
import bookmarkDeletePrisma from "../../utils/db/bookmark/bookmarkDeletePrisma";
import articleGetPrisma from "../../utils/db/article/articleGetPrisma";
import articleViewer from "../../view/articleViewer";

jest.mock("../../utils/db/user/userGetPrisma");
jest.mock("../../utils/db/bookmark/bookmarkDeletePrisma");
jest.mock("../../utils/db/article/articleGetPrisma");
jest.mock("../../view/articleViewer");

const mockedUserGetPrisma = jest.mocked(userGetPrisma);
const mockedBookmarkDeletePrisma = jest.mocked(bookmarkDeletePrisma);
const mockedArticleGetPrisma = jest.mocked(articleGetPrisma);
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
  email: "test@example.com",
  password: "hashed",
  bio: null,
  image: null,
  follows: [],
  followedBy: [],
  authored: [],
  favorites: [],
  bookmarks: [],
};

const mockArticle = {
  slug: "test-slug",
  title: "Test Article",
  description: "A test article",
  body: "Content",
  tagList: [],
  authorUsername: "test-user",
  createdAt: new Date(),
  updatedAt: new Date(),
  author: { ...mockUser, followedBy: [] },
  _count: { favoritedBy: 0 },
} as any;

const mockView = {
  slug: "test-slug",
  bookmarked: false,
} as any;

mockedArticleViewer.mockReturnValue(mockView);

describe("articlesUnBookmark controller", () => {
  test("Success path", async () => {
    const mockReq = {
      params: { slug: "test-slug" },
      auth: { user: { username: "test-user" } },
    } as unknown as Request;
    const mockRes = mockResponse();
    const next = jest.fn();

    mockedUserGetPrisma.mockResolvedValue(mockUser as any);
    mockedBookmarkDeletePrisma.mockResolvedValue({
      id: 1,
      username: "test-user",
      articleSlug: "test-slug",
      bookmarkedAt: new Date(),
    });
    mockedArticleGetPrisma.mockResolvedValue(mockArticle);

    await articlesUnBookmark(mockReq, mockRes as unknown as Response, next);

    expect(mockRes.json).toHaveBeenCalledWith({ article: mockView });
    expect(next).not.toHaveBeenCalled();
  });

  test("User not found returns 401", async () => {
    const mockReq = {
      params: { slug: "test-slug" },
      auth: { user: { username: "unknown" } },
    } as unknown as Request;
    const mockRes = mockResponse();
    const next = jest.fn();

    mockedUserGetPrisma.mockResolvedValue(null);

    await articlesUnBookmark(mockReq, mockRes as unknown as Response, next);

    expect(mockRes.sendStatus).toHaveBeenCalledWith(401);
  });

  test("Bookmark not found returns 404", async () => {
    const mockReq = {
      params: { slug: "test-slug" },
      auth: { user: { username: "test-user" } },
    } as unknown as Request;
    const mockRes = mockResponse();
    const next = jest.fn();

    mockedUserGetPrisma.mockResolvedValue(mockUser as any);
    mockedBookmarkDeletePrisma.mockResolvedValue(null);

    await articlesUnBookmark(mockReq, mockRes as unknown as Response, next);

    expect(mockRes.sendStatus).toHaveBeenCalledWith(404);
  });

  test("Error is passed to next", async () => {
    const mockReq = {
      params: { slug: "test-slug" },
      auth: { user: { username: "test-user" } },
    } as unknown as Request;
    const mockRes = mockResponse();
    const next = jest.fn();
    const error = new Error("DB error");

    mockedUserGetPrisma.mockResolvedValue(mockUser as any);
    mockedBookmarkDeletePrisma.mockRejectedValue(error);

    await articlesUnBookmark(mockReq, mockRes as unknown as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
