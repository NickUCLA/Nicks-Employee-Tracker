const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    // MySQL password
    password: "",
    database: "employeeTracker_db",
  },
  console.log(`Connected to the employeeTracker_db database.`)
);

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database");
  start();
});

// makes promt in terminal
function start() {
  inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "View Employees by Manager",
        "View Employees by Department",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View all departments":
          viewAllDepartments();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "View all employees":
          viewAllEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Add a Manager":
          addManager();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
        case "View Employees by Manager":
          viewEmployeesByManager();
          break;
        case "View Employees by Department":
          viewEmployeesByDepartment();
          break;
        case "Exit":
          console.log("Exiting application");
          db.end();
          break;
        default:
          console.log("Invalid choice");
          break;
      }
    });
}

// lets user view all departments
function viewAllDepartments() {
  const query = "SELECT * FROM departments";
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
}

// lets user view all titles in roles
function viewAllRoles() {
  const query = "SELECT * FROM roles";
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
}

// lets user view all employees
function viewAllEmployees() {
  const query = "SELECT * FROM employees";
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
}

// lets user add a department
function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      name: "name",
      message: "Enter new department name.",
    })
    .then((answer) => {
      console.log(answer.name);
      const query = `INSERT INTO departments (department_name) VALUES ("${answer.name}")`;
      db.query(query, (err, res) => {
        if (err) throw err;
        console.log(`Added ${answer.name} to departments`);
        start();
        console.log(answer.name);
      });
    });
}

// lets user add a title to an employee
function addRole() {
  const query = "SELECT * FROM departments";
  db.query(query, (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Enter the new title name for the role.",
        },
        {
          type: "input",
          name: "salary",
          message: "Enter the salary for the new role.",
        },
        {
          type: "list",
          name: "department",
          message: "Select department for new role.",
          choices: res.map((departments) => departments.department_name),
        },
      ])
      .then((answer) => {
        const department = res.find(
          (department) => department.department_name === answer.department
        );
        console.log(answer.title);
        const query = "INSERT INTO roles SET ?";
        db.query(
          query,
          {
            title: answer.title,
            salary: answer.salary,
            department_id: department.id,
          },
          (err, res) => {
            if (err) throw err;
            console.log(
              `Added role ${answer.title} with a salary of ${answer.salary} to the ${answer.department} department.`
            );
            start();
          }
        );
      });
  });
}

// adds an employee
function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter the employee's first name",
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter the employee's last name",
      },
      {
        type: "input",
        name: "role",
        message: "Enter the employee's role id",
        validate: function (input) {
          const value = parseInt(input);
          if (!Number.isNaN(value)) {
            return true;
          }
          return "Please enter a valid number.";
        },
      },
      {
        type: "input",
        name: "manager",
        message: "Enter employees manager id",
        validate: function (input) {
          const value = parseInt(input);
          if (!Number.isNaN(value)) {
            return true;
          }
          return "Please enter a valid number.";
        },
      },
    ])
    .then((answer) => {
      console.log(answer);

      const query = "INSERT INTO employees SET ?";

      db.query(
        query,
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: answer.role,
          manager_id: answer.manager,
        },
        (err, res) => {
          if (err) throw err;
          console.log(
            `Added employee ${answer.firstName} ${answer.lastName} with role ID ${answer.role} under manager ID ${answer.manager}.`
          );
          start();
        }
      );
    });
}

// updates employees manager
function addManager() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter the employee's first name",
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter the employee's last name",
      },
      {
        type: "input",
        name: "newManagerId",
        message: "Enter employees new manager's ID",
      },
    ])
    .then((answer) => {
      const query =
        "UPDATE employees SET manager_id = ? WHERE first_name = ? AND last_name = ?";
      db.query(
        query,
        [answer.newManagerId, answer.firstName, answer.lastName],
        (err, result) => {
          if (err) throw err;

          console.log(
            `Updated manager for employee ${answer.firstName} ${answer.lastName}.`
          );
          start();
        }
      );
    });
}

function updateEmployeeRole() {
  const queryRoles = "SELECT title FROM roles";
  db.query(queryRoles, (err, resRoles) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          name: "firstName",
          message: "Enter the employee's first name",
        },
        {
          type: "input",
          name: "lastName",
          message: "Enter the employee's last name",
        },
        {
          type: "list",
          name: "newTitle",
          message: "Select employees new title",
          choices: resRoles.map((roles) => roles.title),
        },
      ])
      .then((answer) => {
        const query =
          "UPDATE employees SET role_id = (SELECT id FROM roles WHERE title = ?) WHERE employees.first_name = ? AND employees.last_name = ?";
        db.query(
          query,
          [answer.newTitle, answer.firstName, answer.lastName],
          (updateErr, updateRes) => {
            if (updateErr) throw updateErr;
            console.log(
              `Updated title for employee ${answer.firstName} ${answer.lastName}.`
            );
            start();
          }
        );
      });
  });
}

function viewEmployeesByManager() {
  const query = `
  SELECT
    CONCAT(m.first_name, ' ', m.last_name) AS manager_name,
    e.id AS employee_id,
    CONCAT(e.first_name, ' ', e.last_name) AS employee_name
  FROM
    employees e
  JOIN
    employees m ON e.manager_id = m.id
  ORDER BY
    manager_name, employee_name;
`;
  db.query(query, (err, results) => {
    if (err) throw err;
    console.log("Employees grouped by manager:");
    console.table(results);

    start();
  });
}

function viewEmployeesByDepartment() {
  const query = `
    SELECT
      CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
      r.title AS employee_title,
      d.department_name AS department_name
    FROM
      employees e
    JOIN
      roles r ON e.role_id = r.id
    JOIN
      departments d ON r.department_id = d.id
    ORDER BY
      department_name, employee_name;
  `;

  db.query(query, (err, results) => {
    if (err) throw err;
    console.log("Employees grouped by department:");
    console.table(results);

    start();
  });
}
