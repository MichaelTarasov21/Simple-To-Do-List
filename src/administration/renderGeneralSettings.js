const config = require("../config.js");

function generalsettings(req, res) {
	res.render("generalsettings.ejs", config);
}

module.exports = generalsettings;
