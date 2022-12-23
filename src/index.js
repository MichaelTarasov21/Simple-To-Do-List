const express = require("express");
const app = express();
const helmet = require("helmet");
const bodyParser = require("body-parser");
const path = require("path");
const favicon = require("serve-favicon");
const session = require("express-session");
const ejs = require("ejs");
const schedule = require("node-schedule");
const MySQLStore = require("express-mysql-session")(session);
const config = require("./config.js");
const login = require("./login.js");
const logout = require("./logout.js");
const notes = require("./notes/notes.js");
const settings = require("./renderSettings.js");
const renewNotes = require("./notes/renewnotes.js");
const autoRoute = require("./routing/autorouter.js");
const loginPage = require("./routing/login_page.js");
const userPage = require("./routing/user_page.js");
const userRoute = require("./users/users.js");

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

app.set("view engine", ejs);

app.listen(config.port, config.bindAdress, () => {
	console.log(`Example app listening on port ${config.port} at ${config.bindAdress}!`);
});

app.use(favicon(path.join(__dirname, "frontend", "favicon.ico")));

app.get("/", autoRoute);

app.get("/logout", logout);

app.use("/login", loginPage);
app.use("/login", express.static(path.join(__dirname, "frontend/public")));

app.use("/notes", userPage);
app.use("/notes", express.static(path.join(__dirname, "frontend/private/users/notes")));

app.use("/settings", userPage);
app.use("/settings", settings);

app.use("/users", userPage);
app.use("/users", userRoute);

app.post("/login", login);
app.post("/notes", notes);

const job = schedule.scheduleJob("0 0 0 * * *", renewNotes);
