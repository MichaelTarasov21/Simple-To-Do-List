const express = require("express");
const router = express.Router();
const getEmail = require("./getEmail");
const setEmail = require("./setEmail");
const setPassword = require("./setPassword.js");
const accountDeletion = require("./accountDeletion.js");

router.post("/email", setEmail);
router.get("/email", getEmail);
router.post("/password", setPassword);
router.post("/delete", accountDeletion);

module.exports = router;
