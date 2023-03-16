const mysql = require("mysql");
const config = require("./config.js");

function renewNotes() {
	const today = new Date();

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
			return;
		}
	});

	function renew(note) {
		let renewal = new Date(note.posted_date);
		switch (note.repeats) {
			case 1:
				// Daily
				renewal = today;
				break;
			case 2:
				// Weekly
				renewal.setDate(renewal.getDate() + 7);
				while (renewal - today < 0) {
					renewal.setDate(renewal.getDate() + 7);
				}
				break;
			case 3:
				// Monthly
				renewal.setMonth(renewal.getMonth() + 1);
				while (renewal - today < 0) {
					renewal.setMonth(renewal.getMonth() + 1);
				}
				break;
			case 4:
				// Yearly
				renewal.setFullYear(renewal.getFullYear() + 1);
				while (renewal - today < 0) {
					renewal.setFullYear(renewal.getFullYear() + 1);
				}
				break;
		}
		sql.query(`UPDATE tasks SET posted_date = ${mysql.escape(renewal.toJSON().slice(0, 10))}, completed = 0, completed_date = NULL WHERE (noteid = ${note.noteid})`, function (err) {
			if (err) {
				console.error("error in SQL Query: " + err.stack);
				return;
			}
		});
		if (note.expiration_date) {
			// Extend the expiration date for notes that expire
			const expires = new Date(note.expiration_date);
			const last_post_date = new Date(note.posted_date);
			expires.setMilliseconds(renewal - last_post_date);
			sql.query(`UPDATE tasks SET expiration_date = ${mysql.escape(expires.toJSON().slice(0, 10))} WHERE (noteid = ${note.noteid})`, function (err) {
				if (err) {
					console.error("error in SQL Query: " + err.stack);
					return;
				}
			});
		}
	}

	sql.query(`SELECT noteid, posted_date, expiration_date, repeats FROM tasks WHERE (completed = 1 AND repeats != 0 AND completed_date != ${mysql.escape(today.toJSON().slice(0, 10))})`, function (err, result) {
		if (err) {
			console.error("error in SQL Query: " + err.stack);
			return;
		}
		result.forEach(renew);
		sql.end();
	});
}

module.exports = renewNotes;
