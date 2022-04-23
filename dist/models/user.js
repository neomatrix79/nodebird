"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associateUser = exports.initUser = void 0;
const sequelize_1 = require("sequelize");
// import Hashtag from './hashtag'
class User extends sequelize_1.Model {
    id;
    email;
    nick;
    password;
    provider;
    snsId;
    Followers;
    Followings;
    // Post 관계
    getPosts;
    addPost;
    addPosts;
    setPosts;
    removePost;
    removePosts;
    hasPost;
    hasPosts;
    // User 관계
    addFollowing;
}
exports.default = User;
function initUser(sequelize) {
    User.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: sequelize_1.DataTypes.STRING(40),
            allowNull: true,
            unique: true,
        },
        nick: {
            type: sequelize_1.DataTypes.STRING(15),
            allowNull: false,
        },
        password: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        provider: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
            defaultValue: "local",
        },
        snsId: {
            type: sequelize_1.DataTypes.STRING(30),
            allowNull: true,
        },
    }, {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "User",
        tableName: "users",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
    });
}
exports.initUser = initUser;
function associateUser(db) {
    db.User.hasMany(db.Post);
    // User - User 는 N:M 관계
    db.User.belongsToMany(db.User, {
        foreignKey: "followingId",
        as: "Followers",
        through: "Follow",
    });
    db.User.belongsToMany(db.User, {
        foreignKey: "followerId",
        as: "Followings",
        through: "Follow",
    });
}
exports.associateUser = associateUser;
//# sourceMappingURL=user.js.map