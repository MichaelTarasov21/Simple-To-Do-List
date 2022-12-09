const express = require("express");
const router = express.Router();
const path = require("path");
const setEmail = require("./setEmail");
const setPassword = require("./setPassword.js");
const accountDeletion = require("./accountDeletion.js");

router.post("/email", setEmail);
router.post("/password", setPassword);
router.post("/delete", accountDeletion);
router.use("/styles", express.static(path.join(__dirname, "../frontend/private/users/StyleSheets/CSS")));
router.use("/scripts", express.static(path.join(__dirname, "../frontend/private/users/Scripts")));

module.exports = router;
