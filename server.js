const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "Preserves7!",
    database: "employeeTracker_db",
  },
  console.log(`Connected to the employeeTracker_db database.`)
);

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database");
  start();
});

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
        "Add a Manager",
        "Update an employee role",
        "View Employees by Manager",
        "View Employees by Department",
        "Delete Departments | Roles | Employees",
        "View the total utilized budget of a department",
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
        case "Delete Departments | Roles | Employees":
          deleteData();
          break;
        case "View the total utilized budget of a department":
          viewDepartmentBudget();
          break;
        case "Exit":
          console.log("Exiting application");
          db.end(); // Assuming you have a MySQL connection named 'connection'
          break;
        default:
          console.log("Invalid choice");
          break;
      }
    });
}

function viewAllDepartments() {
  const query = "SELECT * FROM departments";
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
}

function viewAllRoles() {
  const query = "SELECT * FROM roles";
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
}

function viewAllEmployees() {
  const query = "SELECT * FROM employees";
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
}

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

// need to convert department name to id
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
          (department) => department.name === answer.department
        );
        console.log(answer.title);
        const query = "INSERT INTO roles SET ?";
        db.query(
          query,
          {
            title: answer.title,
            salary: answer.salary,
            department_id: department,
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
