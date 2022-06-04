const mysql = require("mysql");
const config = require("./config.js");

function deleteAccount(userID = Number, success = Function, error = Function) {
	// Deletes a user account with a specified userID

	const sql = mysql.createConnection({
		host: config.sqlhost,
		user: config.sqluser,
		password: config.sqlpassword,
		database: config.database_name,
		charset: "utf8mb4",
	});

	sql.query(`DELETE FROM tasks WHERE userid = ${userID}`, function (err) {
		if (err) {
			console.log("Error in deletion of tasks prior to user deletion:" + err.stack);
			error();
		} else {
			sql.query(`DELETE FROM users WHERE userid = ${userID}`, function (err) {
				if (err) {
					console.log("Error in deletion of user" + err.stack);
					error();
				} else {
					success();
				}
			});
		}
	});
}

module.exports = deleteAccount;
