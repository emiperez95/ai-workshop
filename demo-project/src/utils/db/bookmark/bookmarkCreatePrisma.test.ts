jest.mock("../prisma", () => {
  const { mockDeep } = require("jest-mock-extended");
  return { __esModule: true, default: mockDeep() };
});

import prisma from "../prisma";
import { DeepMockProxy, mockReset } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";
import bookmarkCreatePrisma from "./bookmarkCreatePrisma";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("bookmarkCreatePrisma", () => {
  test("Creates a bookmark with username and articleSlug", async () => {
    const mockBookmark = {
      id: 1,
      username: "test-user",
      articleSlug: "test-slug",
      bookmarkedAt: new Date(),
    };
    prismaMock.bookmark.create.mockResolvedValue(mockBookmark);

    const result = await bookmarkCreatePrisma("test-user", "test-slug");

    expect(prismaMock.bookmark.create).toHaveBeenCalledWith({
      data: { username: "test-user", articleSlug: "test-slug" },
    });
    expect(result).toEqual(mockBookmark);
  });
});
