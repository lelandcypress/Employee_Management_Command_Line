const { db, sql } = require("./connection/connection");
const mysql = require("mysql2/promise");
const cTable = require("console.table");
const promise = require("bluebird");

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

const employeeByManager = (manager) =>
  db.query(
    ` SELECT  concat(manager.first_name,' ',manager.last_name) AS 'Manager', concat(employee.first_name,' ',employee.last_name) AS 'Employee Name'  
    FROM employee
    INNER JOIN manager
    ON employee.manager_id = manager.id
    WHERE concat(manager.first_name,' ',manager.last_name) = ?;`,
    manager,
    function (err, results) {
      console.table(results);
    }
  );

const budgetAll = () =>
  db.query(
    ` SELECT DISTINCT department.name AS 'Department', SUM(role.salary) AS 'Staff Budget'
FROM department
INNER JOIN role
ON department.id = role.department_id
INNER JOIN employee
ON employee.role_id = role.id
GROUP BY department.name;`,
    function (err, results) {
      console.table(results);
    }
  );

const budgetByDept = (dept) =>
  db.query(
    ` SELECT DISTINCT department.name AS 'Department', SUM(role.salary) AS 'Staff Budget'
FROM department
INNER JOIN role
ON department.id = role.department_id
INNER JOIN employee
ON employee.role_id = role.id
WHERE department.name =?;`,
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
  employeeByManager,
  budgetAll,
  budgetByDept,
};
