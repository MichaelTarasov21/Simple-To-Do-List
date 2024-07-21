const express = require("express");
const app = express();
const helmet = require("helmet");
const bodyParser = require("body-parser");
const path = require("path");
const favicon = require("serve-favicon");
const session = require("express-session");
const lusca = require("lusca");
const ejs = require("ejs");
const schedule = require("node-schedule");
const MySQLStore = require("express-mysql-session")(session);
const process = require("process");
const config = require("./config.js");
const emergencyreset = require("./emergencyresetpassword.js");
const renewNotes = require("./renewnotes.js");
const approutes = require("./routing/routemanager.js");

if (process.argv[2] == "passwordreset") {
	emergencyreset();
	return;
}
console.log("here");
const sessionStoreOptions = {
	host: config.sqlhost,
	user: config.sqluser,
	password: config.sqlpassword,
	database: config.database_name,
	createDatabaseTable: true,
	schema: {
		tableName: "sessions",
	},
};

const sessionStore = new MySQLStore(sessionStoreOptions);

app.use(helmet({ contentSecurityPolicy: false })); //Recommended server hardening

app.use(
	session({
		secret: config.cookieSecret,
		name: "sessionID",
		store: sessionStore,
		resave: false,
		saveUninitialized: false,
		rolling: true,
		unset: "destroy",
		cookie: {
			maxAge: 1000 * 60 * 60,
			sameSite: "strict",
			name: "sessionId",
		},
	})
);

app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

app.use(
	lusca({
		csrf: true,
		xframe: "SAMEORIGIN",
		p3p: "ABCDEF",
		hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
		xssProtection: true,
		nosniff: true,
		referrerPolicy: "same-origin",
	})
);

app.set("view engine", ejs);

app.listen(config.port, config.bindAdress, () => {
	console.log(`To-Do List listening on port ${config.port} at ${config.bindAdress}!`);
});

app.use(favicon(path.join(__dirname, "frontend", "favicon.ico")));
approutes(app);

const job = schedule.scheduleJob("0 0 0 * * *", renewNotes);
renewNotes();
