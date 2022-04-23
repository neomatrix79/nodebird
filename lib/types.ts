import { Sequelize } from "sequelize";
import Hashtag from "../models/hashtag";
import Post from "../models/post";
import User from "../models/user";

export interface UserAttributes {
  id: number;
  email: string;
  nick: string;
  password: string;
  provider: string;
  snsId: string;
  Followers?: Array<Follower>;
  Followings?: Array<Following>;
}

export interface Follower {
  id: number;
  email: string;
  nick: string;
  password: string;
  provider: string;
  snsId: string;
}

export interface Following {
  id: number;
  email: string;
  nick: string;
  password: string;
  provider: string;
  snsId: string;
}

export interface PostAttributes {
  id: number;
  content: string;
  img: string;
  userId: number;
}

export interface HashtagAttributes {
  id: number;
  title: string;
}

export interface DBType {
  sequelize?: Sequelize;
  User?: typeof User;
  Post?: typeof Post;
  Hashtag?: typeof Hashtag;
}

export interface UserSetting {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: string;
}
