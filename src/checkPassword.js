const bcrypt = require("bcrypt");
const mysql = require("mysql");
const config = require("./config.js");

function checkPassword(userid = Number, password = String, same = Function, different = Function, error = different) {
	// Checks if a given password matches the user password.
	// Afterwards, executes a callback funtion for either the passwords being the same or being different
	const sql = mysql.createConnection({
		host: config.sqlhost,
		user: config.sqluser,
		password: config.sqlpassword,
		database: config.database_name,
		charset: "utf8mb4",
	});

	sql.query(`SELECT * FROM To_Do_List.users WHERE userid = ${userid}`, function (err, result) {
		if (err) {
			error(err);
			return;
		} else {
			if (result[0] === undefined) {
				// If no user with a given userID exists, an error has occured.
				// There is no circumstance where this should run
				error({stack: "Error in password checking code"});
				return;
			}
			result = result[0]; // Parse the return in a manner where data is more easily accessible

			const hash = result.password;

			bcrypt.compare(password, hash, function (err, result) {
				if (result) {
					same();
				} else {
					different();
				}
			});
		}
	});
}

module.exports = checkPassword;
