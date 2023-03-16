const mysql = require("mysql");
const config = require("../../config.js");
const insertSQL = require("../../insertSQL.js");
const GraphemeSplitter = require("./grapheme-splitter.js");

function valueIsSet(str = String) {
	// Returns whether or not a setting is present
	return str !== "";
}

function addNote(request, res) {
	let values = [];
	let columns = [];

	const data = request.body;

	if (data.message === "") {
		// If the message is non existant abandon the task and report an error to the user
		res.status(400);
		res.send();
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

	let today = new Date();
	if (valueIsSet(data.repetitions)) {
		const repetitions = data.repetitions;
		if (repetitions < 0 || repetitions > 4) {
			// If an invalid set of repetitions is selected abandon the task and report an error to the user
			res.status(400);
			res.send();
			return;
		}

		values.push(repetitions);
		columns.push("repeats");

		if (valueIsSet(data.starting)) {
			today = new Date(data.starting);
			if (today.toString() === "Invalid Date") {
				// If the date is not a date abandon the task and report an error to the user
				res.status(400);
				res.send();
				return;
			}
		}
	}

	const todaystring = today.toJSON().slice(0, 10);
	values.push(todaystring);
	columns.push("posted_date");

	if (valueIsSet(data.expires)) {
		let expires = data.expires;
		const expireyDate = new Date(expires);
		if (expireyDate.toString() === "Invalid Date") {
			// If the date is not a date abandon the task and report an error to the user
			res.status(400);
			res.send();
			return;
		} else {
			const expires_in = expireyDate - today;
			if (expires_in <= -86400000) {
				// 86400000 is the amount of milliseconds in a day
				// If the note has already expired abandon the task and report an error to the user
				res.status(400);
				res.send();
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
			res.status(500);
			res.send();
			return;
		}
	});
	sql.query(insertSQL("tasks", columns, values), function (err) {
		if (err) {
			res.status(500);
			res.send();
			sql.end();
		} else {
			sql.end(function () {
				res.send();
			});
		}
	});
}

module.exports = addNote;
