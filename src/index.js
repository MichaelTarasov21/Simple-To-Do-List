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
const config = require("./config.js");
const logout = require("./logout.js");
const settings = require("./renderSettings.js");
const renewNotes = require("./renewnotes.js");
const autoRoute = require("./routing/autorouter.js");
const loginPage = require("./routing/login_page.js");
const userPage = require("./routing/user_page.js");
const adminPage = require("./routing/admin_page.js");
const renderLogin = require("./public/renderLogin.js");
const renderNotes = require("./users/renderNotes.js");
const login = require("./public/login.js");
const publicRoute = require("./public/router.js");
const userRoute = require("./users/router.js");
const adminRoute = require("./administration/adminRoutes.js");

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
	console.log(`Example app listening on port ${config.port} at ${config.bindAdress}!`);
});

app.use(favicon(path.join(__dirname, "frontend", "favicon.ico")));

app.get("/", autoRoute);

app.get("/logout", logout);

app.use("/login", loginPage);
app.get("/login", renderLogin);
app.post("/login", login);

app.use("/public", publicRoute);

app.use("/notes", userPage);
app.get("/notes", renderNotes);

app.use("/settings", userPage);
app.use("/settings", settings);

app.use("/users", userPage);
app.use("/users", userRoute);

app.use("/admin", adminPage);
app.use("/admin", adminRoute);

const job = schedule.scheduleJob("0 0 0 * * *", renewNotes);
renewNotes();
