require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const sql = require("./connectdatabase.js");
const checkDatabse = require("./checkdatabase.js");
const login = require("./login.js");

let sqlDatabase = "To_Do_List";
if (process.env.DATABASE) {
	sqlDatabase = process.env.DATABASE;
}

sql.connect(function (err) {
	if (err) throw err;
	const tables = ["sessions", "tasks", "users"];
	checkDatabse(sql, sqlDatabase, tables);
});

let port = 8080;
if (process.env.PORT) {
	port = process.env.PORT;
}

app.use(express.static(path.join(__dirname, "public")));

app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}!`);
});
app.post("/login", login);
