require("dotenv").config();

const pg = require("pg");
const Sequelize = require("sequelize");
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

// var connectionString = `postgres://${process.env.STATIC_USERNAME}:${process.env.STATIC_PASSWORD}@${process.env.STATIC_ENV}:5432/${process.env.STATIC_DATABASE}`;
// const static_db = new pg.Client({
//   connectionString: connectionString
// });
// static_db.connect;

const pgp = require("pg-promise")(/* initialization options */);

const cn = {
  host: process.env.STATIC_HOST, // server name or IP address;
  port: 5432,
  database: "postgres",
  user: process.env.STATIC_USERNAME,
  password: process.env.STATIC_PASSWORD
};

// alternative:
// var cn = 'postgres://username:password@host:port/database';

const static_db = pgp(cn); // database instance;

// select and return a single user name from id:

module.exports = { db, static_db };
