const express = require("express");
const router = express.Router();
const setEmail = require("./setEmail");
const setPassword = require("./setPassword.js");

router.post("/email", setEmail);
router.post("/password", setPassword);

module.exports = router;
