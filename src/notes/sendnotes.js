const mysql = require("mysql");
const config = require("../config.js");

function sendnotes(request, res) {
	let response = {
		notes: [],
	};

	const sql = mysql.createConnection({
		host: config.sqlhost,
		user: config.sqluser,
		password: config.sqlpassword,
		database: config.database_name,
		charset: "utf8mb4",
	});

	sql.connect(function (err) {
		if (err) {
			console.error("error connecting: " + err.stack);
			res.status(500);
			res.send(response);
			return;
		}
	});

	const userid = request.session.userid;

	// Get today's date in a format appropriate for use in SQL
	const date = new Date();
	const today = mysql.escape(date.toJSON().slice(0, 10));

	sql.query(`SELECT message, completed, expiration_date, flag FROM tasks WHERE (userid=${userid} AND (completed=0 OR completed_date = ${today}) AND (expiration_date >= ${today} OR expiration_date IS NULL) AND (posted_date <= ${today}))`, function (err, result) {
		if (err) {
			res.status(500);
			res.send(response);
			sql.end();
			return;
		} else {
			response.notes = result;
			res.send(response);
			sql.end();
			return;
		}
	});
}

module.exports = sendnotes;
