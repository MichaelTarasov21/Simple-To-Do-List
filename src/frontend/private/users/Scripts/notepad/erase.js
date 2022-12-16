import { completeNote } from "./completeNote.js";
import { deleteNote } from "./deleteNote.js";
import { uncompleteNote } from "./uncompleteNote.js";
import { stopErasing } from "./stopErasing.js";

export function erase() {
	const eraser = document.getElementById("eraser");
	eraser.removeEventListener("click", erase);
	eraser.addEventListener("click", stopErasing);

	// Enable styles associated with deleting notes
	const deletionstyles = document.getElementById("deletion");
	deletionstyles.disabled = false;

	const notes = document.getElementsByClassName("note");
	for (let i = 0; i < notes.length; i++) {
		const element = notes[i];
		if (element.classList.contains("completed")) {
			element.removeEventListener("click", uncompleteNote);
		} else {
			element.removeEventListener("click", completeNote);
		}
		element.addEventListener("click", deleteNote);
	}
}
