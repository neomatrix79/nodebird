import {
  Sequelize,
  Model,
  DataTypes,
  BelongsToManyGetAssociationsMixin,
} from "sequelize";
import { HashtagAttributes, DBType } from "../lib/types";
import Post from "./post";

export default class Hashtag extends Model<HashtagAttributes> {
  id: number;
  title: string;

  // Post 관계 (Hashtag - Post 는 N : M 관계)
  getPosts: BelongsToManyGetAssociationsMixin<Post>;
}

export function initHashtag(sequelize: Sequelize) {
  Hashtag.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: "Hashtag",
      tableName: "hashtags",
      paranoid: false,
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    }
  );
}

export function associateHashtag(db: DBType) {
  db.Hashtag.belongsToMany(db.Post, { through: "PostHashtag" });
}
