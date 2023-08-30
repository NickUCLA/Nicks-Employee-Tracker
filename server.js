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
  inquirer.prompt({
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
  });
}
