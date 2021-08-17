const DBMethods = require("./db/query");
const { listenerCount } = require("events");
const { prompt } = require("inquirer");
const inquirer = require("inquirer");
const { title } = require("process");
const db = require("./db/connection");
const { method } = require("bluebird");

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
          //"View Employees by Manager",
          //"View Employees by Department",
          "Delete Department",
          "Delete Role",
          //"Delete Employee",
          //"View Department Budget",
          "Quit",
        ],
      },
    ])
    //Evaluates User Selection and runs functions
    .then((data) => {
      switch (data.navMenu) {
        case "View all Employees":
          viewEmployee(); //fixed
          break;
        case "View all Departments": //fixed
          viewDepartments();
          break;
        case "View all Roles": //fixed
          selectRoles();
          break;
        case "Add an Employee":
          newTeammate();
          break;
        case "Add a Department":
          enterDept();
          break;
        case "Add a Role":
          buildRole();
          break;
        case "Update Employee Role":
          updateRole();
          break;
        case "Update Manager":
          updateMan();
          break;
        case "Delete Department":
          removeDep();
          break;
        case "Delete Role":
          removeRole();
          break;

        case "Quit":
          console.log("Goodbye");
          process.exit();
      }
    });

async function viewEmployee() {
  const methods = new DBMethods();

  const employee = await methods.viewEmps();

  console.table(employee[0]);
  initInquirer();
}

async function viewDepartments() {
  const methods = new DBMethods();

  const department = await methods.viewDep();

  console.table(department[0]);
  initInquirer();
}

async function selectRoles() {
  const methods = new DBMethods();

  const roles = await methods.viewRoles();

  console.table(roles[0]);
  initInquirer();
}

async function departmentMenu() {
  depArray = [];
  const methods = await new DBMethods();
  let departments = await methods.viewDep();
  departments = departments[0];
  departments.forEach((element) => depArray.push(element.name));
  inquirer.prompt([
    {
      type: "list",
      name: "Department",
      message: "Please Select department",
      choices: depArray,
    },
  ]);
}

async function EmployeeMenu() {
  let empArray = [];
  const methods = new DBMethods();
  let employees = await methods.viewEmps();
  employees = employees[0];
  employees.forEach((element) => empArray.push(element.Name));

  inquirer.prompt([
    {
      type: "list",
      name: "Employees",
      message: "Please Select Employee",
      choices: empArray,
    },
  ]);
}

async function roleMenu() {
  let roleArray = [];
  const methods = new DBMethods();
  let roles = await methods.viewRoles();
  roles = roles[0];
  roles.forEach((element) => roleArray.push(element.Title));

  await inquirer.prompt([
    {
      type: "list",
      name: "Roles",
      message: "Please Select Role",
      choices: roleArray,
    },
  ]);
}

async function managerMenu() {
  let managerArray = [];
  const methods = await new DBMethods();
  let manager = await methods.selectManager();
  manager = manager[0];
  manager.forEach((element) => managerArray.push(element.name));
  await inquirer.prompt([
    {
      type: "list",
      message: "Assign Manager",
      name: "EEMan",
      choices: managerArray,
    },
  ]);
}

async function buildRole() {
  let depArray = [];
  const methods = await new DBMethods();
  let departments = await methods.viewDep();
  departments = departments[0];
  departments.forEach((element) => depArray.push(element.name));
  const roleName = await inquirer.prompt([
    {
      type: "input",
      name: "role",
      message: "Enter Role Title",
    },
    {
      type: "input",
      name: "salary",
      message: "Enter Salary",
    },

    {
      type: "list",
      name: "Dep",
      message: "Select Department",
      choices: depArray,
    },
  ]);
  const { role, salary, Dep } = roleName;
  await methods.addRole(role, salary, Dep);
  console.log("Role Added");
  initInquirer();
}

async function enterDept() {
  try {
    const methods = await new DBMethods();
    const dep = await inquirer.prompt([
      {
        type: "Input",
        name: "choice",
        message: "Please Enter New Department Name",
      },
    ]);
    const department = dep.choice;
    methods.addDepartment(department);
  } catch (err) {
    console.log(err);
  }
  initInquirer();
}

async function newTeammate() {
  try {
    const newEmpName = await inquirer.prompt([
      {
        type: "input",
        name: "first",
        message: "Enter First Name",
      },
      {
        type: "input",
        name: "last",
        message: "Enter last Name",
      },
    ]);
    let roleArray = [];
    const methods = await new DBMethods();
    let roles = await methods.viewRoles();
    roles = roles[0];
    await roles.forEach((element) => roleArray.push(element.Title));

    const rSelect = await inquirer.prompt([
      {
        type: "list",
        name: "roles",
        message: "Please Select Role",
        choices: roleArray,
      },
    ]);
    let managerArray = [];
    let manager = await methods.selectManager();
    manager = manager[0];
    manager.forEach((element) => managerArray.push(element.name));
    const eeMan = await inquirer.prompt([
      {
        type: "list",
        message: "Assign Manager",
        name: "select",
        choices: managerArray,
      },
    ]);
    const chosenRole = rSelect.roles;
    const chosenManager = eeMan.select;
    const { last, first } = newEmpName;
    await methods.addEmployee(first, last, chosenRole, chosenManager);
  } catch (err) {
    console.log(err);
  }
  initInquirer();
}

async function updateRole() {
  try {
    const employeeList = await inquirer.prompt([
      {
        type: "input",
        name: "employees",
        message: "Enter Employee ID",
      },
    ]);

    let roleArray = [];
    const methods = await new DBMethods();
    let roles = await methods.viewRoles();
    roles = roles[0];
    roles.forEach((element) => roleArray.push(element.Title));

    const roleList = await inquirer.prompt([
      {
        type: "list",
        name: "Roles",
        message: "Please Select Role",
        choices: roleArray,
      },
    ]);
    const selectedEmployee = employeeList.employees;
    const selectedRole = roleList.Roles;
    await methods.updateEmpRole(selectedRole, selectedEmployee);
  } catch (err) {
    console.log(err);
  }
  initInquirer();
}

async function updateMan() {
  try {
    const employeeList = await inquirer.prompt([
      {
        type: "input",
        name: "id",
        message: "Enter Employee ID",
      },
    ]);
    let managerArray = [];
    const methods = await new DBMethods();
    let manager = await methods.selectManager();
    manager = manager[0];
    manager.forEach((element) => managerArray.push(element.name));
    const eeMan = await inquirer.prompt([
      {
        type: "list",
        message: "Assign Manager",
        name: "select",
        choices: managerArray,
      },
    ]);

    const selectedManager = eeMan.select;
    const selectedEmployee = employeeList.id;
    methods.updateManager(selectedManager, selectedEmployee);
  } catch (err) {
    console.log(err);
  }
  initInquirer();
}

async function removeDep() {
  try {
    depArray = [];
    const methods = await new DBMethods();
    let departments = await methods.viewDep();
    departments = departments[0];
    departments.forEach((element) => depArray.push(element.name));
    const dep = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: "Delete Department",
        choices: depArray,
      },
    ]);

    const select = dep.choice;
    methods.deleteDepartment(select);
  } catch (err) {
    console.log(err);
  }
  initInquirer();
}

async function removeRole() {
  try {
    let roleArray = [];
    const methods = await new DBMethods();
    let roles = await methods.viewRoles();
    roles = roles[0];
    await roles.forEach((element) => roleArray.push(element.Title));

    const chosenRole = await inquirer.prompt([
      {
        type: "list",
        name: "roles",
        message: "Please Select Role",
        choices: roleArray,
      },
    ]);
    const select = chosenRole.choice;
    methods.deleteRole(select);
  } catch (err) {
    console.log(err);
  }
  initInquirer();
}

initInquirer();
