
var mysql = require("mysql");
var inquirer = require("inquirer");
var runningTotal = 0;
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  user: "root",
  password: "Password",
  database: "Bamazon"
});
var shopInit = function() {
connection.query("SELECT * FROM products", function(err, res) {
if (err) throw err;

console.log("WELCOME TO YOON'S STORE! ITEMS FOR SALE:");
or(var i = 0; i < res.length; i++) {
console.log(res[i].item_id + " | " + res[i].product_name + " | $" + res[i].price.toFixed(2));
	  }
inquirer.prompt([
	 {
type: "input",
name: "itemId",
message: "Enter the ID number of the product you'd like to buy:",
validate: function(value) {
if(isNaN(value) === false && value > 0 && value < res.length + 1) {
return true;
} else {
return false;
}
}
},
{
type: "input",
name: "quantityDemanded",
message: "How many would you like to buy?",
validate: function(value) {
if(isNaN(value) === false && value > 0) {
return true;
} else {
return false;
	}
}
},
]).then(function(answers) {
var itemId = answers.itemId;
var quantityDemanded = answers.quantityDemanded;
if(quantityDemanded > res[itemId - 1].stock_quantity) {
console.log("Insufficient quantity!");
	inquirer.prompt([
{
type: "confirm",
	name: "confirm",
message: "Would you like to try and make another purchase?"
	  			}
]).then(function(answers) {
	if(answers.confirm) {
shopInit();
	  			}
	});
	  	} else {
connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?", [quantityDemanded, itemId], function(err, res) {});
	console.log("Your purchase total is $" + (res[itemId - 1].price * quantityDemanded).toFixed(2));
runningTotal = runningTotal + (res[itemId - 1].price * quantityDemanded);
	 console.log("Your running total is $" + runningTotal.toFixed(2));
inquirer.prompt([
	  			{
	  type: "confirm",
	 name: "confirm",
message: "Would you like to make another purchase?"
	  			}
]).then(function(answers) {
	 if(answers.confirm) {
shopInit();
	  			}
	  		});
	  	}
	  });
	});
};

shopInit();