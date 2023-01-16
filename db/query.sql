SELECT employee.
FROM employee
JOIN role_id ON employee.role_id = role.id
JOIN manager_id ON employee.manager_id = 