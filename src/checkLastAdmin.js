const mysql = require("mysql");
const config = require("./config.js");

function checkLastAdmin(success = Function, failure = Function, error = Function) {
	// Checks if the user attempting to delete their account is the last admin.
	// There must always be an admin so the last admin can not delete their account through the app.

	const sql = mysql.createConnection({
		host: config.sqlhost,
		user: config.sqluser,
		password: config.sqlpassword,
		database: config.database_name,
		charset: "utf8mb4",
	});

	sql.query(`SELECT * FROM To_Do_List.users WHERE administrator = 1`, function (err, result) {
		if (err) {
			console.log("Error in checking if user is last administrator: " + err.stack);
			error();
			return;
		}
		if (result.length > 1) {
			success();
		} else {
			failure();
		}
		sql.end();
	});
}

module.exports = checkLastAdmin;
