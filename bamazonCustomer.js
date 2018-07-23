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
            else {
                console.log("Thanks for stopping by. Have a nice day!")
            }
        })
    })
}
function buyItem() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                name: "itemID",
                validate: function (value) {
                    if (isNaN(value) === false && parseInt(value) <= comparison && parseInt(value) > 0) {
                        return true;
                    }
                    return false;
                },
                message: "Please order an item, using the item ID provided in the description."
            },
            {
                type: "input",
                name: "purchase",
                valdate: function (value) {
                    if (isNaN(value) === false && parseInt(value) > 0) {
                        return true;
                    }
                    return false;
                },   
                message: "How many would you like to purchase?",

            }
        ]).then(function (buying) {
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
                if (results[i].item_id === parseInt(buying.itemID)) {
                    chosenItem = results[i];
                }
            }
            if (parseInt(chosenItem.stock_quantity) >= parseInt(buying.purchase)) {
                function placeOrder() {
                    console.log("Placing your order now...\n");
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: chosenItem.stock_quantity - parseInt(buying.purchase)
                            },
                            {
                                item_id: buying.itemID
                            }
                        ],
                        function (err, res) {
                            console.log("Your order has been placed. Your total is " + parseFloat(buying.purchase * (chosenItem.price)).toFixed(2) + ". Your order should arrive in 2 business days. Thanks for shopping at Bamazon!\n");
                        }
                    );
                } placeOrder();
            } else if (parseInt(chosenItem.stock_quantity) < parseInt(buying.purchase)) {
                console.log("Insufficient quantity!");
                buyItem();
            }
        })
    })
}

