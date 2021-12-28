const setupAdmin = require("./setupadmin");

function createTables(sql, database_name) {
	sql.query(`USE ${database_name}`, function (err) {
		if (err) throw err;
		console.log(`Creating tables in ${database_name}...`);
		sql.query(
			`CREATE TABLE users (
			userid INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
			administrator BOOLEAN NOT NULL,
			email nVARCHAR(255) NULL,
			username VARCHAR(255) NOT NULL,
			real_name VARCHAR(255) NULL,
			password VARCHAR(255) NOT NULL)`,
			function (err) {
				if (err) throw err;
			}
		);
		sql.query(
			`CREATE TABLE sessions (
			sessionid INT AUTO_INCREMENT PRIMARY KEY NOT NULL, 
			userid INT NOT NULL, 
			cookie VARCHAR(1000) NOT NULL, 
			access_date DATE NOT NULL,
			FOREIGN KEY (userid) REFERENCES users(userid))`,
			function (err) {
				if (err) throw err;
			}
		);
		sql.query(
			`CREATE TABLE tasks (
			noteid INT AUTO_INCREMENT PRIMARY KEY NOT NULL, 
			userid INT NOT NULL, 
			position INT NULL, 
			message VARCHAR(1000) NOT NULL, 
			completed BOOLEAN NOT NULL, 
			completed_date DATE NULL, 
			expiration_date DATE NULL, 
			flag CHAR(1) NULL,
			FOREIGN KEY (userid) REFERENCES users(userid))`,
			function (err) {
				if (err) throw err;
			}
		);
		console.log("Sucessfully created tables");
		setupAdmin(sql);
	});
}

module.exports = createTables;
