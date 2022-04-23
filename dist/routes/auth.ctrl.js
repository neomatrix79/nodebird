"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.join = void 0;
const passport_1 = __importDefault(require("passport"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
// POST /join
const join = async (req, res, next) => {
    const { email, nick, password } = req.body;
    try {
        const existUser = await user_1.default.findOne({ where: { email } });
        if (existUser) {
            return res.redirect(`/join?error=exist`);
        }
        const hash = await bcrypt_1.default.hash(password, 12);
        const newUser = await user_1.default.create({
            email,
            nick,
            password: hash,
        });
        if (!newUser) {
            res.send("new user join failed");
            return;
        }
        return res.redirect("/");
    }
    catch (error) {
        // res.status(500).send(`server error: ${error}`);
        console.error(error);
        return next(error);
    }
};
exports.join = join;
// POST /login
const login = (req, res, next) => {
    // localStrategy 의 두번째 인수인 async 함수의
    // 세번째 인수가 이 함수의 콜백으로 넘겨짐
    passport_1.default.authenticate("local", (authError, user, info) => {
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
exports.login = login;
// GET /logout
const logout = (req, res, next) => {
    req.logout(); // req.user 객체 제거
    req.session.destroy((error) => { }); // req.session 객체의 내용 제거
    res.redirect("/");
};
exports.logout = logout;
//# sourceMappingURL=auth.ctrl.js.map