const bcrypt = require("bcrypt");
const mysql = require("mysql");
const config = require("./config.js");
const rl = require("../setup/readline.js");

function reset() {
	rl.question("Enter new password: ", function (password) {
		if (password.length === 0) {
			return;
		}

		const sql = mysql.createConnection({
			host: config.sqlhost,
			user: config.sqluser,
			password: config.sqlpassword,
			database: config.database_name,
			charset: "utf8mb4",
		});
		bcrypt.genSalt(config.saltRounds, function (err, salt) {
			if (err) {
				console.log("Error in salt genetation: " + err.stack);
			}
			bcrypt.hash(password, salt, function (err, hash) {
				sql.query(`UPDATE users SET password = '${hash}' WHERE (userid = '1')`, function (err) {
					if (err) {
						console.log("Error during password change: " + err.stack);
					} else {
						console.log("Password Changed");
						sql.end();
						process.exit(0);
					}
				});
			});
		});
	});
}

module.exports = reset;
