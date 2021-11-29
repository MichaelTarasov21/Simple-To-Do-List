require('dotenv').config()
const express = require("express");
const path = require('path');
const app = express();
const port = process.env.DEV_PORT;

app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
	console.log(`Example app listening on port ${port}!`);
});
