function loginPage(request, response, next) {
	if (request.session.userid) {
		response.redirect(302, "/");
	} else {
		next();
	}
}

module.exports = loginPage;
