const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", function (req, res) {
	res.sendFile(path.join(__dirname, "../frontend/private/administration/admin.html"));
});
router.use("/styles/", express.static(path.join(__dirname, "../frontend/private/administration/StyleSheets/CSS")));
router.use("/scripts/", express.static(path.join(__dirname, "../frontend/private/administration/Scripts")));
router.use("/assets/", express.static(path.join(__dirname, "../frontend/private/administration/Assets")));

module.exports = router;
