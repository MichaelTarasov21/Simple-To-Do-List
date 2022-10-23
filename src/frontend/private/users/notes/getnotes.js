import { add_notes } from "./add_notes.js";

export function getnotes() {
	const xhttp = new XMLHttpRequest();

	xhttp.open("POST", "/notes", true); // Uses post to ensure a broswer sends the request and does not merely assume that it already has the results (code 304)
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.onreadystatechange = add_notes;
	xhttp.send(`method=getnotes`);
}
