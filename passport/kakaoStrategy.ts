import passport from "passport";
import { Strategy, StrategyOption } from "passport-kakao";
import User from "../models/user";

// const options: StrategyOption = {
//   clientID: process.env.KAKAO_ID as string,
//   callbackURL: "/auth/kakao/callback",
//   clientSecret: "",
// };

const kakao = () => {
  passport.use(
    new Strategy(
      {
        // 카카오 발급 ID
        clientID: process.env.KAKAO_ID as string,
        // 카카오로부터 인증 결과를 받을 라우터 주소
        callbackURL: "/auth/kakao/callback",
        // 필요 없을시 빈 스트링 명시
        clientSecret: "",
      },
      // 카카오 에서는 인증 후 callbackURL 에 적힌 주소로
      // accessToken, refreshToken, profile 을 보냄
      // profile 에는 사용자 정보가 들어있음
      // 카카오 에서 보내주는 것이므로 데이터는 로그로 확인
      // profile 객체에서 원하는 정보를 꺼내와 회원가입을 진행
      // 사용자를 생성한 뒤 done 함수를 호출
      async (accessToken, refreshToken, profile, done) => {
        console.log(`kakao profile: ${profile}`);

        try {
          // 카카오에 가입된 회원인지 체크
          const existUser = await User.findOne({
            where: {
              snsId: profile.id,
              provider: "kakao",
            },
          });

          if (existUser) {
            // 이미 카카오에 가입되어 있다면
            done(null, existUser);
          } else {
            const newUser = await User.create({
              email: profile._json && profile._json.kakao_account_email,
              nick: profile.displayName,
              snsId: profile.id,
              provider: "kakao",
            });

            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};

export default kakao;
