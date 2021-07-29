const { listenerCount } = require("events");
const { prompt } = require("inquirer");
const inquirer = require("inquirer");

const {
  selectAllEmployees,
  selectAllDepartments,
  selectAllRoles,
  employeeByDept,
  employeeByManager,
  budgetAll,
  budgetByDept,
  addDepartment,
  deleteDepartment,
} = require("./query");

const initInquirer = () =>
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
        case "Add a Department":
          enterDept();
          break;
        case "View Employees by Department":
          departmentMenu();
          break;
        case "View Employees by Manager":
          managerMenu();
          break;
        case "Delete Department":
          removeDept();
        case "View Department Budget":
          budgetMenu();
          break;
      }
    });



const enterDept = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter Department Name",
        name: "AddDept",
      },
    ])
    .then((data) => {
      console.log(data.AddDept);
      addDepartment(data.AddDept);
    });
};

const removeDept = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter Department Name",
        name: "DelDept",
      },
    ])
    .then((data) => {
      console.log(data.DelDept);
      deleteDepartment(data.DelDept);
    });
};

const departmentMenu = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "Departments",
        message: "Select Department",
        choices: ["Accounting", "Marketing", "Operations", "Development"],
      },
    ])
    .then((data) => {
      employeeByDept(data.Departments);
    });
};

const managerMenu = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "Managers",
        message: "Select Manager",
        choices: [
          "Carson Wentz",
          "Michael Scott",
          "Jimmy Schmidtz",
          "Jenny Gump",
        ],
      },
    ])
    .then((data) => {
      employeeByManager(data.Managers);
    });
};

const budgetMenu = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "Budget",
        message: "Select Department",
        choices: [
          "View All",
          "Accounting",
          "Marketing",
          "Operations",
          "Development",
        ],
      },
    ])
    .then((data) => {
      if (data.Budget === "View All") {
        budgetAll();
      } else {
        budgetByDept(data.Budget);
      }
    });
};

initInquirer();
