import { Router, Request, Response, NextFunction } from "express";
import { isLoggedIn, isNotLoggedIn } from "./middlewares";
import User from "../models/user";
import Post from "../models/post";
import Hashtag from "../models/hashtag";
import { PostAttributes } from "../lib/types";

const pageRouter = Router();

// 로그인 한 경우엔 req.user 가 존재하므로
// 팔로잉, 팔로워, 팔로워 아이디 수를 설정
// 팔로워 아이디 리스트가 있는 이유?
// 팔로워 아이디 리스트에 게시글 작성자의 아이디가 존재하지 않으면
// 팔로우 버튼을 보여주기 위해...
pageRouter.use((req: Request, res: Response, next: NextFunction) => {
  // res.locals.user = null;
  res.locals.user = req.user;
  res.locals.followerCount = req.user ? req.user.Followers.length : 0;
  res.locals.followingCount = req.user ? req.user.Followings.length : 0;
  res.locals.followerIdList = req.user
    ? req.user.Followings.map((f) => f.id)
    : [];

  next();
});

// GET /profile
pageRouter.get("/profile", isLoggedIn, (req: Request, res: Response) => {
  res.render("profile", { title: "내 정보 - NodeBird" });
});

// GET /JOIN
pageRouter.get("/join", isNotLoggedIn, (req: Request, res: Response) => {
  res.render("join", { title: "회원가입 - NodeBird" });
});

// GET /
pageRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  // const twits = [];
  // res.render("main", { title: "NodeBird", twits });

  try {
    // 게시글 작성자 id, nick 을 JOIN 해서 조회
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ["id", "nick"], // id, nick 컬럼
      },
      order: [["createdAt", "DESC"]], // 게시글은 최신순으로...
    });

    res.render("main", { title: "NodeBird", twits: posts });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// GET /hashtag
pageRouter.get("/hash", async (req, res, next) => {
  const query = req.query.hashtag as string;

  if (!query) {
    return res.redirect("/");
  }

  try {
    const hashtag = await Hashtag.findOne({
      where: {
        title: query,
      },
    });
    let posts: Post[] = [];

    if (hashtag) {
      // 모든 게시글을 가져 오면서, 작성자 정보까지 가져옴
      posts = await hashtag.getPosts({
        include: [
          {
            model: User,
          },
        ],
      });
    }

    return res.render("main", {
      title: `${query} \| NodeBird`,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

export default pageRouter;
