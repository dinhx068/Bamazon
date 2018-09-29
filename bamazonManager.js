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
  
function validateNumber(input) {
    var reg = /^\d+$/;
    return reg.test(input) || "Enter a valid number!";
}

function mainMenu() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "--------------------------------------------------------------------------------------------------" + 
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
    inquirer.prompt([
        {
          name: "ID",
          type: "input", // Grabbing Item id
          message: "Enter the Item ID of that product that you would like to restock.",
          validate: validateNumber
        }
      ])
      .then(function(answer) {
          let itemIdSelected = answer.ID - 1;
          connection.query('SELECT * FROM Products', function(err, res) {
            if (err) {console.log(err)};
            // Making sure user inputs a valid item id
            if (-1 < itemIdSelected && itemIdSelected < res.length) {
                inquirer.prompt([
                  {
                    name: "AMOUNT",
                    type: "input", // Grabbing Item id
                    message: `Enter the [amount] to restock [${res[itemIdSelected].product_name}], currently in stock [${res[itemIdSelected].stock}].`,
                    validate: validateNumber
                  }
                ])
                .then(function(amountToAdd) {
                    let newStock = parseInt(res[itemIdSelected].stock) + parseInt(amountToAdd.AMOUNT);
                    connection.query("UPDATE products SET ? WHERE ?",
                    [
                        { stock: newStock },
                        { item_id: res[itemIdSelected].item_id }
                    ],
                    function(error) {
                        if (error) throw err;
                        console.log(`[${res[itemIdSelected].product_name}] was restocked to [${newStock}].`);
                        setTimeout(mainMenu, 1000);
                    }
                    );
                });
            // If item id is not on the list then the user gets prompt the same question
            } else {
                console.log("That item id was not on the list");
                setTimeout(addToInventory, 1000);
            }
        });
      });
}

function addNewProduct() {
    inquirer.prompt([
        {
            name: "PRODUCT_NAME",
            type: "input", // Grabbing product name
            message: "Enter the [Product Name]."
        }, {
            name: "DEPARTMENT_NAME",
            type: "input", // Grabbing Department name
            message: "Enter the [Department Name] that is in charge of the product."
        }, {
            name: "PRODUCT_PRICE",
            type: "input", // Grabbing Department name
            message: "Enter the [Price] of the product.",
            //validate: validateNumber
        }, {
            name: "PRODUCT_STOCK",
            type: "input", // Grabbing Department name
            message: "Enter how many product(s) to [Stock].",
            validate: validateNumber
        }
      ])
      .then(function(answer) {
          
      });
}