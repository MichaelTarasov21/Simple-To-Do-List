import { reloadMessages } from "./reloadMessages.js";
import { stopErasing } from "./stopErasing.js";

export function deleteNote(event) {
	stopErasing();
	const noteid = event.target.getAttribute("noteid");

	const xhttp = new XMLHttpRequest();

	xhttp.open("POST", "/notes", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.onreadystatechange = reloadMessages;
	xhttp.send(`method=deletenote&note=${parseInt(noteid)}`);
}
