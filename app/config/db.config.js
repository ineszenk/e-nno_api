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
  }
);

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

sequelize.sync();

const db = {};

db.Sequelize = Sequelize;
// db.sequelize = sequelize;

db.user = require("../model/user.model.js")(sequelize, Sequelize);
db.role = require("../model/role.model.js")(sequelize, Sequelize);
db.meteo = require("../model/meteo.model.js")(sequelize, Sequelize);
db.ftp = require("../model/ftp.model.js")(sequelize, Sequelize);
db.pulse = require("../model/pulse.model.js")(sequelize, Sequelize);
db.gh = require("../model/gh.model.js")(sequelize, Sequelize);
db.kpi = require("../model/kpi.model.js")(sequelize, Sequelize);
db.graphics = require("../model/graphics.model.js")(sequelize, Sequelize);
db.conso = require("../model/conso_brut.model.js")(sequelize, Sequelize);
db.kwh_conso = require("../model/kwh_conso.model.js")(sequelize, Sequelize);

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

const pgp = require("pg-promise")(/* initialization options */);

const cn = {
  host: process.env.STATIC_HOST, // server name or IP address;
  port: 5432,
  database: "postgres",
  user: process.env.STATIC_USERNAME,
  password: process.env.STATIC_PASSWORD
};

const static_db = pgp(cn); // database instance;

module.exports = { db, static_db };
