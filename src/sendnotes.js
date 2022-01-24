const mysql = require("mysql");
const config = require("./config.js");

function sendnotes(request, res) {
	const sql = mysql.createConnection({
		host: config.sqlhost,
		user: config.sqluser,
		password: config.sqlpassword,
		database: config.database_name,
	});

	sql.connect(function (err) {
		if (err) {
			console.error("error connecting: " + err.stack);
			res.send(response);
			return "error";
		}
	});

	let cookie = mysql.escape(request.cookies.session);
	cookie = cookie.split("'")[1]; // The cookie string is surrounded by single quotes. These are not necessary.

	// Status defaults to error, if no errors occur it should be changed
	let response = {
		status: "Error",
		notes: [],
	};

	sql.query(`SELECT * FROM sessions WHERE cookie="${cookie}"`, function (err, result) {
		if (err) {
			res.send(response);
			sql.end();
			return;
		}
		if (result[0] === undefined) {
			response.status = "Invalid Cookie";
			res.send(response);
			sql.end();
			return;
		} else {
			const userid = result[0].userid;
			response.status = "Success";
			sql.query(`SELECT * FROM tasks WHERE userid=${userid}`, function (err, result) {
				if (err) throw err;
				response.notes = result;
				res.send(response);
				sql.end();
				return;
			});
		}
	});
}

module.exports = sendnotes;
