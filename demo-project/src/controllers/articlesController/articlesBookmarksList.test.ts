import { Response } from "express";
import { Request } from "express-jwt";
import articlesBookmarksList from "./articlesBookmarksList";
import userGetPrisma from "../../utils/db/user/userGetPrisma";
import articleBookmarksListPrisma from "../../utils/db/article/articleBookmarksListPrisma";
import articleViewer from "../../view/articleViewer";

jest.mock("../../utils/db/user/userGetPrisma");
jest.mock("../../utils/db/article/articleBookmarksListPrisma");
jest.mock("../../view/articleViewer");

const mockedUserGetPrisma = jest.mocked(userGetPrisma);
const mockedArticleBookmarksListPrisma = jest.mocked(articleBookmarksListPrisma);
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

describe("articlesBookmarksList controller", () => {
  test("Success path returns 200 with articles list", async () => {
    const mockReq = {
      auth: { user: { username: "test-user" } },
    } as unknown as Request;
    const mockRes = mockResponse();
    const next = jest.fn();

    mockedUserGetPrisma.mockResolvedValueOnce(mockUser as any);
    mockedArticleBookmarksListPrisma.mockResolvedValueOnce([mockArticle] as any);

    await articlesBookmarksList(mockReq, mockRes as unknown as Response, next);

    expect(next).not.toHaveBeenCalled();
    expect(mockRes.sendStatus).not.toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith({
      articles: [mockArticleView],
      articlesCount: 1,
    });
  });

  test("User not found returns 401", async () => {
    const mockReq = {
      auth: { user: { username: "ghost" } },
    } as unknown as Request;
    const mockRes = mockResponse();
    const next = jest.fn();

    mockedUserGetPrisma.mockResolvedValueOnce(null);

    await articlesBookmarksList(mockReq, mockRes as unknown as Response, next);

    expect(mockRes.sendStatus).toHaveBeenCalledWith(401);
  });

  test("Error is passed to next", async () => {
    const mockReq = {
      auth: { user: { username: "test-user" } },
    } as unknown as Request;
    const mockRes = mockResponse();
    const next = jest.fn();
    const error = new Error("DB error");

    mockedUserGetPrisma.mockResolvedValueOnce(mockUser as any);
    mockedArticleBookmarksListPrisma.mockRejectedValueOnce(error);

    await articlesBookmarksList(mockReq, mockRes as unknown as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
