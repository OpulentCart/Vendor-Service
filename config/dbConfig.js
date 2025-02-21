const { Sequelize } = require("sequelize");
require("dotenv").config();

// Create a new Sequelize instance to connect to the PostgreSQL database
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "postgres",
  port: process.env.DB_PORT,
  logging: false,
});

// Authenticate the connection to the database
sequelize
  .authenticate()
  .then(() => console.log("✅ Connected to PostgreSQL RDS"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

module.exports = sequelize;
