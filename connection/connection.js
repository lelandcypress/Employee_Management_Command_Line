const sql = require("mysql2");

const db = sql.createConnection({
  host: "localhost",
  // MySQL Username
  user: "root",

  password: "password",
  database: "employee_db",
});

module.exports = { sql, db };
