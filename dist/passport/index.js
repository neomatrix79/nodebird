"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const user_1 = __importDefault(require("../models/user"));
const localStrategy_1 = __importDefault(require("./localStrategy"));
const kakaoStrategy_1 = __importDefault(require("./kakaoStrategy"));
const passportConfig = () => {
    // 로그인시 실행
    // req.session(세션) 객체에 어떤 데이터를 저장할지 정함
    passport_1.default.serializeUser((user, done) => {
        done(null, user.id);
    });
    // 매 요청시 실행
    // req.session 미들웨어가 호출
    // serializeUser 의 두번째 인수로 넣었던 데이터가
    // 이 메서드의 첫번째 인수로 전달 (사용자 아이디)
    passport_1.default.deserializeUser((id, done) => {
        // 사용자를 불러올 때, 팔로워/팔로잉 목록까지 불러옴
        user_1.default.findOne({
            where: { id },
            include: [
                // 팔로워, 팔로잉 목록까지 불러옴 (★)
                {
                    model: user_1.default,
                    attributes: ["id", "nick"],
                    as: "Followers",
                },
                {
                    model: user_1.default,
                    attributes: ["id", "nick"],
                    as: "Followings",
                },
            ],
        })
            .then((user) => done(null, user))
            .catch((err) => done(err));
    });
    // 로컬 로그인
    (0, localStrategy_1.default)();
    // 카카오 로그인
    (0, kakaoStrategy_1.default)();
};
exports.default = passportConfig;
//# sourceMappingURL=index.js.map