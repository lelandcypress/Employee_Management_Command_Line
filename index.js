const { listenerCount } = require("events");
const { prompt } = require("inquirer");
const inquirer = require("inquirer");

const {
  selectAllEmployees,
  selectAllDepartments,
  selectAllRoles,
  employeeByDept,
  employeeByManager,
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
      console.log(data.navMenu);
      if (data.navMenu === "View all Employees") {
        selectAllEmployees();
      } else if (data.navMenu === "View all Departments") {
        selectAllDepartments();
      } else if (data.navMenu === "View all Roles") {
        selectAllRoles();
      } else if (data.navMenu === "View Employees by Department") {
        departmentMenu();
      } else if (data.navMenu === "View Employees by Manager") {
        managerMenu();
      }
    });

const mainMenu = () => {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "continue",
        message: "return to main menu?",
      },
    ])
    .then((data) => {
      if (data.continue) {
        initInquirer();
      } else {
        console.log("Have a nice day!");
        return;
      }
    });
};

const departmentMenu = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "Departments",
        choices: ["Accounting", "Marketing", "Operations", "Development", "QA"],
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

initInquirer();

module.exports = mainMenu;
