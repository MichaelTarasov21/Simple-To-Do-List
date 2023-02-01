import { stopErasing } from "./stopErasing.js";
import { getnotes } from "./getnotes.js";
import { post } from "./post.js";

export async function deleteNote(event) {
	stopErasing();
	const noteid = event.target.getAttribute("noteid");
	await post("/notes", `method=deletenote&note=${parseInt(noteid)}`);
	getnotes();
}
