const express = require('express');
const mysql = require('mysql2');
const table = require('console.table');
const sequelize = require('./config/connection');
require("dotenv").config();
var inquirer = require('inquirer');
const util = require('util');


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
    // SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.manager
    // FROM ((employee
    // INNER JOIN role ON employee.id=role.department_id)
    // INNER JOIN department ON employee.id=
    db.query('SELECT * FROM employee', function (err, results) {
        console.log('-----------')
        console.table(results);
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

        console.log(`New Employee ${answers.empFirstName} ${answers.emplastName} added to the database`)

        init();
    })
    .catch((err) => {
        console.log(err);
        init();
    })
}

function updateEmployeeRole() {
    init();
}

function viewAllRoles() {
    db.query('SELECT title FROM role', function (err, results) {
        console.table(results);
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

        console.log(`New Role ${answers.roleName} added to the database`)

        init();
    })
}

function viewAllDepartments() {
    db.query('SELECT * FROM department', function (err, results) {
        console.table(results);
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

        console.log(`New department ${answers.departmentName} added to the database`)

        init();
    })
}

function quit() {
    init();
}

app.use((req, res) => {
    res.status(404).end();
});

sequelize.sync({ force: true }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
  });

init();