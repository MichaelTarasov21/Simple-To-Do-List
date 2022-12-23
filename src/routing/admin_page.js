function adminPage(request, response, next) {
	if (request.session.admin) {
		next();
	} else {
        // Redirect non admins to user settings
		response.redirect(302, "/settings");
	}
}

module.exports = adminPage;