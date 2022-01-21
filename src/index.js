require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const sql = require("./connectdatabase.js");
const config = require("./config.js");
const checkDatabse = require("./checkdatabase.js");
const login = require("./login.js");
const sendnotes = require("./sendnotes.js");

sql.connect(function (err) {
	if (err) throw err;
	const tables = ["sessions", "tasks", "users"];
	checkDatabse(tables);
});

app.use(express.static(path.join(__dirname, "public")));

app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(cookieParser());

app.listen(config.port, () => {
	console.log(`Example app listening on port ${config.port}!`);
});

app.post("/login", login);
app.post("/notes", sendnotes); // Uses post to ensure a broswer sends the request and does not merely assume that it already has the results (code 304)
