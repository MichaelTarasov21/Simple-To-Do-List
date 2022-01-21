const bcrypt = require("bcrypt");
const mysql = require("mysql");
const sql = require("./connectdatabase.js");
const config = require("./config.js");

function createUser(username, password, admin = false) {
	username = mysql.escape(username);

	saltRounds = 2 ^ config.saltRounds;
	bcrypt.genSalt(saltRounds, function (err, salt) {
		if (err) throw err;
		bcrypt.hash(password, salt, function (err, hash) {
			// Store hash in your password DB.
			sql.query(`INSERT INTO users(administrator, username, password) VALUES (${admin}, "${username}", "${hash}")`);
		});
	});
}

module.exports = createUser;
