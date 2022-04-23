import {
  Sequelize,
  Model,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  BelongsToManyAddAssociationMixin,
} from "sequelize";
import { UserAttributes, DBType, Follower, Following } from "../lib/types";
import Post from "./post";
// import Hashtag from './hashtag'

export default class User extends Model<UserAttributes> {
  id: number;
  email: string;
  nick: string;
  password: string;
  provider: string;
  snsId: string;
  Followers?: Array<Follower>;
  Followings?: Array<Following>;

  // Post 관계
  getPosts: HasManyGetAssociationsMixin<Post>;
  addPost: HasManyAddAssociationMixin<Post, number>;
  addPosts: HasManyAddAssociationsMixin<Post, number>;
  setPosts: HasManySetAssociationsMixin<Post, number>;
  removePost: HasManyRemoveAssociationMixin<Post, number>;
  removePosts: HasManyRemoveAssociationsMixin<Post, number>;
  hasPost: HasManyHasAssociationMixin<Post, number>;
  hasPosts: HasManyHasAssociationsMixin<Post, number>;

  // User 관계
  addFollowing: BelongsToManyAddAssociationMixin<User, number>;
}

export function initUser(sequelize: Sequelize) {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(40),
        allowNull: true,
        unique: true,
      },
      nick: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      provider: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "local",
      },
      snsId: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: "User",
      tableName: "users",
      paranoid: true,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
}

export function associateUser(db: DBType) {
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
