const express = require("express");
const router = express.Router();
const path = require("path");
const ratelimits = require("./ratelimits.js");

const generalsettings = require("../administration/renderGeneralSettings.js");

router.use("/styles/", express.static(path.join(__dirname, "../frontend/private/administration/StyleSheets/CSS")));
router.use("/scripts/", express.static(path.join(__dirname, "../frontend/private/administration/Scripts")));
router.use("/assets/", express.static(path.join(__dirname, "../frontend/private/administration/Assets")));
router.use("/", ratelimits.general);
router.get("/", function (req, res) {
	res.sendFile(path.join(__dirname, "../frontend/private/administration/admin.html"));
});

router.get("/general", generalsettings);

module.exports = router;
