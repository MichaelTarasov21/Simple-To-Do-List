const mysql = require("mysql")

let sqlhost = "localhost";
if (process.env.SQLHOST) {
	sqlhost = process.env.SQLHOST;
}
let sqluser = "username";
if (process.env.SQLUSER) {
	sqluser = process.env.SQLUSER;
}
let sqlpassword = "";
if (process.env.SQLPASSWORD) {
	sqlpassword = process.env.SQLPASSWORD;
}

const sql = mysql.createConnection({
	host: sqlhost,
	user: sqluser,
	password: sqlpassword,
});

module.exports = sql;
