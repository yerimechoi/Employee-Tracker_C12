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
    console.log(`Welcome to Employee Manager!`)
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
                choices: [`View All Employees`, `Add Employee`, `Delete Employee`, `View All Roles`, `Add Role`, `Update Employee Role`, `Delete Role`, `View All Deparments`, `Add Department`, `Delete Department`, `Quit`]
            }
        ])
        .then((answer) => {
            switch (answer.main) {
                case `View All Employees`:
                    viewAllEmployees();
                    break;
                case `Add Employee`:
                    addEmployee();
                    break;
                case `Delete Employee`:
                    deleteEmployee();
                    break;
                case `View All Roles`:
                    viewAllRoles();
                    break;
                case `Add Role`:
                    addRole();
                    break;
                case `Update Employee Role`:
                    updateEmployeeRole();
                    break;
                case `Delete Role`:
                    deleteRole();
                    break;
                case `View All Deparments`:
                    viewAllDepartments();
                    break;
                case `Add Department`:
                    addDepartment();
                    break;
                case `Delete Department`:
                    deleteDepartment();
                    break;
                case `Quit`:
                    console.log("Goodbye!");
                    process.exit();
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
                name: `role_id`,
            },
            {
                type: `input`,
                message: `What is the employee's manager? (Enter the manager id associated with the manager)`,
                name: `manager_id`,
            }
        ]).then((answer) => {
            const sql = `INSERT INTO employee (fullName, role_id, manager_id) VALUES (?, ?, ?);`
            userInput = [answer.fullName, answer.role_id, answer.manager_id];

            db.query(sql, userInput, (err) => {
                if (err) throw err;
                console.log(`Employee added!`);

                db.query(`SELECT employee.id,
                employee.fullName AS name,
                roles.title AS title,
                department.department AS department,
                roles.salary AS salary,
                CONCAT(manager.fullName) AS manager
                FROM employee
                LEFT JOIN roles ON employee.role_id = roles.id
                LEFT JOIN department ON roles.department_id = department.id
                LEFT JOIN employee manager ON employee.manager_id = manager.id
                ORDER BY employee.id`, (err, res) => {
                    if (err) throw err;
                    console.table(res);

                    initialQuestions();
                });
            });
        });
};

function deleteEmployee() {
    return inquirer
    .prompt([
        {
            type: `input`,
            message: `What is the employee's first & last name you want to delete?`,
            name: `fullName`
        }
    ]).then((answer) => {
        const sql = `DELETE FROM employee WHERE fullName = ?`;
        userInput = [answer.fullName];

        db.query(sql, userInput, (err) => {
            if (err) throw err;
            console.log(`Employee deleted!`);

            db.query(`SELECT employee.id,
            employee.fullName AS name,
            roles.title AS title,
            department.department AS department,
            roles.salary AS salary,
            CONCAT(manager.fullName) AS manager
            FROM employee
            LEFT JOIN roles ON employee.role_id = roles.id
            LEFT JOIN department ON roles.department_id = department.id
            LEFT JOIN employee manager ON employee.manager_id = manager.id
            ORDER BY employee.id`, (err, res) => {
                if (err) throw err;
                console.table(res);

                initialQuestions();
            });
        });
    });
}


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
                name: `fullName`
            },
            {
                type: `input`,
                message: `What is the new role id associated with the employee? (Enter the role id associated with the role)`,
                name: `role_id`,
            },
        ]).then((answer) => {
            const sql = `UPDATE employee SET role_id = ? WHERE fullName = ?`
            userInput = [answer.role_id, answer.fullName];

            db.query(sql, userInput, (err) => {
                if (err) throw err;
                console.log(`Employee Updated!`);

                db.query(`SELECT employee.id,
                employee.fullName AS name,
                roles.title AS title,
                department.department AS department,
                roles.salary AS salary,
                CONCAT(manager.fullName) AS manager
                FROM employee
                LEFT JOIN roles ON employee.role_id = roles.id
                LEFT JOIN department ON roles.department_id = department.id
                LEFT JOIN employee manager ON employee.manager_id = manager.id
                ORDER BY employee.id`, (err, res) => {
                    if (err) throw err;
                    console.table(res);

                    initialQuestions();
                });
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
                name: `department_id`,
            }
        ]).then((answer) => {
            const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);`
            userInput = [answer.title, answer.salary, answer.department_id];

            db.query(sql, userInput, (err) => {
                if (err) throw err;
                console.log(`Role added!`);

                db.query(`SELECT roles.id, 
                roles.title AS title, 
                department.department AS department, 
                roles.salary AS salary 
                FROM roles 
                LEFT JOIN department ON roles.department_id = department.id`, (err, res) => {
                    if (err) throw err;
                    console.table(res);

                    initialQuestions();
                });
            });
        });
};

function deleteRole() {
    return inquirer
    .prompt([
        {
            type: `input`,
            message: `What is the role title you want to delete?`,
            name: `title`
        }
    ]).then((answer) => {
        const sql = `DELETE FROM roles WHERE title = ?`;
        userInput = [answer.title];

        db.query(sql, userInput, (err) => {
            if (err) throw err;
            console.log(`Role deleted!`);

            db.query(`SELECT roles.id, 
            roles.title AS title, 
            department.department AS department, 
            roles.salary AS salary 
            FROM roles 
            LEFT JOIN department ON roles.department_id = department.id`, (err, res) => {
                if (err) throw err;
                console.table(res);

                initialQuestions();
            });
        });
    });
}



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
                if (err) throw err;
                console.log(`Department added!`);

                db.query(`SELECT * FROM department`, (err, res) => {
                    if (err) throw err;
                    console.table(res);

                    initialQuestions();
                });
            });
        });
};

function deleteDepartment() {
    return inquirer
    .prompt([
        {
            type: `input`,
            message: `What is the department you want to delete?`,
            name: `department`
        }
    ]).then((answer) => {
        const sql = `DELETE FROM department WHERE department = ?`;
        userInput = [answer.department];

        db.query(sql, userInput, (err) => {
            if (err) throw err;
            console.log(`Department deleted!`);

            db.query(`SELECT * FROM department`, (err, res) => {
                if (err) throw err;
                console.table(res);

                initialQuestions();
            });
        });
    });
}
