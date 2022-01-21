const bcrypt = require("bcrypt");
const mysql = require("mysql");
const sql = require("./connectdatabase.js");
const config = require("./config.js");
const generateCookie = require("./gencookie.js");

function formatDate() {
	//Formats the date for use in sql
	const date = new Date();
	const year = date.getFullYear();
	const month = date.getMonth();
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();
	return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}
function setCookie(response, res, userid) {
	// Generates a cookie, checks to make sure it is unique, then sends it back to the browser as a session cookie
	const cookie = mysql.escape(generateCookie());
	sql.query(`SELECT * FROM sessions WHERE cookie=${cookie}`, function (err, result) {
		if (err) {
			console.log(err);
			res.send(response);
			return;
		}
		if (result[0] !== undefined) {
			setCookie(response, res, userid);
		} else {
			response.status = "Success";
			response.cookie = cookie.split("'")[1]; // The cookie string is surrounded by single quotes. These are not necessary.
			const date = formatDate();

			sql.query(`INSERT INTO sessions(userid, cookie, last_access) VALUES (${userid}, ${cookie}, "${date}")`);

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

	sql.query(`USE ${config.database_name}`, function (err) {
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
					setCookie(response, res, id);
				} else {
					res.send(response);
				}
			});
		});
	});
}

module.exports = login;