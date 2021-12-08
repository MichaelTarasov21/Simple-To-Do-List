const { exit } = require("process");
const readline = require("readline");
const sql = require("./connectdatabase.js");
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function checkDatabse(sql, database_name = String, expected_tables = Array) {
	// Check if a given database exists and attempt to create it if it doesn't
	sql.query(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = "${database_name}"`, function (err, result) {
		if (err) throw err;
		if (result == "") {
			console.log("Database named " + database_name + " not found. Attempting to create.");
			sql.query(`CREATE DATABASE ${database_name}`, function (err) {
				// This is a common and simple error so it should be explained more clearly and should terminate the program more quietly
				if (err.code === "ER_DBACCESS_DENIED_ERROR") {
					console.log("It seems you dont havCritical errore permission to create a database as the user that is making this query. Please change your credentials to a user that can create a database or manually create a database named " + database_name);
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

function overwriteDatabase(sql, database_name, tables) {
	rl.question("Would you like to overwrite the databe? (y/N)", function (overwrite) {
		if (overwrite === "" || overwrite.toLowerCase() === "n" || overwrite.toLowerCase() === "no") {
			exit(1);
		} else if (overwrite.toLowerCase() === "y" || overwrite.toLowerCase() === "yes") {
			function confirm() {
				rl.question("Are you certain that you want to proceed? (y/N)", function (confirmation) {
					if (confirmation === "" || confirmation.toLowerCase() === "n" || confirmation.toLowerCase() === "no") {
						exit(1);
					} else if (confirmation.toLowerCase() === "y" || confirmation.toLowerCase() === "yes") {
						rl.close();
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

function createTables(sql, database_name) {
	sql.query(`USE ${database_name}`, function (err) {
		if (err) throw err;
		console.log(`Creating tables in ${database_name}...`);
		sql.query(
			`CREATE TABLE users (
			userid INT AUTO_INCREMENT PRIMARY KEY NOT NULL, 
			username VARCHAR(255) NOT NULL, 
			password VARCHAR(255) NOT NULL, 
			salt CHAR(29) NOT NULL, 
			iterations TINYINT NOT NULL)`,
			function (err) {
				if (err) throw err;
			}
		);
		sql.query(
			`CREATE TABLE sessions (
			sessionid INT AUTO_INCREMENT PRIMARY KEY NOT NULL, 
			userid INT NOT NULL, 
			cookie VARCHAR(1000) NOT NULL, 
			access_date DATE NOT NULL,
			FOREIGN KEY (userid) REFERENCES users(userid))`,
			function (err) {
				if (err) throw err;
			}
		);
		sql.query(
			`CREATE TABLE tasks (
			noteid INT AUTO_INCREMENT PRIMARY KEY NOT NULL, 
			userid INT NOT NULL, 
			position INT NULL, 
			message VARCHAR(1000) NOT NULL, 
			completed BOOLEAN NOT NULL, 
			completed_date DATE NULL, 
			expiration_date DATE NULL, 
			flag CHAR(1) NULL,
			FOREIGN KEY (userid) REFERENCES users(userid))`,
			function (err) {
				if (err) throw err;
			}
		);
		console.log("Sucessfully created tables");
	});
}

module.exports = checkDatabse;
