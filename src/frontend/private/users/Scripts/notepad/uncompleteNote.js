import { getnotes } from "./getnotes.js";

export function uncompleteNote(event) {
	const noteid = event.target.getAttribute("noteid");

	post("/users/notes", `method=uncompletenote&note=${parseInt(noteid)}`);
	getnotes();
}
