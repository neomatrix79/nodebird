"use strict";
// 'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
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
const sequelize_1 = require("sequelize");
const user_1 = __importStar(require("./user"));
const post_1 = __importStar(require("./post"));
const hashtag_1 = __importStar(require("./hashtag"));
const config_json_1 = __importDefault(require("../config/config.json"));
const env = process.env.NODE_ENV || "development";
exports.db = {};
const jsonStrData = JSON.stringify(config_json_1.default);
const config = JSON.parse(jsonStrData)[env];
const options = {
    database: config.database,
    username: config.username,
    password: config.password,
    dialect: "mysql",
    host: config.host,
};
console.log(options);
const sequelize = new sequelize_1.Sequelize(options);
exports.db.sequelize = sequelize;
exports.db.User = user_1.default;
exports.db.Post = post_1.default;
exports.db.Hashtag = hashtag_1.default;
(0, user_1.initUser)(sequelize);
(0, post_1.initPost)(sequelize);
(0, hashtag_1.initHashtag)(sequelize);
(0, user_1.associateUser)(exports.db);
(0, post_1.associatePost)(exports.db);
(0, hashtag_1.associateHashtag)(exports.db);
//# sourceMappingURL=index.js.map