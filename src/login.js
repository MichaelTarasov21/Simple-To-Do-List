const bcrypt = require("bcrypt");
const mysql = require("mysql");
const config = require("./config.js");

function login(data, res) {
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
			sql.end();
			return;
		}
	});

	const username = mysql.escape(String(data.body.username));
	const password = String(data.body.password);
	const response = {
		status: "Failed",
	};
	sql.query(`USE ${config.database_name}`, function (err) {
		if (err) throw err;
		sql.query(`SELECT * FROM users WHERE username="${username}"`, function (err, result) {
			sql.end();
			if (err) {
				console.log("There was an error in an SQL query");
				res.send(response);
				return;
			}
			if (result[0] === undefined) {
				// Abort login if no results are found for a given username
				res.send(response);
				return;
			}

			result = result[0]; // Parse the return in a manner where data is more easily accessible
			const id = result.userid;
			const hash = result.password;

			bcrypt.compare(password, hash, function (err, result) {
				if (result) {
					response.status = "Success";
					data.session.userid = id;
					res.send(response);
					return;
				} else {
					res.send(response);
				}
			});
		});
	});
}

module.exports = login;
