const sql = require("mysql2");
const cTable = require("console.table");

const db = sql.createConnection(
  {
    host: "localhost",
    // MySQL Username
    user: "root",

    password: "password",
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

const selectAllEmployees = () =>
  db.query("SELECT * FROM employee;", function (err, results) {
    console.table(results);
  });

module.exports = { selectAllEmployees };
