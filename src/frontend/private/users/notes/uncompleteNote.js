import { reloadMessages } from "./reloadMessages.js";

export function uncompleteNote(event) {
	const noteid = event.target.getAttribute("noteid");

	const xhttp = new XMLHttpRequest();

	xhttp.open("POST", "/notes", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.onreadystatechange = reloadMessages;
	xhttp.send(`method=uncompletenote&note=${parseInt(noteid)}`);
}
