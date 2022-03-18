sendNotes = require("./sendnotes.js");
addNote = require("./addNote.js");
function notes(request, res) {
	// A handler that determines what method is being called and hands off the request to the necessary function.
	const method = request.body.method;
	switch (method) {
		case "getnotes":
			sendNotes(request, res);
			break;
		case "addnote":
			addNote(request, res);
			break;
		default:
			let response = {
				status: "Error",
			};
			res.send(response);
	}
}

module.exports = notes;
