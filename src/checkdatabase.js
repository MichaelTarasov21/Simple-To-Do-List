const { exit } = require("process");
const createTables = require("./createtables");
const rl = require("./readline");

function checkDatabse(sql, database_name = String, expected_tables = Array) {
	// Check if a given database exists and attempt to create it if it doesn't
	sql.query(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = "${database_name}"`, function (err, result) {
		if (err) throw err;
		if (result == "") {
			console.log("Database named " + database_name + " not found. Attempting to create.");
			sql.query(`CREATE DATABASE ${database_name}`, function (err) {
				// This is a common and simple error so it should be explained more clearly and should terminate the program more quietly
				if (err.code === "ER_DBACCESS_DENIED_ERROR") {
					console.log("It seems you dont have permission to create a database as the user that is making this query. Please change your credentials to a user that can create a database or manually create a database named " + database_name);
					exit(1);
				}
				if (err) throw err;
				console.log("Database Created");
				checkDatabseTables(sql, database_name);
			});
		} else {
			checkDatabseTables(sql, database_name, expected_tables);
		}
	});
}

function checkDatabseTables(sql, database_name = String, expected_tables = Array) {
	sql.query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA='${database_name}'`, function (err, result) {
		if (err) throw err;
		if (result.length === 0) {
			createTables(sql, database_name);
		} else {
			let tables = [];
			result.forEach((element) => {
				tables.push(element.TABLE_NAME);
			});
			tables.sort();
			expected_tables.sort();
			if (tables.toString() !== expected_tables.toString()) {
				console.log(`It appears that the database named ${database_name} is already used by another application. Since this app is in Alpha it is also possible that an update changed the data structure.`);
				overwriteDatabase(sql, database_name, tables);
			}
		}
	});
}

function overwriteDatabase(sql, database_name, tables) {
	rl.question("Would you like to overwrite the databe? (y/N) ", function (overwrite) {
		if (overwrite === "" || overwrite.toLowerCase() === "n" || overwrite.toLowerCase() === "no") {
			exit(1);
		} else if (overwrite.toLowerCase() === "y" || overwrite.toLowerCase() === "yes") {
			function confirm() {
				rl.question("Are you certain that you want to proceed? (y/N) ", function (confirmation) {
					if (confirmation === "" || confirmation.toLowerCase() === "n" || confirmation.toLowerCase() === "no") {
						exit(1);
					} else if (confirmation.toLowerCase() === "y" || confirmation.toLowerCase() === "yes") {
						console.log("Deleting all tables in database. Ctrl+C now if this is not intended");
						setTimeout(function () {
							sql.query(`USE ${database_name}`, function (err) {
								if (err) throw err;
								tables.forEach(function (table) {
									sql.query(`DROP TABLE ${table}`, function (err) {
										if (err) throw err;
										console.log(`Dropped ${table}`);
									});
								});
								createTables(sql, database_name);
							});
						}, 3000);
					} else {
						console.log("Invalid input");
						confirm();
					}
				});
			}
			console.log("Warning: This is a destructive and irreversible action. DO NOT PROCEED UNLESS YOU ARE CERTAIN.");
			confirm();
		} else {
			console.log("Invalid input");
			overwriteDatabase(sql, database_name, tables);
		}
	});
}

module.exports = checkDatabse;
