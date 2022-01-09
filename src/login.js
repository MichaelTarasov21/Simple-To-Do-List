const bcrypt = require("bcrypt");
const mysql = require("mysql");
const sql = require("./connectdatabase.js");
const generateCookie = require("./gencookie.js");

let database_name = "To_Do_List";
if (process.env.DATABASE) {
	database_name = process.env.DATABASE;
}

function setCookie(response, res) {
	// Generates a cookie, checks to make sure it is unique, then sends it back to the browser as a session cookie
	const cookie = mysql.escape(generateCookie());
	sql.query(`SELECT * FROM sessions WHERE cookie="${cookie}"`, function (err, result) {
		if (err) {
			console.log(err);
			res.send(response);
			return;
		}
		if (result[0] !== undefined) {
			setCookie(response, res);
		} else {
			response.status = "Success";
			response.cookie = cookie;
			res.send(response);
		}
	});
}

function login(data, res) {
	const username = mysql.escape(String(data.body.username));
	const password = String(data.body.password);
	const response = {
		status: "Failed",
		cookie: "",
	};

	sql.query(`USE ${database_name}`, function (err) {
		if (err) throw err;
		sql.query(`SELECT * FROM users WHERE username="${username}"`, function (err, result) {
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
					setCookie(response, res);
				} else {
					res.send(response);
				}
			});
		});
	});
}

module.exports = login;
