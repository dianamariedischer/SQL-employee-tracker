// Import and require mysql2
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
    
    db.query(`SHOW TABLES;`, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log(result);
      });

    //use inquirer
    inquirer
    .prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      name: 'action',
      choices: [
        "Option",
        "Option 2",
        "Option 3"
      ]
    }
    ])
    .then((response) =>
    console.log('Success!', JSON.stringify(response, null, 2))
    );

    // use prepared statement
    // const objInput = {
    //     // must match database column and values
    //     name: "Nelson"
    // }

    // const results = db.query("SELECT * FROM employees;");
    // console.log(results[0]);
}

init();
  