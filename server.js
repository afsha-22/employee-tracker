const express = require('express');
const mysql = require('mysql2');
const table = require('console.table');
const sequelize = require('./config/connection');
require("dotenv").config();
var inquirer = require('inquirer');

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

// db.query('SELECT * FROM department', function (err, results) {
//     console.table(results);
//   });

// db.query('SELECT * FROM role', function (err, results) {
//     console.table(results);
//   });

// db.query('SELECT * FROM employee', function (err, results) {
//     console.table(results);
//   });



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
    db.query('SELECT * FROM department', function (err, results) {
        console.table(results);
      });
}

app.use((req, res) => {
    res.status(404).end();
});

sequelize.sync({ force: true }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
  });

init();