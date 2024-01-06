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
    }
  );

  //use inquirer
  inquirer
    .prompt([
      // Prompt user with a list of choices
      {
        type: 'list',
        message: 'What would you like to do?',
        name: 'action',
        // Provide an array of choices for the user to select from
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Quit"
        ]
      }
    ])
    // Since inquirer is promise based, the next step is to use the response.
    // The program cycles through if statements to see which option the user selected
    .then((response) => {
      // View all departments
      if (response.action == "View all departments") {
        // This uses the database connection to send the sql command to list everything in the department table
        db.query(`SELECT * FROM department;`, (err, result) => {
          // if there is an error, it will log the error and restart the command line prompts
          if (err) {
            console.log(err);
            init();
          }
          // displays the result of the database query in a table and restarts the command line prompts
          console.table(result);
          init();
        });
      }

      // View all roles
      else if (response.action == "View all roles") {
        // This uses the database connection to send the sql command to list everything in the role table
        db.query(`SELECT * FROM role;`, (err, result) => {
          if (err) {
            // if there is an error, it will log the error and restart the command line prompts
            console.log(err);
            //init();
          }
          // displays the result of the database query in a table and restarts the command line prompts
          console.table(result);
          init();
        });
      }
      
      // View all employees
      else if (response.action == "View all employees") {
        // This uses the database connection to send the sql command to list everything in the employee table
        db.query(`SELECT * FROM employee;`, (err, result) => {
          // if there is an error, it will log the error and restart the command line prompts
          if (err) {
            console.log(err);
            init();
          }
          // displays the result of the database query in a table and restarts the command line prompts
          console.table(result);
          init();
        });
      }

      // Add a department
      else if (response.action == "Add a department") {
        // Ask the user the name of the department
        inquirer
          .prompt([
            {
              type: 'input',
              message: 'What is the name of the department?',
              name: 'department',
              // Validate if the user entered a department
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
            // query the database and add the department using sql commands
            db.query(`INSERT INTO department (name) VALUES ("${response.department}");`, (err, result) => {
              // log the error and restart the app if an error occurs
              if (err) {
                console.log(err);
                init()
              }
              // tell the user a department has been added and restart the inquiry
              console.log("New department added.");
              init();
            });
          })
      }

      // Add a role
      else if (response.action == "Add a role") {
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
                  // create the array of department options the user can select from using the results from the db query
                  var array = [];
                  for (var i = 0; i < result.length; i++) {
                    array.push(result[i].name);
                  }
                  return array;
                }
              }
            ])
            .then((response) => {
              // go through the department names and match it to the the department in the database to be able to access the dept id
              for (var i = 0; i < result.length; i++) {
                if (result[i].name === response.department) {
                  var department = result[i];
                }
              }
              // add the role by accessing the database and using sql
              db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${response.role}", "${response.salary}", "${department.id}");`, (err, result) => {
                if (err) {
                  console.log(err);
                  init();
                }
                console.log("New role added.");
                init();
              });
            })
        });
      }

      // Add an employee
      else if (response.action == "Add an employee") {
        // retrieve the employee table from the database
        db.query(`SELECT * FROM employee;`, (err, employeeResult) => {
          if (err) {
            console.log(err);
            init();
          }
          // retrieve the role table from the database
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
                      // validate that user input a response
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
                      // validate that user input a response
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
                    // create an array of roles for the user to select from
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
                    // create an array of employees for the user to select from
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
                // go through the roles to match the one the user selected to access the role id
                for (var i = 0; i < roleResult.length; i++) {
                  if (roleResult[i].title === response.role) {
                    var role = roleResult[i];
                  }
                }

                // go through the employees to match the one the user selected to access the employee id
                for (var i = 0; i < employeeResult.length; i++) {
                  if (employeeResult[i].first_name + " " + employeeResult[i].last_name === response.manager) {
                    var manager = employeeResult[i]
                  }
                }

                // add the employee to the db in sql commands utilizing the inputs and the role/manager ids
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${response.firstname}", "${response.lastname}", "${role.id}", "${manager.id}");`, (err, result) => {
                  if (err) {
                    console.log(err);
                    init();
                  }
                  // tell the user the employee has been added and restart the app
                  console.log("New employee added.");
                  init();
                });
              })
          })

        });
      }

      // Update an employee role
      else if (response.action == "Update an employee role") {
        // access the employee table from the db using sql commands
        db.query(`SELECT * FROM employee;`, (err, employeeResult) => {
          if (err) {
            console.log(err);
          }
          // access the role table from the db using sql commands
          db.query(`SELECT * FROM role;`, (err, roleResult) => {
            // Ask the user for the name of the employee, and their new role
            inquirer
              .prompt([
                {
                  type: 'list',
                  message: 'Which employee is changing roles?',
                  name: 'employee',
                  choices: () => {
                    // create an array of employees using the db results for the user to select from
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
                    // create an array of roles using the db results for the user to select from
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
                    // create an array of employees using the db results for the user to select from
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
                // go through the role db results to match the new role the employee selected to access the role id
                for (var i = 0; i < roleResult.length; i++) {
                  if (roleResult[i].title === response.role) {
                    var role = roleResult[i];
                  }
                }

                // go through the employee db results to match the selected employee and new manager to access their ids
                for (var i = 0; i < employeeResult.length; i++) {
                  // manager
                  if (employeeResult[i].first_name + " " + employeeResult[i].last_name === response.manager) {
                    var manager = employeeResult[i]
                  }
                  //employee
                  if (employeeResult[i].first_name + " " + employeeResult[i].last_name === response.employee) {
                    var employee = employeeResult[i]
                  }
                }
                // update the database using sql commands with the ids of the inputs
                db.query(`UPDATE employee SET role_id = '${role.id}', manager_id = '${manager.id}' WHERE id = ${employee.id};`, (err, result) => {
                  if (err) {
                    console.log(err);
                  }
                  console.log("Employee updated.");
                  init();
                })
            })
          })
        })
      }

      // Quit / exit the program
      else if (response.action == "Quit") {
        console.log("Laters");
        db.end();
        process.exit();
      }

      // if the user somehow selects something that isn't the given options, restart the app
      else {
        console.log("Please enter a valid input");
        init();
      }

    })
}


// Adding console text
console.log("")
console.log("███████╗███╗   ███╗██████╗ ██╗      ██████╗ ██╗   ██╗███████╗███████╗")
console.log("██╔════╝████╗ ████║██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝██╔════╝██╔════╝")
console.log("█████╗  ██╔████╔██║██████╔╝██║     ██║   ██║ ╚████╔╝ █████╗  █████╗  ")
console.log("██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██║   ██║  ╚██╔╝  ██╔══╝  ██╔══╝  ")
console.log("███████╗██║ ╚═╝ ██║██║     ███████╗╚██████╔╝   ██║   ███████╗███████╗")
console.log("╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝   ╚══════╝╚══════╝")
console.log("")                                                         
console.log("███╗   ███╗ █████╗ ███╗   ██╗ █████╗  ██████╗ ███████╗██████╗        ")
console.log("████╗ ████║██╔══██╗████╗  ██║██╔══██╗██╔════╝ ██╔════╝██╔══██╗       ")
console.log("██╔████╔██║███████║██╔██╗ ██║███████║██║  ███╗█████╗  ██████╔╝       ")
console.log("██║╚██╔╝██║██╔══██║██║╚██╗██║██╔══██║██║   ██║██╔══╝  ██╔══██╗       ")
console.log("██║ ╚═╝ ██║██║  ██║██║ ╚████║██║  ██║╚██████╔╝███████╗██║  ██║       ")
console.log("╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝       ")
console.log("")
console.log("---------------------------------------------------------------------")
                                                                     
// initialize the app
init();