import {
  Sequelize,
  Model,
  DataTypes,
  BelongsToGetAssociationMixin,
  BelongsToCreateAssociationMixin,
  BelongsToManyAddAssociationsMixin,
} from "sequelize";
import { PostAttributes, DBType } from "../lib/types";
import User from "./user";
import Hashtag from "./hashtag";

export default class Post extends Model<PostAttributes> {
  id: number;
  content: string;
  img: string;
  userId: number;

  // user 관계
  getUser: BelongsToGetAssociationMixin<User>;
  addUser: BelongsToCreateAssociationMixin<User>;

  // Hashtag 관계
  addHashtags: BelongsToManyAddAssociationsMixin<Hashtag, number>;
}

export function initPost(sequelize: Sequelize) {
  Post.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      content: {
        type: DataTypes.STRING(140),
        allowNull: false,
      },
      img: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: "Post",
      tableName: "posts",
      paranoid: false,
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    }
  );
}

export function associatePost(db: DBType) {
  db.Post.belongsTo(db.User);
  db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" });
}
