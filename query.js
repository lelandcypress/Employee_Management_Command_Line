const { db, sql } = require("./connection/connection");
const cTable = require("console.table");
const { prompt } = require("inquirer");
const inquirer = require("inquirer");
require("./index");

// propmt main menu (not the best practice because it is not following the DRY methods - however it is like putting a band-aid on it for temp fix)

//Main Menu//
const menuCall = () =>
  inquirer
    .prompt([
      {
        type: "list",
        name: "navMenu",
        message: "Welcome! Please Select Option",
        choices: [
          "View all Employees",
          "View all Departments",
          "View all Roles",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update Employee Role",
          "Update Manager",
          "View Employees by Manager",
          "View Employees by Department",
          "Delete Department",
          "Delete Role",
          "Delete Employee",
          "View Department Budget",
        ],
      },
    ])
    //Evaluates User Selection and runs functions
    .then((data) => {
      switch (data.navMenu) {
        case "View all Employees":
          selectAllEmployees();
          break;
        case "View all Departments":
          selectAllDepartments();
          break;
        case "View all Roles":
          selectAllRoles();
          break;
        case "Add an Employee":
          buildEmployee();
          break;
        case "Add a Role":
          buildRole();
          break;
        case "Update Employee Role":
          enterNewRole();
          break;
        case "Add a Department":
          enterDept();
          break;

        case "View Employees by Department":
          departmentMenu();
          break;
        case "Update Manager":
          enterManager();
          break;
        case "View Employees by Manager":
          managerMenu();
          break;
        case "Delete Department":
          removeDept();
          break;
        case "Delete Role":
          removeRole();
          break;
        case "Delete Employee":
          removeEmp();
          break;
        case "View Department Budget":
          budgetMenu();
          break;
      }
    });
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
        menuCall();
      }
    }
  );
//Display all Departments Query//
const selectAllDepartments = () =>
  db.query("SELECT * FROM department;", function (err, results) {
    console.table(results);
    menuCall();
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
        menuCall();
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
        menuCall();
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
        menuCall();
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
        menuCall();
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
        menuCall();
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
        menuCall();
      }
    }
  );
//Display all roles Query//
const selectAllRoles = () =>
  db.query(
    "SELECT role.title AS 'Job Title', role.id as'Role ID', department.name AS 'Department', role.salary AS 'Salary' FROM role INNER JOIN department ON role.department_id = department.id;",
    function (err, results) {
      console.table(results);
      menuCall();
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
      menuCall();
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
      menuCall();
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
      menuCall();
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
      menuCall();
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
        menuCall();
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
        menuCall();
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
  menuCall,
};
