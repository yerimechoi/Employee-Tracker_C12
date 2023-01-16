INSERT INTO employee (fullName, role_id, manager_id)
VALUES ("John Doe", "1", "null"),
       ("Mike Chan", "2", "1"),
       ("Ashley Rodriguez", "3", "null"),
       ("Kevin Tupik", "4", "3"),
       ("Kunal Singh", "5", "null")
       ("Malia Brown", "6", "5"),
       ("Sarah Lourd", "7", "null"),
       ("Tom Allen", "8", "7"),

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", "100000", "4"),
       ("Salesperson", "80000", "4"),
       ("Lead Engineer", "100000", "1"),
       ("Software Engineer", "80000", "1"),
       ("Account Manager", "160000", "2"),
       ("Accountant", "75000", "2"),
       ("Legal Team Lead", "250000", "3"),
       ("Lawyer", "190000", "3");

INSERT INTO department (department)
VALUES ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Sales");
