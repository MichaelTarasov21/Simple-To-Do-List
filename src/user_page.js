function userPage(request, response, next) {
	if (request.session.userid) {
		next();
	} else {
		response.redirect(302, "/login");
	}
}

module.exports = userPage;
