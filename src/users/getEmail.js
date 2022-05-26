const mysql = require("mysql");
const config = require("../config.js");

function getEmail(req, res) {
	const userid = req.session.userid;

	const sql = mysql.createConnection({
		host: config.sqlhost,
		user: config.sqluser,
		password: config.sqlpassword,
		database: config.database_name,
		charset: "utf8mb4",
	});

	sql.query(`SELECT email	FROM users WHERE (userid = '${userid}');`, function (err, result) {
		if (err) {
			console.log("Error in setting email for a user: " + err.stack);
			res.status(500); // Set status code to internal server error
		}
		res.send(result);
	});
}

module.exports = getEmail;
