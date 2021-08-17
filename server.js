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
            "View all employees by manager",
            "View all employees by department",
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

            case "View all employees by manager":
                viewEmployeesByManager();
                break;
            
            case "View all employees by department":
                viewEmployeesByDepartment();
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
                db.end();
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

    db.query(allEmployees, function (err, results) {
        if(err) {
            console.log(err)
        }
        console.table("\n", results);
        init();
      });
}

function viewEmployeesByManager() {
    const empByManager = `SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, department.name AS department, employee.id, employee.first_name, employee.last_name, role.title
    FROM employee
    JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON role.id = employee.role_id
    INNER JOIN department ON department.id = role.department_id
    ORDER BY manager;`

    db.query(empByManager, function (err, results) {
        if(err) {
            console.log(err)
        }
        console.table("\n", results);
        init();
    });
}

function viewEmployeesByDepartment() {
    const empByDepartment = `SELECT  department.name AS department, employee.id, employee.first_name, employee.last_name, CONCAT(manager.first_name, ' ', manager.last_name) AS manager, role.title
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON role.id = employee.role_id
    INNER JOIN department ON department.id = role.department_id
    ORDER BY department;`

    db.query(empByDepartment, function (err, results) {
        if(err) {
            console.log(err)
        }
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
            role_id: answers.empRole,
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

function viewEmployeesByDepartment() {
    const empByDepartment = `SELECT  department.name AS department, employee.id, employee.first_name, employee.last_name, CONCAT(manager.first_name, ' ', manager.last_name) AS manager, role.title
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON role.id = employee.role_id
    INNER JOIN department ON department.id = role.department_id
    ORDER BY department;`

    db.query(empByDepartment, function (err, results) {
        if(err) {
            console.log(err)
        }
        console.table("\n", results);
        init();
    });
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
        db.query('UPDATE employee SET role_id = ? WHERE id = ?', [
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
    const allRoles = `SELECT role.id, role.title, department.name AS department, role.salary
    FROM role
    LEFT JOIN department
    ON role.department_id=department.id
    ORDER BY role.id;`

    db.query(allRoles, function (err, results) {
        console.table("\n", results);
      });
    init();
}

async function addRole() {
    let departments = await db.query('SELECT * FROM department')
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
            type: 'list',
            message: 'Please select the name of the department that Role belongs to',
            choices: departments.map((department) => {
                return {
                    name: department.department_name,
                    value: department.name
                }
            }),
        }
    ]).then((answers) => {
        let chosenDepartment = [];
        for (i = 0; i < departments.length; i++) {
            if(departments[i].name === answers.roleDept) {
                chosenDepartment = departments[i].id;
            };
        }
        db.query('INSERT INTO role SET ?', {
            title: answers.roleName,
            salary: answers.roleSalary,
            department_id: chosenDepartment
        });

        console.log("\n", `New Role ${answers.roleName} added to the database`)
        init();
    })
    .catch((err) => {
        console.log(err);
        init();
    })
}

function viewAllDepartments() {
    db.query('SELECT * FROM department', function (err, results) {
        if(err) {
            console.log(err)
        }
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

async function deleteDepartment() {
    let departments = await db.query('SELECT * FROM department')
    inquirer.prompt([
        {
            name: "deptName",
            type: 'list',
            message: 'Please select the department you want to delete',
            choices: departments.map((department) => {
                return {
                    name: department.name,
                    value: department.id
                }
            }),
        }
    ]).then((answers) => {
        db.query('DELETE FROM department WHERE ?', [
            {id: answers.deptName}
        ]);

        console.log("\n", `Department deleted`)
        init();
    })
    .catch((err) => {
        console.log(err);
        init();
    })
}

function quit() {
    console.log("\n", "Thanks for using the application!")
    db.end();
}

app.use((req, res) => {
    res.status(404).end();
});

sequelize.sync({ force: true }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
  });

init();