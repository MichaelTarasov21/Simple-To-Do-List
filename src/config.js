let set_port = 8080;
if (process.env.PORT) {
	set_port = parseInt(process.env.PORT);
}
let set_sqlhost = "localhost";
if (process.env.SQLHOST) {
	set_sqlhost = process.env.SQLHOST;
}
let set_database = "To_Do_List";
if (process.env.DATABASE) {
	set_database = process.env.DATABASE;
}
let set_sqluser = "username";
if (process.env.SQLUSER) {
	set_sqluser = process.env.SQLUSER;
}
let set_sqlpassword = "";
if (process.env.SQLPASSWORD) {
	set_sqlpassword = process.env.SQLPASSWORD;
}
let set_saltRounds = 12;
if (process.HASHSTRENGTH) {
	set_saltRounds = parseInt(process.HASHSTRENGTH);
}

const config = {
	port: set_port,
	sqlhost: set_sqlhost,
	sqluser: set_sqluser,
	sqlpassword: set_sqlpassword,
	database_name: set_database,
	saltRounds: set_saltRounds,
};

module.exports = config;
