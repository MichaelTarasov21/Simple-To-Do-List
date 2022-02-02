function hidePage(request, response, next) {
	if (request.session.userid) {
		next();
	} else {
		response.redirect(302, "/");
	}
}

module.exports = hidePage;
