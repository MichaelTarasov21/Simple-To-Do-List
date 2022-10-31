const mysql = require("mysql");
const config = require("../config.js");
const insertSQL = require("../insertSQL.js");
const GraphemeSplitter = require("./grapheme-splitter.js");

function valueIsSet(str = String) {
	// Returns whether or not a setting is present
	return str !== "";
}

function addNote(request, res) {
	let values = [];
	let columns = [];

	let response = {
		status: "Error",
	};
	const data = request.body;

	if (data.message === "") {
		// If the message is non existant abandon the task and report an error to the user
		res.send(response);
		return;
	}
	const message = data.message.substring(0, 1000); // Crop messages that are longer than the maximum length
	values.push(message);
	columns.push("message");

	const userid = request.session.userid;
	values.push(userid);
	columns.push("userid");

	if (valueIsSet(data.flag)) {
		// Sanitize the flag field to leave only a single charachter
		const splitter = new GraphemeSplitter();
		const splitvalue = splitter.splitGraphemes(data.flag); // Create an array out of the charachters in the flag box.
		let flag = splitvalue[0];
		values.push(flag);
		columns.push("flag");
	}

	if (valueIsSet(data.expires)) {
		let expires = data.expires;
		const today = new Date();
		const expireyDate = new Date(expires);
		if (expireyDate.toString() === "Invalid Date") {
			// If the date is not a date abandon the task and report an error to the user
			res.send(response);
			return;
		} else {
			const expires_in = expireyDate - today;
			if (expires_in < 0) {
				// If the note has already expired abandon the task and report an error to the user
				res.send(response);
				return;
			}
			values.push(expireyDate.toJSON().slice(0, 10));
			columns.push("expiration_date");
		}
	}

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
	const today = new Date();
	const todaystring = today.toJSON().slice(0, 10);
	values.push(todaystring);
	columns.push("posted_date");
	sql.query(insertSQL("tasks", columns, values), function (err) {
		if (err) {
			res.send(response);
			sql.end();
		} else {
			success();
		}
	});

	function success() {
		sql.end(function () {
			response.status = "Success";
			res.send(response);
		});
	}
}

module.exports = addNote;
