const rateLimit = require("express-rate-limit");
const config = require("../config.js");

const loginratelimit = rateLimit({
	windowMs: config.ratelimitimer,
	max: config.ratelimitlogins,
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const generalratelimit = rateLimit({
	windowMs: config.ratelimitimer,
	max: config.ratelimitcalls,
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = { login: loginratelimit, general: generalratelimit };
