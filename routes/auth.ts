import { Router, Request, Response } from "express";
import passport from "passport";
import * as authCtrl from "./auth.ctrl";
import { isLoggedIn, isNotLoggedIn } from "./middlewares";

const authRouter = Router();

// POST /join
authRouter.post("/join", isNotLoggedIn, authCtrl.join);

// POST /login
authRouter.post("/login", isNotLoggedIn, authCtrl.login);

// GET /logout
authRouter.get("/logout", isLoggedIn, authCtrl.logout);

// kakao strategy

// GET /kakao
authRouter.get("/kakao", passport.authenticate("kakao"));

// GET /kakao/callback
authRouter.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/",
  }),
  (req: Request, res: Response) => {
    res.redirect("/");
  }
);

export default authRouter;
