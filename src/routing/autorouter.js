function autoRoute(request, response, next) {
	if (request.session.userid) {
		response.redirect(302, "/notes");
	} else {
		response.redirect(302, "/login");
	}
	next();
}

module.exports = autoRoute;
