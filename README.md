# EMPLOYEE TRACKER

![The Employee Tracker application](./asset/demo.gif)

> **Note**: The above mockup is not the true representation. Please try yourself for better experience.

Demonstration video including walkthrough of the functionalities : https://youtu.be/fpRxitvNABc

## Objectives & Functionalities:

1. User is provided with a database solution to store Employee related information.
2. To begin with, schema and seed sql is provided to setup the database.
1. User will be presented with a list of actions that can be performed like: 
            "View all employees",
            "View all employees by manager",
            "View all employees by department",
            "Add employee",
            "Delete employee",
            "Update employee role",
            "View all roles",
            "Add role",
            "Delete role",
            "View all departments",
            "Add department",
            "Delete department",
            "Quit",
3. User will have the ability to view, update and delete rows from the database.
2. Depending on the action user selects, database query will be run to get the response.

## How to run it

1. Download the copy of the project and open it in an IDE (preferably Visual Studio).
2. Run `npm install` from the root folder to install all the dependencies.
3. Open the shell using `mysql -u root -p` and run `source db/schema.sql` followed by `source db/seeds.sql`, this will create the database, tables and insert few values. Once done `exit` the shell.
4. From the root folder, run `npm start`, user will be presented with the options.
5. When selected to just view the file, result will be shown on the screen followed by the same list to either perform another action or quit.
6. When decide to update or delete any information from the database, user will be asked few relevant questions and action will be performed accordingly.