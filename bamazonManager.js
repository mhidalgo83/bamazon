//NPM packages that need to be installed..
var mysql = require("mysql");
var inquirer = require("inquirer");
var comparison;
//Connection to mySQL database created on the workbench...
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "root",

    database: "bamazon_db"
});

//Connection to database and starts Inquirer function...
connection.connect(function (err) {
    if (err) throw err;

    start();
});
console.log("Welcome to Bamazon Manager!")
function start() {
    connection.query("SELECT * FROM products",
        function (err, results) {
            if (err) throw err;
            //Prompts user to choose what function they would like to perform...
            inquirer.prompt([
                {
                    type: "list",
                    name: "managerChoice",
                    choices: ["View Products For Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "End Session"],
                    message: "What would you like to do?"
                }
            ]).then(function (answer) {
                switch (answer.managerChoice) {
                    case ("View Products For Sale"):
                    //Function to view items...
                        viewItems();
                        break;
                    case ("View Low Inventory"):
                    //Function to view inventory on products that have five or fewer items in stock...
                        viewInventory();
                        break;
                    case ("Add to Inventory"):
                    //Function to add inventory...
                        addInventory();
                        break;
                    case ("Add New Product"):
                    //Function to add a new product...
                        newProduct();
                        break;
                    case ("End Session"):
                    //Ends the session...
                        console.log("Thanks for stopping by!");
                        break;
                }
            })
        })
}

function viewItems() {
    //Connects to database...
    connection.query("SELECT * FROM products",
        function (err, results) {
            //Pulls results and prints them to the console...
            console.log("Current Inventory\n");
            for (var i = 0; i < results.length; i++) {
                console.log("Item ID: " + results[i].item_id + "\nProduct Name: " + results[i].product_name + " \nPrice: " + results[i].price + "\nIn Stock: " + results[i].stock_quantity + "\n------------");
            }
        });
        //Recurs start function...
    start();
}

function viewInventory() {
    //Connects to database...
    connection.query("SELECT * FROM products",
        function (err, results) {
            //Variable to store items that meet our criteria...
            var lowItems = [];
            for (var i = 0; i < results.length; i++) {
                if (results[i].stock_quantity <= 5) {
                    //Pushes items into criteria...
                    lowItems.push(results[i].product_name);
                }
                //If there are no items 5 or lower, this logs to console...
            } if (lowItems.length === 0) {
                console.log("\nThere are no items that require your attention." + "\n-------------------");
                //If there are items that are low in inventory, this logs to console...
            } else {
                console.log("\nHere are any items that are low: " + lowItems.join(", ") + "\n-----------------");
            }
        });
        //Recurs start function...
    start();
}

function addInventory() {
    //Connects to database...
    connection.query("SELECT * FROM products",
        function (err, results) {
            inquirer.prompt([
                {
                    //List of products to choose from...
                    type: "list",
                    name: "product",
                    //Creates choices from for loop and stores them in an array...
                    choices: function () {
                        var productArray = [];
                        for (var i = 0; i < results.length; i++) {
                            productArray.push(results[i].product_name);
                        }
                        return productArray;
                    },
                    message: "Choose an item to add inventory."
                },
                {
                    //Asks user how much they would like to add of that item...
                    type: "input",
                    name: "addInventory",
                    //Validates the value....
                    validate: function (value) {
                        if (isNaN(value) === false && value > 0) {
                            return true;
                        }
                        return false;
                    },
                    message: "How much would you like to add?"
                }
            ]).then(function (addItems) {
                console.log("Adding items to inventory now...\n");
                //Stores item's stock qunatity into a variable...
                for (var i = 0; i < results.length; i++) {
                    if (addItems.product === results[i].product_name) {
                        currentQty = results[i].stock_quantity;
                    }
                }
                //Connects to the database...
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            //Updates stock quantity...
                            stock_quantity: currentQty + parseInt(addItems.addInventory)
                        },
                        {
                            //To the chosen product...
                            product_name: addItems.product
                        }
                    ],
                    function (err, res) {
                        console.log("Inventory has been added to " + addItems.product + ".\n" + "\n----------------")
                    }
                )
                //Recurs start function...
                start();
            })
        });
}

function newProduct() {
    inquirer.prompt([
        {
            //Prompts for name of new item added to bamazon...
            type: "input",
            name: "name",
            message: "What is the name of the item you would like to add?"
        },
        {
            //Asks for quantity user would like to add...
            type: "input",
            name: "quantity",
            validate: function (value) {
                if (isNaN(value) === false && parseInt(value) > 0) {
                    return true;
                }
                return false;
            },
            message: "How much of the item are you adding?"
        },
        {
            //Asks for the department...
            type: "input",
            name: "department",
            message: "What department would you like this under?"
        },
        {
            //Asks for price...
            type: "input",
            name: "price",
            //Validates that there was a number added...
            validate: function (value) {
                if (isNaN(value) === false && parseFloat(value)> 0) {
                    return true;
                }
                return false;
            },
            message: "At what price point would you like to set the price?"
        }
    ]).then(function (answers) {
        //Connects to database...
        connection.query(
            "INSERT INTO products SET ?",
            {
                //Takes information from prompt and adds to database...
                product_name: answers.name,
                department_name: answers.department,
                price: answers.price,
                stock_quantity: answers.quantity
            },
            function (err, res) {
                if (err) throw err;
                //Logs that the item was successfully added...
                else console.log(answers.name + " has been added!\n" + "\n---------------");
            }
        );
        //Recurs start function...
        start();
    });
}
