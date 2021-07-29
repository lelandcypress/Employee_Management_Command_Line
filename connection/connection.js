const sql = require("mysql2");

const db = sql.createConnection({
  host: "localhost",
   user: "root",

  password: "password",
  database: "employee_db",
});

module.exports = { sql, db };
