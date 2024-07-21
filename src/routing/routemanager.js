const autoRoute = require("./autorouter.js");
const logout = require("../logout.js");
const settings = require("../renderSettings.js");
const loginPage = require("./login_page.js");
const userPage = require("./user_page.js");
const renderLogin = require("../public/renderLogin.js");
const renderNotes = require("../users/renderNotes.js");
const login = require("../public/login.js");
const publicRoute = require("../public/router.js");
const userRoute = require("./users.js");
const ratelimits = require("./ratelimits.js");

function mainrouter(app) {
	app.get("/", autoRoute);

	app.get("/logout", logout);

	app.use("/login", loginPage);
	app.get("/login", renderLogin);
	app.use("/login", ratelimits.login);
	app.post("/login", login);

	app.use("/public", publicRoute);

	app.use("/notes", ratelimits.general);
	app.use("/notes", userPage);
	app.get("/notes", renderNotes);

	app.use("/settings", userPage);
	app.use("/settings", ratelimits.general);
	app.use("/settings", settings);

	app.use("/users", userPage);
	app.use("/users", userRoute);
}

module.exports = mainrouter;
