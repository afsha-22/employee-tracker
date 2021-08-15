const express = require('express');
const mysql = require('mysql2');
const table = require('console.table');
const sequelize = require('./config/connection');
require("dotenv").config();
var inquirer = require('inquirer');
const util = require('util');
const e = require('express');


const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'db_employees'
    },
    console.log(`Connected to the books_db database.`)
);

db.query = util.promisify(db.query);

function init() {
    inquirer.prompt({
        name: "query",
        type: 'list',
        message: 'Please select the below options to run the query and see the results',
        choices: [
            "View all employees",
            "Add employee",
            "Update employee role",
            "View all roles",
            "Add role",
            "View all departments",
            "Add department",
            "Quit",
        ]
    })
    .then((answers) => {
        switch(answers.query) {
            case "View all employees":
                viewAllEmployees();
                break;

            case "Add employee":
                addEmployee();
                break;

            case "Update employee role":
                updateEmployeeRole();
                break;

            case "View all roles":
                viewAllRoles();
                break;

            case "Add role":
                addRole();
                break;

            case "View all departments":
                viewAllDepartments();
                break;

            case "Add department":
                addDepartment();
                break;

            case "Quit":
                quit();
                break;
        }
    })
    // .catch((error) => {
    //     if (error.isTtyError) {
    //     // Prompt couldn't be rendered in the current environment
    //     } else {
    //     // Something else went wrong
    //     }
    // });   
}

function viewAllEmployees() {

    const allEmployees = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id)
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY employee.id;`

    // SELECT employee.id, employee.first_name, employee.last_name,
    // role.title, department.name AS department_name, role.salary,
    // CONCAT(employee.first_name, ' ', employee.last_name) AS manager_name
    // FROM employee
    // LEFT JOIN role
    // ON employee.id=role.id;
    // LEFT JOIN department
    // ON department.id=role.department_id;

    db.query(allEmployees, function (err, results) {
        // console.log('-----------')
        console.table("\n", results);
        init();
      });
}

async function addEmployee() {
    let roles = await db.query('SELECT * FROM role')
    let managers = await db.query('SELECT * FROM employee')
    inquirer.prompt([
        {
            name: "empFirstName",
            type: 'input',
            message: 'Please enter the first name of the Employee',
        },
        {
            name: "emplastName",
            type: 'input',
            message: 'Please enter the last name of the Employee',
        },
        {
            name: "empRole",
            type: 'list',
            message: 'Please enter the role of the Employee',
            choices: roles.map((role) => {
                return {
                    name: role.title,
                    value: role.id
                }
            }),
        },
        {
            name: "empManager",
            type: 'list',
            message: 'Please enter the manager of the Employee',
            choices: managers.map((manager) => {
                return {
                    name: manager.first_name + " " + manager.last_name,
                    value: manager.id
                }
            }),
        }
    ]).then((answers) => {
        db.query('INSERT INTO employee SET ?', {
            first_name: answers.empFirstName,
            last_name: answers.emplastName,
            role_id: answers.empRole, //This needs to be updated later as dep name and not dep id
            manager_id: answers.empManager
        })

        console.log("\n", `New Employee ${answers.empFirstName} ${answers.emplastName} added to the database`)

        init();
    })
    .catch((err) => {
        console.log(err);
        init();
    })
}

async function updateEmployeeRole() {
    let employees = await db.query('SELECT first_name, last_name FROM employee')
    let roles = await db.query('SELECT * FROM role')
    inquirer.prompt([
        {
            name: "empName",
            type: 'list',
            message: 'Please select the employee you want to update',
            choices: employees.map((employee) => {
                return {
                    name: employee.first_name + " " + employee.last_name,
                    value: employee.id
                }
            }),
        },
        {
            name: "empRole",
            type: 'list',
            message: 'Please select the role you want to assign to the Employee',
            choices: roles.map((role) => {
                return {
                    name: role.title,
                    value: role.id
                }
            }),
        }
    ]).then((answers) => {
        db.query('UPDATE employee SET ? WHERE ?', [
            {role_id: answers.empRole},
            {id: answers.empName}
        ]);

        console.log("\n", `Employee updated in the database`)

        init();
    })
    .catch((err) => {
        console.log(err);
        init();
    })
}

function viewAllRoles() {
    db.query('SELECT title FROM role', function (err, results) {
        console.table("\n", results);
      });
    init();
}

function addRole() {
    inquirer.prompt([
        {
            name: "roleName",
            type: 'input',
            message: 'Please enter the name of the Role',
        },
        {
            name: "roleSalary",
            type: 'input',
            message: 'Please enter the salary of the Role',
        },
        {
            name: "roleDept",
            type: 'input',
            message: 'Please enter the name of the department that Role belongs to',
        }
    ]).then((answers) => {
        db.query('INSERT INTO role SET ?', {
            title: answers.roleName,
            salary: answers.roleSalary,
            department_id: answers.roleDept //This needs to be updated later as dep name and not dep id
        });

        console.log("\n", `New Role ${answers.roleName} added to the database`)

        init();
    })
}

function viewAllDepartments() {
    db.query('SELECT * FROM department', function (err, results) {
        console.table("\n", results);
      });
    init();
}

function addDepartment() {
    inquirer.prompt([
        {
        name: "departmentName",
        type: 'input',
        message: 'Please enter the name of new department',
    }
    ]).then((answers) => {
        db.query('INSERT INTO department SET ?', {
            name: answers.departmentName
        });

        console.log("\n", `New department ${answers.departmentName} added to the database`)

        init();
    })
}

function quit() {
    console.log("\n", "Thanks for using the application!")
    // db.end();
}

app.use((req, res) => {
    res.status(404).end();
});

sequelize.sync({ force: true }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
  });

init();