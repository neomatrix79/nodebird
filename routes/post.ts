import express, { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Hashtag from "../models/hashtag";
import Post from "../models/post";
import { isLoggedIn } from "./middlewares";
import { PostAttributes } from "../lib/types";

const postRouter = Router();

try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("uploads 폴더가 없으면 생성");
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// POST /img     (이미지 저장 라우터)
postRouter.post("/img", isLoggedIn, upload.single("img"), (req, res) => {
  console.log(req.file);

  // 이미지 저장경로 응답
  res.json({ url: `/img/${req.file.filename}` });
});

const upload2 = multer();

// POST /    (게시글 작성 라우터)
postRouter.post("/", isLoggedIn, upload2.none(), async (req, res, next) => {
  //   const { content, img } = req.body as PostAttributes;

  try {
    // /img 라우터에서 이미지를 업로드 했다면,
    // 이미지 주소도 req.body.url 로 전송됨
    // 이미지 주소만 온 것일뿐, 이미지 데이터 자체는 오지 않음
    // 이미지는 이미 /img 라우터에 저장됨
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url, // 이미지 주소
      userId: req.user.id,
    });

    // 게시글에서 해시태그를 추출
    const hashtags = req.body.content.match("/#[^s#]+/g");

    if (hashtags) {
      // [모델, 생성 여부] 반환
      const result = await Promise.all(
        hashtags.map((tag) => {
          // 해시태그를 DB에 저장
          return Hashtag.findOrCreate({
            where: {
              // 해시태그에서 #을 떼고 소문자로 만듬
              title: tag.slice(1).toLowerCase(),
            },
          });
        })
      );

      // [모델, 생성 여부] 에서 모델만 추출하고
      // 해시태그 모델들을 게시글과 연결시킴
      await post.addHashtags(result.map((r) => r[0]));
    }
    res.redirect("/");
  } catch (error) {
    console.error(error);

    next(error);
  }
});

export default postRouter;
