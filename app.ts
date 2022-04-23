import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import nunjucks from "nunjucks";
import pageRouter from "./routes/page";
import authRouter from "./routes/auth";
import postRouter from "./routes/post";
import userRouter from "./routes/user";
import { db } from "./models";
import passport from "passport";
import passportConfig from "./passport";

dotenv.config();

const { COOKIE_SECRET } = process.env;

const app = express();

passportConfig();

app.set("port", 4000);
app.set("view engine", "html");

nunjucks.configure(["views", "public"], {
  express: app,
  watch: true,
});

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("================================");
    console.log("Database connection success !!");
    console.log("================================");
  })
  .catch((error) => {
    console.error(error);
  });

app.use(morgan("dev"));
app.use(express.json());

// __dirname 을 이용할 경우, dist 디렉토리가 현재 경로임에 주의
app.use("/", express.static(path.join(__dirname, "../public")));
app.use("/img", express.static(path.join(__dirname, "../uploads")));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(COOKIE_SECRET as string)); // .env 에 정의하는 것이 좋음
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: COOKIE_SECRET as string, // .env 에 정의하는 것이 좋음
    cookie: {
      httpOnly: true,
      secure: false,
    },
    name: "session-cookie",
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", pageRouter);
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);

app.listen(app.get("port"), () => {
  console.log("Listening port...");
});
