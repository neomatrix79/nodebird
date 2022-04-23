import { Request, Response, NextFunction } from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import User from "../models/user";
import { UserAttributes } from "../lib/types";

// POST /join
export const join = async (req: Request, res: Response, next: NextFunction) => {
  const { email, nick, password } = req.body as UserAttributes;

  try {
    const existUser = await User.findOne({ where: { email } });

    if (existUser) {
      return res.redirect(`/join?error=exist`);
    }

    const hash = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      email,
      nick,
      password: hash,
    });

    if (!newUser) {
      res.send("new user join failed");
      return;
    }

    return res.redirect("/");
  } catch (error) {
    // res.status(500).send(`server error: ${error}`);
    console.error(error);
    return next(error);
  }
};

// POST /login
export const login = (req: Request, res: Response, next: NextFunction) => {
  // localStrategy 의 두번째 인수인 async 함수의
  // 세번째 인수가 이 함수의 콜백으로 넘겨짐
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }

    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }

    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next) 를 붙임
};

// GET /logout
export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout(); // req.user 객체 제거
  req.session.destroy((error) => {}); // req.session 객체의 내용 제거
  res.redirect("/");
};
