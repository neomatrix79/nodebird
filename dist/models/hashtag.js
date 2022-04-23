"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associateHashtag = exports.initHashtag = void 0;
const sequelize_1 = require("sequelize");
class Hashtag extends sequelize_1.Model {
    id;
    title;
    getPosts;
}
exports.default = Hashtag;
function initHashtag(sequelize) {
    Hashtag.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: sequelize_1.DataTypes.STRING(15),
            allowNull: false,
            unique: true,
        },
    }, {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Hashtag",
        tableName: "hashtags",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
    });
}
exports.initHashtag = initHashtag;
function associateHashtag(db) {
    db.Hashtag.belongsToMany(db.Post, { through: "PostHashtag" });
}
exports.associateHashtag = associateHashtag;
//# sourceMappingURL=hashtag.js.map