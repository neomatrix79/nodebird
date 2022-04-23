import passport from "passport";
import User from "../models/user";
import local from "./localStrategy";
import kakao from "./kakaoStrategy";

const passportConfig = () => {
  // 로그인시 실행
  // req.session(세션) 객체에 어떤 데이터를 저장할지 정함
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // 매 요청시 실행
  // req.session 미들웨어가 호출
  // serializeUser 의 두번째 인수로 넣었던 데이터가
  // 이 메서드의 첫번째 인수로 전달 (사용자 아이디)
  passport.deserializeUser((id, done) => {
    // 사용자를 불러올 때, 팔로워/팔로잉 목록까지 불러옴
    User.findOne({
      where: { id },
      include: [
        // 팔로워, 팔로잉 목록까지 불러옴 (★)
        {
          model: User,
          attributes: ["id", "nick"],
          as: "Followers",
        },
        {
          model: User,
          attributes: ["id", "nick"],
          as: "Followings",
        },
      ],
    })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  // 로컬 로그인
  local();

  // 카카오 로그인
  kakao();
};

export default passportConfig;
