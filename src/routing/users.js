const express = require("express");
const router = express.Router();
const path = require("path");
const notes = require("../users/notes/notes.js");
const setEmail = require("../users/setEmail.js");
const setPassword = require("../users/setPassword.js");
const accountDeletion = require("../users/accountDeletion.js");
const ratelimits = require("./ratelimits.js");

router.use("/scripts", express.static(path.join(__dirname, "../frontend/private/users/Scripts")));
router.use("/styles", express.static(path.join(__dirname, "../frontend/private/users/StyleSheets/CSS")));
router.use("/assets", express.static(path.join(__dirname, "../frontend/private/users/Assets")));
router.use("/", ratelimits.general);
router.post("/email", setEmail);
router.post("/password", setPassword);
router.post("/delete", accountDeletion);
router.post("/notes", notes);

module.exports = router;
