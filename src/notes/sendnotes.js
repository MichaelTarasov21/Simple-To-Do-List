const mysql = require("mysql");
const config = require("../config.js");

function sendnotes(request, res) {
	// Status defaults to error, if no errors occur it should be changed
	let response = {
		status: "Error",
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
			res.send(response);
			return "error";
		}
	});

	const userid = request.session.userid;

	// Get today's date in a format appropriate for use in SQL
	const date = new Date();
	const today = mysql.escape(date.toJSON().slice(0, 10));

	sql.query(`SELECT * FROM tasks WHERE (userid=${userid} AND (completed=0 OR completed_date = ${today}))`, function (err, result) {
		if (err) {
			res.send(response);
			sql.end();
			return;
		} else {
			response.status = "Success";
			response.notes = result;
			res.send(response);
			sql.end();
			return;
		}
	});
}

module.exports = sendnotes;
