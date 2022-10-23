import { clearnotepad } from "./clearnotepad.js";
import { completeNote } from "./completeNote.js";
import { uncompleteNote } from "./uncompleteNote.js";

export function add_notes() {
	let total_notes;
	const date = new Date();
	const today = date.toJSON().slice(0, 10);
	const expiring_soon = [];
	const regular = [];
	function insertNote(note, mark = false) {
		// Insert a note div then fill in the content. This is to prevent javascript injection into the webpage.
		// The risk here is low since injecting the webpage requires one to have stored a note as the user in the past. However, the solution is not difficult to implement.
		document.getElementById("notes").insertAdjacentHTML("afterbegin", `<div class="note" noteID="${note.noteid}"></div>`);
		const container = document.getElementsByClassName("note")[0];
		container.innerText = note.message;
		if (note.flag) {
			container.innerText = `${note.flag} - ${container.innerText}`;
		}
		if (mark) {
			container.innerText = `🕚 - ${container.innerText}`;
			container.title = "Expiring soon";
			container.classList.add("expiring");
		}
		if (note.completed) {
			container.classList.add("completed");
			container.classList.remove("expiring");
			container.addEventListener("click", uncompleteNote);
		} else {
			container.addEventListener("click", completeNote);
		}
	}
	function sortNote(note, index) {
		if (note.expiration_date) {
			if (note.expiration_date.slice(0, 10) === today) {
				expiring_soon.push(note);
			} else {
				regular.push(note);
			}
		} else {
			regular.push(note);
		}

		if (index + 1 === total_notes) {
			// Insert some padding between the notes and the new note form.
			document.getElementById("notes").insertAdjacentHTML("afterbegin", `<br /><br />`);
			regular.forEach(function (note) {
				insertNote(note);
			});
			expiring_soon.forEach(function (note) {
				insertNote(note, true);
			});
		}
	}
	if (this.readyState == 4 && this.status == 200) {
		const response = JSON.parse(this.responseText);
		if (response.status === "Success") {
			clearnotepad();
			const notes = response.notes.reverse();
			total_notes = notes.length;
			notes.forEach(sortNote);
		} else {
			alert("An error has occured. Please try again later.");
		}
	}
}
