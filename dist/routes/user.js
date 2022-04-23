"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("./middlewares");
const user_1 = __importDefault(require("../models/user"));
const userRouter = (0, express_1.Router)();
// POST /:id/follow
userRouter.post("/:id/follow", middlewares_1.isLoggedIn, async (req, res, next) => {
    try {
        const user = await user_1.default.findOne({
            where: {
                id: req.user.id,
            },
        });
        if (user) {
            await user.addFollowing(parseInt(req.params.id, 10));
            res.send("success");
        }
        else {
            res.status(404).send("no user");
        }
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});
exports.default = userRouter;
//# sourceMappingURL=user.js.map