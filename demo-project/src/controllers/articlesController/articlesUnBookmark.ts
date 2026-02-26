import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import articleUnBookmarkPrisma from "../../utils/db/article/articleUnBookmarkPrisma";
import userGetPrisma from "../../utils/db/user/userGetPrisma";
import articleViewer from "../../view/articleViewer";

export default async function articlesUnBookmark(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const slug = req.params.slug;
  const username = req.auth?.user?.username;

  try {
    let currentUser = await userGetPrisma(username);
    if (!currentUser) return res.sendStatus(401);

    const article = await articleUnBookmarkPrisma(currentUser, slug);
    if (!article) return res.sendStatus(404);

    currentUser = await userGetPrisma(username);
    if (!currentUser) return res.sendStatus(500);

    const articleView = articleViewer(article, currentUser);
    return res.json({ article: articleView });
  } catch (error) {
    next(error);
  }
}
