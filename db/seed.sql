INSERT INTO department(name)
VALUES
('Accounting'), 
('Marketing'),
('Operations'),
('Development');

INSERT INTO role (title,salary,department_id)
VALUES ('Lead Accountant', 5000.00, 1),
('Chief Marketing Officer', 200000.00,2),
('Project Manager', 75000.00,3),
('Scrum Master', 75000.00,3),
('Junior Developer', 50000.00,4),
('Software Engineer', 75000.00,4),
('Senior Developer', 95000.00,4),
('Database Analyst', 90000.00,4),
('QA Engineer', 70000.00,4),
('Lead Tester', 85000.00,4),
('DevOps Engineer', 70000.00,4);


INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ('Matthew','Smith', 1, 1),
('Frank','Drebbin', 2, 2),
('Joe','Flacco', 3, 3),
('Tom','Brady', 4, 3),
('Frodo','Baggins', 5,4),
('Gregory','Alex', 6, 4),
('Ellen','Sydney', 7, 4),
('Elizabeth','Andrew', 8, 4),
('Michael','Connelly', 9, 4),
('Chris','Hemsbroke', 10, 4),
('Luke','Searunner', 11, 4);

INSERT INTO manager(first_name,last_name, department_id)
VALUES('Carson', 'Wentz', 1),
('Michael','Scott',2),
('Jimmy','Schmidtz',3),
('Jenny','Gump',4);

