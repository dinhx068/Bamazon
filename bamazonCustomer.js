var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306, // Your port; if not 3306
    user: "root", // Your username
    password: "", // Your password
    database: "bamazon" // The DB created from the sql and seeds file
});

connection.connect(function(err) {
    if (err) throw err;
    displayTable(); // We first display the table for the customer
});

function displayTable() {
    connection.query('SELECT * FROM Products', function(error, res) {
        if (error) {console.log(error)};
        var table = new Table({
            head: ['Item ID', 'Product Name', 'Department Name', 'Price', 'Stock'],
            colWidths: [10, 30, 30, 15, 8]
        });
        for (i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock]
            );
        }
    console.log(table.toString());
    startPrompt(); // Prompt the customer
    });
}

function startPrompt() {
    inquirer.prompt([
      {
        name: "ID",
        type: "input", // Grabbing Item id
        message: "Hello, what would you like to buy? Enter the Item ID of that product."
      }, {
        name: "AMOUNT",
        type: "input", // Grabbing amount that the customer wants
        message: "How many units would you like to buy of that product?"
      }
    ])
    .then(function(answer) {
    });
}