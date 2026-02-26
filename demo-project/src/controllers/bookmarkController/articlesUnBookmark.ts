import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import bookmarkDeletePrisma from "../../utils/db/bookmark/bookmarkDeletePrisma";
import articleGetPrisma from "../../utils/db/article/articleGetPrisma";
import userGetPrisma from "../../utils/db/user/userGetPrisma";
import articleViewer from "../../view/articleViewer";

/**
 * Controller to remove a bookmark from an article. Requires an authenticated user.
 * @param req Request with a jwt token verified; params must have a slug.
 * @param res Response
 * @param next NextFunction
 */
export default async function articlesUnBookmark(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const slug = req.params.slug;
  const username = req.auth?.user?.username;

  try {
    // Get current user
    let currentUser = await userGetPrisma(username);
    if (!currentUser) return res.sendStatus(401);

    // Delete the bookmark
    const deleted = await bookmarkDeletePrisma(username, slug);
    if (!deleted) return res.sendStatus(404);

    // Get the article
    const article = await articleGetPrisma(slug);
    if (!article) return res.sendStatus(404);

    // Re-fetch current user to reflect removed bookmark
    currentUser = await userGetPrisma(username);
    if (!currentUser) return res.sendStatus(500);

    // Create article view
    const articleView = articleViewer(article, currentUser);
    return res.json({ article: articleView });
  } catch (error) {
    next(error);
  }
}
