"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const hashtag_1 = __importDefault(require("../models/hashtag"));
const post_1 = __importDefault(require("../models/post"));
const middlewares_1 = require("./middlewares");
const postRouter = (0, express_1.Router)();
try {
    fs_1.default.readdirSync("uploads");
}
catch (error) {
    console.error("uploads 폴더가 없으면 생성");
    fs_1.default.mkdirSync("uploads");
}
const upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination(req, file, cb) {
            cb(null, "uploads/");
        },
        filename(req, file, cb) {
            const ext = path_1.default.extname(file.originalname);
            cb(null, path_1.default.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
// POST /img     (이미지 저장 라우터)
postRouter.post("/img", middlewares_1.isLoggedIn, upload.single("img"), (req, res) => {
    console.log(req.file);
    // 이미지 저장경로 응답
    res.json({ url: `/img/${req.file.filename}` });
});
const upload2 = (0, multer_1.default)();
// POST /    (게시글 작성 라우터)
postRouter.post("/", middlewares_1.isLoggedIn, upload2.none(), async (req, res, next) => {
    //   const { content, img } = req.body as PostAttributes;
    try {
        // /img 라우터에서 이미지를 업로드 했다면,
        // 이미지 주소도 req.body.url 로 전송됨
        // 이미지 주소만 온 것일뿐, 이미지 데이터 자체는 오지 않음
        // 이미지는 이미 /img 라우터에 저장됨
        const post = await post_1.default.create({
            content: req.body.content,
            img: req.body.url,
            userId: req.user.id,
        });
        // 게시글에서 해시태그를 추출
        const hashtags = req.body.content.match("/#[^s#]+/g");
        if (hashtags) {
            // [모델, 생성 여부] 반환
            const result = await Promise.all(hashtags.map((tag) => {
                // 해시태그를 DB에 저장
                return hashtag_1.default.findOrCreate({
                    where: {
                        // 해시태그에서 #을 떼고 소문자로 만듬
                        title: tag.slice(1).toLowerCase(),
                    },
                });
            }));
            // [모델, 생성 여부] 에서 모델만 추출하고
            // 해시태그 모델들을 게시글과 연결시킴
            await post.addHashtags(result.map((r) => r[0]));
        }
        res.redirect("/");
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});
exports.default = postRouter;
//# sourceMappingURL=post.js.map