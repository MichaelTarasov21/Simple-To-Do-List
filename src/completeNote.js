const mysql = require("mysql");
const config = require("./config.js");

function completeNote(request, res, uncomplete = false) {
	let response = {
		status: "Error",
	};
	const noteID = parseInt(request.body.note);
	const userID = request.session.userid;

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
			return;
		}
	});
	if (!uncomplete) {
		//If function has not been passed uncomplete as true, mark the note as complete
		
		// Get today's date in a format appropriate for use in SQL
		const date = new Date();
		const today = mysql.escape(date.toJSON().slice(0, 10));

		sql.query(`UPDATE tasks SET completed = '1', completed_date = ${today} WHERE (noteid = '${noteID}' AND userid = '${userID}')`, function (err) {
			if (err) {
				console.log(err.stack);
				res.send(response);
				return;
			} else {
				response.status = "Success";
				res.send(response);
				return;
			}
		});
	} else {
		//If the function has been passed the argument to uncomplete the note instead, uncomplete the note
		sql.query(`UPDATE tasks SET completed = '0', completed_date = null WHERE (noteid = '${noteID}' AND userid = '${userID}')`, function (err) {
			if (err) {
				console.log(err.stack);
				res.send(response);
				return;
			} else {
				response.status = "Success";
				res.send(response);
				return;
			}
		});
	}
}

module.exports = completeNote;
