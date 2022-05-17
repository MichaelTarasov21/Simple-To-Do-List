const bcrypt = require("bcrypt");
const mysql = require("mysql");
const config = require("./config.js");

function createUser(username = String, password = String, finish = Function, admin = false) {
	const sql = mysql.createConnection({
		host: config.sqlhost,
		user: config.sqluser,
		password: config.sqlpassword,
		database: config.database_name,
		charset: "utf8mb4",
	});

	username = mysql.escape(username);

	saltRounds = config.saltRounds;
	bcrypt.genSalt(saltRounds, function (err, salt) {
		if (err) throw err;
		bcrypt.hash(password, salt, function (err, hash) {
			// Store hash in your password DB.
			if (err) {
				console.log("Error occured during hashing process: " + err.stack);
			}
			sql.connect(function (err) {
				if (err) {
					console.error("error connecting: " + err.stack);
					return "error";
				}
			});
			sql.query(`INSERT INTO users(administrator, username, password) VALUES (${admin}, "${username}", "${hash}")`, function (err) {
				if (err) {
					console.log("Error occured during user creation: " + err.stack);
				} else {
					sql.end(finish);
				}
			});
		});
	});
}

module.exports = createUser;
