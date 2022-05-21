function logout(req, res) {
	req.session.destroy(function (err) {
		if (err) {
			console.log("Error in logout:" + err.stack);
			res.status(500); // Set status code to internal server error
		}
		res.send();
	});
}

module.exports = logout;
