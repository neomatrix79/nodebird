"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associatePost = exports.initPost = void 0;
const sequelize_1 = require("sequelize");
class Post extends sequelize_1.Model {
    id;
    content;
    img;
    userId;
    // user 관계
    getUser;
    addUser;
    // Hashtag 관계
    addHashtags;
}
exports.default = Post;
function initPost(sequelize) {
    Post.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        content: {
            type: sequelize_1.DataTypes.STRING(140),
            allowNull: false,
        },
        img: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: true,
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
    }, {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Post",
        tableName: "posts",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
    });
}
exports.initPost = initPost;
function associatePost(db) {
    db.Post.belongsTo(db.User);
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" });
}
exports.associatePost = associatePost;
//# sourceMappingURL=post.js.map