import passport from "passport";
import strategy from "passport-local";
import bcrypt from "bcrypt";
import User from "../models/user";

type LocalStrategy = strategy.Strategy;

const local = () => {
  // passport.use(new strategy.Strategy({...})) 동일
  passport.use(
    new strategy.Strategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      // email: 첫번째 인수의 email
      // password: 첫번째 인수의 password
      // done: auth.ctrl.ts 에서 /login 라우터에서
      // passport.authenticate 의 콜백함수
      async (email, password, done) => {
        try {
          const existUser = await User.findOne({ where: { email } });

          if (existUser) {
            const result = await bcrypt.compare(password, existUser.password);

            if (result) {
              // 로그인 성공
              done(null, existUser);
            } else {
              // 로그인 실패
              done(null, false, { message: "비밀번호 불일치" });
            }
          } else {
            // 로그인 실패
            done(null, false, { message: "미가입된 회원" });
          }
        } catch (error) {
          console.error(error);

          // 서버 에러
          done(error);
        }
      }
    )
  );
};

export default local;
