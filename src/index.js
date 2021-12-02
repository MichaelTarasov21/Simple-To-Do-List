require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const mssql = require("mssql");

let port = 8080;
if (process.env.PORT) {
	port = process.env.PORT;
}

app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
	console.log(`Example app listening on port ${port}!`);
});
