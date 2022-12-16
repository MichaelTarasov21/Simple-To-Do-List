import { completeNote } from "./completeNote.js";
import { deleteNote } from "./deleteNote.js";
import { erase } from "./erase.js";
import { uncompleteNote } from "./uncompleteNote.js";

export function stopErasing() {
	const eraser = document.getElementById("eraser");
	eraser.removeEventListener("click", stopErasing);
	eraser.addEventListener("click", erase);

	// Disable styles associated with deleting notes
	const deletionstyles = document.getElementById("deletion");
	deletionstyles.disabled = true;

	const notes = document.getElementsByClassName("note");
	for (let i = 0; i < notes.length; i++) {
		const element = notes[i];
		element.removeEventListener("click", deleteNote);
		if (element.classList.contains("completed")) {
			element.addEventListener("click", uncompleteNote);
		} else {
			element.addEventListener("click", completeNote);
		}
	}
}
