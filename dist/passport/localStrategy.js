"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
const local = () => {
    // passport.use(new strategy.Strategy({...})) 동일
    passport_1.default.use(new passport_local_1.default.Strategy({
        usernameField: "email",
        passwordField: "password",
    }, 
    // email: 첫번째 인수의 email
    // password: 첫번째 인수의 password
    // done: auth.ctrl.ts 에서 /login 라우터에서
    // passport.authenticate 의 콜백함수
    async (email, password, done) => {
        try {
            const existUser = await user_1.default.findOne({ where: { email } });
            if (existUser) {
                const result = await bcrypt_1.default.compare(password, existUser.password);
                if (result) {
                    // 로그인 성공
                    done(null, existUser);
                }
                else {
                    // 로그인 실패
                    done(null, false, { message: "비밀번호 불일치" });
                }
            }
            else {
                // 로그인 실패
                done(null, false, { message: "미가입된 회원" });
            }
        }
        catch (error) {
            console.error(error);
            // 서버 에러
            done(error);
        }
    }));
};
exports.default = local;
//# sourceMappingURL=localStrategy.js.map