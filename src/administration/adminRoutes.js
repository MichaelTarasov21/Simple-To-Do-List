const express = require("express");
const router = express.Router();
const path = require("path");

router.use('/', express.static(path.join(__dirname, "../frontend/private/administration")))
router.use('/styles/', express.static(path.join(__dirname, "../frontend/private/administration/StyleSheets/CSS")))
router.use('/scripts/', express.static(path.join(__dirname, "../frontend/private/administration/Scripts")))


module.exports = router;