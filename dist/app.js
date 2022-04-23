"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const nunjucks_1 = __importDefault(require("nunjucks"));
const page_1 = __importDefault(require("./routes/page"));
const auth_1 = __importDefault(require("./routes/auth"));
const post_1 = __importDefault(require("./routes/post"));
const user_1 = __importDefault(require("./routes/user"));
const models_1 = require("./models");
const passport_1 = __importDefault(require("passport"));
const passport_2 = __importDefault(require("./passport"));
dotenv_1.default.config();
const { COOKIE_SECRET } = process.env;
const app = (0, express_1.default)();
(0, passport_2.default)();
app.set("port", 4000);
app.set("view engine", "html");
nunjucks_1.default.configure(["views", "public"], {
    express: app,
    watch: true,
});
models_1.db.sequelize
    .sync({ force: false })
    .then(() => {
    console.log("================================");
    console.log("Database connection success !!");
    console.log("================================");
})
    .catch((error) => {
    console.error(error);
});
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
// __dirname 을 이용할 경우, dist 디렉토리가 현재 경로임에 주의
app.use("/", express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use("/img", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)(COOKIE_SECRET)); // .env 에 정의하는 것이 좋음
app.use((0, express_session_1.default)({
    resave: false,
    saveUninitialized: false,
    secret: COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: "session-cookie",
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/", page_1.default);
app.use("/auth", auth_1.default);
app.use("/post", post_1.default);
app.use("/user", user_1.default);
app.listen(app.get("port"), () => {
    console.log("Listening port...");
});
//# sourceMappingURL=app.js.map