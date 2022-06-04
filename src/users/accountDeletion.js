const checkPassword = require("../checkPassword.js");
const checkLastAdmin = require("../checkLastAdmin");
const deleteAccount = require("../deleteAccount.js");

function accountDeletion(req, res) {
	const userid = req.session.userid;
	const administrator = req.session.admin;
	const password = req.body.password;

	function internalError() {
		res.status(500);
		res.send();
	}

	function isLastAdmin() {
		res.status(418);
		res.send();
	}

	function proceedToPasswordCheck() {
		function proceedWithDeletion() {
			function userDeleted() {
				res.send();
			}

			deleteAccount(userid, userDeleted, internalError)
		}

		function invalidPassword() {
			res.status(400);
			res.send();
		}

		checkPassword(userid, password, proceedWithDeletion, invalidPassword, internalError);
	}

	if (administrator) {
		checkLastAdmin(proceedToPasswordCheck, isLastAdmin, internalError);
	} else {
		proceedToPasswordCheck();
	}
}

module.exports = accountDeletion;
