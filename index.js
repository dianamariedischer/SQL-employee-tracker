// Import and require mysql2, inquirer, and console table
const mysql = require('mysql2');
const inquirer = require('inquirer');

// Connect to database
const init = () => {
  const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'rootroot',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
  );

  //use inquirer
  inquirer
    .prompt([
      {
        type: 'list',
        message: 'What would you like to do?',
        name: 'action',
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role"
        ]
      }
    ])
    .then((response) => {
      if (response.action == "View all departments") {
        db.query(`SELECT * FROM department;`, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.table(result);
        });
      }

      if (response.action == "View all roles") {
        db.query(`SELECT * FROM role;`, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.table(result);
        });
      }

      if (response.action == "View all employees") {
        db.query(`SELECT * FROM employee;`, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.table(result);
        });
      }

      if (response.action == "Add a department") {
        inquirer
          .prompt([
            {
              type: 'input',
              message: 'What is the name of the department?',
              name: 'department',
              validate: departmentInput => {
                if (departmentInput) {
                  return true;
                } else {
                  console.log('Please give the department a name.');
                  return false;
                }
              }
            }
          ])
          .then((response) => {
            db.query(`INSERT INTO department (name) VALUES ("${response.department}");`, (err, result) => {
              if (err) {
                console.log(err);
              }
              console.log("New department added.");
            });
          })
      }

      if (response.action == "Add a role") {
        // Get the departments from the database
        db.query(`SELECT * FROM department;`, (err, result) => {
          if (err) {
            console.log(err);
          }
          // Ask the user the name of the role, the salary, and which department it's in
          inquirer
            .prompt([
              {
                type: 'input',
                message: 'What is the name of the role?',
                name: 'role',
                validate: roleInput => {
                  if (roleInput) {
                    return true;
                  } else {
                    console.log('Please give the role a name.');
                    return false;
                  }
                }
              },
              {
                type: 'input',
                message: 'What is the salary of the role?',
                name: 'salary',
                validate: salaryInput => {
                  if (salaryInput) {
                    return true;
                  } else {
                    console.log('Please give the role a salary.');
                    return false;
                  }
                }
              },
              {
                type: 'list',
                message: 'Which department is the role in?',
                name: 'department',
                choices: () => {
                  var array = [];
                  for (var i = 0; i < result.length; i++) {
                    array.push(result[i].name);
                  }
                  return array;
                }
              }
            ])
            .then((response) => {
              for (var i = 0; i < result.length; i++) {
                if (result[i].name === response.department) {
                  var department = result[i];
                }
              }
              db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${response.role}", "${response.salary}", "${department.id}");`, (err, result) => {
                if (err) {
                  console.log(err);
                }
                console.log("New role added.");
              });
            })
        });
      }

      if (response.action == "Add an employee") {
        db.query(`SELECT * FROM employee;`, (err, employeeResult) => {
          if (err) {
            console.log(err);
          }
          db.query(`SELECT * FROM role;`, (err, roleResult) => {
            // Ask the user the name of the employee, their role, and their manager
            inquirer
              .prompt([
                {
                  type: 'input',
                  message: "What is the employee's first name?",
                  name: 'firstname',
                  validate: roleInput => {
                    if (roleInput) {
                      return true;
                    } else {
                      console.log('Please give the employee a first name.');
                      return false;
                    }
                  }
                },
                {
                  type: 'input',
                  message: "What is the employee's last name?",
                  name: 'lastname',
                  validate: salaryInput => {
                    if (salaryInput) {
                      return true;
                    } else {
                      console.log('Please give the employee a last name.');
                      return false;
                    }
                  }
                },
                {
                  type: 'list',
                  message: 'Which role is the employee in?',
                  name: 'role',
                  choices: () => {
                    var array = [];
                    for (var i = 0; i < roleResult.length; i++) {
                      if (!array.includes(roleResult[i].title)) {
                        array.push(roleResult[i].title);
                      }
                    }
                    return array;
                  }
                },
                {
                  type: 'list',
                  message: "Who is the employee's manager?",
                  name: 'manager',
                  choices: () => {
                    var array = [];
                    for (var i = 0; i < employeeResult.length; i++) {
                      if (!array.includes(employeeResult[i].first_name + " " + employeeResult[i].last_name)) {
                        array.push(employeeResult[i].first_name + " " + employeeResult[i].last_name);
                      }
                    }
                    return array;
                  }
                }
              ])
              .then((response) => {

                for (var i = 0; i < roleResult.length + employeeResult.length; i++) {
                  if (roleResult[i].title === response.role) {
                    var role = roleResult[i];
                  }

                  if (employeeResult[i].first_name + " " + employeeResult[i].last_name === response.manager) {
                    var manager = employeeResult[i]
                  }
                }

                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${response.firstname}", "${response.lastname}", "${role.id}", "${manager.id}");`, (err, result) => {
                  if (err) {
                    console.log(err);
                  }
                  console.log("New employee added.");
                });
              })
          })

        });
      }

      if (response.action == "Update an employee role") {
        db.query(`SELECT * FROM employee;`, (err, employeeResult) => {
          if (err) {
            console.log(err);
          }
          db.query(`SELECT * FROM role;`, (err, roleResult) => {
            // Ask the user for the name of the employee, and their new role
            inquirer
              .prompt([
                {
                  type: 'list',
                  message: 'Which employee is changing roles?',
                  name: 'employee',
                  choices: () => {
                    var array = [];
                    for (var i = 0; i < employeeResult.length; i++) {
                      if (!array.includes(employeeResult[i].first_name + " " + employeeResult[i].last_name)) {
                        array.push(employeeResult[i].first_name + " " + employeeResult[i].last_name);
                      }
                    }
                    return array;
                  }
                },
                {
                  type: 'list',
                  message: "What is the employee's new role?",
                  name: 'role',
                  choices: () => {
                    var array = [];
                    for (var i = 0; i < roleResult.length; i++) {
                      if (!array.includes(roleResult[i].title)) {
                        array.push(roleResult[i].title);
                      }
                    }
                    return array;
                  }
                },
                {
                  type: 'list',
                  message: "Who is the employee's new manager?",
                  name: 'manager',
                  choices: () => {
                    var array = [];
                    for (var i = 0; i < employeeResult.length; i++) {
                      if (!array.includes(employeeResult[i].first_name + " " + employeeResult[i].last_name)) {
                        array.push(employeeResult[i].first_name + " " + employeeResult[i].last_name);
                      }
                    }
                    return array;
                  }
                }
              ])
              .then((response) => {

                for (var i = 0; i < roleResult.length; i++) {
                  if (roleResult[i].title === response.role) {
                    var role = roleResult[i];
                  }
                }
                console.log(role.id);

                for (var i = 0; i < employeeResult.length; i++) {
                  if (employeeResult[i].first_name + " " + employeeResult[i].last_name === response.manager) {
                    var manager = employeeResult[i]
                  }

                  if (employeeResult[i].first_name + " " + employeeResult[i].last_name === response.employee) {
                    var employee = employeeResult[i]
                  }
                }
                console.log(manager.id);
                console.log(employee.id);

                db.query(`UPDATE employee SET role_id = '${role.id}', manager_id = '${manager.id}' WHERE id = ${employee.id};`, (err, result) => {
                  if (err) {
                    console.log(err);
                  }
                  console.log("Employee updated.");
                })
            })
          })
        })
      };
    })
}

init();
