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
  const response = {
    status: jest.fn().mockReturnThis(),
    sendStatus: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return response;
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
  slug: "test-article",
  title: "Test Article",
  description: "Description",
  body: "Body",
  tagList: [],
  authorUsername: "test-user",
  author: { ...mockUser, followedBy: [] },
  createdAt: new Date(),
  updatedAt: new Date(),
  _count: { favoritedBy: 0 },
};

const mockArticleView = {
  slug: "test-article",
  title: "Test Article",
  description: "Description",
  body: "Body",
  tagList: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  favorited: false,
  bookmarked: true,
  favoritesCount: 0,
  author: { username: "test-user", bio: null, image: null, following: false },
};

mockedArticleViewer.mockReturnValue(mockArticleView);

describe("articlesBookmark controller", () => {
  test("Success path returns 200 with article", async () => {
    const mockReq = {
      params: { slug: "test-article" },
      auth: { user: { username: "test-user" } },
    } as unknown as Request;
    const mockRes = mockResponse();
    const next = jest.fn();

    mockedUserGetPrisma.mockResolvedValueOnce(mockUser as any);
    mockedArticleBookmarkPrisma.mockResolvedValueOnce(mockArticle as any);
    mockedUserGetPrisma.mockResolvedValueOnce(mockUser as any);

    await articlesBookmark(mockReq, mockRes as unknown as Response, next);

    expect(next).not.toHaveBeenCalled();
    expect(mockRes.sendStatus).not.toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith({ article: mockArticleView });
  });

  test("User not found returns 401", async () => {
    const mockReq = {
      params: { slug: "test-article" },
      auth: { user: { username: "ghost" } },
    } as unknown as Request;
    const mockRes = mockResponse();
    const next = jest.fn();

    mockedUserGetPrisma.mockResolvedValueOnce(null);

    await articlesBookmark(mockReq, mockRes as unknown as Response, next);

    expect(mockRes.sendStatus).toHaveBeenCalledWith(401);
  });

  test("Article not found returns 404", async () => {
    const mockReq = {
      params: { slug: "missing-article" },
      auth: { user: { username: "test-user" } },
    } as unknown as Request;
    const mockRes = mockResponse();
    const next = jest.fn();

    mockedUserGetPrisma.mockResolvedValueOnce(mockUser as any);
    mockedArticleBookmarkPrisma.mockResolvedValueOnce(null as any);

    await articlesBookmark(mockReq, mockRes as unknown as Response, next);

    expect(mockRes.sendStatus).toHaveBeenCalledWith(404);
  });

  test("Error is passed to next", async () => {
    const mockReq = {
      params: { slug: "test-article" },
      auth: { user: { username: "test-user" } },
    } as unknown as Request;
    const mockRes = mockResponse();
    const next = jest.fn();
    const error = new Error("DB error");

    mockedUserGetPrisma.mockResolvedValueOnce(mockUser as any);
    mockedArticleBookmarkPrisma.mockRejectedValueOnce(error);

    await articlesBookmark(mockReq, mockRes as unknown as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
