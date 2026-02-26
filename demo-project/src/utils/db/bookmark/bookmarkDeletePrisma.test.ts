jest.mock("../prisma", () => {
  const { mockDeep } = require("jest-mock-extended");
  return { __esModule: true, default: mockDeep() };
});

import prisma from "../prisma";
import { DeepMockProxy, mockReset } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";
import bookmarkDeletePrisma from "./bookmarkDeletePrisma";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("bookmarkDeletePrisma", () => {
  test("Deletes a bookmark and returns it", async () => {
    const mockBookmark = {
      id: 1,
      username: "test-user",
      articleSlug: "test-slug",
      bookmarkedAt: new Date(),
    };
    prismaMock.bookmark.delete.mockResolvedValue(mockBookmark);

    const result = await bookmarkDeletePrisma("test-user", "test-slug");

    expect(prismaMock.bookmark.delete).toHaveBeenCalledWith({
      where: {
        username_articleSlug: {
          username: "test-user",
          articleSlug: "test-slug",
        },
      },
    });
    expect(result).toEqual(mockBookmark);
  });

  test("Returns null when bookmark not found (P2025)", async () => {
    const error = { code: "P2025", message: "Record not found" };
    prismaMock.bookmark.delete.mockRejectedValue(error);

    const result = await bookmarkDeletePrisma("test-user", "nonexistent-slug");

    expect(result).toBeNull();
  });

  test("Re-throws non-P2025 errors", async () => {
    const error = new Error("DB connection error");
    prismaMock.bookmark.delete.mockRejectedValue(error);

    await expect(
      bookmarkDeletePrisma("test-user", "test-slug")
    ).rejects.toThrow("DB connection error");
  });
});
