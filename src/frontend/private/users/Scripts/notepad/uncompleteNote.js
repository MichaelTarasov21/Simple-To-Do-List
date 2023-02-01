import { getnotes } from "./getnotes.js";

export function uncompleteNote(event) {
	const noteid = event.target.getAttribute("noteid");

	post("/notes", `method=uncompletenote&note=${parseInt(noteid)}`);
	getnotes();
}
