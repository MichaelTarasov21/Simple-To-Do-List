const mysql = require("mysql");
const config = require("./config.js");
const sql = require("./connectdatabase.js");

function sendnotes(request, res) {
	let cookie = mysql.escape(request.cookies.session);
	cookie = cookie.split("'")[1]; // The cookie string is surrounded by single quotes. These are not necessary.
	// Status defaults to error, if no errors occur it should be changed
	let response = {
		status: "Error",
		notes: [],
	};
	sql.query(`USE ${config.database_name}`, function (err, result) {
		if (err) throw err;
		sql.query(`SELECT * FROM sessions WHERE cookie="${cookie}"`, function (err, result) {
			if (err) {
				res.send(response);
				return;
			}
			if (result[0] === undefined) {
				response.status = "Invalid Cookie";
				res.send(response);
				return;
			} else {
				const userid = result[0].userid;
				response.status = "Success";
				sql.query(`SELECT * FROM tasks WHERE userid=${userid}`, function (err, result) {
					if (err) throw err;
					response.notes = result;
					res.send(response);
					return;
				});
			}
		});
	});
}

module.exports = sendnotes;
