var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: ""
});


connection.connect(function(err){
	if(err)throw err;
	console.log("connected as id" + connection.threadId);
});


function displayInventory(){
	connection.query('SELECT * FROM Products', function(err, res){
		if(err){console.log(err)};
		var theDisplayTable = new Table({
			head: ['Item ID', 'Product Name', 'Department Name', 'Price', 'Stock Quantity'],
			colWidths: [10,25,25,10,14]
		});
		for(i=0; i<res.length;i++){
			theDisplayTable.push(
				[res[i].item_id,res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
				);
		}
		console.log(theDisplayTable.toString());
		inquirerForUpdates();
	});
};

function inquirerForUpdates(){
	inquirer.prompt([{
		name:"action",
		type: "list",
		message: "Choose an option below to manage current inventory:",
		choices: ["View Products for Sale ", "View Low Inventory", "Add to Inventory, Add New Product "]
 }]).then(function(answers){
		switch(answers.action){
			case 'View Products For Sale':
				viewProducts();
				break;
			case 'View Low Inventory':
				viewInventory();
				break;
			case 'Add to Inventory':
				addInventory();
        break;		
      case 'Add New Product':
        addProduct();
		}
	});
};
function viewProducts(){
	inquirer.prompt([
	{
		name:"ID",
		type:"input",
		message:""
	},
	{
		name:"Quantity",
		type:"input",
		message:"What is the quantity you would like to add?"
	},
	]).then(function(answers){
		var quantityAdded = answers.Quantity;
		var IDOfProduct = answers.ID;
		restockInventory(IDOfProduct, quantityAdded);
	});
};




