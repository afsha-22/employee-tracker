INSERT INTO department (name)
VALUES ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 1000, 1),
    ('Salesperson', 800, 1),
    ('Lead Engineer', 1500, 2),
    ('Software Engineer', 1200, 2),
    ('Account Manager', 1600, 3),
    ('Accountant', 1250, 3),
    ('Legal Team Lead', 2500, 4),
    ('Lawyer', 1900, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ('Tina', 'Sharma', 1, NULL),
    ('Riya', 'Mick', 2, NULL),
    ('Matt', 'Boal', 3, NULL),
    ('Jas', 'Kuin', 4, 1),
    ('Tim', 'Gui', 5, 2),
    ('Sydney', 'Koi', 6, NULL),
    ('Pam', 'Roy', 7, NULL),
    ('Jan', 'Bon', 8, NULL);