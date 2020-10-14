const env = require("./env.js");
require("dotenv").config();

const Sequelize = require("sequelize");
console.log(process.env);
const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USERNAME,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: "postgres",
    operatorsAliases: false

    // pool: {
    //   max: env.max,
    //   min: env.pool.min,
    //   acquire: env.pool.acquire,
    //   idle: env.pool.idle
    // }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../model/user.model.js")(sequelize, Sequelize);
db.role = require("../model/role.model.js")(sequelize, Sequelize);
db.meteo = require("../model/meteo.model.js")(sequelize, Sequelize);
db.ftp = require("../model/ftp.model.js")(sequelize, Sequelize);
db.pulse = require("../model/pulse.model.js")(sequelize, Sequelize);
db.gh = require("../model/gh.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

module.exports = db;
