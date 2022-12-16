import { insertForm } from "./insertForm.js";

export function hideForm() {
	document.getElementById("newnote").innerHTML = `<button id="addnote" label="addnote">+</button> Add Note`;
	document.getElementById("addnote").addEventListener("click", insertForm);
}
