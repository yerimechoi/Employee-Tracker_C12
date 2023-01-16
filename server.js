const express = require('express');
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: `localhost`,
        user: `root`,
        password: `moomin5454`,
        database: `employeeTracker-db`,
    },
    console.log(`Connected to the employeeTracker_db database.`)
);

function initialQuestions() {
    return inquirer
        .prompt([
            {
                type: `list`,
                message: `What would you like to do?`,
                name: `main`,
                choices: [`View All Employees`, `Add Employee`, `Update Employee Role`, `View All Roles`, `Add Role`, `View All Deparments`, `Add Department`, `Quit`]
            }
        ])
        .then((answer) => {
            switch (answer.action) {
                case `View All Employees`:
                    viewAllEmployees();
                    break;
                case `Add Employee`:
                    addEmployee();
            }
        })
};

function viewAllEmployees() {
    const sql = `SELECT * from employee`;

    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        initialQuestions();
    });
}

function addEmployee() {
    return inquirer
        .prompt([
            {
                type: `input`,
                message: `What is the employee's first & last name?`,
                name: `employeeFullName`
            },
            {
                type: `list`,
                message: `What is the employee's role?`,
                name: `employeeRole`,
                choices: role.title
            },
            {
                type: `list`,
                message: `What is the employee's manager?`,
                name: `employeeManager`,
                choices: employee.fullName
            }
        ]).then((answer) => {
            const sql = `INSERT INTO employee (fullName, role_id, manager_id) 
        VALUES (?, ?, ?)`;
            const userInput = [answer.fullName, answer.role_id, answer.meanager_id];

            db.query(sql, userInput, (err, res) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                    return;
                }
                res.json({
                    message: 'success',
                    data: body
                });
            });
        });
};



app.get('/employee', (req, res) => {
    const sql = `SELECT id, fullName, title, department, salary, manager FROM employee`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

app.get('/role', (req, res) => {
    const sql = `SELECT id, title, department, salary FROM role`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

app.get('/department', (req, res) => {
    const sql = `SELECT id, department FROM department`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

app.post('/add-employee', ({ body }, res) => {
    const sql = `INSERT INTO employee (fullName, title, department, salary, manager) 
        VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [body.fullName, body.title, body.department, body.salary, body.manager];

    db.query(sql, params, (err, results) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

app.listen(PORT, () => {
    console.log(`Connected to server ${PORT}!`);
});

initialQuestions();