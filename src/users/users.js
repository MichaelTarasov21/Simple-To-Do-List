const express = require("express");
const router = express.Router();
const setEmail = require("./setEmail");

router.post("/email", setEmail);

module.exports = router;
