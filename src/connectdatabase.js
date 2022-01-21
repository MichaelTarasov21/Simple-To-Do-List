const mysql = require("mysql");
const config = require("./config.js");

const sql = mysql.createConnection({
	host: config.sqlhost,
	user: config.sqluser,
	password: config.sqlpassword,
});

module.exports = sql;
