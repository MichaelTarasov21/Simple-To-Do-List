const bcrypt = require("bcrypt");
const mysql = require("mysql");
const config = require("../config.js");

function setPassword(req, res) {
	const userid = req.session.userid;
	const oldpassword = req.body.oldpassword;
	const newpassword = req.body.newpassword;

	const sql = mysql.createConnection({
		host: config.sqlhost,
		user: config.sqluser,
		password: config.sqlpassword,
		database: config.database_name,
		charset: "utf8mb4",
	});

	sql.connect(function (err) {
		if (err) {
			console.error("Error connecting: " + err.stack);
			res.status(500);
			res.send();
			sql.end();
		}
	});

	sql.query(`SELECT * FROM To_Do_List.users WHERE userid = ${userid}`, function (err, result) {
		if (err) {
			console.error("Error in password update " + err.stack);
			res.status(500);
			res.send();
			sql.end();
		} else {
			if (result[0] === undefined) {
				// If no user with a given userID exists, an error has occured.
				// There is no circumstance where this should run
				res.status = 500;
				res.send();
				sql.end();
				return;
			}
			result = result[0]; // Parse the return in a manner where data is more easily accessible

			const hash = result.password;

			bcrypt.compare(oldpassword, hash, function (err, result) {
				if (err) {
					res.status(500);
					res.send();
					sql.end();
					console.log("Error during the hashing of a password: " + err.stack);
				}
				if (result) {
					saltRounds = config.saltRounds;
					bcrypt.genSalt(saltRounds, function (err, salt) {
						if (err) {
							console.log("Error in salt genetation: " + err.stack);
						}
						bcrypt.hash(newpassword, salt, function (err, hash) {
							sql.query(`UPDATE users SET password = '${hash}' WHERE (userid = '${userid}')`, function (err) {
								if (err) {
									res.status(500);
									res.send();
									sql.end();
									console.log("Error during password change: " + err.stack);
								} else {
									res.send();
									sql.end();
								}
							});
						});
					});
				} else {
					res.status(400);
					res.send();
					sql.end();
				}
			});
		}
	});
}

module.exports = setPassword;
