require("dotenv").config();
const express = require("express");
const path = require("path");
const internal = require("stream");
const app = express();
let port = 8080;
if (process.env.PORT) {
	const port = process.env.PORT;
}

app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
	console.log(`Example app listening on port ${port}!`);
});
