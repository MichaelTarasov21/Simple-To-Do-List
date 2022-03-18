const { exit } = require("process");
const createUser = require("./createuser.js");
const rl = require("./readline");

function setupAdmin() {
	rl.question("Would you like to create an admin account now? (Y/n) ", function (customise) {
		console.log(customise);
		if (customise.toLowerCase() === "n" || customise.toLowerCase() === "no") {
			console.log("Creating an administrator account with username administrator and password ChangeMe!");
			console.log("Log in to the web interface to change these");
			createUser(
				"administrator",
				"ChangeMe!",
				function () {
					exit(0);
				},
				true
			);
		} else if (customise === "" || customise.toLowerCase() === "y" || customise.toLowerCase() === "yes") {
			function getUsername() {
				rl.question("Username: ", function (username) {
					if (username === "") {
						console.log("Username can not be blank");
						getUsername();
					} else {
						function getPassword() {
							rl.question("Password: ", function (password) {
								if (password === "") {
									console.log("Password can not be blank");
									getPassword();
								} else {
									createUser(
										username,
										password,
										function () {
											exit(0);
										},
										true
									);
								}
							});
						}
						getPassword();
					}
				});
			}
			getUsername();
		} else {
			console.log("Invalid input");
			setupAdmin();
		}
	});
}

module.exports = setupAdmin;
