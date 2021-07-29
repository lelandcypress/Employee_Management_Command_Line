const { listenerCount } = require("events");
const { prompt } = require("inquirer");
const inquirer = require("inquirer");
const { title } = require("process");

const {
  selectAllEmployees,
  selectAllDepartments,
  selectAllRoles,
  addRole,
  updateEmpRole,
  updateManager,
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
        case "View Department Budget":
          budgetMenu();
          break;
      }
    });

const enterNewRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter new role",
        name: "role",
      },
      {
        type: "input",
        message: "Enter Employee ID",
        name: "empId",
      },
    ])
    .then((data) => {
      ({ role, empId } = data);
      updateEmpRole(role, empId);
    });
};
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

const buildRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "Title",
        message: "Enter the role tile",
      },
      {
        type: "input",
        name: "Salary",
        message: "Enter annual salary",
      },
      {
        type: "input",
        name: "Department",
        message: "Enter valid department",
      },
    ])
    .then((data) => {
      addRole(data.Title, data.Salary, data.Department);
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

const enterManager = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "empID",
        message: "Enter Employee ID",
      },
      { type: "input", name: "manager", message: "Enter New Manager" },
    ])
    .then((data) => {
      ({ empID, manager } = data);

      updateManager(manager, empID);
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
