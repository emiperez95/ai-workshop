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
  bio: null,
  email: "test@email.com",
  image: null,
  password: "test-password",
  follows: [],
  followedBy: [],
  authored: [],
  favorites: [],
  bookmarks: [],
};

const mockArticle = {
  slug: "test-slug",
  title: "Test Article",
  description: "Test description",
  body: "Test body",
  tagList: [],
  author: { ...mockUser, followedBy: [] },
  authorUsername: "test-user",
  createdAt: new Date(),
  updatedAt: new Date(),
  _count: { favoritedBy: 0 },
};

const mockView = {
  slug: "test-slug",
  title: "Test Article",
  description: "Test description",
  body: "Test body",
  tagList: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  favorited: false,
  bookmarked: true,
  favoritesCount: 0,
  author: { username: "test-user", bio: null, image: null, following: false },
};

describe("articlesBookmark Controller", () => {
  test("Returns 401 when user not found", async () => {
    const mockReq = {
      params: { slug: "test-slug" },
      auth: { user: { username: "nonexistent" } },
    } as unknown as Request;
    const mockRes = mockResponse();
    const next = jest.fn();

    mockedUserGetPrisma.mockResolvedValueOnce(null);

    await articlesBookmark(mockReq, mockRes as unknown as Response, next);

    expect(mockRes.sendStatus).toHaveBeenCalledWith(401);
  });

  test("Returns 404 when article not found", async () => {
    const mockReq = {
      params: { slug: "nonexistent-slug" },
      auth: { user: { username: "test-user" } },
    } as unknown as Request;
    const mockRes = mockResponse();
    const next = jest.fn();

    mockedUserGetPrisma.mockResolvedValueOnce(mockUser as any);
    mockedArticleBookmarkPrisma.mockResolvedValueOnce(null);

    await articlesBookmark(mockReq, mockRes as unknown as Response, next);

    expect(mockRes.sendStatus).toHaveBeenCalledWith(404);
  });

  test("Returns article view on success", async () => {
    const mockReq = {
      params: { slug: "test-slug" },
      auth: { user: { username: "test-user" } },
    } as unknown as Request;
    const mockRes = mockResponse();
    const next = jest.fn();

    mockedUserGetPrisma.mockResolvedValueOnce(mockUser as any);
    mockedArticleBookmarkPrisma.mockResolvedValueOnce(mockArticle as any);
    mockedUserGetPrisma.mockResolvedValueOnce(mockUser as any);
    mockedArticleViewer.mockReturnValueOnce(mockView as any);

    await articlesBookmark(mockReq, mockRes as unknown as Response, next);

    expect(next).not.toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith({ article: mockView });
  });

  test("Calls next(error) on exception", async () => {
    const mockReq = {
      params: { slug: "test-slug" },
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
