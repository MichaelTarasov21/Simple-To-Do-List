const bcrypt = require("bcrypt");
const mysql = require("mysql");
const config = require("../config.js");
const checkPassword = require("../checkPassword.js");

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

	function error() {
		console.error("Error in password update " + err.stack);
		res.status(500);
		res.send();
		sql.end();
	}

	function validPassword() {
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
	}

	function invalidPassword() {
		res.status(400);
		res.send();
		sql.end();
	}

	checkPassword(userid, oldpassword, validPassword, invalidPassword, error);
}

module.exports = setPassword;
