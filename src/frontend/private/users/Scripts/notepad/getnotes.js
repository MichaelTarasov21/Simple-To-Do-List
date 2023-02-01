import { insertNotes } from "./insertNotes.js";
import { post } from "./post.js";

export async function getnotes() {
	let data = await post("/notes", `method=getnotes`);
	insertNotes(data);
}
