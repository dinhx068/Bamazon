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
  
// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    mainMenu();
});
  
function mainMenu() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "----------------------------------------------------------------------------------------------------" + 
        "\n What would you like to do? Selct one of the following:",
        choices: ["View Products for Sale", 
                  "View Low Inventory",
                  "Add to Inventory",
                  "Add New Product"]
    })
    .then(function(answer) {
        switch (answer.action) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLowInventory();
                break;
            case "Add to Inventory":
                addToInventory();
                break;
            case "Add New Product":
                addNewProduct();
                break;
        }
    });
}

function viewProducts() {
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
    });
    setTimeout(mainMenu, 500);
}

function viewLowInventory() {
    connection.query('SELECT * FROM Products', function(err, res) {
        if (err) {console.log(err)};
        let table = new Table({
            head: ['Item ID', 'Product Name', 'Department Name', 'Price', 'Stock'],
            colAligns: ['center', null, null, 'right', 'center'],
            colWidths: [10, 30, 30, 16, 8]
        });
        for (i = 0; i < res.length; i++) {
            if (res[i].stock < 5) {
                table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock]);
            } else {
                // Do not display
            }
        }
        console.log(table.toString());
    });
    setTimeout(mainMenu, 500);
}

function addToInventory() {
    
}

function addNewProduct() {
    
}