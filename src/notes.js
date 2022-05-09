sendNotes = require("./sendnotes.js");
addNote = require("./addNote.js");
completeNote = require("./completeNote.js");
deleteNote = require("./deleteNote");

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
		case "completenote":
			completeNote(request, res);
			break;
		case "uncompletenote":
			completeNote(request, res, true);
			break;
		case "deletenote":
			deleteNote(request, res);
			break;
		default:
			let response = {
				status: "Error",
			};
			res.send(response);
	}
}

module.exports = notes;
