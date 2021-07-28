const sql = require("mysql2");
const mysql = require("mysql2/promise");
const cTable = require("console.table");
const promise = require("bluebird");

const db = sql.createConnection({
  host: "localhost",
  // MySQL Username
  user: "root",

  password: "password",
  database: "employee_db",
});

const selectAllEmployees = () =>
  db
    .query(
      "SELECT employee.id AS 'Employee ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Job Title', department.name AS 'Department', role.salary AS 'Salary', concat(manager.first_name,' ',manager.last_name) AS'Manager'FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id INNER JOIN manager ON employee.manager_id = manager.id;",
      function (err, results) {
        console.table(results);
      }
    )
    .then(() => mainMenu());

const selectAllDepartments = () =>
  db.query("SELECT * FROM department;", function (err, results) {
    console.table(results);
  });

const selectAllRoles = () =>
  db.query(
    "SELECT role.title AS 'Job Title', role.id as'Role ID', department.name AS 'Department', role.salary AS 'Salary' FROM role INNER JOIN department ON role.department_id = department.id;",
    function (err, results) {
      console.table(results);
    }
  );

const employeeByDept = (dept) =>
  db.query(
    `SELECT department.name AS 'Department', concat(employee.first_name,' ',employee.last_name) AS 'Employee Name', role.title AS 'Job Title' FROM employee INNER JOIN role
    ON employee.role_id = role.id
    INNER JOIN department
    ON role.department_id = department.id
    WHERE department.name = ?;`,
    dept,
    function (err, results) {
      console.table(results);
    }
  );

module.exports = {
  selectAllEmployees,
  selectAllDepartments,
  selectAllRoles,
  employeeByDept,
};
