const express = require("express");
const router = express.Router();
const path = require("path");

router.use("/scripts", express.static(path.join(__dirname, "../frontend/public/Scripts")));
router.use("/styles", express.static(path.join(__dirname, "../frontend/public/StyleSheets/CSS")));
router.use("/assets", express.static(path.join(__dirname, "../frontend/public/Assets")));

module.exports = router;
