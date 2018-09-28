var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table2');

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
    connection.query('SELECT * FROM Products', function(err, res) {
        if (err) {console.log(err)};
        let table = new Table({
            head: ['Item ID', 'Product Name', 'Department Name', 'Price', 'Stock'],
            colAligns: ['center', null, null, 'right', 'center'],
            colWidths: [10, 30, 30, 16, 8]
        });
        for (i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock]
            );
        }
    console.log(table.toString());
    setTimeout(start, 1000); // Prompt the user
    });
}

function start() {
    inquirer.prompt([
      {
        name: "ID",
        type: "input", // Grabbing Item id
        message: "What would you like to buy? Enter the Item ID of that product."
      }, {
        name: "AMOUNT",
        type: "input", // Grabbing amount that the customer wants
        message: "How many units would you like to buy of that product?"
      }
    ])
    .then(function(answer) {
        let itemIdSelected = answer.ID - 1;
        let amountSelected = answer.AMOUNT;
        purchase(itemIdSelected,amountSelected); // Passing user input to the next function
    });
}

function purchase(itemIdSelected,amountSelected){
    connection.query('SELECT * FROM Products', function(err, res) {
        if (err) {console.log(err)};
        // When the user enters an amount less than what is in stock
        if (amountSelected > res[itemIdSelected].stock) {
            console.log(`You cannot buy that many of ${res[itemIdSelected].product_name} since we do not have that many in stock.`);
            inquirer.prompt({
                  name: "AMOUNT",
                  type: "input", // Grabbing user amount
                  message: "--------------------------------------------------------------------------------------------------" + 
                  "\nSo, enter an amount that is equal to or less than " + res[itemIdSelected].stock + " for " + res[itemIdSelected].product_name + "." +
                  "\nOr enter 0 to go back to the select another product."
                })
                .then(function(answer) {
                    let newAmount = answer.AMOUNT; // New input from the user
                    // If user wants to go back to the table
                    if (0 == newAmount) { 
                        setTimeout(displayTable, 1000);
                    // Get valid number from the user by rerunning the function
                    } else {
                        purchase(itemIdSelected,newAmount);
                    }
                });
        } else {

        }

    });
}