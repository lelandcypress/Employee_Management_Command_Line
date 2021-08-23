const db = require("./connection");

class DBMethods {
  constructor() {
    this.db = db;
  }
  ///Double check to make sure query is the right word.
  //view all emps
  viewEmps() {
    return this.db.promise().query(
      `SELECT employee.id AS 'Employee ID', concat(employee.first_name,' ', employee.last_name) AS 'Name', role.title AS 'Title', department.name AS 'Department', role.salary AS 'Salary', concat(manager.first_name,' ',manager.last_name) AS'Manager'
    FROM employee 
    INNER JOIN role 
    ON employee.role_id = role.id 
    INNER JOIN department 
    ON role.department_id = department.id 
    INNER JOIN manager 
    ON employee.manager_id = manager.id;`
    );
  }

  //view all dep
  viewDep() {
    return this.db.promise().query(`SELECT * FROM department;`);
  }
  //veiw roles
  viewRoles() {
    return this.db.promise().query(
      `SELECT role.title AS 'Title', role.id as'Role ID', department.name AS 'Department', role.salary AS 'Salary' 
      FROM role 
      INNER JOIN department 
      ON role.department_id = department.id;`
    );
  }

  addEmployee(first, last, role, manager) {
    return this.db.promise().query(
      `INSERT INTO employee(first_name,last_name,role_id,manager_id)
    VALUES(?,?,(SELECT id 
      FROM role 
      WHERE role.title = ?),(SELECT id
        FROM manager
WHERE concat(manager.first_name,' ',manager.last_name) = ?));`,
      [first, last, role, manager]
    );
  }
  addDepartment(name) {
    return this.db.promise().query(
      `INSERT INTO department(name)
      VALUES (?)`,
      name
    );
  }
  addRole(title, salary, department) {
    return this.db.promise().query(
      `INSERT INTO role(title,salary,department_id)
      VALUES (?,?,(SELECT id from department WHERE department.name = ?));`,
      [title, salary, department]
    );
  }

  selectManager() {
    return this.db
      .promise()
      .query(
        `SELECT concat(manager.first_name,' ',manager.last_name) as name FROM manager;`
      );
  }

  updateManager(manager, employee) {
    return this.db.promise().query(
      `UPDATE employee
SET manager_id = (SELECT id FROM manager WHERE concat(manager.first_name,' ',manager.last_name) = ? )
WHERE employee.id = ?;`,
      [manager, employee]
    );
  }

  updateEmpRole(role, employee) {
    return this.db.promise().query(
      `UPDATE employee
    SET role_id = (SELECT id FROM role WHERE title = ?)
    WHERE employee.id =?   
    ;`,
      [role, employee]
    );
  }
  deleteDepartment(dep) {
    return this.db.promise().query(
      `DELETE FROM department
    WHERE department.name =?`,
      dep
    );
  }

  deleteRole(name) {
    return this.db
      .promise()
      .query(`DELETE FROM role WHERE role.title =?`, [name]);
  }

  employeeByManager(man) {
    return this.db.promise().query(
      ` SELECT  concat(manager.first_name,' ',manager.last_name) AS 'Manager', concat(employee.first_name,' ',employee.last_name) AS 'Name'  
      FROM employee
      INNER JOIN manager
      ON employee.manager_id = manager.id
      WHERE concat(manager.first_name,' ',manager.last_name) = ?;`,
      man
    );
  }

  budgetAll() {
    return this.db.promise().query(
      ` SELECT DISTINCT department.name AS 'Department', SUM(role.salary) AS 'Staff Budget'
        FROM department
        LEFT JOIN role
        ON department.id = role.department_id
        LEFT JOIN employee
        ON employee.role_id = role.id
        GROUP BY department.name;`
    );
  }

  budgetByDept(dep) {
    return this.db.promise().query(
      ` SELECT DISTINCT department.name AS 'Department', SUM(role.salary) AS 'Staff Budget'
          FROM department
          INNER JOIN role
          ON department.id = role.department_id
          INNER JOIN employee
          ON employee.role_id = role.id
          WHERE department.name =?;`,
      dep
    );
  }

  deleteEmployee(name) {
    return this.db.promise().query(
      `DELETE FROM employee
            WHERE concat(first_name,' ',last_name) =?; `,
      name
    );
  }

  employeeByDept(dep) {
    return this.db.promise().query(
      `SELECT department.name AS 'Department', concat(employee.first_name,' ',employee.last_name) AS 'Employee Name', role.title AS 'Job Title' FROM employee INNER JOIN role
      ON employee.role_id = role.id
      INNER JOIN department
      ON role.department_id = department.id
      WHERE department.name = ?;`,
      dep
    );
  }
}

module.exports = DBMethods;
