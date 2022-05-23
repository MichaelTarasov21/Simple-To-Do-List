const mysql = require("mysql");
const config = require("../config.js");

function setEmail(req, res) {
	const userid = req.session.userid;
	const email = mysql.escape(req.body.email);

	if (!/.+@.+\..+/.test(email) || email.length > 255) {
		// If the email is not an email or is too long set an error code, send a response, and abort the function
		res.status(400); // Set status code to client error
		res.send();
		return;
	}

	const sql = mysql.createConnection({
		host: config.sqlhost,
		user: config.sqluser,
		password: config.sqlpassword,
		database: config.database_name,
		charset: "utf8mb4",
	});

	sql.query(`UPDATE users SET email = ${email} WHERE (userid = '${userid}');`, function (err) {
		if (err) {
			console.log("Error in setting email for a user: " + err.stack);
			res.status(500); // Set status code to internal server error
		}
		res.send();
	});
}

module.exports = setEmail;
