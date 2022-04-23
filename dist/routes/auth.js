"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const authCtrl = __importStar(require("./auth.ctrl"));
const middlewares_1 = require("./middlewares");
const authRouter = (0, express_1.Router)();
// POST /join
authRouter.post("/join", middlewares_1.isNotLoggedIn, authCtrl.join);
// POST /login
authRouter.post("/login", middlewares_1.isNotLoggedIn, authCtrl.login);
// GET /logout
authRouter.get("/logout", middlewares_1.isLoggedIn, authCtrl.logout);
// kakao strategy
// GET /kakao
authRouter.get("/kakao", passport_1.default.authenticate("kakao"));
// GET /kakao/callback
authRouter.get("/kakao/callback", passport_1.default.authenticate("kakao", {
    failureRedirect: "/",
}), (req, res) => {
    res.redirect("/");
});
exports.default = authRouter;
//# sourceMappingURL=auth.js.map