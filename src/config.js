require("dotenv").config();
let set_port = 8080;
if (process.env.PORT) {
	set_port = parseInt(process.env.PORT);
}
let set_bind_address = "127.0.0.1";
if (process.env.BINDADRESS) {
	set_bind_address = process.env.BINDADRESS;
}
let set_sqlhost = "127.0.0.1";
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
if (process.env.HASHSTRENGTH) {
	set_saltRounds = parseInt(process.env.HASHSTRENGTH);
}

let set_cookieSecret = "";
if (process.env.COOKIESECRET) {
	set_cookieSecret = process.env.COOKIESECRET;
}

let set_rateLimit_timer = 15 * 60 * 1000;
if (process.RATELIMITTIME) {
	set_rateLimit_timer = process.RATELIMITTIME * 1000;
}

let set_rateLimitCalls = 100;
if (process.RATELIMITCALLS) {
	set_rateLimitCalls = process.RATELIMITCALLS;
}

let set_ratelimitlogins = 20;
if (process.RATELIMITLOGINS) {
	set_ratelimitlogins = process.RATELIMITLOGINS;
}

const config = {
	bindAdress: set_bind_address,
	port: set_port,
	sqlhost: set_sqlhost,
	sqluser: set_sqluser,
	sqlpassword: set_sqlpassword,
	database_name: set_database,
	saltRounds: set_saltRounds,
	cookieSecret: set_cookieSecret,
	ratelimitimer: set_rateLimit_timer,
	ratelimitcalls: set_rateLimitCalls,
	ratelimitlogins: set_ratelimitlogins,
};

module.exports = config;
