import { getnotes } from "./getnotes.js";
import { post } from "./post.js";

export async function completeNote(event) {
	const noteid = event.target.getAttribute("noteid");

	await post("/notes", `method=completenote&note=${parseInt(noteid)}`);
	getnotes();
}
