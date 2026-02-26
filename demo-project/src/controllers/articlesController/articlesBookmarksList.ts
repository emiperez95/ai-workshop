import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import articleBookmarksListPrisma from "../../utils/db/article/articleBookmarksListPrisma";
import userGetPrisma from "../../utils/db/user/userGetPrisma";
import articleViewer from "../../view/articleViewer";

export default async function articlesBookmarksList(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const username = req.auth?.user?.username;

  try {
    const currentUser = await userGetPrisma(username);
    if (!currentUser) return res.sendStatus(401);

    const articles = await articleBookmarksListPrisma(currentUser);

    const articlesView = articles.map((article) =>
      articleViewer(article, currentUser)
    );

    return res.json({
      articles: articlesView,
      articlesCount: articlesView.length,
    });
  } catch (error) {
    return next(error);
  }
}
