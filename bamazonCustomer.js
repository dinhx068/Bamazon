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

function validateNumber(input) {
    var reg = /^\d+$/;
    return ( (reg.test(input)) && (input > 0) ) || "Enter a valid number!";
}

// Notice the -1 instead of 0
function validateNumber2(input) {
    var reg = /^\d+$/;
    return ( (reg.test(input)) && (input > -1) ) || "Enter a valid number!";
}

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
        message: "What would you like to buy? Enter the Item ID of that product.",
        validate: validateNumber
      }, {
        name: "AMOUNT",
        type: "input", // Grabbing amount that the customer wants
        message: "How many units would you like to buy of that product?",
        validate: validateNumber
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

        // Making an product selected object so it's easier to access certain things
        var productSelected = {
            id: res[itemIdSelected].item_id,
            name: res[itemIdSelected].product_name,
            department_name: res[itemIdSelected].department_name,
            price: res[itemIdSelected].price,
            stock: res[itemIdSelected].stock
        };

        if (productSelected.stock === 0) {
            console.log(`You cannot buy any units of ${productSelected.name} because there is 0 in stock.`);
            setTimeout(function () {
                console.log(`You will be returned to the catalog shortly!`)}, 
                3000);
            setTimeout(displayTable, 5000);
        } else {
            // When the user enters an amount less than what is in stock
            if (amountSelected > productSelected.stock) {
                console.log("----------------------------------------------------------------------------------------------------" + 
                "\nYou cannot buy that many of [" + productSelected.name + "] since we do not have that many in stock.");
                inquirer.prompt({
                    name: "AMOUNT",
                    type: "input", // Grabbing user amount
                    message: "So, enter an amount that is equal to or less than [" + productSelected.stock + "] for [" + productSelected.name + "]." +
                    "\nOr enter 0 to go back to the select another product.",
                    validate: validateNumber2 // Using validateNumber function but with 0 included
                    })
                    .then(function(answer) {
                        let newAmount = answer.AMOUNT; // New input from the user
                        // If user wants to go back to the table
                        if (0 == newAmount) { 
                            setTimeout(displayTable, 1000);
                        // Get valid number from the user by rerunning the function
                        } else {
                            purchase(itemIdSelected, newAmount);
                        }
                    });
            // When user enters a valid input we go here
            } else {
                let newStockCount = productSelected.stock - amountSelected;
                let totalCost = amountSelected * productSelected.price;
                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        { stock: newStockCount },
                        { item_id: productSelected.id }
                    ],
                    function(error) {
                        if (error) throw err;
                        console.log(`Buying ${amountSelected} unit(s) of ${productSelected.name} will cost you $${totalCost}.`); 
                        setTimeout(function () {
                            console.log(`Thanks for shopping at Bamazon!`)}, 
                            3000);
                        setTimeout(function () {
                            console.log(`You will be returned to the catalog shortly!`)},
                            6000);
                        setTimeout(displayTable, 9000);
                    }
                );
            }
        }
    });
}