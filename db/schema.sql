-- drop database if it exists --
DROP DATABASE IF EXISTS employees_db;
-- create the employee database --
CREATE DATABASE employees_db;

-- use employee database --
USE employees_db;

-- Creates the table "department" within employees_db --
CREATE TABLE department (
  -- Creates a numeric column called "id" which cannot contain null, increments, and is the primary key--
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  -- Makes a string column called "name" which cannot contain null --
  name VARCHAR(30) NOT NULL
);

-- Creates the table "role" within employees_db --
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  -- Makes a decimal column called "salary" --
  salary DECIMAL,
  -- Makes a numeric column called "department_id" which references the id in department to retrieve the employees department --
  department_id INT, 
  FOREIGN KEY (department_id)
    REFERENCES department(id) 
  -- If the referenced department is deleted the department_id value is set to null --
    ON DELETE SET NULL
);

-- Creates the table "employee" within employees_db --
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  -- Makes a numeric column called "role_id" which references the id in role to retrieve the employees role --
  FOREIGN KEY (role_id)
    REFERENCES role(id) 
    ON DELETE SET NULL,
  -- Makes a numeric column called "manager_id" which references the employee id in this table --
  FOREIGN KEY (manager_id) 
    REFERENCES employee(id)
    ON DELETE SET NULL
);
