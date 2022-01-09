function generateCookie(length = 1000) {
	const crypto = require("crypto");

	let cookie = crypto.randomBytes(1000).toString("hex").slice(0, length);

	return cookie;
}

module.exports = generateCookie;
