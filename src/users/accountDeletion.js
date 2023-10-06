const checkPassword = require("../checkPassword.js");
const deleteAccount = require("../deleteAccount.js");

function accountDeletion(req, res) {
	const userid = req.session.userid;
	const password = req.body.password;

	function internalError() {
		res.status(500);
		res.send();
	}

	function proceedWithDeletion() {
		function userDeleted() {
			res.send();
		}

		deleteAccount(userid, userDeleted, internalError);
	}

	function invalidPassword() {
		res.status(400);
		res.send();
	}

	checkPassword(userid, password, proceedWithDeletion, invalidPassword, internalError);
}

module.exports = accountDeletion;
