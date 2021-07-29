const sql = require("mysql2");

const db = sql.createConnection({
  host: "localhost",
  user: "root",

  password: "password",
  database: "employee_db",
});
db.connect(function (err) {
  if (err) throw err;
});
module.exports = { sql, db };
