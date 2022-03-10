sendNotes = require("./sendnotes.js");
addNote = require("./addNote.js");
function notes(requset, res) {
	// A handler that determines what method is being called and hands off the request to the necessary function.
	const method = requset.body.method;
	switch (method) {
		case "getnotes":
			sendNotes(requset, res);
			break;
		case "addnote":
			addNote(requset, res);
			break;
		default:
			let response = {
				status: "Error",
			};
			res.send(response);
	}
}

module.exports = notes;
