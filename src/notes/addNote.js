const mysql = require("mysql");
const config = require("../config.js");
const GraphemeSplitter = require("./grapheme-splitter.js");

function addNote(request, res) {
	let response = {
		status: "Error",
	};
	const data = request.body;

	if (data.message === "") {
		// If the message is non existant abandon the task and report an error to the user
		res.send(response);
		return;
	}

	const userid = request.session.userid;
	let flag = "";
	if (data.flag !== "") {
		// Sanitize the flag field to leave only a single charachter
		const splitter = new GraphemeSplitter();
		const splitvalue = splitter.splitGraphemes(data.flag); // Create an array out of the charachters in the flag box.
		flag = splitvalue[0];
		flag = mysql.escape(flag);
	}

	const message = mysql.escape(data.message.substring(0, 1000)); // Crop messages that are longer than the maximum length

	let expires = data.expires;
	const today = new Date();
	if (expires !== "") {
		const expireyDate = new Date(expires);
		if (expireyDate.toString() === "Invalid Date") {
			// If the date is not a date abandon the task and report an error to the user
			res.send(response);
			return;
		}
		const expires_in = expireyDate - today;
		if (expires_in < 0) {
			// If the note has already expired abandon the task and report an error to the user
			res.send(response);
			return;
		}
		expires = mysql.escape(expireyDate.toJSON().slice(0, 10));
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
	const todaystring = mysql.escape(today.toJSON().slice(0, 10))
	if (flag === "" && expires === "") {
		// Neither flag nor expirey is set
		sql.query(`INSERT INTO tasks(userid, posted_date, message, completed) VALUES (${userid}, ${todaystring}, ${message}, 0)`, function (err) {
			if (err) {
				res.send(response);
			} else {
				success();
			}
		});
	} else if (flag === "") {
		// Flag is not set, expirey is
		sql.query(`INSERT INTO tasks(userid, posted_date, message, completed, expiration_date) VALUES (${userid}, ${todaystring}, ${message}, 0, ${expires})`, function (err) {
			if (err) {
				res.send(response);
			} else {
				success();
			}
		});
	} else if (expires === "") {
		// Expirey is not set, flag is
		sql.query(`INSERT INTO tasks(userid, posted_date, message, completed, flag) VALUES (${userid}, ${todaystring}, ${message}, 0, ${flag})`, function (err) {
			if (err) {
				res.send(response);
			} else {
				success();
			}
		});
	} else {
		//Both flag and expirey are set
		sql.query(`INSERT INTO tasks(userid, posted_date, message, completed, expiration_date, flag) VALUES (${userid}, ${todaystring}, ${message}, 0, ${expires}, ${flag})`, function (err) {
			if (err) {
				res.send(response);
			} else {
				success();
			}
		});
	}
	function success() {
		sql.end(function () {
			response.status = "Success";
			res.send(response);
		});
	}
}

module.exports = addNote;
