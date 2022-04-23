// 'use strict';

// var fs        = require('fs');
// var path      = require('path');
// var Sequelize = require('sequelize');
// var basename  = path.basename(__filename);
// var env       = process.env.NODE_ENV || 'development';
// var config    = require(__dirname + '/..\config\config.json')[env];
// var db        = {};

// if (config.use_env_variable) {
//   var sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   var sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
//   })
//   .forEach(file => {
//     var model = sequelize['import'](path.join(__dirname, file));
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;

import { Sequelize, Options } from "sequelize";
import { DBType, UserSetting } from "../lib/types";
import User, { initUser, associateUser } from "./user";
import Post, { initPost, associatePost } from "./post";
import Hashtag, { initHashtag, associateHashtag } from "./hashtag";
import configJson from "../config/config.json";

const env = process.env.NODE_ENV || "development";

export const db: DBType = {};

const jsonStrData = JSON.stringify(configJson);
const config: UserSetting = JSON.parse(jsonStrData)[env];

const options: Options = {
  database: config.database,
  username: config.username,
  password: config.password,
  dialect: "mysql",
  host: config.host,
};

console.log(options);

const sequelize = new Sequelize(options);

db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Hashtag = Hashtag;

initUser(sequelize);
initPost(sequelize);
initHashtag(sequelize);

associateUser(db);
associatePost(db);
associateHashtag(db);
