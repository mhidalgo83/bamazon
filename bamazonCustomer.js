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

//Asks user if they want to look at specials
function start() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "confirm",
                name: "welcome",
                message: "Welcome to Bamazon! Would you like to take a look at our specials?"
            },
        ]).then(function (answer) {
            if (answer.welcome) {
                console.log("Here are today's specials!");
                //Finds and logs products in mySQL database...
                for (var i = 0; i < results.length; i++) {
                    console.log("Item ID: " + results[i].item_id + "\nProduct Name: " + results[i].product_name + " \nPrice: " + results[i].price + "\n------------");
                }
                comparison = results.length;
                //Calls buy item function...
                buyItem();
            }
            //Ends the function if user selects no...
            else {
                console.log("Thanks for stopping by. Have a nice day!")
            }
        })
    })
}
//Function to buy an item
function buyItem() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
                //Asks for ID of item...
                type: "input",
                name: "itemID",
                //Validates to make sure the input is an integer, less than or equal to the length of the results(possible item id's) and that the input is greater than zero... 
                validate: function (value) {
                    if (isNaN(value) === false && parseInt(value) <= comparison && parseInt(value) > 0) {
                        return true;
                    }
                    return false;
                },
                message: "Please order an item, using the item ID provided in the description."
            },
            {
                //Asks user how much of the selected item they would like to purchase...
                type: "input",
                name: "purchase",
                valdate: function (value) {
                    //Checks to make sure the value is greater than 0...
                    if (isNaN(value) === false && parseInt(value) > 0) {
                        return true;
                    }
                    return false;
                },
                message: "How many would you like to purchase?",

            }
        ]).then(function (buying) {
            var chosenItem;
            //Loop to get the item, checking against the item id
            for (var i = 0; i < results.length; i++) {
                if (results[i].item_id === parseInt(buying.itemID)) {
                    //Stores item in a variable...
                    chosenItem = results[i];
                }
            }
            //Checks to make sure the item is stocked...
            if (parseInt(chosenItem.stock_quantity) >= parseInt(buying.purchase)) {
                function placeOrder() {
                    console.log("Placing your order now...\n");
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                //Updates stock quantity, removing the purchased input from the stock quantity in the database...
                                stock_quantity: chosenItem.stock_quantity - parseInt(buying.purchase)
                            },
                            {
                                //Locates the item using the item id that the user inputted...
                                item_id: buying.itemID
                            }
                        ],
                        //Prints to console how much the user will have to pay for the item...
                        function (err, res) {
                            console.log("Your order has been placed. Your total is " + parseFloat(buying.purchase * (chosenItem.price)).toFixed(2) + ". Your order should arrive in 2 business days. Thanks for shopping at Bamazon!\n");
                        }
                    );
                    //Calls the placeOrder function...
                } placeOrder();
                //Logs insufficient quantity if in-stock quantity is less than what user wants to purchase...
            } else if (parseInt(chosenItem.stock_quantity) < parseInt(buying.purchase)) {
                console.log("Insufficient quantity!");
                buyItem();
            }
        })
    })
}

