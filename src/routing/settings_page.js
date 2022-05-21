function settingsPage(request, response, next) {
	if (request.session.admin) {
		// Redirect admins to the admin settings page
		// response.redirect(302, "/administration");
		next();
	} else if (request.session.userid) {
		// Allow users to access the default settings page
		next();
	} else {
		// Disallow access for unuathenticated connections
		response.redirect(302, "/");
	}
}

module.exports = settingsPage;
