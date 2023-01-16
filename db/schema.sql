DROP DATABASE IF EXISTS employeeTracker_db;
CREATE DATABASE employeeTracker_db;

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(60) NOT NULL,
    role_id INT,
    FOREIGN KEY (role_id),
    REFERENCES role(id),
    ON DELETE SET NULL
    manager_id INT,
    FOREIGN KEY (manager_id),
    REFERENCES employee(id),
    ON DELETE SET NULL
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id),
    REFERENCES department(id),
    ON DELETE SET NULL
);

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department VARCHAR(30) NOT NULL,
);
