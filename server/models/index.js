const env = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(env.DB, env.USER, env.PASSWORD, {
  host: env.HOST,
  dialect: env.dialect,
  pool: {
    max: env.pool.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize);
// db.files = require("./file.model.js")(sequelize, Sequelize);

module.exports = db;