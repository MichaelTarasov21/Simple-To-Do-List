const mysql = require("mysql");
const config = require("../src/config.js");
const setupAdmin = require("./setupadmin");

const sql = mysql.createConnection({
	host: config.sqlhost,
	user: config.sqluser,
	password: config.sqlpassword,
	database: config.database_name,
	charset: "utf8mb4",
});

function createTables() {
	sql.connect(function (err) {
		if (err) {
			throw err.stack;
		}
	});
	console.log(`Creating tables in ${config.database_name}...`);
	sql.query(
		`CREATE TABLE users (
			userid INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
			administrator BOOLEAN NOT NULL,
			email nVARCHAR(255) NULL,
			username nVARCHAR(255) NOT NULL,
			real_name nVARCHAR(255) NULL,
			password VARCHAR(255) NOT NULL)`,
		function (err) {
			if (err) throw err;
		}
	);
	sql.query(
		`CREATE TABLE tasks (
			noteid INT AUTO_INCREMENT PRIMARY KEY NOT NULL, 
			userid INT NOT NULL, 
			posted_date DATE NOT NULL,
			message nVARCHAR(1000) NOT NULL,
			completed BOOLEAN NOT NULL, 
			completed_date DATE NULL, 
			expiration_date DATE NULL,
			flag nVARCHAR(10) NULL,
			repeats INT NULL,
			FOREIGN KEY (userid) REFERENCES users(userid))`,
		function (err) {
			if (err) throw err;
		}
	);
	// Convert tables to utf8mb4 in order to prevent crashes when using modern emojis.
	// I couldn't create the tables as utf8mb4 because the columns were still being set to ut8mb3 and setting them up manually didn't work.
	sql.query(`ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`, function (err) {
		if (err) throw err;
	});
	sql.query(`ALTER TABLE tasks CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`, function (err) {
		if (err) throw err;
	});
	console.log("Sucessfully created tables");
	sql.end(setupAdmin);
}

module.exports = createTables;
