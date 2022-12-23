const mysql = require("mysql");
const config = require("./config.js");

function renderSettings(req, res) {
	const userid = req.session.userid;
	const sql = mysql.createConnection({
		host: config.sqlhost,
		user: config.sqluser,
		password: config.sqlpassword,
		database: config.database_name,
		charset: "utf8mb4",
	});

	if (req.session.admin) {
		// Send administrators to the admin panel instead of the settings
		res.redirect(302, "/admin");
	} else {
		sql.query(`SELECT email	FROM users WHERE (userid = '${userid}');`, function (err, result) {
			if (err) {
				console.log("Error in getting email from database for a user: " + err.stack);
				res.status(500); // Set status code to internal server error
				res.send();
			} else {
				const data = result[0];
				res.render("usersettings.ejs", data);
			}
		});
	}
}

module.exports = renderSettings;
