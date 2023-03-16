import { getnotes } from "./getnotes.js";

export async function completeNote(event) {
	const noteid = event.target.getAttribute("noteid");

	await post("/users/notes", `method=completenote&note=${parseInt(noteid)}`);
	getnotes();
}
