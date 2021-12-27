function createUser(sql, username, password, admin = false) {
	const bcrypt = require("bcrypt");
	let saltRounds;
	if (process.HASHSTRENGTH) {
		saltRounds = int(process.HASHSTRENGTH);
	} else {
		saltRounds = 12;
	}
	saltRounds = 2 ^ saltRounds
	bcrypt.genSalt(saltRounds, function (err, salt) {
		if (err) throw err;
		bcrypt.hash(password, salt, function (err, hash) {
			// Store hash in your password DB.
			console.log(hash)
			sql.query(`INSERT INTO users(administrator, username, password) VALUES (${admin}, "${username}", "${hash}")`);
		});
	});
}

module.exports = createUser;
