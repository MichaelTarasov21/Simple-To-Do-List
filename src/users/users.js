const express = require("express");
const router = express.Router();
const setEmail = require("./setEmail");
const setPassword = require("./setPassword.js");
const accountDeletion = require("./accountDeletion.js");

router.post("/email", setEmail);
router.post("/password", setPassword);
router.post("/delete", accountDeletion);

module.exports = router;
