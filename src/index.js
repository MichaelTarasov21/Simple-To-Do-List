require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const sql = require("./connectdatabase.js");
const checkDatabse = require("./checkdatabase.js");

sql.connect(function (err) {
	if (err) throw err;
	console.log("SQL Connected!");
});

let port = 8080;
if (process.env.PORT) {
	port = process.env.PORT;
}

app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
	console.log(`Example app listening on port ${port}!`);
});
