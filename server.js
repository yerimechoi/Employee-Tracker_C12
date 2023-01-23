const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: `localhost`,
        user: `root`,
        password: `moomin5454`,
        database: `employeeTracker_db`,
    },
    console.log(`Connected to the employeeTracker_db database.`)
);

db.connect((err) => {
    if (err) throw err;

    initialQuestions();
});

function initialQuestions() {
    return inquirer
        .prompt([
            {
                type: `list`,
                message: `What would you like to do?`,
                name: `main`,
                choices: [`View All Employees`, `Add Employee`, `View All Roles`, `Add Role`, `Update Employee Role`, `View All Deparments`, `Add Department`, `Quit`]
            }
        ])
        .then((answer) => {
            switch (answer.action) {
                case `View All Employees`:
                    viewAllEmployees();
                    break;
                case `Add Employee`:
                    addEmployee();
                    break;
                case `View All Roles`:
                    viewAllRoles();
                    break;
                case `Update Employee Role`:
                    updateEmployeeRole();
                    break;
                case `Add Role`:
                    addRole();
                    break;
                case `View All Deparments`:
                    viewAllDepartments();
                    break;
                case `Add Department`:
                    addDepartment();
                    break;
                case `Quit`:
                    console.log("Goodbye!");
                    process.exit();
                    break;
            }
        }).catch(err => console.error(err));
};

function viewAllEmployees() {
    const sql = `SELECT employee.id,
                 employee.fullName AS name,
                 roles.title AS title,
                 department.department AS department,
                 roles.salary AS salary,
                 CONCAT(manager.fullName) AS manager
                 FROM employee
                 LEFT JOIN roles ON employee.role_id = roles.id
                 LEFT JOIN department ON roles.department_id = department.id
                 LEFT JOIN employee manager ON employee.manager_id = manager.id
                 ORDER BY employee.id`;

    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);

        initialQuestions();
    });
};

function addEmployee() {
    return inquirer
        .prompt([
            {
                type: `input`,
                message: `What is the employee's first & last name?`,
                name: `fullName`
            },
            {
                type: `input`,
                message: `What is the employee's role? (Enter the role id associated with the role)`,
                name: `roleID`,
            },
            {
                type: `input`,
                message: `What is the employee's manager? (Enter the manager id associated with the manager)`,
                name: `managerID`,
            }
        ]).then((answer) => {
            const sql = `INSERT INTO employee (fullName, roleID, managerID) VALUES (?, ?, ?)`
            userInput = [answer.fullName, answer.roleID, answer.managerID];

            db.query(sql, userInput, (err) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                    return;
                }
                console.log(`Employee added!`);

                initialQuestions();
            });
        });
};

function viewAllRoles() {
    const sql = `SELECT roles.id, 
    roles.title AS title, 
    department.department AS department, 
    roles.salary AS salary 
    FROM roles 
    LEFT JOIN department ON roles.department_id = department.id`;

    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);

        initialQuestions();
    });
};

function updateEmployeeRole() {
    return inquirer
    .prompt([
        {
            type: `input`,
            message: `What is the full name of the employee you want to update?`,
            name: `name`
        },
        {
            type: `input`,
            message: `What is the new role id associated with the employee? (Enter the role id associated with the role)`,
            name: `salary`,
        },
    ]).then((answer) => {
        const sql = `INSERT INTO roles (name, salary) VALUES (?, ?)`
        userInput = [answer.name, answer.salary];

        db.query(sql, userInput, (err) => {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            console.log(`Role added!`);

            initialQuestions();
        });
    });
};

function addRole() {
    return inquirer
    .prompt([
        {
            type: `input`,
            message: `What is the name of the role?`,
            name: `title`
        },
        {
            type: `input`,
            message: `What is the salary of the role?`,
            name: `salary`,
        },
        {
            type: `input`,
            message: `Which department does the role belong to? (Enter the department id associated with the role)`,
            name: `roleDepartment`,
        }
    ]).then((answer) => {
        const sql = `INSERT INTO roles (title, salary, roleDepartment) VALUES (?, ?, ?)`
        userInput = [answer.title, answer.salary, answer.roleDepartment];

        db.query(sql, userInput, (err) => {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            console.log(`Role added!`);

            initialQuestions();
        });
    });
};

function viewAllDepartments() {
    const sql = `SELECT * FROM department`;

    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);

        initialQuestions();
    });
};

function addDepartment() {
    return inquirer
    .prompt([
        {
            type: `input`,
            message: `What is the name of the new department?`,
            name: `department`
        },
    ]).then((answer) => {
        const sql = `INSERT INTO department (department) VALUES (?)`
        userInput = [answer.department];

        db.query(sql, userInput, (err) => {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            console.log(`Department added!`);

            initialQuestions();
        });
    });
};