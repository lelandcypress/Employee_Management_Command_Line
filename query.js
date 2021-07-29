const { db, sql } = require("./connection/connection");
const cTable = require("console.table");
const initInquirer = require("./index");
//Reference All Queries below//

//Display all Employees Query//
const selectAllEmployees = () =>
  db.query(
    `SELECT employee.id AS 'Employee ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Job Title', department.name AS 'Department', role.salary AS 'Salary', concat(manager.first_name,' ',manager.last_name) AS'Manager'
    FROM employee 
    INNER JOIN role 
    ON employee.role_id = role.id 
    INNER JOIN department 
    ON role.department_id = department.id 
    INNER JOIN manager 
    ON employee.manager_id = manager.id;`,
    function (err, results) {
      if (err) {
        console.error(err);
      } else {
        console.table(results);
      }
    }
  );
//Display all Departments Query//
const selectAllDepartments = () =>
  db.query("SELECT * FROM department;", function (err, results) {
    console.table(results);
  });
//Add Employee Query//
const addEmployee = (first, last, role, manager) =>
  db.query(
    `INSERT INTO employee(first_name,last_name,role_id,manager_id)
VALUES(?,?,(SELECT id 
FROM role 
WHERE role.title = ?),(SELECT id
FROM manager
WHERE concat(manager.first_name,' ',manager.last_name) = ?));`,
    [first, last, role, manager],
    function (err, results) {
      if (err) {
        console.log(err);
      } else {
        console.log("Employee Added");
      }
    }
  );
//Add New Department Query//
const addDepartment = (dept) =>
  db.query(
    `INSERT INTO department(name)
VALUES (?)`,
    dept,
    function (err, results) {
      if (err) {
        console.log(err);
      } else {
        console.log("Department Added");
      }
    }
  );
//Adds New Role Query/
const addRole = (name, salary, dept) =>
  db.query(
    `INSERT INTO role(title,salary,department_id)
VALUES (?,?,(SELECT id from department WHERE department.name = ?));`,
    [name, salary, dept],
    function (err, results) {
      if (err) {
        console.log(err);
      } else {
        console.log("Role Added");
      }
    }
  );
//Update Manager Query//
const updateManager = (manager, employee) => {
  db.query(
    `UPDATE employee
SET manager_id = (SELECT id FROM manager WHERE concat(manager.first_name,' ',manager.last_name) = ? )
WHERE employee.id = ?;`,
    [manager, employee],
    function (err, results) {
      if (err) {
        console.log(err);
      } else {
        console.log("Manager Updated");
      }
    }
  );
};
//Update Employee Role Query
const updateEmpRole = (role, employee) => {
  db.query(
    `UPDATE employee
SET role_id = (SELECT id FROM role WHERE title = ?)
WHERE employee.id = ?;`,
    [role, employee],
    function (err, results) {
      if (err) {
        console.log(err);
      } else {
        console.log("Role Updated");
      }
    }
  );
};
//Deletes department Query//
const deleteDepartment = (dept) =>
  db.query(
    `DELETE FROM department
    WHERE department.name =?`,
    dept,
    function (err, results) {
      if (err) {
        console.log(err);
      } else {
        console.log("Department Deleted");
      }
    }
  );
//Display all roles Query//
const selectAllRoles = () =>
  db.query(
    "SELECT role.title AS 'Job Title', role.id as'Role ID', department.name AS 'Department', role.salary AS 'Salary' FROM role INNER JOIN department ON role.department_id = department.id;",
    function (err, results) {
      console.table(results);
    }
  );
//Employee by Department Query//
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
//Employee by Manager Query//
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
//Budget by All Departments Query//
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
//Budget by Department Query//
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
//Delete Employee Query//
const deleteEmployee = (emp) =>
  db.query(
    `DELETE FROM employee
    WHERE employee.id =?`,
    emp,
    function (err, results) {
      if (err) {
        console.log(err);
      } else {
        console.log("Employee Deleted");
      }
    }
  );
//Delete Role Query//
const deleteRole = (title) =>
  db.query(
    `DELETE FROM role
    WHERE role.title =?`,
    title,
    function (err, results) {
      if (err) {
        console.log(err);
      } else {
        console.log("Job Deleted");
      }
    }
  );

module.exports = {
  selectAllEmployees,
  selectAllDepartments,
  selectAllRoles,
  addEmployee,
  employeeByDept,
  addRole,
  updateEmpRole,
  updateManager,
  employeeByManager,
  budgetAll,
  budgetByDept,
  addDepartment,
  deleteDepartment,
  deleteEmployee,
  deleteRole,
};
