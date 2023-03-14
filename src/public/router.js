const express = require("express");
const router = express.Router();
const path = require("path");

const renderLogin = require("./renderLogin.js");
const login = require("./login.js");

router.use('/scripts', express.static(path.join(__dirname, "../frontend/public/Scripts")))
router.use('/styles', express.static(path.join(__dirname, "../frontend/public/StyleSheets/CSS")))
router.use('/assets', express.static(path.join(__dirname, "../frontend/public/Assets")))
router.post('/', login)
router.get('/', renderLogin)

module.exports = router;