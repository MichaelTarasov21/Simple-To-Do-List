import { getnotes } from "./getnotes.js";
import { post } from "./post.js";

export function uncompleteNote(event) {
	const noteid = event.target.getAttribute("noteid");

	post("/notes", `method=uncompletenote&note=${parseInt(noteid)}`);
	getnotes();
}
